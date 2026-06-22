<template>
  <div class="flex flex-col gap-3">
    <!-- Subtotal dos Itens -->
    <div class="flex items-center justify-between text-sm">
      <span style="color: var(--color-card-texto, #6b7280); opacity: 0.7" class="font-medium">Subtotal dos itens</span>
      <span style="color: var(--color-card-texto, #374151)" class="font-semibold">{{ formatCurrency(subtotalItens) }}</span>
    </div>

    <!-- Desconto por Volume -->
    <div v-if="descontoVolumePercentual > 0" class="flex items-center justify-between text-sm">
      <span class="text-green-500 font-medium">Desconto por volume</span>
      <span class="font-semibold text-green-500">
        -{{ descontoVolumePercentual }}% → {{ formatCurrency(descontoVolumeValor) }}
      </span>
    </div>

    <!-- Desconto Manual -->
    <div v-if="descontoManualTotal > 0" class="flex items-center justify-between text-sm">
      <span style="color: var(--color-card-texto, #6b7280); opacity: 0.7" class="font-medium">Desconto manual</span>
      <span style="color: var(--color-card-texto, #4b5563)" class="font-semibold">-{{ formatCurrency(descontoManualTotal) }}</span>
    </div>

    <!-- Mão de Obra -->
    <div v-if="maoObra > 0" class="flex items-center justify-between text-sm">
      <span style="color: var(--color-card-texto, #6b7280); opacity: 0.7" class="font-medium">Mão de obra</span>
      <span style="color: var(--color-card-texto, #374151)" class="font-semibold">+{{ formatCurrency(maoObra) }}</span>
    </div>

    <!-- Divider -->
    <div style="border-color: var(--color-card-border, rgba(0,0,0,0.1))" class="border-t my-1" />

    <!-- Valor Total Final -->
    <div class="rounded-xl p-4" style="background: var(--color-primary-5, rgba(79,70,229,0.05)); border: 1px solid var(--color-primary-border, rgba(79,70,229,0.2))">
      <div class="flex items-center justify-between">
        <span class="text-sm font-bold" style="color: var(--color-primary, #4f46e5)">Valor Total Final</span>
        <span class="text-xl font-black" style="color: var(--color-primary, #4f46e5)">{{ formatCurrency(valorTotalFinal) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// ─── Props ───────────────────────────────────────────────────────────────────
const props = withDefaults(
  defineProps<{
    /** Subtotal (soma de todos os itens) */
    subtotalItens: number
    /** Percentual de desconto por volume aplicado */
    descontoVolumePercentual: number
    /** Percentual de desconto manual */
    descontoManualPercentual: number
    /** Valor fixo de desconto manual */
    descontoManualValor: number
    /** Valor de mão de obra */
    maoObra: number
  }>(),
  {
    subtotalItens: 0,
    descontoVolumePercentual: 0,
    descontoManualPercentual: 0,
    descontoManualValor: 0,
    maoObra: 0,
  }
)

// ─── Computed: Valores derivados ─────────────────────────────────────────────
const descontoVolumeValor = computed<number>(() => {
  return props.subtotalItens * (props.descontoVolumePercentual / 100)
})

const descontoManualTotal = computed<number>(() => {
  const aposVolume = props.subtotalItens - descontoVolumeValor.value
  const descPercentual = aposVolume * (props.descontoManualPercentual / 100)
  return descPercentual + props.descontoManualValor
})

const valorTotalFinal = computed<number>(() => {
  const subtotal = props.subtotalItens + props.maoObra
  const descVolume = subtotal * (props.descontoVolumePercentual / 100)
  const aposVolume = subtotal - descVolume
  const descManualPerc = aposVolume * (props.descontoManualPercentual / 100)
  const total = aposVolume - descManualPerc - props.descontoManualValor
  return Math.max(total, 0)
})

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatCurrency(val: number | null | undefined): string {
  if (val == null) return 'R$ 0,00'
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
</script>
