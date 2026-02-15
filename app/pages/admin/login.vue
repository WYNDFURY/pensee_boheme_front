<template>
  <div class="min-h-screen flex items-center justify-center bg-bgcolor">
    <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
      <h1 class="text-3xl font-semibold text-center mb-6 text-accent-500">
        Admin Pensée Bohème
      </h1>

      <UForm
        :schema="schema"
        :state="state"
        @submit="onSubmit"
        class="space-y-4"
      >
        <UFormField label="Email" name="email">
          <UInput v-model="state.email" type="email" />
        </UFormField>

        <UFormField label="Mot de passe" name="password">
          <UInput v-model="state.password" type="password" placeholder="mot de passe" />
        </UFormField>

        <UButton
          type="submit"
          label="Se connecter"
          color="primary"
          block
          :loading="loading"
        />
      </UForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  layout: false, // No default layout for login
  ssr: false,    // Client-side only
})

const { login } = useAuth()
const toast = useToast()
const loading = ref(false)

const schema = z.object({
  email: z.string().email('Email invalide').min(1, 'Email requis'),
  password: z.string().min(1, 'Mot de passe requis'),
})

type Schema = z.output<typeof schema>

const state = ref<Partial<Schema>>({
  email: '',
  password: '',
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true
  try {
    await login(event.data.email, event.data.password)
    toast.add({
      title: 'Connexion réussie',
      color: 'success',
    })
    navigateTo('/admin/dashboard')
  } catch (error: any) {
    toast.add({
      title: 'Erreur de connexion',
      description: error?.data?.errors?.email?.[0] || 'Identifiants invalides',
      color: 'error',
    })
  } finally {
    loading.value = false
  }
}
</script>
