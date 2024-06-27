<template>
  <div class="flex min-h-full flex-col justify-center px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h1 class="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-[#204534]">Pensée Bohème</h1>
      <h2 class="mt-10 text-center text-xl font-bold leading-9 tracking-tight text-[#204534]">
        {{ title }}
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <slot>

      </slot>
    </div>
  </div>
</template>

<script lang="ts" setup>

const { title } = defineProps<{
  title: string;
}>();

</script>

<style></style>