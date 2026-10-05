<script setup lang="ts">
const route = useRoute()
const { data: docs } = await useAsyncData('docs', () => queryCollection('content').all())
const tabs = ['전체', ...menu.map(m => m.title)]
const tab = computed(() => (route.query.tab as string) || '전체')
const router = useRouter()
// 검색어도 주소(?q=)에 남겨, 검색 결과 화면을 그대로 공유할 수 있게
const q = computed({
  get: () => (route.query.q as string) ?? '',
  set: v => router.replace({ query: { ...route.query, q: v || undefined } })
})
useSeoMeta({ title: 'UX Guide', description: '프로덕트 디자이너를 위한 UX 정책서. 정책과 팝업 문구를 읽고 복사해 씁니다.' })
const rows = computed(() => allPages
  .filter(p => (tab.value === '전체' || p.parent === tab.value) && p.title.includes(q.value.trim()))
  .map(p => ({ ...p, doc: docs.value?.find(d => d.path === p.to) })))
// UX 정책의 목적과 방향 (피그마 'UX 표준 정책_v1.0' A 블록). 방향 설명 문장은 초안
const purposes = ['이용자 중심', '업무 효율과 만족도', '법 준수 (접근성 · 개인정보)', '설계 · 개발 일관성']
const directions = [
  { title: '직관성 · 명확성', text: '처음 쓰는 사람도 설명 없이 다음 행동을 알 수 있게 설계합니다.' },
  { title: '포용적 UX', text: '고령자와 디지털 약자도 같은 기능을 불편 없이 쓸 수 있게 합니다.' },
  { title: '워크플로우 기반 설계', text: '화면 하나가 아니라 실제 업무 흐름 순서로 설계합니다.' },
  { title: 'UI 시스템 일관성 · 확장성', text: '같은 상황에는 같은 패턴과 문구를 쓰고, 새 기능도 같은 규칙으로 늘려 갑니다.' }
]
const cur = ref(0)
const go = (i: number) => { cur.value = (i + directions.length) % directions.length }
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <div>
      <h1 id="hero-title" class="ph wordmark">[로고 워드마크 자리: UX GUIDE]</h1>
      <p class="label">프로덕트 디자이너를 위한 UX 정책서</p>
    </div>
    <div>
      <p class="label">UX 정책의 목적</p>
      <p class="lead">SaaS · 공공 서비스 사용자를 위한 경험 설계 기준입니다.</p>
      <ul class="purposes"><li v-for="p in purposes" :key="p">{{ p }}</li></ul>

      <section aria-roledescription="carousel" aria-labelledby="dir-title" class="dir">
        <div class="dir-head">
          <h2 id="dir-title" class="label">UX 정책의 방향</h2>
          <span>{{ cur + 1 }} / {{ directions.length }}</span>
        </div>
        <div aria-live="polite" class="box">
          <strong>{{ String(cur + 1).padStart(2, '0') }} {{ directions[cur]!.title }}</strong>
          <p>{{ directions[cur]!.text }}</p>
        </div>
        <div class="dir-nav">
          <button type="button" aria-label="이전 방향" @click="go(cur - 1)">이전</button>
          <span class="dots">
            <button v-for="(d, i) in directions" :key="d.title" type="button" :aria-label="`방향 ${i + 1}: ${d.title}`" :aria-current="i === cur ? 'true' : undefined" @click="go(i)">{{ i === cur ? '●' : '○' }}</button>
          </span>
          <button type="button" aria-label="다음 방향" @click="go(cur + 1)">다음</button>
        </div>
      </section>
    </div>
  </section>


  <section>
    <h2 class="label">정책 목록</h2>
    <label for="q" class="sr">정책 검색</label>
    <input id="q" v-model="q" type="search" class="search" placeholder="정책·팝업 검색">
    <nav aria-label="분류" class="tabs">
      <NuxtLink v-for="t in tabs" :key="t" :to="{ query: { ...route.query, tab: t === '전체' ? undefined : t } }" :aria-current="t === tab ? 'page' : undefined">{{ t }}</NuxtLink>
    </nav>
    <table class="list">
      <thead><tr><th>#</th><th>이름</th><th>상태</th><th>최종 수정일</th></tr></thead>
      <tbody>
        <tr v-for="(r, i) in rows" :key="r.to">
          <td>{{ i + 1 }}</td>
          <td><NuxtLink :to="r.to"><strong>{{ r.title }}</strong></NuxtLink> <span class="muted">{{ r.parent }}{{ r.group && ' / ' + r.group }}</span></td>
          <td>{{ r.doc ? 'v' + r.doc.meta.version : '준비 중' }}</td>
          <td>{{ r.doc?.meta.updated ?? '—' }}</td>
        </tr>
        <tr v-if="!rows.length"><td colspan="4">검색 결과가 없습니다.</td></tr>
      </tbody>
    </table>
  </section>
</template>
