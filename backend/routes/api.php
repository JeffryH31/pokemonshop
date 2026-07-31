<?php

use App\Modules\Admin\Controllers\AdminProductController;
use App\Modules\Catalog\Controllers\CatalogController;
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

// Auth (admin login only — the storefront is guest-only)
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
});

// Catalog (public)
Route::prefix('catalog')->group(function () {
    Route::get('/cards', [CatalogController::class, 'index']);
    Route::get('/cards/search', [CatalogController::class, 'search']);
    Route::get('/cards/{id}', [CatalogController::class, 'show'])->where('id', '[0-9]+');
    Route::get('/categories', [CatalogController::class, 'categories']);
});

// Authenticated routes (admin only)
Route::middleware('auth:api')->group(function () {

    // Auth session
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
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
    });
});
