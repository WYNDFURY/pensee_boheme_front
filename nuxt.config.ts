// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  googleFonts: {
    families: {
      "Cormorant Garamond": true,
    },
  },
  modules: ["@nuxt/ui", "@nuxtjs/google-fonts", "@nuxtjs/tailwindcss"],
  ssr: false,
  runtimeConfig: {
    public: {
      stripeApiKey: "",
      baseUrl: "",
    },
  },
});
