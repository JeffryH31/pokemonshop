<?php

namespace Database\Seeders;

use App\Modules\Catalog\Models\Card;
use App\Modules\Catalog\Models\Set;
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
            'password' => Hash::make('password123'),
            'role'     => 'admin',
        ]);

        // Test customer
        User::create([
            'name'     => 'Test Customer',
            'email'    => 'customer@pokemonshop.com',
            'password' => Hash::make('password123'),
            'role'     => 'customer',
        ]);

        // Sets
        $sets = [
            ['name' => 'Base Set',         'description' => 'The original Pokemon TCG set from 1998.'],
            ['name' => 'Jungle',            'description' => 'Second expansion of the Pokemon TCG.'],
            ['name' => 'Fossil',            'description' => 'Third expansion featuring fossil Pokemon.'],
            ['name' => 'Sword & Shield',    'description' => 'Generation 8 base set.'],
            ['name' => 'Scarlet & Violet',  'description' => 'Generation 9 base set.'],
        ];

        foreach ($sets as $setData) {
            Set::create($setData + ['is_active' => true]);
        }

        // Sample cards
        $cardData = [
            ['set_id' => 1, 'name' => 'Charizard',   'rarity' => 'Ultra Rare',  'condition' => 'Near Mint', 'price' => 350000, 'stock' => 5],
            ['set_id' => 1, 'name' => 'Blastoise',   'rarity' => 'Ultra Rare',  'condition' => 'Mint',      'price' => 280000, 'stock' => 3],
            ['set_id' => 1, 'name' => 'Venusaur',    'rarity' => 'Ultra Rare',  'condition' => 'Near Mint', 'price' => 220000, 'stock' => 4],
            ['set_id' => 1, 'name' => 'Pikachu',     'rarity' => 'Common',      'condition' => 'Mint',      'price' => 25000,  'stock' => 20],
            ['set_id' => 1, 'name' => 'Mewtwo',      'rarity' => 'Rare Holo',   'condition' => 'Near Mint', 'price' => 180000, 'stock' => 7],
            ['set_id' => 2, 'name' => 'Scyther',     'rarity' => 'Rare',        'condition' => 'Excellent', 'price' => 45000,  'stock' => 10],
            ['set_id' => 2, 'name' => 'Jolteon',     'rarity' => 'Rare',        'condition' => 'Near Mint', 'price' => 75000,  'stock' => 6],
            ['set_id' => 3, 'name' => 'Gengar',      'rarity' => 'Rare Holo',   'condition' => 'Mint',      'price' => 120000, 'stock' => 8],
            ['set_id' => 4, 'name' => 'Zacian V',    'rarity' => 'Ultra Rare',  'condition' => 'Mint',      'price' => 150000, 'stock' => 12],
            ['set_id' => 5, 'name' => 'Charizard ex', 'rarity' => 'Secret Rare', 'condition' => 'Mint',     'price' => 500000, 'stock' => 2],
        ];

        foreach ($cardData as $card) {
            Card::create($card + ['is_active' => true]);
        }
    }
}
