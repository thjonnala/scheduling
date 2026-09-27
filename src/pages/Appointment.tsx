import { useMemo, useState, type FormEvent } from "react";
import SectionHeading from "../components/SectionHeading";
import {
  SLOT_TIMES,
  describeSlot,
  formatDdMmmYyyy,
  formatHhMmAmPm,
  formatSlotWithIst,
  getBookedSlots,
  isWeekend,
  parseDdMmmYyyy,
  parseHhMmAmPm,
  parseLocalDate,
  saveBooking,
  upcomingWeekendDates,
  type Booking,
} from "../services/bookings";
import {
  BOOKING_EMAIL_TO,
  buildMailtoLink,
  sendBookingEmail,
} from "../services/emailService";

interface FormState {
  fullName: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  mobile: string;
  email: string;
  note: string;
  /** ISO YYYY-MM-DD once the typed/picked date parses; "" otherwise */
  appointmentDate: string;
  /** What the visitor sees in the date box, e.g. "03-Oct-2026" */
  appointmentDateText: string;
  slot: string;
}

const NOTE_MAX_LENGTH = 1000;

const emptyForm: FormState = {
  fullName: "",
  dateOfBirth: "",
  timeOfBirth: "",
  placeOfBirth: "",
  mobile: "",
  email: "",
  note: "",
  appointmentDate: "",
  appointmentDateText: "",
  slot: "",
};

function todayStr(): string {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(
    t.getDate()
  ).padStart(2, "0")}`;
}

/** Strip spaces, dashes, dots and parentheses so "+91 98765-43210" → "+919876543210". */
function normalizeMobile(raw: string): string {
  return raw.replace(/[\s().-]/g, "");
}

/** E.164: leading "+", then 7–15 digits with a non-zero first digit. */
function isValidMobile(normalized: string): boolean {
  return /^\+[1-9]\d{6,14}$/.test(normalized);
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/** "03-Oct-2026 (Saturday)" */
function formatDateWithWeekday(dateStr: string): string {
  const weekday = parseLocalDate(dateStr).toLocaleDateString("en-US", { weekday: "long" });
  return `${formatDdMmmYyyy(dateStr)} (${weekday})`;
}

/** "Sat, 03-Oct-2026" — compact form for the quick-pick chips */
function formatChipDate(dateStr: string): string {
  const weekday = parseLocalDate(dateStr).toLocaleDateString("en-US", { weekday: "short" });
  return `${weekday}, ${formatDdMmmYyyy(dateStr)}`;
}

/**
 * Weekend-only appointment booking. Slots: 11:00–13:00 and 20:00–22:00 in
 * 30-minute windows. Bookings persist to localStorage (demo only — no backend).
 */
export default function Appointment() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [confirmed, setConfirmed] = useState<Booking | null>(null);
  // Status of the notification email relayed to the astrologer
  const [emailStatus, setEmailStatus] = useState<"sending" | "sent" | "failed" | null>(null);
  // Bump to re-read booked slots from localStorage after a save
  const [bookingVersion, setBookingVersion] = useState(0);

  const weekendChips = useMemo(() => upcomingWeekendDates(6), []);

  const bookedSlots = useMemo(
    () => (form.appointmentDate ? getBookedSlots(form.appointmentDate) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form.appointmentDate, bookingVersion]
  );

  const set = (field: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const flagWeekday = (iso: string) => {
    if (iso && !isWeekend(iso)) {
      setErrors((e) => ({
        ...e,
        appointmentDate: "Appointments are available only on Saturdays and Sundays.",
      }));
    } else {
      setErrors((e) => ({ ...e, appointmentDate: undefined }));
    }
  };

  /** Quick-pick chip: a known-good ISO date. */
  const handleDateChange = (iso: string) => {
    setForm((f) => ({
      ...f,
      appointmentDate: iso,
      appointmentDateText: formatDdMmmYyyy(iso),
      slot: "",
    }));
    flagWeekday(iso);
  };

  /** Typed date: keep the raw text, and the ISO form only once it parses. */
  const handleDateTextChange = (text: string) => {
    const iso = parseDdMmmYyyy(text) ?? "";
    setForm((f) => ({ ...f, appointmentDate: iso, appointmentDateText: text, slot: "" }));
    flagWeekday(iso);
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.fullName.trim()) next.fullName = "Please enter your full name.";
    const dob = parseDdMmmYyyy(form.dateOfBirth);
    if (!form.dateOfBirth.trim()) next.dateOfBirth = "Please enter your date of birth.";
    else if (!dob) next.dateOfBirth = "Please enter your date of birth as dd-mmm-yyyy, e.g. 15-May-1990.";
    else if (dob > todayStr()) next.dateOfBirth = "Date of birth must be in the past.";
    else if (dob < "1900-01-01") next.dateOfBirth = "Please check the year of birth.";
    if (!form.timeOfBirth.trim()) next.timeOfBirth = "Please enter your time of birth.";
    else if (!parseHhMmAmPm(form.timeOfBirth))
      next.timeOfBirth = "Please enter your time of birth as hh:mm AM/PM, e.g. 08:30 AM.";
    if (!form.placeOfBirth.trim()) next.placeOfBirth = "Please enter your place of birth.";
    const mobile = normalizeMobile(form.mobile);
    if (!mobile) next.mobile = "Please enter your mobile number.";
    else if (!mobile.startsWith("+"))
      next.mobile = "Please include your country code, starting with + (e.g. +91 98765 43210).";
    else if (!isValidMobile(mobile))
      next.mobile = "Please enter a valid mobile number with country code (e.g. +91 98765 43210).";
    const email = form.email.trim();
    if (email && !isValidEmail(email)) next.email = "Please enter a valid email address.";
    if (!form.appointmentDate)
      next.appointmentDate = form.appointmentDateText.trim()
        ? "Please enter the date as dd-mmm-yyyy, e.g. 03-Oct-2026."
        : "Please choose an appointment date.";
    else if (!isWeekend(form.appointmentDate))
      next.appointmentDate = "Appointments are available only on Saturdays and Sundays.";
    else if (form.appointmentDate < todayStr())
      next.appointmentDate = "Please choose an upcoming date.";
    if (!form.slot) next.slot = "Please select a time slot.";
    else if (bookedSlots.includes(form.slot)) next.slot = "That slot was just booked — please pick another.";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const booking = saveBooking({
      fullName: form.fullName.trim(),
      // validate() has already confirmed this parses
      dateOfBirth: parseDdMmmYyyy(form.dateOfBirth)!,
      timeOfBirth: parseHhMmAmPm(form.timeOfBirth)!,
      placeOfBirth: form.placeOfBirth.trim(),
      mobile: normalizeMobile(form.mobile),
      email: form.email.trim() || undefined,
      note: form.note.trim() || undefined,
      appointmentDate: form.appointmentDate,
      slot: form.slot,
    });
    setBookingVersion((v) => v + 1);
    setConfirmed(booking);

    // Relay the booking to the astrologer's email (best effort — the local
    // booking is already saved either way)
    setEmailStatus("sending");
    sendBookingEmail(booking)
      .then(() => setEmailStatus("sent"))
      .catch(() => setEmailStatus("failed"));
  };

  const inputClass = (hasError: boolean) =>
    `w-full rounded-lg border bg-white px-4 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 ${
      hasError
        ? "border-rose-400 focus:border-rose-400 focus:ring-rose-400"
        : "border-gray-300 focus:border-gray-500 focus:ring-gray-500"
    }`;

  // ---- Confirmation view ----
  if (confirmed) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <SectionHeading title="Booking Confirmed 🙏" />
        <div className="rounded-2xl border border-gray-300 bg-white p-6 shadow-md sm:p-8">
          <p className="text-gray-700">
            Thank you, <span className="font-semibold text-gray-900">{confirmed.fullName}</span>.
            Your consultation is scheduled for:
          </p>
          <p className="mt-4 font-display text-2xl text-gray-900">
            {formatDateWithWeekday(confirmed.appointmentDate)}
          </p>
          <p className="mt-1 text-xl text-gray-700">
            {formatSlotWithIst(confirmed.appointmentDate, confirmed.slot)} — 30 minutes
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Date and time above are in US Central; the IST equivalent is shown in brackets.
          </p>

          <dl className="mt-6 grid grid-cols-1 gap-3 border-t border-gray-200 pt-5 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-gray-500">Date of birth</dt>
              <dd className="text-gray-700">{formatDdMmmYyyy(confirmed.dateOfBirth)}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Time of birth</dt>
              <dd className="text-gray-700">{formatHhMmAmPm(confirmed.timeOfBirth)}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-gray-500">Place of birth</dt>
              <dd className="text-gray-700">{confirmed.placeOfBirth}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Mobile</dt>
              <dd className="text-gray-700">{confirmed.mobile}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Email</dt>
              <dd className="text-gray-700">{confirmed.email ?? "Not provided"}</dd>
            </div>
            {confirmed.note && (
              <div className="sm:col-span-2">
                <dt className="text-gray-500">Note to astrologer</dt>
                <dd className="whitespace-pre-line text-gray-700">{confirmed.note}</dd>
              </div>
            )}
          </dl>

          {/* Email relay status */}
          <div className="mt-5 text-sm" role="status">
            {emailStatus === "sending" && (
              <p className="text-gray-600">Sending your booking to Thiru…</p>
            )}
            {emailStatus === "sent" && (
              <p className="text-emerald-600">
                ✓ Your booking details were emailed to {BOOKING_EMAIL_TO}.
              </p>
            )}
            {emailStatus === "failed" && (
              <p className="text-rose-600">
                We couldn't email your booking automatically.{" "}
                <a href={buildMailtoLink(confirmed)} className="underline">
                  Click here to send it from your own email
                </a>
                .
              </p>
            )}
          </div>

          <p className="mt-4 rounded-lg border border-gray-200 bg-gray-100 p-3 text-xs text-gray-500">
            Demo booking only — saved in your browser's local storage. No payment was
            taken and no real appointment exists on a server.
          </p>

          <button
            type="button"
            onClick={() => {
              setForm(emptyForm);
              setConfirmed(null);
              setEmailStatus(null);
            }}
            className="mt-6 rounded-full bg-gray-900 px-6 py-2.5 font-semibold text-white transition hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
          >
            Book Another Appointment
          </button>
        </div>
      </div>
    );
  }

  // ---- Booking form ----
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <SectionHeading
        title="Schedule an Appointment"
        subtitle="Consultations are held on weekends only — Saturday and Sunday — between 11:00 AM–1:00 PM and 8:00 PM–10:00 PM US Central time (CST/CDT), in 30-minute slots. The matching IST time is shown in brackets."
      />

      <p className="mb-6 rounded-lg border border-gray-300 bg-gray-50 p-3 text-center text-sm text-gray-600">
        ⚠️ This is a <strong>demo booking form</strong> — no payment, no real backend.
        Bookings are saved only in your browser.
      </p>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Birth details */}
        <fieldset className="rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:p-6">
          <legend className="px-2 font-display text-lg text-gray-900">Your Birth Details</legend>

          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="mb-1 block text-sm text-gray-600">
                Full name <span className="text-rose-600">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                value={form.fullName}
                onChange={(e) => set("fullName", e.target.value)}
                placeholder="e.g. Lakshmi Narayanan"
                aria-invalid={!!errors.fullName}
                aria-describedby={errors.fullName ? "fullName-error" : undefined}
                className={inputClass(!!errors.fullName)}
              />
              {errors.fullName && (
                <p id="fullName-error" className="mt-1 text-sm text-rose-600" role="alert">
                  {errors.fullName}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="dateOfBirth" className="mb-1 block text-sm text-gray-600">
                  Date of birth <span className="text-rose-600">*</span>
                </label>
                <input
                  id="dateOfBirth"
                  type="text"
                  autoComplete="off"
                  maxLength={20}
                  value={form.dateOfBirth}
                  onChange={(e) => set("dateOfBirth", e.target.value)}
                  // Tidy "5-may-1990" to "05-May-1990" once the visitor leaves the field
                  onBlur={() => {
                    const iso = parseDdMmmYyyy(form.dateOfBirth);
                    if (iso) set("dateOfBirth", formatDdMmmYyyy(iso));
                  }}
                  placeholder="dd-mmm-yyyy, e.g. 15-May-1990"
                  aria-invalid={!!errors.dateOfBirth}
                  aria-describedby={errors.dateOfBirth ? "dateOfBirth-error" : "dateOfBirth-hint"}
                  className={inputClass(!!errors.dateOfBirth)}
                />
                {errors.dateOfBirth ? (
                  <p id="dateOfBirth-error" className="mt-1 text-sm text-rose-600" role="alert">
                    {errors.dateOfBirth}
                  </p>
                ) : (
                  <p id="dateOfBirth-hint" className="mt-1 text-xs text-gray-500">
                    Format: dd-mmm-yyyy (e.g. 15-May-1990).
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="timeOfBirth" className="mb-1 block text-sm text-gray-600">
                  Time of birth <span className="text-rose-600">*</span>
                </label>
                <input
                  id="timeOfBirth"
                  type="text"
                  autoComplete="off"
                  maxLength={10}
                  value={form.timeOfBirth}
                  onChange={(e) => set("timeOfBirth", e.target.value)}
                  // Tidy "8:30am" to "08:30 AM" once the visitor leaves the field
                  onBlur={() => {
                    const hhmm = parseHhMmAmPm(form.timeOfBirth);
                    if (hhmm) set("timeOfBirth", formatHhMmAmPm(hhmm));
                  }}
                  placeholder="hh:mm AM/PM, e.g. 08:30 AM"
                  aria-invalid={!!errors.timeOfBirth}
                  aria-describedby={errors.timeOfBirth ? "timeOfBirth-error" : "timeOfBirth-hint"}
                  className={inputClass(!!errors.timeOfBirth)}
                />
                {errors.timeOfBirth ? (
                  <p id="timeOfBirth-error" className="mt-1 text-sm text-rose-600" role="alert">
                    {errors.timeOfBirth}
                  </p>
                ) : (
                  <p id="timeOfBirth-hint" className="mt-1 text-xs text-gray-500">
                    Format: hh:mm AM/PM (e.g. 08:30 AM).
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="placeOfBirth" className="mb-1 block text-sm text-gray-600">
                Place of birth <span className="text-rose-600">*</span>
              </label>
              <input
                id="placeOfBirth"
                type="text"
                value={form.placeOfBirth}
                onChange={(e) => set("placeOfBirth", e.target.value)}
                placeholder="City, State, Country"
                aria-invalid={!!errors.placeOfBirth}
                aria-describedby={errors.placeOfBirth ? "placeOfBirth-error" : undefined}
                className={inputClass(!!errors.placeOfBirth)}
              />
              {errors.placeOfBirth && (
                <p id="placeOfBirth-error" className="mt-1 text-sm text-rose-600" role="alert">
                  {errors.placeOfBirth}
                </p>
              )}
            </div>
          </div>
        </fieldset>

        {/* Contact details */}
        <fieldset className="rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:p-6">
          <legend className="px-2 font-display text-lg text-gray-900">Your Contact Details</legend>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="mobile" className="mb-1 block text-sm text-gray-600">
                Mobile number (with country code) <span className="text-rose-600">*</span>
              </label>
              <input
                id="mobile"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={form.mobile}
                onChange={(e) => set("mobile", e.target.value)}
                placeholder="+91 98765 43210"
                aria-invalid={!!errors.mobile}
                aria-describedby={errors.mobile ? "mobile-error" : "mobile-hint"}
                className={inputClass(!!errors.mobile)}
              />
              {errors.mobile ? (
                <p id="mobile-error" className="mt-1 text-sm text-rose-600" role="alert">
                  {errors.mobile}
                </p>
              ) : (
                <p id="mobile-hint" className="mt-1 text-xs text-gray-500">
                  Start with your country code, e.g. +91 (India), +1 (USA/Canada), +44 (UK).
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm text-gray-600">
                Email ID <span className="text-gray-400">(optional)</span>
              </label>
              <input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={inputClass(!!errors.email)}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-rose-600" role="alert">
                  {errors.email}
                </p>
              )}
            </div>
          </div>
        </fieldset>

        {/* Note to astrologer */}
        <fieldset className="rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:p-6">
          <legend className="px-2 font-display text-lg text-gray-900">Note to Astrologer</legend>

          <label htmlFor="note" className="mb-1 block text-sm text-gray-600">
            What would you like to know? <span className="text-gray-400">(optional)</span>
          </label>
          <p id="note-hint" className="mb-2 text-xs text-gray-500">
            Describe what you'd like the consultation to focus on — for example: career, marriage,
            love life, married life, kids, financial problems, buying property, about your partner,
            health, onsite opportunities, etc. The more specific, the better Thiru can prepare.
          </p>
          <textarea
            id="note"
            rows={4}
            maxLength={NOTE_MAX_LENGTH}
            value={form.note}
            onChange={(e) => set("note", e.target.value)}
            placeholder="e.g. Can you provide a forecast on my love life, marriage compatibility, children, and my timeline for finding a job with onsite opportunities?"
            aria-describedby="note-hint"
            className={`${inputClass(false)} resize-y`}
          />
          <p className="mt-1 text-right text-xs text-gray-400" aria-live="polite">
            {form.note.length}/{NOTE_MAX_LENGTH}
          </p>
        </fieldset>

        {/* Date & slot */}
        <fieldset className="rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:p-6">
          <legend className="px-2 font-display text-lg text-gray-900">Pick a Weekend Date &amp; Slot</legend>

          <div>
            <label htmlFor="appointmentDate" className="mb-1 block text-sm text-gray-600">
              Appointment date (weekend only, US Central) <span className="text-rose-600">*</span>
            </label>
            <input
              id="appointmentDate"
              type="text"
              autoComplete="off"
              maxLength={20}
              value={form.appointmentDateText}
              onChange={(e) => handleDateTextChange(e.target.value)}
              onBlur={() => {
                if (form.appointmentDate) {
                  setForm((f) => ({ ...f, appointmentDateText: formatDdMmmYyyy(f.appointmentDate) }));
                }
              }}
              placeholder="dd-mmm-yyyy, e.g. 03-Oct-2026 — or tap a date below"
              aria-invalid={!!errors.appointmentDate}
              aria-describedby={errors.appointmentDate ? "appointmentDate-error" : undefined}
              className={inputClass(!!errors.appointmentDate)}
            />
            {errors.appointmentDate && (
              <p id="appointmentDate-error" className="mt-1 text-sm text-rose-600" role="alert">
                {errors.appointmentDate}
              </p>
            )}

            {/* Quick-pick upcoming weekends */}
            <p className="mt-3 text-xs text-gray-500">Quick pick — upcoming weekends:</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {weekendChips.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => handleDateChange(d)}
                  aria-pressed={form.appointmentDate === d}
                  className={`rounded-full px-3 py-1 text-xs transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 ${
                    form.appointmentDate === d
                      ? "bg-gray-900 text-white"
                      : "border border-gray-300 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  {formatChipDate(d)}
                </button>
              ))}
            </div>
          </div>

          {/* Slot grid — shown once a valid weekend date is chosen */}
          {form.appointmentDate && isWeekend(form.appointmentDate) && (
            <div className="mt-6">
              <p className="mb-2 text-sm text-gray-600">
                Available 30-minute slots for{" "}
                <span className="text-gray-900">{formatDateWithWeekday(form.appointmentDate)}</span>{" "}
                (US Central) — IST equivalent in brackets:
              </p>
              <div
                className="grid grid-cols-2 gap-3 sm:grid-cols-4"
                role="radiogroup"
                aria-label="Available time slots"
              >
                {SLOT_TIMES.map((slot) => {
                  const booked = bookedSlots.includes(slot);
                  const selected = form.slot === slot;
                  const times = describeSlot(form.appointmentDate, slot);
                  return (
                    <button
                      key={slot}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      disabled={booked}
                      onClick={() => set("slot", slot)}
                      className={`rounded-lg px-3 py-2.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 ${
                        booked
                          ? "cursor-not-allowed border border-gray-200 bg-gray-100 text-gray-400 line-through"
                          : selected
                            ? "bg-gray-900 text-white shadow-md"
                            : "border border-gray-300 text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      <span className="block">{times.central}</span>
                      <span
                        className={`block text-xs font-normal ${
                          selected ? "text-gray-300" : booked ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        ({times.ist}
                        {times.istDate && `, ${times.istDate}`})
                      </span>
                      {booked && <span className="sr-only"> (already booked)</span>}
                    </button>
                  );
                })}
              </div>
              {errors.slot && (
                <p className="mt-2 text-sm text-rose-600" role="alert">
                  {errors.slot}
                </p>
              )}
              <p className="mt-3 text-xs text-gray-400">
                Greyed-out slots are already booked for this date. Evening Central slots fall on
                the next calendar day in IST — the IST date is shown where it differs.
              </p>
            </div>
          )}
        </fieldset>

        <button
          type="submit"
          className="w-full rounded-full bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
}
