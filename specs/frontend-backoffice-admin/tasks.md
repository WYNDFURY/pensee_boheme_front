# Frontend Admin Backoffice — Tasks

All phases are implemented. This document reflects the final state of the implementation.

## Phase 1: Auth Foundation ✅

**Goal**: Composables, middleware, and types for authentication

### Tasks

#### 1.1 Create auth types ✅
- File: `app/types/models.ts`
- Added `AuthUser`, `LoginResponse`, `ApiError` types

#### 1.2 Create useAuth composable ✅
- File: `app/composables/useAuth.ts`
- Implements `login()`, `logout()`, `token`, `user`, `isAuthenticated`
- Uses `useState` for reactive state
- localStorage read/write with `import.meta.client` guards
- `onMounted` rehydration from localStorage (critical for token persistence across page reload)
- `readonly()` on returned state to prevent external mutation

#### 1.3 Create useAdminApi composable ✅
- File: `app/composables/useAdminApi.ts`
- Implements `get()`, `post()`, `patch()`, `delete()`, `upload()`
- Injects `Authorization: Bearer` header
- Handles 401 → toast + logout + redirect
- Handles 422 → throw for component field-level display
- Handles generic errors → toast
- `upload()` method for FormData (does NOT set Content-Type — browser handles boundary)

#### 1.4 Create auth middleware ✅
- File: `app/middleware/auth.global.ts`
- Redirects unauthenticated users from `/admin/*` to `/admin/login`
- Redirects authenticated users from `/admin/login` to `/admin/dashboard`

#### 1.5 Exclude admin from SSG ✅
- File: `nuxt.config.ts`
- Added `nitro.prerender.ignore: ['/admin/**']`

---

## Phase 2: Login Page ✅

**Goal**: Functional login UI with token storage

### Tasks

#### 2.1 Create login page ✅
- File: `app/pages/admin/login.vue`
- UForm with email/password fields
- Zod schema validation
- Calls `useAuth().login()` on submit
- Shows loading state during API call
- Toast on success/error
- `definePageMeta`: `layout: false`, `ssr: false`

---

## Phase 3: Layout System ✅

**Goal**: Layout system with admin navbar and public/admin separation

### Tasks

#### 3.1 Create admin layout ✅
- File: `app/layouts/admin.vue`
- **Top navbar** (not sidebar) with:
  - Logo and branding on left
  - Text nav links: Accueil, Produits, Galeries (center)
  - User info (name + email) and logout button (right)
- Active link highlighting via `route.path.startsWith(path)`
- `v-if="isAuthenticated"` on nav and user menu to prevent flash during redirect
- Main content area with `<slot />`

#### 3.2 Create default layout ✅
- File: `app/layouts/default.vue`
- Public layout with LayoutHeader, LayoutBanner, LayoutFooter
- Used automatically by all pages that don't specify a layout

#### 3.3 Update app.vue to use NuxtLayout ✅
- File: `app/app.vue`
- Changed from hardcoded components to `<NuxtLayout>` + `<NuxtPage>`
- Enables proper layout selection via `definePageMeta`

#### 3.4 Hide public header on admin routes ✅
- File: `app/components/layout/Header.vue`
- Added `v-if="!isAdminRoute"` to hide public header on `/admin/*` routes
- Computed `isAdminRoute` checks `route.path.startsWith('/admin')`

---

## Phase 4: Dashboard ✅

**Goal**: Landing page with stats and navigation

### Tasks

#### 4.1 Create dashboard page ✅
- File: `app/pages/admin/dashboard.vue`
- `definePageMeta`: `layout: 'admin'`, `ssr: false`
- Displays user first/last name
- Fetches galleries count via `useAdminApi().get('/galleries')` — accesses `.data.length` (wrapped response)
- Fetches products count via `useAdminApi().get('/products')` — accesses `.length` (direct array)
- Displays counts in card grid with icons
- Quick action links → `/admin/galleries`, `/admin/products`

---

## Phase 5: Gallery List & Delete ✅

**Goal**: Table of galleries with search/filter and delete

### Tasks

#### 5.1 Create gallery list page ✅
- File: `app/pages/admin/galleries/index.vue`
- `definePageMeta`: `layout: 'admin'`, `ssr: false`
- Stats cards: total galleries, published galleries, total images (using `images_count`)
- UTable with columns (TanStack Table v8 format):
  - Direct: `name` (accessorKey), `slug` (accessorKey), `order` (accessorKey)
  - Virtual: `is_published` (id), `image_count` (id), `actions` (id)
- `:data` prop (not `:rows`)
- `#column-cell` slots with `row.original as GalleryData` type assertion
- Button colors: `neutral` for edit, `error` for delete
- Search by name, photographer, or slug
- Filter by published status (Tous / Publiées / Non publiées)
- "Créer une galerie" button → `/admin/galleries/create`

#### 5.2 Add delete functionality ✅
- Delete button per row → confirmation modal (UModal)
- Modal shows gallery name, warning text
- DELETE `/api/galleries/:slug` on confirm
- Toast on success/error, refresh list after delete

---

## Phase 6: Gallery Create ✅

**Goal**: Form to create gallery with multi-image upload

### Tasks

#### 6.1 Create gallery create page ✅
- File: `app/pages/admin/galleries/create.vue`
- `definePageMeta`: `layout: 'admin'`, `ssr: false`
- UForm with fields: name, slug, photographer, description, order, is_published
- Zod schema validation
- Auto-generate slug on name input (slugify: normalize NFD + regex)

#### 6.2 Add image preview ✅
- File input: multiple, accept image types, max 20 files, max 10MB each
- `FileReader` for data URL previews
- Display previews in grid with remove button per image

#### 6.3 Implement form submission ✅
- Build `FormData` with form fields + images (`images[]`)
- POST via `useAdminApi().upload('/galleries', formData, 'POST')`
- Loading state, toast on success → redirect to `/admin/galleries`
- Cancel button uses `$router.push('/admin/galleries')`

---

## Phase 7: Gallery Edit ✅

**Goal**: Edit existing gallery, manage images

### Tasks

#### 7.1 Create gallery edit page ✅
- File: `app/pages/admin/galleries/[slug]/edit.vue`
- `definePageMeta`: `layout: 'admin'`, `ssr: false`
- Fetches gallery via `useAdminApi().get('/galleries/:slug')`
- Pre-fills form with fetched data

#### 7.2 Add existing image management ✅
- Grid of existing images with delete button
- DELETE `/api/media/:id` on click (per-image, no form submit needed)
- Remove from local state on success, toast feedback

#### 7.3 Add new images ✅
- File input for new images (appended to existing)
- Preview new images with FileReader

#### 7.4 Implement form submission ✅
- PATCH via `useAdminApi().upload('/galleries/:slug', formData, 'PATCH')`
- Toast on success → redirect to `/admin/galleries`

---

## Phase 8: Product List & Delete ✅

**Goal**: Table of products with search/filter and delete

### Tasks

#### 8.1 Create product list page ✅
- File: `app/pages/admin/products/index.vue`
- `definePageMeta`: `layout: 'admin'`, `ssr: false`
- Stats cards: total products, active products, categories count
- UTable with columns (TanStack Table v8 format):
  - Direct: `name` (accessorKey)
  - Virtual: `category` (id), `price` (id), `is_active` (id), `image` (id), `actions` (id)
- Fetches categories for name display and filter dropdown
- Search by name, slug, or description
- Filter by category and active status
- Button colors: `neutral` for edit, `error` for delete

#### 8.2 Add delete functionality ✅
- Delete button per row → confirmation modal
- DELETE `/api/products/:id` on confirm
- Toast on success/error, refresh list after delete

---

## Phase 9: Product Create ✅

**Goal**: Form to create product with image and category

### Tasks

#### 9.1 Create product create page ✅
- File: `app/pages/admin/products/create.vue`
- `definePageMeta`: `layout: 'admin'`, `ssr: false`
- UForm with fields: name, slug, description, category_id, has_price, price, is_active
- Zod schema with `.refine()` for cross-field validation (price required if has_price)
- Auto-generate slug on name input
- Category dropdown populated from GET `/api/categories`
- Conditional price field (shown only if has_price checked)

#### 9.2 Add image preview ✅
- Single image preview with FileReader
- Remove button to clear selection

#### 9.3 Implement form submission ✅
- Build FormData with fields + image
- POST via `useAdminApi().upload('/products', formData)`
- Loading state, toast on success → redirect to `/admin/products`

---

## Phase 10: Product Edit ✅

**Goal**: Edit existing product, replace image

### Tasks

#### 10.1 Create product edit page ✅
- File: `app/pages/admin/products/[id]/edit.vue`
- `definePageMeta`: `layout: 'admin'`, `ssr: false`
- Fetches product via `useAdminApi().get('/products/:id')`
- Also fetches categories for dropdown
- Pre-fills form with fetched data

#### 10.2 Add image management ✅
- Display current image with delete button
- DELETE `/api/media/:id` on click
- File input to upload new image (replaces old)
- Preview new image with FileReader

#### 10.3 Implement form submission ✅
- PATCH via `useAdminApi().upload('/products/:id', formData, 'PATCH')`
- Toast on success → redirect to `/admin/products`

---

## Implementation Notes

### Key Lessons Learned

1. **UTable v3 uses TanStack Table v8** — completely different API from v2. Use `:data` not `:rows`, `accessorKey`/`id` not `key`/`label`, `#column-cell` not `#column-data`
2. **API response inconsistency** — Galleries wrap in `{ data: [] }`, Products/Categories return direct arrays. Always verify actual response structure
3. **Token persistence** — `useState` initializers can lose values after SSR hydration. `onMounted` rehydration from localStorage is required
4. **Button colors** — Nuxt UI v3 uses `neutral` (not `gray`) and `error` (not `red`)
5. **Layout system** — Must use `<NuxtLayout>` in `app.vue` for layout selection to work. Don't hardcode layout components in app.vue
6. **Gallery `images_count`** — The `media` array is limited to 3 items for preview performance. Always use `images_count` for display

### Code Style Consistency

- Use existing patterns: `PenseeBohemeCredentials` for API base URL (public composables)
- Follow Prettier config (single quotes, no semicolons, 2-space indent)
- Use Composition API with `<script setup lang="ts">`
- Use `definePageMeta` for route config
- French labels and messages throughout

### Manual Testing Checklist

- [x] Login with valid credentials
- [x] Login with invalid credentials shows error
- [x] Protected routes redirect when not logged in
- [x] Logout clears token and redirects
- [x] Token persists across page reload
- [x] Navbar hidden when not authenticated
- [x] Public header hidden on admin routes
- [x] Gallery list with search and filter
- [x] Gallery create with photographer field and multi-image upload
- [x] Gallery edit with image management
- [x] Gallery delete with confirmation
- [x] Product list with search and filter
- [x] Product create with image and category
- [x] Product edit with image replacement
- [x] Product delete with confirmation
- [x] Dashboard shows correct counts
- [x] Slug auto-generation works
- [x] Form validation shows errors in French
- [x] All toasts show appropriate messages
- [x] 401 during any request logs out and redirects
