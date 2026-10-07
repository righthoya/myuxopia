// 복사 + 화면 하단 토스트 안내 (3초 뒤 사라짐, 위치·시간은 app.vue <UApp :toaster>)
export function useCopyToast() {
  const toast = useToast()
  return async (text: string, title = '복사됨') => {
    await navigator.clipboard.writeText(text)
    toast.add({ title, icon: 'i-lucide-check', color: 'neutral', progress: false, close: false })
  }
}

// 현재 페이지 주소 복사
export function useCopyLink() {
  const copy = useCopyToast()
  const copied = ref(false)
  async function copyLink() {
    await copy(location.href, '링크 복사됨')
    copied.value = true
    setTimeout(() => (copied.value = false), 3000)
  }
  return { copied, copyLink }
}
