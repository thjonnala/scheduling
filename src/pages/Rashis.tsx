import { useState } from "react";
import Card from "../components/Card";
import SectionHeading from "../components/SectionHeading";
import RashiDetailModal from "../components/RashiDetailModal";
import { rashis, type Rashi } from "../data/rashis";

const elementColors: Record<Rashi["element"], string> = {
  Fire: "text-orange-700 border-orange-300",
  Earth: "text-emerald-700 border-emerald-300",
  Air: "text-sky-700 border-sky-300",
  Water: "text-indigo-700 border-indigo-300",
};

/**
 * Grid of the 12 moon signs. Clicking a card opens the detail modal with
 * Daily / Monthly / Yearly predictions.
 */
export default function Rashis() {
  const [selected, setSelected] = useState<Rashi | null>(null);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading
        title="The 12 Moon Signs — Rashi"
        subtitle="Your rashi is the sign occupied by the Moon at your birth — the foundation of the Vedic chart. Click any sign for its daily, monthly and yearly predictions."
      />

      <ul className="grid list-none grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rashis.map((r) => (
          <li key={r.id}>
            <Card
              onClick={() => setSelected(r)}
              ariaLabel={`${r.name} (${r.sanskritName}) — view predictions`}
              className="h-full"
            >
              <div className="flex items-center gap-4">
                <span
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-gray-100 text-3xl text-gray-900"
                  aria-hidden="true"
                >
                  {r.symbol}
                </span>
                <div>
                  <h2 className="font-display text-xl text-gray-900">{r.name}</h2>
                  <p className="text-sm text-gray-500">{r.sanskritName}</p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full border border-gray-300 px-2.5 py-0.5 text-gray-600">
                  Lord: {r.lord}
                </span>
                <span className={`rounded-full border px-2.5 py-0.5 ${elementColors[r.element]}`}>
                  {r.element}
                </span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-gray-600">{r.description}</p>

              <p className="mt-4 text-sm font-medium text-gray-700">
                View predictions →
              </p>
            </Card>
          </li>
        ))}
      </ul>

      <RashiDetailModal rashi={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
