<?php

namespace App\Modules\Admin\Services;

use App\Modules\Catalog\Models\Card;
use App\Modules\Catalog\Models\Set;
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
        return $card->fresh('set');
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
            'order_id'        => null,
            'created_at'      => now(),
        ]);

        return $card->fresh();
    }

    public function createSet(array $data): Set
    {
        return Set::create($data + ['is_active' => true]);
    }

    public function updateSet(Set $set, array $data): Set
    {
        $set->update($data);
        return $set->fresh();
    }

    public function deactivateSet(Set $set): Set
    {
        $set->update(['is_active' => false]);
        return $set->fresh();
    }

    public function getDashboard(string $startDate, string $endDate): array
    {
        $totalActiveCards = Card::active()->count();

        $ordersByStatus = DB::table('orders')
            ->selectRaw('status, COUNT(*) as count')
            ->whereBetween('created_at', [$startDate, $endDate . ' 23:59:59'])
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        $totalRevenue = DB::table('orders')
            ->where('status', 'paid')
            ->whereBetween('created_at', [$startDate, $endDate . ' 23:59:59'])
            ->sum('total_amount');

        return [
            'total_active_cards' => $totalActiveCards,
            'orders_by_status'   => $ordersByStatus,
            'total_revenue'      => (float) $totalRevenue,
            'period'             => ['start' => $startDate, 'end' => $endDate],
        ];
    }
}
