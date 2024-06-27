<template>
  <FormsLoginLayout title="Connectez-vous à votre compte">
    <form class="space-y-6" action="#" method="POST">
      <div>
        <label for="email" class="block text-sm font-medium leading-6 text-[#204534]">Email address</label>
        <div class="mt-2">
          <input id="email" name="email" type="email" autocomplete="email" required
            class="block w-full rounded-md border-0 p-1.5 text-[#fafafa] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#5C937A] sm:text-sm sm:leading-6">
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between">
          <label for="password" class="block text-sm font-medium leading-6 text-[#204534]">Password</label>
          <div class="text-sm">
            <a href="#" class="font-semibold text-[#204534] hover:text-[#5C937A]">Forgot password?</a>
          </div>
        </div>
        <div class="mt-2">
          <input id="password" name="password" type="password" autocomplete="current-password" required
            class="block w-full rounded-md border-0 p-1.5 text-[#fafafa] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#5C937A] sm:text-sm sm:leading-6">
        </div>
      </div>

      <div>
        <button type="submit"
          class="flex w-full justify-center rounded-md bg-[#204534] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#5C937A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5C937A]">Sign
          in</button>
      </div>

      <div class="flex justify-end">
        <NuxtLink :to="{ name: 'signin' }"
          class="text-[#204534]  text-sm font-semibold leading-6 hover:text-[#5C937A] ">
          Create an
          account
        </NuxtLink>
      </div>
    </form>
  </FormsLoginLayout>
</template>

<script lang="ts" setup>

</script>

<style></style>