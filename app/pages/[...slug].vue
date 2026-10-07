<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(() => 'page-' + route.path, () => queryCollection('content').path(route.path).first())
const info = findPage(route.path)
if (!info) throw createError({ statusCode: 404, statusMessage: '페이지를 찾을 수 없습니다.', fatal: true })

const toc = computed(() => page.value?.body?.toc?.links ?? info.sections.map(s => ({ id: '', text: s })))
const related = computed(() => ((page.value?.meta.related as string[]) ?? []).map(id => findPage(idToPath(id))).filter(Boolean))

// 링크 공유: 메신저 미리보기용 제목·설명 + 주소 복사
useSeoMeta({
  title: () => `${page.value?.title ?? info.title} · UXopia`,
  description: () => page.value?.description?.replaceAll('**', '') || `${info.parent} · ${info.title}`
})
const { copyLink } = useCopyLink()

// 요약: MD 머리말 description의 **강조**를 굵게 표시
const summary = computed(() => (page.value?.description ?? '').split(/\*\*(.+?)\*\*/)
  .flatMap((chunk, i) => chunk.split(/(\{[^{}]+\})/).filter(Boolean).map(text => ({ text, bold: i % 2 === 1, isVar: /^\{.+\}$/.test(text) }))))

// 뒤로 가기: 사이트 안에서 들어왔으면 이전 화면(검색어·탭 유지), 공유 링크로 바로 왔으면 정책 목록으로
const router = useRouter()
const goBack = () => (history.state?.back ? router.back() : router.push('/#list'))

// 조회수·좋아요. 조회는 브라우저 탭당 1회, 좋아요 여부는 이 브라우저에 기억
const stat = ref({ views: 0, likes: 0 })
const liked = ref(false)
const send = (type: string) => $fetch('/api/stats', { method: 'POST', body: { path: info.to, type } })
onMounted(() => {
  const doc = document.querySelector('.doc')
  if (!doc) return
  const walker = document.createTreeWalker(doc, NodeFilter.SHOW_TEXT, {
    acceptNode: n => /\{[^{}]+\}/.test(n.nodeValue ?? '') && !n.parentElement?.closest('th, pre, .var, svg, style') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
  })
  const nodes: Text[] = []
  while (walker.nextNode()) nodes.push(walker.currentNode as Text)
  for (const node of nodes) {
    const frag = document.createDocumentFragment()
    for (const part of node.nodeValue!.split(/(\{[^{}]+\})/)) {
      if (!part) continue
      if (/^\{[^{}]+\}$/.test(part)) {
        const span = document.createElement('span')
        span.className = 'var'
        span.textContent = part
        frag.append(span)
      } else frag.append(part)
    }
    node.replaceWith(frag)
  }
})
onMounted(async () => {
  try { liked.value = localStorage.getItem('liked:' + info.to) === '1' } catch {}
  let seen = false
  try { seen = sessionStorage.getItem('viewed:' + info.to) === '1'; sessionStorage.setItem('viewed:' + info.to, '1') } catch {}
  stat.value = seen ? ((await $fetch<Stats>('/api/stats'))[info.to] ?? stat.value) : await send('view')
})
async function toggleLike() {
  liked.value = !liked.value
  try { localStorage.setItem('liked:' + info.to, liked.value ? '1' : '0') } catch {}
  stat.value = await send(liked.value ? 'like' : 'unlike')
}
</script>

<template>
  <UButton class="back" size="sm" color="neutral" variant="ghost" icon="i-lucide-arrow-left" label="목록으로" @click="goBack" />
  <nav aria-label="현재 위치" class="crumb">
    <NuxtLink to="/">UXopia</NuxtLink>
    <template v-if="info.parent"> / <NuxtLink to="/#list">{{ info.parent }}</NuxtLink></template>
    <template v-if="info.group"> / {{ info.group }}</template>
    / <span aria-current="page">{{ info.title }}</span>
  </nav>
  <div class="title-row">
    <h1>{{ page?.title ?? info.title }}.</h1>
    <UButton size="sm" color="primary" :variant="liked ? 'solid' : 'outline'" icon="i-lucide-heart" :label="`좋아요 ${stat.likes}`" :aria-pressed="liked" @click="toggleLike" />
    <UButton size="sm" color="neutral" variant="outline" icon="i-lucide-link" label="링크 복사" @click="copyLink" />
  </div>
  <ul class="chips"><li v-for="t in (page?.meta.tags as string[]) ?? ['공통']" :key="t">{{ t }}</li></ul>

  <div class="detail">
    <article>
      <h2 class="label">요약</h2>
      <p class="box summary">
        <template v-if="page?.description">
          <template v-for="(part, i) in summary" :key="i"><component :is="part.bold ? 'strong' : 'span'" :class="{ var: part.isVar }">{{ part.text }}</component></template>
        </template>
        <template v-else>준비 중입니다.</template>
      </p>

      <h2 class="label">정책 본문</h2>
      <div v-if="page" class="doc"><ContentRenderer :value="page" /></div>
      <template v-else>
        <section v-for="s in info.sections" :key="s">
          <h3>{{ s }}</h3>
          <div class="ph">[{{ s }} 자리]</div>
        </section>
      </template>

      <template v-if="related.length">
        <h2 class="label">관련 정책</h2>
        <ul class="rel"><li v-for="r in related" :key="r!.to"><NuxtLink :to="r!.to">{{ r!.title }}</NuxtLink><span class="muted">{{ r!.parent }}</span></li></ul>
      </template>
    </article>

    <aside>
      <dl class="facts">
        <dt>버전</dt><dd>{{ page?.meta.version ?? '—' }}</dd>
        <dt>최종 수정일</dt><dd>{{ page?.meta.updated ?? '—' }}</dd>
        <dt>조회수</dt><dd>{{ stat.views }}</dd>
      </dl>
      <nav aria-label="이 페이지 목차" class="toc">
        <p class="label">이 페이지 목차</p>
        <ul>
          <li v-for="l in toc" :key="l.text"><a v-if="l.id" :href="'#' + l.id">{{ l.text }}</a><span v-else>{{ l.text }}</span></li>
        </ul>
      </nav>
    </aside>
  </div>
</template>
