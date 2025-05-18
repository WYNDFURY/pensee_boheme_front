<template>
  <div class="min-h-screen flex flex-col">
    <!-- Gallery title with transition -->
    <h1
      class="text-3xl md:text-4xl lg:text-5xl font-light text-center py-8 font-['Kumbh_sans'] uppercase transition-all duration-500 ease-in-out"
    >
      {{ currentGallery?.name }}
    </h1>

    <!-- Main content area with sidebar and gallery display -->
    <div class="flex flex-col md:flex-none max-w-8xl w-full px-4 md:px-8 mx-auto my-auto">
      <!-- Sidebar with gallery titles -->
      <aside class="w-52 hidden lg:block mx-8">
        <h2 class="text-xl font-semibold mb-4 text-accent-500">Galleries</h2>
        <ul class="space-y-3">
          <li v-for="(item, index) in galleryItems" :key="item.id">
            <button
              @click="currentIndex = index"
              class="text-lg font-medium transition-all duration-200 w-full text-left px-3 py-2 rounded-md hover:bg-primary_green/10"
              :class="[
                index === currentIndex
                  ? 'text-accent-500 bg-primary_green/20 font-semibold'
                  : 'text-gray-600 hover:text-accent-500',
              ]"
            >
              {{ item.name }}
            </button>
          </li>
        </ul>
      </aside>
      <!-- Gallery display area -->
      <main class="flex flex-col -translate-y-1/4">
        <!-- Gallery navigation and display -->
        <div class="flex items-center justify-between w-full lg:max-w-xl xl:max-w-3xl mx-auto">
          <!-- Previous button -->
          <UButton
            class="hover:scale-105 active:scale-95"
            color="primary"
            size="xl"
            icon="i-heroicons-arrow-left"
            :disabled="isFirstGallery"
            @click="prevGallery"
            :ui="{
              rounded: 'rounded-full',
              disabled: { color: 'gray' },
            }"
          />

          <!-- Gallery cards display -->
          <div
            class="flex justify-center items-center py-8 md:py-16 transition-all duration-500 ease-in-out mx-auto"
            :key="currentIndex"
          >
            <!-- Carousel/gallery images -->
            <div class="relative flex items-center">
              <div
                v-if="currentGallery?.media"
                class="aspect-[3/4] w-28 md:w-48 -rotate-12 translate-x-6 md:translate-x-10 translate-y-6 md:translate-y-8 shadow-lg overflow-hidden rounded-lg group transition-all duration-500 hover:shadow-xl absolute md:static"
              >
                <NuxtImg
                  :src="currentGallery?.media[0]?.url || '/images/placeholder.jpg'"
                  :alt="currentGallery?.media[0]?.name || 'Gallery image'"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out hover:brightness-105"
                />
              </div>

              <div
                v-if="currentGallery?.media"
                class="aspect-[3/4] w-36 md:w-60 z-10 shadow-xl overflow-hidden rounded-lg group transition-all duration-500 hover:shadow-2xl relative"
              >
                <NuxtImg
                  :src="currentGallery?.media[1]?.url || '/media/placeholder.jpg'"
                  :alt="currentGallery?.media[1]?.name || 'Gallery image'"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out hover:brightness-105"
                />
                <div
                  class="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-all duration-300"
                >
                  <span
                    class="opacity-0 group-hover:opacity-100 text-white font-semibold px-4 py-2 border border-white/50 rounded bg-black/30 backdrop-blur-sm transition-opacity duration-300"
                  >
                    View Gallery
                  </span>
                </div>
              </div>

              <div
                v-if="currentGallery?.media"
                class="aspect-[3/4] w-28 md:w-48 rotate-12 -translate-x-6 md:-translate-x-10 -translate-y-2 md:-translate-y-4 shadow-lg overflow-hidden rounded-lg group transition-all duration-500 hover:shadow-xl absolute md:static"
              >
                <NuxtImg
                  :src="currentGallery?.media[2]?.url || '/media/placeholder.jpg'"
                  :alt="currentGallery?.media[2]?.name || 'Gallery image'"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out hover:brightness-105"
                />
              </div>
            </div>
          </div>

          <!-- Next button -->
          <UButton
            class="hover:scale-105 active:scale-95"
            color="primary"
            size="xl"
            icon="i-heroicons-arrow-right"
            :disabled="isLastGallery"
            @click="nextGallery"
            :ui="{
              rounded: 'rounded-full',
              disabled: { color: 'gray' },
            }"
          />
        </div>

        <!-- Gallery pagination indicators -->
        <div class="flex justify-center gap-2 py-6">
          <button
            v-for="(item, index) in galleryItems"
            :key="item.id"
            @click="currentIndex = index"
            class="h-2 w-2 md:h-3 md:w-3 rounded-full transition-all duration-300 ease-in-out"
            :class="
              index === currentIndex
                ? 'bg-accent-500 scale-125 shadow-md'
                : 'bg-gray-300 hover:bg-gray-400 hover:scale-110'
            "
          ></button>
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { UButton } from '#components'
  import type { Gallery } from '~/types/models'

  const props = defineProps<{
    galleryItems: Gallery[]
  }>()

  // Current gallery index
  const currentIndex = ref(0)

  // Computed values for current gallery and navigation state
  const currentGallery = computed(() => props.galleryItems[currentIndex.value])
  const isFirstGallery = computed(() => currentIndex.value === 0)
  const isLastGallery = computed(() => currentIndex.value === props.galleryItems.length - 1)

  // Navigation functions
  function nextGallery() {
    if (!isLastGallery.value) {
      currentIndex.value++
    }
  }

  function prevGallery() {
    if (!isFirstGallery.value) {
      currentIndex.value--
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowRight') {
      nextGallery()
    } else if (e.key === 'ArrowLeft') {
      prevGallery()
    }
  }
</script>

<style></style>
