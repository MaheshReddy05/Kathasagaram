import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ArtImage } from "@/components/ui/ArtImage";
import { Ornament } from "@/components/ui/Ornament";
import { Chip } from "@/components/ui/primitives";
import type { Character } from "@/data/types";

/** Editorial portrait + quote. The "who is this person" moment on Home. */
export function CharacterSpotlight({ character }: { character: Character }) {
  return (
    <section className="shell">
      <div className="relative grid overflow-hidden rounded-[2rem] border border-ivory/[0.08] bg-gradient-to-br from-peacock/70 via-deep to-navy/80 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-32 size-[30rem] rounded-full bg-[radial-gradient(circle,rgb(201_163_91/0.16),transparent_65%)]"
        />
        <div className="relative min-h-[26rem] md:min-h-[38rem]">
          <ArtImage artwork={character.artwork.portrait} sizes="(min-width: 768px) 45vw, 100vw" className="absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-deep via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-deep/90" />
        </div>

        <div className="relative flex flex-col justify-center px-6 pt-2 pb-10 sm:px-10 md:py-16 md:pr-14 md:pl-6">
          <p className="eyebrow">Character spotlight</p>
          <h2 className="mt-4 font-display text-[3rem] leading-none font-medium text-ivory sm:text-[3.75rem]">
            {character.name.en}
            <span className="te ml-3 align-middle text-2xl text-gold-soft/80">{character.name.te}</span>
          </h2>
          <p className="mt-3 text-[0.8125rem] tracking-[0.12em] text-ivory/55 uppercase">{character.titles.join(" · ")}</p>

          <figure className="mt-8 border-l border-gold/40 pl-5">
            <blockquote className="font-display text-[1.55rem] leading-snug text-ivory/90 italic sm:text-[1.75rem]">
              “{character.quote.text.en}”
            </blockquote>
            <p className="te mt-3 text-[0.95rem] leading-relaxed text-gold-soft/70">{character.quote.text.te}</p>
            <figcaption className="mt-3 text-xs tracking-wide text-ivory/40">{character.quote.source}</figcaption>
          </figure>

          <div className="mt-8 flex flex-wrap gap-2">
            {character.traits.map((t) => (
              <Chip key={t.en}>{t.en}</Chip>
            ))}
          </div>

          <Ornament width={120} className="mt-10 mb-8 opacity-60" />

          <Link href={`/characters/${character.slug}`} className="btn btn-gold self-start">
            Enter {character.name.en}’s world
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
