# Frontend Performance — Design Document

## Overview

Replace fixed-delay loading patterns with event-driven image detection, enable SSR for gallery data, and add responsive image optimization across all `NuxtImg` components. No new dependencies, no new components, no architectural changes — only targeted modifications to existing files.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Data Fetching Layer                   │
│                                                         │
│  useGalleryService.ts ──┐                               │
│                         ├─ useFetch (server: true)      │
│                         │  → SSR/pre-render includes    │
│                         │    gallery data in HTML        │
│  (other services remain unchanged)                      │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    Rendering Layer                       │
│                                                         │
│  NuxtImg components receive:                            │
│  ├─ format="webp"                                       │
│  ├─ quality="75|80"                                     │
│  ├─ sizes="<responsive breakpoints>"                    │
│  └─ @load="onImageLoad"                                 │
│                                                         │
│  pending state controlled by:                           │
│  ├─ @load event on critical image(s) ─── primary        │
│  ├─ img.complete check on mount ──────── cached fallback│
│  └─ setTimeout(5000) ────────────────── safety net      │
└─────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. `app/composables/useGalleryService.ts` — REQ-2

**Current:** Both `useFetch` calls set `server: false`.

**Change:** Remove `server: false` from both calls.

```ts
// getIndexOfGalleries
const { data } = useFetch<Galleries>(`${apiKey}/galleries`, {
  key: 'galleries-index',
})

// getShowOfGallery
const { data } = useFetch<Gallery>(`${apiKey}/galleries/${slug}`, {
  key: `gallery-${slug}`,
})
```

**Impact:** During `nuxt generate`, the pre-render of `/galeries` will now fetch gallery data server-side and embed it in the static HTML. During SSR dev mode, gallery data appears on first paint. Client-side navigation still uses cached data via the `key` parameter.

**Risk:** `PenseeBohemeCredentials` calls `useRuntimeConfig()` which works in both server and client contexts in Nuxt 3 — no issue. The API must be reachable from the build/server environment (already is for `generate:prod`).

---

### 2. `app/components/galeries/Display.vue` — REQ-1, REQ-3, REQ-4

**Current state:**
- `pending` = true, revealed after 1500ms `setTimeout`
- No `sizes`, no `format`, no `quality` on images
- `:key="galleryMedia.id"` already correct

**Changes to `<script>`:**

```ts
const pending = ref(true)
const loadedCount = ref(0)
const REVEAL_THRESHOLD = 4 // first visible row (matches column count on md+)
const SAFETY_TIMEOUT = 5000

function onImageLoad() {
  loadedCount.value++
  if (loadedCount.value >= REVEAL_THRESHOLD) {
    pending.value = false
  }
}

onMounted(() => {
  setTimeout(() => {
    pending.value = false
  }, SAFETY_TIMEOUT)
})
```

Remove the existing `onMounted` with `setTimeout(..., 1500)`.

**Changes to `<template>`:**

```vue
<NuxtImg
  :alt="generateImageAlt(galleryMedia.name, index)"
  :title="generateImageTitle(galleryMedia.name)"
  loading="lazy"
  :src="galleryMedia.url"
  class="bg-white h-auto max-w-full rounded-lg transition-all duration-500 ease-out"
  width="800"
  sizes="50vw md:25vw"
  format="webp"
  quality="80"
  @load="onImageLoad"
/>
```

**Layout context for `sizes`:** The grid uses `columns-2 md:columns-4`, so each image occupies ~50% viewport width on mobile, ~25% on `md+`.

---

### 3. `app/components/galeries/List.vue` — REQ-1, REQ-3, REQ-4, REQ-5

**Current state:**
- `pending` = true, revealed after 500ms `setTimeout` on mount
- `resetTimer()` sets `pending` = true + 500ms `setTimeout` on gallery switch
- `:key="index"` on sidebar list and pagination dots
- `quality="75"` already set on carousel images, no `format`, no `sizes`

**Changes to `<script>`:**

Replace `resetTimer`, the `onMounted` setTimeout, and the `pending` init:

```ts
const pending = ref(true)

function resetPending() {
  pending.value = true
  // No setTimeout — @load on center image handles reveal
}

function nextGallery() {
  if (!isLastGallery.value) {
    resetPending()
    currentIndex.value++
  }
}

function prevGallery() {
  if (!isFirstGallery.value) {
    resetPending()
    currentIndex.value--
  }
}

function onCenterImageLoad() {
  pending.value = false
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  // Safety net for initial load
  setTimeout(() => {
    pending.value = false
  }, 5000)
})
```

**Cached image fallback:** After gallery switch, if the browser has cached the center image, `@load` may fire synchronously or not at all. Add a `nextTick` check:

```ts
watch(currentIndex, async () => {
  await nextTick()
  // If image was cached and @load already fired or won't fire
  const imgEl = centerImgRef.value?.$el?.querySelector('img') || centerImgRef.value?.$el
  if (imgEl?.complete && imgEl?.naturalWidth > 0) {
    pending.value = false
  }
})
```

With a template ref on the center `NuxtImg`:

```vue
<NuxtImg
  ref="centerImgRef"
  ...
  @load="onCenterImageLoad"
/>
```

**Changes to `<template>` — sizes:**

The 3 carousel cards have different widths per breakpoint:

| Card | Classes | Sizes |
|------|---------|-------|
| Left (side) | `w-24 sm:w-36 md:w-48` | `sizes="96px sm:144px md:192px"` |
| Center (main) | `w-28 sm:w-48 md:w-60` | `sizes="112px sm:192px md:240px"` |
| Right (side) | `w-24 sm:w-36 md:w-48` | `sizes="96px sm:144px md:192px"` |

Add `format="webp"` to all 3 images. `quality="75"` is already set.

**Changes to `<template>` — v-for keys:**

```vue
<!-- Sidebar -->
<li v-for="gallery in galleryItems.data" :key="gallery.id">

<!-- Pagination dots -->
<button
  v-for="(gallery, index) in galleryItems.data"
  :key="gallery.id"
  ...
  @click="currentIndex = index"
/>
```

Note: The sidebar and pagination dots need `index` for the `currentIndex` comparison. The `v-for` provides `(gallery, index)` — keep destructuring both but use `gallery.id` as key.

---

### 4. `app/components/products/Card.vue` — REQ-1, REQ-3, REQ-4

**Current state:**
- `pending` = true, revealed after 500ms `setTimeout`
- No `sizes`, no `format`, no `quality`

**Changes to `<script>`:**

```ts
const pending = ref(true)

function onImageLoad() {
  pending.value = false
}

onMounted(() => {
  setTimeout(() => {
    pending.value = false
  }, 5000)
})
```

Remove existing `onMounted` with `setTimeout(..., 500)`.

**Changes to `<template>`:**

```vue
<NuxtImg
  v-show="!pending"
  :src="product.media[0]?.url"
  loading="lazy"
  :alt="`${product.name} - Pensée Bohème`"
  class="bg-slate-300 aspect-square object-cover opacity-90 min-w-full h-fit"
  sizes="50vw md:25vw"
  format="webp"
  quality="80"
  @load="onImageLoad"
/>
```

**Layout context for `sizes`:** Parent grid in `products/List.vue` uses `grid-cols-1 md:grid-cols-2`, and the card itself is `w-1/2 mx-auto`. So effective width: ~50vw on mobile, ~25vw on `md+`.

**Also fix the alt text:** Current hardcoded `alt="Product Image"` → use product name.

---

### 5. `app/components/products/List.vue` — REQ-5

**Change:** Replace `:key="index"` with `:key="product.id"` on ProductsCard v-for.

```vue
<ProductsCard
  v-for="product in category.products"
  :key="product.id"
  :product="product"
/>
```

---

### 6. `app/components/instagram/Feed.vue` — REQ-5

**Change:** Replace `:key="index"` with `:key="instagramMedia.id"`.

```vue
<div v-for="instagramMedia in displayedMedias" :key="instagramMedia.id">
  <InstagramCard :instagram-media="instagramMedia" />
</div>
```

---

### 7. `app/components/instagram/Card.vue` — REQ-3

**Change:** Add `sizes` based on the Feed grid layout (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`).

```vue
<NuxtImg
  :src="instagramMedia.media_url"
  :alt="instagramMedia.caption"
  class="..."
  loading="lazy"
  sizes="50vw sm:33vw lg:25vw"
/>
```

**Note:** `format` and `quality` are skipped for Instagram images — these are external URLs served by Instagram's CDN. NuxtImg's optimization only works with configured providers or local images.

---

### 8. `app/components/ateliers/List.vue` — REQ-5

**Change:** Replace `:key="index"` with `:key="product.id"` in both desktop and mobile loops.

```vue
<!-- Desktop -->
<AteliersCardDesktop
  v-for="(product, index) in page?.categories?.[0]?.products"
  :key="product.id"
  :product="product"
  :is-even="index % 2 === 0"
/>

<!-- Mobile -->
<AteliersCardMobile
  v-for="product in page?.categories?.[0]?.products"
  :key="product.id"
  :product="product"
/>
```

Note: Desktop loop still needs `index` for `isEven` calculation — keep `(product, index)` destructure.

---

### 9. `app/components/ateliers/CardDesktop.vue` — REQ-3, REQ-4

**Change:** Add `sizes`, `format`, `quality` to both NuxtImg instances (even/odd).

```vue
<NuxtImg
  :src="product.media[0]?.url"
  :alt="product.name"
  class="object-cover w-full h-full rounded-sm drop-shadow-md opacity-80"
  loading="lazy"
  sizes="25vw"
  format="webp"
  quality="80"
/>
```

**Layout context:** The image is in a `w-[25vw]` container inside a 2-column grid — `25vw` is accurate.

---

### 10. `app/components/ateliers/CardMobile.vue` — REQ-3, REQ-4

**Change:** Add `sizes`, `format`, `quality`.

```vue
<NuxtImg
  :src="product.media[0]?.url"
  :alt="product.name"
  class="object-cover w-full rounded-sm drop-shadow-md opacity-80"
  loading="lazy"
  sizes="100vw"
  format="webp"
  quality="80"
/>
```

**Layout context:** Full-width image on mobile (`w-full`, single column) — `100vw`.

---

### 11. `app/components/pages/Banner.vue` — REQ-3

**Change:** Add `sizes`.

```vue
<NuxtImg
  :src="bannerImage"
  :alt="alt"
  placeholder=""
  class="w-full h-[20vh] md:h-[50vh] lg:h-[60vh] xl:h-[70vh] opacity-80 object-cover"
  loading="eager"
  fetchpriority="high"
  :class="imgClass"
  sizes="100vw"
/>
```

**Layout context:** Banner always spans full viewport width.

---

### 12. `app/pages/home/index.vue` — REQ-3

Home page images already have `format="webp"` and `quality="90"`. Add `sizes`:

| Image | Layout | Sizes |
|-------|--------|-------|
| `landpage_1.jpg` (hero) | `w-full md:w-1/2`, full height | `sizes="100vw md:50vw"` |
| `landpage_2.jpg` (about) | `w-full md:w-1/2` | `sizes="100vw md:50vw"` |
| `landpage_3_mobile.jpg` | Full width, `md:hidden` | `sizes="100vw"` |
| `landpage_3_desktop.jpg` | `md:w-2/3 mx-auto`, `hidden md:block` | `sizes="67vw"` |

---

## Data Models

No changes. All types in `app/types/models.ts` remain as-is.

---

## Error Handling

### Image load failure
- `@load` won't fire if the image fails to load (broken URL, 404, network error)
- The 5000ms safety-net timeout ensures `pending` always resolves to `false`
- Images with broken URLs will show the `bg-gray-100` / `bg-slate-300` background that already exists on the container divs — no layout shift

### Cached image edge case
- On back-navigation, browser-cached images may not re-fire `@load`
- `Display.vue`: The `loadedCount` threshold approach is resilient — if some images fire `@load` and some don't (cached), the threshold will still be reached by non-cached images. If all are cached, the 5000ms fallback handles it. As a secondary optimization, check `img.complete` on mount.
- `List.vue`: The `watch(currentIndex)` handler with `nextTick` + `img.complete` check covers cached gallery switches
- `Card.vue`: Simple single-image — the `onMounted` safety fallback covers it

---

## Testing Strategy

No test framework is configured. Manual verification:

1. **REQ-1 verification:**
   - Open gallery detail page → images should appear as they load, not after fixed delay
   - Switch galleries on index page → center image drives reveal timing
   - Navigate to product pages → cards appear when images are ready
   - Simulate slow network (DevTools throttle) → Lottie loader shows until images actually arrive
   - Test back-navigation → images should not get stuck behind loader

2. **REQ-2 verification:**
   - Run `npm run generate:prod` → inspect `.output/public/galeries/index.html` → should contain gallery names and image URLs in the HTML
   - View page source in browser during `npm run dev` → gallery data present in initial HTML
   - Client-side navigation from another page → gallery data loads without full page reload

3. **REQ-3/REQ-4 verification:**
   - DevTools → Network tab → filter by images → verify `srcset` attribute on `<img>` elements
   - Resize viewport → confirm different image sizes are requested
   - Check image format in Network tab → should show `webp` content-type

4. **REQ-5 verification:**
   - Visual check: gallery sidebar, pagination dots, product lists, atelier cards, instagram feed — no rendering glitches on data changes

---

## Performance Considerations

### Expected impact per requirement

| REQ | Metric | Expected improvement |
|-----|--------|---------------------|
| REQ-1 | Time to Interactive (perceived) | -500ms to -1500ms (eliminates artificial delay) |
| REQ-2 | First Contentful Paint on `/galeries` | Eliminates client-side fetch waterfall; content in HTML |
| REQ-3 | Image transfer size (mobile) | ~60-75% reduction (e.g. 800px → 200px width on phone) |
| REQ-4 | Image transfer size (all) | ~20-30% reduction (WebP vs JPEG at same quality) |
| REQ-5 | Rendering efficiency | Minor — avoids unnecessary DOM recycling on list mutations |

### Build-time consideration
REQ-2 means `nuxt generate` will now make API calls to `/galleries` during the build. This is already the intended behavior (the API is configured in `generate:prod` script) and other routes already fetch server-side.

---

## Security Considerations

No security impact. All changes are client-side rendering and image optimization. No new external connections, no auth changes, no user input handling changes.

---

## Monitoring and Observability

No monitoring infrastructure exists in this project. After implementation, verify improvements manually using:

- **Lighthouse** (Chrome DevTools) — run before/after on `/galeries` and `/galeries/[slug]` pages. Focus on: Performance score, LCP, CLS.
- **Network tab** — compare total image transfer size before/after on gallery detail page
- **View Source** — confirm gallery data is present in HTML (REQ-2)

---

## File Change Summary

| File | REQs | Changes |
|------|------|---------|
| `app/composables/useGalleryService.ts` | 2 | Remove `server: false` |
| `app/components/galeries/Display.vue` | 1, 3, 4 | `@load` handler, `sizes`, `format`, `quality` |
| `app/components/galeries/List.vue` | 1, 3, 4, 5 | `@load` handler, `watch` for cache, `sizes`, `format`, v-for keys |
| `app/components/products/Card.vue` | 1, 3, 4 | `@load` handler, `sizes`, `format`, `quality`, fix alt text |
| `app/components/products/List.vue` | 5 | v-for key |
| `app/components/instagram/Feed.vue` | 5 | v-for key |
| `app/components/instagram/Card.vue` | 3 | `sizes` |
| `app/components/ateliers/List.vue` | 5 | v-for keys |
| `app/components/ateliers/CardDesktop.vue` | 3, 4 | `sizes`, `format`, `quality` |
| `app/components/ateliers/CardMobile.vue` | 3, 4 | `sizes`, `format`, `quality` |
| `app/components/pages/Banner.vue` | 3 | `sizes` |
| `app/pages/home/index.vue` | 3 | `sizes` on 4 images |
