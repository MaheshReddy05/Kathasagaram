"use client";

import { BookOpen, Headphones, Play } from "lucide-react";
import Link from "next/link";
import { useAudio } from "@/components/audio/AudioProvider";
import { ArtImage } from "@/components/ui/ArtImage";
import { ProgressBar } from "@/components/ui/primitives";
import type { StorySummary } from "@/data/types";
import { formatTime, pad2 } from "@/lib/cn";
import { useHydrated, useLibrary } from "@/lib/use-library";

interface Item {
  kind: "reading" | "listening";
  story: StorySummary;
  progress: number;
  note: string;
  at: number;
}

/** Builds "continue" items from local reading and listening progress. */
export function useJourney(stories: StorySummary[]): Item[] {
  const reading = useLibrary("reading");
  const listening = useLibrary("listening");
  const find = (id: string) => stories.find((s) => s.id === id);
  const items: Item[] = [];

  for (const [id, r] of Object.entries(reading)) {
    const story = find(id);
    if (story && r.progress > 0.02 && r.progress < 0.97)
      items.push({ kind: "reading", story, progress: r.progress, note: `${Math.round(r.progress * 100)}% read`, at: r.updatedAt });
  }
  for (const [id, l] of Object.entries(listening)) {
    const story = find(id);
    const p = l.duration ? l.position / l.duration : 0;
    if (story && p > 0.01 && p < 0.98)
      items.push({ kind: "listening", story, progress: p, note: `${formatTime(l.duration - l.position)} left`, at: l.updatedAt });
  }
  return items.sort((a, b) => b.at - a.at);
}

export function ContinueJourney({ stories, firstStory }: { stories: StorySummary[]; firstStory: StorySummary }) {
  const hydrated = useHydrated();
  const items = useJourney(stories).slice(0, 3);
  const { playStory } = useAudio();

  if (!hydrated) return <div className="skeleton h-[8.5rem] rounded-3xl" aria-hidden />;

  if (items.length === 0) {
    return (
      <Link
        href={`/stories/${firstStory.slug}`}
        className="group surface relative flex items-center gap-5 overflow-hidden rounded-3xl p-3 pr-6 transition-colors duration-500 hover:border-gold/30 sm:gap-7"
      >
        <ArtImage artwork={firstStory.artwork} sizes="160px" zoom className="aspect-[4/3] w-28 shrink-0 rounded-2xl sm:w-40" />
        <div className="min-w-0">
          <p className="eyebrow text-[0.625rem]">Begin here · Story {pad2(firstStory.number)}</p>
          <p className="mt-2 font-display text-[1.5rem] leading-tight text-ivory sm:text-[1.85rem]">{firstStory.title.en}</p>
          <p className="mt-1 hidden text-sm text-ivory/55 sm:block">
            Your reading and listening progress will appear here — saved on this device.
          </p>
        </div>
        <span className="ml-auto hidden size-12 shrink-0 place-items-center rounded-full border border-gold/40 text-gold-soft transition-colors group-hover:bg-gold/10 sm:grid">
          <BookOpen className="size-5" />
        </span>
      </Link>
    );
  }

  return (
    <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={`${item.kind}-${item.story.id}`} className="surface group relative flex items-center gap-4 rounded-3xl p-3 pr-4">
          <ArtImage artwork={item.story.artwork} sizes="96px" className="aspect-square w-[5.5rem] shrink-0 rounded-2xl" />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-[0.625rem] tracking-[0.2em] text-gold/85 uppercase">
              {item.kind === "reading" ? <BookOpen className="size-3" /> : <Headphones className="size-3" />}
              {item.kind === "reading" ? "Reading" : "Listening"} · Story {pad2(item.story.number)}
            </p>
            <Link
              href={item.kind === "reading" ? `/stories/${item.story.slug}/read` : `/stories/${item.story.slug}/listen`}
              className="mt-1 block truncate font-display text-[1.25rem] text-ivory after:absolute after:inset-0 after:rounded-3xl"
            >
              {item.story.title.en}
            </Link>
            <div className="mt-2.5 flex items-center gap-3">
              <ProgressBar value={item.progress} className="flex-1" />
              <span className="shrink-0 text-[0.6875rem] tabular-nums text-ivory/55">{item.note}</span>
            </div>
          </div>
          {item.kind === "listening" && (
            <button
              type="button"
              onClick={() => playStory(item.story.id)}
              aria-label={`Resume ${item.story.title.en}`}
              className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full bg-ivory text-abyss transition-colors hover:bg-gold-soft"
            >
              <Play className="size-4 translate-x-px" fill="currentColor" strokeWidth={0} />
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
