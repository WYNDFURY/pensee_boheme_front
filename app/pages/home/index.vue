<template>
  <main class="flex flex-col gap-20 text-neutral-800 text-balance">
    <div class="sr-only">
      Pensée Bohème, fleuriste éco-responsable à Beuzeville-la-Grenier en Normandie. Cécile Devaux
      crée des compositions florales sur-mesure pour mariages, événements et ateliers créatifs.
    </div>
    <!-- First section -->
    <section
      aria-labelledby="hero-title"
      aria-label="Présentation de Pensée Bohème"
      class="h-[calc(100vh-80px)]"
    >
      <div class="flex h-full flex-col items-center md:flex-row-reverse">
        <header
          class="flex flex-1 text-pretty items-center justify-center bg-gradient-to-tl from-[#A37847] to-[#3A3025] bg-clip-text text-center font-extrabold leading-tight text-transparent md:my-auto md:w-1/2 px-28 xl:px-36 text-[4vh] md:text-[6vh] lg:text-[8vh] 2xl:text-[10vh]"
        >
          <h1 id="hero-title" itemprop="name">
            Chaque création, <br />
            est une ode à la beauté <br />
            de la nature et à l'imagination
          </h1>
        </header>
        <figure class="relative h-1/2 w-full md:h-full md:w-1/2">
          <NuxtImg
            src="/home/landpage_1.jpg"
            alt="Création florale éco-responsable Pensée Bohème - arrangement floral pour mariage en Normandie"
            class="h-full w-full rounded-b-4xl md:h-full md:rounded-none object-cover opacity-80"
            format="webp"
            quality="90"
            loading="eager"
            fetchpriority="high"
            itemprop="image"
          />
          <figcaption
            aria-label="Crédit photo Studio Larose"
            class="absolute bottom-2 right-2 bg-black/30 px-2 py-1 text-xs text-white rounded backdrop-blur-sm"
          >
            © Studio Larose
          </figcaption>
        </figure>
      </div>
    </section>

    <!-- Second section -->
    <section
      aria-label="À propos de Cécile Devaux"
      aria-labelledby="about-title"
      itemscope
      itemtype="https://schema.org/Person"
    >
      <div class="flex flex-col items-center gap-10 md:flex-row-reverse">
        <h2
          itemprop="founder"
          itemscope
          itemtype="https://schema.org/Person"
          class="text-center px-5 font-semibold text-3xl leading-normal text-accent-500 md:hidden"
        >
          Je suis <span itemprop="name">Cécile</span>, <br />
          créatrice de Pensée Bohème fleuriste passionnée et engagée
        </h2>

        <NuxtImg
          src="/home/landpage_2.jpg"
          alt="Cécile Devaux, fleuriste créatrice de Pensée Bohème dans son atelier à Beuzeville-la-Grenier"
          class="mx-auto w-full md:w-1/2 max-h-1/12"
          format="webp"
          quality="90"
          loading="lazy"
          itemprop="image"
        />

        <div class="text-center text-xl font-light leading-relaxed px-10 text-pretty">
          <h2
            class="hidden md:block my-10 text-balance font-semibold text-center text-3xl 2xl:text-4xl leading-normal text-accent-500"
          >
            Je suis Cécile, <br />
            créatrice de Pensée Bohème fleuriste passionnée et engagée
          </h2>
          <p class="my-5 2xl:text-2xl">
            Passionnée de nature et soucieuse de l'environnement qui m'entoure, je fais le choix de
            me tourner vers des valeurs qui me ressemblent. C'est pourquoi je travaille sur commande
            dans une démarche
            <NuxtLink
              to="/engagement"
              title="Découvrir l'engagement éco-responsable de Pensée Bohème"
              aria-label="En savoir plus sur notre démarche éco-responsable"
              class="relative border-b border-dotted border-accent-500 font-semibold text-accent-500 group md:border-none"
            >
              éco-responsable.
              <span
                class="absolute bottom-0 left-0 hidden h-px w-0 bg-accent-500 transition-all duration-300 md:block md:group-hover:w-full"
              ></span>
            </NuxtLink>
          </p>
          <p class="2xl:text-2xl">
            Je vous accueille sur
            <NuxtLink
              to="/infos-pratiques"
              title="Prendre rendez-vous avec Cécile à l'atelier"
              aria-label="Informations pratiques et prise de rendez-vous"
              class="relative border-b border-dotted border-accent-500 font-semibold text-accent-500 group md:border-none"
              >rendez-vous<span
                class="absolute bottom-0 left-0 hidden h-px w-0 bg-accent-500 transition-all duration-300 md:block md:group-hover:w-full"
              ></span>
            </NuxtLink>
            dans mon atelier à Beuzeville-la-Grenier; petit village Normand situé entre Le Havre et
            Rouen.
          </p>
        </div>
      </div>
    </section>

    <!-- Third section -->
    <article aria-label="Histoire et philosophie de Pensée Bohème" aria-labelledby="story-title">
      <div class="flex flex-col mx-auto text-center md:flex-col-reverse md:gap-10 mb-30">
        <div class="relative">
          <figure class="relative md:hidden">
            <NuxtImg
              src="/home/landpage_3_mobile.jpg"
              alt="Portfolio créations florales Pensée Bohème - compositions pour mariages et événements en Normandie"
              class="opacity-80"
              format="webp"
              quality="90"
              loading="lazy"
              itemprop="image"
            />
            <figcaption
              aria-label="Crédit photo Cupcakes Photographie"
              class="absolute bottom-2 right-2 bg-black/30 px-2 py-1 text-xs text-white rounded backdrop-blur-sm"
            >
              © Cupcakes Photographie
            </figcaption>
          </figure>
          <figure class="relative hidden md:block md:w-2/3 md:mx-auto">
            <NuxtImg
              src="/home/landpage_3_desktop.jpg"
              alt="Créations Pensée Bohème"
              class="w-full opacity-80"
              format="webp"
              quality="90"
              loading="lazy"
              itemprop="image"
            />
            <figcaption
              class="absolute bottom-2 right-2 bg-black/30 px-2 py-1 text-xs text-white rounded backdrop-blur-sm"
            >
              © Cupcakes Photographie
            </figcaption>
          </figure>
        </div>

        <div class="bg-primary_pink px-10 py-8">
          <h2 class="mb-10 font-semibold text-center text-2xl text-accent-500 2xl:text-4xl">
            Derrière le nom Pensée Bohème se cache l'essence même de mon travail.
          </h2>
          <p class="mb-4 text-xl font-light leading-relaxed 2xl:text-2xl xl:mx-28 2xl:mx-68">
            Enfant j'ai été émerveillée par la beauté de la Pensée; cette fleur qui symbolise la
            douceur et la créativité; c'est une des premières fleurs dont j'ai le souvenir de
            découvrir dans le jardin de mes parents.
          </p>
          <p class="text-xl font-light leading-relaxed 2xl:text-2xl xl:mx-28 2xl:mx-68">
            L'esprit Bohème quant à lui évoque pour moi une esthétique sauvage et poétique. C'est
            cette fusion entre la beauté naturelle de la Pensée et l'audace de la vie Bohème qui
            guide ma créativité !
          </p>
          <div class="mx-auto w-2/3">
              <USeparator
                orientation="horizontal"
                class="h-10"
                :avatar="{ src: '/PB_pensee_logo.svg', size: 'xl' }"
                aria-label="Séparateur décoratif avec logo Pensée Bohème"
              />
          </div>
          <p class="italic text-xl font-medium leading-relaxed 2xl:text-2xl">
            Bienvenue dans cet espace où chaque projet, chaque création, est une ode à la beauté de
            la nature et à l'imagination.
          </p>
        </div>
      </div>
    </article>
  </main>
</template>

<script setup>
  useSeoMeta({
    title: 'Pensée Bohème - Fleuriste Éco-responsable Normandie | Cécile Devaux',
    description:
      'Découvrez les créations florales éco-responsables de Cécile Devaux à Beuzeville-la-Grenier. Spécialisée dans les mariages, EVJF, ateliers fleurs séchées et décoration événementielle en Normandie.',
    keywords:
      'fleuriste normandie, pensée bohème, cécile devaux, éco-responsable, fleurs séchées, mariage normandie, beuzeville-la-grenier, création florale, atelier fleurs, EVJF normandie, décoration mariage, engagement écologique',

    ogTitle: 'Pensée Bohème - Fleuriste Créative et Éco-responsable en Normandie',
    ogDescription:
      'Chaque création est une ode à la beauté de la nature. Cécile vous accueille dans son atelier à Beuzeville-la-Grenier pour vos projets floraux sur-mesure.',
    ogImage: '/home/landpage_1.jpg',
    ogUrl: 'https://pensee-boheme.fr/home',

    twitterCard: 'summary_large_image',
    twitterTitle: 'Pensée Bohème - Fleuriste Éco-responsable Normandie',
    twitterDescription: 'Créations florales éco-responsables sur-mesure par Cécile Devaux',
    twitterImage: '/home/landpage_1.jpg',
  })

  useSchemaOrg([
    defineLocalBusiness({
      '@type': 'Florist',
      name: 'Pensée Bohème',
      description:
        'Fleuriste éco-responsable spécialisée dans les créations florales sur-mesure, fleurs séchées, mariages et ateliers créatifs.',
      image: '/home/landpage_2.jpg',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Beuzeville-la-Grenier',
        postalCode: '76210',
        addressRegion: 'Normandie',
        addressCountry: 'FR',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 49.59050861790701,
        longitude: 0.4137516889308236,
      },
      telephone: '+33614643584',
      email: 'penseeboheme76@gmail.com',
      url: 'https://pensee-boheme.fr',
      openingHours: [
        'Mo 09:00-16:00',
        'Tu 09:00-16:00',
        'We closed',
        'Th 09:00-16:00',
        'Fr 09:00-16:00',
        'Sa 09:00-13:00',
        'Su closed',
      ],
      priceRange: '€€',
      founder: {
        '@type': 'Person',
        name: 'Cécile Devaux',
      },
      areaServed: ['Beuzeville-la-Grenier', 'Le Havre', 'Rouen', 'Normandie', 'Seine-Maritime'],
      serviceType: [
        'Création florale',
        'Fleurs de mariage',
        'Fleurs séchées',
        'Ateliers créatifs',
        'EVJF',
        'Décoration événementielle',
        'Cadeaux personnalisés',
      ],
    }),
    defineOpeningHours([
      {
        dayOfWeek: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '16:00',
      },
      {
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '13:00',
      },
    ]),
  ])

  // Breadcrumb Schema
  useSchemaOrg([defineBreadcrumb([{ name: 'Accueil', item: 'https://pensee-boheme.fr/home' }])])
</script>
