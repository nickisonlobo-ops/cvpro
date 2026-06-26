<template>
  <div class="min-h-full bg-transparent p-3 sm:p-8">

    <!-- CABEÇALHO -->
    <div class="relative rounded-3xl overflow-hidden mb-8 shadow-xl">
      <div class="absolute inset-0" :style="{ background: 'var(--color-primary-bg, linear-gradient(135deg, #ec4899, #f43f5e))' }" />
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />
      <div class="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/[0.03] pointer-events-none" />
      <PageLogo />

      <div class="relative px-4 sm:px-8 pt-5 sm:pt-7 pb-5 sm:pb-7">
        <div class="flex flex-wrap items-start justify-between gap-3 sm:gap-6">
          <div class="flex items-center gap-3 sm:gap-5">
            <div class="flex items-center justify-center w-10 sm:w-14 h-10 sm:h-14 rounded-2xl bg-white/[0.12] backdrop-blur-sm border border-white/20 shadow-lg">
              <svg class="w-5 sm:w-7 h-5 sm:h-7 text-white" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/>
              </svg>
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-semibold text-white/80 uppercase tracking-widest">Estoque</span>
              </div>
              <h1 class="text-xl sm:text-3xl font-bold text-white tracking-tight leading-none">Produtos</h1>
              <p class="text-sm text-white/80 mt-1.5">
                {{ loading ? 'Carregando...' : `${produtosFiltrados.length} de ${produtos.length} produto(s)` }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <button
              v-if="isAdminOrGerente"
              type="button"
              class="inline-flex items-center gap-2 text-sm font-bold px-3 sm:px-5 py-2.5 rounded-xl bg-white text-primary hover:bg-primary-5 shadow-lg transition-all duration-200 hover:scale-[1.02]"
              @click="abrirAdicionar"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
              <span class="hidden sm:inline">Adicionar Produto</span>
              <span class="sm:hidden">Adicionar</span>
            </button>
          </div>
        </div>

        <!-- Cards resumo -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div class="bg-white/[0.07] rounded-2xl px-4 py-3 border border-white/10">
            <p class="text-[10px] font-black uppercase tracking-widest text-white/70 mb-1">Total</p>
            <p class="text-2xl font-black text-white">{{ loading ? '…' : produtos.length }}</p>
            <p class="text-xs text-white/50 mt-0.5">produto(s)</p>
          </div>
          <div class="bg-white/[0.07] rounded-2xl px-4 py-3 border border-white/10">
            <p class="text-[10px] font-black uppercase tracking-widest text-white/70 mb-1">Ativos</p>
            <p class="text-2xl font-black text-white">{{ loading ? '…' : produtosAtivos }}</p>
            <p class="text-xs text-white/50 mt-0.5">disponíveis</p>
          </div>
          <div class="bg-white/[0.07] rounded-2xl px-4 py-3 border border-white/10">
            <p class="text-[10px] font-black uppercase tracking-widest text-white/70 mb-1">Estoque baixo</p>
            <p class="text-2xl font-black text-white">{{ loading ? '…' : estoqueBaixo }}</p>
            <p class="text-xs text-white/50 mt-0.5">≤ 5 unidades</p>
          </div>
          <div class="bg-white/[0.07] rounded-2xl px-4 py-3 border border-white/10">
            <p class="text-[10px] font-black uppercase tracking-widest text-white/70 mb-1">Valor total</p>
            <p class="text-lg font-black text-white truncate">{{ loading ? '…' : formatCurrency(valorTotalEstoque) }}</p>
            <p class="text-xs text-white/50 mt-0.5">em estoque</p>
          </div>
        </div>
      </div>
    </div>

    <!-- BUSCA -->
    <div class="mb-6 flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z"/></svg>
        <input
          v-model="busca"
          type="text"
          placeholder="Buscar produto..."
          class="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>
      <div class="flex gap-2">
        <button
          v-for="f in filtrosAtivo"
          :key="f.value"
          type="button"
          class="px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors"
          :class="filtroAtivo === f.value ? 'bg-primary text-primary-text border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary'"
          @click="filtroAtivo = f.value"
        >
          {{ f.label }}
        </button>
      </div>
    </div>

    <!-- ERRO -->
    <div v-if="error" class="flex items-center gap-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-2xl px-6 py-4 mb-6">
      <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" d="M12 8v4m0 4h.01"/></svg>
      {{ error }}
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <span class="spinner spinner-md" />
    </div>

    <!-- TABELA DE PRODUTOS -->
    <div v-if="!loading" class="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
      <div class="flex items-center justify-between px-7 py-4 border-b border-gray-100 bg-gray-50/50">
        <span class="text-sm font-semibold text-gray-600">
          <span class="text-primary font-black">{{ produtosFiltrados.length }}</span> resultado(s)
        </span>
        <span class="text-xs text-gray-400">Ordenado por nome</span>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm whitespace-nowrap">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="text-left px-7 py-3 text-xs font-extrabold text-gray-400 uppercase tracking-widest">#</th>
              <th class="text-left px-5 py-3 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Produto</th>
              <th class="text-left px-5 py-3 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Descrição</th>
              <th class="text-left px-5 py-3 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Preço</th>
              <th class="text-left px-5 py-3 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Estoque</th>
              <th class="text-left px-5 py-3 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Status</th>
              <th class="px-7 py-3 text-right text-xs font-extrabold text-gray-400 uppercase tracking-widest sm:sticky sm:right-0 bg-gray-50">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-if="produtosFiltrados.length === 0">
              <td colspan="7" class="text-center py-20">
                <div class="flex flex-col items-center gap-3">
                  <svg class="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" stroke-width="1.25" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/></svg>
                  <span class="text-base font-semibold text-gray-400">{{ busca ? 'Nenhum produto encontrado' : 'Adicione o primeiro produto ao estoque.' }}</span>
                </div>
              </td>
            </tr>
            <tr
              v-for="p in produtosFiltrados"
              :key="p.id"
              class="hover:bg-primary-5/40 transition-colors duration-150 group"
              :class="!p.ativo ? 'opacity-60' : ''"
            >
              <td class="px-7 py-3">
                <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-10 text-primary font-black text-xs">
                  {{ p.id }}
                </span>
              </td>
              <td class="px-5 py-3">
                <div class="flex items-center gap-3">
                  <div
                    class="w-2 h-8 rounded-full shrink-0"
                    :class="p.estoque <= 0 ? 'bg-red-400' : p.estoque <= 5 ? 'bg-primary' : 'bg-emerald-400'"
                  />
                  <span class="font-semibold text-gray-800 max-w-[180px] truncate">{{ p.nome }}</span>
                </div>
              </td>
              <td class="px-5 py-3 text-gray-400 max-w-[200px] truncate">{{ p.descricao ?? '—' }}</td>
              <td class="px-5 py-3 font-bold text-gray-800">{{ formatCurrency(p.preco) }}</td>
              <td class="px-5 py-3">
                <div class="flex items-center gap-2">
                  <span
                    class="font-black text-base"
                    :class="p.estoque <= 0 ? 'text-red-500' : p.estoque <= 5 ? 'text-primary' : 'text-emerald-600'"
                  >{{ p.estoque }}</span>
                  <span class="text-xs text-gray-400">unid.</span>
                  <span v-if="p.estoque <= 0" class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">Sem estoque</span>
                  <span v-else-if="p.estoque <= 5" class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-10 text-primary">Baixo</span>
                </div>
              </td>
              <td class="px-5 py-3">
                <span
                  class="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
                  :class="p.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="p.ativo ? 'bg-green-500' : 'bg-gray-400'" />
                  {{ p.ativo ? 'Ativo' : 'Inativo' }}
                </span>
              </td>
              <td class="px-7 py-3 text-right sm:sticky sm:right-0 group-hover:bg-primary-5/40 transition-colors">
                <div class="flex items-center justify-end gap-1">
                  <button
                    v-if="isAdminOrGerente"
                    type="button"
                    class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white shadow-sm text-gray-600 hover:text-primary border border-gray-200 hover:border-primary-border transition-colors"
                    @click="abrirMovimento(p)"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>
                    Mov.
                  </button>
                  <button
                    v-if="isAdminOrGerente"
                    type="button"
                    class="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-primary hover:bg-primary-10 transition-colors"
                    title="Editar"
                    @click="editProduto(p)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487a2.1 2.1 0 112.97 2.97L8.5 18.81l-4 1 1-4 11.362-11.323z"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL ADICIONAR/EDITAR -->
    <Teleport to="body">
      <Transition enter-active-class="duration-200 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="adicionando || editando" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="fecharModal" />
          <div class="relative w-full sm:max-w-lg bg-white sm:rounded-3xl shadow-2xl overflow-hidden max-h-[95dvh] flex flex-col">
            <!-- Handle mobile -->
            <div class="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
              <div class="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            <!-- Header -->
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
              <h2 class="text-base font-bold text-gray-900">{{ editando ? 'Editar Produto' : 'Novo Produto' }}</h2>
              <button type="button" class="text-gray-400 hover:text-gray-700 transition-colors" @click="fecharModal">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div class="overflow-y-auto flex-1 px-6 py-5">
              <div class="flex flex-col gap-4">
                <AppInput v-model="form.nome" label="Nome *" placeholder="Nome do Produto" />
                <AppInput v-model="form.descricao" label="Descrição" placeholder="Descrição opcional" />
                <div class="grid grid-cols-2 gap-3">
                  <AppInput v-model="form.preco" label="Preço (R$) *" type="number" placeholder="0,00" />
                  <AppInput v-model="form.estoque" label="Estoque *" type="number" placeholder="0" />
                </div>
                <div class="flex items-center gap-3">
                  <button
                    type="button"
                    class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                    :class="form.ativo ? 'bg-primary' : 'bg-gray-300'"
                    @click="form.ativo = !form.ativo"
                  >
                    <span class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform" :class="form.ativo ? 'translate-x-6' : 'translate-x-1'" />
                  </button>
                  <span class="text-sm font-medium text-gray-700">{{ form.ativo ? 'Produto ativo' : 'Produto inativo' }}</span>
                </div>

                <p v-if="modalError" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{{ modalError }}</p>
              </div>
            </div>

            <div class="px-6 py-4 border-t border-gray-100 flex gap-3 shrink-0">
              <button type="button" class="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors" @click="fecharModal">
                Cancelar
              </button>
              <button
                type="button"
                class="flex-1 py-2.5 rounded-xl text-sm font-bold text-primary-text bg-primary hover:opacity-90 transition-colors disabled:opacity-50"
                :disabled="saving"
                @click="editando ? salvarEdicao() : salvarAdicao()"
              >
                {{ saving ? 'Salvando…' : (editando ? 'Salvar' : 'Adicionar') }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- MODAL MOVIMENTO DE ESTOQUE -->
    <Teleport to="body">
      <Transition enter-active-class="duration-200 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="movimentoProduto" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="movimentoProduto = null" />
          <div class="relative w-full sm:max-w-sm bg-white sm:rounded-3xl shadow-2xl overflow-hidden">
            <div class="sm:hidden flex justify-center pt-3 pb-1">
              <div class="w-10 h-1 bg-gray-300 rounded-full" />
            </div>
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 class="text-base font-bold text-gray-900">Movimentar Estoque</h2>
              <button type="button" class="text-gray-400 hover:text-gray-700" @click="movimentoProduto = null">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div class="px-6 py-5 flex flex-col gap-4">
              <p class="text-sm font-semibold text-gray-700">{{ movimentoProduto?.nome }}</p>
              <p class="text-sm text-gray-500">Estoque atual: <span class="font-bold text-gray-900">{{ movimentoProduto?.estoque }}</span></p>
              <div class="flex gap-3">
                <button
                  type="button"
                  class="flex-1 py-2 rounded-xl text-sm font-bold border-2 transition-colors"
                  :class="tipoMovimento === 'entrada' ? 'bg-primary text-primary-text border-primary' : 'bg-white text-gray-600 border-gray-200'"
                  @click="tipoMovimento = 'entrada'"
                >
                  + Entrada
                </button>
                <button
                  type="button"
                  class="flex-1 py-2 rounded-xl text-sm font-bold border-2 transition-colors"
                  :class="tipoMovimento === 'saida' ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-600 border-gray-200'"
                  @click="tipoMovimento = 'saida'"
                >
                  − Saída
                </button>
              </div>
              <AppInput v-model="qtdMovimento" label="Quantidade" type="number" placeholder="0" />
              <p v-if="movimentoError" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{{ movimentoError }}</p>
            </div>
            <div class="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button type="button" class="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors" @click="movimentoProduto = null">
                Cancelar
              </button>
              <button
                type="button"
                class="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-colors disabled:opacity-50"
                :class="tipoMovimento === 'entrada' ? 'bg-primary hover:opacity-90' : 'bg-red-500 hover:bg-red-400'"
                :disabled="savingMovimento"
                @click="confirmarMovimento"
              >
                {{ savingMovimento ? 'Salvando…' : 'Confirmar' }}
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

defineOptions({ name: 'EstoquePage' })

interface Produto {
  id: number
  nome: string
  descricao: string | null
  preco: number
  estoque: number
  ativo: boolean
  empresa_id: number
  created_at: string | null
}

const supabase = createSupabaseClient()
const { isAdminOrGerente } = useAdmin()
const { empresaId, loadEmpresa } = useEmpresa()

const produtos    = ref<Produto[]>([])
const loading     = ref(true)
const error       = ref<string | null>(null)
const busca       = ref('')
const filtroAtivo = ref<'todos' | 'ativos' | 'inativos' | 'baixo'>('todos')

const editando       = ref<Produto | null>(null)
const adicionando    = ref(false)
const saving         = ref(false)
const modalError     = ref<string | null>(null)
const movimentoProduto = ref<Produto | null>(null)
const tipoMovimento    = ref<'entrada' | 'saida'>('entrada')
const qtdMovimento     = ref('')
const savingMovimento  = ref(false)
const movimentoError   = ref<string | null>(null)

const filtrosAtivo = [
  { label: 'Todos', value: 'todos' },
  { label: 'Ativos', value: 'ativos' },
  { label: 'Inativos', value: 'inativos' },
  { label: 'Estoque baixo', value: 'baixo' },
] as const

const form = reactive({ nome: '', descricao: '', preco: '', estoque: '', ativo: true })

const produtosAtivos = computed(() => produtos.value.filter(p => p.ativo).length)
const estoqueBaixo   = computed(() => produtos.value.filter(p => p.estoque <= 5 && p.ativo).length)
const valorTotalEstoque = computed(() =>
  produtos.value.reduce((sum, p) => sum + p.preco * p.estoque, 0)
)

const produtosFiltrados = computed(() => {
  let lista = produtos.value
  if (filtroAtivo.value === 'ativos')   lista = lista.filter(p => p.ativo)
  if (filtroAtivo.value === 'inativos') lista = lista.filter(p => !p.ativo)
  if (filtroAtivo.value === 'baixo')    lista = lista.filter(p => p.estoque <= 5)
  if (busca.value.trim()) {
    const q = busca.value.toLowerCase()
    lista = lista.filter(p => p.nome.toLowerCase().includes(q) || (p.descricao ?? '').toLowerCase().includes(q))
  }
  return lista
})

function formatCurrency(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

onMounted(async () => {
  await loadEmpresa()
  await fetchProdutos()
})

async function fetchProdutos() {
  if (!empresaId.value) { loading.value = false; return }
  loading.value = true
  const { data, error: e } = await supabase
    .from('produtos_casa_racao')
    .select('*')
    .eq('empresa_id', empresaId.value)
    .order('nome')
  loading.value = false
  if (e) { error.value = e.message; return }
  produtos.value = (data ?? []) as Produto[]
}

function abrirAdicionar() {
  adicionando.value = true; editando.value = null; modalError.value = null
  Object.assign(form, { nome: '', descricao: '', preco: '', estoque: '', ativo: true })
}

function fecharModal() { adicionando.value = false; editando.value = null }

function editProduto(p: Produto) {
  editando.value = p; adicionando.value = false; modalError.value = null
  Object.assign(form, {
    nome: p.nome,
    descricao: p.descricao ?? '',
    preco: String(p.preco),
    estoque: String(p.estoque),
    ativo: p.ativo,
  })
}

function buildPayload() {
  return {
    nome:       form.nome.trim(),
    descricao:  form.descricao.trim() || null,
    preco:      Number(form.preco) || 0,
    estoque:    Number(form.estoque) || 0,
    ativo:      form.ativo,
    empresa_id: empresaId.value!,
  }
}

async function salvarAdicao() {
  if (!form.nome.trim()) { modalError.value = 'O nome é obrigatório.'; return }
  saving.value = true; modalError.value = null
  const { error: e } = await supabase.from('produtos_casa_racao').insert(buildPayload())
  saving.value = false
  if (e) { modalError.value = e.message; return }
  fecharModal(); await fetchProdutos()
}

async function salvarEdicao() {
  if (!editando.value || !form.nome.trim()) { modalError.value = 'O nome é obrigatório.'; return }
  saving.value = true; modalError.value = null
  const { error: e } = await supabase
    .from('produtos_casa_racao')
    .update(buildPayload())
    .eq('id', editando.value.id)
  saving.value = false
  if (e) { modalError.value = e.message; return }
  fecharModal(); await fetchProdutos()
}

function abrirMovimento(p: Produto) {
  movimentoProduto.value = p
  tipoMovimento.value = 'entrada'
  qtdMovimento.value = ''
  movimentoError.value = null
}

async function confirmarMovimento() {
  if (!movimentoProduto.value) return
  const qtd = Number(qtdMovimento.value)
  if (!qtd || qtd <= 0) { movimentoError.value = 'Informe uma quantidade válida.'; return }
  const novoEstoque = tipoMovimento.value === 'entrada'
    ? movimentoProduto.value.estoque + qtd
    : movimentoProduto.value.estoque - qtd
  if (novoEstoque < 0) { movimentoError.value = 'Estoque não pode ficar negativo.'; return }
  savingMovimento.value = true; movimentoError.value = null
  const { error: e } = await supabase
    .from('produtos_casa_racao')
    .update({ estoque: novoEstoque })
    .eq('id', movimentoProduto.value.id)
  savingMovimento.value = false
  if (e) { movimentoError.value = e.message; return }
  movimentoProduto.value = null
  await fetchProdutos()
}
</script>
