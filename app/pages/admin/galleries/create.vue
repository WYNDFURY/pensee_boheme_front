<template>
  <div>
    <h1 class="text-3xl font-semibold mb-6">Créer une galerie</h1>

    <UForm
      ref="form"
      :schema="schema"
      :state="state"
      class="space-y-6 max-w-2xl"
      @submit="onSubmit"
    >
      <UFormField label="Nom" name="name" required>
        <UInput v-model="state.name" @input="generateSlug" />
      </UFormField>

      <UFormField label="Slug" name="slug" required>
        <UInput v-model="state.slug" />
      </UFormField>

      <UFormField label="Photographe" name="photographer">
        <UInput v-model="state.photographer" placeholder="Nom du photographe (optionnel)" />
      </UFormField>

      <UFormField label="Description" name="description">
        <UTextarea v-model="state.description" :rows="4" />
      </UFormField>

      <UFormField label="Ordre" name="order">
        <UInput v-model.number="state.order" type="number" />
      </UFormField>

      <UFormField name="is_published">
        <UCheckbox v-model="state.is_published" label="Publié" />
      </UFormField>

      <UFormField label="Images" name="images" hint="Jusqu'à 20 images, max 10 MB chacune">
        <UFileUpload
          v-model="uploadedFiles"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif"
          icon="i-lucide-image-plus"
          :preview="false"
        />
      </UFormField>

      <!-- Image previews -->
      <div v-if="imagePreviews.length" class="grid grid-cols-3 gap-4">
        <div
          v-for="(preview, index) in imagePreviews"
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
            class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            @click="removeImage(index)"
          >
            <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div class="w-full flex justify-between gap-4">
        <UButton
          type="button"
          label="Annuler"
          color="primary"
          variant="outline"
          @click="$router.push('/admin/galleries')"
        />
        <UButton
          type="submit"
          label="Créer"
          color="primary"
          :loading="loading"
          :disabled="loading"
        />
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  layout: 'admin',
  ssr: false,
})

const api = useAdminApi()
const toast = useToast()
const loading = ref(false)

const schema = z.object({
  name: z.string().min(1, 'Nom requis'),
  slug: z.string().min(1, 'Slug requis'),
  photographer: z.string().optional(),
  description: z.string().optional(),
  order: z.number().optional(),
  is_published: z.boolean(),
  images: z.any().optional(), // File validation handled in onFilesChange
})

type Schema = z.output<typeof schema>

const state = ref<Partial<Schema>>({
  name: '',
  slug: '',
  photographer: '',
  description: '',
  order: 0,
  is_published: false,
})

const uploadedFiles = ref<File[] | null>(null)
const imageFiles = ref<File[]>([])
const imagePreviews = ref<string[]>([])

function generateSlug() {
  if (!state.value.name) return
  state.value.slug = state.value.name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Watch for file uploads and validate
watch(uploadedFiles, async (files) => {
  if (!files || files.length === 0) {
    imageFiles.value = []
    imagePreviews.value = []
    return
  }

  // Validate file count
  if (files.length > 20) {
    toast.add({
      title: 'Trop d\'images',
      description: 'Maximum 20 images autorisées',
      color: 'error',
    })
    await nextTick()
    uploadedFiles.value = null
    return
  }

  // Validate file sizes
  const invalidFiles = files.filter(f => f.size > 10 * 1024 * 1024)
  if (invalidFiles.length > 0) {
    toast.add({
      title: 'Fichier trop volumineux',
      description: 'Chaque image doit faire maximum 10 MB',
      color: 'error',
    })
    await nextTick()
    uploadedFiles.value = null
    return
  }

  imageFiles.value = files

  // Generate previews
  imagePreviews.value = []
  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreviews.value.push(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  })
})

function removeImage(index: number) {
  imageFiles.value.splice(index, 1)
  imagePreviews.value.splice(index, 1)

  // Update uploadedFiles to keep UFileUpload in sync
  if (uploadedFiles.value) {
    uploadedFiles.value.splice(index, 1)
    if (uploadedFiles.value.length === 0) {
      uploadedFiles.value = null
    }
  }
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true
  try {
    const formData = new FormData()
    formData.append('name', event.data.name)
    formData.append('slug', event.data.slug)
    if (event.data.photographer) formData.append('photographer', event.data.photographer)
    if (event.data.description) formData.append('description', event.data.description)
    formData.append('order', String(event.data.order ?? 0))
    formData.append('is_published', event.data.is_published ? '1' : '0')

    imageFiles.value.forEach((file) => {
      formData.append('images[]', file)
    })

    await api.upload('/galleries', formData, 'POST')

    toast.add({
      title: 'Galerie créée',
      color: 'success',
    })

    navigateTo('/admin/galleries')
  } catch (error: any) {
    // Error already handled by useAdminApi
  } finally {
    loading.value = false
  }
}
</script>
