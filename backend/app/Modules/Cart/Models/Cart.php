<?php

namespace App\Modules\Cart\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    protected $fillable = ['user_id'];

    public function items()
    {
        return $this->hasMany(CartItem::class, 'cart_id');
    }

    public function getTotalAttribute(): float
    {
        return $this->items->sum(fn($item) => $item->card->price * $item->quantity);
    }
}
