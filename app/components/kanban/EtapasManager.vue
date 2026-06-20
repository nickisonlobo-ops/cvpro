<template>
  <div class="etapas-manager">
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-lg font-semibold" style="color: var(--color-card-texto, #1e293b)">Gerenciar Etapas</h2>
      <p class="text-sm mt-1" style="color: var(--color-card-texto, #94a3b8); opacity: 0.7">
        Adicione, reordene ou edite as etapas do pipeline.
      </p>
    </div>

    <!-- Formulário para adicionar nova etapa -->
    <form
      class="etapas-manager__form flex flex-col sm:flex-row items-start sm:items-end gap-3 p-4 rounded-xl border mb-6"
      @submit.prevent="handleCriarEtapa"
    >
      <!-- Nome -->
      <div class="flex flex-col gap-1.5 flex-1 w-full sm:w-auto">
        <label for="nova-etapa-nome" class="text-sm font-medium" style="color: var(--color-card-texto, #1e293b)">
          Nome da etapa
        </label>
        <input
          id="nova-etapa-nome"
          v-model="novaEtapa.nome"
          type="text"
          placeholder="Ex: Em análise"
          maxlength="50"
          class="etapas-manager__input w-full rounded-xl border px-4 py-2.5 text-base transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1"
          :class="formErrors.nome ? 'border-error focus:ring-error' : 'focus:ring-[var(--color-primary)]'"
        />
        <p v-if="formErrors.nome" class="text-xs text-red-500">{{ formErrors.nome }}</p>
      </div>

      <!-- Cor -->
      <div class="flex flex-col gap-1.5">
        <label for="nova-etapa-cor" class="text-sm font-medium" style="color: var(--color-card-texto, #1e293b)">
          Cor
        </label>
        <div class="flex items-center gap-2">
          <input
            id="nova-etapa-cor"
            v-model="novaEtapa.cor"
            type="color"
            class="etapas-manager__color-input w-10 h-10 rounded-lg border cursor-pointer"
          />
          <span class="text-xs font-mono" style="color: var(--color-card-texto, #94a3b8); opacity: 0.7">{{ novaEtapa.cor }}</span>
        </div>
        <p v-if="formErrors.cor" class="text-xs text-red-500">{{ formErrors.cor }}</p>
      </div>

      <!-- Botão Adicionar -->
      <button
        type="submit"
        :disabled="criando"
        class="inline-flex items-center justify-center font-semibold rounded-xl transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 px-5 py-2.5 text-base gap-2"
        :style="{ background: 'var(--color-btn, #374151)', color: 'var(--color-btn-text, #ffffff)' }"
        :class="{ 'opacity-60 cursor-not-allowed': criando }"
      >
        <span v-if="criando" class="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Adicionar
      </button>
    </form>

    <!-- Mensagem de erro geral -->
    <div
      v-if="erroGeral"
      class="flex items-center gap-2 p-3 mb-4 rounded-lg border border-red-300/30 bg-red-500/5 text-sm text-red-500"
    >
      <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
      {{ erroGeral }}
    </div>

    <!-- Loading state -->
    <div v-if="carregando" class="flex items-center justify-center py-8">
      <div class="w-6 h-6 border-2 rounded-full animate-spin" style="border-color: var(--color-primary, #374151); border-top-color: transparent" />
    </div>

    <!-- Lista de etapas -->
    <div v-else class="space-y-2">
      <div
        v-for="(etapa, index) in etapas"
        :key="etapa.id"
        class="etapa-item flex items-center gap-3 p-3 rounded-xl border transition-all duration-200"
        :class="[
          dragOverIndex === index
            ? 'etapa-item--over'
            : '',
          draggingIndex === index ? 'opacity-50' : ''
        ]"
        draggable="true"
        @dragstart="onEtapaDragStart($event, index)"
        @dragover.prevent="onEtapaDragOver($event, index)"
        @dragleave="onEtapaDragLeave"
        @drop="onEtapaDrop($event, index)"
        @dragend="onEtapaDragEnd"
      >
        <!-- Drag handle -->
        <button
          type="button"
          class="flex-shrink-0 cursor-grab active:cursor-grabbing p-1 rounded transition-colors"
          style="color: var(--color-card-texto, #94a3b8); opacity: 0.6"
          title="Arrastar para reordenar"
          @mousedown.stop
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        <!-- Dot colorido -->
        <span
          class="w-3 h-3 rounded-full flex-shrink-0 border border-black/10"
          :style="{ backgroundColor: etapa.cor }"
        />

        <!-- Nome (editável) -->
        <div class="flex-1 min-w-0">
          <div v-if="editandoId === etapa.id" class="flex items-center gap-2">
            <input
              v-model="editNome"
              type="text"
              maxlength="50"
              class="etapas-manager__input flex-1 rounded-lg border px-3 py-1.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1"
              :class="editErrors.nome ? 'border-red-500 focus:ring-red-500' : 'focus:ring-[var(--color-primary)]'"
              @keydown.enter="salvarEdicao(etapa)"
              @keydown.escape="cancelarEdicao"
            />
            <button
              type="button"
              class="p-1 rounded text-green-600 hover:bg-green-50 transition-colors"
              title="Salvar"
              @click="salvarEdicao(etapa)"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </button>
            <button
              type="button"
              class="p-1 rounded transition-colors"
              style="color: var(--color-card-texto, #94a3b8); opacity: 0.7"
              title="Cancelar"
              @click="cancelarEdicao"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div v-else class="flex items-center gap-2">
            <span
              class="text-sm font-medium truncate cursor-pointer hover:underline"
              style="color: var(--color-card-texto, #1e293b)"
              @click="iniciarEdicao(etapa)"
            >
              {{ etapa.nome }}
            </span>
            <span
              v-if="etapa.is_final"
              class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            >
              Final
            </span>
          </div>
          <p v-if="editandoId === etapa.id && editErrors.nome" class="text-xs text-red-500 mt-1">
            {{ editErrors.nome }}
          </p>
        </div>

        <!-- Ações -->
        <div class="flex items-center gap-1 flex-shrink-0">
          <!-- Seletor de cor -->
          <label
            :for="`cor-etapa-${etapa.id}`"
            class="p-1.5 rounded cursor-pointer transition-colors"
            style="color: var(--color-card-texto, #94a3b8); opacity: 0.7"
            title="Alterar cor"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
            </svg>
            <input
              :id="`cor-etapa-${etapa.id}`"
              type="color"
              :value="etapa.cor"
              class="sr-only"
              @input="handleAlterarCor(etapa, ($event.target as HTMLInputElement).value)"
            />
          </label>

          <!-- Marcar como Final -->
          <button
            type="button"
            class="p-1.5 rounded transition-colors"
            :class="etapa.is_final
              ? 'text-green-600 bg-green-50 dark:bg-green-900/20'
              : ''"
            :style="!etapa.is_final ? { color: 'var(--color-card-texto, #94a3b8)', opacity: '0.7' } : {}"
            :title="etapa.is_final ? 'Etapa final (clique para desmarcar)' : 'Marcar como etapa final'"
            @click="handleToggleFinal(etapa)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
            </svg>
          </button>

          <!-- Excluir -->
          <button
            type="button"
            class="p-1.5 rounded transition-colors"
            :class="podeExcluir(etapa)
              ? 'hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
              : 'cursor-not-allowed'"
            :style="{ color: 'var(--color-card-texto, #94a3b8)', opacity: podeExcluir(etapa) ? '0.7' : '0.3' }"
            :title="tituloExcluir(etapa)"
            :disabled="!podeExcluir(etapa)"
            @click="handleExcluir(etapa)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Estado vazio -->
      <div
        v-if="etapas.length === 0 && !carregando"
        class="flex items-center justify-center py-8 text-sm"
        style="color: var(--color-card-texto, #94a3b8); opacity: 0.5"
      >
        Nenhuma etapa configurada.
      </div>
    </div>

    <!-- Info: mínimo de etapas -->
    <p v-if="etapas.length <= 2 && etapas.length > 0" class="mt-3 text-xs flex items-center gap-1.5" style="color: var(--color-card-texto, #94a3b8); opacity: 0.7">
      <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
      </svg>
      O pipeline precisa ter no mínimo 2 etapas.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useEtapas, type PipelineTipo, type Etapa, type CriarEtapaInput } from '~/composables/useEtapas'

defineOptions({ name: 'EtapasManager' })

const props = defineProps<{
  pipelineTipo: PipelineTipo
}>()

// ─── Composable ───────────────────────────────────────────
const {
  carregarEtapas,
  criarEtapa,
  atualizarEtapa,
  excluirEtapa,
  reordenarEtapas,
  etapaTemItens,
  validarEtapa,
} = useEtapas()

// ─── Estado ───────────────────────────────────────────────
const etapas = ref<Etapa[]>([])
const carregando = ref(false)
const criando = ref(false)
const erroGeral = ref('')

// Formulário de nova etapa
const novaEtapa = reactive<{ nome: string; cor: string }>({
  nome: '',
  cor: '#3b82f6',
})
const formErrors = reactive<Record<string, string>>({})

// Edição inline
const editandoId = ref<number | null>(null)
const editNome = ref('')
const editErrors = reactive<Record<string, string>>({})

// Drag and drop para reordenar
const draggingIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

// Cache de itens associados para bloqueio de exclusão
const etapasComItens = ref<Set<number>>(new Set())

// ─── Carregamento ─────────────────────────────────────────
async function carregar() {
  carregando.value = true
  erroGeral.value = ''
  try {
    etapas.value = await carregarEtapas(props.pipelineTipo)
    await verificarItensAssociados()
  } catch (err: any) {
    erroGeral.value = err?.message || 'Erro ao carregar etapas.'
  } finally {
    carregando.value = false
  }
}

async function verificarItensAssociados() {
  const set = new Set<number>()
  for (const etapa of etapas.value) {
    try {
      const temItens = await etapaTemItens(etapa.id, props.pipelineTipo)
      if (temItens) set.add(etapa.id)
    } catch {
      // Em caso de erro na verificação, assume que pode ter itens (seguro)
      set.add(etapa.id)
    }
  }
  etapasComItens.value = set
}

// ─── Criar etapa ──────────────────────────────────────────
async function handleCriarEtapa() {
  // Limpar erros
  Object.keys(formErrors).forEach((k) => delete formErrors[k])
  erroGeral.value = ''

  const input: CriarEtapaInput = {
    nome: novaEtapa.nome,
    cor: novaEtapa.cor,
    pipeline_tipo: props.pipelineTipo,
  }

  // Validar
  const { valid, errors } = validarEtapa(input)
  if (!valid) {
    Object.assign(formErrors, errors)
    return
  }

  criando.value = true
  try {
    const nova = await criarEtapa(input)
    etapas.value.push(nova)
    novaEtapa.nome = ''
    novaEtapa.cor = '#3b82f6'
  } catch (err: any) {
    erroGeral.value = err?.message || 'Erro ao criar etapa.'
  } finally {
    criando.value = false
  }
}

// ─── Edição inline ────────────────────────────────────────
function iniciarEdicao(etapa: Etapa) {
  editandoId.value = etapa.id
  editNome.value = etapa.nome
  Object.keys(editErrors).forEach((k) => delete editErrors[k])
}

function cancelarEdicao() {
  editandoId.value = null
  editNome.value = ''
  Object.keys(editErrors).forEach((k) => delete editErrors[k])
}

async function salvarEdicao(etapa: Etapa) {
  Object.keys(editErrors).forEach((k) => delete editErrors[k])
  erroGeral.value = ''

  const nomeNovo = editNome.value.trim()
  if (!nomeNovo) {
    editErrors.nome = 'Nome da etapa é obrigatório'
    return
  }
  if (nomeNovo.length > 50) {
    editErrors.nome = 'Nome deve ter no máximo 50 caracteres'
    return
  }

  // Se não mudou, cancelar
  if (nomeNovo === etapa.nome) {
    cancelarEdicao()
    return
  }

  try {
    const atualizada = await atualizarEtapa(etapa.id, { nome: nomeNovo })
    const idx = etapas.value.findIndex((e) => e.id === etapa.id)
    if (idx !== -1) etapas.value[idx] = atualizada
    cancelarEdicao()
  } catch (err: any) {
    erroGeral.value = err?.message || 'Erro ao renomear etapa.'
  }
}

// ─── Alterar cor ──────────────────────────────────────────
async function handleAlterarCor(etapa: Etapa, novaCor: string) {
  erroGeral.value = ''
  if (!/^#[0-9a-fA-F]{6}$/.test(novaCor)) return

  try {
    const atualizada = await atualizarEtapa(etapa.id, { cor: novaCor })
    const idx = etapas.value.findIndex((e) => e.id === etapa.id)
    if (idx !== -1) etapas.value[idx] = atualizada
  } catch (err: any) {
    erroGeral.value = err?.message || 'Erro ao alterar cor.'
  }
}

// ─── Toggle Final ─────────────────────────────────────────
async function handleToggleFinal(etapa: Etapa) {
  erroGeral.value = ''
  const novoFinal = !etapa.is_final

  try {
    const atualizada = await atualizarEtapa(etapa.id, { is_final: novoFinal })

    // Se marcou como final, desmarcar a anterior no frontend
    if (novoFinal) {
      etapas.value.forEach((e) => {
        if (e.id !== etapa.id) e.is_final = false
      })
    }

    const idx = etapas.value.findIndex((e) => e.id === etapa.id)
    if (idx !== -1) etapas.value[idx] = atualizada
  } catch (err: any) {
    erroGeral.value = err?.message || 'Erro ao alterar etapa final.'
  }
}

// ─── Excluir ──────────────────────────────────────────────
function podeExcluir(etapa: Etapa): boolean {
  if (etapas.value.length <= 2) return false
  if (etapasComItens.value.has(etapa.id)) return false
  return true
}

function tituloExcluir(etapa: Etapa): string {
  if (etapas.value.length <= 2) {
    return 'Pipeline deve ter no mínimo 2 etapas'
  }
  if (etapasComItens.value.has(etapa.id)) {
    return 'Não é possível excluir: existem itens nesta etapa'
  }
  return 'Excluir etapa'
}

async function handleExcluir(etapa: Etapa) {
  if (!podeExcluir(etapa)) return
  erroGeral.value = ''

  try {
    await excluirEtapa(etapa.id)
    etapas.value = etapas.value.filter((e) => e.id !== etapa.id)
  } catch (err: any) {
    erroGeral.value = err?.message || 'Erro ao excluir etapa.'
  }
}

// ─── Drag and Drop (reordenação de etapas) ────────────────
function onEtapaDragStart(event: DragEvent, index: number) {
  draggingIndex.value = index
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', String(index))
  }
}

function onEtapaDragOver(event: DragEvent, index: number) {
  if (draggingIndex.value === null) return
  if (draggingIndex.value === index) return
  dragOverIndex.value = index
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

function onEtapaDragLeave() {
  dragOverIndex.value = null
}

async function onEtapaDrop(event: DragEvent, targetIndex: number) {
  event.preventDefault()
  dragOverIndex.value = null

  if (draggingIndex.value === null || draggingIndex.value === targetIndex) {
    draggingIndex.value = null
    return
  }

  // Reordenar localmente
  const novaLista = [...etapas.value]
  const [moved] = novaLista.splice(draggingIndex.value, 1)
  novaLista.splice(targetIndex, 0, moved)

  // Atualizar UI imediatamente (optimistic)
  const listaAnterior = [...etapas.value]
  etapas.value = novaLista
  draggingIndex.value = null

  // Persistir nova ordem
  const novaOrdem = novaLista.map((e) => e.id)
  try {
    await reordenarEtapas(novaOrdem)
    // Atualizar posições locais
    etapas.value.forEach((e, i) => { e.posicao = i })
  } catch (err: any) {
    // Rollback
    etapas.value = listaAnterior
    erroGeral.value = err?.message || 'Erro ao reordenar etapas.'
  }
}

function onEtapaDragEnd() {
  draggingIndex.value = null
  dragOverIndex.value = null
}

// ─── Lifecycle ────────────────────────────────────────────
onMounted(() => {
  carregar()
})
</script>

<style scoped>
.etapas-manager {
  max-width: 640px;
}

.etapa-item {
  user-select: none;
  background: var(--color-card, #ffffff);
  border-color: var(--color-card-border, rgba(0,0,0,0.06));
}

.etapa-item:hover {
  background: var(--color-primary-5, rgba(55,65,81,0.05));
}

.etapa-item--over {
  border-color: var(--color-primary, #374151) !important;
  box-shadow: 0 0 0 2px var(--color-primary-12, rgba(55,65,81,0.12));
  background: var(--color-primary-5, rgba(55,65,81,0.05)) !important;
}

.etapas-manager__form {
  background: var(--color-card, #ffffff);
  border-color: var(--color-card-border, rgba(0,0,0,0.06));
}

.etapas-manager__input {
  background: var(--color-card, #ffffff);
  color: var(--color-card-texto, #1e293b);
  border-color: var(--color-card-border, rgba(0,0,0,0.06));
}

.etapas-manager__input::placeholder {
  color: var(--color-card-texto, #94a3b8);
  opacity: 0.5;
}

.etapas-manager__color-input {
  background: var(--color-card, #ffffff);
  border-color: var(--color-card-border, rgba(0,0,0,0.06));
}
</style>
