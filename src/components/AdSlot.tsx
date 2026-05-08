export function AdSlot({
  id,
  size,
  label = "Advertisement",
  sticky = false,
  className = "",
}: {
  id: string;
  size: "leaderboard" | "rectangle";
  label?: string;
  sticky?: boolean;
  className?: string;
}) {
  const dims =
    size === "leaderboard"
      ? "h-[90px] w-full max-w-[728px]"
      : "h-[250px] w-[300px]";
  return (
    <section
      aria-label="Advertisement"
      className={`my-6 ${sticky ? "sticky top-32" : ""} ${className}`}
    >
      <div className="mx-auto w-fit">
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {label}
          </span>
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-primary border border-primary/30">
            Ad
          </span>
        </div>
        <div
          id={id}
          className={`${dims} grid place-items-center rounded-lg border border-dashed border-border bg-card/50 anime-border text-xs text-muted-foreground`}
        >
          {size === "leaderboard" ? "728 × 90" : "300 × 250"}
        </div>
      </div>
    </section>
  );
}
