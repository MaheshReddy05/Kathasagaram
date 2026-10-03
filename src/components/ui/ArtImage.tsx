"use client";

import Image from "next/image";
import { useState } from "react";
import type { Artwork } from "@/data/types";
import { cn } from "@/lib/cn";

interface ArtImageProps {
  artwork: Artwork;
  /** next/image `sizes` — describe the rendered width so the right file is chosen. */
  sizes: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  /** Overrides the artwork's own focal point. */
  focus?: string;
  /** Adds the gentle hover zoom used by cards (requires a `group` ancestor). */
  zoom?: boolean;
}

/**
 * The one container for every piece of artwork: portrait characters,
 * landscape story art, thumbnails and full-bleed heroes. It fills its parent,
 * shows a tinted placeholder while loading, then fades the art in.
 */
export function ArtImage({ artwork, sizes, priority, className, imgClassName, focus, zoom }: ArtImageProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={cn("art-frame", className)}>
      <Image
        src={artwork.src}
        alt={artwork.alt}
        fill
        sizes={sizes}
        priority={priority}
        onLoad={() => setLoaded(true)}
        style={{ objectPosition: focus ?? artwork.focus ?? "50% 50%" }}
        className={cn(
          "object-cover transition-opacity duration-700",
          zoom && "art-zoom",
          loaded ? "opacity-100" : "opacity-0",
          imgClassName,
        )}
      />
    </div>
  );
}
