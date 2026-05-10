import { Link } from "@tanstack/react-router";
import { GENRES } from "@/lib/constants";

const MAIN = [
  { to: "/", label: "Home", icon: "🏠" },
  { to: "/search", label: "Explore", icon: "🧭", search: { q: "anime" } },
  { to: "/category/$genre", label: "Trending", icon: "🔥", params: { genre: "trending" } },
] as const;

export function Sidebar({ active }: { active?: string }) {
  return (
    <aside className="hidden lg:block w-60 shrink-0 border-r border-border bg-surface/40 sticky top-[64px] h-[calc(100vh-64px)] overflow-y-auto py-4">
      <nav className="px-2 space-y-1">
        {MAIN.map((item: any) => (
          <Link
            key={item.label}
            to={item.to}
            params={item.params}
            search={item.search}
            className="flex items-center gap-4 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-card hover:text-primary transition-colors"
          >
            <span className="text-lg w-6 text-center">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="my-3 h-px bg-border mx-3" />

      <div className="px-5 pb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        Genres
      </div>
      <nav className="px-2 space-y-0.5">
        {GENRES.map((g) => (
          <Link
            key={g.slug}
            to="/category/$genre"
            params={{ genre: g.slug }}
            data-active={active === g.slug ? "true" : "false"}
            className="flex items-center gap-4 rounded-xl px-3 py-2 text-sm text-foreground hover:bg-card hover:text-primary transition-colors data-[active=true]:bg-card data-[active=true]:text-primary data-[active=true]:font-bold"
          >
            <span className="text-base w-6 text-center">{g.icon}</span>
            <span>{g.label}</span>
          </Link>
        ))}
      </nav>

      <div className="my-3 h-px bg-border mx-3" />

      <div className="px-5 py-2 text-[10px] text-muted-foreground/70 leading-relaxed">
        © {new Date().getFullYear()} AnimeTube<br />
        Powered by YouTube Data API
      </div>
    </aside>
  );
}
