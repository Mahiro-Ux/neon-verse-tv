import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { AdSlot } from "@/components/AdSlot";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About AnimeTube" },
      { name: "description", content: "About AnimeTube — anime streaming experience powered by YouTube." },
    ],
  }),
  component: AboutPage,
});

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="anime-border rounded-2xl bg-card/60 p-6 scroll-mt-24">
      <h2 className="font-display text-2xl font-bold text-gradient">{title}</h2>
      <div className="mt-3 text-sm text-muted-foreground leading-relaxed space-y-2">{children}</div>
    </section>
  );
}

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-w-0 px-4 py-6">
          <div className="mx-auto max-w-3xl space-y-6">
            <header>
              <h1 className="font-display text-4xl font-black">
                About <span className="text-gradient">AnimeTube</span>
              </h1>
              <p className="mt-2 text-muted-foreground">
                A clean, login-free anime streaming experience powered by the YouTube Data API.
              </p>
            </header>

            <Section id="about" title="What is AnimeTube?">
              <p>
                AnimeTube is a fan-made interface that surfaces anime videos available publicly on YouTube.
                We don't host any video — playback streams from YouTube's official player.
              </p>
              <p>No accounts, no tracking servers, no ads from sketchy networks.</p>
            </Section>

            <Section id="help" title="Help & FAQ">
              <p><strong>Why no Like / Subscribe button?</strong> Liking or subscribing requires a YouTube account.
                The Like / Dislike buttons here jump you to YouTube so you can interact safely with your own account.</p>
              <p><strong>Download?</strong> The Download button opens a third-party download helper for the current video.
                Use it only for content you have the right to keep.</p>
              <p><strong>Live & Shorts?</strong> Use the sidebar to switch between Home, Shorts (under 4 min) and Live broadcasts.</p>
            </Section>

            <Section id="privacy" title="Privacy">
              <p>We don't have a backend account system. Your watch history and recent searches are saved
                <strong> only on your own device</strong> (localStorage) to give you better recommendations.</p>
              <p>You can clear them anytime from your browser settings — or by clicking the clear button on the homepage history section.</p>
            </Section>

            <Section id="terms" title="Terms">
              <p>All anime videos, thumbnails, titles and channels are property of their respective owners.
                AnimeTube is an unofficial, non-commercial interface and is not affiliated with YouTube or any anime studio.</p>
            </Section>

            <AdSlot id="ad-about-bottom" size="leaderboard" />

            <div className="text-center">
              <Link to="/" className="text-primary underline">← Back home</Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
