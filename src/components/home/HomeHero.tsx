import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { ArtImage } from "@/components/ui/ArtImage";
import { Star } from "@/components/ui/Ornament";
import type { Character, StorySummary } from "@/data/types";

/** Cinematic first viewport: Karna, the Mahabharata, two clear ways in. */
export function HomeHero({ character, firstStory, storyCount }: { character: Character; firstStory: StorySummary; storyCount: number }) {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden md:min-h-[min(100svh,58rem)] md:justify-center">
      <div className="absolute inset-0 -z-10">
        <div className="animate-settle absolute inset-0">
          <ArtImage
            artwork={character.artwork.hero}
            sizes="100vw"
            priority
            className="absolute inset-0"
            focus="72% 22%"
            imgClassName="md:!object-[70%_30%]"
          />
        </div>
        {/* Legibility: deep left wash on desktop, bottom wash on mobile */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/0 md:bg-gradient-to-r md:from-ink md:via-ink/75 md:to-ink/0" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/70 to-transparent" />
      </div>

      <div className="shell pt-28 pb-10 md:pt-32 md:pb-24">
        <div className="max-w-[36rem]">
          <p className="eyebrow animate-rise flex items-center gap-3" style={{ animationDelay: "0.15s" }}>
            <span>Mahabharata</span>
            <Star className="size-2 text-gold/70" />
            <span className="text-ivory/55">Character spotlight</span>
          </p>

          <h1 className="animate-rise mt-5 flex items-end gap-4" style={{ animationDelay: "0.25s" }}>
            <span className="gold-text font-display text-[5.5rem] leading-[0.82] font-medium tracking-[-0.02em] sm:text-[7.5rem] lg:text-[9rem]">
              {character.name.en}
            </span>
            <span className="te mb-2 text-[1.6rem] text-gold-soft/80 sm:mb-3 sm:text-[2.1rem]">{character.name.te}</span>
          </h1>

          <p
            className="animate-rise mt-4 font-display text-[1.6rem] leading-snug text-ivory/90 italic sm:text-[1.9rem]"
            style={{ animationDelay: "0.4s" }}
          >
            {character.epithet.en}
          </p>

          <p
            className="animate-rise mt-4 max-w-[30rem] text-[0.98rem] leading-relaxed text-ivory/65 sm:text-[1.0625rem]"
            style={{ animationDelay: "0.5s" }}
          >
            {character.intro}
          </p>

          <div className="animate-rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: "0.62s" }}>
            <Link href={`/characters/${character.slug}`} className="btn btn-gold flex-1 xs:flex-none">
              Explore {character.name.en}
              <ArrowRight className="size-4" />
            </Link>
            <Link href={`/stories/${firstStory.slug}`} className="btn btn-ghost flex-1 xs:flex-none">
              <BookOpen className="size-4" />
              Read the first story
            </Link>
          </div>

          <dl
            className="animate-rise mt-10 hidden gap-8 sm:flex border-t border-ivory/10 pt-5 text-ivory/55"
            style={{ animationDelay: "0.75s" }}
          >
            {[
              [String(storyCount), "Stories"],
              [String(character.timeline.length), "Moments"],
              ["EN · తె", "Read & listen"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="font-display text-2xl leading-none text-ivory">{value}</dd>
                <dd className="mt-1.5 text-[0.6875rem] tracking-[0.18em] uppercase">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
