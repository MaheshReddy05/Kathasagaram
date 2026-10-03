import "server-only";

import { characters } from "@/data/characters";
import { collections } from "@/data/collections";
import { stories } from "@/data/stories";
import type { AudioTrack, Character, Collection, Story, StorySummary } from "@/data/types";

/**
 * Content repository.
 *
 * The only module that knows content comes from local files. Every function
 * is async so swapping the bodies for API / database calls later does not
 * change any call site.
 */

const byNumber = (a: Story, b: Story) => a.number - b.number;

export function toSummary(story: Story): StorySummary {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { body, ...summary } = story;
  return summary;
}

export async function getCollections(): Promise<Collection[]> {
  return collections;
}

export async function getCollection(slug: string): Promise<Collection | undefined> {
  return collections.find((c) => c.slug === slug);
}

export async function getCollectionById(id: string): Promise<Collection | undefined> {
  return collections.find((c) => c.id === id);
}

export async function getCharacters(): Promise<Character[]> {
  return characters;
}

export async function getCharacter(slug: string): Promise<Character | undefined> {
  return characters.find((c) => c.slug === slug);
}

export async function getCharacterById(id: string): Promise<Character | undefined> {
  return characters.find((c) => c.id === id);
}

export async function getFeaturedCharacter(): Promise<Character> {
  return characters[0];
}

export async function getStorySummaries(filter: { characterId?: string } = {}): Promise<StorySummary[]> {
  return stories
    .filter((s) => !filter.characterId || s.characterId === filter.characterId)
    .sort(byNumber)
    .map(toSummary);
}

export async function getStory(slug: string): Promise<Story | undefined> {
  return stories.find((s) => s.slug === slug);
}

export async function getAdjacentStories(
  story: Pick<Story, "characterId" | "number">,
): Promise<{ prev?: StorySummary; next?: StorySummary }> {
  const siblings = await getStorySummaries({ characterId: story.characterId });
  const index = siblings.findIndex((s) => s.number === story.number);
  return { prev: siblings[index - 1], next: siblings[index + 1] };
}

/** Minimal metadata the client-side audio engine needs to play any story. */
export async function getAudioCatalog(): Promise<AudioTrack[]> {
  return [...stories].sort(byNumber).map((s) => {
    const character = characters.find((c) => c.id === s.characterId);
    return {
      storyId: s.id,
      slug: s.slug,
      number: s.number,
      characterName: character?.name ?? { en: "", te: "" },
      title: s.title,
      artwork: s.artwork,
      audio: s.audio,
    };
  });
}
