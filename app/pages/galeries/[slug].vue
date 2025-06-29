<template>
  <main v-if="data" role="main" class="h-screen">
    <div class="sr-only">
      Galerie {{ data.data.name }} - Pensée Bohème : découvrez nos créations florales
      {{ data.data.name.toLowerCase() }} en Normandie. Compositions artisanales par Cécile Devaux.
    </div>

    <GaleriesDisplay :gallery="data" />
  </main>
</template>

<script lang="ts" setup>
  const { slug } = useRoute().params as { slug: string }
  const { getShowOfGallery } = useGalleryService()
  const { data } = await getShowOfGallery(slug)
  // Dynamic SEO based on gallery data
  if (data?.value) {
    const gallery = data.value.data
    const galleryTitle = gallery.name || 'Galerie'
    const galleryDescription =
      gallery.description || `Découvrez notre galerie ${galleryTitle.toLowerCase()}`

    useSeoMeta({
      title: `${galleryTitle} - Pensée Bohème | Galerie Créations Florales Normandie`,
      description: `${galleryDescription}. Créations florales artisanales par Cécile Devaux, fleuriste en Normandie. Découvrez nos compositions ${galleryTitle.toLowerCase()}.`,
      keywords: `galerie ${galleryTitle.toLowerCase()}, pensée bohème, créations florales normandie, fleuriste artisanal, compositions florales, cécile devaux`,

      ogTitle: `Galerie ${galleryTitle} - Pensée Bohème Normandie`,
      ogDescription: `Découvrez notre galerie ${galleryTitle.toLowerCase()} : créations florales artisanales en Normandie`,
      ogImage: gallery.cover_image?.[0]?.url
        ? `https://penseeboheme.fr${gallery.cover_image[0].url}`
        : 'https://penseeboheme.fr/home/landpage_1_og.jpg',
      ogUrl: `https://penseeboheme.fr/galeries/${slug}`,

      twitterCard: 'summary_large_image',
      twitterTitle: `Galerie ${galleryTitle} - Pensée Bohème`,
      twitterDescription: `Créations florales ${galleryTitle.toLowerCase()} par Pensée Bohème en Normandie`,
      twitterImage: gallery.cover_image?.[0]?.url
        ? `https://penseeboheme.fr${gallery.cover_image[0].url}`
        : 'https://penseeboheme.fr/home/landpage_1_og.jpg',
    })

    // Structured data for image gallery
    useSchemaOrg([
      defineLocalBusiness({
        name: 'Pensée Bohème',
        description: `Fleuriste artisanale spécialisée dans les créations florales en Normandie`,
        image: 'https://penseeboheme.fr/home/landpage_1_og.jpg',
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
        { name: 'Accueil', item: 'https://penseeboheme.fr/home' },
        { name: 'Galeries', item: 'https://penseeboheme.fr/galeries' },
        { name: galleryTitle, item: `https://penseeboheme.fr/galeries/${slug}` },
      ]),
    ])

    // Simple Gallery Schema - Focus on gallery metadata only
    useSchemaOrg([
      {
        '@type': 'ImageGallery',
        name: `Galerie ${galleryTitle}`,
        description: galleryDescription,
        url: `https://penseeboheme.fr/galeries/${slug}`,
        author: {
          '@type': 'Person',
          name: 'Cécile Devaux',
        },
        // Use cover image if available
        image: gallery.cover_image?.[0]?.url
          ? {
              '@type': 'ImageObject',
              url: `https://penseeboheme.fr${gallery.cover_image[0].url}`,
              name: galleryTitle,
              description: galleryDescription,
            }
          : undefined,
      },
    ])
  }
</script>
