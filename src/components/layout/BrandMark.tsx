import Image from "next/image";
import Link from "next/link";
import { brandAssets } from "@/data/assets";
import { cn } from "@/lib/cn";

/**
 * Header lockup: the logo emblem (cropped to its sun-and-temple centre) with
 * the wordmark set in type. Swap /images/brand/logo-mark.webp to update.
 */
export function BrandMark({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <Link href="/" aria-label="Kathasagaram — home" className={cn("group flex items-center gap-3", className)}>
      <span className="relative size-10 shrink-0 overflow-hidden rounded-full ring-1 ring-gold/25 transition-shadow duration-500 group-hover:ring-gold/50 sm:size-11">
        <Image
          src={brandAssets.logoMark.src}
          alt=""
          fill
          sizes="44px"
          className="scale-[1.65] object-cover"
          style={{ objectPosition: "54% 40%" }}
          priority
        />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.45rem] font-semibold tracking-[0.01em] text-ivory sm:text-[1.6rem]">
          Kathasagaram
        </span>
        {!compact && <span className="te mt-1 text-[0.75rem] text-gold-soft/80">కథాసాగరం</span>}
      </span>
    </Link>
  );
}
