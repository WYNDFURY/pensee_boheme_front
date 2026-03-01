# Tasks — SEO Improvements

## Phase 1 — Config hardening

**Goal:** `nuxt.config.ts` emits global geo/OG meta on every page, root URL redirects via 301, sitemap module is pointed at the gallery source endpoint, dead `runtimeConfig.head` code is removed.

**Verify:** `yarn dev` starts without errors. View Source on `/home` → `<meta name="geo.region" content="FR-NOR">` and `<meta property="og:locale" content="fr_FR">` are present. Navigating to `http://localhost:3000/` redirects to `/home`.

### Tasks

- **T1.1** — In `nuxt.config.ts`, merge the `app` block: move all entries from `runtimeConfig.head` (meta + link) into `app.head`. Keep `baseURL: '/'`. Drop the non-standard tags (`og:type: business.business`, `business:contact_data:*` properties) — replace `og:type` with `website`. The `title` in `app.head` becomes the fallback title.

- **T1.2** — In `nuxt.config.ts`, remove `runtimeConfig.head` entirely. `runtimeConfig` should only contain `public.apiBaseUrl`.

- **T1.3** — In `nuxt.config.ts`, add at the root level:
  ```ts
  routeRules: {
    '/': { redirect: { to: '/home', statusCode: 301 } },
  },
  ```

- **T1.4** — In `nuxt.config.ts`, add `sitemap` config:
  ```ts
  sitemap: {
    sources: ['/api/__sitemap__/urls'],
    exclude: ['/admin/**', '/cgv'],
  },
  ```

- **T1.5** — In `app/pages/index.vue`, remove the `<script setup>` block containing `navigateTo`. Leave an empty `<template><div /></template>` with no script. The `routeRules` redirect now handles `/`.

---

## Phase 2 — Sitemap server route

**Goal:** A Nitro server handler at `/api/__sitemap__/urls` fetches all gallery slugs from the backend API and returns valid `SitemapUrl[]` entries. `@nuxtjs/sitemap` picks these up during `yarn generate:prod`.

**Verify:** Run `yarn generate:prod`. Then `yarn preview`. GET `http://localhost:3000/sitemap.xml` → response body contains `<loc>https://pensee-boheme.fr/galeries/</loc>` entries for each gallery. The request must not fail even when the API is unavailable (returns empty array).

### Tasks

- **T2.1** — Create directory `server/api/__sitemap__/` if it does not exist.

- **T2.2** — Create `server/api/__sitemap__/urls.ts`:
  ```ts
  import type { SitemapUrl } from '#sitemap/types'

  export default defineEventHandler(async (): Promise<SitemapUrl[]> => {
    const config = useRuntimeConfig()
    const apiBase = config.public.apiBaseUrl

    try {
      const galleries = await $fetch<{ slug: string }[]>(`${apiBase}/galleries`)
      return galleries
        .filter((g) => !!g.slug)
        .map((g) => ({
          loc: `/galeries/${g.slug}`,
          changefreq: 'monthly' as const,
          priority: 0.8,
        }))
    } catch {
      return []
    }
  })
  ```

- **T2.3** — Also add `/galeries/` dynamic routes to `nitro.prerender.routes` so gallery pages are actually statically generated (not just in the sitemap). Update `nuxt.config.ts` `nitro.prerender.routes` to include a fetch of gallery slugs. Use Nitro's `hooks` approach or simply add a `prerender.crawlLinks: true` to let Nitro follow links from the pre-rendered `/galeries` index page.

  Preferred approach — add to `nitro`:
  ```ts
  nitro: {
    prerender: {
      routes: ['/home', '/galeries', '/engagement', '/infos-pratiques'],
      crawlLinks: true,   // follows <a href> from pre-rendered pages → discovers /galeries/[slug]
      ignore: ['/admin/**'],
    },
  },
  ```

---

## Phase 3 — Domain & image URL corrections

**Goal:** Zero occurrences of `penseeboheme.fr` (missing hyphen) in source files. Home page OG/Twitter images use absolute URLs.

**Verify:** `grep -r "penseeboheme\.fr" app/` returns no output. View Source on `/home` → `og:image` value is `https://pensee-boheme.fr/home/landpage_1.jpg`.

### Tasks

- **T3.1** — `app/pages/galeries/[slug].vue`: replace every occurrence of `https://penseeboheme.fr` with `https://pensee-boheme.fr`. Affected fields: `ogImage`, `ogUrl`, `twitterImage`, schema `url`, breadcrumb `item` values.

- **T3.2** — `app/pages/infos-pratiques/index.vue`: replace `https://penseeboheme.fr` → `https://pensee-boheme.fr` in `ogImage`, `ogUrl`, `twitterImage`, and `sameAs` array.

- **T3.3** — `app/pages/locations/index.vue`: replace `https://penseeboheme.fr` → `https://pensee-boheme.fr` in `ogImage`, `twitterImage`, and schema `url`/`sameAs`.

- **T3.4** — `app/pages/univers/professionnels/index.vue`: replace `https://penseeboheme.fr` → `https://pensee-boheme.fr` in `ogImage`, `twitterImage`, breadcrumb `item` values, and schema `url`/`sameAs`.

- **T3.5** — `app/pages/home/index.vue`: change `ogImage` from `'/home/landpage_1.jpg'` to `'https://pensee-boheme.fr/home/landpage_1.jpg'`. Same for `twitterImage`.

---

## Phase 4 — Business schema composable

**Goal:** A single `useBusinessSchema()` composable holds all canonical `LocalBusiness` data. All service pages use it, eliminating 9 copies of duplicated and inconsistent schema. Instagram is added to `sameAs`. Separate `defineOpeningHours` calls on home and infos-pratiques are removed (openingHoursSpecification is now in the composable). CGV page is set to `noindex`.

**Verify:** Open browser DevTools on any service page → inspect `<script type="application/ld+json">` → LocalBusiness entry shows `sameAs` with both Facebook and Instagram URLs, correct address, consistent `areaServed` array. No `defineOpeningHours` duplication. CGV page `<meta name="robots">` = `noindex, nofollow`.

### Tasks

- **T4.1** — Create `app/composables/useBusinessSchema.ts` with the canonical schema as defined in `design.md`. The composable accepts an optional `overrides: Record<string, unknown> = {}` parameter spread last.

- **T4.2** — `app/pages/home/index.vue`:
  - Replace the `defineLocalBusiness({...})` call with `useBusinessSchema()`.
  - Remove the separate `defineOpeningHours([...])` call (opening hours are now in the composable).
  - Keep `defineBreadcrumb` unchanged.
  - Final `useSchemaOrg` calls: `[useBusinessSchema()]` and `[defineBreadcrumb([...])]`.

- **T4.3** — `app/pages/infos-pratiques/index.vue`:
  - Replace `defineLocalBusiness({...})` with `useBusinessSchema()`.
  - Remove the separate `defineOpeningHours([...])` call.
  - Keep `defineBreadcrumb` unchanged.

- **T4.4** — `app/pages/univers/mariages/index.vue`:
  - Replace `defineLocalBusiness({...})` with `useBusinessSchema({ offers: { ... } })` passing the existing `offers` object as an override.
  - Keep `defineBreadcrumb` unchanged.

- **T4.5** — `app/pages/ateliers-creatifs/index.vue`:
  - Replace `defineLocalBusiness({...})` with `useBusinessSchema()`.
  - Keep `defineEvent({...})` and `defineBreadcrumb` unchanged.

- **T4.6** — `app/pages/galeries/[slug].vue`:
  - Replace `defineLocalBusiness({...})` with `useBusinessSchema()`.
  - Keep `defineBreadcrumb` and `ImageGallery` schema unchanged.

- **T4.7** — `app/pages/univers/accessoires-fleurs-sechees/index.vue`:
  - Replace `defineLocalBusiness({...})` with `useBusinessSchema()`.
  - Keep `defineBreadcrumb` unchanged.

- **T4.8** — `app/pages/univers/cadeaux-invites/index.vue`:
  - Replace `defineLocalBusiness({...})` with `useBusinessSchema()`.
  - Keep `defineBreadcrumb` unchanged.

- **T4.9** — `app/pages/locations/index.vue`:
  - Replace `defineLocalBusiness({...})` with `useBusinessSchema()`.
  - Keep the inline `Service` schema object and `defineBreadcrumb` unchanged.

- **T4.10** — `app/pages/univers/professionnels/index.vue`:
  - Replace `defineLocalBusiness({...})` with `useBusinessSchema()`.
  - Keep `defineBreadcrumb` unchanged.

- **T4.11** — `app/pages/engagement/index.vue`:
  - Add `useBusinessSchema()` to the first `useSchemaOrg([...])` call (alongside `defineOrganization`).
  - From the existing `defineOrganization({...})` block, remove: `address`, `telephone`, `email`, `founder`, `url`. Keep: `'@type': 'Florist'` → change to `'@type': 'Organization'`, `name`, `description`, `ethicsPolicy`, `sustainabilityPlan`, `memberOf`, `serviceType`.
  - Result: two schema nodes on this page — `useBusinessSchema()` (LocalBusiness) + trimmed `defineOrganization` (sustainability-specific).
  - Keep `defineBreadcrumb` unchanged.

- **T4.12** — `app/pages/cgv/index.vue`:
  - Change `robots: 'index, follow'` → `robots: 'noindex, nofollow'`.
  - No schema changes needed.

---

## Phase 5 — Verification pass

**Goal:** Confirm all 8 requirements are met across the whole codebase before shipping.

**Verify:** All checks below pass.

### Tasks

- **T5.1** — Run `grep -r "penseeboheme\.fr" app/ server/` → must return no matches (REQ-1).

- **T5.2** — Run `yarn lint` → no ESLint errors introduced.

- **T5.3** — Run `yarn dev`, visit `/`, confirm redirect to `/home` in browser. View Source on `/home` → confirm `geo.region`, `og:locale`, and absolute `og:image` in HTML head.

- **T5.4** — View Source on `/cgv` → confirm `<meta name="robots" content="noindex, nofollow">`.

- **T5.5** — Inspect `<script type="application/ld+json">` on `/home` or any service page → confirm single clean `LocalBusiness` entry with `sameAs` containing both Facebook and Instagram, and no duplicate `OpeningHoursSpecification` nodes.
