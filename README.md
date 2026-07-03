# StickerStats

**A probability simulator for sticker album collectors.**

StickerStats uses the **Coupon Collector's Problem** — a classic theorem from probability theory — to calculate exactly how many packs you need to buy to complete a sticker album, and how much money you can save by swapping duplicates with a group of friends.

---

## What Does It Do?

Most collectors dramatically underestimate how many packs they need. StickerStats shows you the real math: to complete an album of 638 stickers alone, you need to buy on average **~4,488 stickers** — nearly 7× the album's size — because duplicates pile up exponentially as you near completion.

The app lets you:

- **Configure your album** — choose your country, currency, album price, pack price, total sticker count, and stickers per pack through a clean 3-step wizard.
- **See your cost instantly** — three KPI cards update in real time showing packs needed, packs cost, and total investment.
- **Model group swapping** — toggle cooperative mode and pick a group size (2–20 people) to see how much you save by exchanging duplicates.
- **Watch a live simulation** — open packs one by one and watch your digital album fill up slot by slot, with a paginated grid showing owned, duplicate, and empty stickers.
- **Run Monte Carlo analysis** — simulate 1,000 to 10,000 full album completions in your browser to get empirical averages, best/worst cases, and a probability distribution histogram.
- **Read the methodology** — an in-app modal explains the math behind every calculation.

---

## Features

| Feature | Description |
|---|---|
| 🧮 **Coupon Collector Formula** | Uses `N × H_N` (Harmonic Number) to compute expected stickers needed. |
| 🤝 **Cooperative Swap Model** | Applies empirical reduction factors (30%–73%) based on group size. |
| 📊 **3 Live KPI Cards** | Packs needed, packs cost, and total investment update on every config change. |
| 💡 **Strategy Advice Panel** | Context-aware recommendation: warns solo collectors, confirms swap savings. |
| 🕹️ **Interactive Pack Simulator** | Step-by-step or auto-fill simulation with speed controls and album grid view. |
| 🎲 **Monte Carlo Engine v4.0** | Async batch simulation of up to 10,000 runs with real-time progress and histogram. |
| 🌍 **9 Country Presets** | Colombia, Argentina, Venezuela, Chile, México, USA, Perú, Ecuador, España — each with local currency and price defaults. |
| 🌐 **Bilingual** | Full Spanish / English support, auto-detected from your browser locale. |
| 🔒 **100% Client-Side** | All calculations run in your browser. No server calls, no cookies, no tracking. |

---

## Supported Countries & Currencies

| Country | Currency |
|---|---|
| Colombia | COP |
| Venezuela | VES |
| Argentina | ARS |
| Chile | CLP |
| México | MXN |
| USA | USD |
| Perú | PEN |
| Ecuador | USD |
| España | EUR |

---

## The Math (Quick Summary)

The expected number of stickers to complete an album of **N** unique stickers is:

```
Expected Stickers = N × H_N
```

Where `H_N` is the **Nth Harmonic Number**: `1/1 + 1/2 + 1/3 + ... + 1/N`.

For a 638-sticker album: `H_638 ≈ 7.03` → you need ~4,488 stickers on average when collecting alone.

**Cooperative swapping** reduces the excess (duplicates) by a factor based on group size:
- 2 people → −30% excess
- 5 people → −50% excess
- 10 people → −65% excess
- 20 people → −73% excess (empirical cap)

For the full scientific methodology, click **Methodology** inside the app.

---

## Getting Started

**Prerequisites:** Node.js 18+

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Set your Gemini API key if extending with AI features
cp .env.example .env.local
# Edit .env.local and add: GEMINI_API_KEY=your_key_here

# 3. Start the development server
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Production build to `/dist` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | TypeScript type-check (`tsc --noEmit`) |
| `npm run clean` | Remove `dist/` and `server.js` |

---

## Tech Stack

- **React 19** + **TypeScript** — UI and type safety
- **Vite 6** — build tool and dev server
- **Tailwind CSS v4** — utility-first styling
- **Lucide React** — icons
- **Motion** (Framer Motion) — animations
- **Google GenAI SDK** — available for optional AI feature extension

---

## Project Structure

```
src/
├── App.tsx                      # Root component
├── main.tsx                     # Entry point + LanguageProvider
├── types.ts                     # TypeScript interfaces
├── data.ts                      # Math engine + country/currency data
├── context/
│   └── LanguageContext.tsx      # i18n context (ES/EN)
└── components/
    ├── atoms/                   # Button, Input, Badge, Select, ProgressBar
    ├── molecules/               # FormField, KpiCard, LanguageSwitcher
    ├── organisms/               # ConfigForm, KpiCards, MonteCarloSimulator, ...
    ├── templates/               # DashboardTemplate (slot-based layout)
    └── pages/                   # DashboardPage (state orchestrator)
```

The component tree follows **Atomic Design**: atoms → molecules → organisms → templates → pages.

---

## Privacy

- All calculations and simulations run entirely in your browser.
- No data is ever sent to any server.
- No cookies, trackers, or advertising pixels.
- No account or registration required.

---

## License

Apache-2.0 — see individual source files for license headers.
