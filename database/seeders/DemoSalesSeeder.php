<?php

namespace Database\Seeders;

use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DemoSalesSeeder extends Seeder
{
    public function run(): void
    {
        $cashier = User::query()->where('email', 'kasir@koperasi.test')->first();
        $admin = User::query()->where('email', 'admin@koperasi.test')->first();

        if (! $cashier || ! $admin) {
            return;
        }

        $products = Product::query()->orderBy('name')->get()->keyBy('barcode');

        $sales = [
            [
                'user' => $cashier,
                'method' => PaymentMethod::Cash,
                'status' => PaymentStatus::Paid,
                'items' => [
                    ['barcode' => '8991234000011', 'qty' => 3],
                    ['barcode' => '8991234000042', 'qty' => 2],
                ],
                'time' => now()->subHours(2),
            ],
            [
                'user' => $cashier,
                'method' => PaymentMethod::Qris,
                'status' => PaymentStatus::Pending,
                'items' => [
                    ['barcode' => '8991234000028', 'qty' => 2],
                    ['barcode' => '8991234000127', 'qty' => 1],
                ],
                'time' => now()->subHour(),
            ],
            [
                'user' => $admin,
                'method' => PaymentMethod::Cash,
                'status' => PaymentStatus::Paid,
                'items' => [
                    ['barcode' => '8991234000073', 'qty' => 4],
                    ['barcode' => '8991234000080', 'qty' => 10],
                ],
                'time' => now()->subDay(),
            ],
        ];

        foreach ($sales as $index => $sale) {
            DB::transaction(function () use ($sale, $products, $index) {
                $invoice = 'INV-DEMO-'.now()->format('Ymd').'-'.($index + 1);
                $transaction = Transaction::query()->updateOrCreate(
                    ['invoice_number' => $invoice],
                    [
                        'user_id' => $sale['user']->id,
                        'total_price' => 0,
                        'payment_method' => $sale['method'],
                        'payment_status' => $sale['status'],
                        'midtrans_snap_token' => $sale['method'] === PaymentMethod::Qris ? 'demo-snap-token-'.$invoice : null,
                    ],
                );

                $transaction->details()->delete();

                $total = 0;

                foreach ($sale['items'] as $item) {
                    $product = $products->get($item['barcode']);

                    if (! $product) {
                        continue;
                    }

                    $subtotal = (float) $product->selling_price * $item['qty'];
                    $total += $subtotal;

                    $transaction->details()->create([
                        'product_id' => $product->id,
                        'quantity' => $item['qty'],
                        'price' => $product->selling_price,
                    ]);
                }

                $transaction->forceFill([
                    'total_price' => $total,
                    'created_at' => $sale['time'],
                    'updated_at' => $sale['time'],
                ])->save();
            });
        }
    }
}
