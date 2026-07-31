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
        // Admin user
        User::create([
            'name'     => 'Admin',
            'email'    => 'admin@pokemonshop.com',
            'phone'    => '081234567890',
            'password' => Hash::make('password123'),
            'role'     => 'admin',
        ]);

        // Test customer
        User::create([
            'name'     => 'Test Customer',
            'email'    => 'customer@pokemonshop.com',
            'phone'    => '089876543210',
            'password' => Hash::make('password123'),
            'role'     => 'customer',
        ]);

        // Sample products
        $products = [
            [
                'name'        => 'Booster Box Scarlet & Violet 151',
                'category'    => 'Sealed Product Pokemon',
                'price'       => 1500000,
                'stock'       => 10,
                'description' => 'Booster Box resmi Scarlet & Violet 151, isi 36 pack.',
                'image_url'   => null,
            ],
            [
                'name'        => 'Elite Trainer Box Obsidian Flames',
                'category'    => 'Sealed Product Pokemon',
                'price'       => 750000,
                'stock'       => 15,
                'description' => 'Elite Trainer Box Obsidian Flames lengkap dengan sleeves dan dice.',
                'image_url'   => null,
            ],
            [
                'name'        => 'Booster Box One Piece OP-01',
                'category'    => 'Sealed Product OnePiece',
                'price'       => 900000,
                'stock'       => 8,
                'description' => 'Booster Box One Piece OP-01 Romance Dawn, isi 24 pack.',
                'image_url'   => null,
            ],
            [
                'name'        => 'Booster Box One Piece OP-06',
                'category'    => 'Sealed Product OnePiece',
                'price'       => 950000,
                'stock'       => 12,
                'description' => 'Booster Box One Piece OP-06 Wings of The Captain.',
                'image_url'   => null,
            ],
            [
                'name'        => 'Slab Luffy OP-01 Leader PSA 10',
                'category'    => 'Slab OnePiece',
                'price'       => 2500000,
                'stock'       => 2,
                'description' => 'Luffy OP-01 Leader card sudah di-grade PSA 10 Gem Mint.',
                'image_url'   => null,
            ],
            [
                'name'        => 'Slab Zoro Parallel PSA 9',
                'category'    => 'Slab OnePiece',
                'price'       => 1800000,
                'stock'       => 3,
                'description' => 'Zoro Parallel OP-01 grade PSA 9 Mint.',
                'image_url'   => null,
            ],
            [
                'name'        => 'Slab Charizard ex 151 PSA 10',
                'category'    => 'Slab Pokemon',
                'price'       => 5000000,
                'stock'       => 1,
                'description' => 'Charizard ex dari set 151, grade PSA 10 Gem Mint.',
                'image_url'   => null,
            ],
            [
                'name'        => 'Slab Pikachu ex Special Illustration PSA 9',
                'category'    => 'Slab Pokemon',
                'price'       => 3200000,
                'stock'       => 2,
                'description' => 'Pikachu ex Special Illustration Rare, grade PSA 9.',
                'image_url'   => null,
            ],
            [
                'name'        => 'Charizard ex 151 Raw Near Mint',
                'category'    => 'Raw Card',
                'price'       => 450000,
                'stock'       => 5,
                'description' => 'Charizard ex dari set 151, kondisi Near Mint, belum di-grade.',
                'image_url'   => null,
            ],
            [
                'name'        => 'Luffy OP-01 Parallel Raw Near Mint',
                'category'    => 'Raw Card',
                'price'       => 350000,
                'stock'       => 7,
                'description' => 'Luffy Parallel OP-01, kondisi Near Mint.',
                'image_url'   => null,
            ],
            [
                'name'        => 'Card Sleeve Dragon Shield Matte Black (100pcs)',
                'category'    => 'Accessoris',
                'price'       => 85000,
                'stock'       => 50,
                'description' => 'Dragon Shield Matte Black sleeve premium untuk proteksi kartu.',
                'image_url'   => null,
            ],
            [
                'name'        => 'Binder 9-Pocket Premium 360 Cards',
                'category'    => 'Accessoris',
                'price'       => 120000,
                'stock'       => 30,
                'description' => 'Binder 9-pocket kapasitas 360 kartu, material premium anti-slip.',
                'image_url'   => null,
            ],
        ];

        foreach ($products as $product) {
            Card::create($product + ['is_active' => true]);
        }
    }
}
