<template>
  <div>
    <PagesBanner
      class="md:text-left justify-start"
      :text-class="'md:justify-start md:ml-10'"
      :banner-image="'/DPCI/DPCI_Banner.jpg'"
      :alt="'Détails personnalisés et cadeaux invités bannière'"
      >Détails <br />
      personnalisés <br />
      & <br />
      cadeaux <br />
      invités
    </PagesBanner>
    <ProductsList v-if="data" :page="data.data" />
  </div>
</template>

<script setup lang="ts">
  const { getPageProducts } = useShowPageProductsService()
  const { data } = getPageProducts()
</script>
