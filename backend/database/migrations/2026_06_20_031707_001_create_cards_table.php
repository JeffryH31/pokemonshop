<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cards', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('category', [
                'Sealed Product Pokemon',
                'Sealed Product OnePiece',
                'Slab OnePiece',
                'Slab Pokemon',
                'Raw Card',
                'Accessoris',
            ]);
            $table->decimal('price', 12, 2);
            $table->unsignedInteger('stock')->default(0);
            $table->text('description')->nullable();
            $table->string('image_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['is_active', 'category']);
            $table->index(['is_active', 'price']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cards');
    }
};
