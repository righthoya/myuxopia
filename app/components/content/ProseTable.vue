<script setup lang="ts">
import { h, render } from 'vue'
import RowCopy from '~/components/RowCopy.vue'
// MD 표
// - '등급' 칸이 있으면: 필수·권장·선택 체크박스로 행 노출 관리
// - 규칙 표('내용' + '{변수}' 칸): 행마다 [복사] 버튼. 복사할 때 {변수}는 그대로
// - 목록 표('#' 칸)·규칙 표가 10행 이상이면: 10개씩 페이지네이션 (걸러진 결과가 10개 이하면 페이지 번호 숨김)
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
const appContext = getCurrentInstance()?.appContext

onMounted(() => {
  const head = table.value?.tHead?.rows[0]
  if (!head) return
  const labels = () => [...head.cells].map(c => c.textContent?.trim() ?? '')
  const idx = (name: string) => labels().indexOf(name)
  col.grade = idx('등급')
  col.item = idx('항목')
  col.text = idx('내용')
  col.vars = idx('{변수}')
  // 팝업 목록 표('#'·'제목'·'본문' 칸): 행마다 제목·본문·버튼 문구를 한 번에 복사
  const [code, title, body, btns, sit] = ['#', '제목', '본문', '버튼', '상황'].map(idx)
  if (code === 0 && title >= 0 && body >= 0) {
    const th = document.createElement('th')
    th.textContent = '복사'
    head.appendChild(th)
    for (const tr of rows()) {
      const v = (i: number) => (i >= 0 && cellText(tr, i) !== '—' ? cellText(tr, i) : '')
      const text = [v(title), v(body), v(btns) && `[${v(btns)}]`].filter(Boolean).join('\n')
      const vnode = h(RowCopy, { text, label: `${v(code)} ${v(sit)}` })
      vnode.appContext = appContext ?? null
      render(vnode, tr.insertCell())
    }
  }

  if (col.grade >= 0 && col.text >= 0 && col.vars >= 0) {
    // 행별 복사 칸 추가 (MD 표는 정적이라 DOM에 직접 붙임)
    const th = document.createElement('th')
    th.textContent = '복사'
    head.appendChild(th)
    for (const tr of rows()) {
      // MD 표는 정적이라 칸을 직접 붙이고, 그 안에 UButton(RowCopy)을 렌더
      const vnode = h(RowCopy, { text: cellText(tr, col.text), label: cellText(tr, col.item) })
      vnode.appContext = appContext ?? null
      render(vnode, tr.insertCell())
    }
  }
  // '{변수}' 칸: 변수 이름을 본문 {변수}와 같은 강조로 표시 (예: 가입 방식 (선택지…))
  if (col.vars >= 0) {
    for (const tr of rows()) {
      const td = tr.cells[col.vars]
      const value = td?.textContent?.trim() ?? ''
      if (!td || !value || value === '—') continue
      td.replaceChildren(...value.split(/,\s*/).flatMap((part, i) => {
        const m = part.match(/^(.+?)(\s*\(.*\))?$/)!
        const span = document.createElement('span')
        span.className = 'var'
        span.textContent = m[1]!
        return [...(i ? [', '] : []), span, ...(m[2] ? [m[2]] : [])]
      }))
    }
  }

  // 10행 이상이면 페이지네이션. 다른 페이지 행은 접어서(visibility: collapse) 숨겨
  // 칸 폭 계산에는 계속 포함되게 함 → 페이지를 넘겨도 칸 폭이 같음
  const isRuleTable = col.grade >= 0 && col.text >= 0 && col.vars >= 0
  paged.value = (labels()[0] === '#' || isRuleTable) && rows().length >= PAGE_SIZE

  // 모바일에서 표를 카드처럼 세로로 풀 때 칸 이름을 보여 주기 위한 라벨
  const l = labels()
  for (const tr of rows()) [...tr.cells].forEach((td, i) => td.dataset.label = l[i])
})

// 등급 필터를 바꾸면 1페이지부터
watch(show, () => { page.value = 1 })

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
    tr.hidden = i < 0
    tr.classList.toggle('off-page', i >= 0 && paged.value && (i < from || i >= from + PAGE_SIZE))
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
  <div v-if="paged && total > PAGE_SIZE" class="pager">
    <UPagination v-model:page="page" :total="total" :items-per-page="PAGE_SIZE" color="neutral" variant="outline" />
    <span aria-live="polite" class="muted">{{ (page - 1) * PAGE_SIZE + 1 }}-{{ Math.min(page * PAGE_SIZE, total) }} / {{ total }}</span>
  </div>
</template>
