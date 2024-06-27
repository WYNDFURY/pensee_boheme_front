<template>
  <div>
    <ProductsList :products="products.data" />
  </div>



</template>

<script lang="ts" setup>
const indexProjectService = useIndexProductService();
const data = await indexProjectService.getProducts();
const products = ref(data.data) as Ref<{
  "message": any,
  "data": {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
  }[]
}>;





</script>
