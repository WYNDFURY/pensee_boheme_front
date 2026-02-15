# Frontend Responsive Images — Design

## Overview

Migrate from single-source images to multi-variant responsive images using backend-provided MediaResource URLs (`thumb`, `medium`, `large`, `original`). Primary goal: reduce image payload by 70-85% on mobile devices through intelligent variant selection and srcset generation.

**Core strategy**: Update `Media` type → create variant selection composable → migrate NuxtImg usage component-by-component → preserve existing loading strategies.

**Key insight from research**: All content images already use NuxtImg with `sizes` attributes. No major refactor needed — upgrade types and URL access patterns only.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                       Frontend Application                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Component (Gallery/Product/etc)                                    │
│        │                                                             │
│        ├──> useResponsiveImage(media, context)                      │
│        │        │                                                    │
│        │        ├──> selectVariant(context) → base URL              │
│        │        ├──> buildSrcset(media.urls) → srcset string        │
│        │        └──> getSizes(context) → sizes attribute            │
│        │                                                             │
│        └──> NuxtImg component                                       │
│                 :src="variant URL"                                  │
│                 :srcset="generated srcset"                          │
│                 :sizes="context sizes"                              │
│                                                                       │
│  Backend API (MediaResource)                                        │
│        └──> urls: { thumb, medium, large, original }                │
│                   400x400   1200px   2000px   original              │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

### Variant Selection Strategy

| Context | Base Variant | Srcset | Sizes | Use Case |
|---------|-------------|--------|-------|----------|
| **thumb** | thumb | `1x thumb, 2x medium` | Fixed (e.g. `200px`) | Grid thumbnails, table rows |
| **card** | medium | `1x medium, 2x large` | Responsive (e.g. `50vw md:25vw`) | Product/gallery cards |
| **detail** | large | `1x large, 2x large` | Responsive (e.g. `100vw md:75vw`) | Full-screen carousels, hero images |
| **hero** | large | `1x large, 2x large` | `100vw` | Landing page headers |

**Decision logic**: Use smallest variant that satisfies display size + retina quality. Fallback: `original` if variant missing.

## Components and Interfaces

### 1. Update Media Type

**File**: `app/types/models.ts`

**Current**:
```typescript
export type Media = {
  id: number
  name: string
  url: string
}
```

**New**:
```typescript
export type Media = {
  id: number
  name: string
  file_name: string
  mime_type: string
  size: number
  urls: {
    thumb: string      // 400x400 center-crop WebP
    medium: string     // 1200px max-width WebP
    large: string      // 2000px max-width WebP
    original: string   // Original uploaded file
  }
}
```

**Migration note**: All existing code accessing `media.url` will break at compile time (intentional). Forces explicit migration to `media.urls.variant`.

### 2. Responsive Image Composable

**File**: `app/composables/useResponsiveImage.ts`

```typescript
export type ImageContext = 'thumb' | 'card' | 'detail' | 'hero'

export interface ResponsiveImageConfig {
  src: string           // Base variant URL
  srcset: string        // Full srcset with 1x/2x
  sizes: string         // Sizes attribute for browser
  loading: 'lazy' | 'eager'
}

export const useResponsiveImage = (
  media: Media | undefined,
  context: ImageContext,
  options?: {
    eager?: boolean      // Override lazy loading
    customSizes?: string // Override default sizes
  }
): ResponsiveImageConfig => {
  if (!media?.urls) {
    // Fallback for missing media or old format
    return {
      src: media?.url || '/images/placeholder.jpg',
      srcset: '',
      sizes: '100vw',
      loading: options?.eager ? 'eager' : 'lazy',
    }
  }

  const { urls } = media

  // Variant selection
  const variantMap: Record<ImageContext, string> = {
    thumb: urls.thumb,
    card: urls.medium,
    detail: urls.large,
    hero: urls.large,
  }

  // Srcset generation (1x base, 2x higher resolution)
  const srcsetMap: Record<ImageContext, string> = {
    thumb: `${urls.thumb} 1x, ${urls.medium} 2x`,
    card: `${urls.medium} 1x, ${urls.large} 2x`,
    detail: `${urls.large} 1x, ${urls.large} 2x`,
    hero: `${urls.large} 1x, ${urls.large} 2x`,
  }

  // Sizes attribute (responsive)
  const sizesMap: Record<ImageContext, string> = {
    thumb: '200px',                    // Fixed small
    card: '(min-width: 768px) 25vw, 50vw',  // 25% desktop, 50% mobile
    detail: '(min-width: 768px) 75vw, 100vw', // 75% desktop, full mobile
    hero: '100vw',                     // Always full width
  }

  return {
    src: variantMap[context],
    srcset: srcsetMap[context],
    sizes: options?.customSizes || sizesMap[context],
    loading: options?.eager ? 'eager' : 'lazy',
  }
}
```

**Usage**:
```vue
<script setup>
const { src, srcset, sizes, loading } = useResponsiveImage(gallery.media[0], 'card')
</script>

<template>
  <NuxtImg
    :src="src"
    :srcset="srcset"
    :sizes="sizes"
    :loading="loading"
    alt="..."
  />
</template>
```

### 3. Component Migration Pattern

**Before** (Gallery List):
```vue
<NuxtImg
  :src="currentGallery?.media[0]?.url || '/images/placeholder.jpg'"
  sizes="96px sm:144px md:192px"
  format="webp"
  quality="75"
/>
```

**After**:
```vue
<script setup>
const imageConfig = computed(() =>
  useResponsiveImage(currentGallery.value?.media[0], 'thumb', { eager: true })
)
</script>

<template>
  <NuxtImg
    v-bind="imageConfig"
    alt="Gallery preview"
    format="webp"
    quality="75"
  />
</template>
```

**Pattern**: Replace manual `src` + `sizes` with `useResponsiveImage()` spread via `v-bind`.

### 4. Preserve Loading Strategy

**Existing pattern** (found in all gallery/product components):
```typescript
const pending = ref(true)
const loadedCount = ref(0)
const REVEAL_THRESHOLD = 4

function onImageLoad() {
  loadedCount.value++
  if (loadedCount.value >= REVEAL_THRESHOLD) {
    pending.value = false
  }
}

onMounted(() => {
  setTimeout(() => { pending.value = false }, 2000)
})
```

**Keep unchanged**. Responsive images don't affect loading state logic.

## Data Models

### MediaResource (Backend API)

From `docs/api-reference.md`:

```typescript
{
  id: number
  name: string
  file_name: string
  mime_type: string
  size: number
  urls: {
    thumb: string      // 400x400 center-crop WebP
    medium: string     // 1200px max-width WebP
    large: string      // 2000px max-width WebP
    original: string   // original uploaded file
  }
}
```

### Frontend Media Type (Updated)

```typescript
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
}
```

Exact 1:1 match with backend `MediaResource`.

### Related Type Updates

**GalleryData**:
```typescript
export type GalleryData = {
  // ... existing fields
  media?: Media[] | []
  cover_image: Media[] | null  // Now uses updated Media type
}
```

**Product**:
```typescript
export type Product = {
  // ... existing fields
  media: Media[] | []  // Now uses updated Media type
}
```

**No changes needed** to these wrapper types — only `Media` itself changes.

## Error Handling

### Missing Variants

**Scenario**: API returns old format without `urls` object (backward compatibility during migration).

**Solution**:
```typescript
if (!media?.urls) {
  // Fallback to old format or placeholder
  return {
    src: media?.url || '/images/placeholder.jpg',
    srcset: '',
    sizes: '100vw',
    loading: 'lazy',
  }
}
```

**Monitoring**: Log warning when fallback triggered (count in analytics).

### Broken Image URLs

**Scenario**: Backend URL returns 404 (image deleted, CDN issue).

**Solution**: NuxtImg has built-in error handling. Add `@error` handler:

```vue
<NuxtImg
  v-bind="imageConfig"
  @error="onImageError"
/>

<script setup>
function onImageError(event: Event) {
  console.error('Image load failed:', event)
  // Optional: swap to placeholder or hide element
}
</script>
```

### TypeScript Migration Errors

**Scenario**: Existing code accesses `media.url` after type update.

**Expected**: Compile-time errors at every access point.

**Resolution**: Update to `media.urls.medium` (or appropriate variant). Use IDE "Find All References" on `Media` type to locate all access points.

**Estimated**: ~30 access points across components (based on research).

## Testing Strategy

### Unit Tests (Vitest)

**`useResponsiveImage.spec.ts`**:
- Returns correct variant for each context (`thumb`, `card`, `detail`, `hero`)
- Builds valid srcset strings (1x, 2x)
- Handles missing media (fallback to placeholder)
- Handles old format without `urls` (backward compat)
- Respects `eager` and `customSizes` options

### Visual Regression (Percy/Chromatic)

- Screenshot gallery index before/after (verify thumbnails look identical)
- Screenshot gallery detail before/after (verify carousel looks identical)
- Screenshot product grid before/after
- Test on 1x and 2x displays (retina)

### Performance Testing

**Lighthouse CI**:
- Run on gallery pages before/after
- Target: Performance score 85 → 95+
- Metrics: LCP, FID, CLS unchanged or improved

**Network Analysis** (Chrome DevTools):
- Gallery index mobile: verify thumb (400px) loaded, not large (2000px)
- Gallery detail desktop: verify large loaded for carousel
- Verify srcset serving correct variant based on viewport

### Cross-Browser Testing

- **Safari iOS**: WebP support, srcset selection on retina displays
- **Chrome Android**: Bandwidth-aware image selection
- **Firefox**: Srcset/sizes parsing

### Manual Checklist

- [ ] Thumbnails sharp on 2× displays (use actual iPhone/iPad)
- [ ] No layout shift during load (aspect ratio preserved)
- [ ] Lazy loading works (images below fold don't load immediately)
- [ ] Network tab shows correct variant per viewport (resize browser, check downloads)
- [ ] Admin image previews still work (FileReader blobs unaffected)
- [ ] No console errors about missing variants
- [ ] Placeholder shown if media missing (defensive)

## Performance Considerations

### Expected Payload Reduction

| Page | Viewport | Current | Target | Savings |
|------|----------|---------|--------|---------|
| Gallery index | Mobile 375px | 12 MB | 1.8 MB | 85% |
| Gallery index | Desktop 1440px | 12 MB | 4 MB | 67% |
| Gallery detail | Mobile 375px | 18 MB | 5 MB | 72% |
| Gallery detail | Desktop 1440px | 18 MB | 12 MB | 33% |
| Product grid | Mobile 375px | 8 MB | 1.2 MB | 85% |

**Calculation basis**:
- Thumb variant: ~45 KB (400×400 WebP at 75% quality)
- Medium variant: ~120 KB (1200px WebP)
- Large variant: ~280 KB (2000px WebP)
- Original: ~800 KB (average)

### Core Web Vitals Impact

**LCP (Largest Contentful Paint)**:
- Current: 3.2s on gallery pages (loading 2000px images)
- Target: < 1.5s (loading 400px thumbs on mobile, preloading first large image)

**CLS (Cumulative Layout Shift)**:
- No change expected (already using explicit dimensions and aspect ratios)

**FID (First Input Delay)**:
- Slight improvement (less decoding work for smaller images)

### Lazy Loading Optimization

**Keep existing strategy** (threshold + timeout):
```typescript
const REVEAL_THRESHOLD = 4
const SAFETY_TIMEOUT = 2000
```

**Rationale**: Works well with current UX (Lottie loader → reveal). Don't over-optimize.

### Preloading Strategy

**Gallery detail page** (carousel): Preload first image only.

```typescript
// In gallery detail page
onMounted(() => {
  if (gallery.value?.media[0]) {
    const { src } = useResponsiveImage(gallery.value.media[0], 'detail', { eager: true })
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    document.head.appendChild(link)
  }
})
```

**Don't preload** subsequent carousel images (lazy load on demand).

## Security Considerations

### XSS via Image URLs

**Risk**: Malicious URLs in `media.urls` fields.

**Mitigation**:
- Backend already validates URLs (Spatie Media Library controls generation)
- Frontend: URLs are bound to `src` attribute (HTML-safe)
- No `dangerouslySetInnerHTML` or string interpolation in templates

**Verdict**: No additional security measures needed.

### CDN/Origin Validation

**Current**: Images served from backend domain (controlled).

**Future**: If moving to CDN, validate origin in NuxtImg config:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  image: {
    domains: ['api.pensee-boheme.fr', 'cdn.pensee-boheme.fr'],
  },
})
```

## Monitoring and Observability

### Performance Monitoring

**RUM (Real User Monitoring)**:
- Track LCP, FID, CLS via Google Analytics or Vercel Analytics
- Before/after comparison (A/B test or staged rollout)

**Metrics to track**:
```typescript
// Example: Custom event for image load time
performance.mark('image-load-start')
// ... image loads ...
performance.mark('image-load-end')
performance.measure('image-load', 'image-load-start', 'image-load-end')

// Send to analytics
const measure = performance.getEntriesByName('image-load')[0]
window.gtag?.('event', 'image_load', {
  duration: measure.duration,
  variant: 'medium',
})
```

### Error Tracking

**Log missing variants**:
```typescript
if (!media?.urls) {
  console.warn('[ResponsiveImage] Fallback triggered - missing urls object', { media })
  // Send to error tracker (Sentry, LogRocket, etc.)
}
```

**Track 404s**:
```vue
<NuxtImg
  @error="(e) => {
    console.error('[ResponsiveImage] Image load failed', { src: e.target.src })
    // Send to error tracker
  }"
/>
```

### Variant Usage Statistics

**Track which variants are served**:
```typescript
// In useResponsiveImage
const variantUsed = variantMap[context]
if (import.meta.client) {
  window.plausible?.('ImageVariant', { props: { context, variant: variantUsed } })
}
```

**Goal**: Verify mobile users actually get thumb/medium (not large/original).

### Payload Monitoring

**Lighthouse CI** on every deploy:
- Run on gallery index + detail
- Fail build if Performance score < 90
- Alert if image payload > threshold

**Example** (GitHub Actions):
```yaml
- name: Lighthouse CI
  run: |
    lhci autorun --assert.preset=lighthouse:recommended
```

## Migration Plan

### Phase 1: Foundation (No Visual Changes)

1. Update `Media` type in `models.ts`
2. Create `useResponsiveImage.ts` composable
3. Add fallback handling for old format
4. Write unit tests for composable
5. Verify no runtime errors (all compile errors resolved)

**Estimated**: 20-30 compile errors to fix (all `media.url` → `media.urls.medium`)

### Phase 2: High-Impact Pages

1. Gallery index (`/galeries`) — biggest payload reduction
2. Gallery detail (`/galeries/[slug]`) — second biggest
3. Product grid pages (`/univers/*`) — third biggest

**Order**: Descending order of payload savings.

### Phase 3: Remaining Pages

1. Product detail pages
2. Instagram feed (already optimized by Instagram — keep as-is)
3. Admin backoffice tables/forms

### Phase 4: Validation

1. Run Lighthouse CI on all pages
2. Visual regression tests
3. Cross-browser testing
4. Performance monitoring (RUM)
5. A/B test or staged rollout (10% → 50% → 100%)

## Rollback Strategy

**If issues detected**:

1. **Type rollback**: Revert `Media` type to old format:
   ```typescript
   export type Media = {
     id: number
     name: string
     url: string
     urls?: { ... }  // Optional during transition
   }
   ```

2. **Composable fallback**: `useResponsiveImage` already handles old format (returns `media.url` if `urls` missing)

3. **Component rollback**: Revert individual component changes (git revert specific commits)

**Monitoring trigger**: If error rate > 1% or LCP degrades > 10%, rollback immediately.

## Future Enhancements (Out of Scope)

- **AVIF support**: Next-gen format (better compression than WebP)
- **Blur-up placeholders**: Tiny thumbnail → full image transition
- **Adaptive loading**: Serve lower quality on slow networks (Network Information API)
- **Progressive JPEGs**: Fallback for browsers without WebP (minimal effort with NuxtImg)
- **Client Hints**: Let browser request optimal size (experimental)
