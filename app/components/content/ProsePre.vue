<script setup lang="ts">
// MD 코드 블록. ```mermaid 는 흐름도 그림으로 그리고, 원본 텍스트는 접어서 함께 둠 (화면 낭독기·복사용)
const props = defineProps<{ code?: string, language?: string, class?: string }>()
const id = 'flow-' + useId().replace(/[^a-z0-9]/gi, '')
const svg = ref('')
const width = ref(0)
onMounted(async () => {
  if (props.language !== 'mermaid' || !props.code) return
  const { default: mermaid } = await import('mermaid')
  mermaid.initialize({ startOnLoad: false, theme: 'neutral', fontFamily: 'system-ui, sans-serif', fontSize: 14, flowchart: { htmlLabels: true } })
  const out = (await mermaid.render(id, props.code)).svg
  // mermaid는 칸에 맞춰 줄이므로, 원래 크기(글씨 14px)로 고정
  width.value = Math.ceil(Number(out.match(/max-width:\s*([\d.]+)px/)?.[1] ?? 0))
  svg.value = out.replace(/width="100%"/, `width="${width.value}"`).replace(/max-width:\s*[\d.]+px;?/, '')
})
</script>

<template>
  <figure v-if="language === 'mermaid'" class="flow">
    <FlowFrame v-if="svg" :width="width">
      <span role="img" aria-label="흐름도. 아래 '흐름 텍스트로 보기'에서 내용을 확인할 수 있습니다." class="flow-svg" v-html="svg" />
    </FlowFrame>
    <details>
      <summary>흐름 텍스트로 보기</summary>
      <pre>{{ code }}</pre>
    </details>
  </figure>
  <pre v-else :class="props.class"><slot /></pre>
</template>
