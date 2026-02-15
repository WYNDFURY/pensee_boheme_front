<template>
  <div>
    <h1 class="text-3xl font-semibold mb-6">Créer un produit</h1>

    <UForm
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

      <UFormField label="Catégorie" name="category_id" required>
        <USelect
          v-model="state.category_id"
          :options="categoryOptions"
          placeholder="Sélectionner une catégorie"
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

      <UFormField label="Image" name="image" hint="Max 10 MB">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          @change="onFileChange"
          class="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
        />
      </UFormField>

      <!-- Image preview -->
      <div v-if="imagePreview" class="relative w-48 aspect-square">
        <img
          :src="imagePreview"
          class="w-full h-full object-cover rounded"
          alt="Preview"
        />
        <button
          type="button"
          @click="removeImage"
          class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
        >
          <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
        </button>
      </div>

      <div class="flex gap-4">
        <UButton
          type="submit"
          label="Créer"
          color="primary"
          :loading="loading"
        />
        <UButton
          type="button"
          label="Annuler"
          color="gray"
          @click="navigateTo('/admin/products')"
        />
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { Category, ApiResponse } from '~/types/models'

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
  description: z.string().optional(),
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
  category_id: undefined,
  has_price: false,
  price: undefined,
  is_active: true,
})

const imageFile = ref<File | null>(null)
const imagePreview = ref<string>('')

// Fetch categories
const { data: categoriesData } = await useAsyncData('categories', () =>
  api.get<ApiResponse<Category[]>>('/categories')
)

const categoryOptions = computed(() => {
  return (categoriesData.value?.data ?? []).map(cat => ({
    label: cat.name,
    value: cat.id,
  }))
})

function generateSlug() {
  if (!state.value.name) return
  state.value.slug = state.value.name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const file = target.files[0]

  // Validate file size
  if (file.size > 10 * 1024 * 1024) {
    toast.add({
      title: 'Fichier trop volumineux',
      description: 'L\'image doit faire maximum 10 MB',
      color: 'error',
    })
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

function removeImage() {
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

    await api.upload('/products', formData, 'POST')

    toast.add({
      title: 'Produit créé',
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
