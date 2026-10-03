import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ArtImage } from "@/components/ui/ArtImage";
import type { StorySummary } from "@/data/types";
import { cn, pad2 } from "@/lib/cn";

/** Previous / next story, as two cinematic tiles. */
export function StoryPager({
  prev,
  next,
  suffix = "",
  className,
}: {
  prev?: StorySummary;
  next?: StorySummary;
  /** Appended to story links, e.g. "/read" to stay inside the reader. */
  suffix?: string;
  className?: string;
}) {
  return (
    <nav aria-label="More stories" className={cn("grid gap-3 sm:grid-cols-2 sm:gap-4", className)}>
      {[prev, next].map((s, i) => {
        const isNext = i === 1;
        if (!s) return <div key={i} className="hidden sm:block" />;
        return (
          <Link
            key={s.id}
            href={`/stories/${s.slug}${suffix}`}
            className={cn(
              "group relative isolate flex min-h-[8.5rem] flex-col justify-end overflow-hidden rounded-2xl p-5 ring-1 ring-ivory/[0.08] transition-shadow duration-500 hover:ring-gold/35 sm:min-h-[10rem]",
              isNext && "sm:items-end sm:text-right",
            )}
          >
            <ArtImage artwork={s.artwork} sizes="(min-width: 640px) 50vw, 100vw" zoom className="absolute inset-0 -z-10" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-abyss via-abyss/70 to-abyss/30" />
            <span className="inline-flex items-center gap-2 text-[0.625rem] tracking-[0.22em] text-gold-soft/90 uppercase">
              {!isNext && <ArrowLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-1" />}
              {isNext ? "Next" : "Previous"} · Story {pad2(s.number)}
              {isNext && <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />}
            </span>
            <span className="mt-1.5 font-display text-[1.6rem] leading-tight text-ivory">{s.title.en}</span>
            <span className="te text-sm text-ivory/50">{s.title.te}</span>
          </Link>
        );
      })}
    </nav>
  );
}
