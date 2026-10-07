<script setup lang="ts">
// 규칙 표 행별 '복사' 버튼 (작은 ghost UButton)
const props = defineProps<{ text: string, label: string }>()
const copied = ref(false)
async function copy() {
  await navigator.clipboard.writeText(props.text)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>

<template>
  <UButton
    size="xs" color="neutral" variant="ghost"
    :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
    :label="copied ? '복사됨' : '복사'"
    :aria-label="`${label} 내용 ${copied ? '복사됨' : '복사'}`"
    @click="copy"
  />
</template>
