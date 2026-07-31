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
            'category'  => 'sometimes|string|in:' . implode(',', Card::CATEGORIES),
            'min_price' => 'sometimes|numeric|min:0',
            'max_price' => 'sometimes|numeric|min:0',
            'per_page'  => 'sometimes|integer|min:1|max:100',
            'page'      => 'sometimes|integer|min:1',
            'sort'      => 'sometimes|string|in:newest,price_asc,price_desc,name_asc',
        ];
    }
}
