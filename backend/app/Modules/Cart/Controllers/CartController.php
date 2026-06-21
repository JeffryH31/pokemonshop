<?php

namespace App\Modules\Cart\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\HttpResponse;
use App\Modules\Cart\Requests\AddCartItemRequest;
use App\Modules\Cart\Requests\UpdateCartItemRequest;
use App\Modules\Cart\Services\CartService;
use Illuminate\Http\JsonResponse;

class CartController extends Controller
{
    use HttpResponse;

    public function __construct(private CartService $cartService) {}

    public function index(): JsonResponse
    {
        $cart = $this->cartService->getCart(auth('api')->user());

        return $this->success($this->formatCart($cart));
    }

    public function addItem(AddCartItemRequest $request): JsonResponse
    {
        $cart = $this->cartService->addItem(
            user:     auth('api')->user(),
            cardId:   $request->input('card_id'),
            quantity: $request->input('quantity'),
        );

        return $this->success($this->formatCart($cart), 'Item added.', 201);
    }

    public function updateItem(UpdateCartItemRequest $request, int $cardId): JsonResponse
    {
        $cart = $this->cartService->updateItem(
            user:     auth('api')->user(),
            cardId:   $cardId,
            quantity: $request->input('quantity'),
        );

        return $this->success($this->formatCart($cart), 'Cart updated.');
    }

    public function removeItem(int $cardId): JsonResponse
    {
        $cart = $this->cartService->removeItem(auth('api')->user(), $cardId);

        return $this->success($this->formatCart($cart), 'Item removed.');
    }

    private function formatCart($cart): array
    {
        $items = $cart->items->map(fn($item) => [
            'id'       => $item->id,
            'card_id'  => $item->card_id,
            'card'     => [
                'id'        => $item->card->id,
                'name'      => $item->card->name,
                'price'     => $item->card->price,
                'stock'     => $item->card->stock,
                'rarity'    => $item->card->rarity,
                'condition' => $item->card->condition,
                'image_url' => $item->card->image_url,
            ],
            'quantity' => $item->quantity,
            'subtotal' => round($item->card->price * $item->quantity, 2),
        ]);

        return [
            'id'    => $cart->id,
            'items' => $items,
            'total' => round($items->sum('subtotal'), 2),
        ];
    }
}
