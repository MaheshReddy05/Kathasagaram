"use client";

import { ArrowRight, Check, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { TimelineEvent } from "@/data/types";
import { cn } from "@/lib/cn";
import { useLibrary } from "@/lib/use-library";

interface CharacterTimelineProps {
  events: TimelineEvent[];
  /** Story id per story slug, so nodes can reflect local reading progress. */
  storyIdBySlug?: Record<string, string>;
}

/**
 * A life in moments. Vertical on phones, a horizontal scroll on wider
 * screens. Events with a story link to it; read stories fill their node.
 * Reusable for any character — it only needs TimelineEvent[].
 */
export function CharacterTimeline({ events, storyIdBySlug = {} }: CharacterTimelineProps) {
  const reading = useLibrary("reading");
  const scroller = useRef<HTMLOListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  const status = (e: TimelineEvent) => {
    const id = e.storySlug ? (storyIdBySlug[e.storySlug] ?? e.storySlug) : undefined;
    const p = id ? reading[id]?.progress : undefined;
    return p === undefined ? "unread" : p >= 0.97 ? "read" : "reading";
  };

  const page = (dir: 1 | -1) => scroller.current?.scrollBy({ left: dir * 520, behavior: "smooth" });

  return (
    <div className="relative">
      <div className="absolute -top-16 right-[var(--gutter)] hidden gap-2 md:flex">
        {([-1, 1] as const).map((dir) => (
          <button
            key={dir}
            type="button"
            onClick={() => page(dir)}
            disabled={dir === -1 ? edges.start : edges.end}
            aria-label={dir === -1 ? "Earlier moments" : "Later moments"}
            className="grid size-11 place-items-center rounded-full border border-ivory/15 text-ivory/80 transition-colors hover:border-gold/50 hover:text-gold-soft disabled:opacity-30"
          >
            {dir === -1 ? <ChevronLeft className="size-5" /> : <ChevronRight className="size-5" />}
          </button>
        ))}
      </div>

      <ol
        ref={scroller}
        onScroll={measure}
        className="no-scrollbar relative flex flex-col px-[var(--gutter)] md:snap-x md:snap-mandatory md:scroll-px-[var(--gutter)] md:flex-row md:overflow-x-auto md:pb-4"
      >
        {events.map((event, i) => {
          const s = status(event);
          const newPhase = i === 0 || events[i - 1].phase !== event.phase;
          const last = i === events.length - 1;
          return (
            <li
              key={event.id}
              className="group relative grid grid-cols-[2.75rem_1fr] md:block md:w-[16.5rem] md:shrink-0 md:snap-start md:pr-6"
            >
              {/* Phase label */}
              <p
                className={cn(
                  "col-span-2 pb-3 pl-14 text-[0.625rem] tracking-[0.28em] text-gold/70 uppercase md:h-8 md:pb-0 md:pl-0",
                  !newPhase && "hidden md:block md:invisible",
                  newPhase && i > 0 && "pt-6 md:pt-0",
                )}
              >
                {event.phase}
              </p>

              {/* Rail: vertical on mobile, horizontal on desktop */}
              <span
                aria-hidden
                className={cn(
                  "absolute top-0 bottom-0 left-[1.375rem] w-px bg-gradient-to-b from-gold/40 to-gold/15 md:hidden",
                  i === 0 && "top-10",
                  last && "bottom-auto h-10",
                )}
              />
              <span
                aria-hidden
                className={cn(
                  "absolute top-[3.375rem] hidden h-px bg-gradient-to-r from-gold/45 to-gold/20 md:block",
                  i === 0 ? "left-[1.375rem]" : "left-0",
                  last ? "right-auto w-[1.375rem]" : "right-0",
                )}
              />

              {/* Node */}
              <span className="relative z-10 flex justify-center md:mt-3 md:block md:w-11">
                <span
                  className={cn(
                    "grid size-11 place-items-center rounded-full border font-display text-base transition-all duration-500",
                    s === "read"
                      ? "border-gold bg-gold text-abyss"
                      : s === "reading"
                        ? "border-gold bg-ink text-gold-soft shadow-[0_0_0_4px_rgb(201_163_91/0.15)]"
                        : "border-gold/40 bg-ink text-ivory/70 group-hover:border-gold group-hover:text-gold-soft",
                  )}
                >
                  {s === "read" ? <Check className="size-4" strokeWidth={2.5} /> : i + 1}
                </span>
              </span>

              <TimelineBody event={event} status={s} />
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function TimelineBody({ event, status }: { event: TimelineEvent; status: "read" | "reading" | "unread" }) {
  const content = (
    <>
      <h3 className="font-display text-[1.5rem] leading-tight text-ivory transition-colors group-hover:text-gold-soft">
        {event.title.en}
      </h3>
      <p className="te mt-0.5 text-[0.875rem] text-ivory/45">{event.title.te}</p>
      <p className="mt-2.5 text-[0.9rem] leading-relaxed text-ivory/60 md:pr-2">{event.summary}</p>
      {event.storySlug && (
        <span className="mt-3 inline-flex items-center gap-1.5 text-[0.8125rem] text-gold-soft/85">
          {status === "read" ? "Read again" : status === "reading" ? "Continue the story" : "Read the story"}
          <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      )}
    </>
  );
  const cls = "mb-8 block rounded-2xl pt-1 pl-3 md:mt-5 md:mb-0 md:pl-0";
  return event.storySlug ? (
    <Link
      href={`/stories/${event.storySlug}`}
      className={cn(cls, "transition-transform duration-500 ease-[var(--ease-out-soft)] md:group-hover:-translate-y-1")}
    >
      {content}
    </Link>
  ) : (
    <div className={cls}>{content}</div>
  );
}
