import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { ListenButton } from "@/components/story/StoryActions";
import { ArtImage } from "@/components/ui/ArtImage";
import { Chip } from "@/components/ui/primitives";
import type { Character, StorySummary } from "@/data/types";

export function CharacterHero({ character, firstStory }: { character: Character; firstStory: StorySummary }) {
  return (
    <section className="relative isolate flex min-h-[92svh] flex-col justify-end overflow-hidden md:min-h-[min(94svh,56rem)]">
      <div className="absolute inset-0 -z-10">
        <div className="animate-settle absolute inset-0">
          <ArtImage artwork={character.artwork.hero} sizes="100vw" priority className="absolute inset-0" focus="74% 20%" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/10" />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-ink/90 via-ink/30 to-transparent md:block" />
      </div>

      <div className="shell pt-28 pb-12 md:pb-20">
        <nav aria-label="Breadcrumb" className="animate-rise mb-6 flex items-center gap-1.5 text-xs text-ivory/50">
          <Link href="/explore" className="hover:text-gold-soft">
            Explore
          </Link>
          <ChevronRight className="size-3" />
          <Link href="/explore#mahabharata" className="hover:text-gold-soft">
            Mahabharata
          </Link>
          <ChevronRight className="size-3" />
          <span className="text-ivory/80">{character.name.en}</span>
        </nav>

        <h1 className="animate-rise" style={{ animationDelay: "0.1s" }}>
          <span className="gold-text block font-display text-[5.25rem] leading-[0.85] font-medium tracking-[-0.02em] sm:text-[8rem] lg:text-[9.5rem]">
            {character.name.en}
          </span>
          <span className="mt-3 flex items-baseline gap-4">
            <span className="te text-[2rem] text-gold-soft sm:text-[2.6rem]">{character.name.te}</span>
            <span className="font-display text-xl text-ivory/50 italic">{character.transliteration}</span>
          </span>
        </h1>

        <p
          className="animate-rise mt-6 text-[0.75rem] tracking-[0.2em] text-ivory/75 uppercase sm:text-[0.8125rem]"
          style={{ animationDelay: "0.2s" }}
        >
          {character.titles.join("  ·  ")}
        </p>

        <p className="animate-rise mt-5 max-w-xl text-[1rem] leading-relaxed text-ivory/65 sm:text-[1.0625rem]" style={{ animationDelay: "0.3s" }}>
          {character.intro}
        </p>

        <div className="animate-rise mt-6 flex flex-wrap gap-2" style={{ animationDelay: "0.38s" }}>
          {character.traits.map((t) => (
            <Chip key={t.en}>
              {t.en}
              <span className="te ml-2 text-[0.75rem] text-gold-soft/55">{t.te}</span>
            </Chip>
          ))}
        </div>

        <div className="animate-rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: "0.46s" }}>
          <Link href={`/stories/${firstStory.slug}`} className="btn btn-gold flex-1 xs:flex-none">
            Begin with Story 01
          </Link>
          <ListenButton storyId={firstStory.id} slug={firstStory.slug} label="Listen" className="min-w-[9rem] flex-1 xs:flex-none" />
        </div>
      </div>
    </section>
  );
}
