<template>
  <div class="overflow-x-auto rounded-card border border-primary-border bg-theme-card">
    <table class="w-full border-collapse">
      <!-- Header -->
      <thead :class="stickyHeader ? 'sticky top-0 z-10' : ''">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            :class="[
              'bg-primary-5 text-[11px] font-semibold uppercase tracking-[0.05em] px-4 py-3 text-primary-500',
              getAlignClass(col),
            ]"
            :style="col.minWidth ? { minWidth: col.minWidth } : undefined"
          >
            {{ col.label }}
          </th>
          <th
            v-if="$slots['row-actions']"
            class="bg-primary-5 text-[11px] font-semibold uppercase tracking-[0.05em] px-4 py-3 text-right text-primary-500"
          >
            Ações
          </th>
        </tr>
      </thead>

      <!-- Loading state -->
      <tbody v-if="loading">
        <tr v-for="row in 5" :key="`skeleton-${row}`">
          <td
            v-for="col in columns"
            :key="`skeleton-${row}-${col.key}`"
            class="px-4 py-3"
          >
            <div class="h-4 animate-shimmer rounded-lg" />
          </td>
          <td v-if="$slots['row-actions']" class="px-4 py-3">
            <div class="h-4 w-16 animate-shimmer rounded-lg ml-auto" />
          </td>
        </tr>
      </tbody>

      <!-- Empty state -->
      <tbody v-else-if="!data || data.length === 0">
        <tr>
          <td :colspan="totalColumns" class="px-4 py-16">
            <div class="flex flex-col items-center justify-center gap-3 text-center">
              <svg
                class="w-10 h-10 text-primary-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                />
              </svg>
              <p class="text-[15px] font-semibold text-primary-400">
                {{ emptyTitle || 'Nenhum dado encontrado' }}
              </p>
              <p v-if="emptyDescription" class="text-[13px] text-primary-400">
                {{ emptyDescription }}
              </p>
            </div>
          </td>
        </tr>
      </tbody>

      <!-- Data rows -->
      <tbody v-else>
        <tr
          v-for="(row, rowIndex) in data"
          :key="rowIndex"
          class="hover:bg-primary-5 transition-colors duration-100"
        >
          <td
            v-for="col in columns"
            :key="`${rowIndex}-${col.key}`"
            :class="[
              'px-4 py-3 text-[13px] text-theme-card-text',
              getAlignClass(col),
              col.numeric ? 'font-[tabular-nums]' : '',
            ]"
            :style="col.minWidth ? { minWidth: col.minWidth } : undefined"
          >
            <slot
              name="cell"
              :column="col"
              :row="row"
              :value="row[col.key]"
              :index="rowIndex"
            >
              {{ row[col.key] }}
            </slot>
          </td>
          <td
            v-if="$slots['row-actions']"
            class="px-4 py-3 text-right"
          >
            <slot name="row-actions" :row="row" :index="rowIndex" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'

defineOptions({ name: 'AppTable' })

interface Column {
  key: string
  label: string
  align?: 'left' | 'center' | 'right'
  minWidth?: string
  numeric?: boolean
}

const props = withDefaults(
  defineProps<{
    columns: Column[]
    data: any[]
    loading?: boolean
    stickyHeader?: boolean
    emptyTitle?: string
    emptyDescription?: string
  }>(),
  {
    loading: false,
    stickyHeader: false,
    emptyTitle: '',
    emptyDescription: '',
  }
)

defineSlots<{
  'row-actions'?: (props: { row: any; index: number }) => any
  cell?: (props: { column: Column; row: any; value: any; index: number }) => any
}>()

const slots = useSlots()

const totalColumns = computed(() => {
  return props.columns.length + (slots['row-actions'] ? 1 : 0)
})

function getAlignClass(col: Column): string {
  if (col.align === 'center') return 'text-center'
  if (col.align === 'right' || col.numeric) return 'text-right'
  return 'text-left'
}
</script>
