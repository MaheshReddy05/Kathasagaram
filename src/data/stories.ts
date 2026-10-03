import { storyAssets, type StoryAssetKey } from "./assets";
import { audioForStory } from "./audio";
import type { Localized, Story, StoryBlock } from "./types";

/**
 * Stories of Karna — DEMO COPY.
 *
 * The text below is short, deliberately restrained placeholder copy that
 * follows the widely known outline of each episode. It is marked
 * `contentStatus: "demo"` and is intended to be replaced by edited
 * long-form text. Keep body text here (or in a future CMS) — never in JSX.
 */

const p = (text: string): StoryBlock => ({ type: "p", text });
const q = (text: string): StoryBlock => ({ type: "quote", text });
const hr: StoryBlock = { type: "break" };

/** Rough reading time: English ≈ 220 wpm, Telugu ≈ 140 wpm (longer words). */
function readingMinutes(body: Localized<StoryBlock[]>): Localized<number> {
  const words = (blocks: StoryBlock[]) =>
    blocks.reduce((n, b) => n + ("text" in b ? b.text.split(/\s+/).length : 0), 0);
  return {
    en: Math.max(1, Math.round(words(body.en) / 220)),
    te: Math.max(1, Math.round(words(body.te) / 140)),
  };
}

type StoryInput = Omit<Story, "id" | "artwork" | "audio" | "readingMinutes" | "collectionId" | "characterId" | "contentStatus"> & {
  slug: StoryAssetKey;
};

function defineStory(input: StoryInput): Story {
  return {
    ...input,
    id: input.slug,
    collectionId: "mahabharata",
    characterId: "karna",
    artwork: storyAssets[input.slug],
    audio: audioForStory(input.slug),
    readingMinutes: readingMinutes(input.body),
    contentStatus: "demo",
  };
}

export const stories: Story[] = [
  defineStory({
    slug: "birth-of-karna",
    number: 1,
    title: { en: "The Birth of Karna", te: "కర్ణుని జననం" },
    description: {
      en: "A young princess, a sage’s gift, and a child born of the Sun — wearing armour no blade could pierce.",
      te: "ఒక యువ రాకుమారి, ఒక మహర్షి వరం, సూర్యుని తేజస్సుతో పుట్టిన ఒక బిడ్డ — ఏ ఆయుధమూ ఛేదించలేని కవచంతో.",
    },
    timelineEventId: "birth",
    featuring: ["kunti", "surya"],
    body: {
      en: [
        p("Long before the great war, in the house of King Kuntibhoja, there lived a young princess named Kunti. While the sage Durvasa stayed with them, she served him with such patience and care that, as he departed, he gave her a gift: a mantra by which she could call upon any god and receive a child from him."),
        p("Kunti was young, and the gift was strange and new. One morning, watching the sun rise, she wondered whether the words could truly be so powerful. She spoke the mantra — and Surya, the Sun himself, stood before her."),
        p("A mantra once spoken could not be taken back. From Surya, Kunti received a son — radiant as the dawn, born wearing a golden kavacha upon his chest and kundalas shining at his ears."),
        p("But Kunti was unmarried, and afraid of what the world would say. With a breaking heart she placed the child in a basket, set it upon the river, and watched the current carry him away."),
        q("And so the son of the Sun began his life not in a palace, but on the water."),
        hr,
        p("She would carry that silence for many years. He would not learn her name until the eve of war."),
      ],
      te: [
        p("మహాసంగ్రామానికి ఎన్నో ఏళ్ల ముందు, కుంతిభోజ మహారాజు ఇంట కుంతి అనే యువ రాకుమారి ఉండేది. దుర్వాస మహర్షి వారి ఇంట ఉన్న రోజుల్లో ఆమె ఎంతో ఓర్పుతో, శ్రద్ధతో ఆయనకు సేవ చేసింది. వెళ్తూ వెళ్తూ మహర్షి ఆమెకు ఒక వరం ఇచ్చాడు — ఏ దేవుణ్ణైనా ఆహ్వానించి, ఆ దేవుని వలన సంతానం పొందగల ఒక మంత్రం."),
        p("కుంతి చిన్నది; ఆ వరం ఆమెకు కొత్తగా, వింతగా అనిపించింది. ఒక ఉదయం ఉదయిస్తున్న సూర్యుణ్ణి చూస్తూ, ఆ మంత్రానికి నిజంగా అంత శక్తి ఉందా అని ఆలోచించింది. ఆమె మంత్రం పఠించింది — సాక్షాత్తు సూర్యభగవానుడు ఆమె ఎదుట ప్రత్యక్షమయ్యాడు."),
        p("పఠించిన మంత్రాన్ని వెనక్కి తీసుకోలేము. సూర్యుని వలన కుంతికి ఒక కుమారుడు జన్మించాడు — ఉషోదయంలా ప్రకాశిస్తూ, ఛాతీపై బంగారు కవచంతో, చెవులకు మెరిసే కుండలాలతో పుట్టాడు."),
        p("కానీ కుంతి అవివాహిత. లోకం ఏమంటుందోనన్న భయం ఆమెను కమ్మేసింది. బరువెక్కిన హృదయంతో ఆ బిడ్డను ఒక పెట్టెలో ఉంచి నదిలో వదిలింది. ప్రవాహం అతన్ని దూరంగా తీసుకువెళ్తుంటే చూస్తూ నిలబడిపోయింది."),
        q("అలా సూర్యపుత్రుని జీవితం రాజభవనంలో కాదు, నీటిపై ప్రారంభమైంది."),
        hr,
        p("ఆ మౌనాన్ని ఆమె ఎన్నో సంవత్సరాలు మోసింది. యుద్ధం ముంగిట వరకూ అతనికి ఆమె పేరే తెలియదు."),
      ],
    },
  }),
  defineStory({
    slug: "child-found-on-the-river",
    number: 2,
    title: { en: "The Child Found on the River", te: "నదిలో దొరికిన బిడ్డ" },
    description: {
      en: "A charioteer and his wife find a shining child drifting toward them — and raise him as their own.",
      te: "నీటిపై తేలివచ్చిన తేజస్వి అయిన బిడ్డను ఒక సారథి, అతని భార్య చేరదీసి, తమ సొంత బిడ్డలా పెంచుకున్నారు.",
    },
    timelineEventId: "adoption",
    featuring: ["adhiratha", "radha"],
    body: {
      en: [
        p("The river carried the basket far from the palace of Kuntibhoja. Downstream, Adhiratha — a charioteer in the service of the Kuru court — saw it drifting near the bank and drew it from the water."),
        p("Inside lay a child unlike any he had seen: calm, golden-skinned, already wearing armour and earrings that caught the light. Adhiratha and his wife Radha had long wished for a son. They took the child home and raised him as their own."),
        p("Because he was born with such wealth upon his body, they named him Vasusena. Because he was Radha’s son, the world would also call him Radheya — a name he wore with pride all his life."),
        p("He grew up among horses and chariots, in a home that was humble but full of love. The prince of the river had become the son of a charioteer."),
        q("Whatever the world would later say about his birth, Karna never forgot who had raised him."),
      ],
      te: [
        p("ప్రవాహం ఆ పెట్టెను కుంతిభోజుని రాజభవనానికి ఎంతో దూరం తీసుకువెళ్లింది. దిగువన, కురు రాజసభలో సారథిగా పనిచేసే అధిరథుడు ఒడ్డుకు దగ్గరగా తేలుతున్న ఆ పెట్టెను చూసి, నీటిలోంచి బయటకు తీశాడు."),
        p("అందులో అతనెప్పుడూ చూడని ఒక బిడ్డ ఉన్నాడు — ప్రశాంతంగా, బంగారు ఛాయతో, వెలుగులో మెరిసే కవచకుండలాలు ధరించి. అధిరథుడు, అతని భార్య రాధ ఎంతో కాలంగా ఒక కుమారుని కోసం ఎదురుచూస్తున్నారు. ఆ బిడ్డను ఇంటికి తీసుకువెళ్లి తమ సొంత బిడ్డలా పెంచారు."),
        p("శరీరంపైనే సంపదతో పుట్టినందువల్ల అతనికి వసుసేనుడు అని పేరు పెట్టారు. రాధ కుమారుడు కావడం వల్ల లోకం అతన్ని రాధేయుడు అని కూడా పిలిచింది — ఆ పేరును అతను జీవితాంతం గర్వంగా ధరించాడు."),
        p("గుర్రాలు, రథాల మధ్య, నిరాడంబరమైనా ప్రేమ నిండిన ఇంట్లో అతను పెరిగాడు. నదిలో దొరికిన రాకుమారుడు ఒక సారథి కుమారుడయ్యాడు."),
        q("తన జన్మ గురించి లోకం తరువాత ఏమన్నా, తనను పెంచినవారిని కర్ణుడు ఎన్నడూ మరువలేదు."),
      ],
    },
  }),
  defineStory({
    slug: "search-for-a-teacher",
    number: 3,
    title: { en: "Karna’s Search for a Teacher", te: "గురువు కోసం కర్ణుని అన్వేషణ" },
    description: {
      en: "A charioteer’s son with a warrior’s heart goes looking for someone who will teach him.",
      te: "యోధుని హృదయం గల సారథి కుమారుడు, తనకు విద్య నేర్పే గురువు కోసం బయలుదేరాడు.",
    },
    timelineEventId: "training",
    featuring: ["parashurama"],
    body: {
      en: [
        p("As Vasusena grew, it became clear that he was not made for the reins alone. He was drawn to the bow — to its weight, its discipline, its silence before the release."),
        p("But in his world, the finest teaching in arms belonged to princes and to those born into warrior families. A charioteer’s son could watch, but he was rarely invited to learn."),
        p("Karna would not accept that his birth should decide his limits. He practised, and his skill grew. And he began to look further — beyond the royal courts — for a master who could teach him what no one else would."),
        p("His search would lead him to the most formidable teacher of all: Parashurama, the warrior-sage."),
        q("Talent, he believed, should answer to effort — not to birth."),
      ],
      te: [
        p("వసుసేనుడు పెరుగుతున్న కొద్దీ, అతను కేవలం కళ్లేల కోసం పుట్టలేదని స్పష్టమైంది. విల్లు అతన్ని ఆకర్షించింది — దాని బరువు, దాని క్రమశిక్షణ, బాణం విడిచే ముందటి నిశ్శబ్దం."),
        p("కానీ అతని లోకంలో, అత్యుత్తమ అస్త్రవిద్య రాకుమారులకు, క్షత్రియ వంశాల్లో పుట్టినవారికే సొంతం. సారథి కుమారుడు చూడగలడేమో కానీ, నేర్చుకోవడానికి అతన్ని పిలిచేవారు అరుదు."),
        p("తన జన్మే తన హద్దులను నిర్ణయించాలన్న మాటను కర్ణుడు ఒప్పుకోలేదు. సాధన చేశాడు; అతని నైపుణ్యం పెరిగింది. రాజసభలకు అవతల, ఇంకెవరూ నేర్పని విద్యను నేర్పగల గురువు కోసం వెతకడం మొదలుపెట్టాడు."),
        p("ఆ అన్వేషణ అతన్ని అందరికంటే గొప్ప గురువు దగ్గరకు తీసుకువెళ్తుంది — యోధ మహర్షి పరశురాముడు."),
        q("ప్రతిభకు కొలమానం శ్రమ కావాలి — జన్మ కాదు అని అతను నమ్మాడు."),
      ],
    },
  }),
  defineStory({
    slug: "the-tournament",
    number: 4,
    title: { en: "The Tournament", te: "రంగప్రవేశం" },
    description: {
      en: "In an arena built to honour the Kuru princes, an uninvited warrior steps forward and matches Arjuna feat for feat.",
      te: "కురు రాకుమారుల గౌరవార్థం ఏర్పాటు చేసిన రంగస్థలంలో, ఆహ్వానం లేని ఒక వీరుడు ముందుకు వచ్చి అర్జునుడికి దీటుగా నిలిచాడు.",
    },
    timelineEventId: "tournament",
    featuring: ["arjuna", "duryodhana"],
    body: {
      en: [
        p("Dronacharya had trained the Kuru princes, and the time came to show the people of Hastinapura what they had learned. An arena was raised, the royal family took their seats, and the city gathered to watch."),
        p("Arjuna’s display drew gasps from every side. Then, at the gates, a stranger appeared — tall, armoured in gold, carrying himself like one who belonged there. It was Karna. He repeated each of Arjuna’s feats, and then challenged him to single combat."),
        p("Before the duel could begin, Kripacharya asked the stranger to name his lineage. A prince, he said, need only fight a prince. Karna had no royal name to give. He lowered his eyes — and the arena fell quiet."),
        p("In that silence, Duryodhana rose. If kingship was what was required, he declared, then Karna would be a king — and there, before everyone, he crowned him ruler of Anga."),
        q("One question about his birth. One answer from a friend. Both would shape the rest of his life."),
      ],
      te: [
        p("ద్రోణాచార్యులు కురు రాకుమారులకు విద్య నేర్పారు. వారు నేర్చుకున్నది హస్తినాపుర ప్రజలకు ప్రదర్శించే సమయం వచ్చింది. రంగస్థలం సిద్ధమైంది, రాజకుటుంబం ఆసీనులయ్యారు, నగరమంతా చూడటానికి గుమిగూడింది."),
        p("అర్జునుని ప్రదర్శనకు అన్ని వైపుల నుంచీ ఆశ్చర్యధ్వనులు వినిపించాయి. అప్పుడే ద్వారం వద్ద ఒక అపరిచితుడు కనిపించాడు — పొడవైనవాడు, బంగారు కవచధారి, అక్కడికే చెందినవాడిలా నిలబడ్డాడు. అతనే కర్ణుడు. అర్జునుడు చూపిన ప్రతి విద్యనూ అతను తిరిగి చూపించాడు, ఆపై ద్వంద్వయుద్ధానికి సవాలు విసిరాడు."),
        p("యుద్ధం మొదలయ్యే ముందే కృపాచార్యులు ఆ అపరిచితుని వంశం ఏమిటని అడిగారు. రాకుమారుడు రాకుమారునితోనే పోరాడాలని అన్నారు. చెప్పుకోవడానికి కర్ణునికి రాజవంశ నామం లేదు. అతను తల దించుకున్నాడు — రంగస్థలం నిశ్శబ్దమైంది."),
        p("ఆ నిశ్శబ్దంలో దుర్యోధనుడు లేచాడు. రాజ్యాధికారమే అర్హత అయితే, కర్ణుడు రాజు అవుతాడని ప్రకటించాడు — అక్కడే, అందరి ఎదుటా, అతన్ని అంగరాజ్యానికి రాజుగా పట్టాభిషేకం చేశాడు."),
        q("అతని జన్మపై ఒక ప్రశ్న. ఒక స్నేహితుని నుంచి ఒక సమాధానం. ఆ రెండూ అతని మిగిలిన జీవితాన్ని తీర్చిదిద్దాయి."),
      ],
    },
  }),
  defineStory({
    slug: "friendship-with-duryodhana",
    number: 5,
    title: { en: "Friendship with Duryodhana", te: "దుర్యోధనునితో స్నేహం" },
    description: {
      en: "A crown given in a single moment becomes a loyalty that lasts a lifetime.",
      te: "ఒక్క క్షణంలో ఇచ్చిన కిరీటం, జీవితాంతం నిలిచే విశ్వాసంగా మారింది.",
    },
    timelineEventId: "anga",
    featuring: ["duryodhana"],
    body: {
      en: [
        p("Duryodhana’s gift at the tournament was more than a kingdom. In front of the whole court, he had given Karna something he had never been offered before: a place among equals."),
        p("Karna never forgot it. When Karna asked what he could give in return, Duryodhana is said to have asked only for his friendship — and Karna gave it completely."),
        p("In the years that followed, Karna stood beside Duryodhana in council and in conflict. He was not blind to his friend’s faults — but he had given his word, and for Karna a word once given was not taken back."),
        p("It was a friendship that would be tested again and again — by family, by gods, and finally by war."),
        q("Loyalty, for Karna, was not a feeling. It was a promise."),
      ],
      te: [
        p("రంగస్థలంలో దుర్యోధనుడు ఇచ్చినది కేవలం ఒక రాజ్యం కాదు. సభ మొత్తం ఎదుట, కర్ణునికి అంతకుముందెన్నడూ దక్కనిదాన్ని ఇచ్చాడు — సమానుల మధ్య ఒక స్థానం."),
        p("కర్ణుడు దాన్ని ఎన్నడూ మరచిపోలేదు. ప్రతిఫలంగా ఏమి ఇవ్వగలనని కర్ణుడు అడిగినప్పుడు, దుర్యోధనుడు కేవలం అతని స్నేహాన్నే కోరాడని చెబుతారు — కర్ణుడు దాన్ని సంపూర్ణంగా ఇచ్చాడు."),
        p("ఆ తరువాతి సంవత్సరాల్లో, సభలోనూ, సంఘర్షణలోనూ కర్ణుడు దుర్యోధనుని పక్కనే నిలిచాడు. స్నేహితుని లోపాలు అతనికి తెలియనివి కావు — కానీ మాట ఇచ్చాడు, ఇచ్చిన మాటను వెనక్కి తీసుకోవడం కర్ణునికి తెలియదు."),
        p("ఆ స్నేహం మళ్లీ మళ్లీ పరీక్షకు నిలుస్తుంది — కుటుంబం చేత, దేవతల చేత, చివరకు యుద్ధం చేత."),
        q("కర్ణునికి విశ్వాసం ఒక భావన కాదు. అది ఒక ప్రతిజ్ఞ."),
      ],
    },
  }),
  defineStory({
    slug: "karna-and-parashurama",
    number: 6,
    title: { en: "Karna and Parashurama", te: "కర్ణుడు – పరశురాముడు" },
    description: {
      en: "The greatest of teachers, a disguised student, and a curse that would wait for the worst possible moment.",
      te: "గొప్ప గురువు, మారువేషంలో శిష్యుడు, సరిగ్గా అవసరమైన క్షణం కోసం ఎదురుచూసే ఒక శాపం.",
    },
    timelineEventId: "training",
    featuring: ["parashurama"],
    body: {
      en: [
        p("Fearing the sage would not otherwise accept him, Karna came to Parashurama presenting himself as a Brahmin. Parashurama took him as a student, and taught him the use of powerful divine weapons, among them the Brahmastra."),
        p("One afternoon the teacher grew tired and rested his head in Karna’s lap. While he slept, an insect bored into Karna’s thigh. The pain was terrible and the wound bled — but Karna did not move, unwilling to wake his guru."),
        p("When Parashurama woke and saw the blood, he understood at once. No Brahmin, he said, could have borne such pain so silently. Karna confessed the truth."),
        p("Parashurama’s anger was swift. He cursed Karna: at the moment he needed it most, the knowledge of the Brahmastra would desert him."),
        q("He had won his teacher’s knowledge through a lie — and lost it through his own endurance."),
      ],
      te: [
        p("లేకపోతే మహర్షి తనను చేరదీయరేమోనన్న భయంతో, కర్ణుడు తాను బ్రాహ్మణుడినని చెప్పుకుని పరశురాముని వద్దకు వెళ్లాడు. పరశురాముడు అతన్ని శిష్యునిగా స్వీకరించి, బ్రహ్మాస్త్రంతో సహా శక్తిమంతమైన దివ్యాస్త్రాల ప్రయోగాన్ని నేర్పాడు."),
        p("ఒక మధ్యాహ్నం అలసిపోయిన గురువు కర్ణుని ఒడిలో తల పెట్టి విశ్రమించాడు. ఆయన నిద్రిస్తుండగా ఒక పురుగు కర్ణుని తొడను తొలిచింది. భరించలేని నొప్పి, గాయం నుంచి రక్తం కారుతోంది — అయినా గురువు నిద్ర చెడకూడదని కర్ణుడు కదలలేదు."),
        p("పరశురాముడు మేల్కొని రక్తాన్ని చూడగానే అర్థం చేసుకున్నాడు. ఇంతటి బాధను ఇంత మౌనంగా ఏ బ్రాహ్మణుడూ భరించలేడు అన్నాడు. కర్ణుడు నిజం ఒప్పుకున్నాడు."),
        p("పరశురాముని కోపం క్షణంలో రగిలింది. అత్యంత అవసరమైన సమయంలో బ్రహ్మాస్త్ర విద్య నీకు గుర్తుకు రాకుండా పోతుంది అని కర్ణుని శపించాడు."),
        q("అబద్ధంతో గురువు విద్యను పొందాడు — తన సహనంతోనే దాన్ని కోల్పోయాడు."),
      ],
    },
  }),
  defineStory({
    slug: "kavacha-and-kundala",
    number: 7,
    title: { en: "The Kavacha and Kundala", te: "కవచ కుండలాలు" },
    description: {
      en: "A god in disguise asks for the one thing that keeps Karna safe. Karna has never refused a request.",
      te: "మారువేషంలో వచ్చిన ఒక దేవుడు, కర్ణుని కాపాడేదాన్నే దానంగా అడిగాడు. అడిగినవారికి కర్ణుడు ఎన్నడూ కాదనలేదు.",
    },
    timelineEventId: "kavacha",
    featuring: ["surya"],
    body: {
      en: [
        p("Karna was known across the land for his generosity. It was said that no one who came to him asking for alms would leave with empty hands."),
        p("Indra, king of the gods and father of Arjuna, knew that while Karna wore the kavacha and kundala he could not be defeated. So he resolved to come to Karna disguised as a Brahmin, and ask for them as a gift."),
        p("Surya came to Karna in a dream and warned him. Karna listened — and still would not break his vow of giving."),
        p("When the Brahmin came, Karna cut the armour and earrings from his own body and placed them in his hands. Moved by the gift, Indra gave him in return a single divine weapon, the Vasavi Shakti, which could be used only once."),
        q("He was warned. He understood. He gave anyway."),
      ],
      te: [
        p("కర్ణుని దానగుణం లోకమంతా ప్రసిద్ధి. అతని దగ్గరకు యాచిస్తూ వచ్చినవారెవరూ వట్టి చేతులతో తిరిగి వెళ్లరని చెప్పుకునేవారు."),
        p("దేవతల రాజు, అర్జునుని తండ్రి అయిన ఇంద్రుడికి తెలుసు — కవచకుండలాలు ఉన్నంత కాలం కర్ణుని ఎవరూ ఓడించలేరని. అందుకే బ్రాహ్మణ వేషంలో కర్ణుని దగ్గరకు వెళ్లి, వాటినే దానంగా అడగాలని నిశ్చయించుకున్నాడు."),
        p("సూర్యుడు కలలో కర్ణునికి కనిపించి హెచ్చరించాడు. కర్ణుడు విన్నాడు — అయినా తన దానవ్రతాన్ని విడువలేదు."),
        p("బ్రాహ్మణుడు రాగానే, కర్ణుడు తన శరీరం నుంచే కవచకుండలాలను కోసి ఆయన చేతుల్లో ఉంచాడు. ఆ దానానికి చలించిన ఇంద్రుడు ప్రతిగా ఒక్కసారి మాత్రమే ప్రయోగించగల వాసవీ శక్తి అనే దివ్యాస్త్రాన్ని అతనికి ఇచ్చాడు."),
        q("హెచ్చరిక అందింది. అర్థమైంది. అయినా ఇచ్చేశాడు."),
      ],
    },
  }),
  defineStory({
    slug: "kunti-meets-karna",
    number: 8,
    title: { en: "Kunti Meets Karna", te: "కుంతి కర్ణుని కలిసిన వేళ" },
    description: {
      en: "On the eve of war, a mother finally speaks the truth to the son she gave to the river.",
      te: "యుద్ధం ముంగిట, నదికి అప్పగించిన కుమారునికి ఒక తల్లి ఎట్టకేలకు నిజం చెప్పింది.",
    },
    timelineEventId: "kunti",
    featuring: ["kunti"],
    body: {
      en: [
        p("As war between the Kauravas and the Pandavas drew near, Kunti went to find Karna. She found him on the riverbank, at his prayers to the Sun."),
        p("There she told him what she had kept hidden all his life: that he was her firstborn son, born before her marriage — the eldest brother of the Pandavas."),
        p("She asked him to join his brothers. Karna’s answer was gentle, and it was final. Duryodhana had stood by him when no one else would. He could not abandon his friend now."),
        p("But he made her a promise. In the war to come, he would not kill any of her sons except Arjuna. Whatever happened, she would still have five sons."),
        q("He did not give her what she asked for. He gave her what he could."),
      ],
      te: [
        p("కౌరవులకు, పాండవులకు మధ్య యుద్ధం సమీపిస్తున్న వేళ, కుంతి కర్ణుని వెతుక్కుంటూ వెళ్లింది. నదీతీరంలో సూర్యునికి ప్రార్థన చేస్తున్న అతన్ని కలిసింది."),
        p("జీవితాంతం దాచిన నిజాన్ని అక్కడ చెప్పింది — అతను తన వివాహానికి ముందు పుట్టిన తన మొదటి కుమారుడని, పాండవులకు అన్న అని."),
        p("తన తమ్ముళ్లతో కలవమని ఆమె కోరింది. కర్ణుని సమాధానం మృదువుగా ఉంది, కానీ స్థిరంగా ఉంది. ఎవరూ తనతో నిలవనప్పుడు దుర్యోధనుడు నిలిచాడు. ఇప్పుడు ఆ స్నేహితుణ్ణి విడిచిపెట్టలేను అన్నాడు."),
        p("అయినా ఆమెకు ఒక మాట ఇచ్చాడు. రాబోయే యుద్ధంలో అర్జునుడు తప్ప ఆమె కుమారులెవరినీ చంపను. ఏది జరిగినా, ఆమెకు ఐదుగురు కుమారులు మిగిలే ఉంటారు."),
        q("ఆమె అడిగింది ఇవ్వలేదు. ఇవ్వగలిగింది ఇచ్చాడు."),
      ],
    },
  }),
  defineStory({
    slug: "karna-and-arjuna",
    number: 9,
    title: { en: "Karna and Arjuna", te: "కర్ణుడు – అర్జునుడు" },
    description: {
      en: "Two archers, one mother, and a rivalry that neither of them fully understood.",
      te: "ఇద్దరు విలుకాండ్లు, ఒకే తల్లి, ఇద్దరికీ పూర్తిగా అర్థం కాని ఒక వైరం.",
    },
    timelineEventId: "kurukshetra",
    featuring: ["arjuna"],
    body: {
      en: [
        p("From the day of the tournament, Karna and Arjuna were measured against each other. Each was called the finest archer of his age, and each seemed to be the answer to the other."),
        p("Arjuna had every advantage that birth could give — royal teachers, a celebrated name, Krishna at his side. Karna had earned his place with his own hands, and carried every slight he had suffered along the way."),
        p("What Arjuna did not know, and what Karna learned only late, was that they were brothers — sons of the same mother, standing on opposite sides of the same family."),
        p("The rivalry would not end in words. It was always going to be settled on the field of Kurukshetra."),
        q("Each saw in the other the life he might have had."),
      ],
      te: [
        p("రంగప్రవేశం రోజు నుంచీ కర్ణుడు, అర్జునుడు ఒకరితో ఒకరు పోల్చబడుతూనే ఉన్నారు. ఇద్దరూ తమ కాలపు శ్రేష్ఠ విలుకాండ్లుగా పేరుపొందారు; ఒకరికి మరొకరే సమాధానంలా నిలిచారు."),
        p("జన్మ ఇవ్వగల ప్రతి అనుకూలత అర్జునునికి ఉంది — రాజగురువులు, ప్రఖ్యాత నామం, పక్కనే శ్రీకృష్ణుడు. కర్ణుడు తన స్థానాన్ని స్వయంగా సంపాదించుకున్నాడు; దారిలో ఎదురైన ప్రతి అవమానాన్నీ మోస్తూ వచ్చాడు."),
        p("అర్జునునికి తెలియనిది, కర్ణునికి చాలా ఆలస్యంగా తెలిసినది ఒకటే — వారిద్దరూ అన్నదమ్ములు. ఒకే తల్లి బిడ్డలు, ఒకే కుటుంబానికి ఎదురెదురు వైపుల నిలబడినవారు."),
        p("ఈ వైరం మాటలతో ముగిసేది కాదు. అది ఎప్పటికైనా కురుక్షేత్ర రణభూమిలోనే తేలాల్సి ఉంది."),
        q("ఒకరిలో మరొకరు, తమకు దక్కగలిగిన జీవితాన్ని చూసుకున్నారు."),
      ],
    },
  }),
  defineStory({
    slug: "the-final-battle",
    number: 10,
    title: { en: "The Final Battle", te: "చివరి యుద్ధం" },
    description: {
      en: "On the seventeenth day of Kurukshetra, the son of the Sun faces Arjuna for the last time.",
      te: "కురుక్షేత్ర యుద్ధం పదిహేడవ రోజున, సూర్యపుత్రుడు చివరిసారిగా అర్జునుని ఎదుర్కొన్నాడు.",
    },
    timelineEventId: "final-battle",
    featuring: ["arjuna", "parashurama"],
    body: {
      en: [
        p("After the fall of Bhishma and Drona, Karna was made commander of the Kaurava army. On the seventeenth day of the war, with Shalya driving his chariot, he rode out to meet Arjuna."),
        p("The duel was fierce and evenly matched. Then, at the worst possible moment, the wheel of Karna’s chariot sank into the earth — the fulfilment of an old curse."),
        p("He stepped down to free it. And when he reached for the Brahmastra, the knowledge would not come — just as Parashurama had foretold."),
        p("Urged on by Krishna, Arjuna loosed his arrow. Karna, the son of the Sun, fell on the field of Kurukshetra."),
        hr,
        q("Only after his death did the Pandavas learn that they had lost an elder brother."),
      ],
      te: [
        p("భీష్ముడు, ద్రోణుడు పడిపోయిన తరువాత కర్ణుడు కౌరవ సేనాధిపతి అయ్యాడు. యుద్ధం పదిహేడవ రోజున, శల్యుడు రథసారథిగా ఉండగా, అతను అర్జునుని ఎదుర్కోవడానికి బయలుదేరాడు."),
        p("ఆ ద్వంద్వయుద్ధం భీకరంగా, సమఉజ్జీగా సాగింది. అప్పుడు, సరిగ్గా అత్యంత కీలకమైన క్షణంలో, కర్ణుని రథచక్రం భూమిలో కూరుకుపోయింది — ఒక పాత శాపం నెరవేరింది."),
        p("దాన్ని పైకి లాగడానికి అతను రథం దిగాడు. బ్రహ్మాస్త్రాన్ని ప్రయోగించాలని ప్రయత్నించినప్పుడు, ఆ విద్య గుర్తుకు రాలేదు — పరశురాముడు చెప్పినట్లే."),
        p("శ్రీకృష్ణుని ప్రేరణతో అర్జునుడు బాణం విడిచాడు. సూర్యపుత్రుడైన కర్ణుడు కురుక్షేత్ర రణభూమిలో నేలకొరిగాడు."),
        hr,
        q("అతని మరణం తరువాతే, తాము ఒక అన్నను కోల్పోయామని పాండవులకు తెలిసింది."),
      ],
    },
  }),
];
