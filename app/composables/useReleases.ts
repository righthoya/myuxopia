// 릴리스 노트 목록 (최신 날짜 먼저). 헤더와 /releases 페이지가 같은 데이터를 씀
export function useReleases() {
  return useAsyncData('releases', () => queryCollection('releases').order('date', 'DESC').all())
}
