"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { cn } from "@/lib/cn";
import { library } from "@/lib/storage";
import { useLibrary } from "@/lib/use-library";
import { BrandMark } from "./BrandMark";
import { NAV_ITEMS, isActive } from "./nav";

export function AppHeader() {
  const pathname = usePathname();
  const prefs = useLibrary("prefs");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-500",
        "pt-[env(safe-area-inset-top)]",
        scrolled ? "glass border-b border-ivory/[0.07]" : "border-b border-transparent",
      )}
    >
      <div className="shell flex h-16 items-center justify-between gap-6 sm:h-[4.5rem]">
        <BrandMark />

        <nav aria-label="Primary" className="absolute left-1/2 hidden -translate-x-1/2 md:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative block px-5 py-2 text-[0.8125rem] tracking-[0.16em] uppercase transition-colors duration-300",
                      active ? "text-gold-soft" : "text-ivory/60 hover:text-ivory",
                    )}
                  >
                    {item.label}
                    {active && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute inset-x-5 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
                        transition={{ type: "spring", stiffness: 380, damping: 34 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <span className="eyebrow hidden text-[0.625rem] text-ivory/40 lg:inline">Read in</span>
          <LanguageToggle value={prefs.storyLang} onChange={(storyLang) => library.setPrefs({ storyLang })} />
        </div>
      </div>
    </header>
  );
}
