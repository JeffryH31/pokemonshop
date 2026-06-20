<?php

namespace App\Modules\Cart\Services;

use App\Modules\Cart\Models\Cart;
use App\Modules\Cart\Models\CartItem;
use App\Modules\Catalog\Models\Card;
use App\Modules\User\Models\User;
use Illuminate\Http\Exceptions\HttpResponseException;

class CartService
{
    public function getOrCreateCart(User $user): Cart
    {
        return Cart::firstOrCreate(['user_id' => $user->id]);
    }

    public function getCart(User $user): Cart
    {
        $cart = $this->getOrCreateCart($user);
        return $cart->load('items.card.set');
    }

    public function addItem(User $user, int $cardId, int $quantity): Cart
    {
        $card = Card::active()->findOrFail($cardId);
        $cart = $this->getOrCreateCart($user);

        $existingItem = CartItem::where('cart_id', $cart->id)
            ->where('card_id', $cardId)
            ->first();

        $newQuantity = $existingItem ? $existingItem->quantity + $quantity : $quantity;

        if ($newQuantity > $card->stock) {
            $this->throwStockError($card->stock);
        }

        if ($existingItem) {
            $existingItem->update(['quantity' => $newQuantity]);
        } else {
            CartItem::create([
                'cart_id'  => $cart->id,
                'card_id'  => $cardId,
                'quantity' => $quantity,
            ]);
        }

        return $cart->load('items.card.set');
    }

    public function updateItem(User $user, int $cardId, int $quantity): Cart
    {
        $cart = $this->getOrCreateCart($user);
        $item = CartItem::where('cart_id', $cart->id)
            ->where('card_id', $cardId)
            ->firstOrFail();

        if ($quantity === 0) {
            $item->delete();
        } else {
            $card = Card::active()->findOrFail($cardId);

            if ($quantity > $card->stock) {
                $this->throwStockError($card->stock);
            }

            $item->update(['quantity' => $quantity]);
        }

        return $cart->load('items.card.set');
    }

    public function removeItem(User $user, int $cardId): Cart
    {
        $cart = $this->getOrCreateCart($user);

        CartItem::where('cart_id', $cart->id)
            ->where('card_id', $cardId)
            ->delete();

        return $cart->load('items.card.set');
    }

    public function clearCart(Cart $cart): void
    {
        $cart->items()->delete();
    }

    private function throwStockError(int $availableStock): never
    {
        throw new HttpResponseException(response()->json([
            'message' => 'Quantity exceeds available stock.',
            'errors'  => ['quantity' => ["Available stock: {$availableStock}"]],
        ], 422));
    }
}
