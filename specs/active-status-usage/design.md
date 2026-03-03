# Active Status & Gallery Ordering — Design

## Overview

Add inline status toggles and gallery reordering to the admin backoffice. Two files modified: `app/pages/admin/galleries/index.vue` and `app/pages/admin/products/index.vue`. No new files, no new composables.

**High-level approach:**
1. Replace static text status cells with `USwitch` components that call `PATCH` on toggle
2. Add a dedicated "Reorder mode" with `vuedraggable` for drag-and-drop gallery ordering
3. Sort galleries by `order` ascending (admin + public fallback)
4. All mutations are optimistic with rollback on failure

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  Admin Gallery List Page                            │
│                                                     │
│  data (ref<GalleryData[]>) ← useAsyncData+api.get() │
│       │                                             │
│       ├─ sortedGalleries (computed, sort by order)  │
│       │       │                                     │
│       │       └─ galleries (computed, apply filters) │
│       │               │                             │
│       │               ├─ UTable :data="galleries"   │
│       │               │     └─ USwitch (is_published)│
│       │               │                             │
│       │               └─ Reorder Mode (vuedraggable)│
│       │                     ├─ drag-and-drop list   │
│       │                     └─ batch PATCH on save  │
│       │                                             │
│       └─ mutate data.value in-place (optimistic)    │
│               │                                     │
│               └─ PATCH /galleries/{slug} via api    │
│                   ├─ success → toast                │
│                   └─ failure → rollback + toast     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  Admin Product List Page                            │
│                                                     │
│  productsData (ref<Product[]>) ← useAsyncData       │
│       │                                             │
│       └─ products (computed, apply filters)          │
│               │                                     │
│               └─ UTable :data="products"             │
│                     └─ USwitch (is_active)           │
│                           │                         │
│                           └─ PATCH /products/{id}   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  Public Gallery Page (defensive fallback)           │
│                                                     │
│  useGalleryService().getIndexOfGalleries()          │
│       │                                             │
│       └─ GaleriesList :gallery-items="sortedData"   │
│           (sorted by order ascending in computed)   │
└─────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Gallery List — Status Toggle (`app/pages/admin/galleries/index.vue`)

**Current:** Static `<span>` showing "Oui"/"Non" with color classes.

**New:** `USwitch` component in the `#is_published-cell` slot.

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

**New state and function:**

```ts
// Track in-flight toggle requests by slug
const togglingGalleries = ref(new Set<string>())

async function toggleGalleryPublished(gallery: GalleryData) {
  const newValue = !gallery.is_published
  const slug = gallery.slug

  // Optimistic update — mutate data.value in-place
  gallery.is_published = newValue
  togglingGalleries.value.add(slug)

  try {
    await api.patch(`/galleries/${slug}`, { is_published: newValue })
    toast.add({
      title: newValue ? 'Galerie publiée' : 'Galerie dépubliée',
      color: 'success',
    })
  } catch {
    // Rollback
    gallery.is_published = !newValue
    // Error toast already handled by useAdminApi for non-422 errors
  } finally {
    togglingGalleries.value.delete(slug)
  }
}
```

**Why mutating `gallery` directly works:** `data.value` from `useFetch` is a reactive array of objects. Since `row.original` references the same object in the array, mutating `gallery.is_published` triggers reactivity for the computed `galleries` and the stats card count.

### 2. Product List — Status Toggle (`app/pages/admin/products/index.vue`)

**Current:** Static `<span>` showing "Actif"/"Inactif" with color classes.

**New:** Same `USwitch` pattern as galleries.

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

```ts
const togglingProducts = ref(new Set<number>())

async function toggleProductActive(product: Product) {
  const newValue = !product.is_active
  product.is_active = newValue
  togglingProducts.value.add(product.id)

  try {
    await api.patch(`/products/${product.id}`, { is_active: newValue })
    toast.add({
      title: newValue ? 'Produit activé' : 'Produit désactivé',
      color: 'success',
    })
  } catch {
    product.is_active = !newValue
  } finally {
    togglingProducts.value.delete(product.id)
  }
}
```

### 3. Gallery Ordering — Sort + Drag-and-Drop Reorder Mode

**Dependency:** `vuedraggable@next` (v4.1.0) — Vue 3 wrapper for SortableJS.

**Default sort:** Insert a `sortedGalleries` computed between `data` and the filter computed.

```ts
const sortedGalleries = computed(() => {
  const arr = data.value ?? []
  return [...arr].sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity))
})
```

**Reorder mode UX:** A "Réordonner" button in the page header toggles between normal table view and a dedicated drag-and-drop list. The table is hidden; a `vuedraggable` list replaces it with drag handles, position numbers, and gallery metadata.

**Template structure (reorder mode):**

```vue
<template v-if="reorderMode">
  <UCard>
    <div class="flex items-center justify-between mb-4">
      <p>Glissez-déposez les galeries pour les réordonner, puis enregistrez.</p>
      <div class="flex gap-2">
        <UButton label="Annuler" color="neutral" variant="outline" @click="cancelReorderMode" />
        <UButton label="Enregistrer l'ordre" color="primary" :loading="savingOrder" @click="saveOrder" />
      </div>
    </div>
    <draggable v-model="reorderList" item-key="id" handle=".drag-handle" :animation="200">
      <template #item="{ element }">
        <div class="flex items-center gap-3 p-3 bg-white border rounded-lg">
          <UIcon name="i-heroicons-bars-3" class="drag-handle cursor-grab" />
          <span>{{ reorderList.indexOf(element) + 1 }}</span>
          <span class="font-medium flex-1">{{ element.name }}</span>
          <span>{{ element.images_count ?? 0 }} images</span>
          <span>{{ element.is_published ? 'Publiée' : 'Non publiée' }}</span>
        </div>
      </template>
    </draggable>
  </UCard>
</template>
```

**Reorder state and logic:**

```ts
import draggable from 'vuedraggable'

const reorderMode = ref(false)
const reorderList = ref<GalleryData[]>([])
const originalOrder = ref<Map<number, number>>(new Map())
const savingOrder = ref(false)

function enterReorderMode() {
  const sorted = sortedGalleries.value
  originalOrder.value = new Map(sorted.map(g => [g.id, g.order]))
  reorderList.value = sorted.map(g => ({ ...g }))  // shallow copies
  reorderMode.value = true
}

function cancelReorderMode() {
  reorderList.value = []
  originalOrder.value.clear()
  reorderMode.value = false
}

async function saveOrder() {
  // Only PATCH galleries whose position actually changed
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
    // Apply new order values to reactive data.value
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
    // Keep reorder mode open so user can retry
  } finally {
    savingOrder.value = false
  }
}
```

**Why drag-and-drop over up/down buttons:** Moving a gallery multiple positions with up/down requires many clicks and individual API calls. Drag-and-drop lets the admin reorder freely, then batch-save only the changed positions in a single action.

**Why `Promise.all`:** All PATCH calls are independent. Sending them in parallel minimizes wait time. If any fails, reorder mode stays open for retry.

### 4. Public Gallery Page — Defensive Sort Fallback

**File:** `app/pages/galeries/index.vue`

Backend now returns galleries sorted by `ORDER BY order ASC` at query level. Add a frontend sort as defensive fallback to guarantee consistent ordering regardless of backend response order.

```vue
<!-- Before -->
<GaleriesList v-if="data" :gallery-items="data" />

<!-- After -->
<GaleriesList v-if="data" :gallery-items="sortedGalleries" />
```

```ts
const sortedGalleries = computed(() => {
  if (!data.value) return []
  return [...data.value].sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity))
})
```

No changes to `GaleriesList.vue` component — it receives `galleryItems` prop and renders in array order.

## Data Models

No type changes. Existing types already include all required fields:

```ts
// app/types/models.ts — no modifications needed
type GalleryData = {
  // ... existing fields ...
  is_published: boolean  // ✓ already exists
  order: number          // ✓ already exists
}

type Product = {
  // ... existing fields ...
  is_active: boolean     // ✓ already exists
}
```

## Backend Status (Complete)

Backend visibility filtering and ordering are fully implemented:
- **Index endpoints**: Eloquent scopes `active()`/`published()` filter unauthenticated requests. Admin (authenticated) sees all.
- **Show endpoints**: Explicit `findOrFail`/`firstOrFail` — inactive/unpublished items return 404 for guests, accessible for admins.
- **ShowPageController**: `is_active` filter on nested `categories.products` conditional on auth.
- **Gallery ordering**: `ORDER BY order ASC` at query level. New galleries auto-assign `MAX(order) + 1`.
- **IndexPageController**: Removed (route, controller, test deleted).

No frontend changes needed for public-facing filtering — backend handles it. Frontend work is admin UX only.

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Toggle PATCH fails (network/500) | Rollback boolean in-place, `useAdminApi` shows generic error toast |
| Toggle PATCH 401 | `useAdminApi` auto-logout + redirect to `/admin/login` |
| Toggle PATCH 422 | Rollback, `useAdminApi` throws (no field-level errors expected for boolean toggle) |
| Reorder save — some PATCHes fail | Error toast shown, reorder mode stays open for retry. On next page refresh, data reloads from backend with whatever partial state was saved. |

**Edge case — `Promise.all` partial failure:** If some PATCHes succeed but others fail, the backend has partial order updates. The reorder mode stays open so the admin can retry. On page refresh, data reloads from backend. A batch endpoint would solve this atomically but is out of scope.

## Testing Strategy

No test framework is configured. Manual testing checklist:

**Toggle tests:**
- Toggle a gallery from published → unpublished: switch turns off, "Publiées" count decrements
- Toggle back: switch turns on, count increments
- Filter by "Non publié", toggle a gallery to published: it disappears from filtered list (correct)
- Same pattern for product `is_active`
- Rapid double-click on toggle: second click is ignored (disabled during in-flight)
- Disconnect network, toggle: switch reverts after timeout, error toast appears

**Reorder tests:**
- Click "Réordonner": table hides, draggable list appears with all galleries in order
- Drag a gallery to a new position: position numbers update live
- Click "Enregistrer l'ordre": only changed galleries are PATCHed, toast confirms, table reappears sorted
- Click "Annuler": original order restored, table reappears
- Drag galleries but don't change any positions, click save: no API calls, exits cleanly
- Save with network error: error toast, reorder mode stays open for retry
- "Réordonner" button disabled when table is loading or has error

**Public page:**
- Galleries display in `order` ascending sequence
- Matches the admin ordering

## Performance Considerations

- **No full refetch after mutations:** Toggles and reorders mutate `data.value` in-place. The computed properties (`sortedGalleries`, `galleries`, stats) recompute reactively. No extra API calls.
- **Set-based tracking:** `togglingGalleries` and `togglingProducts` use `Set` for O(1) lookup, keeping per-row rendering fast even with many items.
- **Batch save with diff:** Reorder mode only PATCHes galleries whose position actually changed (`index+1 !== originalOrder`), minimizing API calls.
- **Parallel PATCH for reorder:** All changed order updates sent simultaneously via `Promise.all`, minimizing perceived latency.

## Security Considerations

- All PATCH calls go through `useAdminApi()` which injects `Authorization: Bearer` header automatically
- 401 responses trigger auto-logout (existing behavior)
- No new attack surface — only toggling existing boolean/integer fields on resources the admin already has full CRUD access to

## Monitoring and Observability

- Toast notifications provide immediate user feedback for all success/failure states
- `useAdminApi` logs 401/422/generic errors to console via the existing error handling
- No additional monitoring needed for this feature scope
