<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->decimal('subtotal_price', 12, 2)->default(0)->after('invoice_number');
            $table->decimal('tax_price', 12, 2)->default(0)->after('subtotal_price');
            $table->decimal('discount_price', 12, 2)->default(0)->after('tax_price');
            $table->decimal('cash_received', 12, 2)->nullable()->after('midtrans_snap_token');
            $table->decimal('change_amount', 12, 2)->default(0)->after('cash_received');
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn([
                'subtotal_price',
                'tax_price',
                'discount_price',
                'cash_received',
                'change_amount',
            ]);
        });
    }
};
