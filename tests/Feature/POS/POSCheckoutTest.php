<?php

namespace Tests\Feature\POS;

use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class POSCheckoutTest extends TestCase
{
    use RefreshDatabase;

    public function test_kasir_can_view_pos_page_with_products(): void
    {
        $user = User::factory()->create();

        Product::query()->create([
            'barcode' => '8991111111111',
            'name' => 'Stationery Set',
            'purchase_price' => 5000,
            'selling_price' => 7500,
            'stock' => 25,
            'min_stock' => 5,
        ]);

        $this->actingAs($user)
            ->get(route('pos.index'))
            ->assertOk();
    }

    public function test_cash_checkout_saves_transaction_and_reduces_stock(): void
    {
        $user = User::factory()->create();

        $product = Product::query()->create([
            'barcode' => '8992222222222',
            'name' => 'Notebook',
            'purchase_price' => 4000,
            'selling_price' => 6000,
            'stock' => 10,
            'min_stock' => 3,
        ]);

        $this->actingAs($user)
            ->post(route('pos.checkout'), [
                'payment_method' => PaymentMethod::Cash->value,
                'cash_received' => 20000,
                'items' => [
                    [
                        'product_id' => $product->id,
                        'quantity' => 2,
                    ],
                ],
            ])
            ->assertRedirect(route('pos.index'));

        $transaction = Transaction::query()->firstOrFail();

        $this->assertSame(PaymentMethod::Cash, $transaction->payment_method);
        $this->assertSame(PaymentStatus::Paid, $transaction->payment_status);
        $this->assertSame('12000.00', (string) $transaction->total_price);
        $this->assertDatabaseHas('transaction_details', [
            'transaction_id' => $transaction->id,
            'product_id' => $product->id,
            'quantity' => 2,
        ]);
        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'stock' => 8,
        ]);
    }

    public function test_qris_checkout_saves_pending_transaction_with_placeholder_token(): void
    {
        $user = User::factory()->create();

        $product = Product::query()->create([
            'barcode' => '8993333333333',
            'name' => 'Pen',
            'purchase_price' => 1000,
            'selling_price' => 2000,
            'stock' => 20,
            'min_stock' => 5,
        ]);

        $this->actingAs($user)
            ->post(route('pos.checkout'), [
                'payment_method' => PaymentMethod::Qris->value,
                'items' => [
                    [
                        'product_id' => $product->id,
                        'quantity' => 3,
                    ],
                ],
            ])
            ->assertRedirect(route('pos.index'));

        $transaction = Transaction::query()->firstOrFail();

        $this->assertSame(PaymentMethod::Qris, $transaction->payment_method);
        $this->assertSame(PaymentStatus::Pending, $transaction->payment_status);
        $this->assertStringStartsWith('qris-placeholder-', (string) $transaction->midtrans_snap_token);
        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'stock' => 17,
        ]);
    }
}
