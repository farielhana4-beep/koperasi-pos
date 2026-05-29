<?php

use App\Enums\UserRole;
use App\Http\Controllers\ProfileController;
use App\Enums\ReportPeriod;
use App\Enums\PaymentStatus;
use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (! auth()->check()) {
        return redirect()->route('login');
    }

    $user = auth()->user();

    return redirect()->route(UserRole::homeRouteFor($user?->role));
});

Route::get('/dashboard', function () {
    $report = app(\App\Services\Report\ReportService::class)->buildReport(ReportPeriod::Weekly);

    return Inertia::render('Dashboard', [
        'report' => $report,
        'metrics' => [
            'today_revenue' => Transaction::query()->whereDate('created_at', today())->where('payment_status', PaymentStatus::Paid->value)->sum('total_price'),
            'today_transactions' => Transaction::query()->whereDate('created_at', today())->count(),
            'low_stock_products' => Product::query()->whereColumn('stock', '<=', 'min_stock')->count(),
            'pending_qris' => Transaction::query()->where('payment_method', 'qris')->where('payment_status', PaymentStatus::Pending->value)->count(),
        ],
        'recentTransactions' => Transaction::query()
            ->with('user:id,name')
            ->latest()
            ->limit(6)
            ->get()
            ->map(fn (Transaction $transaction) => [
                'invoice_number' => $transaction->invoice_number,
                'cashier_name' => $transaction->user?->name,
                'payment_status' => $transaction->payment_status->value,
                'payment_method' => $transaction->payment_method->value,
                'total_price' => (float) $transaction->total_price,
                'created_at' => $transaction->created_at?->format('d M H:i'),
            ]),
    ]);
})->middleware(['auth', 'verified', 'role:super_admin'])->name('dashboard');

Route::get('/maintenance', function () {
    return Inertia::render('Maintenance', [
        'branding' => app(\App\Services\Settings\SettingsService::class)->frontend()['branding'],
    ]);
})->name('maintenance');

Route::post('/payments/midtrans/webhook', [\App\Http\Controllers\MidtransWebhookController::class, 'store'])
    ->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class]);

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
require __DIR__.'/modules/transactions.php';
require __DIR__.'/modules/products.php';
require __DIR__.'/modules/pos.php';
require __DIR__.'/modules/reports.php';
require __DIR__.'/modules/users.php';
require __DIR__.'/modules/settings.php';
