import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Index() {
    return (
        <AuthenticatedLayout title="Transactions">
            <Head title="Transactions" />
            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-black/20">
                <h2 className="text-xl font-semibold text-white">Transactions</h2>
                <p className="mt-2 text-sm text-slate-400">
                    Protected transaction area for POS and admin users.
                </p>
            </div>
        </AuthenticatedLayout>
    );
}
