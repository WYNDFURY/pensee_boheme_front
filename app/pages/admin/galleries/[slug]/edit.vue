<template>
  <div>
    <h1 class="text-3xl font-semibold mb-6">Modifier la galerie</h1>

    <div v-if="pending" class="text-center py-8">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8" />
    </div>

    <div v-else-if="error" class="text-center py-8 text-red-500">
      Erreur lors du chargement de la galerie
    </div>

    <UForm
      v-else
      ref="form"
      :schema="schema"
      :state="state"
      @submit="onSubmit"
      class="space-y-6 max-w-2xl"
    >
      <UFormField label="Nom" name="name" required>
        <UInput v-model="state.name" @input="generateSlug" />
      </UFormField>

      <UFormField label="Slug" name="slug" required>
        <UInput v-model="state.slug" />
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

      <!-- Existing images -->
      <div v-if="existingImages.length">
        <label class="block text-sm font-medium mb-2">Images existantes</label>
        <div class="grid grid-cols-3 gap-4 mb-4">
          <div
            v-for="image in existingImages"
            :key="image.id"
            class="relative aspect-square"
          >
            <img
              :src="image.url"
              class="w-full h-full object-cover rounded"
              :alt="image.name"
            />
            <button
              type="button"
              @click="deleteExistingImage(image.id)"
              :disabled="deletingImageId === image.id"
              class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 disabled:opacity-50"
            >
              <UIcon
                :name="deletingImageId === image.id ? 'i-heroicons-arrow-path' : 'i-heroicons-x-mark'"
                class="w-4 h-4"
                :class="{ 'animate-spin': deletingImageId === image.id }"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- New images -->
      <UFormField label="Ajouter de nouvelles images" name="images" hint="Jusqu'à 20 images au total, max 10 MB chacune">
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif"
          @change="onFilesChange"
          class="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
        />
      </UFormField>

      <!-- New image previews -->
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
            @click="removeNewImage(index)"
            class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div class="flex gap-4">
        <UButton
          type="submit"
          label="Enregistrer"
          color="primary"
          :loading="loading"
        />
        <UButton
          type="button"
          label="Annuler"
          color="gray"
          @click="navigateTo('/admin/galleries')"
        />
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { Gallery, Media } from '~/types/models'

definePageMeta({
  layout: 'admin',
  ssr: false,
})

const route = useRoute()
const api = useAdminApi()
const toast = useToast()
const loading = ref(false)
const deletingImageId = ref<number | null>(null)

const slug = route.params.slug as string

const schema = z.object({
  name: z.string().min(1, 'Nom requis'),
  slug: z.string().min(1, 'Slug requis'),
  description: z.string().optional(),
  order: z.number().optional(),
  is_published: z.boolean(),
  images: z.any().optional(),
})

type Schema = z.output<typeof schema>

const state = ref<Partial<Schema>>({
  name: '',
  slug: '',
  description: '',
  order: 0,
  is_published: false,
})

const existingImages = ref<Media[]>([])
const imageFiles = ref<File[]>([])
const imagePreviews = ref<string[]>([])

// Fetch gallery data
const { data, pending, error } = await useAsyncData(`gallery-edit-${slug}`, () =>
  api.get<Gallery>(`/galleries/${slug}`)
)

// Pre-fill form when data loads
watch(data, (gallery) => {
  if (gallery?.data) {
    state.value = {
      name: gallery.data.name,
      slug: gallery.data.slug,
      description: gallery.data.description || '',
      order: gallery.data.order,
      is_published: gallery.data.is_published,
    }
    existingImages.value = gallery.data.media || []
  }
}, { immediate: true })

function generateSlug() {
  if (!state.value.name) return
  state.value.slug = state.value.name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function deleteExistingImage(mediaId: number) {
  deletingImageId.value = mediaId
  try {
    await api.delete(`/media/${mediaId}`)
    existingImages.value = existingImages.value.filter(img => img.id !== mediaId)
    toast.add({
      title: 'Image supprimée',
      color: 'success',
    })
  } catch (error) {
    // Error already handled by useAdminApi
  } finally {
    deletingImageId.value = null
  }
}

function onFilesChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files) return

  const files = Array.from(target.files)
  const totalImages = existingImages.value.length + files.length

  // Validate total image count
  if (totalImages > 20) {
    toast.add({
      title: 'Trop d\'images',
      description: `Maximum 20 images au total (${existingImages.value.length} existantes)`,
      color: 'error',
    })
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
}

function removeNewImage(index: number) {
  imageFiles.value.splice(index, 1)
  imagePreviews.value.splice(index, 1)
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true
  try {
    const formData = new FormData()
    formData.append('name', event.data.name)
    formData.append('slug', event.data.slug)
    if (event.data.description) formData.append('description', event.data.description)
    formData.append('order', String(event.data.order ?? 0))
    formData.append('is_published', event.data.is_published ? '1' : '0')

    // Append new images
    imageFiles.value.forEach((file) => {
      formData.append('images[]', file)
    })

    await api.upload(`/galleries/${slug}`, formData, 'PATCH')

    toast.add({
      title: 'Galerie modifiée',
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
