/**
 * The 27 nakshatras (lunar mansions) of Vedic astrology with their
 * planetary lords (per the Vimshottari dasha scheme) and core traits.
 */
export interface Nakshatra {
  id: number;
  name: string;
  /** Planetary lord (Vimshottari dasha lord) */
  lord: string;
  /** Behaviour / personality / significance */
  description: string;
}

export const nakshatras: Nakshatra[] = [
  {
    id: 1,
    name: "Ashwini",
    lord: "Ketu",
    description:
      "Ruled by the Ashwini Kumaras, the celestial physicians. Natives are swift, youthful and pioneering, with natural healing gifts. They love speed, new beginnings and adventure, though impatience can make them act before thinking.",
  },
  {
    id: 2,
    name: "Bharani",
    lord: "Venus",
    description:
      "Presided over by Yama, lord of dharma. Bharani natives bear great burdens with creative strength, navigating the extremes of life and death, beginnings and endings. Passionate and determined, they transform whatever they touch.",
  },
  {
    id: 3,
    name: "Krittika",
    lord: "Sun",
    description:
      "The star of Agni, god of fire. Krittika natives are sharp, ambitious and purifying — they cut through falsehood like a blade. Protective and dignified, they make fierce guardians and demanding but inspiring leaders.",
  },
  {
    id: 4,
    name: "Rohini",
    lord: "Moon",
    description:
      "The Moon's favourite mansion, ruled by Brahma the creator. Rohini natives are charming, artistic and magnetic, drawn to beauty, comfort and growth. Fertile in every sense, they attract abundance but must guard against possessiveness.",
  },
  {
    id: 5,
    name: "Mrigashira",
    lord: "Mars",
    description:
      "The deer's head, ruled by Soma. Mrigashira natives are gentle, curious seekers — forever searching for something just beyond the horizon. Restless and travel-loving, they shine in research, writing and exploration.",
  },
  {
    id: 6,
    name: "Ardra",
    lord: "Rahu",
    description:
      "The teardrop star of Rudra, the storm god. Ardra natives are intense and intellectually brilliant, transformed by emotional storms into deeper wisdom. Destruction precedes renewal in their lives; they excel where others fear chaos.",
  },
  {
    id: 7,
    name: "Punarvasu",
    lord: "Jupiter",
    description:
      "The return of the light, ruled by Aditi, mother of the gods. Punarvasu natives are optimistic, generous and philosophical, with a remarkable gift for bouncing back. They restore what was lost and bring renewal wherever they go.",
  },
  {
    id: 8,
    name: "Pushya",
    lord: "Saturn",
    description:
      "Considered the most auspicious nakshatra, presided over by Brihaspati. Pushya natives are nourishing, dutiful and deeply spiritual. Dependable like the cow's udder that symbolises them, they care selflessly for family and community.",
  },
  {
    id: 9,
    name: "Ashlesha",
    lord: "Mercury",
    description:
      "The coiled serpent, ruled by the Nagas. Ashlesha natives possess penetrating, hypnotic minds capable of profound insight and persuasion. Secretive and intuitive, they hold the serpent's dual power to poison or to heal.",
  },
  {
    id: 10,
    name: "Magha",
    lord: "Ketu",
    description:
      "The throne, presided over by the Pitris (ancestors). Magha natives are regal, proud and tradition-honouring, born to positions of respect. Their power flows from lineage and the past; loyalty to roots is their strength.",
  },
  {
    id: 11,
    name: "Purva Phalguni",
    lord: "Venus",
    description:
      "The star of pleasure, ruled by Bhaga, god of fortune and delight. These natives are sociable, romantic and creative, loving rest, art and celebration. Their warmth draws people in, but comfort can soften ambition.",
  },
  {
    id: 12,
    name: "Uttara Phalguni",
    lord: "Sun",
    description:
      "The star of patronage, ruled by Aryaman, god of contracts and friendship. These natives are generous, reliable and noble, leading through service and keeping their word. They prosper through alliances and helping others rise.",
  },
  {
    id: 13,
    name: "Hasta",
    lord: "Moon",
    description:
      "The hand, presided over by Savitar. Hasta natives are skilful, clever and quick-witted, blessed with literal and figurative dexterity. Crafts, healing arts and humour come naturally; what they set their hands to, they master.",
  },
  {
    id: 14,
    name: "Chitra",
    lord: "Mars",
    description:
      "The brilliant jewel, ruled by Tvashtar (Vishwakarma), the celestial architect. Chitra natives are charismatic and artistic, with an eye for design and structure. They build beautiful things — and beautiful lives — with striking originality.",
  },
  {
    id: 15,
    name: "Swati",
    lord: "Rahu",
    description:
      "The independent wind, presided over by Vayu. Swati natives are flexible, diplomatic and freedom-loving, swaying like a young plant in the breeze yet never uprooted. Self-made success and business acumen are their hallmarks.",
  },
  {
    id: 16,
    name: "Vishakha",
    lord: "Jupiter",
    description:
      "The forked branch, ruled by Indra and Agni together. Vishakha natives are intensely goal-oriented, pursuing their aims with single-minded passion. Patient in strategy and relentless in effort, victory comes — often later but greater.",
  },
  {
    id: 17,
    name: "Anuradha",
    lord: "Saturn",
    description:
      "The star of devotion and friendship, presided over by Mitra. Anuradha natives are loyal, disciplined and skilled at cooperation, often finding success far from their birthplace. They balance ambition with genuine warmth.",
  },
  {
    id: 18,
    name: "Jyeshtha",
    lord: "Mercury",
    description:
      "The eldest, ruled by Indra, king of the gods. Jyeshtha natives carry natural authority and sharp intellect, protective of those who depend on them. Responsibility comes early; with maturity their power becomes wise guardianship.",
  },
  {
    id: 19,
    name: "Mula",
    lord: "Ketu",
    description:
      "The root, presided over by Nirriti. Mula natives are deep investigators who dig to the root of every matter, destroying illusion to find truth. Their path involves letting go; profound spiritual and research abilities emerge from it.",
  },
  {
    id: 20,
    name: "Purva Ashadha",
    lord: "Venus",
    description:
      "The invincible star, ruled by Apas, the waters. These natives are optimistic, persuasive and proud, with purifying ambition that cannot be defeated once committed. Declarations made under this star tend to come true.",
  },
  {
    id: 21,
    name: "Uttara Ashadha",
    lord: "Sun",
    description:
      "The universal star of final victory, presided over by the Vishvadevas. These natives are ethical, persevering and humble in power. Their achievements are lasting because they are built on righteousness rather than haste.",
  },
  {
    id: 22,
    name: "Shravana",
    lord: "Moon",
    description:
      "The star of listening, presided over by Vishnu. Shravana natives are wise, scholarly and excellent counsellors, learning through hearing and connecting people through knowledge. Teaching, media and tradition-keeping suit them well.",
  },
  {
    id: 23,
    name: "Dhanishta",
    lord: "Mars",
    description:
      "The star of symphony and wealth, ruled by the eight Vasus. Dhanishta natives are musical, rhythmic and ambitious, prospering in groups and organisations. Generous with their gains, they march to a beat others eventually follow.",
  },
  {
    id: 24,
    name: "Shatabhisha",
    lord: "Rahu",
    description:
      "The hundred healers, presided over by Varuna. Shatabhisha natives are secretive, scientific and drawn to mysteries — medicine, astrology, research. Solitary by nature, they heal others through unconventional knowledge.",
  },
  {
    id: 25,
    name: "Purva Bhadrapada",
    lord: "Jupiter",
    description:
      "The fiery first feet of the cot, ruled by Aja Ekapada, the one-footed serpent of fire. These natives are intense idealists with penetrating insight, capable of great sacrifice for a cause. They transform suffering into wisdom.",
  },
  {
    id: 26,
    name: "Uttara Bhadrapada",
    lord: "Saturn",
    description:
      "The serpent of the deep, presided over by Ahir Budhnya. These natives are wise, compassionate and remarkably self-controlled, with the still depth of the ocean floor. They provide stability and quiet strength in any crisis.",
  },
  {
    id: 27,
    name: "Revati",
    lord: "Mercury",
    description:
      "The wealthy star of safe journeys, presided over by Pushan, the nourishing shepherd. Revati natives are gentle, protective and prosperous, guiding others to their destinations. The final nakshatra, it blesses completion and compassion.",
  },
];

/** All distinct lords, in traditional Vimshottari order — used for filtering. */
export const nakshatraLords = [
  "Ketu",
  "Venus",
  "Sun",
  "Moon",
  "Mars",
  "Rahu",
  "Jupiter",
  "Saturn",
  "Mercury",
] as const;
