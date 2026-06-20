<?php

namespace App\Modules\Cart\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddCartItemRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'card_id'  => 'required|integer|exists:cards,id',
            'quantity' => 'required|integer|min:1',
        ];
    }
}
