<script setup lang="ts">
// 본문 이미지. /flows/ 흐름도는 FlowFrame으로 감싸 최소 글씨 크기 유지
const props = defineProps<{ src?: string, alt?: string, width?: string | number, height?: string | number, class?: string }>()
const isFlow = computed(() => props.src?.startsWith('/flows/'))
const img = ref<HTMLImageElement>()
const w = ref(0)
const measure = () => { if (img.value?.naturalWidth) w.value = img.value.naturalWidth }
onMounted(measure)
</script>

<template>
  <FlowFrame v-if="isFlow" :width="w">
    <img ref="img" :src="src" :alt="alt" class="flow-img" @load="measure">
  </FlowFrame>
  <img v-else :src="src" :alt="alt" :width="width" :height="height" :class="props.class">
</template>
