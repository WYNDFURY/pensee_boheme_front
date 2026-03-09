<template>
  <div class="relative bg-bgcolor text-white overflow-hidden">
    <NuxtImg
      :src="bannerImage"
      :alt="alt"
      placeholder=""
      class="w-full h-[20vh] md:h-[50vh] lg:h-[60vh] xl:h-[70vh] opacity-80 object-cover scale-110"
      loading="eager"
      fetchpriority="high"
      :class="imgClass"
      :style="{ transform: `scale(1.1) translateY(${parallaxOffset}px)` }"
    />
    <div
      class="text-[3vh] md:text-[6vh] lg:text-[8vh] absolute inset-0 flex items-center justify-center font-medium font-['Source_Serif_4'] uppercase italic leading-tight tracking-[0.5em] drop-shadow-sm"
      :class="textClass"
    >
      <slot/>
    </div>
  </div>
</template>

<script lang="ts" setup>
  defineProps({
    bannerImage: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      default: 'Banner image',
    },
    textClass: {
      type: String,
      default: '',
    },
    imgClass: {
      type: String,
      default: '',
    },
  })

  const parallaxOffset = ref(0)

  if (import.meta.client) {
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    let ticking = false

    function onScroll() {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        parallaxOffset.value = window.scrollY * 0.25
        ticking = false
      })
    }

    onMounted(() => {
      if (!isMobile) {
        window.addEventListener('scroll', onScroll, { passive: true })
      }
    })
    onUnmounted(() => window.removeEventListener('scroll', onScroll))
  }
</script>
