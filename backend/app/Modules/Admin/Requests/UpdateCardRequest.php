<?php

namespace App\Modules\Admin\Requests;

use App\Modules\Catalog\Models\Card;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCardRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'        => 'sometimes|string|min:1|max:255',
            'category'    => 'sometimes|string|in:' . implode(',', Card::CATEGORIES),
            'price'       => 'sometimes|numeric|gt:0',
            'stock'       => 'sometimes|integer|min:0',
            'description' => 'nullable|string',
            'image_url'   => 'nullable|url',
        ];
    }
}
