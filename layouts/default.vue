<template>
  <div class="bg-[#E9C8C3] min-h-screen flex flex-col font-serif">
    <LayoutHeader />
    <main class="flex-grow container mx-auto px-4 py-8">
      <slot />
    </main>
    <LayoutFooter />
  </div>
</template>


<style scoped>
.app {
  font-family: 'Cormorant Garamond', serif;
}
</style>