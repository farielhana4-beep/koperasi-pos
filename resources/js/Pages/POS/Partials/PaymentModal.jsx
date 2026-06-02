import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';

function formatCurrency(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(value ?? 0));
}

function safeArray(value) {
    return Array.isArray(value) ? value : [];
}

export default function PaymentModal({
    show,
    mode,
    cart,
    subtotal,
    tax,
    discount,
    total,
    cashReceived,
    onCashReceivedChange,
    onClose,
    onConfirm,
    processing,
    currency = 'IDR',
}) {
    const isCash = mode === 'cash';
    const isQris = mode === 'qris';
    const isCard = mode === 'card';
    const change = Math.max(Number(cashReceived || 0) - total, 0);
    const safeCart = safeArray(cart);
    const confirmDisabled =
        processing ||
        !safeCart.length ||
        (isCash && Number(cashReceived || 0) < total) ||
        isCard;

    return (
        <Modal show={show} maxWidth="2xl" closeable onClose={onClose}>
            <div className="bg-slate-950 text-white">
                <div className="border-b border-white/10 px-6 py-5">
                    <div className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
                        {isCash ? 'Cash Payment' : isQris ? 'QRIS Payment' : 'Card Payment'}
                    </div>
                    <h3 className="mt-2 text-lg font-semibold">
                        {isCash
                            ? 'Confirm cash checkout'
                            : isQris
                                ? 'Confirm QRIS checkout'
                                : 'Debit / Credit card coming soon'}
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">
                        Review the receipt summary before saving the transaction.
                    </p>
                </div>

                <div className="grid gap-6 px-6 py-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-4">
                        <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-4">
                            <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                                Items
                            </div>
                            <div className="mt-3 max-h-72 space-y-3 overflow-auto pr-1">
                                {safeCart.length ? safeCart.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-3"
                                    >
                                        <div className="min-w-0">
                                            <div className="truncate text-sm font-medium text-white">
                                                {item.name}
                                            </div>
                                            <div className="mt-1 text-xs text-slate-400">
                                                {item.quantity} x {formatCurrency(item.price)}
                                            </div>
                                        </div>
                                        <div className="text-sm font-semibold text-cyan-300">
                                            {formatCurrency(item.price * item.quantity)}
                                        </div>
                                    </div>
                                )) : (
                                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-8 text-center text-sm text-slate-400">
                                        No items in the current cart.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-4">
                            <div className="flex items-center justify-between text-sm text-slate-400">
                                <span>Subtotal</span>
                                <span className="text-white">
                                    {formatCurrency(subtotal)}
                                </span>
                            </div>
                            <div className="mt-3 flex items-center justify-between text-sm text-slate-400">
                                <span>Tax 11%</span>
                                <span className="text-white">
                                    {formatCurrency(tax)}
                                </span>
                            </div>
                            <div className="mt-3 flex items-center justify-between text-sm text-slate-400">
                                <span>Discount</span>
                                <span className="text-white">
                                    {formatCurrency(discount)}
                                </span>
                            </div>
                            <div className="mt-3 flex items-center justify-between text-sm text-slate-400">
                                <span>Total</span>
                                <span className="text-xl font-semibold text-cyan-300">
                                    {formatCurrency(total)}
                                </span>
                            </div>
                        </div>

                        {isCash ? (
                            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-4">
                                <InputLabel
                                    htmlFor="cash_received"
                                    value="Cash Received"
                                    className="mb-2 text-slate-300"
                                />
                                <TextInput
                                    id="cash_received"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={cashReceived}
                                    onChange={(event) =>
                                        onCashReceivedChange(event.target.value)
                                    }
                                    className="w-full rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-cyan-400"
                                    placeholder="0.00"
                                />
                                <div className="mt-3 flex items-center justify-between text-sm text-slate-400">
                                    <span>Change</span>
                                    <span className="font-medium text-emerald-300">
                                        {formatCurrency(change)}
                                    </span>
                                </div>
                            </div>
                        ) : isQris ? (
                            <div className="rounded-[28px] border border-violet-400/20 bg-violet-400/10 p-4">
                                <div className="text-sm font-semibold text-violet-200">
                                    Midtrans Snap ready
                                </div>
                                <p className="mt-2 text-sm leading-6 text-slate-300">
                                    After saving, the QRIS modal opens through Midtrans Snap and the payment status updates from the webhook.
                                </p>
                                <div className="mt-4 rounded-[24px] border border-white/10 bg-slate-950/50 p-4 text-sm text-slate-300">
                                    <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                                        Midtrans placeholder
                                    </div>
                                    <p className="mt-2">
                                        A Snap token will be injected here once the backend returns a live QRIS token. Currency: {currency}.
                                    </p>
                                </div>
                                <div className="mt-4 rounded-[24px] border border-dashed border-violet-300/30 bg-slate-950/60 p-4 text-center">
                                    <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                                        QR Code Area
                                    </div>
                                    <div className="mt-3 flex items-center justify-center">
                                        <div className="grid h-36 w-36 grid-cols-6 gap-1 rounded-3xl bg-white p-3">
                                            {Array.from({ length: 36 }).map((_, index) => (
                                                <span
                                                    key={index}
                                                    className={`rounded-sm ${index % 3 === 0 || index % 5 === 0 ? 'bg-slate-950' : 'bg-slate-200'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] p-5">
                                <div className="text-sm font-semibold text-white">
                                    Card payment placeholder
                                </div>
                                <p className="mt-2 text-sm leading-6 text-slate-300">
                                    Debit and credit card processing is reserved for a future gateway integration.
                                    Keep using cash or QRIS to complete sales.
                                </p>
                            </div>
                        )}

                        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-slate-300">
                            <div className="font-semibold text-white">
                                {isCash ? 'Cash checkout' : isQris ? 'QRIS checkout' : 'Card placeholder'}
                            </div>
                            <p className="mt-2">
                                {isCard
                                    ? 'This option is intentionally disabled until card processing is implemented.'
                                    : 'Review the receipt preview, then save the transaction to complete the sale.'}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <SecondaryButton
                                type="button"
                                className="border-white/10 bg-transparent text-slate-200 hover:bg-white/5"
                                onClick={onClose}
                            >
                                Cancel
                            </SecondaryButton>
                            <PrimaryButton
                                type="button"
                                disabled={confirmDisabled}
                                className="bg-cyan-500 hover:bg-cyan-400 focus:ring-cyan-400"
                                onClick={onConfirm}
                            >
                                {isCard
                                    ? 'Unavailable'
                                    : processing
                                    ? 'Saving...'
                                    : isCash
                                        ? 'Save Cash Payment'
                                        : 'Save QRIS Payment'}
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
