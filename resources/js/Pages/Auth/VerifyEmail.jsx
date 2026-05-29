import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <div className="space-y-6">
                <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
                        Verify email
                    </p>
                    <h1 className="text-3xl font-semibold tracking-tight text-white">
                        Confirm your email address
                    </h1>
                    <p className="text-sm leading-6 text-slate-300">
                        Check your inbox for the verification link. You can
                        resend it if the message did not arrive.
                    </p>
                </div>

                {status === 'verification-link-sent' ? (
                    <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
                        A new verification link has been sent to your email
                        address.
                    </div>
                ) : null}

                <form onSubmit={submit} className="space-y-4">
                    <PrimaryButton disabled={processing} className="w-full">
                        {processing
                            ? 'Sending...'
                            : 'Resend verification email'}
                    </PrimaryButton>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
                    >
                        Log out
                    </Link>
                </form>
            </div>
        </GuestLayout>
    );
}
