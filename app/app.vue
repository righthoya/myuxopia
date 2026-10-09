<script setup lang="ts">
// 외부 링크 (주소가 정해지면 여기만 바꾸면 됩니다)
const FEEDBACK_URL = 'https://open.kakao.com/o/pJ0A32Qi' // 카카오톡 오픈채팅 커뮤니티방
const SUPPORT_URL = '' // 커피값 후원 (주소가 생기면 넣기. 비어 있으면 메뉴에서 숨김)

// 릴리스 노트: content/releases/*.md. 새 버전을 공개하면 md 1개 추가
const { data: releases } = await useReleases()
const latest = computed(() => releases.value?.[0])
const items = computed(() => (releases.value ?? []).map(r => ({ label: `${r.version} · ${r.date}`, value: r.version, slot: 'release' as const })))
const byVersion = (v: string) => releases.value?.find(r => r.version === v)

// 안 본 버전 표시: 마지막으로 본 버전을 이 브라우저에 기억
const SEEN_KEY = 'uxopia:seen-release'
const seen = ref<string | null>(null)
const ready = ref(false)
onMounted(() => {
  try { seen.value = localStorage.getItem(SEEN_KEY) } catch {}
  ready.value = true
})
const hasNew = computed(() => ready.value && !!latest.value && seen.value !== latest.value.version)
const open = ref(false)
watch(open, (v) => {
  if (!v || !latest.value) return
  seen.value = latest.value.version
  try { localStorage.setItem(SEEN_KEY, latest.value.version) } catch {}
})
// 노트 안 링크로 이동하면 닫기
const route = useRoute()
watch(() => route.fullPath, () => { open.value = false })
</script>

<template>
  <!-- 토스트: 화면 아래쪽 가운데에서 올라와 2초 뒤 사라짐 -->
  <UApp :toaster="{ position: 'bottom-center', duration: 2000 }">
    <header class="top">
      <div class="brand">
        <NuxtLink to="/"><strong>UXopia</strong></NuxtLink>
        <UModal v-model:open="open" title="릴리스 노트" description="버전별 추가·변경·수정·삭제 내용">
          <UButton size="xs" color="neutral" variant="ghost" class="version-btn bg-canvas-strong rounded-md" :label="latest?.version ?? 'v1.0.0'" aria-haspopup="dialog">
            <template #trailing>
              <template v-if="hasNew"><span class="new-dot" aria-hidden="true" /><span class="sr">새 소식</span></template>
            </template>
          </UButton>
          <template #body>
            <UAccordion :items="items">
              <template #release-body="{ item }">
                <ReleaseNote v-if="byVersion(item.value!)" :release="byVersion(item.value!)" />
              </template>
            </UAccordion>
          </template>
          <template #footer>
            <UButton to="/releases" block color="neutral" variant="outline" label="전체 보기" />
          </template>
        </UModal>
      </div>
      <nav aria-label="보조 메뉴">
        <UButton class="fb-full" :to="FEEDBACK_URL" target="_blank" color="neutral" variant="link" trailing-icon="i-lucide-external-link" label="피드백 (카톡 커뮤니티)" aria-label="피드백 (카톡 커뮤니티), 새 창으로 열림" />
        <!-- 768px 미만: 아이콘 버튼 -->
        <UButton class="fb-icon" :to="FEEDBACK_URL" target="_blank" color="neutral" variant="ghost" icon="i-lucide-message-circle" aria-label="피드백" />
        <UButton v-if="SUPPORT_URL" :to="SUPPORT_URL" target="_blank" color="neutral" variant="link" trailing-icon="i-lucide-external-link" label="커피값 후원" aria-label="커피값 후원, 새 창으로 열림" />
      </nav>
    </header>
    <main class="wrap"><NuxtPage /></main>
    <footer class="foot">© 2026 jeongho</footer>
  </UApp>
</template>
