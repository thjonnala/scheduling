/**
 * The 12 moon signs (rashis) of Vedic astrology.
 *
 * `id` doubles as the sign key sent to the third-party horoscope API
 * (which expects Western/tropical sign names in lowercase English).
 */
export type Element = "Fire" | "Earth" | "Air" | "Water";

export interface Rashi {
  /** Lowercase Western sign name — also used as the horoscope API key */
  id: string;
  /** Western name */
  name: string;
  /** Sanskrit name */
  sanskritName: string;
  /** Ruling planet (lord) */
  lord: string;
  element: Element;
  /** Zodiac glyph */
  symbol: string;
  /** Behaviour / personality description */
  description: string;
  /**
   * Local yearly outlook. The free horoscope API offers daily/weekly/monthly
   * but no yearly endpoint, so the Yearly tab renders this curated text.
   */
  yearlyOutlook: string;
}

export const rashis: Rashi[] = [
  {
    id: "aries",
    name: "Aries",
    sanskritName: "Mesha",
    lord: "Mars (Mangal)",
    element: "Fire",
    symbol: "♈",
    description:
      "Mesha natives are pioneering, courageous and direct. Ruled by fiery Mars, they act first and think later, thriving on challenge and competition. Natural leaders with abundant energy, they can be impatient and impulsive but are honest, protective and quick to forgive.",
    yearlyOutlook:
      "A year of bold beginnings. Your Mars-driven initiative opens new doors in career and personal ventures — channel the fire with patience. Mid-year favours property and family matters; guard against haste in financial decisions. Regular physical activity keeps your energy balanced.",
  },
  {
    id: "taurus",
    name: "Taurus",
    sanskritName: "Vrishabha",
    lord: "Venus (Shukra)",
    element: "Earth",
    symbol: "♉",
    description:
      "Vrishabha natives are steady, patient and devoted to comfort and beauty. Ruled by Venus, they love good food, art and security, and build wealth slowly and surely. Loyal and dependable, they can be stubborn once their mind is set, but their calm persistence outlasts every storm.",
    yearlyOutlook:
      "Stability and steady gains define this year. Venus blesses finances and relationships — a good period for savings, property and long-term commitments. Avoid rigidity when circumstances ask for change in the third quarter. Creative pursuits bring unexpected recognition.",
  },
  {
    id: "gemini",
    name: "Gemini",
    sanskritName: "Mithuna",
    lord: "Mercury (Budha)",
    element: "Air",
    symbol: "♊",
    description:
      "Mithuna natives are curious, witty and endlessly communicative. Ruled by Mercury, they learn fast, juggle many interests and excel in writing, trade and networking. Versatile and youthful, they may scatter their energy, but their adaptable mind finds a clever way through any situation.",
    yearlyOutlook:
      "A year rich in learning, travel and new connections. Mercury sharpens your communication — favourable for studies, writing, business deals and skill upgrades. Focus is your challenge: finish what you start. Late in the year, a mentor or elder brings valuable guidance.",
  },
  {
    id: "cancer",
    name: "Cancer",
    sanskritName: "Karka",
    lord: "Moon (Chandra)",
    element: "Water",
    symbol: "♋",
    description:
      "Karka natives are nurturing, intuitive and deeply attached to home and family. Ruled by the Moon, their moods ebb and flow like the tides, giving them remarkable empathy and memory. Protective and loyal, they may retreat into their shell when hurt, but their care for loved ones never wavers.",
    yearlyOutlook:
      "Emotional growth and domestic happiness are highlighted. The Moon favours home improvements, family bonds and inner healing this year. Career advances come through empathy and teamwork rather than confrontation. Practise grounding routines to steady fluctuating moods.",
  },
  {
    id: "leo",
    name: "Leo",
    sanskritName: "Simha",
    lord: "Sun (Surya)",
    element: "Fire",
    symbol: "♌",
    description:
      "Simha natives are regal, warm-hearted and born to lead. Ruled by the Sun, they radiate confidence, generosity and creative flair, and they thrive on appreciation. Proud and dignified, they can be sensitive to criticism, yet their loyalty and courage make them magnificent friends and protectors.",
    yearlyOutlook:
      "A year of visibility and leadership. The Sun illuminates your career house — promotions, recognition and creative success are within reach. Balance pride with humility in relationships, especially mid-year. Health improves with consistent routine and time in the morning sun.",
  },
  {
    id: "virgo",
    name: "Virgo",
    sanskritName: "Kanya",
    lord: "Mercury (Budha)",
    element: "Earth",
    symbol: "♍",
    description:
      "Kanya natives are precise, analytical and quietly helpful. Ruled by Mercury, they notice every detail, excel in service, health and craft, and hold themselves to high standards. Modest and practical, they can slip into worry or over-criticism, but their sincere desire to improve things makes them invaluable.",
    yearlyOutlook:
      "Diligence pays dividends this year. Mercury rewards organised effort — excellent for health regimens, debt clearance and professional certifications. Don't let perfectionism delay opportunities in the second half. Service to others brings unexpected doors of fortune.",
  },
  {
    id: "libra",
    name: "Libra",
    sanskritName: "Tula",
    lord: "Venus (Shukra)",
    element: "Air",
    symbol: "♎",
    description:
      "Tula natives are charming, diplomatic and devoted to fairness. Ruled by Venus, they seek harmony in relationships, beauty in surroundings and balance in every decision. Sociable peace-makers, they may waver when forced to choose, but their grace and sense of justice win lasting allies.",
    yearlyOutlook:
      "Partnerships take centre stage. Venus favours marriage, collaborations and artistic ventures this year. Legal and financial matters resolve in your favour with patient negotiation. Decisiveness is your growth edge — commit fully once the scales have weighed.",
  },
  {
    id: "scorpio",
    name: "Scorpio",
    sanskritName: "Vrishchika",
    lord: "Mars (Mangal)",
    element: "Water",
    symbol: "♏",
    description:
      "Vrishchika natives are intense, magnetic and profoundly resilient. Ruled by Mars, they feel everything deeply, keep their own counsel and transform through every crisis. Fiercely loyal and intuitive, they can be secretive or unforgiving, but their determination to rise renewed is unmatched.",
    yearlyOutlook:
      "A transformative year of endings and powerful new beginnings. Mars fuels research, occult study and strategic career moves. Old emotional baggage asks to be released — healing work succeeds now. Joint finances and inheritance matters turn favourable by year's end.",
  },
  {
    id: "sagittarius",
    name: "Sagittarius",
    sanskritName: "Dhanu",
    lord: "Jupiter (Guru)",
    element: "Fire",
    symbol: "♐",
    description:
      "Dhanu natives are optimistic, philosophical and freedom-loving. Ruled by Jupiter, they aim their arrows at higher knowledge, travel and truth, and they speak with disarming frankness. Generous and jovial, they can promise more than they deliver, but their faith and enthusiasm lift everyone around them.",
    yearlyOutlook:
      "Expansion is the theme — Jupiter blesses higher education, long-distance travel and spiritual growth. Teaching, publishing and advisory roles flourish. Watch over-commitment mid-year; your word is your bond. Luck favours the well-prepared optimist.",
  },
  {
    id: "capricorn",
    name: "Capricorn",
    sanskritName: "Makara",
    lord: "Saturn (Shani)",
    element: "Earth",
    symbol: "♑",
    description:
      "Makara natives are disciplined, ambitious and built for the long climb. Ruled by Saturn, they value duty, structure and earned achievement, maturing like fine wine with age. Reserved and pragmatic, they can seem stern, but beneath the surface lies dry humour and unshakable devotion to those they love.",
    yearlyOutlook:
      "Steady, structural progress. Saturn rewards your patience with consolidation in career and authority. Responsibilities increase — so does respect. Make time for rest and joints/bone health. A long-pursued goal materialises in the final quarter through sheer persistence.",
  },
  {
    id: "aquarius",
    name: "Aquarius",
    sanskritName: "Kumbha",
    lord: "Saturn (Shani)",
    element: "Air",
    symbol: "♒",
    description:
      "Kumbha natives are visionary, humanitarian and proudly unconventional. Ruled by Saturn, they combine disciplined thought with radical ideals, serving causes larger than themselves. Detached yet friendly, they may seem aloof in close bonds, but their loyalty to friends and principles runs deep.",
    yearlyOutlook:
      "A year of networks and noble causes. Saturn strengthens gains through community, technology and large organisations. Innovative ideas find backing — present them with structure. Old friendships revive; new alliances shape your next five years. Guard against emotional detachment at home.",
  },
  {
    id: "pisces",
    name: "Pisces",
    sanskritName: "Meena",
    lord: "Jupiter (Guru)",
    element: "Water",
    symbol: "♓",
    description:
      "Meena natives are compassionate, imaginative and spiritually attuned. Ruled by Jupiter, they swim between the material and mystical worlds, gifted in art, healing and devotion. Gentle and selfless, they can drift into escapism, but their boundless empathy makes them the zodiac's natural healers.",
    yearlyOutlook:
      "Intuition and creativity peak this year. Jupiter blesses spiritual practice, artistic work and acts of service. Financial clarity improves once you set gentle boundaries. A pilgrimage or retreat mid-year proves deeply renewing. Trust your dreams — they carry guidance now.",
  },
];
