<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-semibold mb-2">Dashboard</h1>
      <p class="text-gray-600">Bienvenue, {{ user?.first_name }} {{ user?.last_name }}</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Galleries card -->
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-700">Galeries</h2>
          <UIcon name="i-heroicons-photo" class="w-8 h-8 text-accent-500" />
        </div>
        <div v-if="galleriesPending" class="text-gray-500">
          <UIcon name="i-heroicons-arrow-path" class="animate-spin w-6 h-6" />
        </div>
        <div v-else>
          <p class="text-4xl font-bold text-gray-900 mb-2">{{ galleriesCount }}</p>
          <NuxtLink
            to="/admin/galleries"
            class="text-sm text-accent-500 hover:text-accent-600 flex items-center gap-1"
          >
            Gérer les galeries
            <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
          </NuxtLink>
        </div>
      </div>

      <!-- Products card -->
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-700">Produits</h2>
          <UIcon name="i-heroicons-cube" class="w-8 h-8 text-accent-500" />
        </div>
        <div v-if="productsPending" class="text-gray-500">
          <UIcon name="i-heroicons-arrow-path" class="animate-spin w-6 h-6" />
        </div>
        <div v-else>
          <p class="text-4xl font-bold text-gray-900 mb-2">{{ productsCount }}</p>
          <NuxtLink
            to="/admin/products"
            class="text-sm text-accent-500 hover:text-accent-600 flex items-center gap-1"
          >
            Gérer les produits
            <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Galleries, Product } from '~/types/models'

definePageMeta({
  layout: 'admin',
  ssr: false,
})

const { user } = useAuth()
const api = useAdminApi()

const { data: galleries, pending: galleriesPending } = await useAsyncData(
  'admin-galleries-count',
  () => api.get<Galleries>('/galleries')
)

const { data: products, pending: productsPending } = await useAsyncData(
  'admin-products-count',
  () => api.get<Product[]>('/products')
)

const galleriesCount = computed(() => galleries.value?.data?.length ?? 0)
const productsCount = computed(() => products.value?.length ?? 0)
</script>
