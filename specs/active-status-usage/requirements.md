# Active Status & Gallery Ordering — Requirements

## Introduction

Admin backoffice enhancements to manage visibility and display order of content. Two capabilities:
1. **Quick status toggles** — toggle `is_active` (products) and `is_published` (galleries) directly from admin list pages without navigating to edit forms
2. **Gallery ordering** — reorder galleries using up/down buttons in the admin gallery list

Backend filtering is complete (see Resolved Questions). This spec covers **frontend admin UX only**.

## Alignment with Product Vision

Per `specs/product.md`, galleries are the **primary conversion tool** (Site Goal #1). The florist needs to:
- Control which galleries are visible to visitors (seasonal work, outdated shoots)
- Control gallery display order to showcase strongest/most recent work first
- Quickly activate/deactivate products as offerings change seasonally

Currently these fields exist in the data model and forms but lack efficient admin workflows.

## Requirements

### REQ-1: Quick Toggle for Gallery Publication Status

**User Story:** As an admin, I want to toggle a gallery's `is_published` status directly from the gallery list table, so that I can quickly show or hide galleries without opening the edit page.

**Acceptance Criteria:**
- The `is_published` column in the admin gallery list table (`app/pages/admin/galleries/index.vue`) displays an interactive toggle switch (USwitch or similar Nuxt UI component) instead of a static badge
- Clicking the toggle sends `PATCH /galleries/{slug}` with the updated `is_published` value via `useAdminApi()`
- The toggle is optimistically updated (immediate visual feedback), with rollback on API failure
- A toast notification confirms success or shows error message on failure
- The stats card "Publiées" count updates reactively after toggle
- The toggle is disabled while the API call is in-flight (prevent double-toggle)

### REQ-2: Quick Toggle for Product Active Status

**User Story:** As an admin, I want to toggle a product's `is_active` status directly from the product list table, so that I can quickly activate or deactivate products.

**Acceptance Criteria:**
- The `is_active` column in the admin product list table (`app/pages/admin/products/index.vue`) displays an interactive toggle switch instead of a static badge
- Clicking the toggle sends `PATCH /products/{id}` with the updated `is_active` value via `useAdminApi()`
- Optimistic update with rollback on failure
- Toast notification on success/failure
- Stats card "Actifs" count updates reactively after toggle
- Toggle disabled during in-flight request

### REQ-3: Gallery Ordering with Move Up/Down Buttons

**User Story:** As an admin, I want to move galleries up or down in the list, so that I can control the display order on the public gallery page.

**Acceptance Criteria:**
- The admin gallery list table displays the galleries sorted by `order` field (ascending)
- Each row has up (arrow up) and down (arrow down) action buttons
- The first row's up button and last row's down button are disabled (or hidden)
- Clicking a button swaps the `order` values of the target gallery and its neighbor
- Both affected galleries are updated via `PATCH /galleries/{slug}` with their new `order` values
- The table re-sorts immediately after the swap (optimistic)
- Rollback both galleries' order values on API failure
- Buttons are disabled during in-flight reorder requests
- The ordering applies to the **full dataset** (not just the currently filtered/searched subset). If search or `is_published` filter is active, the up/down buttons should be hidden or disabled with a tooltip explaining that ordering requires viewing all galleries

### REQ-4: Gallery List Default Sort

**User Story:** As an admin, I want the gallery list to always display in order, so that I can see the actual public display sequence.

**Acceptance Criteria:**
- Admin gallery list fetches all galleries and sorts them by `order` ascending as the default sort
- Newly created galleries without an explicit `order` value appear at the end of the list
- The public gallery page (`app/pages/galeries/index.vue`) also respects the `order` field (assuming backend returns galleries sorted by `order` — verify and document if frontend sort is needed as fallback)

## Non-Functional Requirements

### Architecture
- Toggle and reorder API calls use the existing `useAdminApi()` composable — no new composables needed
- State updates are local (mutate the reactive array in-place) — no need to refetch the entire list after each toggle/reorder
- Keep the existing filter/search functionality intact; ordering and toggling work alongside them

### Performance
- Optimistic UI for all mutations (toggle, reorder) — no loading spinners blocking the whole table
- Disable only the specific toggle/button that is in-flight, not the entire table

### Usability
- Toggle switches should have clear on/off visual states (green for active/published, neutral for inactive/unpublished)
- Up/down buttons should be small icon buttons in the actions column (or a dedicated "Ordre" column)
- Consider grouping reorder buttons visually (e.g., stacked vertically) to suggest directionality

### Reliability
- All mutations must handle 401 (auto-logout via existing `useAdminApi()` behavior), 422 (validation toast), and network errors (rollback + error toast)
- If one of the two PATCH calls in a reorder fails, rollback both galleries to their previous order values

## Files to Modify

| File | Changes |
|------|---------|
| `app/pages/admin/galleries/index.vue` | Replace static `is_published` badge with toggle switch; add up/down buttons; sort by `order`; handle toggle/reorder API calls |
| `app/pages/admin/products/index.vue` | Replace static `is_active` badge with toggle switch; handle toggle API call |

## API Endpoints Used

| Action | Method | Endpoint | Payload |
|--------|--------|----------|---------|
| Toggle gallery published | PATCH | `/galleries/{slug}` | `{ is_published: boolean }` |
| Toggle product active | PATCH | `/products/{id}` | `{ is_active: boolean }` |
| Reorder gallery | PATCH | `/galleries/{slug}` | `{ order: number }` |

## Resolved Questions

1. **Backend gallery sort**: DONE. `GET /galleries` returns results `ORDER BY order ASC` at query level. Frontend sort by `order` kept as defensive fallback.
2. **Initial order values**: DONE. Backend migration assigned incremental `order` values (1, 2, 3...) to existing galleries. New galleries auto-assign `MAX(order) + 1`.
3. **Backend visibility filtering**: DONE. Implemented via Eloquent scopes:
   - `GET /products` and `GET /galleries` — unauthenticated requests filtered by `is_active`/`is_published`. Authenticated (admin) requests return all.
   - `GET /products/{id}` and `GET /galleries/{slug}` — inactive/unpublished items return 404 for guests, accessible for admins.
   - `GET /pages/{slug}` — nested `categories.products` filtered by `is_active` conditionally on auth status.
   - `IndexPageController` removed (route, controller, test deleted).
