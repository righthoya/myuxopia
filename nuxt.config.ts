export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxt/content'],
  css: ['~/assets/css/main.css'],
  content: {
    experimental: { sqliteConnector: 'native' }
  },
  nitro: {
    // 조회수·좋아요 저장소. 배포: Vercel에 Upstash Redis 연결(환경변수 자동) / 내 컴퓨터: .data/stats 파일
    storage: {
      stats: process.env.UPSTASH_REDIS_REST_URL ? { driver: 'upstash' } : { driver: 'memory' }
    },
    devStorage: {
      stats: { driver: 'fs', base: '.data/stats' }
    }
  },
  compatibilityDate: '2025-07-15'
})
