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
  /** Mobile number in international format incl. country code, e.g. "+919876543210" */
  mobile: string;
  /** Optional contact email */
  email?: string;
  /** Optional free-text note: what the visitor wants the consultation to cover */
  note?: string;
  /** Appointment date, YYYY-MM-DD (must be a Saturday or Sunday) */
  appointmentDate: string;
  /** Slot start time in 24h HH:MM, e.g. "11:00" or "20:30" */
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
  "20:00",
  "20:30",
  "21:00",
  "21:30",
] as const;

/** Format a 24h "HH:MM" slot as "11:00 AM" / "6:30 PM". */
export function formatSlot(slot: string): string {
  const [h, m] = slot.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${suffix}`;
}

// ---- Time zones ----
// Slots are defined in US Central time (the astrologer's zone). Visitors in
// India see the equivalent IST time alongside, since evening Central slots
// fall on the *next* calendar day in IST.

/** IANA zone the slots are defined in. Follows DST automatically (CST/CDT). */
export const APPOINTMENT_TIME_ZONE = "America/Chicago";
export const IST_TIME_ZONE = "Asia/Kolkata";

/** Minutes that `timeZone` is ahead of UTC at the given instant. */
function tzOffsetMinutes(utcMs: number, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(new Date(utcMs));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const asUtc = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour"),
    get("minute"),
    get("second")
  );
  return (asUtc - utcMs) / 60_000;
}

/** The exact instant a slot starts, treating `dateStr` + `slot` as Central wall time. */
export function slotToDate(dateStr: string, slot: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [h, mi] = slot.split(":").map(Number);
  const naive = Date.UTC(y, m - 1, d, h, mi);
  let utc = naive - tzOffsetMinutes(naive, APPOINTMENT_TIME_ZONE) * 60_000;
  // Second pass in case the first guess straddled a DST switch
  utc = naive - tzOffsetMinutes(utc, APPOINTMENT_TIME_ZONE) * 60_000;
  return new Date(utc);
}

/** "CST" or "CDT", whichever is in effect at the given instant. */
export function centralZoneAbbrev(date: Date): string {
  const part = new Intl.DateTimeFormat("en-US", {
    timeZone: APPOINTMENT_TIME_ZONE,
    timeZoneName: "short",
  })
    .formatToParts(date)
    .find((p) => p.type === "timeZoneName");
  return part?.value ?? "CT";
}

export interface SlotTimes {
  /** e.g. "11:00 AM CDT" */
  central: string;
  /** e.g. "9:30 PM IST" */
  ist: string;
  /** Set only when the IST calendar date differs from the Central date, e.g. "Sun, 28-Sep-2026" */
  istDate?: string;
}

/** Central and IST renderings of a slot on a given date. */
export function describeSlot(dateStr: string, slot: string): SlotTimes {
  const at = slotToDate(dateStr, slot);
  const time = (timeZone: string) =>
    at.toLocaleTimeString("en-US", { timeZone, hour: "numeric", minute: "2-digit" });
  // en-CA yields ISO-style YYYY-MM-DD, handy for comparing calendar dates
  const istDay = at.toLocaleDateString("en-CA", { timeZone: IST_TIME_ZONE });
  return {
    central: `${time(APPOINTMENT_TIME_ZONE)} ${centralZoneAbbrev(at)}`,
    ist: `${time(IST_TIME_ZONE)} IST`,
    istDate:
      istDay === dateStr
        ? undefined
        : `${at.toLocaleDateString("en-US", { timeZone: IST_TIME_ZONE, weekday: "short" })}, ${formatDdMmmYyyy(istDay)}`,
  };
}

/** One-line slot label: "8:00 PM CDT (6:30 AM IST, Sun, 28-Sep-2026)". */
export function formatSlotWithIst(dateStr: string, slot: string): string {
  const { central, ist, istDate } = describeSlot(dateStr, slot);
  return `${central} (${ist}${istDate ? `, ${istDate}` : ""})`;
}

/**
 * Render an ISO timestamp as "27-Sep-2026 10:23 AM CDT (08:53 PM IST)" —
 * used for the "Booked at" line in the notification email.
 */
export function formatTimestampWithIst(iso: string): string {
  const at = new Date(iso);
  const stamp = (timeZone: string) => {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).formatToParts(at);
    const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
    return `${get("day")}-${get("month")}-${get("year")} ${get("hour")}:${get("minute")} ${get("dayPeriod")}`;
  };
  return `${stamp(APPOINTMENT_TIME_ZONE)} ${centralZoneAbbrev(at)} (${stamp(IST_TIME_ZONE)} IST)`;
}

/** Parse "YYYY-MM-DD" as a local date (avoids UTC off-by-one issues). */
export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** Format "YYYY-MM-DD" as "15-May-1990". */
export function formatDdMmmYyyy(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return `${String(d).padStart(2, "0")}-${MONTH_NAMES[m - 1].slice(0, 3)}-${y}`;
}

/** Format a 24h "HH:MM" as "08:30 AM" / "12:05 PM". */
export function formatHhMmAmPm(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${String(hour12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${suffix}`;
}

/**
 * Parse a typed "hh:mm AM/PM" time (e.g. "08:30 AM", "8:30am") into 24h
 * "HH:MM". Only this shape is accepted: 1–2 digit hour (1–12), colon,
 * 2-digit minute, optional space, AM or PM in any case. Returns null otherwise.
 */
export function parseHhMmAmPm(raw: string): string | null {
  const match = raw.trim().match(/^(\d{1,2}):(\d{2})\s*([AaPp])[Mm]$/);
  if (!match) return null;
  const hour12 = Number(match[1]);
  const minute = Number(match[2]);
  if (hour12 < 1 || hour12 > 12 || minute > 59) return null;
  const pm = match[3].toLowerCase() === "p";
  const hour24 = (hour12 % 12) + (pm ? 12 : 0);
  return `${String(hour24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

/**
 * Parse a typed "dd-mmm-yyyy" date (e.g. "15-May-1990") into "YYYY-MM-DD".
 * Only this shape is accepted: 1–2 digit day, hyphen, 3-letter English month
 * (any case), hyphen, 4-digit year. Returns null when the text doesn't match
 * or isn't a real calendar date (e.g. 31-Feb-1990).
 */
export function parseDdMmmYyyy(raw: string): string | null {
  const match = raw.trim().match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/);
  if (!match) return null;
  const typed = match[2].toLowerCase();
  const idx = MONTH_NAMES.findIndex((name) => name.slice(0, 3).toLowerCase() === typed);
  if (idx < 0) return null;
  const d = Number(match[1]);
  const m = idx + 1;
  const y = Number(match[3]);
  // new Date() silently rolls 31-Feb over to 3-Mar — reject anything that moved
  const probe = new Date(y, m - 1, d);
  if (probe.getFullYear() !== y || probe.getMonth() !== m - 1 || probe.getDate() !== d) {
    return null;
  }
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
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
