<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class DemoCatalogSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            ['barcode' => '8991234000011', 'name' => 'Mineral Water 600ml', 'purchase_price' => 2000, 'selling_price' => 3500, 'stock' => 120, 'min_stock' => 20],
            ['barcode' => '8991234000028', 'name' => 'Iced Tea Bottle', 'purchase_price' => 3500, 'selling_price' => 6000, 'stock' => 84, 'min_stock' => 18],
            ['barcode' => '8991234000035', 'name' => 'Chocolate Milk', 'purchase_price' => 5000, 'selling_price' => 8500, 'stock' => 54, 'min_stock' => 12],
            ['barcode' => '8991234000042', 'name' => 'Seaweed Snack', 'purchase_price' => 2500, 'selling_price' => 4500, 'stock' => 38, 'min_stock' => 15],
            ['barcode' => '8991234000059', 'name' => 'Potato Chips', 'purchase_price' => 4500, 'selling_price' => 7500, 'stock' => 22, 'min_stock' => 14],
            ['barcode' => '8991234000066', 'name' => 'Fried Rice Cup', 'purchase_price' => 8000, 'selling_price' => 12500, 'stock' => 16, 'min_stock' => 8],
            ['barcode' => '8991234000073', 'name' => 'School Notebook', 'purchase_price' => 4000, 'selling_price' => 7000, 'stock' => 48, 'min_stock' => 10],
            ['barcode' => '8991234000080', 'name' => 'Gel Pen Blue', 'purchase_price' => 1500, 'selling_price' => 3000, 'stock' => 95, 'min_stock' => 25],
            ['barcode' => '8991234000097', 'name' => 'Soap Bar', 'purchase_price' => 3000, 'selling_price' => 5500, 'stock' => 19, 'min_stock' => 10],
            ['barcode' => '8991234000103', 'name' => 'Tissue Pack', 'purchase_price' => 2500, 'selling_price' => 5000, 'stock' => 12, 'min_stock' => 12],
            ['barcode' => '8991234000110', 'name' => 'Orange Juice', 'purchase_price' => 5500, 'selling_price' => 9000, 'stock' => 31, 'min_stock' => 10],
            ['barcode' => '8991234000127', 'name' => 'Cookies Jar', 'purchase_price' => 9000, 'selling_price' => 14500, 'stock' => 27, 'min_stock' => 9],
        ];

        foreach ($products as $product) {
            Product::query()->updateOrCreate(
                ['barcode' => $product['barcode']],
                $product,
            );
        }
    }
}
