<template>
  <div>
    <GaleriesDisplay v-if="data" :gallery="data" />
  </div>
</template>

<script lang="ts" setup>
  const { getShowOfGallery } = useGalleryService()
  const { data } = getShowOfGallery()
</script>
