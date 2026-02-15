# Table (UTable)

A flexible, type-safe table component built on TanStack Table v8.

> Based on [TanStack Table](https://tanstack.com/table/v8)

## CRITICAL: Use `data` prop, not `rows`

```vue
<!-- ✅ CORRECT -->
<UTable :data="products" :columns="columns" />

<!-- ❌ WRONG -->
<UTable :rows="products" :columns="columns" />
```

## Basic Usage

```vue
<script setup lang="ts">
interface Product {
  id: number
  name: string
  price: number
  is_active: boolean
}

const products = ref<Product[]>([
  { id: 1, name: 'Product 1', price: 29.99, is_active: true },
  { id: 2, name: 'Product 2', price: 49.99, is_active: false }
])

const columns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'price', header: 'Price' },
  { id: 'is_active', header: 'Status' },
  { id: 'actions', header: 'Actions' }
]
</script>

<template>
  <UTable :data="products" :columns="columns">
    <template #is_active-cell="{ row }">
      <span :class="(row.original as Product).is_active ? 'text-green-600' : 'text-gray-400'">
        {{ (row.original as Product).is_active ? 'Active' : 'Inactive' }}
      </span>
    </template>

    <template #actions-cell="{ row }">
      <UButton size="xs" :to="`/products/${(row.original as Product).id}/edit`">
        Edit
      </UButton>
    </template>
  </UTable>
</template>
```

## Key Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Array` | `[]` | Array of row objects |
| `columns` | `ColumnDef[]` | `[]` | Column definitions |
| `loading` | `boolean` | `false` | Show loading state |
| `sticky` | `boolean` | `false` | Make header sticky |
| `meta` | `TableMeta` | - | Table metadata (classes, styles) |

## Column Definitions

### Column Structure

**Two types of columns:**

1. **Direct data columns** - Use `accessorKey` ONLY
2. **Virtual/custom columns** - Use `id` ONLY (no `accessorKey`)

**NEVER mix both** `id` and `accessorKey` in the same column - it breaks TanStack Table.

### Direct Data Columns

For columns that directly display data from the row object:

```typescript
const columns = [
  { accessorKey: 'name', header: 'Product Name' },
  { accessorKey: 'email', header: 'Email Address' },
  { accessorKey: 'created_at', header: 'Created' }
]
```

### Virtual/Custom Columns

For computed values, custom templates, actions, or formatted data:

```typescript
const columns = [
  { accessorKey: 'name', header: 'Name' },
  { id: 'status', header: 'Status' },      // Custom template
  { id: 'price', header: 'Price' },        // Formatted display
  { id: 'actions', header: 'Actions' }     // Action buttons
]
```

Virtual columns are:
- Computed values (full name from first + last)
- Custom templates (badges, icons)
- Actions (edit, delete buttons)
- Formatted data (dates, currency)

## Template Slots

### Slot Naming

Slots follow the pattern: `#{columnId}-cell`

```vue
<UTable :data="products" :columns="columns">
  <!-- For column with id='actions' -->
  <template #actions-cell="{ row }">
    <UButton>Edit</UButton>
  </template>

  <!-- For column with id='status' -->
  <template #status-cell="{ row }">
    <span>{{ row.original.is_active ? 'Active' : 'Inactive' }}</span>
  </template>
</UTable>
```

### Accessing Row Data

Use `row.original` with type assertion:

```vue
<template #price-cell="{ row }">
  {{ (row.original as Product).price_formatted || 'N/A' }}
</template>

<template #category-cell="{ row }">
  {{ getCategoryName((row.original as Product).category_id) }}
</template>

<template #image-cell="{ row }">
  <img
    v-if="(row.original as Product).media?.[0]?.url"
    :src="(row.original as Product).media[0].url"
    :alt="(row.original as Product).name"
    class="w-16 h-16 object-cover rounded"
  />
</template>
```

## Common Patterns

### With Loading State

```vue
<script setup>
const { data, pending, error } = await useAsyncData(
  'products',
  () => api.get<Product[]>('/products')
)

const products = computed(() => data.value ?? [])
</script>

<template>
  <div v-if="pending">Loading...</div>
  <div v-else-if="error">Error loading data</div>
  <UTable v-else :data="products" :columns="columns" />
</template>
```

### Action Buttons

```vue
<template #actions-cell="{ row }">
  <div class="flex gap-2">
    <UButton
      size="xs"
      color="neutral"
      :to="`/admin/products/${(row.original as Product).id}/edit`"
    >
      Edit
    </UButton>
    <UButton
      size="xs"
      color="error"
      @click="confirmDelete(row.original as Product)"
    >
      Delete
    </UButton>
  </div>
</template>
```

### Conditional Styling

```vue
<template #status-cell="{ row }">
  <span
    :class="(row.original as Product).is_active
      ? 'text-green-600 font-semibold'
      : 'text-gray-400'"
  >
    {{ (row.original as Product).is_active ? 'Active' : 'Inactive' }}
  </span>
</template>
```

### Image Cells

```vue
<template #image-cell="{ row }">
  <img
    v-if="(row.original as Product).media?.[0]?.urls?.thumb"
    :src="(row.original as Product).media[0].urls.thumb"
    :alt="(row.original as Product).name"
    class="w-16 h-16 object-cover rounded"
  />
  <span v-else class="text-gray-400 text-sm">No image</span>
</template>
```

### Helper Functions in Cells

```vue
<script setup>
function getCategoryName(categoryId: number): string {
  const category = categories.value.find(c => c.id === categoryId)
  return category?.name ?? 'N/A'
}
</script>

<template>
  <UTable :data="products" :columns="columns">
    <template #category-cell="{ row }">
      {{ getCategoryName((row.original as Product).category_id) }}
    </template>
  </UTable>
</template>
```

## TypeScript Support

```typescript
import type { Product } from '~/types/models'

// Column definition type
const columns: any[] = [  // Use any[] to avoid TanStack Table complexity
  { accessorKey: 'name', header: 'Name' },
  { id: 'actions', header: 'Actions' }
]

// In template slots, cast row.original
<template #actions-cell="{ row }">
  {{ (row.original as Product).name }}
</template>
```

## Button Colors

Valid button colors for actions:
- `primary` - Primary action (default)
- `secondary` - Secondary action
- `neutral` - Neutral action (use instead of "gray")
- `error` - Destructive action (use instead of "red")
- `success` - Success action
- `warning` - Warning action
- `info` - Info action

## Best Practices

1. **Use `data` prop** - Never `rows`
2. **Separate direct and virtual columns** - `accessorKey` OR `id`, never both
3. **Type assertions in slots** - Always cast `row.original` to your type
4. **Computed data sources** - Use `computed()` for reactive filtering/sorting
5. **Handle loading states** - Show loading indicator while fetching
6. **Helper functions** - Extract complex cell logic to functions
7. **Semantic button colors** - Use `neutral` not `gray`, `error` not `red`
8. **Image fallbacks** - Always handle missing images gracefully

## Common Issues

| Issue | Solution |
|-------|----------|
| Table not rendering | Use `data` prop, not `rows` |
| Column errors | Don't mix `id` and `accessorKey` |
| TypeScript errors in slots | Cast `row.original` to your type |
| Images not showing | Check for `media?.[0]?.url` with optional chaining |
| Actions not working | Ensure function is defined in script setup |
| Wrong button colors | Use `neutral` not `gray`, `error` not `red` |
