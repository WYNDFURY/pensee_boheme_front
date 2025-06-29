<template>
  <div class="px-4 mx-auto">
    <UButton
      label="Formulaire pour créations personnalisées"
      color="primary"
      size="xl"
      block
      class="px-8 text-xl"
      @click="open = true"
    />
    <UModal
      v-model:open="open"
      title="Formulaire pour créations personnalisées"
      :close="{
        color: 'primary',
        variant: 'outline',
        class: 'rounded-full',
      }"
      :ui="{
        footer: 'justify-end',
        overlay: 'bg-black/50',
        title: 'text-black',
      }"
    >
      <template #body>
        <UForm
          ref="form"
          :schema="schema"
          :state="state"
          class="space-y-6 grid grid-cols-2 justify-items-center"
          @submit="onSubmit"
          @error="onError"
        >
          <UFormField label="Nom" name="lastName">
            <UInput v-model="state.lastName" placeholder=" nom" />
          </UFormField>

          <UFormField label="Prénom" name="firstName">
            <UInput v-model="state.firstName" placeholder=" prénom" />
          </UFormField>

          <UFormField label="Email" name="email">
            <UInput v-model="state.email" placeholder=" email" />
          </UFormField>

          <UFormField label="Téléphone" name="phone">
            <UInput v-model="state.phone" placeholder=" numéro de téléphone" />
          </UFormField>

          <UFormField label="Message" name="message" class="col-span-2 w-full">
            <UTextarea
              v-model="state.message"
              autoresize
              placeholder="Décrivez votre idée de base et vos envies pour votre commande personalisée."
              class="w-full"
              :rows="5"
              :maxrows="5"
            />
          </UFormField>

          <UFormField
            label="Info Supplémentaires"
            name="additional_info"
            class="col-span-2 w-full hp-field"
          >
            <UTextarea
              v-model="state.additional_info"
              placeholder="Informations supplémentaires (facultatif)"
              class="w-full"
            />
          </UFormField>
        </UForm>
      </template>
      <template #footer>
        <UButton type="submit" label="Envoyer" color="primary" @click="submitForm" />
      </template>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
  import { UModal, UForm, UFormField, UInput, UButton, UTextarea } from '#components'
  import * as z from 'zod'
  import type { FormErrorEvent, FormSubmitEvent } from '@nuxt/ui'

  const schema = z.object({
    email: z.string().email().min(1, 'Email requis'),
    firstName: z.string().min(1, 'Prénom requis'),
    lastName: z.string().min(1, 'Nom requis'),
    phone: z.string().min(1, 'Téléphone requis'),
    message: z
      .string()
      .max(1000, 'Message trop long (max 1000 caractères)')
      .min(1, 'Message requis'),
    additional_info: z.string().optional(),
  })

  type Schema = z.output<typeof schema>

  const state = ref<Partial<Schema>>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    message: '',
  })
  const open = ref(false)
  const form = ref()

  const toast = useToast()
  async function submitForm() {
    // Trigger form validation and submission
    await form.value.submit()
  }

  async function onError(event: FormErrorEvent) {
    if (event?.errors?.[0]?.id) {
      const element = document.getElementById(event.errors[0].id)
      element?.focus()
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  async function onSubmit(event: FormSubmitEvent<Schema>) {
    console.log('Form data:', event.data)

    const response = await $fetch<{ success: boolean; message?: string }>('/api/contact/creation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: {
        email: event.data.email,
        firstName: event.data.firstName,
        lastName: event.data.lastName,
        phone: event.data.phone,
        message: event.data.message,
        type: 'creation', // Optional: to distinguish form types
      },
    })
    console.log('Response:', response)
    if (!response.success) {
      toast.add({
        title: 'Error',
        description: "Une erreur est survenue lors de l'envoi",
        color: 'error',
      })

      throw new Error(response.message || 'Form submission failed')
    }

    toast.add({
      title: 'Success',
      description: 'Le formulaire a été envoyé avec succès',
      color: 'success',
    })

    open.value = false

    // Reset form
    Object.keys(state.value).forEach((key) => {
      state.value[key as keyof Schema] = ''
    })
  }
</script>

<style scoped>
  .hp-field {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    height: 0;
    width: 0;
    z-index: -1;
  }
</style>
