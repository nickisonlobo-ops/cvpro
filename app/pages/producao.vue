<template>
  <div class="min-h-screen p-4 sm:p-6 space-y-5">
    <!-- Header -->
    <div class="relative rounded-3xl overflow-hidden mb-6 shadow-xl">
      <div class="absolute inset-0" :style="{ background: 'var(--color-primary-bg, linear-gradient(135deg, #1e293b, #334155))' }"></div>
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_60%)]"></div>
      <div class="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/[0.03] pointer-events-none"></div>

      <div class="relative px-4 sm:px-8 pt-5 sm:pt-7 pb-5 sm:pb-7">
        <div class="flex flex-wrap items-start justify-between gap-3 sm:gap-6">
          <div class="flex items-center gap-3 sm:gap-5">
            <div class="flex items-center justify-center w-10 sm:w-14 h-10 sm:h-14 rounded-2xl bg-white/[0.12] backdrop-blur-sm border border-white/20 shadow-lg">
              <svg class="w-5 sm:w-7 h-5 sm:h-7 text-white" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z" /></svg>
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-semibold text-white/80 uppercase tracking-widest">Produção</span>
                <span class="w-1 h-1 rounded-full bg-white/40"></span>
                <span class="text-xs text-white/50 hidden sm:inline">Controle</span>
              </div>
              <h1 class="text-xl sm:text-3xl font-bold text-white tracking-tight leading-none">Controle de Produção</h1>
              <p class="text-sm text-white/60 mt-1.5">{{ instancias.length }} processo(s) • {{ naoAgendados.length }} não agendado(s)</p>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <span class="text-sm font-bold text-white/70 capitalize hidden sm:inline">{{ mesLabel }}</span>
            <button type="button" class="px-3 py-2.5 rounded-xl text-xs font-bold bg-white text-gray-900 hover:bg-gray-100 shadow-lg transition-all" @click="irParaHoje">Hoje</button>
            <button type="button" class="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white border border-white/15 transition-all" @click="semanaAnterior">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            </button>
            <button type="button" class="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white border border-white/15 transition-all" @click="proximaSemana">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtro por processo -->
    <div class="flex items-center gap-2 flex-wrap">
      <button type="button" class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all" :class="filtroProcesso === '' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'" @click="filtroProcesso = ''">Todos</button>
      <button v-for="t in templatesFiltro" :key="t.id" type="button" class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all" :class="filtroProcesso === t.nome ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'" @click="filtroProcesso = t.nome">{{ t.nome }}</button>
    </div>

    <!-- Kanban por colunas -->
    <div class="flex gap-3 overflow-x-auto pb-4">
      <!-- Coluna: Não Agendados -->
      <div class="kanban-column flex flex-col min-w-[280px] max-w-[320px] rounded-2xl border" style="background: var(--color-card, #ffffff); border-color: var(--color-card-border, rgba(0,0,0,0.06))">
        <div class="flex items-center gap-2 px-4 py-3 border-b" style="border-color: var(--color-card-border, rgba(0,0,0,0.06))">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-400 flex-shrink-0"></span>
          <h3 class="text-sm font-semibold truncate flex-1" style="color: var(--color-card-texto, #1e293b)">Não Agendados</h3>
          <span class="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-medium" style="background: var(--color-primary-5, rgba(55,65,81,0.05)); color: var(--color-card-texto, #64748b); border: 1px solid var(--color-card-border, rgba(0,0,0,0.06))">{{ naoAgendados.length }}</span>
        </div>
        <div class="flex-1 overflow-y-auto p-2 space-y-2 min-h-[120px]" @dragover.prevent @drop="onDrop($event, null)">
          <div
            v-for="inst in naoAgendados" :key="inst.id"
            class="group relative rounded-xl border p-3 shadow-sm transition-all duration-150 select-none cursor-grab hover:shadow-md active:scale-[0.98]"
            :class="[isBloqueada(inst) ? 'opacity-60' : '', inst.status === 'concluido' ? '!border-emerald-300 !opacity-70' : '']"
            :style="{ background: inst.status === 'concluido' ? '#ecfdf5' : 'var(--color-card, #ffffff)', color: 'var(--color-card-texto, #1e293b)', borderColor: inst.status === 'concluido' ? '#6ee7b7' : 'var(--color-card-border, rgba(0,0,0,0.06))' }"
            draggable="true"
            @dragstart="onDragStart($event, inst)"
            @click="abrirChecklist(inst)"
          >
            <div v-if="isBloqueada(inst)" class="absolute top-2 right-2">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
            </div>
            <div class="space-y-1">
              <p class="text-sm font-bold truncate" :class="inst.status === 'concluido' ? 'line-through text-emerald-700' : ''" style="color: var(--color-card-texto, #1e293b)">{{ inst.status === 'concluido' ? '&#10003; ' : '' }}{{ inst.template_nome }} - {{ inst.os_numero ?? '---' }}</p>
              <p class="text-xs truncate" style="color: var(--color-card-texto, #64748b); opacity: 0.7">{{ inst.titulo }}</p>
              <div class="flex items-center gap-1.5 mt-1.5">
                <div class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div class="h-full rounded-full transition-all" :style="{ width: inst.progresso + '%', background: inst.progresso === 100 ? '#10b981' : 'var(--color-primary, #3b82f6)' }"></div>
                </div>
                <span class="text-[9px] font-bold text-gray-400">{{ inst.progresso }}%</span>
              </div>
            </div>
          </div>
          <div v-if="naoAgendados.length === 0" class="flex items-center justify-center h-full min-h-[80px] text-xs" style="color: var(--color-card-texto, #94a3b8); opacity: 0.5">Nenhum item</div>
        </div>
      </div>

      <!-- Colunas: Dias da semana -->
      <div
        v-for="dia in diasSemana" :key="dia.iso"
        class="kanban-column flex flex-col min-w-[280px] max-w-[320px] rounded-2xl border transition-all duration-200"
        :class="dragOverDia === dia.iso ? 'ring-2 ring-blue-400' : ''"
        :style="{ background: 'var(--color-card, #ffffff)', borderColor: dia.isHoje ? 'var(--color-primary, #1f7f1f)' : 'var(--color-card-border, rgba(0,0,0,0.06))' }"
        @dragover.prevent="dragOverDia = dia.iso"
        @dragleave="dragOverDia = null"
        @drop="onDrop($event, dia.iso)"
      >
        <div class="flex items-center gap-2 px-4 py-3 border-b" style="border-color: var(--color-card-border, rgba(0,0,0,0.06))">
          <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" :class="dia.isHoje ? 'bg-gray-900' : 'bg-blue-400'"></span>
          <h3 class="text-sm font-semibold truncate flex-1" style="color: var(--color-card-texto, #1e293b)">
            {{ dia.label }} {{ dia.numero }}
          </h3>
          <span class="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-medium" style="background: var(--color-primary-5, rgba(55,65,81,0.05)); color: var(--color-card-texto, #64748b); border: 1px solid var(--color-card-border, rgba(0,0,0,0.06))">{{ contarPorDia(dia.iso) }}</span>
        </div>
        <div class="flex-1 overflow-y-auto p-2 space-y-2 min-h-[120px]">
          <div
            v-for="inst in instanciasPorDia(dia.iso)" :key="inst.id"
            class="group relative rounded-xl border p-3 shadow-sm transition-all duration-150 select-none cursor-grab hover:shadow-md active:scale-[0.98]"
            :class="isBloqueada(inst) ? 'opacity-60' : ''"
            style="background: var(--color-card, #ffffff); color: var(--color-card-texto, #1e293b); border-color: var(--color-card-border, rgba(0,0,0,0.06))"
            draggable="true"
            @dragstart="onDragStart($event, inst)"
            @click="abrirChecklist(inst)"
          >
            <div v-if="isBloqueada(inst)" class="absolute top-2 right-2">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
            </div>
            <div class="space-y-1">
              <p class="text-sm font-bold truncate" :class="inst.status === 'concluido' ? 'line-through text-emerald-700' : ''" style="color: var(--color-card-texto, #1e293b)">{{ inst.status === 'concluido' ? '&#10003; ' : '' }}{{ inst.template_nome }} - {{ inst.os_numero ?? '---' }}</p>
              <p class="text-xs truncate" style="color: var(--color-card-texto, #64748b); opacity: 0.7">{{ inst.titulo }}</p>
              <div v-if="inst.responsavel_nome" class="flex items-center gap-1.5 text-xs" style="color: var(--color-card-texto, #64748b); opacity: 0.7">
                <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" /></svg>
                <span class="truncate">{{ inst.responsavel_nome }}</span>
              </div>
              <div class="flex items-center gap-1.5 mt-1.5">
                <div class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div class="h-full rounded-full transition-all" :style="{ width: inst.progresso + '%', background: inst.progresso === 100 ? '#10b981' : 'var(--color-primary, #3b82f6)' }"></div>
                </div>
                <span class="text-[9px] font-bold text-gray-400">{{ inst.progresso }}%</span>
              </div>
            </div>
          </div>
          <div v-if="instanciasPorDia(dia.iso).length === 0" class="flex items-center justify-center h-full min-h-[80px] text-xs" style="color: var(--color-card-texto, #94a3b8); opacity: 0.5">Nenhum item</div>
        </div>
      </div>
    </div>

    <!-- Modal Checklist + Itens OS -->
    <Teleport to="body">
      <div v-if="instanciaSelecionada" class="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-3" @click.self="instanciaSelecionada = null">
        <div class="bg-white rounded-[2rem] max-w-2xl w-full max-h-[92vh] shadow-2xl ring-1 ring-black/5 flex flex-col overflow-hidden">

          <!-- Header Premium -->
          <div class="relative overflow-hidden rounded-t-[2rem] px-6 py-5" style="background: var(--color-primary-bg, linear-gradient(135deg, #1e293b, #334155))">
            <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.08),transparent_60%)]"></div>
            <div class="relative flex items-center justify-between">
              <div>
                <p class="text-xs font-bold text-white/50 uppercase tracking-widest">{{ instanciaSelecionada.os_numero }}</p>
                <h2 class="text-lg font-black text-white mt-0.5">{{ instanciaSelecionada.template_nome }}</h2>
                <p class="text-sm text-white/60 mt-0.5">{{ instanciaSelecionada.titulo }}</p>
              </div>
              <button type="button" class="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all" @click="instanciaSelecionada = null">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <!-- Progress bar -->
            <div class="mt-4 flex items-center gap-3">
              <div class="flex-1 h-2.5 bg-white/20 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-500 bg-white" :style="{ width: instanciaSelecionada.progresso + '%' }"></div>
              </div>
              <span class="text-sm font-black text-white">{{ instanciaSelecionada.progresso }}%</span>
            </div>
          </div>

          <!-- Itens da OS (fixo, não scroll) -->
          <div v-if="itensOS.length > 0" class="px-6 py-5 border-b border-gray-100 flex-shrink-0 overflow-y-auto max-h-[40vh]">
            <h3 class="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-4">Itens da OS</h3>
            <div class="space-y-4">
              <div v-for="(item, idx) in itensOS" :key="item.id" class="rounded-2xl border border-gray-100 overflow-hidden">
                <!-- Item header -->
                <div class="flex items-center justify-between px-4 py-3 bg-gray-50/50">
                  <div class="flex items-center gap-2">
                    <span class="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black text-white bg-gray-800">{{ idx + 1 }}</span>
                    <span class="text-sm font-bold text-gray-900">{{ item.descricao }}</span>
                  </div>
                </div>
                <!-- Item details -->
                <div class="px-4 py-3 space-y-3">
                  <div class="flex flex-wrap gap-3 text-xs text-gray-500">
                    <span class="bg-gray-100 px-2 py-1 rounded-md font-medium">{{ item.material_nome ?? `Material #${item.material_id}` }}</span>
                    <span class="bg-gray-100 px-2 py-1 rounded-md font-medium">{{ item.largura_cm }} × {{ item.altura_cm }} cm</span>
                    <span class="bg-gray-100 px-2 py-1 rounded-md font-medium">Qtd: {{ item.quantidade }}</span>
                  </div>
                  <!-- Fotos grandes -->
                  <div v-if="item.foto_arte_url || item.foto_local_url || item.arquivo_url" class="flex flex-wrap gap-3">
                    <img v-if="item.foto_arte_url" :src="item.foto_arte_url" alt="Arte" class="w-32 h-32 sm:w-40 sm:h-40 rounded-xl object-cover border border-gray-200 cursor-pointer hover:shadow-lg transition-all" @click="lightboxUrl = item.foto_arte_url" />
                    <img v-if="item.foto_local_url" :src="item.foto_local_url" alt="Local" class="w-32 h-32 sm:w-40 sm:h-40 rounded-xl object-cover border border-gray-200 cursor-pointer hover:shadow-lg transition-all" @click="lightboxUrl = item.foto_local_url" />
                    <a v-if="item.arquivo_url" :href="item.arquivo_url" target="_blank" rel="noopener" class="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200 transition-colors text-xs font-bold">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                      Arquivo
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Checklist compacto (scrollável) -->
          <div class="px-6 py-5 flex-1 overflow-y-auto min-h-0">
            <h3 class="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-3">Checklist</h3>

            <!-- Aviso bloqueado -->
            <div v-if="instanciaSelecionada && isBloqueada(instanciaSelecionada)" class="mb-4 flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-amber-50 border border-amber-200">
              <svg class="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
              <p class="text-xs font-semibold text-amber-700">Processo bloqueado — conclua o processo anterior para liberar o checklist.</p>
            </div>

            <div class="space-y-1">
              <div v-for="item in checklistAtual" :key="item.id" class="flex items-center gap-2.5 px-2 py-2 rounded-lg transition-all" :class="item.concluida ? 'bg-emerald-50/50' : 'hover:bg-gray-50'">
                <button type="button" class="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0" :class="item.concluida ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 hover:border-emerald-400'" :disabled="instanciaSelecionada && isBloqueada(instanciaSelecionada)" @click="toggleCheck(item)">
                  <svg v-if="item.concluida" class="w-3 h-3 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                </button>
                <span class="text-xs" :class="item.concluida ? 'text-gray-400 line-through' : 'text-gray-700 font-medium'">{{ item.titulo }}</span>
              </div>
              <div v-if="checklistAtual.length === 0" class="text-center py-4 text-xs text-gray-400">Nenhuma etapa</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lightbox -->
      <div v-if="lightboxUrl" class="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4" @click="lightboxUrl = null">
        <button type="button" class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center" @click.stop="lightboxUrl = null">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <img :src="lightboxUrl!" alt="Imagem ampliada" class="max-w-[90vw] max-h-[90vh] rounded-2xl object-contain shadow-2xl" @click.stop />
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useProcessos, type ProcessoInstancia, type ChecklistItem } from '~/composables/useProcessos'

definePageMeta({ layout: 'default' })

const { carregarInstancias, carregarChecklist, toggleChecklist, atualizarProgresso, atualizarInstancia, carregarTemplates } = useProcessos()

const instancias = ref<ProcessoInstancia[]>([])
const instanciaSelecionada = ref<ProcessoInstancia | null>(null)
const checklistAtual = ref<ChecklistItem[]>([])
const itensOS = ref<any[]>([])
const lightboxUrl = ref<string | null>(null)
const filtroProcesso = ref('')
const semanaOffset = ref(0)
const dragOverDia = ref<string | null>(null)

const diasSemana = computed(() => {
  const hoje = new Date()
  const inicioSemana = new Date(hoje)
  inicioSemana.setDate(hoje.getDate() - hoje.getDay() + 1 + (semanaOffset.value * 7))
  const labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(inicioSemana)
    d.setDate(inicioSemana.getDate() + i)
    const iso = d.toISOString().split('T')[0]
    return { label: labels[i], numero: d.getDate(), iso, isHoje: iso === new Date().toISOString().split('T')[0] }
  })
})

const mesLabel = computed(() => {
  const d = new Date(diasSemana.value[0].iso + 'T12:00:00')
  return d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
})

const naoAgendados = computed(() => instancias.value.filter(i => !i.data_prazo && i.status !== 'cancelado' && (!filtroProcesso.value || i.template_nome === filtroProcesso.value)).sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0)))
function instanciasPorDia(iso: string) { return instancias.value.filter(i => i.data_prazo === iso && i.status !== 'cancelado' && (!filtroProcesso.value || i.template_nome === filtroProcesso.value)).sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0)) }
function contarPorDia(iso: string) { return instanciasPorDia(iso).length }

const templatesFiltro = computed(() => {
  return templates.value.filter(t => t.ativo).map(t => ({ id: t.id, nome: t.nome }))
})

const templates = ref<any[]>([])


function semanaAnterior() { semanaOffset.value-- }
function proximaSemana() { semanaOffset.value++ }
function irParaHoje() { semanaOffset.value = 0 }

// Verifica se a instância está bloqueada (predecessora na mesma OS não concluída)
function isBloqueada(inst: ProcessoInstancia): boolean {
  if (inst.ordem === 0) return false // Primeiro da sequência nunca é bloqueado
  if (!inst.sequencial) return false // Não é sequencial = independente/paralelo
  // Buscar instância anterior (mesma OS, ordem menor)
  const anterior = instancias.value.find(i =>
    i.os_id === inst.os_id && i.ordem === inst.ordem - 1 && i.id !== inst.id
  )
  if (!anterior) return false // Sem anterior = liberada
  return anterior.status !== 'concluido'
}

let draggedId: number | null = null
function onDragStart(e: DragEvent, inst: ProcessoInstancia) {
  draggedId = inst.id
  e.dataTransfer?.setData('text/plain', String(inst.id))
}
async function onDrop(e: DragEvent, dataIso: string | null) {
  e.preventDefault()
  dragOverDia.value = null
  if (!draggedId) return
  const inst = instancias.value.find(i => i.id === draggedId)
  if (!inst) return
  inst.data_prazo = dataIso
  if (dataIso && inst.status === 'pendente') inst.status = 'em_andamento'
  await atualizarInstancia(inst.id, { data_prazo: dataIso, status: inst.status })
  draggedId = null
}

async function abrirChecklist(inst: ProcessoInstancia) {
  instanciaSelecionada.value = inst
  checklistAtual.value = await carregarChecklist(inst.id)

  // Carregar itens da OS vinculada
  itensOS.value = []
  if (inst.os_id) {
    const supabase = (await import('~/lib/supabase')).createSupabaseClient()
    const { data } = await supabase
      .from('itens_ordem_servico')
      .select('id, descricao, material_id, largura_cm, altura_cm, quantidade, valor_item, foto_arte_url, foto_local_url, arquivo_url, materiais_adesivo(nome)')
      .eq('ordem_servico_id', inst.os_id)
      .order('id')
    itensOS.value = (data ?? []).map((i: any) => ({ ...i, material_nome: i.materiais_adesivo?.nome ?? null }))
  }
}
async function toggleCheck(item: ChecklistItem) {
  if (instanciaSelecionada.value && isBloqueada(instanciaSelecionada.value)) return
  item.concluida = !item.concluida
  await toggleChecklist(item.id, item.concluida, 'Operador')
  if (instanciaSelecionada.value) {
    await atualizarProgresso(instanciaSelecionada.value.id)
    const concluidas = checklistAtual.value.filter(c => c.concluida).length
    instanciaSelecionada.value.progresso = checklistAtual.value.length > 0 ? Math.round((concluidas / checklistAtual.value.length) * 100) : 0
    if (instanciaSelecionada.value.progresso === 100) instanciaSelecionada.value.status = 'concluido'
    else if (instanciaSelecionada.value.progresso > 0) instanciaSelecionada.value.status = 'em_andamento'
  }
}

function formatDate(d: string | null): string {
  if (!d) return '—'
  return new Date(d + 'T12:00:00').toLocaleDateString('pt-BR')
}

onMounted(async () => {
  instancias.value = await carregarInstancias(['pendente', 'em_andamento', 'concluido'])
  templates.value = await carregarTemplates()
})
</script>
