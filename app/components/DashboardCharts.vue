<template>
  <div>
    <!-- Section divider -->
    <div class="h-px bg-primary-10 my-4" />

    <!-- Evolução Mensal (full width area chart) -->
    <div class="rounded-2xl border border-primary-10 shadow-sm bg-theme-card p-5 mb-5">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-[10px] font-black uppercase tracking-widest" style="color: var(--color-card-texto); opacity: 0.75">Evolução Mensal (últimos 6 meses)</h3>
        <div class="flex items-center gap-3 text-[10px]" style="color: var(--color-card-texto); opacity: 0.8">
          <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-green-500" /> Faturamento</span>
          <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-red-400" /> Despesas</span>
        </div>
      </div>
      <ClientOnly>
        <template v-if="evolucaoMensal.length > 0">
          <Line :data="evolucaoChartData" :options="evolucaoChartOptions" class="max-h-[240px]" />
        </template>
        <template v-else>
          <div class="flex items-center justify-center py-10 text-sm" style="color: var(--color-card-texto); opacity: 0.75">Sem dados de evolução</div>
        </template>
      </ClientOnly>
    </div>

    <!-- Row 1: 3 columns — Faturamento vs Despesas | Pipeline Donut | Produção Donut -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">

      <!-- Chart A: FATURAMENTO VS DESPESAS (Bar) -->
      <div class="rounded-2xl border border-primary-10 shadow-sm bg-theme-card p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-[10px] font-black uppercase tracking-widest" style="color: var(--color-card-texto); opacity: 0.75">Faturamento vs Despesas</h3>
          <div class="flex items-center gap-3 text-[10px]" style="color: var(--color-card-texto); opacity: 0.8">
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-green-500" /> Faturamento</span>
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-red-400" /> Despesas</span>
          </div>
        </div>
        <ClientOnly>
          <Bar :data="faturamentoBarData" :options="faturamentoBarOptions" :plugins="[dataLabelsPlugin]" class="max-h-[220px]" />
        </ClientOnly>
      </div>

      <!-- Chart B: PIPELINE DE ORÇAMENTOS (Donut) -->
      <div class="rounded-2xl border border-primary-10 shadow-sm bg-theme-card p-5">
        <h3 class="text-[10px] font-black uppercase tracking-widest mb-4" style="color: var(--color-card-texto); opacity: 0.75">Pipeline de Orçamentos</h3>
        <ClientOnly>
          <div class="flex items-center gap-4">
            <div class="w-[150px] h-[150px] shrink-0 relative">
              <Doughnut :data="pipelineChartData" :options="donutOptions" :plugins="[centerTextPlugin('pipelineTotal')]" />
            </div>
            <div class="flex flex-col gap-1.5 text-[11px]">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-gray-400" />
                <span style="color: var(--color-card-texto); opacity: 0.8">Rascunho</span>
                <span class="font-bold" style="color: var(--color-card-texto)">{{ pipeline.rascunho }}</span>
                <span style="color: var(--color-card-texto); opacity: 0.75">{{ pipelinePct(pipeline.rascunho) }}%</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span style="color: var(--color-card-texto); opacity: 0.8">Enviado</span>
                <span class="font-bold" style="color: var(--color-card-texto)">{{ pipeline.enviado }}</span>
                <span style="color: var(--color-card-texto); opacity: 0.75">{{ pipelinePct(pipeline.enviado) }}%</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span style="color: var(--color-card-texto); opacity: 0.8">Aprovado</span>
                <span class="font-bold" style="color: var(--color-card-texto)">{{ pipeline.aprovado }}</span>
                <span style="color: var(--color-card-texto); opacity: 0.75">{{ pipelinePct(pipeline.aprovado) }}%</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span style="color: var(--color-card-texto); opacity: 0.8">Rejeitado</span>
                <span class="font-bold" style="color: var(--color-card-texto)">{{ pipeline.rejeitado }}</span>
                <span style="color: var(--color-card-texto); opacity: 0.75">{{ pipelinePct(pipeline.rejeitado) }}%</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-orange-400" />
                <span style="color: var(--color-card-texto); opacity: 0.8">Vencido</span>
                <span class="font-bold" style="color: var(--color-card-texto)">{{ pipeline.vencido }}</span>
                <span style="color: var(--color-card-texto); opacity: 0.75">{{ pipelinePct(pipeline.vencido) }}%</span>
              </div>
            </div>
          </div>
        </ClientOnly>
      </div>

      <!-- Chart C: STATUS DE PRODUÇÃO (Donut) -->
      <div class="rounded-2xl border border-primary-10 shadow-sm bg-theme-card p-5">
        <h3 class="text-[10px] font-black uppercase tracking-widest mb-4" style="color: var(--color-card-texto); opacity: 0.75">Status de Produção (OS)</h3>
        <ClientOnly>
          <div class="flex items-center gap-4">
            <div class="w-[150px] h-[150px] shrink-0 relative">
              <Doughnut :data="producaoChartData" :options="donutOptions" :plugins="[centerTextPlugin('producaoTotal')]" />
            </div>
            <div class="flex flex-col gap-1.5 text-[11px]">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span style="color: var(--color-card-texto); opacity: 0.8">Em Produção</span>
                <span class="font-bold" style="color: var(--color-card-texto)">{{ producao.osEmProducao }}</span>
                <span style="color: var(--color-card-texto); opacity: 0.75">{{ producaoPct(producao.osEmProducao) }}%</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span style="color: var(--color-card-texto); opacity: 0.8">Prontas</span>
                <span class="font-bold" style="color: var(--color-card-texto)">{{ producao.osProntas }}</span>
                <span style="color: var(--color-card-texto); opacity: 0.75">{{ producaoPct(producao.osProntas) }}%</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span style="color: var(--color-card-texto); opacity: 0.8">Atrasadas</span>
                <span class="font-bold" style="color: var(--color-card-texto)">{{ producao.osAtrasadas }}</span>
                <span style="color: var(--color-card-texto); opacity: 0.75">{{ producaoPct(producao.osAtrasadas) }}%</span>
              </div>
            </div>
          </div>
        </ClientOnly>
      </div>
    </div>

    <!-- Row 2: 2 columns — Taxa de Conversão | Top Clientes -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

      <!-- Taxa de Conversão (Gauge) -->
      <div class="rounded-2xl border border-primary-10 shadow-sm bg-theme-card p-5">
        <h3 class="text-[10px] font-black uppercase tracking-widest mb-4" style="color: var(--color-card-texto); opacity: 0.75">Taxa de Conversão</h3>
        <div class="flex flex-col items-center gap-3">
          <div class="relative w-[140px] h-[140px]">
            <svg class="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-primary-10)" stroke-width="10" />
              <circle
                cx="60" cy="60" r="52"
                fill="none"
                stroke="url(#gaugeGradient)"
                stroke-width="10"
                stroke-linecap="round"
                :stroke-dasharray="`${circleProgress} ${circleTotal}`"
              />
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#10b981" />
                  <stop offset="100%" stop-color="#059669" />
                </linearGradient>
              </defs>
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-2xl font-black" style="color: var(--color-card-texto)">{{ taxaConversao.toFixed(1) }}%</span>
              <span class="text-[10px] font-semibold" style="color: var(--color-card-texto); opacity: 0.75">Conversão</span>
            </div>
          </div>
          <p class="text-[10px] text-center leading-relaxed max-w-[240px]" style="color: var(--color-card-texto); opacity: 0.75">
            Aprovados ÷ (Aprovados + Enviados + Rejeitados + Vencidos)
          </p>
        </div>
      </div>

      <!-- Top 5 Clientes por Faturamento (Horizontal Bar) -->
      <div class="rounded-2xl border border-primary-10 shadow-sm bg-theme-card p-5">
        <h3 class="text-[10px] font-black uppercase tracking-widest mb-4" style="color: var(--color-card-texto); opacity: 0.75">Top 5 Clientes por Faturamento</h3>
        <ClientOnly>
          <template v-if="topClientes.length > 0">
            <Bar :data="topClientesChartData" :options="topClientesOptions" :plugins="[topClientesLabelsPlugin]" class="max-h-[220px]" />
          </template>
          <template v-else>
            <div class="flex flex-col items-center py-8 gap-2">
              <svg class="w-8 h-8" style="color: var(--color-card-texto); opacity: 0.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/></svg>
              <p class="text-sm font-semibold" style="color: var(--color-card-texto); opacity: 0.75">Nenhum cliente com faturamento no período</p>
            </div>
          </template>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Bar, Doughnut, Line } from 'vue-chartjs'

import type {
  MetricasFinanceiras,
  PipelineOrcamentos,
  StatusProducao,
  TopCliente,
  EvolucaoMensal,
} from '~/composables/useDashboardAdmin'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
)

// Props
const props = defineProps<{
  financeiro: MetricasFinanceiras
  pipeline: PipelineOrcamentos
  producao: StatusProducao
  topClientes: TopCliente[]
  evolucaoMensal: EvolucaoMensal[]
  formatCurrency: (value: number) => string
  periodoLabel: string
}>()

// ─── Totals ─────────────────────────────────────────────────────────────────

const pipelineTotalVal = computed(() =>
  props.pipeline.rascunho + props.pipeline.enviado + props.pipeline.aprovado + props.pipeline.rejeitado + props.pipeline.vencido
)

const producaoTotalVal = computed(() =>
  props.producao.osEmProducao + props.producao.osProntas + props.producao.osAtrasadas
)

function pipelinePct(val: number): string {
  if (pipelineTotalVal.value === 0) return '0'
  return ((val / pipelineTotalVal.value) * 100).toFixed(1)
}

function producaoPct(val: number): string {
  if (producaoTotalVal.value === 0) return '0'
  return ((val / producaoTotalVal.value) * 100).toFixed(1)
}

// ─── Taxa de Conversão (Gauge) ──────────────────────────────────────────────

const taxaConversao = computed(() => {
  const { aprovado, enviado, rejeitado, vencido } = props.pipeline
  const total = aprovado + enviado + rejeitado + vencido
  if (total === 0) return 0
  return (aprovado / total) * 100
})

const circleTotal = 2 * Math.PI * 52
const circleProgress = computed(() => (taxaConversao.value / 100) * circleTotal)

// ─── Chart.js Plugins ───────────────────────────────────────────────────────

// Center text plugin for donuts
function centerTextPlugin(totalType: 'pipelineTotal' | 'producaoTotal') {
  return {
    id: `centerText_${totalType}`,
    beforeDraw(chart: any) {
      const { ctx, width, height } = chart
      const meta = chart.getDatasetMeta(0)
      if (!meta || !meta.data || meta.data.length === 0) return
      const total = totalType === 'pipelineTotal' ? pipelineTotalVal.value : producaoTotalVal.value
      const style = getComputedStyle(document.documentElement)
      const cardTextColor = style.getPropertyValue('--color-card-texto').trim() || '#1f2937'
      ctx.save()
      ctx.font = 'bold 20px sans-serif'
      ctx.fillStyle = cardTextColor
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(total.toString(), width / 2, height / 2 - 6)
      ctx.font = '10px sans-serif'
      ctx.fillStyle = cardTextColor
      ctx.globalAlpha = 0.7
      ctx.fillText('Total', width / 2, height / 2 + 12)
      ctx.globalAlpha = 1
      ctx.restore()
    },
  }
}

// Data labels plugin for bar chart
const dataLabelsPlugin = {
  id: 'customDataLabels',
  afterDatasetsDraw(chart: any) {
    const { ctx } = chart
    const style = getComputedStyle(document.documentElement)
    const cardTextColor = style.getPropertyValue('--color-card-texto').trim() || '#374151'
    chart.data.datasets.forEach((dataset: any, datasetIndex: number) => {
      const meta = chart.getDatasetMeta(datasetIndex)
      meta.data.forEach((bar: any, index: number) => {
        const value = dataset.data[index]
        if (value === 0) return
        ctx.save()
        ctx.font = 'bold 10px sans-serif'
        ctx.fillStyle = cardTextColor
        ctx.textAlign = 'center'
        ctx.fillText(props.formatCurrency(value), bar.x, bar.y - 8)
        ctx.restore()
      })
    })
  },
}

// Labels plugin for top clientes horizontal bar
const topClientesLabelsPlugin = {
  id: 'topClientesLabels',
  afterDatasetsDraw(chart: any) {
    const { ctx } = chart
    const style = getComputedStyle(document.documentElement)
    const cardTextColor = style.getPropertyValue('--color-card-texto').trim() || '#374151'
    const dataset = chart.data.datasets[0]
    const meta = chart.getDatasetMeta(0)
    meta.data.forEach((bar: any, index: number) => {
      const value = dataset.data[index]
      if (value === 0) return
      ctx.save()
      ctx.font = 'bold 10px sans-serif'
      ctx.fillStyle = cardTextColor
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      ctx.fillText(props.formatCurrency(value), bar.x + 6, bar.y)
      ctx.restore()
    })
  },
}

// ─── Tooltip config ─────────────────────────────────────────────────────────

const premiumTooltip = {
  backgroundColor: 'rgba(17,24,39,0.95)',
  titleFont: { weight: 'bold' as const, size: 12 },
  bodyFont: { size: 11 },
  padding: 10,
  cornerRadius: 8,
  displayColors: false,
}

// ─── Chart A: Faturamento vs Despesas (Bar) ─────────────────────────────────

const faturamentoBarData = computed(() => ({
  labels: [props.periodoLabel],
  datasets: [
    {
      label: 'Faturamento',
      data: [props.financeiro.faturamento],
      backgroundColor: '#10b981',
      hoverBackgroundColor: '#059669',
      borderRadius: 8,
      barThickness: 40,
    },
    {
      label: 'Despesas',
      data: [props.financeiro.despesas],
      backgroundColor: '#f87171',
      hoverBackgroundColor: '#ef4444',
      borderRadius: 8,
      barThickness: 40,
    },
  ],
}))

const faturamentoBarOptions = computed(() => {
  const textColor = typeof document !== 'undefined'
    ? getComputedStyle(document.documentElement).getPropertyValue('--color-card-texto').trim() || '#9ca3af'
    : '#9ca3af'
  return {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 600, easing: 'easeOutQuart' as const },
  plugins: {
    legend: { display: false },
    tooltip: {
      ...premiumTooltip,
      callbacks: {
        label: (ctx: any) => `${ctx.dataset.label}: ${props.formatCurrency(ctx.raw)}`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { display: false },
      border: { display: false },
      ticks: { font: { size: 10 }, color: textColor },
    },
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: { font: { size: 11, weight: 'bold' as const }, color: textColor },
    },
  },
}
})

// ─── Chart B: Pipeline Doughnut ─────────────────────────────────────────────

const pipelineChartData = computed(() => {
  const style = getComputedStyle(document.documentElement)
  const cardBg = style.getPropertyValue('--color-card').trim() || '#ffffff'
  return {
  labels: ['Rascunho', 'Enviado', 'Aprovado', 'Rejeitado', 'Vencido'],
  datasets: [
    {
      data: [
        props.pipeline.rascunho,
        props.pipeline.enviado,
        props.pipeline.aprovado,
        props.pipeline.rejeitado,
        props.pipeline.vencido,
      ],
      backgroundColor: ['#9ca3af', '#3b82f6', '#10b981', '#ef4444', '#f97316'],
      borderWidth: 2,
      borderColor: cardBg,
      hoverOffset: 6,
    },
  ],
}
})

const donutOptions = {
  responsive: true,
  maintainAspectRatio: true,
  cutout: '70%',
  animation: { duration: 600, easing: 'easeOutQuart' as const },
  plugins: {
    legend: { display: false },
    tooltip: { ...premiumTooltip },
  },
}

// ─── Chart C: Produção Doughnut ─────────────────────────────────────────────

const producaoChartData = computed(() => {
  const style = getComputedStyle(document.documentElement)
  const cardBg = style.getPropertyValue('--color-card').trim() || '#ffffff'
  return {
  labels: ['Em Produção', 'Prontas', 'Atrasadas'],
  datasets: [
    {
      data: [props.producao.osEmProducao, props.producao.osProntas, props.producao.osAtrasadas],
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
      borderWidth: 2,
      borderColor: cardBg,
      hoverOffset: 6,
    },
  ],
}
})

// ─── Top Clientes (horizontal bar with purple gradient) ─────────────────────

const purpleGradient = ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe']

const topClientesChartData = computed(() => ({
  labels: props.topClientes.map((c) => c.nome),
  datasets: [
    {
      label: 'Faturamento',
      data: props.topClientes.map((c) => c.total),
      backgroundColor: props.topClientes.map((_, i) => purpleGradient[i] ?? '#ddd6fe'),
      hoverBackgroundColor: '#7c3aed',
      borderRadius: 8,
      barThickness: 24,
    },
  ],
}))

const topClientesOptions = computed(() => {
  const textColor = typeof document !== 'undefined'
    ? getComputedStyle(document.documentElement).getPropertyValue('--color-card-texto').trim() || '#9ca3af'
    : '#9ca3af'
  return {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y' as const,
  animation: { duration: 600, easing: 'easeOutQuart' as const },
  plugins: {
    legend: { display: false },
    tooltip: {
      ...premiumTooltip,
      callbacks: {
        label: (ctx: any) => props.formatCurrency(ctx.raw),
      },
    },
  },
  scales: {
    x: {
      display: false,
      beginAtZero: true,
      grid: { display: false },
      border: { display: false },
    },
    y: {
      grid: { display: false },
      border: { display: false },
      ticks: { font: { size: 11, weight: 'bold' as const }, color: textColor },
    },
  },
}
})

// ─── Evolução Mensal (Line/Area Chart) ──────────────────────────────────────

const evolucaoChartData = computed(() => ({
  labels: props.evolucaoMensal.map((e) => e.mes),
  datasets: [
    {
      label: 'Faturamento',
      data: props.evolucaoMensal.map((e) => e.faturamento),
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: '#10b981',
      pointHoverBorderColor: '#fff',
      pointHoverBorderWidth: 2,
      borderWidth: 2.5,
    },
    {
      label: 'Despesas',
      data: props.evolucaoMensal.map((e) => e.despesas),
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239, 68, 68, 0.08)',
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: '#ef4444',
      pointHoverBorderColor: '#fff',
      pointHoverBorderWidth: 2,
      borderWidth: 2.5,
    },
  ],
}))

const evolucaoChartOptions = computed(() => {
  const textColor = typeof document !== 'undefined'
    ? getComputedStyle(document.documentElement).getPropertyValue('--color-card-texto').trim() || '#9ca3af'
    : '#9ca3af'
  return {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 800, easing: 'easeOutQuart' as const },
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
      labels: { usePointStyle: true, pointStyle: 'circle', padding: 16, font: { size: 11, weight: 'bold' as const }, color: textColor },
    },
    tooltip: {
      ...premiumTooltip,
      callbacks: {
        label: (ctx: any) => `${ctx.dataset.label}: ${props.formatCurrency(ctx.raw)}`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(128,128,128,0.08)' },
      border: { display: false },
      ticks: { font: { size: 10 }, color: textColor },
    },
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: { font: { size: 11, weight: 'bold' as const }, color: textColor },
    },
  },
}
})
</script>
