<template>
  <div v-if="product.media[0]" class="w-1/2 mx-auto border-b-1">
    <PagesLottieLoader v-show="pending" class="min-w-full aspect-square" />
    <NuxtImg
      v-show="!pending"
      :src="product.media[0]?.url"
      loading="lazy"
      :alt="`${product.name} - Pensée Bohème`"
      class="bg-slate-300 aspect-square object-cover opacity-90 min-w-full h-fit"
      sizes="50vw md:25vw"
      format="webp"
      quality="80"
      @load="onImageLoad"
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

  const pending = ref(true)

  function onImageLoad() {
    pending.value = false
  }

  onMounted(() => {
    setTimeout(() => {
      pending.value = false
    }, 2000)
  })
</script>

<style></style>
