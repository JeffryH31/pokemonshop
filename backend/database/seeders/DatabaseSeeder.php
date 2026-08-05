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

        // Sample products with real card images from TCGdex
        // PENTING: Pokemon/One Piece adalah IP milik Nintendo/Bandai — panduan resmi
        // Pokemon (press.pokemon.com/en/Assets-Use-Terms) melarang penggunaan
        // komersial atas artwork kartu mereka. Gambar di bawah ini untuk dev/seed
        // purposes saja. JANGAN pakai di production — ganti dengan foto produk asli
        // sebelum go-live melalui admin panel.
        $tcgdex = fn (string $path) => "https://assets.tcgdex.net/en/{$path}/high.webp";

        $products = [
            [
                'name'        => 'Pikachu',
                'category'    => 'Sealed Product Pokemon',
                'price'       => 1500000,
                'stock'       => 10,
                'description' => 'Booster Box resmi Scarlet & Violet 151, isi 36 pack.',
                'image_url'   => $tcgdex('sv/sv03.5/025'), // Pikachu - 151 set
            ],
            [
                'name'        => 'Ditto',
                'category'    => 'Sealed Product Pokemon',
                'price'       => 750000,
                'stock'       => 15,
                'description' => 'Elite Trainer Box Obsidian Flames lengkap dengan sleeves dan dice.',
                'image_url'   => $tcgdex('sv/sv04.5/201'), // Ditto
            ],
            [
                'name'        => 'Kecleon',
                'category'    => 'Sealed Product Pokemon',
                'price'       => 900000,
                'stock'       => 8,
                'description' => 'Booster Box Surging Sparks, isi 36 pack.',
                'image_url'   => $tcgdex('sv/sv08/150'), // Kecleon
            ],
            [
                'name'        => 'Latias ex',
                'category'    => 'Sealed Product Pokemon',
                'price'       => 950000,
                'stock'       => 12,
                'description' => 'Booster Box Crown Zenith Special Collection.',
                'image_url'   => $tcgdex('sv/sv08/239'), // Latias ex
            ],
            [
                'name'        => 'Latios',
                'category'    => 'Slab Pokemon',
                'price'       => 2500000,
                'stock'       => 2,
                'description' => 'Latios Special Illustration Rare, grade PSA 10 Gem Mint.',
                'image_url'   => $tcgdex('sv/sv08/203'), // Latios
            ],
            [
                'name'        => 'Slab Venusaur ex Special Illustration PSA 9',
                'category'    => 'Slab Pokemon',
                'price'       => 1800000,
                'stock'       => 3,
                'description' => 'Venusaur ex Special Illustration Rare, grade PSA 9 Mint.',
                'image_url'   => $tcgdex('sv/sv08/202'), // Venusaur ex - Surging Sparks (SIR)
            ],
            [
                'name'        => 'Slab Charizard ex 151 PSA 10',
                'category'    => 'Slab Pokemon',
                'price'       => 5000000,
                'stock'       => 1,
                'description' => 'Charizard ex dari set 151, grade PSA 10 Gem Mint.',
                'image_url'   => $tcgdex('sv/sv03.5/199'), // Charizard ex - 151 (SIR #199)
            ],
            [
                'name'        => 'Slab Pikachu ex Special Illustration PSA 9',
                'category'    => 'Slab Pokemon',
                'price'       => 3200000,
                'stock'       => 2,
                'description' => 'Pikachu ex Special Illustration Rare, grade PSA 9.',
                'image_url'   => $tcgdex('sv/sv08/238'), // Pikachu ex - Surging Sparks (SIR #238)
            ],
            [
                'name'        => 'Charizard ex 151 Raw Near Mint',
                'category'    => 'Raw Card',
                'price'       => 450000,
                'stock'       => 5,
                'description' => 'Charizard ex dari set 151, kondisi Near Mint, belum di-grade.',
                'image_url'   => $tcgdex('sv/sv03.5/006'), // Charizard ex - 151 (regular #006)
            ],
            [
                'name'        => 'Card Sleeve Dragon Shield Matte Black (100pcs)',
                'category'    => 'Accessoris',
                'price'       => 85000,
                'stock'       => 50,
                'description' => 'Dragon Shield Matte Black sleeve premium untuk proteksi kartu.',
                'image_url'   => $tcgdex('sv/sv03.5/025'), // Generic Pikachu for sleeve visual
            ],
            [
                'name'        => 'Binder 9-Pocket Premium 360 Cards',
                'category'    => 'Accessoris',
                'price'       => 120000,
                'stock'       => 30,
                'description' => 'Binder 9-pocket kapasitas 360 kartu, material premium anti-slip.',
                'image_url'   => $tcgdex('sv/sv03.5/199'), // Generic Charizard for binder visual
            ],
        ];

        foreach ($products as $product) {
            Card::create($product + ['is_active' => true]);
        }
    }
}
