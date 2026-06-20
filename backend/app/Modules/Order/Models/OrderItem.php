<?php

namespace App\Modules\Order\Models;

use App\Modules\Catalog\Models\Card;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'card_id',
        'card_name',
        'unit_price',
        'quantity',
        'subtotal',
    ];

    protected function casts(): array
    {
        return [
            'unit_price' => 'decimal:2',
            'subtotal'   => 'decimal:2',
            'quantity'   => 'integer',
        ];
    }

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    public function card()
    {
        return $this->belongsTo(Card::class, 'card_id');
    }
}
