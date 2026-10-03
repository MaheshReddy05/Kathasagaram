"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronUp, X } from "lucide-react";
import Link from "next/link";
import { ArtImage } from "@/components/ui/ArtImage";
import { cn, pad2 } from "@/lib/cn";
import { useAudio } from "./AudioProvider";
import { Equalizer, PlayPauseButton } from "./controls";

/**
 * Persistent player shown whenever a story is loaded. Sits above the mobile
 * tab bar; floats bottom-centre on larger screens.
 */
export function MiniPlayer({ visible }: { visible: boolean }) {
  const { track, lang, isPlaying, isLoading, currentTime, duration, toggle, close } = useAudio();
  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <AnimatePresence>
      {visible && track && (
        <motion.div
          key="mini-player"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
          className="fixed inset-x-0 z-30 px-3 bottom-[calc(var(--nav-h)+var(--safe-bottom)+0.5rem)] md:bottom-5"
        >
          <div className="glass relative mx-auto flex h-[4.25rem] max-w-xl items-center gap-3 overflow-hidden rounded-2xl border border-ivory/10 pr-2 pl-2 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.8)]">
            <Link
              href={`/stories/${track.slug}/listen`}
              className="flex min-w-0 flex-1 items-center gap-3"
              aria-label={`Open player — ${track.title.en}`}
            >
              <ArtImage artwork={track.artwork} sizes="52px" className="size-[3.25rem] shrink-0 rounded-xl" />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-[0.625rem] tracking-[0.2em] text-gold/90 uppercase">
                  <Equalizer active={isPlaying} className="h-2.5" />
                  {track.characterName.en} · Story {pad2(track.number)}
                </p>
                <p className={cn("mt-0.5 truncate text-[0.9375rem] text-ivory", lang === "te" ? "te" : "font-display text-[1.1rem] font-medium")}>
                  {track.title[lang]}
                </p>
              </div>
              <ChevronUp className="hidden size-5 text-ivory/40 sm:block" />
            </Link>
            <PlayPauseButton isPlaying={isPlaying} isLoading={isLoading} onClick={toggle} />
            <button type="button" onClick={close} aria-label="Close player" className="icon-btn size-10 text-ivory/50">
              <X className="size-[1.1rem]" />
            </button>
            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-ivory/[0.08]">
              <div className="h-full bg-gradient-to-r from-gold-deep to-gold-soft" style={{ width: `${progress * 100}%` }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
