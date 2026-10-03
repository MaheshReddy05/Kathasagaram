import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ArtImage } from "@/components/ui/ArtImage";
import type { Character, Collection } from "@/data/types";

/**
 * The Mahabharata as a collection: one available character today, presented
 * as a doorway rather than padded with placeholder characters.
 */
export function CollectionBand({ collection, character, storyCount }: { collection: Collection; character: Character; storyCount: number }) {
  return (
    <section className="shell">
      <div className="grid gap-4 md:grid-cols-[1.35fr_1fr] md:gap-5">
        <Link
          href="/explore"
          className="group relative isolate flex min-h-[20rem] flex-col justify-end overflow-hidden rounded-[1.75rem] p-6 ring-1 ring-ivory/[0.08] sm:min-h-[24rem] sm:p-9"
        >
          <ArtImage
            artwork={character.artwork.hero}
            sizes="(min-width: 768px) 60vw, 100vw"
            focus="20% 70%"
            zoom
            className="absolute inset-0 -z-10"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-abyss via-abyss/50 to-abyss/0" />
          <p className="eyebrow">The epic</p>
          <h3 className="mt-3 font-display text-[3rem] leading-none font-medium text-ivory sm:text-[4rem]">
            {collection.title.en}
          </h3>
          <p className="te mt-2 text-xl text-gold-soft/80">{collection.title.te}</p>
          <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-ivory/65">{collection.description}</p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm text-gold-soft">
            Explore the collection
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </Link>

        <Link
          href={`/characters/${character.slug}`}
          className="group surface relative flex items-center gap-5 overflow-hidden rounded-[1.75rem] p-5 sm:p-6 md:flex-col md:items-stretch md:justify-between"
        >
          <div className="relative aspect-[3/4] w-28 shrink-0 overflow-hidden rounded-2xl sm:w-32 md:w-full md:flex-1 md:aspect-auto md:min-h-[12rem]">
            <ArtImage artwork={character.artwork.portrait} sizes="(min-width: 768px) 35vw, 128px" zoom className="absolute inset-0" />
            <span className="absolute top-3 left-3 hidden rounded-full bg-abyss/70 px-2.5 py-1 text-[0.625rem] tracking-[0.18em] text-gold-soft uppercase backdrop-blur md:inline">
              Available now
            </span>
          </div>
          <div className="min-w-0 md:mt-5">
            <p className="text-[0.625rem] tracking-[0.22em] text-gold/80 uppercase">Character · {storyCount} stories</p>
            <p className="mt-1.5 font-display text-[2rem] leading-none text-ivory">
              {character.name.en} <span className="te text-lg text-gold-soft/75">{character.name.te}</span>
            </p>
            <p className="mt-2 text-sm text-ivory/55">{character.titles.slice(0, 2).join(" · ")}</p>
            <p className="mt-4 text-xs text-ivory/40">More of the Mahabharata is being written.</p>
          </div>
        </Link>
      </div>
    </section>
  );
}
