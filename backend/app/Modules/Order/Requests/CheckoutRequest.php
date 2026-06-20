<?php

namespace App\Modules\Order\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckoutRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'recipient_name' => 'required|string|min:1|max:100',
            'street_address' => 'required|string|min:1',
            'city'           => 'required|string|min:1',
            'postal_code'    => 'required|digits_between:5,10',
        ];
    }
}
