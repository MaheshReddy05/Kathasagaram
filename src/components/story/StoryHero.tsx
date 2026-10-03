import { BookOpen, ChevronLeft, Clock3, Headphones, Languages } from "lucide-react";
import Link from "next/link";
import { ArtImage } from "@/components/ui/ArtImage";
import { Star } from "@/components/ui/Ornament";
import { isDemoAudio } from "@/data/audio";
import type { Character, Collection, StorySummary } from "@/data/types";
import { cn, pad2 } from "@/lib/cn";
import { StoryActions } from "./StoryActions";

/** Art at least this wide is shown full-bleed; smaller art is framed over a blurred backdrop. */
const FULL_BLEED_MIN_WIDTH = 1400;

interface StoryHeroProps {
  story: StorySummary;
  character: Character;
  collection: Collection;
}

export function StoryHero({ story, character, collection }: StoryHeroProps) {
  const fullBleed = story.artwork.width >= FULL_BLEED_MIN_WIDTH;
  const audio = story.audio.en;

  return (
    <section className="relative isolate overflow-hidden">
      {/* Backdrop */}
      <div aria-hidden className="absolute inset-0 -z-10">
        {fullBleed ? (
          <ArtImage artwork={story.artwork} sizes="100vw" priority className="animate-settle absolute inset-0" />
        ) : (
          <ArtImage artwork={story.artwork} sizes="40vw" className="absolute inset-0 scale-125 opacity-60 blur-[60px] saturate-[1.2]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/20 to-transparent" />
      </div>

      <div className="shell grid min-h-[min(100svh,54rem)] items-end gap-7 pt-20 pb-14 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-center md:pt-28 md:pb-20">
        {!fullBleed && (
          <div className="animate-rise relative mx-auto w-full max-w-[11.5rem] md:order-2 md:max-w-[24rem]">
            <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-[radial-gradient(closest-side,rgb(201_163_91/0.25),transparent)]" />
            <ArtImage
              artwork={story.artwork}
              sizes="(min-width: 768px) 384px, 304px"
              priority
              className="aspect-[4/5] w-full rounded-[1.75rem] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.9)] ring-1 ring-gold/25"
            />
          </div>
        )}

        <div className={cn("md:order-1", fullBleed && "md:col-span-1")}>
          <Link
            href={`/characters/${character.slug}#stories`}
            className="animate-rise mb-5 inline-flex md:mb-7 items-center gap-1 text-xs text-ivory/55 transition-colors hover:text-gold-soft"
          >
            <ChevronLeft className="size-3.5" />
            {character.possessive.en} stories
          </Link>

          <p className="eyebrow animate-rise" style={{ animationDelay: "0.05s" }}>
            {collection.title.en}
          </p>
          <p
            className="animate-rise mt-2 flex items-center gap-2.5 text-[0.75rem] tracking-[0.24em] text-ivory/60 uppercase"
            style={{ animationDelay: "0.1s" }}
          >
            {character.name.en} <Star className="size-2 text-gold/60" /> Story {pad2(story.number)}
          </p>

          <h1
            className="animate-rise mt-5 font-display text-[2.75rem] leading-[0.95] font-medium text-balance text-ivory xs:text-[3.25rem] sm:text-[4.5rem] lg:text-[5.25rem]"
            style={{ animationDelay: "0.18s" }}
          >
            {story.title.en}
          </h1>
          <p className="te animate-rise mt-3 text-[1.35rem] text-gold-soft/85 sm:text-[1.6rem]" style={{ animationDelay: "0.24s" }}>
            {story.title.te}
          </p>

          <p
            className="animate-rise mt-5 max-w-[34rem] font-display text-[1.2rem] leading-snug text-ivory/80 italic sm:text-[1.45rem]"
            style={{ animationDelay: "0.3s" }}
          >
            {story.description.en}
          </p>

          <ul
            className="animate-rise mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[0.8125rem] text-ivory/55"
            style={{ animationDelay: "0.36s" }}
          >
            <li className="inline-flex items-center gap-1.5">
              <Clock3 className="size-3.5 text-gold/70" /> {story.readingMinutes.en} min read
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Headphones className="size-3.5 text-gold/70" />
              {isDemoAudio(audio) ? "Audio preview" : "Narrated"}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Languages className="size-3.5 text-gold/70" /> English · <span className="te">తెలుగు</span>
            </li>
          </ul>

          <StoryActions storyId={story.id} slug={story.slug} className="animate-rise mt-8 max-w-[34rem]" />
        </div>
      </div>
    </section>
  );
}

export function OpeningLines({ text, slug }: { text: string; slug: string }) {
  return (
    <div className="relative">
      <p className="font-read text-[1.2rem] leading-[1.85] text-ivory/80 first-letter:float-left first-letter:pt-1 first-letter:pr-3 first-letter:font-display first-letter:text-[4.2rem] first-letter:leading-[0.8] first-letter:text-gold sm:text-[1.3rem]">
        {text}
      </p>
      <Link href={`/stories/${slug}/read`} className="group mt-6 inline-flex items-center gap-2 text-sm text-gold-soft">
        <BookOpen className="size-4" />
        Continue reading
        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </Link>
    </div>
  );
}
