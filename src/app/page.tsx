import { notFound } from "next/navigation";
import { CharacterSpotlight } from "@/components/home/CharacterSpotlight";
import { CollectionBand } from "@/components/home/CollectionBand";
import { ContinueJourney } from "@/components/home/ContinueJourney";
import { HomeHero } from "@/components/home/HomeHero";
import { OriginalsTeaser } from "@/components/home/OriginalsTeaser";
import { RailItem, StoryRail } from "@/components/story/StoryRail";
import { StoryCard } from "@/components/story/StoryCard";
import { SectionHeading } from "@/components/ui/primitives";
import { getCollection, getFeaturedCharacter, getStorySummaries } from "@/lib/content";

export default async function HomePage() {
  const character = await getFeaturedCharacter();
  const [stories, mahabharata, chitragupta] = await Promise.all([
    getStorySummaries({ characterId: character.id }),
    getCollection("mahabharata"),
    getCollection("chitragupta-universe"),
  ]);
  if (!mahabharata || stories.length === 0) notFound();

  return (
    <>
      <HomeHero character={character} firstStory={stories[0]} storyCount={stories.length} />

      <div className="flex flex-col gap-20 pt-6 sm:gap-28">
        <section className="shell" aria-labelledby="continue-heading">
          <h2 id="continue-heading" className="eyebrow mb-5 text-ivory/50">
            Continue your journey
          </h2>
          <ContinueJourney stories={stories} firstStory={stories[0]} />
        </section>

        <section aria-labelledby="stories-heading">
          <div className="shell">
            <SectionHeading
              eyebrow={`Mahabharata · ${character.name.en}`}
              title={`Stories of ${character.name.en}`}
              telugu={`${character.possessive.te} కథలు`}
              action={{ href: `/characters/${character.slug}#stories`, label: "All stories" }}
              id="stories-heading"
              className="mb-8"
            />
          </div>
          <StoryRail label={`Stories of ${character.name.en}`}>
            {stories.map((story, i) => (
              <RailItem key={story.id}>
                <StoryCard story={story} priority={i < 2} />
              </RailItem>
            ))}
          </StoryRail>
        </section>

        <section aria-labelledby="explore-heading">
          <div className="shell">
            <SectionHeading id="explore-heading" eyebrow="Explore" title="The Mahabharata" telugu="మహాభారతం" className="mb-8" />
          </div>
          <CollectionBand collection={mahabharata} character={character} storyCount={stories.length} />
        </section>

        <CharacterSpotlight character={character} />

        {chitragupta && (
          <section className="shell" aria-labelledby="originals-heading">
            <SectionHeading id="originals-heading" eyebrow="Kathasagaram originals" title="Original Stories" className="mb-8" />
            <OriginalsTeaser collection={chitragupta} />
          </section>
        )}
      </div>
    </>
  );
}
