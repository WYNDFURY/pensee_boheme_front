<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Produits</h1>
        <p class="mt-1 text-sm text-gray-500">Gérez vos produits et leurs catégories</p>
      </div>
      <UButton
        label="Créer un produit"
        color="primary"
        icon="i-heroicons-plus"
        size="lg"
        @click="navigateTo('/admin/products/create')"
      />
    </div>

    <!-- Search and Filters -->
    <UCard>
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <UInput
            v-model="searchQuery"
            placeholder="Rechercher un produit..."
            icon="i-heroicons-magnifying-glass"
            size="lg"
          />
        </div>
        <USelect
          v-model="selectedCategory"
          :items="categoryOptions"
          placeholder="Toutes les catégories"
          size="lg"
          class="w-full md:w-64"
        />
        <USelect
          v-model="selectedStatus"
          :items="statusOptions"
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
            <UIcon name="i-heroicons-cube" class="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <p class="text-sm text-gray-500">Total Produits</p>
            <p class="text-2xl font-bold">{{ products.length }}</p>
          </div>
        </div>
      </UCard>
      <UCard>
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-lg bg-success-100">
            <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-success-600" />
          </div>
          <div>
            <p class="text-sm text-gray-500">Actifs</p>
            <p class="text-2xl font-bold">{{ products.filter(p => p.is_active).length }}</p>
          </div>
        </div>
      </UCard>
      <UCard>
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-lg bg-warning-100">
            <UIcon name="i-heroicons-archive-box" class="w-6 h-6 text-warning-600" />
          </div>
          <div>
            <p class="text-sm text-gray-500">Catégories</p>
            <p class="text-2xl font-bold">{{ uniqueCategoryCount }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Table Card -->
    <UCard>
      <div v-if="pending" class="text-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8 mx-auto text-primary-600" />
        <p class="mt-2 text-sm text-gray-500">Chargement des produits...</p>
      </div>

      <div v-else-if="fetchError" class="text-center py-12">
        <UIcon name="i-heroicons-exclamation-circle" class="h-12 w-12 mx-auto text-error-600" />
        <p class="mt-2 text-sm text-error-600">Erreur lors du chargement des produits</p>
      </div>

      <UTable v-else :data="products" :columns="columns" class="w-full">
      <template #category-cell="{ row }">
        {{ (row.original as Product).category_name ?? 'N/A' }}
      </template>

      <template #price-cell="{ row }">
        {{ (row.original as Product).price_formatted || 'N/A' }}
      </template>

      <template #is_active-cell="{ row }">
        <USwitch
          :model-value="(row.original as Product).is_active"
          :loading="togglingProducts.has((row.original as Product).id)"
          :disabled="togglingProducts.has((row.original as Product).id)"
          color="success"
          :ui="{ base: 'data-[state=unchecked]:bg-gray-300' }"
          @update:model-value="toggleProductActive(row.original as Product)"
        />
      </template>

      <template #image-cell="{ row }">
        <img
          v-if="(row.original as Product).media?.[0]?.urls?.thumb"
          :src="(row.original as Product).media?.[0]?.urls?.thumb"
          :alt="(row.original as Product).name"
          class="w-16 h-16 object-cover rounded"
        >
        <span v-else class="text-gray-400 text-sm">Aucune image</span>
      </template>

      <template #actions-cell="{ row }">
        <div class="flex gap-2">
          <UButton
            size="xs"
            color="primary"
            label="Modifier"
            :to="`/admin/products/${(row.original as Product).id}/edit`"
          />
          <UButton
            size="xs"
            color="error"
            label="Supprimer"
            @click="confirmDelete(row.original as Product)"
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
        <p>Êtes-vous sûr de vouloir supprimer le produit <strong>{{ deleteModal.product?.name }}</strong> ?</p>
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
            @click="deleteProduct"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types/models'

definePageMeta({
  layout: 'admin',
  ssr: false,
})

const api = useAdminApi()
const toast = useToast()

// Search and filters
const searchQuery = ref('')
const selectedCategory = ref<string | null>(null)
const selectedStatus = ref<boolean | null>(null)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const columns: any[] = [
  { accessorKey: 'name', header: 'Nom' },
  { id: 'category', header: 'Catégorie' },
  { id: 'price', header: 'Prix' },
  { id: 'is_active', header: 'Statut' },
  { id: 'image', header: 'Image' },
  { id: 'actions', header: 'Actions' },
]

const { data: productsData, pending, error: fetchError, refresh } = await useAsyncData(
  'admin-products',
  () => api.get<Product[]>('/products')
)

const allProducts = computed(() => productsData.value ?? [])

const uniqueCategoryCount = computed(() =>
  new Set(allProducts.value.map(p => p.category_name).filter(Boolean)).size
)

const categoryOptions = computed(() => [
  { label: 'Toutes les catégories', value: null },
  ...new Set(allProducts.value.map(p => p.category_name).filter(Boolean))
    .values()
    .map((name): { label: string; value: string } => ({ label: name!, value: name! }))
    .toArray(),
])

const statusOptions = [
  { label: 'Tous les statuts', value: null },
  { label: 'Actif', value: true },
  { label: 'Inactif', value: false },
]

// Filtered products
const products = computed(() => {
  let filtered = allProducts.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.slug.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query)
    )
  }

  if (selectedCategory.value !== null) {
    filtered = filtered.filter(p => p.category_name === selectedCategory.value)
  }

  if (selectedStatus.value !== null) {
    filtered = filtered.filter(p => p.is_active === selectedStatus.value)
  }

  return filtered
})

// Toggle is_active
const togglingProducts = ref(new Set<number>())

async function toggleProductActive(product: Product) {
  const newValue = !product.is_active
  product.is_active = newValue
  togglingProducts.value.add(product.id)

  try {
    await api.patch(`/products/${product.id}`, { is_active: newValue })
    toast.add({
      title: newValue ? 'Produit activé' : 'Produit désactivé',
      color: 'success',
    })
  } catch {
    product.is_active = !newValue
  } finally {
    togglingProducts.value.delete(product.id)
  }
}

const deleteModal = ref({
  open: false,
  product: null as Product | null,
  loading: false,
})

function confirmDelete(product: Product) {
  deleteModal.value.product = product
  deleteModal.value.open = true
}

async function deleteProduct() {
  if (!deleteModal.value.product) return

  deleteModal.value.loading = true
  try {
    await api.delete(`/products/${deleteModal.value.product.id}`)
    toast.add({
      title: 'Produit supprimé',
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
