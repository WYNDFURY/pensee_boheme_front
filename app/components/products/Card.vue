<template>
  <!-- remove the v-if condition on the image to debug the missing images -->
  <div v-if="product.image !== null && product.image !== ''" class="w-1/2 mx-auto border-b-1">
    <NuxtImg
      :src="product.image"
      alt="Product Image"
      class="bg-slate-300 aspect-square object-cover opacity-90"
    />
    <div class="flex flex-col lg:flex-row text-xs lg:text-lg justify-between gap-1 my-1 lg:my-2">
      <p>{{ product.name }}</p>
      <p v-if="product.price !== null">{{ product.price }}€</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { Product } from '~/types/models'

  defineProps<{
    product: Product
  }>()
</script>

<style></style>
