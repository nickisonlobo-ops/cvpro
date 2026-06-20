<template>
  <Teleport to="body">
    <transition name="modal">
      <div v-if="show && ordemServico" class="fixed inset-0 z-50 flex flex-col" @click.self="emit('close')">
        <!-- Backdrop com blur -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="emit('close')" />

        <!-- Modal container: full-screen mobile, centered desktop -->
        <div class="relative z-10 flex flex-col w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-2xl sm:mx-auto sm:my-auto sm:rounded-2xl bg-white overflow-hidden shadow-2xl">

          <!-- ═══ STICKY HEADER ═══ -->
          <div class="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
            <div class="flex items-center gap-3 min-w-0">
              <h2 class="text-base sm:text-lg font-bold text-gray-900 truncate">{{ ordemServico.numero_os }}</h2>
              <span
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap"
                :class="statusBadgeClasses"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="statusDotClass" />
                {{ statusLabel }}
              </span>
            </div>
            <button
              type="button"
              class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              @click="emit('close')"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- ═══ SCROLLABLE CONTENT ═══ -->
          <div class="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-6">

            <!-- NOME DO TRABALHO (em destaque) -->
            <div v-if="ordemServico.nome_trabalho" class="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl px-4 py-3">
              <p class="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-0.5">Trabalho</p>
              <p class="text-base sm:text-lg font-bold text-indigo-700">{{ ordemServico.nome_trabalho }}</p>
            </div>

            <!-- CLIENTE SECTION -->
            <div>
              <h3 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-3">Cliente</h3>
              <div class="bg-gray-50 rounded-xl p-4 space-y-2">
                <div class="flex items-center justify-between gap-3">
                  <div class="min-w-0">
                    <p class="text-sm font-bold text-gray-800 truncate">{{ ordemServico.cliente_nome || 'Cliente' }}</p>
                    <p v-if="ordemServico.cliente_telefone" class="text-xs text-gray-500 mt-0.5">{{ ordemServico.cliente_telefone }}</p>
                  </div>
                  <!-- WhatsApp Button -->
                  <a
                    v-if="whatsappLink"
                    :href="whatsappLink"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white text-xs font-bold transition-colors shadow-sm flex-shrink-0"
                  >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>

            <!-- ENDEREÇO DE INSTALAÇÃO -->
            <div v-if="ordemServico.endereco_instalacao">
              <h3 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-3">Endereço de Instalação</h3>
              <div class="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
                <svg class="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <p class="text-sm text-gray-700">{{ ordemServico.endereco_instalacao }}</p>
              </div>
            </div>

            <!-- ITENS DA OS (Expandable Cards) -->
            <div>
              <h3 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-3">Itens da OS</h3>
              <div v-if="itensOS.length === 0" class="text-center py-8">
                <p class="text-sm text-gray-400">Nenhum item encontrado</p>
              </div>
              <div class="space-y-3">
                <div
                  v-for="(item, idx) in itensOS"
                  :key="item.id"
                  class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
                >
                  <!-- Card Header -->
                  <div class="flex items-center justify-between px-4 py-3">
                    <div class="flex items-center gap-3 min-w-0">
                      <span class="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 text-[10px] font-black flex items-center justify-center flex-shrink-0">{{ idx + 1 }}</span>
                      <span class="text-sm font-semibold text-gray-800 truncate">{{ item.descricao }}</span>
                    </div>
                    <span class="text-sm font-bold text-gray-700 flex-shrink-0">{{ formatCurrency(item.valor_item) }}</span>
                  </div>

                  <!-- Card Body (sempre visível) -->
                  <div class="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div class="bg-gray-50 rounded-lg px-3 py-2">
                        <span class="text-[10px] font-bold text-gray-400 uppercase block">Material</span>
                        <span class="text-gray-700 font-semibold">{{ item.material_id }}</span>
                      </div>
                      <div class="bg-gray-50 rounded-lg px-3 py-2">
                        <span class="text-[10px] font-bold text-gray-400 uppercase block">Dimensões</span>
                        <span class="text-gray-700 font-semibold">{{ item.largura_cm }} × {{ item.altura_cm }} cm</span>
                      </div>
                      <div class="bg-gray-50 rounded-lg px-3 py-2">
                        <span class="text-[10px] font-bold text-gray-400 uppercase block">Quantidade</span>
                        <span class="text-gray-700 font-semibold">{{ item.quantidade }}</span>
                      </div>
                      <div class="bg-gray-50 rounded-lg px-3 py-2">
                        <span class="text-[10px] font-bold text-gray-400 uppercase block">Valor</span>
                        <span class="text-gray-700 font-semibold">{{ formatCurrency(item.valor_item) }}</span>
                      </div>
                    </div>

                    <!-- Fotos -->
                    <div v-if="item.foto_arte_url || item.foto_local_url || item.arquivo_url" class="flex flex-wrap gap-3 pt-1">
                      <!-- Foto Arte -->
                      <div v-if="item.foto_arte_url && !isPdf(item.foto_arte_url)" class="flex flex-col items-center gap-1">
                        <button type="button" @click="openLightbox(item.foto_arte_url!)" class="group">
                          <img
                            :src="item.foto_arte_url"
                            alt="Arte"
                            class="w-48 h-48 rounded-lg object-cover border-2 border-indigo-100 group-hover:border-indigo-400 transition-colors shadow-sm"
                          />
                        </button>
                        <span class="text-[9px] font-bold text-gray-400 uppercase">Arte</span>
                      </div>
                      <a v-else-if="item.foto_arte_url && isPdf(item.foto_arte_url)" :href="item.foto_arte_url" target="_blank" rel="noopener noreferrer" class="flex flex-col items-center gap-1">
                        <div class="w-48 h-48 rounded-lg border-2 border-red-100 bg-red-50 flex items-center justify-center hover:border-red-300 transition-colors">
                          <svg class="w-7 h-7 text-red-400" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4z"/></svg>
                        </div>
                        <span class="text-[9px] font-bold text-gray-400 uppercase">Arte (PDF)</span>
                      </a>

                      <!-- Foto Local -->
                      <div v-if="item.foto_local_url && !isPdf(item.foto_local_url)" class="flex flex-col items-center gap-1">
                        <button type="button" @click="openLightbox(item.foto_local_url!)" class="group">
                          <img
                            :src="item.foto_local_url"
                            alt="Local"
                            class="w-48 h-48 rounded-lg object-cover border-2 border-green-100 group-hover:border-green-400 transition-colors shadow-sm"
                          />
                        </button>
                        <span class="text-[9px] font-bold text-gray-400 uppercase">Local</span>
                      </div>
                      <a v-else-if="item.foto_local_url && isPdf(item.foto_local_url)" :href="item.foto_local_url" target="_blank" rel="noopener noreferrer" class="flex flex-col items-center gap-1">
                        <div class="w-48 h-48 rounded-lg border-2 border-green-100 bg-green-50 flex items-center justify-center hover:border-green-300 transition-colors">
                          <svg class="w-7 h-7 text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4z"/></svg>
                        </div>
                        <span class="text-[9px] font-bold text-gray-400 uppercase">Local (PDF)</span>
                      </a>

                      <!-- Arquivo Anexo -->
                      <a v-if="item.arquivo_url" :href="item.arquivo_url" target="_blank" rel="noopener noreferrer" class="flex flex-col items-center gap-1">
                        <div class="w-16 h-16 rounded-lg border-2 border-purple-100 bg-purple-50 flex items-center justify-center hover:border-purple-300 transition-colors">
                          <svg class="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                          </svg>
                        </div>
                        <span class="text-[9px] font-bold text-gray-400 uppercase">Arquivo</span>
                      </a>
                    </div>

                    <!-- Fotos da Instalação Feita (múltiplas por item) -->
                    <div class="pt-2">
                      <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Fotos da Instalação Feita</label>
                      <!-- Grid de fotos existentes -->
                      <div class="flex flex-wrap gap-2 mb-2">
                        <div v-for="(fotoUrl, fIdx) in getInstalacaoFotos(item.id)" :key="fIdx" class="relative group">
                          <button type="button" @click="openLightbox(fotoUrl)" class="block">
                            <img :src="fotoUrl" alt="Instalação" class="w-20 h-20 rounded-lg object-cover border-2 border-emerald-100 group-hover:border-emerald-400 transition-colors shadow-sm" />
                          </button>
                          <button type="button" @click="removerFotoInstalacao(item.id, fIdx)" class="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                        <!-- Botão adicionar foto -->
                        <label class="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-colors">
                          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                          <span class="text-[9px] text-gray-400 font-bold mt-0.5">Foto</span>
                          <input type="file" accept="image/jpeg,image/png,image/webp" class="hidden" @change="onAddFotoInstalacao(item.id, $event)" />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- VALOR TOTAL -->
            <div class="bg-indigo-50 rounded-xl border border-indigo-200 p-4">
              <div class="flex items-center justify-between">
                <span class="text-sm font-bold text-indigo-700">Valor Total</span>
                <span class="text-xl font-black text-indigo-700">{{ formatCurrency(ordemServico.valor_total) }}</span>
              </div>
            </div>

            <!-- STATUS TRANSITION BUTTONS -->
            <div v-if="nextEtapa">
              <h3 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-3">Avançar Etapa</h3>
              <button
                type="button"
                :disabled="atualizandoStatus"
                class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                :class="nextStatusButtonClass"
                :style="nextStatusButtonStyle"
                @click="avancarStatus"
              >
                <span v-if="atualizandoStatus" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
                {{ nextStatusLabel }}
              </button>
            </div>

            <!-- OBSERVAÇÕES -->
            <div>
              <h3 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-3">Observações / Comentários</h3>
              <textarea
                v-model="observacoes"
                rows="3"
                placeholder="Adicione notas ou comentários sobre esta OS..."
                class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all resize-none"
              />
              <div class="flex justify-end mt-2">
                <button
                  type="button"
                  :disabled="salvandoObs"
                  class="px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                  @click="salvarObservacoes"
                >
                  <span v-if="salvandoObs" class="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span v-else>Salvar Observações</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </transition>

    <!-- PHOTO LIGHTBOX -->
    <transition name="fade">
      <div
        v-if="lightboxUrl"
        class="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm"
        @click="closeLightbox"
      >
        <button
          type="button"
          class="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
          @click.stop="closeLightbox"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img
          :src="lightboxUrl"
          alt="Foto em tela cheia"
          class="max-w-[95vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
          @click.stop
        />
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { createSupabaseClient } from '~/lib/supabase'
import type { OrdemServico, ItemOS, StatusOS } from '~/composables/useOrdensServico'

// ─── Props ───────────────────────────────────────────────────────────────────
const props = defineProps<{
  show: boolean
  ordemServico: (OrdemServico & { cliente_nome?: string | null; cliente_telefone?: string | null; endereco_instalacao?: string | null; nome_trabalho?: string | null }) | null
  itensOS: ItemOS[]
}>()

// ─── Emits ───────────────────────────────────────────────────────────────────
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'statusUpdated', os: OrdemServico): void
  (e: 'pagamentoUpdated', os: OrdemServico): void
}>()

// ─── Composables ─────────────────────────────────────────────────────────────
const { atualizarStatusOS } = useOrdensServico()
const { empresaId } = useEmpresa()
const supabase = createSupabaseClient()

// ─── State ───────────────────────────────────────────────────────────────────
const expandedItems = ref<number[]>([])
const lightboxUrl = ref<string | null>(null)
const observacoes = ref('')
const salvandoObs = ref(false)
const atualizandoStatus = ref(false)
const instalacaoFotosMap = ref<Record<number, string[]>>({})

// ─── Watchers ────────────────────────────────────────────────────────────────
watch(() => props.ordemServico, (os) => {
  if (os) {
    observacoes.value = os.observacoes || ''
    expandedItems.value = []
    // Inicializar fotos de instalação existentes por item
    instalacaoFotosMap.value = {}
    for (const item of props.itensOS) {
      if (item.foto_instalacao_url) {
        try {
          const parsed = JSON.parse(item.foto_instalacao_url)
          instalacaoFotosMap.value[item.id] = Array.isArray(parsed) ? parsed : [item.foto_instalacao_url]
        } catch {
          instalacaoFotosMap.value[item.id] = [item.foto_instalacao_url]
        }
      } else {
        instalacaoFotosMap.value[item.id] = []
      }
    }
  }
}, { immediate: true })

// ─── Status config ───────────────────────────────────────────────────────────
const statusConfig: Record<StatusOS, { bg: string; text: string; dot: string; label: string }> = {
  aguardando_producao: { bg: 'bg-amber-50 border border-amber-200', text: 'text-amber-700', dot: 'bg-amber-400', label: 'Aguardando Produção' },
  em_producao: { bg: 'bg-blue-50 border border-blue-200', text: 'text-blue-700', dot: 'bg-blue-400', label: 'Em Produção' },
  pronto: { bg: 'bg-green-50 border border-green-200', text: 'text-green-700', dot: 'bg-green-400', label: 'Pronto' },
  entregue: { bg: 'bg-emerald-50 border border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-400', label: 'Entregue' },
  cancelado: { bg: 'bg-red-50 border border-red-200', text: 'text-red-700', dot: 'bg-red-400', label: 'Cancelado' },
}

// ─── Computed ────────────────────────────────────────────────────────────────
const statusLabel = computed(() => {
  if (!props.ordemServico) return ''
  // Usar nome da etapa do kanban se disponível
  if (etapaAtual.value) return etapaAtual.value.nome
  return statusConfig[props.ordemServico.status]?.label ?? props.ordemServico.status
})

const statusBadgeClasses = computed(() => {
  if (!props.ordemServico) return ''
  const config = statusConfig[props.ordemServico.status]
  return `${config.bg} ${config.text}`
})

const statusDotClass = computed(() => {
  if (!props.ordemServico) return ''
  return statusConfig[props.ordemServico.status]?.dot ?? 'bg-gray-400'
})

const whatsappLink = computed(() => {
  const tel = props.ordemServico?.cliente_telefone
  if (!tel) return null
  const digits = tel.replace(/\D/g, '')
  if (!digits) return null
  return `https://wa.me/55${digits}`
})

const nextStatus = computed<StatusOS | null>(() => {
  if (!props.ordemServico) return null
  if (!nextEtapa.value) return null
  // Determinar status baseado na posição/is_final (não no nome)
  if (nextEtapa.value.is_final) return 'entregue'
  if (nextEtapa.value.posicao === 0) return 'aguardando_producao'
  return 'em_producao'
})

// ─── Etapas do Kanban (dinâmicas) ────────────────────────────────────────────
const etapasProducao = ref<any[]>([])

// Carregar etapas do pipeline de produção
watch(() => props.show, async (show) => {
  if (show && etapasProducao.value.length === 0) {
    try {
      const { data } = await supabase
        .from('pipeline_etapas')
        .select('id, nome, posicao, is_final, cor')
        .eq('pipeline_tipo', 'producao')
        .order('posicao', { ascending: true })
      etapasProducao.value = data ?? []
    } catch (e) {
      console.warn('[OSDetalhesModal] Erro ao carregar etapas:', e)
    }
  }
}, { immediate: true })

// Etapa atual da OS no kanban
const etapaAtual = computed(() => {
  if (!props.ordemServico) return null
  const osEtapaId = (props.ordemServico as any).etapa_id
  if (osEtapaId) {
    return etapasProducao.value.find(e => e.id === osEtapaId) ?? null
  }
  // Fallback: mapear pelo status
  const statusToNome: Record<string, string> = {
    aguardando_producao: 'Aguardando',
    em_producao: 'Em Produção',
    pronto: 'Pronto',
    entregue: 'Entregue',
  }
  const nome = statusToNome[props.ordemServico.status]
  return etapasProducao.value.find(e => e.nome === nome) ?? null
})

// Próxima etapa no kanban (baseada na posição)
const nextEtapa = computed(() => {
  if (!etapaAtual.value || etapaAtual.value.is_final) return null
  const posicaoAtual = etapaAtual.value.posicao
  return etapasProducao.value.find(e => e.posicao === posicaoAtual + 1) ?? null
})

const nextStatusLabel = computed(() => {
  if (!nextEtapa.value) return ''
  return `Mover para ${nextEtapa.value.nome}`
})

const nextStatusButtonClass = computed(() => {
  if (!nextEtapa.value) return ''
  // Usar a cor da próxima etapa como cor do botão
  return 'hover:opacity-90'
})

const nextStatusButtonStyle = computed(() => {
  if (!nextEtapa.value) return {}
  return { background: nextEtapa.value.cor || '#374151' }
})

// ─── Methods ─────────────────────────────────────────────────────────────────
function toggleItem(idx: number) {
  const i = expandedItems.value.indexOf(idx)
  if (i === -1) {
    expandedItems.value.push(idx)
  } else {
    expandedItems.value.splice(i, 1)
  }
}

function openLightbox(url: string) {
  lightboxUrl.value = url
}

function closeLightbox() {
  lightboxUrl.value = null
}

async function onFotoInstalacaoItemUpdated(itemId: number, url: string | null) {
  try {
    await supabase
      .from('itens_ordem_servico')
      .update({ foto_instalacao_url: url })
      .eq('id', itemId)
  } catch (err) {
    console.error('Erro ao salvar foto da instalação:', err)
  }
}

function getInstalacaoFotos(itemId: number): string[] {
  return instalacaoFotosMap.value[itemId] ?? []
}

async function onAddFotoInstalacao(itemId: number, event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  input.value = ''

  // Validar
  if (file.size > 10 * 1024 * 1024) {
    console.error('Arquivo muito grande')
    return
  }

  // Upload
  const empId = empresaId.value ?? 0
  const osId = props.ordemServico?.id ?? 0
  const idx = (instalacaoFotosMap.value[itemId]?.length ?? 0) + 1
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${empId}/${osId}/itens/${itemId}/instalacao-${idx}.${ext}`

  const { data, error } = await supabase.storage
    .from('orcamentos')
    .upload(path, file, { cacheControl: '3600', upsert: true })

  if (error) {
    console.error('Erro no upload da foto de instalação:', error)
    return
  }

  const { data: urlData } = supabase.storage.from('orcamentos').getPublicUrl(data.path)
  const publicUrl = urlData.publicUrl

  // Adicionar ao array local
  if (!instalacaoFotosMap.value[itemId]) instalacaoFotosMap.value[itemId] = []
  instalacaoFotosMap.value[itemId].push(publicUrl)

  // Persistir array JSON no banco
  await salvarFotosInstalacaoItem(itemId)
}

async function removerFotoInstalacao(itemId: number, fotoIdx: number) {
  const fotos = instalacaoFotosMap.value[itemId]
  if (!fotos) return
  fotos.splice(fotoIdx, 1)
  await salvarFotosInstalacaoItem(itemId)
}

async function salvarFotosInstalacaoItem(itemId: number) {
  const fotos = instalacaoFotosMap.value[itemId] ?? []
  const valor = fotos.length > 0 ? JSON.stringify(fotos) : null
  try {
    await supabase
      .from('itens_ordem_servico')
      .update({ foto_instalacao_url: valor })
      .eq('id', itemId)
  } catch (err) {
    console.error('Erro ao salvar fotos de instalação:', err)
  }
}

async function avancarStatus() {
  if (!props.ordemServico || !nextEtapa.value) return
  atualizandoStatus.value = true
  try {
    // Montar payload: atualizar etapa_id + status + timestamps
    // Determinar status baseado na posição/is_final (não no nome)
    let novoStatus: string
    if (nextEtapa.value.is_final) {
      novoStatus = 'entregue'
    } else if (nextEtapa.value.posicao === 0) {
      novoStatus = 'aguardando_producao'
    } else {
      novoStatus = 'em_producao'
    }

    const updatePayload: Record<string, unknown> = {
      etapa_id: nextEtapa.value.id,
      status: novoStatus,
    }

    // Registrar timestamps de transição
    if (novoStatus === 'em_producao') updatePayload.data_inicio_producao = new Date().toISOString()
    else if (novoStatus === 'entregue') updatePayload.data_entrega = new Date().toISOString()

    const { data, error } = await supabase
      .from('ordens_servico_adesivo')
      .update(updatePayload)
      .eq('id', props.ordemServico.id)
      .select()
      .single()

    if (error) throw error

    emit('statusUpdated', data as OrdemServico)
  } catch (err) {
    console.error('Erro ao avançar status:', err)
  } finally {
    atualizandoStatus.value = false
  }
}

async function salvarObservacoes() {
  if (!props.ordemServico) return
  salvandoObs.value = true
  try {
    await supabase
      .from('ordens_servico_adesivo')
      .update({ observacoes: observacoes.value || null })
      .eq('id', props.ordemServico.id)
  } catch (err) {
    console.error('Erro ao salvar observações:', err)
  } finally {
    salvandoObs.value = false
  }
}

function formatCurrency(val: number | null | undefined): string {
  if (val == null) return 'R$ 0,00'
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function isPdf(url: string | null | undefined): boolean {
  if (!url) return false
  return url.toLowerCase().endsWith('.pdf')
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .relative {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}
.modal-leave-to .relative {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
