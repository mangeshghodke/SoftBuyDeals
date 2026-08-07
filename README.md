<div align="center">

# 🛍️ SoftBuyDeals

### Fast · SEO-Friendly · Amazon Affiliate Website

[![Astro](https://img.shields.io/badge/Astro-v6-FF5D01?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)
![D1](https://img.shields.io/badge/D1-Database-3b82f6?style=for-the-badge&logo=cloudflare&logoColor=white)
![Amazon Associates](https://img.shields.io/badge/Amazon-Associates-FF9900?style=for-the-badge&logo=amazon)

</div>

---

## 📖 About

**SoftBuyDeals** is a modern Amazon affiliate website that curates the best deals on Amazon.in. Built with **Astro v6** (SSR) and **Tailwind CSS v4**, hosted on **Cloudflare Workers** with a **D1** serverless database.

The admin panel lets you add products, and product posts are automatically shared to **Telegram** and **Threads (Meta)**.

---

## ✨ Features

- 🚀 **Astro v6** with server-side rendering
- 🎨 **Tailwind CSS v4** styling
- 🔐 **Admin dashboard** with session-cookie auth (HMAC, 24h TTL), CSRF protection, scrypt password hashing
- 🛍️ **Amazon Associates deals** — curated deals with client-side Amazon capture (server-side scraping is blocked by Amazon)
- 🤖 **Auto-posting** to **Telegram channel** (photo + caption + inline keyboard)
- 📱 **Auto-posting** to **Threads (Meta)** (image + structured caption)
- 👁️ **Visitor counter** (D1-persisted)
- 📄 **Contact form** via Resend API
- 🔍 **SEO optimized** — JSON-LD schema, sitemap.xml, OG/Twitter cards
- ⚡ **No client-side framework** — vanilla JS only, minimal payload
- 📱 **Fully responsive**, dark-mode favicon
- 🚦 **Rate limiting** (D1-backed) on login & Amazon fetch endpoints
- 🔄 **CI/CD** via GitHub Actions → auto-deploys to Workers on push

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Astro v6](https://astro.build) (SSR, `output: 'server'`) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) via Vite plugin |
| Language | TypeScript / JavaScript (ES2022+) |
| Hosting | [Cloudflare Workers](https://workers.cloudflare.com) |
| Database | [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite) |
| Email | [Resend](https://resend.com) API |
| Notifications | [Telegram Bot API](https://core.telegram.org/bots/api) |
| Social | [Threads (Meta) Graph API](https://developers.facebook.com/docs/threads) |
| CI/CD | GitHub Actions → `wrangler deploy` |
| Adapter | `@astrojs/cloudflare@^13.7.0` |

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 22.12.0
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (`npm i -g wrangler`)
- Cloudflare account with D1 database created

### Setup

```bash
git clone https://github.com/mangeshghodke/SoftBuyDeals.git
cd SoftBuyDeals
npm install
```

### Configure Secrets

```bash
wrangler secret put ADMIN_EMAIL
wrangler secret put ADMIN_PASSWORD_HASH   # scrypt hash of your password
wrangler secret put SESSION_SECRET
wrangler secret put RESEND_API_KEY
wrangler secret put TELEGRAM_BOT_TOKEN
wrangler secret put TELEGRAM_CHANNEL_ID   # e.g. @softbuydeals
wrangler secret put THREADS_ACCESS_TOKEN  # Meta long-lived page token
wrangler secret put THREADS_USER_ID
```

### Seed Database

```bash
wrangler d1 execute softbuydeals --file=scripts/seed.sql
```

### Run Locally

```bash
npm run dev
```

### Build & Deploy

```bash
npm run build
npm run deploy
```

Or push to `main` → GitHub Actions deploys automatically.

---

## 📁 Project Structure

```
src/
├── components/      # Navbar, Footer, Features, etc.
├── layouts/         # BaseLayout.astro (SEO, preconnect, JSON-LD)
├── lib/
│   ├── db.ts        # D1 CRUD (async, products + visitor_counter)
│   ├── data.ts      # Re-exports from db.ts
│   ├── session.ts   # HMAC session cookie + CSRF helpers
│   ├── rate-limit.ts# D1-backed rate limiting
│   ├── telegram.ts   # notifyProduct() → Telegram channel
│   └── threads.ts    # postThread() → Meta Threads
├── pages/
│   ├── index.astro  # Home hero + category carousel
│   ├── products/    # Grid with pagination + category scroll
│   ├── admin/       # Dashboard (login, product CRUD)
│   ├── api/         # Products REST, contact, counter, login
│   └── sitemap.xml.ts
├── middleware.ts    # Auth guard + security headers
└── config.ts        # SITE_URL, SOCIAL_LINKS, NAV_LINKS
scripts/
├── seed.mjs         # Seed script
├── seed.sql         # Sample product data + CREATE TABLE
└── postbuild.mjs    # Strips unused bindings from wrangler.json
```

---

## 🧩 Key Integrations

### Telegram
`src/lib/telegram.ts` — Sends product photo + HTML caption (title, offer price, MRP strikethrough, savings %, inline keyboard button) to the configured Telegram channel on product creation.

### Threads (Meta)
`src/lib/threads.ts` — Posts product image → fallback to text with structured caption (✅ offer price, ❌ MRP, 🔥 savings, hashtags) to Threads via Meta Graph API v1.0.

### Background Notifications
Product creation triggers Telegram + Threads via `cfContext.waitUntil()` — the HTTP response returns instantly while notifications run in background.

---

## 🔐 Admin

| Route | Purpose |
|---|---|
| `/admin/login/` | Login with email + password |
| `/admin/dashboard/` | Product list, add/edit/delete |
| `/admin/add/` | Add product (or fetch from Amazon URL) |
| `/admin/edit/[id]/` | Edit existing product |

Auth: HMAC-signed session cookie (24h TTL) + CSRF token via meta tag.

---

## 🌐 Deployment

- **URL**: `https://softbuydeals.in/`
- **Build**: `npm run build` (Astro SSR build + postbuild.mjs)
- **Deploy**: `npm run deploy` (wrangler deploy with `dist/server/wrangler.json`)
- **CI**: GitHub Actions on push to `main` — `npm ci && npm run build && wrangler deploy`

---

## 📱 SoftBuyDeals Mobile App

The official **SoftBuyDeals Android admin app** lets you add and edit products right from your phone.

- **Package**: `in.softbuydeals.app` — built with **Expo SDK 57 / React Native 0.86** (new architecture)
- **ARM64-only** build (`arm64-v8a`) — smaller, ~35 MB release APK
- **Backend**: consumes the same site JSON API (`/api/products`) over HTTPS
  - JSON-mode login (`POST /api/login` with `Accept: application/json` → 200 + `Set-Cookie`)
  - CSRF-guarded writes via `GET /api/csrf` (session-guarded)
  - Accepts JSON bodies (not just form-data) on all write endpoints
- **Features**: session auth (24h HMAC cookie), product add/edit with price normalization (₹ auto-prepend), image URL fields (up to 3), coupon, rating, category, AI description/review generation
- **Splash**: website-themed (indigo `#4f46e5`) SBD rounded-square logo + "SoftBuyDeals"
- **Companion repo**: https://github.com/mangeshghodke/SoftBuyDeals-App

Build a standalone release APK locally:

```bash
cd app   # or clone the SoftBuyDeals-App repo
npx expo prebuild -p android --no-install
cd android && ./gradlew assembleRelease   # output: app/build/outputs/apk/release/app-release.apk
```

Requires Android SDK (arm64) + JDK 17+. The APK is signed with the debug keystore — generate a real keystore before publishing to the Play Store.

---

## 💰 Affiliate Disclaimer

SoftBuyDeals participates in the **Amazon Associates Program**. Product links contain affiliate tracking (`tag=softbuydeals01-21`), earning a commission from qualifying purchases at **no additional cost** to customers.
