<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        @php
            $frontendSettings = app(\App\Services\Settings\SettingsService::class)->frontend();
        @endphp

        <title inertia>{{ $frontendSettings['branding']['app_name'] ?? config('app.name', 'Laravel') }}</title>
        <link rel="icon" href="{{ $frontendSettings['branding']['favicon_url'] ?? asset('favicon.svg') }}">
        <meta name="theme-color" content="#020617">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx'])
        @inertiaHead
    </head>
    <body class="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased">
        @inertia
    </body>
</html>
