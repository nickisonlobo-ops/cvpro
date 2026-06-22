<template>
  <div class="relative rounded-2xl border bg-white transition-all duration-300"
    :class="expanded ? 'border-indigo-200 shadow-md' : 'border-gray-100 shadow-sm hover:shadow-md'">

    <!-- Header (sempre visível) — clicável para expandir/colapsar -->
    <div
      class="flex items-center justify-between px-3 sm:px-4 py-3 cursor-pointer select-none"
      @click="expanded = !expanded"
    >
      <div class="flex items-center gap-2.5 min-w-0">
        <span class="inline-flex items-center justify-center w-6 h-6 rounded-lg text-[10px] font-black flex-shrink-0"
          :class="expanded ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'">{{ index + 1 }}</span>
        <div class="min-w-0">
          <p class="text-sm font-semibold text-gray-800 truncate">
            {{ materialSelecionado ? materialSelecionado.nome : 'Novo item' }}
          </p>
          <p v-if="!expanded && valorCalculado > 0" class="text-[11px] text-gray-400">
            {{ item.quantidade }}× · {{ item.largura_cm }}×{{ item.altura_cm }}cm
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2 flex-shrink-0">
        <span v-if="valorCalculado > 0" class="text-sm font-bold" :class="expanded ? 'text-indigo-600' : 'text-gray-700'">{{ formatCurrency(valorCalculado) }}</span>
        <!-- Chevron -->
        <svg class="w-4 h-4 text-gray-400 transition-transform duration-200" :class="expanded ? 'rotate-180' : ''" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </div>

    <!-- Conteúdo expandido -->
    <div v-show="expanded" class="px-3 sm:px-4 pb-3 sm:pb-4 space-y-3 border-t border-gray-50">

      <!-- Material (seletor com modal) -->
      <div class="flex flex-col gap-1 pt-3">
        <div class="flex items-center justify-between">
          <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Material *</label>
          <button type="button" class="text-[10px] font-bold text-red-400 hover:text-red-600 transition-colors" @click.stop="emit('remove', index)">Remover item</button>
        </div>
        <button
          type="button"
          class="w-full flex items-center justify-between rounded-xl border px-3 py-2.5 text-left transition-all active:scale-[0.99]"
          :class="errors.material_id ? 'border-red-300 bg-red-50/50' : materialSelecionado ? 'border-gray-200 bg-white' : 'border-dashed border-gray-300 bg-gray-50/80'"
          @click.stop="showMaterialModal = true"
        >
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" :class="materialSelecionado ? 'bg-indigo-50' : 'bg-gray-100'">
              <svg class="w-4 h-4" :class="materialSelecionado ? 'text-indigo-500' : 'text-gray-400'" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L12 12.75l-5.571-3m11.142 0l4.179 2.25L12 17.25l-9.75-5.25 4.179-2.25" />
              </svg>
            </div>
            <span class="text-sm truncate" :class="materialSelecionado ? 'font-medium text-gray-800' : 'text-gray-400'">
              {{ materialSelecionado ? materialSelecionado.nome : 'Toque para selecionar...' }}
            </span>
          </div>
          <svg class="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        </button>
        <p v-if="errors.material_id" class="text-[11px] text-red-500 font-medium">{{ errors.material_id }}</p>
      </div>

      <!-- Dimensões + Quantidade -->
      <div class="grid grid-cols-4 gap-2">
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Larg. (cm)</label>
          <input :value="item.largura_cm" type="number" step="0.1" min="0.1" placeholder="0"
            class="w-full rounded-lg border px-2.5 py-2 text-sm font-medium text-gray-800 bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
            :class="errors.largura_cm ? 'border-red-300' : 'border-gray-200'"
            @input="onFieldInput('largura_cm', $event)" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Alt. (cm)</label>
          <input :value="item.altura_cm" type="number" step="0.1" min="0.1" placeholder="0"
            class="w-full rounded-lg border px-2.5 py-2 text-sm font-medium text-gray-800 bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
            :class="errors.altura_cm ? 'border-red-300' : 'border-gray-200'"
            @input="onFieldInput('altura_cm', $event)" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Esp. (cm)</label>
          <input :value="item.espessura_cm" type="number" step="0.1" min="0" placeholder="0"
            class="w-full rounded-lg border px-2.5 py-2 text-sm font-medium text-gray-800 bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all border-gray-200"
            @input="onFieldInput('espessura_cm', $event)" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Qtd</label>
          <input :value="item.quantidade" type="number" step="1" min="1" placeholder="1"
            class="w-full rounded-lg border px-2.5 py-2 text-sm font-medium text-gray-800 bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
            :class="errors.quantidade ? 'border-red-300' : 'border-gray-200'"
            @input="onFieldInput('quantidade', $event)" />
        </div>
      </div>
      <p v-if="errors.largura_cm || errors.altura_cm || errors.quantidade" class="text-[11px] text-red-500 font-medium -mt-1">{{ errors.largura_cm || errors.altura_cm || errors.quantidade }}</p>

      <!-- Preço: Toggle + Input -->
      <div class="flex flex-col gap-1.5">
        <div class="flex items-center gap-2">
          <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Preço</label>
          <div class="flex rounded-md border border-gray-200 overflow-hidden">
            <button type="button" class="px-2.5 py-1 text-[10px] font-bold transition-all focus:outline-none"
              :class="item.modalidade_preco === 'm2' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-500'"
              @click.stop="onModalidadeChange('m2')">m²</button>
            <button type="button" class="px-2.5 py-1 text-[10px] font-bold transition-all focus:outline-none"
              :class="item.modalidade_preco === 'unidade' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-500'"
              @click.stop="onModalidadeChange('unidade')">Un</button>
          </div>
          <span v-if="item.modalidade_preco === 'm2' && showPrecoOverride"
            class="inline-flex items-center gap-0.5 rounded-full bg-amber-50 border border-amber-200 px-1.5 py-0.5 text-[9px] font-bold text-amber-600">
            <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
            Custom
          </span>
        </div>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">R$</span>
          <input
            :value="item.modalidade_preco === 'm2' ? precoM2Atual : item.preco_unitario"
            type="number" step="0.01" min="0.01"
            :placeholder="item.modalidade_preco === 'm2' ? 'Preço/m²' : 'Preço/un'"
            class="w-full rounded-lg border pl-9 pr-3 py-2 text-sm font-medium text-gray-800 bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
            :class="(errors.preco_m2 || errors.preco_unitario) ? 'border-red-300' : showPrecoOverride && item.modalidade_preco === 'm2' ? 'border-amber-200' : 'border-gray-200'"
            @input="item.modalidade_preco === 'm2' ? onPrecoM2Input($event) : onPrecoUnitarioInput($event)" />
        </div>
        <p v-if="errors.preco_m2 || errors.preco_unitario" class="text-[11px] text-red-500 font-medium">{{ errors.preco_m2 || errors.preco_unitario }}</p>
      </div>

      <!-- Cálculo resumido -->
      <div v-if="valorCalculado > 0" class="flex items-center justify-between bg-indigo-50/60 rounded-lg px-3 py-2 text-xs">
        <span class="text-gray-500">
          {{ item.modalidade_preco === 'm2' ? `${areaCalculada.toFixed(2)} m² × ${formatCurrency(precoM2Atual)}` : `${item.quantidade} un × ${formatCurrency(item.preco_unitario ?? 0)}` }}
        </span>
        <span class="font-bold text-indigo-700">{{ formatCurrency(valorCalculado) }}</span>
      </div>

      <!-- ═══ ANEXOS: Arte + Foto do local + Arquivo ═══ -->
      <div class="space-y-2 pt-1">
        <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Anexos</label>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <FotoUpload
            ref="fotoArteRef"
            :model-value="item.foto_arte_url ?? null"
            label="Arte"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            :max-size-mb="10"
            :storage-path="storagePathArte"
            @file-selected="onFotoArteSelected"
            @file-removed="onFotoArteRemoved"
            @update:model-value="onFotoArteUrlUpdate"
          />
          <FotoUpload
            ref="fotoLocalRef"
            :model-value="item.foto_local_url ?? null"
            label="Local"
            accept="image/jpeg,image/png,image/webp"
            :max-size-mb="5"
            :storage-path="storagePathLocal"
            @file-selected="onFotoLocalSelected"
            @file-removed="onFotoLocalRemoved"
            @update:model-value="onFotoLocalUrlUpdate"
          />
        </div>
        <!-- Arquivo adicional (PDF, DOC, etc.) -->
        <FotoUpload
          ref="fotoArquivoRef"
          :model-value="item.arquivo_url ?? null"
          label="Arquivo"
          accept="application/pdf,image/jpeg,image/png,image/webp,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          :max-size-mb="15"
          :storage-path="storagePathArquivo"
          @file-selected="onArquivoSelected"
          @file-removed="onArquivoRemoved"
          @update:model-value="onArquivoUrlUpdate"
        />
      </div>
    </div>

    <!-- Modal de seleção de material -->
    <MaterialSelectorModal
      :show="showMaterialModal"
      :materiais="materiais"
      :current-material-id="item.material_id || null"
      @close="showMaterialModal = false"
      @select="onMaterialSelected"
    />
  </div>
</template>

<script setup lang="ts">
import type { ItemOrcamento } from '~/composables/useOrcamentos'
import FotoUpload from '~/components/FotoUpload.vue'
import MaterialSelectorModal from '~/components/MaterialSelectorModal.vue'

interface Material { id: number; nome: string; preco_m2?: number }

const props = defineProps<{
  item: ItemOrcamento
  index: number
  materiais: Material[]
  empresaId?: number | null
  orcamentoId?: number | null
}>()

const emit = defineEmits<{
  (e: 'update:item', value: ItemOrcamento): void
  (e: 'remove', index: number): void
}>()

const { calcularAreaItem, calcularValorItem, isPrecoOverride, gerarPathFotoArte, gerarPathFotoLocal } = useOrcamentos()

// ─── State ───────────────────────────────────────────────────────────────────
const errors = ref<Record<string, string>>({})
const fotoArteRef = ref<any>(null)
const fotoLocalRef = ref<any>(null)
const fotoArquivoRef = ref<any>(null)
const tempItemId = ref<string>(crypto.randomUUID())
const showMaterialModal = ref(false)
const expanded = ref(true) // novo item abre expandido

// ─── Computed ────────────────────────────────────────────────────────────────
const materialSelecionado = computed(() => props.materiais.find(m => m.id === props.item.material_id))
const areaCalculada = computed(() => calcularAreaItem(props.item.largura_cm, props.item.altura_cm, props.item.quantidade))
const precoM2Atual = computed(() => props.item.preco_m2 ?? materialSelecionado.value?.preco_m2 ?? 0)
const showPrecoOverride = computed(() => {
  const precoMaterial = materialSelecionado.value?.preco_m2 ?? 0
  return precoM2Atual.value > 0 && isPrecoOverride(precoM2Atual.value, precoMaterial)
})
const valorCalculado = computed(() => calcularValorItem({ ...props.item, preco_m2: precoM2Atual.value }))

const itemIdParaPath = computed(() => props.item.id ? String(props.item.id) : tempItemId.value)
const storagePathArte = computed(() => gerarPathFotoArte(props.empresaId ?? 0, props.orcamentoId ?? 0, itemIdParaPath.value, 'jpg'))
const storagePathLocal = computed(() => gerarPathFotoLocal(props.empresaId ?? 0, props.orcamentoId ?? 0, itemIdParaPath.value, 'jpg'))
const storagePathArquivo = computed(() => `${props.empresaId ?? 0}/${props.orcamentoId ?? 0}/itens/${itemIdParaPath.value}/arquivo`)

// ─── Watchers ────────────────────────────────────────────────────────────────
watch(valorCalculado, (newVal) => {
  if (newVal !== props.item.valor_item) emitUpdate({ valor_item: newVal, area_m2: areaCalculada.value })
})

// ─── Helpers ─────────────────────────────────────────────────────────────────
function emitUpdate(partial: Partial<ItemOrcamento>) { emit('update:item', { ...props.item, ...partial }) }
function formatCurrency(val: number | null | undefined): string {
  if (val == null) return 'R$ 0,00'
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function validateField(field: string, value: number | null | undefined): string {
  if (field === 'largura_cm' || field === 'altura_cm' || field === 'espessura_cm') {
    if (value == null || isNaN(value) || value < 0.1) return 'Mín: 0.1'
    if (value > 9999.9) return 'Máx: 9999.9'
  } else if (field === 'quantidade') {
    if (value == null || isNaN(value) || value < 1) return 'Mín: 1'
    if (value > 99999) return 'Máx: 99999'
  } else if (field === 'preco_unitario') {
    if (value == null || isNaN(value) || value < 0.01) return 'Mín: R$ 0,01'
    if (value > 99999.99) return 'Máx: R$ 99.999,99'
  } else if (field === 'preco_m2') {
    if (value == null || isNaN(value) || value < 0.01) return 'Mín: R$ 0,01'
    if (value > 9999.99) return 'Máx: R$ 9.999,99'
  }
  return ''
}

// ─── Handlers ────────────────────────────────────────────────────────────────
function onMaterialSelected(mat: { id: number; nome: string; preco_m2?: number }) {
  delete errors.value.material_id
  delete errors.value.preco_m2
  emitUpdate({ material_id: mat.id, material_nome: mat.nome, preco_m2: mat.preco_m2 ?? 0 })
}

function onFieldInput(field: 'largura_cm' | 'altura_cm' | 'espessura_cm' | 'quantidade', event: Event) {
  const value = (event.target as HTMLInputElement).value === '' ? 0 : parseFloat((event.target as HTMLInputElement).value)
  const error = validateField(field, value)
  if (error) { errors.value[field] = error } else { delete errors.value[field] }
  emitUpdate({ [field]: value })
}

function onModalidadeChange(modalidade: 'm2' | 'unidade') {
  if (modalidade === 'm2') {
    delete errors.value.preco_unitario
    emitUpdate({ modalidade_preco: modalidade, preco_unitario: undefined, preco_m2: materialSelecionado.value?.preco_m2 ?? 0 })
  } else {
    delete errors.value.preco_m2
    emitUpdate({ modalidade_preco: modalidade })
  }
}

function onPrecoUnitarioInput(event: Event) {
  const value = (event.target as HTMLInputElement).value === '' ? undefined : parseFloat((event.target as HTMLInputElement).value)
  const error = validateField('preco_unitario', value)
  if (error) { errors.value.preco_unitario = error } else { delete errors.value.preco_unitario }
  emitUpdate({ preco_unitario: value })
}

function onPrecoM2Input(event: Event) {
  const value = (event.target as HTMLInputElement).value === '' ? undefined : parseFloat((event.target as HTMLInputElement).value)
  const error = validateField('preco_m2', value)
  if (error) { errors.value.preco_m2 = error } else { delete errors.value.preco_m2 }
  emitUpdate({ preco_m2: value ?? 0 })
}

// Foto handlers
function onFotoArteSelected(file: File) { emitUpdate({ foto_arte_file: file }) }
function onFotoArteRemoved() { emitUpdate({ foto_arte_url: null, foto_arte_file: null }) }
function onFotoArteUrlUpdate(url: string | null) { emitUpdate({ foto_arte_url: url }) }
function onFotoLocalSelected(file: File) { emitUpdate({ foto_local_file: file }) }
function onFotoLocalRemoved() { emitUpdate({ foto_local_url: null, foto_local_file: null }) }
function onFotoLocalUrlUpdate(url: string | null) { emitUpdate({ foto_local_url: url }) }

function onArquivoSelected(file: File) { emitUpdate({ arquivo_file: file } as any) }
function onArquivoRemoved() { emitUpdate({ arquivo_url: null, arquivo_file: null } as any) }
function onArquivoUrlUpdate(url: string | null) { emitUpdate({ arquivo_url: url } as any) }

defineExpose({ fotoArteRef, fotoLocalRef, fotoArquivoRef })
</script>
