import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { VideoCard } from "@/components/VideoCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { AdSlot } from "@/components/AdSlot";
import { trendingAnime, searchVideos } from "@/lib/youtube.functions";
import { useWatchHistory, topKeywords } from "@/hooks/use-watch-history";

const trendingOpts = {
  queryKey: ["trending"],
  queryFn: () => trendingAnime({ data: { maxResults: 40, q: "anime" } }),
  staleTime: 5 * 60 * 1000,
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AnimeTube — Watch anime, free, no login" },
      { name: "description", content: "Stream the latest anime, shorts, and live broadcasts. No login required." },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(trendingOpts);
  },
  component: HomePage,
});

function ContinueWatching() {
  const { items, clear } = useWatchHistory();
  if (items.length === 0) return null;
  return (
    <section className="mb-8">
      <div className="mb-3 flex items-end justify-between gap-3">
        <h2 className="font-display text-xl font-bold flex items-center gap-2">
          <span>▶️</span><span className="text-gradient">Continue watching</span>
        </h2>
        <button onClick={clear} className="text-xs text-muted-foreground hover:text-primary underline">Clear history</button>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-3 [scrollbar-width:thin]">
        {items.slice(0, 12).map((it) => (
          <Link
            key={it.id}
            to="/watch"
            search={{ v: it.id }}
            className="group w-56 shrink-0"
          >
            <div className="relative aspect-video overflow-hidden rounded-xl bg-muted anime-border">
              {it.thumb && <img src={it.thumb} alt="" loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-110" />}
            </div>
            <p className="mt-2 line-clamp-2 text-xs font-semibold group-hover:text-primary">{it.title}</p>
            <p className="text-[11px] text-muted-foreground truncate">{it.channelTitle}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ForYou() {
  const kws = topKeywords(3);
  const q = kws.length ? kws.join(" ") : "anime";
  const { data, isLoading } = useQuery({
    queryKey: ["foryou", q],
    queryFn: () => searchVideos({ data: { q, order: "relevance", maxResults: 12 } }),
    enabled: kws.length > 0,
    staleTime: 5 * 60 * 1000,
  });
  if (kws.length === 0) return null;
  return (
    <section className="mb-10">
      <h2 className="mb-3 font-display text-xl font-bold flex items-center gap-2">
        <span>✨</span><span className="text-gradient">Recommended for you</span>
        <span className="text-[10px] text-muted-foreground font-normal ml-2">based on what you watch</span>
      </h2>
      <div className="grid gap-x-4 gap-y-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading || !data
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : data.items.slice(0, 8).map((v: any) => <VideoCard key={v.id} video={v} />)}
      </div>
    </section>
  );
}

function Trending() {
  const { data } = useQuery(trendingOpts);
  return (
    <section>
      <h2 className="mb-3 font-display text-xl font-bold flex items-center gap-2">
        <span>🔥</span><span className="text-gradient">Trending now</span>
      </h2>
      <div className="grid gap-x-4 gap-y-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {!data
          ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
          : data.items.flatMap((v: any, i: number) => {
              const card = <VideoCard key={v.id} video={v} />;
              if (i === 7) return [card, <div key="ad" className="col-span-1"><AdSlot id="ad-home-feed" /></div>];
              if (i === 19) return [card, <div key="ad2" className="col-span-1"><AdSlot id="ad-home-feed-2" /></div>];
              return [card];
            })}
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-w-0 px-3 py-4 sm:px-4 sm:py-6">
          <div className="mx-auto max-w-[1600px]">
            <ContinueWatching />
            <ForYou />
            <Trending />
            <div className="mt-12 text-center">
              <Link
                to="/search"
                search={{ q: "anime" }}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--gradient-primary)] px-6 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-glow)] hover:shadow-[var(--shadow-glow-strong)]"
              >
                Browse all anime →
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
