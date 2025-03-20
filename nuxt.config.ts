// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,

  modules: ['@nuxt/ui', '@nuxt/eslint', '@nuxt/image'],

  css: ['~/assets/css/main.css'],

  future: {
    compatibilityVersion: 4,
  },

  colorMode: {
    preference: 'light',
  },

  app: {
    head: {
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
      ],
    },
  },

  compatibilityDate: '2024-11-27',
})
