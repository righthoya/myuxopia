// 현재 주소 복사 + "복사했습니다" 안내 (2초)
export function useCopyLink() {
  const copied = ref(false)
  async function copyLink() {
    await navigator.clipboard.writeText(location.href)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  }
  return { copied, copyLink }
}
