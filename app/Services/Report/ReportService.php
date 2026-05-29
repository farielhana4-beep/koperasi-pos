<?php

namespace App\Services\Report;

use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Enums\ReportPeriod;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ReportService
{
    public function buildReport(ReportPeriod $period): array
    {
        [$start, $end] = $period->range();
        $transactions = $this->transactionsQuery($start, $end)->get();
        $completedTransactions = $transactions->filter(
            fn (Transaction $transaction) => $transaction->payment_status === PaymentStatus::Paid,
        );

        return [
            'period' => $period->value,
            'period_label' => $period->label(),
            'range' => [
                'start' => $start->toDateTimeString(),
                'end' => $end->toDateTimeString(),
            ],
            'summary' => $this->summaryCards($transactions, $completedTransactions),
            'timeline' => $this->timeline($period, $start, $end, $completedTransactions),
            'payment_methods' => $this->paymentMethods($transactions),
            'top_products' => $this->topProducts($start, $end),
            'low_stock_alerts' => $this->lowStockAlerts(),
            'cashier_performance' => $this->cashierPerformance($start, $end),
        ];
    }

    public function exportDataset(ReportPeriod $period): array
    {
        return $this->buildReport($period);
    }

    public function dailySalesSummary(?Carbon $date = null): array
    {
        $date ??= now();

        $transactions = Transaction::query()
            ->whereDate('created_at', $date)
            ->where('payment_status', PaymentStatus::Paid)
            ->get();

        return [
            'date' => $date->toDateString(),
            'transaction_count' => $transactions->count(),
            'total_sales' => $transactions->sum('total_price'),
        ];
    }

    private function transactionsQuery(Carbon $start, Carbon $end)
    {
        return Transaction::query()
            ->whereBetween('created_at', [$start, $end]);
    }

    private function summaryCards(Collection $transactions, Collection $completedTransactions): array
    {
        $totalRevenue = (float) $completedTransactions->sum('total_price');
        $totalTransactions = $transactions->count();
        $paidCount = $completedTransactions->count();

        return [
            [
                'label' => 'Revenue',
                'value' => $totalRevenue,
                'format' => 'currency',
                'note' => 'Completed transactions in period',
            ],
            [
                'label' => 'Transactions',
                'value' => $totalTransactions,
                'format' => 'number',
                'note' => 'All transactions in selected period',
            ],
            [
                'label' => 'Average Order',
                'value' => $paidCount > 0 ? $totalRevenue / $paidCount : 0,
                'format' => 'currency',
                'note' => 'Average value of paid orders',
            ],
            [
                'label' => 'Low Stock',
                'value' => Product::query()->whereColumn('stock', '<=', 'min_stock')->count(),
                'format' => 'number',
                'note' => 'Products requiring restock',
            ],
        ];
    }

    private function timeline(ReportPeriod $period, Carbon $start, Carbon $end, Collection $transactions): array
    {
        $bucketed = [];

        foreach ($this->periodBuckets($period, $start, $end) as $bucket) {
            $bucketKey = $bucket['key'];
            $bucketed[$bucketKey] = [
                'label' => $bucket['label'],
                'revenue' => 0,
                'transactions' => 0,
            ];
        }

        foreach ($transactions as $transaction) {
            $createdAt = Carbon::parse($transaction->created_at);
            $bucketKey = $this->bucketKey($period, $createdAt);

            if (! isset($bucketed[$bucketKey])) {
                continue;
            }

            $bucketed[$bucketKey]['revenue'] += (float) $transaction->total_price;
            $bucketed[$bucketKey]['transactions'] += 1;
        }

        return array_values($bucketed);
    }

    private function paymentMethods(Collection $transactions): array
    {
        return collect(PaymentMethod::cases())
            ->map(function (PaymentMethod $method) use ($transactions) {
                $items = $transactions->filter(
                    fn (Transaction $transaction) => $transaction->payment_method === $method,
                );

                return [
                    'method' => $method->value,
                    'label' => $method->label(),
                    'count' => $items->count(),
                    'revenue' => (float) $items->where('payment_status', PaymentStatus::Paid)->sum('total_price'),
                ];
            })
            ->values()
            ->all();
    }

    private function topProducts(Carbon $start, Carbon $end): array
    {
        return TransactionDetail::query()
            ->select([
                'products.id as product_id',
                'products.name',
                'products.barcode',
                'products.image_path',
                'products.stock',
                'products.min_stock',
                DB::raw('SUM(transaction_details.quantity) as quantity_sold'),
                DB::raw('SUM(transaction_details.quantity * transaction_details.price) as revenue'),
            ])
            ->join('transactions', 'transactions.id', '=', 'transaction_details.transaction_id')
            ->join('products', 'products.id', '=', 'transaction_details.product_id')
            ->whereBetween('transactions.created_at', [$start, $end])
            ->where('transactions.payment_status', PaymentStatus::Paid)
            ->groupBy(
                'products.id',
                'products.name',
                'products.barcode',
                'products.image_path',
                'products.stock',
                'products.min_stock',
            )
            ->orderByDesc('revenue')
            ->limit(5)
            ->get()
            ->map(fn ($item) => [
                'product_id' => $item->product_id,
                'name' => $item->name,
                'barcode' => $item->barcode,
                'image_url' => $item->image_path ? asset('storage/'.$item->image_path) : asset('images/product-placeholder.svg'),
                'quantity_sold' => (int) $item->quantity_sold,
                'revenue' => (float) $item->revenue,
                'stock' => (int) $item->stock,
                'min_stock' => (int) $item->min_stock,
            ])
            ->values()
            ->all();
    }

    private function lowStockAlerts(): array
    {
        return Product::query()
            ->whereColumn('stock', '<=', 'min_stock')
            ->orderByRaw('(min_stock - stock) DESC')
            ->limit(8)
            ->get()
            ->map(fn (Product $product) => [
                'id' => $product->id,
                'name' => $product->name,
                'barcode' => $product->barcode,
                'stock' => $product->stock,
                'min_stock' => $product->min_stock,
                'shortage' => max($product->min_stock - $product->stock, 0),
                'image_url' => $product->imageUrl(),
            ])
            ->values()
            ->all();
    }

    private function cashierPerformance(Carbon $start, Carbon $end): array
    {
        return Transaction::query()
            ->select([
                'users.id as user_id',
                'users.name',
                DB::raw('COUNT(transactions.id) as transaction_count'),
                DB::raw("SUM(CASE WHEN transactions.payment_status = 'paid' THEN transactions.total_price ELSE 0 END) as revenue"),
                DB::raw("SUM(CASE WHEN transactions.payment_status = 'paid' THEN 1 ELSE 0 END) as completed_count"),
            ])
            ->join('users', 'users.id', '=', 'transactions.user_id')
            ->whereBetween('transactions.created_at', [$start, $end])
            ->groupBy('users.id', 'users.name')
            ->orderByDesc('revenue')
            ->get()
            ->map(fn ($item) => [
                'user_id' => $item->user_id,
                'name' => $item->name,
                'transaction_count' => (int) $item->transaction_count,
                'completed_count' => (int) $item->completed_count,
                'revenue' => (float) $item->revenue,
            ])
            ->values()
            ->all();
    }

    private function periodBuckets(ReportPeriod $period, Carbon $start, Carbon $end): array
    {
        $buckets = [];

        if ($period === ReportPeriod::Daily) {
            for ($hour = 0; $hour < 24; $hour++) {
                $current = $start->copy()->setHour($hour)->startOfHour();
                $buckets[] = [
                    'key' => $current->format('Y-m-d-H'),
                    'label' => $current->format('H:00'),
                ];
            }

            return $buckets;
        }

        foreach (CarbonPeriod::create($start->copy()->startOfDay(), $end->copy()->startOfDay()) as $date) {
            $buckets[] = [
                'key' => $date->format('Y-m-d'),
                'label' => $period->bucketLabel($date),
            ];
        }

        return $buckets;
    }

    private function bucketKey(ReportPeriod $period, Carbon $date): string
    {
        return match ($period) {
            ReportPeriod::Daily => $date->format('Y-m-d-H'),
            default => $date->format('Y-m-d'),
        };
    }
}
