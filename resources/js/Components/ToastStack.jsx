import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';

function Toast({ tone = 'success', title, message }) {
    const tones = {
        success: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200',
        error: 'border-rose-400/20 bg-rose-400/10 text-rose-200',
        info: 'border-cyan-400/20 bg-cyan-400/10 text-cyan-200',
    };

    return (
        <div className={`rounded-2xl border px-4 py-3 shadow-2xl shadow-black/30 backdrop-blur-xl ${tones[tone]}`}>
            <div className="text-sm font-semibold">{title}</div>
            {message ? <div className="mt-1 text-sm leading-6 opacity-90">{message}</div> : null}
        </div>
    );
}

export default function ToastStack() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState([]);

    useEffect(() => {
        const next = [];

        if (flash?.success) next.push({ id: 'success', tone: 'success', title: 'Success', message: flash.success });
        if (flash?.error) next.push({ id: 'error', tone: 'error', title: 'Attention', message: flash.error });
        if (flash?.message) next.push({ id: 'info', tone: 'info', title: 'Notice', message: flash.message });

        setVisible(next);
    }, [flash?.success, flash?.error, flash?.message]);

    useEffect(() => {
        if (!visible.length) return undefined;

        const timer = window.setTimeout(() => setVisible([]), 4500);
        return () => window.clearTimeout(timer);
    }, [visible]);

    if (!visible.length) {
        return null;
    }

    return (
        <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(92vw,24rem)] flex-col gap-3">
            {visible.map((toast) => (
                <Toast key={toast.id} {...toast} />
            ))}
        </div>
    );
}
