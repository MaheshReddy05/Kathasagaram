import { karnaAssets } from "./assets";
import type { Character } from "./types";

/**
 * Character records. Only well-established details are included; the prose
 * is demo copy intended to be replaced by edited text.
 */

export const karna: Character = {
  id: "karna",
  slug: "karna",
  collectionId: "mahabharata",
  name: { en: "Karna", te: "కర్ణుడు" },
  transliteration: "Karnudu",
  possessive: { en: "Karna’s", te: "కర్ణుని" },
  epithet: { en: "The Warrior Born of the Sun", te: "సూర్యుని తేజస్సుతో జన్మించిన వీరుడు" },
  titles: ["Son of Surya", "King of Anga", "Warrior of the Mahabharata"],
  intro:
    "Born to a princess and the Sun god, raised by a charioteer, crowned by a friend — Karna is the Mahabharata’s most generous warrior, and perhaps its most tragic.",
  about: [
    "Karna is one of the most compelling figures of the Mahabharata — a warrior of extraordinary skill and generosity whose life was shaped by a secret he did not know.",
    "Born to Kunti before her marriage, through a boon that called down the Sun god Surya, he was set adrift on a river as an infant and raised by the charioteer Adhiratha and his wife Radha. By birth he was the eldest of the Pandava brothers; by upbringing he was a charioteer’s son — and the world judged him as one.",
    "Befriended and crowned King of Anga by Duryodhana, Karna gave his loyalty without reservation, and fought for the Kauravas at Kurukshetra against the brothers he would learn, too late, were his own.",
    "Generous to a fault, proud, wounded and fiercely loyal, Karna remains one of the epic’s most debated heroes.",
  ],
  quote: {
    text: {
      en: "Birth into a family is the work of fate. Valour is mine alone.",
      te: "ఏ కులంలో పుట్టాలో దైవాధీనం; పౌరుషం మాత్రం నా అధీనం.",
    },
    source: "Attributed to Karna · Veṇīsaṃhāra",
  },
  traits: [
    { en: "Generous", te: "దానశీలి" },
    { en: "Loyal", te: "విశ్వాసపాత్రుడు" },
    { en: "Valiant", te: "వీరుడు" },
    { en: "Proud", te: "ఆత్మాభిమాని" },
    { en: "Tragic", te: "విషాదనాయకుడు" },
  ],
  identity: [
    { id: "mother", label: "Mother", value: { en: "Kunti", te: "కుంతి" }, group: "origin" },
    { id: "father", label: "Divine Father", value: { en: "Surya", te: "సూర్యుడు" }, group: "origin" },
    { id: "foster", label: "Foster Parents", value: { en: "Adhiratha & Radha", te: "అధిరథుడు & రాధ" }, group: "upbringing" },
    { id: "teacher", label: "Teacher", value: { en: "Parashurama", te: "పరశురాముడు" }, group: "upbringing" },
    { id: "kingdom", label: "Kingdom", value: { en: "Anga", te: "అంగ రాజ్యం" }, group: "path" },
    { id: "ally", label: "Closest Ally", value: { en: "Duryodhana", te: "దుర్యోధనుడు" }, group: "path" },
    { id: "epic", label: "Epic", value: { en: "Mahabharata", te: "మహాభారతం" }, group: "path" },
  ],
  names: [
    { id: "karna", name: "Karna", script: "కర్ణ", meaning: "The name by which he is known across the epic." },
    { id: "karnudu", name: "Karnudu", script: "కర్ణుడు", meaning: "His name as it is spoken in Telugu." },
    { id: "radheya", name: "Radheya", script: "రాధేయుడు", meaning: "Son of Radha — the foster mother who raised him." },
    { id: "vasusena", name: "Vasusena", script: "వసుసేనుడు", meaning: "His childhood name: one born with wealth upon him." },
    { id: "angaraja", name: "Angaraja", script: "అంగరాజు", meaning: "King of Anga, the kingdom Duryodhana gave him." },
    { id: "suryaputra", name: "Suryaputra", script: "సూర్యపుత్రుడు", meaning: "Son of Surya, the Sun." },
    { id: "danaveera", name: "Danaveera", script: "దానవీరుడు", meaning: "Hero of giving — for his legendary generosity." },
  ],
  emblems: [
    {
      id: "kavacha",
      name: { en: "Kavacha", te: "కవచం" },
      kind: "Divine armour",
      description: "Born with him, upon his body. While he wore it, he could not be defeated.",
      artwork: karnaAssets.kavacha,
    },
    {
      id: "kundala",
      name: { en: "Kundala", te: "కుండలాలు" },
      kind: "Divine earrings",
      description: "Shining earrings he was born wearing — given away, with the armour, to Indra.",
      artwork: karnaAssets.kundala,
    },
    {
      id: "vijaya",
      name: { en: "Vijaya", te: "విజయ ధనుస్సు" },
      kind: "Celestial bow",
      description: "The great bow associated with Karna in the final battles of the war.",
      artwork: karnaAssets.bow,
    },
  ],
  timeline: [
    { id: "birth", phase: "Origins", title: { en: "Birth", te: "జననం" }, summary: "Born to Kunti by the grace of Surya, wearing divine armour and earrings.", storySlug: "birth-of-karna" },
    { id: "adoption", phase: "Origins", title: { en: "Adoption", te: "దత్తత" }, summary: "Drawn from the river by Adhiratha and raised with Radha as Vasusena.", storySlug: "child-found-on-the-river" },
    { id: "training", phase: "Becoming", title: { en: "Training", te: "విద్యాభ్యాసం" }, summary: "Seeks a teacher, and learns divine weapons from Parashurama.", storySlug: "search-for-a-teacher" },
    { id: "tournament", phase: "Becoming", title: { en: "Tournament", te: "రంగప్రవేశం" }, summary: "Matches Arjuna before the Kuru court — and is asked for his lineage.", storySlug: "the-tournament" },
    { id: "anga", phase: "Becoming", title: { en: "King of Anga", te: "అంగరాజు" }, summary: "Crowned by Duryodhana; a lifelong friendship begins.", storySlug: "friendship-with-duryodhana" },
    { id: "kavacha", phase: "Sacrifice", title: { en: "Kavacha & Kundala", te: "కవచ కుండలాలు" }, summary: "Gives away his divine armour to Indra, knowing the cost.", storySlug: "kavacha-and-kundala" },
    { id: "kunti", phase: "Sacrifice", title: { en: "Meeting with Kunti", te: "కుంతితో సమాగమం" }, summary: "Learns the truth of his birth on the eve of war.", storySlug: "kunti-meets-karna" },
    { id: "kurukshetra", phase: "War", title: { en: "Kurukshetra", te: "కురుక్షేత్రం" }, summary: "Fights for the Kauravas against the brothers he cannot claim.", storySlug: "karna-and-arjuna" },
    { id: "final-battle", phase: "War", title: { en: "Final Battle", te: "అంతిమ సమరం" }, summary: "Faces Arjuna on the seventeenth day.", storySlug: "the-final-battle" },
  ],
  relationships: [
    { id: "surya", name: { en: "Surya", te: "సూర్యుడు" }, relation: { en: "Divine Father", te: "దివ్య జనకుడు" }, kind: "family", summary: "The Sun, whose blessing gave Karna his radiance and his armour.", storySlug: "birth-of-karna" },
    { id: "kunti", name: { en: "Kunti", te: "కుంతి" }, relation: { en: "Mother", te: "తల్లి" }, kind: "family", summary: "Gave him to the river; told him the truth only on the eve of war.", storySlug: "kunti-meets-karna" },
    { id: "radha", name: { en: "Radha", te: "రాధ" }, relation: { en: "Foster Mother", te: "పెంపుడు తల్లి" }, kind: "foster", summary: "Raised him with love. He carried her name as Radheya.", storySlug: "child-found-on-the-river" },
    { id: "adhiratha", name: { en: "Adhiratha", te: "అధిరథుడు" }, relation: { en: "Foster Father", te: "పెంపుడు తండ్రి" }, kind: "foster", summary: "The charioteer who drew him from the river.", storySlug: "child-found-on-the-river" },
    { id: "duryodhana", name: { en: "Duryodhana", te: "దుర్యోధనుడు" }, relation: { en: "Closest Ally", te: "ప్రాణ స్నేహితుడు" }, kind: "bond", summary: "Crowned him King of Anga, and earned his loyalty for life.", storySlug: "friendship-with-duryodhana" },
    { id: "parashurama", name: { en: "Parashurama", te: "పరశురాముడు" }, relation: { en: "Guru", te: "గురువు" }, kind: "guru", summary: "Taught him divine weapons — then cursed him on learning the truth.", storySlug: "karna-and-parashurama" },
    { id: "arjuna", name: { en: "Arjuna", te: "అర్జునుడు" }, relation: { en: "Rival · Brother", te: "ప్రత్యర్థి · సోదరుడు" }, kind: "rival", summary: "His greatest rival — and, unknown to them both for years, his younger brother.", storySlug: "karna-and-arjuna" },
  ],
  artwork: {
    hero: karnaAssets.hero,
    portrait: karnaAssets.portrait,
    figure: karnaAssets.figure,
  },
};

export const characters: Character[] = [karna];
