<?php

namespace App\Modules\Admin\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderStatusRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'status'          => 'required|in:pending_payment,paid,processing,shipped,delivered,cancelled,expired',
            'tracking_number' => 'required_if:status,shipped|nullable|string|min:1|max:100',
        ];
    }
}
