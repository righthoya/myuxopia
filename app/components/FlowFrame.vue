<script setup lang="ts">
// 흐름도 틀: 글씨가 12px 이상 보이도록 그림을 줄이지 않음.
// 본문 폭이 그림 폭보다 좁으면 [흐름도 펼쳐 보기]로 접어 두고, 펼치면 아래에 같은 크기로 보여 줌(옆으로 밀어 보기)
const props = defineProps<{ width: number }>()
const box = ref<HTMLElement>()
const fits = ref(true)
const open = ref(false)
let ro: ResizeObserver | undefined
const check = () => { fits.value = !props.width || (box.value?.clientWidth ?? 0) >= props.width }
onMounted(() => { ro = new ResizeObserver(check); ro.observe(box.value!); check() })
watch(() => props.width, check)
onBeforeUnmount(() => ro?.disconnect())
</script>

<template>
  <!-- 마크다운 <p> 안에 들어가므로 span으로 만듦 -->
  <span ref="box" class="flow-frame">
    <button v-if="!fits" type="button" class="flow-toggle" :aria-expanded="open" @click="open = !open">
      {{ open ? '흐름도 접기' : '흐름도 펼쳐 보기' }}
    </button>
    <span v-show="fits || open" class="flow-scroll"><slot /></span>
  </span>
</template>
