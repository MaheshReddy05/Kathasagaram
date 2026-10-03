import { publicPath } from "@/lib/public-path";
import type { Artwork } from "./types";

/**
 * Central artwork manifest.
 *
 * Every image the app renders is referenced from here, so replacing art is a
 * matter of dropping a new file at the same path in /public/images (or
 * changing the path below). Width/height are the intrinsic size of the file
 * and are used for aspect ratios — update them if the replacement differs.
 *
 * Source art lives in /design/source; `scripts/derive-art.sh` regenerates the
 * crops below. Entries marked `placeholder: true` are crops of the Karna key
 * art standing in for dedicated story illustrations.
 */

const art = (
  src: string,
  width: number,
  height: number,
  alt: string,
  extra: Partial<Artwork> = {},
): Artwork => ({ src: publicPath(src), width, height, alt, ...extra });

export const brandAssets = {
  logoFull: art("/images/brand/logo-full.webp", 1200, 800, "Kathasagaram — stories without borders"),
  logoMark: art("/images/brand/logo-mark.webp", 480, 354, "Kathasagaram emblem: an open book becoming ocean waves"),
};

export const karnaAssets = {
  hero: art("/images/karna/hero.webp", 1672, 941, "Karna in golden armour at sunrise, bow in hand, above a river kingdom", {
    focus: "68% 30%",
  }),
  portrait: art("/images/karna/portrait.webp", 405, 700, "Portrait of Karna wearing the sun-marked kavacha and kundala", {
    focus: "50% 20%",
  }),
  figure: art("/images/karna/full-figure.webp", 250, 640, "Full figure of Karna holding his bow", { focus: "50% 15%" }),
  faceFront: art("/images/karna/face-front.webp", 236, 220, "Karna, facing forward"),
  faceThreeQuarter: art("/images/karna/face-three-quarter.webp", 236, 200, "Karna, three-quarter view"),
  faceProfile: art("/images/karna/face-profile.webp", 236, 210, "Karna in profile"),
  kavacha: art("/images/karna/kavacha.webp", 322, 222, "Detail of the kavacha, Karna's sun-emblazoned divine armour"),
  kundala: art("/images/karna/kundala.webp", 222, 222, "Detail of a kundala, Karna's divine earring"),
  bow: art("/images/karna/bow.webp", 236, 222, "Detail of Karna's bow"),
};

const story = (slug: string, width: number, height: number, alt: string, focus?: string) =>
  art(`/images/stories/${slug}.webp`, width, height, alt, { placeholder: true, focus });

export const storyAssets = {
  "birth-of-karna": story("birth-of-karna", 420, 520, "The sun rising over a battlefield horizon", "40% 60%"),
  "child-found-on-the-river": story("child-found-on-the-river", 760, 470, "A wide river winding past a distant city at dawn", "30% 50%"),
  "search-for-a-teacher": story("search-for-a-teacher", 860, 560, "Sunlit mountains and open sky beyond the river", "40% 50%"),
  "the-tournament": story("the-tournament", 520, 330, "A city of banners and towers by the river", "40% 50%"),
  "friendship-with-duryodhana": story("friendship-with-duryodhana", 250, 340, "Karna standing tall in royal armour", "50% 20%"),
  "karna-and-parashurama": story("karna-and-parashurama", 236, 222, "The grip of a great bow, wrought in gold"),
  "kavacha-and-kundala": story("kavacha-and-kundala", 322, 222, "The golden sun at the heart of Karna's armour"),
  "kunti-meets-karna": story("kunti-meets-karna", 236, 200, "Karna, turned aside in thought", "50% 35%"),
  "karna-and-arjuna": story("karna-and-arjuna", 760, 620, "Karna against the rising sun, quiver on his back", "55% 30%"),
  "the-final-battle": story("the-final-battle", 300, 340, "Chariots and war banners gathering below the bow", "50% 60%"),
} satisfies Record<string, Artwork>;

export type StoryAssetKey = keyof typeof storyAssets;
