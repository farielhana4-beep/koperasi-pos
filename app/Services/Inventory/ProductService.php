<?php

namespace App\Services\Inventory;

use App\Models\Product;

class ProductService
{
    public function listActive()
    {
        return Product::query()
            ->where('stock', '>', 0)
            ->orderBy('name')
            ->get();
    }
}
