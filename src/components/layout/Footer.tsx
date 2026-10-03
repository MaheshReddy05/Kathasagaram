import Image from "next/image";
import Link from "next/link";
import { brandAssets } from "@/data/assets";
import { NAV_ITEMS } from "./nav";

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-ivory/[0.07] bg-abyss/60">
      <div className="shell grid gap-12 py-16 md:grid-cols-[1.2fr_1fr] md:items-center md:py-20">
        <div className="flex flex-col items-start gap-6">
          <div className="relative h-[9.5rem] w-[14rem] overflow-hidden rounded-2xl sm:h-[11rem] sm:w-[16.5rem]">
            <Image
              src={brandAssets.logoFull.src}
              alt={brandAssets.logoFull.alt}
              fill
              sizes="264px"
              className="scale-[1.12] object-cover"
              style={{ objectPosition: "50% 52%" }}
            />
          </div>
          <p className="max-w-sm text-[0.9375rem] leading-relaxed text-ivory/55">
            Stories are an ocean containing entire worlds. Kathasagaram brings India’s great stories to a new
            generation — to read, to listen, to return to.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-10 text-sm">
          <div>
            <p className="eyebrow mb-4 text-ivory/40">Navigate</p>
            <ul className="space-y-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-ivory/70 transition-colors hover:text-gold-soft">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4 text-ivory/40">Now reading</p>
            <ul className="space-y-3">
              <li>
                <Link href="/characters/karna" className="text-ivory/70 transition-colors hover:text-gold-soft">
                  Karna · <span className="te">కర్ణుడు</span>
                </Link>
              </li>
              <li className="text-ivory/35">Ramayana — soon</li>
              <li className="text-ivory/35">Chitragupta Universe — soon</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="shell flex flex-col gap-2 border-t border-ivory/[0.06] py-6 text-xs text-ivory/35 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} Kathasagaram · కథాసాగరం</p>
        <p>Frontend demo — story text and audio are placeholders.</p>
      </div>
    </footer>
  );
}
