<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->restrictOnDelete();
            $table->string('order_number')->unique();
            $table->enum('status', [
                'pending_payment',
                'paid',
                'processing',
                'shipped',
                'delivered',
                'cancelled',
                'expired',
            ])->default('pending_payment');
            $table->decimal('total_amount', 14, 2);

            // Shipping info
            $table->string('recipient_name', 100);
            $table->text('street_address');
            $table->string('city', 100);
            $table->string('postal_code', 10);

            // Shipping tracking
            $table->string('tracking_number', 100)->nullable();
            $table->timestamp('status_updated_at')->nullable();

            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
