<?php

namespace App\Modules\User\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\HttpResponse;
use App\Modules\User\Requests\LoginRequest;
use App\Modules\User\Requests\RegisterRequest;
use App\Modules\User\Requests\UpdateProfileRequest;
use App\Modules\User\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    use HttpResponse;

    public function __construct(private AuthService $authService) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        $result = $this->authService->register($request->validated());

        return $this->success([
            'token' => $result['token'],
            'user'  => $result['user'],
        ], 'Registration successful.', 201);
    }

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
            'role'  => $user->role,
        ]);
    }

    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        $user    = auth('api')->user();
        $updated = $this->authService->updateProfile($user, $request->validated());

        return $this->success([
            'id'    => $updated->id,
            'name'  => $updated->name,
            'email' => $updated->email,
            'role'  => $updated->role,
        ], 'Profile updated.');
    }
}
