# Frontend Responsive Images — Requirements

## Introduction

The backend API now provides multiple image variants via `MediaResource.urls`:
- **thumb**: 400×400 center-crop WebP (small previews)
- **medium**: 1200px max-width WebP (tablet/desktop)
- **large**: 2000px max-width WebP (high-res displays, full-screen)
- **original**: Original uploaded file (fallback/download)

Currently, the frontend doesn't leverage these variants — all images use a single source regardless of viewport size or display context. This results in:
- **Oversized downloads** on mobile (downloading 2000px images for 400px displays)
- **Slow page loads** especially on gallery pages with many images
- **Poor Core Web Vitals** (LCP, CLS) affecting SEO
- **Wasted bandwidth** for users on mobile data plans

This spec defines requirements for implementing responsive images across the site using the backend-provided variants.

## Alignment with Product Vision

From `@specs/product.md`:
- **Site Goal #1**: "Galleries are the primary conversion tool" — fast-loading, beautiful gallery images are critical for converting visitors to clients
- **Technical Constraint**: "Mobile-first responsive design" — images must adapt to viewport size
- **Performance**: "Fast initial load on mobile networks" — responsive images reduce payload by 70-90% on mobile

Implementing responsive images directly supports business goals: faster galleries → better UX → higher conversion → more bookings.

## Current State

### Where Images Are Used

1. **Gallery pages** (`/galeries`, `/galeries/[slug]`)
   - Index: 3 preview images per gallery (thumbnail grid)
   - Detail: All images in full-screen carousel

2. **Product pages** (`/univers/*`)
   - Category cards: 1 image per product (grid)
   - Product detail: 1 main image

3. **Instagram feed** (`/home`, `/galeries`)
   - 12 recent posts (grid of thumbnails)

4. **Admin backoffice** (`/admin/*`)
   - Product/gallery list: thumbnails in table
   - Edit forms: image previews

### Current Implementation Pattern

All images currently use **direct URL access** without variants:

```vue
<!-- Current: single source, no responsive handling -->
<NuxtImg :src="media.url" alt="..." />
<img :src="product.media[0]?.url" alt="..." />
```

No `sizes`, `srcset`, or variant selection — browser downloads whatever the backend returns (typically large/original).

## Requirements

### REQ-1: Update Media Type

**User Story**: As a developer, I want the `Media` type to match the backend `MediaResource` schema so I can access image variants with type safety.

**Acceptance Criteria**:
- Update `app/types/models.ts` `Media` type to include `urls` object with `thumb`, `medium`, `large`, `original` properties
- All existing code using `media.url` should break at compile-time (forces migration)
- Type matches `MediaResource` from `docs/api-reference.md` exactly

**Status**: ⏳ To Do

---

### REQ-2: Gallery Index Thumbnails

**User Story**: As a visitor browsing galleries, I want thumbnail grids to load quickly so I can see all galleries without waiting.

**Acceptance Criteria**:
- Gallery index page (`/galeries`) uses **thumb** variant (400×400 WebP) for all preview images
- Uses `srcset` with `1x` (thumb) and `2x` (medium) for retina displays
- `loading="lazy"` on images below the fold
- Maintains aspect ratio during load (prevent CLS)
- Alt text from gallery name

**Expected Impact**: 85% reduction in image payload on gallery index page

**Status**: ⏳ To Do

---

### REQ-3: Gallery Detail Carousel

**User Story**: As a visitor viewing a gallery, I want high-quality images that load quickly and look sharp on my device.

**Acceptance Criteria**:
- Gallery detail page (`/galeries/[slug]`) carousel uses:
  - **medium** variant for mobile (< 768px)
  - **large** variant for tablet/desktop (≥ 768px)
- `srcset` with multiple variants based on viewport width
- `sizes` attribute matches actual display size
- Lazy load images not currently visible in carousel
- Preload first image for fast LCP

**Expected Impact**: 60% reduction in payload on mobile, near-instant carousel navigation

**Status**: ⏳ To Do

---

### REQ-4: Product Images

**User Story**: As a visitor browsing products, I want product images to load instantly without sacrificing quality.

**Acceptance Criteria**:
- Product grid cards use **thumb** variant (400×400)
- Product detail page uses **medium** variant
- `srcset` with 1x/2x variants for retina
- `loading="lazy"` on grid images
- Alt text from product name

**Expected Impact**: Product pages load 3× faster on mobile

**Status**: ⏳ To Do

---

### REQ-5: Instagram Feed

**User Story**: As a visitor, I want the Instagram feed to load quickly without blocking page render.

**Acceptance Criteria**:
- Instagram thumbnails use API-provided `media_url` (already optimized by Instagram)
- Keep existing implementation (no changes needed — Instagram handles optimization)
- Add `loading="lazy"` if not already present

**Status**: ⏳ To Do

---

### REQ-6: Admin Backoffice Images

**User Story**: As Cécile managing content, I want admin pages to load quickly so I can work efficiently.

**Acceptance Criteria**:
- Admin product/gallery list tables use **thumb** variant in Image column
- Admin edit forms use **medium** variant for previews
- No lazy loading in admin (all images visible immediately for quick editing)

**Expected Impact**: Admin list pages load 80% faster

**Status**: ⏳ To Do

---

### REQ-7: Responsive Image Helper

**User Story**: As a developer, I want a reusable component/composable for responsive images so I don't repeat srcset logic everywhere.

**Acceptance Criteria**:
- Create `<ResponsiveImage>` component or `useResponsiveImage()` composable
- Accepts `media: MediaResource` prop and display context (`thumb | card | detail | hero`)
- Generates appropriate `srcset`, `sizes`, `loading` based on context
- Handles aspect ratio preservation
- Fallback to `original` if variants missing
- TypeScript support with proper types

**Example usage**:
```vue
<ResponsiveImage :media="gallery.media[0]" context="card" :alt="gallery.name" />
```

**Status**: ⏳ To Do

---

## Non-Functional Requirements

### Performance Targets

After implementation, target metrics:

| Metric | Current | Target | Impact |
|--------|---------|--------|--------|
| Gallery index LCP | 3.2s | < 1.5s | 53% faster |
| Gallery detail initial load | 4.5s | < 2.0s | 56% faster |
| Mobile image payload (gallery index) | 12 MB | < 2 MB | 83% reduction |
| Mobile image payload (gallery detail) | 18 MB | < 5 MB | 72% reduction |

### Browser Support

- Modern browsers with WebP support (95%+ coverage)
- Fallback to original for browsers without WebP (via `<picture>` if needed)
- Tested on: Chrome, Firefox, Safari (iOS + macOS), Edge

### SEO Impact

- Faster LCP → improved Core Web Vitals → higher search rankings
- Smaller pages → better mobile experience → lower bounce rate
- Proper `alt` text maintained throughout
- Schema.org `ImageObject` with all variants listed

### Accessibility

- All images must have descriptive `alt` text
- Maintain keyboard navigation in galleries
- Preserve aspect ratios to prevent layout shift (good for screen readers)

## Implementation Strategy

### Phase 1: Foundation
1. Update `Media` type in `models.ts`
2. Create `ResponsiveImage` component with variant selection logic
3. Update API composables to ensure `urls` object is populated

### Phase 2: High-Impact Pages
1. Gallery index (biggest payload reduction)
2. Gallery detail carousel
3. Product grids

### Phase 3: Remaining Pages
1. Product detail pages
2. Admin backoffice tables/forms

### Phase 4: Optimization
1. Add image preloading for above-the-fold images
2. Implement lazy loading threshold tuning
3. Add loading skeletons for better perceived performance

## Testing Strategy

### Visual Regression
- Screenshot comparison before/after for all image contexts
- Verify no quality degradation on retina displays
- Test on actual mobile devices (not just DevTools)

### Performance Testing
- Lighthouse CI on gallery pages (target: 90+ performance score)
- WebPageTest on 3G connection (target: < 3s LCP)
- Bundle analysis to verify no bloat from image handling code

### Cross-Browser Testing
- Safari iOS (WebP support, retina displays)
- Chrome Android (bandwidth-aware loading)
- Firefox (srcset/sizes parsing)

### Manual Checklist
- [ ] Gallery thumbnails sharp on 2× displays
- [ ] No layout shift during image load
- [ ] Images load progressively (lazy loading works)
- [ ] Network tab shows correct variant downloaded per viewport
- [ ] Works offline (service worker caching if implemented)
- [ ] Admin images load quickly
- [ ] No console errors about missing image variants

## Migration Notes

### Breaking Changes
- `Media` type changes from `{ url: string }` to `{ urls: { thumb, medium, large, original } }`
- All code accessing `media.url` must be updated to use `media.urls.medium` (or appropriate variant)

### Backward Compatibility
- Check for `media.urls` existence before accessing (API might return old format temporarily)
- Fallback to `media.url` or `media.urls.original` if variant missing

### Deployment Strategy
1. Deploy backend API changes first (add `urls` to MediaResource)
2. Verify API returns variants in staging
3. Deploy frontend changes (update types + components)
4. Monitor error logs for missing variants
5. Gradual rollout: test on 10% traffic, then 50%, then 100%

## Success Metrics

After implementation, measure:

1. **Page Load Time**: 50% reduction on gallery pages
2. **Lighthouse Performance Score**: 85 → 95+
3. **Image Payload**: 80% reduction on mobile
4. **Bounce Rate**: 10% reduction from faster loads
5. **Conversion Rate**: Track if faster galleries → more contact form submissions

## Future Enhancements

Out of scope for v1, but consider later:

- **AVIF format**: Next-gen format (better compression than WebP)
- **Adaptive loading**: Serve lower quality on slow networks
- **Blur-up placeholders**: Load tiny thumbnail first, then full image
- **Progressive JPEGs**: For browsers without WebP
- **Client hints**: Let browser request optimal size automatically
