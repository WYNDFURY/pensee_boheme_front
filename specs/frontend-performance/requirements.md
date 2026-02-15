# Frontend Performance Improvements

## Introduction

The site suffers from perceived slowness, primarily on gallery pages. Root causes: hardcoded `setTimeout` delays masking image load times, client-only data fetching defeating SSR, and missing responsive image optimization. This spec covers front-end-only changes to improve perceived and actual load performance without restructuring the application.

## Alignment with Product Vision

Per `specs/product.md`: galleries are the **primary conversion tool** — visitors see real work, get inspired, then contact. Image delivery performance directly impacts the site's #1 goal (build trust & showcase quality). The site is image-heavy by nature, so optimizing image loading has outsized impact on every audience segment.

## Requirements

### REQ-1: Replace setTimeout-based image loading with event-driven detection

**User Story:** As a visitor, I want to see images as soon as they are ready, so that I don't wait longer than necessary on every page.

**Context:** Three components use `setTimeout` to hide content behind a Lottie loader for a fixed duration regardless of actual image load time:
- `app/components/galeries/Display.vue` — 1500ms delay
- `app/components/galeries/List.vue` — 500ms on mount + 500ms on every gallery switch (`resetTimer`)
- `app/components/products/Card.vue` — 500ms delay

**Acceptance Criteria:**
- `pending` state transitions to `false` when the critical image(s) fire `@load`, not after a fixed timer
- A safety-net timeout (e.g. 5000ms) still exists as fallback if images fail to load
- `Display.vue`: reveal the grid once the first N visible images have loaded (N = column count, typically 4), not all images
- `List.vue`: reveal the carousel when the center (main) image fires `@load`; side cards can appear slightly after
- `Card.vue`: reveal when the single product image fires `@load`
- The Lottie loader remains as the loading state indicator (no removal of loader UX)
- No `setTimeout` with hardcoded delay remains in any of these components (except the safety fallback)

**Technical note:** `NuxtImg` re-emits native `<img>` events including `@load`. Known caveat: cached images on back-navigation may not re-fire `@load`. If this is observed, use a ref to the underlying `<img>` element and check `img.complete` on mount as fallback:
```ts
onMounted(() => {
  if (imgRef.value?.complete) pending.value = false
})
```
See: https://github.com/nuxt/image/issues/682

---

### REQ-2: Enable server-side fetching for gallery data

**User Story:** As a visitor, I want gallery content to appear immediately on page load, so that I don't see an empty page while data is fetched client-side.

**Context:** `app/composables/useGalleryService.ts` sets `server: false` on both `useFetch` calls (`getIndexOfGalleries` and `getShowOfGallery`). This forces client-only fetching, which:
- Defeats SSR: the HTML arrives with no gallery content
- Defeats pre-rendering: `/galeries` is in `nitro.prerender.routes` but renders an empty shell
- Adds a network waterfall: HTML loads → JS loads → API call fires → content renders

**Acceptance Criteria:**
- Remove `server: false` from both `useFetch` calls in `useGalleryService.ts`
- Gallery index page (`/galeries`) and gallery detail pages (`/galeries/[slug]`) render with data in the initial HTML response
- Pre-rendered `/galeries` route includes gallery content in the static HTML output
- No regression in client-side navigation behavior (data should still refresh/cache correctly via `key`)

---

### REQ-3: Add responsive image sizing to NuxtImg components

**User Story:** As a mobile visitor, I want appropriately sized images delivered to my device, so that pages load faster and use less data.

**Context:** No `NuxtImg` in the project specifies the `sizes` prop. Without it, the browser has no `srcset` to choose from and downloads full-resolution images regardless of viewport.

**Acceptance Criteria:**
- Gallery detail grid (`Display.vue`): `sizes` reflects the masonry column layout — e.g. `sizes="50vw md:25vw"` (2 columns mobile, 4 columns desktop)
- Gallery carousel (`List.vue`): `sizes` reflects card widths — center card is larger than side cards, sized per breakpoint
- Product cards (`Card.vue`): `sizes` reflects the grid layout — `sizes="50vw md:25vw"` or similar
- Banner images (`pages/Banner.vue`): `sizes="100vw"` (full-width)
- Home page images: `sizes` set according to their layout width at each breakpoint
- Instagram cards (`instagram/Card.vue`): `sizes` reflects the grid — `sizes="50vw sm:33vw lg:25vw"`

---

### REQ-4: Add format and quality optimization to gallery images

**User Story:** As a visitor, I want images served in modern formats, so that they load faster without visible quality loss.

**Context:** Home page images use `format="webp"` and `quality="90"` but gallery images (`Display.vue`, `List.vue`) and product images (`Card.vue`) are missing these props, serving original format (likely JPEG) at original quality.

**Acceptance Criteria:**
- All `NuxtImg` components rendering API-sourced images include `format="webp"`
- Gallery detail images (`Display.vue`): `quality="80"` (many images, savings compound)
- Gallery carousel images (`List.vue`): `quality="75"` (already set, no change needed)
- Product card images (`Card.vue`): `quality="80"`
- Instagram card images (`instagram/Card.vue`): external URLs — `format` and `quality` may not apply (provider-dependent), skip if no effect
- No visible quality degradation at the chosen quality levels

---

### REQ-5: Use proper v-for keys across list components

**User Story:** As a visitor, I want smooth, glitch-free list rendering when content updates, so that the UI feels polished.

**Context:** Several components use array `index` as `:key` in `v-for` loops over data that has unique IDs. This causes Vue to incorrectly reuse DOM nodes when lists are reordered, filtered, or updated.

**Affected files:**
- `app/components/galeries/List.vue` — sidebar list and pagination dots use `:key="index"` over `galleryItems.data`
- `app/components/products/List.vue` — product cards use `:key="index"` over `category.products`
- `app/components/instagram/Feed.vue` — instagram cards use `:key="index"` over `displayedMedias`
- `app/components/ateliers/List.vue` — atelier cards use `:key="index"` over `page.categories[0].products`

**Acceptance Criteria:**
- Replace `:key="index"` with `:key="item.id"` (or equivalent unique identifier) in all v-for loops iterating over API data
- Static/derived lists (like formatted description sentences) may keep index keys
- No visual regression in list rendering, transitions, or animations

---

## Non-Functional Requirements

### Performance
- Gallery index page (`/galeries`): First Contentful Paint must include gallery data (no client-side fetch waterfall)
- Gallery detail page (`/galeries/[slug]`): images appear as fast as they physically load, not gated by a fixed timer
- Mobile visitors receive images sized to their viewport, not desktop-resolution images

### Architecture
- Changes are scoped to existing components — no new components, composables, or dependencies
- The `PenseeBohemeCredentials` + `useFetch` pattern is preserved
- Lottie loader UX pattern is preserved, only the trigger mechanism changes (event-driven vs timer-driven)

### Reliability
- Safety-net fallback timeout ensures the loader clears even if `@load` never fires (network failure, broken image)
- Handle `NuxtImg` cached-image edge case where `@load` may not re-fire on back-navigation

### Usability
- No layout shift when images load (existing aspect-ratio CSS constraints must remain)
- Loading indicator remains visible until content is actually ready to display
