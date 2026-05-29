export function GlassCard({ className = '', children }) {
    return (
        <div
            className={`glass-card rounded-[1.9rem] border border-white/10 bg-slate-900/70 shadow-2xl shadow-black/20 backdrop-blur-xl ${className}`}
        >
            {children}
        </div>
    );
}

export function SectionHeading({ eyebrow, title, description, actions = null }) {
    return (
        <div className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
                {eyebrow ? (
                    <div className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
                        {eyebrow}
                    </div>
                ) : null}
                <h2 className="text-2xl font-semibold tracking-tight text-white">
                    {title}
                </h2>
                {description ? (
                    <p className="max-w-3xl text-sm leading-6 text-slate-400">
                        {description}
                    </p>
                ) : null}
            </div>
            {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
        </div>
    );
}

export function EmptyState({ title, description, action = null, icon = null }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-white/10 bg-white/[0.03] px-6 py-16 text-center">
            {icon ? (
                <div className="mb-4 rounded-3xl border border-white/10 bg-white/5 p-4 text-cyan-300">
                    {icon}
                </div>
            ) : null}
            <div className="text-lg font-semibold text-white">{title}</div>
            <p className="mt-2 max-w-lg text-sm leading-6 text-slate-400">{description}</p>
            {action ? <div className="mt-5">{action}</div> : null}
        </div>
    );
}

export function SkeletonLine({ className = '' }) {
    return <div className={`animate-pulse rounded-full bg-white/10 ${className}`} />;
}

export function SkeletonCard() {
    return (
        <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-5">
            <SkeletonLine className="h-4 w-24" />
            <SkeletonLine className="mt-4 h-8 w-2/3" />
            <SkeletonLine className="mt-3 h-4 w-full" />
            <SkeletonLine className="mt-2 h-4 w-5/6" />
        </div>
    );
}

