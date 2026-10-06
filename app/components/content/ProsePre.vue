<script setup lang="ts">
// MD 코드 블록. ```mermaid 는 흐름도 그림으로 그리고, 원본 텍스트는 접어서 함께 둠 (화면 낭독기·복사용)
const props = defineProps<{ code?: string, language?: string, class?: string }>()
const id = 'flow-' + useId().replace(/[^a-z0-9]/gi, '')
const svg = ref('')
onMounted(async () => {
  if (props.language !== 'mermaid' || !props.code) return
  const { default: mermaid } = await import('mermaid')
  mermaid.initialize({ startOnLoad: false, theme: 'neutral', fontFamily: 'system-ui, sans-serif', flowchart: { htmlLabels: true } })
  svg.value = (await mermaid.render(id, props.code)).svg
})
</script>

<template>
  <figure v-if="language === 'mermaid'" class="flow">
    <div v-if="svg" role="img" aria-label="흐름도. 아래 '흐름 텍스트로 보기'에서 내용을 확인할 수 있습니다." v-html="svg" />
    <details>
      <summary>흐름 텍스트로 보기</summary>
      <pre>{{ code }}</pre>
    </details>
  </figure>
  <pre v-else :class="props.class"><slot /></pre>
</template>
