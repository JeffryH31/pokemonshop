<?php

namespace App\Modules\User\Services;

class AuthService
{
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

    private function formatUser($user): array
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
