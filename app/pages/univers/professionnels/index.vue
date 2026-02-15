<template>
  <main role="main">
    <div class="sr-only">
      Services professionnels Pensée Bohème : décoration florale pour boutiques, commerces et
      entreprises en Normandie. Décor vitrine, décoration saisonnière, abonnements bouquets par
      Cécile Devaux.
    </div>

    <PagesBanner
      :img-class="'opacity-60 object-top'"
      :text-class="'text-black bottom-1/4 tracking-[0.5em]'"
      :banner-image="'/professionnels/pro_banner.jpg'"
      :alt="'Bannière services professionnels Pensée Bohème - décoration florale pour boutiques et entreprises en Normandie'"
      ><h1
        id="professionnels-title"
        itemscope
        itemtype="https://schema.org/Service"
        itemprop="name"
      >
        Professionnels
      </h1>
    </PagesBanner>

    <section
      class="relative flex flex-col text-balance mt-16 gap-16 mb-40 md:mb-60 lg:mb-80"
      aria-labelledby="professionnels-title"
      aria-label="Services de décoration florale pour professionnels"
      itemscope
      itemtype="https://schema.org/Service"
    >
      <h2 class="sr-only">Pour les professionnels</h2>
      <div
        class="flex flex-col gap-8 text-center text-xl mx-10 xl:mx-28 2xl:mx-68"
        itemprop="description"
      >
        <p>
          Amis professionnels, vous cherchez à donner un coup d'éclat à la décoration de votre
          boutique ? <br >Je serais ravie de discuter avec vous de votre projet !
        </p>

        <p>
          Décor vitrine, décoration saisonnière, abonnement de bouquets... tout est possible pour
          rendre votre espace commercial encore plus chaleureux pour que vos clients s'y sentent
          bien !
        </p>
      </div>
      <figure class="lg:w-2/3 mx-auto">
        <NuxtImg
          src="/professionnels/pro_1.jpg"
          alt="Décoration florale professionnelle Pensée Bohème - aménagement floral pour boutique et commerce en Normandie"
          class="rounded-xl drop-shadow-lg"
          loading="lazy"
          format="webp"
          quality="90"
          itemprop="image"
        />
      </figure>

      <aside
        class="absolute bottom-0 translate-y-1/2 bg-primary_pink rounded-lg shadow-md p-8 lg:p-12 flex flex-col items-center place-self-center"
        aria-label="Promotion des ateliers créatifs en entreprise"
      >
        <IconsIdea class="w-12 md:w-20 xl:w-24 text-accent-500 mb-8 lg:mb-12" aria-hidden="true" />

        <p class="text-center text-sm md:text-xl leading-relaxed text-balance">
          Je propose également mes services pour animer <br >
          des ateliers fleuris dans vos entreprises,
          <br >
          <NuxtLink
            to="/ateliers-creatifs"
            class="relative border-b border-dotted border-accent-500 font-bold text-accent-500 group md:border-none"
            aria-label="Découvrir les ateliers créatifs en entreprise"
          >
            On en discute ensemble ?
            <span
              class="absolute bottom-0 left-0 hidden h-px w-0 bg-accent-500 transition-all duration-300 md:block md:group-hover:w-full"
            />
          </NuxtLink>
        </p>
      </aside>
    </section>
  </main>
</template>

<script setup lang="ts">
  useSeoMeta({
    title: 'Services Professionnels - Pensée Bohème | Décoration Florale Entreprises Normandie',
    description:
      'Services de décoration florale pour professionnels en Normandie : décor vitrine, décoration saisonnière, abonnements bouquets pour boutiques et entreprises. Ateliers créatifs en entreprise.',
    keywords:
      'décoration florale professionnelle normandie, décor vitrine fleuriste, décoration boutique commerce, abonnement bouquets entreprise, ateliers créatifs entreprise, pensée bohème professionnels',

    ogTitle: 'Services Professionnels Pensée Bohème - Décoration Florale Entreprises',
    ogDescription:
      'Décoration florale pour professionnels : décor vitrine, abonnements bouquets, ateliers créatifs. Rendez votre espace commercial plus chaleureux en Normandie.',
    ogImage: 'https://penseeboheme.fr/professionnels/pro_banner.jpg',
    ogUrl: 'https://penseeboheme.fr/univers/professionnels',

    twitterCard: 'summary_large_image',
    twitterTitle: 'Services Professionnels - Pensée Bohème Normandie',
    twitterDescription: 'Décoration florale pour entreprises et boutiques en Normandie',
    twitterImage: 'https://penseeboheme.fr/professionnels/pro_banner.jpg',
  })

  // Structured data for professional services
  useSchemaOrg([
    defineLocalBusiness({
      name: 'Pensée Bohème',
      description:
        'Services de décoration florale pour professionnels : décor vitrine, décoration saisonnière, abonnements bouquets et ateliers créatifs en entreprise',
      image: 'https://penseeboheme.fr/professionnels/pro_banner.jpg',
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
      { name: 'Univers', item: 'https://penseeboheme.fr/univers' },
      { name: 'Professionnels', item: 'https://penseeboheme.fr/univers/professionnels' },
    ]),
  ])
</script>
