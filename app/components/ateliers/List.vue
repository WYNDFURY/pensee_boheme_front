<template>
  <div>
    <p class="text-center text-5xl font-light text-accent-500 my-24">
      {{ page?.categories?.[0]?.products?.length }} Ateliers vous sont proposés
    </p>
    <!-- for desktop -->
    <div v-if="isDesktop">
      <AteliersCardDesktop
        v-for="(product, index) in page?.categories?.[0]?.products"
        :key="product.id"
        :product="product"
        :is-even="index % 2 === 0"
      />
    </div>

    <!-- for mobile -->
    <div v-if="!isDesktop">
      <AteliersCardMobile
        v-for="product in page?.categories?.[0]?.products"
        :key="product.id"
        :product="product"
      />
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
