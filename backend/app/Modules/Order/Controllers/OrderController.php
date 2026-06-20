<?php

namespace App\Modules\Order\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Order\Requests\CheckoutRequest;
use App\Modules\Order\Services\OrderService;
use Illuminate\Http\JsonResponse;

class OrderController extends Controller
{
    public function __construct(private OrderService $orderService) {}

    public function checkout(CheckoutRequest $request): JsonResponse
    {
        $order = $this->orderService->checkout(
            user:         auth('api')->user(),
            shippingData: $request->validated(),
        );

        return response()->json([
            'message' => 'Order created successfully.',
            'data'    => $this->formatOrder($order),
        ], 201);
    }

    public function index(): JsonResponse
    {
        $orders = $this->orderService->getUserOrders(auth('api')->user());

        return response()->json([
            'data' => $orders->map(fn($o) => $this->formatOrderSummary($o)),
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $order = $this->orderService->getUserOrder(auth('api')->user(), $id);

        return response()->json(['data' => $this->formatOrder($order)]);
    }

    private function formatOrder($order): array
    {
        return [
            'id'              => $order->id,
            'order_number'    => $order->order_number,
            'status'          => $order->status,
            'total_amount'    => $order->total_amount,
            'recipient_name'  => $order->recipient_name,
            'street_address'  => $order->street_address,
            'city'            => $order->city,
            'postal_code'     => $order->postal_code,
            'tracking_number' => $order->tracking_number,
            'items'           => $order->items->map(fn($item) => [
                'id'         => $item->id,
                'card_id'    => $item->card_id,
                'card_name'  => $item->card_name,
                'unit_price' => $item->unit_price,
                'quantity'   => $item->quantity,
                'subtotal'   => $item->subtotal,
            ]),
            'created_at'      => $order->created_at,
        ];
    }

    private function formatOrderSummary($order): array
    {
        return [
            'id'           => $order->id,
            'order_number' => $order->order_number,
            'status'       => $order->status,
            'total_amount' => $order->total_amount,
            'items_count'  => $order->items->count(),
            'items'        => $order->items->map(fn($item) => [
                'card_name'  => $item->card_name,
                'quantity'   => $item->quantity,
                'unit_price' => $item->unit_price,
            ]),
            'created_at'   => $order->created_at,
        ];
    }
}
