import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    // 정책·팝업 문서 (drafts/ 는 예전 초안 보관용, 사이트에 안 나옴)
    content: defineCollection({ type: 'page', source: { include: '**/*.md', exclude: ['releases/**', 'drafts/**'] } }),
    // 릴리스 노트: 버전별 md 1개
    releases: defineCollection({
      type: 'page',
      source: 'releases/*.md',
      schema: z.object({ version: z.string(), date: z.string(), summary: z.string() })
    })
  }
})
