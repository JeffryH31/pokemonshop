<?php

namespace App\Modules\Order\Services;

use App\Modules\Cart\Models\Cart;
use App\Modules\Cart\Services\CartService;
use App\Modules\Catalog\Models\Card;
use App\Modules\Order\Models\Order;
use App\Modules\Order\Models\OrderItem;
use App\Modules\User\Models\User;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderService
{
    public function __construct(private CartService $cartService) {}

    public function checkout(User $user, array $shippingData): Order
    {
        $cart = Cart::where('user_id', $user->id)->with('items.card')->first();

        if (!$cart || $cart->items->isEmpty()) {
            throw new HttpResponseException(response()->json([
                'message' => 'Cart is empty.',
            ], 422));
        }

        return DB::transaction(function () use ($user, $cart, $shippingData) {
            // Validate stock for all items
            $insufficientItems = [];
            foreach ($cart->items as $item) {
                if ($item->card->stock < $item->quantity) {
                    $insufficientItems[] = [
                        'card'           => $item->card->name,
                        'requested'      => $item->quantity,
                        'available_stock' => $item->card->stock,
                    ];
                }
            }

            if (!empty($insufficientItems)) {
                throw new HttpResponseException(response()->json([
                    'message' => 'Insufficient stock for some items.',
                    'errors'  => ['items' => $insufficientItems],
                ], 422));
            }

            // Calculate total
            $total = $cart->items->sum(fn($item) => $item->card->price * $item->quantity);

            // Create order
            $order = Order::create([
                'user_id'         => $user->id,
                'order_number'    => 'ORD-' . strtoupper(Str::random(10)),
                'status'          => Order::STATUS_PENDING_PAYMENT,
                'total_amount'    => $total,
                'recipient_name'  => $shippingData['recipient_name'],
                'street_address'  => $shippingData['street_address'],
                'city'            => $shippingData['city'],
                'postal_code'     => $shippingData['postal_code'],
                'status_updated_at' => now(),
            ]);

            // Create order items with price snapshot & reduce stock
            foreach ($cart->items as $item) {
                OrderItem::create([
                    'order_id'   => $order->id,
                    'card_id'    => $item->card_id,
                    'card_name'  => $item->card->name,
                    'unit_price' => $item->card->price,
                    'quantity'   => $item->quantity,
                    'subtotal'   => $item->card->price * $item->quantity,
                ]);

                // Reduce stock atomically
                Card::where('id', $item->card_id)->decrement('stock', $item->quantity);

                // Log stock change
                $this->logStock(
                    cardId: $item->card_id,
                    before: $item->card->stock,
                    after:  $item->card->stock - $item->quantity,
                    reason: 'order_placed',
                    orderId: $order->id,
                );
            }

            // Clear cart
            $this->cartService->clearCart($cart);

            return $order->load('items');
        });
    }

    public function getUserOrders(User $user)
    {
        return Order::where('user_id', $user->id)
            ->with('items')
            ->latest()
            ->get();
    }

    public function getUserOrder(User $user, int $orderId): Order
    {
        $order = Order::with('items.card')->findOrFail($orderId);

        if ($order->user_id !== $user->id) {
            throw new HttpResponseException(response()->json([
                'message' => 'Forbidden.',
            ], 403));
        }

        return $order;
    }

    public function updateStatus(Order $order, string $newStatus, ?string $trackingNumber = null): Order
    {
        if (!$order->canTransitionTo($newStatus)) {
            $validTransitions = Order::VALID_TRANSITIONS[$order->status];
            throw new HttpResponseException(response()->json([
                'message' => 'Invalid status transition.',
                'errors'  => ['status' => [
                    "Cannot transition from '{$order->status}' to '{$newStatus}'. Valid transitions: " . implode(', ', $validTransitions),
                ]],
            ], 422));
        }

        $updateData = [
            'status'            => $newStatus,
            'status_updated_at' => now(),
        ];

        if ($newStatus === Order::STATUS_SHIPPED) {
            $updateData['tracking_number'] = $trackingNumber;
        }

        $order->update($updateData);

        // Restore stock if cancelled
        if ($newStatus === Order::STATUS_CANCELLED) {
            $this->restoreStock($order, 'order_cancelled');
        }

        return $order->fresh('items');
    }

    public function restoreStock(Order $order, string $reason): void
    {
        foreach ($order->items as $item) {
            Card::where('id', $item->card_id)->increment('stock', $item->quantity);

            $card = Card::find($item->card_id);
            $this->logStock(
                cardId:  $item->card_id,
                before:  $card->stock - $item->quantity,
                after:   $card->stock,
                reason:  $reason,
                orderId: $order->id,
            );
        }
    }

    private function logStock(int $cardId, int $before, int $after, string $reason, ?int $orderId = null, ?int $adminId = null): void
    {
        DB::table('stock_logs')->insert([
            'card_id'         => $cardId,
            'admin_id'        => $adminId,
            'quantity_before' => $before,
            'quantity_after'  => $after,
            'change'          => $after - $before,
            'reason'          => $reason,
            'order_id'        => $orderId,
            'created_at'      => now(),
        ]);
    }
}
