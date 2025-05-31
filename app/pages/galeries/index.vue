<template>
  <main role="main">
    <div class="sr-only">
      Galeries de créations florales Pensée Bohème : découvrez nos réalisations pour mariages,
      événements et ateliers créatifs en Normandie. Portfolio de créations éco-responsables par
      Cécile Devaux.
    </div>

    <section
      aria-label="Galeries de créations florales"
      itemscope
      itemtype="https://schema.org/ImageGallery"
    >
      <GaleriesList v-if="data" :gallery-items="data" />
    </section>
  </main>
</template>

<script lang="ts" setup>
  const { getIndexOfGalleries } = useGalleryService()
  const { data } = getIndexOfGalleries()

  useSeoMeta({
    title: 'Galeries - Créations Florales Pensée Bohème | Normandie',
    description:
      'Découvrez les créations florales de Pensée Bohème : mariages, événements, fleurs séchées et ateliers créatifs en Normandie par Cécile Devaux.',
    keywords:
      'galerie fleurs, créations florales normandie, mariage fleurs, fleurs séchées, portfolio fleuriste, pensée bohème galerie',

    ogTitle: 'Galeries Pensée Bohème - Créations Florales Normandie',
    ogDescription:
      "Explorez l'univers créatif de Pensée Bohème à travers nos galeries de créations florales éco-responsables.",
    ogImage: 'https://pensee-boheme.fr/home/landpage_1_og.jpg',
    ogUrl: 'https://pensee-boheme.fr/galeries',

    twitterCard: 'summary_large_image',
    twitterTitle: 'Galeries Pensée Bohème - Portfolio Créations Florales',
    twitterDescription:
      'Portfolio des créations florales éco-responsables : mariages, événements et ateliers en Normandie',
    twitterImage: 'https://pensee-boheme.fr/home/landpage_1_og.jpg',
  })

  useSchemaOrg([
    defineWebPage({
      name: 'Galeries Pensée Bohème',
      description: 'Collection de créations florales éco-responsables par Cécile Devaux',
      url: 'https://pensee-boheme.fr/galeries',
      mainEntity: {
        '@type': 'ImageGallery',
        name: 'Créations Florales Éco-responsables',
        description: 'Portfolio des créations florales pour mariages, événements et ateliers',
        creator: {
          '@type': 'Person',
          name: 'Cécile Devaux',
        },
        about: {
          '@type': 'LocalBusiness',
          name: 'Pensée Bohème',
        },
      },
    }),
  ])

  // Breadcrumb Schema
  useSchemaOrg([
    defineBreadcrumb([
      { name: 'Accueil', item: 'https://pensee-boheme.fr/home' },
      { name: 'Galeries', item: 'https://pensee-boheme.fr/galeries' },
    ]),
  ])
</script>

<style></style>
