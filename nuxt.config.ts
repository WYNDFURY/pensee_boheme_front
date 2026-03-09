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
    '@nuxtjs/google-fonts',
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

  googleFonts: {
    families: {
      'Josefin Slab': [300, 400, 600],
      'Source Serif 4': {
        wght: [400, 600],
        ital: [400],
      },
      'Kumbh Sans': [400, 500, 600, 700],
      'Cormorant Garamond': {
        wght: [400, 500, 600, 700],
        ital: [400, 500],
      },
    },
    display: 'swap',
    preload: true,
    prefetch: true,
  },

  app: {
    baseURL: '/',
    head: {
      title: 'Pensée Bohème - Fleuriste Éco-responsable Normandie',
      meta: [
        { name: 'author', content: 'Cécile Devaux - Pensée Bohème' },
        { name: 'geo.region', content: 'FR-NOR' },
        { name: 'geo.placename', content: 'Bec-de-Mortagne, Normandie' },
        { name: 'geo.position', content: '49.702988;0.448245' },
        { name: 'ICBM', content: '49.702988, 0.448245' },
        { property: 'og:locale', content: 'fr_FR' },
        { property: 'og:type', content: 'website' },
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
    exclude: ['/admin/**', '/cgv'],
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
      routes: ['/home', '/galeries', '/engagement', '/infos-pratiques', '/univers/mariages', '/univers/accessoires-fleurs-sechees', '/univers/cadeaux-invites', '/univers/professionnels', '/ateliers-creatifs', '/locations'],
      crawlLinks: true,
      ignore: ['/admin/**'],
    },
  },

  image: {
    quality: 80,
    format: ['webp', 'jpg'],
  },

  compatibilityDate: '2024-11-27',
})
