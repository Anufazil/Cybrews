# SIGNAL — Cybersecurity Daily

A dark-themed daily cybersecurity news feed. Every story links back to its source.

## Stack
- **Frontend**: Next.js (App Router) + Tailwind CSS
- **Database**: Supabase (Postgres)
- **Ingestion**: Node.js script (`rss-parser`) run on a schedule via GitHub Actions
- **Hosting**: Vercel (frontend) + GitHub Actions (cron) — both free tier

## Setup

### 1. Supabase
1. Create a free project at supabase.com
2. Open the SQL editor and run `supabase/schema.sql`
3. Copy your Project URL, `anon` key, and `service_role` key from Settings → API

### 2. Environment variables
Copy `.env.example` to `.env.local` and fill in your Supabase values.

### 3. Install and run locally
```bash
npm install
npm run fetch-feeds   # populates the database with today's articles
npm run dev           # starts the site at localhost:3000
```

### 4. Deploy
- Push this repo to GitHub
- Import it into Vercel, add the two `NEXT_PUBLIC_*` env vars in Vercel's project settings
- In your GitHub repo settings → Secrets → Actions, add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` — this powers the scheduled ingestion job in `.github/workflows/fetch.yml`

## Adding more sources
Edit the `FEEDS` array in `scripts/fetch-feeds.js`. Any valid RSS/Atom feed URL works.

## Adjusting severity tagging
Severity is assigned by keyword match in `scripts/fetch-feeds.js` (`CRITICAL_KEYWORDS`, `HIGH_KEYWORDS`). Everything else defaults to `info`. This is intentionally simple for v1 — swappable later for an LLM-based classifier if you want smarter tagging.
