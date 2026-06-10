import { Link } from "react-router-dom";

const sections = [
  {
    to: "/appointment",
    icon: "📅",
    title: "Schedule Appointment",
    text: "Book a weekend consultation — birth chart reading in 30-minute slots.",
  },
  {
    to: "/planets",
    icon: "🪐",
    title: "Planets (Navagraha)",
    text: "The nine grahas of Vedic astrology and what each signifies in your life.",
  },
  {
    to: "/remedies",
    icon: "📿",
    title: "Navagraha Remedies",
    text: "Mantras, charity, fasting and worship to pacify each of the nine planets.",
  },
  {
    to: "/rashis",
    icon: "🌙",
    title: "Moon Signs (Rashi)",
    text: "All 12 rashis with their lords, elements, traits — and live daily, monthly and yearly predictions.",
  },
  {
    to: "/nakshatras",
    icon: "✨",
    title: "27 Nakshatras",
    text: "The lunar mansions, their planetary lords and the nature they bestow.",
  },
  {
    to: "/testimonials",
    icon: "💬",
    title: "Testimonials & Ratings",
    text: "What clients say — and share your own experience with a star rating.",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 text-center sm:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(229,231,235,0.7),transparent_60%)]"
        />
        <div className="relative mx-auto max-w-3xl px-4">
          <p className="text-5xl" aria-hidden="true">🪔</p>
          <h1 className="mt-4 font-display text-4xl text-gray-900 sm:text-6xl">
            Thiru's Vedic Astrology
          </h1>
          <p className="mt-3 font-display text-lg italic text-gray-600 sm:text-xl">
            Ancient Vedic wisdom for modern lives
          </p>
          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-gray-600">
            Explore the nine planets (Navagraha), your moon sign (rashi), and the
            27 nakshatras that shape your nature — then book a personal weekend
            consultation to understand what the stars hold for you.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/appointment"
              className="rounded-full bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
            >
              Book a Consultation
            </Link>
            <Link
              to="/rashis"
              className="rounded-full border border-gray-400 px-6 py-3 font-semibold text-gray-900 transition hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
            >
              Read Your Sign
            </Link>
          </div>
        </div>
      </section>

      {/* Section links */}
      <section className="mx-auto max-w-6xl px-4 pb-8" aria-label="Site sections">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="group rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-gray-400 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
            >
              <p className="text-3xl" aria-hidden="true">{s.icon}</p>
              <h2 className="mt-3 font-display text-xl text-gray-900 group-hover:text-gray-700">
                {s.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{s.text}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
