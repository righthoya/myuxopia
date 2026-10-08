// 복사 + 화면 아래쪽 토스트 안내 (2초 뒤 사라짐, 위치는 app.vue <UApp :toaster>)
export function useCopyToast() {
  const toast = useToast()
  return async (text: string, title = '복사되었습니다.') => {
    await navigator.clipboard.writeText(text)
    toast.add({ title, icon: 'i-lucide-check', color: 'neutral', duration: 2000, progress: false, close: false })
  }
}

// 현재 페이지 주소 복사
export function useCopyLink() {
  const copy = useCopyToast()
  const copied = ref(false)
  async function copyLink() {
    await copy(location.href, '링크가 복사되었습니다.')
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  }
  return { copied, copyLink }
}
