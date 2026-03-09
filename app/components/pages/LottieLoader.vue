<template>
  <div class="flex items-center justify-center h-full">
    <DotLottieVue src="/lotties/loader.lottie" autoplay loop />
  </div>
</template>

<script setup>
  const DotLottieVue = defineAsyncComponent(() =>
    import('@lottiefiles/dotlottie-vue').then((m) => m.DotLottieVue),
  )
</script>
