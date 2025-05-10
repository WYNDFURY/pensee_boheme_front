<template>
  <div class="px-4 mx-auto">
    <UModal
      v-model:open="open"
      title="Formulaire pour détails personnalisés"
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
        label="Formulaire pour détails personnalisés"
        color="primary"
        size="xl"
        block
        class="px-8 text-xl"
      />
      <template #body>
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-6 grid grid-cols-2 justify-items-center"
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
              placeholder="Décrivez votre idée de base et vos envies pour la création du détail personnalisé."
              class="w-full"
              :rows="5"
              :maxrows="5"
            />
          </UFormField>
        </UForm>
      </template>
      <template #footer>
        <UButton type="submit" label="Submit" color="primary" @click="open = false" />
      </template>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
  import { UModal, UForm, UFormField, UInput, UButton, UTextarea } from '#components'
  import {} from '@kalimahapps/vue-icons'
  import * as z from 'zod'
  import type { FormSubmitEvent } from '@nuxt/ui'

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

  const state = reactive<Partial<Schema>>({
    email: undefined,
    firstName: undefined,
    lastName: undefined,
    phone: undefined,
    eventDate: undefined,
    eventLocation: undefined,
    themeColors: undefined,
    message: undefined,
  })
  const open = ref(false)

  const toast = useToast()
  async function submitForm() {
    toast.add({
      title: 'Success',
      description: 'Le formulaire a été envoyé avec succès',
      color: 'success',
    })
  }

  async function onSubmit(event: FormSubmitEvent<Schema>) {
    await submitForm()
    console.log(event.data)
  }
</script>

<style></style>
