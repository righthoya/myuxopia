<script setup lang="ts">
// 흐름도 틀: 그림은 줄이지 않음(최소 글씨 12px). 기본은 세로 540px까지만 보이고,
// 더 길면 아래 [펼치기]로 전체를 펼침. 가로로 넓으면 틀 안에서 옆으로 밀어 보기
const MAX = 540
const inner = ref<HTMLElement>()
const tall = ref(false)
const open = ref(false)
let ro: ResizeObserver | undefined
const check = () => { tall.value = (inner.value?.scrollHeight ?? 0) > MAX + 1 }
onMounted(() => {
  ro = new ResizeObserver(check)
  ro.observe(inner.value!)
  for (const el of inner.value!.children) ro.observe(el)
  inner.value!.addEventListener('load', check, true)
  check()
})
onBeforeUnmount(() => ro?.disconnect())
</script>

<template>
  <!-- 마크다운 <p> 안에 들어가므로 span으로 만듦 -->
  <span class="flow-frame">
    <span ref="inner" class="flow-scroll" :style="tall && !open ? { maxHeight: MAX + 'px' } : undefined">
      <slot />
    </span>
    <button v-if="tall" type="button" class="flow-toggle" :aria-expanded="open" @click="open = !open">
      {{ open ? '접기' : '펼치기' }}
    </button>
  </span>
</template>
