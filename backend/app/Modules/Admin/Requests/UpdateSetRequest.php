<?php

namespace App\Modules\Admin\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSetRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'        => 'sometimes|string|min:1|max:255|unique:sets,name,' . $this->route('id'),
            'description' => 'nullable|string',
        ];
    }
}
