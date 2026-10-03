/**
 * Content model for Kathasagaram.
 *
 * These types describe the shape the UI expects. Today they are satisfied by
 * local TypeScript data (see ./stories.ts, ./characters.ts); later the same
 * shapes can be returned from an API or CMS via src/lib/content.ts without
 * touching components.
 */

export type Lang = "en" | "te";

export const LANGS: readonly Lang[] = ["en", "te"] as const;

/** A value available in every supported story language. */
export type Localized<T = string> = Record<Lang, T>;

export interface Artwork {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** CSS object-position used when the image is cropped by its container. */
  focus?: string;
  /**
   * True when this file is a stand-in (e.g. a crop of other art) awaiting a
   * dedicated illustration. Purely informational — see src/data/assets.ts.
   */
  placeholder?: boolean;
}

export interface AudioSource {
  src: string;
  /** Known duration in seconds; the player still reads the real value from the file. */
  durationSec?: number;
  narrator?: string;
  /** "demo" sources are synthesised ambience, not narration. */
  kind: "narration" | "demo";
}

export type StoryAudio = Partial<Record<Lang, AudioSource>>;

export type StoryBlock =
  | { type: "p"; text: string }
  | { type: "quote"; text: string }
  | { type: "break" };

export interface Story {
  id: string;
  slug: string;
  /** 1-based order within the character's collection. */
  number: number;
  collectionId: string;
  characterId: string;
  title: Localized;
  description: Localized;
  readingMinutes: Localized<number>;
  artwork: Artwork;
  body: Localized<StoryBlock[]>;
  audio: StoryAudio;
  timelineEventId?: string;
  /** Ids of people (see Character.relationships) who appear in the story. */
  featuring: string[];
  /** "demo" marks placeholder copy that editorial will replace. */
  contentStatus: "demo" | "final";
}

/** Lightweight story record for cards, rails and client-side lists. */
export type StorySummary = Omit<Story, "body">;

export interface TimelineEvent {
  id: string;
  title: Localized;
  phase: string;
  summary: string;
  storySlug?: string;
}

export interface IdentityFact {
  id: string;
  label: string;
  value: Localized;
  group: "origin" | "upbringing" | "path";
}

export interface NameTitle {
  id: string;
  /** Romanised form. */
  name: string;
  /** Telugu script form. */
  script: string;
  meaning: string;
}

export interface Emblem {
  id: string;
  name: Localized;
  kind: string;
  description: string;
  artwork: Artwork;
}

export type RelationshipKind = "family" | "foster" | "bond" | "guru" | "rival";

export interface Relationship {
  id: string;
  name: Localized;
  relation: Localized;
  kind: RelationshipKind;
  summary: string;
  storySlug?: string;
}

export interface Character {
  id: string;
  slug: string;
  collectionId: string;
  name: Localized;
  /** Telugu name written in Latin script, e.g. "Karnudu". */
  transliteration: string;
  /** Possessive form for headings: "Karna’s" / "కర్ణుని". */
  possessive: Localized;
  epithet: Localized;
  titles: string[];
  intro: string;
  about: string[];
  quote: { text: Localized; source: string };
  traits: Localized[];
  identity: IdentityFact[];
  names: NameTitle[];
  emblems: Emblem[];
  timeline: TimelineEvent[];
  relationships: Relationship[];
  artwork: { hero: Artwork; portrait: Artwork; figure: Artwork };
}

export interface Collection {
  id: string;
  slug: string;
  title: Localized;
  tagline: string;
  description: string;
  kind: "epic" | "purana" | "original";
  status: "available" | "coming-soon";
  characterIds: string[];
}

/** Everything the audio engine needs to play a story, without the text body. */
export interface AudioTrack {
  storyId: string;
  slug: string;
  number: number;
  characterName: Localized;
  title: Localized;
  artwork: Artwork;
  audio: StoryAudio;
}
