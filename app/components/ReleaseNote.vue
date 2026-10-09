<script setup lang="ts">
// 릴리스 1건: 요약 + 본문(## 추가 · 변경 · 수정 · 삭제)
defineProps<{ release: any }>()
</script>

<template>
  <div class="release">
    <p class="release-summary">{{ release.summary }}</p>
    <div class="doc release-doc"><ContentRenderer :value="release" /></div>
  </div>
</template>
