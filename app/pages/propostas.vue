<template>
  <div class="min-h-full bg-gray-50/60 p-3 sm:p-8">

    <!-- ═══════════════════════════════ CABEÇALHO ═══════════════════════════════ -->
    <div class="page-header relative rounded-3xl overflow-hidden mb-8 shadow-xl">
      <div class="page-header-overlay absolute inset-0" />
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />
      <div class="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/[0.03] pointer-events-none" />
      <div class="absolute -bottom-20 left-1/4 w-96 h-96 rounded-full bg-white/[0.02] pointer-events-none" />

      <div class="relative px-4 sm:px-8 pt-5 sm:pt-7 pb-5 sm:pb-7">
        <div class="flex flex-wrap items-start justify-between gap-3 sm:gap-6">
          <div class="flex items-center gap-3 sm:gap-5">
            <div class="flex items-center justify-center w-10 sm:w-14 h-10 sm:h-14 rounded-2xl bg-white/[0.12] backdrop-blur-sm border border-white/20 shadow-lg">
              <svg class="w-5 sm:w-7 h-5 sm:h-7 text-white" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-semibold text-white/80 uppercase tracking-widest">Comercial</span>
                <span class="w-1 h-1 rounded-full bg-white/40" />
                <span class="text-xs text-white/50 hidden sm:inline">AutoFlow</span>
              </div>
              <h1 class="text-xl sm:text-3xl font-bold text-white tracking-tight leading-none">Propostas</h1>
              <p class="text-sm text-gray-300/80 mt-1.5">
                {{ loading ? 'Carregando...' : `${propostasFiltradas.length} de ${propostas.length} proposta(s) exibida(s)` }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <button
              type="button"
              class="inline-flex items-center gap-2 text-sm font-semibold px-3 sm:px-5 py-2.5 rounded-xl transition-all duration-200"
              :class="filtroAberto
                ? 'bg-amber-500 text-gray-950 shadow-lg scale-[1.02]'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/15 backdrop-blur-sm'"
              @click="filtroAberto = !filtroAberto"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/></svg>
              <span class="hidden sm:inline">Filtros</span>
              <span v-if="filtrosAtivos > 0" class="inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-gray-950 text-amber-400 text-xs font-black">{{ filtrosAtivos }}</span>
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-2 text-sm font-bold px-3 sm:px-5 py-2.5 rounded-xl bg-amber-500 text-gray-950 hover:bg-amber-400 shadow-lg shadow-amber-900/30 transition-all duration-200 hover:scale-[1.02]"
              @click="abrirAdicionar"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
              <span class="hidden sm:inline">Nova Proposta</span>
            </button>
          </div>
        </div>

        <div class="h-px bg-white/[0.08] my-4 sm:my-6" />

        <!-- Stats -->
        <div v-if="!loading" class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="flex flex-col gap-1 bg-white/[0.07] rounded-2xl px-5 py-4 border border-white/[0.08]">
            <span class="text-xs font-semibold text-gray-400 uppercase tracking-widest">Total</span>
            <span class="text-xl font-black text-white">{{ propostas.length }}</span>
            <span class="text-xs text-gray-500">proposta(s)</span>
          </div>
          <div class="flex flex-col gap-1 bg-amber-400/10 rounded-2xl px-5 py-4 border border-amber-400/20">
            <div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-amber-400" /><span class="text-xs font-semibold text-amber-300 uppercase tracking-widest">Em Negociação</span></div>
            <span class="text-xl font-black text-amber-200">{{ countStatus('negociacao') }}</span>
          </div>
          <div class="flex flex-col gap-1 bg-green-400/10 rounded-2xl px-5 py-4 border border-green-400/20">
            <div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-green-400" /><span class="text-xs font-semibold text-green-300 uppercase tracking-widest">Aprovadas</span></div>
            <span class="text-xl font-black text-green-200">{{ countStatus('aprovada') }}</span>
          </div>
          <div class="flex flex-col gap-1 bg-white/[0.07] rounded-2xl px-5 py-4 border border-white/[0.08]">
            <span class="text-xs font-semibold text-gray-400 uppercase tracking-widest">Valor Total</span>
            <span class="text-xl font-black text-white truncate">{{ formatCurrency(valorTotal) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════ FILTROS ═══════════════════════════════ -->
    <Transition name="slide-fade">
      <div v-show="filtroAberto" class="bg-white rounded-3xl border border-gray-100 shadow-md mb-6 overflow-hidden">
        <div class="flex items-center justify-between px-7 py-4 border-b border-gray-100 bg-gray-50/70">
          <span class="text-sm font-bold text-gray-700">Filtros</span>
          <button v-if="filtrosAtivos > 0" type="button" class="text-xs font-semibold text-amber-600 hover:underline" @click="limparFiltros">Limpar</button>
        </div>
        <div class="p-7 grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div class="sm:col-span-2 flex flex-col gap-1.5">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Busca</label>
            <div class="relative">
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="m21 21-4.35-4.35"/></svg>
              <input v-model="filtros.busca" type="text" placeholder="Cliente, veículo, vendedor..." class="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2.5 text-sm bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Status</label>
            <div class="flex gap-2 flex-wrap">
              <button
                v-for="op in statusOpcoes"
                :key="op.value"
                type="button"
                class="flex-1 text-xs font-bold py-2 rounded-xl border transition-colors"
                :class="filtros.status === op.value ? 'bg-amber-500 border-amber-500 text-gray-950' : 'border-gray-200 text-gray-500 hover:border-amber-400 bg-white'"
                @click="filtros.status = op.value"
              >{{ op.label }}</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ═══════════════════════════════ LOADING / ERRO ═══════════════════════════════ -->
    <div v-if="loading" class="flex flex-col items-center justify-center gap-4 py-32">
      <span class="inline-block w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
    <div v-else-if="error" class="text-sm text-red-700 bg-red-50 border border-red-200 rounded-2xl px-6 py-4">{{ error }}</div>

    <!-- ═══════════════════════════════ TABELA ═══════════════════════════════ -->
    <div v-else class="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="text-left px-6 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest w-12">#</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Cliente</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Veículo</th>
              <th class="text-right px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Valor</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Status</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Vendedor</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Data</th>
              <th class="px-6 py-4 text-right text-xs font-extrabold text-gray-400 uppercase tracking-widest">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-if="propostasFiltradas.length === 0">
              <td colspan="8" class="text-center py-20 text-gray-400">Nenhuma proposta encontrada</td>
            </tr>
            <tr v-for="p in propostasFiltradas" :key="p.id" class="hover:bg-amber-50/20 transition-colors group">
              <td class="px-6 py-4">
                <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-black text-xs">{{ p.id }}</span>
              </td>
              <td class="px-5 py-4 font-semibold text-gray-800">{{ p.cliente_nome ?? '—' }}</td>
              <td class="px-5 py-4 text-gray-600">{{ p.veiculo_descricao ?? '—' }}</td>
              <td class="px-5 py-4 text-right font-black text-gray-900">{{ formatCurrency(p.valor) }}</td>
              <td class="px-5 py-4">
                <span :class="['inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full', statusBadgeClass(p.status)]">
                  <span :class="['w-1.5 h-1.5 rounded-full', statusDotClass(p.status)]" />
                  {{ statusLabel(p.status) }}
                </span>
              </td>
              <td class="px-5 py-4 text-gray-500">{{ p.vendedor ?? '—' }}</td>
              <td class="px-5 py-4 text-xs text-gray-400">{{ formatDate(p.data_proposta) }}</td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-1">
                  <button type="button" class="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-amber-500 hover:bg-amber-100 transition-colors" title="Editar" @click="editProposta(p)">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/></svg>
                  </button>
                  <button v-if="isAdmin" type="button" class="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-red-400 hover:bg-red-50 transition-colors" title="Excluir" @click="confirmarExclusao(p)">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a1 1 0 01-1-1V5a1 1 0 011-1h8a1 1 0 011 1v1a1 1 0 01-1 1H9z"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ═══════════════════════════════ MODAL ADD/EDIT ═══════════════════════════════ -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="editando !== null || adicionando"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md px-4"
          @click.self="fecharModal"
        >
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div class="flex items-center justify-between px-8 py-6 border-b border-white/10" :style="{ background: 'var(--color-primary-bg, linear-gradient(135deg, #111827, #1f2937))' }">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>
                </div>
                <h2 class="text-lg font-bold text-white">{{ adicionando ? 'Nova Proposta' : 'Editar Proposta' }}</h2>
              </div>
              <button type="button" class="w-8 h-8 flex items-center justify-center rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors" @click="fecharModal">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <form class="flex flex-col gap-5 px-8 py-7 overflow-y-auto max-h-[70vh]" @submit.prevent="adicionando ? salvarAdicao() : salvarEdicao()">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AppInput v-model="form.cliente_nome" label="Cliente *" placeholder="Nome do cliente" :error="formErrors.cliente_nome" />
                <AppInput v-model="form.veiculo_descricao" label="Veículo" placeholder="Ex: Corolla 2023 Prata" />
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AppInput v-model="form.valor" label="Valor (R$) *" type="number" placeholder="0,00" :error="formErrors.valor" />
                <AppInput v-model="form.vendedor" label="Vendedor" placeholder="Nome do vendedor" />
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-semibold text-gray-700">Status</label>
                  <select v-model="form.status" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#6b7280)]">
                    <option value="aberta">Aberta</option>
                    <option value="negociacao">Em Negociação</option>
                    <option value="aprovada">Aprovada</option>
                    <option value="recusada">Recusada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-semibold text-gray-700">Data</label>
                  <input v-model="form.data_proposta" type="date" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#6b7280)]" />
                </div>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-semibold text-gray-700">Observações</label>
                <textarea v-model="form.observacao" rows="3" placeholder="Condições, entrada, financiamento..." class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm placeholder:text-gray-400 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#6b7280)] resize-none" />
              </div>

              <p v-if="modalError" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{{ modalError }}</p>

              <div class="flex gap-3 pt-1">
                <button type="button" class="flex-1 py-3 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 text-sm font-semibold" @click="fecharModal">Cancelar</button>
                <AppButton variant="primary" size="md" type="submit" :loading="saving" class="flex-1">
                  {{ adicionando ? 'Criar Proposta' : 'Salvar' }}
                </AppButton>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ═══════════════════════════════ MODAL EXCLUIR ═══════════════════════════════ -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="excluindo" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md px-4" @click.self="excluindo = null">
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div class="px-8 pt-8 pb-6 text-center">
              <div class="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-5">
                <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a1 1 0 01-1-1V5a1 1 0 011-1h8a1 1 0 011 1v1a1 1 0 01-1 1H9z"/></svg>
              </div>
              <h2 class="text-xl font-bold text-gray-800">Excluir proposta?</h2>
              <p class="text-sm text-gray-500 mt-2">Proposta <strong>#{{ excluindo.id }}</strong> — {{ excluindo.cliente_nome }}<br /><span class="text-red-500 text-xs font-semibold">Essa ação não pode ser desfeita.</span></p>
            </div>
            <p v-if="deleteError" class="text-sm text-red-600 bg-red-50 border-t border-b border-red-200 px-8 py-3 text-center">{{ deleteError }}</p>
            <div class="flex gap-3 px-8 pb-8 pt-4">
              <button type="button" class="flex-1 py-3 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 text-sm font-semibold" @click="excluindo = null">Cancelar</button>
              <button type="button" class="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm disabled:opacity-60" :disabled="deleting" @click="executarExclusao">
                {{ deleting ? 'Excluindo...' : 'Excluir' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { createSupabaseClient } from '~/lib/supabase'
import { useAdmin } from '~/composables/useAdmin'
import { useEmpresa } from '~/composables/useEmpresa'
import AppInput from '~/components/AppInput.vue'
import AppButton from '~/components/AppButton.vue'

interface Proposta {
  id: number
  cliente_nome: string | null
  veiculo_descricao: string | null
  valor: number | null
  status: string | null
  vendedor: string | null
  data_proposta: string | null
  observacao: string | null
  empresa_id: number
  created_at: string | null
}

const supabase = createSupabaseClient()
const { empresaId, loadEmpresa } = useEmpresa()
const { isAdmin } = useAdmin()

const propostas  = ref<Proposta[]>([])
const loading    = ref(true)
const error      = ref<string | null>(null)

const editando   = ref<Proposta | null>(null)
const adicionando = ref(false)
const saving     = ref(false)
const modalError = ref<string | null>(null)

const excluindo  = ref<Proposta | null>(null)
const deleting   = ref(false)
const deleteError = ref<string | null>(null)

const filtroAberto = ref(false)
const filtros = reactive({ busca: '', status: '' })

const form = reactive({
  cliente_nome: '', veiculo_descricao: '', valor: '',
  status: 'aberta', vendedor: '', data_proposta: '', observacao: '',
})
const formErrors = reactive({ cliente_nome: '', valor: '' })

const statusOpcoes = [
  { label: 'Todas', value: '' },
  { label: 'Aberta', value: 'aberta' },
  { label: 'Negociação', value: 'negociacao' },
  { label: 'Aprovada', value: 'aprovada' },
  { label: 'Recusada', value: 'recusada' },
]

// ── Stats ─────────────────────────────────────────────────────────────────────
const countStatus = (s: string) => propostas.value.filter(p => p.status === s).length
const valorTotal  = computed(() => propostas.value.reduce((s, p) => s + (p.valor ?? 0), 0))

// ── Filtros ───────────────────────────────────────────────────────────────────
const filtrosAtivos = computed(() => [filtros.busca, filtros.status].filter(Boolean).length)
const propostasFiltradas = computed(() =>
  propostas.value.filter(p => {
    if (filtros.status && p.status !== filtros.status) return false
    if (filtros.busca.trim()) {
      const q = filtros.busca.toLowerCase()
      return (
        (p.cliente_nome ?? '').toLowerCase().includes(q) ||
        (p.veiculo_descricao ?? '').toLowerCase().includes(q) ||
        (p.vendedor ?? '').toLowerCase().includes(q)
      )
    }
    return true
  })
)
function limparFiltros() { filtros.busca = ''; filtros.status = '' }

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatCurrency(val: number | null | undefined) {
  if (val == null) return '—'
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('pt-BR')
}
function statusLabel(s: string | null) {
  const map: Record<string, string> = { aberta: 'Aberta', negociacao: 'Negociação', aprovada: 'Aprovada', recusada: 'Recusada', cancelada: 'Cancelada' }
  return map[s ?? ''] ?? s ?? '—'
}
function statusBadgeClass(s: string | null) {
  if (s === 'aprovada')   return 'bg-green-100 text-green-700'
  if (s === 'negociacao') return 'bg-amber-100 text-amber-700'
  if (s === 'aberta')     return 'bg-blue-100 text-blue-700'
  if (s === 'recusada')   return 'bg-red-100 text-red-700'
  return 'bg-gray-100 text-gray-500'
}
function statusDotClass(s: string | null) {
  if (s === 'aprovada')   return 'bg-green-500'
  if (s === 'negociacao') return 'bg-amber-500'
  if (s === 'aberta')     return 'bg-blue-500'
  if (s === 'recusada')   return 'bg-red-500'
  return 'bg-gray-400'
}

// ── CRUD ──────────────────────────────────────────────────────────────────────
onMounted(async () => { await loadEmpresa(); await fetchPropostas() })

async function fetchPropostas() {
  loading.value = true
  const { data, error: fetchError } = await supabase
    .from('propostas')
    .select('*')
    .eq('empresa_id', empresaId.value!)
    .order('created_at', { ascending: false })
  loading.value = false
  if (fetchError) { error.value = fetchError.message; return }
  propostas.value = (data ?? []) as Proposta[]
}

function buildPayload() {
  return {
    cliente_nome:      form.cliente_nome.trim() || null,
    veiculo_descricao: form.veiculo_descricao.trim() || null,
    valor:             form.valor ? Number(form.valor) : null,
    status:            form.status,
    vendedor:          form.vendedor.trim() || null,
    data_proposta:     form.data_proposta || null,
    observacao:        form.observacao.trim() || null,
    empresa_id:        empresaId.value!,
  }
}

function validateForm(): boolean {
  formErrors.cliente_nome = ''; formErrors.valor = ''
  let ok = true
  if (!form.cliente_nome.trim()) { formErrors.cliente_nome = 'Obrigatório.'; ok = false }
  if (!form.valor || Number(form.valor) < 0) { formErrors.valor = 'Informe o valor.'; ok = false }
  return ok
}

function abrirAdicionar() {
  adicionando.value = true; editando.value = null; modalError.value = null
  const today = new Date().toISOString().slice(0, 10)
  Object.assign(form, { cliente_nome: '', veiculo_descricao: '', valor: '', status: 'aberta', vendedor: '', data_proposta: today, observacao: '' })
  Object.assign(formErrors, { cliente_nome: '', valor: '' })
}
function fecharModal() { editando.value = null; adicionando.value = false }

function editProposta(p: Proposta) {
  editando.value = p; modalError.value = null
  form.cliente_nome      = p.cliente_nome ?? ''
  form.veiculo_descricao = p.veiculo_descricao ?? ''
  form.valor             = p.valor != null ? String(p.valor) : ''
  form.status            = p.status ?? 'aberta'
  form.vendedor          = p.vendedor ?? ''
  form.data_proposta     = p.data_proposta?.slice(0, 10) ?? ''
  form.observacao        = p.observacao ?? ''
}

async function salvarEdicao() {
  if (!editando.value || !validateForm()) return
  saving.value = true; modalError.value = null
  const { error: updateError } = await supabase.from('propostas').update(buildPayload()).eq('id', editando.value.id)
  saving.value = false
  if (updateError) { modalError.value = updateError.message; return }
  editando.value = null; await fetchPropostas()
}

async function salvarAdicao() {
  if (!validateForm()) return
  saving.value = true; modalError.value = null
  const { error: insertError } = await supabase.from('propostas').insert(buildPayload())
  saving.value = false
  if (insertError) { modalError.value = insertError.message; return }
  adicionando.value = false; await fetchPropostas()
}

function confirmarExclusao(p: Proposta) { excluindo.value = p; deleteError.value = null }

async function executarExclusao() {
  if (!excluindo.value) return
  deleting.value = true; deleteError.value = null
  const { error: deleteErr } = await supabase.from('propostas').delete().eq('id', excluindo.value.id)
  deleting.value = false
  if (deleteErr) { deleteError.value = deleteErr.message; return }
  excluindo.value = null; await fetchPropostas()
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-fade-enter-active { transition: all 0.2s ease; }
.slide-fade-leave-active { transition: all 0.15s ease; }
.slide-fade-enter-from, .slide-fade-leave-to { transform: translateY(-8px); opacity: 0; }
</style>
