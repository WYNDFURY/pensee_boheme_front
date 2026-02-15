# Select (USelect)

A select dropdown to choose from a list of options.

> Based on [Reka UI Select](https://reka-ui.com/docs/components/select)

## CRITICAL: Use `items` prop, not `options`

```vue
<!-- ✅ CORRECT -->
<USelect v-model="selected" :items="options" />

<!-- ❌ WRONG - will show black line, dropdown won't open -->
<USelect v-model="selected" :options="options" />
```

## Basic Usage

### Simple Array

```vue
<script setup>
const items = ['Backlog', 'Todo', 'In Progress', 'Done']
const selected = ref('Backlog')
</script>

<template>
  <USelect v-model="selected" :items="items" />
</template>
```

### Object Array (Recommended)

```vue
<script setup>
const items = [
  { label: 'Backlog', value: 'backlog' },
  { label: 'Todo', value: 'todo' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Done', value: 'done' }
]
const selected = ref('backlog')
</script>

<template>
  <USelect v-model="selected" :items="items" />
</template>
```

**Important:** When using objects, the `v-model` must reference the `value` property, not the object itself.

## Key Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `Array` | `[]` | Array of items (strings, numbers, or objects) |
| `placeholder` | `string` | - | Placeholder text |
| `disabled` | `boolean` | `false` | Disable the select |
| `loading` | `boolean` | `false` | Show loading state |
| `multiple` | `boolean` | `false` | Allow multiple selections |
| `color` | `string` | `'primary'` | Ring color when focused |
| `size` | `string` | `'md'` | Component size |
| `icon` | `string` | - | Leading icon |
| `trailing-icon` | `string` | `'i-lucide-chevron-down'` | Trailing icon |

## Item Object Properties

When using object arrays, each item can have:

```typescript
{
  label?: string          // Display text
  value?: any            // Value for v-model
  type?: 'item' | 'label' | 'separator'  // Item type
  icon?: string          // Leading icon
  avatar?: AvatarProps   // Avatar config
  chip?: ChipProps       // Chip badge
  disabled?: boolean     // Disable this item
  class?: string         // Custom CSS class
}
```

## Common Patterns

### With Loading State

```vue
<USelect
  v-model="selected"
  :items="options"
  :loading="pending"
  :disabled="pending || error"
  placeholder="Select an option"
/>
```

### Conditional Placeholder

```vue
<USelect
  v-model="selected"
  :items="filteredOptions"
  :disabled="!parentSelected"
  :placeholder="!parentSelected ? 'Select parent first' : 'Select option'"
/>
```

### With Icons

```vue
<script setup>
const items = [
  { label: 'Home', value: 'home', icon: 'i-heroicons-home' },
  { label: 'Settings', value: 'settings', icon: 'i-heroicons-cog' }
]
</script>

<template>
  <USelect v-model="selected" :items="items" />
</template>
```

### Multiple Selection

```vue
<USelect
  v-model="selectedItems"
  :items="options"
  multiple
  placeholder="Select multiple..."
/>
```

## With UFormField

```vue
<UFormField label="Category" name="category_id" required>
  <USelect
    v-model="state.category_id"
    :items="categoryOptions"
    placeholder="Select a category"
  />
</UFormField>
```

## Gotchas

1. **Always use `items`, never `options`** - This is the #1 cause of broken dropdowns
2. **Object items**: v-model binds to `value` property, not the whole object
3. **Empty state**: Use computed properties to show appropriate placeholder text
4. **Loading state**: Disable select while loading to prevent invalid selections
5. **Grouped items**: Use nested arrays for grouping: `[['Group 1 items'], ['Group 2 items']]`

## Color Values

Valid color values: `primary`, `secondary`, `success`, `error`, `warning`, `info`, `neutral`

## Size Values

Valid size values: `xs`, `sm`, `md`, `lg`, `xl`
