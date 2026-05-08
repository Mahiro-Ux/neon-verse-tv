import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTheme } from "@/hooks/use-theme";

export function Navbar() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const { theme, toggle } = useTheme();

  return (
    <header className="glass sticky top-0 z-50">
      <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--gradient-primary)] font-display text-xl font-black text-white shadow-[var(--shadow-glow)] group-hover:animate-pulse-glow">
            A
          </div>
          <div className="leading-none">
            <span className="font-display text-2xl font-black text-gradient">AnimeTube</span>
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">動画 · stream</div>
          </div>
        </Link>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const query = q.trim();
            if (query) navigate({ to: "/search", search: { q: query } });
          }}
          className="ml-2 flex flex-1 max-w-2xl"
        >
          <div className="relative w-full">
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search anime videos..."
              className="w-full rounded-full border border-border bg-input/70 px-5 py-2.5 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 focus:shadow-[var(--shadow-glow)]"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 grid h-8 w-9 place-items-center rounded-full bg-[var(--gradient-primary)] text-white hover:shadow-[var(--shadow-glow-strong)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </button>
          </div>
        </form>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-foreground hover:border-primary hover:text-primary"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <button
            aria-label="Language"
            className="hidden h-9 items-center rounded-full border border-border bg-card px-3 text-xs font-bold text-foreground hover:border-primary md:inline-flex"
          >
            EN / 日本
          </button>
          <div className="grid h-9 w-9 place-items-center rounded-full bg-[var(--gradient-primary)] font-bold text-white">
            U
          </div>
        </div>
      </div>
      <div className="h-[2px] w-full bg-[linear-gradient(90deg,#e94560,#f59e0b,#facc15,#22c55e,#3b82f6,#8b5cf6,#e94560)] bg-[length:200%_100%]"
        style={{ animation: "rainbow-shift 6s linear infinite" }} />
    </header>
  );
}
