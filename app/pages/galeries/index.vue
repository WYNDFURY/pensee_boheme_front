<template>
  <div>
    <GalleriesList v-if="data" :gallery-items="data" />
  </div>
</template>

<script lang="ts" setup>
  const { getIndexOfGalleries } = useGalleryService()
  const { data } = getIndexOfGalleries()
</script>

<style></style>
