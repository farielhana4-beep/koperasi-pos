<?php

namespace App\Services\POS;

use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Str;

class TransactionService
{
    public function createDraft(User $kasir): Transaction
    {
        return Transaction::query()->create([
            'invoice_number' => sprintf(
                'INV-%s-%s-%s',
                now()->format('YmdHis'),
                $kasir->id,
                Str::upper(Str::random(6)),
            ),
            'user_id' => $kasir->id,
            'subtotal_price' => 0,
            'tax_price' => 0,
            'discount_price' => 0,
            'total_price' => 0,
            'payment_method' => PaymentMethod::Cash,
            'payment_status' => PaymentStatus::Pending,
            'cash_received' => null,
            'change_amount' => 0,
        ]);
    }
}
