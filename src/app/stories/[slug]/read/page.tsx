import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reader } from "@/components/reader/Reader";
import { TrackVisit } from "@/components/TrackVisit";
import { getAdjacentStories, getCharacterById, getCollectionById, getStory, getStorySummaries } from "@/lib/content";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getStorySummaries()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/stories/[slug]/read">): Promise<Metadata> {
  const story = await getStory((await params).slug);
  return story ? { title: `Reading · ${story.title.en}` } : {};
}

export default async function ReadPage({ params }: PageProps<"/stories/[slug]/read">) {
  const story = await getStory((await params).slug);
  if (!story) notFound();
  const [character, collection, { prev, next }] = await Promise.all([
    getCharacterById(story.characterId),
    getCollectionById(story.collectionId),
    getAdjacentStories(story),
  ]);
  if (!character || !collection) notFound();

  return (
    <>
      <TrackVisit kind="story" slug={story.slug} />
      <Reader
        key={story.id}
        story={story}
        characterName={character.name}
        characterSlug={character.slug}
        collectionName={collection.title.en}
        prev={prev}
        next={next}
      />
    </>
  );
}
