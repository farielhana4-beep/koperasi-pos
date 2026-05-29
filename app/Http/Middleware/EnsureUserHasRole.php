<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();
        $role = UserRole::resolve($user?->role)->value;

        if (! $user) {
            return $this->unauthenticatedResponse($request);
        }

        $allowedRoles = array_map(
            fn (string $allowedRole) => strtolower(trim($allowedRole)),
            $roles,
        );

        if (! in_array($role, $allowedRoles, true)) {
            return $this->unauthorizedResponse($request, $user);
        }

        return $next($request);
    }

    private function unauthorizedResponse(Request $request, $user): Response|RedirectResponse|JsonResponse
    {
        if ($request->expectsJson()) {
            abort(403, 'Unauthorized action.');
        }

        return redirect()->route(UserRole::homeRouteFor($user?->role));
    }

    private function unauthenticatedResponse(Request $request): Response|RedirectResponse|JsonResponse
    {
        if ($request->expectsJson()) {
            abort(401, 'Unauthenticated.');
        }

        return redirect()->route('login');
    }
}
