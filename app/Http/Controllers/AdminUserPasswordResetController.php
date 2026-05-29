<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\User;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;

class AdminUserPasswordResetController extends Controller
{
    public function store(Request $request, User $user): RedirectResponse
    {
        $actor = $request->user();

        if (! $actor || ! $actor->isSuperAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        if ($actor->id === $user->id && $user->isSuperAdmin()) {
            abort(422, 'Super admin passwords must be reset by another super admin.');
        }

        $token = Password::broker()->createToken($user);
        $user->notify(new ResetPasswordNotification($token));

        $scope = $user->role instanceof UserRole ? $user->role->label() : 'User';

        return back()->with('status', "{$scope} password reset link sent to {$user->email}.");
    }
}
