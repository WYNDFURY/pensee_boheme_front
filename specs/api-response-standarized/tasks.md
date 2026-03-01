# Tasks — API Response Standardization

## Phase 1 — Type Foundation (`models.ts`)

**Goal**: Rewrite the type definitions to match the actual API contract. After this phase, TypeScript surfaces every broken call site in one pass — it is the map of remaining work.

**Verify**: Run `yarn build`. Expect TypeScript errors across the files listed in phases 2–4. Zero errors outside those files means the type changes are correct.

### T1.1 — Remove wrapper type family

In [app/types/models.ts](../../app/types/models.ts), delete lines 76–85:
```ts
// DELETE all of these
export type ApiResponse<T> = { data: T }
export type Gallery = ApiResponse<GalleryData>
export type Galleries = ApiResponse<GalleryData[]>
export type ProductResponse = ApiResponse<Product>
export type Page = ApiResponse<PageData>
```

### T1.2 — Add `MutationResponse<T>`

In [app/types/models.ts](../../app/types/models.ts), add after the `LoginResponse` type:
```ts
export type MutationResponse<T = unknown> = {
  message: string
  data: T
}
```

### T1.3 — Fix `GalleryData.cover_image`

```ts
// Before
cover_image: Media[] | null

// After
cover_image: string | null
```

### T1.4 — Fix `Category` type

```ts
// Before
export type Category = {
  id: number
  name: string
  slug: string
  description: string
  order: number
  page_id: number
  products?: Product[] | []
}

// After
export type Category = {
  id: number
  name: string
  slug: string
  description: string | null
  order: number
  page_slug: string | null
  products?: Product[] | []
}
```

### T1.5 — Fix `InstagramMedia.media_type`

```ts
// Before
media_type: 'IMAGE' | 'CAROUSEL_ALBUM'

// After
media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
```

### T1.6 — Remove deprecated `Media.url`

```ts
// DELETE this field from the Media type
url?: string
```

---

## Phase 2 — Composables and Components

**Goal**: Fix the upstream layer — composables and component props — so they no longer reference wrapper types and no longer propagate API shapes into component interfaces.

**Verify**: The files in this phase should be TypeScript-error-free after changes. `yarn build` output should show fewer errors than after Phase 1.

### T2.1 — `useGalleryService.ts`

[app/composables/useGalleryService.ts](../../app/composables/useGalleryService.ts):
- Import: `Galleries, Gallery` → `GalleryData`
- `useFetch<Galleries>` → `useFetch<GalleryData[]>`
- `useFetch<Gallery>` → `useFetch<GalleryData>`

### T2.2 — `useShowPageProductsService.ts`

[app/composables/useShowPageProductsService.ts](../../app/composables/useShowPageProductsService.ts):
- Import: `Page` → `PageData`
- `useFetch<Page>` → `useFetch<PageData>`

### T2.3 — `GaleriesList.vue` prop and template

[app/components/galeries/List.vue](../../app/components/galeries/List.vue):
- Import: `Galleries` → `GalleryData`
- Prop: `galleryItems: Galleries` → `galleryItems: GalleryData[]`
- Template — replace `galleryItems.data` with `galleryItems` at all 4 locations:
  - Both `v-for="(gallery, index) in galleryItems.data"` loops
  - `props.galleryItems.data[currentIndex.value]`
  - `props.galleryItems.data.length - 1`

### T2.4 — `GaleriesDisplay.vue` prop and template

[app/components/galeries/Display.vue](../../app/components/galeries/Display.vue):
- Import: `Gallery` → `GalleryData`
- Prop: `gallery: Gallery` → `gallery: GalleryData`
- Template — replace `gallery.data.*` with `gallery.*`:
  - `gallery.data.name` → `gallery.name`
  - `gallery.data.photographer` → `gallery.photographer`
  - `v-for="... in gallery.data.media"` → `v-for="... in gallery.media"`

---

## Phase 3 — Public Pages

**Goal**: Remove `.data` unwrap chains and fix `cover_image` access in all public-facing pages.

**Verify**: `yarn dev` — manually load `/galeries`, `/galeries/{any-slug}`, `/univers/cadeaux-invites`, `/univers/accessoires-fleurs-sechees`, `/ateliers-creatifs`, `/locations`. All pages render content. Gallery detail page SEO title shows gallery name (not `[object Object]`).

### T3.1 — `galeries/[slug].vue`

[app/pages/galeries/[slug].vue](../../app/pages/galeries/[slug].vue):

**Template** (sr-only div):
```html
<!-- Before -->
Galerie {{ data.data.name }} - ...

<!-- After -->
Galerie {{ data.name }} - ...
```

**Script** — unwrap variable:
```ts
// Before
const gallery = data.value.data

// After
const gallery = data.value
```

**Script** — `cover_image` (4 occurrences, all via `gallery` variable after the unwrap fix):
```ts
// Before — cover_image was Media[] | null, accessed as array
gallery.cover_image?.[0]?.url
`https://penseeboheme.fr${gallery.cover_image[0].url}`

// After — cover_image is string | null, use directly
gallery.cover_image
`https://penseeboheme.fr${gallery.cover_image}`
```

Apply to all 4 `cover_image` accesses in the `useSeoMeta` and `useSchemaOrg` calls (lines 30–31, 38–39, 90, 93).

### T3.2 — Four product/atelier pages (identical fix)

In each of the following, change `:page="data.data"` → `:page="data"`:
- [app/pages/univers/cadeaux-invites/index.vue](../../app/pages/univers/cadeaux-invites/index.vue) — line 29
- [app/pages/univers/accessoires-fleurs-sechees/index.vue](../../app/pages/univers/accessoires-fleurs-sechees/index.vue) — line 114
- [app/pages/ateliers-creatifs/index.vue](../../app/pages/ateliers-creatifs/index.vue) — line 91
- [app/pages/locations/index.vue](../../app/pages/locations/index.vue) — line 57

---

## Phase 4 — Admin Pages

**Goal**: Remove wrapper access in admin pages, eliminate the `allGalleries` intermediate computed, fix the category-by-page filter to use `page_slug`, and migrate all remaining `media.url` usages.

**Verify**: `yarn dev` — load `/admin/dashboard`, `/admin/galleries`, `/admin/galleries/{slug}/edit` (form pre-fills name/description/order/images), `/admin/products`, `/admin/products/create` (category dropdown filters by selected page), `/admin/products/{id}/edit`. No blank sections, no console errors.

### T4.1 — `admin/dashboard.vue`

[app/pages/admin/dashboard.vue](../../app/pages/admin/dashboard.vue):
- Import: `Galleries` → `GalleryData`
- `api.get<Galleries>('/galleries')` → `api.get<GalleryData[]>('/galleries')`
- `galleries.value?.data?.length ?? 0` → `galleries.value?.length ?? 0`

### T4.2 — `admin/galleries/index.vue`

[app/pages/admin/galleries/index.vue](../../app/pages/admin/galleries/index.vue):
- Import: remove `Galleries`
- `useFetch<Galleries>(...)` → `useFetch<GalleryData[]>(...)`
- Delete the `allGalleries` computed entirely
- In `galleries` computed: `let filtered = allGalleries.value` → `let filtered = data.value ?? []`

### T4.3 — `admin/galleries/[slug]/edit.vue`

[app/pages/admin/galleries/[slug]/edit.vue](../../app/pages/admin/galleries/[slug]/edit.vue):
- Import: `Gallery` → `GalleryData`
- `api.get<Gallery>(...)` → `api.get<GalleryData>(...)`
- Watch callback: `if (gallery?.data)` → `if (gallery)`, replace all `gallery.data.*` with `gallery.*`:
  - `gallery.data.name` → `gallery.name`
  - `gallery.data.slug` → `gallery.slug`
  - `gallery.data.description` → `gallery.description`
  - `gallery.data.order` → `gallery.order`
  - `gallery.data.is_published` → `gallery.is_published`
  - `gallery.data.media` → `gallery.media`
- Image src (line 51): `image.urls?.medium || image.url` → `image.urls.medium`

### T4.4 — `admin/products/index.vue`

[app/pages/admin/products/index.vue](../../app/pages/admin/products/index.vue):
- Lines 112–113: remove `|| media?.[0]?.url` fallback — use `media?.[0]?.urls?.thumb` only

### T4.5 — `admin/products/create.vue`

[app/pages/admin/products/create.vue](../../app/pages/admin/products/create.vue):

Fix `filteredCategoryOptions` computed — `Category.page_id` no longer exists, use `page_slug` matched against the selected page:
```ts
// Before
const filteredCategoryOptions = computed(() => {
  if (!state.value.page_id) return []
  return (categoriesData.value ?? [])
    .filter(cat => cat.page_id === state.value.page_id)
    .map(cat => ({ label: cat.name, value: cat.id }))
})

// After
const filteredCategoryOptions = computed(() => {
  if (!state.value.page_id) return []
  const selectedPage = pagesData.value?.find(p => p.id === state.value.page_id)
  return (categoriesData.value ?? [])
    .filter(cat => cat.page_slug === selectedPage?.slug)
    .map(cat => ({ label: cat.name, value: cat.id }))
})
```

### T4.6 — `admin/products/[id]/edit.vue`

[app/pages/admin/products/[id]/edit.vue](../../app/pages/admin/products/[id]/edit.vue):

- Import: remove `ProductResponse`
- `api.get<ProductResponse>(...)` → `api.get<Product>(...)`
- Watch callback: `if (product?.data)` → `if (product)`, replace all `product.data.*` with `product.*`:
  - `product.data.name` → `product.name`
  - `product.data.slug` → `product.slug`
  - `product.data.description` → `product.description`
  - `product.data.has_price` → `product.has_price`
  - `product.data.price` → `product.price`
  - `product.data.is_active` → `product.is_active`
  - `product.data.media` → `product.media`
  - `product.data.category_id` → `product.category_id` *(still broken — `category_id` not in API; remove the pre-fill lines for `page_id` and `category_id` until backend adds the field)*

- Fix `filteredCategoryOptions` — same pattern as T4.5:
```ts
const filteredCategoryOptions = computed(() => {
  if (!state.value.page_id) return []
  const selectedPage = pagesData.value?.find(p => p.id === state.value.page_id)
  return (categoriesData.value ?? [])
    .filter(cat => cat.page_slug === selectedPage?.slug)
    .map(cat => ({ label: cat.name, value: cat.id }))
})
```

- Image src (line 75): `existingImage?.[0]?.urls?.medium || existingImage?.[0]?.url` → `existingImage?.[0]?.urls?.medium`

### T4.7 — `components/ateliers/CardDesktop.vue`

[app/components/ateliers/CardDesktop.vue](../../app/components/ateliers/CardDesktop.vue):
- Line 9: `product.media[0]?.url` → `product.media[0]?.urls?.medium`
- Line 49: `product.media[0]?.url` → `product.media[0]?.urls?.medium`

---

## Phase 5 — Build Verification

**Goal**: Zero TypeScript errors, zero runtime regressions.

**Verify**: `yarn build` completes successfully with no type errors.

### T5.1 — Run `yarn build`

If errors remain, they will point to exact file and line. Fix each one — they should only be residual `media.url` usages or missed `ApiResponse` references.

### T5.2 — Smoke test in production preview

```bash
yarn generate:prod && yarn preview
```

Manually verify:
- `/galeries` — gallery list renders
- `/galeries/{slug}` — gallery detail renders, images load
- `/univers/cadeaux-invites` — product list renders
- `/ateliers-creatifs` — atelier cards render with images
- `/admin/galleries` — table loads, image count shown
- `/admin/galleries/{slug}/edit` — form pre-fills all fields
- `/admin/products` — table loads with thumbnails
- `/admin/products/create` — category dropdown filters when page is selected
- `/admin/dashboard` — gallery and product counts correct
