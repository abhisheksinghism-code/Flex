# Flex Security

## Threat model

Flex is a public, unauthenticated, free product. The realistic threats at
this stage are: abusive/scripted traffic, injection via the one text input
(search), being turned into an open redirector, and accidental data
exposure through the database.

| Attack surface | Mitigation |
|---|---|
| Search input (XSS, injection, oversized payloads) | `lib/validation/search.ts` — zod schema: length-capped (120 chars), strips `< > $ \`` before anything else touches the string. React escapes all output by default. |
| `/compare/[slug]` path parameter | zod-validated against `^[a-z0-9-]+$` before touching the database; anything else hits Next's `notFound()`. |
| Automated/abusive search traffic | Fixed-window rate limit, 30 requests/minute per IP (`lib/security/rate-limit.ts`). |
| Flex used as an open redirector | `lib/security/redirect.ts` — every outbound link is checked against an allowlist of exactly the three merchant hosts, HTTPS-only, and must have come from a provider's own `buildRedirectUrl()`, never from user input. |
| SSRF via merchant links | Same allowlist — Flex never fetches or redirects to an arbitrary URL. |
| Secrets in the browser | The only secret is `DATABASE_URL`, read server-side only (`lib/db/client.ts`), never passed to a Client Component. No AI/merchant API keys exist yet. |
| Database exposure | Row Level Security is enabled on all 8 tables with zero policies — Supabase's public anon-key REST API can no longer read or write anything. The app talks to Postgres only through Prisma's direct connection (table owner), which RLS doesn't restrict. |
| One slow/broken provider taking down the whole page | Each provider call has its own timeout (`PROVIDER_TIMEOUT_MS`, 4s) inside `Promise.allSettled` — a failure there is logged and excluded, not thrown. |
| Database outage breaking the page | Every cache read/write is wrapped so a DB error is treated as a cache miss, not an unhandled exception — see `lib/db/cache.ts`. |
| Generic error pages leaking internals | `app/error.tsx` logs the real error server-side and shows the user a generic message only. |
| Clickjacking / MIME sniffing / referrer leakage | `next.config.ts` sets `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and a restrictive `Permissions-Policy`. |

## Known, accepted risks (documented, not ignored)

- **Rate limiting is in-memory, per server process.** Fine for a single
  instance. If Flex is ever deployed to multi-instance serverless, each
  instance has its own counters — upgrade to Upstash Redis's free tier at
  that point (see `docs/ROADMAP.md`).
- **`npm audit` reports 4 high-severity findings inside the `prisma` CLI's
  own dev-tooling dependency chain** (a bundled MySQL driver and a config
  merger). Flex is Postgres-only and never invokes either code path; these
  are dev-time CLI dependencies, not runtime dependencies shipped to
  production. Re-check on the next Prisma upgrade rather than downgrading to
  "fix" them.
- **No CSRF token on the search form.** It's a GET request with no side
  effects beyond a search-query log row, so CSRF isn't a meaningful risk
  here. Revisit if a mutating, authenticated action is ever added.

## Production checklist (before any public deployment)

- [ ] Confirm `.env` is never committed (`.gitignore` already excludes
      `.env*`; recheck before every `git add`).
- [ ] Set `DATABASE_URL` via the hosting platform's secret manager, not a
      committed file.
- [ ] Re-run `npx supabase` security/performance advisors after any schema
      change.
- [ ] Move rate limiting to Upstash Redis if deploying to multi-instance
      serverless.
- [ ] Add HTTPS-only enforcement at the hosting layer (Vercel does this by
      default).
- [ ] Re-audit dependencies (`npm audit`) immediately before launch.
- [ ] Decide on and implement real request logging/monitoring (see
      Observability in `docs/ROADMAP.md`) before relying on this for uptime
      visibility.
