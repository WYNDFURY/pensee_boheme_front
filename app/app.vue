<template>
  <UApp>
    <LayoutHeader class="relative z-10" />
    <NuxtPage class="bg-bgcolor" />
    <LayoutBanner />
    <LayoutFooter />
  </UApp>
</template>
<script setup lang="ts">
  // const { updateSlugFromRoute } = useCurrentSlugService()

  // watch(
  //   () => useRoute().path,
  //   () => updateSlugFromRoute()
  // )
</script>
