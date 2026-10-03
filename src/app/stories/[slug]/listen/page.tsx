import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AudioPlayer } from "@/components/audio/AudioPlayer";
import { getCharacterById, getStory, getStorySummaries, toSummary } from "@/lib/content";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getStorySummaries()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/stories/[slug]/listen">): Promise<Metadata> {
  const story = await getStory((await params).slug);
  return story ? { title: `Listening · ${story.title.en}` } : {};
}

export default async function ListenPage({ params }: PageProps<"/stories/[slug]/listen">) {
  const story = await getStory((await params).slug);
  if (!story) notFound();
  const [character, siblings] = await Promise.all([
    getCharacterById(story.characterId),
    getStorySummaries({ characterId: story.characterId }),
  ]);
  if (!character) notFound();
  const upNext = siblings.filter((s) => s.number > story.number).slice(0, 4);

  return <AudioPlayer story={toSummary(story)} characterName={character.name.en} upNext={upNext} />;
}
