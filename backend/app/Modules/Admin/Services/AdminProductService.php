<?php

namespace App\Modules\Admin\Services;

use App\Modules\Catalog\Models\Card;
use App\Modules\User\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class AdminProductService
{
    public function createCard(array $data, ?UploadedFile $image = null): Card
    {
        if ($image) {
            $data['image_path'] = $image->store('cards', 'public');
        }

        return Card::create($data + ['is_active' => true]);
    }

    public function updateCard(Card $card, array $data, ?UploadedFile $image = null): Card
    {
        if ($image) {
            // Delete old image if exists
            if ($card->image_path) {
                Storage::disk('public')->delete($card->image_path);
            }
            $data['image_path'] = $image->store('cards', 'public');
        }

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
            'low_stock_items'    => $lowStockItems,
        ];
    }
}
