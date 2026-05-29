<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('category', 100)->nullable()->after('name');
            $table->text('description')->nullable()->after('image_path');
            $table->string('status', 20)->default('active')->after('min_stock');
        });

        DB::table('products')->update(['status' => 'active']);
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['category', 'description', 'status']);
        });
    }
};
