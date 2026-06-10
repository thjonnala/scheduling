/** Seeded sample testimonials shown alongside user-submitted ones. */
export interface Testimonial {
  id: string;
  name: string;
  /** 1–5 stars */
  rating: number;
  comment: string;
  /** ISO date string */
  date: string;
  /** True for the built-in samples (not stored in localStorage) */
  seeded?: boolean;
}

export const seededTestimonials: Testimonial[] = [
  {
    id: "seed-1",
    name: "Priya Raman",
    rating: 5,
    comment:
      "Thiru's reading of my birth chart was astonishingly accurate. His explanation of my Shani dasha gave me clarity and peace of mind during a difficult career transition.",
    date: "2026-03-14",
    seeded: true,
  },
  {
    id: "seed-2",
    name: "Arjun Krishnan",
    rating: 5,
    comment:
      "We consulted for our daughter's marriage matching. The nakshatra compatibility analysis was thorough and explained in simple terms. Highly recommended.",
    date: "2026-04-02",
    seeded: true,
  },
  {
    id: "seed-3",
    name: "Meena Subramaniam",
    rating: 4,
    comment:
      "Very insightful session on my Rahu-Ketu axis. The remedies suggested were practical and rooted in tradition. Booking the weekend slot was easy.",
    date: "2026-05-10",
    seeded: true,
  },
  {
    id: "seed-4",
    name: "David Chen",
    rating: 5,
    comment:
      "As a newcomer to Vedic astrology, I appreciated how patiently every concept — rashi, nakshatra, dasha — was explained. A genuinely enlightening hour.",
    date: "2026-05-28",
    seeded: true,
  },
];
