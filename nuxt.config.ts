export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxt/content'],
  css: ['~/assets/css/main.css'],
  content: {
    experimental: { sqliteConnector: 'native' }
  },
  compatibilityDate: '2025-07-15'
})
