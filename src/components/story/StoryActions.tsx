"use client";

import { BookOpen, Headphones, Pause } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAudio } from "@/components/audio/AudioProvider";
import { cn } from "@/lib/cn";
import { useHydrated, useLibrary } from "@/lib/use-library";
import { BookmarkButton } from "./BookmarkButton";

/** Read / Continue, Listen and Bookmark for a story. */
export function StoryActions({ storyId, slug, className }: { storyId: string; slug: string; className?: string }) {
  const hydrated = useHydrated();
  const reading = useLibrary("reading")[storyId];
  const inProgress = hydrated && reading && reading.progress > 0.03 && reading.progress < 0.97;

  return (
    <div className={cn("flex items-center gap-2.5 sm:gap-3", className)}>
      <Link href={`/stories/${slug}/read`} className="btn btn-gold min-w-0 flex-1 px-4 sm:min-w-[10rem] sm:flex-none sm:px-6">
        <BookOpen className="size-[1.1rem]" />
        {inProgress ? `Continue · ${Math.round(reading.progress * 100)}%` : "Read story"}
      </Link>
      <ListenButton storyId={storyId} slug={slug} className="min-w-0 flex-1 px-4 sm:min-w-[9rem] sm:flex-none sm:px-6" />
      <BookmarkButton storyId={storyId} bare className="btn btn-ghost size-12 shrink-0 px-0" />
    </div>
  );
}

/** Starts playback immediately (keeping the user gesture) and opens the player. */
export function ListenButton({
  storyId,
  slug,
  className,
  label = "Listen",
}: {
  storyId: string;
  slug: string;
  className?: string;
  label?: string;
}) {
  const router = useRouter();
  const { track, isPlaying, playStory } = useAudio();
  const nowPlaying = track?.storyId === storyId && isPlaying;

  return (
    <button
      type="button"
      onClick={() => {
        if (!nowPlaying) playStory(storyId);
        router.push(`/stories/${slug}/listen`);
      }}
      className={cn("btn btn-ghost", className)}
    >
      {nowPlaying ? <Pause className="size-[1.1rem]" fill="currentColor" strokeWidth={0} /> : <Headphones className="size-[1.1rem]" />}
      {nowPlaying ? "Now playing" : label}
    </button>
  );
}
