<template>
  <div v-if="product.media[0]" class="w-1/2 mx-auto border-b-1">
    <NuxtImg
      v-bind="imageConfig"
      :alt="`${product.name} - Pensée Bohème`"
      class="bg-slate-300 aspect-square object-cover opacity-90 min-w-full h-fit"
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

  const props = defineProps<{
    product: Product
  }>()

  // Responsive image configuration
  const imageConfig = computed(() =>
    useResponsiveImage(props.product.media?.[0], 'card', {
      customSizes: '(min-width: 768px) 25vw, 50vw',
    })
  )

</script>

<style></style>
