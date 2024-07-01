<template>

  <div>
    <ProductsList v-if="data?.data" :products="data.data" />
  </div>



</template>

<script lang="ts" setup>
const { getProducts } = useIndexProductService();
const { data, status, error, refresh } = getProducts();



</script>
