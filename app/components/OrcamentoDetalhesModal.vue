<template>
  <Teleport to="body">
    <div
      v-if="show && orcamento"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      @click.self="emit('close')"
    >
      <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative">

        <!-- Close button -->
        <button
          type="button"
          class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
          @click="emit('close')"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Header -->
        <div class="flex items-center gap-3 mb-6">
          <h2 class="text-lg sm:text-xl font-bold text-gray-800">
            {{ orcamento.numero_orcamento ?? `#${orcamento.id}` }}
          </h2>
          <span
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
            :class="statusBadgeClass"
          >
            {{ statusDisplay.label }}
          </span>
          <span v-if="orcamento.pedido_id" class="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-200 text-gray-500">Legado</span>
        </div>

        <!-- Client info -->
        <div class="mb-6">
          <h3 class="text-xs font-black text-gray-400 uppercase tracking-[0.15em] mb-3">Dados do Cliente</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="bg-gray-50 rounded-xl px-4 py-3">
              <span class="text-[10px] font-bold text-gray-400 uppercase">Nome</span>
              <p class="text-sm font-semibold text-gray-800 mt-0.5">{{ orcamento.cliente_nome ?? '—' }}</p>
            </div>
            <div class="bg-gray-50 rounded-xl px-4 py-3">
              <span class="text-[10px] font-bold text-gray-400 uppercase">Telefone</span>
              <p class="text-sm font-semibold text-gray-800 mt-0.5">{{ orcamento.cliente_telefone ?? 'Não informado' }}</p>
</div>
            <div class="bg-gray-50 rounded-xl px-4 py-3">
              <span class="text-[10px] font-bold text-gray-400 uppercase">Validade</span>
              <p class="text-sm font-semibold mt-0.5" :class="isVencido ? 'text-red-600' : 'text-gray-800'">{{ formatDate(orcamento.data_validade) }}</p>
            </div>
          </div>
        </div>

        <!-- Items table -->
        <div class="mb-6 border-t border-gray-100 pt-6">
          <h3 class="text-xs font-black text-gray-400 uppercase tracking-[0.15em] mb-3">Itens do Orçamento</h3>
          <div v-if="loadingItens" class="flex items-center justify-center py-8">
            <span class="inline-block w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <div v-else class="overflow-x-auto rounded-xl border border-gray-200">
            <table class="w-full text-sm">
              <thead class="bg-gray-50">
                <tr>
                  <th class="text-left px-4 py-2.5 text-xs font-bold text-gray-500 uppercase">Descrição</th>
                  <th class="text-left px-4 py-2.5 text-xs font-bold text-gray-500 uppercase">Material</th>
                  <th class="text-center px-4 py-2.5 text-xs font-bold text-gray-500 uppercase">Dimensões</th>
                  <th class="text-center px-4 py-2.5 text-xs font-bold text-gray-500 uppercase">Qtd</th>
                  <th class="text-right px-4 py-2.5 text-xs font-bold text-gray-500 uppercase">Valor</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="item in itens" :key="item.id" class="hover:bg-gray-50/50">
                  <td class="px-4 py-3 text-gray-800 font-medium">
                    <div class="flex items-center gap-2">
                      <span>{{ item.descricao }}</span>
                      <a
                        v-if="item.foto_arte_url && isPdf(item.foto_arte_url)"
                        :href="item.foto_arte_url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="shrink-0"
                        title="Abrir arte (PDF)"
                      >
                        <svg class="w-5 h-5 text-red-500 hover:text-red-700 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zm-2.5 9.5a1.5 1.5 0 0 1 0 3H9v1.5H7.5v-6H10.5a1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 0 1 0 3H14v1.5h-1.5v-6H15.5a1.5 1.5 0 0 1 0 3z"/>
                        </svg>
                      </a>
                      <img
                        v-else-if="item.foto_arte_url"
                        :src="item.foto_arte_url"
                        alt="Arte do adesivo"
                        class="w-8 h-8 rounded object-cover border border-gray-200 shrink-0"
                      />
                      <img
                        v-if="item.foto_local_url && !isPdf(item.foto_local_url)"
                        :src="item.foto_local_url"
                        alt="Local de instalação"
                        class="w-8 h-8 rounded object-cover border border-green-200 shrink-0"
                        title="Foto do local de instalação"
                      />
                      <a
                        v-else-if="item.foto_local_url && isPdf(item.foto_local_url)"
                        :href="item.foto_local_url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="shrink-0"
                        title="Local de instalação (PDF)"
                      >
                        <svg class="w-5 h-5 text-green-500 hover:text-green-700 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zm-2.5 9.5a1.5 1.5 0 0 1 0 3H9v1.5H7.5v-6H10.5a1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 0 1 0 3H14v1.5h-1.5v-6H15.5a1.5 1.5 0 0 1 0 3z"/>
                        </svg>
                      </a>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-gray-600">{{ item.material_nome ?? `#${item.material_id}` }}</td>
                  <td class="px-4 py-3 text-center text-gray-600">{{ item.largura_cm }} × {{ item.altura_cm }} cm</td>
                  <td class="px-4 py-3 text-center text-gray-700 font-semibold">{{ item.quantidade }}</td>
                  <td class="px-4 py-3 text-right text-gray-800 font-semibold">{{ formatCurrency(item.valor_item) }}</td>
                </tr>
                <tr v-if="itens.length === 0">
                  <td colspan="5" class="px-4 py-6 text-center text-gray-400 text-sm">Nenhum item encontrado</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Resumo Financeiro -->
        <div class="mb-6 border-t border-gray-100 pt-6">
          <h3 class="text-xs font-black text-gray-400 uppercase tracking-[0.15em] mb-3">Resumo Financeiro</h3>
          <div class="bg-gray-50 rounded-xl p-4 space-y-2">
            <div class="flex justify-between text-sm text-gray-600">
              <span>Subtotal ({{ orcamento.quantidade_total_itens ?? itens.length }} itens)</span>
              <span class="font-medium">{{ formatCurrency(subtotalItens) }}</span>
            </div>
            <div v-if="orcamento.valor_mao_obra_global > 0" class="flex justify-between text-sm text-gray-600">
              <span>Mão de obra</span>
              <span class="font-medium">+ {{ formatCurrency(orcamento.valor_mao_obra_global) }}</span>
            </div>
            <div v-if="orcamento.desconto_volume_percentual > 0" class="flex justify-between text-sm text-green-600">
              <span>Desconto volume ({{ orcamento.desconto_volume_percentual }}%)</span>
              <span class="font-medium">- {{ formatCurrency(descontoVolumeValor) }}</span>
            </div>
            <div v-if="orcamento.desconto_percentual > 0" class="flex justify-between text-sm text-green-600">
              <span>Desconto manual ({{ orcamento.desconto_percentual }}%)</span>
              <span class="font-medium">- {{ formatCurrency(descontoManualPercValor) }}</span>
            </div>
            <div v-if="orcamento.desconto_valor > 0" class="flex justify-between text-sm text-green-600">
              <span>Desconto valor fixo</span>
              <span class="font-medium">- {{ formatCurrency(orcamento.desconto_valor) }}</span>
            </div>
            <div class="border-t border-gray-200 pt-2 mt-2 flex justify-between">
              <span class="text-base font-bold text-gray-800">Total</span>
              <span class="text-xl font-black text-indigo-700">{{ formatCurrency(orcamento.valor_total) }}</span>
            </div>
          </div>
        </div>

        <!-- OS vinculada -->
        <div v-if="orcamento.os_numero" class="mb-6 border-t border-gray-100 pt-6">
          <h3 class="text-xs font-black text-gray-400 uppercase tracking-[0.15em] mb-3">Ordem de Serviço Vinculada</h3>
          <div class="flex items-center gap-3">
            <OSIndicadorBadge
              :numero-os="orcamento.os_numero"
              :status="orcamento.os_status"
              @click="emit('openOS')"
            />
            <span class="text-sm text-gray-500">Clique para ver detalhes da OS</span>
          </div>
        </div>

        <!-- ═══════ AÇÕES (Task 8.3) ═══════ -->
        <div v-if="!orcamento.os_numero && statusDisplay.status !== 'rejeitado'" class="border-t border-gray-100 pt-6">
          <h3 class="text-xs font-black text-gray-400 uppercase tracking-[0.15em] mb-4">Ações</h3>

          <!-- Toast de sucesso -->
          <div v-if="toastMessage" class="mb-4 p-3 rounded-xl text-sm font-medium" :class="toastType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'">
            {{ toastMessage }}
          </div>

          <div class="flex flex-wrap gap-3">
            <!-- Gerar Link -->
            <button
              type="button"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors"
              :disabled="processando"
              @click="gerarLinkAprovacao"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.06a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.34 8.374" /></svg>
              Gerar Link
            </button>

            <!-- Enviar WhatsApp -->
            <button
              type="button"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors"
              :disabled="processando"
              @click="iniciarEnvioWhatsApp"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492l4.634-1.215A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-2.168 0-4.19-.586-5.932-1.609l-.424-.255-4.398 1.154 1.174-4.293-.279-.443A9.785 9.785 0 012.182 12c0-5.423 4.395-9.818 9.818-9.818 5.423 0 9.818 4.395 9.818 9.818 0 5.423-4.395 9.818-9.818 9.818z"/></svg>
              Enviar WhatsApp
            </button>

            <!-- Aprovar Internamente -->
            <button
              type="button"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
              :disabled="processando"
              @click="showAprovacaoInterna = true"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              Aprovar Internamente
            </button>
          </div>

          <!-- Link gerado (exibição) -->
          <div v-if="linkGerado" class="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
            <label class="text-[10px] font-black text-indigo-400 uppercase tracking-[0.15em] mb-2 block">Link de Aprovação</label>
            <div class="flex items-center gap-2">
              <input
                type="text"
                :value="linkGerado"
                readonly
                class="flex-1 rounded-lg border border-indigo-200 bg-white px-3 py-2 text-xs text-gray-700 font-mono"
              />
              <button
                type="button"
                class="px-3 py-2 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                @click="copiarLink"
              >
                {{ linkCopiado ? '✓ Copiado' : 'Copiar' }}
              </button>
            </div>
          </div>

          <!-- Campo telefone manual (WhatsApp) -->
          <div v-if="showTelefoneManual" class="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
            <label class="text-[10px] font-black text-green-600 uppercase tracking-[0.15em] mb-2 block">Telefone do cliente (DDD + número)</label>
            <div class="flex items-center gap-2">
              <input
                v-model="telefoneManual"
                type="tel"
                placeholder="Ex: 11999998888"
                class="flex-1 rounded-lg border border-green-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-green-400"
              />
              <button
                type="button"
                class="px-4 py-2.5 rounded-lg text-sm font-bold bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                :disabled="!telefoneValido"
                @click="enviarWhatsApp(telefoneManual)"
              >
                Enviar
              </button>
            </div>
            <p v-if="telefoneManual && !telefoneValido" class="text-xs text-red-500 mt-1">Formato inválido. Use 10 ou 11 dígitos (DDD + número).</p>
          </div>

          <!-- Modal Aprovação Interna -->
          <div v-if="showAprovacaoInterna" class="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
            <label class="text-[10px] font-black text-emerald-600 uppercase tracking-[0.15em] mb-2 block">Forma de Pagamento</label>
            <div class="flex items-end gap-3">
              <select
                v-model="formaPagamentoAprovacao"
                class="flex-1 rounded-lg border border-emerald-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400"
              >
                <option value="" disabled>Selecione a forma de pagamento...</option>
                <option value="dinheiro">Dinheiro</option>
                <option value="pix">PIX</option>
                <option value="cartao">Cartão</option>
                <option value="boleto">Boleto</option>
                <option value="parcelado">Parcelado</option>
              </select>
              <button
                type="button"
                class="px-5 py-2.5 rounded-lg text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-50 shadow-sm"
                :disabled="!formaPagamentoAprovacao || processando"
                @click="aprovarInternamente"
              >
                <span v-if="processando" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span v-else>Confirmar Aprovação</span>
              </button>
              <button
                type="button"
                class="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                @click="showAprovacaoInterna = false"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { createSupabaseClient } from '~/lib/supabase'
import type { StatusOS } from '~/composables/useOrdensServico'
import OSIndicadorBadge from '~/components/OSIndicadorBadge.vue'

// ─── Types ───────────────────────────────────────────────────────────────────
interface OrcamentoDetalhe {
  id: number
  pedido_id: number | null
  numero_orcamento: string | null
  cliente_id: number | null
  cliente_nome: string | null
  cliente_telefone: string | null
  quantidade_total_itens: number | null
  valor_total: number
  valor_mao_obra_global: number
  desconto_volume_percentual: number
  desconto_percentual: number
  desconto_valor: number
  created_at: string
  data_validade: string
  status: string
  token_aprovacao: string | null
  prazo_estimado_dias: number | null
  os_numero: string | null
  os_status: StatusOS | null
}

interface ItemOrcamentoDetalhe {
  id: number
  descricao: string
  material_id: number
  material_nome?: string
  largura_cm: number
  altura_cm: number
  quantidade: number
  modalidade_preco: string
  preco_unitario: number | null
  area_m2: number | null
  valor_item: number
  foto_arte_url: string | null
  foto_local_url: string | null
}

// ─── Props ───────────────────────────────────────────────────────────────────
const props = defineProps<{
  show: boolean
  orcamento: OrcamentoDetalhe | null
}>()

// ─── Emits ───────────────────────────────────────────────────────────────────
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'openOS'): void
  (e: 'refresh'): void
}>()

// ─── Composables ─────────────────────────────────────────────────────────────
const supabase = createSupabaseClient()
const {
  comporMensagemWhatsAppMultiItens,
  comporLinkWhatsApp,
  comporLinkAprovacao,
  validarTelefone,
  truncarDescricao,
  classificarStatusOrcamentoV2,
} = useOrcamentos()

// ─── State ───────────────────────────────────────────────────────────────────
const itens = ref<ItemOrcamentoDetalhe[]>([])
const loadingItens = ref(false)
const processando = ref(false)
const linkGerado = ref('')
const linkCopiado = ref(false)
const showTelefoneManual = ref(false)
const telefoneManual = ref('')
const showAprovacaoInterna = ref(false)
const formaPagamentoAprovacao = ref('')
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

// ─── Computed ────────────────────────────────────────────────────────────────
const statusDisplay = computed(() => {
  if (!props.orcamento) return { status: 'rascunho', label: 'Rascunho', cor: 'gray' }
  return classificarStatusOrcamentoV2(
    props.orcamento.status as any,
    props.orcamento.data_validade
  )
})

const statusBadgeClass = computed(() => {
  const colorMap: Record<string, string> = {
    rascunho: 'bg-gray-100 text-gray-600',
    enviado: 'bg-blue-50 text-blue-700 border border-blue-200',
    aprovado: 'bg-green-50 text-green-700 border border-green-200',
    rejeitado: 'bg-red-50 text-red-700 border border-red-200',
    vencido: 'bg-orange-50 text-orange-700 border border-orange-200',
  }
  return colorMap[statusDisplay.value.status] ?? 'bg-gray-100 text-gray-600'
})

const isVencido = computed(() => statusDisplay.value.status === 'vencido')

const subtotalItens = computed(() => {
  return itens.value.reduce((sum, item) => sum + item.valor_item, 0)
})

const descontoVolumeValor = computed(() => {
  if (!props.orcamento) return 0
  const sub = subtotalItens.value + (props.orcamento.valor_mao_obra_global ?? 0)
  return sub * ((props.orcamento.desconto_volume_percentual ?? 0) / 100)
})

const descontoManualPercValor = computed(() => {
  if (!props.orcamento) return 0
  const sub = subtotalItens.value + (props.orcamento.valor_mao_obra_global ?? 0)
  const aposVolume = sub - descontoVolumeValor.value
  return aposVolume * ((props.orcamento.desconto_percentual ?? 0) / 100)
})

const telefoneValido = computed(() => {
  return validarTelefone(telefoneManual.value)
})

// ─── Watchers ────────────────────────────────────────────────────────────────
watch(
  () => props.show,
  (newVal) => {
    if (newVal && props.orcamento) {
      fetchItens()
      resetState()
    }
  }
)

// ─── Methods ─────────────────────────────────────────────────────────────────
function resetState() {
  linkGerado.value = ''
  linkCopiado.value = false
  showTelefoneManual.value = false
  telefoneManual.value = ''
  showAprovacaoInterna.value = false
  formaPagamentoAprovacao.value = ''
  toastMessage.value = ''
}

async function fetchItens() {
  if (!props.orcamento) return
  loadingItens.value = true
  try {
    const { data, error } = await supabase
      .from('itens_orcamento')
      .select('id, descricao, material_id, largura_cm, altura_cm, quantidade, modalidade_preco, preco_unitario, area_m2, valor_item, foto_arte_url, foto_local_url, materiais_adesivo(nome)')
      .eq('orcamento_id', props.orcamento.id)
      .order('id', { ascending: true })

    if (error) {
      console.error('Erro ao buscar itens:', error)
      return
    }

    itens.value = (data ?? []).map((row: any) => ({
      id: row.id,
      descricao: row.descricao,
      material_id: row.material_id,
      material_nome: row.materiais_adesivo?.nome ?? null,
      largura_cm: row.largura_cm,
      altura_cm: row.altura_cm,
      quantidade: row.quantidade,
      modalidade_preco: row.modalidade_preco,
      preco_unitario: row.preco_unitario,
      area_m2: row.area_m2,
      valor_item: row.valor_item,
      foto_arte_url: row.foto_arte_url ?? null,
      foto_local_url: row.foto_local_url ?? null,
    }))
  } finally {
    loadingItens.value = false
  }
}

function showToast(message: string, type: 'success' | 'error' = 'success') {
  toastMessage.value = message
  toastType.value = type
  setTimeout(() => { toastMessage.value = '' }, 4000)
}

async function atualizarStatusParaEnviado() {
  if (!props.orcamento || props.orcamento.status !== 'rascunho') return
  try {
    // Buscar etapa "Enviado" do pipeline de orçamentos
    const { data: etapaData } = await supabase
      .from('pipeline_etapas')
      .select('id')
      .eq('pipeline_tipo', 'orcamentos')
      .eq('nome', 'Enviado')
      .limit(1)
      .single()

    const updatePayload: Record<string, unknown> = { status: 'enviado' }
    if (etapaData) {
      updatePayload.etapa_id = etapaData.id
    }

    await supabase
      .from('orcamentos_adesivo')
      .update(updatePayload)
      .eq('id', props.orcamento.id)
  } catch (err) {
    console.error('Erro ao atualizar status para enviado:', err)
  }
}

// ─── Gerar Link de Aprovação ─────────────────────────────────────────────────
async function gerarLinkAprovacao() {
  if (!props.orcamento) return
  processando.value = true
  try {
    const newToken = crypto.randomUUID()

    const { error } = await supabase
      .from('orcamentos_adesivo')
      .update({ token_aprovacao: newToken })
      .eq('id', props.orcamento.id)

    if (error) {
      showToast('Erro ao gerar token de aprovação.', 'error')
      console.error(error)
      return
    }

    // If status is rascunho, update to enviado
    await atualizarStatusParaEnviado()

    // Compose link
    const baseUrl = window.location.origin
    linkGerado.value = comporLinkAprovacao(baseUrl, newToken)
    showToast('Link de aprovação gerado com sucesso!')
    emit('refresh')
  } catch (err) {
    showToast('Erro inesperado ao gerar link.', 'error')
    console.error(err)
  } finally {
    processando.value = false
  }
}

// ─── Copiar Link ─────────────────────────────────────────────────────────────
async function copiarLink() {
  try {
    await navigator.clipboard.writeText(linkGerado.value)
    linkCopiado.value = true
    setTimeout(() => { linkCopiado.value = false }, 2000)
  } catch (err) {
    console.error('Erro ao copiar para clipboard:', err)
  }
}

// ─── Envio WhatsApp ──────────────────────────────────────────────────────────
async function iniciarEnvioWhatsApp() {
  if (!props.orcamento) return

  const telefone = props.orcamento.cliente_telefone
  if (!telefone || !validarTelefone(telefone)) {
    // Client has no phone, show manual input
    showTelefoneManual.value = true
    return
  }

  await enviarWhatsApp(telefone)
}

async function enviarWhatsApp(telefone: string) {
  if (!props.orcamento) return
  processando.value = true
  try {
    // Ensure we have a token/link first
    let token = props.orcamento.token_aprovacao
    if (!token) {
      token = crypto.randomUUID()
      const { error } = await supabase
        .from('orcamentos_adesivo')
        .update({ token_aprovacao: token })
        .eq('id', props.orcamento.id)

      if (error) {
        showToast('Erro ao gerar token para o link.', 'error')
        console.error(error)
        return
      }
    }

    // If status is rascunho, update to enviado
    await atualizarStatusParaEnviado()

    // Compose link
    const baseUrl = window.location.origin
    const linkAprovacao = comporLinkAprovacao(baseUrl, token)

    // Compose WhatsApp message
    const descricaoResumida = itens.value.length > 0
      ? truncarDescricao(itens.value.map(i => i.descricao).join(', '), 80)
      : 'Adesivos personalizados'

    const mensagem = comporMensagemWhatsAppMultiItens({
      nomeCliente: props.orcamento.cliente_nome ?? 'Cliente',
      quantidadeItens: props.orcamento.quantidade_total_itens ?? itens.value.length,
      descricaoResumida,
      valorTotal: props.orcamento.valor_total,
      validade: formatDate(props.orcamento.data_validade),
      linkAprovacao,
    })

    // Build WhatsApp link and open
    const waLink = comporLinkWhatsApp(telefone, mensagem)
    window.open(waLink, '_blank')

    showTelefoneManual.value = false
    showToast('WhatsApp aberto em nova aba!')
    emit('refresh')
  } catch (err) {
    showToast('Erro ao preparar envio WhatsApp.', 'error')
    console.error(err)
  } finally {
    processando.value = false
  }
}

// ─── Aprovação Interna ───────────────────────────────────────────────────────
async function aprovarInternamente() {
  if (!props.orcamento || !formaPagamentoAprovacao.value) return
  processando.value = true
  try {
    const { data, error } = await supabase.rpc('gerar_ordem_servico', {
      p_orcamento_id: props.orcamento.id,
      p_forma_pagamento: formaPagamentoAprovacao.value,
      p_origem: 'interno',
    })

    if (error) {
      showToast(`Erro na aprovação: ${error.message}`, 'error')
      console.error('Erro RPC gerar_ordem_servico:', error)
      return
    }

    showAprovacaoInterna.value = false
    showToast('Orçamento aprovado! Ordem de Serviço gerada com sucesso.')
    emit('refresh')
  } catch (err: any) {
    showToast(`Erro inesperado: ${err?.message ?? 'Tente novamente.'}`, 'error')
    console.error(err)
  } finally {
    processando.value = false
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatCurrency(val: number | null | undefined): string {
  if (val == null) return 'R$ 0,00'
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('pt-BR')
}

function isPdf(url: string | null | undefined): boolean {
  if (!url) return false
  return url.toLowerCase().endsWith('.pdf')
}
</script>
