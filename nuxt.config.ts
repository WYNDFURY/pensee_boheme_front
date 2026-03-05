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
      'Fleuriste éco-responsable en Normandie - Créations florales sur-mesure pour mariages, événements et ateliers à Bec-de-Mortagne',
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
    head: {
      title: 'Pensée Bohème - Fleuriste Éco-responsable Normandie | Bec-de-Mortagne',
      meta: [
        { name: 'author', content: 'Cécile Devaux - Pensée Bohème' },
        { name: 'geo.region', content: 'FR-NOR' },
        { name: 'geo.placename', content: 'Bec-de-Mortagne, Normandie' },
        { name: 'geo.position', content: '49.702988;0.448245' },
        { name: 'ICBM', content: '49.702988, 0.448245' },
        { property: 'og:locale', content: 'fr_FR' },
        { property: 'og:type', content: 'website' },
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
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap',
        },
      ],
    },
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL,
    },
  },

  routeRules: {
    '/': { redirect: { to: '/home', statusCode: 301 } },
  },

  sitemap: {
    sources: ['/api/__sitemap__/urls'],
    exclude: ['/admin/**', '/cgv', '/CGV'],
    defaults: {
      changefreq: 'monthly',
      priority: 0.5,
    },
    urls: [
      {
        loc: '/home',
        changefreq: 'weekly',
        priority: 1.0,
      },
      {
        loc: '/galeries',
        changefreq: 'weekly',
        priority: 0.9,
      },
      {
        loc: '/univers/mariages',
        changefreq: 'monthly',
        priority: 0.8,
      },
      {
        loc: '/ateliers-creatifs',
        changefreq: 'monthly',
        priority: 0.8,
      },
      {
        loc: '/locations',
        changefreq: 'monthly',
        priority: 0.8,
      },
      {
        loc: '/univers/accessoires-fleurs-sechees',
        changefreq: 'monthly',
        priority: 0.7,
      },
      {
        loc: '/univers/cadeaux-invites',
        changefreq: 'monthly',
        priority: 0.7,
      },
      {
        loc: '/univers/professionnels',
        changefreq: 'monthly',
        priority: 0.7,
      },
      {
        loc: '/engagement',
        changefreq: 'yearly',
        priority: 0.6,
      },
      {
        loc: '/infos-pratiques',
        changefreq: 'monthly',
        priority: 0.7,
      },
    ],
  },

  nitro: {
    prerender: {
      routes: ['/home', '/galeries', '/engagement', '/infos-pratiques'],
      crawlLinks: true,
      ignore: ['/admin/**'],
    },
  },

  compatibilityDate: '2024-11-27',
})
