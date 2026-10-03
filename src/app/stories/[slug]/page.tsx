import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OpeningLines, StoryHero } from "@/components/story/StoryHero";
import { StoryPager } from "@/components/story/StoryPager";
import { RailItem, StoryRail } from "@/components/story/StoryRail";
import { StoryCard } from "@/components/story/StoryCard";
import { TrackVisit } from "@/components/TrackVisit";
import { SectionHeading } from "@/components/ui/primitives";
import { getAdjacentStories, getCharacterById, getCollectionById, getStory, getStorySummaries } from "@/lib/content";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getStorySummaries()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/stories/[slug]">): Promise<Metadata> {
  const story = await getStory((await params).slug);
  if (!story) return {};
  return { title: `${story.title.en} · ${story.title.te}`, description: story.description.en };
}

export default async function StoryPage({ params }: PageProps<"/stories/[slug]">) {
  const story = await getStory((await params).slug);
  if (!story) notFound();
  const [character, collection, adjacent, siblings] = await Promise.all([
    getCharacterById(story.characterId),
    getCollectionById(story.collectionId),
    getAdjacentStories(story),
    getStorySummaries({ characterId: story.characterId }),
  ]);
  if (!character || !collection) notFound();

  const event = character.timeline.find((e) => e.id === story.timelineEventId);
  const featuring = character.relationships.filter((r) => story.featuring.includes(r.id));
  const opening = story.body.en.find((b) => b.type === "p");
  const more = siblings.filter((s) => s.id !== story.id);

  return (
    <>
      <TrackVisit kind="story" slug={story.slug} />
      <StoryHero story={story} character={character} collection={collection} />

      <section className="shell grid gap-12 pt-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:gap-16 md:pt-16">
        {opening && "text" in opening && (
          <div>
            <p className="eyebrow mb-5 text-ivory/45">Opening lines</p>
            <OpeningLines text={opening.text} slug={story.slug} />
          </div>
        )}

        <aside className="flex flex-col gap-4">
          {event && (
            <Link
              href={`/characters/${character.slug}#timeline`}
              className="group surface rounded-2xl p-5 transition-colors hover:border-gold/30"
            >
              <p className="eyebrow text-[0.625rem] text-ivory/45">
                In {character.possessive.en} life · {event.phase}
              </p>
              <p className="mt-2 font-display text-[1.6rem] leading-tight text-ivory">
                {event.title.en} <span className="te text-sm text-gold-soft/70">{event.title.te}</span>
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-ivory/55">{event.summary}</p>
              <p className="mt-3 text-xs text-gold-soft/80 transition-transform duration-300 group-hover:translate-x-0.5">
                See the full timeline →
              </p>
            </Link>
          )}

          {featuring.length > 0 && (
            <div className="surface rounded-2xl p-5">
              <p className="eyebrow text-[0.625rem] text-ivory/45">Featuring</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {[{ id: character.id, name: character.name, relation: { en: "", te: "" } }, ...featuring].map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/characters/${character.slug}#relationships`}
                      className="inline-flex h-9 items-center gap-2 rounded-full border border-ivory/12 px-3.5 text-sm text-ivory/80 transition-colors hover:border-gold/40 hover:text-gold-soft"
                    >
                      {p.name.en}
                      <span className="te text-xs text-ivory/40">{p.name.te}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </section>

      <div className="shell pt-16">
        <StoryPager prev={adjacent.prev} next={adjacent.next} />
      </div>

      <section className="pt-20" aria-labelledby="more-heading">
        <div className="shell">
          <SectionHeading
            id="more-heading"
            eyebrow={character.name.en}
            title="More stories"
            action={{ href: `/characters/${character.slug}#stories`, label: "All stories" }}
            className="mb-8"
          />
        </div>
        <StoryRail label="More stories">
          {more.map((s) => (
            <RailItem key={s.id}>
              <StoryCard story={s} />
            </RailItem>
          ))}
        </StoryRail>
      </section>
    </>
  );
}
