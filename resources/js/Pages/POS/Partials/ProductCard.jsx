const PLACEHOLDER_IMAGE = '/images/product-placeholder.svg';

function StockBadge({ stockStatus, stock }) {
    const safeStock = Number(stock ?? 0);

    if (stockStatus === 'critical') {
        return (
            <span className="rounded-full border border-red-400/20 bg-red-400/10 px-2.5 py-1 text-[11px] font-medium text-red-300">
                Low Stock
            </span>
        );
    }

    if (stockStatus === 'warning') {
        return (
            <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-[11px] font-medium text-amber-300">
                Watch Stock
            </span>
        );
    }

    return (
        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
            {safeStock} Left
        </span>
    );
}

function formatCurrency(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(value ?? 0));
}

export default function ProductCard({ product, onAdd, onPreview }) {
    if (!product) {
        return null;
    }

    const isOutOfStock = Number(product.stock ?? 0) <= 0;

    return (
        <div
            role="button"
            tabIndex={0}
            aria-disabled={isOutOfStock}
            onClick={() => !isOutOfStock && onAdd(product)}
            onKeyDown={(event) => {
                if (
                    !isOutOfStock &&
                    (event.key === 'Enter' || event.key === ' ')
                ) {
                    event.preventDefault();
                    onAdd(product);
                }
            }}
            className={`group flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/80 text-left shadow-2xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/25 hover:bg-slate-900 ${
                isOutOfStock ? 'cursor-not-allowed opacity-55' : 'cursor-pointer'
            }`}
        >
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
                <img
                    src={product.image_url || PLACEHOLDER_IMAGE}
                    alt={product.name ?? 'Product image'}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/10 bg-slate-950/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-200">
                        {product.category ?? 'Uncategorized'}
                    </span>
                </div>

                <div className="absolute right-4 top-4">
                    <StockBadge stockStatus={product.stock_status} stock={product.stock} />
                </div>

                <button
                    type="button"
                    onClick={(event) => {
                        event.stopPropagation();
                        onPreview(product);
                    }}
                    className="absolute bottom-4 right-4 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur transition hover:bg-white/20"
                >
                    Preview
                </button>
            </div>

            <div className="flex flex-1 flex-col gap-4 p-5">
                <div className="space-y-1">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                        {product.barcode ?? '-'}
                    </div>
                    <div className="line-clamp-2 text-lg font-semibold text-white">
                        {product.name ?? 'Unnamed product'}
                    </div>
                    <div className="text-sm text-slate-400">
                        Tap to add to cart or preview details.
                    </div>
                </div>

                <div className="mt-auto flex items-end justify-between gap-3">
                    <div>
                        <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                            Selling Price
                        </div>
                        <div className="mt-1 text-lg font-semibold text-cyan-300">
                            {formatCurrency(product.selling_price)}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right">
                        <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                            Stock
                        </div>
                        <div className="mt-1 text-sm font-semibold text-white">
                            {Number(product.stock ?? 0)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
