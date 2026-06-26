<template>
  <div class="min-h-full p-3 sm:p-6">

    <!-- MODAL DETALHES DA OS -->
    <OSDetalhesModal
      :show="showDetalheModal"
      :ordem-servico="osSelecionada"
      :itens-o-s="itensOSSelecionada"
      @close="showDetalheModal = false"
      @status-updated="onStatusUpdated"
      @pagamento-updated="onPagamentoUpdated"
    />

    <!-- CABEÇALHO -->
    <div class="relative rounded-3xl overflow-hidden mb-8 shadow-xl">
      <div class="absolute inset-0" :style="{ background: 'var(--color-primary-bg, linear-gradient(135deg, #059669, #10b981))' }" />
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />
      <div class="relative px-4 sm:px-8 pt-5 sm:pt-7 pb-5 sm:pb-7">
        <div class="flex flex-wrap items-start justify-between gap-3 sm:gap-6">
          <div class="flex items-center gap-3 sm:gap-5">
            <div class="flex items-center justify-center w-10 sm:w-14 h-10 sm:h-14 rounded-2xl bg-white/[0.12] backdrop-blur-sm border border-white/20 shadow-lg">
              <svg class="w-5 sm:w-7 h-5 sm:h-7 text-white" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-semibold text-white/80 uppercase tracking-widest">Produção</span>
                <span class="w-1 h-1 rounded-full bg-white/40" />
                <span class="text-xs text-white/50 hidden sm:inline">Ordens de Serviço</span>
              </div>
              <h1 class="text-xl sm:text-3xl font-bold text-white tracking-tight leading-none">Ordens de Serviço</h1>
              <p class="text-sm text-emerald-100/80 mt-1.5">
                {{ loading ? 'Carregando...' : `${ordensServico.length} OS encontrada(s)` }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- KPI CARDS (dinâmicos baseados nas etapas do kanban) -->
    <div class="flex gap-2 overflow-x-auto pb-2 mb-4">
      <div
        v-for="kpi in kpis"
        :key="kpi.id"
        class="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-100 bg-white shadow-sm flex-shrink-0"
      >
        <span class="w-2 h-2 rounded-full flex-shrink-0" :style="{ background: kpi.cor }" />
        <span class="text-[10px] font-bold text-gray-500 uppercase whitespace-nowrap">{{ kpi.nome }}</span>
        <span class="text-sm font-black text-gray-800">{{ kpi.count }}</span>
      </div>
    </div>

    <!-- TOGGLE VISUALIZAÇÃO + FILTRO -->
    <div class="flex items-center justify-between mb-4 pt-4 border-t border-gray-200">
      <!-- Filtros (só no modo lista) — baseados nas etapas dinâmicas -->
      <div v-if="viewMode === 'list'" class="flex gap-2 overflow-x-auto pb-1">
        <button v-for="f in filtrosEtapas" :key="f.value" type="button"
          class="px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all"
          :class="filtroEtapa === f.value ? 'text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'"
          :style="filtroEtapa === f.value ? { background: 'var(--color-primary)' } : {}"
          @click="filtroEtapa = f.value">
          {{ f.label }}
        </button>
      </div>
      <div v-else />

      <!-- Toggle Lista / Kanban -->
      <div class="flex rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
        <button type="button" class="px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5"
          :class="viewMode === 'list' ? 'text-white' : 'bg-white text-gray-500 hover:bg-gray-50'"
          :style="viewMode === 'list' ? { background: 'var(--color-primary)' } : {}"
          @click="viewMode = 'list'">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" /></svg>
          Lista
        </button>
        <button type="button" class="px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5"
          :class="viewMode === 'kanban' ? 'text-white' : 'bg-white text-gray-500 hover:bg-gray-50'"
          :style="viewMode === 'kanban' ? { background: 'var(--color-primary)' } : {}"
          @click="viewMode = 'kanban'">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z" /></svg>
          Kanban
        </button>
      </div>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="flex flex-col items-center gap-4 py-32">
      <span class="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      <span class="text-sm text-gray-400">Carregando ordens de serviço...</span>
    </div>

    <!-- ═══ MODO KANBAN ═══ -->
    <div v-else-if="viewMode === 'kanban'">
      <KanbanBoard :key="kanbanKey" pipeline-tipo="producao" @card-click="onKanbanCardClick" />
    </div>

    <!-- ═══ MODO LISTA ═══ -->
    <div v-else class="space-y-3">
      <div v-if="osFiltradas.length === 0" class="text-center py-20">
        <svg class="w-14 h-14 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" stroke-width="1.25" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08" /></svg>
        <p class="text-sm font-semibold text-gray-400">Nenhuma OS encontrada</p>
      </div>

      <!-- Card de cada OS -->
      <div
        v-for="os in osFiltradas" :key="os.id"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
        @click="abrirDetalhe(os)"
      >
        <div class="flex items-center justify-between px-4 sm:px-5 py-3.5">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" :style="{ background: getEtapaCor(os.etapa_id) }">
              <span class="text-[11px] font-black text-white">{{ os.posicao_fila }}</span>
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <span class="text-sm font-bold text-gray-800">{{ os.numero_os }}</span>
                <span class="text-xs font-bold px-2 py-0.5 rounded-full" :style="{ background: getEtapaCor(os.etapa_id) + '20', color: getEtapaCor(os.etapa_id) }">{{ getEtapaNome(os.etapa_id) }}</span>
              </div>
              <p v-if="os.nome_trabalho" class="text-xs font-semibold text-indigo-600 mt-0.5 truncate">{{ os.nome_trabalho }}</p>
              <p class="text-xs text-gray-400 mt-0.5 truncate">{{ os.cliente_nome ?? 'Cliente' }} · {{ formatDate(os.data_aprovacao) }}</p>
              <p v-if="os.data_entrega" class="text-[10px] text-orange-600 font-semibold mt-0.5">Entrega: {{ formatDate(os.data_entrega) }}</p>
            </div>
          </div>
          <div class="text-right flex-shrink-0">
            <p class="text-sm font-bold text-gray-800">{{ formatCurrency(os.valor_total) }}</p>
            <p v-if="os.endereco_instalacao" class="text-[10px] text-gray-400 truncate max-w-[120px]">📍 {{ os.endereco_instalacao }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createSupabaseClient } from '~/lib/supabase'
import type { StatusOS, ItemOS, OrdemServico } from '~/composables/useOrdensServico'
import type { KanbanCard } from '~/composables/useKanban'
import OSDetalhesModal from '~/components/OSDetalhesModal.vue'
import KanbanBoard from '~/components/kanban/KanbanBoard.vue'

interface OSListItem {
  id: number
  numero_os: string
  nome_trabalho: string | null
  status: StatusOS
  etapa_id: number | null
  valor_total: number
  posicao_fila: number
  data_aprovacao: string
  data_entrega: string | null
  cliente_nome: string | null
  cliente_telefone: string | null
  endereco_instalacao: string | null
}

const supabase = createSupabaseClient()
const { empresaId, loadEmpresa } = useEmpresa()

const ordensServico = ref<OSListItem[]>([])
const loading = ref(true)
const filtroEtapa = ref<number | ''>('')
const viewMode = ref<'list' | 'kanban'>('kanban')
const showDetalheModal = ref(false)
const osSelecionada = ref<OrdemServico | null>(null)
const itensOSSelecionada = ref<ItemOS[]>([])
const kanbanKey = ref(0)

// Etapas dinâmicas do pipeline de produção
const etapasProducao = ref<{ id: number; nome: string; cor: string; posicao: number; is_final: boolean }[]>([])

async function fetchEtapas() {
  const { data } = await supabase
    .from('pipeline_etapas')
    .select('id, nome, cor, posicao, is_final')
    .eq('pipeline_tipo', 'producao')
    .order('posicao', { ascending: true })
  etapasProducao.value = data ?? []
}

// Filtros dinâmicos baseados nas etapas
const filtrosEtapas = computed(() => [
  { label: 'Todas', value: '' as number | '' },
  ...etapasProducao.value.map(e => ({ label: e.nome, value: e.id })),
])

const kpis = computed(() => {
  // KPIs baseados nas etapas — mostra contagem por cada etapa
  return etapasProducao.value.map(etapa => ({
    id: etapa.id,
    nome: etapa.nome,
    cor: etapa.cor,
    count: ordensServico.value.filter(os => os.etapa_id === etapa.id).length,
  }))
})

const osFiltradas = computed(() => {
  if (!filtroEtapa.value) return ordensServico.value
  return ordensServico.value.filter(os => os.etapa_id === filtroEtapa.value)
})

function getEtapaNome(etapaId: number | null): string {
  if (!etapaId) return '—'
  return etapasProducao.value.find(e => e.id === etapaId)?.nome ?? '—'
}

function getEtapaCor(etapaId: number | null): string {
  if (!etapaId) return '#6b7280'
  return etapasProducao.value.find(e => e.id === etapaId)?.cor ?? '#6b7280'
}

function formatCurrency(val: number | null): string {
  if (val == null) return 'R$ 0,00'
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('pt-BR')
}

async function fetchOS() {
  loading.value = true
  const { data } = await supabase
    .from('ordens_servico_adesivo')
    .select('id, numero_os, nome_trabalho, status, etapa_id, valor_total, posicao_fila, data_aprovacao, data_entrega, endereco_instalacao, clientes(nome, telefone)')
    .order('posicao_fila', { ascending: true })

  ordensServico.value = (data ?? []).map((row: any) => ({
    id: row.id,
    numero_os: row.numero_os,
    nome_trabalho: row.nome_trabalho ?? null,
    status: row.status,
    etapa_id: row.etapa_id ?? null,
    valor_total: row.valor_total,
    posicao_fila: row.posicao_fila,
    data_aprovacao: row.data_aprovacao,
    data_entrega: row.data_entrega ?? null,
    cliente_nome: row.clientes?.nome ?? null,
    cliente_telefone: row.clientes?.telefone ?? null,
    endereco_instalacao: row.endereco_instalacao ?? null,
  }))
  loading.value = false
}

async function abrirDetalhe(os: OSListItem) {
  // Fetch full OS with client info
  const { data: osData } = await supabase
    .from('ordens_servico_adesivo')
    .select('*, clientes(nome, telefone)')
    .eq('id', os.id)
    .single()

  // Fetch items with all attachments
  const { data: itensData } = await supabase
    .from('itens_ordem_servico')
    .select('id, item_orcamento_id, descricao, material_id, largura_cm, altura_cm, quantidade, valor_item, foto_arte_url, foto_local_url, arquivo_url, foto_instalacao_url')
    .eq('ordem_servico_id', os.id)
    .order('id', { ascending: true })

  // Merge client data into OS object for the modal
  const osComCliente = {
    ...(osData as OrdemServico),
    cliente_nome: osData?.clientes?.nome ?? os.cliente_nome ?? null,
    cliente_telefone: osData?.clientes?.telefone ?? os.cliente_telefone ?? null,
    endereco_instalacao: osData?.endereco_instalacao ?? null,
    nome_trabalho: osData?.nome_trabalho ?? os.nome_trabalho ?? null,
    data_entrega: osData?.data_entrega ?? os.data_entrega ?? null,
  }

  osSelecionada.value = osComCliente as any
  itensOSSelecionada.value = (itensData ?? []) as ItemOS[]
  showDetalheModal.value = true
}

async function onKanbanCardClick(card: KanbanCard) {
  // Fetch full OS with client info
  const { data: osData } = await supabase
    .from('ordens_servico_adesivo')
    .select('*, clientes(nome, telefone)')
    .eq('id', card.id)
    .single()

  if (!osData) return

  // Fetch items with all attachments
  const { data: itensData } = await supabase
    .from('itens_ordem_servico')
    .select('id, item_orcamento_id, descricao, material_id, largura_cm, altura_cm, quantidade, valor_item, foto_arte_url, foto_local_url, arquivo_url, foto_instalacao_url')
    .eq('ordem_servico_id', card.id)
    .order('id', { ascending: true })

  // Merge client data into OS object for the modal
  osSelecionada.value = {
    ...(osData as OrdemServico),
    cliente_nome: osData.clientes?.nome ?? null,
    cliente_telefone: osData.clientes?.telefone ?? null,
    endereco_instalacao: osData.endereco_instalacao ?? null,
    nome_trabalho: osData.nome_trabalho ?? null,
    data_entrega: osData.data_entrega ?? null,
  } as any

  itensOSSelecionada.value = (itensData ?? []) as ItemOS[]
  showDetalheModal.value = true
}

function onStatusUpdated(os: OrdemServico) {
  const idx = ordensServico.value.findIndex(o => o.id === os.id)
  if (idx !== -1) ordensServico.value[idx].status = os.status
  osSelecionada.value = os
  // Forçar reload do kanban para refletir a mudança de etapa
  kanbanKey.value++
}

function onPagamentoUpdated(os: OrdemServico) {
  osSelecionada.value = os
}

onMounted(async () => {
  await loadEmpresa()
  await Promise.all([fetchOS(), fetchEtapas()])
})
</script>
