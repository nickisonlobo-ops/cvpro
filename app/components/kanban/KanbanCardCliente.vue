<template>
  <KanbanCard :card="card" @click="emit('click', card)" @dragstart="emit('dragstart', $event)">
    <template #default>
      <div class="space-y-1.5">
        <!-- Nome do cliente -->
        <p class="text-sm font-semibold truncate" style="color: var(--color-card-texto, #1e293b)">
          {{ card.titulo }}
        </p>

        <!-- Telefone -->
        <div class="flex items-center gap-1.5 text-xs" style="color: var(--color-card-texto, #64748b); opacity: 0.7">
          <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
          </svg>
          <span class="truncate">{{ card.info_extra?.telefone ?? '—' }}</span>
        </div>

        <!-- Última interação -->
        <div class="flex items-center gap-1.5 text-xs" style="color: var(--color-card-texto, #64748b); opacity: 0.7">
          <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ card.info_extra?.ultima_interacao ?? '—' }}</span>
        </div>
      </div>
    </template>
  </KanbanCard>
</template>

<script setup lang="ts">
import type { KanbanCard as KanbanCardType } from '~/composables/useKanban'
import KanbanCard from './KanbanCard.vue'

defineOptions({ name: 'KanbanCardCliente' })

defineProps<{
  card: KanbanCardType
}>()

const emit = defineEmits<{
  (e: 'click', card: KanbanCardType): void
  (e: 'dragstart', event: DragEvent): void
}>()
</script>
