<template>
  <div>
    <!-- Section divider -->
    <div class="h-px bg-primary-10 my-4" />

    <!-- Evolução da Receita (full width SVG area chart — 12 meses) -->
    <div class="rounded-2xl border border-primary-10 shadow-sm bg-theme-card p-5 mb-5">
      <div class="flex items-center justify-between mb-5">
        <div>
          <h3 class="text-base font-black" style="color: var(--color-card-texto)">Evolução da Receita</h3>
          <p class="text-xs mt-0.5" style="color: var(--color-card-texto); opacity: 0.55">Últimos 12 meses — valores mensais</p>
        </div>
        <div class="flex items-center gap-4 text-xs font-semibold" style="color: var(--color-card-texto); opacity: 0.7">
          <div class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded-sm bg-emerald-500"></span>
            Receita
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded-sm border-2 border-dashed border-emerald-300" style="background: rgba(110,231,183,0.15)"></span>
            A Receber
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded-sm bg-red-400"></span>
            Despesas
          </div>
        </div>
      </div>

      <div class="relative" @mouseleave="evolTooltip = null">
        <svg viewBox="0 0 960 175" class="w-full" aria-hidden="true">
          <defs>
            <linearGradient id="dashAreaGradReceita" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#10b981" stop-opacity="0.22" />
              <stop offset="100%" stop-color="#10b981" stop-opacity="0.02" />
            </linearGradient>
            <linearGradient id="dashAreaGradDespesa" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#ef4444" stop-opacity="0.1" />
              <stop offset="100%" stop-color="#ef4444" stop-opacity="0.01" />
            </linearGradient>
            <linearGradient id="dashAreaGradAReceber" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#6ee7b7" stop-opacity="0.15" />
              <stop offset="100%" stop-color="#6ee7b7" stop-opacity="0.02" />
            </linearGradient>
          </defs>

          <!-- Grid lines -->
          <line v-for="(step, n) in evolYSteps" :key="`egl${n}`" x1="60" :y1="15 + n * (120 / (evolYSteps.length - 1))" x2="940" :y2="15 + n * (120 / (evolYSteps.length - 1))" stroke="var(--color-primary-10)" stroke-width="1" />

          <!-- Y-axis labels -->
          <text v-for="(step, n) in evolYSteps" :key="`eyl${n}`" x="56" :y="15 + n * (120 / (evolYSteps.length - 1)) + 4" text-anchor="end" font-size="9" fill="currentColor" style="opacity: 0.5">
            {{ formatShort(step) }}
          </text>

          <!-- Area fills -->
          <path v-if="evolPoints.length > 0" :d="evolAreaDespesas" fill="url(#dashAreaGradDespesa)" />
          <path v-if="evolPoints.length > 0" :d="evolAreaAReceber" fill="url(#dashAreaGradAReceber)" />
          <path v-if="evolPoints.length > 0" :d="evolAreaReceita" fill="url(#dashAreaGradReceita)" />

          <!-- Expense line (solid) -->
          <path v-if="evolPoints.length > 0" :d="evolLineDespesas" fill="none" stroke="#f87171" stroke-width="2" stroke-linecap="round" />

          <!-- A Receber line (dashed, light green) -->
          <path v-if="evolPoints.length > 0" :d="evolLineAReceber" fill="none" stroke="#6ee7b7" stroke-width="2" stroke-dasharray="5,3" stroke-linecap="round" />

          <!-- Revenue line -->
          <path v-if="evolPoints.length > 0" :d="evolLineReceita" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />

          <!-- Data point circles (a receber) -->
          <circle v-for="(p, i) in evolPoints" :key="`epar${i}`" :cx="p.x" :cy="p.yAReceber" r="3" fill="#6ee7b7" stroke="white" stroke-width="1.5" />

          <!-- Data point circles (revenue) -->
          <circle v-for="(p, i) in evolPoints" :key="`ept${i}`" :cx="p.x" :cy="p.yReceita" r="3.5" fill="#10b981" stroke="white" stroke-width="2" />

          <!-- Hover vertical line -->
          <line v-if="evolTooltip !== null" :x1="evolPoints[evolTooltip].x" :y1="15" :x2="evolPoints[evolTooltip].x" :y2="135" stroke="#d1d5db" stroke-width="1" stroke-dasharray="3,2" />

          <!-- Invisible hover zones -->
          <rect v-for="(p, i) in evolPoints" :key="`ehz${i}`" :x="p.x - 40" y="0" width="80" height="175" fill="transparent" style="cursor: pointer" @mouseenter="evolTooltip = i" @mouseleave="evolTooltip = null" />

          <!-- Month labels -->
          <text v-for="(p, i) in evolPoints" :key="`epl${i}`" :x="p.x" y="162" text-anchor="middle" font-size="9" fill="currentColor" style="opacity: 0.5" font-weight="600">{{ p.label }}</text>

          <!-- Baseline -->
          <line x1="60" y1="135" x2="940" y2="135" stroke="var(--color-primary-10)" stroke-width="1.5" />
        </svg>

        <!-- Tooltip -->
        <Transition name="fade">
          <div
            v-if="evolTooltip !== null"
            class="absolute z-10 pointer-events-none rounded-xl shadow-lg border px-3 py-2.5 text-xs min-w-[140px]"
            style="background: var(--color-card); border-color: var(--color-primary-10); color: var(--color-card-texto)"
            :style="{ left: `${(evolPoints[evolTooltip].x / 960) * 100}%`, top: '0px', transform: 'translateX(-50%)' }"
          >
            <p class="font-bold mb-1.5 capitalize">{{ evolPoints[evolTooltip].label }}</p>
            <div class="flex items-center gap-1.5 mb-1">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span style="opacity: 0.7">Receita:</span>
              <span class="font-bold ml-auto">{{ formatCurrency(evolPoints[evolTooltip].receita) }}</span>
            </div>
            <div class="flex items-center gap-1.5 mb-1">
              <span class="w-2 h-2 rounded-full bg-emerald-300"></span>
              <span style="opacity: 0.7">A Receber:</span>
              <span class="font-bold ml-auto">{{ formatCurrency(evolPoints[evolTooltip].receitaAReceber) }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-red-400"></span>
              <span style="opacity: 0.7">Despesas:</span>
              <span class="font-bold ml-auto">{{ formatCurrency(evolPoints[evolTooltip].despesas) }}</span>
            </div>
          </div>
        </Transition>
      </div>
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
import { computed, ref, onMounted } from 'vue'
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
import { Bar, Doughnut } from 'vue-chartjs'
import { createSupabaseClient } from '~/lib/supabase'
import { useEmpresa } from '~/composables/useEmpresa'
import { useRealtimeMulti } from '~/composables/useRealtime'

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

// ─── Evolução da Receita (SVG Chart) — dados locais iguais ao financeiro ────

const supabase = createSupabaseClient()
const { empresaId, loadEmpresa } = useEmpresa()
const evolTooltip = ref<number | null>(null)

interface VendaLocal {
  id: number
  preco_veiculo: number | null
  status: string
  data_venda: string | null
  vendas_itens: { preco_unitario: number; quantidade: number; valor_total: number | null }[]
}
interface ContaLocal {
  id: number
  valor: number
  data_vencimento: string
  data_pagamento: string | null
  status: string | null
  tipo: string
}
interface AgendamentoLocal {
  id: number
  data_hora: string | null
  valor_total: number | null
}
interface OSLocal {
  id: number
  valor_total: number | null
  status: string
  data_entrega: string | null
}

const vendas = ref<VendaLocal[]>([])
const contas = ref<ContaLocal[]>([])
const agendamentos = ref<AgendamentoLocal[]>([])
const ordensServico = ref<OSLocal[]>([])

async function fetchEvolData() {
  await loadEmpresa()
  if (!empresaId.value) return

  const [v, c, a, os] = await Promise.all([
    supabase.from('vendas')
      .select('id, preco_veiculo, status, data_venda, vendas_itens(preco_unitario, quantidade, valor_total)')
      .eq('empresa_id', empresaId.value)
      .eq('status', 'finalizada'),
    supabase.from('contas_pagar')
      .select('id, valor, data_vencimento, data_pagamento, status, tipo')
      .eq('empresa_id', empresaId.value),
    supabase.from('agendamentos')
      .select('id, data_hora, valor_total')
      .eq('empresa_id', empresaId.value)
      .eq('status', 'concluido')
      .not('valor_total', 'is', null)
      .gt('valor_total', 0),
    supabase.from('ordens_servico_adesivo')
      .select('id, valor_total, status, data_entrega')
      .eq('empresa_id', empresaId.value)
      .eq('status', 'entregue')
      .not('valor_total', 'is', null)
      .gt('valor_total', 0),
  ])

  vendas.value = (v.data ?? []) as VendaLocal[]
  contas.value = (c.data ?? []) as ContaLocal[]
  agendamentos.value = (a.data ?? []) as AgendamentoLocal[]
  ordensServico.value = (os.data ?? []) as OSLocal[]
}

onMounted(fetchEvolData)

// Realtime: atualiza gráfico quando dados mudam
useRealtimeMulti(['contas_pagar', 'vendas', 'agendamentos', 'ordens_servico_adesivo'], () => {
  fetchEvolData()
})

function vendaTotalLocal(v: VendaLocal): number {
  const itemsTotal = (v.vendas_itens ?? []).reduce((s, i) => s + (i.valor_total ?? i.preco_unitario * i.quantidade), 0)
  return (v.preco_veiculo ?? 0) + itemsTotal
}

// Mesmo cálculo do financeiro.vue
const monthlyData = computed(() => {
  const now = new Date()
  return Array.from({ length: 12 }, (_, idx) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (11 - idx), 1)
    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const label = d.toLocaleDateString('pt-BR', { month: 'short' })

    const receitaVendas = vendas.value
      .filter(v => {
        if (!v.data_venda) return false
        const dv = new Date(v.data_venda)
        return dv.getFullYear() === year && dv.getMonth() + 1 === month
      })
      .reduce((s, v) => s + vendaTotalLocal(v), 0)

    const receitaAgendamentos = agendamentos.value
      .filter(a => {
        if (!a.data_hora || !a.valor_total) return false
        const da = new Date(a.data_hora)
        return da.getFullYear() === year && da.getMonth() + 1 === month
      })
      .reduce((s, a) => s + (a.valor_total ?? 0), 0)

    const receitaOS = ordensServico.value
      .filter(os => {
        if (!os.data_entrega || !os.valor_total) return false
        const de = new Date(os.data_entrega)
        return de.getFullYear() === year && de.getMonth() + 1 === month
      })
      .reduce((s, os) => s + (os.valor_total ?? 0), 0)

    const receitaContas = contas.value
      .filter(c => {
        if ((c.tipo ?? 'pagar') !== 'receber') return false
        if (c.status !== 'pago') return false
        const dateStr = c.data_pagamento ?? c.data_vencimento
        if (!dateStr) return false
        const dp = new Date(dateStr + 'T12:00:00')
        return dp.getFullYear() === year && dp.getMonth() + 1 === month
      })
      .reduce((s, c) => s + (c.valor ?? 0), 0)

    const receita = receitaVendas + receitaAgendamentos + receitaOS + receitaContas

    const isCurrentMonth = (year === now.getFullYear() && month === now.getMonth() + 1)
    const receitaAReceber = contas.value
      .filter(c => {
        if ((c.tipo ?? 'pagar') !== 'receber') return false
        if (c.status !== 'pendente') return false
        if (!c.valor) return false
        if (isCurrentMonth) return true
        const dateStr = c.data_vencimento
        if (!dateStr) return false
        const dv = new Date(dateStr + 'T12:00:00')
        return dv.getFullYear() === year && dv.getMonth() + 1 === month
      })
      .reduce((s, c) => s + (c.valor ?? 0), 0)

    const despesas = contas.value
      .filter(c => {
        if ((c.tipo ?? 'pagar') === 'receber') return false
        if (c.status === 'cancelado' || !c.data_vencimento) return false
        const dv = new Date(c.data_vencimento + 'T12:00:00')
        return dv.getFullYear() === year && dv.getMonth() + 1 === month
      })
      .reduce((s, c) => s + (c.valor ?? 0), 0)

    return { label, receita, despesas, receitaAReceber }
  })
})

function formatShort(val: number): string {
  if (val >= 1_000_000) return `R$${(val / 1_000_000).toFixed(1)}M`
  if (val >= 10_000) return `R$${(val / 1_000).toFixed(0)}k`
  if (val >= 1_000) return `R$${(val / 1_000).toFixed(1)}k`
  return `R$${val.toFixed(0)}`
}

function makeSmoothPathEvol(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return ''
  let d = `M ${pts[0].x.toFixed(2)},${pts[0].y.toFixed(2)}`
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 1]
    const p1 = pts[i]
    const dx = p1.x - p0.x
    const cp1x = (p0.x + dx * 0.4).toFixed(2)
    const cp2x = (p1.x - dx * 0.4).toFixed(2)
    d += ` C ${cp1x},${p0.y.toFixed(2)} ${cp2x},${p1.y.toFixed(2)} ${p1.x.toFixed(2)},${p1.y.toFixed(2)}`
  }
  return d
}

const evolRawMax = computed(() =>
  Math.max(...monthlyData.value.flatMap(m => [m.receita, m.despesas, m.receitaAReceber]), 1)
)
const evolMaxVal = computed(() => Math.ceil(evolRawMax.value / 250) * 250 || 250)
const evolYSteps = computed(() => {
  const max = evolMaxVal.value
  const step = max >= 2000 ? 500 : 250
  const steps: number[] = []
  for (let v = 0; v <= max; v += step) steps.push(v)
  return steps.reverse()
})

const evolPoints = computed(() => {
  const maxVal = evolMaxVal.value
  return monthlyData.value.map((m, i) => ({
    x: 60 + i * (880 / 11),
    yReceita: 135 - (m.receita / maxVal) * 120,
    yDespesas: 135 - (m.despesas / maxVal) * 120,
    yAReceber: 135 - (m.receitaAReceber / maxVal) * 120,
    label: m.label,
    receita: m.receita,
    despesas: m.despesas,
    receitaAReceber: m.receitaAReceber,
  }))
})

const evolLineReceita = computed(() => makeSmoothPathEvol(evolPoints.value.map(p => ({ x: p.x, y: p.yReceita }))))
const evolLineDespesas = computed(() => makeSmoothPathEvol(evolPoints.value.map(p => ({ x: p.x, y: p.yDespesas }))))
const evolLineAReceber = computed(() => makeSmoothPathEvol(evolPoints.value.map(p => ({ x: p.x, y: p.yAReceber }))))

const evolAreaReceita = computed(() => {
  const pts = evolPoints.value
  if (!pts.length) return ''
  return `${makeSmoothPathEvol(pts.map(p => ({ x: p.x, y: p.yReceita })))} L ${pts[pts.length - 1].x.toFixed(2)},135 L ${pts[0].x.toFixed(2)},135 Z`
})
const evolAreaDespesas = computed(() => {
  const pts = evolPoints.value
  if (!pts.length) return ''
  return `${makeSmoothPathEvol(pts.map(p => ({ x: p.x, y: p.yDespesas })))} L ${pts[pts.length - 1].x.toFixed(2)},135 L ${pts[0].x.toFixed(2)},135 Z`
})
const evolAreaAReceber = computed(() => {
  const pts = evolPoints.value
  if (!pts.length) return ''
  return `${makeSmoothPathEvol(pts.map(p => ({ x: p.x, y: p.yAReceber })))} L ${pts[pts.length - 1].x.toFixed(2)},135 L ${pts[0].x.toFixed(2)},135 Z`
})

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
</script>
