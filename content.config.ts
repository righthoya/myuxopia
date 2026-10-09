import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    // 정책·팝업 문서
    content: defineCollection({ type: 'page', source: { include: '**/*.md', exclude: ['releases/**'] } }),
    // 릴리스 노트: 버전별 md 1개
    releases: defineCollection({
      type: 'page',
      source: 'releases/*.md',
      schema: z.object({ version: z.string(), date: z.string(), summary: z.string() })
    })
  }
})
