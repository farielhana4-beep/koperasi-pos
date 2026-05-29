<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        $users = User::query()
            ->orderBy('name')
            ->get()
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role instanceof UserRole ? $user->role->value : $user->role,
                'role_label' => $user->role instanceof UserRole ? $user->role->label() : UserRole::tryFrom((string) $user->role)?->label() ?? ucfirst((string) $user->role),
                'created_at' => optional($user->created_at)?->format('d M Y H:i'),
            ])
            ->values();

        return Inertia::render('Users/Index', [
            'users' => $users,
        ]);
    }
}
