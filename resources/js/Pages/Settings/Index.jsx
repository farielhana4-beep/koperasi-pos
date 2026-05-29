import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import FileUploadCard from './Partials/FileUploadCard';
import SectionCard from './Partials/SectionCard';
import ToggleSwitch from './Partials/ToggleSwitch';

function Field({ label, description, children }) {
    return (
        <label className="block">
            <div className="text-sm font-medium text-white">{label}</div>
            {description ? (
                <div className="mt-1 text-sm leading-6 text-slate-400">{description}</div>
            ) : null}
            <div className="mt-3">{children}</div>
        </label>
    );
}

function Input({ className = '', ...props }) {
    return (
        <input
            {...props}
            className={`w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 shadow-inner shadow-black/10 outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 ${className}`}
        />
    );
}

function Textarea({ className = '', ...props }) {
    return (
        <textarea
            {...props}
            className={`w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 shadow-inner shadow-black/10 outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 ${className}`}
        />
    );
}

function Badge({ children, tone = 'slate' }) {
    const tones = {
        slate: 'border-white/10 bg-white/5 text-slate-300',
        emerald: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
        cyan: 'border-cyan-400/20 bg-cyan-400/10 text-cyan-300',
        amber: 'border-amber-400/20 bg-amber-400/10 text-amber-300',
    };

    return (
        <span
            className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] ${tones[tone]}`}
        >
            {children}
        </span>
    );
}

export default function Index({ settings }) {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        app_name: settings.branding.app_name ?? '',
        school_name: settings.branding.school_name ?? '',
        school_address: settings.branding.school_address ?? '',
        school_phone: settings.branding.school_phone ?? '',
        school_email: settings.branding.school_email ?? '',
        timezone: settings.branding.timezone ?? 'Asia/Jakarta',
        currency: settings.branding.currency ?? 'IDR',
        receipt_footer_text: settings.pos.receipt_footer_text ?? '',
        pos_auto_print_receipt: settings.pos.auto_print_receipt ?? true,
        pos_enable_qris: settings.pos.enable_qris ?? true,
        pos_show_low_stock_warning: settings.pos.show_low_stock_warning ?? true,
        midtrans_server_key: '',
        midtrans_client_key: '',
        midtrans_merchant_id: settings.midtrans.merchant_id ?? '',
        midtrans_is_production: settings.midtrans.is_production ?? false,
        mail_from_name: settings.mail?.from_name ?? '',
        mail_from_address: settings.mail?.from_address ?? '',
        mail_reply_to: settings.mail?.reply_to ?? '',
        notifications_email: settings.mail?.notifications_email ?? '',
        backup_enabled: settings.backup?.enabled ?? false,
        backup_schedule: settings.backup?.schedule ?? 'daily',
        backup_retention_days: settings.backup?.retention_days ?? 7,
        permission_self_registration: settings.permissions?.self_registration ?? false,
        permission_cashier_refund: settings.permissions?.cashier_refund ?? false,
        appearance_theme: settings.appearance.theme_mode ?? 'dark',
        system_maintenance_enabled: settings.system.maintenance_enabled ?? false,
        app_logo: null,
        favicon: null,
    });

    const hasBrandLogo = Boolean(settings.branding.logo_url);
    const hasFavicon = Boolean(settings.branding.favicon_url);
    const darkModeEnabled = data.appearance_theme !== 'light';

    const submit = (event) => {
        event.preventDefault();

        post(route('settings.update'), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setData('app_logo', null);
                setData('favicon', null);
                setData('midtrans_server_key', '');
                setData('midtrans_client_key', '');
            },
        });
    };

    return (
        <AuthenticatedLayout title="Settings">
            <Head title="Settings" />

            <div className="space-y-6">
                {flash?.success ? (
                    <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm text-emerald-200 shadow-lg shadow-emerald-950/10">
                        {flash.success}
                    </div>
                ) : null}

                <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_38%),linear-gradient(135deg,rgba(15,23,42,0.98),rgba(2,6,23,0.92))] p-6 shadow-2xl shadow-black/20">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-3xl">
                            <div className="flex flex-wrap gap-2">
                                <Badge tone="cyan">Professional settings</Badge>
                                <Badge tone={darkModeEnabled ? 'emerald' : 'amber'}>
                                    {darkModeEnabled ? 'Dark mode' : 'Light mode'}
                                </Badge>
                                <Badge tone={settings.system.maintenance_enabled ? 'amber' : 'emerald'}>
                                    {settings.system.maintenance_enabled ? 'Maintenance on' : 'Maintenance off'}
                                </Badge>
                            </div>

                            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                                Control branding, POS behavior, Midtrans, and system maintenance from one clean panel.
                            </h2>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                                Update the cooperative identity, manage receipts, fine-tune cashier operations, and keep the platform safe with role-aware controls.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={submit}
                            disabled={processing}
                            className="inline-flex items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {processing ? 'Saving...' : 'Save settings'}
                        </button>
                    </div>
                </section>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                    <form onSubmit={submit} className="space-y-6">
                        <SectionCard
                            title="Branding and school information"
                            description="Set the app name, school identity, and upload the brand logo and favicon used across the dashboard."
                        >
                            <div className="grid gap-6 xl:grid-cols-2">
                                <FileUploadCard
                                    label="App logo"
                                    description="Used in the sidebar, receipts, and brand panels."
                                    previewUrl={settings.branding.logo_url}
                                    file={data.app_logo}
                                    setFile={(file) => setData('app_logo', file)}
                                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                                    helpText="Square ratio recommended. JPG, PNG, WebP, or SVG. Max 2 MB."
                                />

                                <FileUploadCard
                                    label="Favicon"
                                    description="Used in the browser tab and bookmarks."
                                    previewUrl={settings.branding.favicon_url}
                                    file={data.favicon}
                                    setFile={(file) => setData('favicon', file)}
                                    accept="image/png,image/jpeg,image/webp,image/svg+xml,.ico"
                                    helpText="Square icon recommended. ICO, PNG, JPG, WebP, or SVG. Max 1 MB."
                                />
                            </div>

                            <div className="mt-6 grid gap-5 lg:grid-cols-2">
                                <Field label="App name" description="Displayed in the UI and browser title.">
                                    <Input
                                        value={data.app_name}
                                        onChange={(event) => setData('app_name', event.target.value)}
                                        placeholder="Koperasi POS"
                                    />
                                    {errors.app_name ? <p className="mt-2 text-sm text-red-300">{errors.app_name}</p> : null}
                                </Field>

                                <Field label="School name" description="Shown in receipts and admin branding.">
                                    <Input
                                        value={data.school_name}
                                        onChange={(event) => setData('school_name', event.target.value)}
                                        placeholder="SMA Negeri 1"
                                    />
                                    {errors.school_name ? <p className="mt-2 text-sm text-red-300">{errors.school_name}</p> : null}
                                </Field>

                                <Field label="School address" description="Used on receipts and internal reports.">
                                    <Textarea
                                        rows={4}
                                        value={data.school_address}
                                        onChange={(event) => setData('school_address', event.target.value)}
                                        placeholder="Jl. Pendidikan No. 1"
                                    />
                                    {errors.school_address ? <p className="mt-2 text-sm text-red-300">{errors.school_address}</p> : null}
                                </Field>

                                <div className="grid gap-5">
                                    <Field label="School phone">
                                        <Input
                                            value={data.school_phone}
                                            onChange={(event) => setData('school_phone', event.target.value)}
                                            placeholder="0812-3456-7890"
                                        />
                                    </Field>

                                    <Field label="School email">
                                        <Input
                                            type="email"
                                            value={data.school_email}
                                            onChange={(event) => setData('school_email', event.target.value)}
                                            placeholder="admin@school.test"
                                        />
                                        {errors.school_email ? <p className="mt-2 text-sm text-red-300">{errors.school_email}</p> : null}
                                    </Field>

                                    <Field label="Timezone" description="Controls date/time rendering throughout the UI.">
                                        <Input
                                            value={data.timezone}
                                            onChange={(event) => setData('timezone', event.target.value)}
                                            placeholder="Asia/Jakarta"
                                        />
                                    </Field>

                                    <Field label="Currency" description="Used for money formatting.">
                                        <Input
                                            value={data.currency}
                                            onChange={(event) => setData('currency', event.target.value.toUpperCase())}
                                            placeholder="IDR"
                                        />
                                    </Field>
                                </div>
                            </div>
                        </SectionCard>

                        <SectionCard
                            title="POS settings"
                            description="Tune the cashier behavior, receipt output, and stock warning visibility."
                        >
                            <div className="grid gap-4 lg:grid-cols-2">
                                <ToggleSwitch
                                    label="Auto print receipt"
                                    description="Show receipt preview and keep the workflow quick for cashiers."
                                    checked={Boolean(data.pos_auto_print_receipt)}
                                    onChange={(value) => setData('pos_auto_print_receipt', value)}
                                    name="pos_auto_print_receipt"
                                />

                                <ToggleSwitch
                                    label="Enable QRIS"
                                    description="Allow Midtrans QRIS payments at checkout."
                                    checked={Boolean(data.pos_enable_qris)}
                                    onChange={(value) => setData('pos_enable_qris', value)}
                                    name="pos_enable_qris"
                                />

                                <ToggleSwitch
                                    label="Low stock warnings"
                                    description="Highlight products at or below the minimum stock threshold."
                                    checked={Boolean(data.pos_show_low_stock_warning)}
                                    onChange={(value) => setData('pos_show_low_stock_warning', value)}
                                    name="pos_show_low_stock_warning"
                                />

                                <Field
                                    label="Receipt footer text"
                                    description="Short message printed at the bottom of every receipt."
                                >
                                    <Textarea
                                        rows={4}
                                        value={data.receipt_footer_text}
                                        onChange={(event) => setData('receipt_footer_text', event.target.value)}
                                        placeholder="Terima kasih telah berbelanja."
                                    />
                                </Field>
                            </div>
                        </SectionCard>

                        <SectionCard
                            title="Midtrans configuration"
                            description="Secure payment gateway settings for QRIS and future online payment flows."
                        >
                            <div className="grid gap-5 lg:grid-cols-2">
                                <Field
                                    label="Server key"
                                    description={settings.midtrans.server_key_configured ? 'Already configured. Leave blank to keep the current key.' : 'Enter your Midtrans server key.'}
                                >
                                    <Input
                                        type="password"
                                        value={data.midtrans_server_key}
                                        onChange={(event) => setData('midtrans_server_key', event.target.value)}
                                        placeholder={settings.midtrans.server_key_configured ? 'Configured' : 'Enter server key'}
                                    />
                                    {errors.midtrans_server_key ? <p className="mt-2 text-sm text-red-300">{errors.midtrans_server_key}</p> : null}
                                </Field>

                                <Field
                                    label="Client key"
                                    description={settings.midtrans.client_key_configured ? 'Already configured. Leave blank to keep the current key.' : 'Enter your Midtrans client key.'}
                                >
                                    <Input
                                        type="password"
                                        value={data.midtrans_client_key}
                                        onChange={(event) => setData('midtrans_client_key', event.target.value)}
                                        placeholder={settings.midtrans.client_key_configured ? 'Configured' : 'Enter client key'}
                                    />
                                    {errors.midtrans_client_key ? <p className="mt-2 text-sm text-red-300">{errors.midtrans_client_key}</p> : null}
                                </Field>

                                <Field label="Merchant ID">
                                    <Input
                                        value={data.midtrans_merchant_id}
                                        onChange={(event) => setData('midtrans_merchant_id', event.target.value)}
                                        placeholder="Merchant ID"
                                    />
                                </Field>

                                <div className="space-y-4">
                                    <ToggleSwitch
                                        label="Production mode"
                                        description="Use the production Midtrans endpoints for live transactions."
                                        checked={Boolean(data.midtrans_is_production)}
                                        onChange={(value) => setData('midtrans_is_production', value)}
                                        name="midtrans_is_production"
                                    />

                                    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                                        <div className="text-sm font-semibold text-white">Gateway status</div>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            <Badge tone={settings.midtrans.server_key_configured ? 'emerald' : 'amber'}>
                                                {settings.midtrans.server_key_configured ? 'Server key set' : 'Server key empty'}
                                            </Badge>
                                            <Badge tone={settings.midtrans.client_key_configured ? 'emerald' : 'amber'}>
                                                {settings.midtrans.client_key_configured ? 'Client key set' : 'Client key empty'}
                                            </Badge>
                                            <Badge tone={data.midtrans_is_production ? 'amber' : 'cyan'}>
                                                {data.midtrans_is_production ? 'Production' : 'Sandbox'}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SectionCard>

                        <SectionCard
                            title="Mail and notifications"
                            description="Set sender identity and the inbox that receives operational alerts."
                        >
                            <div className="grid gap-5 lg:grid-cols-2">
                                <Field label="Mail from name">
                                    <Input
                                        value={data.mail_from_name}
                                        onChange={(event) => setData('mail_from_name', event.target.value)}
                                        placeholder="Koperasi POS"
                                    />
                                </Field>

                                <Field label="Mail from address">
                                    <Input
                                        type="email"
                                        value={data.mail_from_address}
                                        onChange={(event) => setData('mail_from_address', event.target.value)}
                                        placeholder="noreply@koperasi.test"
                                    />
                                </Field>

                                <Field label="Reply-to address">
                                    <Input
                                        type="email"
                                        value={data.mail_reply_to}
                                        onChange={(event) => setData('mail_reply_to', event.target.value)}
                                        placeholder="support@koperasi.test"
                                    />
                                </Field>

                                <Field label="Notifications inbox">
                                    <Input
                                        type="email"
                                        value={data.notifications_email}
                                        onChange={(event) => setData('notifications_email', event.target.value)}
                                        placeholder="admin@koperasi.test"
                                    />
                                </Field>
                            </div>
                        </SectionCard>

                        <SectionCard
                            title="Permissions and backup"
                            description="Control lightweight role access and the default backup policy."
                        >
                            <div className="grid gap-4 lg:grid-cols-2">
                                <ToggleSwitch
                                    label="Self registration"
                                    description="Allow new cashier accounts to register themselves."
                                    checked={Boolean(data.permission_self_registration)}
                                    onChange={(value) => setData('permission_self_registration', value)}
                                    name="permission_self_registration"
                                />

                                <ToggleSwitch
                                    label="Cashier refunds"
                                    description="Allow cashiers to process refunds without super admin approval."
                                    checked={Boolean(data.permission_cashier_refund)}
                                    onChange={(value) => setData('permission_cashier_refund', value)}
                                    name="permission_cashier_refund"
                                />

                                <ToggleSwitch
                                    label="Automated backups"
                                    description="Enable scheduled database and storage backups."
                                    checked={Boolean(data.backup_enabled)}
                                    onChange={(value) => setData('backup_enabled', value)}
                                    name="backup_enabled"
                                />

                                <Field label="Backup schedule">
                                    <Input
                                        value={data.backup_schedule}
                                        onChange={(event) => setData('backup_schedule', event.target.value)}
                                        placeholder="daily"
                                    />
                                </Field>

                                <Field label="Retention days">
                                    <Input
                                        type="number"
                                        min="1"
                                        max="365"
                                        value={data.backup_retention_days}
                                        onChange={(event) => setData('backup_retention_days', event.target.value)}
                                        placeholder="14"
                                    />
                                </Field>
                            </div>
                        </SectionCard>

                        <SectionCard
                            title="Appearance and maintenance"
                            description="Control the dark theme preference and temporarily pause the system for non-admin users."
                        >
                            <div className="grid gap-5 lg:grid-cols-2">
                                <ToggleSwitch
                                    label="Dark mode"
                                    description="Keep the modern dark admin look that matches the POS and reports modules."
                                    checked={darkModeEnabled}
                                    onChange={(value) => setData('appearance_theme', value ? 'dark' : 'light')}
                                    name="appearance_theme"
                                />

                                <ToggleSwitch
                                    label="System maintenance"
                                    description="Block non-super-admin users while maintenance is enabled."
                                    checked={Boolean(data.system_maintenance_enabled)}
                                    onChange={(value) => setData('system_maintenance_enabled', value)}
                                    name="system_maintenance_enabled"
                                />
                            </div>
                        </SectionCard>

                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processing ? 'Saving settings...' : 'Save settings'}
                            </button>

                            <p className="text-sm text-slate-500">
                                Changes are applied instantly across authenticated admin screens.
                            </p>
                        </div>
                    </form>

                    <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
                        <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80">
                                    <img
                                        src={settings.branding.logo_url}
                                        alt={settings.branding.app_name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Preview</p>
                                    <h3 className="mt-1 text-lg font-semibold text-white">{settings.branding.app_name}</h3>
                                    <p className="text-sm text-slate-400">{settings.branding.school_name || 'No school name set'}</p>
                                </div>
                            </div>

                            <div className="mt-6 space-y-4 text-sm text-slate-400">
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <div className="font-medium text-white">Receipt footer</div>
                                    <p className="mt-2 leading-6">{data.receipt_footer_text || 'No footer text configured.'}</p>
                                </div>

                                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                        <div className="font-medium text-white">Operational summary</div>
                                        <ul className="mt-3 space-y-2">
                                            <li>Brand logo: {hasBrandLogo ? 'Uploaded' : 'Not uploaded'}</li>
                                            <li>Favicon: {hasFavicon ? 'Uploaded' : 'Not uploaded'}</li>
                                            <li>Theme: {darkModeEnabled ? 'Dark' : 'Light'}</li>
                                            <li>Maintenance: {data.system_maintenance_enabled ? 'Enabled' : 'Disabled'}</li>
                                            <li>Timezone: {data.timezone}</li>
                                            <li>Currency: {data.currency}</li>
                                            <li>Backup: {data.backup_enabled ? 'Enabled' : 'Disabled'}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                        <div className="rounded-[1.75rem] border border-cyan-400/20 bg-cyan-400/10 p-6 text-cyan-50 shadow-2xl shadow-cyan-950/10">
                            <p className="text-xs uppercase tracking-[0.22em] text-cyan-100/70">Security note</p>
                            <p className="mt-3 text-sm leading-6 text-cyan-50/90">
                                Midtrans secret fields are intentionally hidden. Leave them blank to keep the current keys when saving other settings.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
