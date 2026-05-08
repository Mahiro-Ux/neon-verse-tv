import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { GenreTabs } from "@/components/GenreTabs";
import { Footer } from "@/components/Footer";
import { VideoCard } from "@/components/VideoCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { AdSlot } from "@/components/AdSlot";
import { SakuraParticles } from "@/components/SakuraParticles";
import { AnimeQuote } from "@/components/AnimeQuote";
import { trendingAnime } from "@/lib/youtube.functions";
import { GENRES } from "@/lib/constants";
import { formatViews } from "@/lib/format";

const trendingOpts = {
  queryKey: ["trending"],
  queryFn: () => trendingAnime({ data: { maxResults: 20, q: "anime" } }),
  staleTime: 5 * 60 * 1000,
};
const recentOpts = {
  queryKey: ["recent"],
  queryFn: () => trendingAnime({ data: { maxResults: 12, q: "new anime episode" } }),
  staleTime: 5 * 60 * 1000,
};

export const Route = createFileRoute("/")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(trendingOpts);
    context.queryClient.prefetchQuery(recentOpts);
  },
  component: HomePage,
});

function Hero() {
  const { data } = useSuspenseQuery(trendingOpts);
  const featured = data.items?.[0];
  if (!featured) return null;
  const thumb =
    featured.snippet.thumbnails?.maxres?.url ||
    featured.snippet.thumbnails?.high?.url ||
    featured.snippet.thumbnails?.medium?.url;
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {thumb && <img src={thumb} alt="" className="h-full w-full object-cover blur-[2px] scale-105 opacity-50" />}
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
      </div>
      <SakuraParticles />
      <div className="kanji-watermark absolute right-6 top-10 select-none text-[180px] leading-none md:text-[260px]">動画</div>

      <div className="relative mx-auto grid max-w-[1400px] gap-8 px-4 py-16 md:grid-cols-2 md:py-24">
        <div className="flex flex-col justify-center">
          <span className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            🔥 Trending Now
          </span>
          <h1 className="font-display text-4xl font-black leading-tight md:text-6xl">
            <span className="text-gradient">{featured.snippet.title}</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            {featured.snippet.channelTitle} · {formatViews(featured.statistics?.viewCount)} views
          </p>
          <p className="mt-4 line-clamp-3 max-w-xl text-sm text-muted-foreground">
            {featured.snippet.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/watch"
              search={{ v: featured.id as string }}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--gradient-primary)] px-6 py-3 text-sm font-bold text-white shadow-[var(--shadow-glow)] transition-all hover:scale-105 hover:shadow-[var(--shadow-glow-strong)]"
            >
              ▶ Watch Now
            </Link>
            <button className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-6 py-3 text-sm font-bold text-foreground backdrop-blur hover:border-primary hover:text-primary">
              ＋ Add to List
            </button>
          </div>
        </div>
        <div className="hidden md:block">
          <div className="anime-border relative aspect-video overflow-hidden rounded-2xl shadow-[var(--shadow-glow-strong)] animate-float">
            {thumb && <img src={thumb} alt="" className="h-full w-full object-cover" />}
            <div className="absolute inset-0 grid place-items-center bg-black/30">
              <div className="grid h-20 w-20 place-items-center rounded-full bg-[var(--gradient-primary)] shadow-[var(--shadow-glow-strong)]">
                <span className="text-3xl text-white">▶</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrendingRow() {
  const { data } = useSuspenseQuery(trendingOpts);
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-10">
      <SectionHeader title="Trending Now" icon="🔥" subtitle="Hottest anime this week" />
      <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-4 pb-2" style={{ width: "max-content" }}>
          {data.items.slice(0, 12).map((v: any) => (
            <div key={v.id} className="w-72 shrink-0">
              <VideoCard video={v} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RecentGrid() {
  const { data, isLoading } = useQuery(recentOpts);
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-10">
      <SectionHeader title="Recently Uploaded" icon="✨" subtitle="Fresh from the studios" />
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : data?.items?.slice(0, 8).map((v: any) => <VideoCard key={v.id} video={v} />)}
      </div>
    </section>
  );
}

function CategoriesSection() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-10">
      <SectionHeader title="Top Categories" icon="🎴" subtitle="Pick your vibe" />
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {GENRES.slice(1, 7).map((g, i) => (
          <Link
            key={g.slug}
            to="/category/$genre"
            params={{ genre: g.slug }}
            className="group anime-border relative overflow-hidden rounded-xl p-6 text-center transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-glow-strong)]"
            style={{
              background: `linear-gradient(135deg, oklch(${0.25 + (i % 3) * 0.05} 0.1 ${(i * 60) % 360}), oklch(0.18 0.05 270))`,
            }}
          >
            <div className="text-5xl transition-transform group-hover:scale-125 group-hover:rotate-12">
              {g.icon}
            </div>
            <div className="mt-3 font-display text-lg font-bold text-white">{g.label}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function SectionHeader({ title, icon, subtitle }: { title: string; icon: string; subtitle?: string }) {
  return (
    <div className="mb-5 flex items-end justify-between">
      <div>
        <h2 className="font-display text-3xl font-black flex items-center gap-2">
          <span>{icon}</span>
          <span className="text-gradient">{title}</span>
        </h2>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <Link to="/search" search={{ q: "anime" }} className="text-xs font-bold uppercase tracking-wider text-primary hover:underline">
        View All →
      </Link>
    </div>
  );
}

function WaveDivider() {
  return (
    <svg viewBox="0 0 1440 60" className="block h-12 w-full text-surface" preserveAspectRatio="none" aria-hidden>
      <path fill="currentColor" d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" />
    </svg>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <GenreTabs />
      <Suspense fallback={<div className="h-[70vh] grid place-items-center"><SkeletonCard /></div>}>
        <Hero />
      </Suspense>
      <WaveDivider />

      <div className="mx-auto max-w-[1400px] px-4">
        <AdSlot id="ad-homepage-banner" size="leaderboard" />
      </div>

      <div className="mx-auto max-w-[1400px] px-4 lg:grid lg:grid-cols-[1fr_320px] lg:gap-8">
        <div>
          <Suspense fallback={<div className="grid grid-cols-4 gap-4 py-10">{Array.from({length:4}).map((_,i)=><SkeletonCard key={i}/>)}</div>}>
            <TrendingRow />
          </Suspense>
          <RecentGrid />
          <CategoriesSection />
        </div>
        <aside className="hidden lg:block py-10 space-y-6">
          <AdSlot id="ad-homepage-sidebar" size="rectangle" label="Sponsored" sticky />
          <AnimeQuote />
        </aside>
      </div>

      <Footer showAd />
    </div>
  );
}
