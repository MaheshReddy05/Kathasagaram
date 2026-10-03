"use client";

import { motion } from "motion/react";
import { useId } from "react";
import type { Lang } from "@/data/types";
import { cn } from "@/lib/cn";

const OPTIONS: { value: Lang; label: string; long: string }[] = [
  { value: "en", label: "EN", long: "English" },
  { value: "te", label: "తె", long: "తెలుగు" },
];

interface LanguageToggleProps {
  value: Lang;
  onChange: (lang: Lang) => void;
  /** "long" shows English / తెలుగు, "short" shows EN / తె. */
  variant?: "short" | "long";
  className?: string;
  /** Use the reader's theme variables instead of the app palette. */
  themed?: boolean;
  label?: string;
}

/** English ↔ తెలుగు segmented control with a sliding indicator. */
export function LanguageToggle({
  value,
  onChange,
  variant = "short",
  className,
  themed,
  label = "Story language",
}: LanguageToggleProps) {
  const id = useId();
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        "relative inline-flex items-center rounded-full p-1",
        themed ? "border border-[var(--r-faint)]" : "border border-ivory/12 bg-abyss/40",
        className,
      )}
    >
      {OPTIONS.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={opt.long}
            onClick={() => onChange(opt.value)}
            className={cn(
              "relative z-10 grid h-8 place-items-center rounded-full text-[0.8125rem] font-medium transition-colors duration-300",
              variant === "long" ? "min-w-[5.25rem] px-3.5" : "min-w-[2.75rem] px-2.5",
              opt.value === "te" && "te-sans text-[0.95rem]",
              active
                ? themed
                  ? "text-[var(--r-bg)]"
                  : "text-abyss"
                : themed
                  ? "text-[var(--r-muted)] hover:text-[var(--r-fg)]"
                  : "text-ivory/60 hover:text-ivory",
            )}
          >
            {active && (
              <motion.span
                layoutId={`lang-${id}`}
                className={cn(
                  "absolute inset-0 -z-10 rounded-full",
                  themed ? "bg-[var(--r-accent)]" : "bg-gradient-to-b from-[#ecd39d] to-[#c99f58]",
                )}
                transition={{ type: "spring", stiffness: 420, damping: 36 }}
              />
            )}
            {variant === "long" ? opt.long : opt.label}
          </button>
        );
      })}
    </div>
  );
}
