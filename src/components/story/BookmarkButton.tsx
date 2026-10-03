"use client";

import { motion } from "motion/react";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/cn";
import { library } from "@/lib/storage";
import { useLibrary } from "@/lib/use-library";

interface BookmarkButtonProps {
  storyId: string;
  className?: string;
  /** Show a text label next to the icon. */
  labelled?: boolean;
  /** Use reader theme colours. */
  themed?: boolean;
  /** Skip the default button styling and rely on `className` alone. */
  bare?: boolean;
}

export function BookmarkButton({ storyId, className, labelled, themed, bare }: BookmarkButtonProps) {
  const bookmarks = useLibrary("bookmarks");
  const saved = Boolean(bookmarks[storyId]);
  const label = saved ? "Saved" : "Save";

  return (
    <button
      type="button"
      onClick={() => library.toggleBookmark(storyId)}
      aria-pressed={saved}
      aria-label={saved ? "Remove bookmark" : "Bookmark this story"}
      className={cn(!bare && (labelled ? "btn btn-ghost" : "icon-btn"), themed && "text-[var(--r-fg)] hover:bg-[var(--r-faint)]", className)}
    >
      <motion.span
        key={String(saved)}
        initial={{ scale: saved ? 0.6 : 1 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 18 }}
        className="grid place-items-center"
      >
        <Bookmark
          className={cn("size-5", saved && (themed ? "text-[var(--r-accent)]" : "text-gold-soft"))}
          fill={saved ? "currentColor" : "none"}
          strokeWidth={1.6}
        />
      </motion.span>
      {labelled && <span>{label}</span>}
    </button>
  );
}
