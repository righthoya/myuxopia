<script setup lang="ts">
// MD 표
// - '등급' 칸이 있으면: 필수·권장·선택 체크박스로 행 노출 관리
// - 규칙 표('내용' + '{변수}' 칸): 행마다 [복사] 버튼. 복사할 때 {변수}는 그대로
// - 목록 표('#' 칸)가 10행을 넘으면: 10개씩 페이지네이션
const PAGE_SIZE = 10
const grades = ['필수', '권장', '선택'] as const
const show = reactive<Record<string, boolean>>({ 필수: true, 권장: true, 선택: true })
const table = ref<HTMLTableElement>()
const col = reactive({ grade: -1, item: -1, text: -1, vars: -1 })
const visible = ref(0)
const paged = ref(false)
const page = ref(1)
const total = ref(0)

const cellText = (tr: HTMLTableRowElement, i: number) => tr.cells[i]?.textContent?.trim() ?? ''
const rows = () => [...(table.value?.tBodies[0]?.rows ?? [])]

onMounted(() => {
  const head = table.value?.tHead?.rows[0]
  if (!head) return
  const labels = () => [...head.cells].map(c => c.textContent?.trim() ?? '')
  const idx = (name: string) => labels().indexOf(name)
  col.grade = idx('등급')
  col.item = idx('항목')
  col.text = idx('내용')
  col.vars = idx('{변수}')
  paged.value = labels()[0] === '#' && rows().length > PAGE_SIZE

  if (col.grade >= 0 && col.text >= 0 && col.vars >= 0) {
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
  }
  // 모바일에서 표를 카드처럼 세로로 풀 때 칸 이름을 보여 주기 위한 라벨
  const l = labels()
  for (const tr of rows()) [...tr.cells].forEach((td, i) => td.dataset.label = l[i])
})

// 등급 필터 → 페이지 순서로 행 노출 결정
watchEffect(() => {
  if (col.grade < 0 && !paged.value) return
  const kept = rows().filter(tr => {
    const g = col.grade >= 0 ? cellText(tr, col.grade) : ''
    return !(g in show) || show[g]
  })
  visible.value = kept.length
  total.value = kept.length
  const from = (page.value - 1) * PAGE_SIZE
  for (const tr of rows()) {
    const i = kept.indexOf(tr)
    tr.hidden = i < 0 || (paged.value && (i < from || i >= from + PAGE_SIZE))
  }
})
</script>

<template>
  <fieldset v-if="col.grade >= 0" class="grade-filter">
    <legend>등급</legend>
    <label v-for="g in grades" :key="g"><input v-model="show[g]" type="checkbox"> {{ g }}</label>
    <span aria-live="polite" class="muted">{{ visible }}개 항목 표시</span>
  </fieldset>
  <table ref="table"><slot /></table>
  <div v-if="paged" class="pager">
    <UPagination v-model:page="page" :total="total" :items-per-page="PAGE_SIZE" color="neutral" variant="outline" />
    <span aria-live="polite" class="muted">{{ (page - 1) * PAGE_SIZE + 1 }}-{{ Math.min(page * PAGE_SIZE, total) }} / {{ total }}</span>
  </div>
</template>
