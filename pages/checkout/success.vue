<template>
  <div class="flex items-center justify-center h-screen ">
    <div class="text-center">
      <div class="mb-4">
        <svg class="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <h2 class="mb-2 text-3xl font-bold text-gray-800">Checkout Successful!</h2>
      <p class="mb-4 text-lg text-gray-600">Thank you for your purchase.</p>
      <nuxt-link :to="{ name: 'home' }" class="px-6 py-2 text-white bg-green-500 rounded hover:bg-green-600">Go to
        Homepage</nuxt-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Cart } from '~/types/models';

const { emptyCart } = useCartService();
const cartState = useState<Cart>('cart');
watch(cartState, (cart) => {
  if (!cart) {
    return
  }
  emptyCart();
},
  { once: true })

</script>

<style></style>