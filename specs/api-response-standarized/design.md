# Design — API Response Standardization

## Overview

Remove the `ApiResponse<T>` wrapper type family and fix type divergences revealed by the updated API reference. After the backend's `JsonResource::withoutWrapping()` change, all GET responses are flat. Update every call site, composable, and component prop. Add `MutationResponse<T>` for POST/PATCH. No new abstractions — type corrections, `.data` chain removal, and elimination of intermediate computeds that existed only to unwrap.

## Architecture

```
Before:
  API → { data: GalleryData[] }
  useFetch<Galleries> → Ref<{ data: GalleryData[] }>
  intermediate computed → data.value?.data ?? []
  component prop → galleryItems: Galleries  (API envelope type)
  template → galleryItems.data[i].name

After:
  API → GalleryData[]
  useFetch<GalleryData[]> → Ref<GalleryData[]>
  no intermediate computed
  component prop → galleryItems: GalleryData[]
  template → galleryItems[i].name
```

Change flows in one direction: **`models.ts` → composable → component prop → template**. No runtime logic changes.

---

## Overengineering Audit (caused by the legacy wrapper pattern)

Structural artifacts that are removed as part of this change.

### 1. `allGalleries` intermediate computed — `admin/galleries/index.vue:186`

```ts
// Exists only to unwrap — deleted
const allGalleries = computed(() => data.value?.data ?? [])
const galleries = computed(() => {
  let filtered = allGalleries.value
})
```

**Fix**: delete `allGalleries`, inline `data.value ?? []` directly in `galleries`.

### 2. Nested guard in edit watch callbacks

**`admin/galleries/[slug]/edit.vue:172`** and **`admin/products/[id]/edit.vue:235`**:

```ts
watch(data, (gallery) => {
  if (gallery?.data) {           // extra .data layer
    state.value = { name: gallery.data.name }
  }
})
```

After: `if (gallery) { state.value = { name: gallery.name } }`.

### 3. Component props typed to API envelope shape

`GaleriesList` accepts `Galleries` (the API wrapper), `GaleriesDisplay` accepts `Gallery`. Both components leak API implementation details into their interfaces. Fixed by updating props to `GalleryData[]` and `GalleryData`.

### 4. `data.data.*` chains in templates — 6 files

| File | Pattern |
|------|---------|
| `pages/galeries/[slug].vue:4-5` | `data.data.name`, `data.data.photographer` |
| `pages/univers/cadeaux-invites/index.vue:29` | `:page="data.data"` |
| `pages/univers/accessoires-fleurs-sechees/index.vue:114` | `:page="data.data"` |
| `pages/ateliers-creatifs/index.vue:91` | `:page="data.data"` |
| `pages/locations/index.vue:57` | `:page="data.data"` |
| `components/galeries/Display.vue:5,7,16` | `gallery.data.name`, `gallery.data.photographer`, `gallery.data.media` |

### 5. Extra unwrap variable — `galeries/[slug].vue:18`

```ts
const gallery = data.value.data  // only exists to avoid repeating .data
```

After: `const gallery = data.value`.

### 6. Double optional chain — `admin/dashboard.vue:75`

```ts
galleries.value?.data?.length   // vs
products.value?.length          // inconsistent
```

After: `galleries.value?.length`.

---

## Components and Interfaces

### 1. `app/types/models.ts`

**Remove:**
```ts
export type ApiResponse<T> = { data: T }
export type Gallery = ApiResponse<GalleryData>
export type Galleries = ApiResponse<GalleryData[]>
export type Page = ApiResponse<PageData>
export type ProductResponse = ApiResponse<Product>
```

**Add:**
```ts
export type MutationResponse<T = unknown> = {
  message: string
  data: T
}
```

**Type corrections per API reference:**

```ts
// GalleryData — cover_image is a URL string, not a Media array
export type GalleryData = {
  id: number
  name: string
  photographer: string | null
  slug: string
  description: string | null
  is_published: boolean
  cover_image: string | null        // was: Media[] | null
  order: number
  media?: Media[] | []
  images_count?: number
}

// Category — page_id removed, page_slug added
export type Category = {
  id: number
  name: string
  slug: string
  description: string | null        // was: description: string (not nullable)
  order: number
  page_slug: string | null          // was: page_id: number
  products?: Product[] | []
}

// InstagramMedia — VIDEO added to union
export type InstagramMedia = {
  id: number
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'   // was: 'IMAGE' | 'CAROUSEL_ALBUM'
  media_url: string
  permalink: string
  caption?: string
  timestamp: string
}

// Media — remove deprecated url field
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
  // url?: string  ← REMOVED (was @deprecated, not in MediaResource schema)
}
```

**`Product` — no `category_id` added.** The field is not in `ProductResource` and is a pre-existing bug (edit page pre-fill is silently broken). Tracked separately as a backend change request.

**Keep unchanged:** `PageData`, `ProductOption`, `AuthUser`, `LoginResponse`, `ApiError`.

---

### 2. `app/composables/useGalleryService.ts`

```ts
// Before
import type { Galleries, Gallery } from '~/types/models'
useFetch<Galleries>(`${apiKey}/galleries`, ...)
useFetch<Gallery>(`${apiKey}/galleries/${slug}`, ...)

// After
import type { GalleryData } from '~/types/models'
useFetch<GalleryData[]>(`${apiKey}/galleries`, ...)
useFetch<GalleryData>(`${apiKey}/galleries/${slug}`, ...)
```

---

### 3. `app/composables/useShowPageProductsService.ts`

```ts
// Before
import type { Page } from '~/types/models'
useFetch<Page>(...)

// After
import type { PageData } from '~/types/models'
useFetch<PageData>(...)
```

---

### 4. `app/composables/useFetchInstagramMediasService.ts`

**No change** — already `useFetch<InstagramMedia[]>`, already flat.

---

### 5. `app/components/galeries/List.vue`

```ts
// Before
import type { Galleries } from '~/types/models'
defineProps<{ galleryItems: Galleries }>()

// After
import type { GalleryData } from '~/types/models'
defineProps<{ galleryItems: GalleryData[] }>()
```

Template — replace `galleryItems.data` → `galleryItems` at 4 locations:
- `v-for="(gallery, index) in galleryItems.data"` (×2)
- `computed(() => props.galleryItems.data[currentIndex.value])`
- `computed(() => currentIndex.value === props.galleryItems.data.length - 1)`

---

### 6. `app/components/galeries/Display.vue`

```ts
// Before
import type { Gallery, Media } from '~/types/models'
defineProps<{ gallery: Gallery }>()

// After
import type { GalleryData, Media } from '~/types/models'
defineProps<{ gallery: GalleryData }>()
```

Template — `gallery.data.*` → `gallery.*`:
- `gallery.data.name` → `gallery.name`
- `gallery.data.photographer` → `gallery.photographer`
- `v-for="... in gallery.data.media"` → `v-for="... in gallery.media"`

---

### 7. `app/components/products/List.vue` and `app/components/ateliers/List.vue`

**No change** — both already accept `page: PageData`. Fixes are in the pages that pass the prop.

---

## Page-level Changes

### Public pages

#### `app/pages/galeries/index.vue`

No change. Composable returns `Ref<GalleryData[]>`. `:gallery-items="data"` stays identical.

#### `app/pages/galeries/[slug].vue`

Template (sr-only div):
```html
<!-- Before -->
Galerie {{ data.data.name }} ...

<!-- After -->
Galerie {{ data.name }} ...
```

Script SEO section:
```ts
// Before
const gallery = data.value.data

// After
const gallery = data.value
```

`cover_image` access (multiple locations in script):
```ts
// Before — cover_image was Media[] | null
gallery.cover_image?.[0]?.url
gallery.cover_image?.[0]?.urls?.medium  // if present

// After — cover_image is string | null
gallery.cover_image
```

`<GaleriesDisplay :gallery="data" />` — unchanged binding, updated types flow through.

#### `app/pages/univers/cadeaux-invites/index.vue:29`
#### `app/pages/univers/accessoires-fleurs-sechees/index.vue:114`
#### `app/pages/ateliers-creatifs/index.vue:91`
#### `app/pages/locations/index.vue:57`

All four:
```html
<!-- Before -->
<[Component] v-if="data" :page="data.data" />

<!-- After -->
<[Component] v-if="data" :page="data" />
```

---

### Admin pages

#### `app/pages/admin/galleries/index.vue`

```ts
// Before
useFetch<Galleries>(...)
const allGalleries = computed(() => data.value?.data ?? [])  // DELETED
const galleries = computed(() => {
  let filtered = allGalleries.value

// After
useFetch<GalleryData[]>(...)
const galleries = computed(() => {
  let filtered = data.value ?? []   // inlined, allGalleries deleted
```

Import: remove `Galleries`.

#### `app/pages/admin/galleries/[slug]/edit.vue`

```ts
// Before
import type { Gallery, Media } from '~/types/models'
api.get<Gallery>(`/galleries/${slug}`)

watch(data, (gallery) => {
  if (gallery?.data) {
    state.value = { name: gallery.data.name, slug: gallery.data.slug, ... }
    existingImages.value = gallery.data.media || []
  }
}, { immediate: true })

// After
import type { GalleryData, Media } from '~/types/models'
api.get<GalleryData>(`/galleries/${slug}`)

watch(data, (gallery) => {
  if (gallery) {
    state.value = { name: gallery.name, slug: gallery.slug, ... }
    existingImages.value = gallery.media || []
  }
}, { immediate: true })
```

#### `app/pages/admin/products/[id]/edit.vue`

```ts
// Before
import type { Product, ProductResponse, Category, Media, PageData } from '~/types/models'
api.get<ProductResponse>(`/products/${productId}`)

watch(productData, (product) => {
  if (product?.data) {
    const category = categoriesData.value?.find(cat => cat.id === product.data.category_id)
    state.value = {
      page_id: category?.page_id,     // ← page_id no longer on Category
      category_id: product.data.category_id,  // ← not in ProductResource
      name: product.data.name,
      ...
    }
  }
})

// After
import type { Product, Category, Media, PageData } from '~/types/models'
api.get<Product>(`/products/${productId}`)

watch(productData, (product) => {
  if (product) {
    // NOTE: product.category_id is not in ProductResource — pre-fill of
    // category/page dropdowns remains broken pending backend fix.
    // category and page_id logic unchanged structurally, just remove .data chain.
    state.value = {
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      has_price: product.has_price,
      price: product.price || undefined,
      is_active: product.is_active,
      // page_id and category_id pre-fill: deferred (requires category_id in API)
    }
    existingImage.value = product.media || []
  }
})
```

Import: remove `ProductResponse`.

#### `app/pages/admin/products/create.vue` and `admin/products/[id]/edit.vue` — category filtering

`Category.page_id` no longer exists; replaced by `page_slug`. The category filter must change:

```ts
// Before
.filter(cat => cat.page_id === state.value.page_id)

// After — find selected page's slug, then compare
const selectedPage = pagesData.value?.find(p => p.id === state.value.page_id)
.filter(cat => cat.page_slug === selectedPage?.slug)
```

Or more concisely as a computed:
```ts
const filteredCategoryOptions = computed(() => {
  if (!state.value.page_id) return []
  const selectedPage = pagesData.value?.find(p => p.id === state.value.page_id)
  return (categoriesData.value ?? [])
    .filter(cat => cat.page_slug === selectedPage?.slug)
    .map(cat => ({ label: cat.name, value: cat.id }))
})
```

#### `app/pages/admin/dashboard.vue`

```ts
// Before
import type { Galleries, Product } from '~/types/models'
api.get<Galleries>('/galleries')
const galleriesCount = computed(() => galleries.value?.data?.length ?? 0)

// After
import type { GalleryData, Product } from '~/types/models'
api.get<GalleryData[]>('/galleries')
const galleriesCount = computed(() => galleries.value?.length ?? 0)
```

---

## Data Models

### Removed

| Type | Was | Reason |
|------|-----|--------|
| `ApiResponse<T>` | `{ data: T }` | Backend no longer wraps GET responses |
| `Gallery` | `ApiResponse<GalleryData>` | Wrapper alias — obsolete |
| `Galleries` | `ApiResponse<GalleryData[]>` | Wrapper alias — obsolete |
| `Page` | `ApiResponse<PageData>` | Wrapper alias — obsolete |
| `ProductResponse` | `ApiResponse<Product>` | Wrapper alias — obsolete |

### Added

```ts
export type MutationResponse<T = unknown> = {
  message: string
  data: T
}
```

### Updated

| Type | Field | Change |
|------|-------|--------|
| `GalleryData` | `cover_image` | `Media[] \| null` → `string \| null` |
| `Category` | `page_id` | removed |
| `Category` | `page_slug` | added as `string \| null` |
| `Category` | `description` | `string` → `string \| null` |
| `InstagramMedia` | `media_type` | added `'VIDEO'` to union |
| `Media` | `url?` | removed (deprecated, not in schema) |

### Unchanged

`GalleryData` (other fields), `PageData`, `Product`, `ProductOption`, `AuthUser`, `LoginResponse`, `ApiError`.

---

## Error Handling

No change. `useAdminApi` error handling (401 → logout, 422 → rethrow, generic → toast) is unaffected by response shape changes.

---

## Testing Strategy

No test framework configured. Verification steps:
1. `yarn build` — zero TypeScript errors (type errors will surface any missed `.data` access or wrong field name)
2. Manual smoke test: `/galeries`, `/galeries/{slug}`, `/univers/cadeaux-invites`, `/univers/accessoires-fleurs-sechees`, `/ateliers-creatifs`, `/locations`, `/admin/galleries`, `/admin/products`, `/admin/dashboard`
3. Edit a gallery — verify form pre-fill (name, slug, description, order, published, existing images)
4. Create a product — verify category dropdown filters correctly by selected page after `page_slug` change
5. Verify gallery list carousel navigation works (uses `galleryItems.data` → `galleryItems`)

---

## Performance Considerations

Net reduction: `allGalleries` computed deleted. No additional network calls, no new computeds, no re-renders.

---

## Security Considerations

None. Auth token handling in `useAdminApi` is unchanged.

---

## Monitoring and Observability

If a backend endpoint still returns `{ data: T }`, it surfaces as a blank component (e.g., gallery name renders as `[object Object]`) rather than a silent failure. TypeScript will flag wrong property accesses at build time after the type corrections.
