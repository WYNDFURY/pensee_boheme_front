<template>
  <FormsLoginLayout title="Enregistrez-vous">
    <form class="space-y-6" @submit.prevent="registerAndRedirect">
      <div>
        <label for="first_name" class="block text-sm font-medium leading-6 text-[#204534]">Nom</label>
        <div class="mt-2">
          <input id="first_name" name="first_name" type="text" autocomplete="given-name" v-model="user.first_name"
            required
            class="block w-full rounded-md border-0 p-1.5 text-[#fafafa] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#5C937A] sm:text-sm sm:leading-6">
        </div>
      </div>

      <div>
        <label for="last_name" class="block text-sm font-medium leading-6 text-[#204534]">Prénom</label>
        <div class="mt-2">
          <input id="last_name" name="last_name" type="text" autocomplete="family-name" v-model="user.last_name"
            required
            class="block w-full rounded-md border-0 p-1.5 text-[#fafafa] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#5C937A] sm:text-sm sm:leading-6">
        </div>
      </div>

      <div>
        <label for="email" class="block text-sm font-medium leading-6 text-[#204534]">Adresse Email</label>
        <div class="mt-2">
          <input id="email" name="email" type="email" autocomplete="email" v-model="user.email" required
            class="block w-full rounded-md border-0 p-1.5 text-[#fafafa] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#5C937A] sm:text-sm sm:leading-6">
        </div>
      </div>

      <div>
        <label for="password" class="block text-sm font-medium leading-6 text-[#204534]">Mot de passe</label>
        <div class="mt-2">
          <input id="password" name="password" type="password" autocomplete="new-password" v-model="user.password"
            required
            class="block w-full rounded-md border-0 p-1.5 text-[#fafafa] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#5C937A] sm:text-sm sm:leading-6">
        </div>
      </div>

      <div>
        <label for="passwordConfirmation" class="block text-sm font-medium leading-6 text-[#204534]">Confirmez le mot de
          passe</label>
        <div class="mt-2">
          <input id="passwordConfirmation" name="password_confirmation" type="password" required
            class="block w-full rounded-md border-0 p-1.5 text-[#fafafa] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#5C937A] sm:text-sm sm:leading-6">
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
import type { User } from '~/types/models';

const { register } = useAuthenticationService();



const user = ref<Pick<User, "first_name" | "last_name" | "email" | "password">>({
  first_name: "",
  last_name: "",
  email: "",
  password: "",
});

const registerAndRedirect = async () => {
  const response = await register(user.value);
  if (response.error.value) {
    return;
  }
  navigateTo({ name: 'login' });
};

</script>

<style></style>