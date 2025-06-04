<template>
  <main class="py-20 text-balance text-neutral-800" role="main">
    <div class="sr-only">
      Informations pratiques Pensée Bohème : horaires d'ouverture, contact, adresse de l'ateli
      telephone: '+33614643584', email: 'penseeboheme76@gmail.com', url: 'https://penseeboheme.fr',
      sameAs: ['https://www.facebook.com/penseeboheme76'], Beuzeville-la-Grenier. Prenez rendez-vous
      avec Cécile Devaux pour vos projets floraux éco-responsables.
    </div>

    <!-- infos section -->
    <section
      class="relative flex flex-col gap-20 mb-52"
      aria-labelledby="infos-title"
      aria-label="Informations pratiques et horaires"
      itemscope
      itemtype="https://schema.org/LocalBusiness"
    >
      <header>
        <h1
          id="infos-title"
          class="uppercase font-light text-5xl md:text-6xl xl:text-7xl text-center font-['Kumbh_Sans']"
          itemprop="name"
        >
          infos pratiques
        </h1>
      </header>
      <figure class="w-full md:w-3/4 lg:w-1/2 mx-auto">
        <NuxtImg
          src="/infos-pratiques/infos_pratiques_1.jpg"
          alt="Atelier Pensée Bohème à Beuzeville-la-Grenier - espace de création florale et accueil sur rendez-vous avec Cécile Devaux"
          class="w-full rounded-sm drop-shadow-lg opacity-80"
          placeholder=""
          format="webp"
          quality="90"
          loading="eager"
          fetchpriority="high"
          itemprop="image"
        />
      </figure>
      <aside
        class="absolute bottom-0 translate-y-1/2 bg-primary_pink rounded-lg shadow-md p-4 md:p-8 flex flex-col place-self-center"
        aria-labelledby="horaires-title"
        itemprop="openingHours"
      >
        <h2 id="horaires-title" class="text-lg md:text-3xl lg:text-2xl text-center my-4">
          Horaire d'ouverture rendez vous:
        </h2>
        <ul
          class="text-left text-sm md:text-lg lg:text-xl font-light leading-relaxed text-balance list-disc pl-7 mb-4"
          role="list"
        >
          <li role="listitem" itemprop="openingHours" content="Mo-Tu,Th-Fr 09:00-16:00">
            Du lundi au vendredi de 9h à 16h
          </li>
          <li role="listitem">Fermé le mercredi</li>
          <li role="listitem" itemprop="openingHours" content="Sa 09:00-13:00">
            Samedi de 9h à 13h
          </li>
          <li role="listitem">Retrait commandes sur demande</li>
        </ul>
      </aside>
    </section>

    <!-- contact section -->
    <section
      class="relative flex flex-col gap-20"
      aria-labelledby="contact-title"
      aria-label="Informations de contact et localisation"
      itemscope
      itemtype="https://schema.org/ContactPage"
    >
      <header>
        <h2
          id="contact-title"
          class="uppercase font-light text-4xl md:text-5xl xl:text-6xl text-center font-['Kumbh_Sans']"
        >
          Me Contacter
        </h2>
      </header>
      <!-- <div class="flex" role="group" aria-label="Formulaires de contact">
        <PagesEventContactForm />
        <PagesDetailContactForm />
      </div> -->
      <div
        class="flex flex-col lg:flex-row-reverse gap-8 items-center justify-center mx-4 md:mx-16"
        role="group"
        aria-label="Carte et coordonnées"
      >
        <div class="w-full lg:w-3/4 xl:w-1/2 aspect-[16/9] rounded-lg overflow-hidden shadow-md">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2209.4139441244038!2d0.4137516889308236!3d49.59050861790701!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e047af26add8bb%3A0x81708df81afa1644!2zcGVuc8OpZSBib2jDqW1l!5e0!3m2!1sfr!2sbe!4v1744975436273!5m2!1sfr!2sbe"
            class="w-full h-full border-0"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Localisation de l'atelier Pensée Bohème à Beuzeville-la-Grenier"
            aria-label="Carte Google Maps montrant l'emplacement de Pensée Bohème"
          />
        </div>
        <address
          class="flex flex-col gap-4 text-lg mx-auto not-italic"
          itemscope
          itemtype="https://schema.org/PostalAddress"
        >
          <div class="flex items-center gap-2" itemprop="telephone">
            <AkPhone class="text-xl" aria-hidden="true" />
            <a
              href="tel:+33614643584"
              class="hover:text-accent-500 transition-colors"
              aria-label="Appeler le 06 14 64 35 84"
            >
              +33 6 14 64 35 84
            </a>
          </div>
          <div class="flex items-center gap-2">
            <MdTwoToneMailOutline class="text-xl" aria-hidden="true" />
            <a
              href="mailto:penseeboheme76@gmail.com"
              class="hover:text-accent-500 transition-colors"
              itemprop="email"
              aria-label="Envoyer un email à penseeboheme76@gmail.com"
            >
              penseeboheme76@gmail.com
            </a>
          </div>
          <div class="flex items-center gap-2">
            <AkLocation class="text-xl" aria-hidden="true" />
            <span>
              <span itemprop="streetAddress">316 route du Parc d'Anxtot</span><br />
              <span itemprop="postalCode">76210</span>
              <span itemprop="addressLocality">Beuzeville la Grenier</span>
            </span>
          </div>
          <div class="flex items-center gap-2">
            <DeFacebookOriginal class="text-xl" aria-hidden="true" />
            <a
              href="https://www.facebook.com/penseeboheme76"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-accent-500 transition-colors"
              aria-label="Visitez notre page Facebook Pensée Bohème"
            >
              Pensée Bohème
            </a>
          </div>
        </address>
      </div>
    </section>

    <!-- instagram feed section -->
    <section aria-label="Galerie Instagram Pensée Bohème">
      <InstagramFeed v-if="data" :instagram-medias="data" />
    </section>
  </main>
</template>

<script lang="ts" setup>
  import { InstagramFeed } from '#components'
  import {
    AkPhone,
    MdTwoToneMailOutline,
    AkLocation,
    DeFacebookOriginal,
  } from '@kalimahapps/vue-icons'

  const { getInstagramMedias } = useFetchInstagramMediasService()
  const { data } = getInstagramMedias()

  useSeoMeta({
    title: 'Contact & Horaires - Pensée Bohème Fleuriste Beuzeville-la-Grenier | Cécile Devaux',
    description:
      'Contactez Cécile Devaux pour vos projets floraux éco-responsables. Atelier ouvert sur rendez-vous du lundi au vendredi 9h-16h (fermé mercredi), samedi 9h-13h à Beuzeville-la-Grenier, Normandie.',
    keywords:
      'contact pensée bohème, horaires fleuriste beuzeville-la-grenier, rendez-vous fleuriste normandie, atelier fleurs normandie, cécile devaux contact, fleuriste éco-responsable contact, penseeboheme76@gmail.com, 06 14 64 35 84',

    ogTitle: 'Contact & Horaires Pensée Bohème - Fleuriste Éco-responsable Normandie',
    ogDescription:
      'Prenez rendez-vous avec Cécile dans son atelier normand. Horaires : Lun-Mar-Jeu-Ven 9h-16h, Sam 9h-13h, fermé mercredi. 06 14 64 35 84',
    ogImage: 'https://penseeboheme.fr/infos-pratiques/infos_pratiques_1.jpg',
    ogUrl: 'https://penseeboheme.fr/infos-pratiques',

    twitterCard: 'summary_large_image',
    twitterTitle: 'Contact Pensée Bohème - Fleuriste Normandie',
    twitterDescription:
      'Contactez Cécile pour vos créations florales éco-responsables en Normandie',
    twitterImage: 'https://penseeboheme.fr/infos-pratiques/infos_pratiques_1.jpg',
  })

  // Enhanced structured data for local business contact page
  useSchemaOrg([
    defineLocalBusiness({
      name: 'Pensée Bohème',
      description:
        "Fleuriste éco-responsable spécialisée dans les créations florales sur-mesure, accueil sur rendez-vous dans l'atelier",
      image: 'https://penseeboheme.fr/infos-pratiques/infos_pratiques_1.jpg',
      address: {
        '@type': 'PostalAddress',
        streetAddress: "316 route du Parc d'Anxtot",
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
      sameAs: ['https://www.facebook.com/penseeboheme76'],
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
  useSchemaOrg([
    defineBreadcrumb([
      { name: 'Accueil', item: 'https://pensee-boheme.fr/home' },
      { name: 'Infos Pratiques', item: 'https://pensee-boheme.fr/infos-pratiques' },
    ]),
  ])
</script>

<style></style>
