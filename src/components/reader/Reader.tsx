"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { useAudio } from "@/components/audio/AudioProvider";
import { BookmarkButton } from "@/components/story/BookmarkButton";
import { StoryPager } from "@/components/story/StoryPager";
import { ArtImage } from "@/components/ui/ArtImage";
import { Ornament } from "@/components/ui/Ornament";
import { LANGS, type Lang, type Story, type StoryBlock, type StorySummary } from "@/data/types";
import { cn, pad2 } from "@/lib/cn";
import { library, read } from "@/lib/storage";
import { useHydrated, useLibrary } from "@/lib/use-library";
import { FONT_STEPS, ReaderBottomBar, ReaderTopBar } from "./ReaderControls";

interface ReaderProps {
  story: Story;
  characterName: { en: string; te: string };
  characterSlug: string;
  collectionName: string;
  prev?: StorySummary;
  next?: StorySummary;
}

const noopSubscribe = () => () => {};

/** Language requested via ?lang= (e.g. from "Read along"). Read client-side so the page stays static. */
function useUrlLang(): Lang | undefined {
  const value = useSyncExternalStore(
    noopSubscribe,
    () => new URLSearchParams(window.location.search).get("lang"),
    () => null,
  );
  return LANGS.includes(value as Lang) ? (value as Lang) : undefined;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * The immersive reader. Owns its own chrome (top & bottom bars that recede
 * while reading), language switching, type size, theme, and local progress.
 */
export function Reader({ story, characterName, characterSlug, collectionName, prev, next }: ReaderProps) {
  const router = useRouter();
  const hydrated = useHydrated();
  const urlLang = useUrlLang();
  const prefs = useLibrary("prefs");
  const audio = useAudio();

  const [chosenLang, setChosenLang] = useState<Lang | null>(null);
  const savedLang = hydrated ? read("reading")[story.id]?.lang : undefined;
  const lang: Lang = chosenLang ?? urlLang ?? savedLang ?? prefs.storyLang;

  const theme = prefs.readerTheme;
  const fontStep = Math.min(FONT_STEPS.length - 1, Math.max(0, prefs.fontStep));

  const [progress, setProgress] = useState(0);
  const [chrome, setChrome] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pastTitle, setPastTitle] = useState(false);
  const [resumed, setResumed] = useState<number | null>(null);

  const articleRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const restoreTo = useRef<number | null>(null);
  const lastY = useRef(0);
  const saveTimer = useRef<number | undefined>(undefined);
  const langRef = useRef(lang);
  const progressRef = useRef(0);
  /** Our own programmatic scrolls shouldn't hide the chrome. */
  const quietUntil = useRef(0);

  useEffect(() => {
    langRef.current = lang;
  }, [lang]);

  /** Scroll distance at which the end of the text meets the bottom of the viewport. */
  const endScroll = useCallback(() => {
    const el = articleRef.current;
    if (!el) return 0;
    const top = el.getBoundingClientRect().top + window.scrollY;
    return top + el.offsetHeight - window.innerHeight;
  }, []);

  /** Progress = share of the scroll needed to reach the end of the text. */
  const measure = useCallback(() => {
    const end = endScroll();
    return end <= 0 ? 1 : clamp01(window.scrollY / end);
  }, [endScroll]);

  const scrollToProgress = useCallback(
    (p: number) => {
      quietUntil.current = Date.now() + 500;
      window.scrollTo({ top: Math.max(0, p * endScroll()), behavior: "instant" });
    },
    [endScroll],
  );

  const save = useCallback(() => {
    window.clearTimeout(saveTimer.current);
    library.saveReading(story.id, { progress: progressRef.current, lang: langRef.current });
  }, [story.id]);

  // Resume where the reader left off (once fonts have settled the layout).
  useEffect(() => {
    const entry = read("reading")[story.id];
    if (!entry || entry.progress < 0.04 || entry.progress > 0.96) return;
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      scrollToProgress(entry.progress);
      setResumed(Math.round(entry.progress * 100));
    });
    return () => {
      cancelled = true;
    };
  }, [story.id, scrollToProgress]);

  useEffect(() => {
    if (resumed === null) return;
    const t = window.setTimeout(() => setResumed(null), 6000);
    return () => window.clearTimeout(t);
  }, [resumed]);

  // Scroll: progress, chrome visibility, debounced save.
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const p = measure();
        progressRef.current = p;
        setProgress(p);
        const y = window.scrollY;
        const dy = y - lastY.current;
        if (y < 80 || p > 0.985 || Date.now() < quietUntil.current) setChrome(true);
        else if (dy > 8) setChrome(false);
        else if (dy < -10) setChrome(true);
        lastY.current = y;
        const titleEl = titleRef.current;
        setPastTitle(Boolean(titleEl && titleEl.getBoundingClientRect().bottom < 0));
        window.clearTimeout(saveTimer.current);
        saveTimer.current = window.setTimeout(save, 600);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const flush = () => document.visibilityState === "hidden" && save();
    document.addEventListener("visibilitychange", flush);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("visibilitychange", flush);
      if (progressRef.current > 0.01) save();
    };
  }, [measure, save]);

  // Keep the reading position when language or type size changes the layout.
  useLayoutEffect(() => {
    if (restoreTo.current === null) return;
    scrollToProgress(restoreTo.current);
    restoreTo.current = null;
  }, [lang, fontStep, scrollToProgress]);

  const changeLang = (l: Lang) => {
    if (l === lang) return;
    restoreTo.current = measure();
    setChosenLang(l);
    library.setPrefs({ storyLang: l });
  };

  const changeFont = (step: number) => {
    restoreTo.current = measure();
    library.setPrefs({ fontStep: step });
  };

  // Esc leaves the reader.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !settingsOpen) router.push(`/stories/${story.slug}`);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, settingsOpen, story.slug]);

  const isThisTrack = audio.track?.storyId === story.id;
  const onListen = () => {
    if (isThisTrack) audio.toggle();
    else audio.playStory(story.id, { lang });
  };

  const minutes = story.readingMinutes[lang];
  const other: Lang = lang === "en" ? "te" : "en";
  const blocks = story.body[lang];
  const firstP = blocks.findIndex((b) => b.type === "p");

  return (
    <div
      className={cn("reader-theme-" + theme, "min-h-dvh bg-[var(--r-bg)] text-[var(--r-fg)] transition-colors duration-500")}
      style={{ "--reader-size": `${FONT_STEPS[fontStep]}rem` } as React.CSSProperties}
    >
      <ReaderTopBar
        visible={chrome || settingsOpen}
        exitHref={`/stories/${story.slug}`}
        storyId={story.id}
        number={story.number}
        title={story.title[lang]}
        showTitle={pastTitle}
        lang={lang}
        onLang={changeLang}
        progress={progress}
        fontStep={fontStep}
        onFontStep={changeFont}
        theme={theme}
        onTheme={(readerTheme) => library.setPrefs({ readerTheme })}
        onSettingsOpen={setSettingsOpen}
      />

      {/* Title page */}
      <header className="relative">
        <div className="relative h-[42svh] min-h-[16rem] overflow-hidden sm:h-[50svh]">
          <ArtImage artwork={story.artwork} sizes="100vw" priority className="absolute inset-0 opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--r-bg)]/20 via-[var(--r-bg)]/40 to-[var(--r-bg)]" />
        </div>
        <div className="relative mx-auto -mt-24 max-w-[40rem] px-6 text-center sm:-mt-32">
          <p className="text-[0.6875rem] tracking-[0.3em] text-[var(--r-accent)] uppercase">
            {collectionName} · {characterName.en}
          </p>
          <p className="mt-3 font-display text-lg text-[var(--r-muted)] italic">Story {pad2(story.number)}</p>
          <h1
            ref={titleRef}
            key={lang}
            className={cn(
              "mt-4 text-balance",
              lang === "te"
                ? "te text-[2.4rem] leading-[1.35] font-medium sm:text-[3rem]"
                : "font-display text-[3rem] leading-[0.98] font-medium sm:text-[4.25rem]",
            )}
          >
            {story.title[lang]}
          </h1>
          <p className={cn("mt-3 text-[var(--r-muted)]", other === "te" ? "te text-lg" : "font-display text-xl italic")}>
            {story.title[other]}
          </p>
          <Ornament width={140} className="mx-auto mt-8 text-[var(--r-accent)]" />
          <p className="mt-6 text-xs tracking-[0.18em] text-[var(--r-muted)] uppercase">
            {minutes} min read
            {story.contentStatus === "demo" && " · Demo text"}
          </p>
        </div>
      </header>

      {/* Text */}
      <motion.article
        key={lang}
        ref={articleRef}
        lang={lang}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45 }}
        onClick={(e) => {
          // A tap in the text toggles the chrome on touch devices.
          if (window.matchMedia("(hover: none)").matches && !(e.target as HTMLElement).closest("a,button")) setChrome((c) => !c);
        }}
        className={cn(
          "reader-prose mx-auto max-w-[37rem] px-6 pt-12 pb-10 sm:pt-16",
          lang === "te" ? "te" : "font-read",
        )}
      >
        {blocks.map((block, i) => (
          <Block key={i} block={block} dropcap={lang === "en" && i === firstP} />
        ))}
      </motion.article>

      {/* End of story */}
      <footer className="mx-auto max-w-[44rem] px-6 pt-10 pb-[calc(env(safe-area-inset-bottom)+8rem)]">
        <div className="flex flex-col items-center text-center">
          <Ornament width={180} className="text-[var(--r-accent)]" />
          <p className="mt-6 font-display text-2xl italic">End of Story {pad2(story.number)}</p>
          <p className="te mt-1 text-sm text-[var(--r-muted)]">కథ సమాప్తం</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <BookmarkButton
              storyId={story.id}
              bare
              labelled
              className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--r-faint)] px-5 text-sm text-[var(--r-fg)] transition-colors hover:border-[var(--r-accent)]"
            />
            <Link
              href={`/characters/${characterSlug}`}
              className="inline-flex h-11 items-center rounded-full border border-[var(--r-faint)] px-5 text-sm transition-colors hover:border-[var(--r-accent)]"
            >
              Back to {characterName.en}
            </Link>
          </div>
        </div>
        {(prev || next) && <StoryPager prev={prev} next={next} suffix="/read" className="mt-12" />}
      </footer>

      <ReaderBottomBar
        visible={chrome && !settingsOpen}
        prev={prev}
        next={next}
        progress={progress}
        minutesLeft={Math.ceil(minutes * (1 - progress))}
        listen={{ playing: isThisTrack && audio.isPlaying, active: isThisTrack, time: audio.currentTime, onClick: onListen }}
      />

      <AnimatePresence>
        {resumed !== null && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+5rem)] z-50 flex justify-center px-4"
          >
            <div className="flex items-center gap-4 rounded-full border border-[var(--r-faint)] bg-[var(--r-bg-2)] py-2 pr-2 pl-5 text-sm shadow-xl">
              <span>Resumed at {resumed}%</span>
              <button
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setResumed(null);
                }}
                className="rounded-full bg-[var(--r-faint)] px-3.5 py-1.5 text-[var(--r-accent)]"
              >
                Start over
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Block({ block, dropcap }: { block: StoryBlock; dropcap: boolean }) {
  switch (block.type) {
    case "p":
      return <p className={cn(dropcap && "dropcap")}>{block.text}</p>;
    case "quote":
      return (
        <blockquote className="reader-quote my-10 border-y border-[var(--r-faint)] py-7 text-center text-[var(--r-accent)]">
          {block.text}
        </blockquote>
      );
    case "break":
      return (
        <div aria-hidden className="my-10 flex justify-center gap-3 text-[var(--r-accent)]">
          <span>✦</span>
        </div>
      );
  }
}
