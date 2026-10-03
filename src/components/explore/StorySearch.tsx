"use client";

import { Search, X } from "lucide-react";
import { useDeferredValue, useState } from "react";
import { StoryCard } from "@/components/story/StoryCard";
import type { StorySummary } from "@/data/types";

/** Instant client-side filter over story titles and descriptions, in both languages. */
export function StorySearch({ stories }: { stories: StorySummary[] }) {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query.trim().toLowerCase());
  const results = deferred
    ? stories.filter((s) =>
        [s.title.en, s.title.te, s.description.en, s.description.te].some((t) => t.toLowerCase().includes(deferred)),
      )
    : stories;

  return (
    <div>
      <label className="group relative flex items-center">
        <span className="sr-only">Search stories</span>
        <Search className="pointer-events-none absolute left-5 size-[1.15rem] text-ivory/40 transition-colors group-focus-within:text-gold-soft" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search stories — try “river” or “కవచ”"
          className="h-14 w-full rounded-full border border-ivory/12 bg-abyss/50 pr-12 pl-13 text-[0.9375rem] text-ivory placeholder:text-ivory/35 focus:border-gold/50 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="icon-btn absolute right-1.5 size-11">
            <X className="size-4" />
          </button>
        )}
      </label>

      <p className="mt-4 text-xs text-ivory/40" aria-live="polite">
        {deferred ? `${results.length} ${results.length === 1 ? "story" : "stories"} found` : `${stories.length} stories`}
      </p>

      {results.length > 0 ? (
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {results.map((s) => (
            <li key={s.id}>
              <StoryCard story={s} variant="row" />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 text-center font-display text-xl text-ivory/50 italic">No story matches “{query}” — yet.</p>
      )}
    </div>
  );
}
