import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { BellIcon, SearchIcon } from '@/Components/Icons';

export default function Navbar({ onMenuClick, title = 'Dashboard' }) {
    const user = usePage().props.auth.user;
    const settings = usePage().props.settings ?? {};
    const branding = settings.branding ?? {};

    return (
        <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur-2xl">
            <div className="flex min-h-20 items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex min-w-0 items-center gap-3">
                    <button
                        type="button"
                        onClick={onMenuClick}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:bg-white/10 hover:text-white lg:hidden"
                        aria-label="Open navigation menu"
                    >
                        <svg
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M4 6h16" />
                            <path d="M4 12h16" />
                            <path d="M4 18h16" />
                        </svg>
                    </button>

                    <div className="min-w-0">
                        <div className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
                            {branding.app_name ?? 'Admin Panel'}
                        </div>
                        <div className="mt-1 flex items-center gap-3">
                            <h1 className="truncate text-xl font-semibold tracking-tight text-white sm:text-2xl">
                                {title}
                            </h1>
                            <span className="hidden rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-200 md:inline-flex">
                                Live SaaS
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <label className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-400 xl:flex">
                        <SearchIcon className="h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search products, invoices, customers..."
                            className="w-72 border-0 bg-transparent p-0 text-sm text-white placeholder:text-slate-500 focus:ring-0"
                        />
                    </label>

                    <button
                        type="button"
                        className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:bg-white/10 hover:text-white md:inline-flex"
                        aria-label="Notifications"
                    >
                        <BellIcon className="h-5 w-5" />
                    </button>

                    <Dropdown>
                        <Dropdown.Trigger>
                            <button
                                type="button"
                                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-left transition hover:bg-white/10"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(34,211,238,0.95),rgba(59,130,246,0.95))] text-sm font-bold text-slate-950 shadow-lg shadow-cyan-950/20">
                                    {user?.name?.charAt(0) ?? 'U'}
                                </div>
                                <div className="hidden sm:block">
                                    <div className="text-sm font-semibold text-white">
                                        {user?.name}
                                    </div>
                                    <div className="text-xs text-slate-400">
                                        {user?.role}
                                    </div>
                                </div>
                                <svg
                                    className="h-4 w-4 text-slate-400"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </Dropdown.Trigger>

                        <Dropdown.Content>
                            <Dropdown.Link href={route('profile.edit')}>
                                Profile
                            </Dropdown.Link>
                            <Dropdown.Link
                                href={route('logout')}
                                method="post"
                                as="button"
                            >
                                Log out
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </div>
        </header>
    );
}
