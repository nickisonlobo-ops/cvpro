<template>
  <header
    class="app-header"
    :class="headerHeight"
    :style="{ background: 'var(--color-sidebar, #1f2937)' }"
  >
    <!-- Logo / Brand -->
    <div class="app-header__brand">
      <div
        v-if="!config.logo_url"
        class="app-header__logo-icon"
      >
        <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24" aria-hidden="true" :style="{ color: 'var(--color-primary-text, #ffffff)' }">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      </div>
      <img
        v-else
        :src="config.logo_url"
        alt="Logo"
        class="rounded-xl object-contain"
        :style="{ width: headerLogoPx + 'px', height: headerLogoPx + 'px' }"
      />
      <span class="app-header__company-name hidden sm:block" :style="{ color: 'var(--color-primary-text, #fff)' }">
        {{ config.nome_empresa }}
      </span>
    </div>

    <!-- Ações do usuário -->
    <div class="app-header__actions">
      <span class="hidden sm:block app-header__greeting" :style="{ color: 'var(--color-primary-text, #fff)' }">
        Olá, {{ displayName }}
      </span>

      <!-- Avatar -->
      <div
        class="app-header__avatar"
        :style="{ background: 'var(--color-primary, #374151)', color: 'var(--color-primary-text, #fff)' }"
        :title="userName"
      >
        {{ initials }}
      </div>

      <!-- Botão sair -->
      <button
        type="button"
        class="app-header__logout"
        :style="{ color: 'var(--color-primary-text, #fff)' }"
        @click="handleLogout"
      >
        <span class="hidden sm:inline">Sair</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
        </svg>
      </button>
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

const userName = ref('')
const diasRestantesTrial = ref<number | null>(null)

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

<style scoped>
.app-header {
  display:         flex;
  align-items:     center;
  justify-content: space-between;
  padding:         0 1.25rem;
  flex-shrink:     0;
  position:        sticky;
  top:             0;
  z-index:         30;
  border-bottom:   1px solid rgba(255,255,255,0.07);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  gap:             0.5rem;
}

@media (min-width: 640px) {
  .app-header { padding: 0 1.5rem; }
}

.app-header__brand {
  display:     flex;
  align-items: center;
  gap:         0.625rem;
  min-width:   0;
}
.app-header__logo-icon {
  width:            36px;
  height:           36px;
  border-radius:    10px;
  display:          flex;
  align-items:      center;
  justify-content:  center;
  flex-shrink:      0;
  background:       rgba(255,255,255,0.10);
  border:           1px solid rgba(255,255,255,0.10);
}
.app-header__company-name {
  font-size:      0.9375rem;
  font-weight:    800;
  letter-spacing: -0.01em;
  white-space:    nowrap;
  overflow:       hidden;
  text-overflow:  ellipsis;
  opacity:        0.92;
}

.app-header__actions {
  display:     flex;
  align-items: center;
  gap:         0.5rem;
}
.app-header__greeting {
  font-size:   0.875rem;
  font-weight: 500;
  opacity:     0.70;
  white-space: nowrap;
}

.app-header__avatar {
  width:            34px;
  height:           34px;
  border-radius:    9999px;
  display:          flex;
  align-items:      center;
  justify-content:  center;
  font-size:        0.75rem;
  font-weight:      800;
  letter-spacing:   0.02em;
  flex-shrink:      0;
  box-shadow:       0 0 0 2px rgba(255,255,255,0.18);
  cursor:           default;
  user-select:      none;
}

.app-header__logout {
  display:     flex;
  align-items: center;
  gap:         0.375rem;
  font-size:   0.8125rem;
  font-weight: 600;
  padding:     0.375rem 0.75rem;
  border-radius: 0.625rem;
  opacity:     0.60;
  transition:  opacity 150ms, background 150ms;
  cursor:      pointer;
  border:      none;
  background:  transparent;
}
.app-header__logout:hover {
  opacity:    1;
  background: rgba(255,255,255,0.10);
}

</style>
