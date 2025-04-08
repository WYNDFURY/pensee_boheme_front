<template>
  <div class="">
    <PagesBanner
      class=""
      :img-class="''"
      :text-class="' justify-end items-end mb-10 mr-10'"
      :banner-image="'/ateliers-creatifs/ateliers_banner.png'"
      :alt="'Professionnels bannière'"
      >Ateliers <br />
      Créatifs
    </PagesBanner>
    <ProductsList v-if="data" :page="data.data" />
  </div>
</template>

<script setup lang="ts">
  const { getPageProducts } = useShowPageProductsService()
  const { data } = getPageProducts()
</script>

<style></style>
