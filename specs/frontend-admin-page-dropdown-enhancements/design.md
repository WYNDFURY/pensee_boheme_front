# Frontend Admin Page Dropdown Enhancements — Design

## Overview

Fix broken USelect dropdowns by correcting API response type handling, then add hierarchical page → category filtering to product forms. Root cause: inconsistent `ApiResponse<T>` wrapper usage when fetching categories. Solution: standardize all admin data fetching to use `useAdminApi().get<T>()` with correct unwrapping via `.value` (not `.value.data`).

**High-level approach**:
1. Fix existing dropdowns by correcting type declarations and data access patterns
2. Add page selection field to product create/edit forms
3. Implement client-side category filtering based on selected page
4. Maintain backward compatibility with existing products

**Key insight**: API returns direct arrays (`Category[]`, `PageData[]`) without wrapper, but code expects `ApiResponse<T>`. Fix by removing wrapper type or adjusting backend to wrap responses consistently.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Admin Product Create/Edit Flow                   │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   Component  │
│  Lifecycle   │
└──────┬───────┘
       │
       ├─────► onMounted / Setup
       │           │
       │           ├──► Fetch Pages (GET /pages)
       │           │      └──► pageOptions: { label, value }[]
       │           │
       │           └──► Fetch Categories (GET /categories)
       │                  └──► allCategories: Category[]
       │
       ├─────► User selects Page
       │           │
       │           └──► filteredCategoryOptions (computed)
       │                  └──► filter by category.page_id === selectedPage
       │
       ├─────► User selects Category
       │           │
       │           └──► state.category_id = selected value
       │
       └─────► User submits form
                   │
                   ├──► Zod validation (page_id + category_id)
                   │
                   └──► FormData submission
                          └──► api.upload('/products', formData)

┌─────────────────────────────────────────────────────────────────────┐
│                    Data Flow (Fixed Pattern)                         │
└─────────────────────────────────────────────────────────────────────┘

useAsyncData('categories', () => api.get<Category[]>('/categories'))
    │
    └──► { data: categoriesData, pending, error }
            │
            └──► categoriesData.value  ← Direct Category[] array
                    │
                    └──► categoryOptions = computed(() =>
                           categoriesData.value?.map(c => ({
                             label: c.name,
                             value: c.id
                           })) ?? []
                         )

┌─────────────────────────────────────────────────────────────────────┐
│              Page → Category Filtering (New Logic)                   │
└─────────────────────────────────────────────────────────────────────┘

Page Dropdown               Category Dropdown
     │                            │
     ├─ Univers Floral (id: 1)   │
     │                            ├─ Bouquets (page_id: 1)
     │                            ├─ Couronnes (page_id: 1)
     │                            └─ ...
     │
     ├─ Ateliers (id: 2)         │
     │                            ├─ Initiation (page_id: 2)
     │                            ├─ Perfectionnement (page_id: 2)
     │                            └─ ...
     │
     └─ Boutique (id: 3)         │
                                  ├─ Vases (page_id: 3)
                                  └─ Accessoires (page_id: 3)

selectedPage.value = 1
  ↓
filteredCategories = allCategories.filter(c => c.page_id === 1)
  ↓
categoryOptions = [
  { label: 'Bouquets', value: 10 },
  { label: 'Couronnes', value: 11 }
]
```

## Components and Interfaces

### 1. Fix Existing Dropdown Data Fetching

**Files to modify**:
- `app/pages/admin/products/create.vue`
- `app/pages/admin/products/[id]/edit.vue`
- `app/pages/admin/products/index.vue`

**Current (Broken)**:
```typescript
// products/create.vue - Line 138
const { data: categoriesData } = await useAsyncData('categories', () =>
  api.get<ApiResponse<Category[]>>('/categories')  // ← WRONG: No wrapper
)

const categoryOptions = computed(() => {
  return (categoriesData.value?.data ?? []).map(cat => ({  // ← Accessing .data
    label: cat.name,
    value: cat.id,
  }))
})
```

**Fixed (Version A - Remove Wrapper Type)**:
```typescript
// products/create.vue - CORRECTED
const { data: categoriesData } = await useAsyncData('categories', () =>
  api.get<Category[]>('/categories')  // ← Direct array, no wrapper
)

const categoryOptions = computed(() => {
  return (categoriesData.value ?? []).map(cat => ({  // ← Direct access
    label: cat.name,
    value: cat.id,
  }))
})
```

**Why this works**:
- API returns `Category[]` directly (confirmed in `docs/api-reference.md`)
- `useAsyncData` wraps response in `{ data: T }`
- Access via `categoriesData.value` gives `Category[]`
- No need for `.value.data` double unwrapping

**Alternative (Version B - Backend Adds Wrapper)**:
If backend changes to wrap in `{ data: [...] }`, keep existing code but verify unwrapping:
```typescript
const { data: categoriesData } = await useAsyncData('categories', () =>
  api.get<ApiResponse<Category[]>>('/categories')
)

// categoriesData.value is ApiResponse<Category[]>
// categoriesData.value.data is Category[]
const categoryOptions = computed(() => {
  return (categoriesData.value?.data ?? []).map(cat => ({
    label: cat.name,
    value: cat.id,
  }))
})
```

**Decision**: Use **Version A** (remove wrapper) to match current API behavior.

### 2. Add Page Selector to Product Create Form

**File**: `app/pages/admin/products/create.vue`

**Template Changes** (insert before category field):
```vue
<UFormField label="Page" name="page_id" required>
  <USelect
    v-model="state.page_id"
    :options="pageOptions"
    :loading="pagesPending"
    :disabled="pagesPending || pagesError"
    placeholder="Sélectionner une page (univers)"
  />
</UFormField>

<UFormField label="Catégorie" name="category_id" required>
  <USelect
    v-model="state.category_id"
    :options="filteredCategoryOptions"
    :loading="categoriesPending"
    :disabled="!state.page_id || categoriesPending || categoriesError"
    :placeholder="state.page_id ? 'Sélectionner une catégorie' : 'Sélectionner une page d\'abord'"
  />
</UFormField>
```

**Script Changes**:
```typescript
import type { Category, PageData } from '~/types/models'

// Fetch pages
const { data: pagesData, pending: pagesPending, error: pagesError } =
  await useAsyncData('pages', () => api.get<PageData[]>('/pages'))

// Fetch categories
const { data: categoriesData, pending: categoriesPending, error: categoriesError } =
  await useAsyncData('categories', () => api.get<Category[]>('/categories'))

// Page dropdown options
const pageOptions = computed(() => {
  return (pagesData.value ?? []).map(page => ({
    label: page.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    // Convert "univers-floral" → "Univers Floral"
    value: page.id,
  }))
})

// Filtered category options based on selected page
const filteredCategoryOptions = computed(() => {
  if (!state.value.page_id) return []

  return (categoriesData.value ?? [])
    .filter(cat => cat.page_id === state.value.page_id)
    .map(cat => ({
      label: cat.name,
      value: cat.id,
    }))
})

// Watch page selection - reset category when page changes
watch(() => state.value.page_id, (newPageId, oldPageId) => {
  if (newPageId !== oldPageId) {
    state.value.category_id = undefined  // Reset category
  }
})
```

**Zod Schema Update**:
```typescript
const schema = z.object({
  name: z.string().min(1, 'Nom requis'),
  slug: z.string().min(1, 'Slug requis'),
  description: z.string().optional(),
  page_id: z.number({ required_error: 'Page requise' }),  // ← NEW
  category_id: z.number({ required_error: 'Catégorie requise' }),
  has_price: z.boolean(),
  price: z.number().optional(),
  is_active: z.boolean(),
  image: z.any().optional(),
}).refine(
  (data) => {
    if (data.has_price && !data.price) return false
    return true
  },
  {
    message: 'Prix requis si "A un prix" est coché',
    path: ['price'],
  }
)
```

**State Update**:
```typescript
const state = ref<Partial<Schema>>({
  name: '',
  slug: '',
  description: '',
  page_id: undefined,      // ← NEW
  category_id: undefined,
  has_price: false,
  price: undefined,
  is_active: true,
})
```

**Form Submission** (no changes needed - `page_id` not sent to backend):
```typescript
// page_id is only used for frontend filtering
// Backend only receives category_id (which implicitly belongs to a page)
formData.append('category_id', String(event.data.category_id))
// Do NOT send page_id - it's not in the Product schema
```

### 3. Add Page Selector to Product Edit Form

**File**: `app/pages/admin/products/[id]/edit.vue`

**Additional Logic for Pre-filling**:
```typescript
// Fetch current product
const { data: productData, pending, error } = await useAsyncData(
  `product-edit-${productId}`,
  () => api.get<ProductResource>(`/products/${productId}`)
)

// Fetch pages and categories
const { data: pagesData } = await useAsyncData('pages', () =>
  api.get<PageData[]>('/pages')
)

const { data: categoriesData } = await useAsyncData('categories', () =>
  api.get<Category[]>('/categories')
)

// Derived page_id from current category
const currentPageId = computed(() => {
  const currentCategory = (categoriesData.value ?? []).find(
    cat => cat.id === state.value.category_id
  )
  return currentCategory?.page_id
})

// Watch product data and pre-fill form
watch(productData, (product) => {
  if (product) {
    // Find the category to get page_id
    const category = (categoriesData.value ?? []).find(
      cat => cat.id === product.category_id
    )

    state.value = {
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      page_id: category?.page_id,  // ← Pre-fill from category
      category_id: product.category_id,
      has_price: product.has_price,
      price: product.price || undefined,
      is_active: product.is_active,
    }
    existingImage.value = product.media?.[0] || null
  }
}, { immediate: true })
```

**Same template and filtering logic as create page.**

### 4. Update Product Index Filter Dropdowns

**File**: `app/pages/admin/products/index.vue`

**Current Issue**: Uses `useFetch` instead of `useAsyncData` + `useAdminApi`

**Fix**:
```typescript
// BEFORE (lines 191-201):
const { data: productsData, pending, error, refresh } = await useFetch<Product[]>(
  `${config.public.apiBaseUrl}/products`,
  {
    key: 'admin-products',
    headers: {
      Authorization: `Bearer ${token.value}`,
      Accept: 'application/json',
    },
    server: false,
  }
)

// AFTER:
const { data: productsData, pending, error, refresh } = await useAsyncData(
  'admin-products',
  () => api.get<Product[]>('/products')
)

// Same for categories:
const { data: categoriesData } = await useAsyncData(
  'admin-categories',
  () => api.get<Category[]>('/categories')
)
```

**Why this fixes dropdowns**:
- `useAdminApi()` properly handles auth token injection
- Consistent error handling (401 auto-logout)
- No manual header management
- Type-safe response structure

### 5. Remove Debug Code

**File**: `app/pages/admin/products/create.vue` line 23

**Remove**:
```vue
<pre>{{ categoriesData }}</pre>  <!-- DELETE THIS LINE -->
```

## Data Models

### Existing Types (No Changes)

From `app/types/models.ts`:

```typescript
export type PageData = {
  id: number
  slug: string
  categories?: Category[] | []
}

export type Category = {
  id: number
  name: string
  slug: string
  description: string
  order: number
  page_id: number  // Foreign key
  products?: Product[] | []
}

export type Product = {
  id: number
  name: string
  slug: string
  description: string
  price: number | null
  price_formatted: string | null
  is_active: boolean
  has_price: boolean
  category_id: number  // Foreign key (no direct page_id)
  media: Media[] | []
  options?: ProductOption[] | []
}

export type ApiResponse<T> = {
  data: T
}
```

**No type changes needed.** Existing types are correct.

### Form State Type (Inferred from Zod)

```typescript
// Zod schema defines the structure
type Schema = z.output<typeof schema>

// Form state is Partial<Schema> to allow undefined initial values
const state = ref<Partial<Schema>>({
  page_id: undefined,      // NEW: number | undefined
  category_id: undefined,  // number | undefined
  // ... other fields
})
```

### USelect Option Type

```typescript
// Inferred from USelect component props
type SelectOption = {
  label: string
  value: number | boolean | null
}

// Used in computed options:
const pageOptions = computed<SelectOption[]>(() => [...])
const filteredCategoryOptions = computed<SelectOption[]>(() => [...])
```

## Error Handling

### 1. API Fetch Errors

**Pattern** (from `useAdminApi.ts`):
- 401 Unauthorized → Auto-logout, redirect to `/admin/login`
- 422 Validation → Throw error to component (shows field errors)
- Others → Toast notification

**In Components**:
```typescript
const { data, pending, error } = await useAsyncData('key', () =>
  api.get<T>('/endpoint')
)

// Template shows error state:
<div v-if="error" class="text-error-600">
  <UIcon name="i-heroicons-exclamation-circle" />
  <p>Erreur lors du chargement des données</p>
</div>

// Disable dropdown on error:
<USelect :disabled="error || pending" ... />
```

### 2. Empty Category List for Page

**Scenario**: Selected page has no categories

**Handling**:
```typescript
const filteredCategoryOptions = computed(() => {
  if (!state.value.page_id) return []

  const filtered = (categoriesData.value ?? [])
    .filter(cat => cat.page_id === state.value.page_id)

  // Return empty array if no categories
  return filtered.map(cat => ({
    label: cat.name,
    value: cat.id,
  }))
})

// In template:
<USelect
  v-model="state.category_id"
  :options="filteredCategoryOptions"
  :placeholder="
    !state.page_id
      ? 'Sélectionner une page d\'abord'
      : filteredCategoryOptions.length === 0
        ? 'Aucune catégorie disponible pour cette page'
        : 'Sélectionner une catégorie'
  "
  :disabled="!state.page_id || filteredCategoryOptions.length === 0"
/>
```

### 3. Form Validation Errors

**Zod Validation** (handled by UForm):
```typescript
// If user tries to submit without selecting page:
{
  "page_id": ["Page requise"]
}

// If page selected but no category:
{
  "category_id": ["Catégorie requise"]
}

// UForm automatically displays field errors
```

**Backend Validation** (422 response):
```typescript
async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await api.upload('/products', formData, 'POST')
    // Success
  } catch (error: any) {
    // useAdminApi already shows toast for 422 errors
    // Field errors shown by UForm if available
  }
}
```

### 4. Missing page_id on Existing Products (Edit Page)

**Scenario**: Old product has category without clear page association

**Fallback**:
```typescript
const currentPageId = computed(() => {
  const currentCategory = (categoriesData.value ?? []).find(
    cat => cat.id === state.value.category_id
  )
  return currentCategory?.page_id ?? null
})

// If page_id is null, show all categories (graceful degradation):
const filteredCategoryOptions = computed(() => {
  if (!state.value.page_id) {
    // Show all categories if page not selected
    return (categoriesData.value ?? []).map(cat => ({
      label: cat.name,
      value: cat.id,
    }))
  }

  // Normal filtering
  return (categoriesData.value ?? [])
    .filter(cat => cat.page_id === state.value.page_id)
    .map(cat => ({ label: cat.name, value: cat.id }))
})
```

## Testing Strategy

### Unit Tests (Vitest)

**File**: `app/composables/__tests__/useAdminApi.spec.ts`

```typescript
describe('useAdminApi', () => {
  it('should fetch categories without wrapper', async () => {
    const api = useAdminApi()
    const categories = await api.get<Category[]>('/categories')

    expect(Array.isArray(categories)).toBe(true)
    expect(categories[0]).toHaveProperty('page_id')
  })

  it('should fetch pages as direct array', async () => {
    const api = useAdminApi()
    const pages = await api.get<PageData[]>('/pages')

    expect(Array.isArray(pages)).toBe(true)
    expect(pages[0]).toHaveProperty('slug')
  })
})
```

**Computed Property Tests**:
```typescript
describe('Category Filtering', () => {
  it('should filter categories by page_id', () => {
    const allCategories = [
      { id: 1, name: 'Cat1', page_id: 1 },
      { id: 2, name: 'Cat2', page_id: 1 },
      { id: 3, name: 'Cat3', page_id: 2 },
    ]

    const selectedPageId = 1
    const filtered = allCategories.filter(c => c.page_id === selectedPageId)

    expect(filtered).toHaveLength(2)
    expect(filtered.map(c => c.id)).toEqual([1, 2])
  })

  it('should return empty array if no page selected', () => {
    const selectedPageId = undefined
    const filtered = selectedPageId
      ? allCategories.filter(c => c.page_id === selectedPageId)
      : []

    expect(filtered).toHaveLength(0)
  })
})
```

### Component Tests (Vitest + Testing Library)

**Test Dropdown Population**:
```typescript
import { mount } from '@vue/test-utils'
import ProductCreate from '~/pages/admin/products/create.vue'

describe('ProductCreate', () => {
  it('should populate page dropdown on mount', async () => {
    const wrapper = mount(ProductCreate)

    await wrapper.vm.$nextTick()

    const pageSelect = wrapper.find('[name="page_id"]')
    expect(pageSelect.exists()).toBe(true)
    // Check options populated
  })

  it('should disable category dropdown until page selected', async () => {
    const wrapper = mount(ProductCreate)

    const categorySelect = wrapper.find('[name="category_id"]')
    expect(categorySelect.attributes('disabled')).toBe('true')

    // Select a page
    await wrapper.vm.state.page_id = 1
    await wrapper.vm.$nextTick()

    expect(categorySelect.attributes('disabled')).toBeFalsy()
  })

  it('should reset category when page changes', async () => {
    const wrapper = mount(ProductCreate)

    wrapper.vm.state.page_id = 1
    wrapper.vm.state.category_id = 10

    await wrapper.vm.$nextTick()

    // Change page
    wrapper.vm.state.page_id = 2

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.state.category_id).toBeUndefined()
  })
})
```

### Integration Tests

**End-to-End Flow**:
1. Navigate to `/admin/products/create`
2. Verify page dropdown shows options
3. Select a page
4. Verify category dropdown enables and shows filtered categories
5. Select a category
6. Fill other fields
7. Submit form
8. Verify product created with correct `category_id`

**API Integration**:
- Mock `/pages` endpoint to return test data
- Mock `/categories` endpoint with various `page_id` values
- Verify filtering logic produces correct results

### Manual Testing Checklist

**Product Create Page**:
- [ ] Page dropdown populates on load
- [ ] Category dropdown disabled until page selected
- [ ] Selecting page enables category dropdown
- [ ] Only categories for selected page shown
- [ ] Changing page resets category selection
- [ ] Form submission works with page + category
- [ ] Validation errors show for missing page/category

**Product Edit Page**:
- [ ] Page pre-filled from existing product's category
- [ ] Category pre-filled correctly
- [ ] Changing page shows new categories
- [ ] Cannot submit with category from different page
- [ ] Updating product preserves category correctly

**Product Index Filters**:
- [ ] Category filter dropdown shows all categories
- [ ] Status filter dropdown shows Active/Inactive
- [ ] Filters work correctly (products filtered)
- [ ] No console errors

**Gallery Index Filters**:
- [ ] Published status filter works
- [ ] No console errors

## Performance Considerations

### Data Fetching Optimization

**Parallel Fetching**:
```typescript
// Fetch pages and categories in parallel (not sequential)
const [
  { data: pagesData, pending: pagesPending },
  { data: categoriesData, pending: categoriesPending }
] = await Promise.all([
  useAsyncData('pages', () => api.get<PageData[]>('/pages')),
  useAsyncData('categories', () => api.get<Category[]>('/categories'))
])

// OR use await for each (Nuxt handles parallel execution):
const { data: pagesData } = await useAsyncData('pages', () =>
  api.get<PageData[]>('/pages')
)
const { data: categoriesData } = await useAsyncData('categories', () =>
  api.get<Category[]>('/categories')
)
```

**Caching with useAsyncData**:
- Key `'pages'` and `'categories'` shared across create/edit pages
- Data fetched once, reused on navigation
- Reduces API calls when switching between admin pages

**Expected API Calls**:
- First visit to create page: 2 API calls (pages + categories)
- Navigate to edit page: 1 API call (product only, pages/categories cached)
- Navigate back to create: 0 new API calls (all cached)

### Client-Side Filtering

**Why filter client-side, not server-side**:
- Total categories typically < 50 (small dataset)
- Filtering is O(n) and completes in < 1ms
- Avoids additional API roundtrip (faster UX)
- Simpler implementation (no new endpoint needed)

**Computed Performance**:
```typescript
// Computed properties auto-cache results
// Only re-runs when dependencies change (state.page_id or categoriesData)
const filteredCategoryOptions = computed(() => {
  if (!state.value.page_id) return []

  return (categoriesData.value ?? [])
    .filter(cat => cat.page_id === state.value.page_id)  // O(n), fast for small n
    .map(cat => ({ label: cat.name, value: cat.id }))
})
```

**Benchmark** (estimated):
- 50 categories: < 1ms to filter
- 100 categories: < 2ms to filter
- 1000 categories: ~10ms to filter (still acceptable)

### Dropdown Rendering

**USelect Performance**:
- Nuxt UI v3 USelect uses virtual scrolling for large lists
- Rendering 50 options: ~5ms
- No performance concerns for typical category counts

**Optimization (if needed)**:
```typescript
// Lazy-load categories only when page dropdown opens
const categoriesLoaded = ref(false)

function onPageDropdownOpen() {
  if (!categoriesLoaded.value) {
    // Fetch categories on first interaction
    categoriesLoaded.value = true
  }
}
```

**Not needed for current scale** (< 100 categories).

## Security Considerations

### Authentication

**All admin API calls protected**:
- `useAdminApi()` injects `Authorization: Bearer ${token}` header
- Backend validates token on every request (Laravel Sanctum)
- 401 response → Auto-logout + redirect

**Token Storage**:
- Stored in localStorage (acceptable for admin-only app)
- Token rehydrated on page load via `onMounted` in `useAuth()`
- SSR: false for all admin pages (no server-side token exposure)

### Authorization

**Backend Validation**:
- All admin endpoints require `auth:sanctum` middleware
- Only authenticated admins can create/edit products
- No client-side authorization checks (rely on backend)

### Input Validation

**Client-Side (Zod)**:
```typescript
z.object({
  page_id: z.number(),      // Must be number
  category_id: z.number(),  // Must be number
  // ...
})
```

**Server-Side (Laravel)**:
```php
'category_id' => 'required|integer|exists:categories,id'
```

**Important**: Backend must verify `category_id` exists and is active. Frontend filtering is UX enhancement only, not security boundary.

### XSS Prevention

**Data Display**:
- All user input escaped by Vue templates
- No `v-html` or `dangerouslySetInnerHTML`
- Category names, page slugs rendered safely

**File Uploads**:
- Backend validates MIME types and file extensions
- Max size: 10MB (enforced client + server)
- Files stored with sanitized names

### CSRF Protection

**Not needed for SPA**:
- API uses Bearer token authentication (not cookies)
- Laravel Sanctum handles token validation
- No CSRF tokens required

## Monitoring and Observability

### Error Tracking

**API Errors**:
```typescript
// useAdminApi already logs errors to console
// Add Sentry integration:
try {
  await api.get<T>('/endpoint')
} catch (error) {
  console.error('[API Error]', error)
  // Sentry.captureException(error)
}
```

**Dropdown Population Failures**:
```typescript
const { data, error } = await useAsyncData('categories', () =>
  api.get<Category[]>('/categories')
)

if (error.value) {
  console.error('[Dropdown Error] Failed to load categories', error.value)
  // Track in analytics
}
```

### Performance Monitoring

**API Response Times**:
```typescript
// Track slow API calls
const start = performance.now()
const data = await api.get<T>('/endpoint')
const duration = performance.now() - start

if (duration > 1000) {  // > 1 second
  console.warn(`[Slow API] /endpoint took ${duration}ms`)
  // Send to monitoring service
}
```

**Dropdown Render Times**:
```typescript
// Measure computed property execution
const start = performance.now()
const options = filteredCategoryOptions.value
const duration = performance.now() - start

if (duration > 10) {  // > 10ms
  console.warn(`[Slow Computed] Category filtering took ${duration}ms`)
}
```

### User Actions

**Track Dropdown Interactions**:
```typescript
function onPageSelected(pageId: number) {
  state.value.page_id = pageId

  // Analytics
  // window.plausible?.('Admin: Page Selected', { props: { pageId } })
}

function onCategorySelected(categoryId: number) {
  state.value.category_id = categoryId

  // Analytics
  // window.plausible?.('Admin: Category Selected', { props: { categoryId } })
}
```

**Track Form Submissions**:
```typescript
async function onSubmit(event: FormSubmitEvent<Schema>) {
  const start = performance.now()

  try {
    await api.upload('/products', formData, 'POST')
    const duration = performance.now() - start

    // Success metric
    // window.plausible?.('Admin: Product Created', {
    //   props: { duration, pageId: event.data.page_id }
    // })
  } catch (error) {
    // Error metric
    // window.plausible?.('Admin: Product Create Failed', {
    //   props: { error: error.message }
    // })
  }
}
```

### Health Checks

**Verify Dropdown Data on Mount**:
```typescript
onMounted(() => {
  // Check if dropdowns populated
  const hasPages = (pagesData.value ?? []).length > 0
  const hasCategories = (categoriesData.value ?? []).length > 0

  if (!hasPages) {
    console.warn('[Health Check] No pages loaded')
  }

  if (!hasCategories) {
    console.warn('[Health Check] No categories loaded')
  }
})
```

**Dashboard Metrics** (future):
- Admin actions per day
- Average product creation time
- Dropdown load failures
- Most common category selections

## Implementation Phases

### Phase 1: Fix Existing Dropdowns (Priority: Critical)

**Goal**: Restore functionality to broken dropdowns

**Changes**:
1. Remove `ApiResponse<T>` wrapper from `/categories` and `/pages` fetch calls
2. Update data access from `.value?.data` to `.value`
3. Remove debug `<pre>` tag from create page
4. Update product index to use `useAdminApi()` instead of `useFetch`

**Files**:
- `app/pages/admin/products/create.vue`
- `app/pages/admin/products/[id]/edit.vue`
- `app/pages/admin/products/index.vue`

**Testing**:
- Manual test: All dropdowns populate correctly
- No console errors
- Category selection works in create/edit/index pages

**Estimated Impact**: Immediate bug fix, admin can create products again

### Phase 2: Add Page Selector to Create Form (Priority: High)

**Goal**: Add hierarchical page → category selection

**Changes**:
1. Fetch pages data
2. Add page dropdown field
3. Add filtered category options computed property
4. Add watch for page changes (reset category)
5. Update Zod schema
6. Update form state

**Files**:
- `app/pages/admin/products/create.vue`

**Testing**:
- Page dropdown shows all pages
- Category dropdown filters by page
- Changing page resets category
- Form submission works

**Estimated Impact**: Improved UX, reduces category selection errors

### Phase 3: Add Page Selector to Edit Form (Priority: Medium)

**Goal**: Extend page selector to edit workflow

**Changes**:
1. Same as Phase 2, but with pre-filling logic
2. Derive page_id from existing product's category

**Files**:
- `app/pages/admin/products/[id]/edit.vue`

**Testing**:
- Page pre-fills correctly
- Category pre-fills correctly
- Changing page works
- Update preserves data

**Estimated Impact**: Consistent UX across create/edit

### Phase 4: Cleanup and Polish (Priority: Low)

**Goal**: Remove unnecessary code, add helpful UI enhancements

**Changes**:
1. Add category count to page dropdown labels: "Univers Floral (12)"
2. Add loading skeletons for dropdowns
3. Add error recovery (retry button)
4. Improve validation error messages

**Files**:
- All admin product pages

**Testing**:
- Manual UX review
- Accessibility audit

**Estimated Impact**: Better UX, fewer support requests
