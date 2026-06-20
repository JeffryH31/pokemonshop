<?php

namespace App\Modules\Catalog\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Catalog\Requests\ListCardsRequest;
use App\Modules\Catalog\Services\CatalogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CatalogController extends Controller
{
    public function __construct(private CatalogService $catalogService) {}

    public function index(ListCardsRequest $request): JsonResponse
    {
        $paginator = $this->catalogService->listCards($request->validated());

        return response()->json([
            'data' => $paginator->items(),
            'meta' => [
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

        return response()->json([
            'data' => $paginator->items(),
            'meta' => [
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

        return response()->json(['data' => $card->append('is_available')]);
    }

    public function sets(): JsonResponse
    {
        $sets = $this->catalogService->listSets();

        return response()->json(['data' => $sets]);
    }

    public function rarities(): JsonResponse
    {
        return response()->json(['data' => $this->catalogService->getRarities()]);
    }
}
