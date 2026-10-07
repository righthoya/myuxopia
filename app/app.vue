<script setup lang="ts">
// 외부 링크 (주소가 정해지면 여기만 바꾸면 됩니다)
const FEEDBACK_URL = 'https://open.kakao.com/o/pJ0A32Qi' // 카카오톡 오픈채팅 커뮤니티방
// 지금 공개한 버전 (새 버전을 공개하면 목록에 추가)
const VERSIONS = ['v1.0.0']
const version = ref(VERSIONS[0])
</script>

<template>
  <!-- 토스트: 화면 하단 가운데에서 올라와 3초 뒤 사라짐 -->
  <UApp :toaster="{ position: 'bottom-center', duration: 3000 }">
    <header class="top">
      <div class="brand">
        <NuxtLink to="/"><strong>UXopia</strong></NuxtLink>
        <USelect v-model="version" :items="VERSIONS" size="xs" color="neutral" variant="none" aria-label="버전 선택" class="version-select bg-canvas-strong rounded-md" />
      </div>
      <nav aria-label="보조 메뉴">
        <UButton :to="FEEDBACK_URL" target="_blank" color="neutral" variant="link" trailing-icon="i-lucide-external-link" label="피드백 (카톡 커뮤니티)" aria-label="피드백 (카톡 커뮤니티), 새 창으로 열림" />
        <!-- 후원은 MVP 1차 완료 후 연결 (지금은 비활성) -->
        <UButton color="neutral" variant="link" label="커피값 후원" aria-label="커피값 후원, 준비 중" disabled />
      </nav>
    </header>
    <main class="wrap"><NuxtPage /></main>
    <footer class="foot">© 2026 jeongho</footer>
  </UApp>
</template>
