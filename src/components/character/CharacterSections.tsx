import { ArtImage } from "@/components/ui/ArtImage";
import { Ornament } from "@/components/ui/Ornament";
import { SectionHeading } from "@/components/ui/primitives";
import type { Character, IdentityFact } from "@/data/types";
import { cn } from "@/lib/cn";

/* ---------- Who is … ---------- */

export function AboutSection({ character }: { character: Character }) {
  const [first, ...rest] = character.about;
  return (
    <section id="overview" className="shell scroll-mt-36 pt-20 sm:pt-28">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-20">
        <div>
          <SectionHeading eyebrow="Overview" title={`Who is ${character.name.en}?`} telugu={`${character.name.te} ఎవరు?`} />
          <div className="mt-10 max-w-[40rem] space-y-6 font-read text-[1.125rem] leading-[1.8] text-ivory/80 sm:text-[1.1875rem]">
            <p className="text-[1.3rem] leading-[1.65] text-ivory/90 first-letter:float-left first-letter:pt-1 first-letter:pr-3 first-letter:font-display first-letter:text-[4.4rem] first-letter:leading-[0.8] first-letter:text-gold sm:text-[1.4rem]">
              {first}
            </p>
            {rest.map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
          </div>
        </div>

        <figure className="relative mx-auto w-full max-w-[20rem] lg:sticky lg:top-40 lg:self-start">
          <div className="relative overflow-hidden rounded-[999px_999px_1.5rem_1.5rem] ring-1 ring-gold/25">
            <ArtImage artwork={character.artwork.figure} sizes="320px" className="aspect-[5/11] w-full max-h-[34rem]" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
          </div>
          <figcaption className="mt-4 text-center text-xs tracking-wide text-ivory/40">{character.artwork.figure.alt}</figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ---------- Identity ---------- */

const GROUPS: { key: IdentityFact["group"]; title: string; telugu: string }[] = [
  { key: "origin", title: "Born of", telugu: "జన్మ" },
  { key: "upbringing", title: "Raised & taught by", telugu: "పెంపకం" },
  { key: "path", title: "His path", telugu: "మార్గం" },
];

export function IdentitySection({ character }: { character: Character }) {
  return (
    <section id="identity" className="shell scroll-mt-36 pt-24 sm:pt-32">
      <SectionHeading eyebrow="Identity" title="Lineage & allegiance" telugu="వంశం · బంధం" />
      <div className="mt-10 grid overflow-hidden rounded-[1.75rem] border border-ivory/[0.08] bg-gradient-to-b from-deep/80 to-ink md:grid-cols-3">
        {GROUPS.map((group, gi) => (
          <div key={group.key} className={cn("relative p-7 sm:p-9", gi > 0 && "border-t border-ivory/[0.08] md:border-t-0 md:border-l")}>
            <p className="flex items-baseline gap-2">
              <span className="eyebrow text-ivory/45">{group.title}</span>
              <span className="te text-xs text-gold/60">{group.telugu}</span>
            </p>
            <dl className="mt-6 space-y-7">
              {character.identity
                .filter((f) => f.group === group.key)
                .map((fact) => (
                  <div key={fact.id}>
                    <dt className="text-[0.6875rem] tracking-[0.2em] text-gold/80 uppercase">{fact.label}</dt>
                    <dd className="mt-1.5 font-display text-[1.9rem] leading-tight text-ivory">{fact.value.en}</dd>
                    <dd className="te mt-0.5 text-[0.95rem] text-ivory/45">{fact.value.te}</dd>
                  </div>
                ))}
            </dl>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Emblems ---------- */

export function EmblemsSection({ character }: { character: Character }) {
  return (
    <section className="shell pt-24 sm:pt-32" aria-labelledby="emblems-heading">
      <SectionHeading id="emblems-heading" eyebrow="Divine gifts" title="Born with the Sun" telugu="సూర్యుని వరాలు" />
      <ul className="mt-10 grid gap-4 sm:grid-cols-3 sm:gap-5">
        {character.emblems.map((e) => (
          <li key={e.id} className="group surface overflow-hidden rounded-[1.5rem]">
            <ArtImage artwork={e.artwork} sizes="(min-width: 640px) 33vw, 100vw" zoom className="aspect-[4/3] w-full" />
            <div className="p-6">
              <p className="text-[0.6875rem] tracking-[0.2em] text-gold/80 uppercase">{e.kind}</p>
              <h3 className="mt-2 flex items-baseline gap-3">
                <span className="font-display text-[2rem] leading-none text-ivory">{e.name.en}</span>
                <span className="te text-base text-gold-soft/70">{e.name.te}</span>
              </h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ivory/60">{e.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------- Names & titles ---------- */

export function NamesSection({ character }: { character: Character }) {
  const [primary, ...others] = character.names;
  return (
    <section id="names" className="shell scroll-mt-36 pt-24 sm:pt-32">
      <SectionHeading eyebrow="Names & titles" title="One man, many names" telugu="నామాలు · బిరుదులు" />
      <ul className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-[1.75rem] border border-ivory/[0.08] bg-ivory/[0.08] xs:grid-cols-2 lg:grid-cols-4">
        <li className="relative flex flex-col justify-between bg-gradient-to-br from-peacock to-deep p-7 xs:col-span-2 sm:p-9">
          <Ornament width={96} className="opacity-70" />
          <div className="mt-10">
            <p className="te text-[3.25rem] leading-none text-gold-soft sm:text-[4rem]">{primary.script}</p>
            <p className="mt-3 font-display text-[2rem] text-ivory">{primary.name}</p>
            <p className="mt-1 text-sm text-ivory/55">{primary.meaning}</p>
          </div>
        </li>
        {others.map((n) => (
          <li key={n.id} className="group bg-ink p-7 transition-colors duration-500 hover:bg-deep">
            <p className="te text-[1.75rem] leading-tight text-gold-soft/90 transition-colors duration-500 group-hover:text-gold-soft">
              {n.script}
            </p>
            <p className="mt-3 font-display text-[1.6rem] leading-none text-ivory">{n.name}</p>
            <p className="mt-3 text-[0.875rem] leading-relaxed text-ivory/50">{n.meaning}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
