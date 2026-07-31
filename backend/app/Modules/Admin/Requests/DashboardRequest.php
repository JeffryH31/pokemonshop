<?php

namespace App\Modules\Admin\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DashboardRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    protected function prepareForValidation(): void
    {
        // Default to the last 30 days when no range is provided
        $this->merge([
            'start_date' => $this->input('start_date', now()->subDays(30)->format('Y-m-d')),
            'end_date'   => $this->input('end_date', now()->format('Y-m-d')),
        ]);
    }

    public function rules(): array
    {
        return [
            'start_date' => 'required|date_format:Y-m-d',
            'end_date'   => 'required|date_format:Y-m-d|after_or_equal:start_date',
        ];
    }
}
