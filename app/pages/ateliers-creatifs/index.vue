<template>
  <div class="">
    <PagesBanner
      class=""
      :img-class="''"
      :text-class="' justify-end items-end mb-10 mr-10'"
      :banner-image="'/ateliers-creatifs/ateliers_banner.png'"
      :alt="'Professionnels bannière'"
      ><h1>
        Ateliers <br />
        Créatifs
      </h1>
    </PagesBanner>

    <div class="bg-primary_orange px-10 lg:px-20 py-8 text-pretty">
      <h2 class="font-bold text-center font text-2xl text-accent-500">
        Vous voulez organiser un EVJF et cherchez une idée originale ?
      </h2>
      <div class="h-px w-24 my-5 mx-auto rounded-full bg-accent-500"></div>
      <div class="flex flex-col gap-4 text-xl font-light leading-relaxed">
        <p class="mb-2">
          Ne cherchez plus et partagez un moment inoubliable avec la future mariée ! L'atelier
          d'accessoires en fleurs séchées est fait pour vous..
        </p>
        <p class="text-xl text-left font-light leading-relaxed">
          Je me déplace dans toute la région Normandie pour animer des ateliers sur le lieu de votre
          week-end.Vous choisissez le type d'accessoires ainsi que les teintes (en harmonie avec
          celles du mariage, bien sûr !), et je m'occupe de tout le matériel nécessaire pour vos
          créations.
        </p>
        <p class="text-xl text-left font-light leading-relaxed">
          JJe serai présente pour vous guider à chaque étape en vous montrant les techniques de
          fleuriste. À la fin de l'atelier, repartez avec un accessoire unique que vous pourrez
          porter le jour J, un souvenir précieux de ce week-end magique passé ensemble !
        </p>
      </div>
    </div>
    <NuxtImg
      src="/ateliers-creatifs/ateliers_1.jpg"
      alt="Pensée Bohème - Professionnels 1"
      class="mx-auto rounded-sm drop-shadow-lg opacity-80"
      loading="lazy"
    />
    <div class="h-px w-24 my-24 mx-auto rounded-full bg-accent-500"></div>
    <p class="text-center text-5xl font-light text-accent-500 my-24">
      4 Ateliers vous sont proposés
    </p>

    <div class="flex flex-col gap-20">
      <div class="relative grid grid-cols-2">
        <div class="h-screen">
          <div class="relative h-4/6 w-[25vw] z-10 bg-red-500 place-self-center">
            <!-- <NuxtImg
              src="/ateliers-creatifs/ateliers_1.jpg"
              alt="Pensée Bohème - Professionnels 2"
              class="object-cover h-full border-1 border-gray-700 rounded-sm drop-shadow-md"
              loading="lazy"
            /> -->
          </div>
          <div class="bg-primary_orange absolute text-center inset-x-0 top-1/2 -translate-y-1/2">
            <div class="w-1/2 ml-auto">
              <div
                class="w-1/2 mx-auto text-3xl font-light leading-relaxed text-pretty text-slate-900 space-y-4"
              >
                <p>{{ price }} par personne</p>
                <div class="text-center">
                  <p v-for="(sentence, index) in formattedDescription" :key="index" class="mb-1">
                    {{ sentence }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="text-center">
          <p class="pt-8 text-3xl text-accent-500">Nom produit</p>
        </div>
      </div>

      <div class="relative grid grid-cols-2">
        <div class="bg-teal-200">
          <div class="relative bg-red-500 h-96 w-1/2 mx-auto z-10">
            <NuxtImg
              src="/ateliers-creatifs/ateliers_1.jpg"
              alt="Pensée Bohème - Professionnels 2"
              class="object-cover h-full border-1 border-gray-700 rounded-sm drop-shadow-md"
              loading="lazy"
            />
          </div>
          <div class="bg-pink-400 absolute text-center inset-x-0 top-1/2 -translate-y-1/2">
            <div class="w-1/2 ml-auto">
              <div class="w-1/2 mx-auto text-xl leading-relaxed text-pretty text-slate-800">
                <p>{{ price }} par personne</p>
                <div class="text-center">
                  <p v-for="(sentence, index) in formattedDescription" :key="index" class="mb-1">
                    {{ sentence }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-amber-300 text-center">
          <p class="pt-8 text-3xl">Nom produit</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  // const { getPageProducts } = useShowPageProductsService()
  // const { data } = getPageProducts()

  // Mock data for testing
  const price = '35€'
  const description =
    "Compter 2 heures d'atelier. Un must have pour la mariée ! Si elle est assez manuelle, je recommande ce type d'accessoire."

  // Format the description text into sentences
  function formatDescription(text: string): string[] {
    if (!text) return []

    // Split by period, exclamation mark, or question mark followed by a space
    return text
      .split(/(?<=[.!?])\s+/)
      .filter((sentence) => sentence.trim() !== '')
      .map((sentence) => sentence.trim())
  }

  // Computed property with the formatted description
  const formattedDescription = formatDescription(description)
</script>

<style></style>
