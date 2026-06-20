<template>
  <div
    :data-etapa-id="etapa.id"
    class="kanban-column flex flex-col min-w-[280px] max-w-[320px] rounded-2xl border transition-all duration-200"
    :class="[
      isOver
        ? 'kanban-column--over'
        : ''
    ]"
    @dragover.prevent="onColumnDragOver"
    @dragleave="onColumnDragLeave"
    @drop="onColumnDrop"
  >
    <!-- Header -->
    <div class="kanban-column__header flex items-center gap-2 px-4 py-3 border-b">
      <!-- Dot colorido da etapa (ÚNICO uso da cor da etapa) -->
      <span
        class="w-2.5 h-2.5 rounded-full flex-shrink-0"
        :style="{ backgroundColor: etapa.cor }"
      />

      <!-- Nome da etapa -->
      <h3 class="text-sm font-semibold truncate flex-1" style="color: var(--color-card-texto, #1e293b)">
        {{ etapa.nome }}
      </h3>

      <!-- Soma de valores -->
      <span v-if="totalValor > 0" class="text-xs font-bold whitespace-nowrap" :style="{ color: etapa.cor }">
        {{ formatCurrency(totalValor) }}
      </span>

      <!-- Contador de itens -->
      <span
        class="kanban-column__counter inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-medium"
      >
        {{ cards.length }}
      </span>
    </div>

    <!-- Lista de cards (scrollável) -->
    <div class="flex-1 overflow-y-auto p-2 space-y-2 min-h-[120px]">
      <slot :cards="cards" :etapa="etapa" />

      <!-- Estado vazio -->
      <div
        v-if="cards.length === 0"
        class="flex items-center justify-center h-full min-h-[80px] text-xs"
        style="color: var(--color-card-texto, #94a3b8); opacity: 0.5"
      >
        Nenhum item
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Etapa } from '~/composables/useEtapas'
import type { KanbanCard } from '~/composables/useKanban'

defineOptions({ name: 'KanbanColumn' })

const props = defineProps<{
  etapa: Etapa
  cards: KanbanCard[]
  isOver: boolean
}>()

const emit = defineEmits<{
  (e: 'dragover', etapaId: number): void
  (e: 'dragleave', etapaId: number): void
  (e: 'drop', etapaId: number): void
}>()

// Soma dos valores dos cards nesta coluna
const totalValor = computed(() => {
  return props.cards.reduce((sum, card) => {
    const valorStr = card.info_extra?.valor_total
    if (!valorStr) return sum
    // Parsear valor formatado "R$ 1.234,56" → number
    const num = parseFloat(valorStr.replace(/[^\d,.-]/g, '').replace('.', '').replace(',', '.'))
    return sum + (isNaN(num) ? 0 : num)
  }, 0)
})

function formatCurrency(val: number): string {
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function onColumnDragOver(event: DragEvent): void {
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
  emit('dragover', props.etapa.id)
}

function onColumnDragLeave(event: DragEvent): void {
  // Apenas emite se saiu da coluna de fato (não de um filho)
  const relatedTarget = event.relatedTarget as HTMLElement | null
  const columnEl = (event.currentTarget as HTMLElement)
  if (relatedTarget && columnEl.contains(relatedTarget)) {
    return
  }
  emit('dragleave', props.etapa.id)
}

function onColumnDrop(event: DragEvent): void {
  event.preventDefault()
  emit('drop', props.etapa.id)
}
</script>

<style scoped>
.kanban-column {
  background: var(--color-card, #ffffff);
  border-color: var(--color-card-border, rgba(0,0,0,0.06));
}

.kanban-column--over {
  border-color: var(--color-primary, #1f7f1f);
  box-shadow: 0 0 0 2px var(--color-primary-12, rgba(55,65,81,0.12));
  background: var(--color-primary-5, rgba(55,65,81,0.05));
}

.kanban-column__header {
  border-color: var(--color-card-border, rgba(0,0,0,0.06));
}

.kanban-column__counter {
  background: var(--color-primary-5, rgba(55,65,81,0.05));
  color: var(--color-card-texto, #64748b);
  border: 1px solid var(--color-card-border, rgba(0,0,0,0.06));
}
</style>
