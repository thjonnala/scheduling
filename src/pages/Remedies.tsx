import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Card from "../components/Card";
import Modal from "../components/Modal";
import SectionHeading from "../components/SectionHeading";
import { planets, type Planet } from "../data/planets";

/**
 * Remedies for each Navagraha. Clicking a planet opens a modal listing its
 * traditional Vedic remedies. Supports deep-linking via ?planet=<id> so the
 * Planets page can link straight to a specific planet's remedies.
 */
export default function Remedies() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selected, setSelected] = useState<Planet | null>(null);

  // Open the modal automatically when arriving with ?planet=<id>
  useEffect(() => {
    const id = searchParams.get("planet");
    if (id) {
      const planet = planets.find((p) => p.id === id);
      if (planet) setSelected(planet);
    }
  }, [searchParams]);

  const close = () => {
    setSelected(null);
    // Drop the ?planet param so the modal doesn't reopen on re-render
    if (searchParams.get("planet")) setSearchParams({}, { replace: true });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading
        title="Navagraha Remedies"
        subtitle="Traditional Vedic remedies — mantras, worship, charity, fasting and gemstones — to pacify and strengthen each of the nine planets. Click a planet to view its remedies."
      />

      <ul className="grid list-none grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {planets.map((p) => (
          <li key={p.id}>
            <Card
              onClick={() => setSelected(p)}
              ariaLabel={`${p.name} (${p.sanskritName}) — view remedies`}
              className="h-full"
            >
              <div className="flex items-center gap-4">
                <span
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-gray-100 text-3xl text-gray-700"
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
              <p className="mt-4 text-sm font-medium text-gray-700">View remedies →</p>
            </Card>
          </li>
        ))}
      </ul>

      <p className="mt-10 rounded-lg border border-gray-200 bg-gray-50 p-4 text-center text-xs text-gray-500">
        Remedies are shared per Vedic tradition for general guidance. Gemstones in
        particular should be worn only after a personal chart consultation.
      </p>

      {selected && (
        <Modal
          isOpen={true}
          onClose={close}
          title={`${
            selected.sanskritName.startsWith(selected.name)
              ? selected.sanskritName
              : `${selected.name} (${selected.sanskritName})`
          } ${selected.glyph} — Remedies`}
        >
          <p className="text-sm text-gray-600">{selected.description}</p>
          <ul className="mt-5 space-y-3">
            {selected.remedies.map((r) => (
              <li key={r} className="flex gap-3 text-sm leading-relaxed text-gray-700">
                <span className="mt-0.5 shrink-0 text-gray-400" aria-hidden="true">✦</span>
                {r}
              </li>
            ))}
          </ul>
          <p className="mt-6 border-t border-gray-200 pt-3 text-xs text-gray-400">
            For general guidance only — consult a qualified astrologer before wearing
            gemstones or undertaking intensive remedies.
          </p>
        </Modal>
      )}
    </div>
  );
}
