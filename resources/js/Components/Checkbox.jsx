export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-white/15 bg-slate-950/70 text-cyan-400 shadow-sm focus:ring-cyan-400/30 ' +
                className
            }
        />
    );
}
