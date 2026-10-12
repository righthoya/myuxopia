<script setup lang="ts">
// 규칙 표 행별 '복사' 버튼 (작은 ghost UButton). 복사되면 하단 토스트로 안내
// text 대신 getText를 주면 누를 때의 값(예: 지금 고른 문구 톤)을 복사
const props = defineProps<{ text?: string, getText?: () => string, label: string }>()
const copy = useCopyToast()
</script>

<template>
  <UButton
    size="xs" color="neutral" variant="ghost" icon="i-lucide-copy" label="복사"
    :aria-label="`${label} 내용 복사`"
    @click="copy(props.getText ? props.getText() : (props.text ?? ''))"
  />
</template>
