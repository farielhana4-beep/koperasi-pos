<?php

namespace App\Services\POS;

use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Transaction;
use App\Models\User;

class TransactionService
{
    public function createDraft(User $kasir): Transaction
    {
        return Transaction::query()->create([
            'invoice_number' => 'INV-'.now()->format('YmdHis').'-'.$kasir->id,
            'user_id' => $kasir->id,
            'total_price' => 0,
            'payment_method' => PaymentMethod::Cash,
            'payment_status' => PaymentStatus::Pending,
        ]);
    }
}
