<?php

namespace App\Modules\User\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\HttpResponse;
use App\Modules\User\Requests\LoginRequest;
use App\Modules\User\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    use HttpResponse;

    public function __construct(private AuthService $authService) {}

    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->login($request->only('email', 'password'));

        if (!$result) {
            return $this->error('Invalid credentials.', 401);
        }

        return $this->success([
            'token' => $result['token'],
            'user'  => $result['user'],
        ], 'Login successful.');
    }

    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout();

        return $this->success(null, 'Logged out successfully.');
    }

    public function me(Request $request): JsonResponse
    {
        $user = auth('api')->user();

        return $this->success([
            'id'    => $user->id,
            'name'  => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'role'  => $user->role,
        ]);
    }
}
