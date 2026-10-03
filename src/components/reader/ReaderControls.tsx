"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Headphones, Pause, Type, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BookmarkButton } from "@/components/story/BookmarkButton";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import type { Lang, StorySummary } from "@/data/types";
import { cn, formatTime, pad2 } from "@/lib/cn";
import type { ReaderTheme } from "@/lib/storage";

export const FONT_STEPS = [1.0625, 1.1875, 1.3125, 1.4375, 1.625]; // rem

const THEMES: { id: ReaderTheme; label: string; swatch: string; ink: string }[] = [
  { id: "night", label: "Night", swatch: "#051617", ink: "#e9dfcb" },
  { id: "parchment", label: "Parchment", swatch: "#f1e7d3", ink: "#2c2117" },
  { id: "midnight", label: "Midnight", swatch: "#050607", ink: "#c9bfae" },
];

const chromeMotion = {
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
};

interface TopBarProps {
  visible: boolean;
  exitHref: string;
  storyId: string;
  number: number;
  title: string;
  showTitle: boolean;
  lang: Lang;
  onLang: (lang: Lang) => void;
  progress: number;
  fontStep: number;
  onFontStep: (step: number) => void;
  theme: ReaderTheme;
  onTheme: (theme: ReaderTheme) => void;
  onSettingsOpen: (open: boolean) => void;
}

export function ReaderTopBar(props: TopBarProps) {
  const { visible, exitHref, storyId, number, title, showTitle, lang, onLang, progress } = props;
  const [open, setOpen] = useState(false);
  const toggleSettings = (next: boolean) => {
    setOpen(next);
    props.onSettingsOpen(next);
  };

  return (
    <>
      {/* Hairline progress — always visible, even when chrome hides */}
      <div className="fixed inset-x-0 top-0 z-50 h-[2px] bg-[var(--r-faint)]">
        <div className="h-full bg-[var(--r-accent)] transition-[width] duration-200 ease-out" style={{ width: `${progress * 100}%` }} />
      </div>

      <motion.header
        initial={false}
        animate={{ y: visible ? 0 : "-100%", opacity: visible ? 1 : 0 }}
        {...chromeMotion}
        className="fixed inset-x-0 top-0 z-40 border-b border-[var(--r-faint)] bg-[var(--r-chrome)] pt-[env(safe-area-inset-top)] backdrop-blur-xl"
      >
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-2 px-2 sm:h-16 sm:px-4">
          <Link href={exitHref} aria-label="Close reader" className="icon-btn shrink-0 text-[var(--r-fg)] hover:bg-[var(--r-faint)]">
            <X className="size-5" />
          </Link>

          <div className="min-w-0 flex-1 px-1">
            <AnimatePresence>
              {showTitle && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.3 }}
                  className="hidden truncate text-sm text-[var(--r-muted)] sm:block"
                >
                  <span className="mr-2 text-[0.6875rem] tracking-[0.2em] uppercase">Story {pad2(number)}</span>
                  <span className={cn("text-[var(--r-fg)]", lang === "te" ? "te" : "font-display text-base")}>{title}</span>
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <LanguageToggle value={lang} onChange={onLang} themed />

          <div className="relative">
            <button
              type="button"
              onClick={() => toggleSettings(!open)}
              aria-expanded={open}
              aria-haspopup="dialog"
              aria-label="Reading settings"
              className={cn("icon-btn text-[var(--r-fg)] hover:bg-[var(--r-faint)]", open && "bg-[var(--r-faint)]")}
            >
              <Type className="size-5" />
            </button>
            <AnimatePresence>
              {open && <ReaderSettings {...props} onClose={() => toggleSettings(false)} />}
            </AnimatePresence>
          </div>

          <BookmarkButton storyId={storyId} themed />
        </div>
      </motion.header>
    </>
  );
}

function ReaderSettings({
  fontStep,
  onFontStep,
  theme,
  onTheme,
  onClose,
}: Pick<TopBarProps, "fontStep" | "onFontStep" | "theme" | "onTheme"> & { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.parentElement?.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation(); // Esc closes the panel only — not the reader
      onClose();
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-label="Reading settings"
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: 0.22 }}
      className="absolute top-[calc(100%+0.6rem)] right-[-3.25rem] w-[17.5rem] origin-top-right rounded-2xl border border-[var(--r-faint)] bg-[var(--r-bg-2)] p-5 text-[var(--r-fg)] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.6)] sm:right-0"
    >
      <p className="text-[0.625rem] tracking-[0.24em] text-[var(--r-muted)] uppercase">Text size</p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onFontStep(Math.max(0, fontStep - 1))}
          disabled={fontStep === 0}
          aria-label="Smaller text"
          className="grid size-10 place-items-center rounded-full border border-[var(--r-faint)] font-display text-base disabled:opacity-30"
        >
          A
        </button>
        <div className="flex items-center gap-1.5" aria-hidden>
          {FONT_STEPS.map((_, i) => (
            <span
              key={i}
              className={cn("size-1.5 rounded-full transition-colors", i <= fontStep ? "bg-[var(--r-accent)]" : "bg-[var(--r-faint)]")}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => onFontStep(Math.min(FONT_STEPS.length - 1, fontStep + 1))}
          disabled={fontStep === FONT_STEPS.length - 1}
          aria-label="Larger text"
          className="grid size-10 place-items-center rounded-full border border-[var(--r-faint)] font-display text-2xl disabled:opacity-30"
        >
          A
        </button>
      </div>

      <p className="mt-6 text-[0.625rem] tracking-[0.24em] text-[var(--r-muted)] uppercase">Theme</p>
      <div className="mt-3 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Reader theme">
        {THEMES.map((t) => (
          <button
            key={t.id}
            type="button"
            role="radio"
            aria-checked={theme === t.id}
            onClick={() => onTheme(t.id)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-xl border p-2.5 text-[0.6875rem] transition-colors",
              theme === t.id ? "border-[var(--r-accent)]" : "border-[var(--r-faint)]",
            )}
          >
            <span
              className="grid size-9 place-items-center rounded-full border border-black/10 font-display text-base"
              style={{ background: t.swatch, color: t.ink }}
            >
              Aa
            </span>
            {t.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

interface BottomBarProps {
  visible: boolean;
  prev?: StorySummary;
  next?: StorySummary;
  progress: number;
  minutesLeft: number;
  listen: { playing: boolean; active: boolean; time: number; onClick: () => void };
}

export function ReaderBottomBar({ visible, prev, next, progress, minutesLeft, listen }: BottomBarProps) {
  const pct = Math.round(progress * 100);
  return (
    <motion.nav
      aria-label="Reader"
      initial={false}
      animate={{ y: visible ? 0 : "110%", opacity: visible ? 1 : 0 }}
      {...chromeMotion}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--r-faint)] bg-[var(--r-chrome)] pb-[env(safe-area-inset-bottom)] backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-3xl items-center gap-2 px-2 text-[var(--r-fg)] sm:px-4">
        <PagerLink story={prev} dir="prev" />

        <button
          type="button"
          onClick={listen.onClick}
          className={cn(
            "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm transition-colors",
            listen.active ? "border-[var(--r-accent)] text-[var(--r-accent)]" : "border-[var(--r-faint)] hover:border-[var(--r-accent)]",
          )}
        >
          {listen.playing ? <Pause className="size-4" fill="currentColor" strokeWidth={0} /> : <Headphones className="size-4" />}
          {listen.active ? formatTime(listen.time) : "Listen"}
        </button>

        <p className="flex-1 text-center text-xs tabular-nums text-[var(--r-muted)]" aria-live="off">
          <span className="text-[var(--r-fg)]">{pct}%</span>
          <span className="hidden xs:inline">
            {" · "}
            {pct >= 98 ? "Finished" : minutesLeft <= 1 ? "Under a minute left" : `${minutesLeft} min left`}
          </span>
        </p>

        <PagerLink story={next} dir="next" />
      </div>
    </motion.nav>
  );
}

function PagerLink({ story, dir }: { story?: StorySummary; dir: "prev" | "next" }) {
  const Icon = dir === "prev" ? ChevronLeft : ChevronRight;
  const label = dir === "prev" ? "Previous story" : "Next story";
  if (!story)
    return (
      <span aria-hidden className="icon-btn pointer-events-none opacity-25">
        <Icon className="size-5" />
      </span>
    );
  return (
    <Link
      href={`/stories/${story.slug}/read`}
      aria-label={`${label}: ${story.title.en}`}
      title={story.title.en}
      className="icon-btn text-[var(--r-fg)] hover:bg-[var(--r-faint)]"
    >
      <Icon className="size-5" />
    </Link>
  );
}
