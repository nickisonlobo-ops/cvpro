<template>
  <header class="border-b flex items-center justify-between px-6 shrink-0 shadow-lg sticky top-0 z-30" :class="headerHeight" :style="{ background: 'var(--color-sidebar, #ffffff)', borderColor: 'var(--color-primary-border, rgba(236,72,153,0.3))' }">
    <!-- Logo -->
    <div class="flex items-center gap-2.5">
      <div
        v-if="!config.logo_url"
        class="w-8 h-8 rounded-xl flex items-center justify-center shadow-md"
        style="background: rgba(255,255,255,0.15)"
      >
        <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24" aria-hidden="true" :style="{ color: 'var(--color-primary-text, #ffffff)' }"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"/></svg>
      </div>
      <img v-else :src="config.logo_url" alt="Logo" class="object-contain rounded-xl" :style="{ width: headerLogoPx + 'px', height: headerLogoPx + 'px' }" />
      <span class="text-lg font-black tracking-tight" :style="{ color: 'var(--color-primary-text, #ffffff)' }">{{ config.nome_empresa }}</span>
    </div>

    <!-- Ações -->
    <div class="flex items-center gap-3">
      <span class="text-sm hidden sm:block" :style="{ color: 'var(--color-primary-text, #ffffff)' }">Olá, {{ displayName }}</span>
      <div
        class="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm select-none shadow"
        :style="{ background: 'var(--color-primary, #ec4899)', color: 'var(--color-primary-text, #ffffff)' }"
      >
        {{ initials }}
      </div>
      <button
        type="button"
        class="flex items-center gap-1.5 text-sm transition-colors px-3 py-1.5 rounded-lg hover:bg-black/5"
        :style="{ color: 'var(--color-primary-text, #ffffff)' }"
        @click="handleLogout"
      >
        <span>Sair</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"/></svg>
      </button>
    </div>

    <!-- Banner trial -->
    <div
      v-if="diasRestantesTrial !== null && diasRestantesTrial >= 0"
      class="border-b px-4 py-2 flex items-center justify-between gap-4"
      :style="diasRestantesTrial <= 2
        ? 'background: linear-gradient(90deg,#fef3c7,#fde68a); border-color:#fcd34d; color:#92400e'
        : 'background: linear-gradient(90deg,#f0fdfa,#ccfbf1); border-color:#99f6e4; color:#0f766e'"
    >
      <div class="flex items-center gap-3 min-w-0">
        <!-- Barra de progresso -->
        <div class="hidden sm:flex items-center gap-1.5 shrink-0">
          <span class="text-xs font-bold">Teste grátis:</span>
          <div class="w-28 h-2 rounded-full overflow-hidden" style="background: rgba(0,0,0,0.1)">
            <div
              class="h-full rounded-full transition-all"
              :style="{
                width: `${Math.max(4, ((7 - diasRestantesTrial) / 7) * 100)}%`,
                background: diasRestantesTrial <= 2 ? '#d97706' : '#0d9488'
              }"
            ></div>
          </div>
        </div>
        <span class="text-xs font-semibold truncate">
          <template v-if="diasRestantesTrial === 0">⚠️ Último dia! Assine agora para não perder o acesso.</template>
          <template v-else-if="diasRestantesTrial <= 2">⏳ {{ diasRestantesTrial }} dia{{ diasRestantesTrial > 1 ? 's' : '' }} restantes no teste. Assine para continuar.</template>
          <template v-else>🎉 Você está no período de teste gratuito — {{ diasRestantesTrial }} dias restantes.</template>
        </span>
      </div>
      <a
        href="/landing#precos"
        class="shrink-0 text-xs px-3 py-1 rounded-lg font-bold transition-all hover:scale-105 whitespace-nowrap"
        :style="diasRestantesTrial <= 2 ? 'background:#92400e;color:#fff' : 'background:#0d9488;color:#fff'"
      >
        Ver planos
      </a>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { usePersonalizacao } from '~/composables/usePersonalizacao'
import { createSupabaseClient } from '~/lib/supabase'

defineOptions({ name: 'AppHeader' })

const router = useRouter()
const { logout } = useAuth()
const supabase = createSupabaseClient()
const { config } = usePersonalizacao()

function logoSizeToPx(s: string): number {
  const num = parseInt(s)
  if (!isNaN(num)) return num
  switch (s) {
    case 'sm':  return 28
    case 'lg':  return 44
    case 'xl':  return 56
    case '2xl': return 72
    default:    return 32
  }
}

const headerLogoPx = computed(() => logoSizeToPx(config.value.logo_size))

const headerHeight = computed(() => {
  if (!config.value.logo_url) return 'h-16'
  const px = headerLogoPx.value
  if (px <= 28) return 'h-14'
  if (px <= 32) return 'h-16'
  if (px <= 44) return 'h-[4.5rem]'
  if (px <= 56) return 'h-20'
  if (px <= 72) return 'h-24'
  return 'h-28'
})

const userName = ref('')
const diasRestantesTrial = ref<number | null>(null)

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  userName.value = user?.user_metadata?.full_name ?? user?.email ?? ''

  const perfil = user?.user_metadata?.perfil as string | undefined
  if (perfil !== 'funcionario') {
    let empresaId = (user?.user_metadata?.empresa_id as number | null) ?? null
    if (!empresaId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('empresa_id')
        .eq('id', user!.id)
        .maybeSingle()
      empresaId = profile?.empresa_id ?? null
    }
    if (empresaId) {
      const { data: rows } = await supabase.rpc('get_empresa_plano', { p_empresa_id: empresaId })
      const info = rows?.[0]
      if (info && info.plano === 'trial' && info.trial_end) {
        const diffDias = Math.ceil((new Date(info.trial_end).getTime() - Date.now()) / 86400000)
        if (diffDias >= 0) diasRestantesTrial.value = diffDias
      }
    }
  }
})

const displayName = computed(() => {
  if (!userName.value) return ''
  return userName.value.split('@')[0]
})

const initials = computed(() => {
  const name = userName.value
  if (!name) return 'U'
  const parts = name.split(' ').filter(Boolean)
  if (parts.length >= 2) return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase()
  return (name[0] ?? 'U').toUpperCase()
})

async function handleLogout() {
  await logout()
  await router.push('/login')
}
</script>

