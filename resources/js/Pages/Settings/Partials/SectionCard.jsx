export default function SectionCard({ title, description, children, action = null }) {
    return (
        <section className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="flex flex-col gap-3 border-b border-white/10 pb-5 md:flex-row md:items-end md:justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{description}</p>
                </div>
                {action}
            </div>

            <div className="pt-6">{children}</div>
        </section>
    );
}
