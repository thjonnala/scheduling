import { useMemo, useState, type FormEvent } from "react";
import SectionHeading from "../components/SectionHeading";
import {
  SLOT_TIMES,
  formatSlot,
  getBookedSlots,
  isWeekend,
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
  appointmentDate: string;
  slot: string;
}

const emptyForm: FormState = {
  fullName: "",
  dateOfBirth: "",
  timeOfBirth: "",
  placeOfBirth: "",
  appointmentDate: "",
  slot: "",
};

function todayStr(): string {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(
    t.getDate()
  ).padStart(2, "0")}`;
}

function formatLongDate(dateStr: string): string {
  return parseLocalDate(dateStr).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Weekend-only appointment booking. Slots: 11:00–13:00 and 18:00–20:00 in
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

  const handleDateChange = (value: string) => {
    setForm((f) => ({ ...f, appointmentDate: value, slot: "" }));
    if (value && !isWeekend(value)) {
      setErrors((e) => ({
        ...e,
        appointmentDate: "Appointments are available only on Saturdays and Sundays.",
      }));
    } else {
      setErrors((e) => ({ ...e, appointmentDate: undefined }));
    }
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.fullName.trim()) next.fullName = "Please enter your full name.";
    if (!form.dateOfBirth) next.dateOfBirth = "Please enter your date of birth.";
    else if (form.dateOfBirth > todayStr()) next.dateOfBirth = "Date of birth must be in the past.";
    if (!form.timeOfBirth) next.timeOfBirth = "Please enter your time of birth.";
    if (!form.placeOfBirth.trim()) next.placeOfBirth = "Please enter your place of birth.";
    if (!form.appointmentDate) next.appointmentDate = "Please choose an appointment date.";
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
      dateOfBirth: form.dateOfBirth,
      timeOfBirth: form.timeOfBirth,
      placeOfBirth: form.placeOfBirth.trim(),
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
            {formatLongDate(confirmed.appointmentDate)}
          </p>
          <p className="mt-1 text-xl text-gray-700">{formatSlot(confirmed.slot)} (30 minutes)</p>

          <dl className="mt-6 grid grid-cols-1 gap-3 border-t border-gray-200 pt-5 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-gray-500">Date of birth</dt>
              <dd className="text-gray-700">{formatLongDate(confirmed.dateOfBirth)}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Time of birth</dt>
              <dd className="text-gray-700">{confirmed.timeOfBirth}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-gray-500">Place of birth</dt>
              <dd className="text-gray-700">{confirmed.placeOfBirth}</dd>
            </div>
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
        subtitle="Consultations are held on weekends only — Saturday and Sunday — between 11:00 AM–1:00 PM and 6:00 PM–8:00 PM, in 30-minute slots."
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
                  type="date"
                  max={todayStr()}
                  value={form.dateOfBirth}
                  onChange={(e) => set("dateOfBirth", e.target.value)}
                  aria-invalid={!!errors.dateOfBirth}
                  aria-describedby={errors.dateOfBirth ? "dateOfBirth-error" : undefined}
                  className={inputClass(!!errors.dateOfBirth)}
                />
                {errors.dateOfBirth && (
                  <p id="dateOfBirth-error" className="mt-1 text-sm text-rose-600" role="alert">
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="timeOfBirth" className="mb-1 block text-sm text-gray-600">
                  Time of birth <span className="text-rose-600">*</span>
                </label>
                <input
                  id="timeOfBirth"
                  type="time"
                  value={form.timeOfBirth}
                  onChange={(e) => set("timeOfBirth", e.target.value)}
                  aria-invalid={!!errors.timeOfBirth}
                  aria-describedby={errors.timeOfBirth ? "timeOfBirth-error" : undefined}
                  className={inputClass(!!errors.timeOfBirth)}
                />
                {errors.timeOfBirth && (
                  <p id="timeOfBirth-error" className="mt-1 text-sm text-rose-600" role="alert">
                    {errors.timeOfBirth}
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

        {/* Date & slot */}
        <fieldset className="rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:p-6">
          <legend className="px-2 font-display text-lg text-gray-900">Pick a Weekend Date &amp; Slot</legend>

          <div>
            <label htmlFor="appointmentDate" className="mb-1 block text-sm text-gray-600">
              Appointment date (Sat / Sun only) <span className="text-rose-600">*</span>
            </label>
            <input
              id="appointmentDate"
              type="date"
              min={todayStr()}
              value={form.appointmentDate}
              onChange={(e) => handleDateChange(e.target.value)}
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
                  {parseLocalDate(d).toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </button>
              ))}
            </div>
          </div>

          {/* Slot grid — shown once a valid weekend date is chosen */}
          {form.appointmentDate && isWeekend(form.appointmentDate) && (
            <div className="mt-6">
              <p className="mb-2 text-sm text-gray-600">
                Available 30-minute slots for{" "}
                <span className="text-gray-900">{formatLongDate(form.appointmentDate)}</span>:
              </p>
              <div
                className="grid grid-cols-2 gap-3 sm:grid-cols-4"
                role="radiogroup"
                aria-label="Available time slots"
              >
                {SLOT_TIMES.map((slot) => {
                  const booked = bookedSlots.includes(slot);
                  const selected = form.slot === slot;
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
                      {formatSlot(slot)}
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
                Greyed-out slots are already booked for this date.
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
