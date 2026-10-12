// 정책 메뉴 (docs/ia.md 기준, 1depth 4개). sections = '준비 중' 페이지에 보여 줄 본문 틀
export const menu = [
  {
    title: 'UX 정책',
    sections: ['목적', '내용'],
    groups: [{ items: [
      { title: '목적과 방향', to: '/ux-policy/purpose' },
      { title: '설계 원칙', to: '/ux-policy/principles' }
    ] }]
  },
  {
    title: '기능 정책',
    sections: ['목적', '규칙 표', '흐름'],
    groups: [
      { label: '계정', items: [
        { title: '회원가입', to: '/policies/signup' },
        { title: '로그인·인증', to: '/policies/login' },
        { title: '비밀번호', to: '/policies/password' },
        { title: '권한·역할', to: '/policies/role' }
      ] },
      { label: '탐색', items: [{ title: '검색·필터링', to: '/policies/search' }] },
      { label: '운영', items: [
        { title: '알림', to: '/policies/notification' },
        { title: '문의·고객 지원', to: '/policies/inquiry' }
      ] },
      { label: '데이터·보안', items: [
        { title: '개인정보 처리', to: '/policies/privacy' },
        { title: '오류·장애 처리', to: '/policies/error' }
      ] }
    ]
  },
  {
    title: '팝업·문구',
    sections: ['팝업 유형', '공통 규칙', '팝업 목록'],
    groups: [{ items: [{ title: '기본 팝업 목록과 문구', to: '/policies/popups' }] }]
  },
  {
    title: '접근성',
    sections: ['체크리스트 (KWCAG 2.2)'],
    groups: [{ items: [{ title: '접근성 체크리스트', to: '/accessibility/checklist' }] }]
  }
]

// 모든 2depth 페이지를 한 줄로 (홈 목록·같은 분류 목록에 사용)
export const allPages = menu.flatMap(m => m.groups.flatMap(g => g.items.map(i => ({ ...i, parent: m.title, group: g.label ?? '', sections: m.sections }))))

export function findPage(path: string) {
  return allPages.find(p => p.to === path)
}

// MD 머리말 related의 id → 주소
export const idToPath = (id: string) => id === 'popup-catalog' ? '/policies/popups' : id.replace(/^policy-/, '/policies/').replace(/^pattern-/, '/patterns/')
