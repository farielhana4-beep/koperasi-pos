<?php

use App\Http\Controllers\Api\PosApiController;
use App\Models\Transaction;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['web', 'auth', 'verified', 'role:kasir,super_admin'])
    ->group(function () {
        Route::get('/pos/products', [PosApiController::class, 'index'])->name('api.pos.products');
        Route::post('/pos/checkout', [PosApiController::class, 'checkout'])->name('api.pos.checkout');

        Route::get('/transactions/recent', function () {
            return response()->json([
                'recentTransactions' => Transaction::query()
                    ->with('user:id,name')
                    ->latest()
                    ->limit(8)
                    ->get()
                    ->map(fn (Transaction $transaction) => [
                        'invoice_number' => $transaction->invoice_number,
                        'cashier_name' => $transaction->user?->name,
                        'payment_method' => $transaction->payment_method->value,
                        'payment_status' => $transaction->payment_status->value,
                        'total_price' => (float) $transaction->total_price,
                        'created_at' => $transaction->created_at?->format('d M H:i'),
                    ])
                    ->values(),
            ]);
        })->name('api.transactions.recent');
    });
