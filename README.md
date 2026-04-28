# hamid-portfolio

> *"I turn AI capabilities into shipped products."*

Personal portfolio for [Hamid Rizvi](https://linkedin.com/in/hamid-rizvi) — AI Product Manager, NYU '26. Built to show, not tell.

[![Live](https://img.shields.io/badge/Live-hamidrizvi.vercel.app-FF4A1C?style=flat-square&logo=vercel&logoColor=white)](https://hamidrizvi.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=next.js)](https://nextjs.org)
![No Tailwind](https://img.shields.io/badge/No_Tailwind-every_line_of_CSS_is_custom-8A847A?style=flat-square)


## Stack

```
Next.js 14 (App Router)   React 18   styled-jsx   TypeScript
Gemini 2.0 Flash API      Vercel Edge Runtime
```

No UI library. No Tailwind. Every animation is hand-rolled with `requestAnimationFrame` or CSS transitions. The sticky-pin metrics section uses native scroll position + direct DOM updates — zero React re-renders per scroll tick.

---

## Project structure

```
hamid-portfolio/
├── app/
│   ├── api/chat/route.ts      # Gemini streaming endpoint (Edge runtime)
│   ├── globals.css            # Design tokens — all CSS vars live here
│   ├── layout.tsx             # Fonts, metadata, root shell
│   └── page.tsx               # Composes the 6 sections
│
├── components/
│   ├── HeroSection.tsx        # Decrypt animation, grain canvas, credentials
│   ├── MetricsWall.tsx        # Sticky-pin scroll, rAF-driven progress bar
│   ├── CaseStudyScrollytell.tsx
│   ├── AskHamidChat.tsx       # Streaming SSE from Gemini
│   ├── OffDutySection.tsx     # Photo lightbox, chess board, count-up
│   └── ContactSection.tsx
│
├── lib/
│   └── personal-data.ts       # Single source of truth — edit here first
│
└── public/
    ├── badges/                # Cert images (CSM, CSPO, Google PM)
    └── photos/                # Drop your photos here
```

The single file to edit for content is **`lib/personal-data.ts`** — metrics, case studies, GitHub links, and contact info all live there.

---

## Design

**Aesthetic:** Editorial dark — warm off-black `#0F0E0C`, paper `#F4F1EA`, single vermilion accent `#FF4A1C`.

**Typography:** Fraunces (display, optical-sized) · Inter (body) · JetBrains Mono (UI labels)

**Key technical decisions:**

- Metrics progress bar bypasses React state entirely — `ref.current.style.transform` updated directly on each rAF tick to avoid re-rendering 6 slides per scroll event
- Sticky-pin scroll zone is 700vh: 100vh entry buffer + 100vh per slide. No `preventDefault()`, no scroll hijacking — native scroll mechanics preserved
- Slide transitions use `cubic-bezier(0.16, 1, 0.3, 1)` snap easing — sharp leading edge makes state changes feel decisive
- Chat streams token-by-token via SSE; falls back gracefully if Gemini rate-limits

---

## License

MIT for the structure and code. Please don't republish the copy, case studies, or photos as your own.