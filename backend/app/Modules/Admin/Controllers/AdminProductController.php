<?php

namespace App\Modules\Admin\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\HttpResponse;
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
    use HttpResponse;

    public function __construct(private AdminProductService $service) {}

    // Cards
    public function storeCard(CreateCardRequest $request): JsonResponse
    {
        $card = $this->service->createCard($request->validated());

        return $this->success($card->load('set'), 'Card created.', 201);
    }

    public function updateCard(UpdateCardRequest $request, int $id): JsonResponse
    {
        $card = Card::findOrFail($id);
        $card = $this->service->updateCard($card, $request->validated());

        return $this->success($card, 'Card updated.');
    }

    public function deactivateCard(int $id): JsonResponse
    {
        $card = Card::findOrFail($id);
        $card = $this->service->deactivateCard($card);

        return $this->success($card, 'Card deactivated.');
    }

    public function updateStock(UpdateStockRequest $request, int $id): JsonResponse
    {
        $card = Card::findOrFail($id);
        $card = $this->service->updateStock($card, $request->input('stock'), auth('api')->user());

        return $this->success($card, 'Stock updated.');
    }

    // Sets
    public function storeSets(CreateSetRequest $request): JsonResponse
    {
        $set = $this->service->createSet($request->validated());

        return $this->success($set, 'Set created.', 201);
    }

    public function updateSet(UpdateSetRequest $request, int $id): JsonResponse
    {
        $set = Set::findOrFail($id);
        $set = $this->service->updateSet($set, $request->validated());

        return $this->success($set, 'Set updated.');
    }

    public function deactivateSet(int $id): JsonResponse
    {
        $set = Set::findOrFail($id);
        $set = $this->service->deactivateSet($set);

        return $this->success($set, 'Set deactivated.');
    }

    // Dashboard
    public function dashboard(DashboardRequest $request): JsonResponse
    {
        $data = $this->service->getDashboard(
            $request->input('start_date'),
            $request->input('end_date'),
        );

        return $this->success($data);
    }
}
