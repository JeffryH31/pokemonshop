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

        // Sample cards — image URLs from Pokemon TCG CDN (images.pokemontcg.io)
        $cardData = [
            // Base Set
            ['set_id' => 1, 'name' => 'Charizard',    'rarity' => 'Ultra Rare',  'condition' => 'Near Mint', 'price' => 350000, 'stock' => 5,
             'image_url' => 'https://images.pokemontcg.io/base1/4_hires.png',
             'description' => 'Charizard Base Set #4. One of the most iconic Pokemon cards ever printed.'],

            ['set_id' => 1, 'name' => 'Blastoise',    'rarity' => 'Ultra Rare',  'condition' => 'Mint',      'price' => 280000, 'stock' => 3,
             'image_url' => 'https://images.pokemontcg.io/base1/2_hires.png',
             'description' => 'Blastoise Base Set #2. Classic holographic rare from the original set.'],

            ['set_id' => 1, 'name' => 'Venusaur',     'rarity' => 'Ultra Rare',  'condition' => 'Near Mint', 'price' => 220000, 'stock' => 4,
             'image_url' => 'https://images.pokemontcg.io/base1/15_hires.png',
             'description' => 'Venusaur Base Set #15. The original Grass-type starter holographic card.'],

            ['set_id' => 1, 'name' => 'Pikachu',      'rarity' => 'Common',      'condition' => 'Mint',      'price' => 25000,  'stock' => 20,
             'image_url' => 'https://images.pokemontcg.io/base1/58_hires.png',
             'description' => 'Pikachu Base Set #58. The face of Pokemon in its original card form.'],

            ['set_id' => 1, 'name' => 'Mewtwo',       'rarity' => 'Rare Holo',   'condition' => 'Near Mint', 'price' => 180000, 'stock' => 7,
             'image_url' => 'https://images.pokemontcg.io/base1/10_hires.png',
             'description' => 'Mewtwo Base Set #10. The legendary Psychic-type in holographic form.'],

            ['set_id' => 1, 'name' => 'Raichu',       'rarity' => 'Rare Holo',   'condition' => 'Excellent', 'price' => 95000,  'stock' => 8,
             'image_url' => 'https://images.pokemontcg.io/base1/14_hires.png',
             'description' => 'Raichu Base Set #14. Pikachu\'s evolved form in holographic glory.'],

            // Jungle
            ['set_id' => 2, 'name' => 'Scyther',      'rarity' => 'Rare',        'condition' => 'Excellent', 'price' => 45000,  'stock' => 10,
             'image_url' => 'https://images.pokemontcg.io/jungle/10_hires.png',
             'description' => 'Scyther Jungle Set #10. A fan-favorite Grass/Flying type.'],

            ['set_id' => 2, 'name' => 'Jolteon',      'rarity' => 'Rare',        'condition' => 'Near Mint', 'price' => 75000,  'stock' => 6,
             'image_url' => 'https://images.pokemontcg.io/jungle/4_hires.png',
             'description' => 'Jolteon Jungle Set #4. The speedy Electric-type Eeveelution.'],

            ['set_id' => 2, 'name' => 'Vaporeon',     'rarity' => 'Rare',        'condition' => 'Near Mint', 'price' => 70000,  'stock' => 5,
             'image_url' => 'https://images.pokemontcg.io/jungle/12_hires.png',
             'description' => 'Vaporeon Jungle Set #12. The Water-type Eeveelution.'],

            // Fossil
            ['set_id' => 3, 'name' => 'Gengar',       'rarity' => 'Rare Holo',   'condition' => 'Mint',      'price' => 120000, 'stock' => 8,
             'image_url' => 'https://images.pokemontcg.io/fossil/5_hires.png',
             'description' => 'Gengar Fossil Set #5. The classic Ghost-type in holographic form.'],

            ['set_id' => 3, 'name' => 'Lapras',       'rarity' => 'Rare',        'condition' => 'Good',      'price' => 35000,  'stock' => 15,
             'image_url' => 'https://images.pokemontcg.io/fossil/10_hires.png',
             'description' => 'Lapras Fossil Set #10. The beloved Water/Ice transport Pokemon.'],

            // Sword & Shield
            ['set_id' => 4, 'name' => 'Zacian V',     'rarity' => 'Ultra Rare',  'condition' => 'Mint',      'price' => 150000, 'stock' => 12,
             'image_url' => 'https://images.pokemontcg.io/swsh1/138_hires.png',
             'description' => 'Zacian V from Sword & Shield base set. Powerful Fairy-type legendary.'],

            ['set_id' => 4, 'name' => 'Pikachu V',    'rarity' => 'Ultra Rare',  'condition' => 'Near Mint', 'price' => 85000,  'stock' => 9,
             'image_url' => 'https://images.pokemontcg.io/swsh45sv/SWSH076_hires.png',
             'description' => 'Pikachu V promotional card. The iconic mascot in V form.'],

            // Scarlet & Violet
            ['set_id' => 5, 'name' => 'Charizard ex', 'rarity' => 'Secret Rare', 'condition' => 'Mint',      'price' => 500000, 'stock' => 2,
             'image_url' => 'https://images.pokemontcg.io/sv3pt5/215_hires.png',
             'description' => 'Charizard ex from 151 set. The most sought-after card of the Scarlet & Violet era.'],

            ['set_id' => 5, 'name' => 'Miraidon ex',  'rarity' => 'Ultra Rare',  'condition' => 'Mint',      'price' => 130000, 'stock' => 7,
             'image_url' => 'https://images.pokemontcg.io/sv1/227_hires.png',
             'description' => 'Miraidon ex from Scarlet & Violet base set. The futuristic box legendary.'],
        ];

        foreach ($cardData as $card) {
            Card::create($card + ['is_active' => true]);
        }
    }
}
