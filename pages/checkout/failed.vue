<template>
  <div class="flex items-center justify-center h-screen ">
    <div class="text-center">
      <div class="mb-4">
        <svg class="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </div>
      <h2 class="mb-2 text-3xl font-bold text-gray-800">Checkout Failed</h2>
      <p class="mb-4 text-lg text-gray-600">We were unable to process your purchase. Please try again.</p>
      <nuxt-link :to="{ name: 'cart' }" class="px-6 py-2 text-white bg-red-500 rounded hover:bg-red-600">Return to
        Checkout</nuxt-link>
    </div>
  </div>
</template>

<script lang="ts" setup>

</script>

<style></style>