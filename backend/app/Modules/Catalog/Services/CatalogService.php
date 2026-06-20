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

        if (!empty($filters['set'])) {
            $query->where('set_id', $filters['set']);
        }

        if (!empty($filters['rarity'])) {
            $query->where('rarity', $filters['rarity']);
        }

        if (!empty($filters['condition'])) {
            $query->where('condition', $filters['condition']);
        }

        if (isset($filters['price_min'])) {
            $query->where('price', '>=', $filters['price_min']);
        }

        if (isset($filters['price_max'])) {
            $query->where('price', '<=', $filters['price_max']);
        }

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
