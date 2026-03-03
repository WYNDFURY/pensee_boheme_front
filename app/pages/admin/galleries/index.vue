<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Galeries</h1>
        <p class="mt-1 text-sm text-gray-500">Gérez vos galeries photos et leurs publications</p>
      </div>
      <div class="flex gap-2">
        <UButton
          v-if="!reorderMode"
          label="Réordonner"
          color="neutral"
          variant="outline"
          icon="i-heroicons-arrows-up-down"
          size="lg"
          :disabled="pending || !!error"
          @click="enterReorderMode"
        />
        <UButton
          label="Créer une galerie"
          color="primary"
          icon="i-heroicons-plus"
          size="lg"
          @click="navigateTo('/admin/galleries/create')"
        />
      </div>
    </div>

    <!-- Reorder Mode -->
    <template v-if="reorderMode">
      <UCard>
        <div class="flex items-center justify-between mb-4">
          <p class="text-sm text-gray-600">
            Glissez-déposez les galeries pour les réordonner, puis enregistrez.
          </p>
          <div class="flex gap-2">
            <UButton
              label="Annuler"
              color="neutral"
              variant="outline"
              @click="cancelReorderMode"
            />
            <UButton
              label="Enregistrer l'ordre"
              color="primary"
              :loading="savingOrder"
              @click="saveOrder"
            />
          </div>
        </div>
        <draggable
          v-model="reorderList"
          item-key="id"
          handle=".drag-handle"
          :animation="200"
          class="space-y-1"
        >
          <template #item="{ element }">
            <div
              class="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
            >
              <UIcon
                name="i-heroicons-bars-3"
                class="drag-handle w-5 h-5 text-gray-400 cursor-grab active:cursor-grabbing shrink-0"
              />
              <span class="text-sm text-gray-400 w-6 text-center shrink-0">
                {{ reorderList.indexOf(element) + 1 }}
              </span>
              <span class="font-medium flex-1">{{ element.name }}</span>
              <span class="text-sm text-gray-500">{{ element.images_count ?? 0 }} images</span>
              <span
                :class="element.is_published ? 'text-green-600' : 'text-gray-400'"
                class="text-sm"
              >
                {{ element.is_published ? 'Publiée' : 'Non publiée' }}
              </span>
            </div>
          </template>
        </draggable>
      </UCard>
    </template>

    <!-- Normal Mode -->
    <template v-else>
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
            :items="publishedOptions"
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
              <p class="text-2xl font-bold">{{ galleries.reduce((sum, g) => sum + (g.images_count || 0), 0) }}</p>
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
          <USwitch
            :model-value="(row.original as GalleryData).is_published"
            :loading="togglingGalleries.has((row.original as GalleryData).slug)"
            :disabled="togglingGalleries.has((row.original as GalleryData).slug)"
            color="success"
            :ui="{ base: 'data-[state=unchecked]:bg-gray-300' }"
            @update:model-value="toggleGalleryPublished(row.original as GalleryData)"
          />
        </template>

        <template #order-cell="{ row }">
          <span class="text-sm text-gray-500">
            {{ (row.original as GalleryData).order }}
          </span>
        </template>

        <template #image_count-cell="{ row }">
          {{ (row.original as GalleryData).images_count ?? 0 }}
        </template>

        <template #actions-cell="{ row }">
          <div class="flex gap-2">
            <UButton
              size="xs"
              color="primary"
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
    </template>

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
        <div class="w-full flex justify-evenly gap-2">
          <UButton 
            label="Annuler" 
            color="primary" 
            variant="outline"
            @click="deleteModal.open = false" 
          />
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
import draggable from 'vuedraggable'
import type { GalleryData } from '~/types/models'

definePageMeta({
  layout: 'admin',
  ssr: false,
})

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
  { id: 'order', header: 'Ordre' },
  { id: 'image_count', header: 'Images' },
  { id: 'actions', header: 'Actions' },
]

const { data, pending, error, refresh } = await useAsyncData(
  'admin-galleries',
  () => api.get<GalleryData[]>('/galleries')
)

// Filter options
const publishedOptions = [
  { label: 'Tous les statuts', value: null },
  { label: 'Publié', value: true },
  { label: 'Non publié', value: false },
]

// Sorted by order (source of truth for ordering)
const sortedGalleries = computed(() => {
  const arr = data.value ?? []
  return [...arr].sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity))
})

// Filtered galleries
const galleries = computed(() => {
  let filtered = sortedGalleries.value

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

// Toggle is_published
const togglingGalleries = ref(new Set<string>())

async function toggleGalleryPublished(gallery: GalleryData) {
  const newValue = !gallery.is_published
  const slug = gallery.slug
  gallery.is_published = newValue
  togglingGalleries.value.add(slug)

  try {
    await api.patch(`/galleries/${slug}`, { is_published: newValue })
    toast.add({
      title: newValue ? 'Galerie publiée' : 'Galerie dépubliée',
      color: 'success',
    })
  } catch {
    gallery.is_published = !newValue
  } finally {
    togglingGalleries.value.delete(slug)
  }
}

// Reorder mode
const reorderMode = ref(false)
const reorderList = ref<GalleryData[]>([])
const originalOrder = ref<Map<number, number>>(new Map())
const savingOrder = ref(false)

function enterReorderMode() {
  // Snapshot current sorted order for rollback
  const sorted = sortedGalleries.value
  originalOrder.value = new Map(sorted.map(g => [g.id, g.order]))
  reorderList.value = sorted.map(g => ({ ...g }))
  reorderMode.value = true
}

function cancelReorderMode() {
  reorderList.value = []
  originalOrder.value.clear()
  reorderMode.value = false
}

async function saveOrder() {
  // Compute which galleries changed position
  const patches: { slug: string; order: number }[] = []
  reorderList.value.forEach((gallery, index) => {
    const newOrder = index + 1
    const oldOrder = originalOrder.value.get(gallery.id)
    if (oldOrder !== newOrder) {
      patches.push({ slug: gallery.slug, order: newOrder })
    }
  })

  if (patches.length === 0) {
    reorderMode.value = false
    reorderList.value = []
    originalOrder.value.clear()
    return
  }

  savingOrder.value = true
  try {
    await Promise.all(
      patches.map(p => api.patch(`/galleries/${p.slug}`, { order: p.order }))
    )
    toast.add({ title: 'Ordre mis à jour', color: 'success' })
    reorderMode.value = false
    reorderList.value = []
    originalOrder.value.clear()
    await refresh()
  } catch {
    // Keep reorder mode open so user can retry
    toast.add({ title: 'Erreur lors de la sauvegarde', color: 'error' })
  } finally {
    savingOrder.value = false
  }
}

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
