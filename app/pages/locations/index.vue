<template>
  <div class="py-10 text-pretty">
    <section class="flex flex-col gap-10">
      <h1
        class="uppercase font-light text-5xl md:text-6xl xl:text-7xl text-center font-['Kumbh_sans']"
      >
        Locations
      </h1>
      <div
        class="flex flex-col text-center text-lg lg:text-xl leading-relaxed mx-10 xl:mx-28 2xl:mx-68"
      >
        <p>
          Chez Pensée Bohème vous trouverez un large choix d'éléments de décoration disponibles à la
          location.
        </p>
        <p>
          La location de vos éléments décoratifs vous facilitera la vie et vous évitera des dépenses
          inutiles.
        </p>
        <p>
          La livraison, l'installation et désinstallation sont à voir ensemble selon vos besoins.
        </p>
        <p>
          Les différents éléments disponibles à la location sont réservés aux clients qui demandent
          une prestation florale.
        </p>
        <p>
          Un chèque de caution vous sera demandé avant l'événement et restitué après vérification du
          bon fonctionnement des différents éléments.
        </p>
      </div>
    </section>
    <ProductsList v-if="data" :page="data.data" />
  </div>
</template>

<script lang="ts" setup>
  const { getPageProducts } = useShowPageProductsService()
  const { data } = getPageProducts()
</script>

<style></style>
