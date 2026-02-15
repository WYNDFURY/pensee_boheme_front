<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Galeries</h1>
        <p class="mt-1 text-sm text-gray-500">Gérez vos galeries photos et leurs publications</p>
      </div>
      <UButton
        label="Créer une galerie"
        color="primary"
        icon="i-heroicons-plus"
        size="lg"
        @click="navigateTo('/admin/galleries/create')"
      />
    </div>

    <!-- Search and Filters -->
    <UCard>
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <UInput
            v-model="searchQuery"
            placeholder="Rechercher une galerie..."
            icon="i-heroicons-magnifying-glass"
            size="lg"
          />
        </div>
        <USelect
          v-model="selectedPublished"
          :options="publishedOptions"
          placeholder="Tous les statuts"
          size="lg"
          class="w-full md:w-48"
        />
      </div>
    </UCard>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <UCard>
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-lg bg-primary-100">
            <UIcon name="i-heroicons-photo" class="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <p class="text-sm text-gray-500">Total Galeries</p>
            <p class="text-2xl font-bold">{{ galleries.length }}</p>
          </div>
        </div>
      </UCard>
      <UCard>
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-lg bg-success-100">
            <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-success-600" />
          </div>
          <div>
            <p class="text-sm text-gray-500">Publiées</p>
            <p class="text-2xl font-bold">{{ galleries.filter(g => g.is_published).length }}</p>
          </div>
        </div>
      </UCard>
      <UCard>
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-lg bg-info-100">
            <UIcon name="i-heroicons-camera" class="w-6 h-6 text-info-600" />
          </div>
          <div>
            <p class="text-sm text-gray-500">Total Images</p>
            <p class="text-2xl font-bold">{{ galleries.reduce((sum, g) => sum + (g.media?.length || 0), 0) }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Table Card -->
    <UCard>
      <div v-if="pending" class="text-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8 mx-auto text-primary-600" />
        <p class="mt-2 text-sm text-gray-500">Chargement des galeries...</p>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <UIcon name="i-heroicons-exclamation-circle" class="h-12 w-12 mx-auto text-error-600" />
        <p class="mt-2 text-sm text-error-600">Erreur lors du chargement des galeries</p>
      </div>

      <UTable v-else :data="galleries" :columns="columns" class="w-full">
      <template #is_published-cell="{ row }">
        <span :class="(row.original as GalleryData).is_published ? 'text-green-600' : 'text-gray-400'">
          {{ (row.original as GalleryData).is_published ? 'Oui' : 'Non' }}
        </span>
      </template>

      <template #image_count-cell="{ row }">
        {{ (row.original as GalleryData).media?.length ?? 0 }}
      </template>

      <template #actions-cell="{ row }">
        <div class="flex gap-2">
          <UButton
            size="xs"
            color="neutral"
            label="Modifier"
            :to="`/admin/galleries/${(row.original as GalleryData).slug}/edit`"
          />
          <UButton
            size="xs"
            color="error"
            label="Supprimer"
            @click="confirmDelete(row.original as GalleryData)"
          />
        </div>
      </template>
    </UTable>
    </UCard>

    <!-- Delete Modal -->
    <UModal v-model:open="deleteModal.open">
      <template #header>
        <h3>Confirmer la suppression</h3>
      </template>
      <template #body>
        <p>Êtes-vous sûr de vouloir supprimer la galerie <strong>{{ deleteModal.gallery?.name }}</strong> ?</p>
        <p class="text-sm text-gray-500 mt-2">Cette action est irréversible.</p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton label="Annuler" color="neutral" @click="deleteModal.open = false" />
          <UButton
            label="Supprimer"
            color="error"
            :loading="deleteModal.loading"
            @click="deleteGallery"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { GalleryData, Galleries } from '~/types/models'

definePageMeta({
  layout: 'admin',
  ssr: false,
})

const { token } = useAuth()
const config = useRuntimeConfig()
const api = useAdminApi()
const toast = useToast()

// Search and filters
const searchQuery = ref('')
const selectedPublished = ref<boolean | null>(null)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const columns: any[] = [
  { accessorKey: 'name', header: 'Nom' },
  { accessorKey: 'slug', header: 'Slug' },
  { id: 'is_published', header: 'Publié' },
  { accessorKey: 'order', header: 'Ordre' },
  { id: 'image_count', header: 'Images' },
  { id: 'actions', header: 'Actions' },
]

const { data, pending, error, refresh } = await useFetch<Galleries>(
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

const allGalleries = computed(() => data.value?.data ?? [])

// Filter options
const publishedOptions = [
  { label: 'Tous les statuts', value: null },
  { label: 'Publié', value: true },
  { label: 'Non publié', value: false },
]

// Filtered galleries
const galleries = computed(() => {
  let filtered = allGalleries.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(g =>
      g.name.toLowerCase().includes(query) ||
      g.slug.toLowerCase().includes(query) ||
      g.photographer?.toLowerCase().includes(query)
    )
  }

  // Published filter
  if (selectedPublished.value !== null) {
    filtered = filtered.filter(g => g.is_published === selectedPublished.value)
  }

  return filtered
})

const deleteModal = ref({
  open: false,
  gallery: null as GalleryData | null,
  loading: false,
})

function confirmDelete(gallery: GalleryData) {
  deleteModal.value.gallery = gallery
  deleteModal.value.open = true
}

async function deleteGallery() {
  if (!deleteModal.value.gallery) return

  deleteModal.value.loading = true
  try {
    await api.delete(`/galleries/${deleteModal.value.gallery.slug}`)
    toast.add({
      title: 'Galerie supprimée',
      color: 'success',
    })
    deleteModal.value.open = false
    await refresh()
  } catch (error) {
    // Error already handled by useAdminApi
  } finally {
    deleteModal.value.loading = false
  }
}
</script>
