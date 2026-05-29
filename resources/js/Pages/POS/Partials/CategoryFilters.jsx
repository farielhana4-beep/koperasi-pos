export default function CategoryFilters({
    categories,
    selectedCategory,
    onSelectCategory,
}) {
    const safeCategories = Array.isArray(categories) ? categories : [];

    return (
        <div className="flex flex-wrap gap-2">
            <button
                type="button"
                onClick={() => onSelectCategory('all')}
                className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] transition duration-300 hover:-translate-y-0.5 ${
                    selectedCategory === 'all'
                        ? 'border-cyan-400/30 bg-cyan-400/15 text-cyan-200 shadow-lg shadow-cyan-500/10'
                        : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
            >
                All Products
            </button>

            {safeCategories.filter((category) => category !== 'all').map((category) => (
                <button
                    key={category}
                    type="button"
                    onClick={() => onSelectCategory(category)}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] transition duration-300 hover:-translate-y-0.5 ${
                        selectedCategory === category
                            ? 'border-cyan-400/30 bg-cyan-400/15 text-cyan-200 shadow-lg shadow-cyan-500/10'
                            : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                >
                    {category}
                </button>
            ))}
        </div>
    );
}
