<?php

namespace App\Modules\Catalog\Services;

use App\Modules\Catalog\Models\Card;
use Illuminate\Pagination\LengthAwarePaginator;

class CatalogService
{
    public function listCards(array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        $query = Card::active();

        if (!empty($filters['name'])) {
            $query->search($filters['name']);
        }

        if (!empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        $minPrice = $filters['min_price'] ?? $filters['price_min'] ?? null;
        if (isset($minPrice) && $minPrice !== '') {
            $query->where('price', '>=', $minPrice);
        }

        $maxPrice = $filters['max_price'] ?? $filters['price_max'] ?? null;
        if (isset($maxPrice) && $maxPrice !== '') {
            $query->where('price', '<=', $maxPrice);
        }

        $sort = $filters['sort'] ?? 'newest';
        match ($sort) {
            'price_asc'  => $query->orderBy('price', 'asc'),
            'price_desc' => $query->orderBy('price', 'desc'),
            'name_asc'   => $query->orderBy('name', 'asc'),
            default      => $query->orderBy('created_at', 'desc'),
        };

        $perPage = isset($filters['per_page']) ? (int) $filters['per_page'] : $perPage;

        return $query->paginate($perPage);
    }

    public function searchCards(string $keyword, int $perPage = 20): LengthAwarePaginator
    {
        return Card::active()
            ->search($keyword)
            ->paginate($perPage);
    }

    public function getCard(int $id): Card
    {
        return Card::active()->findOrFail($id);
    }

    public function getCategories(): array
    {
        return Card::CATEGORIES;
    }
}
