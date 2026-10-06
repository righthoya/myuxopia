<script setup lang="ts">
// MD 표. '등급' 칸이 있으면: 필수·권장·선택 체크박스로 행 노출 관리
// '내용' 칸도 있으면(규칙 표): 행마다 [복사] 버튼 + 보이는 행 한꺼번에 복사. 복사할 때 {변수}는 그대로
const grades = ['필수', '권장', '선택'] as const
const show = reactive<Record<string, boolean>>({ 필수: true, 권장: true, 선택: true })
const table = ref<HTMLTableElement>()
const col = reactive({ grade: -1, item: -1, text: -1 })
const visible = ref(0)
const copiedAll = ref(false)

const cellText = (tr: HTMLTableRowElement, i: number) => tr.cells[i]?.textContent?.trim() ?? ''
const rows = () => [...(table.value?.tBodies[0]?.rows ?? [])]

onMounted(() => {
  const head = table.value?.tHead?.rows[0]
  if (!head) return
  const idx = (name: string) => [...head.cells].findIndex(c => c.textContent?.trim() === name)
  col.grade = idx('등급')
  col.item = idx('항목')
  col.text = idx('내용')
  if (col.grade < 0 || col.text < 0) return

  // 행별 복사 칸 추가 (MD 표는 정적이라 DOM에 직접 붙임)
  const th = document.createElement('th')
  th.textContent = '복사'
  head.appendChild(th)
  for (const tr of rows()) {
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.textContent = '복사'
    btn.setAttribute('aria-label', `${cellText(tr, col.item)} 내용 복사`)
    btn.onclick = async () => {
      await navigator.clipboard.writeText(cellText(tr, col.text))
      btn.textContent = '복사됨'
      setTimeout(() => (btn.textContent = '복사'), 2000)
    }
    tr.insertCell().appendChild(btn)
  }
})

watchEffect(() => {
  if (col.grade < 0) return
  let n = 0
  for (const tr of rows()) {
    const g = cellText(tr, col.grade)
    tr.hidden = g in show && !show[g]
    if (!tr.hidden) n++
  }
  visible.value = n
})

async function copyVisible() {
  const lines = rows().filter(tr => !tr.hidden)
    .map(tr => `- ${col.item >= 0 ? cellText(tr, col.item) + ': ' : ''}${cellText(tr, col.text)} (${cellText(tr, col.grade)})`)
  await navigator.clipboard.writeText(lines.join('\n'))
  copiedAll.value = true
  setTimeout(() => (copiedAll.value = false), 2000)
}
</script>

<template>
  <fieldset v-if="col.grade >= 0" class="grade-filter">
    <legend>등급</legend>
    <label v-for="g in grades" :key="g"><input v-model="show[g]" type="checkbox"> {{ g }}</label>
    <span aria-live="polite" class="muted">{{ copiedAll ? `${visible}개 항목을 복사했습니다.` : `${visible}개 항목 표시` }}</span>
    <button v-if="col.text >= 0" type="button" @click="copyVisible">표시된 항목 복사</button>
  </fieldset>
  <table ref="table"><slot /></table>
</template>
