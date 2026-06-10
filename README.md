# 🪔 Thiru's Vedic Astrology

A static, front-end-only Vedic astrology website built with **Vite + React + TypeScript**, styled with **Tailwind CSS** in a clean white & gray theme, and routed with **React Router**. No backend required — deployable to any static host.

## Features

| Section | Route | Highlights |
|---|---|---|
| Home / Hero | `/` | Intro and navigation to all sections |
| Schedule Appointment | `/appointment` | Weekend-only booking (Sat/Sun), 30-min slots in 11 AM–1 PM & 6 PM–8 PM windows, localStorage persistence, booked slots greyed out |
| Planets (Navagraha) | `/planets` | All 9 grahas with glyphs, taglines and Vedic significations |
| Remedies | `/remedies` | Traditional remedies per planet (mantra, charity, fasting, gemstone); deep-linkable via `?planet=<id>` |
| Moon Signs (Rashi) | `/rashis` | All 12 rashis (lord, element, traits); click a sign for **Daily / Monthly / Yearly** predictions |
| Nakshatras | `/nakshatras` | All 27 lunar mansions with lords; searchable & filterable |
| Testimonials | `/testimonials` | Seeded + user-submitted reviews with star ratings, average rating summary, localStorage persistence |

All astrology reference data lives locally in typed TS files under [`src/data/`](src/data/) — nothing static is fetched from an API.

## Booking Email Notifications

When a booking is submitted, the details are relayed to the astrologer's inbox via **[FormSubmit.co](https://formsubmit.co)** (a free form-to-email service for static sites) — see [`src/services/emailService.ts`](src/services/emailService.ts) and its `BOOKING_EMAIL_TO` constant.

- **One-time activation:** FormSubmit sends an activation email to the recipient address on the first submission; bookings are delivered only after it is confirmed.
- If the relay fails, the confirmation screen offers a prefilled `mailto:` link so the visitor can send the booking from their own email client.
- The local booking (and slot blocking) works regardless of email delivery.

## Horoscope API

Daily and monthly predictions in the Rashi detail modal are fetched live from the free, open-source **Horoscope App API**, now hosted at **https://freehoroscopeapi.com** (its old `horoscope-app-api.vercel.app` domain 308-redirects there):

- `GET /api/v1/get-horoscope/daily?sign=<sign>&day=TODAY`
- `GET /api/v1/get-horoscope/monthly?sign=<sign>`

Notes:

- The new domain does **not** send CORS headers, so browser requests are routed through a public CORS proxy (`corsproxy.io`) — see the `CORS_PROXY` constant in [`src/services/horoscope.ts`](src/services/horoscope.ts). Set it to `""` if you switch to a provider with proper CORS support.
- The API returns **Western sun-sign** horoscopes; our rashi cards map their Sanskrit names to the corresponding tropical sign keys (`aries`, `taurus`, …) for the call. A disclaimer is shown in the UI.
- The API has **no yearly endpoint**, so the Yearly tab shows locally curated outlooks stored in `src/data/rashis.ts`.
- **To swap providers:** edit `HOROSCOPE_API_BASE` / `CORS_PROXY` and the response parsing in [`src/services/horoscope.ts`](src/services/horoscope.ts). The UI only consumes the normalised `HoroscopeResult` shape, so nothing else changes.

## Getting Started

```bash
npm install
npm run dev       # start dev server at http://localhost:5173
npm run build     # type-check + build static bundle into dist/
npm run preview   # preview the production build locally
```

## Project Structure

```
src/
├── components/      # Reusable UI (Card, Modal, StarRating, Navbar, Footer, …)
├── data/            # Typed static reference data (planets, rashis, nakshatras)
├── pages/           # One component per route/section
├── services/        # Horoscope API client + localStorage stores
├── App.tsx          # Router + layout
├── main.tsx         # Entry point
└── index.css        # Tailwind + cosmic theme base styles
```

## Deployment

The build output (`dist/`) is fully static. Because the app uses React Router's browser history mode, the host must rewrite all paths to `index.html`:

### Netlify
- Drag-and-drop `dist/`, or connect the repo with build command `npm run build` and publish directory `dist`.
- SPA rewrites are already handled by [`public/_redirects`](public/_redirects).

### Vercel
- Import the repo; Vercel auto-detects Vite. Rewrites are handled by [`vercel.json`](vercel.json).

### GitHub Pages
1. Set `base: "/<repo-name>/"` in `vite.config.ts`.
2. `npm run build`, then publish `dist/` (e.g. with the `gh-pages` package or a Pages workflow).
3. GitHub Pages has no SPA rewrites — copy `dist/index.html` to `dist/404.html` as a fallback so deep links work.

## Disclaimers

- **Demo site**: bookings and testimonials are stored only in the visitor's browser (`localStorage`); there is no server, payment, or real scheduling.
- Daily/monthly horoscopes come from a free third-party service and follow Western sun-sign conventions; they are for entertainment purposes.
