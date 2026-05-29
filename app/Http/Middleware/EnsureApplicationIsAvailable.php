<?php

namespace App\Http\Middleware;

use App\Services\Settings\SettingsService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureApplicationIsAvailable
{
    public function __construct(
        private readonly SettingsService $settings,
    ) {
    }

    public function handle(Request $request, Closure $next): Response
    {
        if (
            $request->is('maintenance') ||
            $request->is('login') ||
            $request->is('register') ||
            $request->is('forgot-password') ||
            $request->is('reset-password*') ||
            $request->is('confirm-password') ||
            $request->is('email/verification-notification') ||
            $request->is('verify-email*') ||
            $request->is('logout')
        ) {
            return $next($request);
        }

        if ($this->settings->boolean('system_maintenance_enabled')) {
            if (! $request->user()?->isSuperAdmin()) {
                return redirect()->route('maintenance');
            }
        }

        return $next($request);
    }
}
