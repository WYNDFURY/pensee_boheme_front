<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center"
        @click.self="$emit('close')"
        @keydown.escape="$emit('close')"
        @keydown.left="$emit('prev')"
        @keydown.right="$emit('next')"
      >
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/85" @click="$emit('close')" />

        <!-- Close button -->
        <button
          class="absolute top-4 right-4 z-10 text-white/70 hover:text-white transition-colors text-4xl leading-none p-2"
          @click="$emit('close')"
        >
          &times;
        </button>

        <!-- Previous button -->
        <button
          v-if="hasPrev"
          class="absolute left-2 md:left-6 z-10 text-white/70 hover:text-white transition-colors text-5xl leading-none p-2 select-none"
          @click.stop="$emit('prev')"
        >
          &#8249;
        </button>

        <!-- Image -->
        <div
          class="relative z-10 max-w-[90vw] max-h-[90vh] flex items-center justify-center"
          @touchstart="onTouchStart"
          @touchend="onTouchEnd"
        >
          <Transition :name="slideDirection" mode="out-in">
            <NuxtImg
              :key="currentMedia.id"
              :src="currentMedia.urls.large"
              :alt="currentMedia.name"
              class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              width="2000"
            />
          </Transition>
        </div>

        <!-- Next button -->
        <button
          v-if="hasNext"
          class="absolute right-2 md:right-6 z-10 text-white/70 hover:text-white transition-colors text-5xl leading-none p-2 select-none"
          @click.stop="$emit('next')"
        >
          &#8250;
        </button>

        <!-- Counter -->
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-white/70 text-sm">
          {{ currentIndex + 1 }} / {{ total }}
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
  import type { Media } from '~/types/models'

  const props = defineProps<{
    open: boolean
    currentMedia: Media
    currentIndex: number
    total: number
    hasPrev: boolean
    hasNext: boolean
  }>()

  const emit = defineEmits<{
    close: []
    prev: []
    next: []
  }>()

  const slideDirection = ref('slide-right')
  let touchStartX = 0

  // Track direction for slide transition
  watch(
    () => props.currentIndex,
    (newVal, oldVal) => {
      slideDirection.value = newVal > oldVal ? 'slide-right' : 'slide-left'
    },
  )

  // Swipe support for mobile
  function onTouchStart(e: TouchEvent) {
    touchStartX = e.changedTouches[0].clientX
  }

  function onTouchEnd(e: TouchEvent) {
    const diff = touchStartX - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0 && props.hasNext) emit('next')
      else if (diff < 0 && props.hasPrev) emit('prev')
    }
  }

  // Focus trap for keyboard events
  const handleKeydown = (e: KeyboardEvent) => {
    if (!props.open) return
    if (e.key === 'Escape') emit('close')
    if (e.key === 'ArrowLeft' && props.hasPrev) emit('prev')
    if (e.key === 'ArrowRight' && props.hasNext) emit('next')
  }

  onMounted(() => window.addEventListener('keydown', handleKeydown))
  onUnmounted(() => window.removeEventListener('keydown', handleKeydown))

  // Prevent body scroll when lightbox is open
  watch(
    () => props.open,
    (isOpen) => {
      document.body.style.overflow = isOpen ? 'hidden' : ''
    },
  )
</script>

<style scoped>
  .lightbox-enter-active,
  .lightbox-leave-active {
    transition: opacity 0.3s ease;
  }
  .lightbox-enter-from,
  .lightbox-leave-to {
    opacity: 0;
  }

  .slide-right-enter-active,
  .slide-right-leave-active,
  .slide-left-enter-active,
  .slide-left-leave-active {
    transition:
      opacity 0.25s ease,
      transform 0.25s ease;
  }
  .slide-right-enter-from {
    opacity: 0;
    transform: translateX(40px);
  }
  .slide-right-leave-to {
    opacity: 0;
    transform: translateX(-40px);
  }
  .slide-left-enter-from {
    opacity: 0;
    transform: translateX(-40px);
  }
  .slide-left-leave-to {
    opacity: 0;
    transform: translateX(40px);
  }
</style>
