<?php

namespace Database\Seeders;

use App\Modules\Catalog\Models\Card;
use App\Modules\User\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin user (storefront is guest-only; only admins log in)
        User::create([
            'name'     => 'Admin',
            'email'    => 'admin@gmail.com',
            'phone'    => '081234567890',
            'password' => Hash::make('password123'),
            'role'     => 'admin',
        ]);

        $products = [
            [
                'name'        => 'Pikachu',
                'category'    => 'Sealed Product Pokemon',
                'price'       => 1500000,
                'stock'       => 10,
                'description' => 'Booster Box resmi Scarlet & Violet 151, isi 36 pack.',
            ],
            [
                'name'        => 'Ditto',
                'category'    => 'Sealed Product Pokemon',
                'price'       => 750000,
                'stock'       => 15,
                'description' => 'Elite Trainer Box Obsidian Flames lengkap dengan sleeves dan dice.',
            ],
            [
                'name'        => 'Kecleon',
                'category'    => 'Sealed Product Pokemon',
                'price'       => 900000,
                'stock'       => 8,
                'description' => 'Booster Box Surging Sparks, isi 36 pack.',
            ],
            [
                'name'        => 'Latias ex',
                'category'    => 'Sealed Product Pokemon',
                'price'       => 950000,
                'stock'       => 12,
                'description' => 'Booster Box Crown Zenith Special Collection.',
            ],
            [
                'name'        => 'Latios',
                'category'    => 'Slab Pokemon',
                'price'       => 2500000,
                'stock'       => 2,
                'description' => 'Latios Special Illustration Rare, grade PSA 10 Gem Mint.',
            ],
            [
                'name'        => 'Slab Venusaur ex Special Illustration PSA 9',
                'category'    => 'Slab Pokemon',
                'price'       => 1800000,
                'stock'       => 3,
                'description' => 'Venusaur ex Special Illustration Rare, grade PSA 9 Mint.',
            ],
            [
                'name'        => 'Slab Charizard ex 151 PSA 10',
                'category'    => 'Slab Pokemon',
                'price'       => 5000000,
                'stock'       => 1,
                'description' => 'Charizard ex dari set 151, grade PSA 10 Gem Mint.',
            ],
            [
                'name'        => 'Slab Pikachu ex Special Illustration PSA 9',
                'category'    => 'Slab Pokemon',
                'price'       => 3200000,
                'stock'       => 2,
                'description' => 'Pikachu ex Special Illustration Rare, grade PSA 9.',
            ],
            [
                'name'        => 'Charizard ex 151 Raw Near Mint',
                'category'    => 'Raw Card',
                'price'       => 450000,
                'stock'       => 5,
                'description' => 'Charizard ex dari set 151, kondisi Near Mint, belum di-grade.',
            ],
            [
                'name'        => 'Card Sleeve Dragon Shield Matte Black (100pcs)',
                'category'    => 'Accessoris',
                'price'       => 85000,
                'stock'       => 50,
                'description' => 'Dragon Shield Matte Black sleeve premium untuk proteksi kartu.',
            ],
            [
                'name'        => 'Binder 9-Pocket Premium 360 Cards',
                'category'    => 'Accessoris',
                'price'       => 120000,
                'stock'       => 30,
                'description' => 'Binder 9-pocket kapasitas 360 kartu, material premium anti-slip.',
            ],
        ];

        foreach ($products as $product) {
            Card::create($product + ['is_active' => true]);
        }
    }
}
