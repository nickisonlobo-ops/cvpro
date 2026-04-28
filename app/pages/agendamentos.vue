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
              <AppNavIcon name="calendar" class="w-5 sm:w-7 h-5 sm:h-7 text-white" />
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-semibold text-white/80 uppercase tracking-widest">Agenda</span>
              </div>
              <h1 class="text-xl sm:text-3xl font-bold text-white tracking-tight leading-none">Agendamentos</h1>
              <p class="text-sm text-white/80 mt-1.5">
                {{ loading ? 'Carregando...' : `${agendamentosFiltrados.length} de ${agendamentos.length} agendamento(s)` }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <!-- Configurar horários de agendamento -->
            <button
              v-if="empresaId"
              type="button"
              class="inline-flex items-center gap-2 text-sm font-semibold px-3 sm:px-4 py-2.5 rounded-xl transition-all duration-200 bg-white/10 text-white hover:bg-white/20 border border-white/15 backdrop-blur-sm"
              title="Configurar horários de atendimento"
              @click="horarioModalAberto = true"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span class="hidden sm:inline">Horários</span>
            </button>

            <!-- Link público de agendamento -->
            <button
              v-if="empresaId"
              type="button"
              class="inline-flex items-center gap-2 text-sm font-semibold px-3 sm:px-4 py-2.5 rounded-xl transition-all duration-200 bg-white/10 text-white hover:bg-white/20 border border-white/15 backdrop-blur-sm"
              :title="linkCopiado ? 'Link copiado!' : 'Copiar link público de agendamento'"
              @click="copiarLinkPublico"
            >
              <svg v-if="!linkCopiado" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"/>
              </svg>
              <svg v-else class="w-4 h-4 text-green-300" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
              </svg>
              <span class="hidden sm:inline">{{ linkCopiado ? 'Copiado!' : 'Link público' }}</span>
            </button>

            <button
              type="button"
              class="inline-flex items-center gap-2 text-sm font-semibold px-3 sm:px-5 py-2.5 rounded-xl transition-all duration-200"
              :class="filtroAberto ? 'bg-white text-[#ff46a2] shadow-lg scale-[1.02]' : 'bg-white/10 text-white hover:bg-white/20 border border-white/15 backdrop-blur-sm'"
              @click="filtroAberto = !filtroAberto"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/></svg>
              <span class="hidden sm:inline">Filtros</span>
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-2 text-sm font-bold px-3 sm:px-5 py-2.5 rounded-xl bg-white text-[#ff46a2] hover:bg-pink-50 shadow-lg shadow-pink-200/40 transition-all duration-200 hover:scale-[1.02]"
              @click="abrirAdicionar"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
              <span class="hidden sm:inline">Novo Agendamento</span>
            </button>
          </div>
        </div>

        <div class="h-px bg-white/10 my-4 sm:my-6" />

        <!-- Stats -->
        <div v-if="!loading" class="grid grid-cols-3 sm:grid-cols-6 gap-3">
          <div v-for="stat in stats" :key="stat.label" class="flex flex-col gap-1 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/10">
            <span class="text-xs font-semibold text-white/70 uppercase tracking-widest">{{ stat.label }}</span>
            <span class="text-2xl font-black" :class="stat.color">{{ stat.value }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- FILTROS -->
    <div v-if="filtroAberto" class="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-4 sm:p-6 mb-6 flex flex-wrap gap-4">
      <div class="flex-1 min-w-[180px]">
        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Buscar cliente</label>
        <input
          v-model="filtro.busca"
          type="text"
          placeholder="Nome do cliente..."
          class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
        />
      </div>
      <div class="flex-1 min-w-[220px]">
        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Status</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="s in ['solicitado','agendado','confirmado','concluido','cancelado','faltou']"
            :key="s"
            type="button"
            class="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-all"
            :class="filtro.status.includes(s) ? statusBadge(s) + ' border-transparent scale-[1.04]' : 'border-gray-200 text-gray-500 hover:border-pink-200 hover:text-pink-500'"
            @click="filtro.status.includes(s) ? filtro.status.splice(filtro.status.indexOf(s), 1) : filtro.status.push(s)"
          >
            <span class="w-1.5 h-1.5 rounded-full" :class="statusCor(s)" />
            {{ statusLabel(s) }}
          </button>
        </div>
      </div>
      <div class="min-w-[140px]">
        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Data</label>
        <input
          v-model="filtro.data"
          type="date"
          class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
        />
      </div>
    </div>

    <!-- ERRO -->
    <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4 mb-6 text-sm">{{ error }}</div>

    <!-- LOADING -->
    <div v-if="loading" class="flex justify-center py-20">
      <svg class="animate-spin w-8 h-8 text-violet-400" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
    </div>

    <!-- TABELA DE AGENDAMENTOS -->
    <div v-if="!loading" class="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
      <div class="flex items-center justify-between px-7 py-4 border-b border-gray-100 bg-gray-50/50">
        <span class="text-sm font-semibold text-gray-600">
          <span class="text-[#ff46a2] font-black">{{ agendamentosFiltrados.length }}</span> resultado(s)
        </span>
        <span class="text-xs text-gray-400">Ordenado por data</span>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm whitespace-nowrap">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="text-left px-5 py-3 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Data</th>
              <th class="text-left px-5 py-3 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Hora</th>
              <th class="text-left px-5 py-3 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Cliente</th>
              <th class="text-left px-5 py-3 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Serviços</th>
              <th class="text-left px-5 py-3 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Profissional</th>
              <th class="text-left px-5 py-3 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Valor</th>
              <th class="text-left px-5 py-3 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Status</th>
              <th class="px-5 py-3 text-right text-xs font-extrabold text-gray-400 uppercase tracking-widest sm:sticky sm:right-0 bg-gray-50">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-if="agendamentosFiltrados.length === 0">
              <td colspan="8" class="text-center py-16">
                <div class="flex flex-col items-center gap-2">
                  <AppNavIcon name="calendar" class="w-12 h-12 text-gray-200" />
                  <span class="text-sm font-semibold text-gray-400">Nenhum agendamento encontrado</span>
                </div>
              </td>
            </tr>
            <tr
              v-for="ag in agendamentosFiltrados"
              :key="ag.id"
              class="hover:bg-pink-50/40 transition-colors duration-150 group"
              :class="ag.status === 'solicitado' ? 'bg-amber-50/40' : ''"
            >
              <td class="px-5 py-3 font-semibold text-gray-700">
                {{ new Date(ag.data_hora).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', timeZone: 'America/Sao_Paulo' }) }}
              </td>
              <td class="px-5 py-3 font-semibold text-[#ff46a2]">{{ formatHora(ag.data_hora) }}</td>
              <td class="px-5 py-3">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white font-black text-[10px] shrink-0 shadow-sm shadow-pink-200">
                    {{ (ag.cliente_nome ?? ag.nome_solicitante ?? '?').slice(0, 2).toUpperCase() }}
                  </div>
                  <span class="font-semibold text-gray-800 max-w-[140px] truncate">{{ ag.cliente_nome ?? ag.nome_solicitante ?? '—' }}</span>
                </div>
              </td>
              <td class="px-5 py-3 text-gray-500 max-w-[180px] truncate">{{ ag.servicos_nomes ?? '—' }}</td>
              <td class="px-5 py-3 text-gray-500">{{ ag.funcionario_nome ?? '—' }}</td>
              <td class="px-5 py-3 font-bold text-gray-800">{{ ag.valor_total != null ? formatPreco(ag.valor_total) : '—' }}</td>
              <td class="px-5 py-3">
                <span class="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full" :class="statusBadge(ag.status)">
                  <span class="w-1.5 h-1.5 rounded-full" :class="statusCor(ag.status)" />
                  {{ statusLabel(ag.status) }}
                </span>
              </td>
              <td class="px-5 py-3 text-right sm:sticky sm:right-0 group-hover:bg-pink-50/40 transition-colors">
                <div class="flex items-center justify-end gap-1">
                  <!-- Ações para solicitações -->
                  <template v-if="ag.status === 'solicitado'">
                    <button
                      type="button"
                      class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-500 text-white text-[10px] font-bold hover:bg-green-600 transition-colors"
                      title="Aprovar solicitação"
                      @click="aprovarSolicitacao(ag)"
                    >✓ Aprovar</button>
                    <button
                      type="button"
                      class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-400 text-white text-[10px] font-bold hover:bg-red-500 transition-colors"
                      title="Recusar solicitação"
                      @click="recusarSolicitacao(ag)"
                    >✗ Recusar</button>
                  </template>
                  <!-- Ações para agendamentos normais -->
                  <template v-else>
                    <button
                      type="button"
                      class="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-[#ff46a2] hover:bg-pink-100 transition-colors"
                      title="Editar"
                      @click="editAgendamento(ag)"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487a2.1 2.1 0 112.97 2.97L8.5 18.81l-4 1 1-4 11.362-11.323z"/></svg>
                    </button>
                    <button
                      v-if="isAdminOrGerente"
                      type="button"
                      class="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-red-400 hover:bg-red-50 transition-colors"
                      title="Excluir"
                      @click="confirmarExclusao(ag)"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a1 1 0 01-1-1V5a1 1 0 011-1h6a1 1 0 011 1v1a1 1 0 01-1 1H9z"/></svg>
                    </button>
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- KANBAN SEMANAL -->
    <div v-if="!loading" class="mt-8">
      <div class="flex items-center gap-3 mb-4">
        <h2 class="text-base font-bold text-gray-800 capitalize">{{ kanbanMesLabel }}</h2>
        <button
          type="button"
          class="text-xs font-semibold px-3 py-1.5 rounded-xl bg-pink-100 text-[#ff46a2] hover:bg-pink-200 transition-colors"
          @click="irParaHoje"
        >Hoje</button>
        <div class="ml-auto flex gap-2">
          <button type="button" class="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-pink-50 hover:text-[#ff46a2] transition-colors shadow-sm" @click="semanaAnterior">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button type="button" class="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-pink-50 hover:text-[#ff46a2] transition-colors shadow-sm" @click="semanaProxima">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
      <!-- Mobile: 4 dias em cima + 3 dias centralizados em baixo -->
      <div class="sm:hidden space-y-2">
        <div class="grid grid-cols-4 gap-2">
          <div v-for="dia in kanbanDias.slice(0, 4)" :key="dia.iso" class="flex flex-col min-w-0">
            <div
              class="flex flex-col items-center py-2 px-1 rounded-2xl mb-2 border transition-colors"
              :class="dia.hoje ? 'border-transparent shadow-md' : 'bg-white border-gray-200'"
              :style="dia.hoje ? { background: 'var(--color-primary-bg, linear-gradient(180deg, #ec4899, #f43f5e))' } : {}"
            >
              <span class="text-[10px] font-bold tracking-widest" :class="dia.hoje ? 'text-white/80' : 'text-gray-400'">{{ dia.diaSemana }}</span>
              <span class="text-xl font-black leading-none mt-0.5" :class="dia.hoje ? 'text-white' : 'text-gray-800'">{{ dia.diaNum }}</span>
              <span class="text-[10px] font-bold mt-1 rounded-full px-2 py-0.5" :class="dia.hoje ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'">{{ (kanbanPorDia[dia.iso] ?? []).length }}</span>
            </div>
            <div
              class="flex flex-col gap-1.5 flex-1 rounded-2xl p-1 transition-colors min-h-[48px]"
              :class="kanbanDragOver === dia.iso ? 'bg-white/60 ring-2 ring-offset-1' : ''"
              :style="kanbanDragOver === dia.iso ? { '--tw-ring-color': 'var(--color-primary, #ec4899)' } : {}"
              @dragover.prevent="kanbanDragOver = dia.iso"
              @dragleave="kanbanDragOver = null"
              @drop.prevent="kanbanDrop(dia.iso)"
            >
              <div
                v-for="ag in kanbanPorDia[dia.iso]"
                :key="ag.id"
                :draggable="ag.status !== 'solicitado'"
                class="rounded-xl border shadow-sm px-2.5 py-2 transition-all select-none"
                :class="[
                  ag.status === 'solicitado'
                    ? 'bg-amber-50 border-amber-200 cursor-default hover:border-amber-300 hover:shadow-md'
                    : 'bg-white border-gray-200/80 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-pink-200',
                  kanbanDragging === ag.id ? 'opacity-40 scale-95' : ''
                ]"
                @dragstart="ag.status !== 'solicitado' && kanbanDragStart(ag)"
                @dragend="kanbanDragEnd"
                @click="ag.status !== 'solicitado' && editAgendamento(ag)"
              >
                <div class="h-0.5 w-full rounded-full mb-2" :class="statusCor(ag.status)" />
                <p class="text-xs font-bold text-gray-900 truncate leading-tight">{{ ag.cliente_nome ?? ag.nome_solicitante ?? '\u2014' }}</p>
                <p class="text-[10px] font-semibold text-[#ff46a2] mt-0.5">{{ formatHora(ag.data_hora) }}</p>
                <p v-if="ag.servicos_nomes" class="text-[10px] text-gray-400 mt-0.5 truncate">{{ ag.servicos_nomes }}</p>
                <p v-if="ag.funcionario_nome" class="text-[10px] text-indigo-500 font-semibold mt-0.5 truncate">👤 {{ ag.funcionario_nome }}</p>
                <span class="inline-flex mt-1.5 items-center rounded-full px-1.5 py-0.5 text-[9px] font-semibold" :class="statusBadge(ag.status)">{{ statusLabel(ag.status) }}</span>
                <div v-if="ag.status === 'solicitado'" class="flex gap-1 mt-1.5">
                  <button type="button" class="flex-1 py-1 rounded-lg bg-green-500 text-white text-[9px] font-bold hover:bg-green-600 transition-colors" @click.stop="aprovarSolicitacao(ag)">✓</button>
                  <button type="button" class="flex-1 py-1 rounded-lg bg-red-400 text-white text-[9px] font-bold hover:bg-red-500 transition-colors" @click.stop="recusarSolicitacao(ag)">✗</button>
                </div>
                <a
                  v-else-if="ag.cliente_telefone"
                  :href="`https://wa.me/55${ag.cliente_telefone.replace(/\D/g, '')}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="mt-1.5 flex items-center justify-center w-full py-1 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
                  @click.stop
                >
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
              </div>
              <button
                type="button"
                class="mt-0.5 w-full py-2 rounded-xl border border-dashed border-gray-200 text-gray-300 text-[10px] font-semibold hover:border-pink-300 hover:text-[#ff46a2] transition-colors"
                @click="abrirAdicionar"
              >+ novo</button>
            </div>
          </div>
        </div>
        <div class="flex justify-center gap-2">
          <div v-for="dia in kanbanDias.slice(4)" :key="dia.iso" class="flex flex-col min-w-0 shrink-0 basis-[calc(25%-6px)]">
            <div
              class="flex flex-col items-center py-2 px-1 rounded-2xl mb-2 border transition-colors"
              :class="dia.hoje ? 'border-transparent shadow-md' : 'bg-white border-gray-200'"
              :style="dia.hoje ? { background: 'var(--color-primary-bg, linear-gradient(180deg, #ec4899, #f43f5e))' } : {}"
            >
              <span class="text-[10px] font-bold tracking-widest" :class="dia.hoje ? 'text-white/80' : 'text-gray-400'">{{ dia.diaSemana }}</span>
              <span class="text-xl font-black leading-none mt-0.5" :class="dia.hoje ? 'text-white' : 'text-gray-800'">{{ dia.diaNum }}</span>
              <span class="text-[10px] font-bold mt-1 rounded-full px-2 py-0.5" :class="dia.hoje ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'">{{ (kanbanPorDia[dia.iso] ?? []).length }}</span>
            </div>
            <div
              class="flex flex-col gap-1.5 flex-1 rounded-2xl p-1 transition-colors min-h-[48px]"
              :class="kanbanDragOver === dia.iso ? 'bg-white/60 ring-2 ring-offset-1' : ''"
              :style="kanbanDragOver === dia.iso ? { '--tw-ring-color': 'var(--color-primary, #ec4899)' } : {}"
              @dragover.prevent="kanbanDragOver = dia.iso"
              @dragleave="kanbanDragOver = null"
              @drop.prevent="kanbanDrop(dia.iso)"
            >
              <div
                v-for="ag in kanbanPorDia[dia.iso]"
                :key="ag.id"
                :draggable="ag.status !== 'solicitado'"
                class="rounded-xl border shadow-sm px-2.5 py-2 transition-all select-none"
                :class="[
                  ag.status === 'solicitado'
                    ? 'bg-amber-50 border-amber-200 cursor-default hover:border-amber-300 hover:shadow-md'
                    : 'bg-white border-gray-200/80 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-pink-200',
                  kanbanDragging === ag.id ? 'opacity-40 scale-95' : ''
                ]"
                @dragstart="ag.status !== 'solicitado' && kanbanDragStart(ag)"
                @dragend="kanbanDragEnd"
                @click="ag.status !== 'solicitado' && editAgendamento(ag)"
              >
                <div class="h-0.5 w-full rounded-full mb-2" :class="statusCor(ag.status)" />
                <p class="text-xs font-bold text-gray-900 truncate leading-tight">{{ ag.cliente_nome ?? ag.nome_solicitante ?? '\u2014' }}</p>
                <p class="text-[10px] font-semibold text-[#ff46a2] mt-0.5">{{ formatHora(ag.data_hora) }}</p>
                <p v-if="ag.servicos_nomes" class="text-[10px] text-gray-400 mt-0.5 truncate">{{ ag.servicos_nomes }}</p>
                <p v-if="ag.funcionario_nome" class="text-[10px] text-indigo-500 font-semibold mt-0.5 truncate">👤 {{ ag.funcionario_nome }}</p>
                <span class="inline-flex mt-1.5 items-center rounded-full px-1.5 py-0.5 text-[9px] font-semibold" :class="statusBadge(ag.status)">{{ statusLabel(ag.status) }}</span>
                <div v-if="ag.status === 'solicitado'" class="flex gap-1 mt-1.5">
                  <button type="button" class="flex-1 py-1 rounded-lg bg-green-500 text-white text-[9px] font-bold hover:bg-green-600 transition-colors" @click.stop="aprovarSolicitacao(ag)">✓</button>
                  <button type="button" class="flex-1 py-1 rounded-lg bg-red-400 text-white text-[9px] font-bold hover:bg-red-500 transition-colors" @click.stop="recusarSolicitacao(ag)">✗</button>
                </div>
                <a
                  v-else-if="ag.cliente_telefone"
                  :href="`https://wa.me/55${ag.cliente_telefone.replace(/\D/g, '')}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="mt-1.5 flex items-center justify-center w-full py-1 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
                  @click.stop
                >
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
              </div>
              <button
                type="button"
                class="mt-0.5 w-full py-2 rounded-xl border border-dashed border-gray-200 text-gray-300 text-[10px] font-semibold hover:border-pink-300 hover:text-[#ff46a2] transition-colors"
                @click="abrirAdicionar"
              >+ novo</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Desktop: 7 colunas em linha -->
      <div class="hidden sm:grid grid-cols-7 gap-2 min-w-0">
        <div v-for="dia in kanbanDias" :key="dia.iso" class="flex flex-col min-w-0">
          <div
            class="flex flex-col items-center py-2 px-1 rounded-2xl mb-2 border transition-colors"
            :class="dia.hoje ? 'border-transparent shadow-md' : 'bg-white border-gray-200'"
            :style="dia.hoje ? { background: 'var(--color-primary-bg, linear-gradient(180deg, #ec4899, #f43f5e))' } : {}"
          >
            <span class="text-[10px] font-bold tracking-widest" :class="dia.hoje ? 'text-white/80' : 'text-gray-400'">{{ dia.diaSemana }}</span>
            <span class="text-xl font-black leading-none mt-0.5" :class="dia.hoje ? 'text-white' : 'text-gray-800'">{{ dia.diaNum }}</span>
            <span class="text-[10px] font-bold mt-1 rounded-full px-2 py-0.5" :class="dia.hoje ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'">{{ (kanbanPorDia[dia.iso] ?? []).length }}</span>
          </div>
          <div
            class="flex flex-col gap-1.5 flex-1 rounded-2xl p-1 transition-colors min-h-[48px]"
            :class="kanbanDragOver === dia.iso ? 'bg-white/60 ring-2 ring-offset-1' : ''"
            :style="kanbanDragOver === dia.iso ? { '--tw-ring-color': 'var(--color-primary, #ec4899)' } : {}"
            @dragover.prevent="kanbanDragOver = dia.iso"
            @dragleave="kanbanDragOver = null"
            @drop.prevent="kanbanDrop(dia.iso)"
          >
            <div
              v-for="ag in kanbanPorDia[dia.iso]"
              :key="ag.id"
              :draggable="ag.status !== 'solicitado'"
              class="rounded-xl border shadow-sm px-2.5 py-2 transition-all select-none"
              :class="[
                ag.status === 'solicitado'
                  ? 'bg-amber-50 border-amber-200 cursor-default hover:border-amber-300 hover:shadow-md'
                  : 'bg-white border-gray-200/80 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-pink-200',
                kanbanDragging === ag.id ? 'opacity-40 scale-95' : ''
              ]"
              @dragstart="ag.status !== 'solicitado' && kanbanDragStart(ag)"
              @dragend="kanbanDragEnd"
              @click="ag.status !== 'solicitado' && editAgendamento(ag)"
            >
              <div class="h-0.5 w-full rounded-full mb-2" :class="statusCor(ag.status)" />
              <p class="text-xs font-bold text-gray-900 truncate leading-tight">{{ ag.cliente_nome ?? ag.nome_solicitante ?? '\u2014' }}</p>
              <p class="text-[10px] font-semibold text-[#ff46a2] mt-0.5">{{ formatHora(ag.data_hora) }}</p>
              <p v-if="ag.servicos_nomes" class="text-[10px] text-gray-400 mt-0.5 truncate">{{ ag.servicos_nomes }}</p>
              <p v-if="ag.funcionario_nome" class="text-[10px] text-indigo-500 font-semibold mt-0.5 truncate">👤 {{ ag.funcionario_nome }}</p>
              <span class="inline-flex mt-1.5 items-center rounded-full px-1.5 py-0.5 text-[9px] font-semibold" :class="statusBadge(ag.status)">{{ statusLabel(ag.status) }}</span>
              <div v-if="ag.status === 'solicitado'" class="flex gap-1.5 mt-2">
                <button type="button" class="flex-1 py-1.5 rounded-lg bg-green-500 text-white text-[10px] font-bold hover:bg-green-600 transition-colors" @click.stop="aprovarSolicitacao(ag)">✓ Aprovar</button>
                <button type="button" class="flex-1 py-1.5 rounded-lg bg-red-400 text-white text-[10px] font-bold hover:bg-red-500 transition-colors" @click.stop="recusarSolicitacao(ag)">✗ Recusar</button>
              </div>
              <a
                v-else-if="ag.cliente_telefone"
                :href="`https://wa.me/55${ag.cliente_telefone.replace(/\D/g, '')}`"
                target="_blank"
                rel="noopener noreferrer"
                class="mt-2 flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg bg-green-500 text-white text-[10px] font-bold hover:bg-green-600 transition-colors"
                @click.stop
              >
                <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
            </div>
            <button
              type="button"
              class="mt-0.5 w-full py-2 rounded-xl border border-dashed border-gray-200 text-gray-300 text-[10px] font-semibold hover:border-pink-300 hover:text-[#ff46a2] transition-colors"
              @click="abrirAdicionar"
            >+ novo</button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL ADICIONAR / EDITAR -->
    <Teleport to="body">
      <div v-if="adicionando || editando" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="fecharModal" />
        <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div class="px-6 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between">
            <h2 class="text-lg font-bold text-gray-900">{{ editando ? 'Editar Agendamento' : 'Novo Agendamento' }}</h2>
            <button type="button" class="text-gray-400 hover:text-gray-600 transition-colors" @click="fecharModal">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <form class="px-6 py-5 flex flex-col gap-4" @submit.prevent="editando ? salvarEdicao() : salvarAdicao()">
            <div v-if="modalError" class="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">{{ modalError }}</div>

            <!-- Banner de solicitação -->
            <div v-if="editando?.nome_solicitante" class="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <p class="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Solicitação do link público</p>
              <p class="text-sm font-bold text-amber-900">{{ editando.nome_solicitante }}</p>
              <p class="text-xs text-amber-700">{{ editando.telefone_solicitante }}</p>
              <p class="text-[10px] text-amber-600 mt-1">Selecione ou cadastre o cliente e confirme o agendamento.</p>
            </div>

            <!-- Cliente -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="text-xs font-semibold text-gray-600 uppercase tracking-widest">Cliente <span class="text-red-500">*</span></label>
                <button
                  type="button"
                  class="inline-flex items-center gap-1 text-xs font-bold text-[#ff46a2] hover:text-pink-600 transition-colors"
                  @click="quickClienteAberto = !quickClienteAberto"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
                  Cadastro rápido
                </button>
              </div>

              <select
                v-model="form.cliente_id"
                class="w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                :class="formErrors.cliente_id ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'"
              >
                <option :value="null" disabled>Selecione o cliente</option>
                <option v-for="c in clientes" :key="c.id" :value="c.id">{{ c.nome }}</option>
              </select>
              <p v-if="formErrors.cliente_id" class="text-xs text-red-500 mt-1">{{ formErrors.cliente_id }}</p>
            </div>

            <!-- Data e hora -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-1.5">Data <span class="text-red-500">*</span></label>
                <input
                  v-model="form.data"
                  type="date"
                  class="w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                  :class="formErrors.data ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'"
                />
                <p v-if="formErrors.data" class="text-xs text-red-500 mt-1">{{ formErrors.data }}</p>
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-1.5">Hora <span class="text-red-500">*</span></label>
                <select
                  v-model="form.hora"
                  class="w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                  :class="formErrors.hora ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'"
                >
                  <option value="">Selecione</option>
                  <option v-for="h in horasOpcoes" :key="h" :value="h">{{ h }}</option>
                </select>
                <p v-if="formErrors.hora" class="text-xs text-red-500 mt-1">{{ formErrors.hora }}</p>
              </div>
            </div>

            <!-- Status e Profissional -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-1.5">Status</label>
                <select v-model="form.status" class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400">
                  <option value="agendado">Agendado</option>
                  <option value="confirmado">Confirmado</option>
                  <option value="concluido">Concluído</option>
                  <option value="cancelado">Cancelado</option>
                  <option value="faltou">Faltou</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-1.5">Profissional</label>
                <select v-model="form.funcionario_bigint_id" class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400">
                  <option :value="null">Não atribuído</option>
                  <option v-for="f in funcionarios" :key="f.id" :value="f.id">{{ f.nome ?? f.email }}</option>
                </select>
              </div>
            </div>

            <!-- Serviço -->
            <div>
              <label class="block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-1.5">Serviço</label>
              <div class="flex flex-col gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-xl p-2 bg-gray-50">
                <label
                  v-for="s in servicosAtivos"
                  :key="s.id"
                  class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white cursor-pointer transition-colors"
                  :class="form.servico_id === s.id ? 'bg-violet-50 border border-violet-200' : ''"
                >
                  <input
                    type="radio"
                    name="servico_agendamento"
                    :value="s.id"
                    v-model="form.servico_id"
                    class="accent-violet-500 focus:ring-violet-400"
                  />
                  <span class="flex-1 text-sm font-medium text-gray-800">{{ s.nome }}</span>
                  <span class="text-xs text-gray-500">{{ formatPreco(s.preco) }}</span>
                  <span class="text-xs text-gray-400">{{ s.duracao_min }}min</span>
                </label>
                <p v-if="!servicosAtivos.length" class="text-xs text-gray-400 text-center py-2">Nenhum serviço ativo cadastrado</p>
              </div>
              <p v-if="form.servico_id" class="text-xs text-violet-600 font-semibold mt-1.5">
                Total estimado: {{ formatPreco(totalSelecionado) }}
              </p>
            </div>

            <!-- Observações -->
            <div>
              <label class="block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-1.5">Observações</label>
              <textarea
                v-model="form.observacoes"
                rows="2"
                placeholder="Observações sobre o agendamento..."
                class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
              />
            </div>

            <div class="flex gap-3 pt-2">
              <button type="button" class="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50" @click="fecharModal">Cancelar</button>
              <button
                type="submit"
                :disabled="saving"
                class="flex-1 py-2.5 rounded-xl bg-[#ff46a2] text-white text-sm font-bold hover:bg-pink-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ saving ? 'Salvando...' : (editando ? 'Salvar' : 'Agendar') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- CARD CADASTRO RÁPIDO DE CLIENTE -->
    <Teleport to="body">
      <Transition name="quick-card">
        <div v-if="quickClienteAberto" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/30 backdrop-blur-[2px]" @click="quickClienteAberto = false" />
          <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm border border-pink-100">
            <!-- Header -->
            <div class="px-6 pt-5 pb-4 border-b border-pink-100 flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-rose-400 flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                </div>
                <h3 class="text-base font-bold text-gray-900">Novo Cliente</h3>
              </div>
              <button type="button" class="text-gray-400 hover:text-gray-600 transition-colors" @click="quickClienteAberto = false">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <!-- Body -->
            <div class="px-6 py-5 flex flex-col gap-4">
              <p class="text-xs text-gray-500">Preencha os dados básicos. O cliente será selecionado automaticamente no agendamento.</p>
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1.5">Nome <span class="text-red-500">*</span></label>
                <input v-model="quickCliente.nome" type="text" placeholder="Nome completo" class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-gray-600 mb-1.5">Telefone</label>
                  <input v-model="quickCliente.telefone" type="text" placeholder="(00) 00000-0000" class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-600 mb-1.5">E-mail</label>
                  <input v-model="quickCliente.email" type="email" placeholder="email@exemplo.com" class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
                </div>
              </div>
              <p v-if="quickClienteError" class="text-xs text-red-500">{{ quickClienteError }}</p>
            </div>
            <!-- Footer -->
            <div class="px-6 pb-5 flex gap-3">
              <button type="button" class="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors" @click="quickClienteAberto = false">Cancelar</button>
              <button type="button" :disabled="savingQuick" class="flex-1 py-2.5 rounded-xl bg-[#ff46a2] text-white text-sm font-bold hover:bg-pink-400 disabled:opacity-50 transition-colors" @click="saveQuickCliente">
                {{ savingQuick ? 'Salvando...' : 'Salvar e selecionar' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- MODAL CONFIRMAR SOLICITAÇÃO — Premium -->
    <Teleport to="body">
      <Transition name="quick-card">
        <div v-if="confirmandoSolicitacao" class="fixed inset-0 z-[55] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div class="absolute inset-0 bg-black/70 backdrop-blur-md" @click="confirmandoSolicitacao = null" />
          <div class="relative w-full sm:max-w-md rounded-t-[2rem] sm:rounded-[2rem] overflow-hidden shadow-2xl">

            <!-- Faixa hero verde -->
            <div class="relative bg-gradient-to-br from-emerald-500 to-green-400 px-6 pt-6 pb-10">
              <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
              <button type="button" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors" @click="confirmandoSolicitacao = null">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
              <div class="relative flex items-center gap-4">
                <div class="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white font-black text-xl shadow-lg shrink-0">
                  {{ (confirmandoSolicitacao.cliente_nome ?? confirmandoSolicitacao.nome_solicitante ?? '?').slice(0, 2).toUpperCase() }}
                </div>
                <div>
                  <p class="text-xs font-bold text-white/70 uppercase tracking-widest mb-0.5">Nova solicitação</p>
                  <p class="text-xl font-black text-white leading-tight">{{ confirmandoSolicitacao.cliente_nome ?? confirmandoSolicitacao.nome_solicitante }}</p>
                  <p v-if="confirmandoSolicitacao.cliente_telefone ?? confirmandoSolicitacao.telefone_solicitante" class="text-sm text-white/80 mt-0.5">
                    {{ confirmandoSolicitacao.cliente_telefone ?? confirmandoSolicitacao.telefone_solicitante }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Card branco levitando sobre a faixa -->
            <div class="bg-white -mt-6 rounded-t-3xl px-6 pt-6 pb-6 space-y-5">

              <!-- Pills de data e hora -->
              <div class="flex gap-3">
                <div class="flex-1 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3 text-center">
                  <p class="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Data</p>
                  <p class="text-base font-black text-gray-900 leading-tight">
                    {{ new Date(confirmandoSolicitacao.data_hora).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', timeZone: 'America/Sao_Paulo' }).replace('.','') }}
                  </p>
                  <p class="text-[10px] text-gray-400 mt-0.5 capitalize">
                    {{ new Date(confirmandoSolicitacao.data_hora).toLocaleDateString('pt-BR', { weekday: 'long', timeZone: 'America/Sao_Paulo' }) }}
                  </p>
                </div>
                <div class="flex-1 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 text-center">
                  <p class="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Hora</p>
                  <p class="text-2xl font-black text-gray-900 leading-tight tracking-tight">{{ formatHora(confirmandoSolicitacao.data_hora) }}</p>
                </div>
              </div>

              <!-- Serviços -->
              <div v-if="confirmandoSolicitacao.servicos_nomes" class="bg-violet-50 border border-violet-100 rounded-2xl px-4 py-3">
                <p class="text-[10px] font-bold text-violet-600 uppercase tracking-widest mb-1">Serviços</p>
                <p class="text-sm font-semibold text-gray-800">{{ confirmandoSolicitacao.servicos_nomes }}</p>
              </div>

              <!-- Observações -->
              <div v-if="confirmandoSolicitacao.observacoes" class="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3">
                <p class="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Observações</p>
                <p class="text-sm text-gray-700">{{ confirmandoSolicitacao.observacoes }}</p>
              </div>

              <!-- Aviso WhatsApp -->
              <div v-if="confirmandoSolicitacao.cliente_telefone ?? confirmandoSolicitacao.telefone_solicitante" class="flex items-center gap-2.5 bg-green-50 border border-green-200 rounded-2xl px-4 py-3">
                <svg class="w-5 h-5 text-green-500 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                <p class="text-xs text-green-700 font-semibold">Ao confirmar, o WhatsApp será aberto com mensagem de confirmação para o cliente.</p>
              </div>

              <!-- Botões -->
              <div class="flex gap-3 pt-1">
                <button type="button" class="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors" @click="confirmandoSolicitacao = null">
                  Cancelar
                </button>
                <button
                  type="button"
                  :disabled="confirmandoLoading"
                  class="flex-2 flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-400 text-white text-sm font-black hover:from-emerald-600 hover:to-green-500 disabled:opacity-50 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                  @click="confirmarSolicitacaoEWhatsApp"
                >
                  <svg v-if="confirmandoLoading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                  {{ confirmandoLoading ? 'Confirmando...' : 'Confirmar agendamento' }}
                </button>
              </div>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- MODAL HORÁRIOS DE ATENDIMENTO -->
    <Teleport to="body">
      <Transition name="quick-card">
        <div v-if="horarioModalAberto" class="fixed inset-0 z-[55] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="horarioModalAberto = false" />
          <div class="relative bg-white w-full sm:max-w-md rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl overflow-hidden">

            <!-- Header gradiente -->
            <div class="relative px-6 pt-6 pb-8" :style="{ background: `linear-gradient(135deg, ${tema.cor_primaria}, ${temaGrad})` }">
              <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12),transparent_60%)]" />
              <button type="button" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors" @click="horarioModalAberto = false">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
              <div class="relative flex items-center gap-3">
                <div class="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shrink-0">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div>
                  <p class="text-xs font-bold text-white/70 uppercase tracking-widest">Agendamento público</p>
                  <h3 class="text-lg font-black text-white">Horários de atendimento</h3>
                </div>
              </div>
            </div>

            <!-- Body -->
            <div class="bg-white -mt-4 rounded-t-3xl px-6 pt-6 pb-6 space-y-6">

              <!-- Dias da semana -->
              <div class="space-y-2">
                <label class="text-xs font-black text-gray-500 uppercase tracking-widest">Dias de atendimento</label>
                <div class="flex gap-1.5 flex-wrap">
                  <button
                    v-for="(label, idx) in DIAS_SEMANA_LABELS" :key="idx"
                    type="button"
                    class="w-12 h-12 rounded-2xl text-sm font-black border-2 transition-all"
                    :class="horarios.dias.includes(idx) ? 'shadow-md scale-[1.05]' : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'"
                    :style="horarios.dias.includes(idx) ? { background: tema.cor_primaria, borderColor: tema.cor_primaria, color: tema.cor_primaria_texto } : {}"
                    @click="toggleDia(idx)"
                  >{{ label }}</button>
                </div>
              </div>

              <!-- Horários -->
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="text-xs font-black text-gray-500 uppercase tracking-widest">Abertura</label>
                  <input
                    v-model="horarios.abertura"
                    type="time"
                    class="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-800 focus:outline-none focus:border-violet-400 focus:bg-white transition-colors"
                  />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-black text-gray-500 uppercase tracking-widest">Fechamento</label>
                  <input
                    v-model="horarios.fechamento"
                    type="time"
                    class="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-800 focus:outline-none focus:border-violet-400 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <!-- Horário de almoço -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <label class="text-xs font-black text-gray-500 uppercase tracking-widest">Pausa / Almoço</label>
                  <button
                    type="button"
                    class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors border-2"
                    :class="horarios.almoco_ativo ? '' : 'bg-gray-200 border-gray-200'"
                    :style="horarios.almoco_ativo ? { background: tema.cor_primaria, borderColor: tema.cor_primaria } : {}"
                    @click="horarios.almoco_ativo = !horarios.almoco_ativo"
                  >
                    <span
                      class="inline-block h-4 w-4 rounded-full bg-white shadow transition-transform"
                      :class="horarios.almoco_ativo ? 'translate-x-5' : 'translate-x-0.5'"
                    />
                  </button>
                </div>
                <div v-if="horarios.almoco_ativo" class="grid grid-cols-2 gap-4">
                  <div class="space-y-1.5">
                    <label class="text-xs font-black text-gray-500 uppercase tracking-widest">Início</label>
                    <input
                      v-model="horarios.almoco_inicio"
                      type="time"
                      class="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-800 focus:outline-none focus:border-violet-400 focus:bg-white transition-colors"
                    />
                  </div>
                  <div class="space-y-1.5">
                    <label class="text-xs font-black text-gray-500 uppercase tracking-widest">Fim</label>
                    <input
                      v-model="horarios.almoco_fim"
                      type="time"
                      class="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-800 focus:outline-none focus:border-violet-400 focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              </div>

              <!-- Intervalo -->
              <div class="space-y-2">
                <label class="text-xs font-black text-gray-500 uppercase tracking-widest">Intervalo entre slots</label>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="min in [15, 20, 30, 45, 60, 90]" :key="min"
                    type="button"
                    class="px-4 py-2 rounded-xl text-sm font-black border-2 transition-all"
                    :class="horarios.intervalo === min ? 'shadow-md' : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'"
                    :style="horarios.intervalo === min ? { background: tema.cor_primaria, borderColor: tema.cor_primaria, color: tema.cor_primaria_texto } : {}"
                    @click="horarios.intervalo = min"
                  >{{ min }}min</button>
                </div>
              </div>

              <!-- Antecedência mínima -->
              <div class="space-y-2">
                <label class="text-xs font-black text-gray-500 uppercase tracking-widest">Antecedência mínima</label>
                <p class="text-[11px] text-gray-400">Tempo mínimo para agendar no dia de hoje.</p>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="min in [0, 30, 60, 120, 180, 240]" :key="min"
                    type="button"
                    class="px-4 py-2 rounded-xl text-sm font-black border-2 transition-all"
                    :class="horarios.antecedencia === min ? 'shadow-md' : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'"
                    :style="horarios.antecedencia === min ? { background: tema.cor_primaria, borderColor: tema.cor_primaria, color: tema.cor_primaria_texto } : {}"
                    @click="horarios.antecedencia = min"
                  >{{ min === 0 ? 'Sem limite' : min < 60 ? `${min}min` : `${min / 60}h` }}</button>
                </div>
              </div>

              <!-- Botões -->
              <div class="flex items-center gap-3 pt-1">
                <span v-if="savedHorariosFeedback" class="text-sm text-emerald-600 font-bold flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                  Salvo!
                </span>
                <button type="button" class="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors" @click="horarioModalAberto = false">Fechar</button>
                <button
                  type="button"
                  :disabled="savingHorarios"
                  class="flex-1 py-3 rounded-2xl text-sm font-black disabled:opacity-50 transition-all shadow-lg flex items-center justify-center gap-2"
                  :style="{ background: `linear-gradient(135deg, ${tema.cor_primaria}, ${temaGrad})`, color: tema.cor_primaria_texto }"
                  @click="saveHorarios"
                >
                  <svg v-if="savingHorarios" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                  {{ savingHorarios ? 'Salvando...' : 'Salvar' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- MODAL EXCLUIR -->
    <Teleport to="body">
      <div v-if="excluindo" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="excluindo = null" />
        <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-2">Excluir agendamento?</h2>
          <p class="text-sm text-gray-500 mb-5">Esta ação não pode ser desfeita.</p>
          <div v-if="deleteError" class="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mb-4">{{ deleteError }}</div>
          <div class="flex gap-3">
            <button type="button" class="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50" @click="excluindo = null">Cancelar</button>
            <button
              type="button"
              :disabled="deleting"
              class="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-400 disabled:opacity-50 transition-colors"
              @click="executarExclusao"
            >{{ deleting ? 'Excluindo...' : 'Excluir' }}</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { createSupabaseClient } from '~/lib/supabase'
import { useEmpresa } from '~/composables/useEmpresa'
import { useAdmin } from '~/composables/useAdmin'
import { usePersonalizacao } from '~/composables/usePersonalizacao'
import AppNavIcon from '~/components/AppNavIcon.vue'

defineOptions({ name: 'AgendamentosPage' })
useHead({ title: 'Agendamentos' })

const { config: tema } = usePersonalizacao()
const temaGrad = computed(() => tema.value.cor_primaria_grad ?? tema.value.cor_primaria)

interface AgendamentoRow {
  id: number
  cliente_id: number | null
  funcionario_id: string | null
  data_hora: string
  status: string
  observacoes: string | null
  valor_total: number | null
  created_at: string | null
  nome_solicitante?: string | null
  telefone_solicitante?: string | null
  // joined
  cliente_nome?: string | null
  cliente_telefone?: string | null
  funcionario_nome?: string | null
  servicos_nomes?: string | null
}

interface ClienteOption { id: number; nome: string }
interface FuncionarioOption { id: number; nome: string | null; email: string | null; profile_id: string | null }
interface ServicoOption { id: number; nome: string; preco: number; duracao_min: number; funcionario_id: number | null; funcionario_profile_id: string | null }

const supabase = createSupabaseClient()
const { empresaId, loadEmpresa } = useEmpresa()
const { isAdminOrGerente } = useAdmin()

const agendamentos = ref<AgendamentoRow[]>([])
const clientes = ref<ClienteOption[]>([])
const funcionarios = ref<FuncionarioOption[]>([])
const servicosAtivos = ref<ServicoOption[]>([])

const loading = ref(true)
const error = ref<string | null>(null)
const confirmandoSolicitacao = ref<AgendamentoRow | null>(null)
const confirmandoLoading = ref(false)

// ── Configuração de horários ─────────────────────────────────────────
const horarioModalAberto = ref(false)
const savingHorarios = ref(false)
const savedHorariosFeedback = ref(false)
const DIAS_SEMANA_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const horarios = reactive({
  abertura:    '08:00',
  fechamento:  '18:00',
  intervalo:   30,
  antecedencia: 60,
  dias:        [1, 2, 3, 4, 5] as number[],
  almoco_ativo:  false,
  almoco_inicio: '12:00',
  almoco_fim:    '13:00',
})

async function loadHorarios() {
  await loadEmpresa()
  if (!empresaId.value) return
  const [cfgRes, diasRes] = await Promise.all([
    supabase.from('empresa_personalizacao').select('horario_abertura, horario_fechamento, intervalo_min, almoco_inicio, almoco_fim, antecedencia_min').eq('empresa_id', empresaId.value).maybeSingle(),
    supabase.from('empresa_dias_funcionamento').select('dia_semana, ativo').eq('empresa_id', empresaId.value),
  ])
  if (cfgRes.data) {
    const d = cfgRes.data as { horario_abertura?: string | null; horario_fechamento?: string | null; intervalo_min?: number | null; almoco_inicio?: string | null; almoco_fim?: string | null; antecedencia_min?: number | null }
    horarios.abertura      = d.horario_abertura   ?? '08:00'
    horarios.fechamento    = d.horario_fechamento ?? '18:00'
    horarios.intervalo     = d.intervalo_min      ?? 30
    horarios.antecedencia  = d.antecedencia_min   ?? 60
    horarios.almoco_inicio = d.almoco_inicio      ?? '12:00'
    horarios.almoco_fim    = d.almoco_fim         ?? '13:00'
    horarios.almoco_ativo  = !!d.almoco_inicio
  }
  if (diasRes.data && diasRes.data.length > 0)
    horarios.dias = diasRes.data.filter((r: { dia_semana: number; ativo: boolean }) => r.ativo).map((r: { dia_semana: number; ativo: boolean }) => r.dia_semana)
}

async function saveHorarios() {
  await loadEmpresa()
  if (!empresaId.value) return
  savingHorarios.value = true
  await supabase.from('empresa_personalizacao').update({
    horario_abertura:  horarios.abertura,
    horario_fechamento: horarios.fechamento,
    intervalo_min:     horarios.intervalo,
    antecedencia_min:  horarios.antecedencia,
    almoco_inicio:     horarios.almoco_ativo ? horarios.almoco_inicio : null,
    almoco_fim:        horarios.almoco_ativo ? horarios.almoco_fim    : null,
  }).eq('empresa_id', empresaId.value)
  const diasRows = DIAS_SEMANA_LABELS.map((_, i) => ({ empresa_id: empresaId.value as number, dia_semana: i, ativo: horarios.dias.includes(i) }))
  await supabase.from('empresa_dias_funcionamento').upsert(diasRows, { onConflict: 'empresa_id,dia_semana' })
  savingHorarios.value = false
  savedHorariosFeedback.value = true
  setTimeout(() => { savedHorariosFeedback.value = false }, 2500)
}

function toggleDia(d: number) {
  const i = horarios.dias.indexOf(d)
  i === -1 ? horarios.dias.push(d) : horarios.dias.splice(i, 1)
}

const editando = ref<AgendamentoRow | null>(null)
const adicionando = ref(false)
const saving = ref(false)
const modalError = ref<string | null>(null)

const excluindo = ref<AgendamentoRow | null>(null)
const deleting = ref(false)
const deleteError = ref<string | null>(null)

const filtroAberto = ref(false)
const filtro = reactive({ busca: '', status: [] as string[], data: '' })

// ── Link público ──────────────────────────────────────────────
const linkCopiado = ref(false)
function copiarLinkPublico() {
  if (!empresaId.value) return
  const url = `${window.location.origin}/agendar/${empresaId.value}`
  copiarParaAreaDeTransferencia(url).then(() => {
    linkCopiado.value = true
    setTimeout(() => { linkCopiado.value = false }, 2500)
  })
}

function copiarParaAreaDeTransferencia(texto: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(texto)
  }
  // Fallback para mobile/navegadores sem Clipboard API
  return new Promise((resolve) => {
    const el = document.createElement('textarea')
    el.value = texto
    el.setAttribute('readonly', '')
    el.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0'
    document.body.appendChild(el)
    el.focus()
    el.select()
    el.setSelectionRange(0, el.value.length)
    document.execCommand('copy')
    document.body.removeChild(el)
    resolve()
  })
}

// ── Cadastro rápido de cliente ────────────────────────────────
const quickClienteAberto = ref(false)
const quickClienteError = ref('')
const savingQuick = ref(false)
const quickCliente = reactive({ nome: '', telefone: '', email: '' })

async function saveQuickCliente() {
  quickClienteError.value = ''
  if (!quickCliente.nome.trim()) { quickClienteError.value = 'Nome é obrigatório.'; return }
  savingQuick.value = true
  const { data, error: err } = await supabase
    .from('clientes')
    .insert({ nome: quickCliente.nome.trim(), telefone: quickCliente.telefone.trim() || null, email: quickCliente.email.trim() || null, empresa_id: empresaId.value, ativo: true })
    .select('id, nome')
    .single()
  savingQuick.value = false
  if (err) { quickClienteError.value = err.message; return }
  clientes.value = [...clientes.value, data as ClienteOption].sort((a, b) => a.nome.localeCompare(b.nome))
  form.cliente_id = (data as ClienteOption).id
  quickCliente.nome = ''; quickCliente.telefone = ''; quickCliente.email = ''
  quickClienteAberto.value = false
}

const form = reactive({
  cliente_id:           null as number | null,
  funcionario_id:       null as string | null,  // uuid para salvar no DB
  funcionario_bigint_id: null as number | null, // bigint para o dropdown
  data:         '',
  hora:         '',
  status:       'agendado',
  observacoes:  '',
  servico_id:   null as number | null,
})

const formErrors = reactive({ cliente_id: '', data: '', hora: '' })

// ── Kanban semanal ────────────────────────────────────────────

function getMondayOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day))
  d.setHours(0, 0, 0, 0)
  return d
}

const kanbanInicioSemana = ref<Date>(getMondayOfWeek(new Date()))
const hoje = new Date().toISOString().split('T')[0]

const kanbanDias = computed(() =>
  Array.from({ length: 7 }, (_, i) => {
    const d = new Date(kanbanInicioSemana.value)
    d.setDate(d.getDate() + i)
    const iso = d.toISOString().split('T')[0]
    return {
      iso,
      diaSemana: d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '').toUpperCase(),
      diaNum: d.toLocaleDateString('pt-BR', { day: '2-digit' }),
      hoje: iso === hoje,
    }
  })
)

const kanbanMesLabel = computed(() => {
  const dias = kanbanDias.value
  const inicio = new Date(dias[0].iso + 'T12:00:00')
  const fim = new Date(dias[6].iso + 'T12:00:00')
  if (inicio.getMonth() === fim.getMonth())
    return inicio.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  return `${inicio.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')} – ${fim.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }).replace('.', '')}`
})

const kanbanPorDia = computed(() => {
  const map: Record<string, AgendamentoRow[]> = {}
  kanbanDias.value.forEach(d => { map[d.iso] = [] })
  agendamentos.value.forEach(ag => {
    const key = ag.data_hora.slice(0, 10)
    if (map[key]) map[key].push(ag)
  })
  Object.keys(map).forEach(k => map[k].sort((a, b) => a.data_hora.localeCompare(b.data_hora)))
  return map
})

function semanaAnterior() {
  const d = new Date(kanbanInicioSemana.value)
  d.setDate(d.getDate() - 7)
  kanbanInicioSemana.value = d
}
function semanaProxima() {
  const d = new Date(kanbanInicioSemana.value)
  d.setDate(d.getDate() + 7)
  kanbanInicioSemana.value = d
}
function irParaHoje() {
  kanbanInicioSemana.value = getMondayOfWeek(new Date())
}

// ── Drag & Drop ───────────────────────────────────────────────

const kanbanDragging = ref<number | null>(null)
const kanbanDragOver = ref<string | null>(null)
let _draggingAg: AgendamentoRow | null = null

function kanbanDragStart(ag: AgendamentoRow) {
  kanbanDragging.value = ag.id
  _draggingAg = ag
}

function kanbanDragEnd() {
  kanbanDragging.value = null
  kanbanDragOver.value = null
  _draggingAg = null
}

async function kanbanDrop(targetDate: string) {
  kanbanDragOver.value = null
  if (!_draggingAg) return
  if (_draggingAg.status === 'solicitado') { kanbanDragging.value = null; _draggingAg = null; return }
  const ag = _draggingAg
  kanbanDragging.value = null
  _draggingAg = null

  const currentDate = ag.data_hora.slice(0, 10)
  if (currentDate === targetDate) return

  const oldHora = ag.data_hora.slice(11, 19) // HH:MM:SS
  const newDataHora = `${targetDate}T${oldHora}`

  // Optimistic update
  const idx = agendamentos.value.findIndex(a => a.id === ag.id)
  if (idx !== -1) agendamentos.value[idx] = { ...agendamentos.value[idx], data_hora: newDataHora }

  const { error: err } = await supabase
    .from('agendamentos')
    .update({ data_hora: newDataHora })
    .eq('id', ag.id)

  if (err) {
    // Revert on error
    if (idx !== -1) agendamentos.value[idx] = { ...agendamentos.value[idx], data_hora: ag.data_hora }
  }
}

// ── Computed ──────────────────────────────────────────────────

const agendamentosFiltrados = computed(() =>
  agendamentos.value.filter(ag => {
    if (filtro.busca && !((ag.cliente_nome ?? ag.nome_solicitante ?? '').toLowerCase().includes(filtro.busca.toLowerCase()))) return false
    if (filtro.status.length > 0 && !filtro.status.includes(ag.status)) return false
    if (filtro.data && !ag.data_hora.startsWith(filtro.data)) return false
    return true
  })
)

const stats = computed(() => {
  const all = agendamentos.value
  return [
    { label: 'Total', value: all.length, color: 'text-white' },
    { label: 'Solicitado', value: all.filter(a => a.status === 'solicitado').length, color: 'text-yellow-200' },
    { label: 'Agendado', value: all.filter(a => a.status === 'agendado').length, color: 'text-white' },
    { label: 'Confirmado', value: all.filter(a => a.status === 'confirmado').length, color: 'text-white' },
    { label: 'Concluído', value: all.filter(a => a.status === 'concluido').length, color: 'text-white' },
    { label: 'Cancelado', value: all.filter(a => a.status === 'cancelado' || a.status === 'faltou').length, color: 'text-white' },
  ]
})

const totalSelecionado = computed(() => {
  if (!form.servico_id) return 0
  return servicosAtivos.value.find(s => s.id === form.servico_id)?.preco ?? 0
})

// Ao selecionar um serviço, preenche profissional vinculado no dropdown e uuid para salvar
watch(() => form.servico_id, (newId) => {
  if (newId != null) {
    const svc = servicosAtivos.value.find(s => s.id === newId)
    if (svc?.funcionario_id != null) {
      form.funcionario_bigint_id  = svc.funcionario_id
      form.funcionario_id         = svc.funcionario_profile_id ?? null
    }
  }
})

// Ao trocar o dropdown manualmente, atualiza o uuid correspondente
watch(() => form.funcionario_bigint_id, (bigintId) => {
  if (bigintId == null) { form.funcionario_id = null; return }
  const func = funcionarios.value.find(f => f.id === bigintId)
  form.funcionario_id = func?.profile_id ?? null
})

// ── Helpers ───────────────────────────────────────────────────

function formatPreco(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
}

function formatDia(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit' })
}

function formatMes(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')
}

function formatHora(iso: string) {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Sao_Paulo' })
}

function statusLabel(s: string) {
  return { solicitado: 'Solicitado', agendado: 'Agendado', confirmado: 'Confirmado', concluido: 'Concluído', cancelado: 'Cancelado', faltou: 'Faltou' }[s] ?? s
}

function statusCor(s: string) {
  return { solicitado: 'bg-amber-400', agendado: 'bg-blue-400', confirmado: 'bg-green-400', concluido: 'bg-violet-500', cancelado: 'bg-red-400', faltou: 'bg-orange-400' }[s] ?? 'bg-gray-300'
}

function statusBadge(s: string) {
  return {
    solicitado: 'bg-amber-100 text-amber-700',
    agendado: 'bg-blue-100 text-blue-700',
    confirmado: 'bg-green-100 text-green-700',
    concluido: 'bg-violet-100 text-violet-700',
    cancelado: 'bg-red-100 text-red-600',
    faltou: 'bg-orange-100 text-orange-600',
  }[s] ?? 'bg-gray-100 text-gray-600'
}

// ── Data loading ──────────────────────────────────────────────

onMounted(async () => {
  await loadEmpresa()
  // fetchFuncionarios deve terminar ANTES dos outros para que profile_id e nomes sejam resolvidos
  await fetchFuncionarios()
  await Promise.all([fetchAgendamentos(), fetchClientes(), loadHorarios()])
  await fetchServicos()
})

async function fetchAgendamentos() {
  loading.value = true

  // Fetch agendamentos — join profiles pelo FK para pegar o email do profissional
  const { data: rows, error: fetchError } = await supabase
    .from('agendamentos')
    .select('*, clientes(nome, telefone), profiles!agendamentos_funcionario_id_fkey(email)')
    .eq('empresa_id', empresaId.value!)
    .order('data_hora', { ascending: false })

  if (fetchError) { error.value = fetchError.message; loading.value = false; return }

  // Mapa email → nome usando funcionarios já carregados
  const funcNomeByEmail: Record<string, string> = {}
  funcionarios.value.forEach(f => { if (f.email) funcNomeByEmail[f.email.toLowerCase()] = f.nome ?? '' })

  // Fetch servicos vinculados
  const ids = (rows ?? []).map(r => r.id)
  let servicosMap: Record<number, string[]> = {}
  if (ids.length) {
    const { data: agSvcs } = await supabase
      .from('agendamento_servicos')
      .select('agendamento_id, servicos(nome)')
      .in('agendamento_id', ids)

    ;(agSvcs ?? []).forEach((row: any) => {
      if (!servicosMap[row.agendamento_id]) servicosMap[row.agendamento_id] = []
      if (row.servicos?.nome) servicosMap[row.agendamento_id].push(row.servicos.nome)
    })
  }

  agendamentos.value = (rows ?? []).map((r: any) => ({
    ...r,
    cliente_nome:     r.clientes?.nome ?? null,
    cliente_telefone: r.clientes?.telefone ?? null,
    funcionario_nome: r.profiles?.email
      ? (funcNomeByEmail[r.profiles.email.toLowerCase()] ?? null)
      : null,
    servicos_nomes:   (servicosMap[r.id] ?? []).join(', ') || null,
    nome_solicitante: r.nome_solicitante ?? null,
    telefone_solicitante: r.telefone_solicitante ?? null,
  }))

  loading.value = false
}

async function fetchClientes() {
  const { data } = await supabase
    .from('clientes')
    .select('id, nome')
    .eq('empresa_id', empresaId.value!)
    .eq('ativo', true)
    .order('nome')
  clientes.value = (data ?? []) as ClienteOption[]
}

async function fetchFuncionarios() {
  const { data, error: funcErr } = await supabase
    .from('funcionarios')
    .select('id, nome, email')
    .eq('empresa_id', empresaId.value!)
    .eq('ativo', true)
    .order('nome')
  if (funcErr) { console.error('[fetchFuncionarios]', funcErr.message); return }

  funcionarios.value = (data ?? []).map((f: any) => ({
    id:         f.id,
    nome:       f.nome,
    email:      f.email,
    profile_id: null, // resolvido sob demanda se necessário
  })) as FuncionarioOption[]
}

async function fetchServicos() {
  // IMPORTANTE: chamar após fetchFuncionarios para que funcionarios.value esteja populado
  const { data, error: err } = await supabase
    .from('servicos')
    .select('id, nome, preco, duracao_min')
    .eq('empresa_id', empresaId.value!)
    .eq('ativo', true)
    .order('categoria')
    .order('nome')
  if (err) { console.error('[fetchServicos]', err.message); return }

  // Busca vínculos serviço → funcionario_id (bigint)
  const servicoIds = (data ?? []).map((s: any) => Number(s.id))
  const funcIdMap: Record<number, number> = {}  // servico_id → funcionario bigint id
  if (servicoIds.length) {
    const { data: links, error: linkErr } = await supabase
      .from('servico_funcionarios')
      .select('servico_id, funcionario_id')
      .in('servico_id', servicoIds)
    if (linkErr) console.error('[fetchServicos links]', linkErr.message)
    ;(links ?? []).forEach((lnk: any) => {
      funcIdMap[Number(lnk.servico_id)] = Number(lnk.funcionario_id)
    })
  }

  // Resolve profile_id (uuid) agora que funcionarios.value já está populado
  servicosAtivos.value = (data ?? []).map((s: any) => {
    const funcBigintId = funcIdMap[Number(s.id)] ?? null
    const func = funcBigintId != null
      ? funcionarios.value.find(f => Number(f.id) === funcBigintId) ?? null
      : null
    return {
      id:                     Number(s.id),
      nome:                   s.nome,
      preco:                  s.preco,
      duracao_min:            s.duracao_min,
      funcionario_id:         funcBigintId,
      funcionario_profile_id: func?.profile_id ?? null,
    }
  }) as ServicoOption[]
}


// ── CRUD ──────────────────────────────────────────────────────

function resetForm() {
  form.cliente_id = null; form.funcionario_id = null; form.funcionario_bigint_id = null
  form.data = ''; form.hora = ''; form.status = 'agendado'
  form.observacoes = ''; form.servico_id = null
  formErrors.cliente_id = ''; formErrors.data = ''; formErrors.hora = ''
}

function abrirAdicionar() {
  resetForm()
  adicionando.value = true
  editando.value = null
  modalError.value = null
  quickClienteAberto.value = false
  quickCliente.nome = ''; quickCliente.telefone = ''; quickCliente.email = ''
  quickClienteError.value = ''
}

function fecharModal() {
  editando.value = null
  adicionando.value = false
  quickClienteAberto.value = false
}

function editAgendamento(ag: AgendamentoRow) {
  editando.value = ag
  adicionando.value = false
  modalError.value = null
  formErrors.cliente_id = ''; formErrors.data = ''; formErrors.hora = ''
  form.cliente_id = ag.cliente_id
  form.funcionario_id = ag.funcionario_id
  // Reverse-lookup: achar o bigint id a partir do profile_id salvo
  form.funcionario_bigint_id = funcionarios.value.find(f => f.profile_id === ag.funcionario_id)?.id ?? null
  const _dtSP = new Date(ag.data_hora)
  form.data = _dtSP.toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' })
  form.hora = _dtSP.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Sao_Paulo' })
  form.status = ag.status
  form.observacoes = ag.observacoes ?? ''
  form.servico_ids = []

  // Load linked service
  supabase
    .from('agendamento_servicos')
    .select('servico_id')
    .eq('agendamento_id', ag.id)
    .then(({ data }) => {
      form.servico_id = data?.[0]?.servico_id ?? null
    })
}

function validateForm(): boolean {
  formErrors.cliente_id = ''; formErrors.data = ''; formErrors.hora = ''
  let ok = true
  if (!form.cliente_id && form.status !== 'solicitado') { formErrors.cliente_id = 'Selecione o cliente.'; ok = false }
  if (!form.data) { formErrors.data = 'Informe a data.'; ok = false }
  if (!form.hora) { formErrors.hora = 'Informe a hora.'; ok = false }
  return ok
}

function buildDataHora() {
  // Salva com offset SP explícito para o Supabase não interpretar como UTC
  return `${form.data}T${form.hora}:00-03:00`
}

const horasOpcoes = (() => {
  const opts: string[] = []
  for (let h = 5; h <= 22; h++) {
    opts.push(`${String(h).padStart(2, '0')}:00`)
    if (h < 22) opts.push(`${String(h).padStart(2, '0')}:30`)
  }
  return opts
})()

async function syncServicos(agendamentoId: number) {
  await supabase.from('agendamento_servicos').delete().eq('agendamento_id', agendamentoId)
  if (form.servico_id) {
    const svc = servicosAtivos.value.find(s => s.id === form.servico_id)
    await supabase.from('agendamento_servicos').insert({
      agendamento_id: agendamentoId,
      servico_id: form.servico_id,
      preco_cobrado: svc?.preco ?? 0,
    })
  }
}

async function salvarEdicao() {
  if (!editando.value || !validateForm()) return
  saving.value = true
  modalError.value = null

  const { error: updateError } = await supabase
    .from('agendamentos')
    .update({
      cliente_id: form.cliente_id ?? null,
      funcionario_id: form.funcionario_id,
      data_hora: buildDataHora(),
      status: form.status,
      observacoes: form.observacoes.trim() || null,
      empresa_id: empresaId.value!,
    })
    .eq('id', editando.value.id)

  if (updateError) { modalError.value = updateError.message; saving.value = false; return }

  await syncServicos(editando.value.id)
  saving.value = false
  editando.value = null
  await fetchAgendamentos()
}

async function salvarAdicao() {
  if (!validateForm()) return
  saving.value = true
  modalError.value = null

  const { data, error: insertError } = await supabase
    .from('agendamentos')
    .insert({
      cliente_id: form.cliente_id ?? null,
      funcionario_id: form.funcionario_id,
      data_hora: buildDataHora(),
      status: form.status,
      observacoes: form.observacoes.trim() || null,
      empresa_id: empresaId.value!,
    })
    .select('id')
    .single()

  if (insertError) { modalError.value = insertError.message; saving.value = false; return }

  await syncServicos(data.id)
  saving.value = false
  adicionando.value = false
  await fetchAgendamentos()
}

function confirmarExclusao(ag: AgendamentoRow) {
  excluindo.value = ag
  deleteError.value = null
}

async function aprovarSolicitacao(ag: AgendamentoRow) {
  confirmandoSolicitacao.value = ag
}

async function confirmarSolicitacaoEWhatsApp() {
  const ag = confirmandoSolicitacao.value
  if (!ag) return
  confirmandoLoading.value = true
  const { error: err } = await supabase
    .from('agendamentos')
    .update({ status: 'confirmado' })
    .eq('id', ag.id)
  confirmandoLoading.value = false
  if (err) return
  await fetchAgendamentos()

  // Monta mensagem WhatsApp
  const tel = (ag.cliente_telefone ?? ag.telefone_solicitante ?? '').replace(/\D/g, '')
  const nome = ag.cliente_nome ?? ag.nome_solicitante ?? ''
  const [aY, aM, aD] = ag.data_hora.slice(0, 10).split('-').map(Number)
  const dataObj = new Date(aY, aM - 1, aD)
  const data = dataObj.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })
  const hora = formatHora(ag.data_hora)
  const svcs = ag.servicos_nomes ? '\n* *Servi\u00E7os:* ' + ag.servicos_nomes : ''
  const msg = 'Ol\u00E1, ' + nome + '!\n\nSeu agendamento foi *confirmado*!\n\n* *Data:* ' + data + '\n* *Hora:* ' + hora + svcs + '\n\nQualquer d\u00FAvida \u00E9 s\u00F3 chamar!'
  confirmandoSolicitacao.value = null
  if (tel) {
    window.open(`https://wa.me/55${tel}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer')
  }
}

async function recusarSolicitacao(ag: AgendamentoRow) {
  const { error: err } = await supabase
    .from('agendamentos')
    .update({ status: 'cancelado' })
    .eq('id', ag.id)
  if (!err) await fetchAgendamentos()
}

async function executarExclusao() {
  if (!excluindo.value) return
  deleting.value = true
  deleteError.value = null

  const { error: deleteErr } = await supabase
    .from('agendamentos')
    .delete()
    .eq('id', excluindo.value.id)

  deleting.value = false
  if (deleteErr) { deleteError.value = deleteErr.message; return }
  excluindo.value = null
  await fetchAgendamentos()
}
</script>

<style scoped>
.slide-fade-enter-active { transition: all 0.2s ease-out; }
.slide-fade-leave-active { transition: all 0.15s ease-in; }
.slide-fade-enter-from, .slide-fade-leave-to { opacity: 0; transform: translateY(-6px); }

.quick-card-enter-active { transition: all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1); }
.quick-card-leave-active { transition: all 0.15s ease-in; }
.quick-card-enter-from, .quick-card-leave-to { opacity: 0; transform: scale(0.93) translateY(10px); }
</style>

