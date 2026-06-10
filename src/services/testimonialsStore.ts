/**
 * User-submitted testimonials persistence backed by localStorage.
 * Seeded samples live in src/data/testimonials.ts and are merged in the UI.
 */
import type { Testimonial } from "../data/testimonials";

const STORAGE_KEY = "thiru-astrology-testimonials";

export function getStoredTestimonials(): Testimonial[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Testimonial[]) : [];
  } catch {
    return [];
  }
}

export function saveTestimonial(
  entry: Omit<Testimonial, "id" | "date" | "seeded">
): Testimonial {
  const full: Testimonial = {
    ...entry,
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    date: new Date().toISOString().slice(0, 10),
  };
  const all = getStoredTestimonials();
  all.unshift(full);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  return full;
}
