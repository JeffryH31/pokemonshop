<?php

namespace App\Modules\User\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'     => 'sometimes|string|min:1|max:100',
            'email'    => 'sometimes|email:rfc|unique:users,email,' . auth('api')->id() . '|max:255',
            'phone'    => 'sometimes|nullable|string|max:20',
            'password' => 'sometimes|string|min:8|max:128',
        ];
    }
}
