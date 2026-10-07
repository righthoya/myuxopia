<script setup lang="ts">
// 외부 링크 (주소가 정해지면 여기만 바꾸면 됩니다)
const FEEDBACK_URL = 'https://open.kakao.com/o/pJ0A32Qi' // 카카오톡 오픈채팅 커뮤니티방
const SUPPORT_URL = '#' // 커피값 후원
</script>

<template>
  <UApp>
    <header class="top">
      <NuxtLink to="/"><strong>UXopia</strong></NuxtLink>
      <nav aria-label="보조 메뉴">
        <a :href="FEEDBACK_URL" target="_blank" rel="noopener">피드백 (카톡 커뮤니티)</a>
        <a :href="SUPPORT_URL" target="_blank" rel="noopener">커피값 후원</a>
      </nav>
    </header>
    <main class="wrap"><NuxtPage /></main>
    <footer class="foot">© 2026 jeongho</footer>
  </UApp>
</template>
