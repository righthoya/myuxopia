<script setup lang="ts">
const route = useRoute()
const { data: docs } = await useAsyncData('docs', () => queryCollection('content').all())
const tabs = ['전체', ...menu.map(m => m.title)]
const tab = computed(() => (route.query.tab as string) || '전체')
const q = ref('')
const rows = computed(() => allPages
  .filter(p => (tab.value === '전체' || p.parent === tab.value) && p.title.includes(q.value.trim()))
  .map(p => ({ ...p, doc: docs.value?.find(d => d.path === p.to) })))
// 목적과 방향 · 설계 원칙 (docs/map.md 결정 사항 요약)
const principles = [
  '복사해서 바로 씁니다. 페이지 전체와 항목별 복사를 제공합니다.',
  '프로젝트마다 바뀌는 값은 {변수}로 표시합니다.',
  '규칙의 강도를 필수 · 권장 · 선택으로 나눕니다.',
  '문구는 합니다체로 씁니다.',
  '색만으로 구분하지 않습니다. (KWCAG 2.2)'
]
const sample = '필수 약관에 동의해야 가입할 수 있습니다.'
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <div>
      <h1 id="hero-title" class="ph wordmark">[로고 워드마크 자리: UX GUIDE]</h1>
      <p class="label">프로덕트 디자이너를 위한 UX 정책서</p>
    </div>
    <div>
      <p class="lead">프로젝트마다 반복되는 UX 결정을 표준으로 정리합니다. 정책과 팝업 문구를 읽고, 필요한 항목을 그대로 복사해 씁니다.</p>
      <p class="label">설계 원칙</p>
      <ol class="principles">
        <li v-for="p in principles" :key="p">{{ p }}</li>
      </ol>
    </div>
  </section>

  <section class="hero">
    <div>
      <p class="label">바로 써 보기</p>
      <div class="cmd"><code>$ {{ sample }}</code><button type="button">복사</button></div>
    </div>
    <div>
      <p class="label">적용 유형</p>
      <ul class="chips"><li v-for="t in ['공통', 'B2B', '플랫폼', 'B2C', '공공']" :key="t">{{ t }}</li></ul>
    </div>
  </section>

  <section>
    <h2 class="label">정책 목록</h2>
    <label for="q" class="sr">정책 검색</label>
    <input id="q" v-model="q" type="search" class="search" placeholder="정책·팝업 검색">
    <nav aria-label="분류" class="tabs">
      <NuxtLink v-for="t in tabs" :key="t" :to="{ query: t === '전체' ? {} : { tab: t } }" :aria-current="t === tab ? 'page' : undefined">{{ t }}</NuxtLink>
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
