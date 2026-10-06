# Flex

**Search once. Compare everywhere.**

Flex is a web app that lets you search for a product and compare its price,
rating, and reviews across Amazon India, Flipkart, and Myntra, with a short
AI-generated summary of what buyers like and don't like.

## What's real vs. demo data (important)

This is the Phase 1 MVP, running in **demo mode**:

- **Merchant data (prices, ratings, reviews) is seeded sample data**, not
  live Amazon/Flipkart/Myntra listings. None of those platforms offers a free,
  individually-accessible API, and scraping them would violate their own
  terms of service and `robots.txt` — see `docs/ARCHITECTURE.md` for the
  details and `docs/ROADMAP.md` for the legitimate path to real data later.
- **"View Deal" links are real.** They go to each platform's own public
  search-results page for the matched product — not scraped, just a
  constructed URL — so clicking through actually works today.
- **The AI Review summary is a deterministic, rule-based summarizer**, not a
  real LLM call. It only ever uses the review text it's given — it can't
  invent anything beyond that.
- **The database is a real Supabase Postgres project.**

## Running it locally

You need [Node.js](https://nodejs.org) 20.9 or later installed.

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in a real `DATABASE_URL` (see
   "Database setup" below). This is the only credential Flex needs — no
   merchant or AI API keys required for Phase 1.
3. Start the app:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) and try searching
   "iPhone 17 Pro 256GB" or any of the examples on the homepage.

### Database setup

Flex uses [Supabase](https://supabase.com)'s free Postgres tier.

1. Create a free Supabase project (or use the one already provisioned for
   this project).
2. In the project dashboard, go to **Project Settings → Database →
   Connection string** and copy the **direct connection** URI (port 5432,
   not the pooled one).
3. Paste it into `.env` as `DATABASE_URL`.

If the database is ever unreachable, Flex still works — price/rating
caching degrades gracefully to "compute fresh" instead of crashing the page.

## Testing

```bash
npm test          # unit tests (Vitest) — normalization, matching, providers, validation, AI safeguards
npm run test:e2e  # end-to-end smoke test (Playwright) — home → search → compare → AI summary → redirect
```

## Project layout

See `docs/ARCHITECTURE.md` for the full picture. The short version:

```
app/                   Pages and routes (Next.js App Router)
lib/core/providers/     Amazon/Flipkart/Myntra adapters (mocked in Phase 1)
lib/core/matching/      Turns messy merchant titles into comparable products
lib/core/ai/            AI review summarizer (mocked in Phase 1)
lib/core/search/        Ties providers + matching + caching + AI together
lib/db/                 Prisma client and caching logic
lib/security/           Rate limiting and the merchant-redirect allowlist
components/             UI components
```

## More docs

- `docs/ARCHITECTURE.md` — how the pieces fit together, with a diagram
- `docs/SECURITY.md` — threat model, mitigations, and what's still open
- `docs/ROADMAP.md` — what's built, what's next, what's deliberately deferred
