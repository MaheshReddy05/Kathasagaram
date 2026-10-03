import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StorySearch } from "@/components/explore/StorySearch";
import { OriginalsTeaser } from "@/components/home/OriginalsTeaser";
import { ArtImage } from "@/components/ui/ArtImage";
import { Ornament } from "@/components/ui/Ornament";
import { SectionHeading } from "@/components/ui/primitives";
import { getCharacterById, getCollections, getStorySummaries } from "@/lib/content";

export const metadata: Metadata = { title: "Explore" };

export default async function ExplorePage() {
  const [collections, stories] = await Promise.all([getCollections(), getStorySummaries()]);
  const mahabharata = collections.find((c) => c.id === "mahabharata");
  if (!mahabharata) notFound();
  const characters = (await Promise.all(mahabharata.characterIds.map(getCharacterById))).filter((c) => c !== undefined);
  const upcoming = collections.filter((c) => c.status === "coming-soon" && c.kind !== "original");
  const originals = collections.filter((c) => c.kind === "original");

  return (
    <div className="pt-28 sm:pt-36">
      <header className="shell">
        <p className="eyebrow">Explore</p>
        <h1 className="mt-4 font-display text-[3.25rem] leading-[0.95] font-medium text-ivory sm:text-[4.75rem]">
          Worlds of story
        </h1>
        <p className="te mt-3 text-xl text-gold-soft/75">కథా ప్రపంచాలు</p>
        <p className="mt-5 max-w-xl text-[1rem] leading-relaxed text-ivory/60">
          Begin with the Mahabharata — told, for now, through one extraordinary life. More epics, traditions and original
          worlds are on their way.
        </p>
      </header>

      {/* Mahabharata */}
      <section id="mahabharata" className="shell scroll-mt-28 pt-14">
        <div className="relative isolate overflow-hidden rounded-[2rem] ring-1 ring-ivory/[0.08]">
          {characters[0] && (
            <ArtImage artwork={characters[0].artwork.hero} sizes="100vw" priority focus="30% 60%" className="absolute inset-0 -z-10" />
          )}
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-abyss via-abyss/70 to-abyss/20 md:bg-gradient-to-r md:from-abyss md:via-abyss/75 md:to-abyss/10" />
          <div className="flex min-h-[26rem] flex-col justify-end p-6 sm:p-10 md:min-h-[30rem] md:max-w-[34rem] md:justify-center">
            <p className="flex items-center gap-3">
              <span className="eyebrow">The epic</span>
              <span className="rounded-full bg-turquoise/15 px-2.5 py-0.5 text-[0.625rem] tracking-[0.18em] text-turquoise uppercase">
                Available now
              </span>
            </p>
            <h2 className="mt-4 font-display text-[3.25rem] leading-none font-medium text-ivory sm:text-[4.5rem]">
              {mahabharata.title.en}
            </h2>
            <p className="te mt-2 text-2xl text-gold-soft/80">{mahabharata.title.te}</p>
            <p className="mt-4 font-display text-xl text-ivory/80 italic">{mahabharata.tagline}</p>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-ivory/60">{mahabharata.description}</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] sm:gap-5">
          {characters.map((c) => (
            <Link
              key={c.id}
              href={`/characters/${c.slug}`}
              className="group surface relative flex overflow-hidden rounded-[1.5rem] transition-colors duration-500 hover:border-gold/30"
            >
              <ArtImage artwork={c.artwork.portrait} sizes="220px" zoom className="w-[38%] min-h-[15rem] shrink-0 sm:w-[42%]" />
              <div className="flex flex-col justify-center p-5 sm:p-8">
                <p className="text-[0.625rem] tracking-[0.22em] text-gold/80 uppercase">Character</p>
                <p className="mt-2 font-display text-[2.4rem] leading-none text-ivory sm:text-[3rem]">{c.name.en}</p>
                <p className="te mt-1 text-lg text-gold-soft/75">{c.name.te}</p>
                <p className="mt-3 hidden text-sm leading-relaxed text-ivory/55 xs:block">{c.epithet.en}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm text-gold-soft">
                  Enter
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
          <div className="flex flex-col justify-between rounded-[1.5rem] border border-dashed border-ivory/12 p-6 sm:p-8">
            <Ornament width={96} className="opacity-50" />
            <div className="mt-8">
              <p className="text-[0.625rem] tracking-[0.22em] text-ivory/40 uppercase">Coming soon</p>
              <p className="mt-2 font-display text-[1.75rem] leading-tight text-ivory/80">More of the Mahabharata</p>
              <p className="mt-2 text-sm leading-relaxed text-ivory/45">
                New characters, their stories and the threads that bind them — arriving in future chapters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* All stories */}
      <section className="shell pt-24" aria-labelledby="all-stories">
        <SectionHeading id="all-stories" eyebrow="Mahabharata" title="All stories" telugu="అన్ని కథలు" className="mb-8" />
        <StorySearch stories={stories} />
      </section>

      {/* Coming soon */}
      <section className="shell pt-24" aria-labelledby="coming-soon">
        <SectionHeading id="coming-soon" eyebrow="On the horizon" title="Coming soon" telugu="త్వరలో" className="mb-8" />
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1.3fr]">
          {upcoming.map((c) => (
            <article
              key={c.id}
              className="relative flex min-h-[15rem] flex-col justify-end overflow-hidden rounded-[1.75rem] border border-ivory/[0.08] bg-gradient-to-br from-deep to-ink p-7"
            >
              <p aria-hidden className="te pointer-events-none absolute -top-4 -right-2 text-[6.5rem] leading-none text-ivory/[0.04]">
                {c.title.te}
              </p>
              <p className="text-[0.625rem] tracking-[0.24em] text-ivory/40 uppercase">Coming soon</p>
              <h3 className="mt-3 font-display text-[2.4rem] leading-none text-ivory/90">{c.title.en}</h3>
              <p className="te mt-1 text-base text-gold-soft/60">{c.title.te}</p>
              <p className="mt-3 text-sm text-ivory/50">{c.tagline}</p>
            </article>
          ))}
          {originals.map((c) => (
            <OriginalsTeaser key={c.id} collection={c} className="min-h-[15rem] !p-7" />
          ))}
        </div>
      </section>
    </div>
  );
}
