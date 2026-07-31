<?php

namespace App\Modules\Catalog\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\HttpResponse;
use App\Modules\Catalog\Requests\ListCardsRequest;
use App\Modules\Catalog\Services\CatalogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CatalogController extends Controller
{
    use HttpResponse;

    public function __construct(private CatalogService $catalogService) {}

    public function index(ListCardsRequest $request): JsonResponse
    {
        $paginator = $this->catalogService->listCards($request->validated());

        return $this->success([
            'items' => $paginator->items(),
            'meta'  => [
                'current_page' => $paginator->currentPage(),
                'total'        => $paginator->total(),
                'per_page'     => $paginator->perPage(),
                'last_page'    => $paginator->lastPage(),
            ],
        ]);
    }

    public function search(Request $request): JsonResponse
    {
        $request->validate([
            'q' => 'required|string|min:1|max:100',
        ]);

        $paginator = $this->catalogService->searchCards($request->input('q'));

        return $this->success([
            'items' => $paginator->items(),
            'meta'  => [
                'current_page' => $paginator->currentPage(),
                'total'        => $paginator->total(),
                'per_page'     => $paginator->perPage(),
                'last_page'    => $paginator->lastPage(),
            ],
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $card = $this->catalogService->getCard($id);

        return $this->success($card->append('is_available'));
    }

    public function categories(): JsonResponse
    {
        return $this->success($this->catalogService->getCategories());
    }
}
