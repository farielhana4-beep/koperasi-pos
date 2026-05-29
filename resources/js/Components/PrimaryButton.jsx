export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white px-4 py-3 text-xs font-semibold uppercase tracking-widest text-slate-950 transition duration-150 ease-in-out hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 active:bg-slate-200 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
