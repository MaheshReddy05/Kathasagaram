"use client";

import { motion } from "motion/react";
import { Compass, House, LibraryBig } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { NAV_ITEMS, isActive } from "./nav";

const ICONS = { "/": House, "/explore": Compass, "/library": LibraryBig } as const;

/** Bottom tab bar for phones. Hidden from md upwards, where the header carries navigation. */
export function MobileNavigation() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Primary"
      className="glass fixed inset-x-0 bottom-0 z-40 border-t border-ivory/[0.08] pb-[var(--safe-bottom)] md:hidden"
    >
      <ul className="mx-auto grid h-16 max-w-md grid-cols-3">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = ICONS[item.href];
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="relative flex h-full flex-col items-center justify-center gap-1 [-webkit-tap-highlight-color:transparent]"
              >
                {active && (
                  <motion.span
                    layoutId="tab-indicator"
                    className="absolute top-0 h-[2px] w-10 rounded-full bg-gradient-to-r from-gold-deep via-gold-soft to-gold-deep"
                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  />
                )}
                <Icon
                  className={cn("size-[1.35rem] transition-colors duration-300", active ? "text-gold-soft" : "text-ivory/50")}
                  strokeWidth={active ? 1.75 : 1.5}
                />
                <span
                  className={cn(
                    "text-[0.6875rem] tracking-[0.06em] transition-colors duration-300",
                    active ? "text-gold-soft" : "text-ivory/50",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
