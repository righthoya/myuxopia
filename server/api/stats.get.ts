// 페이지별 조회수·좋아요: { '/policies/login': { views: 3, likes: 1 }, ... }
export default defineEventHandler(async () => {
  return (await useStorage('stats').getItem<Stats>('counts')) ?? {}
})
