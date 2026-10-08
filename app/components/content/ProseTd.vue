<script setup lang="ts">
// 표 칸이 등급(필수·권장·선택) 하나뿐이면 UBadge로 표시. 색 + 글자 함께
// 필수 = primary solid, 권장 = primary soft, 선택 = neutral outline
const GRADE = {
  필수: { color: 'primary', variant: 'solid' },
  권장: { color: 'primary', variant: 'soft' },
  선택: { color: 'neutral', variant: 'outline' }
} as const
const slots = useSlots()
const grade = computed(() => {
  const nodes = slots.default?.() ?? []
  const text = nodes.length === 1 && typeof nodes[0]!.children === 'string' ? nodes[0]!.children.trim() : ''
  return text in GRADE ? text as keyof typeof GRADE : null
})
</script>

<template>
  <td>
    <UBadge v-if="grade" class="w-fit shrink-0" :color="GRADE[grade].color" :variant="GRADE[grade].variant" :label="grade" />
    <slot v-else />
  </td>
</template>
