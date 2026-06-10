/**
 * Horoscope API client.
 *
 * Uses the free Horoscope App API, which moved from
 * horoscope-app-api.vercel.app to https://freehoroscopeapi.com (the old
 * domain 308-redirects there). The new domain does not send CORS headers,
 * so browser requests are routed through a public CORS proxy.
 *
 * The API provides daily / weekly / monthly Western sun-sign horoscopes.
 * There is NO yearly endpoint, so the Yearly tab in the UI falls back to
 * locally curated text (see rashis.ts).
 *
 * To swap providers, change the constants below and adjust the response
 * parsing in `fetchHoroscope` — the rest of the app only consumes the
 * normalised `HoroscopeResult` shape. If the replacement API sends proper
 * CORS headers, set CORS_PROXY to "" to call it directly.
 */

export const HOROSCOPE_API_BASE = "https://freehoroscopeapi.com/api/v1";

/** Public CORS proxy prefix; the target URL is appended URL-encoded. */
export const CORS_PROXY = "https://corsproxy.io/?url=";

export type HoroscopePeriod = "daily" | "monthly";

/** Normalised result consumed by the UI. */
export interface HoroscopeResult {
  /** The prediction text */
  text: string;
  /** Human-readable date or month label returned by the API */
  label: string;
}

interface ApiResponse {
  data: {
    /** "YYYY-MM-DD" for daily, "YYYY-MM" for monthly */
    date: string;
    period: string;
    sign: string;
    horoscope: string;
  };
}

/** Format the API's "YYYY-MM" / "YYYY-MM-DD" date as a readable label. */
function formatLabel(date: string, period: HoroscopePeriod): string {
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m) return date;
  const dt = new Date(y, m - 1, d || 1);
  return period === "daily"
    ? dt.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
    : dt.toLocaleDateString(undefined, { year: "numeric", month: "long" });
}

/**
 * Fetch a daily or monthly horoscope for a Western sign name
 * (e.g. "aries"). Throws on network/HTTP errors so callers can render
 * an error state.
 */
export async function fetchHoroscope(
  sign: string,
  period: HoroscopePeriod
): Promise<HoroscopeResult> {
  const target =
    period === "daily"
      ? `${HOROSCOPE_API_BASE}/get-horoscope/daily?sign=${encodeURIComponent(sign)}&day=TODAY`
      : `${HOROSCOPE_API_BASE}/get-horoscope/monthly?sign=${encodeURIComponent(sign)}`;

  const url = CORS_PROXY ? `${CORS_PROXY}${encodeURIComponent(target)}` : target;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Horoscope API responded with status ${res.status}`);
  }

  const json = (await res.json()) as ApiResponse;
  if (!json.data?.horoscope) {
    throw new Error("Horoscope API returned no data");
  }
  return {
    text: json.data.horoscope,
    label: formatLabel(json.data.date, period),
  };
}
