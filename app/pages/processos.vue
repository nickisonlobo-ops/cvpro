<template>
  <div class="min-h-screen p-4 sm:p-6 space-y-5">
    <!-- Header -->
    <div class="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_60%)]"></div>
      <div class="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-black">Processos de Produção</h1>
          <p class="text-sm text-white/70 mt-1">Gerencie templates, vincule a produtos e acompanhe o kanban</p>
        </div>
        <div class="flex items-center gap-2">
          <button type="button" class="px-4 py-2.5 rounded-xl text-sm font-bold bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all" :class="tab === 'kanban' ? 'bg-white/20' : ''" @click="tab = 'kanban'">
            Kanban
          </button>
          <button type="button" class="px-4 py-2.5 rounded-xl text-sm font-bold bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all" :class="tab === 'templates' ? 'bg-white/20' : ''" @click="tab = 'templates'">
            Templates
          </button>
          <button type="button" class="px-4 py-2.5 rounded-xl text-sm font-bold bg-white text-purple-700 hover:bg-purple-50 shadow-lg transition-all" @click="abrirNovoTemplate">
            + Novo Processo
          </button>
        </div>
      </div>
    </div>

    <!-- ═══ TAB: KANBAN ═══ -->
    <div v-if="tab === 'kanban'" class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Coluna Pendente -->
      <div class="space-y-3">
        <div class="flex items-center gap-2 px-1">
          <span class="w-3 h-3 rounded-full bg-yellow-400"></span>
          <h3 class="text-sm font-black text-gray-700">Pendente</h3>
          <span class="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{{ instanciasPendentes.length }}</span>
        </div>
        <div v-for="inst in instanciasPendentes" :key="inst.id" class="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-all cursor-pointer" @click="abrirInstancia(inst)">
          <div class="flex items-start justify-between mb-2">
            <div class="min-w-0">
              <p class="text-sm font-bold text-gray-900 truncate">{{ inst.titulo }}</p>
              <p class="text-[10px] text-gray-400 mt-0.5">{{ inst.template_nome }}</p>
            </div>
            <span class="text-[9px] font-bold px-2 py-0.5 rounded-full" :class="prioridadeClass(inst.prioridade)">{{ inst.prioridade }}</span>
          </div>
          <div v-if="inst.data_prazo" class="text-[10px] text-gray-500 flex items-center gap-1 mt-2">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
            Prazo: {{ formatDate(inst.data_prazo) }}
          </div>
          <div class="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full bg-yellow-400 rounded-full transition-all" :style="{ width: inst.progresso + '%' }"></div>
          </div>
        </div>
        <div v-if="instanciasPendentes.length === 0" class="text-center py-8 text-xs text-gray-400">Nenhum processo pendente</div>
      </div>

      <!-- Coluna Em Andamento -->
      <div class="space-y-3">
        <div class="flex items-center gap-2 px-1">
          <span class="w-3 h-3 rounded-full bg-blue-500"></span>
          <h3 class="text-sm font-black text-gray-700">Em Andamento</h3>
          <span class="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{{ instanciasEmAndamento.length }}</span>
        </div>
        <div v-for="inst in instanciasEmAndamento" :key="inst.id" class="bg-white rounded-2xl border border-blue-100 p-4 hover:shadow-md transition-all cursor-pointer" @click="abrirInstancia(inst)">
          <div class="flex items-start justify-between mb-2">
            <div class="min-w-0">
              <p class="text-sm font-bold text-gray-900 truncate">{{ inst.titulo }}</p>
              <p class="text-[10px] text-gray-400 mt-0.5">{{ inst.template_nome }}</p>
            </div>
            <span class="text-xs font-black text-blue-600">{{ inst.progresso }}%</span>
          </div>
          <div v-if="inst.responsavel_nome" class="text-[10px] text-gray-500 mt-1">👤 {{ inst.responsavel_nome }}</div>
          <div class="mt-3 h-1.5 bg-blue-100 rounded-full overflow-hidden">
            <div class="h-full bg-blue-500 rounded-full transition-all" :style="{ width: inst.progresso + '%' }"></div>
          </div>
        </div>
        <div v-if="instanciasEmAndamento.length === 0" class="text-center py-8 text-xs text-gray-400">Nenhum processo em andamento</div>
      </div>

      <!-- Coluna Concluído -->
      <div class="space-y-3">
        <div class="flex items-center gap-2 px-1">
          <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
          <h3 class="text-sm font-black text-gray-700">Concluído</h3>
          <span class="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{{ instanciasConcluidas.length }}</span>
        </div>
        <div v-for="inst in instanciasConcluidas" :key="inst.id" class="bg-white rounded-2xl border border-emerald-100 p-4 opacity-80 hover:opacity-100 transition-all cursor-pointer" @click="abrirInstancia(inst)">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
            <p class="text-sm font-medium text-gray-700 truncate">{{ inst.titulo }}</p>
          </div>
        </div>
        <div v-if="instanciasConcluidas.length === 0" class="text-center py-8 text-xs text-gray-400">Nenhum concluído</div>
      </div>
    </div>

    <!-- ═══ TAB: TEMPLATES ═══ -->
    <div v-if="tab === 'templates'" class="space-y-4">
      <div v-for="t in templates" :key="t.id" class="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition-all">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center" :style="{ background: t.cor + '15' }">
              <div class="w-4 h-4 rounded-full" :style="{ background: t.cor }"></div>
            </div>
            <div>
              <h3 class="text-sm font-bold text-gray-900">{{ t.nome }}</h3>
              <p class="text-[11px] text-gray-400">{{ t.etapas?.length ?? 0 }} etapas</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button type="button" class="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors" @click="editarTemplate(t)">
              <svg class="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /></svg>
            </button>
            <button type="button" class="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors" @click="confirmarExcluir(t)">
              <svg class="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
            </button>
          </div>
        </div>
        <!-- Etapas preview -->
        <div v-if="t.etapas?.length" class="mt-3 flex flex-wrap gap-1.5">
          <span v-for="(e, i) in t.etapas" :key="i" class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
            {{ i + 1 }}. {{ e.titulo }}
          </span>
        </div>
      </div>
      <div v-if="templates.length === 0" class="text-center py-12 text-gray-400">
        <p class="text-sm font-medium">Nenhum processo cadastrado</p>
        <p class="text-xs mt-1">Crie templates com etapas para seus produtos</p>
      </div>
    </div>

    <!-- ═══ MODAL: CRIAR/EDITAR TEMPLATE ═══ -->
    <Teleport to="body">
      <div v-if="showTemplateModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showTemplateModal = false">
        <div class="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
          <h2 class="text-lg font-black text-gray-900 mb-5">{{ formTemplate.id ? 'Editar' : 'Novo' }} Processo</h2>

          <div class="space-y-4">
            <div>
              <label class="text-[10px] font-bold text-gray-400 uppercase">Nome *</label>
              <input v-model="formTemplate.nome" type="text" placeholder="Ex: Adesivagem Veicular" class="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400" />
            </div>
            <div>
              <label class="text-[10px] font-bold text-gray-400 uppercase">Descrição</label>
              <input v-model="formTemplate.descricao" type="text" placeholder="Opcional" class="w-full mt-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400" />
            </div>
            <div>
              <label class="text-[10px] font-bold text-gray-400 uppercase">Cor</label>
              <input v-model="formTemplate.cor" type="color" class="w-10 h-10 mt-1 rounded-xl border border-gray-200 cursor-pointer" />
            </div>

            <!-- Etapas -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="text-[10px] font-bold text-gray-400 uppercase">Etapas do Checklist</label>
                <button type="button" class="text-[10px] font-bold text-purple-600 hover:text-purple-800" @click="adicionarEtapa">+ Adicionar</button>
              </div>
              <div class="space-y-2">
                <div v-for="(etapa, i) in formTemplate.etapas" :key="i" class="flex items-center gap-2">
                  <span class="text-[10px] font-bold text-gray-400 w-5 text-center">{{ i + 1 }}</span>
                  <input v-model="etapa.titulo" type="text" placeholder="Nome da etapa" class="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-purple-400" />
                  <button type="button" class="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center" @click="removerEtapa(i)">
                    <svg class="w-3 h-3 text-red-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
            <button type="button" class="flex-1 py-3 rounded-xl text-sm font-bold bg-purple-600 text-white hover:bg-purple-700 transition-all shadow-sm disabled:opacity-50" :disabled="salvandoTemplate || !formTemplate.nome" @click="salvarTemplateForm">
              {{ salvandoTemplate ? 'Salvando...' : 'Salvar' }}
            </button>
            <button type="button" class="flex-1 py-3 rounded-xl text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all" @click="showTemplateModal = false">Cancelar</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ═══ MODAL: DETALHES INSTÂNCIA (Checklist) ═══ -->
    <Teleport to="body">
      <div v-if="instanciaSelecionada" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="instanciaSelecionada = null">
        <div class="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <!-- Header -->
          <div class="p-6 pb-4 border-b border-gray-100">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-lg font-black text-gray-900">{{ instanciaSelecionada.titulo }}</h2>
                <p class="text-xs text-gray-400 mt-0.5">{{ instanciaSelecionada.template_nome }}</p>
              </div>
              <button type="button" class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center" @click="instanciaSelecionada = null">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <!-- Progress -->
            <div class="mt-4">
              <div class="flex items-center justify-between text-xs mb-1.5">
                <span class="font-bold text-gray-600">Progresso</span>
                <span class="font-black" :class="instanciaSelecionada.progresso === 100 ? 'text-emerald-600' : 'text-gray-900'">{{ instanciaSelecionada.progresso }}%</span>
              </div>
              <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-300" :class="instanciaSelecionada.progresso === 100 ? 'bg-emerald-500' : 'bg-blue-500'" :style="{ width: instanciaSelecionada.progresso + '%' }"></div>
              </div>
            </div>
          </div>

          <!-- Checklist -->
          <div class="p-6 space-y-2">
            <div
              v-for="item in checklistAtual"
              :key="item.id"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
              :class="item.concluida ? 'bg-emerald-50/50' : 'hover:bg-gray-50'"
            >
              <button
                type="button"
                class="w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0"
                :class="item.concluida ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 hover:border-emerald-400'"
                @click="toggleCheck(item)"
              >
                <svg v-if="item.concluida" class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              </button>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium" :class="item.concluida ? 'text-gray-400 line-through' : 'text-gray-800'">{{ item.titulo }}</p>
                <p v-if="item.concluida_por" class="text-[10px] text-gray-400 mt-0.5">✓ {{ item.concluida_por }}</p>
              </div>
              <span v-if="item.obrigatoria" class="text-[8px] font-bold text-red-400 uppercase">obrig.</span>
            </div>
            <div v-if="checklistAtual.length === 0" class="text-center py-6 text-sm text-gray-400">Nenhuma etapa neste processo</div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useProcessos, type ProcessoTemplate, type ProcessoInstancia, type ChecklistItem, type EtapaTemplate } from '~/composables/useProcessos'

definePageMeta({ layout: 'default' })

const { carregarTemplates, salvarTemplate, excluirTemplate, carregarInstancias, carregarChecklist, toggleChecklist, atualizarProgresso } = useProcessos()

const tab = ref<'kanban' | 'templates'>('kanban')
const templates = ref<ProcessoTemplate[]>([])
const instancias = ref<ProcessoInstancia[]>([])
const showTemplateModal = ref(false)
const salvandoTemplate = ref(false)
const instanciaSelecionada = ref<ProcessoInstancia | null>(null)
const checklistAtual = ref<ChecklistItem[]>([])

const formTemplate = reactive<{ id?: number; nome: string; descricao: string; cor: string; etapas: EtapaTemplate[] }>({
  nome: '', descricao: '', cor: '#3b82f6', etapas: [],
})

// Computed
const instanciasPendentes = computed(() => instancias.value.filter(i => i.status === 'pendente'))
const instanciasEmAndamento = computed(() => instancias.value.filter(i => i.status === 'em_andamento'))
const instanciasConcluidas = computed(() => instancias.value.filter(i => i.status === 'concluido'))

function prioridadeClass(p: string): string {
  switch (p) {
    case 'urgente': return 'bg-red-100 text-red-700'
    case 'alta': return 'bg-orange-100 text-orange-700'
    case 'normal': return 'bg-blue-100 text-blue-700'
    default: return 'bg-gray-100 text-gray-600'
  }
}

function formatDate(d: string | null): string {
  if (!d) return '—'
  return new Date(d + 'T12:00:00').toLocaleDateString('pt-BR')
}

function abrirNovoTemplate() {
  formTemplate.id = undefined
  formTemplate.nome = ''
  formTemplate.descricao = ''
  formTemplate.cor = '#3b82f6'
  formTemplate.etapas = []
  showTemplateModal.value = true
}

function editarTemplate(t: ProcessoTemplate) {
  formTemplate.id = t.id
  formTemplate.nome = t.nome
  formTemplate.descricao = t.descricao ?? ''
  formTemplate.cor = t.cor
  formTemplate.etapas = (t.etapas ?? []).map(e => ({ ...e }))
  showTemplateModal.value = true
}

function adicionarEtapa() {
  formTemplate.etapas.push({ titulo: '', descricao: null, ordem: formTemplate.etapas.length, obrigatoria: true, tempo_estimado_min: null })
}

function removerEtapa(i: number) {
  formTemplate.etapas.splice(i, 1)
}

async function salvarTemplateForm() {
  if (!formTemplate.nome.trim()) return
  salvandoTemplate.value = true
  const result = await salvarTemplate({
    id: formTemplate.id,
    nome: formTemplate.nome.trim(),
    descricao: formTemplate.descricao || null,
    cor: formTemplate.cor,
    ativo: true,
    etapas: formTemplate.etapas.filter(e => e.titulo.trim()),
  })
  salvandoTemplate.value = false
  if (result.success) {
    showTemplateModal.value = false
    templates.value = await carregarTemplates()
  } else {
    alert(result.error?.includes('duplicate') || result.error?.includes('unique') ? 'Já existe um processo com esse nome.' : (result.error ?? 'Erro ao salvar'))
  }
}

async function confirmarExcluir(t: ProcessoTemplate) {
  if (!confirm(`Excluir o processo "${t.nome}"?`)) return
  const r = await excluirTemplate(t.id)
  if (r.success) templates.value = await carregarTemplates()
}

async function abrirInstancia(inst: ProcessoInstancia) {
  instanciaSelecionada.value = inst
  checklistAtual.value = await carregarChecklist(inst.id)
}

async function toggleCheck(item: ChecklistItem) {
  item.concluida = !item.concluida
  await toggleChecklist(item.id, item.concluida, 'Usuário')
  if (instanciaSelecionada.value) {
    await atualizarProgresso(instanciaSelecionada.value.id)
    // Atualizar progresso local
    const concluidas = checklistAtual.value.filter(c => c.concluida).length
    instanciaSelecionada.value.progresso = Math.round((concluidas / checklistAtual.value.length) * 100)
    if (instanciaSelecionada.value.progresso === 100) instanciaSelecionada.value.status = 'concluido'
    else if (instanciaSelecionada.value.progresso > 0) instanciaSelecionada.value.status = 'em_andamento'
  }
}

async function carregarDados() {
  templates.value = await carregarTemplates()
  instancias.value = await carregarInstancias()
}

onMounted(() => { carregarDados() })
</script>
