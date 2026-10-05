<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(() => 'page-' + route.path, () => queryCollection('content').path(route.path).first())
const info = findPage(route.path)
if (!info) throw createError({ statusCode: 404, statusMessage: '페이지를 찾을 수 없습니다.', fatal: true })

const toc = computed(() => page.value?.body?.toc?.links ?? info.sections.map(s => ({ id: '', text: s })))
const related = computed(() => ((page.value?.meta.related as string[]) ?? []).map(id => findPage(idToPath(id))).filter(Boolean))
const siblings = allPages.filter(p => p.parent === info.parent && p.to !== info.to)
const mode = ref<'all' | 'required'>('all')
</script>

<template>
  <nav aria-label="현재 위치" class="crumb">
    <NuxtLink to="/">UX Guide</NuxtLink>
    <template v-if="info.parent"> / <NuxtLink :to="{ path: '/', query: { tab: info.parent } }">{{ info.parent }}</NuxtLink></template>
    <template v-if="info.group"> / {{ info.group }}</template>
    / <span aria-current="page">{{ info.title }}</span>
  </nav>
  <h1>{{ page?.title ?? info.title }}.</h1>
  <ul class="chips"><li v-for="t in (page?.meta.tags as string[]) ?? ['공통']" :key="t">{{ t }}</li></ul>

  <div class="detail">
    <article>
      <div class="head">
        <h2 class="label">복사</h2>
        <div role="group" aria-label="복사 범위" class="toggle">
          <button type="button" :aria-pressed="mode === 'all'" @click="mode = 'all'">전체</button>
          <button type="button" :aria-pressed="mode === 'required'" @click="mode = 'required'">필수만</button>
        </div>
      </div>
      <div class="cmd"><code>$ {{ page?.title ?? info.title }} 정책 — {{ mode === 'all' ? '전체 항목' : '필수 항목만' }}</code><button type="button">복사</button></div>

      <h2 class="label">요약</h2>
      <div class="box">{{ page?.description || (page ? '[요약 자리: MD 머리말 description]' : '준비 중입니다.') }}</div>

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
      <template v-if="siblings.length">
        <h2 class="label">{{ info.parent }} 더 보기</h2>
        <ul class="rel"><li v-for="r in siblings" :key="r.to"><NuxtLink :to="r.to">{{ r.title }}</NuxtLink><span class="muted">{{ r.group }}</span></li></ul>
      </template>
    </article>

    <aside>
      <dl class="facts">
        <dt>버전</dt><dd>{{ page?.meta.version ?? '—' }}</dd>
        <dt>최종 수정일</dt><dd>{{ page?.meta.updated ?? '—' }}</dd>
        <dt>출처</dt><dd>{{ page?.meta.source ?? '—' }}</dd>
        <dt>피그마</dt><dd>준비 중</dd>
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
