import type { Collection } from "./types";

/**
 * Top-level collections. Only the Mahabharata is available in this demo; the
 * rest are shown as "coming soon" and carry no invented content.
 */
export const collections: Collection[] = [
  {
    id: "mahabharata",
    slug: "mahabharata",
    title: { en: "Mahabharata", te: "మహాభారతం" },
    tagline: "The great epic of duty, kinship and war.",
    description:
      "The story of two branches of one family, and the war that consumed them — told through the lives of the people caught within it.",
    kind: "epic",
    status: "available",
    characterIds: ["karna"],
  },
  {
    id: "ramayana",
    slug: "ramayana",
    title: { en: "Ramayana", te: "రామాయణం" },
    tagline: "A journey of exile, devotion and return.",
    description: "",
    kind: "epic",
    status: "coming-soon",
    characterIds: [],
  },
  {
    id: "puranas",
    slug: "puranas",
    title: { en: "Puranas", te: "పురాణాలు" },
    tagline: "Gods, creation and the cycles of time.",
    description: "",
    kind: "purana",
    status: "coming-soon",
    characterIds: [],
  },
  {
    id: "chitragupta",
    slug: "chitragupta-universe",
    title: { en: "The Chitragupta Universe", te: "చిత్రగుప్త విశ్వం" },
    tagline: "Some ledgers should never be opened.",
    description: "An original fiction universe from Kathasagaram.",
    kind: "original",
    status: "coming-soon",
    characterIds: [],
  },
];
