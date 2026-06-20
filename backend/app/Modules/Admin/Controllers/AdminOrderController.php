<?php

namespace App\Modules\Admin\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Admin\Requests\UpdateOrderStatusRequest;
use App\Modules\Order\Models\Order;
use App\Modules\Order\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminOrderController extends Controller
{
    public function __construct(private OrderService $orderService) {}

    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'status' => 'nullable|in:pending_payment,paid,processing,shipped,delivered,cancelled,expired',
        ]);

        $query = Order::with('items', 'user')->latest();

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        $paginator = $query->paginate(20);

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

    public function updateStatus(UpdateOrderStatusRequest $request, int $id): JsonResponse
    {
        $order = Order::with('items')->findOrFail($id);

        $order = $this->orderService->updateStatus(
            order:          $order,
            newStatus:      $request->input('status'),
            trackingNumber: $request->input('tracking_number'),
        );

        return response()->json([
            'message' => 'Order status updated.',
            'data'    => $order,
        ]);
    }

    public function cancel(int $id): JsonResponse
    {
        $order = Order::with('items')->findOrFail($id);

        if (!$order->isCancellable()) {
            return response()->json([
                'message' => 'Order cannot be cancelled.',
                'errors'  => ['status' => ['Only orders with status pending_payment or paid can be cancelled.']],
            ], 422);
        }

        $order = $this->orderService->updateStatus($order, Order::STATUS_CANCELLED);

        return response()->json([
            'message' => 'Order cancelled.',
            'data'    => $order,
        ]);
    }
}
