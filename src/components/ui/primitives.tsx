import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { Ornament } from "./Ornament";

/** Thin progress line. `value` is 0–1. */
export function ProgressBar({ value, className, label }: { value: number; className?: string; label?: string }) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      className={cn("h-[3px] overflow-hidden rounded-full bg-ivory/12", className)}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-soft transition-[width] duration-700 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  telugu?: string;
  action?: { href: string; label: string };
  className?: string;
  align?: "left" | "center";
  id?: string;
}

export function SectionHeading({ eyebrow, title, telugu, action, className, align = "left", id }: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex gap-6",
        align === "center" ? "flex-col items-center text-center" : "items-end justify-between",
        className,
      )}
    >
      <div className={cn(align === "center" && "flex flex-col items-center")}>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 id={id} className="font-display text-[2rem] leading-[1.05] font-medium text-ivory sm:text-[2.6rem]">
          {title}
          {telugu && (
            <span className="te ml-3 align-middle text-[0.95rem] font-normal text-gold-soft/70 sm:text-lg">{telugu}</span>
          )}
        </h2>
      </div>
      {action && (
        <Link
          href={action.href}
          className="group hidden shrink-0 items-center gap-2 pb-1.5 text-sm text-ivory/60 transition-colors hover:text-gold-soft sm:inline-flex"
        >
          {action.label}
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  body: string;
  action?: { href: string; label: string };
  className?: string;
  compact?: boolean;
}

export function EmptyState({ title, body, action, className, compact }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center overflow-hidden rounded-3xl border border-dashed border-ivory/12 text-center",
        compact ? "px-6 py-10" : "px-6 py-16 sm:py-20",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_0%,rgb(17_80_76/0.25),transparent_70%)]"
      />
      <Ornament width={110} className="relative mb-6 opacity-80" />
      <h3 className="relative font-display text-2xl font-medium text-ivory sm:text-[1.75rem]">{title}</h3>
      <p className="relative mt-2 max-w-sm text-[0.9375rem] leading-relaxed text-ivory/55">{body}</p>
      {action && (
        <Link href={action.href} className="btn btn-ghost relative mt-7">
          {action.label}
          <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  );
}

/** Small pill used for traits and metadata. */
export function Chip({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-8 items-center rounded-full border border-gold/30 bg-gold/[0.06] px-3.5 text-[0.8125rem] text-gold-soft/90",
        className,
      )}
    >
      {children}
    </span>
  );
}
