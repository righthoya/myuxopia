export default defineAppConfig({
  ui: {
    // 색 값은 main.css @theme의 CSS 변수(--color-ink-*, stone)에서 가져옴
    // primary: 먹색에 가까운 남색 'ink' / neutral: 따뜻한 회색 'stone'
    colors: { primary: 'ink', neutral: 'stone' }
  }
})
