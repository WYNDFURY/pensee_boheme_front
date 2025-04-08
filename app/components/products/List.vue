<template>
  <div v-for="category in page.categories" :key="category.id" class="my-10">
    <!-- Container for alignment consistency -->
    <div class="w-full max-w-7xl mx-auto px-4 md:px-8">
      <!-- Heading with same constraints as product grid -->
      <h2 class="text-left text-2xl md:text-3xl font-medium mb-6">{{ category.name }} -</h2>

      <!-- Product grid with same width constraints -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
        <ProductsCard v-for="product in category.products" :key="product.id" :product="product" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { PageData } from '~/types/models'

  defineProps<{
    page: PageData
  }>()
</script>

<style></style>
