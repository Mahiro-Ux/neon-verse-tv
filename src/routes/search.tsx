import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { Navbar } from "@/components/Navbar";
import { GenreTabs } from "@/components/GenreTabs";
import { Footer } from "@/components/Footer";
import { VideoCard } from "@/components/VideoCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { AdSlot } from "@/components/AdSlot";
import { searchVideos } from "@/lib/youtube.functions";
import { useNavigate } from "@tanstack/react-router";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  order: fallback(z.enum(["relevance", "date", "viewCount", "rating"]), "relevance").default("relevance"),
  videoDuration: fallback(z.enum(["any", "short", "medium", "long"]), "any").default("any"),
});

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(searchSchema),
  component: SearchPage,
});

function SearchPage() {
  const { q, order, videoDuration } = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });
  const { data, isLoading } = useQuery({
    queryKey: ["search", q, order, videoDuration],
    queryFn: () => searchVideos({ data: { q: q || "anime", order, videoDuration, maxResults: 24 } }),
    enabled: !!q,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <GenreTabs />
      <main className="mx-auto max-w-[1400px] px-4 py-8">
        <h1 className="rainbow-underline inline-block font-display text-3xl font-black">
          Results for: <span className="text-gradient">{q || "—"}</span>
        </h1>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sort:</label>
          <select
            value={order}
            onChange={(e) => navigate({ search: (p) => ({ ...p, order: e.target.value as any }) })}
            className="anime-border rounded-full bg-card px-4 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="relevance">Relevance</option>
            <option value="date">Upload Date</option>
            <option value="viewCount">View Count</option>
            <option value="rating">Rating</option>
          </select>
          <label className="ml-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Duration:</label>
          <select
            value={videoDuration}
            onChange={(e) => navigate({ search: (p) => ({ ...p, videoDuration: e.target.value as any }) })}
            className="anime-border rounded-full bg-card px-4 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="any">Any</option>
            <option value="short">Short (&lt; 4 min)</option>
            <option value="medium">Medium (4–20 min)</option>
            <option value="long">Long (&gt; 20 min)</option>
          </select>
        </div>

        <div className="mt-6 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)
            : data?.items?.map((v: any) => <VideoCard key={v.id} video={v} />)}
        </div>

        {!isLoading && (data?.items?.length || 0) === 0 && q && (
          <div className="py-16 text-center">
            <div className="text-6xl">🍥</div>
            <p className="mt-4 text-muted-foreground">No results found for "{q}"</p>
          </div>
        )}

        {(data?.items?.length || 0) >= 20 && (
          <AdSlot id="ad-search-bottom" size="leaderboard" />
        )}
      </main>
      <Footer />
    </div>
  );
}
