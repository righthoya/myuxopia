<script setup lang="ts">
// 외부 링크 (주소가 정해지면 여기만 바꾸면 됩니다)
const FEEDBACK_URL = 'https://open.kakao.com/o/pJ0A32Qi' // 카카오톡 오픈채팅 커뮤니티방
const SUPPORT_URL = '#' // 커피값 후원
const { copied, copyLink } = useCopyLink()
</script>

<template>
  <UApp>
    <header class="top">
      <NuxtLink to="/"><strong>UX Guide</strong></NuxtLink>
      <nav aria-label="보조 메뉴">
        <a :href="FEEDBACK_URL" target="_blank" rel="noopener">피드백 (카톡 커뮤니티)</a>
        <a :href="SUPPORT_URL" target="_blank" rel="noopener">커피값 후원</a>
        <button type="button" class="icon-btn" aria-label="링크 복사" title="링크 복사" @click="copyLink">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1 1" /><path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1-1" /></svg>
        </button>
        <span aria-live="polite" class="muted">{{ copied ? '복사했습니다.' : '' }}</span>
      </nav>
    </header>
    <main class="wrap"><NuxtPage /></main>
  </UApp>
</template>
