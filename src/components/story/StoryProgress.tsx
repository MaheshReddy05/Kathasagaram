"use client";

import { ProgressBar } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import { useLibrary } from "@/lib/use-library";

/** Reading progress for one story, shown only when there is some. */
export function StoryProgress({ storyId, className }: { storyId: string; className?: string }) {
  const entry = useLibrary("reading")[storyId];
  if (!entry || entry.progress < 0.02) return null;
  const done = entry.progress >= 0.97;
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <ProgressBar value={entry.progress} className="flex-1" label="Reading progress" />
      <span className="text-[0.6875rem] tabular-nums text-ivory/60">{done ? "Read" : `${Math.round(entry.progress * 100)}%`}</span>
    </div>
  );
}
