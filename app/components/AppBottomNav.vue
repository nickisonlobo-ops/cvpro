<template>
  <nav
    class="fixed bottom-0 inset-x-0 z-40 md:hidden border-t shadow-2xl"
    :style="{ background: 'var(--color-sidebar, #ffffff)', borderColor: 'var(--color-primary-border, rgba(236,72,153,0.3))' }"
  >
    <div class="flex items-stretch h-16 overflow-x-auto scrollbar-hide">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        exact-active-class="nav-item-active"
        class="min-w-[64px] flex flex-col items-center justify-center gap-0.5 transition-colors text-[10px] font-semibold nav-item px-1"
      >
        <AppNavIcon :name="item.icon" class="w-5 h-5 shrink-0" />
        <span class="whitespace-nowrap">{{ item.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAdmin } from '~/composables/useAdmin'
import AppNavIcon from '~/components/AppNavIcon.vue'

defineOptions({ name: 'AppBottomNav' })

const { isAdminOrGerente } = useAdmin()

const allNavItems = [
  { to: '/',              icon: 'home',           label: 'Início',      minPerfil: 'all' },
  { to: '/agendamentos',  icon: 'calendar',       label: 'Agenda',      minPerfil: 'all' },
  { to: '/servicos',      icon: 'sparkles',       label: 'Serviços',    minPerfil: 'all' },
  { to: '/clientes',      icon: 'identification', label: 'Clientes',    minPerfil: 'all' },
  { to: '/estoque',       icon: 'package',        label: 'Estoque',     minPerfil: 'all' },
  { to: '/funcionarios',  icon: 'users',          label: 'Equipe',      minPerfil: 'manager' },
  { to: '/atividades',    icon: 'clipboard',      label: 'Atividades',  minPerfil: 'all' },
  { to: '/contas-pagar',  icon: 'wallet',         label: 'Contas',      minPerfil: 'manager' },
  { to: '/configuracoes', icon: 'settings',       label: 'Config',      minPerfil: 'manager' },
  { to: '/consultor',    icon: 'brain',           label: 'Consultor',   minPerfil: 'manager' },
]

const navItems = computed(() =>
  allNavItems.filter(item => item.minPerfil === 'all' || isAdminOrGerente.value)
)
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.nav-item {
  color: var(--color-primary-text, #ffffff);
  opacity: 0.55;
}
.nav-item:hover {
  background: rgba(255,255,255,0.1);
  opacity: 0.85;
}
.nav-item-active {
  color: var(--color-primary-text, #ffffff) !important;
  background-color: rgba(255,255,255,0.15) !important;
  opacity: 1 !important;
}
</style>
