import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="space-y-6">
                <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
                        Account recovery
                    </p>
                    <h1 className="text-3xl font-semibold tracking-tight text-white">
                        Reset your password
                    </h1>
                    <p className="text-sm leading-6 text-slate-300">
                        Enter the email attached to your cashier or admin
                        account and we&apos;ll send a secure reset link.
                    </p>
                </div>

                {status ? (
                    <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
                        {status}
                    </div>
                ) : null}

                <form onSubmit={submit} className="space-y-5">
                    <div className="space-y-2">
                        <InputLabel htmlFor="email" value="Email address" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="w-full"
                            placeholder="kasir@koperasi.test"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm leading-6 text-slate-200">
                        Super admin accounts are reset from the user management
                        screen. Cashier accounts can use this form.
                    </div>

                    <div className="flex items-center justify-between gap-3">
                        <Link
                            href={route('login')}
                            className="text-sm font-medium text-slate-400 transition hover:text-white"
                        >
                            Back to login
                        </Link>

                        <PrimaryButton disabled={processing}>
                            {processing ? 'Sending...' : 'Email reset link'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}
