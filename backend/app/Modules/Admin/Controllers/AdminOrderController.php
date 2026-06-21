<?php

namespace App\Modules\Admin\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\HttpResponse;
use App\Modules\Admin\Requests\UpdateOrderStatusRequest;
use App\Modules\Order\Models\Order;
use App\Modules\Order\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminOrderController extends Controller
{
    use HttpResponse;

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

    public function updateStatus(UpdateOrderStatusRequest $request, int $id): JsonResponse
    {
        $order = Order::with('items')->findOrFail($id);

        $order = $this->orderService->updateStatus(
            order:          $order,
            newStatus:      $request->input('status'),
            trackingNumber: $request->input('tracking_number'),
        );

        return $this->success($order, 'Order status updated.');
    }

    public function cancel(int $id): JsonResponse
    {
        $order = Order::with('items')->findOrFail($id);

        if (!$order->isCancellable()) {
            return $this->error('Order cannot be cancelled.', 422, [
                'status' => ['Only orders with status pending_payment or paid can be cancelled.'],
            ]);
        }

        $order = $this->orderService->updateStatus($order, Order::STATUS_CANCELLED);

        return $this->success($order, 'Order cancelled.');
    }
}
