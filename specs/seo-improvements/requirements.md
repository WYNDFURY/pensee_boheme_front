# Requirements — SEO Improvements

## 1. Introduction

A targeted SEO hardening pass addressing concrete bugs and gaps found in the current implementation. The site has a solid SEO foundation (useSeoMeta on every page, structured data, @nuxtjs/seo modules) but has several correctness issues that undermine the work already done.

## 2. Alignment with Product Vision

From `specs/product.md`, goal #4: _"SEO visibility — rank for 'fleuriste normandie', 'décoration mariage normandie', 'fleurs séchées normandie', 'EVJF normandie'."_

The improvements directly unblock that goal by ensuring crawlers receive consistent, correct signals.

---

## 3. Requirements

### REQ-1 — Fix domain inconsistency in meta/schema URLs

**Issue found:** Multiple pages use `https://penseeboheme.fr` (no hyphen) instead of `https://pensee-boheme.fr` (the real domain). Affected:
- `app/pages/galeries/[slug].vue` — all og/twitter/schema/breadcrumb URLs
- `app/pages/infos-pratiques/index.vue` — ogImage, ogUrl, twitterImage, sameAs
- `app/pages/locations/index.vue` — ogImage, twitterImage, schema url
- `app/pages/univers/professionnels/index.vue` — ogImage, twitterImage, breadcrumb, schema url

**User Story:** As a search engine, I need consistent canonical URLs so I can correctly attribute all signals to `pensee-boheme.fr` and not split authority.

**Acceptance Criteria:**
- All `ogImage`, `ogUrl`, `twitterImage`, `sameAs`, `url`, `item` breadcrumb fields, and any other hardcoded URLs in the affected pages use `https://pensee-boheme.fr` (with hyphen).
- Zero occurrences of `penseeboheme.fr` remain in production page code.

---

### REQ-2 — Fix `runtimeConfig.head` misconfiguration in nuxt.config.ts

**Issue found:** In `nuxt.config.ts`, global head tags (geo meta, OG locale, OG type, business contact data, Twitter Card defaults, keywords, author) are nested under `runtimeConfig.head`. In Nuxt 3, `runtimeConfig` is for runtime variables — this config block has no effect on the rendered `<head>`. The global meta is silently ignored.

**User Story:** As a search engine, I need the correct locale, geo coordinates, and OG type present on every page so I can correctly categorize the site as a local French business.

**Acceptance Criteria:**
- The global head configuration (meta, link) is moved from `runtimeConfig.head` to `app.head` in `nuxt.config.ts`.
- `app.head` emits the following tags on every page:
  - `geo.region: FR-NOR`, `geo.placename`, `geo.position`, `ICBM`
  - `og:locale: fr_FR`, `og:type: website`
  - `author: Cécile Devaux - Pensée Bohème`
  - Google Fonts preconnect + stylesheet links (currently in `runtimeConfig.head.link`)
- Global `<title>` fallback remains meaningful if page-level `useSeoMeta` does not set one.
- `runtimeConfig` retains only `public.apiBaseUrl`.

---

### REQ-3 — Fix relative OG/Twitter image URLs on homepage

**Issue found:** `app/pages/home/index.vue` sets `ogImage: '/home/landpage_1.jpg'` and `twitterImage: '/home/landpage_1.jpg'` — relative paths. Social crawlers (Facebook, Twitter/X, LinkedIn) require absolute URLs for preview images.

**User Story:** As a visitor sharing the site on social media, I want to see the correct preview image so the share looks professional and entices clicks.

**Acceptance Criteria:**
- `ogImage` and `twitterImage` on the home page use the full absolute URL: `https://pensee-boheme.fr/home/landpage_1.jpg`.

---

### REQ-4 — Fix root redirect: use 301 instead of JS `navigateTo`

**Issue found:** `app/pages/index.vue` uses `navigateTo({ name: 'home' })` in `<script setup>`. This is a client-side JS redirect — search engines may or may not follow it. For static site generation, a proper redirect rule is preferable.

**User Story:** As a search engine, I need a reliable redirect from `/` to `/home` so link equity is correctly passed and the canonical home URL is clear.

**Acceptance Criteria:**
- The root `/` redirects to `/home` via Nuxt's server-side `routeRules` (301 permanent redirect) configured in `nuxt.config.ts` (`routeRules: { '/': { redirect: '/home' } }`), replacing the JS-only approach.
- The `app/pages/index.vue` component is removed or becomes a static shell (no JS redirect needed).

---

### REQ-5 — Add dynamic gallery routes to sitemap

**Issue found:** `@nuxtjs/sitemap` is installed but unconfigured. The dynamic route `galeries/[slug]` is not pre-rendered (absent from `nitro.prerender.routes`) and not included in the sitemap. Individual gallery pages — the primary conversion tool per product vision — are invisible to crawlers.

**User Story:** As a search engine, I need to discover all gallery pages so I can index them and surface them for relevant searches (e.g., "galerie mariage normandie").

**Acceptance Criteria:**
- `nuxt.config.ts` includes a `sitemap` configuration with a `urls` resolver or `sources` pointing to the API endpoint `/galleries` to fetch all gallery slugs at build time.
- The generated sitemap at `/sitemap.xml` includes URLs for all `/galeries/[slug]` pages.
- Existing static routes (`/home`, `/galeries`, `/engagement`, `/infos-pratiques`, and all `/univers/*` pages) are also present in the sitemap.
- `/admin/**` and `/cgv` are excluded from the sitemap (or marked `noindex`).

---

### REQ-6 — Deduplicate LocalBusiness schema into a shared composable

**Issue found:** `defineLocalBusiness` is copy-pasted across 9 pages with inconsistent fields:
- `areaServed` alternates between a string (`'Normandie, Seine-Maritime, France'`) and arrays.
- Some pages omit `streetAddress`, `geo`, `openingHours`, `priceRange`.
- Some pages reference `https://penseeboheme.fr` (wrong domain) in schema `url` and `sameAs`.
- The home page schema has `openingHours` defined twice (in `defineLocalBusiness` AND separately via `defineOpeningHours`).

**User Story:** As a search engine, I need consistent business entity data across all pages so I can build a reliable knowledge graph entry for Pensée Bohème.

**Acceptance Criteria:**
- A composable `useBusinessSchema()` is created in `app/composables/` that exports the canonical `LocalBusiness` schema object.
- All service pages call `useBusinessSchema()` and optionally extend it (e.g., with page-specific `offers`).
- The canonical schema includes: `@type: Florist`, correct `url`, `streetAddress`, `geo`, `telephone`, `email`, `openingHours`, `priceRange`, `founder`, `areaServed: ['Bec-de-Mortagne', 'Le Havre', 'Rouen', 'Normandie', 'Seine-Maritime']`, `sameAs: ['https://www.facebook.com/penseeboheme76']`.
- No page contains a hardcoded `defineLocalBusiness` block that duplicates this data.

---

### REQ-7 — Add `noindex` to CGV page

**Issue found:** `/cgv` (Conditions Générales de Vente) is indexed (`robots: 'index, follow'` in its `useSeoMeta`). Legal pages provide no SEO value and waste crawl budget.

**User Story:** As a site owner, I want crawl budget reserved for content pages so search engines spend time on revenue-generating pages.

**Acceptance Criteria:**
- `/cgv` has `robots: 'noindex, nofollow'` in its `useSeoMeta` call.
- `/cgv` is excluded from the sitemap.

---

### REQ-8 — Add Instagram to `sameAs` social signals

**Issue found:** All `sameAs` arrays only include Facebook. Instagram is the primary visual portfolio platform and a strong local business signal for Google's Knowledge Panel.

**User Story:** As a search engine, I need all official social profiles linked as `sameAs` so I can consolidate the entity's online presence.

**Acceptance Criteria:**
- The `useBusinessSchema()` composable (REQ-6) includes Instagram URL in `sameAs`.
- Instagram URL format: `https://www.instagram.com/penseeboheme76/` (verify the actual handle — use the handle shown in the `infos-pratiques` page or product spec).

---

## 4. Non-Functional Requirements

### Architecture
- All changes are confined to existing files; no new page routes are created.
- The `useBusinessSchema()` composable follows the existing composable pattern in `app/composables/`.
- Sitemap configuration uses `@nuxtjs/sitemap`'s `sources`/`urls` API (check latest docs — the module API changed between v2, v3, v4).

### Performance
- REQ-4's `routeRules` redirect is zero-JS — no client-side overhead on root.
- REQ-5's sitemap generation uses the production API URL (`api.pensee-boheme.fr`) during `yarn generate:prod`.

### Reliability
- REQ-5: sitemap generation must not fail if the API is unreachable at build time (handle gracefully with empty array fallback).
- REQ-2: moving head config must not break existing Google Fonts loading (preconnect links must remain).

### Correctness
- After changes, zero occurrences of `penseeboheme.fr` (no hyphen) remain in any `.vue` or `.ts` source file.
- After changes, `app.head` emits geo meta tags verifiable via View Source on the generated HTML.
