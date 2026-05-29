<?php

namespace App\Services\Payment;

use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Transaction;
use App\Services\Settings\SettingsService;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class MidtransService
{
    public function __construct(
        private readonly SettingsService $settings,
    ) {
    }

    public function createQrisPayment(Transaction $transaction): array
    {
        $config = $this->settings->midtrans();

        if (blank($config['server_key'])) {
            throw new RuntimeException('Midtrans server key is not configured.');
        }

        $response = Http::withBasicAuth($config['server_key'], '')
            ->acceptJson()
            ->asJson()
            ->post($config['snap_url'].'/transactions', [
                'transaction_details' => [
                    'order_id' => $transaction->invoice_number,
                    'gross_amount' => (int) round((float) $transaction->total_price),
                ],
                'payment_type' => 'qris',
                'customer_details' => [
                    'first_name' => $transaction->user->name,
                    'email' => $transaction->user->email,
                ],
            ]);

        if (! $response->successful()) {
            throw new RuntimeException('Unable to create Midtrans payment token.');
        }

        $transaction->forceFill([
            'payment_method' => PaymentMethod::Qris,
            'payment_status' => PaymentStatus::Pending,
            'midtrans_snap_token' => $response->json('token'),
        ])->save();

        return $response->json();
    }
}
