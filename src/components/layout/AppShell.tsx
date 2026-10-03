"use client";

import { usePathname } from "next/navigation";
import { MiniPlayer } from "@/components/audio/MiniPlayer";
import { useAudio } from "@/components/audio/AudioProvider";
import { AppHeader } from "./AppHeader";
import { MobileNavigation } from "./MobileNavigation";

/** Routes that take over the whole screen (reader, full player). */
export const isImmersiveRoute = (path: string) => /^\/stories\/[^/]+\/(read|listen)\/?$/.test(path);

export function AppShell({ children, footer }: { children: React.ReactNode; footer: React.ReactNode }) {
  const pathname = usePathname();
  const immersive = isImmersiveRoute(pathname);
  const { track } = useAudio();
  const showMini = Boolean(track) && !immersive;

  if (immersive) return <>{children}</>;

  return (
    <div className="relative flex min-h-dvh flex-col" style={{ "--player-h": showMini ? "84px" : "0px" } as React.CSSProperties}>
      <a
        href="#main"
        className="sr-only z-[60] rounded-full bg-gold px-4 py-2 text-abyss focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <AppHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      {footer}
      {/* Keeps the last content clear of the bottom navigation and mini player. */}
      <div aria-hidden className="h-[calc(var(--nav-h)+var(--player-h)+var(--safe-bottom))] shrink-0 transition-[height] duration-500" />
      <MiniPlayer visible={showMini} />
      <MobileNavigation />
    </div>
  );
}
