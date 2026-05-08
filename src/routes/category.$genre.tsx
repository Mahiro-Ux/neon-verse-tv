import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { GenreTabs } from "@/components/GenreTabs";
import { Footer } from "@/components/Footer";
import { VideoCard } from "@/components/VideoCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { AdSlot } from "@/components/AdSlot";
import { searchVideos } from "@/lib/youtube.functions";
import { GENRES } from "@/lib/constants";

export const Route = createFileRoute("/category/$genre")({
  component: CategoryPage,
});

function CategoryPage() {
  const { genre } = Route.useParams();
  const meta = GENRES.find((g) => g.slug === genre) || { slug: genre, label: genre, icon: "🎴" };
  const q = `${meta.label} anime`;
  const { data, isLoading } = useQuery({
    queryKey: ["category", q],
    queryFn: () => searchVideos({ data: { q, order: "viewCount", maxResults: 24 } }),
    staleTime: 5 * 60 * 1000,
  });
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <GenreTabs active={genre} />
      <main className="mx-auto max-w-[1400px] px-4 py-8">
        <header className="anime-border relative overflow-hidden rounded-2xl bg-[var(--gradient-card)] p-8">
          <div className="kanji-watermark absolute -right-4 -top-4 text-[160px] leading-none">{meta.icon}</div>
          <div className="relative">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Category</span>
            <h1 className="mt-2 font-display text-4xl font-black md:text-5xl">
              <span className="mr-2">{meta.icon}</span>
              <span className="text-gradient">{meta.label}</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              The very best of <strong>{meta.label}</strong> anime.
            </p>
          </div>
        </header>

        <div className="mx-auto w-fit"><AdSlot id="ad-category-top" size="leaderboard" /></div>

        <div className="mt-4 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : data?.items?.map((v: any) => <VideoCard key={v.id} video={v} />)}
        </div>
      </main>
      <Footer />
    </div>
  );
}
