<script setup lang="ts">
// 본문 이미지. /flows/ 흐름도는 FlowFrame으로 감싸 최소 글씨 크기·540px 접기 적용
const props = defineProps<{ src?: string, alt?: string, width?: string | number, height?: string | number, class?: string }>()
</script>

<template>
  <FlowFrame v-if="src?.startsWith('/flows/')" class="flow-boxed">
    <img :src="src" :alt="alt" class="flow-img">
  </FlowFrame>
  <img v-else :src="src" :alt="alt" :width="width" :height="height" :class="props.class">
</template>
