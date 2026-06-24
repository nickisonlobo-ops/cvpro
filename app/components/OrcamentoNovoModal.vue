<template>
  <Teleport to="body">
    <transition name="modal">
      <div v-if="show" class="fixed inset-0 z-50 flex flex-col" @click.self="fechar">
        <!-- Backdrop com blur -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="fechar" />

        <!-- Modal container -->
        <div class="relative z-10 flex flex-col w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-2xl sm:mx-auto sm:my-auto sm:rounded-2xl bg-white overflow-hidden shadow-2xl">

          <!-- Sticky Header -->
          <div class="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-3.5 border-b" :style="{ background: 'var(--color-primary-bg, linear-gradient(135deg, #1e40af, #4f46e5))', borderColor: 'var(--color-primary-border, rgba(255,255,255,0.1))' }">
            <div>
              <h2 class="text-base sm:text-lg font-bold" style="color: var(--color-primary-text, #ffffff)">{{ modalTitle }}</h2>
              <p class="text-[11px] mt-0.5" style="color: var(--color-primary-text, #ffffff); opacity: 0.7">{{ isEditMode ? 'Editando orçamento existente' : 'Novo orçamento multi-itens' }}</p>
            </div>
            <button type="button" class="w-8 h-8 flex items-center justify-center rounded-full transition-colors" style="color: var(--color-primary-text, #ffffff); opacity: 0.7" @click="fechar">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <!-- Scrollable Content -->
          <div class="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-5">

            <!-- Validation Errors -->
            <div v-if="Object.keys(validationErrors).length > 0" class="flex items-start gap-3 p-3 rounded-xl bg-red-50 border border-red-100">
              <svg class="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
              <div class="text-xs text-red-600 space-y-0.5">
                <p v-for="(msg, key) in validationErrors" :key="key">{{ msg }}</p>
              </div>
            </div>

        <!-- Form -->
            <form id="orcamento-form" @submit.prevent="salvarRascunho">

              <!-- ═══ SEÇÃO: CLIENTE ═══ -->
              <div class="space-y-2 mb-5">
                <div class="flex items-center gap-2">
                  <div class="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center">
                    <svg class="w-3 h-3 text-indigo-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0"/></svg>
                  </div>
                  <span class="text-xs font-bold text-gray-700 uppercase tracking-wide">Cliente</span>
                </div>
                <div class="relative">
                  <input
                    v-model="clienteSearch"
                    type="text"
                    placeholder="Buscar por nome..."
                    class="w-full rounded-xl border px-4 py-2.5 text-sm text-gray-800 bg-gray-50/80 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
                    :class="validationErrors.cliente_id ? 'border-red-300' : 'border-gray-200'"
                    @focus="showClienteDropdown = true"
                    @input="showClienteDropdown = true"
                  />
                  <div v-if="form.cliente_id" class="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
                  </div>
                  <div v-if="showClienteDropdown && clientesFiltrados.length > 0" class="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-44 overflow-y-auto">
                    <button v-for="cli in clientesFiltrados" :key="cli.id" type="button" class="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors" @click="selecionarCliente(cli)">{{ cli.nome }}</button>
                  </div>
                </div>
              </div>

              <!-- ═══ SEÇÃO: NOME DO TRABALHO ═══ -->
              <div class="space-y-2 mb-5">
                <div class="flex items-center gap-2">
                  <div class="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
                    <svg class="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" /></svg>
                  </div>
                  <span class="text-xs font-bold text-gray-700 uppercase tracking-wide">Nome do Trabalho</span>
                </div>
                <input
                  v-model="form.nome_trabalho"
                  type="text"
                  placeholder="Ex: Fachada Loja Centro, Frota ABC Transportes..."
                  class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-800 bg-gray-50/80 placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
                />
              </div>

              <!-- ═══ SEÇÃO: CONDIÇÕES ═══ -->
              <div class="space-y-2 mb-5">
                <div class="flex items-center gap-2">
                  <div class="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                    <svg class="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <span class="text-xs font-bold text-gray-700 uppercase tracking-wide">Condições</span>
                </div>
                <div class="grid grid-cols-3 gap-2">
                  <div class="flex flex-col gap-1">
                    <label class="text-[10px] font-bold text-gray-400">Validade *</label>
                    <div class="relative">
                      <input v-model.number="form.validade_dias" type="number" min="1" max="365" placeholder="30" class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all" :class="validationErrors.validade_dias ? 'border-red-300' : ''" />
                      <span class="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-gray-400">dias</span>
                    </div>
                  </div>
                  <div class="flex flex-col gap-1">
                    <label class="text-[10px] font-bold text-gray-400">Data de Entrega</label>
                    <div class="relative">
                      <input v-model="form.data_entrega" type="date" class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all" />
                    </div>
                  </div>
                  <div class="flex flex-col gap-1">
                    <label class="text-[10px] font-bold text-gray-400">M. de obra</label>
                    <div class="relative">
                      <span class="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">R$</span>
                      <input v-model.number="form.valor_mao_obra" type="number" step="0.01" min="0" placeholder="0" class="w-full rounded-lg border border-gray-200 pl-7 pr-2 py-2 text-sm text-gray-800 bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- ═══ SEÇÃO: ENDEREÇO DE INSTALAÇÃO ═══ -->
              <div class="space-y-2 mb-5">
                <div class="flex items-center gap-2">
                  <div class="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center">
                    <svg class="w-3 h-3 text-orange-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                  </div>
                  <span class="text-xs font-bold text-gray-700 uppercase tracking-wide">Local de Instalação</span>
                </div>
                <input
                  v-model="form.endereco_instalacao"
                  type="text"
                  placeholder="Endereço do local de instalação..."
                  class="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 bg-gray-50/80 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
                />
              </div>

              <!-- ═══ SEÇÃO: ITENS ═══ -->
              <div class="space-y-3 mb-5">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center">
                      <svg class="w-3 h-3 text-violet-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                    </div>
                    <span class="text-xs font-bold text-gray-700 uppercase tracking-wide">Itens</span>
                    <span class="text-[10px] text-gray-400">({{ form.itens.length }})</span>
                  </div>
                  <button type="button" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-[11px] font-bold active:scale-95 transition-all shadow-sm" :style="{ background: 'var(--color-btn, #4f46e5)' }" @click="adicionarItem">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
                    Adicionar
                  </button>
                </div>

                <div class="space-y-3">
                  <OrcamentoItemRow
                    v-for="(item, idx) in form.itens"
                    :key="idx"
                    :item="item"
                    :index="idx"
                    :empresa-id="empresaId"
                    :orcamento-id="isEditMode && orcamentoParaEditar ? orcamentoParaEditar.id : null"
                    @update:item="onItemUpdate(idx, $event)"
                    @remove="removerItem"
                  />
                </div>

                <div v-if="form.itens.length === 0" class="flex flex-col items-center gap-2 py-8 border border-dashed border-gray-200 rounded-xl">
                  <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.25" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                  <p class="text-xs text-gray-400">Toque em <span class="font-bold text-indigo-500">Adicionar</span> para incluir itens</p>
                </div>
              </div>

              <!-- ═══ SEÇÃO: DESCONTO ═══ -->
              <div class="space-y-2 mb-5">
                <div class="flex items-center gap-2">
                  <div class="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <svg class="w-3 h-3 text-green-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185z"/></svg>
                  </div>
                  <span class="text-xs font-bold text-gray-700 uppercase tracking-wide">Desconto</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="flex rounded-lg border overflow-hidden" style="border-color: var(--color-card-border, rgba(0,0,0,0.1))">
                    <button type="button" class="px-3 py-1.5 text-[11px] font-bold transition-all" :style="descontoTipo === 'percentual' ? { background: 'var(--color-primary, #4f46e5)', color: '#ffffff' } : { background: 'transparent', color: 'var(--color-card-texto, #6b7280)' }" @click="descontoTipo = 'percentual'">%</button>
                    <button type="button" class="px-3 py-1.5 text-[11px] font-bold transition-all" :style="descontoTipo === 'valor' ? { background: 'var(--color-primary, #4f46e5)', color: '#ffffff' } : { background: 'transparent', color: 'var(--color-card-texto, #6b7280)' }" @click="descontoTipo = 'valor'">R$</button>
                  </div>
                  <input v-model.number="descontoManualInput" type="number" step="0.01" min="0" :max="descontoTipo === 'percentual' ? 99.99 : 999999" placeholder="0" class="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all" />
                </div>
              </div>

              <!-- ═══ RESUMO ═══ -->
              <div class="rounded-xl p-4" :style="{ background: 'var(--color-card, #eef2ff)', border: '1px solid var(--color-card-border, rgba(99,102,241,0.2))' }">
                <OrcamentoResumoValores
                  :subtotal-itens="subtotalItens"
                  :desconto-volume-percentual="descontoVolumePercentual"
                  :desconto-manual-percentual="descontoManualPercentualCalc"
                  :desconto-manual-valor="descontoManualValorCalc"
                  :mao-obra="form.valor_mao_obra ?? 0"
                />
              </div>
            </form>
          </div>

          <!-- Sticky Footer -->
          <div class="flex-shrink-0 flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-t" :style="{ background: 'var(--color-primary-bg, linear-gradient(135deg, #1e40af, #4f46e5))', borderColor: 'var(--color-primary-border, rgba(255,255,255,0.1))' }">
            <button type="button" class="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all" style="color: var(--color-primary-text, #ffffff); opacity: 0.7" :disabled="salvando" @click="fechar">Cancelar</button>
            <button type="submit" form="orcamento-form" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold active:scale-[0.97] shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed" :style="{ background: 'var(--color-btn, #ffffff)', color: 'var(--color-btn-text, #1e40af)' }" :disabled="salvando">
              <span v-if="salvando" class="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
              {{ actionButtonLabel }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { createSupabaseClient } from '~/lib/supabase'
import type { ItemOrcamento, ItemOrcamentoCompleto, OrcamentoCompleto } from '~/composables/useOrcamentos'
import OrcamentoItemRow from '~/components/OrcamentoItemRow.vue'
import OrcamentoResumoValores from '~/components/OrcamentoResumoValores.vue'

// ─── Types ───────────────────────────────────────────────────────────────────
interface Cliente {
  id: number
  nome: string
}

interface Material {
  id: number
  nome: string
  preco_m2?: number
}

// ─── Props & Emits ───────────────────────────────────────────────────────────
const props = withDefaults(defineProps<{
  show: boolean
  clientes: Cliente[]
  materiais: Material[]
  mode?: 'create' | 'edit'
  orcamentoParaEditar?: OrcamentoCompleto
}>(), {
  mode: 'create',
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'created', data: any): void
  (e: 'updated', data: any): void
}>()

// ─── Composables ─────────────────────────────────────────────────────────────
const supabase = createSupabaseClient()
const { empresaId } = useEmpresa()
const {
  validarOrcamento,
  calcularTotalItens,
  calcularQuantidadeTotal,
  calcularValorFinal,
  selecionarDescontoVolume,
  gerarNumeroOrcamento,
  calcularDiffItens,
  atualizarOrcamento,
} = useOrcamentos()

// ─── State ───────────────────────────────────────────────────────────────────
const salvando = ref(false)
const validationErrors = ref<Record<string, string>>({})
const showClienteDropdown = ref(false)
const clienteSearch = ref('')
const descontoTipo = ref<'percentual' | 'valor'>('percentual')
const descontoManualInput = ref<number>(0)
const regrasDesconto = ref<{ quantidade_minima: number; desconto_percentual: number }[]>([])

// ─── Edit Mode State ─────────────────────────────────────────────────────────
const originalItens = ref<ItemOrcamentoCompleto[]>([])
// ─── Form Data ───────────────────────────────────────────────────────────────
const form = ref<{
  cliente_id: number | null
  validade_dias: number | null
  prazo_estimado_dias: number | null
  data_entrega: string | null
  valor_mao_obra: number
  itens: ItemOrcamento[]
  endereco_instalacao: string
  nome_trabalho: string
}>({
  cliente_id: null,
  validade_dias: 30,
  prazo_estimado_dias: null,
  data_entrega: null,
  valor_mao_obra: 0,
  itens: [],
  endereco_instalacao: '',
  nome_trabalho: '',
})

// ─── Computed ────────────────────────────────────────────────────────────────
const isEditMode = computed(() => props.mode === 'edit')

const modalTitle = computed(() => {
  if (isEditMode.value && props.orcamentoParaEditar) {
    return `Editar Orçamento ${props.orcamentoParaEditar.numero_orcamento}`
  }
  return 'Novo Orçamento'
})

const actionButtonLabel = computed(() => {
  if (salvando.value) return 'Salvando...'
  return isEditMode.value ? 'Salvar Alterações' : 'Salvar Rascunho'
})

const clienteSelecionadoNome = computed<string>(() => {
  if (!form.value.cliente_id) return ''
  const cli = props.clientes.find(c => c.id === form.value.cliente_id)
  return cli?.nome ?? ''
})

const clientesFiltrados = computed<Cliente[]>(() => {
  if (!clienteSearch.value.trim()) return props.clientes.slice(0, 20)
  const termo = clienteSearch.value.toLowerCase()
  return props.clientes.filter(c => c.nome.toLowerCase().includes(termo)).slice(0, 20)
})

const subtotalItens = computed<number>(() => {
  return calcularTotalItens(form.value.itens)
})

const quantidadeTotal = computed<number>(() => {
  return calcularQuantidadeTotal(form.value.itens)
})

const descontoVolumePercentual = computed<number>(() => {
  if (regrasDesconto.value.length === 0 || quantidadeTotal.value < 1) return 0
  const regra = selecionarDescontoVolume(regrasDesconto.value, quantidadeTotal.value)
  return regra?.desconto_percentual ?? 0
})

const descontoManualPercentualCalc = computed<number>(() => {
  return descontoTipo.value === 'percentual' ? (descontoManualInput.value ?? 0) : 0
})

const descontoManualValorCalc = computed<number>(() => {
  return descontoTipo.value === 'valor' ? (descontoManualInput.value ?? 0) : 0
})

// ─── Watchers ────────────────────────────────────────────────────────────────
watch(() => props.show, async (newVal) => {
  if (newVal) {
    resetForm()
    await fetchRegrasDesconto()

    // Pre-fill form for edit mode
    if (isEditMode.value && props.orcamentoParaEditar) {
      preencherFormEdicao(props.orcamentoParaEditar)
    }
  }
})

// Close dropdown on click outside
if (typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.relative')) {
      showClienteDropdown.value = false
    }
  })
}

// ─── Methods ─────────────────────────────────────────────────────────────────
function selecionarCliente(cliente: Cliente) {
  form.value.cliente_id = cliente.id
  clienteSearch.value = cliente.nome
  showClienteDropdown.value = false
  delete validationErrors.value.cliente_id
}

function adicionarItem() {
  form.value.itens.push({
    descricao: '',
    material_id: 0,
    largura_cm: 0,
    altura_cm: 0,
    quantidade: 1,
    modalidade_preco: 'm2',
    preco_unitario: undefined,
    preco_m2: 0,
    area_m2: 0,
    valor_item: 0,
  })
}

function removerItem(index: number) {
  form.value.itens.splice(index, 1)
}

function onItemUpdate(index: number, updatedItem: ItemOrcamento) {
  // Sempre atualizar descrição quando o material mudar
  if (updatedItem.material_nome && updatedItem.material_id !== form.value.itens[index].material_id) {
    updatedItem.descricao = updatedItem.material_nome
  }
  form.value.itens[index] = updatedItem
}

async function fetchRegrasDesconto() {
  if (!empresaId.value) return
  try {
    const { data } = await supabase
      .from('regras_desconto_volume')
      .select('quantidade_minima, desconto_percentual')
      .eq('empresa_id', empresaId.value)
      .eq('ativo', true)
      .order('quantidade_minima', { ascending: true })

    regrasDesconto.value = data ?? []
  } catch (e) {
    console.error('[OrcamentoNovoModal] Erro ao buscar regras de desconto:', e)
  }
}

async function gerarNumero(): Promise<string> {
  if (!empresaId.value) return 'ORC-1'

  const { data } = await supabase
    .from('orcamentos_adesivo')
    .select('numero_orcamento')
    .eq('empresa_id', empresaId.value)
    .not('numero_orcamento', 'is', null)
    .order('id', { ascending: false })
    .limit(1)

  if (data && data.length > 0 && data[0].numero_orcamento) {
    const numStr = data[0].numero_orcamento.replace('ORC-', '')
    const ultimo = parseInt(numStr, 10) || 0
    return gerarNumeroOrcamento(ultimo)
  }

  return gerarNumeroOrcamento(0)
}

async function salvarRascunho() {
  validationErrors.value = {}

  // Run full validation
  const resultado = validarOrcamento({
    cliente_id: form.value.cliente_id,
    validade_dias: form.value.validade_dias,
    valor_mao_obra: form.value.valor_mao_obra,
    desconto_percentual: descontoManualPercentualCalc.value,
    desconto_valor: descontoManualValorCalc.value,
    itens: form.value.itens,
  })

  if (!resultado.valid) {
    validationErrors.value = resultado.errors
    return
  }

  salvando.value = true

  try {
    if (isEditMode.value && props.orcamentoParaEditar) {
      await salvarEdicao()
    } else {
      await salvarNovo()
    }
  } catch (e) {
    console.error('[OrcamentoNovoModal] Erro inesperado:', e)
    validationErrors.value = { geral: 'Erro inesperado ao salvar. Tente novamente.' }
  } finally {
    salvando.value = false
  }
}

async function salvarEdicao() {
  const orcamento = props.orcamentoParaEditar!

  // Calculate totals
  const valorMaterial = subtotalItens.value
  const valorTotal = calcularValorFinal(
    valorMaterial,
    form.value.valor_mao_obra ?? 0,
    descontoVolumePercentual.value,
    descontoManualPercentualCalc.value,
    descontoManualValorCalc.value,
  )

  // Calculate data_validade
  const now = new Date()
  const dataValidade = new Date(now)
  dataValidade.setDate(dataValidade.getDate() + (form.value.validade_dias ?? 30))

  // Calculate diff of items
  const diffItens = calcularDiffItens(originalItens.value, form.value.itens)

  // Call atualizarOrcamento - preserves status and token_aprovacao
  const result = await atualizarOrcamento(
    orcamento.id,
    {
      cliente_id: form.value.cliente_id!,
      validade_dias: Number(form.value.validade_dias) || 30,
      prazo_estimado_dias: Number(form.value.prazo_estimado_dias) || null,
      data_entrega: form.value.data_entrega || null,
      valor_mao_obra_global: Number(form.value.valor_mao_obra) || 0,
      desconto_percentual: descontoManualPercentualCalc.value,
      desconto_valor: descontoManualValorCalc.value,
      valor_total: valorTotal,
      valor_material: valorMaterial,
      quantidade_total_itens: quantidadeTotal.value,
      data_validade: dataValidade.toISOString(),
      endereco_instalacao: form.value.endereco_instalacao || null,
      nome_trabalho: form.value.nome_trabalho || null,
    },
    diffItens,
  )

  if (!result.success) {
    validationErrors.value = { geral: result.error || 'Erro ao atualizar orçamento. Tente novamente.' }
    return
  }

  // Emit updated event
  emit('updated', {
    id: orcamento.id,
    numero_orcamento: orcamento.numero_orcamento,
    status: orcamento.status,
    valor_total: valorTotal,
  })
  fechar()
}

async function salvarNovo() {
  // Generate numero_orcamento
  const numero = await gerarNumero()

  // Calculate totals
  const valorMaterial = subtotalItens.value
  const valorTotal = calcularValorFinal(
    valorMaterial,
    form.value.valor_mao_obra ?? 0,
    descontoVolumePercentual.value,
    descontoManualPercentualCalc.value,
    descontoManualValorCalc.value,
  )

  // Calculate data_validade
  const now = new Date()
  const dataValidade = new Date(now)
  dataValidade.setDate(dataValidade.getDate() + (form.value.validade_dias ?? 30))

  // Insert orcamento
  const { data: orcamentoData, error: orcamentoError } = await supabase
    .from('orcamentos_adesivo')
    .insert({
      empresa_id: empresaId.value,
      cliente_id: form.value.cliente_id,
      numero_orcamento: numero,
      status: 'rascunho',
      valor_material: valorMaterial,
      valor_mao_obra_global: Number(form.value.valor_mao_obra) || 0,
      desconto_volume_percentual: descontoVolumePercentual.value,
      desconto_percentual: descontoManualPercentualCalc.value,
      desconto_valor: descontoManualValorCalc.value,
      valor_total: valorTotal,
      quantidade_total_itens: quantidadeTotal.value,
      prazo_estimado_dias: Number(form.value.prazo_estimado_dias) || null,
      data_entrega: form.value.data_entrega || null,
      validade_dias: Number(form.value.validade_dias) || 30,
      data_validade: dataValidade.toISOString(),
      endereco_instalacao: form.value.endereco_instalacao || null,
      nome_trabalho: form.value.nome_trabalho || null,
    })
    .select('id')
    .single()

  if (orcamentoError) {
    console.error('[OrcamentoNovoModal] Erro ao salvar orçamento:', orcamentoError)
    validationErrors.value = { geral: 'Erro ao salvar orçamento. Tente novamente.' }
    return
  }

  // Insert items
  const itensParaInserir = form.value.itens.map(item => ({
    orcamento_id: orcamentoData.id,
    material_id: item.material_id,
    descricao: item.descricao || item.material_nome || '',
    largura_cm: item.largura_cm,
    altura_cm: item.altura_cm,
    quantidade: item.quantidade,
    modalidade_preco: item.modalidade_preco,
    preco_unitario: item.modalidade_preco === 'unidade' ? item.preco_unitario : null,
    preco_m2: item.modalidade_preco === 'm2' ? item.preco_m2 : null,
    area_m2: item.area_m2 ?? 0,
    valor_item: item.valor_item,
    foto_arte_url: item.foto_arte_url ?? null,
    foto_local_url: item.foto_local_url ?? null,
    arquivo_url: item.arquivo_url ?? null,
  }))

  const { error: itensError } = await supabase
    .from('itens_orcamento')
    .insert(itensParaInserir)

  if (itensError) {
    console.error('[OrcamentoNovoModal] Erro ao salvar itens:', itensError)
    // Rollback: delete the orcamento
    await supabase.from('orcamentos_adesivo').delete().eq('id', orcamentoData.id)
    validationErrors.value = { geral: 'Erro ao salvar itens do orçamento. Tente novamente.' }
    return
  }

  // Emit success
  emit('created', {
    id: orcamentoData.id,
    numero_orcamento: numero,
    status: 'rascunho',
    valor_total: valorTotal,
  })
  fechar()
}

function preencherFormEdicao(orcamento: OrcamentoCompleto) {
  form.value.cliente_id = orcamento.cliente_id
  form.value.validade_dias = orcamento.validade_dias
  form.value.prazo_estimado_dias = orcamento.prazo_estimado_dias
  form.value.data_entrega = (orcamento as any).data_entrega ?? null
  form.value.valor_mao_obra = orcamento.valor_mao_obra_global
  form.value.endereco_instalacao = orcamento.endereco_instalacao ?? ''
  form.value.nome_trabalho = orcamento.nome_trabalho ?? ''

  // Pre-fill items
  form.value.itens = orcamento.itens.map(item => ({ ...item }))

  // Store original items for diff calculation
  originalItens.value = orcamento.itens.map(item => ({ ...item }))

  // Pre-fill discount
  if (orcamento.desconto_percentual > 0) {
    descontoTipo.value = 'percentual'
    descontoManualInput.value = orcamento.desconto_percentual
  } else if (orcamento.desconto_valor > 0) {
    descontoTipo.value = 'valor'
    descontoManualInput.value = orcamento.desconto_valor
  } else {
    descontoTipo.value = 'percentual'
    descontoManualInput.value = 0
  }

  // Pre-fill client search
  const cliente = props.clientes.find(c => c.id === orcamento.cliente_id)
  if (cliente) {
    clienteSearch.value = cliente.nome
  }
}

function resetForm() {
  form.value = {
    cliente_id: null,
    validade_dias: 30,
    prazo_estimado_dias: null,
    data_entrega: null,
    valor_mao_obra: 0,
    itens: [],
    endereco_instalacao: '',
    nome_trabalho: '',
  }
  clienteSearch.value = ''
  descontoTipo.value = 'percentual'
  descontoManualInput.value = 0
  validationErrors.value = {}
  showClienteDropdown.value = false
  originalItens.value = []
}

function fechar() {
  emit('close')
}
</script>

<style scoped>
.modal-enter-active {
  transition: opacity 0.25s ease;
}
.modal-enter-active .relative {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
}
.modal-leave-active {
  transition: opacity 0.15s ease;
}
.modal-enter-from {
  opacity: 0;
}
.modal-enter-from .relative {
  transform: translateY(16px) scale(0.97);
  opacity: 0;
}
.modal-leave-to {
  opacity: 0;
}
</style>
