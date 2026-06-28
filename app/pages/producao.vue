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

    <!-- Toggle Kanban / Cronograma + Filtros -->
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <div class="flex items-center gap-2 flex-wrap">
        <button type="button" class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all" :class="filtroProcesso === '' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'" @click="filtroProcesso = ''">Todos</button>
        <button v-for="t in templatesFiltro" :key="t.id" type="button" class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all" :class="filtroProcesso === t.nome ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'" @click="filtroProcesso = t.nome">{{ t.nome }}</button>
      </div>
      <div class="flex rounded-lg border border-gray-200 overflow-hidden">
        <button type="button" class="px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5" :class="viewMode === 'kanban' ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'" @click="viewMode = 'kanban'">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z" /></svg>
          Kanban
        </button>
        <button type="button" class="px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5" :class="viewMode === 'cronograma' ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'" @click="viewMode = 'cronograma'">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" /></svg>
          Cronograma
        </button>
        <button type="button" class="px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5" :class="viewMode === 'calendario' ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'" @click="viewMode = 'calendario'">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
          Entregas
        </button>
      </div>
    </div>

    <!-- Kanban por colunas (grid com cards multi-dia) -->
    <div v-if="viewMode === 'kanban'" class="flex gap-3 overflow-x-auto pb-4">
      <!-- Coluna: Não Agendados -->
      <div class="kanban-column flex flex-col min-w-[240px] max-w-[280px] rounded-2xl border flex-shrink-0" style="background: var(--color-card, #ffffff); border-color: var(--color-card-border, rgba(0,0,0,0.06))">
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
            @dragend="onDragEnd"
            @click="onKanbanCardClick(inst)"
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

      <!-- Grid Dias da semana (CSS Grid: cards ocupam colunas conforme span) -->
      <div class="flex-1 min-w-0 border border-gray-100 rounded-2xl overflow-hidden" style="background: var(--color-card, #ffffff)">
        <!-- Header com dias -->
        <div class="grid gap-0" :style="{ gridTemplateColumns: 'repeat(' + diasSemana.length + ', 1fr)' }">
          <div
            v-for="dia in diasSemana" :key="'h-'+dia.iso"
            class="px-3 py-2.5 flex items-center gap-2 border-b"
            :class="dia.isHoje ? 'border-b-2 border-b-gray-900' : 'border-b border-b-gray-100'"
            @dragover.prevent="dragOverDia = dia.iso"
            @dragleave="dragOverDia = null"
            @drop="onDrop($event, dia.iso)"
          >
            <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" :class="dia.isHoje ? 'bg-gray-900' : 'bg-blue-400'"></span>
            <h3 class="text-sm font-semibold truncate flex-1" style="color: var(--color-card-texto, #1e293b)">{{ dia.label }} {{ dia.numero }}</h3>
            <span class="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-medium" style="background: var(--color-primary-5, rgba(55,65,81,0.05)); color: var(--color-card-texto, #64748b); border: 1px solid var(--color-card-border, rgba(0,0,0,0.06))">{{ contarPorDia(dia.iso) }}</span>
          </div>
        </div>

        <!-- Cards grid com linhas separadoras -->
        <div class="relative min-h-[200px]">
          <!-- Linhas verticais suaves separando os dias -->
          <div class="absolute inset-0 pointer-events-none grid" :style="{ gridTemplateColumns: 'repeat(' + diasSemana.length + ', 1fr)' }">
            <div v-for="(dia, idx) in diasSemana" :key="'line-'+dia.iso" :class="idx < diasSemana.length - 1 ? 'border-r border-gray-100' : ''"></div>
          </div>

          <!-- Drop zones (full height por coluna) -->
          <div class="absolute inset-0 grid" :style="{ gridTemplateColumns: 'repeat(' + diasSemana.length + ', 1fr)' }">
            <div
              v-for="dia in diasSemana" :key="'dz-'+dia.iso"
              class="min-h-full transition-colors"
              :class="dragOverDia === dia.iso ? 'bg-blue-50/60' : ''"
              @dragover.prevent="dragOverDia = dia.iso"
              @dragleave="dragOverDia = null"
              @drop="onDrop($event, dia.iso)"
            ></div>
          </div>

          <!-- Cards posicionados via grid -->
          <div
            ref="kanbanGridRef"
            class="relative grid gap-2 auto-rows-auto p-2 overflow-hidden"
            :style="{ gridTemplateColumns: 'repeat(' + diasSemana.length + ', 1fr)' }"
            @dragover.prevent="onKanbanGridDragOver($event)"
            @dragleave="dragOverDia = null"
            @drop="onKanbanGridDrop($event)"
          >
            <div
              v-for="card in kanbanGridCards" :key="'gc-'+card.inst.id"
              class="group relative rounded-xl border p-3 shadow-sm transition-all duration-150 select-none cursor-grab hover:shadow-md active:scale-[0.98] overflow-hidden min-w-0"
              :class="[isBloqueada(card.inst) ? 'opacity-60' : '', kanbanResizingId === card.inst.id ? 'z-30 ring-2 ring-blue-400' : 'z-10']"
              :style="{ gridColumn: card.colStart + ' / span ' + card.span, gridRow: card.row, background: card.inst.status === 'concluido' ? '#ecfdf5' : 'var(--color-card, #ffffff)', color: 'var(--color-card-texto, #1e293b)', borderColor: card.inst.status === 'concluido' ? '#6ee7b7' : 'var(--color-card-border, rgba(0,0,0,0.06))' }"
              draggable="true"
              @dragstart="onDragStart($event, card.inst)"
              @dragend="onDragEnd"
              @click="onKanbanCardClick(card.inst)"
            >
            <!-- Badges top-right: cadeado + dias -->
            <div class="absolute top-2 right-2 flex items-center gap-1.5">
              <div v-if="card.span > 1" class="px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-700 text-[9px] font-bold">
                {{ card.span }}d
              </div>
              <svg v-if="isBloqueada(card.inst)" class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
            </div>
            <div class="space-y-1">
              <p class="text-sm font-bold" :class="card.inst.status === 'concluido' ? 'line-through text-emerald-700' : ''" style="color: var(--color-card-texto, #1e293b)">{{ card.inst.status === 'concluido' ? '&#10003; ' : '' }}{{ card.inst.template_nome }} - {{ card.inst.os_numero ?? '---' }}</p>
              <p class="text-xs" style="color: var(--color-card-texto, #64748b); opacity: 0.7">{{ card.inst.titulo }}</p>
              <div v-if="card.inst.responsavel_nome" class="flex items-center gap-1.5 text-xs" style="color: var(--color-card-texto, #64748b); opacity: 0.7">
                <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" /></svg>
                <span class="truncate">{{ card.inst.responsavel_nome }}</span>
              </div>
              <div class="flex items-center gap-1.5 mt-1.5">
                <div class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div class="h-full rounded-full transition-all" :style="{ width: card.inst.progresso + '%', background: card.inst.progresso === 100 ? '#10b981' : 'var(--color-primary, #3b82f6)' }"></div>
                </div>
                <span class="text-[9px] font-bold text-gray-400">{{ card.inst.progresso }}%</span>
              </div>
            </div>
            <!-- Kanban resize handle (estender dias) -->
            <div class="absolute right-0 top-0 bottom-0 w-3 cursor-col-resize opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-r-xl bg-blue-50/80" @mousedown.stop.prevent="iniciarKanbanResize($event, card.inst, card.colStart - 1)">
              <div class="w-0.5 h-5 rounded-full bg-blue-400 opacity-60"></div>
            </div>
          </div>
          </div>
        </div>

        <!-- Mensagem vazia -->
        <div v-if="kanbanGridCards.length === 0" class="flex items-center justify-center min-h-[120px] text-xs text-gray-400">Nenhum processo agendado nesta semana</div>
      </div>
    </div>

    <!-- ═══ CRONOGRAMA (Timeline por hora, agrupado por OS) ═══ -->
    <div v-if="viewMode === 'cronograma'" class="bg-white rounded-2xl border border-gray-100 overflow-x-auto">
      <!-- Seletor de dias (multi-select) -->
      <div class="flex items-center gap-2 px-4 py-3 border-b border-gray-100 flex-wrap">
        <span class="text-xs font-bold text-gray-500">Dias:</span>
        <button v-for="dia in diasSemana" :key="'sel-'+dia.iso" type="button" class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all" :class="cronogramaDias.includes(dia.iso) ? 'bg-gray-900 text-white' : dia.isHoje ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'" @click="toggleDiaCronograma(dia.iso)">
          {{ dia.label }} {{ dia.numero }}
        </button>
        <div class="h-4 w-px bg-gray-200 mx-1"></div>
        <button type="button" class="px-2 py-1 rounded text-[10px] font-bold text-gray-400 hover:text-gray-700" @click="cronogramaDias = [new Date().toISOString().split('T')[0]]">Hoje</button>
        <button type="button" class="px-2 py-1 rounded text-[10px] font-bold text-gray-400 hover:text-gray-700" @click="cronogramaDias = diasSemana.map(d => d.iso)">Semanal</button>
        <button type="button" class="px-2 py-1 rounded text-[10px] font-bold text-gray-400 hover:text-gray-700" @click="selecionarQuinzenal()">Quinzenal</button>
        <button type="button" class="px-2 py-1 rounded text-[10px] font-bold text-gray-400 hover:text-gray-700" @click="selecionarMensal()">Mensal</button>
      </div>

      <!-- Grid -->
      <div class="min-w-[1100px]" :style="{ minWidth: (cronogramaDias.length * 400 + 140) + 'px' }">
        <!-- Header horas por dia -->
        <div class="grid border-b border-gray-100" :style="{ gridTemplateColumns: '140px repeat(' + cronogramaSlots.length + ', 1fr)' }">
          <div class="px-3 py-2 border-r border-gray-100 text-[10px] font-bold text-gray-400">OS</div>
          <div v-for="slot in cronogramaSlots" :key="slot.key" class="px-0 py-2 text-center border-r border-gray-50 last:border-r-0" :class="slot.isFirstHour ? 'border-l border-gray-200' : ''">
            <p v-if="slot.isFirstHour" class="text-[9px] font-black text-gray-600 -mt-0.5">{{ slot.diaLabel }}</p>
            <p class="text-[9px] font-bold text-gray-400">{{ slot.hora }}:00</p>
          </div>
        </div>

        <!-- Linhas por OS -->
        <div v-if="cronogramaOSLinhas.length > 0" class="divide-y divide-gray-50">
          <div v-for="linha in cronogramaOSLinhas" :key="linha.osId" class="grid relative" :style="{ gridTemplateColumns: '140px 1fr', minHeight: (linha.processos.length * 72 + 16) + 'px' }">
            <!-- Label OS -->
            <div class="px-3 py-3 border-r border-gray-100 flex flex-col justify-center">
              <p class="text-xs font-bold text-gray-900">{{ linha.osNumero }}</p>
              <p class="text-[10px] text-gray-400 truncate">{{ linha.produto }}</p>
            </div>
            <!-- Área de barras (cards) -->
            <div data-cronograma-area class="relative py-2 px-1">
              <!-- Grid background -->
              <div class="absolute inset-0 grid" :style="{ gridTemplateColumns: 'repeat(' + cronogramaSlots.length + ', 1fr)' }">
                <div v-for="slot in cronogramaSlots" :key="'bg2-'+slot.key" class="border-r border-gray-50 last:border-r-0" :class="slot.isFirstHour ? 'border-l border-gray-200' : ''"></div>
              </div>
              <!-- Cards posicionados -->
              <div
                v-for="(proc, idx) in linha.processos" :key="proc.id"
                class="absolute rounded-xl border p-2.5 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow group/bar select-none"
                :class="isBloqueada(proc) ? 'opacity-50' : ''"
                :style="{ left: calcBarLeft(proc) + '%', width: calcBarWidth(proc) + '%', top: (idx * 68 + 4) + 'px', height: '60px', background: proc.status === 'concluido' ? '#ecfdf5' : 'var(--color-card, #ffffff)', borderColor: proc.status === 'concluido' ? '#6ee7b7' : 'var(--color-card-border, rgba(0,0,0,0.1))' }"
                @mousedown.prevent="onCardMouseDown($event, proc)"
                @click.stop="onCardClick(proc)"
              >
                <div v-if="isBloqueada(proc)" class="absolute top-1.5 right-1.5">
                  <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                </div>
                <div class="flex flex-col h-full justify-between overflow-hidden">
                  <p class="text-[11px] font-bold truncate" :class="proc.status === 'concluido' ? 'line-through text-emerald-700' : 'text-gray-900'">{{ proc.status === 'concluido' ? '✓ ' : '' }}{{ proc.template_nome }} - {{ proc.os_numero ?? '' }}</p>
                  <p class="text-[9px] text-gray-400 truncate">{{ proc.titulo }}</p>
                  <div class="flex items-center gap-1">
                    <div class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div class="h-full rounded-full" :style="{ width: proc.progresso + '%', background: proc.progresso === 100 ? '#10b981' : 'var(--color-primary, #3b82f6)' }"></div>
                    </div>
                    <span class="text-[8px] font-bold text-gray-400">{{ proc.progresso }}%</span>
                  </div>
                </div>
                <!-- Resize handle -->
                <div data-resize class="absolute right-0 top-0 bottom-0 w-4 cursor-col-resize opacity-0 group-hover/bar:opacity-100 transition-opacity flex items-center justify-center rounded-r-xl" style="background: var(--color-primary-10, rgba(59,130,246,0.15))" @mousedown.stop.prevent="iniciarResizeHora($event, proc)">
                  <div class="w-0.5 h-6 rounded-full" style="background: var(--color-primary, #3b82f6); opacity: 0.6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="p-12 text-center text-sm text-gray-400">Nenhum processo agendado neste dia.</div>
      </div>
    </div>

    <!-- ═══ CALENDÁRIO DE ENTREGAS (OS por data_entrega) ═══ -->
    <div v-if="viewMode === 'calendario'" class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <!-- Header mês -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 class="text-sm font-bold text-gray-800">{{ calendarioMesLabel }}</h3>
        <div class="flex items-center gap-2">
          <button type="button" class="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-all" @click="calendarioMesOffset--">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          </button>
          <button type="button" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-900 text-white" @click="calendarioMesOffset = 0">Hoje</button>
          <button type="button" class="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-all" @click="calendarioMesOffset++">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
          </button>
        </div>
      </div>

      <!-- Dias da semana header -->
      <div class="grid grid-cols-7 border-b border-gray-100">
        <div v-for="d in ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']" :key="d" class="px-2 py-2 text-center text-[10px] font-bold text-gray-400 uppercase">{{ d }}</div>
      </div>

      <!-- Grid de dias -->
      <div class="grid grid-cols-7">
        <div
          v-for="dia in calendarioDias" :key="dia.iso"
          class="min-h-[140px] border-r border-b border-gray-50 p-2 transition-colors"
          :class="[dia.isHoje ? 'bg-blue-50/40' : '', !dia.isMesAtual ? 'bg-gray-50/50' : '', calDragOverDia === dia.iso ? 'bg-blue-100/60 ring-1 ring-blue-300' : '']"
          @dragover.prevent="calDragOverDia = dia.iso"
          @dragleave="calDragOverDia = null"
          @drop="onCalDrop($event, dia.iso)"
        >
          <p class="text-[10px] font-bold mb-1.5" :class="dia.isHoje ? 'text-blue-700' : dia.isMesAtual ? 'text-gray-700' : 'text-gray-300'">{{ dia.numero }}</p>
          <!-- OS cards para este dia -->
          <div class="space-y-1.5">
            <div
              v-for="os in calendarioOsPorDia(dia.iso)" :key="os.id"
              class="rounded-xl border p-2.5 cursor-grab hover:shadow-md transition-all select-none active:scale-[0.97]"
              :class="os.status === 'entregue' ? 'bg-emerald-50 border-emerald-200' : os.atrasado ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100 hover:border-gray-200'"
              draggable="true"
              @dragstart="onCalDragStart($event, os)"
              @dragend="onCalDragEnd"
              @click="onCalCardClick(os)"
            >
              <p class="text-xs font-bold truncate" :class="os.status === 'entregue' ? 'text-emerald-700 line-through' : os.atrasado ? 'text-red-700' : 'text-gray-900'">{{ os.numero_os }} {{ os.nome_trabalho ? '- ' + os.nome_trabalho : '' }}</p>
              <div v-if="os.cliente_nome" class="flex items-center gap-1 mt-1">
                <svg class="w-3 h-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" /></svg>
                <span class="text-[10px] text-gray-500 truncate">{{ os.cliente_nome }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Checklist + Itens OS -->
    <Teleport to="body">
      <div v-if="instanciaSelecionada" class="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-3" @click.self="instanciaSelecionada = null">
        <div class="bg-white rounded-2xl sm:max-w-5xl w-full max-h-[92vh] shadow-2xl ring-1 ring-black/5 flex flex-col overflow-hidden">

          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-100 flex-shrink-0">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                  <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" /></svg>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h2 class="text-base font-bold text-gray-900">{{ instanciaSelecionada.template_nome }}</h2>
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold" :class="instanciaSelecionada.progresso === 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'">
                      <span class="w-1.5 h-1.5 rounded-full" :class="instanciaSelecionada.progresso === 100 ? 'bg-emerald-500' : 'bg-orange-500'"></span>
                      {{ instanciaSelecionada.progresso === 100 ? 'Concluído' : 'Em andamento' }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-500 mt-0.5">{{ instanciaSelecionada.os_numero }} · {{ instanciaSelecionada.titulo }}</p>
                </div>
              </div>
              <button type="button" class="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all" @click="instanciaSelecionada = null">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <!-- Progress bar -->
            <div class="mt-3 flex items-center gap-3">
              <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-500 bg-orange-500" :style="{ width: instanciaSelecionada.progresso + '%' }"></div>
              </div>
              <span class="text-xs font-bold text-gray-600">{{ instanciaSelecionada.progresso }}%</span>
            </div>
          </div>

          <!-- 2-Column Body -->
          <div class="flex flex-1 overflow-hidden min-h-0">
            <!-- Left Column (scrollable content) -->
            <div class="flex-1 overflow-y-auto p-6 space-y-6">

              <!-- Section 1: Itens da OS -->
              <div v-if="itensOS.length > 0">
                <div class="flex items-center gap-2 mb-4">
                  <span class="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-[10px] font-bold text-orange-600">1</span>
                  <h3 class="text-sm font-bold text-gray-900">Itens da OS</h3>
                </div>
                <div class="space-y-3">
                  <div v-for="(item, idx) in itensOS" :key="item.id" class="rounded-xl border border-gray-100 overflow-hidden">
                    <!-- Item header -->
                    <div class="flex items-center gap-2 px-4 py-3 bg-gray-50/50">
                      <span class="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black text-white bg-gray-800">{{ idx + 1 }}</span>
                      <span class="text-sm font-bold text-gray-900">{{ item.descricao }}</span>
                    </div>
                    <!-- Item details -->
                    <div class="px-4 py-3 space-y-3">
                      <div class="flex flex-wrap gap-2 text-xs">
                        <span class="bg-orange-50 text-orange-700 px-2 py-1 rounded-md font-medium">{{ item.material_nome ?? `Material #${item.material_id}` }}</span>
                        <span class="bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium">{{ item.largura_cm }} × {{ item.altura_cm }} cm</span>
                        <span class="bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium">Qtd: {{ item.quantidade }}</span>
                      </div>
                      <!-- Fotos Arte/Local -->
                      <div v-if="item.foto_arte_url || item.foto_local_url || item.arquivo_url" class="flex flex-wrap gap-3">
                        <div v-if="item.foto_arte_url" class="relative group">
                          <img :src="item.foto_arte_url" alt="Arte" class="w-28 h-28 rounded-lg object-cover border border-gray-200 cursor-pointer hover:shadow-lg transition-all" @click="lightboxUrl = item.foto_arte_url" />
                          <span class="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 text-white text-[9px] font-bold rounded">Arte</span>
                        </div>
                        <div v-if="item.foto_local_url" class="relative group">
                          <img :src="item.foto_local_url" alt="Local" class="w-28 h-28 rounded-lg object-cover border border-gray-200 cursor-pointer hover:shadow-lg transition-all" @click="lightboxUrl = item.foto_local_url" />
                          <span class="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 text-white text-[9px] font-bold rounded">Local</span>
                        </div>
                        <a v-if="item.arquivo_url" :href="item.arquivo_url" target="_blank" rel="noopener" class="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200 transition-colors text-xs font-bold self-end">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                          Arquivo
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Section 2: Checklist -->
              <div>
                <div class="flex items-center gap-2 mb-4">
                  <span class="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-[10px] font-bold text-orange-600">2</span>
                  <h3 class="text-sm font-bold text-gray-900">Checklist</h3>
                </div>

                <!-- Aviso bloqueado -->
                <div v-if="instanciaSelecionada && isBloqueada(instanciaSelecionada)" class="mb-4 flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-amber-50 border border-amber-200">
                  <svg class="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                  <p class="text-xs font-semibold text-amber-700">Processo bloqueado — conclua o processo anterior para liberar o checklist.</p>
                </div>

                <div class="space-y-1">
                  <div v-for="item in checklistAtual" :key="item.id" class="flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all" :class="item.concluida ? 'bg-emerald-50/50' : 'hover:bg-gray-50'">
                    <button type="button" class="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0" :class="item.concluida ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 hover:border-emerald-400'" :disabled="instanciaSelecionada && isBloqueada(instanciaSelecionada)" @click="toggleCheck(item)">
                      <svg v-if="item.concluida" class="w-3 h-3 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    </button>
                    <span class="text-xs" :class="item.concluida ? 'text-gray-400 line-through' : 'text-gray-700 font-medium'">{{ item.titulo }}</span>
                  </div>
                  <div v-if="checklistAtual.length === 0" class="text-center py-4 text-xs text-gray-400">Nenhuma etapa</div>
                </div>
              </div>

            </div>

            <!-- Right Sidebar -->
            <div class="w-[300px] flex-shrink-0 bg-gray-50/50 border-l border-gray-100 p-5 overflow-y-auto hidden sm:flex flex-col gap-5">

              <!-- Resumo da etapa -->
              <div class="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
                <h4 class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Resumo da etapa</h4>
                <div class="space-y-2 text-xs">
                  <div class="flex justify-between">
                    <span class="text-gray-500">OS</span>
                    <span class="font-semibold text-gray-900">{{ instanciaSelecionada.os_numero }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">Cliente</span>
                    <span class="font-semibold text-gray-900 text-right max-w-[140px] truncate">{{ instanciaSelecionada.titulo }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">Etapa</span>
                    <span class="font-semibold text-gray-900">{{ instanciaSelecionada.template_nome }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-500">Status</span>
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold" :class="instanciaSelecionada.progresso === 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'">
                      <span class="w-1.5 h-1.5 rounded-full" :class="instanciaSelecionada.progresso === 100 ? 'bg-emerald-500' : 'bg-orange-500'"></span>
                      {{ instanciaSelecionada.progresso === 100 ? 'Concluído' : 'Em andamento' }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">Itens</span>
                    <span class="font-semibold text-gray-900">{{ itensOS.length }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-500">Progresso</span>
                    <div class="flex items-center gap-2">
                      <div class="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div class="h-full rounded-full bg-orange-500" :style="{ width: instanciaSelecionada.progresso + '%' }"></div>
                      </div>
                      <span class="font-semibold text-gray-900">{{ instanciaSelecionada.progresso }}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Dependência warning -->
              <div v-if="instanciaSelecionada && isBloqueada(instanciaSelecionada)" class="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div class="flex items-center gap-2 mb-1.5">
                  <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" /></svg>
                  <span class="text-xs font-bold text-amber-800">Dependência</span>
                </div>
                <p class="text-[11px] text-amber-700">Conclua o processo anterior para liberar esta etapa.</p>
              </div>

              <!-- Action Buttons -->
              <div class="space-y-2 mt-auto">
                <button v-if="instanciaSelecionada && isBloqueada(instanciaSelecionada)" type="button" class="w-full px-4 py-2.5 rounded-xl bg-amber-100 text-amber-700 text-xs font-bold cursor-not-allowed opacity-70" disabled>
                  <span class="flex items-center justify-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75" /></svg>
                    Aguardar liberação
                  </span>
                </button>
                <button v-else type="button" class="w-full px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-colors" @click="instanciaSelecionada = null">
                  <span class="flex items-center justify-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    Salvar progresso
                  </span>
                </button>
                <p class="text-[10px] text-gray-400 text-center">O progresso é salvo automaticamente ao marcar itens.</p>
              </div>

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

      <!-- Modal detalhes da OS (calendário) -->
      <OSDetalhesModal
        :show="showOSModal"
        :ordem-servico="osSelecionadaCalendario"
        :itens-o-s="itensOSCalendario"
        @close="showOSModal = false"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useProcessos, type ProcessoInstancia, type ChecklistItem } from '~/composables/useProcessos'
import { useRealtimeMulti } from '~/composables/useRealtime'
import OSDetalhesModal from '~/components/OSDetalhesModal.vue'
import type { OrdemServico, ItemOS } from '~/composables/useOrdensServico'

definePageMeta({ layout: 'default' })

const { carregarInstancias, carregarChecklist, toggleChecklist, atualizarProgresso, atualizarInstancia, carregarTemplates } = useProcessos()

const instancias = ref<ProcessoInstancia[]>([])
const instanciaSelecionada = ref<ProcessoInstancia | null>(null)
const checklistAtual = ref<ChecklistItem[]>([])
const itensOS = ref<any[]>([])
const lightboxUrl = ref<string | null>(null)
const filtroProcesso = ref('')
const viewMode = ref<'kanban' | 'cronograma' | 'calendario'>('kanban')
const cronogramaDias = ref<string[]>([new Date().toISOString().split('T')[0]])
const renderKey = ref(0)
const widthOverrides = reactive<Record<number, string>>({})
const leftOverrides = reactive<Record<number, number>>({})
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

// Kanban Grid: calcula posicao de cada card no CSS Grid (sem sobreposicao)
const kanbanGridCards = computed(() => {
  const dias = diasSemana.value.map(d => d.iso)
  // Filtrar instancias agendadas dentro da semana visivel
  const agendadas = instancias.value.filter(i => {
    if (i.status === 'cancelado') return false
    if (filtroProcesso.value && i.template_nome !== filtroProcesso.value) return false
    if (!i.data_prazo) return false
    const inicio = i.data_prazo
    const fim = (i as any).data_fim || i.data_prazo
    // Toca a semana visivel
    return inicio <= dias[dias.length - 1] && fim >= dias[0]
  }).sort((a, b) => {
    // Dentro da mesma OS: respeitar ordem de processo (predecessores primeiro/acima)
    if (a.os_id && b.os_id && a.os_id === b.os_id) {
      return (a.ordem ?? 0) - (b.ordem ?? 0)
    }
    // Entre OS diferentes: ordenar por ordem, depois data
    const ordemDiff = (a.ordem ?? 0) - (b.ordem ?? 0)
    if (ordemDiff !== 0) return ordemDiff
    if (a.data_prazo! < b.data_prazo!) return -1
    if (a.data_prazo! > b.data_prazo!) return 1
    return 0
  })

  // Alocar rows (grid-row) evitando sobreposicoes
  // Cada row eh um array de intervalos [colStart, colEnd] ja ocupados
  const rows: Array<Array<[number, number]>> = []
  // Track: para cada OS+ordem, qual row foi atribuida (para forcar sequencia)
  const osRowMap = new Map<string, number>() // key: "osId-ordem" -> row

  const result: Array<{ inst: any; colStart: number; span: number; row: number }> = []

  for (const inst of agendadas) {
    const colStart = Math.max(0, dias.indexOf(inst.data_prazo)) + 1 // CSS grid is 1-indexed
    const dataFim = (inst as any).data_fim || inst.data_prazo
    const colEnd = Math.min(dias.length, dias.indexOf(dataFim) >= 0 ? dias.indexOf(dataFim) + 1 : dias.length)

    // Se data_prazo esta antes da semana, colStart = 1
    const effectiveColStart = dias.indexOf(inst.data_prazo) >= 0 ? colStart : 1
    const rawSpan = Math.max(1, colEnd - effectiveColStart + 1)
    // Limitar span para nao ultrapassar o grid
    const maxSpan = dias.length - effectiveColStart + 1
    const span = Math.min(rawSpan, maxSpan)

    // Se override de resize ativo
    const overrideSpan = kanbanWidthOverrides[inst.id]
    const finalSpan = overrideSpan ? Math.min(maxSpan, overrideSpan) : span

    // Determinar row minima baseado no predecessor da mesma OS
    let minRow = 0
    if (inst.os_id && inst.ordem > 0) {
      // Buscar a row do processo anterior na mesma OS
      for (let prevOrdem = inst.ordem - 1; prevOrdem >= 0; prevOrdem--) {
        const prevKey = `${inst.os_id}-${prevOrdem}`
        const prevRow = osRowMap.get(prevKey)
        if (prevRow !== undefined) {
          minRow = prevRow + 1 // Deve ficar abaixo
          break
        }
      }
    }

    // Encontrar a primeira row (>= minRow) que tem espaco para este card
    let assignedRow = -1
    for (let r = minRow; r < rows.length; r++) {
      const intervals = rows[r]
      const conflito = intervals.some(([s, e]) => {
        return !(effectiveColStart > e || (effectiveColStart + finalSpan - 1) < s)
      })
      if (!conflito) {
        assignedRow = r
        break
      }
    }
    if (assignedRow === -1) {
      assignedRow = Math.max(minRow, rows.length)
      while (rows.length <= assignedRow) rows.push([])
    }
    rows[assignedRow].push([effectiveColStart, effectiveColStart + finalSpan - 1])

    // Registrar row para sequencia OS
    if (inst.os_id !== null && inst.os_id !== undefined) {
      osRowMap.set(`${inst.os_id}-${inst.ordem}`, assignedRow)
    }

    result.push({ inst, colStart: effectiveColStart, span: finalSpan, row: assignedRow + 2 }) // +2 porque row 1 eh reservada pro drop zone
  }

  return result
})

const templatesFiltro = computed(() => {
  return templates.value.filter(t => t.ativo).map(t => ({ id: t.id, nome: t.nome }))
})

// Cronograma: horas visíveis (7h às 17h)
const HORA_INICIO_DIA = 7
const HORA_FIM_DIA = 18 // 18:00 = fim do dia de trabalho
const horasVisiveis = computed(() => Array.from({ length: HORA_FIM_DIA - HORA_INICIO_DIA }, (_, i) => i + HORA_INICIO_DIA))

// Slots do cronograma (dia + hora)
const cronogramaSlots = computed(() => {
  const slots: { key: string; dia: string; diaLabel: string; hora: number; isFirstHour: boolean }[] = []
  const dias = [...cronogramaDias.value].sort()
  for (const diaIso of dias) {
    const d = new Date(diaIso + 'T12:00:00')
    const labels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
    const diaLabel = `${labels[d.getDay()]} ${d.getDate()}`
    for (const h of horasVisiveis.value) {
      slots.push({ key: `${diaIso}-${h}`, dia: diaIso, diaLabel, hora: h, isFirstHour: h === horasVisiveis.value[0] })
    }
  }
  return slots
})

const totalSlots = computed(() => cronogramaSlots.value.length)

function toggleDiaCronograma(iso: string) {
  const idx = cronogramaDias.value.indexOf(iso)
  if (idx >= 0) {
    if (cronogramaDias.value.length > 1) cronogramaDias.value.splice(idx, 1)
  } else {
    cronogramaDias.value.push(iso)
    cronogramaDias.value.sort()
  }
}

function selecionarQuinzenal() {
  const hoje = new Date()
  const inicio = new Date(hoje)
  inicio.setDate(hoje.getDate() - hoje.getDay() + 1 + (semanaOffset.value * 7))
  const dias: string[] = []
  for (let i = 0; i < 14; i++) {
    const d = new Date(inicio)
    d.setDate(inicio.getDate() + i)
    dias.push(d.toISOString().split('T')[0])
  }
  cronogramaDias.value = dias
}

function selecionarMensal() {
  const hoje = new Date()
  const inicio = new Date(hoje.getFullYear(), hoje.getMonth() + (semanaOffset.value > 0 ? 1 : 0), 1)
  const fim = new Date(inicio.getFullYear(), inicio.getMonth() + 1, 0)
  const dias: string[] = []
  for (let d = new Date(inicio); d <= fim; d.setDate(d.getDate() + 1)) {
    dias.push(d.toISOString().split('T')[0])
  }
  cronogramaDias.value = dias
}

// Helper: adicionar N dias a uma data ISO string
function addDaysIso(isoDate: string, days: number): string {
  const d = new Date(isoDate + 'T12:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

// Helper: calcular posicao em slots a partir de data+hora
function dateTimeToSlot(diaIso: string, hora: number, min: number): number {
  const dias = [...cronogramaDias.value].sort()
  const horasPerDia = horasVisiveis.value.length
  const diaIdx = dias.indexOf(diaIso)
  if (diaIdx < 0) {
    // Dia fora do range visivel - calcular se antes ou depois
    if (diaIso < dias[0]) return 0
    return totalSlots.value
  }
  return diaIdx * horasPerDia + (hora - HORA_INICIO_DIA) + min / 60
}

// Helper: converter slot position de volta para data + hora
function slotToDateTime(slotPos: number): { dia: string; hora: number; min: number } {
  const dias = [...cronogramaDias.value].sort()
  const horasPerDia = horasVisiveis.value.length
  const clampedSlot = Math.max(0, Math.min(totalSlots.value, slotPos))
  const diaIdx = Math.min(dias.length - 1, Math.max(0, Math.floor(clampedSlot / horasPerDia)))
  const horaOffset = clampedSlot - (diaIdx * horasPerDia)
  const hora = Math.max(HORA_INICIO_DIA, Math.min(HORA_FIM_DIA, Math.floor(HORA_INICIO_DIA + horaOffset)))
  const min = Math.round(((HORA_INICIO_DIA + horaOffset) - hora) * 60 / 5) * 5
  return { dia: dias[diaIdx], hora, min: Math.max(0, Math.min(55, min)) }
}

// Agrupar por OS nos dias selecionados (inclui processos que TOCAM o range)
const cronogramaOSLinhas = computed(() => {
  const dias = [...cronogramaDias.value].sort()
  if (dias.length === 0) return []
  const primeiroIso = dias[0]
  const ultimoIso = dias[dias.length - 1]

  const doDias = instancias.value.filter(i => {
    if (i.status === 'cancelado') return false
    if (filtroProcesso.value && i.template_nome !== filtroProcesso.value) return false
    if (!i.data_prazo) return false
    const inicio = i.data_prazo
    const fim = (i as any).data_fim || i.data_prazo
    // Processo toca o range selecionado
    return inicio <= ultimoIso && fim >= primeiroIso
  }).sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))

  const porOS = new Map<number, typeof doDias>()
  for (const inst of doDias) {
    if (!inst.os_id) continue
    const arr = porOS.get(inst.os_id) ?? []
    arr.push(inst)
    porOS.set(inst.os_id, arr)
  }

  return Array.from(porOS.entries()).map(([osId, procs]) => ({
    osId,
    osNumero: procs[0]?.os_numero ?? `OS-${osId}`,
    produto: procs[0]?.titulo ?? '',
    processos: procs,
  }))
})

function calcBarLeft(inst: any): number {
  if (leftOverrides[inst.id] !== undefined) return leftOverrides[inst.id]
  const h = inst.hora_inicio ? parseInt(inst.hora_inicio.split(':')[0]) : 8
  const m = inst.hora_inicio ? parseInt(inst.hora_inicio.split(':')[1] ?? '0') : 0
  const slotPos = dateTimeToSlot(inst.data_prazo, h, m)
  return Math.max(0, (slotPos / totalSlots.value) * 100)
}

function calcBarWidth(inst: any): number {
  const override = widthOverrides[inst.id]

  // Dados de inicio
  const hI = inst.hora_inicio ? parseInt(inst.hora_inicio.split(':')[0]) : 8
  const mI = inst.hora_inicio ? parseInt(inst.hora_inicio.split(':')[1] ?? '0') : 0
  const dataInicio = inst.data_prazo

  if (override) {
    // Override armazena: "dataFim|horaFim" (ex: "2026-06-25|14:30") ou apenas "HH:MM" (mesmo dia)
    let dataFimOvr: string
    let hF: number
    let mF: number
    if (override.includes('|')) {
      const parts = override.split('|')
      dataFimOvr = parts[0]
      hF = parseInt(parts[1].split(':')[0])
      mF = parseInt(parts[1].split(':')[1] ?? '0')
    } else {
      dataFimOvr = dataInicio
      hF = parseInt(override.split(':')[0])
      mF = parseInt(override.split(':')[1] ?? '0')
    }
    const slotInicio = dateTimeToSlot(dataInicio, hI, mI)
    const slotFim = dateTimeToSlot(dataFimOvr, hF, mF)
    const duracao = Math.max(0.5, slotFim - slotInicio)
    return Math.max(3, (duracao / totalSlots.value) * 100)
  }

  // Sem override - usar dados do banco
  const dataFim = (inst as any).data_fim || dataInicio
  const hF = inst.hora_fim ? parseInt(inst.hora_fim.split(':')[0]) : hI + 1
  const mF = inst.hora_fim ? parseInt(inst.hora_fim.split(':')[1] ?? '0') : 0

  const slotInicio = dateTimeToSlot(dataInicio, hI, mI)
  const slotFim = dateTimeToSlot(dataFim, hF, mF)
  const duracao = Math.max(0.5, slotFim - slotInicio)
  return Math.max(3, (duracao / totalSlots.value) * 100)
}

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
let lastDragEndTime = 0

const kanbanGridRef = ref<HTMLElement | null>(null)

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

  // Validar: nao permitir processos dependentes (sequenciais) antes do predecessor
  if (dataIso && inst.sequencial && inst.ordem > 0) {
    const predecessor = instancias.value.find(i =>
      i.os_id === inst.os_id && i.ordem === inst.ordem - 1 && i.id !== inst.id
    )
    if (predecessor && predecessor.data_prazo && dataIso < predecessor.data_prazo) {
      draggedId = null
      return // Bloquear: nao pode ir antes do predecessor
    }
  }

  // Calcular span atual (dias de duracao) para manter ao mover
  const spanAtual = getKanbanDaysSpan(inst)
  inst.data_prazo = dataIso
  // Manter o span: data_fim = data_prazo + (span - 1) dias
  if (dataIso && spanAtual > 1) {
    ;(inst as any).data_fim = addDaysIso(dataIso, spanAtual - 1)
  } else {
    ;(inst as any).data_fim = dataIso
  }
  if (dataIso && inst.status === 'pendente') inst.status = 'em_andamento'
  // Manter hora_inicio e hora_fim (nao resetar)
  await atualizarInstancia(inst.id, { data_prazo: dataIso, status: inst.status, data_fim: (inst as any).data_fim } as any)
  draggedId = null
}

function onKanbanCardClick(inst: ProcessoInstancia) {
  // Ignorar clicks que acontecem logo apos um drag
  if (Date.now() - lastDragEndTime < 400) return
  abrirChecklist(inst)
}

function onDragEnd() {
  lastDragEndTime = Date.now()
  draggedId = null
}

// Determinar dia baseado na posicao X do mouse no grid
function getDiaFromGridX(e: DragEvent): string | null {
  const grid = kanbanGridRef.value
  if (!grid) return null
  const rect = grid.getBoundingClientRect()
  const relX = e.clientX - rect.left
  const colWidth = rect.width / diasSemana.value.length
  const colIdx = Math.max(0, Math.min(diasSemana.value.length - 1, Math.floor(relX / colWidth)))
  return diasSemana.value[colIdx]?.iso ?? null
}

function onKanbanGridDragOver(e: DragEvent) {
  const dia = getDiaFromGridX(e)
  if (dia) dragOverDia.value = dia
}

async function onKanbanGridDrop(e: DragEvent) {
  e.preventDefault()
  const dia = getDiaFromGridX(e)
  dragOverDia.value = null
  if (!draggedId) return
  const inst = instancias.value.find(i => i.id === draggedId)
  if (!inst) return

  // Validar: nao permitir processos dependentes antes do predecessor
  if (dia && inst.sequencial && inst.ordem > 0) {
    const predecessor = instancias.value.find(i =>
      i.os_id === inst.os_id && i.ordem === inst.ordem - 1 && i.id !== inst.id
    )
    if (predecessor && predecessor.data_prazo && dia < predecessor.data_prazo) {
      draggedId = null
      return
    }
  }

  // Manter span de dias ao mover
  const spanAtual = getKanbanDaysSpan(inst)
  inst.data_prazo = dia
  if (dia && spanAtual > 1) {
    ;(inst as any).data_fim = addDaysIso(dia, spanAtual - 1)
  } else {
    ;(inst as any).data_fim = dia
  }
  if (dia && inst.status === 'pendente') inst.status = 'em_andamento'
  await atualizarInstancia(inst.id, { data_prazo: dia, status: inst.status, data_fim: (inst as any).data_fim } as any)
  draggedId = null
}

// ─── Kanban: multi-dia helpers ────────────────────────────────────────────────
const KANBAN_COL_WIDTH = 200 // px estimativa por coluna no grid (para resize)
const kanbanResizingId = ref<number | null>(null)
const kanbanWidthOverrides = reactive<Record<number, number>>({}) // id -> dias span

function getKanbanDaysSpan(inst: any): number {
  if (kanbanWidthOverrides[inst.id]) return kanbanWidthOverrides[inst.id]
  if (!inst.data_prazo) return 1
  const dataFim = inst.data_fim || inst.data_prazo
  if (dataFim <= inst.data_prazo) return 1
  const diff = Math.round((new Date(dataFim + 'T12:00:00').getTime() - new Date(inst.data_prazo + 'T12:00:00').getTime()) / 86400000)
  return Math.max(1, diff + 1)
}

// ─── Kanban resize: esticar card para mais dias ───────────────────────────────
let kanbanResizeInst: any = null
let kanbanResizeStartX = 0
let kanbanResizeStartSpan = 1

function iniciarKanbanResize(e: MouseEvent, inst: any, diaIndex: number) {
  e.preventDefault()
  e.stopPropagation()
  kanbanResizeInst = inst
  kanbanResizingId.value = inst.id
  kanbanResizeStartX = e.clientX
  kanbanResizeStartSpan = getKanbanDaysSpan(inst)
  document.addEventListener('mousemove', onKanbanResizeMove)
  document.addEventListener('mouseup', onKanbanResizeEnd)
}

function onKanbanResizeMove(e: MouseEvent) {
  if (!kanbanResizeInst) return
  const deltaX = e.clientX - kanbanResizeStartX
  const deltaCols = Math.round(deltaX / KANBAN_COL_WIDTH)
  const newSpan = Math.max(1, Math.min(7, kanbanResizeStartSpan + deltaCols))
  kanbanWidthOverrides[kanbanResizeInst.id] = newSpan
}

async function onKanbanResizeEnd() {
  document.removeEventListener('mousemove', onKanbanResizeMove)
  document.removeEventListener('mouseup', onKanbanResizeEnd)
  kanbanResizingId.value = null
  if (!kanbanResizeInst) return
  const span = kanbanWidthOverrides[kanbanResizeInst.id] ?? 1
  const novaDataFim = addDaysIso(kanbanResizeInst.data_prazo, span - 1)
  ;(kanbanResizeInst as any).data_fim = novaDataFim
  delete kanbanWidthOverrides[kanbanResizeInst.id]

  const supabase = (await import('~/lib/supabase')).createSupabaseClient()
  await supabase.from('processos_instancia').update({ data_fim: novaDataFim }).eq('id', kanbanResizeInst.id)
  kanbanResizeInst = null
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

// ─── Drag para mover card (altera hora_inicio em tempo real) ──────────────────
let dragCardInst: any = null
let dragStartX = 0
let dragStartLeft = 0
let isDragging = false
let wasDragged = false

function onCardClick(proc: any) {
  if (wasDragged) { wasDragged = false; return }
  abrirChecklist(proc)
}

function onCardMouseDown(e: MouseEvent, inst: any) {
  // Se clicou no resize handle, não iniciar drag
  const target = e.target as HTMLElement
  if (target.closest('[data-resize]')) return
  iniciarDragCard(e, inst)
}

function iniciarDragCard(e: MouseEvent, inst: any) {
  dragCardInst = inst
  dragStartX = e.clientX
  dragStartLeft = calcBarLeft(inst)
  isDragging = false
  wasDragged = false
  document.addEventListener('mousemove', onDragCardMove)
  document.addEventListener('mouseup', onDragCardEnd)
}

function onDragCardMove(e: MouseEvent) {
  if (!dragCardInst) return
  if (!isDragging && Math.abs(e.clientX - dragStartX) < 5) return
  isDragging = true
  wasDragged = true
  const actualContainer = document.querySelector('[data-cronograma-area]') as HTMLElement
  const cw = actualContainer?.getBoundingClientRect().width || 800
  const deltaX = e.clientX - dragStartX
  const deltaPct = (deltaX / cw) * 100
  const newLeft = Math.max(0, Math.min(97, dragStartLeft + deltaPct))
  leftOverrides[dragCardInst.id] = newLeft
}

async function onDragCardEnd() {
  document.removeEventListener('mousemove', onDragCardMove)
  document.removeEventListener('mouseup', onDragCardEnd)
  if (!dragCardInst || !isDragging) { dragCardInst = null; return }

  // Converter left% para slot position, e de volta para dia + hora
  const left = leftOverrides[dragCardInst.id] ?? dragStartLeft
  const slotPos = (left / 100) * totalSlots.value
  const { dia: novaData, hora: h, min: m } = slotToDateTime(slotPos)
  const novaHoraInicio = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`

  // Manter duração original (em minutos) - considerar cross-day
  const hI_old = dragCardInst.hora_inicio ? parseInt(dragCardInst.hora_inicio.split(':')[0]) : 8
  const mI_old = dragCardInst.hora_inicio ? parseInt(dragCardInst.hora_inicio.split(':')[1] ?? '0') : 0
  const hF_old = dragCardInst.hora_fim ? parseInt(dragCardInst.hora_fim.split(':')[0]) : hI_old + 1
  const mF_old = dragCardInst.hora_fim ? parseInt(dragCardInst.hora_fim.split(':')[1] ?? '0') : 0

  // Calcular duracao total em minutos (considerando data_fim cross-day)
  const dataFimOld = (dragCardInst as any).data_fim || dragCardInst.data_prazo
  const dataInicioOld = dragCardInst.data_prazo || novaData
  const diasDiff = dataFimOld && dataInicioOld ? Math.round((new Date(dataFimOld + 'T12:00:00').getTime() - new Date(dataInicioOld + 'T12:00:00').getTime()) / 86400000) : 0
  const horasTrabalhoPerDia = HORA_FIM_DIA - HORA_INICIO_DIA
  const durMinTotal = diasDiff > 0
    ? ((HORA_FIM_DIA * 60) - (hI_old * 60 + mI_old)) + ((diasDiff - 1) * horasTrabalhoPerDia * 60) + ((hF_old * 60 + mF_old) - (HORA_INICIO_DIA * 60))
    : ((hF_old * 60 + mF_old) - (hI_old * 60 + mI_old)) || 60

  // Calcular novo fim mantendo a mesma duracao
  const inicioMin = h * 60 + m
  const minRestanteHoje = HORA_FIM_DIA * 60 - inicioMin
  let novaDataFim = novaData
  let novaHoraFim: string

  if (durMinTotal <= minRestanteHoje) {
    // Cabe no mesmo dia
    const fimMin = inicioMin + durMinTotal
    novaHoraFim = `${String(Math.floor(fimMin / 60)).padStart(2, '0')}:${String(fimMin % 60).padStart(2, '0')}`
  } else {
    // Cruza dias
    let minRestante = durMinTotal - minRestanteHoje
    let diasExtra = 1
    while (minRestante > horasTrabalhoPerDia * 60) {
      minRestante -= horasTrabalhoPerDia * 60
      diasExtra++
    }
    novaDataFim = addDaysIso(novaData, diasExtra)
    const fimMin = HORA_INICIO_DIA * 60 + minRestante
    novaHoraFim = `${String(Math.floor(fimMin / 60)).padStart(2, '0')}:${String(Math.round(fimMin % 60)).padStart(2, '0')}`
  }

  dragCardInst.data_prazo = novaData
  dragCardInst.hora_inicio = novaHoraInicio
  dragCardInst.hora_fim = novaHoraFim
  ;(dragCardInst as any).data_fim = novaDataFim
  delete leftOverrides[dragCardInst.id]

  const supabase = (await import('~/lib/supabase')).createSupabaseClient()
  await supabase.from('processos_instancia').update({
    data_prazo: novaData,
    hora_inicio: novaHoraInicio,
    hora_fim: novaHoraFim,
    data_fim: novaDataFim,
  }).eq('id', dragCardInst.id)
  dragCardInst = null
}

// ─── Resize por hora (tempo real, suporta cross-day) ──────────────────────────
let resizingInstHora: any = null
let resizeContainerEl: HTMLElement | null = null
let resizeContainerRect: DOMRect | null = null

function iniciarResizeHora(e: MouseEvent, inst: any) {
  e.preventDefault()
  e.stopPropagation()
  // Definir hora_fim se nao existir
  if (!inst.hora_fim) {
    const hI = inst.hora_inicio ? parseInt(inst.hora_inicio.split(':')[0]) : 8
    inst.hora_fim = `${String(hI + 1).padStart(2, '0')}:00`
  }
  if (!inst.hora_inicio) {
    inst.hora_inicio = '08:00'
  }
  resizingInstHora = inst
  wasDragged = true
  // Capturar o container e seu rect uma vez (evita reflow durante mousemove)
  const card = (e.target as HTMLElement).closest('[data-cronograma-area]') || document.querySelector('[data-cronograma-area]')
  resizeContainerEl = card as HTMLElement
  resizeContainerRect = resizeContainerEl?.getBoundingClientRect() || null
  document.addEventListener('mousemove', onResizeMoveHora)
  document.addEventListener('mouseup', onResizeEndHora)
}

function onResizeMoveHora(e: MouseEvent) {
  if (!resizingInstHora || !resizeContainerRect) return

  // Posicao absoluta do mouse dentro do container (0 a 1)
  const mouseRelX = Math.max(0, Math.min(1, (e.clientX - resizeContainerRect.left) / resizeContainerRect.width))

  // Converter para slot position
  const slotAtMouse = mouseRelX * totalSlots.value

  // Garantir minimo (hora_inicio + 15min = 0.25 slot)
  const hI = resizingInstHora.hora_inicio ? parseInt(resizingInstHora.hora_inicio.split(':')[0]) : 8
  const mI = resizingInstHora.hora_inicio ? parseInt(resizingInstHora.hora_inicio.split(':')[1] ?? '0') : 0
  const slotInicio = dateTimeToSlot(resizingInstHora.data_prazo, hI, mI)
  const slotMinimo = slotInicio + 0.25 // minimo 15min

  // Snap a cada 15min (0.25 slot)
  const snapped = Math.round(slotAtMouse * 4) / 4
  const clampedSlotFim = Math.max(slotMinimo, Math.min(totalSlots.value, snapped))

  // Converter de volta para data + hora
  const { dia: novaDataFim, hora: nHora, min: nMin } = slotToDateTime(clampedSlotFim)
  const horaStr = `${String(nHora).padStart(2, '0')}:${String(nMin).padStart(2, '0')}`

  // Armazenar como "data|hora" se cross-day, senao so "hora"
  if (novaDataFim !== resizingInstHora.data_prazo) {
    widthOverrides[resizingInstHora.id] = `${novaDataFim}|${horaStr}`
  } else {
    widthOverrides[resizingInstHora.id] = horaStr
  }
}

async function onResizeEndHora() {
  document.removeEventListener('mousemove', onResizeMoveHora)
  document.removeEventListener('mouseup', onResizeEndHora)
  resizeContainerEl = null
  resizeContainerRect = null
  if (!resizingInstHora) return
  const override = widthOverrides[resizingInstHora.id]
  if (override) {
    let novaDataFim: string
    let horaFim: string
    if (override.includes('|')) {
      const parts = override.split('|')
      novaDataFim = parts[0]
      horaFim = parts[1]
    } else {
      novaDataFim = resizingInstHora.data_prazo
      horaFim = override
    }
    resizingInstHora.hora_fim = horaFim
    ;(resizingInstHora as any).data_fim = novaDataFim

    const supabase = (await import('~/lib/supabase')).createSupabaseClient()
    await supabase.from('processos_instancia').update({
      hora_fim: horaFim,
      data_fim: novaDataFim,
    }).eq('id', resizingInstHora.id)
    delete widthOverrides[resizingInstHora.id]
  }
  resizingInstHora = null
}

// ─── Calendário de Entregas ───────────────────────────────────────────────────
const calendarioMesOffset = ref(0)
const osEntregas = ref<any[]>([])
const showOSModal = ref(false)
const osSelecionadaCalendario = ref<any>(null)
const itensOSCalendario = ref<ItemOS[]>([])

const calendarioMesLabel = computed(() => {
  const hoje = new Date()
  const d = new Date(hoje.getFullYear(), hoje.getMonth() + calendarioMesOffset.value, 1)
  return d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
})

const calendarioDias = computed(() => {
  const hoje = new Date()
  const hojeIso = hoje.toISOString().split('T')[0]
  const mesAtual = new Date(hoje.getFullYear(), hoje.getMonth() + calendarioMesOffset.value, 1)
  const primeiroDia = new Date(mesAtual.getFullYear(), mesAtual.getMonth(), 1)
  const ultimoDia = new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1, 0)

  // Ajustar para comecar na segunda
  const startDay = primeiroDia.getDay() === 0 ? 6 : primeiroDia.getDay() - 1
  const inicioGrid = new Date(primeiroDia)
  inicioGrid.setDate(primeiroDia.getDate() - startDay)

  const dias: { iso: string; numero: number; isHoje: boolean; isMesAtual: boolean }[] = []
  const totalCells = 42 // 6 semanas
  for (let i = 0; i < totalCells; i++) {
    const d = new Date(inicioGrid)
    d.setDate(inicioGrid.getDate() + i)
    const iso = d.toISOString().split('T')[0]
    dias.push({
      iso,
      numero: d.getDate(),
      isHoje: iso === hojeIso,
      isMesAtual: d.getMonth() === mesAtual.getMonth(),
    })
  }
  return dias
})

function calendarioOsPorDia(iso: string) {
  return osEntregas.value.filter(os => {
    if (!os.data_entrega) return false
    // Normalizar: pode vir como "2026-07-04" ou "2026-07-04T00:00:00+00:00"
    const entregaIso = os.data_entrega.includes('T') ? os.data_entrega.split('T')[0] : os.data_entrega
    return entregaIso === iso
  })
}

async function carregarOsEntregas() {
  const supabase = (await import('~/lib/supabase')).createSupabaseClient()
  const { data, error } = await supabase
    .from('ordens_servico_adesivo')
    .select('id, numero_os, nome_trabalho, status, data_entrega, clientes(nome)')
    .not('data_entrega', 'is', null)
    .not('status', 'eq', 'cancelado')
    .order('data_entrega', { ascending: true })
  if (error) { console.error('Erro ao carregar OS entregas:', error); return }
  const hojeIso = new Date().toISOString().split('T')[0]
  osEntregas.value = (data ?? []).map((os: any) => {
    // Normalizar data_entrega para YYYY-MM-DD
    const raw = os.data_entrega
    const entrega = raw ? (raw.includes('T') ? raw.split('T')[0] : raw) : null
    return {
      id: os.id,
      numero_os: os.numero_os,
      nome_trabalho: os.nome_trabalho,
      status: os.status,
      data_entrega: entrega,
      cliente_nome: os.clientes?.nome ?? null,
      atrasado: entrega && entrega < hojeIso && os.status !== 'entregue' && os.status !== 'cancelado',
    }
  })
}

async function abrirOSCalendario(os: any) {
  const supabase = (await import('~/lib/supabase')).createSupabaseClient()
  const { data: osData } = await supabase
    .from('ordens_servico_adesivo')
    .select('*, clientes(nome, telefone)')
    .eq('id', os.id)
    .single()
  if (!osData) return
  const { data: itensData } = await supabase
    .from('itens_ordem_servico')
    .select('id, item_orcamento_id, descricao, material_id, largura_cm, altura_cm, quantidade, valor_item, foto_arte_url, foto_local_url, arquivo_url, foto_instalacao_url')
    .eq('ordem_servico_id', os.id)
    .order('id', { ascending: true })
  osSelecionadaCalendario.value = {
    ...osData,
    cliente_nome: osData.clientes?.nome ?? null,
    cliente_telefone: osData.clientes?.telefone ?? null,
    endereco_instalacao: osData.endereco_instalacao ?? null,
    nome_trabalho: osData.nome_trabalho ?? null,
    data_entrega: osData.data_entrega ?? null,
  }
  itensOSCalendario.value = (itensData ?? []) as ItemOS[]
  showOSModal.value = true
}

// ─── Calendário Drag & Drop ──────────────────────────────────────────────────
const calDragOverDia = ref<string | null>(null)
let calDraggedOs: any = null
let calLastDragEnd = 0

function onCalDragStart(e: DragEvent, os: any) {
  calDraggedOs = os
  e.dataTransfer?.setData('text/plain', String(os.id))
}

function onCalDragEnd() {
  calLastDragEnd = Date.now()
  calDragOverDia.value = null
}

function onCalCardClick(os: any) {
  if (Date.now() - calLastDragEnd < 400) return
  abrirOSCalendario(os)
}

async function onCalDrop(e: DragEvent, diaIso: string) {
  e.preventDefault()
  calDragOverDia.value = null
  if (!calDraggedOs) return
  const os = calDraggedOs
  calDraggedOs = null

  // Atualizar localmente
  os.data_entrega = diaIso

  // Salvar no banco
  const supabase = (await import('~/lib/supabase')).createSupabaseClient()
  await supabase.from('ordens_servico_adesivo').update({ data_entrega: diaIso }).eq('id', os.id)
}

onMounted(async () => {
  instancias.value = await carregarInstancias(['pendente', 'em_andamento', 'concluido'])
  templates.value = await carregarTemplates()
  carregarOsEntregas()
})

// Realtime: atualiza ao vivo quando processos mudam
useRealtimeMulti(['processos_instancia', 'processos_checklist', 'ordens_servico_adesivo'], async () => {
  instancias.value = await carregarInstancias(['pendente', 'em_andamento', 'concluido'])
  carregarOsEntregas()
})
</script>
