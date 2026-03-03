# Active Status & Gallery Ordering — Implementation Plan

## Backend Status: COMPLETE

All backend work is done:
- Visibility filtering via Eloquent scopes (`active()`, `published()`) — unauthenticated requests get filtered, admin sees all
- Show endpoints return 404 for guests on inactive/unpublished items
- `GET /galleries` sorted by `ORDER BY order ASC`
- New galleries auto-assign `MAX(order) + 1`
- `IndexPageController` removed

All phases below are **frontend admin UX only**.

---

## Phase 1: Product Status Toggle

**Goal:** Replace static "Actif"/"Inactif" text in the product admin table with an interactive USwitch toggle that PATCHes the API.

**Verify:** Navigate to `/admin/products`. Each row shows a toggle switch. Click a toggle → it flips immediately, toast confirms, "Actifs" stat updates. Click again → reverts. Rapid double-click is blocked.

### Task 1.1: Add toggle state and function to product list

**File:** `app/pages/admin/products/index.vue`

**Script changes:**
1. Add `togglingProducts` ref: `ref(new Set<number>())`
2. Add `toggleProductActive(product: Product)` async function:
   - Flip `product.is_active` in-place (optimistic)
   - Add `product.id` to `togglingProducts`
   - Call `api.patch('/products/${product.id}', { is_active: newValue })`
   - On success: toast "Produit activé" / "Produit désactivé"
   - On catch: rollback `product.is_active`
   - Finally: remove from `togglingProducts`

**Verify:** Function exists, no runtime errors on import.

### Task 1.2: Replace static status cell with USwitch

**File:** `app/pages/admin/products/index.vue`

**Template change:** Replace the `#is_active-cell` slot content.

Current (lines 104-108):
```vue
<template #is_active-cell="{ row }">
  <span :class="(row.original as Product).is_active ? 'text-green-600' : 'text-gray-400'">
    {{ (row.original as Product).is_active ? 'Actif' : 'Inactif' }}
  </span>
</template>
```

New:
```vue
<template #is_active-cell="{ row }">
  <USwitch
    :model-value="(row.original as Product).is_active"
    :loading="togglingProducts.has((row.original as Product).id)"
    :disabled="togglingProducts.has((row.original as Product).id)"
    color="success"
    @update:model-value="toggleProductActive(row.original as Product)"
  />
</template>
```

**Verify:** Toggle renders in each row. Clicking it calls the API and updates the stat card count reactively.

---

## Phase 2: Gallery Status Toggle

**Goal:** Same USwitch toggle pattern for `is_published` in the gallery admin table.

**Verify:** Navigate to `/admin/galleries`. Each row shows a toggle switch for publication status. Toggle works, toast confirms, "Publiées" stat updates.

### Task 2.1: Switch gallery data fetching to useAdminApi

**File:** `app/pages/admin/galleries/index.vue`

The gallery list currently uses `useFetch` with manually constructed headers (lines 174-184). Switch to `useAsyncData` + `api.get()` to match the product list pattern and ensure `data.value` is a mutable reactive array (required for in-place optimistic mutations).

Current:
```ts
const { token } = useAuth()
const config = useRuntimeConfig()
const api = useAdminApi()

const { data, pending, error, refresh } = await useFetch<GalleryData[]>(
  `${config.public.apiBaseUrl}/galleries`,
  {
    key: 'admin-galleries',
    headers: {
      Authorization: `Bearer ${token.value}`,
      Accept: 'application/json',
    },
    server: false,
  }
)
```

New:
```ts
const api = useAdminApi()
const toast = useToast()

const { data, pending, error, refresh } = await useAsyncData(
  'admin-galleries',
  () => api.get<GalleryData[]>('/galleries')
)
```

Remove unused `useAuth()` and `useRuntimeConfig()` destructuring (api composable handles auth internally).

**Verify:** Gallery list still loads correctly. No auth errors.

### Task 2.2: Add toggle state and function to gallery list

**File:** `app/pages/admin/galleries/index.vue`

**Script changes:**
1. Add `togglingGalleries` ref: `ref(new Set<string>())`
2. Add `toggleGalleryPublished(gallery: GalleryData)` async function:
   - Flip `gallery.is_published` in-place
   - Add `gallery.slug` to `togglingGalleries`
   - Call `api.patch('/galleries/${gallery.slug}', { is_published: newValue })`
   - On success: toast "Galerie publiée" / "Galerie dépubliée"
   - On catch: rollback
   - Finally: remove from set

### Task 2.3: Replace static status cell with USwitch

**File:** `app/pages/admin/galleries/index.vue`

**Template change:** Replace `#is_published-cell` slot (lines 89-93).

Current:
```vue
<template #is_published-cell="{ row }">
  <span :class="(row.original as GalleryData).is_published ? 'text-green-600' : 'text-gray-400'">
    {{ (row.original as GalleryData).is_published ? 'Oui' : 'Non' }}
  </span>
</template>
```

New:
```vue
<template #is_published-cell="{ row }">
  <USwitch
    :model-value="(row.original as GalleryData).is_published"
    :loading="togglingGalleries.has((row.original as GalleryData).slug)"
    :disabled="togglingGalleries.has((row.original as GalleryData).slug)"
    color="success"
    @update:model-value="toggleGalleryPublished(row.original as GalleryData)"
  />
</template>
```

**Verify:** Toggle renders. Clicking flips status, toast confirms, "Publiées" count updates.

---

## Phase 3: Gallery Default Sort by Order

**Goal:** Admin gallery table displays rows sorted by `order` ascending. Filters still work on top of the sorted data.

**Verify:** Navigate to `/admin/galleries`. Rows are in ascending order. Gallery with `order: 1` is first, `order: 2` second, etc. Applying a search filter still shows matching results in order.

### Task 3.1: Add sortedGalleries computed and update filter chain

**File:** `app/pages/admin/galleries/index.vue`

Insert `sortedGalleries` between `data` and the existing `galleries` computed.

```ts
const sortedGalleries = computed(() => {
  const arr = data.value ?? []
  return [...arr].sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity))
})
```

Update existing `galleries` computed to read from `sortedGalleries` instead of `data.value`:

```ts
const galleries = computed(() => {
  let filtered = sortedGalleries.value
  // ... rest unchanged ...
})
```

**Verify:** Table is sorted by order. Filters still work.

### Task 3.2: Change order column from accessorKey to virtual

**File:** `app/pages/admin/galleries/index.vue`

Change in the columns array (line 169):
```ts
// Before
{ accessorKey: 'order', header: 'Ordre' },
// After
{ id: 'order', header: 'Ordre' },
```

This prepares the column for a custom cell template (Phase 4).

---

## Phase 4: Gallery Drag-and-Drop Reordering

**Goal:** A dedicated "Reorder mode" with drag-and-drop using `vuedraggable`. The admin clicks "Réordonner", the table hides and a draggable list appears. After rearranging, clicking "Enregistrer" batch-PATCHes only the changed galleries.

**Verify:** Navigate to `/admin/galleries`. Click "Réordonner" → table replaced by draggable list. Drag a gallery to a new position → position numbers update live. Click "Enregistrer l'ordre" → only changed galleries PATCHed, toast confirms, table reappears in new order. Click "Annuler" → original order restored.

### Task 4.1: Install vuedraggable

```bash
yarn add --ignore-engines vuedraggable@next
```

Installs `vuedraggable@4.1.0` + `sortablejs@1.14.0`.

### Task 4.2: Add reorder mode state and functions

**File:** `app/pages/admin/galleries/index.vue`

```ts
import draggable from 'vuedraggable'

const reorderMode = ref(false)
const reorderList = ref<GalleryData[]>([])
const originalOrder = ref<Map<number, number>>(new Map())
const savingOrder = ref(false)

function enterReorderMode() {
  const sorted = sortedGalleries.value
  originalOrder.value = new Map(sorted.map(g => [g.id, g.order]))
  reorderList.value = sorted.map(g => ({ ...g }))
  reorderMode.value = true
}

function cancelReorderMode() {
  reorderList.value = []
  originalOrder.value.clear()
  reorderMode.value = false
}

async function saveOrder() {
  const patches: { slug: string; order: number }[] = []
  reorderList.value.forEach((gallery, index) => {
    const newOrder = index + 1
    if (originalOrder.value.get(gallery.id) !== newOrder) {
      patches.push({ slug: gallery.slug, order: newOrder })
    }
  })

  if (patches.length === 0) { cancelReorderMode(); return }

  savingOrder.value = true
  try {
    await Promise.all(patches.map(p => api.patch(`/galleries/${p.slug}`, { order: p.order })))
    for (const patch of patches) {
      const gallery = data.value!.find(g => g.slug === patch.slug)
      if (gallery) gallery.order = patch.order
    }
    toast.add({ title: 'Ordre mis à jour', color: 'success' })
    reorderMode.value = false
    reorderList.value = []
    originalOrder.value.clear()
  } catch {
    toast.add({ title: 'Erreur lors de la sauvegarde', color: 'error' })
  } finally {
    savingOrder.value = false
  }
}
```

### Task 4.3: Add "Réordonner" button and reorder mode template

**File:** `app/pages/admin/galleries/index.vue`

Header — add "Réordonner" button next to "Créer une galerie" (hidden during reorder mode):

```vue
<UButton
  v-if="!reorderMode"
  label="Réordonner"
  color="neutral"
  variant="outline"
  icon="i-heroicons-arrows-up-down"
  size="lg"
  :disabled="pending || !!error"
  @click="enterReorderMode"
/>
```

Reorder mode template (replaces table when active):

```vue
<template v-if="reorderMode">
  <UCard>
    <div class="flex items-center justify-between mb-4">
      <p class="text-sm text-gray-600">
        Glissez-déposez les galeries pour les réordonner, puis enregistrez.
      </p>
      <div class="flex gap-2">
        <UButton label="Annuler" color="neutral" variant="outline" @click="cancelReorderMode" />
        <UButton label="Enregistrer l'ordre" color="primary" :loading="savingOrder" @click="saveOrder" />
      </div>
    </div>
    <draggable v-model="reorderList" item-key="id" handle=".drag-handle" :animation="200" class="space-y-1">
      <template #item="{ element }">
        <div class="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
          <UIcon name="i-heroicons-bars-3" class="drag-handle w-5 h-5 text-gray-400 cursor-grab active:cursor-grabbing shrink-0" />
          <span class="text-sm text-gray-400 w-6 text-center shrink-0">{{ reorderList.indexOf(element) + 1 }}</span>
          <span class="font-medium flex-1">{{ element.name }}</span>
          <span class="text-sm text-gray-500">{{ element.images_count ?? 0 }} images</span>
          <span :class="element.is_published ? 'text-green-600' : 'text-gray-400'" class="text-sm">
            {{ element.is_published ? 'Publiée' : 'Non publiée' }}
          </span>
        </div>
      </template>
    </draggable>
  </UCard>
</template>
```

Normal table/filters/stats wrapped in `<template v-else>`.

**Verify:** Full drag-and-drop flow works. Position numbers update live during drag. Batch save only PATCHes changed galleries. Cancel restores original order. Error keeps reorder mode open for retry.

---

## Phase 5: Public Gallery Sort Fallback

**Goal:** Public gallery page sorts galleries by `order` ascending as a defensive fallback, regardless of backend sort order.

**Verify:** Navigate to `/galeries`. Galleries display in the same order as seen in the admin table.

### Task 5.1: Add sorted computed to public gallery page

**File:** `app/pages/galeries/index.vue`

Add computed and update template:

```ts
const sortedGalleries = computed(() => {
  if (!data.value) return []
  return [...data.value].sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity))
})
```

Change template from:
```vue
<GaleriesList v-if="data" :gallery-items="data" />
```
To:
```vue
<GaleriesList v-if="data" :gallery-items="sortedGalleries" />
```

**Verify:** Public gallery page displays galleries in order. No visual regressions.
