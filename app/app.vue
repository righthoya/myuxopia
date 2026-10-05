<template>
  <UApp>
    <header class="top">
      <NuxtLink to="/"><strong>UX Guide</strong></NuxtLink>
      <nav aria-label="주 메뉴">
        <NuxtLink v-for="m in menu" :key="m.title" :to="{ path: '/', query: { tab: m.title } }">{{ m.title }}</NuxtLink>
        <NuxtLink v-for="p in extraPages" :key="p.to" :to="p.to">{{ p.title }}</NuxtLink>
      </nav>
    </header>
    <main class="wrap"><NuxtPage /></main>
  </UApp>
</template>
