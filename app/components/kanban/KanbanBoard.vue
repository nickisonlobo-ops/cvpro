<template>
  <div class="kanban-board">
    <!-- Toolbar: Configurar Etapas -->
    <div class="flex items-center justify-end mb-3 px-1">
      <button
        type="button"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors hover:opacity-80"
        :style="{ color: 'var(--color-primary, #374151)' }"
        @click="showConfigModal = true"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Configurar Etapas
      </button>
    </div>

    <!-- Modal Configurar Etapas -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showConfigModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          @click.self="fecharConfigModal"
        >
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
            <!-- Header do modal -->
            <div class="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
              <div>
                <h2 class="text-lg font-bold text-gray-900">Configurar Etapas</h2>
                <p class="text-sm text-gray-500 mt-0.5">Personalize as etapas deste pipeline</p>
              </div>
              <button
                type="button"
                class="w-8 h-8 flex items-center justify-center rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors"
                @click="fecharConfigModal"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <!-- Conteúdo -->
            <div class="flex-1 overflow-y-auto px-6 sm:px-8 py-6">
              <EtapasManager :key="pipelineTipo" :pipeline-tipo="pipelineTipo" />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Loading state -->
    <div v-if="kanban.state.value.loading" class="flex items-center justify-center min-h-[300px]">
      <div class="flex flex-col items-center gap-3">
        <div class="w-8 h-8 border-3 rounded-full animate-spin" style="border-color: var(--color-primary, #374151); border-top-color: transparent" />
        <p class="text-sm" style="color: var(--color-card-texto, #94a3b8); opacity: 0.7">Carregando kanban...</p>
      </div>
    </div>

    <!-- Error state -->
    <div
      v-else-if="kanban.state.value.error"
      class="flex items-center justify-center min-h-[300px]"
    >
      <div class="flex flex-col items-center gap-3 text-center max-w-sm">
        <svg class="w-10 h-10 text-red-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        <p class="text-sm" style="color: var(--color-card-texto, #94a3b8); opacity: 0.7">
          {{ kanban.state.value.error }}
        </p>
        <button
          class="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
          :style="{ background: 'var(--color-btn, #374151)', color: 'var(--color-btn-text, #ffffff)' }"
          @click="inicializar"
        >
          Tentar novamente
        </button>
      </div>
    </div>

    <!-- Kanban columns container -->
    <div
      v-else
      class="flex gap-4 overflow-x-auto pb-4 px-1 snap-x snap-mandatory md:snap-none"
      :class="{ 'select-none': dragDrop.isDragging.value }"
    >
      <KanbanColumn
        v-for="etapa in kanban.state.value.etapas"
        :key="etapa.id"
        :etapa="etapa"
        :cards="kanban.cardsPorEtapa(etapa.id).value"
        :is-over="dragDrop.isOverEtapa(etapa.id).value"
        class="snap-start flex-shrink-0"
        @dragover="handleColumnDragOver"
        @dragleave="handleColumnDragLeave"
        @drop="handleColumnDrop"
      >
        <template #default="{ cards }">
          <!-- CRM Cards -->
          <template v-if="pipelineTipo === 'crm'">
            <KanbanCardCliente
              v-for="card in cards"
              :key="card.id"
              :card="card"
              @click="(c) => emit('card-click', c)"
              @dragstart="(event) => dragDrop.onDragStart(event, card.id, etapa.id)"
              @touchstart.passive="(event: TouchEvent) => dragDrop.onTouchStart(event, card.id, etapa.id)"
              @touchmove="(event: TouchEvent) => dragDrop.onTouchMove(event)"
              @touchend="(event: TouchEvent) => dragDrop.onTouchEnd(event)"
            />
          </template>

          <!-- Produção Cards -->
          <template v-else-if="pipelineTipo === 'producao'">
            <KanbanCardOS
              v-for="card in cards"
              :key="card.id"
              :card="card"
              @click="(c) => emit('card-click', c)"
              @dragstart="(event) => dragDrop.onDragStart(event, card.id, etapa.id)"
              @touchstart.passive="(event: TouchEvent) => dragDrop.onTouchStart(event, card.id, etapa.id)"
              @touchmove="(event: TouchEvent) => dragDrop.onTouchMove(event)"
              @touchend="(event: TouchEvent) => dragDrop.onTouchEnd(event)"
            />
          </template>

          <!-- Orçamentos Cards -->
          <template v-else-if="pipelineTipo === 'orcamentos'">
            <KanbanCardOrcamento
              v-for="card in cards"
              :key="card.id"
              :card="card"
              @click="(c) => emit('card-click', c)"
              @dragstart="(event) => dragDrop.onDragStart(event, card.id, etapa.id)"
              @touchstart.passive="(event: TouchEvent) => dragDrop.onTouchStart(event, card.id, etapa.id)"
              @touchmove="(event: TouchEvent) => dragDrop.onTouchMove(event)"
              @touchend="(event: TouchEvent) => dragDrop.onTouchEnd(event)"
            />
          </template>
        </template>
      </KanbanColumn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useKanban, type KanbanCard } from '~/composables/useKanban'
import { useDragDrop } from '~/composables/useDragDrop'
import type { PipelineTipo } from '~/composables/useEtapas'
import KanbanColumn from './KanbanColumn.vue'
import KanbanCardCliente from './KanbanCardCliente.vue'
import KanbanCardOS from './KanbanCardOS.vue'
import KanbanCardOrcamento from './KanbanCardOrcamento.vue'
import EtapasManager from './EtapasManager.vue'

defineOptions({ name: 'KanbanBoard' })

const props = defineProps<{
  pipelineTipo: PipelineTipo
}>()

const emit = defineEmits<{
  (e: 'card-click', card: KanbanCard): void
}>()

// ─── Config Modal ─────────────────────────────────────────
const showConfigModal = ref(false)

function fecharConfigModal() {
  showConfigModal.value = false
  // Recarregar o kanban para refletir mudanças nas etapas
  inicializar()
}

// ─── Composables ──────────────────────────────────────────
const kanban = useKanban(props.pipelineTipo)

const dragDrop = useDragDrop({
  onDrop: async (cardId: number, targetEtapaId: number) => {
    await kanban.moverCard(cardId, targetEtapaId)
  },
  onError: (error: Error) => {
    // TODO: Integrate with toast/notification system when available
    console.error('[KanbanBoard] Erro ao mover card:', error.message)
  },
})

// ─── Inicialização ────────────────────────────────────────
async function inicializar() {
  await kanban.inicializar()
}

onMounted(() => {
  inicializar()
})

// ─── Column event handlers ────────────────────────────────
// KanbanColumn already handles native events and emits etapaId directly

function handleColumnDragOver(etapaId: number): void {
  if (dragDrop.dragState.value && dragDrop.dragState.value.currentOverEtapaId !== etapaId) {
    dragDrop.dragState.value.currentOverEtapaId = etapaId
  }
}

function handleColumnDragLeave(etapaId: number): void {
  if (dragDrop.dragState.value && dragDrop.dragState.value.currentOverEtapaId === etapaId) {
    dragDrop.dragState.value.currentOverEtapaId = null
  }
}

async function handleColumnDrop(etapaId: number): Promise<void> {
  if (!dragDrop.dragState.value) return

  const { cardId, sourceEtapaId } = dragDrop.dragState.value

  // If dropped on the same column, just cancel
  if (etapaId === sourceEtapaId) {
    dragDrop.cancelDrag()
    return
  }

  // Clear drag state and persist the move
  dragDrop.cancelDrag()

  try {
    await kanban.moverCard(cardId, etapaId)
  } catch (err: any) {
    const error = err instanceof Error ? err : new Error(err?.message ?? 'Erro ao mover card')
    console.error('[KanbanBoard] Erro ao mover card:', error.message)
  }
}
</script>

<style scoped>
.kanban-board {
  width: 100%;
  min-height: 400px;
}

/* Hide scrollbar but keep functionality */
.kanban-board ::-webkit-scrollbar {
  height: 6px;
}

.kanban-board ::-webkit-scrollbar-track {
  background: transparent;
}

.kanban-board ::-webkit-scrollbar-thumb {
  background: var(--color-card-border, rgba(0,0,0,0.06));
  border-radius: 3px;
}

.kanban-board ::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary-30, rgba(55,65,81,0.30));
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
