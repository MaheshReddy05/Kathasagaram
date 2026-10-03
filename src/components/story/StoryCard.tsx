import { Clock3, Headphones } from "lucide-react";
import Link from "next/link";
import { ArtImage } from "@/components/ui/ArtImage";
import type { StorySummary } from "@/data/types";
import { cn, pad2 } from "@/lib/cn";
import { StoryProgress } from "./StoryProgress";

interface StoryCardProps {
  story: StorySummary;
  variant?: "poster" | "row";
  className?: string;
  priority?: boolean;
}

/**
 * Story card.
 *  - poster: tall cinematic card for rails and grids.
 *  - row: landscape list row for long lists on narrow screens.
 */
export function StoryCard({ story, variant = "poster", className, priority }: StoryCardProps) {
  const href = `/stories/${story.slug}`;

  if (variant === "row") {
    return (
      <Link
        href={href}
        className={cn(
          "group surface flex items-center gap-4 rounded-2xl p-2.5 pr-4 transition-colors duration-500 hover:border-gold/30",
          className,
        )}
      >
        <ArtImage artwork={story.artwork} sizes="96px" zoom className="aspect-[4/5] w-[5.25rem] shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1 py-1">
          <p className="text-[0.625rem] tracking-[0.22em] text-gold/80 uppercase">Story {pad2(story.number)}</p>
          <h3 className="mt-1 font-display text-[1.3rem] leading-tight font-medium text-ivory">{story.title.en}</h3>
          <p className="te mt-0.5 truncate text-[0.8125rem] text-ivory/45">{story.title.te}</p>
          <StoryProgress storyId={story.id} className="mt-2.5" />
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className={cn("group block", className)}>
      <div className="relative overflow-hidden rounded-[1.25rem] ring-1 ring-ivory/[0.08] transition-[box-shadow,transform] duration-700 ease-[var(--ease-cinematic)] group-hover:ring-gold/35 group-hover:shadow-[0_30px_60px_-30px_rgb(201_163_91/0.35)]">
        <ArtImage
          artwork={story.artwork}
          sizes="(min-width: 1024px) 280px, (min-width: 640px) 240px, 70vw"
          priority={priority}
          zoom
          className="aspect-[3/4] w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/35 to-transparent" />
        <span className="absolute top-3 left-4 font-display text-[3.25rem] leading-none font-medium text-ivory/90 italic drop-shadow-[0_2px_12px_rgb(0_0_0/0.5)]">
          {pad2(story.number)}
        </span>
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <h3 className="font-display text-[1.45rem] leading-[1.05] font-medium text-ivory text-balance">{story.title.en}</h3>
          <p className="te mt-1 text-[0.8125rem] text-gold-soft/75">{story.title.te}</p>
          <div className="mt-3 flex items-center gap-3 text-[0.6875rem] text-ivory/55">
            <span className="inline-flex items-center gap-1">
              <Clock3 className="size-3" /> {story.readingMinutes.en} min
            </span>
            <span className="inline-flex items-center gap-1">
              <Headphones className="size-3" /> Audio
            </span>
          </div>
          <StoryProgress storyId={story.id} className="mt-3" />
        </div>
      </div>
    </Link>
  );
}
