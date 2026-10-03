import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ArtImage } from "@/components/ui/ArtImage";
import type { Character, Relationship, RelationshipKind } from "@/data/types";
import { cn } from "@/lib/cn";

const KIND_STYLE: Record<RelationshipKind, { ring: string; text: string; glyph: string }> = {
  family: { ring: "ring-gold/60", text: "text-gold-soft", glyph: "text-gold-soft" },
  foster: { ring: "ring-bronze/70", text: "text-[#d9a873]", glyph: "text-[#e2b886]" },
  bond: { ring: "ring-turquoise/50", text: "text-turquoise", glyph: "text-turquoise" },
  guru: { ring: "ring-ivory/40", text: "text-ivory/80", glyph: "text-ivory" },
  rival: { ring: "ring-ember/60", text: "text-ember", glyph: "text-ember" },
};

const GROUPS: { title: string; kinds: RelationshipKind[] }[] = [
  { title: "Blood", kinds: ["family"] },
  { title: "Raised by", kinds: ["foster"] },
  { title: "Bonds", kinds: ["bond", "guru"] },
  { title: "Rivalry", kinds: ["rival"] },
];

/** First Telugu syllable, e.g. "సూర్యుడు" → "సూ", for the medallion. */
function akshara(name: string): string {
  const seg = new Intl.Segmenter("te", { granularity: "grapheme" });
  return seg.segment(name)[Symbol.iterator]().next().value?.segment ?? name.slice(0, 1);
}

function Monogram({ person, size = "md" }: { person: Relationship; size?: "md" | "lg" }) {
  const k = KIND_STYLE[person.kind];
  return (
    <span
      aria-hidden
      className={cn(
        "relative grid shrink-0 place-items-center rounded-full bg-[radial-gradient(circle_at_30%_25%,rgb(243_233_214/0.12),rgb(4_21_22/0.9))] ring-1",
        k.ring,
        size === "lg" ? "size-16" : "size-14",
      )}
    >
      <span className={cn("te text-[1.35rem] leading-none", k.glyph)}>{akshara(person.name.te)}</span>
      <span className="absolute inset-1 rounded-full border border-ivory/[0.06]" />
    </span>
  );
}

function RelationshipCard({ person, align = "left" }: { person: Relationship; align?: "left" | "right" }) {
  const k = KIND_STYLE[person.kind];
  const Inner = (
    <>
      <Monogram person={person} />
      <div className="min-w-0 flex-1">
        <p className={cn("text-[0.625rem] font-medium tracking-[0.22em] uppercase", k.text)}>{person.relation.en}</p>
        <p className="mt-1 flex items-baseline gap-2">
          <span className="font-display text-[1.5rem] leading-none text-ivory">{person.name.en}</span>
          <span className="te text-[0.8125rem] text-ivory/45">{person.name.te}</span>
        </p>
        <p className="mt-2 text-[0.875rem] leading-relaxed text-ivory/55">{person.summary}</p>
      </div>
      {person.storySlug && (
        <ArrowUpRight className="size-4 shrink-0 self-start text-ivory/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold-soft" />
      )}
    </>
  );
  const cls = cn(
    "group surface relative flex gap-4 rounded-2xl p-4 transition-[border-color,transform] duration-500 sm:p-5",
    person.storySlug && "hover:border-gold/30 lg:hover:-translate-y-0.5",
    align === "right" && "lg:flex-row-reverse lg:text-right",
  );
  return person.storySlug ? (
    <Link href={`/stories/${person.storySlug}`} className={cls} aria-label={`${person.name.en}, ${person.relation.en} — read their story with Karna`}>
      {Inner}
    </Link>
  ) : (
    <div className={cls}>{Inner}</div>
  );
}

type Group = { title: string; people: Relationship[] };

function Column({ items, align }: { items: Group[]; align: "left" | "right" }) {
  return (
    <div className="flex flex-col gap-8">
      {items.map((g) => (
        <div key={g.title}>
          <p className={cn("eyebrow mb-3 text-ivory/40", align === "right" && "lg:text-right")}>{g.title}</p>
          <div className="flex flex-col gap-3">
            {g.people.map((p) => (
              <RelationshipCard key={p.id} person={p} align={align} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Relationship constellation: the character at the centre, the people who
 * shaped them gathered around by kind. A card system, not a graph — it stays
 * readable on any screen.
 */
export function Relationships({ character }: { character: Character }) {
  const groups = GROUPS.map((g) => ({ ...g, people: character.relationships.filter((r) => g.kinds.includes(r.kind)) })).filter(
    (g) => g.people.length > 0,
  );
  const left = groups.slice(0, 2);
  const right = groups.slice(2);

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_17rem_minmax(0,1fr)] lg:gap-8">
      {/* Centre medallion — first on mobile, centre column on desktop */}
      <div className="relative mx-auto grid size-56 place-items-center lg:order-2 lg:size-[17rem]">
        <svg aria-hidden viewBox="0 0 200 200" className="absolute inset-0 size-full text-gold/30">
          <circle cx="100" cy="100" r="98" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 5" />
          <circle cx="100" cy="100" r="86" fill="none" stroke="currentColor" strokeWidth="0.6" />
          {Array.from({ length: 7 }, (_, i) => {
            const a = (i / 7) * Math.PI * 2 - Math.PI / 2;
            return <circle key={i} cx={100 + Math.cos(a) * 98} cy={100 + Math.sin(a) * 98} r="2" fill="currentColor" fillOpacity="1" />;
          })}
        </svg>
        <div className="relative size-[74%] overflow-hidden rounded-full ring-2 ring-gold/50 shadow-[0_0_80px_-10px_rgb(201_163_91/0.45)]">
          <ArtImage artwork={character.artwork.portrait} sizes="200px" className="absolute inset-0" focus="50% 18%" />
        </div>
        <p className="absolute -bottom-3 rounded-full border border-gold/40 bg-ink px-4 py-1 font-display text-lg text-ivory">
          {character.name.en} <span className="te text-sm text-gold-soft/80">{character.name.te}</span>
        </p>
      </div>

      <div className="lg:order-1">
        <Column items={left} align="right" />
      </div>
      <div className="lg:order-3">
        <Column items={right} align="left" />
      </div>
    </div>
  );
}
