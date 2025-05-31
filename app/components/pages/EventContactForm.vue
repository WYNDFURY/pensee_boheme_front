<template>
  <div class="px-4 mx-auto">
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
      @submit="onSubmit"
    >
      <UButton
        label="Formulaire d'organisation d'événement"
        color="primary"
        size="xl"
        block
        class="px-8 text-xl"
      />
      <template #body>
        <UForm
          ref="formRef"
          :schema="schema"
          :state="state"
          class="space-y-6 grid grid-cols-2 justify-items-center"
          @submit="onSubmit"
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

          <UFormField label="Date de l'événement" name="eventDate" class="col-span-2">
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
        </UForm>
      </template>
      <template #footer>
        <UButton type="button" label="Envoyer" color="primary" form="eventForm" />
      </template>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
  import { UModal, UForm, UFormField, UInput, UButton, UTextarea } from '#components'
  import {} from '@kalimahapps/vue-icons'
  import * as z from 'zod'
  import type { FormSubmitEvent } from '@nuxt/ui'
  const open = ref(false)

  const schema = z.object({
    email: z.string().email('Invalid email'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    phone: z.string().optional(),
    eventDate: z.string().optional(),
    eventLocation: z.string().optional(),
    themeColors: z.string().optional(),
    message: z.string().optional(),
  })

  type Schema = z.output<typeof schema>
  const formRef = ref(null)

  const state = ref<Partial<Schema>>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    eventDate: '',
    eventLocation: '',
    themeColors: '',
    message: '',
  })

  const toast = useToast()
  async function submitForm(event: FormSubmitEvent<Schema>) {
    if (event.data !== undefined) {
      toast.add({
        title: 'Success',
        description: 'Le formulaire a été envoyé avec succès',
        color: 'success',
      })
      console.log(event.data)
    } else {
      toast.add({
        title: 'Error',
        description: "Le formulaire n'a pas été envoyé",
        color: 'error',
      })
    }
  }

  async function onSubmit(event: FormSubmitEvent<Schema>) {
    await submitForm(event)
  }

  watch(open, (newValue) => {
    console.log('Modal open state changed:', newValue)
  })
</script>

<style></style>
