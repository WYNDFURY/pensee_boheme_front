# Design — SEO Improvements

## Overview

8 targeted fixes to the current SEO implementation. No new pages or routes. Changes touch `nuxt.config.ts`, 4 existing pages (URL corrections), `app/pages/home/index.vue`, `app/pages/cgv/index.vue`, all 9 service pages (composable refactor), and a new server API route for the sitemap.

---

## Architecture

```
nuxt.config.ts
  ├── app.head           ← REQ-2: global geo/OG meta (was in runtimeConfig.head)
  ├── routeRules         ← REQ-4: 301 redirect / → /home
  └── sitemap.sources    ← REQ-5: points to /api/__sitemap__/urls

server/api/__sitemap__/urls.ts   ← REQ-5: fetches galleries, returns SitemapUrl[]

app/composables/useBusinessSchema.ts   ← REQ-6, REQ-8: single source of truth

app/pages/
  index.vue                     ← REQ-4: emptied (redirect handled by routeRules)
  home/index.vue                ← REQ-3: absolute OG/twitter image URLs
  cgv/index.vue                 ← REQ-7: noindex, nofollow
  galeries/[slug].vue           ← REQ-1: domain typo fix
  infos-pratiques/index.vue     ← REQ-1: domain typo fix
  locations/index.vue           ← REQ-1: domain typo fix
  univers/professionnels/index.vue ← REQ-1: domain typo fix
  (all service pages)           ← REQ-6: replace defineLocalBusiness with useBusinessSchema()
```

---

## Components and Interfaces

### 1. `nuxt.config.ts` — REQ-2, REQ-4, REQ-5

**Move `runtimeConfig.head` → `app.head`:**

```ts
app: {
  baseURL: '/',
  head: {
    title: 'Pensée Bohème - Fleuriste Éco-responsable Normandie | Bec-de-Mortagne',
    meta: [
      { name: 'author', content: 'Cécile Devaux - Pensée Bohème' },
      { name: 'geo.region', content: 'FR-NOR' },
      { name: 'geo.placename', content: 'Bec-de-Mortagne, Normandie' },
      { name: 'geo.position', content: '49.59050861790701;0.4137516889308236' },
      { name: 'ICBM', content: '49.59050861790701, 0.4137516889308236' },
      { property: 'og:locale', content: 'fr_FR' },
      { property: 'og:type', content: 'website' },
    ],
    link: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Josefin+Slab:wght@300;400;600&display=swap' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&display=swap' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@100..900&display=swap' },
    ],
  },
},
```

Note: Remove OG `business.business`/business contact_data meta — these are non-standard Facebook-only tags of no SEO value. The `og:type: website` replaces `og:type: business.business`.

**Add routeRules (REQ-4):**

```ts
routeRules: {
  '/': { redirect: { to: '/home', statusCode: 301 } },
},
```

**Add sitemap config (REQ-5):**

```ts
sitemap: {
  sources: ['/api/__sitemap__/urls'],
  exclude: ['/admin/**', '/cgv'],
},
```

**Remove `runtimeConfig.head`** — keep only `runtimeConfig.public.apiBaseUrl`.

---

### 2. `server/api/__sitemap__/urls.ts` — REQ-5

New file. Runs at `yarn generate:prod` build time (SSG). Fetches all gallery slugs from the backend and returns sitemap entries.

```ts
// server/api/__sitemap__/urls.ts
import type { SitemapUrl } from '#sitemap/types'

export default defineEventHandler(async (): Promise<SitemapUrl[]> => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBaseUrl

  try {
    const galleries = await $fetch<{ slug: string }[]>(`${apiBase}/galleries`)
    return galleries.map((g) => ({
      loc: `/galeries/${g.slug}`,
      changefreq: 'monthly' as const,
      priority: 0.8,
    }))
  } catch {
    return []   // graceful fallback — build does not fail if API is down
  }
})
```

The static routes (`/home`, `/galeries`, `/engagement`, `/infos-pratiques`, `/univers/*`) are auto-discovered by `@nuxtjs/sitemap` from the file-based pages (nuxt:pages source). No manual listing needed.

---

### 3. `app/composables/useBusinessSchema.ts` — REQ-6, REQ-8

New composable. Single canonical `Florist` schema used by all pages. Accepts optional `overrides` merged into the config object **before** calling `defineLocalBusiness` — safe because we spread into the raw config, not into the returned schema node.

```ts
export const useBusinessSchema = (overrides: Record<string, unknown> = {}) =>
  defineLocalBusiness({
    '@type': 'Florist',
    name: 'Pensée Bohème',
    description:
      'Fleuriste éco-responsable spécialisée dans les créations florales sur-mesure, fleurs séchées, mariages et ateliers créatifs.',
    image: 'https://pensee-boheme.fr/home/landpage_2.jpg',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '68 Route de la Vallée',
      addressLocality: 'Bec-de-Mortagne',
      postalCode: '76110',
      addressRegion: 'Normandie',
      addressCountry: 'FR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 49.59050861790701,
      longitude: 0.4137516889308236,
    },
    telephone: '+33614643584',
    email: 'penseeboheme76@gmail.com',
    url: 'https://pensee-boheme.fr',
    sameAs: [
      'https://www.facebook.com/penseeboheme76',
      'https://www.instagram.com/penseeboheme76/',
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '16:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '13:00',
      },
    ],
    priceRange: '€€',
    founder: { '@type': 'Person', name: 'Cécile Devaux' },
    areaServed: ['Bec-de-Mortagne', 'Le Havre', 'Rouen', 'Normandie', 'Seine-Maritime'],
    ...overrides,
  })
```

**Usage in pages (basic):**
```ts
useSchemaOrg([useBusinessSchema()])
```

**Usage with page-specific extension (e.g. mariages with offers):**
```ts
useSchemaOrg([
  useBusinessSchema({
    offers: {
      '@type': 'Offer',
      name: 'Forfait décoration mariage',
      priceSpecification: { '@type': 'PriceSpecification', minPrice: '900', priceCurrency: 'EUR' },
    },
  }),
])
```

**Note on openingHours:** `defineLocalBusiness` from `@unhead/schema-org` accepts `openingHoursSpecification` (structured objects). Remove the separate `defineOpeningHours` calls from pages that currently have them (home, infos-pratiques) — they duplicate data already in the composable.

---

### 4. Page-level changes

| File | Change |
|------|--------|
| `app/pages/index.vue` | Remove `navigateTo` — replace with empty `<template><div /></template>` and no script (redirect handled by `routeRules`) |
| `app/pages/home/index.vue` | REQ-3: `ogImage` → `'https://pensee-boheme.fr/home/landpage_1.jpg'`, same for `twitterImage`. REQ-6: replace `defineLocalBusiness(...)` with `useBusinessSchema()` |
| `app/pages/cgv/index.vue` | REQ-7: change `robots: 'index, follow'` → `robots: 'noindex, nofollow'` |
| `app/pages/galeries/[slug].vue` | REQ-1: replace all `penseeboheme.fr` → `pensee-boheme.fr`. REQ-6: replace `defineLocalBusiness(...)` with `useBusinessSchema()` |
| `app/pages/infos-pratiques/index.vue` | REQ-1: fix domain in ogImage, ogUrl, twitterImage, sameAs. REQ-6: replace `defineLocalBusiness(...)` with `useBusinessSchema()` |
| `app/pages/locations/index.vue` | REQ-1: fix domain in ogImage, twitterImage. REQ-6: replace schema |
| `app/pages/univers/professionnels/index.vue` | REQ-1: fix domain in ogImage, twitterImage, breadcrumb URLs. REQ-6: replace schema |
| `app/pages/univers/mariages/index.vue` | REQ-6: replace `defineLocalBusiness(...)` with `useBusinessSchema()` + keep `offers` extension |
| `app/pages/ateliers-creatifs/index.vue` | REQ-6: replace `defineLocalBusiness(...)` with `useBusinessSchema()` |
| `app/pages/univers/accessoires-fleurs-sechees/index.vue` | REQ-6: replace schema |
| `app/pages/univers/cadeaux-invites/index.vue` | REQ-6: replace schema |
| `app/pages/engagement/index.vue` | REQ-6: add `useBusinessSchema()` to the existing `useSchemaOrg([...])` call alongside the existing sustainability-specific `defineOrganization`. Remove from `defineOrganization` only the fields that duplicate the business data (address, telephone, email, founder, url) — keep `ethicsPolicy`, `sustainabilityPlan`, `memberOf` which are page-unique. |

---

## Data Models

No new data models. `GalleryData` (existing type in `app/types/models.ts`) already has `slug: string` — used by the sitemap server route.

---

## Error Handling

| Scenario | Handling |
|----------|---------- |
| API unreachable during `yarn generate:prod` sitemap build | `try/catch` in server route returns `[]` — sitemap generates without gallery entries, does not fail build |
| Missing `slug` on gallery item | `.map()` filter: skip items where `g.slug` is falsy |

---

## Testing Strategy

Manual verification (no test framework configured):

1. **REQ-1 — Domain consistency:** `grep -r "penseeboheme\.fr" app/` after changes must return zero results.
2. **REQ-2 — app.head:** `yarn generate:prod && yarn preview` → View Source on any page → verify `<meta name="geo.region"`, `<meta property="og:locale"` are present in HTML.
3. **REQ-3 — Absolute OG image:** View Source on `/home` → `og:image` value starts with `https://`.
4. **REQ-4 — 301 redirect:** After `yarn generate:prod`, check `.output/public/index.html` exists and contains a redirect to `/home`.
5. **REQ-5 — Sitemap:** `yarn generate:prod && yarn preview` → GET `http://localhost:3000/sitemap.xml` → verify `/galeries/[slug]` entries present.
6. **REQ-6 — Schema composable:** Validate one page with [Google Rich Results Test](https://search.google.com/test/rich-results) → LocalBusiness data correct.
7. **REQ-7 — CGV noindex:** View Source on `/cgv` → `<meta name="robots" content="noindex, nofollow">` present. Sitemap must not contain `/cgv`.
8. **REQ-8 — Instagram sameAs:** Check structured data output on any service page → `sameAs` includes Instagram URL.

---

## Performance Considerations

- `routeRules` redirect is a static HTML meta-refresh / header, zero runtime JS.
- Sitemap server route runs once at build — no runtime performance impact (SSG).
- Moving fonts to `app.head` does not change loading strategy; preconnect hints remain.

---

## Security Considerations

None. All changes are read-only meta/config. No user input, no new API surface beyond the internal sitemap endpoint (which is only called at build time for SSG).

---

## Monitoring and Observability

- Submit updated sitemap URL to Google Search Console after deployment.
- Monitor "Coverage" report in Search Console for newly indexed `/galeries/[slug]` pages.
- Check "Enhancements → Breadcrumbs" and "Business info" panels in Search Console after deploy.
