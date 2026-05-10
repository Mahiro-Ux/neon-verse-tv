import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { VideoCard } from "@/components/VideoCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { AdSlot } from "@/components/AdSlot";
import { trendingAnime, searchVideos } from "@/lib/youtube.functions";
import { GENRES } from "@/lib/constants";
import { useState } from "react";

const trendingOpts = {
  queryKey: ["trending"],
  queryFn: () => trendingAnime({ data: { maxResults: 40, q: "anime" } }),
  staleTime: 5 * 60 * 1000,
};

export const Route = createFileRoute("/")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(trendingOpts);
  },
  component: HomePage,
});

const CHIPS = [
  { label: "All", q: "anime" },
  ...GENRES.map((g) => ({ label: `${g.icon} ${g.label}`, q: `${g.label} anime` })),
  { label: "AMV", q: "anime AMV" },
  { label: "OP", q: "anime opening" },
  { label: "ED", q: "anime ending" },
];

function ChipBar({ active, onChange }: { active: string; onChange: (q: string) => void }) {
  return (
    <div className="sticky top-[64px] z-30 -mx-4 mb-4 border-b border-border bg-background/85 backdrop-blur px-4">
      <div className="flex gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CHIPS.map((c) => (
          <button
            key={c.label}
            onClick={() => onChange(c.q)}
            data-active={active === c.q ? "true" : "false"}
            className="anime-pill shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap"
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function VideoGrid() {
  const [q, setQ] = useState("anime");
  const isAll = q === "anime";
  const { data: trending } = useQuery(trendingOpts);
  const { data: filtered, isLoading } = useQuery({
    queryKey: ["home", q],
    queryFn: () => searchVideos({ data: { q, order: "viewCount", maxResults: 32 } }),
    enabled: !isAll,
    staleTime: 5 * 60 * 1000,
  });

  const items = isAll ? trending?.items : filtered?.items;
  const showSkeleton = !isAll && isLoading;

  return (
    <>
      <ChipBar active={q} onChange={setQ} />
      <div className="grid gap-x-4 gap-y-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {showSkeleton || !items
          ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
          : items.flatMap((v: any, i: number) => {
              const card = <VideoCard key={v.id} video={v} />;
              // Insert a single discreet ad after the 8th video
              if (i === 7) {
                return [
                  card,
                  <div key="ad-feed" className="col-span-1">
                    <AdSlot id="ad-home-feed" size="rectangle" />
                  </div>,
                ];
              }
              return [card];
            })}
      </div>
    </>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-w-0 px-4 py-4">
          <div className="mx-auto max-w-[1600px]">
            <VideoGrid />
            <div className="mt-12 text-center">
              <Link
                to="/search"
                search={{ q: "anime" }}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--gradient-primary)] px-6 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-glow)] hover:shadow-[var(--shadow-glow-strong)]"
              >
                Browse all anime →
              </Link>
            </div>
            <p className="mt-10 text-center text-[10px] text-muted-foreground/60">
              © {new Date().getFullYear()} AnimeTube · Powered by YouTube Data API · For demo use
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
