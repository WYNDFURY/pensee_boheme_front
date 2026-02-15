# Frontend Admin Page Dropdown Enhancements — Implementation Tasks

## Phase 1: Fix Existing Dropdown Data Fetching (Critical)

**Goal**: Restore functionality to all broken admin dropdowns by correcting API response type handling.

**Target**: All category and status dropdowns populate correctly on products create, edit, and index pages.

**User Verification**: Navigate to `/admin/products/create` and verify category dropdown shows options.

### Task 1.1: Fix Product Create Page Category Dropdown

**File**: `app/pages/admin/products/create.vue`

**Changes**:

1. **Line 138-139**: Remove `ApiResponse<T>` wrapper from categories fetch
   ```typescript
   // BEFORE:
   const { data: categoriesData } = await useAsyncData('categories', () =>
     api.get<ApiResponse<Category[]>>('/categories')
   )

   // AFTER:
   const { data: categoriesData } = await useAsyncData('categories', () =>
     api.get<Category[]>('/categories')
   )
   ```

2. **Line 141-146**: Update category options computed to access data directly
   ```typescript
   // BEFORE:
   const categoryOptions = computed(() => {
     return (categoriesData.value?.data ?? []).map(cat => ({
       label: cat.name,
       value: cat.id,
     }))
   })

   // AFTER:
   const categoryOptions = computed(() => {
     return (categoriesData.value ?? []).map(cat => ({
       label: cat.name,
       value: cat.id,
     }))
   })
   ```

3. **Line 23**: Remove debug `<pre>{{ categoriesData }}</pre>` tag

**Validation**:
- Save file and check dev server for no TypeScript errors
- Navigate to `/admin/products/create` in browser
- Category dropdown shows list of categories
- No console errors

---

### Task 1.2: Fix Product Edit Page Category Dropdown

**File**: `app/pages/admin/products/[id]/edit.vue`

**Changes**:

1. **Line 175-182**: Update categories fetch (same pattern as Task 1.1)
   ```typescript
   // BEFORE:
   const { data: categoriesData } = await useAsyncData('categories', () =>
     api.get<ApiResponse<Category[]>>('/categories')
   )

   // AFTER:
   const { data: categoriesData } = await useAsyncData('categories', () =>
     api.get<Category[]>('/categories')
   )
   ```

2. **Line 184-189**: Update categoryOptions computed property
   ```typescript
   // BEFORE:
   const categoryOptions = computed(() => {
     return (categoriesData.value?.data ?? []).map(cat => ({
       label: cat.name,
       value: cat.id,
     }))
   })

   // AFTER:
   const categoryOptions = computed(() => {
     return (categoriesData.value ?? []).map(cat => ({
       label: cat.name,
       value: cat.id,
     }))
   })
   ```

**Validation**:
- Navigate to `/admin/products/{id}/edit` for existing product
- Category dropdown shows list of categories
- Pre-selected category displays correctly
- No console errors

---

### Task 1.3: Fix Product Index Filter Dropdowns

**File**: `app/pages/admin/products/index.vue`

**Changes**:

1. **Line 191-201**: Replace `useFetch` with `useAsyncData` + `useAdminApi`
   ```typescript
   // BEFORE:
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
   const api = useAdminApi()
   const { data: productsData, pending, error, refresh } = await useAsyncData(
     'admin-products',
     () => api.get<Product[]>('/products')
   )
   ```

2. **Line 203-213**: Replace categories fetch with `useAdminApi`
   ```typescript
   // BEFORE:
   const { data: categoriesData } = await useFetch<Category[]>(
     `${config.public.apiBaseUrl}/categories`,
     {
       key: 'admin-categories',
       headers: {
         Authorization: `Bearer ${token.value}`,
         Accept: 'application/json',
       },
       server: false,
     }
   )

   // AFTER:
   const { data: categoriesData } = await useAsyncData(
     'admin-categories',
     () => api.get<Category[]>('/categories')
   )
   ```

3. **Line 164**: Remove import of `useRuntimeConfig` (no longer needed)
   ```typescript
   // BEFORE:
   import type { Product, Category } from '~/types/models'

   definePageMeta({
     layout: 'admin',
     ssr: false,
   })

   const { token } = useAuth()
   const config = useRuntimeConfig()
   const api = useAdminApi()
   const toast = useToast()

   // AFTER:
   import type { Product, Category } from '~/types/models'

   definePageMeta({
     layout: 'admin',
     ssr: false,
   })

   const api = useAdminApi()
   const toast = useToast()
   ```

4. **Line 171**: Remove `token` usage (now handled by `useAdminApi`)

**Validation**:
- Navigate to `/admin/products`
- Category filter dropdown shows all categories
- Status filter dropdown shows Active/Inactive options
- Selecting filters updates the product list correctly
- No console errors

---

### Task 1.4: Verify Gallery Index Filters (No Changes Expected)

**File**: `app/pages/admin/galleries/index.vue`

**Action**: Manual test only - no code changes expected.

**Validation**:
- Navigate to `/admin/galleries`
- Published status filter dropdown shows "Publié" / "Non publié" options
- Selecting filter updates the gallery list correctly
- No console errors

---

## Phase 2: Add Page Selector to Product Create Form

**Goal**: Implement hierarchical page → category filtering on product creation.

**Target**: Admin can select a page, then see only categories belonging to that page.

**User Verification**:
1. Navigate to `/admin/products/create`
2. Select "Univers Floral" from Page dropdown
3. Category dropdown shows only categories for Univers Floral
4. Change to "Ateliers" - category dropdown updates with new filtered list

---

### Task 2.1: Fetch Pages Data

**File**: `app/pages/admin/products/create.vue`

**Changes**:

1. **After line 91**: Add PageData import
   ```typescript
   // BEFORE:
   import type { Category, ApiResponse } from '~/types/models'

   // AFTER:
   import type { Category, PageData } from '~/types/models'
   ```

2. **After categories fetch (~line 145)**: Add pages data fetch
   ```typescript
   // Fetch pages
   const { data: pagesData, pending: pagesPending, error: pagesError } =
     await useAsyncData('pages', () => api.get<PageData[]>('/pages'))
   ```

**Validation**:
- Check dev server - no TypeScript errors
- Add temporary debug: `console.log('Pages:', pagesData.value)`
- Verify pages data loaded in console

---

### Task 2.2: Create Page Dropdown Options Computed

**File**: `app/pages/admin/products/create.vue`

**Changes**:

1. **After pagesData fetch**: Add computed property for page options
   ```typescript
   // Page dropdown options
   const pageOptions = computed(() => {
     return (pagesData.value ?? []).map(page => ({
       label: page.slug
         .split('-')
         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
         .join(' '),
       // Converts "univers-floral" → "Univers Floral"
       value: page.id,
     }))
   })
   ```

**Validation**:
- Add debug: `console.log('Page options:', pageOptions.value)`
- Verify page options formatted correctly (capitalized, spaces)

---

### Task 2.3: Update Zod Schema to Include page_id

**File**: `app/pages/admin/products/create.vue`

**Changes**:

1. **Line 101-119**: Add `page_id` field to schema
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

**Validation**:
- TypeScript error if schema type mismatch
- No compilation errors

---

### Task 2.4: Update Form State to Include page_id

**File**: `app/pages/admin/products/create.vue`

**Changes**:

1. **Line 123-131**: Add `page_id` to initial state
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

**Validation**:
- TypeScript error if type mismatch
- No compilation errors

---

### Task 2.5: Add Filtered Category Options Computed

**File**: `app/pages/admin/products/create.vue`

**Changes**:

1. **Replace existing categoryOptions computed (~line 141-146)**: Add filtering logic
   ```typescript
   // Filtered category options based on selected page
   const filteredCategoryOptions = computed(() => {
     // If no page selected, show empty array (force page selection first)
     if (!state.value.page_id) return []

     return (categoriesData.value ?? [])
       .filter(cat => cat.page_id === state.value.page_id)
       .map(cat => ({
         label: cat.name,
         value: cat.id,
       }))
   })
   ```

**Validation**:
- Add debug: `console.log('Filtered categories:', filteredCategoryOptions.value)`
- Manually set `state.value.page_id = 1` in console
- Verify filtered categories update

---

### Task 2.6: Add Watch for Page Changes

**File**: `app/pages/admin/products/create.vue`

**Changes**:

1. **After filteredCategoryOptions computed**: Add watcher to reset category
   ```typescript
   // Watch page selection - reset category when page changes
   watch(
     () => state.value.page_id,
     (newPageId, oldPageId) => {
       // Reset category selection when page changes
       if (newPageId !== oldPageId && oldPageId !== undefined) {
         state.value.category_id = undefined
       }
     }
   )
   ```

**Validation**:
- Set page_id in browser console
- Set category_id in browser console
- Change page_id - verify category_id resets to undefined

---

### Task 2.7: Add Page Dropdown to Template

**File**: `app/pages/admin/products/create.vue`

**Changes**:

1. **After description field (~line 30), before category field**: Insert page field
   ```vue
   <UFormField label="Page (Univers)" name="page_id" required>
     <USelect
       v-model="state.page_id"
       :options="pageOptions"
       :loading="pagesPending"
       :disabled="pagesPending || pagesError"
       placeholder="Sélectionner un univers"
     />
   </UFormField>
   ```

**Validation**:
- Page dropdown appears in form
- Shows loading state while fetching
- Populates with page options
- Selecting a page updates `state.page_id`

---

### Task 2.8: Update Category Dropdown to Use Filtered Options

**File**: `app/pages/admin/products/create.vue`

**Changes**:

1. **Update existing category field (~line 33-38)**: Use filtered options and conditional placeholder
   ```vue
   <UFormField label="Catégorie" name="category_id" required>
     <USelect
       v-model="state.category_id"
       :options="filteredCategoryOptions"
       :loading="categoriesPending"
       :disabled="!state.page_id || categoriesPending || categoriesError"
       :placeholder="
         !state.page_id
           ? 'Sélectionner une page d\'abord'
           : filteredCategoryOptions.length === 0
             ? 'Aucune catégorie disponible'
             : 'Sélectionner une catégorie'
       "
     />
   </UFormField>
   ```

**Validation**:
- Category dropdown disabled until page selected
- Placeholder shows "Sélectionner une page d'abord" when no page
- Selecting page enables dropdown
- Dropdown shows only categories for selected page
- Changing page updates category list

---

### Task 2.9: Verify Form Submission (No Changes)

**File**: `app/pages/admin/products/create.vue`

**Action**: Manual test - form submission should work without changes (page_id not sent to backend).

**Validation**:
1. Fill all form fields including page and category
2. Submit form
3. Verify product created successfully
4. Check product in database - has correct `category_id`
5. Category implicitly belongs to the selected page (via `category.page_id`)

---

## Phase 3: Add Page Selector to Product Edit Form

**Goal**: Extend page selector functionality to product edit workflow with pre-filling logic.

**Target**: Edit page shows current product's page (derived from category), allows changing page/category.

**User Verification**:
1. Navigate to `/admin/products/{id}/edit` for existing product
2. Page dropdown pre-filled with correct page (from product's category)
3. Category dropdown pre-filled with product's category
4. Can change page - category list updates

---

### Task 3.1: Add Pages Data Fetch to Edit Page

**File**: `app/pages/admin/products/[id]/edit.vue`

**Changes**:

1. **Line 120**: Add PageData import
   ```typescript
   // BEFORE:
   import type { FormSubmitEvent } from '@nuxt/ui'
   import type { Product, Category, ApiResponse, Media } from '~/types/models'

   // AFTER:
   import type { FormSubmitEvent } from '@nuxt/ui'
   import type { Product, Category, PageData, ApiResponse, Media } from '~/types/models'
   ```

2. **After categories fetch (~line 180)**: Add pages fetch
   ```typescript
   // Fetch pages
   const { data: pagesData, pending: pagesPending, error: pagesError } =
     await useAsyncData('pages', () => api.get<PageData[]>('/pages'))
   ```

**Validation**:
- No TypeScript errors
- Pages data loads on edit page mount

---

### Task 3.2: Add Page Options and Filtered Categories (Same as Create)

**File**: `app/pages/admin/products/[id]/edit.vue`

**Changes**:

1. **After pagesData fetch**: Add computed properties (same as create page)
   ```typescript
   // Page dropdown options
   const pageOptions = computed(() => {
     return (pagesData.value ?? []).map(page => ({
       label: page.slug
         .split('-')
         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
         .join(' '),
       value: page.id,
     }))
   })

   // Filtered category options based on selected page
   const filteredCategoryOptions = computed(() => {
     if (!state.value.page_id) {
       // If no page selected, show all categories (for backward compat)
       return (categoriesData.value ?? []).map(cat => ({
         label: cat.name,
         value: cat.id,
       }))
     }

     return (categoriesData.value ?? [])
       .filter(cat => cat.page_id === state.value.page_id)
       .map(cat => ({
         label: cat.name,
         value: cat.id,
       }))
   })

   // Watch page selection - reset category when page changes
   watch(
     () => state.value.page_id,
     (newPageId, oldPageId) => {
       if (newPageId !== oldPageId && oldPageId !== undefined) {
         state.value.category_id = undefined
       }
     }
   )
   ```

**Validation**:
- Same as create page validation

---

### Task 3.3: Update Zod Schema (Same as Create)

**File**: `app/pages/admin/products/[id]/edit.vue`

**Changes**:

1. **Line 138-156**: Add `page_id` to schema (same as create)
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

**Validation**:
- No TypeScript errors

---

### Task 3.4: Update Form State (Same as Create)

**File**: `app/pages/admin/products/[id]/edit.vue`

**Changes**:

1. **Line 160-168**: Add `page_id` to state
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

**Validation**:
- No TypeScript errors

---

### Task 3.5: Update Watch to Pre-fill page_id from Category

**File**: `app/pages/admin/products/[id]/edit.vue`

**Changes**:

1. **Update existing watch (~line 192-206)**: Add page_id derivation
   ```typescript
   // BEFORE:
   watch(productData, (response) => {
     if (response?.data) {
       const product = response.data
       state.value = {
         name: product.name,
         slug: product.slug,
         description: product.description || '',
         category_id: product.category_id,
         has_price: product.has_price,
         price: product.price || undefined,
         is_active: product.is_active,
       }
       existingImage.value = product.media?.[0] || null
     }
   }, { immediate: true })

   // AFTER:
   watch(productData, (response) => {
     if (response?.data) {
       const product = response.data

       // Find the category to get page_id
       const category = (categoriesData.value ?? []).find(
         cat => cat.id === product.category_id
       )

       state.value = {
         name: product.name,
         slug: product.slug,
         description: product.description || '',
         page_id: category?.page_id,  // ← NEW: Derive from category
         category_id: product.category_id,
         has_price: product.has_price,
         price: product.price || undefined,
         is_active: product.is_active,
       }
       existingImage.value = product.media?.[0] || null
     }
   }, { immediate: true })
   ```

**Validation**:
- Load edit page for existing product
- Check `state.page_id` in Vue DevTools
- Verify it matches product's category's page_id

---

### Task 3.6: Add Page Dropdown to Edit Template

**File**: `app/pages/admin/products/[id]/edit.vue`

**Changes**:

1. **After description field (~line 30), before category field**: Insert page field (same as create)
   ```vue
   <UFormField label="Page (Univers)" name="page_id" required>
     <USelect
       v-model="state.page_id"
       :options="pageOptions"
       :loading="pagesPending"
       :disabled="pagesPending || pagesError"
       placeholder="Sélectionner un univers"
     />
   </UFormField>
   ```

**Validation**:
- Page dropdown appears
- Pre-fills with correct page on load
- Can be changed

---

### Task 3.7: Update Category Dropdown (Same as Create)

**File**: `app/pages/admin/products/[id]/edit.vue`

**Changes**:

1. **Update category field (~line 33-38)**: Use filtered options (same as create)
   ```vue
   <UFormField label="Catégorie" name="category_id" required>
     <USelect
       v-model="state.category_id"
       :options="filteredCategoryOptions"
       :loading="categoriesPending"
       :disabled="!state.page_id || categoriesPending || categoriesError"
       :placeholder="
         !state.page_id
           ? 'Sélectionner une page d\'abord'
           : filteredCategoryOptions.length === 0
             ? 'Aucune catégorie disponible'
             : 'Sélectionner une catégorie'
       "
     />
   </UFormField>
   ```

**Validation**:
- Category dropdown pre-fills on load
- Changing page updates category list
- Form validation works correctly

---

## Phase 4: Integration Testing and Validation

**Goal**: Comprehensive testing across all admin pages to ensure dropdowns work correctly.

**Target**: Zero console errors, all dropdowns functional, smooth UX.

**User Verification**: Admin can successfully create/edit products and use all filter dropdowns.

---

### Task 4.1: Manual End-to-End Testing - Product Create

**Test Cases**:

1. **Happy Path**:
   - [ ] Navigate to `/admin/products/create`
   - [ ] Page dropdown shows options (e.g., "Univers Floral", "Ateliers")
   - [ ] Category dropdown disabled with message "Sélectionner une page d'abord"
   - [ ] Select "Univers Floral" from page dropdown
   - [ ] Category dropdown enables
   - [ ] Category dropdown shows only categories with `page_id` matching Univers Floral
   - [ ] Select a category
   - [ ] Fill name, slug, and other fields
   - [ ] Submit form
   - [ ] Product created successfully
   - [ ] Redirects to product index
   - [ ] New product appears in list with correct category

2. **Page Change Scenario**:
   - [ ] Navigate to create page
   - [ ] Select "Univers Floral"
   - [ ] Select category "Bouquets"
   - [ ] Change page to "Ateliers"
   - [ ] Category selection resets to empty
   - [ ] Category dropdown shows only "Ateliers" categories
   - [ ] Can select new category from filtered list

3. **Validation Errors**:
   - [ ] Try to submit without selecting page → Error: "Page requise"
   - [ ] Select page, try to submit without category → Error: "Catégorie requise"
   - [ ] Error messages display correctly under fields

4. **Loading States**:
   - [ ] On slow network, dropdowns show loading spinner
   - [ ] Dropdowns disabled during loading
   - [ ] Dropdowns enable after data loads

5. **Error States**:
   - [ ] If pages fetch fails, dropdown shows error state
   - [ ] If categories fetch fails, dropdown shows error state
   - [ ] Error messages are user-friendly

---

### Task 4.2: Manual End-to-End Testing - Product Edit

**Test Cases**:

1. **Pre-fill Scenario**:
   - [ ] Navigate to `/admin/products/{id}/edit` for existing product
   - [ ] Page dropdown pre-filled with correct page (derived from category)
   - [ ] Category dropdown pre-filled with product's current category
   - [ ] Can change page, category list updates
   - [ ] Can change category
   - [ ] Submit updates successfully
   - [ ] Product updated in database with new category

2. **Backward Compatibility**:
   - [ ] Edit page works even if product's category has no clear page association
   - [ ] Falls back to showing all categories if page_id missing

3. **Form State Preservation**:
   - [ ] Changing page doesn't lose other form field values
   - [ ] Image upload state preserved when changing page
   - [ ] Validation errors persist correctly

---

### Task 4.3: Manual End-to-End Testing - Product Index Filters

**Test Cases**:

1. **Filter Functionality**:
   - [ ] Navigate to `/admin/products`
   - [ ] Category filter dropdown shows all categories (not filtered by page)
   - [ ] Status filter dropdown shows "Actif" / "Inactif"
   - [ ] Select category → products filtered correctly
   - [ ] Select status → products filtered correctly
   - [ ] Select both filters → products match both criteria
   - [ ] Clear filters → all products shown

2. **Search + Filter Combination**:
   - [ ] Use search box + category filter together
   - [ ] Results match both search and filter criteria

---

### Task 4.4: Manual End-to-End Testing - Gallery Index Filters

**Test Cases**:

1. **Published Filter**:
   - [ ] Navigate to `/admin/galleries`
   - [ ] Published filter dropdown shows options
   - [ ] Selecting "Publié" shows only published galleries
   - [ ] Selecting "Non publié" shows only unpublished galleries
   - [ ] No console errors

---

### Task 4.5: Browser Console Error Check

**Test Cases**:

1. **All Admin Pages**:
   - [ ] Navigate to each admin page
   - [ ] Check browser console for errors
   - [ ] Check browser console for warnings
   - [ ] No 404 errors for API endpoints
   - [ ] No TypeScript type errors
   - [ ] No Vue warnings

2. **Network Tab Verification**:
   - [ ] `/api/pages` returns 200 with array of pages
   - [ ] `/api/categories` returns 200 with array of categories
   - [ ] `/api/products` returns 200 with array of products
   - [ ] No unnecessary duplicate API calls
   - [ ] Cached requests use 304 Not Modified

---

### Task 4.6: Cross-Browser Testing

**Test Cases**:

1. **Chrome/Edge** (Chromium):
   - [ ] All dropdowns work
   - [ ] Form submission works
   - [ ] No console errors

2. **Firefox**:
   - [ ] All dropdowns work
   - [ ] Form submission works
   - [ ] No console errors

3. **Safari** (if available):
   - [ ] All dropdowns work
   - [ ] Form submission works
   - [ ] No console errors

---

### Task 4.7: Performance Validation

**Test Cases**:

1. **Initial Load Time**:
   - [ ] Product create page loads in < 2 seconds
   - [ ] Dropdowns populate in < 500ms after data fetch
   - [ ] No noticeable UI lag when selecting page

2. **Filtering Performance**:
   - [ ] Changing page updates category dropdown instantly (< 100ms)
   - [ ] No lag with 50+ categories
   - [ ] Computed properties don't cause performance issues

3. **Memory Leaks**:
   - [ ] Navigate between create/edit pages multiple times
   - [ ] Check browser memory usage (DevTools Performance tab)
   - [ ] No memory leaks from watchers or computed properties

---

### Task 4.8: Accessibility Audit

**Test Cases**:

1. **Keyboard Navigation**:
   - [ ] Can tab through all form fields in correct order
   - [ ] Page dropdown, then category dropdown
   - [ ] Can select options with Enter key
   - [ ] Can close dropdown with Escape key

2. **Screen Reader**:
   - [ ] Labels properly associated with dropdowns
   - [ ] Required fields announced
   - [ ] Error messages announced
   - [ ] Placeholder text read correctly

3. **Focus Management**:
   - [ ] Selecting page auto-focuses category dropdown (optional enhancement)
   - [ ] Form submission focuses first error field on validation failure

---

### Task 4.9: Edge Cases and Error Scenarios

**Test Cases**:

1. **Empty Data**:
   - [ ] What if `/pages` returns empty array? → Show message "Aucune page disponible"
   - [ ] What if selected page has no categories? → Show "Aucune catégorie disponible"

2. **Concurrent Updates**:
   - [ ] User changes page while categories still loading → Handle gracefully
   - [ ] User submits form while dropdowns still loading → Validation prevents submission

3. **Network Errors**:
   - [ ] Simulate 500 error on `/categories` → Show error message, disable dropdown
   - [ ] Simulate 401 unauthorized → Auto-logout + redirect to login
   - [ ] Retry failed requests (manual refresh)

4. **Invalid State**:
   - [ ] Manually set invalid `page_id` in browser console → Validation catches it
   - [ ] Category from wrong page selected → Validation prevents submission

---

## Phase 5: Documentation and Cleanup

**Goal**: Update project documentation and remove temporary code.

**Target**: Code is production-ready with clear documentation.

---

### Task 5.1: Update CLAUDE.md

**File**: `CLAUDE.md`

**Changes**:

1. Add section documenting page → category hierarchy in admin forms:
   ```markdown
   ### Admin Form Patterns

   **Hierarchical Dropdowns (Page → Category)**:
   - Product create/edit forms have two-level selection
   - First select page (service line / univers)
   - Then select category (filtered by page_id)
   - Changing page resets category selection
   - Use `watch()` to handle cascading updates

   **Example**:
   ```typescript
   const filteredCategoryOptions = computed(() => {
     if (!state.value.page_id) return []
     return categories.filter(c => c.page_id === state.value.page_id)
   })

   watch(() => state.value.page_id, () => {
     state.value.category_id = undefined  // Reset
   })
   ```
   ```

**Validation**:
- CLAUDE.md updated with new patterns
- Future sessions can reference this documentation

---

### Task 5.2: Remove Debug Code and Console Logs

**Files**: All modified files

**Changes**:

1. Search for and remove any temporary `console.log()` statements
2. Remove any commented-out code
3. Ensure no debug `<pre>` tags in templates

**Validation**:
- No debug output in production build
- Code is clean and production-ready

---

### Task 5.3: Final Code Review

**Checklist**:

- [ ] All TypeScript types are correct
- [ ] No `any` types used unnecessarily
- [ ] Proper error handling in all API calls
- [ ] Consistent code formatting (Prettier)
- [ ] ESLint passes with no errors
- [ ] No unused imports
- [ ] No unused variables
- [ ] Proper component prop types
- [ ] Consistent naming conventions

---

## Success Criteria

**Phase 1 Complete**:
- ✅ All dropdowns in admin pages populate correctly
- ✅ No console errors on any admin page
- ✅ Admin can create products
- ✅ Admin can edit products
- ✅ Admin can filter product/gallery lists

**Phase 2 Complete**:
- ✅ Product create page has page selector
- ✅ Category dropdown filters by selected page
- ✅ Changing page resets category
- ✅ Form validation works for both page and category

**Phase 3 Complete**:
- ✅ Product edit page has page selector
- ✅ Page pre-fills from existing product's category
- ✅ Can change page and category on edit
- ✅ Updates save correctly

**Phase 4 Complete**:
- ✅ All manual tests pass
- ✅ No browser console errors
- ✅ Cross-browser compatibility verified
- ✅ Performance benchmarks met
- ✅ Accessibility standards met

**Phase 5 Complete**:
- ✅ Documentation updated
- ✅ Code is production-ready
- ✅ No debug code remaining

---

## Rollback Plan

If critical issues found during implementation:

1. **Phase 1 Rollback**: Revert type changes, restore original data access patterns
2. **Phase 2 Rollback**: Remove page selector, keep fixed dropdowns
3. **Phase 3 Rollback**: Keep create page changes, remove edit page changes

**Git Strategy**: Create feature branch for each phase, merge after validation.
