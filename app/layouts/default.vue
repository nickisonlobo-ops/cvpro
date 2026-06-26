<template>
  <div class="flex flex-col h-screen overflow-hidden" :style="{ background: 'var(--color-bg, #f8fafc)' }">
    <TrialBanner />
    <AppHeader />

    <div class="flex flex-1 min-h-0">
      <AppSidebar class="hidden md:flex" />

      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>

    <AppBottomNav />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '~/components/AppHeader.vue'
import AppSidebar from '~/components/AppSidebar.vue'
import AppBottomNav from '~/components/AppBottomNav.vue'
import TrialBanner from '~/components/TrialBanner.vue'
import { usePersonalizacao } from '~/composables/usePersonalizacao'

const route = useRoute()
const { loadPersonalizacao, applyTheme, config } = usePersonalizacao()

onMounted(async () => {
  await loadPersonalizacao()
})

// Re-aplica o tema a cada troca de rota (garante que os overrides
// amber/pink estejam sempre no DOM independente do HMR)
watch(() => route.path, () => {
  applyTheme(config.value)
})
</script>
