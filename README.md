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

The admin panel lets you add products — optionally auto-fetched from Amazon URLs — and product posts are automatically shared to **Telegram** and **Threads (Meta)**.

---

## ✨ Features

- 🚀 **Astro v6** with server-side rendering
- 🎨 **Tailwind CSS v4** styling
- 🔐 **Admin dashboard** with JWT auth, CSRF protection, scrypt password hashing
- 🛍️ **Amazon scraper** — paste an Amazon URL, auto-fill product details
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
│   ├── session.ts   # JWT + CSRF helpers
│   ├── rate-limit.ts# D1-backed rate limiting
│   ├── telegram.ts  # notifyProduct() → Telegram channel
│   └── threads.ts   # postThread() → Meta Threads
├── pages/
│   ├── index.astro  # Home hero + category carousel
│   ├── products/    # Grid with pagination + category scroll
│   ├── admin/       # Dashboard (login, product CRUD)
│   ├── api/         # Products REST, contact, counter, login, fetch-amazon
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
`src/lib/threads.ts` — Posts product image + structured caption (✅ offer price, ❌ MRP, 🔥 savings, hashtags) to Threads via Meta Graph API v1.0.

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

Auth: JWT stored in `astro-auth-jwt` cookie + CSRF token via meta tag.

---

## 🌐 Deployment

- **URL**: `https://softbuydeals.ghodke-mangesh2.workers.dev/`
- **Build**: `npm run build` (Astro SSR build + postbuild.mjs)
- **Deploy**: `npm run deploy` (wrangler deploy with `dist/server/wrangler.json`)
- **CI**: GitHub Actions on push to `main` — `npm ci && npm run build && wrangler deploy`

---

## 💰 Affiliate Disclaimer

SoftBuyDeals participates in the **Amazon Associates Program**. Product links contain affiliate tracking (`tag=softbuydeals-21`), earning a commission from qualifying purchases at **no additional cost** to customers.
