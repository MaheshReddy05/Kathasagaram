# Kathasagaram · కథాసాగరం

*Stories without borders.* A premium Indian mythology reading and listening experience.

This repository is the **frontend demo**. It focuses on the Mahabharata, told through **Karna (కర్ణుడు)**. There is no backend, auth, database or AI: content is local TypeScript data, and reading/listening state is kept in the browser's `localStorage`.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start   # production
npm run lint
npm run typecheck
```

Requires Node 20+. The app builds as a fully static site (`out/`).

## GitHub Pages

`.github/workflows/deploy-pages.yml` builds and deploys on every push to `main`. One-time setup: in the repo's **Settings → Pages**, set **Source** to **GitHub Actions**. The site is served at `https://<owner>.github.io/<repo>/`; the workflow passes that sub-path to the build as `NEXT_PUBLIC_BASE_PATH`, and all asset paths go through `src/lib/public-path.ts`.

## Routes

| Route | Screen |
| --- | --- |
| `/` | Home: Karna hero, continue your journey, stories rail, Mahabharata, spotlight, originals teaser |
| `/characters/karna` | Character page: overview, identity, divine gifts, names & titles, timeline, relationships, stories |
| `/stories/[slug]` | Story landing: art, Read / Listen / Bookmark, opening lines, timeline context, prev/next |
| `/stories/[slug]/read` | Immersive reader: EN ↔ తెలుగు, text size, themes, progress, bookmark, resume. Accepts `?lang=te` (read client-side) |
| `/stories/[slug]/listen` | Full audio player: language, scrubber, ±15s, speed, prev/next, up next |
| `/explore` | Mahabharata collection, story search (English & Telugu), coming-soon collections |
| `/library` | Continue reading, continue listening, bookmarks, recently viewed (all local) |

Story slugs: `birth-of-karna`, `child-found-on-the-river`, `search-for-a-teacher`, `the-tournament`, `friendship-with-duryodhana`, `karna-and-parashurama`, `kavacha-and-kundala`, `kunti-meets-karna`, `karna-and-arjuna`, `the-final-battle`.

## Structure

```
src/
  app/                 routes (App Router), globals.css design system, fonts
  components/
    audio/             AudioProvider (single <audio> for the app), AudioPlayer, MiniPlayer, controls
    reader/            Reader, ReaderControls (top/bottom bars, settings)
    character/         hero, section nav, sections, CharacterTimeline, Relationships
    story/             StoryCard, StoryRail, StoryHero, StoryActions, StoryPager, BookmarkButton
    home/ explore/ library/ layout/ ui/
  data/                ← all content lives here
    types.ts           content model
    stories.ts         10 Karna stories (EN + TE bodies)
    characters.ts      Karna: identity, names, timeline, relationships, emblems
    collections.ts     Mahabharata (available) + coming-soon collections
    assets.ts          central artwork manifest
    audio.ts           audio configuration (demo vs narration)
  lib/
    content.ts         async content repository: the seam to swap for an API/CMS
    storage.ts         typed localStorage store (progress, bookmarks, recent, prefs, player)
    use-library.ts     React hooks over the store
design/
  source/              original art (Karna key art, character sheet, logo)
  references/          app design references
scripts/
  derive-art.sh        regenerates /public/images crops from design/source
  generate-demo-audio.sh  regenerates the placeholder audio
```

**Connecting a backend later:** replace the function bodies in `src/lib/content.ts` (they're already `async`). Replace `src/lib/storage.ts`'s `library` actions with synced calls once accounts exist. Components don't import data files directly.

## Placeholders: what to replace

- **Story artwork:** `public/images/stories/*.webp` are **crops of the Karna key art and character sheet**, standing in for dedicated illustrations. They're flagged `placeholder: true` in `src/data/assets.ts`. Drop in new files with the same names (and update `width`/`height`). Story heroes switch to full-bleed automatically when art is ≥ 1400px wide; smaller art is framed over a blurred backdrop.
- **Audio:** no narration exists yet. Every story points at a **synthesised tanpura-style ambient drone** (`public/audio/demo/ambient-{en,te}.mp3`), and the player labels it as demo audio. Add real narration per story in `src/data/audio.ts` (`NARRATION`).
- **Story text:** short demo copy following the widely known outline of each episode, in English and Telugu (`contentStatus: "demo"`). The reader shows "Demo text". Replace it in `src/data/stories.ts`. Reading times are computed from the text.
- **Character copy:** `src/data/characters.ts`. Only well-established details are included.
- **Logo:** `public/images/brand/logo-mark.webp` (header emblem) and `logo-full.webp` (footer) are derived from the supplied logo; app icons come from the same source.
- **Relationship portraits:** people other than Karna use Telugu-letter monograms until portraits exist.

## Local data

Everything is stored under `kathasagaram:v1:*` keys in `localStorage` and synced across tabs. Clear it from the bottom of `/library`.
