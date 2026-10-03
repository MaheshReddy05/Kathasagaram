import type { Collection } from "@/data/types";
import { cn } from "@/lib/cn";

/**
 * Original fiction gets its own visual language — colder, starlit indigo and
 * turquoise, ember label — so it never reads as traditional mythology.
 */
export function OriginalsTeaser({ collection, className }: { collection: Collection; className?: string }) {
  return (
    <article
      aria-label={`${collection.title.en} — original fiction, coming soon`}
      className={cn(
        "relative isolate overflow-hidden rounded-[1.75rem] border border-turquoise/15 bg-[linear-gradient(140deg,#0c1433_0%,#0a1628_45%,#061a22_100%)] p-7 sm:p-10",
        className,
      )}
    >
      {/* Starfield + orbit */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 12% 18%, rgb(255 255 255 / 0.7), transparent 60%), radial-gradient(1px 1px at 78% 12%, rgb(255 255 255 / 0.55), transparent 60%), radial-gradient(1.5px 1.5px at 64% 42%, rgb(95 195 181 / 0.9), transparent 60%), radial-gradient(1px 1px at 30% 70%, rgb(255 255 255 / 0.45), transparent 60%), radial-gradient(1px 1px at 88% 78%, rgb(255 255 255 / 0.6), transparent 60%), radial-gradient(1px 1px at 46% 88%, rgb(255 255 255 / 0.4), transparent 60%), radial-gradient(1px 1px at 92% 46%, rgb(255 255 255 / 0.5), transparent 60%)",
        }}
      />
      <svg aria-hidden viewBox="0 0 400 400" className="absolute -right-24 -bottom-28 -z-10 size-[26rem] text-turquoise/25 sm:-right-10">
        <circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" strokeWidth="0.75" />
        <circle cx="200" cy="200" r="110" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 6" />
        <circle cx="200" cy="200" r="70" fill="none" stroke="currentColor" strokeWidth="0.75" />
        {Array.from({ length: 24 }, (_, i) => {
          const a = (i / 24) * Math.PI * 2;
          return (
            <line
              key={i}
              x1={200 + Math.cos(a) * 150}
              y1={200 + Math.sin(a) * 150}
              x2={200 + Math.cos(a) * (i % 3 === 0 ? 132 : 142)}
              y2={200 + Math.sin(a) * (i % 3 === 0 ? 132 : 142)}
              stroke="currentColor"
              strokeWidth="0.75"
            />
          );
        })}
        <circle cx="350" cy="200" r="3" fill="rgb(217 138 78)" />
      </svg>

      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-ember/60 px-3 py-1 text-[0.625rem] font-medium tracking-[0.24em] text-ember uppercase">
          Original fiction
        </span>
        <span className="text-[0.625rem] tracking-[0.24em] text-turquoise/80 uppercase">Coming soon</span>
      </div>

      <h3 className="mt-6 max-w-md font-display text-[2.4rem] leading-[1.02] font-medium text-[#e8eef5] sm:text-[3rem]">
        {collection.title.en}
      </h3>
      <p className="te mt-2 text-lg text-turquoise/70">{collection.title.te}</p>

      <div className="mt-6 max-w-sm space-y-1 font-display text-[1.2rem] leading-snug text-[#c9d4e2]/80 italic">
        <p>Some names are not meant to end.</p>
        <p>Some deaths are not written.</p>
        <p>{collection.tagline}</p>
      </div>
    </article>
  );
}
