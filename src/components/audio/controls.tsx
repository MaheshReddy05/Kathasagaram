"use client";

import { LoaderCircle, Pause, Play } from "lucide-react";
import { cn } from "@/lib/cn";

/** Circular arrow with the skip interval inside — the familiar audiobook glyph. */
export function SkipIcon({ direction, seconds = 15, className }: { direction: "back" | "forward"; seconds?: number; className?: string }) {
  const back = direction === "back";
  return (
    <svg viewBox="0 0 32 32" className={cn("size-7", className)} fill="none" aria-hidden>
      <path
        d={back ? "M9.2 9.6A10 10 0 1 1 6 16.5" : "M22.8 9.6A10 10 0 1 0 26 16.5"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d={back ? "M9.6 4.6 9.2 9.6l5 .6" : "M22.4 4.6l.4 5-5 .6"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="16"
        y="20.2"
        textAnchor="middle"
        fontSize="9"
        fontWeight="600"
        fill="currentColor"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {seconds}
      </text>
    </svg>
  );
}

interface PlayPauseProps {
  isPlaying: boolean;
  isLoading?: boolean;
  onClick: () => void;
  size?: "sm" | "lg";
  className?: string;
  disabled?: boolean;
}

export function PlayPauseButton({ isPlaying, isLoading, onClick, size = "sm", className, disabled }: PlayPauseProps) {
  const large = size === "lg";
  const iconCls = large ? "size-8" : "size-[1.15rem]";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isPlaying ? "Pause" : "Play"}
      className={cn(
        "grid shrink-0 place-items-center rounded-full transition-transform duration-300 active:scale-95 disabled:opacity-40",
        large
          ? "size-[4.75rem] bg-gradient-to-b from-[#f0d9a6] via-[#d6b16b] to-[#b88d48] text-[#1d1406] shadow-[0_18px_40px_-14px_rgb(228_200_143/0.7),inset_0_1px_0_rgb(255_255_255/0.5)]"
          : "size-11 bg-ivory text-abyss hover:bg-gold-soft",
        className,
      )}
    >
      {isLoading && isPlaying ? (
        <LoaderCircle className={cn(iconCls, "animate-spin")} />
      ) : isPlaying ? (
        <Pause className={iconCls} fill="currentColor" strokeWidth={0} />
      ) : (
        <Play className={cn(iconCls, "translate-x-[1.5px]")} fill="currentColor" strokeWidth={0} />
      )}
    </button>
  );
}

/** Three animated bars shown beside the currently playing story. */
export function Equalizer({ active, className }: { active: boolean; className?: string }) {
  return (
    <span aria-hidden className={cn("inline-flex h-3.5 items-end gap-[2px]", className)}>
      {[0, 0.25, 0.5].map((delay) => (
        <span
          key={delay}
          className="w-[2.5px] origin-bottom rounded-full bg-gold-soft"
          style={{
            height: "100%",
            animation: active ? `eq 0.9s ease-in-out ${delay}s infinite` : undefined,
            transform: active ? undefined : "scaleY(0.35)",
          }}
        />
      ))}
    </span>
  );
}
