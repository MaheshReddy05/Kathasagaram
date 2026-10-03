"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { AudioSource, AudioTrack, Lang } from "@/data/types";
import { library, read } from "@/lib/storage";
import { useLibrary } from "@/lib/use-library";

/**
 * One <audio> element for the whole app, mounted in the root layout so
 * playback survives navigation. Which story is loaded lives in the local
 * store ("player"), so a reload restores the mini player (paused).
 */

interface AudioContextValue {
  catalog: AudioTrack[];
  track: AudioTrack | null;
  lang: Lang;
  source: AudioSource | undefined;
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  currentTime: number;
  duration: number;
  rate: number;
  prevTrack: AudioTrack | undefined;
  nextTrack: AudioTrack | undefined;
  /** Load a story (optionally in a language) and, by default, start playing. */
  playStory: (storyId: string, opts?: { lang?: Lang; autoplay?: boolean }) => void;
  toggle: () => void;
  seek: (seconds: number) => void;
  skip: (delta: number) => void;
  setRate: (rate: number) => void;
  setLang: (lang: Lang) => void;
  close: () => void;
}

const AudioCtx = createContext<AudioContextValue | null>(null);

export function useAudio(): AudioContextValue {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useAudio must be used inside <AudioProvider>");
  return ctx;
}

const SAVE_EVERY_MS = 4000;

export function AudioProvider({ catalog, children }: { catalog: AudioTrack[]; children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const player = useLibrary("player");
  const prefs = useLibrary("prefs");

  const track = useMemo(
    () => (player ? (catalog.find((t) => t.storyId === player.storyId) ?? null) : null),
    [catalog, player],
  );
  const lang: Lang = player?.lang ?? prefs.storyLang;
  const source = track?.audio[lang];
  const rate = prefs.playbackRate;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const pendingResume = useRef<number | null>(null);
  const lastSaved = useRef(0);

  const persist = useCallback(() => {
    const el = audioRef.current;
    const current = read("player"); // live value, not a render-time snapshot
    if (!el || !current || !Number.isFinite(el.duration) || el.duration === 0) return;
    library.saveListening(current.storyId, { position: el.currentTime, duration: el.duration, lang: current.lang });
    lastSaved.current = Date.now();
  }, []);

  /** Point the element at a source. Called from click handlers so play() keeps the user gesture. */
  const attach = useCallback(
    (storyId: string, nextLang: Lang, autoplay: boolean) => {
      const el = audioRef.current;
      const t = catalog.find((c) => c.storyId === storyId);
      const src = t?.audio[nextLang]?.src;
      if (!el || !t) return;
      if (!src) {
        setError("Audio for this language is not available yet.");
        return;
      }
      const saved = read("listening")[storyId];
      pendingResume.current = saved && saved.lang === nextLang ? saved.position : 0;
      if (el.getAttribute("src") !== src) {
        el.src = src;
        el.load();
        setCurrentTime(pendingResume.current ?? 0);
        setDuration(t.audio[nextLang]?.durationSec ?? 0);
      }
      el.defaultPlaybackRate = el.playbackRate = read("prefs").playbackRate;
      setError(null);
      if (autoplay) {
        setIsLoading(true);
        el.play().catch(() => setIsLoading(false));
      }
    },
    [catalog],
  );

  // Restore (paused) whatever was loaded before a reload.
  // Child effects run first, so a page may already have attached a story —
  // only restore into an empty element, from the live store value.
  useEffect(() => {
    const el = audioRef.current;
    const saved = read("player");
    if (el && saved && !el.getAttribute("src")) attach(saved.storyId, saved.lang, false);
  }, [attach]);

  useEffect(() => {
    const el = audioRef.current;
    if (el) el.defaultPlaybackRate = el.playbackRate = rate;
  }, [rate]);

  const playStory = useCallback<AudioContextValue["playStory"]>(
    (storyId, opts = {}) => {
      const nextLang = opts.lang ?? (player?.storyId === storyId ? player.lang : read("prefs").storyLang);
      if (player && player.storyId !== storyId) persist();
      library.setPlayer({ storyId, lang: nextLang });
      attach(storyId, nextLang, opts.autoplay ?? true);
    },
    [attach, persist, player],
  );

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el || !player) return;
    if (!el.getAttribute("src")) {
      attach(player.storyId, player.lang, true);
      return;
    }
    if (el.paused) el.play().catch(() => setIsPlaying(false));
    else el.pause();
  }, [attach, player]);

  const seek = useCallback((seconds: number) => {
    const el = audioRef.current;
    if (!el || !Number.isFinite(el.duration)) return;
    el.currentTime = Math.min(Math.max(0, seconds), el.duration);
    setCurrentTime(el.currentTime);
  }, []);

  const skip = useCallback((delta: number) => {
    const el = audioRef.current;
    if (el) seek(el.currentTime + delta);
  }, [seek]);

  const setRate = useCallback((r: number) => library.setPrefs({ playbackRate: r }), []);

  const setLang = useCallback(
    (nextLang: Lang) => {
      if (!player || nextLang === player.lang) return;
      const wasPlaying = !audioRef.current?.paused;
      persist();
      library.setPlayer({ storyId: player.storyId, lang: nextLang });
      attach(player.storyId, nextLang, wasPlaying);
    },
    [attach, persist, player],
  );

  const close = useCallback(() => {
    const el = audioRef.current;
    persist();
    if (el) {
      el.pause();
      el.removeAttribute("src");
      el.load();
    }
    library.setPlayer(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [persist]);

  const index = track ? catalog.findIndex((t) => t.storyId === track.storyId) : -1;
  const prevTrack = index > 0 ? catalog[index - 1] : undefined;
  const nextTrack = index >= 0 ? catalog[index + 1] : undefined;

  // Lock-screen / hardware media keys.
  useEffect(() => {
    if (!("mediaSession" in navigator) || !track) return;
    const ms = navigator.mediaSession;
    ms.metadata = new MediaMetadata({
      title: track.title[lang],
      artist: `${track.characterName[lang]} · Kathasagaram`,
      album: "Mahabharata",
      artwork: [{ src: track.artwork.src, sizes: `${track.artwork.width}x${track.artwork.height}`, type: "image/webp" }],
    });
    const handlers: [MediaSessionAction, MediaSessionActionHandler | null][] = [
      ["play", () => audioRef.current?.play()],
      ["pause", () => audioRef.current?.pause()],
      ["seekbackward", () => skip(-15)],
      ["seekforward", () => skip(15)],
      ["previoustrack", prevTrack ? () => playStory(prevTrack.storyId) : null],
      ["nexttrack", nextTrack ? () => playStory(nextTrack.storyId) : null],
    ];
    handlers.forEach(([action, handler]) => {
      try {
        ms.setActionHandler(action, handler);
      } catch {
        /* unsupported action */
      }
    });
  }, [track, lang, prevTrack, nextTrack, playStory, skip]);

  const value = useMemo<AudioContextValue>(
    () => ({
      catalog,
      track,
      lang,
      source,
      isPlaying,
      isLoading,
      error,
      currentTime,
      duration,
      rate,
      prevTrack,
      nextTrack,
      playStory,
      toggle,
      seek,
      skip,
      setRate,
      setLang,
      close,
    }),
    [catalog, track, lang, source, isPlaying, isLoading, error, currentTime, duration, rate, prevTrack, nextTrack, playStory, toggle, seek, skip, setRate, setLang, close],
  );

  return (
    <AudioCtx.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        preload="metadata"
        onLoadedMetadata={(e) => {
          const el = e.currentTarget;
          setDuration(el.duration);
          const resume = pendingResume.current;
          pendingResume.current = null;
          if (resume && resume > 3 && resume < el.duration - 3) el.currentTime = resume;
        }}
        onTimeUpdate={(e) => {
          setCurrentTime(e.currentTarget.currentTime);
          if (Date.now() - lastSaved.current > SAVE_EVERY_MS) persist();
        }}
        onPlay={() => setIsPlaying(true)}
        onPlaying={() => setIsLoading(false)}
        onWaiting={() => setIsLoading(true)}
        onPause={() => {
          setIsPlaying(false);
          setIsLoading(false);
          persist();
        }}
        onEnded={() => {
          setIsPlaying(false);
          persist();
        }}
        onError={(e) => {
          if (!e.currentTarget.getAttribute("src")) return;
          setIsLoading(false);
          setIsPlaying(false);
          setError("This audio could not be loaded.");
        }}
      />
    </AudioCtx.Provider>
  );
}
