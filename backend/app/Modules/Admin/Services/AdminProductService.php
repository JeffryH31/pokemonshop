<?php

namespace App\Modules\Admin\Services;

use App\Modules\Catalog\Models\Card;
use App\Modules\User\Models\User;
use Illuminate\Support\Facades\DB;

class AdminProductService
{
    public function createCard(array $data): Card
    {
        return Card::create($data + ['is_active' => true]);
    }

    public function updateCard(Card $card, array $data): Card
    {
        $card->update($data);
        return $card->fresh();
    }

    public function deactivateCard(Card $card): Card
    {
        $card->update(['is_active' => false]);
        return $card->fresh();
    }

    public function updateStock(Card $card, int $newStock, User $admin): Card
    {
        $before = $card->stock;

        $card->update(['stock' => $newStock]);

        DB::table('stock_logs')->insert([
            'card_id'         => $card->id,
            'admin_id'        => $admin->id,
            'quantity_before' => $before,
            'quantity_after'  => $newStock,
            'change'          => $newStock - $before,
            'reason'          => 'admin_update',
            'created_at'      => now(),
        ]);

        return $card->fresh();
    }

    public function getDashboard(int $lowStockThreshold = 5): array
    {
        $activeCards = Card::active();

        $totalActiveCards = (clone $activeCards)->count();
        $totalStock       = (int) (clone $activeCards)->sum('stock');
        $outOfStockCount  = (clone $activeCards)->where('stock', 0)->count();
        $lowStockCount    = (clone $activeCards)
            ->whereBetween('stock', [1, $lowStockThreshold])
            ->count();
        $inventoryValue   = (float) (clone $activeCards)->sum(DB::raw('price * stock'));

        $lowStockItems = (clone $activeCards)
            ->where('stock', '<=', $lowStockThreshold)
            ->orderBy('stock')
            ->limit(10)
            ->get(['id', 'name', 'category', 'stock', 'price']);

        return [
            'total_active_cards' => $totalActiveCards,
            'total_stock'        => $totalStock,
            'out_of_stock_count' => $outOfStockCount,
            'low_stock_count'    => $lowStockCount,
            'inventory_value'    => $inventoryValue,
            'low_stock_items'    => $lowStockItems,
        ];
    }
}
