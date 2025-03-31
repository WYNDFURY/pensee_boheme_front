<template>
  <div>
    <h2>TEST</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 w-screen">
      <ProductsCard v-for="product in products" :key="product.id" :product="product" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { Product } from '~/types/models'

  defineProps<{
    products: Product[]
  }>()
</script>

<style></style>
