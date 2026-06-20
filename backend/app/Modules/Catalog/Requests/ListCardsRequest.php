<?php

namespace App\Modules\Catalog\Requests;

use App\Modules\Catalog\Models\Card;
use Illuminate\Foundation\Http\FormRequest;

class ListCardsRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'      => 'sometimes|string|max:100',
            'set'       => 'sometimes|integer|exists:sets,id',
            'rarity'    => 'sometimes|string|in:' . implode(',', Card::RARITIES),
            'condition' => 'sometimes|string|in:' . implode(',', Card::CONDITIONS),
            'price_min' => 'sometimes|numeric|min:0',
            'price_max' => 'sometimes|numeric|min:0|gte:price_min',
        ];
    }
}
