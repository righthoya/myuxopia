export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxt/content'],
  css: ['~/assets/css/main.css'],
  // 다크 모드 없이 밝은 화면만 (CLAUDE.md 디자인 컨셉)
  ui: {
    colorMode: false,
    // 의미 색에 보조 포인트색 'accent' 추가 (값은 app.config → main.css --color-ember-*)
    theme: { colors: ['primary', 'secondary', 'accent', 'success', 'info', 'warning', 'error'] }
  },
  app: {
    head: {
      htmlAttrs: { lang: 'ko' },
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/uxopia-logo.svg' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-gov-dynamic-subset.min.css' }
      ]
    }
  },
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
