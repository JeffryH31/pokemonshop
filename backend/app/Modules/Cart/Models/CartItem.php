<?php

namespace App\Modules\Cart\Models;

use App\Modules\Catalog\Models\Card;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    protected $fillable = [
        'cart_id',
        'card_id',
        'quantity',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
        ];
    }

    public function cart()
    {
        return $this->belongsTo(Cart::class, 'cart_id');
    }

    public function card()
    {
        return $this->belongsTo(Card::class, 'card_id');
    }

    public function getSubtotalAttribute(): float
    {
        return $this->card->price * $this->quantity;
    }
}
