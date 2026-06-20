<template>
  <KanbanCard :card="card" @click="emit('click', card)" @dragstart="emit('dragstart', $event)">
    <template #default>
      <div class="space-y-1.5">
        <!-- Número OS + Valor -->
        <div class="flex items-center justify-between gap-2">
          <p class="text-sm font-semibold truncate" style="color: var(--color-card-texto, #1e293b)">
            {{ card.info_extra?.numero_os ?? card.titulo }}
          </p>
          <span class="text-xs font-bold whitespace-nowrap" :style="{ color: 'var(--color-primary, #1f7f1f)' }">
            {{ card.info_extra?.valor_total ?? '—' }}
          </span>
        </div>

        <!-- Nome do trabalho -->
        <p class="text-xs truncate" style="color: var(--color-card-texto, #64748b); opacity: 0.7">
          {{ card.info_extra?.nome_trabalho ?? '—' }}
        </p>

        <!-- Cliente -->
        <div class="flex items-center gap-1.5 text-xs" style="color: var(--color-card-texto, #64748b); opacity: 0.7">
          <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
          <span class="truncate">{{ card.info_extra?.cliente ?? '—' }}</span>
        </div>

        <!-- Data de aprovação -->
        <div class="flex items-center gap-1.5 text-xs" style="color: var(--color-card-texto, #64748b); opacity: 0.7">
          <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          <span>{{ card.info_extra?.data_aprovacao ?? '—' }}</span>
        </div>
      </div>
    </template>
  </KanbanCard>
</template>

<script setup lang="ts">
import type { KanbanCard as KanbanCardType } from '~/composables/useKanban'
import KanbanCard from './KanbanCard.vue'

defineOptions({ name: 'KanbanCardOS' })

defineProps<{
  card: KanbanCardType
}>()

const emit = defineEmits<{
  (e: 'click', card: KanbanCardType): void
  (e: 'dragstart', event: DragEvent): void
}>()
</script>
