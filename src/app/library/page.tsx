import type { Metadata } from "next";
import { LibraryView } from "@/components/library/LibraryView";
import { getCharacters, getStorySummaries } from "@/lib/content";

export const metadata: Metadata = { title: "Library" };

export default async function LibraryPage() {
  const [stories, characters] = await Promise.all([getStorySummaries(), getCharacters()]);
  return (
    <div className="shell pt-28 sm:pt-36">
      <header className="mb-10">
        <p className="eyebrow">Library</p>
        <h1 className="mt-4 font-display text-[3.25rem] leading-[0.95] font-medium text-ivory sm:text-[4.5rem]">Your library</h1>
        <p className="te mt-3 text-xl text-gold-soft/75">మీ గ్రంథాలయం</p>
        <p className="mt-4 max-w-lg text-[0.98rem] text-ivory/55">Pick up where you left off. Saved on this device — no account needed.</p>
      </header>
      <LibraryView
        stories={stories}
        characters={characters.map((c) => ({ slug: c.slug, name: c.name, epithet: c.epithet.en, portrait: c.artwork.portrait }))}
      />
    </div>
  );
}
