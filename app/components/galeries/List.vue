<template>
  <!-- Main content area with sidebar and gallery display -->
  <div class="max-w-8xl w-full px-4 md:px-8 flex flex-row">
    <!-- Sidebar with gallery titles -->
    <aside class="w-52 hidden lg:block mx-8 my-8">
      <ul class="space-y-3">
        <li v-for="(gallery, index) in galleryItems.data" :key="index">
          <button
            class="text-lg font-medium transition-all duration-200 w-full text-left px-3 py-2 rounded-md hover:bg-primary_green/10"
            :class="[
              index === currentIndex
                ? 'text-accent-500 bg-primary_green/20 font-semibold'
                : 'text-gray-600 hover:text-accent-500 hover:cursor-pointer',
            ]"
            @click="currentIndex = index"
          >
            {{ gallery.name }}
          </button>
        </li>
      </ul>
    </aside>

    <!-- Gallery display area -->
    <main
      class="flex flex-col sticky top-0 h-[calc(100vh-80px)] w-full text-center justify-evenly items-center transition-all duration-500 ease-in-out"
    >
      <div class="space-y-2">
        <h1
          class="text-3xl md:text-4xl lg:text-5xl font-light w-full font-['Kumbh_Sans'] uppercase"
        >
          {{ currentGallery?.name }}
        </h1>
        <h2
          v-if="currentGallery?.photographer"
          class="text-xl md:text-2xl lg:text-3xl font-light w-full font-['Kumbh_Sans'] uppercase"
        >
          {{ currentGallery?.photographer }}
        </h2>
      </div>
      <!-- Gallery navigation and display -->
      <div class="flex items-center justify-evenly w-full">
        <!-- Previous button -->
        <UButton
          class="hover:scale-105 active:scale-95 hover:cursor-pointer -z-10"
          color="primary"
          size="xl"
          icon="i-heroicons-arrow-left"
          :disabled="isFirstGallery"
          @click="prevGallery"
        />

        <!-- Gallery cards display -->
        <div
          :key="currentIndex"
          class="flex justify-center items-center py-8 transition-all duration-500 ease-in-out"
        >
          <!-- Carousel/gallery images -->
          <div class="relative flex items-center ">
            <div
              v-if="currentGallery?.media"
              class="aspect-[3/4] w-24 sm:w-36 md:w-48 -rotate-12 translate-x-8 sm:translate-x-24 md:translate-x-10 translate-y-4 md:translate-y-8 overflow-hidden rounded-lg group transition-all duration-500 hover:shadow-xl absolute md:static"
            >
              <NuxtImg
                v-show="!pending"
                loading="eager"
                :src="currentGallery?.media[0]?.url || '/images/placeholder.jpg'"
                :alt="`${currentGallery?.name} - Image 1 - Pensée Bohème création florale`"
                :class="{ 'opacity-0 ': pending, 'opacity-100 shadow-lg': !pending }"
                class="w-full h-full object-cover"
                quality="75"
              />
            </div>

            <NuxtLink
              v-if="currentGallery?.media"
              :href="`/galeries/${currentGallery.slug}`"
              class="aspect-[3/4] w-28 sm:w-48 md:w-60 z-10 overflow-hidden rounded-lg group transition-all duration-500 relative"
            >
              <PagesLottieLoader v-show="pending" />
              <NuxtImg
                v-show="!pending"
                loading="eager"
                :src="currentGallery?.media[1]?.url || '/media/placeholder.jpg'"
                :alt="`${currentGallery?.name} - Image principale - Pensée Bohème galerie`"
                :class="{ 'opacity-0': pending, 'opacity-100 shadow-xl': !pending }"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out hover:brightness-105 hover:shadow-2xl"
                quality="75"
              />

              <div
              v-show="!pending"
                class="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-all duration-300"
              >
                <span
                  class="opacity-0 group-hover:opacity-100 text-white font-semibold p-1 md:px-4 md:py-2 border border-white/50 rounded bg-black/30 backdrop-blur-sm hover:scale-105 transition-all duration-300"
                >
                  Visiter la gallerie
                </span>
              </div>
            </NuxtLink>

            <div
              v-if="currentGallery?.media"
              class="aspect-[3/4] w-24 sm:w-36 md:w-48 rotate-8 -translate-x-2 sm:-translate-x-16 md:-translate-x-10 -translate-y-6 md:-translate-y-4 overflow-hidden rounded-lg group transition-all duration-500 hover:shadow-xl absolute md:static"
            >
              <NuxtImg
                v-show="!pending"
                loading="eager"
                :src="currentGallery?.media[2]?.url || '/media/placeholder.jpg'"
                :alt="`${currentGallery?.name} - Image 3 - Pensée Bohème création florale`"
                :class="{ 'opacity-0': pending, 'opacity-100 shadow-lg': !pending }"
                class="w-full h-full object-cover"
                quality="75"
              />
            </div>
          </div>
        </div>

        <!-- Next button -->
        <UButton
          class="hover:scale-105 active:scale-95 hover:cursor-pointer"
          color="primary"
          size="xl"
          icon="i-heroicons-arrow-right"
          :disabled="isLastGallery"
          @click="nextGallery"
        />
      </div>

      <!-- Gallery pagination indicators -->
      <div class="flex justify-center gap-2 py-6">
        <button
          v-for="(gallery, index) in galleryItems.data"
          :key="index"
          :class="
            index === currentIndex
              ? 'bg-accent-500 scale-125 shadow-md'
              : 'bg-gray-300 hover:bg-gray-400 hover:scale-110 hover:cursor-pointer'
          "
          class="h-2 w-2 md:h-3 md:w-3 rounded-full transition-all duration-300 ease-in-out"
          @click="currentIndex = index"
        />
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
  import { PagesLottieLoader, UButton } from '#components'
  import type { Galleries } from '~/types/models'

    // Current gallery index
  const currentIndex = useState('currentGalleryIndex', () => 0)

  const props = defineProps<{
    galleryItems: Galleries
  }>()

  const pending = ref(true)

  onMounted(() => {
    setTimeout(() => {
      pending.value = false
    }, 500)
  })

  function resetTimer() {
    pending.value = true
    setTimeout(() => {
      pending.value = false
    }, 500)
  }


  // Computed values
  const currentGallery = computed(() => props.galleryItems.data[currentIndex.value])
  const isFirstGallery = computed(() => currentIndex.value === 0)
  const isLastGallery = computed(() => currentIndex.value === props.galleryItems.data.length - 1)

  // Simple navigation
  function nextGallery() {
    if (!isLastGallery.value) {
      resetTimer()
      currentIndex.value++
    }
  }

  function prevGallery() {
    if (!isFirstGallery.value) {
      resetTimer()
      currentIndex.value--
    }
  }

  // Keyboard navigation
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowRight') nextGallery()
    else if (e.key === 'ArrowLeft') prevGallery()
  }

  // Lifecycle
  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })
</script>

<style></style>
