# hamid-portfolio

Portfolio for [Hamid Rizvi](https://linkedin.com/in/hamid-rizvi), AI Engineer (Forward Deployed), New York. Each case study covers the constraint, the calls I made, and what broke.

**Live:** [hamidrizvi.vercel.app](https://hamidrizvi.vercel.app)

## What's on it

- **LexTrack AI**, presented as experience: the one deployment with real users and an uptime bar.
- **Three featured builds:** ResidenceOS, the Claude Support Triage Agent, and QuadTax.
- **Earlier work**, kept deliberately brief.
- **An AI version of me** in the hero. You ask, it answers from a knowledge file compiled from my résumé and case studies, and says so when it doesn't know.

## Stack

Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS · Framer Motion · Lenis · Gemini (`@google/genai`) · Vercel

## Run it locally

```bash
npm install
cp .env.example .env.local   # add GOOGLE_AI_API_KEY for the chat
npm run dev                  # http://localhost:3000
```

Everything except the chat works without a key.

| Variable | Needed for | Notes |
| --- | --- | --- |
| `GOOGLE_AI_API_KEY` | The hero chat | Server-only. Never prefix with `NEXT_PUBLIC_`. |
| `GOOGLE_AI_MODEL` | Optional | Defaults to the model in `app/api/chat/route.ts`. |
| `NEXT_PUBLIC_SITE_URL` | Optional | Canonical origin for Open Graph, sitemap and robots. Defaults to `https://hamidrizvi.vercel.app`. |

`node scripts/smoke-chat.mjs [baseUrl]` checks `/api/chat` against a running server: one real model call, validation errors, then the rate limit. It runs at most once a minute.

## Where things live

```
app/
  page.tsx                 home: hero + chat, experience, selected work, off duty
  work/[slug]/page.tsx     one case study
  about/ contact/          the other pages
  api/chat/route.ts        streaming chat: rate limit → validate → model → plain text
lib/
  projects.ts              which projects show, in what order, with which images
  deep-dives.ts            long-form case studies (decisions, what broke, retro)
  personal-data.ts         profile, bio, case-study summaries
  hamid-knowledge.md       everything the chat is allowed to know
  persona.ts, knowledge.ts system prompt and suggested questions, built from the file above
components/
  home/                    homepage sections
  work/                    case-study diagrams
  site/                    header, preloader, contact form, cursor
public/
  work/<slug>/             case-study screenshots
  photos/                  street photography
```

To change content, start in `lib/`. Every number on the site should trace back to `lib/hamid-knowledge.md` and the résumé.

## Design

Black, burgundy and camel. The tokens live once, in `app/globals.css`, and `tailwind.config.ts` points at them. Type is Cormorant Garamond (display), Source Serif 4 (body) and JetBrains Mono (labels). Motion respects `prefers-reduced-motion`: the preloader and scroll effects step aside.

## License

MIT for the structure and code. Please don't republish the copy, case studies, or photos as your own.
