export default defineAppConfig({
  ui: {
    // 색 값은 main.css @theme의 CSS 변수(--color-ink-*, --color-ember-*, stone)에서 가져옴
    // primary: 먹색에 가까운 남색 'ink' / accent: 보조 포인트 'ember'(로고·장식) / neutral: 따뜻한 회색 'stone'
    colors: { primary: 'ink', accent: 'ember', neutral: 'stone' }
  }
})
