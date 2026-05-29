export default function ToggleSwitch({ label, description, checked, onChange, name }) {
    return (
        <label className="flex cursor-pointer items-start justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10">
            <div>
                <div className="text-sm font-semibold text-white">{label}</div>
                <div className="mt-1 text-sm leading-6 text-slate-400">{description}</div>
            </div>

            <span className="relative inline-flex shrink-0">
                <input
                    type="checkbox"
                    name={name}
                    checked={checked}
                    onChange={(event) => onChange(event.target.checked)}
                    className="peer sr-only"
                />
                <span className="h-7 w-12 rounded-full border border-white/10 bg-slate-700 transition peer-checked:bg-cyan-500/80" />
                <span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white transition peer-checked:translate-x-5" />
            </span>
        </label>
    );
}
