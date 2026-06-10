/**
 * Booking notification email.
 *
 * A static site has no mail server, so bookings are relayed through
 * FormSubmit.co — a free form-to-email service for static sites. The first
 * submission triggers a one-time activation email to BOOKING_EMAIL_TO that
 * must be confirmed before messages start being delivered.
 *
 * If the relay fails, the UI offers a prefilled mailto: link as a fallback
 * (see buildMailtoLink).
 */
import { formatSlot, type Booking } from "./bookings";

export const BOOKING_EMAIL_TO = "thiru.jon@gmail.com";

const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${BOOKING_EMAIL_TO}`;

/** Send the booking details to BOOKING_EMAIL_TO. Throws if the relay fails. */
export async function sendBookingEmail(booking: Booking): Promise<void> {
  const res = await fetch(FORMSUBMIT_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      _subject: `New appointment booking — ${booking.fullName}`,
      _template: "table",
      _captcha: "false",
      "Full name": booking.fullName,
      "Appointment date": booking.appointmentDate,
      "Appointment slot": `${formatSlot(booking.slot)} (30 minutes)`,
      "Date of birth": booking.dateOfBirth,
      "Time of birth": booking.timeOfBirth,
      "Place of birth": booking.placeOfBirth,
      "Booked at": booking.createdAt,
    }),
  });

  if (!res.ok) {
    throw new Error(`Email relay responded with status ${res.status}`);
  }
  const json = (await res.json()) as { success?: string | boolean };
  if (json.success !== "true" && json.success !== true) {
    throw new Error("Email relay rejected the submission");
  }
}

/** Prefilled mailto: link so the visitor can email the booking manually. */
export function buildMailtoLink(booking: Booking): string {
  const subject = `New appointment booking — ${booking.fullName}`;
  const body = [
    `Full name: ${booking.fullName}`,
    `Appointment date: ${booking.appointmentDate}`,
    `Appointment slot: ${formatSlot(booking.slot)} (30 minutes)`,
    `Date of birth: ${booking.dateOfBirth}`,
    `Time of birth: ${booking.timeOfBirth}`,
    `Place of birth: ${booking.placeOfBirth}`,
  ].join("\n");
  return `mailto:${BOOKING_EMAIL_TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
