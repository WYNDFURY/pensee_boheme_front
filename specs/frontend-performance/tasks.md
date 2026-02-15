# Frontend Performance — Implementation Plan

## Phase 1: Enable SSR for gallery data (REQ-2)

**Goal:** Gallery pages render with data in the initial HTML — no client-side fetch waterfall.

### Tasks

- [ ] **1.1** In `app/composables/useGalleryService.ts`, remove `server: false` from `getIndexOfGalleries` useFetch options
- [ ] **1.2** In `app/composables/useGalleryService.ts`, remove `server: false` from `getShowOfGallery` useFetch options

### Verification

1. Run `npm run dev`
2. Open `http://localhost:3000/galeries` → View Page Source → gallery names and image URLs must be present in the HTML (not empty shell)
3. Navigate client-side from `/home` to `/galeries` → galleries still load correctly
4. Navigate to a gallery detail `/galeries/[slug]` → content visible in View Source

---

## Phase 2: Event-driven image loading — Gallery Detail (REQ-1)

**Goal:** `Display.vue` reveals the masonry grid as soon as the first row of images has loaded, not after a fixed 1500ms.

### Tasks

- [ ] **2.1** In `app/components/galeries/Display.vue` `<script>`, replace the `setTimeout(..., 1500)` onMounted with:
  - `loadedCount` ref (starts at 0)
  - `REVEAL_THRESHOLD` constant = 4
  - `onImageLoad()` function that increments `loadedCount` and sets `pending = false` when threshold reached
  - `onMounted` with 5000ms safety-net timeout only
- [ ] **2.2** In `app/components/galeries/Display.vue` `<template>`, add `@load="onImageLoad"` to the NuxtImg

### Verification

1. Open a gallery detail page (e.g. `/galeries/[any-slug]`)
2. DevTools → Network → Slow 3G → images should appear progressively as they load, Lottie loader visible until first ~4 are ready
3. DevTools → Network → Fast 3G → images should appear faster than before (no 1.5s artificial wait)
4. Navigate back to `/galeries` then forward again → images must not get stuck behind loader (cached image edge case)

---

## Phase 3: Event-driven image loading — Gallery Carousel (REQ-1)

**Goal:** `List.vue` reveals the carousel when the center image loads, not after a fixed 500ms. Gallery switching is driven by `@load` on the new center image.

### Tasks

- [ ] **3.1** In `app/components/galeries/List.vue` `<script>`:
  - Remove `resetTimer()` function
  - Add `resetPending()` that only sets `pending = true` (no setTimeout)
  - Add `onCenterImageLoad()` that sets `pending = false`
  - Add `centerImgRef` template ref
  - Add `watch(currentIndex)` with `nextTick` + `img.complete` check for cached images
  - Replace `nextGallery`/`prevGallery` to call `resetPending()` instead of `resetTimer()`
  - Change `onMounted` timeout from 500ms to 5000ms safety-net
- [ ] **3.2** In `app/components/galeries/List.vue` `<template>`, add `ref="centerImgRef"` and `@load="onCenterImageLoad"` to the center NuxtImg (the one inside the NuxtLink)

### Verification

1. Open `/galeries` → carousel appears when center image loads (not 500ms fixed)
2. Click next/prev arrows → new gallery appears when its center image loads
3. Swipe left/right on mobile → same behavior
4. Arrow keys → same behavior
5. Rapidly click next several times → no stuck loaders, each gallery reveals when ready

---

## Phase 4: Event-driven image loading — Product Card (REQ-1)

**Goal:** `Card.vue` reveals the product image when it loads, not after a fixed 500ms.

### Tasks

- [ ] **4.1** In `app/components/products/Card.vue` `<script>`:
  - Add `onImageLoad()` that sets `pending = false`
  - Replace `onMounted` setTimeout from 500ms to 5000ms safety-net
- [ ] **4.2** In `app/components/products/Card.vue` `<template>`, add `@load="onImageLoad"` to the NuxtImg
- [ ] **4.3** Fix hardcoded `alt="Product Image"` → use `` :alt="`${product.name} - Pensée Bohème`" ``

### Verification

1. Open any product page (e.g. `/univers/mariages`) → product images appear as they load
2. DevTools → Slow 3G → Lottie loaders visible per card until each image arrives
3. No card stays in loading state permanently (safety fallback works)

---

## Phase 5: Responsive image sizes (REQ-3)

**Goal:** Every NuxtImg has a `sizes` prop so the browser can request appropriately-sized images per viewport.

### Tasks

- [ ] **5.1** `app/components/galeries/Display.vue` — add `sizes="50vw md:25vw"` to NuxtImg
- [ ] **5.2** `app/components/galeries/List.vue` — add sizes to all 3 carousel images:
  - Left card: `sizes="96px sm:144px md:192px"`
  - Center card: `sizes="112px sm:192px md:240px"`
  - Right card: `sizes="96px sm:144px md:192px"`
- [ ] **5.3** `app/components/products/Card.vue` — add `sizes="50vw md:25vw"`
- [ ] **5.4** `app/components/pages/Banner.vue` — add `sizes="100vw"`
- [ ] **5.5** `app/pages/home/index.vue` — add sizes to all 4 images:
  - `landpage_1.jpg`: `sizes="100vw md:50vw"`
  - `landpage_2.jpg`: `sizes="100vw md:50vw"`
  - `landpage_3_mobile.jpg`: `sizes="100vw"`
  - `landpage_3_desktop.jpg`: `sizes="67vw"`
- [ ] **5.6** `app/components/instagram/Card.vue` — add `sizes="50vw sm:33vw lg:25vw"`
- [ ] **5.7** `app/components/ateliers/CardDesktop.vue` — add `sizes="25vw"` to both NuxtImg (even/odd)
- [ ] **5.8** `app/components/ateliers/CardMobile.vue` — add `sizes="100vw"`

### Verification

1. Run `npm run dev`, open any page with images
2. DevTools → Elements → inspect rendered `<img>` → `srcset` attribute should be present with multiple sizes
3. DevTools → Network → filter images → resize viewport → different image widths should be requested at different breakpoints

---

## Phase 6: WebP format and quality (REQ-4)

**Goal:** All API-sourced images request WebP format with appropriate quality levels.

### Tasks

- [ ] **6.1** `app/components/galeries/Display.vue` — add `format="webp"` and `quality="80"`
- [ ] **6.2** `app/components/galeries/List.vue` — add `format="webp"` to all 3 carousel images (`quality="75"` already set)
- [ ] **6.3** `app/components/products/Card.vue` — add `format="webp"` and `quality="80"`
- [ ] **6.4** `app/components/ateliers/CardDesktop.vue` — add `format="webp"` and `quality="80"` to both NuxtImg
- [ ] **6.5** `app/components/ateliers/CardMobile.vue` — add `format="webp"` and `quality="80"`
- [ ] **6.6** Skip `instagram/Card.vue` — external Instagram CDN URLs, NuxtImg optimization does not apply

### Verification

1. DevTools → Network → filter images → Content-Type should show `image/webp` for API-sourced images
2. Compare image file sizes before/after in Network tab → should be smaller
3. Visual check → no visible quality degradation

---

## Phase 7: Fix v-for keys (REQ-5)

**Goal:** All v-for loops over API data use stable unique IDs as keys instead of array index.

### Tasks

- [ ] **7.1** `app/components/galeries/List.vue` — sidebar: change `:key="index"` to `:key="gallery.id"` (keep `(gallery, index)` destructure for `currentIndex` comparison)
- [ ] **7.2** `app/components/galeries/List.vue` — pagination dots: change `:key="index"` to `:key="gallery.id"` (keep `(gallery, index)` destructure for click handler)
- [ ] **7.3** `app/components/products/List.vue` — change `:key="index"` to `:key="product.id"` on ProductsCard
- [ ] **7.4** `app/components/instagram/Feed.vue` — change `:key="index"` to `:key="instagramMedia.id"`
- [ ] **7.5** `app/components/ateliers/List.vue` — desktop loop: change `:key="index"` to `:key="product.id"` (keep `(product, index)` for `isEven`)
- [ ] **7.6** `app/components/ateliers/List.vue` — mobile loop: change `:key="index"` to `:key="product.id"`

### Verification

1. Navigate through all pages with lists (galleries, products, ateliers, instagram feed)
2. No visual glitches, no duplicate keys warnings in console
3. Gallery sidebar highlights correct item when switching galleries

---

## Phase 8: Final validation

**Goal:** All changes work together, no regressions, lint passes.

### Tasks

- [ ] **8.1** Run `npm run lint` — fix any linting errors introduced
- [ ] **8.2** Run `npm run dev` — full manual walkthrough of all pages
- [ ] **8.3** Run Lighthouse audit on `/galeries` and `/galeries/[slug]` — record Performance score, LCP, CLS
- [ ] **8.4** Run `npm run build` — confirm build succeeds with no errors

### Verification

1. Lint passes cleanly
2. Build succeeds
3. All pages render correctly with no console errors
4. Lighthouse Performance score improved vs. baseline
