# UFileUpload

File upload component with drag & drop, multiple file selection, and validation support.

**Official docs:** https://ui.nuxt.com/docs/components/file-upload

## Basic Usage

```vue
<template>
  <UFileUpload
    v-model="files"
    multiple
    accept="image/jpeg,image/png,image/webp"
    icon="i-lucide-image-plus"
  />
</template>

<script setup>
const files = ref<File[] | null>(null)

// Watch for file changes
watch(files, (newFiles) => {
  if (!newFiles) return
  console.log('Files uploaded:', newFiles)
})
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `File \| File[] \| null` | `null` | Selected file(s) - use with v-model |
| `multiple` | `boolean` | `false` | Allow multiple file selection |
| `accept` | `string` | `"*"` | Accepted file types (MIME types or extensions) |
| `icon` | `string` | `"i-lucide-upload"` | Icon to display |
| `label` | `string` | - | Component label text |
| `description` | `string` | - | Helper text below label |
| `dropzone` | `boolean` | `true` | Enable drag & drop area |
| `interactive` | `boolean` | `true` | Make dropzone clickable |
| `disabled` | `boolean` | `false` | Disable the component |
| `color` | `string` | - | Color variant (primary, secondary, success, error, etc.) |
| `size` | `string` | - | Size variant (xs, sm, md, lg, xl) |
| `preview` | `boolean` | `true` | Show built-in file list after upload (set to `false` for custom preview) |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `File \| File[] \| null` | Emitted when files change |
| `change` | `Event` | Native change event |

## Common Patterns

### With Validation

```vue
<template>
  <UFormField label="Upload Images" name="images">
    <UFileUpload
      v-model="uploadedFiles"
      multiple
      accept="image/jpeg,image/png,image/webp,image/gif"
      icon="i-lucide-image-plus"
    />
  </UFormField>
</template>

<script setup>
const uploadedFiles = ref<File[] | null>(null)
const toast = useToast()

watch(uploadedFiles, (files) => {
  if (!files) return

  // Validate file count
  if (files.length > 10) {
    toast.add({
      title: 'Too many files',
      description: 'Maximum 10 files allowed',
      color: 'error',
    })
    uploadedFiles.value = null
    return
  }

  // Validate file sizes (10 MB max)
  const invalidFiles = files.filter(f => f.size > 10 * 1024 * 1024)
  if (invalidFiles.length > 0) {
    toast.add({
      title: 'File too large',
      description: 'Each file must be maximum 10 MB',
      color: 'error',
    })
    uploadedFiles.value = null
    return
  }
})
</script>
```

### With Custom Preview Images

**IMPORTANT**: Set `:preview="false"` to disable the built-in preview when using custom preview sections.

```vue
<template>
  <div>
    <UFileUpload
      v-model="files"
      multiple
      accept="image/*"
      :preview="false"
    />

    <!-- Custom preview grid -->
    <div v-if="previews.length" class="grid grid-cols-3 gap-4 mt-4">
      <div
        v-for="(preview, index) in previews"
        :key="index"
        class="relative aspect-square"
      >
        <img
          :src="preview"
          class="w-full h-full object-cover rounded"
          alt="Preview"
        />
        <button
          type="button"
          @click="removeFile(index)"
          class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
        >
          <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const files = ref<File[] | null>(null)
const previews = ref<string[]>([])

watch(files, (newFiles) => {
  if (!newFiles || newFiles.length === 0) {
    previews.value = []
    return
  }

  previews.value = []
  newFiles.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      previews.value.push(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  })
})

function removeFile(index: number) {
  if (files.value) {
    files.value.splice(index, 1)
    if (files.value.length === 0) {
      files.value = null
    }
  }
}
</script>
```

### With Form Submission

```vue
<template>
  <UForm @submit="onSubmit">
    <UFormField label="Upload Files" name="files">
      <UFileUpload v-model="uploadedFiles" multiple />
    </UFormField>

    <UButton type="submit" :loading="loading">Submit</UButton>
  </UForm>
</template>

<script setup>
const uploadedFiles = ref<File[] | null>(null)
const loading = ref(false)

async function onSubmit() {
  if (!uploadedFiles.value) return

  loading.value = true
  try {
    const formData = new FormData()
    uploadedFiles.value.forEach((file) => {
      formData.append('files[]', file)
    })

    await $fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
  } finally {
    loading.value = false
  }
}
</script>
```

## Important Notes

- **v-model binding**: Returns `File[]` for `multiple`, `File` for single
- **Null state**: When no files selected, v-model is `null`
- **Drag & drop**: Enabled by default with `dropzone` prop
- **File validation**: Use watchers to validate files on change
- **FormData**: Use `FormData.append()` for multipart uploads
- **Clear files**: Set v-model to `null` to clear selection

## CRITICAL: nextTick Required for Resetting

**ALWAYS use `nextTick()` when setting v-model to `null` during validation:**

```ts
// ❌ WRONG - causes "Cannot read properties of null (reading 'parentNode')" error
watch(uploadedFiles, (files) => {
  if (validationFails) {
    uploadedFiles.value = null  // DOM manipulation error!
  }
})

// ✅ CORRECT - defers reset until after DOM update
watch(uploadedFiles, async (files) => {
  if (validationFails) {
    await nextTick()
    uploadedFiles.value = null  // Safe after DOM updates
  }
})
```

**Why this is required:**
- UFileUpload manages internal DOM element references
- Setting v-model to null triggers component cleanup
- If done synchronously during Vue's update cycle, the component tries to access `parentNode` of removed elements
- `nextTick()` ensures DOM updates complete before resetting the ref

## Migration from Native Input

```vue
<!-- Before: Native input -->
<input
  type="file"
  multiple
  accept="image/*"
  @change="onFilesChange"
  class="custom-styles..."
/>

<!-- After: UFileUpload -->
<UFileUpload
  v-model="files"
  multiple
  accept="image/*"
  icon="i-lucide-image-plus"
/>
```

Then convert event handler to watcher:

```ts
// Before: Event handler
function onFilesChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files) return
  const files = Array.from(target.files)
  // Process files...
}

// After: Watcher
watch(files, (newFiles) => {
  if (!newFiles) return
  // Process files...
})
```
