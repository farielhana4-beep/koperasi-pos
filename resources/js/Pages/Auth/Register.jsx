import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="space-y-6">
                <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
                        Create account
                    </p>
                    <h1 className="text-3xl font-semibold tracking-tight text-white">
                        Set up a cashier account
                    </h1>
                    <p className="text-sm leading-6 text-slate-300">
                        New accounts are created as cashier users and can start
                        processing POS transactions immediately.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    <div className="space-y-2">
                        <InputLabel htmlFor="name" value="Full name" />
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="w-full"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            placeholder="Kasir Baru"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="space-y-2">
                        <InputLabel htmlFor="email" value="Email address" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="w-full"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            placeholder="kasir@koperasi.test"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="space-y-2">
                        <InputLabel htmlFor="password" value="Password" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="w-full"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                            placeholder="At least 8 characters"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="space-y-2">
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Confirm password"
                        />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="w-full"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            required
                        />
                        <InputError
                            message={errors.password_confirmation}
                        />
                    </div>

                    <PrimaryButton className="w-full" disabled={processing}>
                        {processing ? 'Creating account...' : 'Register'}
                    </PrimaryButton>
                </form>

                <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>Already have an account?</span>
                    <Link
                        href={route('login')}
                        className="font-medium text-white transition hover:text-cyan-300"
                    >
                        Log in
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}
