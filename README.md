# Hamid Rizvi — Portfolio

An editorial-dark portfolio for an AI Product Manager. Six full-bleed sections, scrollytelling case studies, a live Gemini-powered chat that answers as Hamid, and a few human flourishes (NYC photography carousel, chess opening explainer).

Built with **Next.js 14** (App Router) + **React 18** + **styled-jsx** + **Gemini 2.5 Flash**. No Tailwind, no UI library — every line of CSS is custom.

---

## Quick links — what you'll do, in order

1. [Run it locally](#1-run-it-locally) — get the site working on your machine
2. [Get a Gemini API key](#2-get-a-gemini-api-key) — free, takes 2 minutes
3. [Push to GitHub](#3-push-to-github) — version control + Vercel needs this
4. [Deploy to Vercel](#4-deploy-to-vercel) — ship to a real URL
5. [Add your photos](#5-add-your-photos) — replace placeholders
6. [Add the LexTrack demo video](#6-add-the-lextrack-demo-video) — when you have it
7. [Custom domain (optional)](#7-custom-domain-optional)
8. [Future updates](#8-making-future-updates)

---

## 1. Run it locally

You need **Node.js 18.17+** installed. Check with:

```bash
node --version
```

If you don't have it, install from [nodejs.org](https://nodejs.org/) (pick the LTS version).

Then:

```bash
# 1. Open Terminal and navigate to this folder
cd hamid-portfolio

# 2. Install dependencies (takes 1-2 minutes)
npm install

# 3. Create your local environment file
cp .env.example .env.local

# 4. Start the dev server
npm run dev
```

Open **http://localhost:3000** in your browser. You should see the portfolio.

> ⚠️ The "Ask Hamid" chat won't work yet — you need an API key first. See step 2.

---

## 2. Get a Gemini API key

1. Go to **[aistudio.google.com/apikey](https://aistudio.google.com/apikey)**
2. Sign in with your Google account
3. Click **"Create API key"** → choose **"Create API key in new project"** (or use an existing project if you have one)
4. Copy the key — it looks like `AIzaSy...` (about 40 characters)
5. Open `.env.local` in your code editor
6. Replace `your_gemini_api_key_here` with your key:
   ```
   GEMINI_API_KEY=AIzaSy_your_actual_key_here
   ```
7. Save the file
8. **Restart the dev server** — kill it with `Ctrl+C` and run `npm run dev` again
   (Next.js only picks up `.env.local` changes on restart)

Now go to your portfolio in the browser, scroll to "Ask Hamid", and try one of the suggested prompts. It should stream a real response from Gemini.

### About the free tier

You're using `gemini-2.0-flash` on Google AI Studio's free tier:

- **1,500 requests per day**
- **1 million tokens per day**
- **15 requests per minute**

That's more than enough for a portfolio. If you ever hit the limit, requests will fail gracefully — no charges.

---

## 3. Push to GitHub

Vercel deploys from a Git repository, so we need this on GitHub first.

### If you don't have a GitHub account

Go to [github.com/signup](https://github.com/signup) — takes 2 minutes.

### Create a new repository

1. Click the `+` button in the top-right of GitHub → **"New repository"**
2. Repository name: `hamid-portfolio` (or whatever you want)
3. **Private** is fine if you'd rather not have it public
4. Don't initialize with README, .gitignore, or license — we already have those
5. Click **"Create repository"**

### Push your code

Open Terminal in your project folder and run:

```bash
# Initialize git (if you haven't already)
git init
git add .
git commit -m "Initial portfolio commit"

# Connect to your GitHub repo (use the URL GitHub shows you)
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hamid-portfolio.git
git push -u origin main
```

> 💡 GitHub shows you these exact commands on the empty repo page after you create it. Copy from there if anything's unclear.

> ⚠️ **Critical:** Confirm `.env.local` is NOT pushed to GitHub. Check at github.com/YOUR_USERNAME/hamid-portfolio — you should see `.env.example` but NOT `.env.local`. Our `.gitignore` should handle this automatically, but verify.

---

## 4. Deploy to Vercel

### Sign up for Vercel

1. Go to **[vercel.com/signup](https://vercel.com/signup)**
2. Click **"Continue with GitHub"** — connects your GitHub automatically
3. Authorize Vercel to access your repos

### Import the project

1. On the Vercel dashboard, click **"Add New..."** → **"Project"**
2. Find `hamid-portfolio` in your repository list and click **"Import"**
3. Vercel auto-detects this is a Next.js project — leave the defaults
4. **Don't click Deploy yet.** First we need to add the API key.

### Add the API key as an environment variable

On the import page, scroll down to **"Environment Variables"**:

1. **Name:** `GEMINI_API_KEY`
2. **Value:** paste your Gemini API key (the one from step 2)
3. Leave all three environments (Production, Preview, Development) checked
4. Click **"Add"**

### Deploy

Click **"Deploy"** at the bottom. Vercel will:

1. Clone your repo
2. Run `npm install`
3. Run `npm run build`
4. Push to its global CDN

This takes about 2 minutes. When it's done, you'll see a screen with your live URL (like `hamid-portfolio.vercel.app`) and a screenshot of the homepage.

**Click the URL — your portfolio is live.**

---

## 5. Add your photos

The Photography section in "Off-Duty" currently shows 8 placeholder cards. Here's how to replace them with real photos:

### Step 1 — Optimize your photos

Recommended specs:

- **Aspect ratio:** 4:5 portrait (1200×1500px works well)
- **Format:** JPEG, quality 80-85 (or WebP for smaller files)
- **File size target:** under 300KB each
- **Quantity:** 6-8 photos works best for the carousel

I recommend running each photo through **[squoosh.app](https://squoosh.app)** — it's free, runs in the browser, and reduces file sizes by 60-80% without visible quality loss.

### Step 2 — Drop them in the project

Save your optimized photos to `public/photos/` with simple names:

```
public/photos/01.jpg
public/photos/02.jpg
public/photos/03.jpg
...
```

### Step 3 — Update the photo data

Open `components/OffDutySection.tsx` in your code editor and find the `PHOTOS` array near the top. Replace each placeholder line:

```tsx
// BEFORE
{ id: 'p1', src: null, alt: 'Photo placeholder 1', caption: 'Street, Lower East Side', location: 'NYC' },

// AFTER
{ id: 'p1', src: '/photos/01.jpg', alt: 'Street scene at golden hour', caption: 'Lower East Side', location: 'NYC' },
```

A few notes:

- Path is `/photos/01.jpg` — the leading `/` is important. Don't include `public/` (Next.js serves the public folder at the root).
- `alt` should describe what's in the photo (for screen readers and SEO).
- `caption` is what shows below the photo card.
- `location` is the small label below the caption.

### Step 4 — Push the changes

```bash
git add .
git commit -m "Add real photos"
git push
```

Vercel auto-deploys when you push to `main`. Within 1-2 minutes your live site will show the new photos.

---

## 6. Add the LexTrack demo video

Once you have a Google Drive video link for the LexTrack demo:

1. Open `lib/personal-data.ts`
2. Find the LexTrack project entry (it's the first one in the `caseStudies` array)
3. Find the `cta` field, currently:
   ```ts
   cta: {
     type: 'demo',
     label: 'Watch the product demo',
     href: '#',
     placeholder: true,
   }
   ```
4. Replace with:
   ```ts
   cta: {
     type: 'demo',
     label: 'Watch the product demo',
     href: 'https://drive.google.com/file/d/YOUR_FILE_ID/view',
     placeholder: false,
   }
   ```
   Use the **shareable link** from Google Drive (right-click the video → "Get link" → "Anyone with the link can view").
5. Push and Vercel re-deploys.

> 💡 For best results, host the video on Vimeo or YouTube instead — Google Drive's embed experience is clunky. If you upload to YouTube as "Unlisted", the link works the same way.

---

## 7. Custom domain (optional)

If you have a domain name (e.g. `hamidrizvi.com`):

1. In your Vercel project, go to **Settings → Domains**
2. Type your domain and click **"Add"**
3. Vercel shows you DNS records to add at your domain registrar (Namecheap, Google Domains, etc.)
4. Add them. Propagation takes 5 minutes to 24 hours.
5. Once propagated, your portfolio is live at your custom domain with automatic HTTPS.

If you don't have a domain, Vercel's free `*.vercel.app` URL is professional-looking enough for a job hunt.

---

## 8. Making future updates

Any time you want to update content:

1. Edit the relevant file:
   - **Hero copy / pull quote / certifications:** `components/HeroSection.tsx`
   - **Metrics:** `lib/personal-data.ts` (the `metrics` array)
   - **Case studies:** `lib/personal-data.ts` (the `caseStudies` array)
   - **Ask Hamid system prompt:** `app/api/chat/route.ts` (the `SYSTEM_PROMPT` constant)
   - **Photos:** `components/OffDutySection.tsx` (the `PHOTOS` array)
   - **Chess rating:** `components/OffDutySection.tsx` (the `CHESS_CURRENT` and `CHESS_PEAK` constants)
   - **Case study count:** `components/OffDutySection.tsx` (the `CaseStudyTracker` component)
   - **Email / LinkedIn / GitHub:** `lib/personal-data.ts` (the `profile` object)

2. Test locally:

   ```bash
   npm run dev
   ```

3. When happy, push:

   ```bash
   git add .
   git commit -m "Update X"
   git push
   ```

4. Vercel auto-deploys in ~90 seconds.

---

## Project structure

```
hamid-portfolio/
├── app/
│   ├── api/chat/route.ts      # Gemini streaming endpoint (Edge runtime)
│   ├── globals.css            # Design tokens + base styles
│   ├── layout.tsx             # Root HTML shell, metadata, fonts
│   └── page.tsx               # Home page composing all 6 sections
│
├── components/                # All 6 sections, each self-contained
│   ├── HeroSection.tsx
│   ├── MetricsWall.tsx
│   ├── CaseStudyScrollytell.tsx
│   ├── AskHamidChat.tsx
│   ├── OffDutySection.tsx
│   └── ContactSection.tsx
│
├── lib/
│   └── personal-data.ts       # Single source of truth for content
│
├── public/
│   ├── badges/                # CSM, CSPO, Google PM cert images
│   └── photos/                # Drop your photos here
│
├── .env.example               # Template — copy to .env.local
├── .gitignore
├── next.config.mjs
├── package.json
├── tsconfig.json
└── README.md                  # This file
```

---

## Common issues

### "Ask Hamid" returns an error

1. Check `.env.local` exists and has `GEMINI_API_KEY=AIzaSy...`
2. Check on Vercel: **Settings → Environment Variables** → confirm `GEMINI_API_KEY` is set
3. After adding env vars on Vercel, you must **redeploy** for them to apply
4. Verify your API key is active: go to [aistudio.google.com](https://aistudio.google.com), test it in their playground

### Build fails on Vercel

- Run `npm run build` locally first — fix any errors before pushing
- Common issue: TypeScript errors in `personal-data.ts` after edits. Make sure all string literals have matching quotes and arrays/objects close properly.

### Fonts look wrong

- Fonts are loaded from Google Fonts CDN (Fraunces, Inter, JetBrains Mono)
- If they fail to load, you'll see system fallbacks (Times, system-ui, monospace)
- Check your network — corporate firewalls sometimes block Google Fonts

### Photos don't show after upload

- Confirm filename casing matches exactly (`/photos/01.jpg` not `/photos/01.JPG`)
- Confirm path starts with `/` (root) not `public/`
- Hard refresh the browser (`Cmd+Shift+R` on Mac, `Ctrl+Shift+R` on Windows)

### Dev server won't start

- Port 3000 already in use? Run `npm run dev -- --port 3001`
- Node version too old? Update to 18.17+ from nodejs.org

---

## What's where (cheat sheet)

| To change...                                                        | Edit this file                    |
| ------------------------------------------------------------------- | --------------------------------- |
| Hero headline ("I turn / AI capabilities / into shipped products.") | `components/HeroSection.tsx`      |
| Pull quote ("Because the hard part...")                             | `components/HeroSection.tsx`      |
| Now-line ("Building production RAG at LexTrack AI")                 | `components/HeroSection.tsx`      |
| Degrees                                                             | `components/HeroSection.tsx`      |
| Certifications                                                      | `components/HeroSection.tsx`      |
| Metric numbers/labels                                               | `lib/personal-data.ts`            |
| Case study content                                                  | `lib/personal-data.ts`            |
| Case study GitHub links                                             | `lib/personal-data.ts` (cta.href) |
| Suggested chat prompts                                              | `components/AskHamidChat.tsx`     |
| AI persona (system prompt)                                          | `app/api/chat/route.ts`           |
| Photos                                                              | `components/OffDutySection.tsx`   |
| Chess rating                                                        | `components/OffDutySection.tsx`   |
| Najdorf board / explanation                                         | `components/OffDutySection.tsx`   |
| Case study counter (currently 48)                                   | `components/OffDutySection.tsx`   |
| Email / LinkedIn / GitHub URLs                                      | `lib/personal-data.ts`            |
| Site title / meta description                                       | `app/layout.tsx`                  |
| Color tokens / fonts                                                | `app/globals.css`                 |

---

## Credits

Designed and built April 2026.

**Typography:** Fraunces (display, optical-sized), Inter (body), JetBrains Mono (UI labels). All from Google Fonts.

**AI chat:** Powered by Gemini 2.5 Flash via the Google AI Studio API.

**Hosting:** Deployed on Vercel's edge network.

---

## License

This is a personal portfolio. Feel free to fork the structure, but please don't republish the content (case studies, copy, photos) as your own.
