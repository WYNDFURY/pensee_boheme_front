<template>
  <div v-if="product.media !== null" class="w-1/2 mx-auto border-b-1">
    <NuxtImg
      :src="product.media[0]?.url"
      placeholder=""
      alt="Product Image"
      class="bg-slate-300 aspect-square object-cover opacity-90"
    />
    <div class="flex text-sm lg:text-lg justify-between gap-1 my-2">
      <p>{{ product.name }}</p>
      <p v-if="product.price !== null">{{ product.price }}€</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
  //  REMOVE THE V-IF CONDITION ON THE IMAGE TO DEBUG THE MISSING IMAGES IN THE DIV
  import type { Product } from '~/types/models'

  defineProps<{
    product: Product
  }>()
</script>

<style></style>
