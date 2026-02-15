<template>
  <main role="main">
    <div class="sr-only">
      Détails personnalisés et cadeaux invités Pensée Bohème : créations florales sur-mesure pour
      mariages et événements. Petites attentions personnalisées et cadeaux d'invités uniques en
      Normandie.
    </div>

    <PagesBanner
      class="md:text-left justify-start"
      :text-class="'md:justify-start md:ml-10'"
      :banner-image="'/DPCI/DPCI_Banner.jpg'"
      :alt="'Bannière détails personnalisés et cadeaux invités Pensée Bohème - créations florales sur-mesure mariage Normandie'"
      ><h1 id="cadeaux-title" itemscope itemtype="https://schema.org/Product" itemprop="name">
        Détails <br >
        personnalisés <br >
        & <br >
        cadeaux <br >
        invités
      </h1>
    </PagesBanner>

    <section
      aria-labelledby="cadeaux-title"
      aria-label="Catalogue des détails personnalisés et cadeaux d'invités"
      itemscope
      itemtype="https://schema.org/ItemList"
    >
      <ProductsList v-if="data" :page="data.data" />
    </section>
  </main>
</template>

<script setup lang="ts">
  const { getPageProducts } = useShowPageProductsService()
  const { data } = getPageProducts()
  useSeoMeta({
    title:
      'Détails Personnalisés & Cadeaux Invités - Pensée Bohème | Créations Florales Mariage Normandie',
    description:
      "Créations florales personnalisées pour mariages et événements par Pensée Bohème : petites attentions, cadeaux d'invités, détails sur-mesure. Atelier artisanal en Normandie, livraison France.",
    keywords:
      'cadeaux invités mariage, détails personnalisés mariage, créations florales sur mesure, petites attentions mariage, cadeaux personnalisés événement, pensée bohème normandie',

    ogTitle: 'Détails Personnalisés & Cadeaux Invités Pensée Bohème - Créations Florales',
    ogDescription:
      "Découvrez nos créations florales personnalisées : cadeaux d'invités, petites attentions et détails sur-mesure pour vos mariages et événements. Atelier en Normandie.",
    ogImage: 'https://pensee-boheme.fr/DPCI/DPCI_Banner.jpg',
    ogUrl: 'https://pensee-boheme.fr/univers/cadeaux-invites',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Cadeaux Invités & Détails Personnalisés - Pensée Bohème Normandie',
    twitterDescription:
      "Créations florales personnalisées pour mariages : cadeaux d'invités et détails sur-mesure",
    twitterImage: 'https://pensee-boheme.fr/DPCI/DPCI_Banner.jpg',
  })

  // Structured data for personalized gifts and details
  useSchemaOrg([
    defineLocalBusiness({
      name: 'Pensée Bohème',
      description:
        "Atelier de création de détails personnalisés et cadeaux d'invités floraux pour mariages et événements en Normandie",
      image: 'https://pensee-boheme.fr/DPCI/DPCI_Banner.jpg',
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
      { name: 'Cadeaux Invités', item: 'https://pensee-boheme.fr/univers/cadeaux-invites' },
    ]),
  ])
</script>
