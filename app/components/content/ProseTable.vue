<script setup lang="ts">
// MD 표. '등급' 칸이 있으면 위에 필수·권장·선택 체크박스를 두고, 체크한 등급의 행만 보여 줌
const grades = ['필수', '권장', '선택'] as const
const show = reactive<Record<string, boolean>>({ 필수: true, 권장: true, 선택: true })
const table = ref<HTMLTableElement>()
const col = ref(-1)
const visible = ref(0)

onMounted(() => {
  const head = table.value?.tHead?.rows[0]
  col.value = head ? [...head.cells].findIndex(c => c.textContent?.trim() === '등급') : -1
})
watchEffect(() => {
  const rows = table.value?.tBodies[0]?.rows
  if (col.value < 0 || !rows) return
  let n = 0
  for (const tr of rows) {
    const g = tr.cells[col.value]?.textContent?.trim() ?? ''
    tr.hidden = g in show && !show[g]
    if (!tr.hidden) n++
  }
  visible.value = n
})
</script>

<template>
  <fieldset v-if="col >= 0" class="grade-filter">
    <legend>등급</legend>
    <label v-for="g in grades" :key="g"><input v-model="show[g]" type="checkbox"> {{ g }}</label>
    <span aria-live="polite" class="muted">{{ visible }}개 항목 표시</span>
  </fieldset>
  <table ref="table"><slot /></table>
</template>
