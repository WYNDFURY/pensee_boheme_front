# Frontend Admin Backoffice — Requirements

## Introduction

Admin dashboard for managing galleries and products on the Pensée Bohème website. Cécile Devaux (site owner) needs a web interface to add, edit, and delete galleries and products without touching code. Authentication via email/password, token-based session management, form-driven CRUD operations.

This is an internal-only tool — no public access, no SEO, no fancy design needed. Focus: functional, fast, reliable.

## Alignment with Product Vision

From `@specs/product.md`:
- **Site Goal #1**: "Galleries are the primary conversion tool" — this backoffice enables Cécile to update galleries independently, keeping portfolio fresh
- **Service Lines**: Products represent workshops/rentals/accessories — Cécile needs to add new offerings as her business evolves
- **Technical Constraint**: "API-driven" — this backoffice consumes the existing Laravel API at `api.pensee-boheme.fr`

The backoffice directly supports business agility: Cécile can respond to client inquiries by quickly adding gallery photos from recent events or updating product offerings without developer intervention.

## Requirements

### REQ-1: Authentication

**User Story**: As Cécile, I want to log in with my email and password so that only I can access the admin panel.

**Acceptance Criteria**:
- Login page at `/admin/login` with email and password fields
- POST to `/api/login` with credentials
- On success, store token in `localStorage` and redirect to `/admin/dashboard`
- On failure, display error message ("Invalid credentials")
- Token persists across browser sessions until explicit logout
- If already logged in (valid token in storage), redirect from login page to dashboard
- No registration form — admin user created via backend seeder

### REQ-2: Logout

**User Story**: As Cécile, I want to log out so that my session ends and the token is revoked.

**Acceptance Criteria**:
- Logout button visible in admin layout header
- POST to `/api/logout` with bearer token
- Clear token from `localStorage`
- Redirect to `/admin/login`
- If logout API fails, still clear local token and redirect

### REQ-3: Protected Routes

**User Story**: As the system, I want to prevent unauthenticated access to admin pages so that only logged-in users can manage content.

**Acceptance Criteria**:
- All `/admin/*` routes except `/admin/login` require authentication
- If no token in `localStorage`, redirect to `/admin/login`
- If API returns 401 (invalid/expired token), clear token and redirect to `/admin/login`
- Use Nuxt middleware to check auth before rendering protected pages

### REQ-4: Gallery List

**User Story**: As Cécile, I want to see all galleries in a table so that I can browse and manage them.

**Acceptance Criteria**:
- Page at `/admin/galleries` shows table with columns: Name, Slug, Published, Order, Image Count, Actions
- GET `/api/galleries` on page load
- Each row has Edit and Delete action buttons
- "Create Gallery" button at top navigates to `/admin/galleries/create`
- Show loading state while fetching
- Display error message if API fails

### REQ-5: Gallery Create

**User Story**: As Cécile, I want to create a new gallery with multiple images so that I can showcase recent work.

**Acceptance Criteria**:
- Form at `/admin/galleries/create` with fields:
  - Name (required, text)
  - Slug (required, text, auto-generated from name with option to edit)
  - Description (optional, textarea)
  - Published (checkbox, default unchecked)
  - Order (number, default 0)
  - Images (file input, multiple, accept: jpeg/png/webp/gif, max 20 images, max 10MB each)
- Show image previews before upload
- POST to `/api/galleries` as `multipart/form-data` with bearer token
- On success, show success message and redirect to `/admin/galleries`
- On validation error (422), display field-level errors
- Cancel button navigates back to `/admin/galleries`

### REQ-6: Gallery Edit

**User Story**: As Cécile, I want to edit an existing gallery so that I can update details or add/remove images.

**Acceptance Criteria**:
- Page at `/admin/galleries/:slug/edit`
- GET `/api/galleries/:slug` to load current data
- Form pre-filled with current values (same fields as create)
- Display existing images with delete button per image (DELETE `/api/media/:id`)
- Add new images via file input (appended to existing)
- PATCH to `/api/galleries/:slug` with bearer token
- On success, show success message and redirect to `/admin/galleries`
- Delete image action removes from gallery without full form submit

### REQ-7: Gallery Delete

**User Story**: As Cécile, I want to delete a gallery so that I can remove outdated content.

**Acceptance Criteria**:
- Delete button in gallery list row
- Confirmation modal: "Delete gallery '[name]'? This action cannot be undone."
- DELETE to `/api/galleries/:slug` with bearer token
- On success, remove row from table and show success toast
- On failure, show error message

### REQ-8: Product List

**User Story**: As Cécile, I want to see all products in a table so that I can browse and manage them.

**Acceptance Criteria**:
- Page at `/admin/products` shows table with columns: Name, Category, Price, Active, Image, Actions
- GET `/api/products` on page load
- Each row has Edit and Delete action buttons
- "Create Product" button at top navigates to `/admin/products/create`
- Show loading state while fetching
- Display error message if API fails

### REQ-9: Product Create

**User Story**: As Cécile, I want to create a new product so that I can list new offerings.

**Acceptance Criteria**:
- Form at `/admin/products/create` with fields:
  - Name (required, text)
  - Slug (required, text, auto-generated from name with option to edit)
  - Description (optional, textarea)
  - Category (required, select dropdown populated from GET `/api/categories`)
  - Has Price (checkbox)
  - Price (number, shown only if Has Price checked, required if shown)
  - Active (checkbox, default checked)
  - Image (file input, single, accept: jpeg/png/webp/gif, max 10MB)
- Show image preview before upload
- POST to `/api/products` as `multipart/form-data` with bearer token
- On success, show success message and redirect to `/admin/products`
- On validation error (422), display field-level errors
- Cancel button navigates back to `/admin/products`

### REQ-10: Product Edit

**User Story**: As Cécile, I want to edit an existing product so that I can update details or change the image.

**Acceptance Criteria**:
- Page at `/admin/products/:id/edit`
- GET `/api/products/:id` to load current data
- Form pre-filled with current values (same fields as create)
- Display current image with delete button (DELETE `/api/media/:id`)
- Upload new image replaces old (backend handles replacement)
- PATCH to `/api/products/:id` with bearer token
- On success, show success message and redirect to `/admin/products`

### REQ-11: Product Delete

**User Story**: As Cécile, I want to delete a product so that I can remove discontinued offerings.

**Acceptance Criteria**:
- Delete button in product list row
- Confirmation modal: "Delete product '[name]'? This action cannot be undone."
- DELETE to `/api/products/:id` with bearer token
- On success, remove row from table and show success toast
- On failure, show error message

### REQ-12: Dashboard Overview

**User Story**: As Cécile, I want a landing page after login so that I see a summary and can navigate to management pages.

**Acceptance Criteria**:
- Page at `/admin/dashboard` (default route after login)
- Display:
  - Welcome message with user name
  - Count of galleries (GET `/api/galleries`, show length)
  - Count of products (GET `/api/products`, show length)
  - Quick action buttons: "Manage Galleries", "Manage Products"
- No fancy charts needed — simple stats and navigation

## Non-Functional Requirements

### Architecture

- **Framework**: Nuxt 3 (existing codebase)
- **Routing**: File-based under `app/pages/admin/`
- **Auth State**: Composable `useAuth()` wrapping token storage and user state
- **API Client**: Composable `useAdminApi()` wrapping `$fetch` with auth header injection
- **UI Library**: Nuxt UI v3 (already in project) for forms, modals, tables
- **Form Validation**: Zod schemas (already used in project)
- **File Uploads**: Native FormData with `multipart/form-data`

### Performance

- Admin pages excluded from SSG (no pre-rendering)
- List pages: client-side fetch on mount (no SSR needed for admin)
- Image previews: use `FileReader` for instant client-side preview before upload
- No pagination required (galleries ~10, products ~20 max)

### Security

- Token stored in `localStorage` (acceptable for single-admin use case, no XSS risk from untrusted content)
- All API calls include `Authorization: Bearer {token}` header
- Backend validates token on every protected endpoint
- Frontend never stores password (token only)
- Logout revokes token server-side via `/api/logout`

### Reliability

- API error handling: catch network errors, display user-friendly messages
- Optimistic UI updates: remove deleted items from list immediately, rollback on API failure
- Form validation: client-side Zod validation before API call to catch errors early
- Token expiry: if API returns 401, clear token and redirect to login

### Usability

- **Layout**: Simple sidebar with logo, nav links (Dashboard, Galleries, Products, Logout)
- **No mobile optimization needed**: Cécile uses desktop for admin work
- **Feedback**: Toast notifications for success/error after mutations
- **Loading states**: Spinners during API calls, disable submit buttons while processing
- **Confirmation dialogs**: Always confirm destructive actions (delete)
- **Auto-slug generation**: When typing gallery/product name, auto-generate slug (can be edited)
- **Keyboard shortcuts**: Enter submits forms, Escape closes modals
