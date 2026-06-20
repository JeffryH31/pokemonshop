<?php

namespace App\Modules\Admin\Requests;

use App\Modules\Catalog\Models\Card;
use Illuminate\Foundation\Http\FormRequest;

class CreateCardRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'set_id'      => 'required|integer|exists:sets,id',
            'name'        => 'required|string|min:1|max:255',
            'rarity'      => 'required|string|in:' . implode(',', Card::RARITIES),
            'condition'   => 'required|string|in:' . implode(',', Card::CONDITIONS),
            'price'       => 'required|numeric|gt:0',
            'stock'       => 'required|integer|min:0',
            'description' => 'nullable|string',
            'image_url'   => 'nullable|url',
        ];
    }
}
