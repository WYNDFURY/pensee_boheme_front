<template>
  <FormsLoginLayout title="Create your account">
    <form class="space-y-6" action="/register" method="POST" @submit.prevent="loginService.register">
      <div>
        <label for="firstName" class="block text-sm font-medium leading-6 text-[#204534]">First Name</label>
        <div class="mt-2">
          <input id="firstName" name="firstName" type="text" autocomplete="given-name" required
            class="block w-full rounded-md border-0 p-1.5 text-[#fafafa] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#5C937A] sm:text-sm sm:leading-6">
        </div>
      </div>

      <div>
        <label for="lastName" class="block text-sm font-medium leading-6 text-[#204534]">Last Name</label>
        <div class="mt-2">
          <input id="lastName" name="lastName" type="text" autocomplete="family-name" required
            class="block w-full rounded-md border-0 p-1.5 text-[#fafafa] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#5C937A] sm:text-sm sm:leading-6">
        </div>
      </div>

      <div>
        <label for="email" class="block text-sm font-medium leading-6 text-[#204534]">Email address</label>
        <div class="mt-2">
          <input id="email" name="email" type="email" autocomplete="email" required
            class="block w-full rounded-md border-0 p-1.5 text-[#fafafa] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#5C937A] sm:text-sm sm:leading-6">
        </div>
      </div>

      <div>
        <label for="password" class="block text-sm font-medium leading-6 text-[#204534]">Password</label>
        <div class="mt-2">
          <input id="password" name="password" type="password" autocomplete="current-password" required
            class="block w-full rounded-md border-0 p-1.5 text-[#fafafa] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#5C937A] sm:text-sm sm:leading-6">
        </div>
      </div>

      <div class="grid grid-cols-3 gap-4">
        <div class="col-span-2">
          <label for="street" class="block text-sm font-medium leading-6 text-[#204534]">Street</label>
          <div class="mt-2">
            <input id="street" name="street" type="text" autocomplete="address-line1" required
              class="block w-full rounded-md border-0 p-1.5 text-[#fafafa] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#5C937A] sm:text-sm sm:leading-6">
          </div>
        </div>
        <div class="col-span-1">
          <label for="number" class="block text-sm font-medium leading-6 text-[#204534]">Number</label>
          <div class="mt-2">
            <input id="number" name="number" type="text" autocomplete="address-line2" required
              class="block w-full rounded-md border-0 p-1.5 text-[#fafafa] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#5C937A] sm:text-sm sm:leading-6">
          </div>
        </div>
      </div>

      <div>
        <label for="city" class="block text-sm font-medium leading-6 text-[#204534]">Ville</label>
        <div class="mt-2">
          <input id="city" name="city" type="text" autocomplete="address-level2" required
            class="block w-full rounded-md border-0 p-1.5 text-[#fafafa] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#5C937A] sm:text-sm sm:leading-6">
        </div>
      </div>

      <div>
        <label for="postalCode" class="block text-sm font-medium leading-6 text-[#204534]">Code Postal</label>
        <div class="mt-2">
          <input id="postalCode" name="postalCode" type="text" autocomplete="postal-code" required
            class="block w-full rounded-md border-0 p-1.5 text-[#fafafa] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#5C937A] sm:text-sm sm:leading-6">
        </div>
      </div>

      <div>
        <label for="country" class="block text-sm font-medium leading-6 text-[#204534]">Country</label>
        <div class="mt-2">
          <input id="country" name="country" type="text" autocomplete="country" required
            class="block w-full rounded-md border-0 p-1.5 text-[#fafafa] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#5C937A] sm:text-sm sm:leading-6"
            list="countryList">
          <datalist id="countryList">
            <option value="Belgium">BE</option>
            <option value="France">FR</option>
            <option value="Germany">DE</option>
          </datalist>
        </div>
      </div>

      <div class="py-3">
        <button type="submit"
          class="flex w-full justify-center rounded-md bg-[#204534] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#5C937A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5C937A]">S'enregistrer</button>
      </div>

    </form>
  </FormsLoginLayout>
</template>

<script lang="ts" setup>
const loginService = useLoginService();



</script>

<style></style>