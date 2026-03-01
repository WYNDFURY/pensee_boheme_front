<template>
  <main v-if="data" role="main">
    <div class="sr-only">
      Galerie {{ data.name }} - Pensée Bohème : découvrez nos créations florales
      {{ data.name.toLowerCase() }} en Normandie. Compositions artisanales par Cécile Devaux.
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
    const gallery = data.value
    const galleryTitle = gallery.name || 'Galerie'
    const galleryDescription =
      gallery.description || `Découvrez notre galerie ${galleryTitle.toLowerCase()}`

    useSeoMeta({
      title: `${galleryTitle} - Pensée Bohème | Galerie Créations Florales Normandie`,
      description: `${galleryDescription}. Créations florales artisanales par Cécile Devaux, fleuriste en Normandie. Découvrez nos compositions ${galleryTitle.toLowerCase()}.`,
      keywords: `galerie ${galleryTitle.toLowerCase()}, pensée bohème, créations florales normandie, fleuriste artisanal, compositions florales, cécile devaux`,

      ogTitle: `Galerie ${galleryTitle} - Pensée Bohème Normandie`,
      ogDescription: `Découvrez notre galerie ${galleryTitle.toLowerCase()} : créations florales artisanales en Normandie`,
      ogImage: gallery.cover_image
        ? `https://pensee-boheme.fr${gallery.cover_image}`
        : 'https://pensee-boheme.fr/home/landpage_1_og.jpg',
      ogUrl: `https://pensee-boheme.fr/galeries/${slug}`,

      twitterCard: 'summary_large_image',
      twitterTitle: `Galerie ${galleryTitle} - Pensée Bohème`,
      twitterDescription: `Créations florales ${galleryTitle.toLowerCase()} par Pensée Bohème en Normandie`,
      twitterImage: gallery.cover_image
        ? `https://pensee-boheme.fr${gallery.cover_image}`
        : 'https://pensee-boheme.fr/home/landpage_1_og.jpg',
    })

    useSchemaOrg([useBusinessSchema()])

    // Breadcrumb Schema
    useSchemaOrg([
      defineBreadcrumb([
        { name: 'Accueil', item: 'https://pensee-boheme.fr/home' },
        { name: 'Galeries', item: 'https://pensee-boheme.fr/galeries' },
        { name: galleryTitle, item: `https://pensee-boheme.fr/galeries/${slug}` },
      ]),
    ])

    // Simple Gallery Schema - Focus on gallery metadata only
    useSchemaOrg([
      {
        '@type': 'ImageGallery',
        name: `Galerie ${galleryTitle}`,
        description: galleryDescription,
        url: `https://pensee-boheme.fr/galeries/${slug}`,
        author: {
          '@type': 'Person',
          name: 'Cécile Devaux',
        },
        // Use cover image if available
        image: gallery.cover_image
          ? {
              '@type': 'ImageObject',
              url: `https://pensee-boheme.fr${gallery.cover_image}`,
              name: galleryTitle,
              description: galleryDescription,
            }
          : undefined,
      },
    ])
  }
</script>
