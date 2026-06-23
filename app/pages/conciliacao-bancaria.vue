<template>
  <div class="min-h-screen p-4 sm:p-6 space-y-5">
    <!-- Header -->
    <div class="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-3xl p-6 text-white shadow-xl">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-black">Conciliação Bancária</h1>
          <p class="text-sm text-gray-300 mt-1">Importe o extrato e concilie automaticamente</p>
        </div>
        <div class="flex items-center gap-3">
          <button
            v-if="transacoesPendentes.length > 0"
            type="button"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-lg"
            :disabled="conciliandoAuto"
            @click="conciliarAutomatico"
          >
            <span v-if="conciliandoAuto" class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>
            Conciliar Automaticamente
          </button>
          <label class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-white text-gray-900 hover:bg-gray-100 cursor-pointer transition-all shadow-lg">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
            {{ importando ? 'Importando...' : 'Importar Extrato' }}
            <input type="file" accept=".ofx,.csv,.txt" class="hidden" :disabled="importando" @change="handleFileUpload" />
          </label>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <Transition name="fade">
      <div v-if="toast" class="p-3.5 rounded-xl text-sm font-semibold" :class="toastType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'">
        {{ toast }}
      </div>
    </Transition>

    <!-- KPIs -->
    <div v-if="transacoes.length > 0" class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div class="bg-white rounded-2xl border border-gray-100 p-4">
        <p class="text-xs text-gray-500 font-medium">Total Transações</p>
        <p class="text-2xl font-black text-gray-900 mt-1">{{ transacoes.length }}</p>
      </div>
      <div class="bg-white rounded-2xl border border-yellow-100 p-4">
        <p class="text-xs text-yellow-600 font-medium">Pendentes</p>
        <p class="text-2xl font-black text-yellow-600 mt-1">{{ transacoesPendentes.length }}</p>
      </div>
      <div class="bg-white rounded-2xl border border-green-100 p-4">
        <p class="text-xs text-green-600 font-medium">Conciliadas</p>
        <p class="text-2xl font-black text-green-600 mt-1">{{ transacoesConciliadas.length }}</p>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-4">
        <p class="text-xs text-gray-400 font-medium">Ignoradas</p>
        <p class="text-2xl font-black text-gray-400 mt-1">{{ transacoesIgnoradas.length }}</p>
      </div>
    </div>

    <!-- Progresso da conciliação -->
    <div v-if="transacoes.length > 0" class="bg-white rounded-2xl border border-gray-100 p-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-bold text-gray-600">Progresso</span>
        <span class="text-xs font-black text-gray-900">{{ progressoPorcento }}%</span>
      </div>
      <div class="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div class="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-500" :style="{ width: progressoPorcento + '%' }"></div>
      </div>
    </div>

    <!-- Seletor de Extrato -->
    <div v-if="extratos.length > 0" class="bg-white rounded-2xl border border-gray-100 p-4">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-[11px] font-black text-gray-400 uppercase tracking-wider">Extratos Importados</h3>
        <button v-if="extratoAtivo" type="button" class="text-[10px] font-bold text-red-400 hover:text-red-600 transition-colors" @click="excluirExtratoAtivo">Excluir extrato</button>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="ext in extratos" :key="ext.id"
          type="button"
          class="px-3.5 py-2 rounded-xl text-xs font-bold border transition-all"
          :class="extratoAtivo === ext.id ? 'bg-gray-900 text-white border-gray-900 shadow-md' : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-400'"
          @click="selecionarExtrato(ext.id!)"
        >
          <span>{{ ext.nome_arquivo }}</span>
          <span class="ml-1.5 opacity-60">({{ ext.total_transacoes }})</span>
          <span v-if="ext.banco" class="ml-1.5 text-[9px] opacity-50">• {{ ext.banco }}</span>
        </button>
      </div>
    </div>

    <!-- Resultado da conciliação automática -->
    <div v-if="resultadoAuto" class="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
          <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
        </div>
        <div>
          <p class="text-sm font-bold text-emerald-800">Conciliação automática concluída</p>
          <p class="text-xs text-emerald-600 mt-0.5">{{ resultadoAuto.conciliadas }} transações conciliadas automaticamente • {{ resultadoAuto.restantes }} pendentes</p>
        </div>
      </div>
    </div>

    <!-- Tabs: Pendentes | Conciliadas | Ignoradas -->
    <div v-if="transacoes.length > 0" class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div class="flex border-b border-gray-100">
        <button type="button" class="flex-1 px-4 py-3 text-xs font-bold text-center transition-colors" :class="tabAtiva === 'pendentes' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400 hover:text-gray-600'" @click="tabAtiva = 'pendentes'">
          Pendentes ({{ transacoesPendentes.length }})
        </button>
        <button type="button" class="flex-1 px-4 py-3 text-xs font-bold text-center transition-colors" :class="tabAtiva === 'conciliadas' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-400 hover:text-gray-600'" @click="tabAtiva = 'conciliadas'">
          Conciliadas ({{ transacoesConciliadas.length }})
        </button>
        <button type="button" class="flex-1 px-4 py-3 text-xs font-bold text-center transition-colors" :class="tabAtiva === 'ignoradas' ? 'text-gray-600 border-b-2 border-gray-600' : 'text-gray-400 hover:text-gray-600'" @click="tabAtiva = 'ignoradas'">
          Ignoradas ({{ transacoesIgnoradas.length }})
        </button>
      </div>

      <div class="divide-y divide-gray-50">
        <!-- TAB: PENDENTES -->
        <template v-if="tabAtiva === 'pendentes'">
          <div v-for="t in transacoesPendentes" :key="t.id" class="p-4 hover:bg-gray-50/50 transition-colors">
            <div class="flex items-start justify-between">
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full flex-shrink-0" :class="t.tipo === 'credito' ? 'bg-green-400' : 'bg-red-400'"></span>
                  <p class="text-sm font-semibold text-gray-900 truncate">{{ t.descricao }}</p>
                </div>
                <p class="text-[11px] text-gray-400 mt-0.5 ml-4">{{ formatDate(t.data_transacao) }}</p>
              </div>
              <p class="text-sm font-black ml-3 flex-shrink-0" :class="t.tipo === 'credito' ? 'text-green-600' : 'text-red-600'">
                {{ t.tipo === 'credito' ? '+' : '-' }}{{ formatCurrency(t.valor) }}
              </p>
            </div>

            <!-- Match sugerido (melhor match) -->
            <div v-if="matchesPorTransacao[t.id!]?.length" class="mt-3 ml-4">
              <div class="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                <svg class="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757" /></svg>
                <div class="min-w-0 flex-1">
                  <p class="text-xs font-semibold text-gray-800 truncate">{{ matchesPorTransacao[t.id!][0].descricao }}</p>
                  <p class="text-[10px] text-gray-500">{{ formatCurrency(matchesPorTransacao[t.id!][0].valor) }} • Venc: {{ formatDate(matchesPorTransacao[t.id!][0].data_vencimento) }}</p>
                </div>
                <span class="text-[10px] font-black px-2 py-0.5 rounded-full" :class="matchesPorTransacao[t.id!][0].score >= 70 ? 'bg-emerald-200 text-emerald-800' : 'bg-yellow-200 text-yellow-800'">{{ matchesPorTransacao[t.id!][0].score }}%</span>
                <button type="button" class="ml-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors" @click="conciliar(t.id!, matchesPorTransacao[t.id!][0].id)">Conciliar</button>
              </div>
              <!-- Mais opções -->
              <div v-if="matchesPorTransacao[t.id!].length > 1" class="mt-1.5 flex flex-wrap gap-1.5">
                <button
                  v-for="m in matchesPorTransacao[t.id!].slice(1, 3)" :key="m.id"
                  type="button"
                  class="px-2 py-1 rounded-lg text-[10px] font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                  @click="conciliar(t.id!, m.id)"
                >
                  {{ m.descricao.substring(0, 25) }}{{ m.descricao.length > 25 ? '...' : '' }} ({{ m.score }}%)
                </button>
              </div>
            </div>

            <!-- Sem match -->
            <div v-else class="mt-2 ml-4 flex items-center gap-2">
              <span class="text-[10px] text-gray-400">Sem correspondência encontrada</span>
              <button type="button" class="text-[10px] font-bold text-gray-500 hover:text-gray-700 underline transition-colors" @click="ignorar(t.id!)">Ignorar</button>
            </div>
          </div>
          <div v-if="transacoesPendentes.length === 0" class="p-8 text-center text-sm text-gray-400">Todas as transações foram conciliadas ou ignoradas 🎉</div>
        </template>

        <!-- TAB: CONCILIADAS -->
        <template v-if="tabAtiva === 'conciliadas'">
          <div v-for="t in transacoesConciliadas" :key="t.id" class="p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 min-w-0">
                <svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                <div class="min-w-0">
                  <p class="text-sm font-medium text-gray-700 truncate">{{ t.descricao }}</p>
                  <p class="text-[10px] text-gray-400">{{ formatDate(t.data_transacao) }}</p>
                </div>
              </div>
              <p class="text-sm font-bold text-gray-600 flex-shrink-0">{{ formatCurrency(t.valor) }}</p>
            </div>
          </div>
          <div v-if="transacoesConciliadas.length === 0" class="p-8 text-center text-sm text-gray-400">Nenhuma transação conciliada ainda</div>
        </template>

        <!-- TAB: IGNORADAS -->
        <template v-if="tabAtiva === 'ignoradas'">
          <div v-for="t in transacoesIgnoradas" :key="t.id" class="p-4">
            <div class="flex items-center justify-between">
              <div class="min-w-0">
                <p class="text-sm font-medium text-gray-500 truncate line-through">{{ t.descricao }}</p>
                <p class="text-[10px] text-gray-400">{{ formatDate(t.data_transacao) }}</p>
              </div>
              <p class="text-sm font-medium text-gray-400 flex-shrink-0">{{ formatCurrency(t.valor) }}</p>
            </div>
          </div>
          <div v-if="transacoesIgnoradas.length === 0" class="p-8 text-center text-sm text-gray-400">Nenhuma transação ignorada</div>
        </template>
      </div>
    </div>

    <!-- Estado vazio -->
    <div v-if="!loading && extratos.length === 0" class="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
      <div class="w-16 h-16 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg>
      </div>
      <p class="text-base font-bold text-gray-700">Nenhum extrato importado</p>
      <p class="text-sm text-gray-400 mt-1 max-w-sm mx-auto">Exporte o extrato do seu banco em formato OFX ou CSV e importe aqui para conciliar automaticamente com suas contas a pagar.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useConciliacao, type TransacaoExtrato, type ExtratoImportado, type ContaPagarMatch } from '~/composables/useConciliacao'

definePageMeta({ layout: 'default' })

const {
  parseOFX, parseCSV, calcularMatches,
  salvarExtrato, conciliarTransacao, ignorarTransacao,
  carregarTransacoes, carregarExtratos, carregarContasPendentes, excluirExtrato,
} = useConciliacao()

const loading = ref(false)
const importando = ref(false)
const conciliandoAuto = ref(false)
const extratos = ref<ExtratoImportado[]>([])
const extratoAtivo = ref<number | null>(null)
const transacoes = ref<TransacaoExtrato[]>([])
const contasPendentes = ref<{ id: number; descricao: string; valor: number; data_vencimento: string; status: string }[]>([])
const matchesPorTransacao = ref<Record<number, ContaPagarMatch[]>>({})
const toast = ref('')
const toastType = ref<'success' | 'error'>('success')
const tabAtiva = ref<'pendentes' | 'conciliadas' | 'ignoradas'>('pendentes')
const resultadoAuto = ref<{ conciliadas: number; restantes: number } | null>(null)

const transacoesPendentes = computed(() => transacoes.value.filter(t => t.status_conciliacao === 'pendente'))
const transacoesConciliadas = computed(() => transacoes.value.filter(t => t.status_conciliacao === 'conciliada'))
const transacoesIgnoradas = computed(() => transacoes.value.filter(t => t.status_conciliacao === 'ignorada'))
const progressoPorcento = computed(() => {
  if (transacoes.value.length === 0) return 0
  return Math.round(((transacoesConciliadas.value.length + transacoesIgnoradas.value.length) / transacoes.value.length) * 100)
})

function showToast(msg: string, type: 'success' | 'error' = 'success') {
  toast.value = msg; toastType.value = type
  setTimeout(() => { toast.value = '' }, 4000)
}

async function handleFileUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  importando.value = true
  try {
    const content = await file.text()
    const isOFX = file.name.toLowerCase().endsWith('.ofx')
    let transacoesParseadas: TransacaoExtrato[]
    let banco: string | undefined
    let conta: string | undefined

    if (isOFX) {
      const parsed = parseOFX(content)
      transacoesParseadas = parsed.transacoes
      banco = parsed.banco; conta = parsed.conta
    } else {
      transacoesParseadas = parseCSV(content).transacoes
    }

    if (transacoesParseadas.length === 0) { showToast('Nenhuma transação encontrada no arquivo.', 'error'); return }

    const result = await salvarExtrato(file.name, transacoesParseadas, banco, conta)
    if (!result.success) { showToast(result.error || 'Erro ao salvar', 'error'); return }

    showToast(`${transacoesParseadas.length} transações importadas!`)
    await carregarDados()
    if (result.extratoId) await selecionarExtrato(result.extratoId)
  } catch (err: any) {
    showToast(`Erro: ${err?.message || 'Falha ao processar'}`, 'error')
  } finally {
    importando.value = false
    ;(e.target as HTMLInputElement).value = ''
  }
}

async function selecionarExtrato(id: number) {
  extratoAtivo.value = id
  loading.value = true
  resultadoAuto.value = null
  try {
    transacoes.value = await carregarTransacoes(id)
    contasPendentes.value = await carregarContasPendentes()
    calcularTodosMatches()
  } finally { loading.value = false }
}

function calcularTodosMatches() {
  const matches: Record<number, ContaPagarMatch[]> = {}
  for (const t of transacoesPendentes.value) {
    if (!t.id) continue
    // Débitos conciliam com contas a pagar, créditos com contas a receber
    const tipoFiltro = t.tipo === 'debito' ? 'pagar' : 'receber'
    const contasFiltradas = contasPendentes.value.filter((c: any) => (c.tipo || 'pagar') === tipoFiltro)
    matches[t.id] = calcularMatches(t, contasFiltradas)
  }
  matchesPorTransacao.value = matches
}

// ─── Conciliação Automática (matches >= 70%) ──────────────────────────────────
async function conciliarAutomatico() {
  conciliandoAuto.value = true
  resultadoAuto.value = null
  let conciliadas = 0
  const contasJaConciliadas = new Set<number>()

  try {
    // Recalcular matches antes de conciliar
    calcularTodosMatches()

    for (const t of [...transacoesPendentes.value]) {
      if (!t.id) continue
      const matches = matchesPorTransacao.value[t.id]
      if (!matches?.length) continue

      // Encontrar o melhor match que não foi conciliado nesse batch
      const melhor = matches.find(m => m.score >= 70 && !contasJaConciliadas.has(m.id))
      if (!melhor) continue

      const result = await conciliarTransacao(t.id, melhor.id)
      if (result.success) {
        t.status_conciliacao = 'conciliada'
        t.conta_pagar_id = melhor.id
        contasJaConciliadas.add(melhor.id)
        contasPendentes.value = contasPendentes.value.filter(c => c.id !== melhor.id)
        delete matchesPorTransacao.value[t.id]
        conciliadas++
      }
    }

    // Recalcular matches restantes
    calcularTodosMatches()
    resultadoAuto.value = { conciliadas, restantes: transacoesPendentes.value.length }

    if (conciliadas > 0) showToast(`${conciliadas} transações conciliadas automaticamente!`)
    else showToast('Nenhum match com confiança suficiente (>70%) encontrado.', 'error')
  } finally {
    conciliandoAuto.value = false
  }
}

async function conciliar(transacaoId: number, contaId: number) {
  const result = await conciliarTransacao(transacaoId, contaId)
  if (result.success) {
    const t = transacoes.value.find(x => x.id === transacaoId)
    if (t) { t.status_conciliacao = 'conciliada'; t.conta_pagar_id = contaId }
    contasPendentes.value = contasPendentes.value.filter(c => c.id !== contaId)
    delete matchesPorTransacao.value[transacaoId]
    showToast('Conciliada!')
  } else {
    showToast(result.error || 'Erro', 'error')
  }
}

async function ignorar(transacaoId: number) {
  const result = await ignorarTransacao(transacaoId)
  if (result.success) {
    const t = transacoes.value.find(x => x.id === transacaoId)
    if (t) t.status_conciliacao = 'ignorada'
    delete matchesPorTransacao.value[transacaoId]
  }
}

async function excluirExtratoAtivo() {
  if (!extratoAtivo.value) return
  if (!confirm('Excluir este extrato e todas as transações?')) return
  const result = await excluirExtrato(extratoAtivo.value)
  if (result.success) {
    extratos.value = extratos.value.filter(e => e.id !== extratoAtivo.value)
    extratoAtivo.value = null
    transacoes.value = []
    matchesPorTransacao.value = {}
    showToast('Extrato excluído')
    if (extratos.value.length > 0) await selecionarExtrato(extratos.value[0].id!)
  } else { showToast(result.error || 'Erro', 'error') }
}

function formatCurrency(val: number): string {
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
function formatDate(d: string): string {
  if (!d) return '—'
  return new Date(d + 'T12:00:00').toLocaleDateString('pt-BR')
}

async function carregarDados() {
  loading.value = true
  try {
    extratos.value = await carregarExtratos()
    if (extratos.value.length > 0 && !extratoAtivo.value) {
      await selecionarExtrato(extratos.value[0].id!)
    }
  } finally { loading.value = false }
}

onMounted(() => { carregarDados() })
</script>
