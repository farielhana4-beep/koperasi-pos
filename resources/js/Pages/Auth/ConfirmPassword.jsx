import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Confirm Password" />

            <div className="space-y-6">
                <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
                        Protected action
                    </p>
                    <h1 className="text-3xl font-semibold tracking-tight text-white">
                        Confirm your password
                    </h1>
                    <p className="text-sm leading-6 text-slate-300">
                        This action needs a quick password check before you can continue.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    <div className="space-y-2">
                        <InputLabel htmlFor="password" value="Password" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="w-full"
                            isFocused={true}
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center justify-end">
                        <PrimaryButton disabled={processing}>
                            {processing ? 'Confirming...' : 'Confirm'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}
