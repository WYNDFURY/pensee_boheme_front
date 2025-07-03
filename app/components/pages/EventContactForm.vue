<template>
  <div class="px-4 mx-auto">
    <UButton
      label="Formulaire d'organisation d'événement"
      color="primary"
      size="xl"
      block
      class="px-8 text-xl"
      @click="open = true"
    />
    <UModal
      v-model:open="open"
      title="Formulaire d'organisation d'événement"
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

          <UFormField
            label="Estimation de la date de l'événement"
            name="eventDate"
            class="col-span-2 flex flex-col items-center"
          >
            <UInput v-model="state.eventDate" type="date" />
          </UFormField>

          <UFormField label="Lieu de l'événement" name="eventLocation" class="col-span-2 w-full">
            <UInput
              v-model="state.eventLocation"
              placeholder="Lieu de votre événement"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Thème / Couleurs" name="themeColors" class="col-span-2 w-full">
            <UInput
              v-model="state.themeColors"
              placeholder="Thème ou couleurs souhaitées"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Message" name="message" class="col-span-2 w-full">
            <UTextarea
              v-model="state.message"
              autoresize
              placeholder="Décrivez votre demande"
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
  import PenseeBohemeCredentials from '~/api/PenseeBohemeCredentials'

  const apiKey = new PenseeBohemeCredentials().apiKey
  type Schema = z.output<typeof schema>
  const open = ref(false)
  const form = ref()
  const toast = useToast()



  const schema = z.object({
    email: z.string().email().min(1, 'Email requis'),
    firstName: z.string().min(1, 'Prénom requis'),
    lastName: z.string().min(1, 'Nom requis'),
    phone: z.string().min(1, 'Téléphone requis'),
    eventDate: z.string().min(1, "Date de l'événement requise"),
    eventLocation: z.string().min(1, "Lieu de l'événement requis"),
    themeColors: z.string().optional(),
    message: z
      .string()
      .max(1000, 'Message trop long (max 1000 caractères)')
      .min(1, 'Message requis'),
    additional_info: z.string().optional(),
  })

  const state = ref<Partial<Schema>>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    eventDate: '',
    eventLocation: '',
    themeColors: '',
    message: '',
    additional_info: '',
  })
  
  async function submitForm() {
    await form.value.submit()
  }

  async function onError(event: FormErrorEvent) {
    console.log(event.errors)
    if (event?.errors?.[0]?.id) {
      const element = document.getElementById(event.errors[0].id)
      element?.focus()
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

    async function onSubmit(event: FormSubmitEvent<Schema>) {
    try {
      console.log('Form data:', event.data)   

    const response = await $fetch<{ success: boolean; message?: string}>(`${apiKey}/contact/event`, {
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
        eventDate: event.data.eventDate,
        eventLocation: event.data.eventLocation,
        themeColors: event.data.themeColors,
        message: event.data.message,
        additional_info: event.data.additional_info,
        type: 'creation', // Optional: to distinguish form types
      },
    })
    
    if (response.success == false) {
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
    } catch (error) {
      console.error('Form submission error:', error)
      toast.add({
        title: 'Error',
        description: 'Une erreur est survenue, veuillez vérifier les informations entrées.',
        color: 'error',
      })
    }
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
