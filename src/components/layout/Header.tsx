// src/components/layout/Header.tsx

export default function Header() {
    return (
        <header className="flex items-center justify-between">
            <div className="text-sm font-semibold tracking-[0.3em] uppercase">
                Elssila
            </div>

            <nav className="flex gap-8 text-xs font-medium tracking-[0.25em] uppercase text-slate-600">
                <button className="hover:text-slate-900 transition-colors">
                    Projects
                </button>
                <button className="hover:text-slate-900 transition-colors">
                    Capabilities
                </button>
            </nav>
        </header>
    );
}