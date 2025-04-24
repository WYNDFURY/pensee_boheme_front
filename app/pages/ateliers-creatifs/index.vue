<template>
  <div class="">
    <PagesBanner
      class=""
      :img-class="''"
      :text-class="' justify-end items-end mb-10 mr-10'"
      :banner-image="'/ateliers-creatifs/ateliers_banner.jpg'"
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
      <div class="flex flex-col gap-4 text-xl font-light leading-relaxed xl:mx-28 2xl:mx-68">
        <p>
          Ne cherchez plus et partagez un moment inoubliable avec la future mariée ! L'atelier
          d'accessoires en fleurs séchées est fait pour vous..
        </p>
        <p>
          Je me déplace dans toute la région Normandie pour animer des ateliers sur le lieu de votre
          week-end. <br />
          Vous choisissez le type d'accessoires ainsi que les teintes (en harmonie avec celles du
          mariage, bien sûr !), et je m'occupe de tout le matériel nécessaire pour vos créations.
        </p>
        <p>
          Un minimum de 4 participantes est demandé, vous pouvez choisir deux types d'accessoires
          différents lors de l'atelier.
        </p>
        <p>
          Je serai présente pour vous guider à chaque étape en vous montrant les techniques de
          fleuriste. <br />
          À la fin de l'atelier, repartez avec un accessoire unique que vous pourrez porter le jour
          du mariage, un souvenir précieux de ce week-end magique passé ensemble !
        </p>
      </div>
    </div>
    <NuxtImg
      src="/ateliers-creatifs/ateliers_1.jpg"
      alt="Pensée Bohème - Professionnels 1"
      placeholder=""
      class="mx-auto rounded-sm drop-shadow-lg opacity-80"
      loading="lazy"
    />
    <div class="h-px w-24 my-24 mx-auto rounded-full bg-accent-500"></div>
    <AteliersList v-if="data" :page="data.data" />
  </div>
</template>

<script setup lang="ts">
  const { getPageProducts } = useShowPageProductsService()
  const { data } = getPageProducts()
</script>

<style></style>
