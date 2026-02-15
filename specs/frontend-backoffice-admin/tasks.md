# Frontend Admin Backoffice — Tasks

## Phase 1: Auth Foundation

**Goal**: Composables, middleware, and types for authentication

**User verification**: Token stored in localStorage after mock login

### Tasks

#### 1.1 Create auth types
- File: `app/types/models.ts`
- Add `AuthUser`, `LoginResponse`, `ApiError` types
- Unit test: TypeScript compilation passes

#### 1.2 Create useAuth composable
- File: `app/composables/useAuth.ts`
- Implement `login()`, `logout()`, `token`, `user`, `isAuthenticated`
- Use `useState` for reactive state
- localStorage read/write with `import.meta.client` guards
- Unit tests:
  - `login()` stores token and user in localStorage
  - `logout()` clears localStorage
  - `isAuthenticated` returns true when token exists
  - SSR safety: no errors when `localStorage` unavailable

#### 1.3 Create useAdminApi composable
- File: `app/composables/useAdminApi.ts`
- Implement `get()`, `post()`, `patch()`, `delete()`, `upload()`
- Inject `Authorization: Bearer` header
- Handle 401 → logout + redirect
- Handle 422 → throw for component
- Handle generic errors → toast
- Unit tests:
  - Auth header injection
  - 401 triggers logout
  - 422 throws without toast
  - Generic error shows toast

#### 1.4 Create auth middleware
- File: `app/middleware/auth.global.ts`
- Redirect unauthenticated users from `/admin/*` to `/admin/login`
- Redirect authenticated users from `/admin/login` to `/admin/dashboard`
- Unit tests:
  - Protected route without token redirects
  - Login with token redirects to dashboard
  - Non-admin routes pass through

#### 1.5 Exclude admin from SSG
- File: `nuxt.config.ts`
- Add `nitro.prerender.ignore: ['/admin/**']`

---

## Phase 2: Login Page

**Goal**: Functional login UI with token storage

**User verification**: Login with test credentials, token stored, redirected to dashboard

### Tasks

#### 2.1 Create login page
- File: `app/pages/admin/login.vue`
- UForm with email/password fields
- Zod schema validation
- Call `useAuth().login()` on submit
- Show loading state during API call
- Toast on success/error
- `definePageMeta`: `layout: false`, `ssr: false`
- E2E test:
  - Valid credentials → token stored → redirect to dashboard
  - Invalid credentials → error toast
  - Already logged in → redirect to dashboard

#### 2.2 Style login page
- Centered card layout
- Pensée Bohème branding
- Responsive (though desktop-focused)

---

## Phase 3: Admin Layout

**Goal**: Sidebar layout with navigation and logout

**User verification**: Navigate between admin pages via sidebar

### Tasks

#### 3.1 Create admin layout
- File: `app/layouts/admin.vue`
- Fixed sidebar with logo
- Nav links: Dashboard, Galeries, Produits
- Logout button in sidebar footer
- Main content area with `<slot />`
- E2E test:
  - Logout button → token cleared → redirect to login

#### 3.2 Style admin layout
- 256px sidebar width
- Gray background for main area
- White cards for content

---

## Phase 4: Dashboard

**Goal**: Landing page with stats and navigation

**User verification**: Dashboard shows gallery/product counts, quick links work

### Tasks

#### 4.1 Create dashboard page
- File: `app/pages/admin/dashboard.vue`
- `definePageMeta`: `layout: 'admin'`, `ssr: false`
- Display user first/last name
- Fetch galleries count via `useAdminApi().get('/galleries')`
- Fetch products count via `useAdminApi().get('/products')`
- Display counts in card grid
- Quick action buttons → `/admin/galleries`, `/admin/products`
- E2E test:
  - Dashboard loads after login
  - Counts displayed correctly
  - Quick action buttons navigate

---

## Phase 5: Gallery List & Delete

**Goal**: Table of galleries with delete functionality

**User verification**: Gallery list loads, delete removes gallery after confirmation

### Tasks

#### 5.1 Create gallery list page
- File: `app/pages/admin/galleries/index.vue`
- `definePageMeta`: `layout: 'admin'`, `ssr: false`
- UTable with columns: Name, Slug, Published, Order, Image Count, Actions
- Fetch via `useAdminApi().get('/galleries')`
- Show loading spinner
- Show error message on fetch failure
- "Créer une galerie" button → `/admin/galleries/create`
- E2E test:
  - Gallery list loads
  - Create button navigates

#### 5.2 Add delete functionality
- Delete button per row → confirmation modal (UModal)
- Modal shows gallery name, warning text
- DELETE `/api/galleries/:slug` on confirm
- Optimistic UI: remove from table immediately
- Rollback on API failure
- Toast on success/error
- E2E test:
  - Delete button → modal opens
  - Confirm → gallery removed → toast shown
  - Cancel → modal closes, no API call

---

## Phase 6: Gallery Create

**Goal**: Form to create gallery with multi-image upload

**User verification**: Create gallery with images, appears in list

### Tasks

#### 6.1 Create gallery create page
- File: `app/pages/admin/galleries/create.vue`
- `definePageMeta`: `layout: 'admin'`, `ssr: false`
- UForm with fields: name, slug, description, order, is_published
- Zod schema validation
- Auto-generate slug on name input (slugify function)
- File input: multiple, accept image types, max 20 files
- Validate file count and size (10MB each) on change
- E2E test:
  - Form validation works
  - Auto-slug generation

#### 6.2 Add image preview
- Use `FileReader` to generate data URLs
- Display previews in grid (3 columns)
- Delete button per preview
- Remove file from array on delete

#### 6.3 Implement form submission
- Build `FormData` with form fields + images (`images[]`)
- POST via `useAdminApi().upload('/galleries', formData)`
- Show loading state (disable submit button)
- Toast on success → redirect to `/admin/galleries`
- Display field errors on 422
- E2E test:
  - Submit valid form → gallery created → redirect
  - Submit with validation errors → field errors shown

---

## Phase 7: Gallery Edit

**Goal**: Edit existing gallery, manage images

**User verification**: Edit form pre-filled, can add/remove images, changes saved

### Tasks

#### 7.1 Create gallery edit page
- File: `app/pages/admin/galleries/[slug]/edit.vue`
- `definePageMeta`: `layout: 'admin'`, `ssr: false`
- Fetch gallery via `useAdminApi().get(\`/galleries/${slug}\`)`
- Pre-fill form with fetched data
- Same form fields as create
- Display existing images from `gallery.media` array
- E2E test:
  - Edit page loads with data
  - Form fields pre-filled

#### 7.2 Add existing image management
- Grid of existing images with delete button
- DELETE `/api/media/:id` on click (no form submit)
- Remove from local state on success
- Toast on success/error

#### 7.3 Add new images
- File input for new images (appended to existing)
- Preview new images separately from existing
- PATCH with new images via `FormData` (images[] appended)

#### 7.4 Implement form submission
- PATCH via `useAdminApi().upload(\`/galleries/${slug}\`, formData, 'PATCH')`
- Toast on success → redirect to `/admin/galleries`
- E2E test:
  - Edit gallery → changes reflected in list
  - Add images → new images appear
  - Remove image → image removed

---

## Phase 8: Product List & Delete

**Goal**: Table of products with delete functionality

**User verification**: Product list loads, delete removes product

### Tasks

#### 8.1 Create product list page
- File: `app/pages/admin/products/index.vue`
- `definePageMeta`: `layout: 'admin'`, `ssr: false`
- UTable with columns: Name, Category, Price, Active, Image, Actions
- Fetch via `useAdminApi().get('/products')`
- Display category name from `category` relation
- Display product image thumbnail
- Show price_formatted
- "Créer un produit" button → `/admin/products/create`
- E2E test:
  - Product list loads
  - Create button navigates

#### 8.2 Add delete functionality
- Delete button per row → confirmation modal
- DELETE `/api/products/:id` on confirm
- Optimistic UI, rollback on failure
- Toast on success/error
- E2E test:
  - Delete product → removed from list

---

## Phase 9: Product Create

**Goal**: Form to create product with image and category

**User verification**: Create product with image, appears in list

### Tasks

#### 9.1 Create product create page
- File: `app/pages/admin/products/create.vue`
- `definePageMeta`: `layout: 'admin'`, `ssr: false`
- UForm with fields: name, slug, description, category_id, has_price, price, is_active
- Zod schema validation
- Auto-generate slug on name input
- Fetch categories: `useAdminApi().get('/categories')`
- Category select dropdown (USelect) populated from API
- Conditional price field: shown only if `has_price` checked
- File input: single image, max 10MB
- E2E test:
  - Form validation
  - Auto-slug
  - Conditional price field

#### 9.2 Add image preview
- Single image preview with `FileReader`
- Delete button to clear selection

#### 9.3 Implement form submission
- Build `FormData` with fields + image
- POST via `useAdminApi().upload('/products', formData)`
- Loading state
- Toast on success → redirect to `/admin/products`
- Display field errors on 422
- E2E test:
  - Submit valid form → product created
  - Validation errors shown

---

## Phase 10: Product Edit

**Goal**: Edit existing product, replace image

**User verification**: Edit form pre-filled, can change image, changes saved

### Tasks

#### 10.1 Create product edit page
- File: `app/pages/admin/products/[id]/edit.vue`
- `definePageMeta`: `layout: 'admin'`, `ssr: false`
- Fetch product via `useAdminApi().get(\`/products/${id}\`)`
- Pre-fill form with fetched data
- Same form fields as create
- Display current image if exists
- E2E test:
  - Edit page loads with data

#### 10.2 Add image management
- Display current image with delete button
- DELETE `/api/media/:id` on click
- Remove from local state on success
- File input to upload new image (replaces old)
- Preview new image before submit

#### 10.3 Implement form submission
- PATCH via `useAdminApi().upload(\`/products/${id}\`, formData, 'PATCH')`
- Toast on success → redirect to `/admin/products`
- E2E test:
  - Edit product → changes reflected
  - Replace image → new image shown

---

## Implementation Notes

### Testing Strategy

**Unit tests** (Vitest):
- Run after each composable/middleware task
- Mock `$fetch`, `localStorage`, `navigateTo`
- Test edge cases (401, 422, network errors)

**E2E tests** (Playwright):
- Run after each page is implemented
- Use test database on backend
- Seed test admin user
- Test full user flows

### Development Order

Follow phases sequentially — each phase builds on previous. Within a phase, tasks can be done in parallel except where dependencies exist.

### Backend Prerequisites

Ensure backend API is running and accessible at `config.public.apiBaseUrl`. Test endpoints manually:
- POST `/login` returns token
- GET `/galleries` returns data
- Protected endpoints return 401 without token

### Manual Testing Checklist

After implementation, manually verify:
- [ ] Login with valid credentials
- [ ] Login with invalid credentials shows error
- [ ] Protected routes redirect when not logged in
- [ ] Logout clears token and redirects
- [ ] Create gallery with 10 images
- [ ] Create gallery with 20 images (max limit)
- [ ] Try uploading 21 images (should error)
- [ ] Try uploading 15MB image (should error)
- [ ] Edit gallery, remove 2 images, add 3 new
- [ ] Delete gallery with confirmation
- [ ] Create product with image and category
- [ ] Create product without price (has_price unchecked)
- [ ] Edit product, change image
- [ ] Delete product
- [ ] Slug auto-generation works
- [ ] Form validation shows errors in French
- [ ] All toasts show appropriate messages
- [ ] 401 during any request logs out and redirects

### Code Style Consistency

- Use existing patterns: `PenseeBohemeCredentials` for API base URL
- Follow Prettier config (single quotes, no semicolons, 2-space indent)
- Use Composition API with `<script setup lang="ts">`
- Import Nuxt UI components from `#components`
- Use `definePageMeta` for route config
- French labels and messages throughout
