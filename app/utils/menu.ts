// 사이드바 메뉴 (docs/ia.md 기준). sections = '준비 중' 페이지에 보여 줄 본문 틀
export const menu = [
  {
    title: 'UX 정책',
    sections: ['목적', '규칙 표', '흐름도', '예시 문구', '체크리스트'],
    groups: [{ items: [
      { title: '로그인', to: '/policies/login' },
      { title: '회원가입', to: '/policies/signup' }
    ] }]
  },
  {
    title: '기능 정책',
    sections: ['목적', '규칙 표', '흐름도', '예시 문구', '체크리스트'],
    groups: [
      { label: '계정', items: [
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
        { title: '오류·장애 처리', to: '/policies/error' }
      ] }
    ]
  },
  {
    title: '화면 패턴',
    sections: ['개요', '화면 예시', '문구', '접근성', '모바일: 추후'],
    groups: [
      { label: '레이아웃', items: [
        { title: '헤더', to: '/patterns/header' },
        { title: '푸터', to: '/patterns/footer' }
      ] },
      { label: '계정·시스템', items: [
        { title: '에러(403/404/500)', to: '/patterns/error' }
      ] }
    ]
  },
  {
    title: '팝업·문구',
    sections: ['유형', '공통 규칙', '목록 표', '체크리스트'],
    groups: [{ items: [
      { title: '팝업 목록', to: '/policies/popups' },
      { title: '문구 가이드', to: '/popups/copy-guide' }
    ] }]
  }
]

// 모든 2depth 페이지를 한 줄로 (홈 목록·같은 분류 목록에 사용)
export const allPages = menu.flatMap(m => m.groups.flatMap(g => g.items.map(i => ({ ...i, parent: m.title, group: g.label ?? '', sections: m.sections }))))

export function findPage(path: string) {
  return allPages.find(p => p.to === path)
}

// MD 머리말 related의 id → 주소
export const idToPath = (id: string) => id === 'popup-catalog' ? '/policies/popups' : id.replace(/^policy-/, '/policies/').replace(/^pattern-/, '/patterns/')
