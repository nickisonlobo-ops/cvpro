<template>
  <aside
    class="sidebar"
    :class="expanded ? 'sidebar--expanded' : 'sidebar--collapsed'"
    :style="{ background: 'var(--color-sidebar, #1f2937)' }"
    @mouseenter="expanded = true"
    @mouseleave="expanded = false"
  >
    <!-- Marca -->
    <div class="sidebar__brand" :style="{ borderColor: 'var(--color-primary-border, rgba(255,255,255,0.08))' }">
      <div class="sidebar__logo-icon">
        <img v-if="config.logo_url" :src="config.logo_url" alt="Logo" class="w-[18px] h-[18px] object-contain rounded-md" />
        <AppNavIcon v-else name="sparkles" class="w-[18px] h-[18px]" :style="{ color: 'var(--color-primary-text, #fff)' }" />
      </div>
      <Transition name="sidebar-label">
        <p v-if="expanded" class="sidebar__brand-name" :style="{ color: 'var(--color-primary-text, #fff)' }">
          {{ config.nome_empresa }}
        </p>
      </Transition>
    </div>

    <!-- Navegação -->
    <nav class="sidebar__nav">
      <div v-for="section in navSections" :key="section.title" class="sidebar__section">
        <Transition name="sidebar-label">
          <p
            v-if="expanded"
            class="sidebar__section-title"
            :style="{ color: 'var(--color-primary-text, #fff)' }"
          >
            {{ section.title }}
          </p>
        </Transition>
        <NuxtLink
          v-for="item in section.items"
          :key="item.to"
          :to="item.to"
          class="sidebar__item"
          active-class="sidebar__item--active"
          @mouseenter="onItemMouseEnter($event, item.label)"
          @mouseleave="onItemMouseLeave"
        >
          <span class="sidebar__item-icon">
            <AppNavIcon :name="item.icon" class="w-5 h-5" style="stroke-width: 1.5" />
          </span>
          <Transition name="sidebar-label">
            <span v-if="expanded" class="sidebar__item-label">{{ item.label }}</span>
          </Transition>
        </NuxtLink>
      </div>
    </nav>

    <!-- Rodapé -->
    <div class="sidebar__footer" :style="{ borderColor: 'var(--color-primary-border, rgba(255,255,255,0.08))' }">
      <Transition name="sidebar-label">
        <span v-if="expanded" class="sidebar__version" :style="{ color: 'var(--color-primary-text, #fff)' }">
          v1.0.0
        </span>
      </Transition>
    </div>

    <!-- Tooltip (teleportado para body, escapa overflow:hidden) -->
    <Teleport to="body">
      <Transition name="sidebar-tooltip">
        <div
          v-if="tooltip.visible"
          class="sidebar__tooltip"
          :style="{ top: tooltip.top + 'px', left: tooltip.left + 'px' }"
          role="tooltip"
          :aria-label="tooltip.text"
        >
          {{ tooltip.text }}
        </div>
      </Transition>
    </Teleport>
  </aside>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useAdmin } from '~/composables/useAdmin'
import { usePersonalizacao } from '~/composables/usePersonalizacao'
import AppNavIcon from '~/components/AppNavIcon.vue'

defineOptions({ name: 'AppSidebar' })

const expanded = ref(false)
const { isAdminOrGerente } = useAdmin()
const { config } = usePersonalizacao()

// ── Tooltip state ──────────────────────────────────────────────────
const tooltip = reactive({
  visible: false,
  text: '',
  top: 0,
  left: 0,
})

let tooltipTimer: ReturnType<typeof setTimeout> | null = null

function onItemMouseEnter(event: MouseEvent, label: string) {
  if (expanded.value) return // Não mostrar tooltip quando expandido

  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()

  // Limpar timer anterior
  if (tooltipTimer) clearTimeout(tooltipTimer)

  // Delay de 300ms antes de mostrar
  tooltipTimer = setTimeout(() => {
    tooltip.text = label
    tooltip.top = rect.top + rect.height / 2
    tooltip.left = rect.right + 12
    tooltip.visible = true
  }, 300)
}

function onItemMouseLeave() {
  if (tooltipTimer) {
    clearTimeout(tooltipTimer)
    tooltipTimer = null
  }
  tooltip.visible = false
}

const allNavSections = [
  {
    title: 'Principal',
    items: [
      { to: '/', icon: 'home', label: 'Início', minPerfil: 'all' },
      { to: '/agendamentos', icon: 'calendar', label: 'Agendamentos', minPerfil: 'all' },
      { to: '/servicos', icon: 'sparkles', label: 'Serviços', minPerfil: 'all' },
      { to: '/clientes', icon: 'identification', label: 'Clientes', minPerfil: 'all' },
    ],
  },
  {
    title: 'Equipe',
    items: [
      { to: '/funcionarios', icon: 'users', label: 'Funcionários', minPerfil: 'manager' },
      { to: '/atividades', icon: 'clipboard', label: 'Atividades', minPerfil: 'all' },
    ],
  },
  {
    title: 'Financeiro',
    items: [
      { to: '/financeiro', icon: 'wallet', label: 'Dashboard Financeiro', minPerfil: 'manager' },
      { to: '/contas-pagar', icon: 'wallet', label: 'Pagar / Receber', minPerfil: 'manager' },
      { to: '/conciliacao-bancaria', icon: 'wallet', label: 'Conciliação Bancária', minPerfil: 'manager' },
    ],
  },
  {
    title: 'Produção',
    items: [
      { to: '/adesivos-orcamentos', icon: 'document', label: 'Orçamentos', minPerfil: 'all' },
      { to: '/adesivos-ordens-servico', icon: 'clipboard', label: 'Ordens de Serviço', minPerfil: 'all' },
      { to: '/producao', icon: 'clipboard', label: 'Produção', minPerfil: 'all' },
      { to: '/processos', icon: 'clipboard', label: 'Processos', minPerfil: 'all' },
      { to: '/adesivos-catalogo', icon: 'catalog', label: 'Catálogo', minPerfil: 'all' },
      { to: '/adesivos-materiais', icon: 'layers', label: 'Materiais', minPerfil: 'all' },
      { to: '/adesivos-estoque', icon: 'cube', label: 'Estoque', minPerfil: 'all' },
    ],
  },
  {
    title: 'Inteligência',
    items: [
      { to: '/consultor', icon: 'brain', label: 'Consultor de Negócios', minPerfil: 'manager' },
    ],
  },
  {
    title: 'Sistema',
    items: [
      { to: '/configuracoes', icon: 'settings', label: 'Configurações', minPerfil: 'manager' },
    ],
  },
]

const navSections = computed(() =>
  allNavSections
    .map(section => ({
      ...section,
      items: section.items.filter(item => item.minPerfil === 'all' || isAdminOrGerente.value),
    }))
    .filter(section => section.items.length > 0)
)
</script>

<style scoped>
/* ── Layout ────────────────────────────────────────────────────────── */
.sidebar {
  display:        flex;
  flex-direction: column;
  flex-shrink:    0;
  min-height:     0;
  overflow:       hidden;
  border-right:   1px solid var(--color-primary-border, rgba(255,255,255,0.08));
  transition:     width 250ms cubic-bezier(0.4, 0, 0.2, 1);
  position:       relative;
}
.sidebar--collapsed { width: 72px; }
.sidebar--expanded  { width: 264px; }

/* ── Brand ─────────────────────────────────────────────────────────── */
.sidebar__brand {
  display:      flex;
  align-items:  center;
  gap:          0.875rem;
  padding:      1.25rem 1rem;
  border-bottom: 1px solid;
  overflow:     hidden;
  flex-shrink:  0;
}
.sidebar__logo-icon {
  width:            40px;
  height:           40px;
  border-radius:    12px;
  flex-shrink:      0;
  display:          flex;
  align-items:      center;
  justify-content:  center;
  background:       rgba(255,255,255,0.12);
  border:           1px solid rgba(255,255,255,0.14);
  transition:       background 150ms;
}
.sidebar__logo-icon:hover { background: rgba(255,255,255,0.18); }
.sidebar__brand-name {
  font-size:      0.8125rem;
  font-weight:    900;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  white-space:    nowrap;
  overflow:       hidden;
  text-overflow:  ellipsis;
  opacity:        0.9;
}

/* ── Nav ────────────────────────────────────────────────────────────── */
.sidebar__nav {
  flex:       1;
  padding:    0.875rem 0.5rem;
  display:    flex;
  flex-direction: column;
  gap:        1.25rem; /* 20px = gap-5 */
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
}
.sidebar__nav::-webkit-scrollbar { width: 3px; }
.sidebar__nav::-webkit-scrollbar-thumb {
  background:    rgba(255,255,255,0.12);
  border-radius: 4px;
}
.sidebar__nav::-webkit-scrollbar-track { background: transparent; }

.sidebar__section {
  display:        flex;
  flex-direction: column;
  gap:            1px;
}
.sidebar__section-title {
  font-size:      10px; /* text-[10px] */
  font-weight:    700;  /* font-bold */
  text-transform: uppercase;
  letter-spacing: 0.18em;
  padding:        0 0.75rem;
  margin-bottom:  0.25rem;
  white-space:    nowrap;
  opacity:        0.4; /* opacity-40 */
}

/* ── Item ───────────────────────────────────────────────────────────── */
.sidebar__item {
  position:       relative;
  display:        flex;
  align-items:    center;
  gap:            0.75rem;
  padding:        0.125rem 0.5rem;
  border-radius:  0.875rem;
  text-decoration: none;
  overflow:       visible;
  transition:     background 130ms ease, opacity 130ms ease;
  color:          var(--color-primary-text, #fff);
  opacity:        0.6; /* opacity-60 (ajustado de 0.55) */
  white-space:    nowrap;
  min-height:     40px;
}
.sidebar__item:hover {
  background: rgba(255,255,255,0.07);
  opacity:    0.90;
}
.sidebar__item--active {
  background: rgba(255,255,255,0.12) !important; /* bg-white/12 */
  opacity:    1 !important; /* opacity-100 */
}
.sidebar__item--active::before {
  content:       '';
  position:      absolute;
  left:          0;
  top:           22%;
  bottom:        22%;
  width:         3px;
  border-radius: 0 3px 3px 0;
  background:    var(--color-primary-text, #ffffff);
  opacity:       0.9;
}

/* ── Icon ───────────────────────────────────────────────────────────── */
.sidebar__item-icon {
  width:            36px;
  height:           36px;
  display:          flex;
  align-items:      center;
  justify-content:  center;
  border-radius:    10px;
  flex-shrink:      0;
  transition:       background 130ms ease;
}
.sidebar__item--active .sidebar__item-icon {
  background: rgba(255,255,255,0.14);
}

/* ── Label ──────────────────────────────────────────────────────────── */
.sidebar__item-label {
  font-size:   0.8125rem;
  font-weight: 600;
  white-space: nowrap;
  overflow:    hidden;
  text-overflow: ellipsis;
}

/* ── Footer ─────────────────────────────────────────────────────────── */
.sidebar__footer {
  padding:     0.875rem 1rem;
  border-top:  1px solid;
  overflow:    hidden;
  flex-shrink: 0;
}
.sidebar__version {
  font-size:   0.6875rem;
  font-weight: 700;
  opacity:     0.22;
  white-space: nowrap;
}

/* ── Transição dos labels ────────────────────────────────────────────── */
.sidebar-label-enter-active {
  transition: opacity 160ms ease 80ms, transform 160ms ease 80ms;
}
.sidebar-label-leave-active {
  transition: opacity 80ms ease, transform 80ms ease;
}
.sidebar-label-enter-from,
.sidebar-label-leave-to {
  opacity:   0;
  transform: translateX(-6px);
}
</style>

<!-- Estilos do tooltip (não-scoped pois é teleportado para body) -->
<style>
.sidebar__tooltip {
  position:       fixed;
  transform:      translateY(-50%);
  padding:        6px 12px;
  font-size:      12px;
  font-weight:    500;
  white-space:    nowrap;
  color:          #fff;
  background:     rgba(15, 23, 42, 0.92);
  border-radius:  6px;
  box-shadow:     0 4px 12px -2px rgb(0 0 0 / 0.2);
  pointer-events: none;
  z-index:        9999;
}
.sidebar__tooltip::before {
  content:        '';
  position:       absolute;
  right:          100%;
  top:            50%;
  transform:      translateY(-50%);
  border:         5px solid transparent;
  border-right-color: rgba(15, 23, 42, 0.92);
}

/* Transição do tooltip */
.sidebar-tooltip-enter-active {
  transition: opacity 150ms ease;
}
.sidebar-tooltip-leave-active {
  transition: opacity 100ms ease;
}
.sidebar-tooltip-enter-from,
.sidebar-tooltip-leave-to {
  opacity: 0;
}
</style>
