import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reader } from "@/components/reader/Reader";
import { TrackVisit } from "@/components/TrackVisit";
import { LANGS, type Lang } from "@/data/types";
import { getAdjacentStories, getCharacterById, getCollectionById, getStory } from "@/lib/content";

export async function generateMetadata({ params }: PageProps<"/stories/[slug]/read">): Promise<Metadata> {
  const story = await getStory((await params).slug);
  return story ? { title: `Reading · ${story.title.en}` } : {};
}

export default async function ReadPage({ params, searchParams }: PageProps<"/stories/[slug]/read">) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const story = await getStory(slug);
  if (!story) notFound();
  const [character, collection, { prev, next }] = await Promise.all([
    getCharacterById(story.characterId),
    getCollectionById(story.collectionId),
    getAdjacentStories(story),
  ]);
  if (!character || !collection) notFound();

  const urlLang = LANGS.includes(query.lang as Lang) ? (query.lang as Lang) : undefined;

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
        urlLang={urlLang}
      />
    </>
  );
}
