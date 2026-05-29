<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $fillable = [
        'barcode',
        'name',
        'image_path',
        'category',
        'description',
        'purchase_price',
        'selling_price',
        'stock',
        'min_stock',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'purchase_price' => 'decimal:2',
            'selling_price' => 'decimal:2',
            'stock' => 'integer',
            'min_stock' => 'integer',
            'status' => 'string',
        ];
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function transactionDetails(): HasMany
    {
        return $this->hasMany(TransactionDetail::class);
    }

    public function imageUrl(): string
    {
        if ($this->image_path) {
            return asset('storage/'.$this->image_path);
        }

        return asset('images/product-placeholder.svg');
    }
}
