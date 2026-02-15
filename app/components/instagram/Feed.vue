<template>
  <div class="flex flex-col gap-20 mt-20">
    <div class="flex flex-col items-center">
      <div class="flex items-center gap-2 mb-4">
        <AkInstagramFill class="text-3xl lg:text-4xl" />
        <h2
          class="uppercase font-light text-4xl md:text-5xl xl:text-6xl text-center font-['Kumbh_Sans']"
        >
          Instagram
        </h2>
      </div>
      <a href="https://www.instagram.com/penseeboheme/" target="_blank" class="flex items-center gap-2 hover:text-accent-500 transition-colors">@pensee-boheme</a>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 px-4 md:px-20">
      <div v-for="instagramMedia in displayedMedias" :key="instagramMedia.id">
        <InstagramCard :instagram-media="instagramMedia" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { InstagramMedia } from '~/types/models'
  import { AkInstagramFill } from '@kalimahapps/vue-icons'
  import { useWindowSize } from '@vueuse/core'

  const props = defineProps<{
    instagramMedias: InstagramMedia[]
  }>()

  const { width } = useWindowSize()
  const displayCount = computed(() => {
    if (width.value >= 1024) return 8 // lg screens: 4 columns × 2 rows
    if (width.value >= 640) return 9 // md screens: 3 columns × 2 rows
    return 6 // sm/xs screens: 2 columns × 2 rows
  })

  const displayedMedias = computed(() => {
    return props.instagramMedias.slice(0, displayCount.value)
  })
</script>

<style></style>
