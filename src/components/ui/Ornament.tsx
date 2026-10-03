import { cn } from "@/lib/cn";

/**
 * The divider from the Kathasagaram logo: two hairlines meeting a four-point
 * star. Used sparingly — between major movements, never as decoration.
 */
export function Ornament({ className, width = 160 }: { className?: string; width?: number }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 160 16"
      width={width}
      height={(width / 160) * 16}
      className={cn("text-gold", className)}
      fill="none"
    >
      <path d="M0 8h66" stroke="currentColor" strokeOpacity="0.5" strokeWidth="0.75" />
      <path d="M94 8h66" stroke="currentColor" strokeOpacity="0.5" strokeWidth="0.75" />
      <path d="M80 1.5 82.2 5.8 86.5 8 82.2 10.2 80 14.5 77.8 10.2 73.5 8 77.8 5.8Z" fill="currentColor" />
      <circle cx="68.5" cy="8" r="1" fill="currentColor" fillOpacity="0.7" />
      <circle cx="91.5" cy="8" r="1" fill="currentColor" fillOpacity="0.7" />
    </svg>
  );
}

/** A single four-point star, for inline marks. */
export function Star({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 12 12" className={cn("size-2.5 text-gold", className)}>
      <path d="M6 0 7.6 4.4 12 6 7.6 7.6 6 12 4.4 7.6 0 6 4.4 4.4Z" fill="currentColor" />
    </svg>
  );
}
