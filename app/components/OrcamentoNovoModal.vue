<template>
  <Teleport to="body">
    <transition name="modal">
      <div v-if="show" class="fixed inset-0 z-50 flex flex-col" @click.self="fechar">
        <!-- Backdrop com blur -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="fechar" />

        <!-- Modal container -->
        <div class="relative z-10 flex flex-col w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-5xl sm:mx-auto sm:my-auto sm:rounded-2xl bg-white overflow-hidden shadow-2xl">

          <!-- Clean white header -->
          <div class="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>
              </div>
              <div>
                <h2 class="text-lg font-bold text-gray-900">{{ modalTitle }}</h2>
                <p class="text-xs text-gray-400">{{ isEditMode ? `${orcamentoParaEditar?.numero_orcamento} · ${clienteSelecionadoNome || 'Sem cliente'}` : 'Novo orçamento multi-itens' }}</p>
              </div>
            </div>
            <button type="button" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors" @click="fechar">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <!-- Body: 2-column layout -->
          <div class="flex flex-1 min-h-0">
            <!-- Left: scrollable form -->
            <div class="flex-1 overflow-y-auto px-6 py-5">
              <!-- Validation Errors -->
              <div v-if="Object.keys(validationErrors).length > 0" class="flex items-start gap-3 p-3 rounded-xl bg-red-50 border border-red-100 mb-5">
                <svg class="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
                <div class="text-xs text-red-600 space-y-0.5">
                  <p v-for="(msg, key) in validationErrors" :key="key">{{ msg }}</p>
                </div>
              </div>

              <form id="orcamento-form" class="space-y-8" @submit.prevent="salvarRascunho">
                <!-- Section 1: Dados gerais -->
                <section>
                  <h3 class="flex items-center gap-2 text-sm font-bold text-gray-800 mb-4">
                    <span class="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">1</span>
                    Dados gerais
                  </h3>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <!-- Cliente -->
                    <div class="flex flex-col gap-1.5">
                      <label class="text-xs font-semibold text-gray-600">Cliente</label>
                      <div class="relative">
                        <input
                          v-model="clienteSearch"
                          type="text"
                          placeholder="Buscar por nome..."
                          class="w-full rounded-xl border px-4 py-2.5 text-sm text-gray-800 bg-gray-50/80 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-all"
                          :class="validationErrors.cliente_id ? 'border-red-300' : 'border-gray-200'"
                          @focus="showClienteDropdown = true"
                          @input="showClienteDropdown = true"
                        />
                        <div v-if="form.cliente_id" class="absolute right-3 top-1/2 -translate-y-1/2">
                          <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
                        </div>
                        <div v-if="showClienteDropdown && clientesFiltrados.length > 0" class="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-44 overflow-y-auto">
                          <button v-for="cli in clientesFiltrados" :key="cli.id" type="button" class="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors" @click="selecionarCliente(cli)">{{ cli.nome }}</button>
                        </div>
                      </div>
                    </div>
                    <!-- Nome do trabalho -->
                    <div class="flex flex-col gap-1.5">
                      <label class="text-xs font-semibold text-gray-600">Nome do trabalho</label>
                      <input
                        v-model="form.nome_trabalho"
                        type="text"
                        placeholder="Ex: Fachada Loja Centro, Frota ABC..."
                        class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-800 bg-gray-50/80 placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-all"
                      />
                    </div>
                  </div>
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                    <!-- Local de instalação -->
                    <div class="flex flex-col gap-1.5">
                      <label class="text-xs font-semibold text-gray-600">Local de instalação</label>
                      <input
                        v-model="form.endereco_instalacao"
                        type="text"
                        placeholder="Endereço..."
                        class="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 bg-gray-50/80 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-all"
                      />
                    </div>
                    <!-- Data de entrega -->
                    <div class="flex flex-col gap-1.5">
                      <label class="text-xs font-semibold text-gray-600">Data de entrega</label>
                      <input v-model="form.data_entrega" type="date" class="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-all" />
                    </div>
                    <!-- Validade -->
                    <div class="flex flex-col gap-1.5">
                      <label class="text-xs font-semibold text-gray-600">Validade</label>
                      <div class="relative">
                        <input v-model.number="form.validade_dias" type="number" min="1" max="365" placeholder="30" class="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-all" :class="validationErrors.validade_dias ? 'border-red-300' : ''" />
                        <span class="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-gray-400">dias</span>
                      </div>
                    </div>
                    <!-- Mão de obra -->
                    <div class="flex flex-col gap-1.5">
                      <label class="text-xs font-semibold text-gray-600">Mão de obra</label>
                      <div class="relative">
                        <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">{{ locale.simboloMoeda }}</span>
                        <input v-model.number="form.valor_mao_obra" type="number" step="0.01" min="0" placeholder="0" class="w-full rounded-lg border border-gray-200 pl-7 pr-2 py-2.5 text-sm text-gray-800 bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-all" />
                      </div>
                    </div>
                  </div>
                </section>

                <!-- Section 2: Itens do orçamento -->
                <section>
                  <div class="flex items-center justify-between mb-4">
                    <h3 class="flex items-center gap-2 text-sm font-bold text-gray-800">
                      <span class="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">2</span>
                      Itens do orçamento
                      <span class="text-[10px] text-gray-400 font-normal">({{ form.itens.length }})</span>
                    </h3>
                    <button type="button" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-[11px] font-bold active:scale-95 transition-all shadow-sm bg-gray-900 hover:bg-gray-800" @click="adicionarItem">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
                      Adicionar item
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
                    <p class="text-xs text-gray-400">Toque em <span class="font-bold text-gray-900">Adicionar item</span> para incluir itens</p>
                  </div>
                </section>

                <!-- Section 3: Desconto -->
                <section>
                  <h3 class="flex items-center gap-2 text-sm font-bold text-gray-800 mb-4">
                    <span class="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">3</span>
                    Desconto
                  </h3>
                  <div class="flex items-center gap-2">
                    <div class="flex rounded-lg border border-gray-200 overflow-hidden">
                      <button type="button" class="px-3 py-1.5 text-[11px] font-bold transition-all" :class="descontoTipo === 'percentual' ? 'bg-gray-900 text-white' : 'bg-transparent text-gray-500'" @click="descontoTipo = 'percentual'">%</button>
                      <button type="button" class="px-3 py-1.5 text-[11px] font-bold transition-all" :class="descontoTipo === 'valor' ? 'bg-gray-900 text-white' : 'bg-transparent text-gray-500'" @click="descontoTipo = 'valor'">{{ locale.simboloMoeda }}</button>
                    </div>
                    <input v-model.number="descontoManualInput" type="number" step="0.01" min="0" :max="descontoTipo === 'percentual' ? 99.99 : 999999" placeholder="0" class="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-all" />
                  </div>
                </section>
              </form>
            </div>

            <!-- Right: sticky summary panel (hidden on mobile, shown sm+) -->
            <div class="hidden sm:block w-[320px] border-l border-gray-100 bg-gray-50/50 p-5 overflow-y-auto">
              <div class="sticky top-0 space-y-5">
                <!-- Resumo do orçamento card -->
                <div class="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                  <h4 class="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                    Resumo do orçamento
                  </h4>
                  <div class="space-y-2.5 text-sm">
                    <div class="flex justify-between"><span class="text-gray-500">Subtotal dos itens</span><span class="font-medium text-gray-800">{{ formatCurrency(subtotalItens) }}</span></div>
                    <div class="flex justify-between"><span class="text-gray-500">Desconto</span><span class="font-medium text-gray-800">{{ formatCurrency(descontoTotal) }}</span></div>
                    <div class="flex justify-between"><span class="text-gray-500">Mão de obra</span><span class="font-medium text-gray-800">{{ formatCurrency(form.valor_mao_obra ?? 0) }}</span></div>
                  </div>
                  <div class="border-t border-gray-100 pt-3">
                    <p class="text-xs text-gray-400 mb-1">Total final</p>
                    <p class="text-3xl font-bold text-gray-900">{{ formatCurrency(valorTotalFinal) }}</p>
                  </div>
                  <!-- Validade info -->
                  <div class="flex items-center gap-2 text-xs text-orange-600 bg-orange-50 rounded-lg px-3 py-2 border border-orange-100">
                    <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <span>Este orçamento é válido por <b>{{ form.validade_dias ?? 30 }} dias</b></span>
                  </div>
                </div>

                <!-- Action buttons -->
                <div class="space-y-2.5">
                  <!-- Salvar (não fecha modal) -->
                  <button type="submit" form="orcamento-form" class="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white bg-gray-900 hover:bg-gray-800 transition-colors disabled:opacity-50" :disabled="salvando">
                    <svg v-if="!salvando" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"/></svg>
                    <span v-if="salvando" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                    {{ actionButtonLabel }}
                  </button>

                  <!-- Ações extras (só em modo edição) -->
                  <template v-if="isEditMode">
                    <!-- Copiar Link -->
                    <button type="button" class="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium border transition-colors" :class="linkCopiado ? 'border-green-200 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'" @click="copiarLinkAprovacao">
                      <svg v-if="!linkCopiado" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.06a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.34 8.374"/></svg>
                      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                      {{ linkCopiado ? 'Link copiado!' : 'Copiar link de aprovação' }}
                    </button>

                    <!-- Gerar PDF -->
                    <button type="button" class="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50" :disabled="gerandoPdf" @click="gerarPdf">
                      <span v-if="gerandoPdf" class="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"/>
                      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>
                      {{ gerandoPdf ? 'Gerando...' : 'Gerar PDF' }}
                    </button>

                    <!-- Enviar orçamento (WhatsApp) -->
                    <button type="button" class="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-colors" @click="enviarOrcamento">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/></svg>
                      Enviar orçamento
                    </button>

                    <!-- Aprovar / Reprovar -->
                    <div class="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                      <button type="button" class="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-green-700 bg-green-50 border border-green-200 hover:bg-green-100 transition-colors" @click="aprovarOrcamento">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                        Aprovar
                      </button>
                      <button type="button" class="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors" @click="reprovarOrcamento">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                        Reprovar
                      </button>
                    </div>
                  </template>

                  <!-- Cancelar -->
                  <button type="button" class="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-100 transition-colors" @click="fechar">
                    Cancelar
                  </button>

                  <!-- Toast feedback -->
                  <p v-if="actionFeedback" class="text-xs font-medium text-center py-2 rounded-lg" :class="actionFeedback.type === 'success' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'">{{ actionFeedback.msg }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Mobile footer (shown only on small screens where sidebar is hidden) -->
          <div class="sm:hidden flex-shrink-0 px-4 py-3 border-t border-gray-100 bg-white flex items-center justify-between gap-3">
            <button type="button" class="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600" @click="fechar">Cancelar</button>
            <button type="submit" form="orcamento-form" class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold text-white bg-gray-900" :disabled="salvando">
              <span v-if="salvando" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
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
const { locale, formatCurrency } = useLocale()
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

const valorTotalFinal = computed<number>(() => {
  const sub = subtotalItens.value + (form.value.valor_mao_obra ?? 0)
  const descVol = sub * (descontoVolumePercentual.value / 100)
  const aposVol = sub - descVol
  const descManPerc = aposVol * (descontoManualPercentualCalc.value / 100)
  return Math.max(0, aposVol - descManPerc - descontoManualValorCalc.value)
})

const descontoTotal = computed<number>(() => {
  const sub = subtotalItens.value + (form.value.valor_mao_obra ?? 0)
  return sub - valorTotalFinal.value + (form.value.valor_mao_obra ?? 0)
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
  showFeedback('Alterações salvas com sucesso!')
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

// ─── Action buttons state ────────────────────────────────────────────────────
const linkCopiado = ref(false)
const gerandoPdf = ref(false)
const actionFeedback = ref<{ msg: string; type: 'success' | 'error' } | null>(null)

function showFeedback(msg: string, type: 'success' | 'error' = 'success') {
  actionFeedback.value = { msg, type }
  setTimeout(() => { actionFeedback.value = null }, 3000)
}

async function copiarLinkAprovacao() {
  if (!props.orcamentoParaEditar) return
  try {
    let token = props.orcamentoParaEditar.token_aprovacao
    if (!token) {
      token = crypto.randomUUID()
      await supabase.from('orcamentos_adesivo').update({ token_aprovacao: token }).eq('id', props.orcamentoParaEditar.id)
    }
    const url = `${window.location.origin}/orcamento-aprovacao/${token}`
    await navigator.clipboard.writeText(url)
    linkCopiado.value = true
    setTimeout(() => { linkCopiado.value = false }, 2500)
    showFeedback('Link copiado para a área de transferência!')
  } catch (e) {
    showFeedback('Erro ao gerar link', 'error')
  }
}

async function gerarPdf() {
  if (!props.orcamentoParaEditar) return
  gerandoPdf.value = true
  try {
    const { default: jsPDF } = await import('jspdf')
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pageWidth = doc.internal.pageSize.getWidth()
    let y = 20
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(`Orçamento ${props.orcamentoParaEditar.numero_orcamento}`, pageWidth / 2, y, { align: 'center' })
    y += 8
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Cliente: ${clienteSelecionadoNome.value || '—'}`, 20, y); y += 5
    doc.text(`Total: ${formatCurrency(valorTotalFinal.value)}`, 20, y); y += 10
    for (let i = 0; i < form.value.itens.length; i++) {
      const item = form.value.itens[i]
      doc.text(`${i + 1}. ${item.descricao || item.material_nome || 'Item'} — ${formatCurrency(item.valor_item)}`, 20, y)
      y += 6
    }
    doc.save(`Orcamento_${props.orcamentoParaEditar.numero_orcamento}.pdf`)
    showFeedback('PDF gerado com sucesso!')
  } catch (e) {
    showFeedback('Erro ao gerar PDF', 'error')
  } finally {
    gerandoPdf.value = false
  }
}

async function enviarOrcamento() {
  if (!props.orcamentoParaEditar) return
  try {
    let token = props.orcamentoParaEditar.token_aprovacao
    if (!token) {
      token = crypto.randomUUID()
      await supabase.from('orcamentos_adesivo').update({ token_aprovacao: token, status: 'enviado' }).eq('id', props.orcamentoParaEditar.id)
    } else {
      await supabase.from('orcamentos_adesivo').update({ status: 'enviado' }).eq('id', props.orcamentoParaEditar.id)
    }
    const url = `${window.location.origin}/orcamento-aprovacao/${token}`
    await navigator.clipboard.writeText(url)
    showFeedback('Orçamento enviado! Link copiado.')
    emit('updated', { id: props.orcamentoParaEditar.id, status: 'enviado' })
  } catch (e) {
    showFeedback('Erro ao enviar', 'error')
  }
}

async function aprovarOrcamento() {
  if (!props.orcamentoParaEditar) return
  try {
    await supabase.from('orcamentos_adesivo').update({ status: 'aprovado' }).eq('id', props.orcamentoParaEditar.id)
    showFeedback('Orçamento aprovado!')
    emit('updated', { id: props.orcamentoParaEditar.id, status: 'aprovado' })
  } catch (e) {
    showFeedback('Erro ao aprovar', 'error')
  }
}

async function reprovarOrcamento() {
  if (!props.orcamentoParaEditar) return
  try {
    await supabase.from('orcamentos_adesivo').update({ status: 'rejeitado' }).eq('id', props.orcamentoParaEditar.id)
    showFeedback('Orçamento reprovado.')
    emit('updated', { id: props.orcamentoParaEditar.id, status: 'rejeitado' })
  } catch (e) {
    showFeedback('Erro ao reprovar', 'error')
  }
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
