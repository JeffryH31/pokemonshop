<?php

use App\Modules\Admin\Controllers\AdminOrderController;
use App\Modules\Admin\Controllers\AdminProductController;
use App\Modules\Cart\Controllers\CartController;
use App\Modules\Catalog\Controllers\CatalogController;
use App\Modules\Order\Controllers\OrderController;
use App\Modules\User\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Health check
Route::get('/health', function () {
    try {
        \Illuminate\Support\Facades\DB::connection()->getPdo();
        $dbStatus = 'connected';
    } catch (\Exception $e) {
        $dbStatus = 'disconnected';
    }

    return response()->json([
        'status'   => 'ok',
        'database' => $dbStatus,
    ]);
});

// Auth (public)
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Catalog (public)
Route::prefix('catalog')->group(function () {
    Route::get('/cards', [CatalogController::class, 'index']);
    Route::get('/cards/search', [CatalogController::class, 'search']);
    Route::get('/cards/{id}', [CatalogController::class, 'show'])->where('id', '[0-9]+');
    Route::get('/categories', [CatalogController::class, 'categories']);
});

// Authenticated routes
Route::middleware('auth:api')->group(function () {

    // Auth
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
    });

    // Cart
    Route::prefix('cart')->group(function () {
        Route::get('/', [CartController::class, 'index']);
        Route::post('/items', [CartController::class, 'addItem']);
        Route::put('/items/{cardId}', [CartController::class, 'updateItem'])->where('cardId', '[0-9]+');
        Route::delete('/items/{cardId}', [CartController::class, 'removeItem'])->where('cardId', '[0-9]+');
    });

    // Orders
    Route::prefix('orders')->group(function () {
        Route::post('/checkout', [OrderController::class, 'checkout']);
        Route::get('/', [OrderController::class, 'index']);
        Route::get('/{id}', [OrderController::class, 'show'])->where('id', '[0-9]+');
    });

    // Admin routes
    Route::prefix('admin')->middleware('admin')->group(function () {

        // Dashboard
        Route::get('/dashboard', [AdminProductController::class, 'dashboard']);

        // Cards management
        Route::post('/cards', [AdminProductController::class, 'storeCard']);
        Route::put('/cards/{id}', [AdminProductController::class, 'updateCard'])->where('id', '[0-9]+');
        Route::delete('/cards/{id}', [AdminProductController::class, 'deactivateCard'])->where('id', '[0-9]+');
        Route::patch('/cards/{id}/stock', [AdminProductController::class, 'updateStock'])->where('id', '[0-9]+');

        // Orders management
        Route::get('/orders', [AdminOrderController::class, 'index']);
        Route::patch('/orders/{id}/status', [AdminOrderController::class, 'updateStatus'])->where('id', '[0-9]+');
        Route::patch('/orders/{id}/cancel', [AdminOrderController::class, 'cancel'])->where('id', '[0-9]+');
    });
});
