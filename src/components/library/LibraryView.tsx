"use client";

import { motion } from "motion/react";
import { BookOpen, Headphones, Play, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAudio } from "@/components/audio/AudioProvider";
import { useJourney } from "@/components/home/ContinueJourney";
import { StoryCard } from "@/components/story/StoryCard";
import { ArtImage } from "@/components/ui/ArtImage";
import { EmptyState, ProgressBar } from "@/components/ui/primitives";
import type { Artwork, StorySummary } from "@/data/types";
import { cn, pad2 } from "@/lib/cn";
import { library } from "@/lib/storage";
import { useHydrated, useLibrary } from "@/lib/use-library";

export interface LibraryCharacter {
  slug: string;
  name: { en: string; te: string };
  epithet: string;
  portrait: Artwork;
}

const TABS = [
  { id: "all", label: "All" },
  { id: "reading", label: "Reading" },
  { id: "listening", label: "Listening" },
  { id: "saved", label: "Saved" },
  { id: "recent", label: "Recent" },
] as const;
type Tab = (typeof TABS)[number]["id"];

function timeAgo(at: number) {
  const mins = Math.round((Date.now() - at) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.round(hrs / 24);
  return days === 1 ? "Yesterday" : `${days} days ago`;
}

export function LibraryView({ stories, characters }: { stories: StorySummary[]; characters: LibraryCharacter[] }) {
  const hydrated = useHydrated();
  const journey = useJourney(stories);
  const bookmarks = useLibrary("bookmarks");
  const recent = useLibrary("recent");
  const { playStory } = useAudio();
  const [tab, setTab] = useState<Tab>("all");
  const [confirmClear, setConfirmClear] = useState(false);

  const reading = journey.filter((j) => j.kind === "reading");
  const listening = journey.filter((j) => j.kind === "listening");
  const saved = Object.entries(bookmarks)
    .sort(([, a], [, b]) => b.createdAt - a.createdAt)
    .map(([id]) => stories.find((s) => s.id === id))
    .filter((s) => s !== undefined);
  const recentItems = recent
    .map((r) =>
      r.kind === "story"
        ? { ...r, story: stories.find((s) => s.slug === r.slug) }
        : { ...r, character: characters.find((c) => c.slug === r.slug) },
    )
    .filter((r) => ("story" in r ? r.story : r.character));

  const counts: Record<Tab, number> = {
    all: reading.length + listening.length + saved.length + recentItems.length,
    reading: reading.length,
    listening: listening.length,
    saved: saved.length,
    recent: recentItems.length,
  };

  if (!hydrated) {
    return (
      <div className="space-y-4" aria-hidden>
        <div className="skeleton h-12 w-80 max-w-full rounded-full" />
        <div className="skeleton h-32 rounded-3xl" />
        <div className="skeleton h-32 rounded-3xl" />
      </div>
    );
  }

  if (counts.all === 0) {
    const first = stories[0];
    return (
      <EmptyState
        title="Your library is waiting"
        body="Stories you read, listen to and save will gather here — kept on this device, no account needed."
        action={first ? { href: `/stories/${first.slug}`, label: `Begin with ${first.title.en}` } : undefined}
      />
    );
  }

  const show = (t: Tab) => tab === "all" || tab === t;

  return (
    <div>
      <div role="tablist" aria-label="Library sections" className="no-scrollbar -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)]">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "relative isolate inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm transition-colors duration-300",
              tab === t.id ? "text-abyss" : "border border-ivory/12 text-ivory/65 hover:text-ivory",
            )}
          >
            {tab === t.id && (
              <motion.span
                layoutId="library-tab"
                className="absolute inset-0 -z-10 rounded-full bg-gradient-to-b from-[#ecd39d] to-[#c99f58]"
                transition={{ type: "spring", stiffness: 420, damping: 36 }}
              />
            )}
            {t.label}
            <span className={cn("text-xs tabular-nums", tab === t.id ? "text-abyss/60" : "text-ivory/35")}>{counts[t.id]}</span>
          </button>
        ))}
      </div>

      <div className="mt-12 flex flex-col gap-16">
        {show("reading") && (
          <LibrarySection title="Continue reading" icon={<BookOpen className="size-4" />}>
            {reading.length ? (
              <ul className="grid gap-3 md:grid-cols-2">
                {reading.map((item) => (
                  <li key={item.story.id}>
                    <ProgressRow story={item.story} progress={item.progress} note={item.note} href={`/stories/${item.story.slug}/read`} />
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState compact title="Nothing open" body="Start a story and your place will be kept here." />
            )}
          </LibrarySection>
        )}

        {show("listening") && (
          <LibrarySection title="Continue listening" icon={<Headphones className="size-4" />}>
            {listening.length ? (
              <ul className="grid gap-3 md:grid-cols-2">
                {listening.map((item) => (
                  <li key={item.story.id}>
                    <ProgressRow
                      story={item.story}
                      progress={item.progress}
                      note={item.note}
                      href={`/stories/${item.story.slug}/listen`}
                      onPlay={() => playStory(item.story.id)}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState compact title="Nothing playing" body="Press Listen on any story — your position is remembered." />
            )}
          </LibrarySection>
        )}

        {show("saved") && (
          <LibrarySection title="Bookmarks">
            {saved.length ? (
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {saved.map((s) => (
                  <li key={s.id}>
                    <StoryCard story={s} />
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState compact title="No bookmarks yet" body="Tap the bookmark on any story to keep it close." />
            )}
          </LibrarySection>
        )}

        {show("recent") && (
          <LibrarySection title="Recently viewed">
            {recentItems.length ? (
              <ul className="divide-y divide-ivory/[0.07] overflow-hidden rounded-2xl border border-ivory/[0.08]">
                {recentItems.map((r) => {
                  const art = "story" in r ? r.story!.artwork : r.character!.portrait;
                  const title = "story" in r ? r.story!.title : r.character!.name;
                  const kicker = "story" in r ? `Story ${pad2(r.story!.number)}` : "Character";
                  return (
                    <li key={`${r.kind}-${r.slug}`}>
                      <Link
                        href={r.kind === "story" ? `/stories/${r.slug}` : `/characters/${r.slug}`}
                        className="group flex items-center gap-4 bg-deep/40 px-3 py-3 transition-colors hover:bg-deep"
                      >
                        <ArtImage
                          artwork={art}
                          sizes="48px"
                          className={cn("size-12 shrink-0", r.kind === "character" ? "rounded-full" : "rounded-lg")}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[0.625rem] tracking-[0.2em] text-gold/75 uppercase">{kicker}</p>
                          <p className="truncate font-display text-lg text-ivory">
                            {title.en} <span className="te text-xs text-ivory/40">{title.te}</span>
                          </p>
                        </div>
                        <span className="shrink-0 text-xs text-ivory/40">{timeAgo(r.at)}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <EmptyState compact title="Nothing yet" body="Characters and stories you open will appear here." />
            )}
          </LibrarySection>
        )}
      </div>

      <div className="mt-20 flex flex-col items-center gap-3 border-t border-ivory/[0.07] pt-8 text-center">
        <p className="text-xs text-ivory/35">Library data is stored only in this browser.</p>
        {confirmClear ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                library.clearAll();
                setConfirmClear(false);
              }}
              className="btn min-h-10 bg-ember/90 px-4 text-sm text-abyss"
            >
              Clear everything
            </button>
            <button type="button" onClick={() => setConfirmClear(false)} className="btn btn-ghost min-h-10 px-4 text-sm">
              Keep
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirmClear(true)} className="inline-flex items-center gap-2 text-xs text-ivory/45 hover:text-ember">
            <Trash2 className="size-3.5" />
            Clear library data
          </button>
        )}
      </div>
    </div>
  );
}

function LibrarySection({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-5 flex items-center gap-2.5 font-display text-[1.9rem] text-ivory">
        {icon && <span className="grid size-8 place-items-center rounded-full border border-gold/30 text-gold-soft">{icon}</span>}
        {title}
      </h2>
      {children}
    </section>
  );
}

function ProgressRow({
  story,
  progress,
  note,
  href,
  onPlay,
}: {
  story: StorySummary;
  progress: number;
  note: string;
  href: string;
  onPlay?: () => void;
}) {
  return (
    <div className="surface group relative flex items-center gap-4 rounded-2xl p-2.5 pr-4">
      <ArtImage artwork={story.artwork} sizes="80px" className="size-20 shrink-0 rounded-xl" />
      <div className="min-w-0 flex-1">
        <p className="text-[0.625rem] tracking-[0.2em] text-gold/80 uppercase">Story {pad2(story.number)}</p>
        <Link href={href} className="mt-0.5 block truncate font-display text-[1.3rem] text-ivory after:absolute after:inset-0 after:rounded-2xl">
          {story.title.en}
        </Link>
        <div className="mt-2 flex items-center gap-3">
          <ProgressBar value={progress} className="flex-1" />
          <span className="shrink-0 text-[0.6875rem] tabular-nums text-ivory/55">{note}</span>
        </div>
      </div>
      {onPlay && (
        <button
          type="button"
          onClick={onPlay}
          aria-label={`Resume ${story.title.en}`}
          className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full bg-ivory text-abyss hover:bg-gold-soft"
        >
          <Play className="size-4 translate-x-px" fill="currentColor" strokeWidth={0} />
        </button>
      )}
    </div>
  );
}
