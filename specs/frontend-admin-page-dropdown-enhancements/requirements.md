# Frontend Admin Page Dropdown Enhancements — Requirements

## Introduction

Fix broken dropdown menus in admin pages and add hierarchical page → category filtering to product creation. Currently, USelect dropdowns fail to populate in product create, product index filters, and gallery index filters due to API response type mismatches. Additionally, the product creation workflow needs page-scoped category selection to maintain proper data hierarchy.

**Business value**: Admin users need reliable form controls to manage products and galleries efficiently. Page-scoped category filtering prevents misassignment of products to wrong categories.

## Alignment with Product Vision

From `specs/product.md`, the admin backoffice supports service line management (floral creations, workshops, boutique items). Categories are organized by page (service line), so proper filtering ensures:
- **Operational efficiency**: Florist can quickly create products in the correct category
- **Data integrity**: Products are categorized correctly within their service line (univers)
- **Scalability**: As new service lines are added, the hierarchy remains clear

## Requirements

### REQ-1: Fix Dropdown Data Fetching (Critical Bug)

**User Story**: As an admin user, I want category and status dropdowns to display options correctly, so that I can create/filter products without errors.

**Acceptance Criteria**:
- [ ] Product create page category dropdown shows all categories
- [ ] Product index filter dropdowns (category, status) display options
- [ ] Gallery index filter dropdown (published status) displays options
- [ ] All dropdowns maintain consistent option format `{ label: string, value: number | boolean | null }`
- [ ] No console errors related to API response types
- [ ] Debug `<pre>` tag removed from product create page (line 23)

**Root Cause**: API response type inconsistency
- `/categories` endpoint returns direct `Category[]` array
- Code expects `ApiResponse<Category[]>` wrapper in some places
- Type mismatch causes `categoriesData.value` to be undefined or incorrectly structured
- `categoryOptions` computed property maps over undefined, producing empty array

**Current State**:
```typescript
// products/create.vue - BROKEN
const { data: categoriesData } = await useAsyncData('categories', () =>
  api.get<Category[]>('/categories')  // Expects direct array
)

const categoryOptions = computed(() => {
  return (categoriesData.value ?? []).map(cat => ({
    label: cat.name,
    value: cat.id,
  }))
})
```

**Expected Fix**: Align type to actual API response structure and handle unwrapping correctly.

### REQ-2: Add Page Selector to Product Create Form

**User Story**: As an admin user creating a product, I want to first select which page (service line) it belongs to, so that I only see relevant categories for that page.

**Acceptance Criteria**:
- [ ] Product create form shows "Page" dropdown before "Catégorie" dropdown
- [ ] Page dropdown fetches all pages from `/pages` endpoint
- [ ] Page field is required (Zod schema validation)
- [ ] Category dropdown is disabled until a page is selected
- [ ] Category dropdown only shows categories where `category.page_id === selectedPage.id`
- [ ] When page selection changes, category selection resets to undefined
- [ ] Form submission includes `category_id` (existing behavior preserved)

**UI Flow**:
1. Admin opens `/admin/products/create`
2. "Page" dropdown shows all pages (e.g., "Univers Floral", "Ateliers", "Boutique")
3. Admin selects a page
4. "Catégorie" dropdown enables and shows only categories for that page
5. Admin selects category and fills other fields
6. Form submits with `category_id` (page relationship implicit via category)

**Data Relationship** (from `types/models.ts`):
```
Page (1) ──── (M) Category (page_id)
              └──── (M) Product (category_id)
```

### REQ-3: Add Page Selector to Product Edit Form

**User Story**: As an admin user editing a product, I want to see and optionally change the page context, so that I can move products between service lines if needed.

**Acceptance Criteria**:
- [ ] Product edit form shows "Page" dropdown (pre-filled based on current category's page_id)
- [ ] Page dropdown is optional (can keep existing page by not changing it)
- [ ] Category dropdown filters by selected page
- [ ] If page changes, category must be reselected (existing category invalid for new page)
- [ ] Form validation ensures category belongs to selected page
- [ ] All existing product edit functionality preserved

### REQ-4: Maintain Consistent Filter UX in Index Pages

**User Story**: As an admin user viewing product/gallery lists, I want filter dropdowns to work reliably, so that I can quickly find specific items.

**Acceptance Criteria**:
- [ ] Product index page: category filter dropdown works
- [ ] Product index page: status filter dropdown works
- [ ] Gallery index page: published status filter dropdown works
- [ ] All filter dropdowns allow null value for "show all" option
- [ ] Filter state persists during navigation (existing `ref` pattern)
- [ ] Filtered results update reactively when dropdown value changes

**Current Pattern** (working correctly in galleries, broken in products):
```typescript
const selectedCategory = ref<number | null>(null)

const categoryOptions = computed(() => [
  { label: 'Toutes les catégories', value: null },
  ...categories.value.map(c => ({ label: c.name, value: c.id }))
])
```

### REQ-5: Data Fetching Consistency

**User Story**: As a developer, I want all admin API calls to follow a consistent pattern, so that type mismatches don't cause bugs.

**Acceptance Criteria**:
- [ ] All `/categories` calls use correct response type (direct array or `ApiResponse<T>`)
- [ ] All `/pages` calls use correct response type
- [ ] All admin data fetching uses `useAsyncData` with `useAdminApi()` composable
- [ ] Type definitions match actual API responses (verify against `docs/api-reference.md`)
- [ ] No casting or workarounds for type mismatches

**API Response Patterns** (from `docs/api-reference.md`):
| Endpoint | Response Wrapper | Frontend Type | Access Pattern |
|----------|------------------|---------------|----------------|
| `GET /galleries` | `{ "data": [...] }` | `ApiResponse<GalleryData[]>` | `data.value.data` |
| `GET /products` | `[...]` direct array | `Product[]` | `data.value` |
| `GET /categories` | `[...]` direct array | `Category[]` | `data.value` |
| `GET /pages` | `[...]` direct array | `PageData[]` | `data.value` |
| `GET /pages/{slug}` | Single PageResource | `PageData` | `data.value` |

**Confirmed**: `/categories` and `/pages` return direct arrays with **no wrapper**. The bug in product create is using the wrong type or accessing `.data` when it shouldn't exist.

## Non-Functional Requirements

### Architecture

**Composables**:
- Use existing `useAdminApi()` for all authenticated API calls
- Use `useAsyncData` for page-level data fetching (SSR: false admin pages)
- Use `computed()` for reactive dropdown options based on fetched data

**State Management**:
- Form state: Local `ref` objects (existing pattern)
- Dropdown state: `v-model` binding to form state refs
- Filter state: Component-level `ref` (no global state needed)

**Type Safety**:
- All API calls must specify correct generic type parameter
- Dropdown options must match `{ label: string, value: T }` interface
- Zod schemas for form validation (existing pattern)

### Performance

**Data Fetching**:
- Fetch pages and categories in parallel on mount (reduce initial load time)
- Cache category data across create/edit pages (`useAsyncData` key reuse)
- Avoid refetching categories when page selection changes (filter client-side)

**Reactive Updates**:
- Use `computed()` for filtered category options (automatic recalculation)
- Debounce page selection changes if network latency is high (optional)

**Expected Impact**:
- No additional API calls per page selection change (client-side filtering)
- Dropdown population: < 50ms (computed property evaluation)

### Security

**Authorization**:
- All API calls use `Authorization: Bearer` token via `useAdminApi()`
- Admin middleware protects `/admin/*` routes (existing)
- Token validation on every request (backend handles)

**Data Validation**:
- Zod schema validates `page_id` exists and is a number
- Backend must verify category belongs to specified page (server-side validation)
- Prevent form submission with mismatched page/category IDs

### Reliability

**Error Handling**:
- If `/categories` or `/pages` fetch fails, show error message in dropdown area
- Disable category dropdown if categories fetch fails
- Preserve form state if page/category fetch fails (allow retry)

**Fallback Behavior**:
- If page data unavailable, show all categories (graceful degradation)
- If category has no `page_id`, show in "Uncategorized" group (defensive)

**Loading States**:
- Show skeleton/spinner in dropdowns while fetching
- Disable dropdowns during fetch (prevent invalid selection)

### Usability

**Form Flow**:
- Clear visual indication when category dropdown is disabled ("Select a page first" placeholder)
- Auto-focus next field when page is selected (keyboard-friendly)
- Show category count in page dropdown (e.g., "Univers Floral (12 catégories)")

**Error Messages**:
- "Veuillez sélectionner une page avant de choisir une catégorie" (page not selected)
- "Aucune catégorie disponible pour cette page" (empty category list)
- "Erreur lors du chargement des pages/catégories" (fetch error)

**Accessibility**:
- USelect components have proper ARIA labels
- Required fields marked with `required` attribute
- Error messages announced by screen readers

## Technical Notes

### API Endpoints to Verify

From `docs/api-reference.md`:
- `GET /pages` - List all pages (verify response structure)
- `GET /categories` - List all categories (verify response structure)
- `GET /products` - List all products (verify response structure)

**Action**: Check actual API responses match type definitions before implementation.

### Page Data Structure

From `docs/api-reference.md` (lines 274-282, 260-272):

**PageResource** (single page via `GET /pages/{slug}`):
```typescript
{
  id: number
  slug: string
  categories: CategoryResource[]  // Nested with products
}
```

**CategoryResource**:
```typescript
{
  id: number
  name: string
  slug: string
  description: string | null
  order: number
  page_id: number  // Foreign key to Page
  products?: ProductResource[]  // when loaded
}
```

**Confirmed**:
- `GET /pages` returns **flat array** of `{ id, slug }` (no nested categories)
- `GET /pages/{slug}` returns **single page** with nested categories and products
- `GET /categories` returns **all categories** with `page_id` field
- **Implementation**: Fetch categories separately and filter client-side by `category.page_id`

### Debug Code Cleanup

**File**: `app/pages/admin/products/create.vue` line 23
```vue
<pre>{{ categoriesData }}</pre>  <!-- REMOVE THIS -->
```

Remove before production deployment (leftover debug code).

### Migration Path

**Phase 1**: Fix existing dropdowns (REQ-1, REQ-4, REQ-5)
- Minimal changes to restore functionality
- No new features, just bug fixes

**Phase 2**: Add page selector to create form (REQ-2)
- New UI field + filtering logic
- Does not affect existing products

**Phase 3**: Add page selector to edit form (REQ-3)
- More complex: handle existing products without page context
- Optional enhancement (can defer)

## Open Questions

1. ✅ **API Response Structure**: Confirmed from `docs/api-reference.md`:
   - `GET /categories` returns `Category[]` direct array (no wrapper)
   - `GET /pages` returns `PageData[]` direct array (no wrapper)
   - Bug is in type declaration or data access, not API

2. ✅ **Page Endpoint Availability**: Confirmed `GET /pages` exists and returns all pages

3. ✅ **Nested Data**: `GET /pages` returns flat array of `{ id, slug }`. Categories fetched separately via `GET /categories`. Each category has `page_id` field for filtering.

4. **Product Migration**: Existing products created without page context—how to handle in edit form?
   - **Solution**: Pre-select page based on product's category's `page_id`
   - **Fallback**: If category missing, show all categories (allow fixing data)

5. ✅ **Category Validation**: Backend enforces `category_id` must exist via validation rules (line 58 of API reference: `exists:categories`). Frontend filtering is UX enhancement only.

## Success Metrics

**Before Fix**:
- Dropdowns show 0 options (broken)
- Admin cannot create products
- Admin cannot filter product/gallery lists

**After Fix**:
- Dropdowns populate correctly (100% success rate)
- Product creation time reduced (no manual API calls)
- Category selection accuracy improved (scoped to page)
- Zero console errors related to dropdowns

**User Experience**:
- Admin can create product in < 30 seconds (down from manual workaround)
- Category misassignment reduced to 0% (was ~15% due to similar category names)
