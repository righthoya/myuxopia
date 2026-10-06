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
useSeoMeta({ title: 'UXopia', description: '프로덕트 디자이너를 위한 UX 정책서. 정책과 팝업 문구를 읽고 복사해 씁니다.' })
const rows = computed(() => allPages
  .filter(p => (tab.value === '전체' || p.parent === tab.value) && p.title.includes(q.value.trim()))
  .map(p => ({ ...p, doc: docs.value?.find(d => d.path === p.to) })))
const { copied, copyLink } = useCopyLink()
const siteUrl = useRequestURL().host
const { data: stats } = await useFetch<Stats>('/api/stats', { default: () => ({}) })
// 버전 수정 이력 팝업 (브라우저 기본 dialog: ESC로 닫힘, 닫히면 포커스 복귀)
const versionDialog = ref<HTMLDialogElement>()
const versions = computed(() => [...(docs.value ?? [])].sort((a, b) => String(b.meta.updated).localeCompare(String(a.meta.updated))))
// 히어로 배경 글씨 (hackerrank.com 방식: 흐린 글씨 + 포인터 주변만 진하게). 내용은 팝업 문구
const bgText = [
  '곧 자동 로그아웃됩니다', '작성을 그만두시겠습니까?', '접근 권한이 없습니다', '일시적인 오류가 발생했습니다',
  '로그아웃하시겠습니까?', '회원가입이 완료되었습니다', '저장되었습니다.', '삭제한 내용은 되돌릴 수 없습니다.',
  '입력하지 않은 항목이 있습니다', '파일을 올릴 수 없습니다', '문의 등록이 완료되었습니다', '필수 약관에 동의해야 가입할 수 있습니다.',
  '{유효 시간: 5분}', '{보관 기간: 30일}', '필수', '권장', '선택'
].join('   ·   ').repeat(12)
function onMove(e: PointerEvent) {
  const el = e.currentTarget as HTMLElement
  const r = el.getBoundingClientRect()
  el.style.setProperty('--x', `${e.clientX - r.left}px`)
  el.style.setProperty('--y', `${e.clientY - r.top}px`)
}
</script>

<template>
  <!-- 히어로: 화면 전체 폭 배경(흐린 글씨, 포인터 주변만 진하게) 위에 글·버튼이 떠 있음 -->
  <section class="hero" aria-labelledby="hero-title" @pointermove="onMove">
    <div class="hero-bg" aria-hidden="true">
      <p>{{ bgText }}</p>
      <p class="reveal">{{ bgText }}</p>
    </div>
    <div class="hero-inner">
      <div class="hero-text">
        <h1 id="hero-title" class="hero-title">UXopia</h1>
        <p class="hero-sub">프로덕트 디자이너를 위한 UX 정책서</p>
        <p class="hero-desc">
          프로젝트마다 다시 쓰던 UX 정책, 한 곳에 모았습니다.<br>
          정책서 쓰는 시간은 줄이고<br>
          더 좋은 경험을 고민하는 데 쓰세요.
        </p>
        <div class="hero-cta">
          <button type="button" class="btn-primary" @click="versionDialog?.showModal()">v1.0 버전</button>
        </div>
        <!-- 링크 복사: 명령줄 모양 박스 (skills.sh 'TRY IT NOW' 참고) -->
        <div class="share">
          <p id="share-label" class="share-label">링크 복사</p>
          <div class="share-box">
            <code><span aria-hidden="true">$ </span>{{ siteUrl }}</code>
            <button type="button" aria-labelledby="share-label" :title="copied ? '복사했습니다' : '링크 복사'" @click="copyLink">
              <svg v-if="!copied" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>
              <span v-else>복사됨</span>
            </button>
          </div>
          <span aria-live="polite" class="sr">{{ copied ? '링크를 복사했습니다.' : '' }}</span>
        </div>
      </div>
    </div>
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
      <thead><tr><th>#</th><th>이름</th><th>상태</th><th>좋아요</th></tr></thead>
      <tbody>
        <tr v-for="(r, i) in rows" :key="r.to">
          <td>{{ i + 1 }}</td>
          <td><NuxtLink :to="r.to"><strong>{{ r.title }}</strong></NuxtLink> <span class="muted">{{ r.parent }}{{ r.group && ' / ' + r.group }}</span></td>
          <td>{{ r.doc ? 'v' + r.doc.meta.version : '준비 중' }}</td>
          <td>{{ stats[r.to]?.likes ?? 0 }}</td>
        </tr>
        <tr v-if="!rows.length"><td colspan="4">검색 결과가 없습니다.</td></tr>
      </tbody>
    </table>
  </section>
</template>
