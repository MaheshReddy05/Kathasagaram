import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CharacterHero } from "@/components/character/CharacterHero";
import { AboutSection, EmblemsSection, IdentitySection, NamesSection } from "@/components/character/CharacterSections";
import { CharacterTimeline } from "@/components/character/CharacterTimeline";
import { Relationships } from "@/components/character/Relationships";
import { SectionNav } from "@/components/character/SectionNav";
import { StoryCard } from "@/components/story/StoryCard";
import { TrackVisit } from "@/components/TrackVisit";
import { SectionHeading } from "@/components/ui/primitives";
import { getCharacter, getCharacters, getStorySummaries } from "@/lib/content";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getCharacters()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/characters/[slug]">): Promise<Metadata> {
  const character = await getCharacter((await params).slug);
  if (!character) return {};
  return {
    title: `${character.name.en} · ${character.name.te}`,
    description: character.intro,
  };
}

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "identity", label: "Identity" },
  { id: "names", label: "Names" },
  { id: "timeline", label: "Timeline" },
  { id: "relationships", label: "Relationships" },
  { id: "stories", label: "Stories" },
];

export default async function CharacterPage({ params }: PageProps<"/characters/[slug]">) {
  const character = await getCharacter((await params).slug);
  if (!character) notFound();
  const stories = await getStorySummaries({ characterId: character.id });
  const storyIdBySlug = Object.fromEntries(stories.map((s) => [s.slug, s.id]));

  return (
    <>
      <TrackVisit kind="character" slug={character.slug} />
      <CharacterHero character={character} firstStory={stories[0]} />
      <SectionNav sections={SECTIONS} />

      <AboutSection character={character} />
      <IdentitySection character={character} />
      <EmblemsSection character={character} />
      <NamesSection character={character} />

      <section id="timeline" className="scroll-mt-36 pt-24 sm:pt-32">
        <div className="shell">
          <SectionHeading eyebrow="Timeline" title={`The life of ${character.name.en}`} telugu="జీవన యాత్ర" className="mb-12" />
        </div>
        <CharacterTimeline events={character.timeline} storyIdBySlug={storyIdBySlug} />
      </section>

      <section id="relationships" className="shell scroll-mt-36 pt-24 sm:pt-32">
        <SectionHeading eyebrow="Relationships" title="Bound by blood, loyalty & rivalry" telugu="బంధాలు" className="mb-12" />
        <Relationships character={character} />
      </section>

      <section id="stories" className="shell scroll-mt-36 pt-24 sm:pt-32">
        <SectionHeading eyebrow={`${stories.length} stories`} title={`Stories of ${character.name.en}`} telugu={`${character.possessive.te} కథలు`} className="mb-10" />
        <ul className="hidden grid-cols-2 gap-5 sm:grid lg:grid-cols-4 xl:grid-cols-5">
          {stories.map((s) => (
            <li key={s.id}>
              <StoryCard story={s} />
            </li>
          ))}
        </ul>
        <ul className="flex flex-col gap-3 sm:hidden">
          {stories.map((s) => (
            <li key={s.id}>
              <StoryCard story={s} variant="row" />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
