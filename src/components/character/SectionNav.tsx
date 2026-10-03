"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/** Sticky in-page navigation that tracks the section in view. */
export function SectionNav({ sections }: { sections: { id: string; label: string }[] }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav aria-label="On this page" className="glass sticky top-[calc(4rem+env(safe-area-inset-top))] z-30 border-y border-ivory/[0.07] sm:top-[calc(4.5rem+env(safe-area-inset-top))]">
      <ul className="no-scrollbar shell flex gap-1 overflow-x-auto">
        {sections.map((s) => (
          <li key={s.id} className="shrink-0">
            <a
              href={`#${s.id}`}
              aria-current={active === s.id ? "true" : undefined}
              className={cn(
                "relative block px-3.5 py-3.5 text-[0.8125rem] tracking-wide transition-colors duration-300",
                active === s.id ? "text-gold-soft" : "text-ivory/55 hover:text-ivory",
              )}
            >
              {s.label}
              {active === s.id && (
                <motion.span layoutId="section-nav" className="absolute inset-x-3.5 bottom-0 h-[2px] rounded-full bg-gold" />
              )}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
