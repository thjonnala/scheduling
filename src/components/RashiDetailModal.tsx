import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import type { Rashi } from "../data/rashis";
import {
  fetchHoroscope,
  type HoroscopePeriod,
  type HoroscopeResult,
} from "../services/horoscope";

type Tab = "daily" | "monthly" | "yearly";

type FetchState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; result: HoroscopeResult };

interface RashiDetailModalProps {
  rashi: Rashi | null;
  onClose: () => void;
}

/**
 * Detail view for a moon sign: sign info plus Daily / Monthly / Yearly
 * horoscope tabs. Daily and monthly predictions come from the free
 * horoscope API (keyed by the Western sign name); yearly uses locally
 * curated text since the free API has no yearly endpoint.
 */
export default function RashiDetailModal({ rashi, onClose }: RashiDetailModalProps) {
  const [tab, setTab] = useState<Tab>("daily");
  // Fetch results cached by "<signId>:<period>" so switching tabs or
  // reopening a sign doesn't refetch completed requests.
  const [cache, setCache] = useState<Record<string, FetchState | undefined>>({});
  // Mirror for reading inside the effect without putting `cache` in its
  // deps (which would refire the effect on every fetch state change).
  const cacheRef = useRef(cache);
  cacheRef.current = cache;
  // Bumped by the Retry button to re-run the fetch effect
  const [retryNonce, setRetryNonce] = useState(0);

  // Always open on the Daily tab when a different sign is selected
  useEffect(() => {
    setTab("daily");
  }, [rashi?.id]);

  // Fetch the active tab's horoscope (daily/monthly only). Anything that is
  // not a final success/error — including a "loading" entry left behind by a
  // cancelled fetch — triggers a (re)fetch, so the UI can never hang.
  useEffect(() => {
    if (!rashi || tab === "yearly") return;
    const period: HoroscopePeriod = tab;
    const key = `${rashi.id}:${period}`;
    const existing = cacheRef.current[key];
    if (existing && existing.status !== "loading") return;

    let cancelled = false;
    setCache((c) => ({ ...c, [key]: { status: "loading" } }));

    fetchHoroscope(rashi.id, period)
      .then((result) => {
        if (!cancelled) {
          setCache((c) => ({ ...c, [key]: { status: "success", result } }));
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Unknown error";
          setCache((c) => ({ ...c, [key]: { status: "error", message } }));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [rashi, tab, retryNonce]);

  if (!rashi) return null;

  const tabs: { key: Tab; label: string }[] = [
    { key: "daily", label: "Daily" },
    { key: "monthly", label: "Monthly" },
    { key: "yearly", label: "Yearly" },
  ];

  const renderApiTab = (period: HoroscopePeriod) => {
    const key = `${rashi.id}:${period}`;
    const state = cache[key];
    if (!state || state.status === "loading") {
      return (
        <div className="flex items-center gap-3 py-6 text-gray-600" role="status">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-700 border-t-transparent" aria-hidden="true" />
          Consulting the stars…
        </div>
      );
    }
    if (state.status === "error") {
      return (
        <div className="py-4 text-gray-600" role="alert">
          <p className="text-rose-600">
            Sorry — the horoscope service couldn't be reached right now.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            ({state.message}) Please check your connection and try again later.
          </p>
          <button
            type="button"
            onClick={() => {
              setCache((c) => ({ ...c, [key]: undefined }));
              setRetryNonce((n) => n + 1);
            }}
            className="mt-4 rounded-lg border border-gray-400 px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
          >
            Retry
          </button>
        </div>
      );
    }
    return (
      <div className="py-2">
        <p className="text-sm font-medium text-gray-700">{state.result.label}</p>
        <p className="mt-2 leading-relaxed text-gray-700">{state.result.text}</p>
      </div>
    );
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`${rashi.name} (${rashi.sanskritName}) ${rashi.symbol}`}
    >
      <div className="grid grid-cols-1 gap-2 text-sm text-gray-600 sm:grid-cols-3">
        <p><span className="text-gray-700">Lord:</span> {rashi.lord}</p>
        <p><span className="text-gray-700">Element:</span> {rashi.element}</p>
        <p><span className="text-gray-700">Sanskrit:</span> {rashi.sanskritName}</p>
      </div>
      <p className="mt-4 leading-relaxed text-gray-700">{rashi.description}</p>

      {/* Horoscope tabs */}
      <div className="mt-6 border-t border-gray-200 pt-5">
        <h3 className="font-display text-lg text-gray-900">Predictions</h3>
        <div role="tablist" aria-label="Horoscope period" className="mt-3 flex gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 ${
                tab === t.key
                  ? "bg-gray-900 text-white"
                  : "border border-gray-300 text-gray-600 hover:border-gray-400"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div role="tabpanel" className="mt-4 min-h-[6rem]">
          {tab === "yearly" ? (
            <div className="py-2">
              <p className="leading-relaxed text-gray-700">{rashi.yearlyOutlook}</p>
              <p className="mt-3 text-xs text-gray-400">
                The free horoscope service does not offer a yearly endpoint, so this
                yearly outlook is curated locally by Thiru Astrology.
              </p>
            </div>
          ) : (
            renderApiTab(tab)
          )}
        </div>

        <p className="mt-4 border-t border-gray-200 pt-3 text-xs text-gray-400">
          Daily &amp; monthly predictions are sourced from a free third-party service
          (Western sun-sign horoscopes mapped from your rashi) and are for
          entertainment purposes.
        </p>
      </div>
    </Modal>
  );
}
