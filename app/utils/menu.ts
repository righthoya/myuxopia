// 정책 메뉴 (docs/ia.md 기준). sections = '준비 중' 페이지에 보여 줄 본문 틀
export const menu = [
  {
    title: 'UX 정책',
    sections: ['목적', '규칙 표', '흐름도', '예시 문구', '체크리스트'],
    groups: []
  },
  {
    title: '기능 정책',
    sections: ['목적', '규칙 표', '흐름도', '예시 문구', '체크리스트'],
    groups: [
      { label: '계정', items: [
        { title: '회원가입', to: '/policies/signup' },
        { title: '로그인', to: '/policies/login' },
        { title: '비밀번호', to: '/policies/password' },
        { title: '권한', to: '/policies/permission' }
      ] },
      { label: '탐색', items: [{ title: '검색·필터링', to: '/policies/search' }] },
      { label: '운영', items: [
        { title: '알림', to: '/policies/notification' },
        { title: '문의 지원', to: '/policies/inquiry' }
      ] },
      { label: '데이터·보안·법', items: [
        { title: '개인정보 처리', to: '/policies/privacy' },
        // 에러 화면(403/404/500)은 오류·장애 처리에 포함
        { title: '오류·장애 처리', to: '/policies/error', sections: ['목적', '규칙 표', '오류 화면 (403·404·500)', '흐름도', '예시 문구', '체크리스트'] }
      ] }
    ]
  },
  {
    title: '팝업·문구',
    sections: ['유형', '공통 규칙', '목록 표', '체크리스트'],
    groups: [{ items: [
      { title: '팝업 목록', to: '/policies/popups' }
    ] }]
  }
]

// 모든 2depth 페이지를 한 줄로 (홈 목록·같은 분류 목록에 사용)
export const allPages = menu.flatMap(m => m.groups.flatMap(g => g.items.map(i => ({ ...i, parent: m.title, group: g.label ?? '', sections: i.sections ?? m.sections }))))

export function findPage(path: string) {
  return allPages.find(p => p.to === path)
}

// MD 머리말 related의 id → 주소
export const idToPath = (id: string) => id === 'popup-catalog' ? '/policies/popups' : id.replace(/^policy-/, '/policies/').replace(/^pattern-/, '/patterns/')
