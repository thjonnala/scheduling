import { useMemo, useState } from "react";
import Card from "../components/Card";
import SectionHeading from "../components/SectionHeading";
import { nakshatras, nakshatraLords } from "../data/nakshatras";

/** Searchable / filterable grid of all 27 nakshatras. */
export default function Nakshatras() {
  const [query, setQuery] = useState("");
  const [lordFilter, setLordFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return nakshatras.filter((n) => {
      const matchesQuery =
        q === "" ||
        n.name.toLowerCase().includes(q) ||
        n.lord.toLowerCase().includes(q);
      const matchesLord = lordFilter === "all" || n.lord === lordFilter;
      return matchesQuery && matchesLord;
    });
  }, [query, lordFilter]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading
        title="The 27 Nakshatras"
        subtitle="The lunar mansions through which the Moon travels each month. Your birth nakshatra colours your deepest instincts and life path."
      />

      {/* Search & filter controls */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="nakshatra-search" className="mb-1 block text-sm text-gray-600">
            Search by name or lord
          </label>
          <input
            id="nakshatra-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Rohini, Ketu…"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
          />
        </div>
        <div>
          <label htmlFor="lord-filter" className="mb-1 block text-sm text-gray-600">
            Filter by lord
          </label>
          <select
            id="lord-filter"
            value={lordFilter}
            onChange={(e) => setLordFilter(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 sm:w-48"
          >
            <option value="all">All lords</option>
            {nakshatraLords.map((lord) => (
              <option key={lord} value={lord}>
                {lord}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mb-4 text-sm text-gray-500" role="status">
        Showing {filtered.length} of {nakshatras.length} nakshatras
      </p>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center text-gray-600">
          No nakshatras match your search. Try a different name or lord.
        </p>
      ) : (
        <ul className="grid list-none grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((n) => (
            <li key={n.id}>
              <Card className="h-full">
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="font-display text-lg text-gray-900">
                    <span className="mr-2 text-sm text-gray-400">{n.id}.</span>
                    {n.name}
                  </h2>
                  <span className="shrink-0 rounded-full border border-gray-300 px-2.5 py-0.5 text-xs text-gray-900">
                    {n.lord}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{n.description}</p>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
