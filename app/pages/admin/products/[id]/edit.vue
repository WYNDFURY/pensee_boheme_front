<template>
  <div>
    <h1 class="text-3xl font-semibold mb-6">Modifier le produit</h1>

    <div v-if="pending" class="text-center py-8">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8" />
    </div>

    <div v-else-if="error" class="text-center py-8 text-red-500">
      Erreur lors du chargement du produit
    </div>

    <UForm
      v-else
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

      <UFormField label="Description" name="description">
        <UTextarea v-model="state.description" :rows="4" />
      </UFormField>

      <UFormField label="Page (Univers)" name="page_id" required>
        <USelect
          v-model="state.page_id"
          :items="pageOptions"
          :loading="pagesPending"
          :disabled="pagesPending || !!pagesError"
          placeholder="Sélectionner un univers"
        />
      </UFormField>

      <UFormField label="Catégorie" name="category_id" required>
        <USelect
          v-model="state.category_id"
          :items="filteredCategoryOptions"
          :disabled="!state.page_id"
          :placeholder="
            !state.page_id
              ? 'Sélectionner une page d\'abord'
              : filteredCategoryOptions.length === 0
                ? 'Aucune catégorie disponible'
                : 'Sélectionner une catégorie'
          "
        />
      </UFormField>

      <UFormField name="has_price">
        <UCheckbox v-model="state.has_price" label="A un prix" />
      </UFormField>

      <UFormField v-if="state.has_price" label="Prix" name="price" required>
        <UInput v-model.number="state.price" type="number" step="0.01" />
      </UFormField>

      <UFormField name="is_active">
        <UCheckbox v-model="state.is_active" label="Actif" />
      </UFormField>

      <!-- Existing image -->
      <div v-if="existingImage?.length && !imagePreview">
        <label class="block text-sm font-medium mb-2">Image actuelle</label>
        <div class="relative w-48 aspect-square mb-2">
          <img
            :src="existingImage?.[0]?.urls?.medium || existingImage?.[0]?.url"
            :alt="existingImage?.[0]?.name"
            class="w-full h-full object-cover rounded"
          >
          <button
            type="button"
            :disabled="deletingImage"
            class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 disabled:opacity-50"
            @click="deleteExistingImage"
          >
            <UIcon
              :name="deletingImage ? 'i-heroicons-arrow-path' : 'i-heroicons-x-mark'"
              class="w-4 h-4"
              :class="{ 'animate-spin': deletingImage }"
            />
          </button>
        </div>
      </div>

      <UFormField label="Image" name="image" hint="Max 10 MB">
        <UFileUpload
          v-model="uploadedFile"
          accept="image/jpeg,image/png,image/webp,image/gif"
          icon="i-lucide-image-plus"
          :preview="false"
        />
      </UFormField>

      <!-- New image preview -->
      <div v-if="imagePreview" class="relative w-48 aspect-square">
        <img
          :src="imagePreview"
          class="w-full h-full object-cover rounded"
          alt="Preview"
        >
        <button
          type="button"
          class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          @click="removeNewImage"
        >
          <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
        </button>
      </div>

      <div class="w-full justify-between flex gap-4">
        <UButton
          type="button"
          label="Annuler"
          color="primary"
          variant="outline"
          @click="navigateTo('/admin/products')"
        />
        <UButton
          type="submit"
          label="Enregistrer"
          color="primary"
          :loading="loading"
        />
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { Product, ProductResponse, Category, Media, PageData } from '~/types/models'

definePageMeta({
  layout: 'admin',
  ssr: false,
})

const route = useRoute()
const api = useAdminApi()
const toast = useToast()
const loading = ref(false)
const deletingImage = ref(false)

const productId = route.params.id as string

const schema = z.object({
  name: z.string().min(1, 'Nom requis'),
  slug: z.string().min(1, 'Slug requis'),
  description: z.string().optional(),
  page_id: z.number({ required_error: 'Page requise' }),
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

type Schema = z.output<typeof schema>

const state = ref<Partial<Schema>>({
  name: '',
  slug: '',
  description: '',
  page_id: undefined,
  category_id: undefined,
  has_price: false,
  price: undefined,
  is_active: true,
})

const existingImage = ref<Media[]>([])
const uploadedFile = ref<File | null>(null)
const imageFile = ref<File | null>(null)
const imagePreview = ref<string>('')

// Fetch product data
const { data: productData, pending, error } = await useAsyncData(`product-edit-${productId}`, () =>
  api.get<ProductResponse>(`/products/${productId}`)
)

// Fetch categories
const { data: categoriesData } = await useAsyncData('categories', () =>
  api.get<Category[]>('/categories')
)

// Fetch pages
const { data: pagesData, pending: pagesPending, error: pagesError } =
  await useAsyncData('pages', () => api.get<PageData[]>('/pages'))

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

// Pre-fill form when data loads
watch(productData, (product) => {
  if (product?.data) {
    // Find the category to get its page_id
    const category = categoriesData.value?.find(cat => cat.id === product.data.category_id)

    state.value = {
      name: product.data.name,
      slug: product.data.slug,
      description: product.data.description || '',
      page_id: category?.page_id,
      category_id: product.data.category_id,
      has_price: product.data.has_price,
      price: product.data.price || undefined,
      is_active: product.data.is_active,
    }
    existingImage.value = product.data.media || []
  }
}, { immediate: true })

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

function generateSlug() {
  if (!state.value.name) return
  state.value.slug = state.value.name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function deleteExistingImage() {
  if (!existingImage.value.length) return

  deletingImage.value = true
  try {
    await api.delete(`/media/${existingImage?.value[0]?.id}`)
    existingImage.value = []
    toast.add({
      title: 'Image supprimée',
      color: 'success',
    })
  } catch (error) {
    // Error already handled by useAdminApi
  } finally {
    deletingImage.value = false
  }
}

// Watch for file upload and validate
watch(uploadedFile, async (file) => {
  if (!file) {
    imageFile.value = null
    imagePreview.value = ''
    return
  }

  // Validate file size
  if (file.size > 10 * 1024 * 1024) {
    toast.add({
      title: 'Fichier trop volumineux',
      description: 'L\'image doit faire maximum 10 MB',
      color: 'error',
    })
    await nextTick()
    uploadedFile.value = null
    return
  }

  imageFile.value = file

  // Generate preview
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
})

function removeNewImage() {
  uploadedFile.value = null
  imageFile.value = null
  imagePreview.value = ''
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true
  try {
    const formData = new FormData()
    formData.append('name', event.data.name)
    formData.append('slug', event.data.slug)
    if (event.data.description) formData.append('description', event.data.description)
    formData.append('category_id', String(event.data.category_id))
    formData.append('has_price', event.data.has_price ? '1' : '0')
    if (event.data.has_price && event.data.price) {
      formData.append('price', String(event.data.price))
    }
    formData.append('is_active', event.data.is_active ? '1' : '0')

    if (imageFile.value) {
      formData.append('image', imageFile.value)
    }

    await api.upload(`/products/${productId}`, formData, 'PATCH')

    toast.add({
      title: 'Produit modifié',
      color: 'success',
    })

    navigateTo('/admin/products')
  } catch (error: any) {
    // Error already handled by useAdminApi
  } finally {
    loading.value = false
  }
}
</script>
