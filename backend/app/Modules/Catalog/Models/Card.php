<?php

namespace App\Modules\Catalog\Models;

use Illuminate\Database\Eloquent\Model;

class Card extends Model
{
    public const CATEGORIES = [
        'Sealed Product Pokemon',
        'Sealed Product OnePiece',
        'Slab OnePiece',
        'Slab Pokemon',
        'Raw Card',
        'Accessoris',
    ];

    protected $table = 'cards';

    protected $fillable = [
        'name',
        'category',
        'price',
        'stock',
        'description',
        'image_path',
        'is_active',
    ];

    protected $appends = ['is_available', 'image_url'];

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

    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image_path) return null;
        return \Illuminate\Support\Facades\Storage::disk('public')->url($this->image_path);
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
