<script setup lang="ts">
// 릴리스 노트 전체 (고정 주소 /releases)
const { data: releases } = await useReleases()
useSeoMeta({ title: '릴리스 노트 · UXopia', description: 'UXopia 버전별 추가·변경·수정·삭제 내용' })
</script>

<template>
  <h1>릴리스 노트.</h1>
  <p class="muted">버전 규칙: 큰 숫자는 메뉴·구조 변경, 가운데는 정책·팝업 추가, 끝은 문구·오타 수정입니다.</p>
  <section v-for="r in releases" :id="r.version" :key="r.version" class="release-card">
    <h2>{{ r.version }} <span class="muted">{{ r.date }}</span></h2>
    <ReleaseNote :release="r" />
  </section>
</template>
