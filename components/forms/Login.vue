<template>
  <FormsLoginLayout title="Connectez-vous à votre compte">
    <form class="space-y-6" @submit.prevent="loginAndRedirect">
      <div>
        <label for="email" class="block text-sm font-medium leading-6 text-[#204534]">Adresse e-mail</label>
        <div class="mt-2">
          <input id="email" name="email" type="email" autocomplete="email" v-model="user.email" required
            class="block w-full rounded-md border-0 p-1.5 text-[#fafafa] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#5C937A] sm:text-sm sm:leading-6">
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between">
          <label for="password" class="block text-sm font-medium leading-6 text-[#204534]">Mot de Passe</label>
          <div class="text-sm">
            <a href="#" class="font-semibold text-[#204534] hover:text-[#5C937A]">Mot de passe oublié?</a>
          </div>
        </div>
        <div class="mt-2">
          <input id="password" name="password" type="password" autocomplete="current-password" v-model="user.password"
            required
            class="block w-full rounded-md border-0 p-1.5 text-[#fafafa] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#5C937A] sm:text-sm sm:leading-6">
        </div>
      </div>

      <div>
        <button type="submit"
          class="flex w-full justify-center rounded-md bg-[#204534] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#5C937A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5C937A]">Se
          connecter
        </button>
      </div>

      <div class="flex justify-end">
        <NuxtLink :to="{ name: 'signup' }"
          class="text-[#204534]  text-sm font-semibold leading-6 hover:text-[#5C937A] ">
          Créer un compte
        </NuxtLink>
      </div>
    </form>
  </FormsLoginLayout>
</template>

<script lang="ts" setup>
import type { User } from '~/types/models';

const { login } = useAuthenticationService();

const user = ref<Pick<User, "email" | "password">>({
  email: '',
  password: '',
});

const loginAndRedirect = async () => {
  await login(user.value);
  const userState = useState<User>('user');
  if (!userState.value) {
    console.error('test');
    return;
  }
  navigateTo({ name: 'home' });
};

</script>

<style></style>