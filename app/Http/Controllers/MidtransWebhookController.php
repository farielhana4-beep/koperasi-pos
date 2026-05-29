<?php

namespace App\Http\Controllers;

use App\Enums\PaymentStatus;
use App\Models\Transaction;
use App\Services\Settings\SettingsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MidtransWebhookController extends Controller
{
    public function store(Request $request, SettingsService $settings): JsonResponse
    {
        $payload = $request->all();
        $orderId = (string) ($payload['order_id'] ?? '');

        if ($orderId === '') {
            return response()->json(['message' => 'Missing order_id.'], 422);
        }

        $transaction = Transaction::query()->where('invoice_number', $orderId)->first();

        if (! $transaction) {
            return response()->json(['message' => 'Transaction not found.'], 404);
        }

        $status = (string) ($payload['transaction_status'] ?? 'pending');
        $fraudStatus = (string) ($payload['fraud_status'] ?? '');

        $nextStatus = match ($status) {
            'settlement', 'capture' => $fraudStatus === 'challenge'
                ? PaymentStatus::Pending
                : PaymentStatus::Paid,
            'pending' => PaymentStatus::Pending,
            'deny', 'cancel' => PaymentStatus::Canceled,
            'expire' => PaymentStatus::Expired,
            default => PaymentStatus::Failed,
        };

        $transaction->forceFill([
            'payment_status' => $nextStatus,
            'midtrans_snap_token' => $transaction->midtrans_snap_token ?: ($payload['token'] ?? null),
        ])->save();

        return response()->json([
            'message' => 'Webhook processed.',
            'invoice_number' => $transaction->invoice_number,
            'payment_status' => $transaction->payment_status->value,
            'app' => $settings->frontend()['branding']['app_name'] ?? config('app.name'),
        ]);
    }
}
