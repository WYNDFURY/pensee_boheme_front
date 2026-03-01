# Requirements — API Response Standardization

> **Status**: Final — backend complete, API reference updated.

## 1. Introduction

The frontend currently handles 3 distinct API response shapes, forcing every call site to know which shape to expect. The backend has applied `JsonResource::withoutWrapping()` globally and standardized mutation responses. This spec covers the corresponding frontend changes, including type corrections revealed by the updated API reference.

## 2. Alignment with Product Vision

The site is API-driven: galleries, products, categories, and Instagram feed are fetched from `api.pensee-boheme.fr`. Correctness of the data layer is foundational to both the public site and admin backoffice. Inconsistent handling introduces subtle bugs and slows feature work.

## 3. Final API Contract

| Method | Shape |
|--------|-------|
| **GET list** | `[{...}, ...]` flat array — no `data` wrapper |
| **GET single** | `{...}` flat object — no `data` wrapper |
| **POST / PATCH** | `{ "message": "...", "data": {...} }` |
| **DELETE** | `{ "message": "..." }` |

Login (`POST /login`) is exempt — it returns `{ token, user }`.

## 4. Current State vs. Target State

### GET endpoints

| Endpoint | Current frontend type | Target type | Change |
|----------|-----------------------|-------------|--------|
| `GET /galleries` | `ApiResponse<GalleryData[]>` | `GalleryData[]` | Remove wrapper |
| `GET /galleries/{slug}` | `ApiResponse<GalleryData>` | `GalleryData` | Remove wrapper |
| `GET /pages/{slug}` | `ApiResponse<PageData>` | `PageData` | Remove wrapper |
| `GET /products/{id}` | `ApiResponse<Product>` | `Product` | Remove wrapper |
| `GET /products` | `Product[]` | `Product[]` | No change |
| `GET /categories` | `Category[]` | `Category[]` | No change |
| `GET /pages` | `PageData[]` | `PageData[]` | No change |
| `GET /instagram` | `InstagramMedia[]` | `InstagramMedia[]` | No change |

### Mutation endpoints (POST/PATCH)

Admin create/update operations return `{ message, data }`. Frontend currently ignores or loosely types these responses — needs explicit typing via `MutationResponse<T>`.

## 5. Type Corrections (revealed by updated API reference)

The API reference exposes divergences between the current TypeScript types and actual API responses. Fixed as part of this change.

### 5.1 `GalleryData.cover_image`

```ts
// Current (wrong)
cover_image: Media[] | null

// Correct per GalleryResource schema
cover_image: string | null  // URL string, not an array
```

**Impact**: `galeries/[slug].vue` accesses `gallery.cover_image?.[0]?.url` — must become `gallery.cover_image`.

### 5.2 `Category.page_id` → `Category.page_slug`

```ts
// Current (wrong — field no longer returned)
page_id: number

// Correct per CategoryResource schema
page_slug: string | null
```

**Impact**: Admin product create/edit pages filter categories by page using `cat.page_id === state.value.page_id`. Must be updated to match via `page_slug`. See REQ-06.

### 5.3 `InstagramMedia.media_type`

```ts
// Current (incomplete)
media_type: 'IMAGE' | 'CAROUSEL_ALBUM'

// Correct per InstagramMediaResource schema
media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
```

### 5.4 `Media.url` deprecated field removal

`url?: string` is not in `MediaResource` schema — removed from type. All template bindings using `media.url` must migrate to `media.urls.medium` (or appropriate size key).

### 5.5 `Product.category_id` — pre-existing bug, out of scope

`admin/products/[id]/edit.vue` accesses `product.category_id` to pre-fill the category/page dropdowns, but `ProductResource` does not include this field. The category pre-fill is silently broken. Requires a backend change to add `category_id` to `ProductResource`. **Track separately.**

## 6. Requirements

### REQ-01 — Remove `ApiResponse<T>` wrapper from all GET consumers

**User Story**: As a developer, I want GET calls to return flat entity types so I never need `.data` to unwrap a response.

**Acceptance Criteria**:
- No call site (composable or page) accesses `.data` to unwrap a GET response
- `useFetch` and `useAsyncData` calls typed with the flat entity type
- Public composables return refs typed to the flat entity
- `allGalleries` intermediate computed in `admin/galleries/index.vue` deleted (existed only to unwrap)

### REQ-02 — Clean up `models.ts`

**Acceptance Criteria**:
- `ApiResponse<T>`, `Gallery`, `Galleries`, `Page`, `ProductResponse` removed
- `MutationResponse<T>` added: `{ message: string; data: T }`
- `GalleryData.cover_image` corrected to `string | null`
- `Category.page_id: number` replaced by `page_slug: string | null`
- `InstagramMedia.media_type` union gains `'VIDEO'`
- `Media.url` deprecated field removed
- No unused types remain

### REQ-03 — Handle mutation responses explicitly

**Acceptance Criteria**:
- Admin create/update calls typed with `MutationResponse<T>`
- `message` and `data` are accessible on the typed response

### REQ-04 — No template-level unwrapping

**Acceptance Criteria**:
- No template binds to `data.data` — all 6 affected files fixed (`cadeaux-invites`, `accessoires-fleurs-sechees`, `ateliers-creatifs`, `locations`, `galeries/[slug]`, `GaleriesDisplay`)

### REQ-05 — `cover_image` access corrected

**Acceptance Criteria**:
- All `cover_image?.[0]?.url` or `cover_image?.[0]?.urls.*` accesses replaced with direct `cover_image` string
- No remaining array access on `cover_image`

### REQ-06 — Category-page filtering updated for `page_slug`

**Acceptance Criteria**:
- `admin/products/create.vue` and `admin/products/[id]/edit.vue` filter categories using `category.page_slug` matched against the selected page's `slug`
- Page dropdown `value` field remains `page.id` (integer, needed for form submission) — only the filter comparison logic changes

### REQ-07 — `Media.url` usages migrated

**Acceptance Criteria**:
- No component accesses `media.url` (the deprecated field)
- All image src bindings use `media.urls.medium` (or `thumb`/`large`) as appropriate

### REQ-08 — Type safety maintained

**Acceptance Criteria**:
- No `any` types introduced
- `vue-tsc --noEmit` exits clean

## 7. Non-Functional Requirements

**Architecture**: Unwrapping removal is type-level only — no new abstractions. Type corrections in `models.ts` propagate outward via TypeScript errors at call sites.

**Performance**: Net reduction of one computed property (`allGalleries`). No new network calls.

**Reliability**: `cover_image: string | null` simplifies null checks vs. the old `Media[] | null`. Existing null guards (`data.value ?? []`) remain valid for flat responses.

**Maintainability**: After this change, every new API consumer uses the same pattern — flat type, direct property access.
