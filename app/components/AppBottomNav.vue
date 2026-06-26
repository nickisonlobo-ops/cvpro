<template>
  <!-- FAB de menu -->
  <button
    type="button"
    class="fab-btn md:hidden"
    :class="menuAberto ? 'fab-btn--open' : ''"
    :style="{ background: 'var(--color-primary, #374151)', boxShadow: `0 8px 28px var(--glow-primary, rgba(55,65,81,0.45)), 0 2px 8px rgba(0,0,0,0.25)` }"
    @click="menuAberto = !menuAberto"
  >
    <svg v-if="!menuAberto" class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
    <svg v-else class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>

  <!-- Backdrop -->
  <Transition name="nav-fade">
    <div
      v-if="menuAberto"
      class="fixed inset-0 z-30 md:hidden"
      style="background: rgba(0,0,0,0.50); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);"
      @click="menuAberto = false"
    />
  </Transition>

  <!-- Painel de navegação -->
  <Transition name="nav-slide-up">
    <div
      v-if="menuAberto"
      class="nav-panel md:hidden"
      :style="{ background: 'var(--color-sidebar, #1f2937)', borderColor: 'var(--color-primary-border, rgba(255,255,255,0.10))' }"
    >
      <!-- Handle de drag visual -->
      <div class="nav-panel__handle" />

      <div class="nav-panel__grid">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          exact-active-class="nav-item--active"
          class="nav-item"
          @click="menuAberto = false"
        >
          <div class="nav-item__icon-wrap">
            <AppNavIcon :name="item.icon" class="w-5 h-5" />
          </div>
          <span class="nav-item__label">{{ item.label }}</span>
        </NuxtLink>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAdmin } from '~/composables/useAdmin'
import AppNavIcon from '~/components/AppNavIcon.vue'

defineOptions({ name: 'AppBottomNav' })

const { isAdminOrGerente } = useAdmin()
const menuAberto = ref(false)

const allNavItems = [
  { to: '/',              icon: 'home',           label: 'Início',        minPerfil: 'all' },
  { to: '/agendamentos',  icon: 'calendar',       label: 'Agenda',        minPerfil: 'all' },
  { to: '/clientes',      icon: 'identification', label: 'Clientes',      minPerfil: 'all' },
  { to: '/adesivos-ordens-servico', icon: 'clipboard', label: 'OS',       minPerfil: 'all' },
  { to: '/adesivos-orcamentos', icon: 'document', label: 'Orçamentos',    minPerfil: 'all' },
  { to: '/servicos',      icon: 'sparkles',       label: 'Serviços',      minPerfil: 'all' },
  { to: '/estoque',       icon: 'package',        label: 'Estoque',       minPerfil: 'all' },
  { to: '/adesivos-catalogo', icon: 'catalog',    label: 'Catálogo',      minPerfil: 'all' },
  { to: '/adesivos-materiais', icon: 'layers',    label: 'Materiais',     minPerfil: 'all' },
  { to: '/adesivos-estoque', icon: 'cube',        label: 'Estoque AD',    minPerfil: 'all' },
  { to: '/atividades',    icon: 'clipboard',      label: 'Atividades',    minPerfil: 'all' },
  { to: '/funcionarios',  icon: 'users',          label: 'Equipe',        minPerfil: 'manager' },
  { to: '/financeiro',    icon: 'wallet',         label: 'Financeiro',    minPerfil: 'manager' },
  { to: '/contas-pagar',  icon: 'wallet',         label: 'Contas',        minPerfil: 'manager' },
  { to: '/consultor',     icon: 'brain',          label: 'Consultor',     minPerfil: 'manager' },
  { to: '/configuracoes', icon: 'settings',       label: 'Config',        minPerfil: 'manager' },
]

const navItems = computed(() =>
  allNavItems.filter(item => item.minPerfil === 'all' || isAdminOrGerente.value)
)
</script>

<style scoped>
/* ── FAB ─────────────────────────────────────────────────────────────── */
.fab-btn {
  position:    fixed;
  bottom:      1.25rem;
  right:       1.25rem;
  z-index:     40;
  width:       56px;
  height:      56px;
  border-radius: 9999px;
  border:      none;
  cursor:      pointer;
  display:     flex;
  align-items: center;
  justify-content: center;
  transition:  transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 200ms ease;
}
.fab-btn:hover   { transform: scale(1.08); }
.fab-btn:active  { transform: scale(0.94); }
.fab-btn--open   { transform: rotate(180deg) !important; }
.fab-btn--open:hover { transform: rotate(180deg) scale(1.06) !important; }

/* ── Painel ──────────────────────────────────────────────────────────── */
.nav-panel {
  position:    fixed;
  bottom:      5.5rem;
  left:        0.875rem;
  right:       0.875rem;
  z-index:     40;
  border-radius: 1.5rem;
  border:      1px solid;
  overflow:    hidden;
  box-shadow:  0 24px 60px rgba(0,0,0,0.40), 0 8px 20px rgba(0,0,0,0.25);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.nav-panel__handle {
  width:         2.5rem;
  height:        4px;
  border-radius: 9999px;
  background:    rgba(255,255,255,0.20);
  margin:        0.875rem auto 0;
}

.nav-panel__grid {
  display:               grid;
  grid-template-columns: repeat(4, 1fr);
  gap:                   0.375rem;
  padding:               1rem;
}

/* ── Item ────────────────────────────────────────────────────────────── */
.nav-item {
  display:         flex;
  flex-direction:  column;
  align-items:     center;
  justify-content: center;
  gap:             0.375rem;
  padding:         0.75rem 0.375rem;
  border-radius:   1rem;
  text-decoration: none;
  color:           var(--color-primary-text, #fff);
  opacity:         0.60;
  transition:      background 130ms ease, opacity 130ms ease, transform 130ms ease;
}
.nav-item:hover  { background: rgba(255,255,255,0.08); opacity: 0.90; }
.nav-item:active { transform: scale(0.93); }
.nav-item--active {
  background: rgba(255,255,255,0.14) !important;
  opacity:    1 !important;
}

.nav-item__icon-wrap {
  width:            40px;
  height:           40px;
  border-radius:    11px;
  display:          flex;
  align-items:      center;
  justify-content:  center;
  background:       rgba(255,255,255,0.08);
  transition:       background 130ms ease;
}
.nav-item--active .nav-item__icon-wrap {
  background: rgba(255,255,255,0.16);
}

.nav-item__label {
  font-size:   0.625rem;
  font-weight: 700;
  text-align:  center;
  line-height: 1.2;
  white-space: nowrap;
}

/* ── Transições ──────────────────────────────────────────────────────── */
.nav-slide-up-enter-active {
  transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1), opacity 240ms ease;
}
.nav-slide-up-leave-active {
  transition: transform 200ms ease, opacity 180ms ease;
}
.nav-slide-up-enter-from,
.nav-slide-up-leave-to {
  transform: translateY(28px);
  opacity:   0;
}

.nav-fade-enter-active { transition: opacity 220ms ease; }
.nav-fade-leave-active { transition: opacity 180ms ease; }
.nav-fade-enter-from,
.nav-fade-leave-to     { opacity: 0; }
</style>
