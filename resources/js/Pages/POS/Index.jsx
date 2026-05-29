import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import CartPanel from './Partials/CartPanel';
import CategoryFilters from './Partials/CategoryFilters';
import PaymentModal from './Partials/PaymentModal';
import PosErrorBoundary from './Partials/PosErrorBoundary';
import ProductCard from './Partials/ProductCard';
import ReceiptModal from './Partials/ReceiptModal';
import {
    PosIcon,
    ReceiptIcon,
    ScanIcon,
    SearchIcon,
    SparklesIcon,
} from '@/Components/Icons';

function formatCurrency(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number.isFinite(Number(value)) ? Number(value) : 0);
}

function safeArray(value) {
    return Array.isArray(value) ? value : [];
}

function normalizeMoney(value) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : 0;
}

function buildDraftReceipt({
    cart = [],
    subtotal = 0,
    tax = 0,
    discount = 0,
    total = 0,
    cashReceived,
    paymentMethod = 'cash',
    cashierName = '-',
}) {
    const safeCart = safeArray(cart);

    return {
        invoice_number: 'Draft receipt',
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'cash' ? 'paid' : 'pending',
        subtotal: normalizeMoney(subtotal),
        tax: normalizeMoney(tax),
        discount: normalizeMoney(discount),
        total: normalizeMoney(total),
        cash_received:
            paymentMethod === 'cash' ? normalizeMoney(cashReceived) : null,
        change:
            paymentMethod === 'cash'
                ? Math.max(normalizeMoney(cashReceived) - normalizeMoney(total), 0)
                : 0,
        created_at: 'Preview ready',
        cashier_name: cashierName,
        items: safeCart.map((item) => ({
            product_id: item.id,
            barcode: item.barcode ?? '-',
            name: item.name ?? 'Unnamed item',
            quantity: normalizeMoney(item.quantity) || 1,
            price: normalizeMoney(item.price),
            subtotal:
                normalizeMoney(item.price) * (normalizeMoney(item.quantity) || 1),
        })),
    };
}

function StatCard({ label, value, note, icon, tone }) {
    return (
        <div className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.05] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-white/[0.07]">
            <div className={`h-1.5 w-24 rounded-full bg-gradient-to-r ${tone}`} />
            <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                    <div className="text-sm text-slate-400">{label}</div>
                    <div className="mt-2 text-3xl font-semibold tracking-tight text-white">
                        {value}
                    </div>
                    {note ? (
                        <div className="mt-2 text-xs text-slate-500">{note}</div>
                    ) : null}
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3 text-cyan-300">
                    {icon}
                </div>
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition group-hover:opacity-100" />
        </div>
    );
}

function QuickAction({ icon, label, helper, onClick, tone = 'cyan' }) {
    const toneClasses = {
        cyan: 'border-cyan-400/20 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/15',
        violet:
            'border-violet-400/20 bg-violet-400/10 text-violet-200 hover:bg-violet-400/15',
        emerald:
            'border-emerald-400/20 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/15',
    };

    return (
        <button
            type="button"
            onClick={onClick}
            className={`rounded-[24px] border px-4 py-4 text-left transition duration-300 hover:-translate-y-0.5 ${toneClasses[tone]}`}
        >
            <div className="flex items-center gap-3">
                <span className="rounded-2xl border border-white/10 bg-slate-950/40 p-2">
                    {icon}
                </span>
                <div>
                    <div className="text-sm font-semibold text-white">{label}</div>
                    <div className="mt-1 text-xs text-slate-300">{helper}</div>
                </div>
            </div>
        </button>
    );
}

function ProductSkeletonCard() {
    return (
        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/70 shadow-2xl shadow-black/20">
            <div className="aspect-[4/3] animate-pulse bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800" />
            <div className="space-y-4 p-5">
                <div className="h-3 w-24 animate-pulse rounded-full bg-white/10" />
                <div className="h-5 w-full animate-pulse rounded-full bg-white/10" />
                <div className="h-4 w-3/4 animate-pulse rounded-full bg-white/10" />
                <div className="flex items-center justify-between">
                    <div className="h-5 w-24 animate-pulse rounded-full bg-white/10" />
                    <div className="h-10 w-16 animate-pulse rounded-2xl bg-white/10" />
                </div>
            </div>
        </div>
    );
}

export default function Index({ products, categories, summary }) {
    const page = usePage();
    const { auth, flash, settings, recentTransactions = [] } = page.props;
    const isCatalogLoading = products == null;

    const safeProducts = safeArray(products)
        .filter(Boolean)
        .map((product) => ({
            ...product,
            barcode: product?.barcode ?? '',
            name: product?.name ?? 'Unnamed product',
            category: product?.category ?? 'Uncategorized',
            stock: normalizeMoney(product?.stock),
            stock_status: product?.stock_status ?? 'normal',
            selling_price: normalizeMoney(product?.selling_price),
            image_url: product?.image_url || '/images/product-placeholder.svg',
        }));

    const safeCategories = ['all', ...safeArray(categories).filter(Boolean)];
    const safeSummary = summary ?? {};

    const [barcode, setBarcode] = useState('');
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [cart, setCart] = useState([]);
    const [paymentModal, setPaymentModal] = useState(null);
    const [cashReceived, setCashReceived] = useState('');
    const [discount, setDiscount] = useState(0);
    const [saving, setSaving] = useState(false);
    const [receiptOpen, setReceiptOpen] = useState(false);
    const [receipt, setReceipt] = useState(null);
    const [cartPulse, setCartPulse] = useState(false);
    const barcodeInputRef = useRef(null);
    const barcodeDebounceRef = useRef(null);
    const currency = settings?.branding?.currency ?? 'IDR';
    const midtransClientKey = settings?.midtrans?.client_key ?? '';
    const isProduction = Boolean(settings?.midtrans?.is_production);

    const subtotal = useMemo(() => {
        return cart.reduce((accumulator, item) => {
            const price = normalizeMoney(item?.price);
            const quantity = Math.max(normalizeMoney(item?.quantity), 0);

            return accumulator + price * quantity;
        }, 0);
    }, [cart]);

    const tax = useMemo(() => subtotal * 0.11, [subtotal]);
    const safeDiscount = useMemo(
        () => Math.min(Math.max(normalizeMoney(discount), 0), subtotal + tax),
        [discount, subtotal, tax],
    );
    const total = useMemo(
        () => Math.max(subtotal + tax - safeDiscount, 0),
        [subtotal, tax, safeDiscount],
    );
    const change = useMemo(
        () => Math.max(normalizeMoney(cashReceived) - total, 0),
        [cashReceived, total],
    );

    const lowStockCount = useMemo(
        () =>
            safeProducts.filter((product) => product.stock_status === 'critical')
                .length,
        [safeProducts],
    );
    const qrisReadyCount = useMemo(
        () =>
            safeProducts.filter((product) => product.stock_status !== 'critical')
                .length,
        [safeProducts],
    );

    const filteredProducts = useMemo(() => {
        const query = search.trim().toLowerCase();

        return safeProducts.filter((product) => {
            const barcodeValue = String(product.barcode ?? '').toLowerCase();
            const nameValue = String(product.name ?? '').toLowerCase();
            const categoryValue = String(product.category ?? '').toLowerCase();

            const matchesSearch =
                !query || barcodeValue.includes(query) || nameValue.includes(query);
            const matchesCategory =
                selectedCategory === 'all' ||
                categoryValue === selectedCategory.toLowerCase();

            return matchesSearch && matchesCategory;
        });
    }, [safeProducts, search, selectedCategory]);

    const cartCount = cart.length;
    const currentPaymentLabel = paymentModal ?? 'cash';

    useEffect(() => {
        barcodeInputRef.current?.focus();
    }, []);

    useEffect(() => {
        const handleShortcut = (event) => {
            if (event.key === 'Escape') {
                clearCart();
            }

            if (event.key === 'F2') {
                event.preventDefault();
                openCashModal();
            }

            if (event.key === 'F4') {
                event.preventDefault();
                openQrisModal();
            }
        };

        window.addEventListener('keydown', handleShortcut);

        return () => window.removeEventListener('keydown', handleShortcut);
    }, [cartCount, total]);

    useEffect(() => {
        if (flash?.receipt) {
            setReceipt(flash.receipt);
            setReceiptOpen(true);
        }
    }, [flash?.receipt]);

    useEffect(() => {
        const receiptPayload = flash?.receipt;
        const token = receiptPayload?.snap_token;

        if (
            !receiptPayload ||
            receiptPayload.payment_method !== 'qris' ||
            !token ||
            token.startsWith('qris-placeholder-') ||
            !midtransClientKey
        ) {
            return undefined;
        }

        const scriptId = 'midtrans-snap-js';

        const openSnap = () => {
            const snap = window.snap;

            if (!snap?.pay) {
                return;
            }

            snap.pay(token, {
                onSuccess: () => window.location.reload(),
                onPending: () => window.location.reload(),
                onError: () => window.location.reload(),
                onClose: () => {},
            });
        };

        if (window.snap?.pay) {
            openSnap();
            return undefined;
        }

        const existingScript = document.getElementById(scriptId);
        if (existingScript) {
            existingScript.addEventListener('load', openSnap, { once: true });
            return () => existingScript.removeEventListener('load', openSnap);
        }

        const script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://${isProduction ? 'app.midtrans.com' : 'app.sandbox.midtrans.com'}/snap/snap.js`;
        script.setAttribute('data-client-key', midtransClientKey);
        script.addEventListener('load', openSnap, { once: true });
        document.body.appendChild(script);

        return () => {
            script.removeEventListener('load', openSnap);
        };
    }, [flash?.receipt, isProduction, midtransClientKey]);

    const focusBarcodeInput = () => {
        barcodeInputRef.current?.focus();
    };

    const clearBarcodeDebounce = () => {
        if (barcodeDebounceRef.current) {
            window.clearTimeout(barcodeDebounceRef.current);
            barcodeDebounceRef.current = null;
        }
    };

    const addProduct = (product, options = {}) => {
        if (!product || product.stock <= 0) {
            return;
        }

        const shouldRefocusBarcode = Boolean(options.refocusBarcode);

        setCart((current) => {
            const safeCurrent = safeArray(current);
            const existing = safeCurrent.find((item) => item.id === product.id);

            if (!existing) {
                return [
                    ...safeCurrent,
                    {
                        id: product.id,
                        barcode: product.barcode,
                        name: product.name,
                        category: product.category,
                        image_url: product.image_url,
                        price: normalizeMoney(product.selling_price),
                        stock: product.stock,
                        quantity: 1,
                    },
                ];
            }

            return safeCurrent.map((item) => {
                if (item.id !== product.id) {
                    return item;
                }

                return {
                    ...item,
                    quantity: Math.min(
                        Math.max(normalizeMoney(item.quantity) + 1, 1),
                        Math.max(normalizeMoney(item.stock), 1),
                    ),
                };
            });
        });

        setCartPulse(true);
        window.setTimeout(() => setCartPulse(false), 220);
        setBarcode('');

        if (shouldRefocusBarcode) {
            window.requestAnimationFrame(() => {
                focusBarcodeInput();
            });
        }
    };

    const addByBarcode = () => {
        const value = barcode.trim().toLowerCase();
        if (!value) {
            return;
        }

        const match = safeProducts.find(
            (product) => String(product.barcode ?? '').toLowerCase() === value,
        );

        if (match) {
            clearBarcodeDebounce();
            addProduct(match, { refocusBarcode: true });
        }
    };

    const handleBarcodeChange = (value) => {
        setBarcode(value);
        clearBarcodeDebounce();

        const nextValue = String(value ?? '').trim();
        if (!nextValue) {
            return;
        }

        barcodeDebounceRef.current = window.setTimeout(() => {
            const match = safeProducts.find(
                (product) =>
                    String(product.barcode ?? '').toLowerCase() ===
                    nextValue.toLowerCase(),
            );

            if (match) {
                addProduct(match, { refocusBarcode: true });
            }
        }, 140);
    };

    const increaseQuantity = (productId, nextQuantity) => {
        setCart((current) =>
            safeArray(current)
                .map((item) => {
                    if (item.id !== productId) {
                        return item;
                    }

                    const quantity = Math.max(
                        1,
                        Math.min(normalizeMoney(nextQuantity) || 1, item.stock || 1),
                    );

                    return {
                        ...item,
                        quantity,
                    };
                })
                .filter((item) => normalizeMoney(item.quantity) > 0),
        );
    };

    const decreaseQuantity = (productId) => {
        setCart((current) =>
            safeArray(current)
                .map((item) => {
                    if (item.id !== productId) {
                        return item;
                    }

                    return {
                        ...item,
                        quantity: Math.max(normalizeMoney(item.quantity) - 1, 0),
                    };
                })
                .filter((item) => normalizeMoney(item.quantity) > 0),
        );
    };

    const removeItem = (productId) => {
        setCart((current) => safeArray(current).filter((item) => item.id !== productId));
    };

    const clearCart = () => {
        setCart([]);
        setCashReceived('');
        setPaymentModal(null);
        setDiscount(0);
    };

    const openCashModal = () => {
        if (!cartCount) {
            return;
        }

        setCashReceived((current) => current || String(total));
        setPaymentModal('cash');
    };

    const openQrisModal = () => {
        if (!cartCount) {
            return;
        }

        setCashReceived('');
        setPaymentModal('qris');
    };

    const previewReceipt = () => {
        if (!cartCount) {
            return;
        }

        setReceipt(
            buildDraftReceipt({
                cart,
                subtotal,
                tax,
                discount: safeDiscount,
                total,
                cashReceived,
                paymentMethod: currentPaymentLabel,
                cashierName: auth.user?.name ?? '-',
            }),
        );
        setReceiptOpen(true);
    };

    const submitTransaction = () => {
        if (!cartCount || saving || !paymentModal) {
            return;
        }

        setSaving(true);

        router.post(
            route('pos.checkout'),
            {
                payment_method: paymentModal,
                cash_received: paymentModal === 'cash' ? cashReceived : null,
                items: cart.map((item) => ({
                    product_id: item.id,
                    quantity: item.quantity,
                })),
            },
            {
                preserveScroll: true,
                onFinish: () => setSaving(false),
                onSuccess: () => {
                    setCart([]);
                    setBarcode('');
                    setSearch('');
                    setCashReceived('');
                    setPaymentModal(null);
                    setDiscount(0);
                    window.requestAnimationFrame(() => {
                        focusBarcodeInput();
                    });
                },
            },
        );
    };

    useEffect(() => {
        return () => {
            clearBarcodeDebounce();
        };
    }, []);

    const headerStats = [
        {
            label: 'Products',
            value: safeSummary.total_products ?? safeProducts.length,
            note: 'In the current catalog',
            tone: 'from-cyan-400 to-blue-500',
            icon: <PosIcon className="h-5 w-5" />,
        },
        {
            label: 'Categories',
            value: safeSummary.categories_count ?? (safeCategories.length - 1),
            note: 'Auto-grouped for browsing',
            tone: 'from-fuchsia-400 to-violet-500',
            icon: <SparklesIcon className="h-5 w-5" />,
        },
        {
            label: 'Low Stock',
            value: lowStockCount,
            note: 'Watch items below threshold',
            tone: 'from-amber-400 to-orange-500',
            icon: <ReceiptIcon className="h-5 w-5" />,
        },
        {
            label: 'QRIS Ready',
            value: qrisReadyCount,
            note: 'Usable in fast checkout',
            tone: 'from-emerald-400 to-teal-500',
            icon: <ScanIcon className="h-5 w-5" />,
        },
    ];

    return (
        <AuthenticatedLayout
            title="POS Cashier"
            header={
                <div className="grid gap-6 xl:grid-cols-[1.25fr_0.85fr]">
                    <div className="space-y-5">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
                                Live Cashier
                            </span>
                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">
                                {auth.user?.name ?? 'Cashier'}
                            </span>
                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">
                                F2 Cash
                            </span>
                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">
                                F4 QRIS
                            </span>
                        </div>

                        <div className="space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
                                School koperasi POS
                            </p>
                            <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                                Premium cashier workspace built for speed, clarity, and confidence.
                            </h2>
                            <p className="max-w-3xl text-sm leading-7 text-slate-300">
                                Search by barcode, filter by category, preview receipts, and check out with cash or Midtrans QRIS in a polished glass UI.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <QuickAction
                                icon={<ReceiptIcon className="h-5 w-5" />}
                                label="Receipt Preview"
                                helper="Inspect totals before saving"
                                onClick={previewReceipt}
                                tone="cyan"
                            />
                            <QuickAction
                                icon={<ScanIcon className="h-5 w-5" />}
                                label="QRIS Checkout"
                                helper="Open payment modal instantly"
                                onClick={openQrisModal}
                                tone="violet"
                            />
                            <QuickAction
                                icon={<SparklesIcon className="h-5 w-5" />}
                                label="Cash Checkout"
                                helper="Quick settlement flow"
                                onClick={openCashModal}
                                tone="emerald"
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
                        {headerStats.map((stat) => (
                            <StatCard key={stat.label} {...stat} />
                        ))}
                    </div>
                </div>
            }
        >
            <Head title="POS Cashier" />

            <PosErrorBoundary>
                <div className="space-y-6">
                    {flash?.success ? (
                        <div className="rounded-[24px] border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
                            {flash.success}
                        </div>
                    ) : null}

                    <section className="glass-card rounded-[2rem] border border-white/10 bg-slate-900/80 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
                        <div className="grid gap-4 xl:grid-cols-[0.82fr_1.18fr_auto]">
                            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                                <label
                                    htmlFor="barcode-input"
                                    className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500"
                                >
                                    Scan barcode
                                </label>
                                <p className="mt-2 text-xs leading-5 text-slate-400">
                                    Compact scanner field for barcode readers. Press Enter or let the scan auto-submit.
                                </p>
                                <div className="mt-3 flex gap-2">
                                    <div className="relative flex-1">
                                        <ScanIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                                        <input
                                            id="barcode-input"
                                            ref={barcodeInputRef}
                                            type="text"
                                            value={barcode}
                                            onChange={(event) =>
                                                handleBarcodeChange(event.target.value)
                                            }
                                            onKeyDown={(event) => {
                                                if (event.key === 'Enter') {
                                                    event.preventDefault();
                                                    clearBarcodeDebounce();
                                                    addByBarcode();
                                                }
                                            }}
                                            placeholder="Scan barcode..."
                                            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addByBarcode}
                                        className="rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>

                            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                                <label
                                    htmlFor="product-search"
                                    className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500"
                                >
                                    Search products
                                </label>
                                <p className="mt-2 text-xs leading-5 text-slate-400">
                                    Use this field for browsing products by name or barcode. It stays independent from scanner focus.
                                </p>
                                <div className="mt-3 flex gap-2">
                                    <div className="relative flex-1">
                                        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                                        <input
                                            id="product-search"
                                            type="text"
                                            value={search}
                                            onChange={(event) =>
                                                setSearch(event.target.value)
                                            }
                                            placeholder="Search by name or barcode..."
                                            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setSearch('')}
                                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-end">
                                <button
                                    type="button"
                                    onClick={clearCart}
                                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 xl:w-auto"
                                >
                                    Reset Cart
                                </button>
                            </div>
                        </div>

                        <div className="mt-5">
                            <CategoryFilters
                                categories={safeCategories}
                                selectedCategory={selectedCategory}
                                onSelectCategory={setSelectedCategory}
                            />
                        </div>
                    </section>

                    <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
                        <section className="space-y-5">
                            <div className="glass-card rounded-[2rem] border border-white/10 bg-slate-900/80 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">
                                            Product Browser
                                        </h3>
                                        <p className="mt-1 text-sm text-slate-400">
                                            Tap any product card to add it to the cart.
                                        </p>
                                    </div>
                                    <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
                                        {filteredProducts.length} items
                                    </div>
                                </div>

                                <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                    {isCatalogLoading ? (
                                        Array.from({ length: 6 }).map((_, index) => (
                                            <ProductSkeletonCard key={index} />
                                        ))
                                    ) : filteredProducts.length ? (
                                        filteredProducts.map((product) => (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                                onAdd={addProduct}
                                                onPreview={(nextProduct) => {
                                                    const nextPrice = normalizeMoney(
                                                        nextProduct?.selling_price,
                                                    );

                                                    setReceipt(
                                                        buildDraftReceipt({
                                                            cart: [
                                                                {
                                                                    id: nextProduct.id,
                                                                    barcode:
                                                                        nextProduct.barcode,
                                                                    name: nextProduct.name,
                                                                    price: nextPrice,
                                                                    stock: nextProduct.stock,
                                                                    quantity: 1,
                                                                },
                                                            ],
                                                            subtotal: nextPrice,
                                                            tax: nextPrice * 0.11,
                                                            discount: 0,
                                                            total: nextPrice * 1.11,
                                                            cashReceived: nextPrice * 1.11,
                                                            paymentMethod: 'cash',
                                                            cashierName:
                                                                auth.user?.name ?? '-',
                                                        }),
                                                    );
                                                    setReceiptOpen(true);
                                                }}
                                            />
                                        ))
                                    ) : (
                                        <div className="col-span-full">
                                            <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/[0.03] px-6 py-16 text-center text-sm text-slate-400">
                                                No products match this search. Try another barcode, category, or reset the filter.
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        <div className={`space-y-5 transition duration-300 ${cartPulse ? 'scale-[1.01]' : ''}`}>
                            <CartPanel
                                cart={cart}
                                subtotal={subtotal}
                                tax={tax}
                                discount={safeDiscount}
                                total={total}
                                change={change}
                                paymentMethod={currentPaymentLabel}
                                cashReceived={cashReceived}
                                onCashReceivedChange={setCashReceived}
                                onIncreaseQuantity={increaseQuantity}
                                onDecreaseQuantity={decreaseQuantity}
                                onRemoveItem={removeItem}
                                onClearCart={clearCart}
                                onPreviewReceipt={previewReceipt}
                                onOpenCash={openCashModal}
                                onOpenQris={openQrisModal}
                                onSetDiscount={setDiscount}
                            />

                            <div className="glass-card rounded-[2rem] border border-white/10 bg-slate-900/80 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <div className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
                                            Payment history
                                        </div>
                                        <h3 className="mt-2 text-lg font-semibold text-white">
                                            Recent transactions
                                        </h3>
                                    </div>
                                    <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-slate-400">
                                        Live feed
                                    </div>
                                </div>

                                <div className="mt-4 space-y-3">
                                    {safeArray(recentTransactions).length ? (
                                        safeArray(recentTransactions).map((item) => (
                                            <div
                                                key={item.invoice_number}
                                                className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-cyan-400/20 hover:bg-white/[0.06]"
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <div className="text-sm font-semibold text-white">
                                                            {item.invoice_number}
                                                        </div>
                                                        <div className="mt-1 text-xs text-slate-400">
                                                            {item.cashier_name} - {item.created_at}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm font-semibold text-cyan-300">
                                                            {formatCurrency(item.total_price)}
                                                        </div>
                                                        <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-slate-500">
                                                            {item.payment_method} - {item.payment_status}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-8 text-center text-sm text-slate-400">
                                            No recent payments yet. First transactions will appear here.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <PaymentModal
                    show={Boolean(paymentModal)}
                    mode={paymentModal}
                    cart={cart}
                    subtotal={subtotal}
                    tax={tax}
                    discount={safeDiscount}
                    total={total}
                    cashReceived={cashReceived}
                    onCashReceivedChange={setCashReceived}
                    onClose={() => setPaymentModal(null)}
                    onConfirm={submitTransaction}
                    processing={saving}
                    currency={currency}
                />

                <ReceiptModal
                    show={receiptOpen}
                    receipt={receipt}
                    onClose={() => setReceiptOpen(false)}
                />
            </PosErrorBoundary>
        </AuthenticatedLayout>
    );
}
