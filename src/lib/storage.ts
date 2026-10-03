import type { Lang } from "@/data/types";

/**
 * Local persistence for the demo (no account, no backend).
 *
 * A tiny typed key/value store over localStorage with an in-memory cache and
 * change subscriptions, so React can read it through useSyncExternalStore
 * (see ./use-library.ts). Components never touch localStorage directly.
 * When accounts exist, this module is the seam to replace with a synced store.
 */

export interface ReadingEntry {
  /** 0–1 scroll progress through the story text. */
  progress: number;
  lang: Lang;
  updatedAt: number;
  /** Set once the reader reaches the end; survives re-reading. */
  completed?: boolean;
}

export interface ListeningEntry {
  position: number;
  duration: number;
  lang: Lang;
  updatedAt: number;
}

export interface BookmarkEntry {
  createdAt: number;
}

export interface RecentEntry {
  kind: "story" | "character";
  slug: string;
  at: number;
}

export type ReaderTheme = "night" | "parchment" | "midnight";

export interface Prefs {
  storyLang: Lang;
  /** Index into the reader's font-size scale. */
  fontStep: number;
  readerTheme: ReaderTheme;
  playbackRate: number;
}

export interface PlayerState {
  storyId: string;
  lang: Lang;
}

export interface Schema {
  reading: Record<string, ReadingEntry>;
  listening: Record<string, ListeningEntry>;
  bookmarks: Record<string, BookmarkEntry>;
  recent: RecentEntry[];
  prefs: Prefs;
  player: PlayerState | null;
}

export type Key = keyof Schema;

export const DEFAULTS: Schema = {
  reading: {},
  listening: {},
  bookmarks: {},
  recent: [],
  prefs: { storyLang: "en", fontStep: 2, readerTheme: "night", playbackRate: 1 },
  player: null,
};

const PREFIX = "kathasagaram:v1:";
const RECENT_LIMIT = 12;

const cache = new Map<Key, unknown>();
const listeners = new Map<Key, Set<() => void>>();

function storage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null; // blocked storage (privacy mode, sandboxed frames)
  }
}

function isShapeOf(value: unknown, fallback: unknown): boolean {
  if (fallback === null) return value === null || typeof value === "object";
  if (Array.isArray(fallback)) return Array.isArray(value);
  return typeof value === typeof fallback && !Array.isArray(value);
}

export function read<K extends Key>(key: K): Schema[K] {
  if (cache.has(key)) return cache.get(key) as Schema[K];
  let value: Schema[K] = DEFAULTS[key];
  try {
    const raw = storage()?.getItem(PREFIX + key);
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (isShapeOf(parsed, DEFAULTS[key])) {
        value = (
          key === "prefs" ? { ...DEFAULTS.prefs, ...(parsed as Partial<Prefs>) } : parsed
        ) as Schema[K];
      }
    }
  } catch {
    // corrupt entry — fall back to defaults
  }
  cache.set(key, value);
  return value;
}

export function write<K extends Key>(key: K, update: (prev: Schema[K]) => Schema[K]): void {
  const next = update(read(key));
  cache.set(key, next);
  try {
    storage()?.setItem(PREFIX + key, JSON.stringify(next));
  } catch {
    // quota / blocked — keep the in-memory value for this session
  }
  emit(key);
}

export function subscribe(key: Key, listener: () => void): () => void {
  let set = listeners.get(key);
  if (!set) listeners.set(key, (set = new Set()));
  set.add(listener);
  return () => set.delete(listener);
}

function emit(key: Key) {
  listeners.get(key)?.forEach((l) => l());
}

// Keep tabs in sync.
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (!event.key?.startsWith(PREFIX)) return;
    const key = event.key.slice(PREFIX.length) as Key;
    cache.delete(key);
    emit(key);
  });
}

/* ---------- Domain actions ---------- */

export const library = {
  saveReading(storyId: string, entry: { progress: number; lang: Lang }) {
    write("reading", (all) => {
      const completed = Boolean(all[storyId]?.completed) || entry.progress >= 0.97;
      return { ...all, [storyId]: { ...entry, completed, updatedAt: Date.now() } };
    });
  },

  saveListening(storyId: string, entry: Omit<ListeningEntry, "updatedAt">) {
    write("listening", (all) => ({ ...all, [storyId]: { ...entry, updatedAt: Date.now() } }));
  },

  toggleBookmark(storyId: string): boolean {
    const isSaved = Boolean(read("bookmarks")[storyId]);
    write("bookmarks", (all) => {
      const next = { ...all };
      if (isSaved) delete next[storyId];
      else next[storyId] = { createdAt: Date.now() };
      return next;
    });
    return !isSaved;
  },

  recordVisit(kind: RecentEntry["kind"], slug: string) {
    write("recent", (list) =>
      [{ kind, slug, at: Date.now() }, ...list.filter((e) => !(e.kind === kind && e.slug === slug))].slice(
        0,
        RECENT_LIMIT,
      ),
    );
  },

  setPrefs(patch: Partial<Prefs>) {
    write("prefs", (prefs) => ({ ...prefs, ...patch }));
  },

  setPlayer(state: PlayerState | null) {
    write("player", () => state);
  },

  clearAll() {
    (Object.keys(DEFAULTS) as Key[]).forEach((key) => {
      if (key === "prefs") return;
      write(key, () => DEFAULTS[key]);
    });
  },
};
