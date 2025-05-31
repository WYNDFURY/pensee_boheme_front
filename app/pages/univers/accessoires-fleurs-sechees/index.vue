<template>
  <main role="main">
    <div class="sr-only">
      Accessoires en fleurs séchées Pensée Bohème : bijoux floraux, couronnes, peignes et
      accessoires de cheveux sur-mesure pour mariées. Créations artisanales uniques par Cécile
      Devaux en Normandie.
    </div>

    <PagesBanner
      class="md:text-right"
      :text-class="'md:justify-end md:mr-10'"
      :banner-image="'/AFS/AFS_Banner.jpg'"
      :alt="'Bannière accessoires fleurs séchées Pensée Bohème - atelier création bijoux floraux mariée Normandie'"
      ><h1 id="accessoires-title" itemscope itemtype="https://schema.org/Product" itemprop="name">
        Accessoires <br />
        Fleurs <br />
        Séchées
      </h1></PagesBanner
    >

    <section
      class="flex flex-col items-center text-balance"
      aria-labelledby="accessoires-description"
      aria-label="Présentation des accessoires en fleurs séchées"
      itemscope
      itemtype="https://schema.org/ProductGroup"
    >
      <header>
        <div
          id="accessoires-description"
          class="my-10 text-center font-light leading-relaxed px-10 md:px-20"
          itemprop="description"
        >
          <p class="text-xl 2xl:text-2xl xl:mx-28 2xl:mx-68">
            Passionnée par la beauté et la pérennité des fleurs séchées, je vous invite à découvrir
            des accessoires uniques, conçus avec amour et attention. <br />
            Chaque création est le reflet d'une inspiration personnelle, où les couleurs sont
            soigneusement choisies pour s'harmoniser parfaitement à vos désirs.
          </p>
        </div>
      </header>
      <figure
        class="grid grid-cols-3 gap-[1.5vw] px-[3vw] w-full"
        aria-label="Galerie d'accessoires en fleurs séchées"
      >
        <NuxtImg
          src="/AFS/AFS_1.jpg"
          alt="Couronne de fleurs séchées artisanale Pensée Bohème - accessoire mariée bohème chic en Normandie"
          class="w-full aspect-[4/8] md:aspect-[3/4] object-cover rounded-r-2xl rounded-l-[60px] md:rounded-l-[100px] xl:rounded-l-[200px] opacity-80"
          format="webp"
          quality="90"
          loading="lazy"
          itemprop="image"
        />
        <NuxtImg
          src="/AFS/AFS_2.jpg"
          alt="Peigne fleurs séchées mariage Pensée Bohème - bijou floral sur-mesure mariée Normandie"
          class="w-full aspect-[4/8] md:aspect-[3/4] object-cover rounded-2xl opacity-90"
          format="webp"
          quality="90"
          loading="lazy"
          itemprop="image"
        />
        <NuxtImg
          src="/AFS/AFS_3.jpg"
          alt="Accessoires cheveux fleurs séchées Pensée Bohème - création florale artisanale mariage bohème"
          class="w-full aspect-[4/8] md:aspect-[3/4] object-cover object-[15%_0%] rounded-l-2xl rounded-r-[60px] md:rounded-r-[100px] xl:rounded-r-[200px] opacity-80"
          format="webp"
          quality="90"
          loading="lazy"
          itemprop="image"
        />
      </figure>
    </section>
    <div class="mx-auto py-8 w-2/3" role="separator" aria-hidden="true">
      <ClientOnly>
        <USeparator
          orientation="horizontal"
          class="h-10"
          :avatar="{ src: '/PB_pensee_logo.svg', size: 'xl' }"
        />
      </ClientOnly>
    </div>
    <section
      class="flex flex-col gap-10"
      aria-labelledby="details-title"
      aria-label="Détails et personnalisation des accessoires"
      itemscope
      itemtype="https://schema.org/Service"
    >
      <header class="px-20 text-center">
        <h2
          id="details-title"
          class="font-semibold text-2xl text-accent-500 2xl:text-4xl"
          itemprop="name"
        >
          Le souci du détail
        </h2>
        <p
          class="text-xl font-light leading-relaxed 2xl:text-2xl xl:mx-28 2xl:mx-68"
          itemprop="description"
        >
          Pour la mariée ou son cortège, pour un événement particulier ou simplement pour vous faire
          plaisir. <br />Je mets tout en œuvre pour que vos accessoires se marient parfaitement avec
          vos envies. <br />Tous les accessoires sont créés sur mesure, selon les couleurs que vous
          désirez.
        </p>
      </header>

      <section
        aria-label="Catalogue des accessoires disponibles"
        itemscope
        itemtype="https://schema.org/ItemList"
      >
        <ProductsList v-if="data" :page="data.data" />
      </section>
    </section>
  </main>
</template>

<script lang="ts" setup>
  const { getPageProducts } = useShowPageProductsService()
  const { data } = getPageProducts()
  useSeoMeta({
    title: 'Accessoires Fleurs Séchées - Pensée Bohème | Bijoux Floraux Mariée Normandie',
    description:
      "Créations artisanales d'accessoires en fleurs séchées par Pensée Bohème : couronnes, peignes, bijoux floraux sur-mesure pour mariées et événements. Atelier en Normandie, livraison France.",
    keywords:
      'accessoires fleurs séchées, bijoux floraux mariée, couronne fleurs séchées, peigne mariage, accessoires cheveux mariée, pensée bohème normandie',

    ogTitle: 'Accessoires Fleurs Séchées Pensée Bohème - Bijoux Floraux Mariée',
    ogDescription:
      "Découvrez nos créations uniques d'accessoires en fleurs séchées : couronnes, peignes, bijoux floraux sur-mesure pour mariées. Atelier artisanal en Normandie.",
    ogImage: 'https://pensee-boheme.fr/AFS/AFS_Banner.jpg',
    ogUrl: 'https://pensee-boheme.fr/univers/accessoires-fleurs-sechees',

    twitterCard: 'summary_large_image',
    twitterTitle: 'Accessoires Fleurs Séchées - Bijoux Floraux Mariée Normandie',
    twitterDescription:
      "Créations artisanales d'accessoires en fleurs séchées pour mariées et événements",
    twitterImage: 'https://pensee-boheme.fr/AFS/AFS_Banner.jpg',
  })
  // Structured data for dried flower accessories
  useSchemaOrg([
    defineLocalBusiness({
      name: 'Pensée Bohème',
      description:
        "Atelier de création d'accessoires en fleurs séchées pour mariées et événements en Normandie",
      image: 'https://pensee-boheme.fr/AFS/AFS_Banner.jpg',
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
      { name: 'Univers', item: 'https://pensee-boheme.fr/univers' },
      {
        name: 'Accessoires Fleurs Séchées',
        item: 'https://pensee-boheme.fr/univers/accessoires-fleurs-sechees',
      },
    ]),
  ])
</script>
