<template>
  <main role="main" itemscope itemtype="https://schema.org/Service">
    <!-- SEO hidden description for search engines -->
    <div class="sr-only">
      Décoration florale mariage Pensée Bohème : créations sur-mesure, compositions florales,
      installation et mise en place pour mariages en Normandie. Forfait décoration à partir de 900€
      par Cécile Devaux.
    </div>

    <PagesBanner
      :text-class="'md:justify-end md:mr-16 bottom-1/6'"
      :banner-image="'/mariages/mariages_banner.jpg'"
      :alt="'Bannière mariages Pensée Bohème - décoration florale mariage sur-mesure Normandie par Cécile Devaux'"
      ><h1 id="mariages-title" itemprop="name">Mariages</h1></PagesBanner
    >

    <div class="flex flex-col gap-8 text-balance">
      <!-- first section -->
      <section
        class="flex flex-col mt-16 md:mt-32 lg:mx-16"
        aria-labelledby="quote-section"
        aria-label="Citation inspirante et présentation visuelle"
      >
        <div class="grid grid-cols-2">
          <blockquote
            id="quote-section"
            class="mx-8 my-auto -translate-y-10 font-['Source_Serif_Pro'] italic"
            cite="Antonio Porchia"
          >
            <h2 class="mb-2 text-left font-serif md:text-xl lg:text-4xl">
              L'amour, s'il tient en une seule fleur, est infini
            </h2>
            <footer class="text-right text-xs -translate-y-2 md:text-xl">
              <cite>- Antonio Porchia</cite>
            </footer>
          </blockquote>

          <figure class="relative w-full">
            <NuxtImg
              src="/mariages/mariages_1.webp"
              alt="Décoration florale mariage bohème Pensée Bohème - composition sur-mesure avec fleurs champêtres en Normandie"
              class="opacity-90 pr-5 lg:pr-0 nuxt-img-loading"
              format="webp"
              placeholder=""
              loading="eager"
              itemprop="image"
            />
            <figcaption
              class="absolute -top-4 left-0 sm:top-2 sm:left-2 bg-black/30 px-1 md:px-2 md:py-1 text-xs text-white rounded backdrop-blur-sm"
            >
              © Antonio Maillot
            </figcaption>
          </figure>
        </div>
        <figure class="relative w-4/6 -mt-24 self-center md:w-1/2 md:-mt-32 lg:-mt-40 xl:max-w-xl 2xl:max-w-2xl">
          <NuxtImg
            src="/mariages/mariages_2.webp"
            alt="Bouquet de mariée Pensée Bohème - création florale artisanale pour mariage romantique en Normandie"
            format="webp"
            class="nuxt-img-loading"
            loading="eager"
            itemprop="image"
          />
          <figcaption
            class="absolute bottom-2 right-2 bg-black/30 px-2 py-1 text-xs text-white rounded backdrop-blur-sm"
          >
            © Anne Guerrand
          </figcaption>
        </figure>
      </section>

      <!-- second section -->
      <section
        class="mt-16"
        aria-labelledby="philosophy-title"
        aria-label="Philosophie et approche de la décoration florale"
        itemscope
        itemtype="https://schema.org/Service"
      >
        <div class="flex flex-col gap-8 text-center text-pretty mx-10 xl:mx-28 2xl:mx-68">
          <h2
            id="philosophy-title"
            class="text-2xl lg:text-3xl md:mx-0 text-balance"
            itemprop="description"
          >
            En tant que fleuriste événementielle spécialisée dans les mariages,<br >
            j'ai à cœur de créer des ambiances uniques et mémorables.
          </h2>
          <hr class="h-px w-24 mx-auto rounded-full bg-accent-500" aria-hidden="true" >
          <div
            class="flex flex-col text-left md:text-center gap-4 text-lg lg:text-xl leading-relaxed mx-10 xl:mx-28 2xl:mx-68"
            role="region"
            aria-label="Description des services"
          >
            <p>
              Je m'efforce de mettre en valeur chaque détail de votre décoration, et je conçois des
              compositions florales sur mesure qui reflètent votre personnalité et vos envies.
            </p>
            <p>
              Mon rôle ne se limite pas à la simple création ; je me consacre également à
              l'installation sur le lieu de réception, afin que chaque fleur soit parfaitement
              disposée pour ce jour particulier.
            </p>
            <p>
              Je vous accompagne pour fleurir vos événements partout en Normandie et aux alentours.
            </p>
          </div>
        </div>
      </section>

      <!-- third section -->
      <section
        class="flex flex-col mt-16 lg:mt-32"
        aria-labelledby="personalization-title"
        aria-label="Personnalisation et tarification des services"
        itemscope
        itemtype="https://schema.org/Offer"
      >
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <figure class="relative mx-auto w-3/4 lg:col-span-2">
            <NuxtImg
              src="/mariages/mariages_3.webp"
              alt="Décoration mariage personnalisée Pensée Bohème - centre de table floral élégant pour réception de mariage en Normandie"
              placeholder=""
              format="webp"
              quality="90"
              loading="lazy"
              itemprop="image"
            />
            <figcaption
              class="absolute top-2 right-2 bg-black/30 px-2 py-1 text-xs text-white rounded backdrop-blur-sm"
            >
              © Antonio Maillot
            </figcaption>
          </figure>
          <div
            id="personalization-title"
            class="flex flex-col justify-center text-pretty gap-4 px-16 my-8 text-base md:text-xl leading-relaxed text-center max-h-3/4 lg:col-span-2 lg:px-8 lg:text-right xl:text-xl 2xl:text-2xl"
            itemprop="description"
          >
            <p class="">
              La personnalisation est au cœur de ma démarche. Je propose des accessoires sur mesure
              d'après les couleurs que vous me demandez, mais aussi des éléments décoratifs avec les
              inscriptions que vous désirez, ainsi que des cadeaux floraux uniques pour vos invités.
            </p>
            <p class="">
              Je considère chaque projet comme une mission, et je mets un point d'honneur à vous
              offrir une prestation qui respecte vos envies ainsi que votre budget. Confiez-moi
              votre rêve, et ensemble, nous ferons de votre mariage une journée inoubliable.
            </p>
            <span class="flex w-full justify-center">
              <hr
                class="h-px w-24 mx-auto rounded-full border-0 bg-accent-500"
                aria-hidden="true"
              >
            </span>
            <p
              class="mt-2 text-center font-semibold text-accent-500 lg:text-right"
              itemprop="priceRange"
            >
              Forfait décoration mariage à partir de 900 €
            </p>
          </div>
        </div>
        <figure class="relative w-full lg:w-1/2 lg:-translate-y-1/4 lg:translate-x-1/4">
          <NuxtImg
            src="/mariages/mariages_4.webp"
            alt="Installation décoration florale mariage Pensée Bohème - mise en place professionnelle sur lieu de réception Normandie"
            class=""
            placeholder=""
            format="webp"
            quality="90"
            loading="lazy"
            itemprop="image"
          />
          <figcaption
            class="absolute bottom-2 right-2 bg-black/30 px-2 py-1 text-xs text-white rounded backdrop-blur-sm"
          >
            © Antonio Maillot
          </figcaption>
        </figure>
      </section>

      <aside
        class="my-12 px-4 md:px-8 lg:px-12"
        aria-label="Promotion des ateliers créatifs en entreprise"
      >
        <div
          class="bg-primary_green rounded-lg shadow-md p-8 flex flex-col items-center gap-6 max-w-xl mx-auto"
        >
          <IconsBannerLogo class="w-12 md:w-16 h-full text-accent-500" aria-hidden="true" />
          <p class="text-center text-lg md:text-xl leading-relaxed">
            Je propose également mes services pour animer des ateliers fleuris dans vos entreprises
            <br >
            <NuxtLink
              to="/ateliers-creatifs"
              class="relative border-b border-dotted border-accent-500 font-semibold text-accent-500 group md:border-none"
              aria-label="Découvrir les ateliers créatifs en entreprise"
            >
              On en discute ensemble ?
              <span
                class="absolute bottom-0 left-0 hidden h-px w-0 bg-accent-500 transition-all duration-300 md:block md:group-hover:w-full"
              />
            </NuxtLink>
          </p>
        </div>
      </aside>
    </div>
  </main>
</template>

<script setup lang="ts">
  // SEO Meta Tags
  useSeoMeta({
    title: 'Décoration Florale Mariage - Pensée Bohème | Fleuriste Mariage Normandie',
    description:
      'Décoration florale mariage sur-mesure par Pensée Bohème en Normandie : compositions florales, installation complète, accessoires personnalisés. Forfait décoration à partir de 900€.',
    keywords:
      'décoration florale mariage normandie, fleuriste mariage, composition florale mariage, décoration mariage sur mesure, fleuriste événementiel normandie, forfait décoration mariage, centre de table mariage, bouquet mariée normandie',

    robots: 'index, follow, max-image-preview:large',
    author: 'Cécile Devaux - Pensée Bohème',

    // Open Graph
    ogTitle: 'Décoration Florale Mariage Pensée Bohème - Service Complet Normandie',
    ogDescription:
      'Créations florales sur-mesure pour mariages en Normandie : compositions, installation, personnalisation. Forfait décoration à partir de 900€.',
    ogImage: 'https://pensee-boheme.fr/mariages/mariages_banner.jpg',
    ogUrl: 'https://pensee-boheme.fr/univers/mariages',
    ogType: 'website',

    // Twitter Cards
    twitterCard: 'summary_large_image',
    twitterTitle: 'Décoration Florale Mariage - Pensée Bohème Normandie',
    twitterDescription: 'Service complet de décoration florale pour mariages en Normandie',
    twitterImage: 'https://pensee-boheme.fr/mariages/mariages_banner.jpg',
  })

  // Structured Data
  useSchemaOrg([
    defineLocalBusiness({
      name: 'Pensée Bohème',
      description:
        'Fleuriste événementielle spécialisée dans la décoration florale de mariages en Normandie',
      image: 'https://pensee-boheme.fr/mariages/mariages_banner.jpg',
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
      founder: {
        '@type': 'Person',
        name: 'Cécile Devaux',
      },
      areaServed: 'Normandie, Seine-Maritime, France',
      offers: {
        '@type': 'Offer',
        name: 'Forfait décoration mariage',
        description: 'Service complet de décoration florale pour mariage',
        priceSpecification: {
          '@type': 'PriceSpecification',
          minPrice: '900',
          priceCurrency: 'EUR',
        },
      },
    }),

    // Breadcrumb
    defineBreadcrumb([
      { name: 'Accueil', item: 'https://pensee-boheme.fr/home' },
      { name: 'Univers', item: 'https://pensee-boheme.fr/univers' },
      { name: 'Mariages', item: 'https://pensee-boheme.fr/univers/mariages' },
    ]),
  ])
</script>

<style></style>
