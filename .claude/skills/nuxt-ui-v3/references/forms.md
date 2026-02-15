# Forms

Form components with built-in validation support using Zod, Valibot, Yup, or other schema libraries.

## UForm Component

### Basic Setup

```vue
<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

const state = ref<Partial<Schema>>({
  email: '',
  password: ''
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // event.data contains validated data
  console.log(event.data)
}
</script>

<template>
  <UForm :schema="schema" :state="state" @submit="onSubmit">
    <UFormField label="Email" name="email" required>
      <UInput v-model="state.email" type="email" />
    </UFormField>

    <UFormField label="Password" name="password" required>
      <UInput v-model="state.password" type="password" />
    </UFormField>

    <UButton type="submit">Submit</UButton>
  </UForm>
</template>
```

## Key Props

### UForm Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `schema` | `Schema` | - | Validation schema (Zod, Valibot, Yup, etc.) |
| `state` | `object` | - | Reactive form state object |
| `validate-on` | `Array` | `['blur', 'change', 'input']` | When to validate |
| `validate-on-input-delay` | `number` | `300` | Debounce delay for input validation (ms) |
| `disabled` | `boolean` | `false` | Disable all form inputs |
| `transform` | `boolean` | `true` | Apply schema transformations on submit |

### UFormField Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Field label |
| `name` | `string` | - | Field name (must match schema key) |
| `required` | `boolean` | `false` | Show required indicator |
| `hint` | `string` | - | Helper text below field |
| `error` | `string` | - | Manual error message |
| `help` | `string` | - | Help text |

## Validation Libraries

### Zod (Recommended)

```bash
npm install zod
```

```typescript
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1, 'Name required'),
  email: z.string().email('Invalid email'),
  age: z.number().min(18, 'Must be 18+')
}).refine(
  (data) => {
    // Custom validation logic
    return data.age >= 21 || !data.email.includes('bar')
  },
  {
    message: 'Custom validation failed',
    path: ['age']
  }
)
```

### Validation Events

Forms validate on:
- **input** - As user types (debounced)
- **blur** - When field loses focus
- **change** - When value commits
- **submit** - Always validates before submission

Customize with `validate-on`:

```vue
<!-- Only validate on blur and submit -->
<UForm :validate-on="['blur']" />
```

## Form Submission

### Submit Event

```vue
<script setup>
async function onSubmit(event: FormSubmitEvent<Schema>) {
  // event.data is typed and validated
  try {
    await api.post('/endpoint', event.data)
  } catch (error) {
    // Handle error
  }
}
</script>

<template>
  <UForm @submit="onSubmit">
    <!-- fields -->
  </UForm>
</template>
```

### Loading State

```vue
<script setup>
const loading = ref(false)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true
  try {
    await api.post('/endpoint', event.data)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UForm @submit="onSubmit">
    <!-- fields -->
    <UButton type="submit" :loading="loading">Submit</UButton>
  </UForm>
</template>
```

## Common Patterns

### Conditional Fields

```vue
<UFormField name="has_price">
  <UCheckbox v-model="state.has_price" label="Has price" />
</UFormField>

<UFormField v-if="state.has_price" label="Price" name="price" required>
  <UInput v-model.number="state.price" type="number" />
</UFormField>
```

### Schema Refinement for Conditionals

```typescript
const schema = z.object({
  has_price: z.boolean(),
  price: z.number().optional()
}).refine(
  (data) => {
    if (data.has_price && !data.price) return false
    return true
  },
  {
    message: 'Price required when "Has price" is checked',
    path: ['price']
  }
)
```

### Dynamic Placeholder

```vue
<UFormField label="Category" name="category_id" required>
  <USelect
    v-model="state.category_id"
    :items="filteredOptions"
    :disabled="!state.parent_id"
    :placeholder="
      !state.parent_id
        ? 'Select parent first'
        : filteredOptions.length === 0
          ? 'No options available'
          : 'Select category'
    "
  />
</UFormField>
```

### File Uploads

```vue
<script setup>
const imageFile = ref<File | null>(null)
const imagePreview = ref<string>('')

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const file = target.files[0]

  // Validate size
  if (file.size > 10 * 1024 * 1024) {
    toast.add({ title: 'File too large', color: 'error' })
    return
  }

  imageFile.value = file

  // Generate preview
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const formData = new FormData()
  formData.append('name', event.data.name)

  if (imageFile.value) {
    formData.append('image', imageFile.value)
  }

  await api.upload('/products', formData, 'POST')
}
</script>

<template>
  <UForm @submit="onSubmit">
    <UFormField label="Image" name="image" hint="Max 10 MB">
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        @change="onFileChange"
      />
    </UFormField>

    <div v-if="imagePreview">
      <img :src="imagePreview" alt="Preview" />
    </div>
  </UForm>
</template>
```

## TypeScript Types

```typescript
import type { FormSubmitEvent } from '@nuxt/ui'

// Schema type
const schema = z.object({ ... })
type Schema = z.output<typeof schema>

// State type
const state = ref<Partial<Schema>>({ ... })

// Submit handler type
async function onSubmit(event: FormSubmitEvent<Schema>) {
  // event.data is typed as Schema
}
```

## Best Practices

1. **Always use TypeScript**: Get full type safety with `z.output<typeof schema>`
2. **Use Partial state**: `ref<Partial<Schema>>` allows undefined initial values
3. **Debounce input validation**: Default 300ms prevents excessive validation
4. **Validate on blur**: Best UX for most forms
5. **Show loading states**: Disable submit button during submission
6. **Handle errors gracefully**: Use try/catch with proper error messages
7. **Use refinements**: For complex conditional validation logic
8. **Match names exactly**: UFormField `name` must match schema key exactly

## Common Issues

| Issue | Solution |
|-------|----------|
| Validation not triggering | Check `name` prop matches schema key |
| Type errors on submit | Use `FormSubmitEvent<Schema>` type |
| Conditional validation fails | Use `.refine()` instead of `.and()` |
| File uploads not working | Use FormData with separate upload handler |
| Form submits invalid data | Check schema transformations aren't modifying data |
