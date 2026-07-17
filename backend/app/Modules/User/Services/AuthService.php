<?php

namespace App\Modules\User\Services;

use App\Modules\User\Models\User;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthService
{
    public function register(array $data): array
    {
        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'phone'    => $data['phone'] ?? null,
            'password' => $data['password'],
            'role'     => 'customer',
        ]);

        $token = JWTAuth::fromUser($user);

        return [
            'token' => $token,
            'user'  => $this->formatUser($user),
        ];
    }

    public function login(array $credentials): ?array
    {
        $token = auth('api')->attempt($credentials);

        if (!$token) {
            return null;
        }

        return [
            'token' => $token,
            'user'  => $this->formatUser(auth('api')->user()),
        ];
    }

    public function logout(): void
    {
        auth('api')->logout();
    }

    public function updateProfile(User $user, array $data): User
    {
        $updateData = array_filter([
            'name'  => $data['name'] ?? null,
            'email' => $data['email'] ?? null,
            'phone' => array_key_exists('phone', $data) ? $data['phone'] : null,
        ], fn($v, $k) => $k === 'phone' ? array_key_exists('phone', $data) : !is_null($v), ARRAY_FILTER_USE_BOTH);

        if (!empty($data['password'])) {
            $updateData['password'] = $data['password'];
        }

        $user->update($updateData);

        return $user->fresh();
    }

    private function formatUser(User $user): array
    {
        return [
            'id'    => $user->id,
            'name'  => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'role'  => $user->role,
        ];
    }
}
