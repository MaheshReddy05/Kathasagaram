"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Horizontal, scroll-snapping rail. Touch users swipe; pointer users get
 * paging arrows. Children should be fixed-width items.
 */
export function StoryRail({ children, label, className }: { children: React.ReactNode; label: string; className?: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  const page = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <div className={cn("group/rail relative", className)}>
      <ul
        ref={ref}
        onScroll={measure}
        aria-label={label}
        className="no-scrollbar flex snap-x snap-mandatory scroll-px-[var(--gutter)] gap-4 overflow-x-auto px-[var(--gutter)] pb-2 sm:gap-5"
      >
        {children}
      </ul>
      {(["prev", "next"] as const).map((dir) => {
        const hidden = dir === "prev" ? edges.start : edges.end;
        return (
          <button
            key={dir}
            type="button"
            aria-label={dir === "prev" ? "Scroll back" : "Scroll forward"}
            onClick={() => page(dir === "prev" ? -1 : 1)}
            className={cn(
              "glass absolute top-[38%] z-10 hidden size-12 -translate-y-1/2 place-items-center rounded-full border border-ivory/15 text-ivory transition-all duration-300 hover:border-gold/50 hover:text-gold-soft md:grid",
              dir === "prev" ? "left-4" : "right-4",
              hidden ? "pointer-events-none opacity-0" : "opacity-0 group-hover/rail:opacity-100",
            )}
          >
            {dir === "prev" ? <ChevronLeft className="size-5" /> : <ChevronRight className="size-5" />}
          </button>
        );
      })}
    </div>
  );
}

export function RailItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return <li className={cn("w-[68vw] max-w-[17.5rem] shrink-0 snap-start sm:w-[15rem]", className)}>{children}</li>;
}
