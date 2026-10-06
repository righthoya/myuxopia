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
const { copied, copyLink } = useCopyLink()
// 버전 수정 이력 팝업 (브라우저 기본 dialog: ESC로 닫힘, 닫히면 포커스 복귀)
const versionDialog = ref<HTMLDialogElement>()
const versions = computed(() => [...(docs.value ?? [])].sort((a, b) => String(b.meta.updated).localeCompare(String(a.meta.updated))))
</script>

<template>
  <!-- 히어로: tasteskill.dev 구조 (제목 → 부제 → 방향 요약 → 버튼 2개 | 오른쪽 메인 이미지) -->
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero-text">
      <h1 id="hero-title" class="hero-title">UX Guide</h1>
      <p class="hero-sub">프로덕트 디자이너를 위한 UX 정책서</p>
      <p class="hero-desc">
        프로젝트마다 다시 쓰던 UX 정책, 한 곳에 모았습니다.<br>
        정책서 쓰는 시간은 줄이고<br>
        더 좋은 경험을 고민하는 데 쓰세요.
      </p>
      <div class="hero-cta">
        <button type="button" class="btn-primary" @click="versionDialog?.showModal()">v1.0 버전</button>
        <button type="button" class="btn" @click="copyLink">링크 복사</button>
        <span aria-live="polite" class="muted">{{ copied ? '링크를 복사했습니다.' : '' }}</span>
      </div>
    </div>
    <div class="ph hero-media">[이미지 자리: 메인화면]</div>
  </section>

  <dialog ref="versionDialog" aria-labelledby="ver-title" class="dialog">
    <h2 id="ver-title">버전 수정 이력</h2>
    <table>
      <thead><tr><th>문서</th><th>버전</th><th>최종 수정일</th></tr></thead>
      <tbody>
        <tr v-for="d in versions" :key="d.path">
          <td><NuxtLink :to="d.path">{{ d.title }}</NuxtLink></td>
          <td>{{ d.meta.version }}</td>
          <td>{{ d.meta.updated }}</td>
        </tr>
      </tbody>
    </table>
    <form method="dialog" class="dialog-actions"><button>닫기</button></form>
  </dialog>

  <section id="list">
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
