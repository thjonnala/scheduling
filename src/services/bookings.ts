/**
 * Demo booking persistence backed by localStorage (no real backend).
 */
export interface Booking {
  id: string;
  fullName: string;
  /** YYYY-MM-DD */
  dateOfBirth: string;
  /** HH:MM */
  timeOfBirth: string;
  placeOfBirth: string;
  /** Appointment date, YYYY-MM-DD (must be a Saturday or Sunday) */
  appointmentDate: string;
  /** Slot start time in 24h HH:MM, e.g. "11:00" or "18:30" */
  slot: string;
  /** ISO timestamp of when the booking was made */
  createdAt: string;
}

const STORAGE_KEY = "thiru-astrology-bookings";

/** All bookable 30-minute slot start times (24h clock). */
export const SLOT_TIMES = [
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
] as const;

/** Format a 24h "HH:MM" slot as "11:00 AM" / "6:30 PM". */
export function formatSlot(slot: string): string {
  const [h, m] = slot.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** Parse "YYYY-MM-DD" as a local date (avoids UTC off-by-one issues). */
export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Appointments are available only on Saturdays and Sundays. */
export function isWeekend(dateStr: string): boolean {
  const day = parseLocalDate(dateStr).getDay();
  return day === 0 || day === 6;
}

/** The next `count` weekend dates (today included if it's a weekend), as YYYY-MM-DD. */
export function upcomingWeekendDates(count: number): string[] {
  const dates: string[] = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  while (dates.length < count) {
    const day = cursor.getDay();
    if (day === 0 || day === 6) {
      const y = cursor.getFullYear();
      const m = String(cursor.getMonth() + 1).padStart(2, "0");
      const d = String(cursor.getDate()).padStart(2, "0");
      dates.push(`${y}-${m}-${d}`);
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

export function getBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Booking[]) : [];
  } catch {
    return [];
  }
}

/** Slot start times already booked for a given appointment date. */
export function getBookedSlots(appointmentDate: string): string[] {
  return getBookings()
    .filter((b) => b.appointmentDate === appointmentDate)
    .map((b) => b.slot);
}

export function saveBooking(
  booking: Omit<Booking, "id" | "createdAt">
): Booking {
  const full: Booking = {
    ...booking,
    id: `bk-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  const all = getBookings();
  all.push(full);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  return full;
}
