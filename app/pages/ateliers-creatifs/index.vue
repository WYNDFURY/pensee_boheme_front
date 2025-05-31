<template>
  <main role="main">
    <div class="sr-only">
      Ateliers créatifs EVJF Pensée Bohème : animation d'ateliers fleurs séchées pour enterrements
      de vie de jeune fille en Normandie. Créez vos accessoires de mariage lors d'un moment
      inoubliable entre amies.
    </div>

    <PagesBanner
      class=""
      :img-class="''"
      :text-class="' justify-end items-end mb-10 mr-10'"
      :banner-image="'/ateliers-creatifs/ateliers_banner.jpg'"
<<<<<<< HEAD
      :alt="'Professionnels bannière'"
    >
      <h1>
=======
      :alt="'Bannière ateliers créatifs EVJF Pensée Bohème - animation atelier fleurs séchées enterrement vie jeune fille Normandie'"
      ><h1 id="ateliers-title" itemscope itemtype="https://schema.org/Service" itemprop="name">
>>>>>>> develop
        Ateliers <br />
        Créatifs
      </h1>
    </PagesBanner>

    <section
      class="bg-primary_orange px-10 lg:px-20 py-8 text-pretty"
      aria-labelledby="evjf-title"
      aria-label="Présentation des ateliers créatifs pour EVJF"
      itemscope
      itemtype="https://schema.org/Event"
    >
      <header>
        <h2
          id="evjf-title"
          class="font-bold text-center font text-2xl text-accent-500"
          itemprop="name"
        >
          Vous voulez organiser un EVJF et cherchez une idée originale ?
        </h2>
        <div
          class="h-px w-24 my-5 mx-auto rounded-full bg-accent-500"
          role="separator"
          aria-hidden="true"
        ></div>
      </header>
      <div
        class="flex flex-col gap-4 text-xl font-light leading-relaxed xl:mx-28 2xl:mx-68"
        itemprop="description"
      >
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
    </section>

    <figure aria-label="Atelier créatif en cours - création d'accessoires en fleurs séchées">
      <NuxtImg
        src="/ateliers-creatifs/ateliers_1.jpg"
        alt="Atelier créatif fleurs séchées Pensée Bohème - participantes créant accessoires mariage EVJF Normandie"
        placeholder=""
        class="mx-auto rounded-sm drop-shadow-lg opacity-80"
        loading="lazy"
        itemprop="image"
      />
    </figure>

    <div
      class="h-px w-24 my-24 mx-auto rounded-full bg-accent-500"
      role="separator"
      aria-hidden="true"
    ></div>

    <section
      aria-label="Liste des ateliers disponibles"
      itemscope
      itemtype="https://schema.org/ItemList"
    >
      <AteliersList v-if="data" :page="data.data" />
    </section>
  </main>
</template>

<script setup lang="ts">
  const { getPageProducts } = useShowPageProductsService()
  const { data } = getPageProducts()

  useSeoMeta({
    title: 'Ateliers Créatifs EVJF - Pensée Bohème | Animation Fleurs Séchées Normandie',
    description:
      "Ateliers créatifs pour EVJF en Normandie par Pensée Bohème : créez vos accessoires de mariage en fleurs séchées lors d'un moment unique entre amies. Animation à domicile, matériel fourni.",
    keywords:
      'atelier créatif EVJF, enterrement vie jeune fille normandie, atelier fleurs séchées, animation EVJF, création accessoires mariage, pensée bohème normandie',

    ogTitle: 'Ateliers Créatifs EVJF Pensée Bohème - Animation Fleurs Séchées',
    ogDescription:
      "Organisez un EVJF inoubliable avec nos ateliers créatifs ! Créez vos accessoires de mariage en fleurs séchées lors d'une animation unique en Normandie.",
    ogImage: 'https://pensee-boheme.fr/ateliers-creatifs/ateliers_banner.jpg',
    ogUrl: 'https://pensee-boheme.fr/ateliers-creatifs',

    twitterCard: 'summary_large_image',
    twitterTitle: 'Ateliers Créatifs EVJF - Animation Fleurs Séchées Normandie',
    twitterDescription:
      'EVJF original en Normandie : ateliers créatifs fleurs séchées pour créer vos accessoires de mariage',
    twitterImage: 'https://pensee-boheme.fr/ateliers-creatifs/ateliers_banner.jpg',
  })

  // Structured data for creative workshops
  useSchemaOrg([
    defineLocalBusiness({
      name: 'Pensée Bohème',
      description:
        "Atelier d'animation d'ateliers créatifs EVJF en fleurs séchées pour enterrements de vie de jeune fille en Normandie",
      image: 'https://pensee-boheme.fr/ateliers-creatifs/ateliers_banner.jpg',
      address: {
        '@type': 'PostalAddress',
        streetAddress: "316 route du Parc d'Anxtot",
        addressLocality: 'Beuzeville-la-Grenier',
        postalCode: '76210',
        addressRegion: 'Normandie',
        addressCountry: 'FR',
      },
      telephone: '+33614643584',
      email: 'penseeboheme76@gmail.com',
      url: 'https://pensee-boheme.fr',
      sameAs: ['https://www.facebook.com/penseeboheme76'],
      founder: {
        '@type': 'Person',
        name: 'Cécile Devaux',
      },
      areaServed: ['Normandie', 'Seine-Maritime', 'France'],
    }),
  ])

  // Breadcrumb Schema
  useSchemaOrg([
    defineBreadcrumb([
      { name: 'Accueil', item: 'https://pensee-boheme.fr/home' },
      { name: 'Ateliers Créatifs', item: 'https://pensee-boheme.fr/ateliers-creatifs' },
    ]),
  ])
</script>

<style></style>
