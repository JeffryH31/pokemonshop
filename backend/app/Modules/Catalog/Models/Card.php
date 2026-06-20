<?php

namespace App\Modules\Catalog\Models;

use Illuminate\Database\Eloquent\Model;

class Card extends Model
{
    public const RARITIES = [
        'Common',
        'Uncommon',
        'Rare',
        'Rare Holo',
        'Ultra Rare',
        'Secret Rare',
    ];

    public const CONDITIONS = [
        'Mint',
        'Near Mint',
        'Excellent',
        'Good',
        'Poor',
    ];

    protected $table = 'cards';

    protected $fillable = [
        'set_id',
        'name',
        'rarity',
        'condition',
        'price',
        'stock',
        'description',
        'image_url',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'price'     => 'decimal:2',
            'stock'     => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function getIsAvailableAttribute(): bool
    {
        return $this->stock > 0;
    }

    public function set()
    {
        return $this->belongsTo(Set::class, 'set_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeSearch($query, string $keyword)
    {
        return $query->where('name', 'like', '%' . $keyword . '%');
    }
}
