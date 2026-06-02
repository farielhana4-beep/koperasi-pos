<?php

namespace App\Http\Controllers;

use App\Enums\PaymentStatus;
use App\Models\Transaction;
use App\Services\Settings\SettingsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;

class MidtransWebhookController extends Controller
{
    public function store(Request $request, SettingsService $settings): JsonResponse
    {
        $payload = $request->all();
        $orderId = (string) ($payload['order_id'] ?? '');
        $signatureKey = (string) ($payload['signature_key'] ?? '');

        if ($orderId === '') {
            return response()->json(['message' => 'Missing order_id.'], 422);
        }

        $transaction = Transaction::query()->where('invoice_number', $orderId)->first();

        if (! $transaction) {
            return response()->json(['message' => 'Transaction not found.'], 404);
        }

        $serverKey = $settings->midtrans()['server_key'];
        if (blank($serverKey)) {
            throw new RuntimeException('Midtrans server key is not configured.');
        }

        $expectedSignature = hash('sha512', implode('', [
            $orderId,
            (string) ($payload['status_code'] ?? ''),
            (string) ($payload['gross_amount'] ?? ''),
            $serverKey,
        ]));

        if ($signatureKey !== '' && ! hash_equals($expectedSignature, $signatureKey)) {
            return response()->json(['message' => 'Invalid signature.'], 403);
        }

        $status = (string) ($payload['transaction_status'] ?? 'pending');
        $fraudStatus = (string) ($payload['fraud_status'] ?? '');
        $grossAmount = (float) ($payload['gross_amount'] ?? $transaction->total_price);

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
            'total_price' => $grossAmount,
        ])->save();

        return response()->json([
            'message' => 'Webhook processed.',
            'invoice_number' => $transaction->invoice_number,
            'payment_status' => $transaction->payment_status->value,
            'app' => $settings->frontend()['branding']['app_name'] ?? config('app.name'),
        ]);
    }
}
