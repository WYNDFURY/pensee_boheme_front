<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">

const { checkIfAuth } = useUserService();
const { fetchAndSetCart } = useCartService();

callOnce(() => {
  checkIfAuth();
  fetchAndSetCart();
});

</script>