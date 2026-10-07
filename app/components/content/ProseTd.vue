<script setup lang="ts">
// 표 칸이 등급(필수·권장·선택) 하나뿐이면 UBadge로 표시. 색 + 글자 함께
const GRADE = { 필수: 'error', 권장: 'warning', 선택: 'neutral' } as const
const slots = useSlots()
const grade = computed(() => {
  const nodes = slots.default?.() ?? []
  const text = nodes.length === 1 && typeof nodes[0]!.children === 'string' ? nodes[0]!.children.trim() : ''
  return text in GRADE ? text as keyof typeof GRADE : null
})
</script>

<template>
  <td>
    <UBadge v-if="grade" :color="GRADE[grade]" variant="subtle" :label="grade" />
    <slot v-else />
  </td>
</template>
