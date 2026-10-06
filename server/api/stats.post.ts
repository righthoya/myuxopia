import { allPages } from '../../app/utils/menu'

// 조회 1회 / 좋아요 +1 / 좋아요 취소 -1
// ponytail: 읽고-쓰기라 동시 요청이 겹치면 1~2회 누락될 수 있음. 트래픽이 커지면 Redis INCR로 바꿀 것
export default defineEventHandler(async (event) => {
  const { path, type } = await readBody<{ path?: string, type?: string }>(event)
  if (!allPages.some(p => p.to === path) || !['view', 'like', 'unlike'].includes(type ?? ''))
    throw createError({ statusCode: 400, statusMessage: '잘못된 요청입니다.' })

  const storage = useStorage('stats')
  const counts = (await storage.getItem<Stats>('counts')) ?? {}
  const c = counts[path!] ??= { views: 0, likes: 0 }
  if (type === 'view') c.views++
  else if (type === 'like') c.likes++
  else c.likes = Math.max(0, c.likes - 1)
  await storage.setItem('counts', counts)
  return c
})
