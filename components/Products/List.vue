<template>

  <div>

    <section class="py-8">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-[#204534] mb-8">Nos Produits</h2>
        <div class="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <ProductsCard v-for="(product, id) in rows" :key="id" :product="product" />
        </div>
      </div>
    </section>
    <UPagination class="justify-center py-4" v-model="page" :page-count="pageCount" :total="products.length" />
  </div>
</template>

<script lang="ts" setup>
import type { Product } from '~/types/models';


const props = defineProps<{
  products: Product[];
}>();

const page = ref(1);
const pageCount = 6;

const rows = computed(() => {
  return props.products.slice((page.value - 1) * pageCount, (page.value) * pageCount)
})


</script>

<style></style>
