<script setup lang="ts">
const route = useRoute()
const { data: docs } = await useAsyncData('docs', () => queryCollection('content').all())
const router = useRouter()
// 검색어도 주소(?q=)에 남겨, 검색 결과 화면을 그대로 공유할 수 있게
const q = computed({
  get: () => (route.query.q as string) ?? '',
  set: v => router.replace({ query: { ...route.query, q: v || undefined } })
})
useSeoMeta({ title: 'UXopia', description: '프로덕트 디자이너를 위한 UX 정책서. 정책과 팝업 문구를 읽고 복사해 씁니다.' })
const rows = computed(() => allPages
  .filter(p => p.title.includes(q.value.trim()))
  .map(p => ({ ...p, doc: docs.value?.find(d => d.path === p.to) })))
const { copied, copyLink } = useCopyLink()
// 상세에서 '목록으로'(/#list)로 오면 정책 목록 위치로 이동
onMounted(() => { if (route.hash === '#list') document.getElementById('list')?.scrollIntoView() })
const siteUrl = useRequestURL().host
const { data: stats } = await useFetch<Stats>('/api/stats', { default: () => ({}) })
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
        <!-- 링크 복사: 명령줄 모양 박스 (skills.sh 'TRY IT NOW' 참고) -->
        <div class="hero-cta">
          <div class="share-box">
            <code><span class="share-tag">link</span>{{ siteUrl }}</code>
            <UButton
              color="neutral" variant="ghost" class="share-copy"
              :icon="copied ? 'i-lucide-check' : 'i-lucide-link'"
              aria-label="링크 복사" @click="copyLink"
            />
          </div>
        </div>
      </div>
    </div>
  </section>


  <section id="list">
    <h2 class="label">정책 목록</h2>
    <label for="q" class="sr">정책 검색</label>
    <input id="q" v-model="q" type="search" class="search" placeholder="정책 검색">
    <table class="list">
      <thead><tr><th>#</th><th>이름</th><th>분류</th><th>상태</th><th>좋아요</th></tr></thead>
      <tbody>
        <tr v-for="(r, i) in rows" :key="r.to">
          <td>{{ i + 1 }}</td>
          <td><NuxtLink :to="r.to"><strong>{{ r.title }}</strong></NuxtLink></td>
          <td class="muted">{{ r.parent }}{{ r.group && ' / ' + r.group }}</td>
          <td>{{ r.doc ? 'v' + r.doc.meta.version : '준비 중' }}</td>
          <td>{{ stats[r.to]?.likes ?? 0 }}</td>
        </tr>
        <tr v-if="!rows.length"><td colspan="5">검색 결과가 없습니다.</td></tr>
      </tbody>
    </table>
  </section>
</template>
