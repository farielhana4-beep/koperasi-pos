import Modal from '@/Components/Modal';

function formatCurrency(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(value ?? 0));
}

export default function ProductDetailModal({ show, product, onClose, onAdd }) {
    if (!product) {
        return null;
    }

    const profit = Number(product.selling_price ?? 0) - Number(product.purchase_price ?? 0);
    const isCritical = product.stock_status === 'critical';
    const isWarning = product.stock_status === 'warning';

    return (
        <Modal show={show} maxWidth="2xl" closeable onClose={onClose}>
            <div className="bg-slate-950 text-white">
                <div className="border-b border-white/10 px-6 py-5">
                    <div className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
                        Product Detail
                    </div>
                    <h3 className="mt-2 text-lg font-semibold">{product.name ?? '-'}</h3>
                    <p className="mt-1 text-sm text-slate-400">{product.barcode ?? '-'}</p>
                </div>

                <div className="grid gap-6 px-6 py-6 lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04]">
                        <img
                            src={product.image_url}
                            alt={product.name ?? 'Product image'}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                                    Purchase Price
                                </div>
                                <div className="mt-2 text-lg font-semibold text-white">
                                    {formatCurrency(product.purchase_price)}
                                </div>
                            </div>
                            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                                    Selling Price
                                </div>
                                <div className="mt-2 text-lg font-semibold text-cyan-300">
                                    {formatCurrency(product.selling_price)}
                                </div>
                            </div>
                            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                                    Profit / Item
                                </div>
                                <div className="mt-2 text-lg font-semibold text-emerald-300">
                                    {formatCurrency(profit)}
                                </div>
                            </div>
                            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                                    Current Stock
                                </div>
                                <div className="mt-2 text-lg font-semibold text-white">
                                    {Number(product.stock ?? 0)}
                                </div>
                            </div>
                        </div>

                        <div
                            className={`rounded-[28px] border p-4 text-sm leading-6 ${
                                isCritical
                                    ? 'border-red-400/20 bg-red-400/10 text-red-100'
                                    : isWarning
                                        ? 'border-amber-400/20 bg-amber-400/10 text-amber-100'
                                        : 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100'
                            }`}
                        >
                            <div className="font-semibold">
                                {isCritical
                                    ? 'Critical stock warning'
                                    : isWarning
                                        ? 'Stock is running low'
                                        : 'Stock level is healthy'}
                            </div>
                            <p className="mt-2">
                                {isCritical
                                    ? 'This item is at or below minimum stock and should not be sold without review.'
                                    : isWarning
                                        ? 'This item is close to its minimum threshold.'
                                        : 'This item is currently safe to sell.'}
                            </p>
                        </div>

                        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-300">
                            <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                                Category
                            </div>
                            <div className="mt-2 font-semibold text-white">
                                {product.category ?? 'Uncategorized'}
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                onClick={() => onAdd?.(product)}
                                disabled={Number(product.stock ?? 0) <= 0}
                                className="rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
