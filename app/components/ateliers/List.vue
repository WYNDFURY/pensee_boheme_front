<template>
  <div>
    <p class="text-center text-5xl font-light text-accent-500 my-24">
      {{ page?.categories?.[0]?.products?.length }} Ateliers vous sont proposés
    </p>

    <div v-if="isDesktop">
      <div v-for="category in page.categories" :key="category.id" class="my-10">
        <AteliersCardDesktop
          v-for="product in category.products"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>

    <div v-if="!isDesktop">
      <div v-for="category in page.categories" :key="category.id" class="my-10">
        <AteliersCardMobile
          v-for="product in category.products"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { PageData } from '~/types/models'
  import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

  const breakpoints = useBreakpoints(breakpointsTailwind)
  const isDesktop = breakpoints.greater('lg')

  defineProps<{
    page: PageData
  }>()
</script>
