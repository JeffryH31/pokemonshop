<?php

namespace App\Modules\Admin\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Admin\Requests\CreateCardRequest;
use App\Modules\Admin\Requests\UpdateCardRequest;
use App\Modules\Admin\Requests\UpdateStockRequest;
use App\Modules\Admin\Requests\CreateSetRequest;
use App\Modules\Admin\Requests\UpdateSetRequest;
use App\Modules\Admin\Requests\DashboardRequest;
use App\Modules\Admin\Services\AdminProductService;
use App\Modules\Catalog\Models\Card;
use App\Modules\Catalog\Models\Set;
use Illuminate\Http\JsonResponse;

class AdminProductController extends Controller
{
    public function __construct(private AdminProductService $service) {}

    // Cards
    public function storeCard(CreateCardRequest $request): JsonResponse
    {
        $card = $this->service->createCard($request->validated());

        return response()->json([
            'message' => 'Card created.',
            'data'    => $card->load('set'),
        ], 201);
    }

    public function updateCard(UpdateCardRequest $request, int $id): JsonResponse
    {
        $card = Card::findOrFail($id);
        $card = $this->service->updateCard($card, $request->validated());

        return response()->json(['message' => 'Card updated.', 'data' => $card]);
    }

    public function deactivateCard(int $id): JsonResponse
    {
        $card = Card::findOrFail($id);
        $card = $this->service->deactivateCard($card);

        return response()->json(['message' => 'Card deactivated.', 'data' => $card]);
    }

    public function updateStock(UpdateStockRequest $request, int $id): JsonResponse
    {
        $card = Card::findOrFail($id);
        $card = $this->service->updateStock($card, $request->input('stock'), auth('api')->user());

        return response()->json(['message' => 'Stock updated.', 'data' => $card]);
    }

    // Sets
    public function storeSets(CreateSetRequest $request): JsonResponse
    {
        $set = $this->service->createSet($request->validated());

        return response()->json(['message' => 'Set created.', 'data' => $set], 201);
    }

    public function updateSet(UpdateSetRequest $request, int $id): JsonResponse
    {
        $set = Set::findOrFail($id);
        $set = $this->service->updateSet($set, $request->validated());

        return response()->json(['message' => 'Set updated.', 'data' => $set]);
    }

    public function deactivateSet(int $id): JsonResponse
    {
        $set = Set::findOrFail($id);
        $set = $this->service->deactivateSet($set);

        return response()->json(['message' => 'Set deactivated.', 'data' => $set]);
    }

    // Dashboard
    public function dashboard(DashboardRequest $request): JsonResponse
    {
        $data = $this->service->getDashboard(
            $request->input('start_date'),
            $request->input('end_date'),
        );

        return response()->json(['data' => $data]);
    }
}
