# Frontend Responsive Images — Tasks

## Phase 1: Foundation ✅ Ready to Start

**Goal**: Update type system and create responsive image composable with backward compatibility.

**Target**: All existing code compiles with new `Media` type. Composable tested and ready for component migration.

**User Verification**: Run `npm run dev` — no TypeScript errors. Visit any page — images still load (using fallback).

### Tasks

#### 1.1 Update Media Type ⏳

**File**: `app/types/models.ts`

**Changes**:
```typescript
// Current
export type Media = {
  id: number
  name: string
  url: string
}

// New
export type Media = {
  id: number
  name: string
  file_name: string
  mime_type: string
  size: number
  urls: {
    thumb: string
    medium: string
    large: string
    original: string
  }
  // Deprecated - for backward compat during migration
  url?: string
}
```

**Rationale**: Add `url?` optional field for backward compatibility. Allows gradual migration without breaking existing code.

**Unit Tests**: TypeScript compilation passes.

---

#### 1.2 Create useResponsiveImage Composable ⏳

**File**: `app/composables/useResponsiveImage.ts`

**Implementation**:
```typescript
export type ImageContext = 'thumb' | 'card' | 'detail' | 'hero'

export interface ResponsiveImageConfig {
  src: string
  srcset: string
  sizes: string
  loading: 'lazy' | 'eager'
  format?: 'webp'
  quality?: number
}

export const useResponsiveImage = (
  media: Media | undefined,
  context: ImageContext,
  options?: {
    eager?: boolean
    customSizes?: string
    format?: 'webp'
    quality?: number
  }
): ResponsiveImageConfig => {
  // Fallback for missing media
  if (!media) {
    return {
      src: '/images/placeholder.jpg',
      srcset: '',
      sizes: '100vw',
      loading: 'lazy',
    }
  }

  // Backward compatibility: old format with url field
  if (!media.urls && media.url) {
    console.warn('[useResponsiveImage] Legacy media format detected', { media })
    return {
      src: media.url,
      srcset: '',
      sizes: '100vw',
      loading: options?.eager ? 'eager' : 'lazy',
      format: options?.format,
      quality: options?.quality,
    }
  }

  // New format with urls object
  if (!media.urls) {
    console.error('[useResponsiveImage] Missing urls object', { media })
    return {
      src: '/images/placeholder.jpg',
      srcset: '',
      sizes: '100vw',
      loading: 'lazy',
    }
  }

  const { urls } = media

  // Variant selection by context
  const variantMap: Record<ImageContext, string> = {
    thumb: urls.thumb,
    card: urls.medium,
    detail: urls.large,
    hero: urls.large,
  }

  // Srcset: 1x base variant, 2x higher resolution
  const srcsetMap: Record<ImageContext, string> = {
    thumb: `${urls.thumb} 1x, ${urls.medium} 2x`,
    card: `${urls.medium} 1x, ${urls.large} 2x`,
    detail: `${urls.large} 1x`,
    hero: `${urls.large} 1x`,
  }

  // Sizes attribute (responsive)
  const sizesMap: Record<ImageContext, string> = {
    thumb: '200px',
    card: '(min-width: 768px) 25vw, 50vw',
    detail: '(min-width: 768px) 75vw, 100vw',
    hero: '100vw',
  }

  return {
    src: variantMap[context],
    srcset: srcsetMap[context],
    sizes: options?.customSizes || sizesMap[context],
    loading: options?.eager ? 'eager' : 'lazy',
    format: options?.format || 'webp',
    quality: options?.quality || 80,
  }
}
```

**Unit Tests** (`useResponsiveImage.spec.ts`):
- ✅ Returns thumb variant for 'thumb' context
- ✅ Returns medium variant for 'card' context
- ✅ Returns large variant for 'detail' context
- ✅ Returns large variant for 'hero' context
- ✅ Builds correct srcset with 1x and 2x variants
- ✅ Returns placeholder when media is undefined
- ✅ Falls back to old format when media.url exists but not media.urls
- ✅ Respects eager option (overrides lazy loading)
- ✅ Respects customSizes option
- ✅ Logs warning for legacy format
- ✅ Logs error for missing urls object

---

#### 1.3 Fix Compile Errors in Gallery Components ⏳

**Affected Files** (identified from research):
1. `app/components/galeries/List.vue`
2. `app/components/galeries/Display.vue`

**Pattern**:
```vue
<!-- Before -->
<NuxtImg :src="gallery.media[0]?.url" />

<!-- After -->
<script setup>
const imageConfig = computed(() =>
  useResponsiveImage(gallery.media[0], 'card')
)
</script>
<NuxtImg v-bind="imageConfig" alt="..." />
```

**Unit Tests**: Components render without TypeScript errors.

---

#### 1.4 Fix Compile Errors in Product Components ⏳

**Affected Files**:
1. `app/components/products/Card.vue`
2. `app/components/ateliers/CardMobile.vue`

**Same pattern**: Replace `media[0]?.url` with `useResponsiveImage(media[0], 'card')`.

**Unit Tests**: Components render without TypeScript errors.

---

#### 1.5 Fix Compile Errors in Admin Components ⏳

**Affected Files**:
1. `app/pages/admin/galleries/index.vue` (table thumbnails)
2. `app/pages/admin/products/index.vue` (table thumbnails)
3. `app/pages/admin/galleries/[slug]/edit.vue` (existing image display)
4. `app/pages/admin/products/[id]/edit.vue` (existing image display)

**Context**: Admin tables use `thumb`, admin forms use `medium`.

**Unit Tests**: Admin pages render without TypeScript errors.

---

#### 1.6 Verify Backward Compatibility ⏳

**Test Cases**:
1. Mock API response with old format (has `url`, no `urls`)
2. Mock API response with new format (has `urls`, no `url`)
3. Mock API response with missing media

**Expected**: All cases handled gracefully with appropriate fallbacks.

**Manual Test**: Start dev server, verify console warnings but no errors.

---

## Phase 2: Gallery Pages (High Impact) ⏳

**Goal**: Migrate gallery pages to use responsive image variants. Achieve 70-85% payload reduction on mobile.

**Target**: Gallery index and detail pages load correct variants. Network tab shows thumb (400px) on mobile, large (2000px) on desktop carousel.

**User Verification**:
1. Open gallery index on mobile → DevTools Network tab shows ~45 KB images
2. Open gallery detail on desktop → carousel shows high-res images
3. Lighthouse performance score improves from 85 to 90+

### Tasks

#### 2.1 Migrate Gallery Index (List Component) ⏳

**File**: `app/components/galeries/List.vue`

**Current Code** (lines 46-54):
```vue
<NuxtImg
  :src="currentGallery?.media[0]?.url || '/images/placeholder.jpg'"
  sizes="96px sm:144px md:192px"
  format="webp"
  quality="75"
/>
```

**New Code**:
```vue
<script setup>
const props = defineProps<{
  gallery: GalleryData
}>()

const imageConfig = computed(() => {
  return useResponsiveImage(props.gallery.media?.[0], 'thumb', {
    eager: true,
    customSizes: '96px sm:144px md:192px'
  })
})
</script>

<template>
  <NuxtImg
    v-bind="imageConfig"
    :alt="`${gallery.name} - Aperçu galerie`"
  />
</template>
```

**Changes**:
- Use `thumb` context for gallery preview thumbnails
- Keep existing `sizes` via `customSizes` option
- Set `eager: true` for above-fold images
- Preserve existing loading threshold pattern (unchanged)

**Expected Payload**: 3 thumbnails × 45 KB = ~135 KB (was 3 × 800 KB = 2.4 MB) → **94% reduction**

**Unit Tests**: Component renders with correct src, srcset, sizes attributes.

---

#### 2.2 Migrate Gallery Detail (Display Component) ⏳

**File**: `app/components/galeries/Display.vue`

**Current Code** (lines 87-95):
```vue
<NuxtImg
  :src="galleryMedia.url"
  sizes="50vw md:25vw"
  width="800"
  format="webp"
  quality="80"
/>
```

**New Code**:
```vue
<script setup>
const props = defineProps<{
  galleryMedia: Media
  index: number
}>()

const imageConfig = computed(() => {
  return useResponsiveImage(props.galleryMedia, 'detail', {
    eager: props.index === 0,
    customSizes: '(min-width: 768px) 75vw, 100vw'
  })
})
</script>

<template>
  <NuxtImg
    v-bind="imageConfig"
    :alt="generateImageAlt(galleryMedia.name, index)"
    @load="onImageLoad"
  />
</template>
```

**Changes**:
- Use `detail` context for carousel images (large variant)
- First image eager, rest lazy
- Update sizes for full-width mobile, 75% desktop
- Preserve `@load` event for loading threshold

**Expected Payload**: Mobile 375px viewport = medium variant (~120 KB × 10 images = 1.2 MB, was 8 MB) → **85% reduction**

**Unit Tests**:
- First image has `loading="eager"`
- Subsequent images have `loading="lazy"`
- Correct variant selected based on viewport (test with mock viewport)

---

#### 2.3 Update Gallery Index Page ⏳

**File**: `app/pages/galeries/index.vue`

**No code changes needed** — uses `<GaleriesList>` component which is updated in 2.1.

**Verification**: Run Lighthouse audit before/after. Compare scores.

---

#### 2.4 Update Gallery Detail Page ⏳

**File**: `app/pages/galeries/[slug].vue`

**No code changes needed** — uses `<GaleriesDisplay>` component which is updated in 2.2.

**Verification**:
1. Open gallery detail
2. DevTools Network tab
3. Resize viewport from mobile → desktop
4. Verify correct variant loaded (medium on mobile, large on desktop)

---

#### 2.5 Performance Testing ⏳

**Lighthouse CI**:
```bash
npm run lighthouse -- --url=http://localhost:3000/galeries
npm run lighthouse -- --url=http://localhost:3000/galeries/mariage-claire-et-julien
```

**Expected Results**:

| Metric | Before | After | Target |
|--------|--------|-------|--------|
| Performance Score | 85 | 93+ | 90+ |
| LCP | 3.2s | < 1.5s | < 2.5s |
| Total Payload (mobile) | 12 MB | < 2 MB | < 3 MB |

**Unit Tests**: Automated Lighthouse CI in GitHub Actions (optional).

---

## Phase 3: Product Pages ⏳

**Goal**: Migrate product grid and detail pages. Achieve 80% payload reduction on product grids.

**Target**: Product cards load thumb variants, detail pages load medium variants.

**User Verification**: Open `/univers/accessoires-fleurs-sechees` on mobile → Network tab shows ~45 KB images per product card.

### Tasks

#### 3.1 Migrate Product Card Component ⏳

**File**: `app/components/products/Card.vue`

**Current Code** (lines 25-33):
```vue
<NuxtImg
  :src="product.media[0]?.url"
  sizes="50vw md:25vw"
  format="webp"
  quality="80"
/>
```

**New Code**:
```vue
<script setup>
const imageConfig = computed(() => {
  return useResponsiveImage(props.product.media?.[0], 'card', {
    customSizes: '(min-width: 768px) 25vw, 50vw'
  })
})
</script>

<template>
  <NuxtImg
    v-bind="imageConfig"
    :alt="`${product.name} - Pensée Bohème`"
    @load="onImageLoad"
  />
</template>
```

**Changes**:
- Use `card` context (medium variant)
- Keep existing sizes pattern
- Preserve loading threshold

**Expected Payload**: 20 products × 120 KB = 2.4 MB (was 20 × 800 KB = 16 MB) → **85% reduction**

**Unit Tests**: Card renders with correct variant.

---

#### 3.2 Migrate Atelier Card Mobile Component ⏳

**File**: `app/components/ateliers/CardMobile.vue`

**Same pattern as 3.1** — use `card` context.

**Unit Tests**: Component renders correctly.

---

#### 3.3 Product Detail Pages ⏳

**Research needed**: Find product detail page implementation.

**Expected**: Use `detail` context for main product image.

**Unit Tests**: TBD based on actual implementation.

---

#### 3.4 Performance Testing ⏳

**Lighthouse CI** on product pages:
```bash
npm run lighthouse -- --url=http://localhost:3000/univers/accessoires-fleurs-sechees
```

**Expected**: Performance score 88 → 95+

---

## Phase 4: Admin Backoffice ⏳

**Goal**: Migrate admin pages to use responsive variants. Improve admin page load time by 80%.

**Target**: Admin table thumbnails use `thumb` variant, form previews use `medium` variant.

**User Verification**: Open `/admin/galleries` → table loads instantly with small thumbnails.

### Tasks

#### 4.1 Migrate Admin Gallery Table ⏳

**File**: `app/pages/admin/galleries/index.vue`

**Current**: No image display in table (check implementation).

**New**: Add image column with thumb variant.

**Example**:
```vue
<template #image-cell="{ row }">
  <NuxtImg
    v-if="(row.original as GalleryData).media?.[0]"
    v-bind="useResponsiveImage((row.original as GalleryData).media[0], 'thumb')"
    :alt="(row.original as GalleryData).name"
    class="w-12 h-12 object-cover rounded"
  />
</template>
```

**Unit Tests**: Table renders with thumbnails.

---

#### 4.2 Migrate Admin Product Table ⏳

**File**: `app/pages/admin/products/index.vue`

**Current Code** (line 113):
```vue
<template #image-cell="{ row }">
  <NuxtImg
    :src="(row.original as Product).media?.[0]?.url"
    class="w-12 h-12 object-cover rounded"
  />
</template>
```

**New Code**:
```vue
<template #image-cell="{ row }">
  <NuxtImg
    v-if="(row.original as Product).media?.[0]"
    v-bind="useResponsiveImage((row.original as Product).media[0], 'thumb')"
    :alt="(row.original as Product).name"
    class="w-12 h-12 object-cover rounded"
  />
</template>
```

**Unit Tests**: Table renders with thumbnails.

---

#### 4.3 Migrate Admin Gallery Edit Form ⏳

**File**: `app/pages/admin/galleries/[slug]/edit.vue`

**Current Code** (lines 54-68 - existing images display):
```vue
<img
  :src="image.url"
  class="w-full h-48 object-cover rounded"
/>
```

**New Code**:
```vue
<NuxtImg
  v-bind="useResponsiveImage(image, 'card')"
  :alt="image.name"
  class="w-full h-48 object-cover rounded"
/>
```

**Note**: FileReader previews (new images) keep `<img>` tags with data URLs.

**Unit Tests**: Existing images display correctly, new previews work.

---

#### 4.4 Migrate Admin Product Edit Form ⏳

**File**: `app/pages/admin/products/[id]/edit.vue`

**Same pattern as 4.3** — existing images use `card` context, FileReader previews unchanged.

**Unit Tests**: Form displays correctly.

---

## Phase 5: Validation & Monitoring ⏳

**Goal**: Verify implementation correctness, performance gains, and set up monitoring.

**Target**: All pages pass visual regression tests. Performance metrics meet targets. Monitoring in place.

**User Verification**: Lighthouse scores 90+ across all pages. No visual regressions. Error tracking active.

### Tasks

#### 5.1 Visual Regression Testing ⏳

**Tool**: Percy or Chromatic (TBD)

**Test Cases**:
- Gallery index (mobile, tablet, desktop)
- Gallery detail carousel
- Product grid
- Admin tables

**Expected**: All screenshots identical to baseline (no visual changes).

**Unit Tests**: Percy/Chromatic CI integration.

---

#### 5.2 Cross-Browser Testing ⏳

**Browsers**:
- Chrome (desktop + Android)
- Safari (macOS + iOS)
- Firefox

**Test Cases**:
- Correct variant served based on viewport
- Srcset selection works on retina displays
- Images sharp on 2× displays

**Manual Checklist**:
- [ ] Safari iOS retina: thumbnails sharp
- [ ] Chrome Android: correct variant on 3G network
- [ ] Firefox: srcset parsing works

---

#### 5.3 Performance Monitoring Setup ⏳

**Google Analytics Events**:
```typescript
// Track image variant usage
window.gtag?.('event', 'image_variant', {
  context: 'card',
  variant: 'medium',
  page: '/galeries'
})

// Track payload size
window.gtag?.('event', 'page_payload', {
  size_mb: (performance.getEntriesByType('resource').reduce(...) / 1024 / 1024).toFixed(2),
  page: window.location.pathname
})
```

**Expected**: Dashboard showing variant distribution (80% thumb/medium on mobile).

**Unit Tests**: Analytics events fire correctly.

---

#### 5.4 Error Tracking ⏳

**Sentry/LogRocket Integration**:
```typescript
// In useResponsiveImage
if (!media.urls && media.url) {
  Sentry?.captureMessage('Legacy media format', {
    level: 'warning',
    extra: { media }
  })
}
```

**Expected**: Monitor for:
- Missing `urls` object (should decrease to 0%)
- 404 image loads
- Fallback to placeholder usage

**Unit Tests**: Error events logged correctly.

---

#### 5.5 Lighthouse CI Automation ⏳

**GitHub Actions**:
```yaml
- name: Run Lighthouse CI
  run: |
    npm run build
    npm run lighthouse:ci
  env:
    LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

**Assertions**:
- Performance score ≥ 90
- LCP < 2.5s
- Image payload < 3 MB (mobile)

**Expected**: CI fails if performance regresses.

---

#### 5.6 Final Checklist ⏳

**Manual Verification**:
- [ ] Gallery index loads in < 2s on mobile
- [ ] Gallery detail carousel sharp on desktop
- [ ] Product grids load thumbnails only
- [ ] Admin tables show small thumbnails
- [ ] No console errors on any page
- [ ] DevTools Network tab shows correct variants
- [ ] Lighthouse scores 90+ on all pages
- [ ] Visual regression tests pass
- [ ] Cross-browser testing complete

**Automated Tests**:
- [ ] All unit tests pass (`npm run test`)
- [ ] TypeScript compilation passes (`npm run build`)
- [ ] Lighthouse CI passes (GitHub Actions)

---

## Migration Rollback Plan

**If critical issues detected**:

### Rollback Step 1: Revert Media Type
```typescript
// Restore old format
export type Media = {
  id: number
  name: string
  url: string
  urls?: { ... }  // Optional
}
```

### Rollback Step 2: Component Fallbacks
All components already handle old format via `useResponsiveImage` fallback. No code changes needed.

### Rollback Step 3: Verify
- [ ] TypeScript compiles
- [ ] Dev server starts
- [ ] All pages load images (using old `url` field)

**Trigger**: Error rate > 1% OR LCP degrades > 10% OR visual regressions detected.

---

## Success Metrics (Post-Implementation)

### Performance
- ✅ Gallery index LCP: 3.2s → < 1.5s (53% improvement)
- ✅ Gallery detail LCP: 4.5s → < 2.0s (56% improvement)
- ✅ Mobile payload (gallery index): 12 MB → < 2 MB (83% reduction)
- ✅ Mobile payload (gallery detail): 18 MB → < 5 MB (72% reduction)
- ✅ Lighthouse Performance Score: 85 → 95+

### User Experience
- ✅ Bounce rate: Track 7-day average before/after (expect 10% reduction)
- ✅ Time on page: Track gallery pages (expect 20% increase)
- ✅ Conversion rate: Track contact form submissions from gallery pages

### Technical
- ✅ Zero TypeScript errors
- ✅ 100% unit test coverage on `useResponsiveImage`
- ✅ Visual regression tests passing
- ✅ Cross-browser compatibility verified
