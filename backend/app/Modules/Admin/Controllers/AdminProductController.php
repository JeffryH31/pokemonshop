<?php

namespace App\Modules\Admin\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\HttpResponse;
use App\Modules\Admin\Requests\CreateCardRequest;
use App\Modules\Admin\Requests\UpdateCardRequest;
use App\Modules\Admin\Requests\UpdateStockRequest;
use App\Modules\Admin\Requests\DashboardRequest;
use App\Modules\Admin\Services\AdminProductService;
use App\Modules\Catalog\Models\Card;
use Illuminate\Http\JsonResponse;

class AdminProductController extends Controller
{
    use HttpResponse;

    public function __construct(private AdminProductService $service) {}

    public function storeCard(CreateCardRequest $request): JsonResponse
    {
        $card = $this->service->createCard($request->validated());

        return $this->success($card, 'Card created.', 201);
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

    public function dashboard(DashboardRequest $request): JsonResponse
    {
        $data = $this->service->getDashboard(
            $request->input('start_date'),
            $request->input('end_date'),
        );

        return $this->success($data);
    }
}
