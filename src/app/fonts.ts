import { Cormorant_Garamond, Jost, Literata, Noto_Sans_Telugu, Noto_Serif_Telugu } from "next/font/google";

/** Editorial display serif — headlines, titles, numerals. */
export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

/** UI sans — navigation, labels, metadata. Geometric, letter-spaces beautifully. */
export const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jost",
  display: "swap",
});

/** Long-form English reading face. */
export const literata = Literata({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-literata",
  display: "swap",
});

/** Telugu display + reading. */
export const notoSerifTelugu = Noto_Serif_Telugu({
  subsets: ["telugu"],
  weight: ["400", "500", "600"],
  variable: "--font-noto-serif-telugu",
  display: "swap",
});

/** Telugu UI labels. */
export const notoSansTelugu = Noto_Sans_Telugu({
  subsets: ["telugu"],
  weight: ["400", "500"],
  variable: "--font-noto-sans-telugu",
  display: "swap",
});

export const fontVariables = [cormorant, jost, literata, notoSerifTelugu, notoSansTelugu]
  .map((f) => f.variable)
  .join(" ");
