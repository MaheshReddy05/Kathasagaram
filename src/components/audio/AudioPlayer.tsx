"use client";

import { motion } from "motion/react";
import { BookOpen, ChevronDown, Info, SkipBack, SkipForward } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BookmarkButton } from "@/components/story/BookmarkButton";
import { ArtImage } from "@/components/ui/ArtImage";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { isDemoAudio } from "@/data/audio";
import type { Lang, StorySummary } from "@/data/types";
import { cn, formatTime, pad2 } from "@/lib/cn";
import { useLibrary } from "@/lib/use-library";
import { useAudio } from "./AudioProvider";
import { Equalizer, PlayPauseButton, SkipIcon } from "./controls";

const RATES = [1, 1.25, 1.5, 2, 0.75];

interface AudioPlayerProps {
  story: StorySummary;
  characterName: string;
  upNext: StorySummary[];
}

export function AudioPlayer({ story, characterName, upNext }: AudioPlayerProps) {
  const router = useRouter();
  const audio = useAudio();
  const prefs = useLibrary("prefs");
  const isThis = audio.track?.storyId === story.id;

  // Arriving here directly (or from another story's page) loads this story, paused.
  useEffect(() => {
    if (!isThis) audio.playStory(story.id, { autoplay: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story.id]);

  // Space toggles playback.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space" || (e.target as HTMLElement)?.closest("input,button,a")) return;
      e.preventDefault();
      audio.toggle();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [audio]);

  const lang: Lang = isThis ? audio.lang : prefs.storyLang;
  const other: Lang = lang === "en" ? "te" : "en";
  const source = story.audio[lang];
  const duration = isThis && audio.duration > 0 ? audio.duration : (source?.durationSec ?? 0);
  const current = isThis ? audio.currentTime : 0;
  const playing = isThis && audio.isPlaying;
  const fill = duration > 0 ? (current / duration) * 100 : 0;

  const goTo = (s?: { storyId: string; slug: string }) => {
    if (!s) return;
    audio.playStory(s.storyId, { autoplay: audio.isPlaying });
    router.replace(`/stories/${s.slug}/listen`);
  };

  return (
    <div className="relative min-h-dvh overflow-hidden bg-ink text-ivory">
      {/* Atmospheric backdrop from the story art */}
      <div aria-hidden className="absolute inset-0">
        <ArtImage artwork={story.artwork} sizes="50vw" className="absolute inset-0 scale-125 opacity-50 blur-[70px] saturate-[1.3]" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/80 to-ink" />
      </div>

      <div className="relative mx-auto flex min-h-dvh max-w-6xl flex-col px-5 pt-[calc(env(safe-area-inset-top)+0.75rem)] pb-[calc(env(safe-area-inset-bottom)+1.5rem)] sm:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => (window.history.length > 1 ? router.back() : router.push(`/stories/${story.slug}`))}
            className="icon-btn"
            aria-label="Close player"
          >
            <ChevronDown className="size-6" />
          </button>
          <div className="text-center">
            <p className="eyebrow text-[0.625rem] text-ivory/50">Now listening</p>
            <p className="mt-1 text-xs text-ivory/70">Mahabharata · {characterName}</p>
          </div>
          <BookmarkButton storyId={story.id} />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-6 py-4 sm:gap-8 sm:py-6 lg:flex-row lg:items-center lg:gap-16">
          {/* Artwork */}
          <motion.div
            animate={{ scale: playing ? 1 : 0.93 }}
            transition={{ type: "spring", stiffness: 160, damping: 22 }}
            className="relative w-full max-w-[15rem] xs:max-w-[17rem] sm:max-w-[23rem] lg:max-w-[28rem] lg:flex-1"
          >
            <ArtImage
              artwork={story.artwork}
              sizes="(min-width: 1024px) 448px, 368px"
              priority
              className="aspect-square w-full rounded-[1.75rem] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.9)] ring-1 ring-ivory/10"
            />
            <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] bg-gradient-to-t from-black/30 to-transparent" />
          </motion.div>

          {/* Controls */}
          <div className="flex w-full max-w-md flex-col lg:flex-1">
            <div className="text-center lg:text-left">
              <p className="eyebrow flex items-center justify-center gap-2 lg:justify-start">
                {isThis && <Equalizer active={playing} className="h-3" />}
                {characterName} · Story {pad2(story.number)}
              </p>
              <h1
                key={lang}
                className={cn(
                  "mt-3 text-ivory",
                  lang === "te" ? "te text-[1.6rem] leading-snug font-medium sm:text-[1.75rem]" : "font-display text-[2rem] leading-[1.05] font-medium sm:text-[2.6rem]",
                )}
              >
                {story.title[lang]}
              </h1>
              <p className={cn("mt-2 text-ivory/50", other === "te" ? "te text-base" : "font-display text-lg italic")}>
                {story.title[other]}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <LanguageToggle
                value={lang}
                variant="long"
                label="Narration language"
                onChange={(l) => (isThis ? audio.setLang(l) : audio.playStory(story.id, { lang: l, autoplay: false }))}
              />
            </div>

            {isDemoAudio(source) && (
              <p className="mx-auto mt-4 flex max-w-sm items-start gap-2 text-left text-xs leading-relaxed text-ivory/45 lg:mx-0">
                <Info className="mt-px size-3.5 shrink-0 text-gold/70" />
                Demo audio: an ambient placeholder track. Narration for this story hasn’t been recorded yet.
              </p>
            )}

            {/* Scrubber */}
            <div className="mt-5 sm:mt-7">
              <input
                type="range"
                className="scrubber"
                min={0}
                max={duration || 1}
                step={0.1}
                value={Math.min(current, duration || 1)}
                onChange={(e) => audio.seek(Number(e.target.value))}
                disabled={!isThis}
                aria-label="Seek"
                aria-valuetext={`${formatTime(current)} of ${formatTime(duration)}`}
                style={{ "--fill": `${fill}%` } as React.CSSProperties}
              />
              <div className="mt-1 flex justify-between text-xs tabular-nums text-ivory/50">
                <span>{formatTime(current)}</span>
                <span>−{formatTime(Math.max(0, duration - current))}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between px-1 sm:px-4">
              <button
                type="button"
                className="icon-btn"
                onClick={() => goTo(audio.prevTrack)}
                disabled={!audio.prevTrack}
                aria-label="Previous story"
              >
                <SkipBack className={cn("size-5", !audio.prevTrack && "opacity-30")} />
              </button>
              <button type="button" className="icon-btn size-12" onClick={() => audio.skip(-15)} aria-label="Back 15 seconds">
                <SkipIcon direction="back" />
              </button>
              <PlayPauseButton
                size="lg"
                isPlaying={playing}
                isLoading={audio.isLoading}
                onClick={() => (isThis ? audio.toggle() : audio.playStory(story.id))}
              />
              <button type="button" className="icon-btn size-12" onClick={() => audio.skip(15)} aria-label="Forward 15 seconds">
                <SkipIcon direction="forward" />
              </button>
              <button
                type="button"
                className="icon-btn"
                onClick={() => goTo(audio.nextTrack)}
                disabled={!audio.nextTrack}
                aria-label="Next story"
              >
                <SkipForward className={cn("size-5", !audio.nextTrack && "opacity-30")} />
              </button>
            </div>

            {audio.error && isThis && <p className="mt-4 text-center text-sm text-ember">{audio.error}</p>}

            <div className="mt-5 flex items-center justify-center gap-3 sm:mt-7 lg:justify-start">
              <button
                type="button"
                onClick={() => audio.setRate(RATES[(RATES.indexOf(audio.rate) + 1) % RATES.length] ?? 1)}
                className="btn btn-ghost min-h-10 min-w-[4.5rem] px-4 text-sm tabular-nums"
                aria-label={`Playback speed ${audio.rate}×`}
              >
                {audio.rate}×
              </button>
              <Link href={`/stories/${story.slug}/read?lang=${lang}`} className="btn btn-ghost min-h-10 px-4 text-sm">
                <BookOpen className="size-4" />
                Read along
              </Link>
            </div>
          </div>
        </div>

        {upNext.length > 0 && (
          <section aria-label="Up next" className="mt-4 border-t border-ivory/[0.08] pt-6">
            <p className="eyebrow mb-4 text-ivory/50">Up next</p>
            <ul className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 sm:mx-0 sm:px-0">
              {upNext.map((s) => (
                <li key={s.id} className="w-[15.5rem] shrink-0">
                  <button
                    type="button"
                    onClick={() => goTo({ storyId: s.id, slug: s.slug })}
                    className="group surface flex w-full items-center gap-3 rounded-2xl p-2 text-left transition-colors hover:border-gold/30"
                  >
                    <ArtImage artwork={s.artwork} sizes="56px" className="size-14 shrink-0 rounded-xl" zoom />
                    <span className="min-w-0">
                      <span className="block text-[0.625rem] tracking-[0.2em] text-gold/80 uppercase">Story {pad2(s.number)}</span>
                      <span className="mt-0.5 block truncate font-display text-[1.05rem] text-ivory">{s.title.en}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
