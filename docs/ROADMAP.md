# Flex Roadmap

## MVP (built now)

- Homepage search, comparison table with lowest-price highlight, AI Review
  card, loading/empty/error states, mobile-friendly layout.
- `AmazonProvider` / `FlipkartProvider` / `MyntraProvider` — mocked, common
  interface, real redirect links.
- Deterministic product normalization and matching, with a disambiguation
  screen when confidence is low.
- Mock, rule-based AI review summarizer behind a swappable
  `AIReviewProvider` interface.
- Real Supabase Postgres database with price/rating/AI-summary caching and
  history-ready snapshot tables.
- Security baseline: input validation, redirect allowlist, rate limiting,
  RLS, secure headers, graceful degradation on provider/DB failure.
- Unit tests (matching, providers, validation, AI safeguards) and an E2E
  smoke test covering the full user journey.
- Privacy, Terms, and Disclaimer pages.

## V1 (next, not built yet)

- **Real merchant data, one platform at a time** — only through legitimate
  means:
  - Apply for the **Amazon Associates Program** (requires ~3 qualifying
    sales within 180 days before Product Advertising API access is
    granted).
  - Apply for the **Flipkart Affiliate Program** (manual approval).
  - Myntra has no public API; revisit if one becomes available, or leave
    Myntra mocked indefinitely rather than scrape it.
  - Each integration replaces one mock provider behind the same
    `MerchantProvider` interface — never a silent swap, always called out
    explicitly to the product owner first.
- Production deployment (Vercel free tier), with `DATABASE_URL` and any
  future API keys in the platform's secret manager.
- Move rate limiting to Upstash Redis if deployed to multi-instance
  serverless.
- SEO: sitemap, robots configuration, Open Graph metadata, product
  structured data on `/compare/[slug]` pages.
- Real observability: platform-native logging/monitoring for provider
  failures, search failures, slow requests.

## Future (architected for, not built)

- Price history UI ("lowest price in the last 30 days") — the
  `PriceSnapshot`/`RatingSnapshot` tables already store this; only the UI is
  missing.
- Price-drop alerts.
- Real LLM-backed `AIReviewProvider` (e.g. Claude), swapped in behind the
  existing interface once real review data exists to summarize.
- AI buying assistant, alternative-product recommendations, deal-quality
  score, cross-platform review intelligence.
- Optional accounts, saved products, watchlists.
- Affiliate monetization — transparent to users, layered onto the real
  merchant integrations above once they exist.
