<?php

namespace App\Modules\Catalog\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Set extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Set $set) {
            if (empty($set->slug)) {
                $set->slug = Str::slug($set->name);
            }
        });
    }

    public function cards()
    {
        return $this->hasMany(Card::class, 'set_id');
    }

    public function activeCards()
    {
        return $this->hasMany(Card::class, 'set_id')->where('is_active', true);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
