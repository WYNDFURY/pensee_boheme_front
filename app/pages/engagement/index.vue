<template>
  <main class="flex flex-col gap-20 text-pretty text-neutral-800" role="main">
    <div class="sr-only">
      Engagement éco-responsable de Pensée Bohème : fleurs locales, production raisonnée et
      pratiques durables. Cécile Devaux, fleuriste engagée en Normandie, membre du Collectif de la
      Fleur Française.
    </div>

    <!-- First section - Engagement éco-responsable -->
    <section
      aria-labelledby="engagement-title"
      aria-label="Notre engagement pour une floriculture responsable"
      itemscope
      itemtype="https://schema.org/EnvironmentalHealthAction"
    >
      <div class="flex flex-col mx-auto text-left md:flex-col-reverse md:gap-10">
        <div class="relative">
          <figure class="relative md:block md:w-2/3 md:mx-auto">
            <NuxtImg
              src="/engagement/engagement_1.jpg"
              alt="Bouquet éco-responsable Pensée Bohème avec fleurs locales et de saison - engagement environnemental fleuriste Normandie"
              class="w-full opacity-80"
              format="webp"
              quality="90"
              loading="eager"
              fetchpriority="high"
              itemprop="image"
            />
            <figcaption
              aria-label="Crédit photo Laura Langlois Photographie"
              class="absolute bottom-2 right-2 bg-black/30 px-2 py-1 text-xs text-white rounded backdrop-blur-sm"
            >
              © Laura Langlois Photographie
            </figcaption>
          </figure>
        </div>
        <div class="bg-primary_green px-10 lg:px-20 py-8 md:mt-15">
          <h1
            id="engagement-title"
            class="mb-15 font-bold text-center font text-2xl text-accent-500"
            itemprop="name"
          >
            Pensée Bohème, c'est plus de 70% de végétaux issus d'une production raisonnée
          </h1>
          <div
            class="flex flex-col gap-4 text-xl font-light leading-relaxed xl:mx-28 2xl:mx-68"
            itemprop="description"
          >
            <div>
              <h2 class="sr-only">Les défis de la floriculture conventionnelle</h2>
              <p class="mb-2">
                Après mon apprentissage dans une boutique "classique" en 2016, je fais face aux deux
                réalités de ce métier :
              </p>
              <ul class="pl-6 list-disc list-outside flex flex-col gap-2" role="list">
                <li role="listitem">
                  La surconsommation de fleurs importées produites sous serres éclairées 24h/24, 7
                  jours/7 et bourrées de pesticides
                </li>
                <li role="listitem">
                  L'excès de plastique utilisé en magasin et par conséquent de déchets non
                  recyclables
                </li>
              </ul>
            </div>
            <p class="text-xl text-left font-light leading-relaxed">
              C'est en me confrontant à ce milieu que je me suis rendu compte qu'il y avait
              forcément une façon de fleurir vos événements de façon plus éthique.
            </p>
            <p class="text-xl text-left font-light leading-relaxed">
              Je travaille main dans la main avec des floricultrices passionnées qui me fournissent
              en fleurs locales une grande partie de l'année pour fleurir vos événements.
            </p>
          </div>
        </div>
      </div>

      <div class="h-px mx-auto bg-accent-500 w-1/11 mt-10" />
    </section>
    <!-- Second section -->
    <article
      aria-labelledby="collectif-title"
      aria-label="Partenariat avec le Collectif de la Fleur Française"
      itemscope
      itemtype="https://schema.org/Partnership"
    >
      <div class="flex flex-col items-center px-10 lg:px-20 gap-10 lg:flex-row-reverse">
        <NuxtImg
          src="/engagement/engagement_2.svg"
          alt="Logo Collectif de la Fleur Française - partenaire de Pensée Bohème pour des fleurs locales et éco-responsables"
          class="flex-auto w-3/4 md:w-1/2 lg:w-1/3"
          quality="90"
          loading="lazy"
          itemprop="logo"
        />

        <div
          class="text-left text-xl lg:mx-12 font-light leading-relaxed flex flex-col justify-center items-center gap-10"
          itemprop="description"
        >
          <h2
            id="collectif-title"
            class="hidden font-bold md:block my-10 text-center text-3xl leading-normal text-accent-500"
            itemprop="name"
          >
            Collectif de la Fleur Française
          </h2>
          <p class="">
            Depuis la création de mon entreprise, je suis adhérente au Collectif de la fleur
            française dans une démarche de soutenir une agriculture plus responsable et proposer des
            fleurs locales et de saison.
          </p>
          <p class="">
            J'aspire également à réduire au maximum les déchets en travaillant le moins possible
            avec de la mousse florale; en utilisant des contenants adaptés et des techniques de
            fleurissement qui garderont une fraîcheur optimale à vos végétaux.
          </p>
          <p class="">
            De plus, vous pourrez retrouver une large gamme d'éléments de décoration disponible à la
            <NuxtLink
              to="/locations"
              title="Découvrir notre gamme de location d'éléments décoratifs"
              aria-label="Voir les éléments de décoration disponibles à la location"
              class="relative border-b border-dotted border-accent-500 font-bold text-accent-500 group md:border-none"
            >
              location;
              <span
                class="absolute bottom-0 left-0 hidden h-px w-0 bg-accent-500 transition-all duration-300 md:block md:group-hover:w-full"
              />
            </NuxtLink>
            ainsi vous diminuer votre empreinte carbone en n'achetant pas du neuf tout en faisant
            des économies.
          </p>

          <NuxtLink
            to="/infos-pratiques"
            title="Informations pratiques sur notre démarche éco-responsable"
            aria-label="En savoir plus sur nos pratiques durables et éco-responsables"
            class="w-fit relative border-b border-dotted border-accent-500 font-bold text-accent-500 group md:border-none"
            >En savoir plus<span
              class="absolute bottom-0 left-0 hidden h-px w-0 bg-accent-500 transition-all duration-300 md:block md:group-hover:w-full"
            />
          </NuxtLink>
        </div>
      </div>
    </article>
  </main>
</template>

<script lang="ts" setup>
  useSeoMeta({
    title: 'Engagement Éco-responsable - Pensée Bohème Fleuriste Normandie | Cécile Devaux',
    description:
      "Découvrez l'engagement éco-responsable de Pensée Bohème : 70% de fleurs locales, membre du Collectif de la Fleur Française, pratiques durables et respect de l'environnement pour vos créations florales en Normandie.",
    keywords:
      'fleuriste éco-responsable normandie, engagement écologique, fleurs locales normandie, collectif fleur française, développement durable floriculture, écologie fleurs, pensée bohème engagement, production raisonnée, fleurs de saison, beuzeville-la-grenier',
    ogTitle: 'Notre Engagement Éco-responsable - Pensée Bohème Fleuriste Normandie',
    ogDescription:
      "Une approche respectueuse de l'environnement pour toutes nos créations florales. 70% de végétaux issus d'une production raisonnée.",
    ogImage: 'https://pensee-boheme.fr/engagement/engagement_1.jpg',
    ogUrl: 'https://pensee-boheme.fr/engagement',

    twitterCard: 'summary_large_image',
    twitterTitle: 'Engagement Éco-responsable - Pensée Bohème Fleuriste',
    twitterDescription: 'Fleurs locales, production raisonnée et pratiques durables en Normandie',
    twitterImage: 'https://pensee-boheme.fr/engagement/engagement_1.jpg',
  })

  // Schema.org structured data for environmental engagement
  useSchemaOrg([
    defineOrganization({
      '@type': 'Florist',
      name: 'Pensée Bohème',
      description:
        "Fleuriste éco-responsable engagée dans une démarche de développement durable et de respect de l'environnement",
      ethicsPolicy: 'https://pensee-boheme.fr/engagement',
      sustainabilityPlan: {
        '@type': 'SustainabilityPlan',
        name: 'Engagement Éco-responsable Pensée Bohème',
        description:
          "70% de végétaux issus d'une production raisonnée, membre du Collectif de la Fleur Française",
        actionableFeedbackPolicy:
          "Réduction des déchets, utilisation minimale de mousse florale, location d'éléments décoratifs",
      },
      memberOf: {
        '@type': 'Organization',
        name: 'Collectif de la Fleur Française',
        description:
          'Collectif soutenant une agriculture florale plus responsable et des fleurs locales de saison',
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Beuzeville-la-Grenier',
        postalCode: '76210',
        addressRegion: 'Normandie',
        addressCountry: 'FR',
      },
      founder: {
        '@type': 'Person',
        name: 'Cécile Devaux',
      },
      serviceType: [
        'Fleurs locales et de saison',
        'Production raisonnée',
        'Pratiques éco-responsables',
        'Location éléments décoratifs',
        'Réduction déchets floraux',
      ],
    }),
  ])

  // Breadcrumb Schema
  useSchemaOrg([
    defineBreadcrumb([
      { name: 'Accueil', item: 'https://pensee-boheme.fr/home' },
      { name: 'Engagement Éco-responsable', item: 'https://pensee-boheme.fr/engagement' },
    ]),
  ])
</script>

<style></style>
