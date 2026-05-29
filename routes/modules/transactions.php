<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'role:kasir,super_admin'])
    ->prefix('transactions')
    ->name('transactions.')
    ->group(function () {
        Route::get('/', fn () => Inertia::render('Transactions/Index'))->name('index');
    });
