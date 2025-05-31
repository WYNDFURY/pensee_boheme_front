<template>
  <main class="py-10 text-pretty" role="main">
    <div class="sr-only">
      Location d'éléments décoratifs chez Pensée Bohème : arches, centres de table, vases, bougies
      et accessoires pour mariages et événements. Service complet avec livraison, installation et
      désinstallation en Normandie.
    </div>

    <section
      class="flex flex-col gap-10"
      aria-labelledby="locations-title"
      aria-label="Service de location d'éléments décoratifs"
      itemscope
      itemtype="https://schema.org/Service"
    >
      <header>
        <h1
          id="locations-title"
          class="uppercase font-light text-5xl md:text-6xl xl:text-7xl text-center font-['Kumbh_sans']"
          itemprop="name"
        >
          Locations
        </h1>
      </header>
      <div
        class="flex flex-col text-center text-lg lg:text-xl leading-relaxed mx-10 xl:mx-28 2xl:mx-68"
        role="region"
        aria-label="Description du service de location"
        itemprop="description"
      >
        <p>
          Chez Pensée Bohème vous trouverez un large choix d'éléments de décoration disponibles à la
          location.
        </p>
        <p>
          La location de vos éléments décoratifs vous facilitera la vie et vous évitera des dépenses
          inutiles.
        </p>
        <p itemprop="serviceType">
          La livraison, l'installation et désinstallation sont à voir ensemble selon vos besoins.
        </p>
        <p>
          Les différents éléments disponibles à la location sont réservés aux clients qui demandent
          une prestation florale.
        </p>
        <p itemprop="termsOfService">
          Un chèque de caution vous sera demandé avant l'événement et restitué après vérification du
          bon fonctionnement des différents éléments.
        </p>
      </div>
    </section>
    <section
      aria-label="Catalogue des éléments disponibles à la location"
      itemscope
      itemtype="https://schema.org/ItemList"
    >
      <ProductsList v-if="data" :page="data.data" />
    </section>
  </main>
</template>

<script lang="ts" setup>
  const { getPageProducts } = useShowPageProductsService()
  const { data } = getPageProducts()

  useSeoMeta({
    title:
      'Location Éléments Décoratifs - Pensée Bohème Fleuriste Normandie | Arches, Centres de Table',
    description:
      'Louez vos éléments décoratifs chez Pensée Bohème : arches florales, centres de table, vases, bougies, chandeliers. Service complet avec livraison, installation et désinstallation pour mariages et événements en Normandie.',
    keywords:
      'location éléments décoratifs normandie, location arches florales, location centres de table mariage, location vases fleurs, location décoration événement, pensée bohème location, fleuriste location normandie, décoration mariage location, accessoires floraux location',
    ogTitle: 'Location Éléments Décoratifs Pensée Bohème - Service Complet Normandie',
    ogDescription:
      "Large choix d'éléments décoratifs à louer : arches, centres de table, vases. Service avec livraison, installation et désinstallation pour vos événements.",
    ogImage: 'https://penseeboheme.fr/mariages/mariages_1.jpg',
    ogUrl: 'https://penseeboheme.fr/locations',

    twitterCard: 'summary_large_image',
    twitterTitle: 'Location Décoration Mariage - Pensée Bohème Normandie',
    twitterDescription: 'Louez vos éléments décoratifs floraux avec service complet en Normandie',
    twitterImage: 'https://penseeboheme.fr/mariages/mariages_1.jpg',
  }) // Enhanced structured data for rental service
  useSchemaOrg([
    defineLocalBusiness({
      name: 'Pensée Bohème',
      description:
        "Service de location d'éléments décoratifs pour mariages et événements : arches florales, centres de table, vases, bougies, chandeliers avec livraison, installation et désinstallation",
      image: 'https://penseeboheme.fr/mariages/mariages_1.jpg',
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
      url: 'https://penseeboheme.fr',
      sameAs: ['https://www.facebook.com/penseeboheme76'],
      priceRange: '€€',
      founder: {
        '@type': 'Person',
        name: 'Cécile Devaux',
      },
      areaServed: ['Beuzeville-la-Grenier', 'Le Havre', 'Rouen', 'Normandie', 'Seine-Maritime'],
    }),
    {
      '@type': 'Service',
      name: "Location d'Éléments Décoratifs Floraux",
      description:
        "Service complet de location d'éléments décoratifs avec livraison, installation et désinstallation pour mariages et événements",
      serviceType: ['Location', 'Livraison', 'Installation', 'Désinstallation'],
      provider: {
        '@type': 'LocalBusiness',
        name: 'Pensée Bohème',
      },
      areaServed: ['Beuzeville-la-Grenier', 'Le Havre', 'Rouen', 'Normandie', 'Seine-Maritime'],
      audience: {
        '@type': 'Audience',
        audienceType: 'Clients prestations florales',
      },
    },
  ])

  // Breadcrumb Schema
  useSchemaOrg([
    defineBreadcrumb([
      { name: 'Accueil', item: 'https://pensee-boheme.fr/home' },
      { name: 'Locations', item: 'https://pensee-boheme.fr/locations' },
    ]),
  ])
</script>

<style></style>
