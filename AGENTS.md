# SoftBuyDeals — Production Site (Astro + Cloudflare Workers)

Amazon Associates deals site. Live at https://softbuydeals.in. SSR via Cloudflare Workers + D1 (every request reads from DB; no rebuild needed for new products).

## Repo / backup
- GitHub: https://github.com/mangeshghodke/SoftBuyDeals.git (origin, branch `main`)
- Every push to `main` auto-deploys via `.github/workflows/deploy.yml` (wrangler deploy)
- Pushing to `main` IS the deployment. `gh` CLI is NOT installed; repo creation must be done via UI or API, not `gh`.

## Build / deploy commands
- `export CLOUDFLARE_API_TOKEN='<token from shell history / 1Password — NOT committed to git>'` (full Workers perms, NO DNS perms; account `3af8394cb765e3dee53628b27a334257`, zone softbuydeals.in `d2819ee3ce34803b9c192e420f95e961`)
- `export NVM_DIR="$HOME/.var/app/com.vscodium.codium/config/nvm" && . "$NVM_DIR/nvm.sh" && nvm use 22`
- Build check: `npm run build`
- Deploy: `git add ... && git commit -m "..." && git push origin main` (Workers deploy takes ~50-70s to fully propagate; edge responses can be stale briefly after a push)

## URLs & SEO
- Product pages: `/products/{id}/` (canonical). `/p/{id}/` is a 301 redirect.
- Guides: `/guides/{dash-slug}/` (e.g. `/guides/home-kitchen/`). Old `%20`-format guide URLs (e.g. `/guides/home%20%26%20kitchen/`) 301 → dash slug. Unknown categories render a GENERIC_GUIDE page (no redirect). Astro decodes params with `decodeURI` (keeps `%26` literal) — `guides/[category].astro` decodes again with `decodeURIComponent` before matching.
- Sitemap: `sitemap.xml.ts` (static + all guide slugs + product URLs). Guides list built from `CATEGORY_GUIDES` + product categories (deduped).
- 8 original guide categories have keyword-targeted `seoMeta`; the other 24+ use generic `${displayName} Buying Guide` fallback.
- Any new product category automatically gets: a guide page (GENERIC_GUIDE fallback), sitemap entry, product-page guide link.
- Google Search Console: DNS-TXT verified, sitemap submitted and valid. Site NOT yet indexed as of Aug 2026 — request indexing for homepage + key guides.

## Key files
- `src/lib/categories.ts`: CATEGORY_GUIDES (32 entries), GENERIC_GUIDE, `getGuideSlug()`, `getCategoryKey()`, `getCategoryGuide()`, CATEGORY_ICONS, DEFAULT_CATEGORY_ICON
- `src/pages/guides/[category].astro`: guide page, 301-canonicalization, seoMeta
- `src/pages/products/[id].astro`: canonical product page (Product schema, review, coupon, related)
- `src/pages/api/products.ts`: full JSON API — GET (all/single via `?id=`), POST (create or update-if-`id` present), PUT (update), DELETE (`?id=` + `x-csrf-token` header). Returns JSON when `Accept: application/json`. Writes fire Telegram + Threads via `ctx.waitUntil`.
- `src/pages/api/login.ts`: login with JSON mode (`Accept: application/json` → JSON response + Set-Cookie), plus HTML redirect mode for forms
- `src/pages/api/csrf.ts`: GET endpoint returning `{csrfToken}` (session-guarded) — used by the mobile app
- `src/pages/api/generate-description.ts`, `generate-review.ts`: AI copy generation (session + CSRF guarded)
- `src/lib/session.ts`: session cookie (HMAC, 24h TTL) + CSRF tokens
- `src/middleware.ts`: www→apex 301, admin auth guard, security headers/CSP
- `src/pages/admin/products/add.astro` + `edit/[id].astro`: admin forms with `normalizePrice()` (₹ auto-prepend)

## Admin
- Session cookie auth (24h), CSRF token required on all writes (`_csrf` form field or `x-csrf-token` header)
- Admin fields: title (required), price (₹), originalPrice (₹), coupon, rating (0-5), category (text), imageUrl/imageUrl2/imageUrl3 (up to 3 URLs), amazonUrl, affiliateUrl, description, review
- Login: email/password (`ADMIN_EMAIL`/`ADMIN_PASSWORD_HASH` scrypt), rate-limited (5/15min per IP, 10-strike 30min account lockout)

## External integrations
- Telegram notify on product create (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHANNEL_ID`)
- Threads post on create (`THREADS_ACCESS_TOKEN`, `THREADS_USER_ID`) — text-only (API can't post image+text in one request); caption capped at 500 chars by truncating the title line
- Contact form via Resend from support@softbuydeals.in
- AI: `@cf/zai-org/glm-4.7-flash` model

## Constraints / blockers
- Cloudflare API token CANNOT modify DNS (user does DNS in Cloudflare dashboard)
- Amazon blocks automated ASIN lookup/server-side scraping — capture is done client-side in the mobile app's WebView instead
- Prices are hidden publicly (admin/Telegram/Threads only)

## Mobile app (companion project)
- Built separately in `../app/` (Expo/React Native, own git repo) — see `../app/AGENTS.md`
- Consumes the same JSON API over HTTPS. Backend is ready for app write flows:
  1. JSON mode on `POST /api/login` (200 + Set-Cookie when `Accept: application/json`) — DONE
  2. `GET /api/csrf/` endpoint (session-guarded) returning `{csrfToken}` — DONE
  - Products API also accepts JSON bodies (not just form-data)
- App testing uses the LIVE API — test products are real and must be deleted after testing (or add TEST_MODE to point at a dev API)
