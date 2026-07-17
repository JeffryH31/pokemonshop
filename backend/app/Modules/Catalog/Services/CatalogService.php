<?php

namespace App\Modules\Catalog\Services;

use App\Modules\Catalog\Models\Card;
use App\Modules\Catalog\Models\Set;
use Illuminate\Pagination\LengthAwarePaginator;

class CatalogService
{
    public function listCards(array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        $query = Card::with('set')->active();

        if (!empty($filters['name'])) {
            $query->search($filters['name']);
        }

        // Support both 'set_id' (frontend) and 'set' (legacy)
        $setId = $filters['set_id'] ?? $filters['set'] ?? null;
        if (!empty($setId)) {
            $query->where('set_id', $setId);
        }

        if (!empty($filters['rarity'])) {
            $query->where('rarity', $filters['rarity']);
        }

        if (!empty($filters['condition'])) {
            $query->where('condition', $filters['condition']);
        }

        // Support both 'min_price' (frontend) and 'price_min' (legacy)
        $minPrice = $filters['min_price'] ?? $filters['price_min'] ?? null;
        if (isset($minPrice) && $minPrice !== '') {
            $query->where('price', '>=', $minPrice);
        }

        // Support both 'max_price' (frontend) and 'price_max' (legacy)
        $maxPrice = $filters['max_price'] ?? $filters['price_max'] ?? null;
        if (isset($maxPrice) && $maxPrice !== '') {
            $query->where('price', '<=', $maxPrice);
        }

        // Sort
        $sort = $filters['sort'] ?? 'newest';
        match ($sort) {
            'price_asc'  => $query->orderBy('price', 'asc'),
            'price_desc' => $query->orderBy('price', 'desc'),
            'name_asc'   => $query->orderBy('name', 'asc'),
            default      => $query->orderBy('created_at', 'desc'), // newest
        };

        $perPage = isset($filters['per_page']) ? (int) $filters['per_page'] : $perPage;

        return $query->paginate($perPage);
    }

    public function searchCards(string $keyword, int $perPage = 20): LengthAwarePaginator
    {
        return Card::with('set')
            ->active()
            ->search($keyword)
            ->paginate($perPage);
    }

    public function getCard(int $id): Card
    {
        return Card::with('set')
            ->active()
            ->findOrFail($id);
    }

    public function listSets(): \Illuminate\Database\Eloquent\Collection
    {
        return Set::active()
            ->withCount(['activeCards as card_count'])
            ->get();
    }

    public function getRarities(): array
    {
        return Card::RARITIES;
    }
}
