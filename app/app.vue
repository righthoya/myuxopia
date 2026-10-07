<script setup lang="ts">
// 외부 링크 (주소가 정해지면 여기만 바꾸면 됩니다)
const FEEDBACK_URL = 'https://open.kakao.com/o/pJ0A32Qi' // 카카오톡 오픈채팅 커뮤니티방
const SUPPORT_URL = '#' // 커피값 후원
// 지금 공개한 버전 (새 버전을 공개하면 목록에 추가)
const VERSIONS = ['v1.0.0']
const version = ref(VERSIONS[0])
</script>

<template>
  <UApp>
    <header class="top">
      <div class="brand">
        <NuxtLink to="/"><strong>UXopia</strong></NuxtLink>
        <USelect v-model="version" :items="VERSIONS" size="xs" color="neutral" variant="none" aria-label="버전 선택" class="version-select bg-canvas-strong rounded-md" />
      </div>
      <nav aria-label="보조 메뉴">
        <UButton :to="FEEDBACK_URL" target="_blank" color="neutral" variant="link" trailing-icon="i-lucide-external-link" label="피드백 (카톡 커뮤니티)" aria-label="피드백 (카톡 커뮤니티), 새 창으로 열림" />
        <UButton :to="SUPPORT_URL" target="_blank" color="neutral" variant="link" trailing-icon="i-lucide-external-link" label="커피값 후원" aria-label="커피값 후원, 새 창으로 열림" />
      </nav>
    </header>
    <main class="wrap"><NuxtPage /></main>
    <footer class="foot">© 2026 jeongho</footer>
  </UApp>
</template>
