import Navbar from '@/Components/Navbar';
import Sidebar from '@/Components/Sidebar';
import ToastStack from '@/Components/ToastStack';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function AppLayout({ header, title = 'Dashboard', children }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { settings } = usePage().props;
    const themeMode = settings?.appearance?.theme_mode ?? 'dark';
    const isLight = themeMode === 'light';

    useEffect(() => {
        const root = document.documentElement;

        root.classList.toggle('dark', !isLight);
        root.dataset.theme = themeMode;
    }, [isLight, themeMode]);

    return (
        <div className={`relative min-h-screen overflow-hidden ${isLight ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'}`}>
            <Head title={title} />

            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className={`absolute -top-24 right-0 h-80 w-80 rounded-full blur-3xl ${isLight ? 'bg-cyan-300/25' : 'bg-cyan-500/18'}`} />
                <div className={`absolute left-0 top-1/3 h-[28rem] w-[28rem] rounded-full blur-3xl ${isLight ? 'bg-blue-300/20' : 'bg-blue-600/12'}`} />
                <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:72px_72px]" />
            </div>

            <div className="relative flex min-h-screen">
                <div className="hidden w-80 shrink-0 border-r border-white/10 lg:flex lg:flex-col">
                    <Sidebar />
                </div>

                {mobileOpen ? (
                    <div className="fixed inset-0 z-40 lg:hidden">
                        <button
                            type="button"
                            className="absolute inset-0 bg-slate-950/70"
                            onClick={() => setMobileOpen(false)}
                            aria-label="Close navigation overlay"
                        />
                        <div className="relative z-10 h-full w-80 max-w-[85vw] shadow-2xl shadow-black/40">
                            <Sidebar mobile onNavigate={() => setMobileOpen(false)} />
                        </div>
                    </div>
                ) : null}

                <div className="flex min-w-0 flex-1 flex-col">
                    <Navbar
                        title={title}
                        onMenuClick={() => setMobileOpen((open) => !open)}
                    />

                    <main className="relative flex-1">
                        <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                            {header ? (
                                <div className="glass-card mb-6 rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                                    {header}
                                </div>
                            ) : null}

                            {children}
                        </div>
                    </main>
                </div>
            </div>

            <ToastStack />
        </div>
    );
}
