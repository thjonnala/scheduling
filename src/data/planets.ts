/**
 * The nine grahas (Navagraha) of Vedic astrology with their
 * traditional significations (karakatvas).
 */
export interface Planet {
  id: string;
  /** English name */
  name: string;
  /** Sanskrit name */
  sanskritName: string;
  /** Astrological glyph / symbol */
  glyph: string;
  /** Short tagline shown on the card */
  tagline: string;
  /** Key significations (karakatvas) */
  significations: string[];
  /** Concise description of the planet's behaviour per Vedic tradition */
  description: string;
  /** Traditional Vedic remedies (mantra, gemstone, charity, fasting, worship) */
  remedies: string[];
}

export const planets: Planet[] = [
  {
    id: "sun",
    name: "Sun",
    sanskritName: "Surya",
    glyph: "☉",
    tagline: "The Soul of the Zodiac",
    significations: ["Soul (atma)", "Authority", "Father", "Vitality", "Ego", "Government"],
    description:
      "Surya is the king of the planetary cabinet and the karaka (significator) of the soul. He governs self-confidence, leadership, ambition, health and vitality, and one's relationship with the father and with authority. A strong Sun gives dignity, willpower and recognition; an afflicted Sun can bring arrogance, ego conflicts and trouble with superiors.",
    remedies: [
      "Chant the Gayatri mantra or \"Om Suryaya Namaha\" 108 times at sunrise",
      "Offer water to the rising Sun (Surya Arghya) every morning",
      "Recite the Aditya Hridayam on Sundays",
      "Wear a ruby (manikya) set in gold on the ring finger — only after consulting an astrologer",
      "Donate wheat, jaggery or copper on Sundays",
      "Respect and serve your father and elders",
    ],
  },
  {
    id: "moon",
    name: "Moon",
    sanskritName: "Chandra",
    glyph: "☾",
    tagline: "The Mind and the Mother",
    significations: ["Mind (manas)", "Emotions", "Mother", "Intuition", "Nurturing", "The public"],
    description:
      "Chandra is the queen of the grahas and rules the mind, moods and emotional nature. In Vedic astrology the Moon sign (rashi) and nakshatra are the foundation of the chart. She signifies the mother, home comforts, memory, imagination and receptivity. A strong Moon gives emotional stability, popularity and compassion; a weak Moon brings anxiety, moodiness and restlessness.",
    remedies: [
      "Chant \"Om Chandraya Namaha\" or \"Om Som Somaya Namaha\" 108 times on Mondays",
      "Worship Lord Shiva, who bears the crescent Moon",
      "Wear a natural pearl (moti) set in silver — only after consulting an astrologer",
      "Fast on Mondays and donate rice, milk or white cloth",
      "Drink water from a silver vessel and keep a peaceful sleep routine",
      "Respect and care for your mother and motherly figures",
    ],
  },
  {
    id: "mars",
    name: "Mars",
    sanskritName: "Mangal",
    glyph: "♂",
    tagline: "The Warrior of Action",
    significations: ["Energy", "Courage", "Siblings", "Land & property", "Discipline", "Conflict"],
    description:
      "Mangal is the commander-in-chief, the planet of raw energy, courage and decisive action. He rules younger siblings, athletic ability, engineering, surgery, land and real estate. A well-placed Mars gives initiative, bravery and technical skill; an afflicted Mars (as in mangal dosha) can bring impatience, accidents, anger and disputes.",
    remedies: [
      "Recite the Hanuman Chalisa on Tuesdays",
      "Chant \"Om Mangalaya Namaha\" or \"Om Angarakaya Namaha\" 108 times",
      "Worship Lord Hanuman or Lord Subrahmanya (Kartikeya)",
      "Wear a red coral (moonga) set in gold or copper — only after consulting an astrologer",
      "Fast on Tuesdays and donate red lentils (masoor dal), jaggery or red cloth",
      "Channel excess energy through exercise and disciplined routine",
    ],
  },
  {
    id: "mercury",
    name: "Mercury",
    sanskritName: "Budha",
    glyph: "☿",
    tagline: "The Prince of Intellect",
    significations: ["Intellect", "Speech", "Communication", "Commerce", "Wit", "Analysis"],
    description:
      "Budha is the prince of the planetary court and governs intelligence, speech, writing, mathematics, trade and humour. He is the karaka of the rational, discriminating mind (buddhi). A strong Mercury gives eloquence, business acumen, quick learning and adaptability; an afflicted Mercury can cause nervousness, speech difficulties and indecision.",
    remedies: [
      "Chant \"Om Budhaya Namaha\" 108 times on Wednesdays",
      "Recite the Vishnu Sahasranama and worship Lord Vishnu",
      "Wear an emerald (panna) set in gold — only after consulting an astrologer",
      "Donate green moong dal, green vegetables or green cloth on Wednesdays",
      "Feed green fodder to cows",
      "Practise truthful, kind speech and care for sisters and aunts",
    ],
  },
  {
    id: "jupiter",
    name: "Jupiter",
    sanskritName: "Guru (Brihaspati)",
    glyph: "♃",
    tagline: "The Great Benefic",
    significations: ["Wisdom", "Dharma", "Children", "Teachers", "Wealth", "Expansion"],
    description:
      "Guru is the teacher of the gods and the greatest natural benefic. He signifies wisdom, higher knowledge, spirituality, children, fortune, generosity and righteous living (dharma). A strong Jupiter blesses with optimism, prosperity, good counsel and faith; a weak Jupiter can bring over-indulgence, false hope or lack of direction.",
    remedies: [
      "Chant \"Om Gurave Namaha\" or \"Om Brihaspataye Namaha\" 108 times on Thursdays",
      "Fast on Thursdays and worship Lord Vishnu or Guru Dakshinamurthy",
      "Wear a yellow sapphire (pukhraj) set in gold — only after consulting an astrologer",
      "Donate turmeric, chana dal, bananas or yellow cloth on Thursdays",
      "Respect teachers, gurus and elders; serve them sincerely",
      "Study and share spiritual knowledge regularly",
    ],
  },
  {
    id: "venus",
    name: "Venus",
    sanskritName: "Shukra",
    glyph: "♀",
    tagline: "The Teacher of Refinement",
    significations: ["Love & marriage", "Beauty", "Arts", "Luxury", "Vehicles", "Pleasures"],
    description:
      "Shukra is the preceptor of the asuras and the karaka of love, romance, marriage and all forms of beauty and refinement. He governs the arts, music, poetry, luxury, vehicles and worldly comforts. A strong Venus gives charm, artistic talent, harmonious relationships and material enjoyment; an afflicted Venus can bring vanity, excess and relationship troubles.",
    remedies: [
      "Chant \"Om Shukraya Namaha\" 108 times on Fridays",
      "Worship Goddess Lakshmi; offer white flowers",
      "Wear a diamond or white sapphire set in silver or platinum — only after consulting an astrologer",
      "Fast on Fridays and donate white rice, sugar, curd or silver",
      "Respect women and maintain harmony in relationships",
      "Keep your surroundings clean, artistic and beautiful",
    ],
  },
  {
    id: "saturn",
    name: "Saturn",
    sanskritName: "Shani",
    glyph: "♄",
    tagline: "The Lord of Karma",
    significations: ["Discipline", "Karma", "Longevity", "Delays", "Service", "Detachment"],
    description:
      "Shani is the great teacher through time and hardship — the slowest graha and the lord of karma. He signifies discipline, patience, labour, old age, longevity, servants and the masses. A strong Saturn gives perseverance, integrity and lasting achievement earned through effort; an afflicted Saturn brings delays, obstacles, sorrow and lessons that mature the soul.",
    remedies: [
      "Chant \"Om Shanaishcharaya Namaha\" 108 times on Saturdays",
      "Recite the Shani Chalisa or Hanuman Chalisa on Saturdays",
      "Light a sesame-oil lamp under a peepal tree on Saturday evenings",
      "Donate black sesame, mustard oil, iron or black cloth on Saturdays",
      "Serve the poor, the elderly, labourers and the disabled",
      "Wear a blue sapphire (neelam) only after careful astrological testing — it is a powerful stone",
    ],
  },
  {
    id: "rahu",
    name: "Rahu",
    sanskritName: "Rahu (North Node)",
    glyph: "☊",
    tagline: "The Shadow of Desire",
    significations: ["Obsession", "Ambition", "Foreign lands", "Illusion (maya)", "Technology", "Sudden gains"],
    description:
      "Rahu is the shadowy north node of the Moon — a chhaya graha with no physical form. He amplifies worldly desire, ambition and unconventional paths, ruling foreign travel, technology, mass media and sudden, dramatic rises. Rahu can grant extraordinary material success, but also confusion, addiction and illusion when poorly placed.",
    remedies: [
      "Chant \"Om Rahave Namaha\" 108 times, especially during Rahu kala",
      "Worship Goddess Durga or Lord Bhairava",
      "Wear a hessonite garnet (gomed) set in silver — only after consulting an astrologer",
      "Donate blue or black cloth, blankets or coconuts on Saturdays",
      "Help the less fortunate and those outside the mainstream of society",
      "Avoid intoxicants and practise grounding routines like meditation",
    ],
  },
  {
    id: "ketu",
    name: "Ketu",
    sanskritName: "Ketu (South Node)",
    glyph: "☋",
    tagline: "The Flag of Liberation",
    significations: ["Moksha", "Detachment", "Spirituality", "Past karma", "Intuition", "Mysticism"],
    description:
      "Ketu is the south node of the Moon, the headless counterpart of Rahu. He represents detachment, liberation (moksha), past-life karma and deep spiritual insight. Ketu gives psychic intuition, healing ability and disinterest in material show; afflicted, he can bring confusion, isolation or sudden losses that ultimately turn the soul inward.",
    remedies: [
      "Chant \"Om Ketave Namaha\" 108 times",
      "Worship Lord Ganesha, the remover of obstacles",
      "Wear a cat's eye (lehsunia) set in silver — only after consulting an astrologer",
      "Donate multicoloured blankets, sesame or bananas to the needy",
      "Feed stray dogs and care for animals",
      "Devote regular time to meditation and spiritual practice",
    ],
  },
];
