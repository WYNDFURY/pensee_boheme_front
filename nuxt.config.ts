// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,

  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxtjs/seo',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    'nuxt-anchorscroll',
  ],

  anchorscroll: {
    hooks: [
      // Or any valid hook if needed
      // Default is `page:finish`
      'page:transition:finish',
    ],
  },

  site: {
    url: 'https://pensee-boheme.fr',
    name: 'Pensée Bohème',
    description:
      'Fleuriste éco-responsable en Normandie - Créations florales sur-mesure pour mariages, événements et ateliers à Beuzeville-la-Grenier',
    defaultLocale: 'fr',
  },

  css: ['~/assets/css/main.css'],

  future: {
    compatibilityVersion: 4,
  },

  colorMode: {
    preference: 'light',
  },

  devServer: {
    port: 3000,
    host: '0.0.0.0', // This allows connections from any IP
  },

  app: {
    baseURL: '/',
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL,
    },
    head: {
      title: 'Pensée Bohème - Fleuriste Éco-responsable Normandie | Beuzeville-la-Grenier',
      meta: [
        {
          name: 'description',
          content:
            'Cécile Devaux, fleuriste passionnée et engagée à Beuzeville-la-Grenier. Créations florales éco-responsables, fleurs séchées, mariages, EVJF et ateliers en Normandie.',
        },
        {
          name: 'keywords',
          content:
            'fleuriste normandie, éco-responsable, fleurs séchées, mariage normandie, beuzeville-la-grenier, création florale, atelier fleurs, EVJF, décoration événement, boutique fleurs, engagement écologique, cécile devaux',
        },
        { name: 'author', content: 'Cécile Devaux - Pensée Bohème' },
        { name: 'geo.region', content: 'FR-NOR' },
        { name: 'geo.placename', content: 'Beuzeville-la-Grenier, Normandie' },
        { name: 'geo.position', content: '49.59050861790701;0.4137516889308236' },
        { name: 'ICBM', content: '49.59050861790701, 0.4137516889308236' },

        // Open Graph
        { property: 'og:title', content: 'Pensée Bohème - Fleuriste Éco-responsable en Normandie' },
        {
          property: 'og:description',
          content:
            'Créations florales éco-responsables par Cécile Devaux. Spécialisée dans les mariages, événements et ateliers fleurs séchées à Beuzeville-la-Grenier.',
        },
        { property: 'og:type', content: 'business.business' },
        { property: 'og:locale', content: 'fr_FR' },
        { property: 'business:contact_data:locality', content: 'Beuzeville-la-Grenier' },
        { property: 'business:contact_data:region', content: 'Normandie' },
        { property: 'business:contact_data:country_name', content: 'France' },

        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Pensée Bohème - Fleuriste Éco-responsable Normandie' },
        {
          name: 'twitter:description',
          content: 'Créations florales éco-responsables sur-mesure en Normandie',
        },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Josefin+Slab:wght@300;400;600&display=swap',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&display=swap',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@100..900&display=swap',
        },
        { rel: 'canonical', href: 'https://pensee-boheme.fr' },
      ],
    },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
    },
  },

  compatibilityDate: '2024-11-27',
})
