<template>
  <div>
    <ProductsList v-if="data" :page="data.data" />
  </div>
</template>

<script lang="ts" setup>
  const { getPageProducts } = useShowPageProductsService()
  const { data } = getPageProducts()
</script>

<style></style>
