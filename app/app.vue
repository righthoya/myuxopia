<script setup lang="ts">
// 외부 링크 (주소가 정해지면 여기만 바꾸면 됩니다)
const FEEDBACK_URL = 'https://open.kakao.com/o/pJ0A32Qi' // 카카오톡 오픈채팅 커뮤니티방
const SUPPORT_URL = '' // 커피값 후원 (주소가 생기면 넣기. 비어 있으면 메뉴에서 숨김)
// 지금 공개한 버전 (새 버전을 공개하면 목록에 추가)
const VERSIONS = ['v1.0.0']
const version = ref(VERSIONS[0])
</script>

<template>
  <!-- 토스트: 화면 아래쪽 가운데에서 올라와 2초 뒤 사라짐 -->
  <UApp :toaster="{ position: 'bottom-center', duration: 2000 }">
    <header class="top">
      <div class="brand">
        <!-- 로고: public/uxopia-logo.svg 파일을 넣은 뒤 <img src="/uxopia-logo.svg" alt="" width="24" height="24"> 를 strong 앞에 추가 -->
        <NuxtLink to="/" class="logo"><strong>UXopia</strong></NuxtLink>
        <USelect v-model="version" :items="VERSIONS" size="xs" color="neutral" variant="none" aria-label="버전 선택" class="version-select bg-canvas-strong rounded-md" />
      </div>
      <nav aria-label="보조 메뉴">
        <UButton class="fb-full" :to="FEEDBACK_URL" target="_blank" color="neutral" variant="link" trailing-icon="i-lucide-external-link" label="피드백 (카톡 커뮤니티)" aria-label="피드백 (카톡 커뮤니티), 새 창으로 열림" />
        <!-- 768px 미만: 아이콘 버튼 -->
        <UButton class="fb-icon" :to="FEEDBACK_URL" target="_blank" color="neutral" variant="ghost" icon="i-lucide-message-circle" aria-label="피드백" />
        <UButton v-if="SUPPORT_URL" :to="SUPPORT_URL" target="_blank" color="neutral" variant="link" trailing-icon="i-lucide-external-link" label="커피값 후원" aria-label="커피값 후원, 새 창으로 열림" />
      </nav>
    </header>
    <main class="wrap"><NuxtPage /></main>
    <footer class="foot">© 2026 jeongho</footer>
  </UApp>
</template>
