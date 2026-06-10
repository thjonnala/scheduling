import { Link } from "react-router-dom";
import Card from "../components/Card";
import SectionHeading from "../components/SectionHeading";
import { planets } from "../data/planets";

/** Grid of the nine Navagraha cards with their Vedic significations. */
export default function Planets() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading
        title="The Nine Planets — Navagraha"
        subtitle="In Vedic astrology, nine celestial influences (grahas) shape human destiny. Each governs distinct areas of life, character and karma."
      />

      <ul className="grid list-none grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {planets.map((p) => (
          <li key={p.id}>
            <Card className="h-full">
              <div className="flex items-center gap-4">
                <span
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-gray-100 text-3xl text-gray-900"
                  aria-hidden="true"
                >
                  {p.glyph}
                </span>
                <div>
                  <h2 className="font-display text-xl text-gray-900">{p.name}</h2>
                  <p className="text-sm text-gray-500">{p.sanskritName}</p>
                </div>
              </div>

              <p className="mt-3 font-display text-sm italic text-gray-700">{p.tagline}</p>

              <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={`${p.name} significations`}>
                {p.significations.map((s) => (
                  <li
                    key={s}
                    className="rounded-full border border-gray-300 px-2.5 py-0.5 text-xs text-gray-600"
                  >
                    {s}
                  </li>
                ))}
              </ul>

              <p className="mt-4 text-sm leading-relaxed text-gray-600">{p.description}</p>

              <Link
                to={`/remedies?planet=${p.id}`}
                className="mt-4 inline-block text-sm font-medium text-gray-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
              >
                View remedies →
              </Link>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
