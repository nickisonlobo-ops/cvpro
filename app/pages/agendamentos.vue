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
        <div v-if="!loading" class="grid grid-cols-3 sm:grid-cols-6 gap-3 header-stats">
          <div v-for="stat in stats" :key="stat.label" class="flex flex-col gap-1 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/10">
            <span class="stat-label">{{ stat.label }}</span>
            <span class="stat-value">{{ stat.value }}</span>
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

              <!-- Campo de busca de cliente -->
              <div class="relative">
                <input
                  v-model="buscaCliente"
                  type="text"
                  placeholder="Pesquisar cliente pelo nome..."
                  class="w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  :class="formErrors.cliente_id ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'"
                  @focus="clienteDropdownAberto = true"
                  @input="clienteDropdownAberto = true"
                />
                <!-- Cliente selecionado badge -->
                <div v-if="form.cliente_id && !buscaCliente" class="absolute inset-0 flex items-center px-4 pointer-events-none">
                  <span class="text-sm font-semibold text-gray-800">{{ clienteSelecionadoNome }}</span>
                </div>
                <!-- Botão limpar -->
                <button
                  v-if="form.cliente_id"
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 hover:bg-red-100 hover:text-red-500 transition-colors"
                  @click="form.cliente_id = null; buscaCliente = ''"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
                <!-- Dropdown de resultados -->
                <div
                  v-if="clienteDropdownAberto && clientesFiltradosAgendamento.length > 0 && buscaCliente.trim()"
                  class="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto"
                >
                  <button
                    v-for="c in clientesFiltradosAgendamento"
                    :key="c.id"
                    type="button"
                    class="w-full text-left px-4 py-2.5 text-sm hover:bg-pink-50 transition-colors flex items-center gap-3 border-b border-gray-50 last:border-0"
                    @mousedown.prevent="selecionarCliente(c)"
                  >
                    <span class="w-7 h-7 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-[10px] font-black shrink-0">
                      {{ c.nome.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase() }}
                    </span>
                    <div>
                      <p class="font-semibold text-gray-800">{{ c.nome }}</p>
                      <p v-if="c.telefone" class="text-[10px] text-gray-400">{{ c.telefone }}</p>
                    </div>
                  </button>
                </div>
                <!-- Sem resultados -->
                <div
                  v-if="clienteDropdownAberto && clientesFiltradosAgendamento.length === 0 && buscaCliente.trim().length >= 2"
                  class="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-4 text-center"
                >
                  <p class="text-sm text-gray-400">Nenhum cliente encontrado</p>
                </div>
              </div>
              <p v-if="formErrors.cliente_id" class="text-xs text-red-500 mt-1">{{ formErrors.cliente_id }}</p>
            </div>

            <!-- Serviços — campo clicável que abre modal -->
            <div>
              <label class="block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-2">Serviços <span class="text-red-500">*</span></label>

              <!-- Chips dos serviços selecionados + botão para abrir modal -->
              <button
                type="button"
                class="w-full rounded-xl border-2 px-4 py-3 text-left transition-all hover:shadow-md focus:outline-none"
                :class="formErrors.slots ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 hover:border-pink-300'"
                @click="modalServicosAberto = true"
              >
                <div v-if="!form.servicosSelecionados.length" class="flex items-center justify-between gap-2 text-sm text-gray-400 font-semibold">
                  <span>Selecione os serviços...</span>
                  <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>
                </div>
                <div v-else class="flex flex-wrap gap-1.5 items-center">
                  <span
                    v-for="id in form.servicosSelecionados"
                    :key="id"
                    class="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full text-white"
                    style="background:#ec4899"
                  >
                    {{ servicosAtivos.find(s => s.id === id)?.nome }}
                  </span>
                  <span class="text-xs text-gray-400 ml-auto">editar →</span>
                </div>
              </button>
              <p v-if="formErrors.slots" class="text-xs text-red-500 mt-1.5">{{ formErrors.slots }}</p>
              <p v-if="form.servicosSelecionados.length" class="text-xs font-bold mt-1.5" style="color:#ec4899">
                Total estimado: {{ formatPreco(totalSelecionado) }}
              </p>
            </div>

            <!-- Cards de data + horário por serviço -->
            <div
              v-for="(item, idx) in slotsPerServicoInterno"
              :key="item.servico.id"
              class="flex flex-col gap-3 rounded-2xl border-2 p-4 transition-all"
              :style="item.data && !item.diaFechado && item.horario
                ? { borderColor: '#ec4899' }
                : { borderColor: '#e5e7eb' }"
            >
              <!-- Cabeçalho -->
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0" style="background:#ec4899">{{ idx + 1 }}</div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-bold text-gray-900">{{ item.servico.nome }}</p>
                  <!-- Profissional: dropdown se há mais de um, texto fixo se só um -->
                  <div v-if="item.servico.servico_funcionarios?.length > 1" class="flex flex-wrap gap-1 mt-1">
                    <button
                      v-for="sf in item.servico.servico_funcionarios"
                      :key="sf.funcionarios?.id"
                      type="button"
                      class="text-[11px] font-bold px-2 py-0.5 rounded-full border transition-all"
                      :class="item.funcionarioBigintId === sf.funcionarios?.id
                        ? 'text-white border-transparent'
                        : 'border-gray-200 text-gray-400 bg-white hover:border-gray-300'"
                      :style="item.funcionarioBigintId === sf.funcionarios?.id
                        ? { background: '#ec4899', borderColor: '#ec4899' }
                        : {}"
                      @click="item.funcionarioBigintId = sf.funcionarios?.id ?? null; onFuncionarioChangeItem(item)"
                    >{{ sf.funcionarios?.nome }}</button>
                  </div>
                  <p v-else-if="item.servico.servico_funcionarios?.length === 1" class="text-xs font-semibold mt-0.5" style="color:#ec4899">
                    {{ item.servico.servico_funcionarios[0]!.funcionarios?.nome }}
                  </p>
                </div>
                <span v-if="item.data && !item.diaFechado && item.horario" class="text-xs font-black px-2 py-1 rounded-full bg-green-100 text-green-700 shrink-0">
                  ✓ {{ formatHoraSlot(item.horario) }}
                </span>
              </div>

              <!-- Badge simultâneo: se há parceiro anterior na lista, oculta seleção e mostra aviso -->
              <template v-if="getSimultaneoAnterior(item)">
                <div class="flex items-center gap-2.5 p-3 rounded-xl border border-pink-200 bg-pink-50">
                  <svg class="w-4 h-4 text-pink-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"/>
                  </svg>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-bold text-pink-700">Simultâneo com {{ getSimultaneoAnterior(item)!.servico.nome }}</p>
                    <p class="text-xs text-pink-500 mt-0.5">
                      {{ item.horario ? `Agendado às ${formatHoraSlot(item.horario)} — mesmo horário` : 'Aguardando seleção de horário acima…' }}
                    </p>
                  </div>
                </div>
              </template>

              <!-- Data + Slots (oculto quando simultâneo com item anterior) -->
              <template v-else>

              <!-- Data -->
              <div class="flex flex-col gap-1">
                <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Data</label>
                <input
                  v-model="item.data"
                  type="date"
                  class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300"
                  @change="onDataChangeItemInterno(item)"
                />
                <div v-if="item.diaFechado" class="flex items-center gap-2 p-2.5 bg-orange-50 border border-orange-200 rounded-xl mt-1">
                  <svg class="w-4 h-4 text-orange-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
                  </svg>
                  <p class="text-xs text-orange-600 font-semibold">Não atendemos neste dia.</p>
                </div>
              </div>

              <!-- Slots -->
              <template v-if="item.data && !item.diaFechado">
                <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Horário</label>

                <div v-if="item.loading" class="flex items-center gap-2 py-3 justify-center">
                  <div class="w-4 h-4 rounded-full border-2 border-gray-200 animate-spin" style="border-top-color:#ec4899" />
                  <p class="text-xs text-gray-400">Verificando disponibilidade...</p>
                </div>

                <div v-else-if="item.error" class="bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-xs text-red-600 flex items-center justify-between">
                  <span>{{ item.error }}</span>
                  <button type="button" class="underline ml-2 font-semibold shrink-0" @click="carregarSlotsItemInterno(item)">Tentar novamente</button>
                </div>

                <div v-else-if="!item.slots.length" class="bg-orange-50 border border-orange-200 rounded-xl px-3 py-2.5 text-xs text-orange-600 font-semibold text-center">
                  Nenhum horário disponível neste dia.
                </div>

                <div v-else class="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  <button
                    v-for="slot in item.slots"
                    :key="slot.getTime()"
                    type="button"
                    :disabled="isSlotTakenInterno(slot, item)"
                    class="py-2 rounded-xl border-2 text-sm font-bold transition-all"
                    :class="item.horario?.getTime() === slot.getTime()
                      ? 'shadow-md scale-[1.04] border-transparent text-white'
                      : isSlotTakenInterno(slot, item)
                        ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:scale-[1.02]'"
                    :style="item.horario?.getTime() === slot.getTime() ? { background: temaGrad, color: '#fff' } : {}"
                    @click="!isSlotTakenInterno(slot, item) && (item.horario = slot)"
                  >{{ formatHoraSlot(slot) }}</button>
                </div>
              </template>

              </template><!-- /v-else simultâneo -->
            </div>

            <!-- Status -->
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

    <!-- MODAL SELEÇÃO DE SERVIÇOS -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="modalServicosAberto" class="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="modalServicosAberto = false" />
          <div class="relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
            <!-- Header -->
            <div class="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
              <div>
                <h2 class="text-base font-black text-gray-900">Escolha os serviços</h2>
                <p v-if="form.servicosSelecionados.length" class="text-xs font-bold mt-0.5" style="color:#ec4899">
                  {{ form.servicosSelecionados.length }} selecionado{{ form.servicosSelecionados.length > 1 ? 's' : '' }} · {{ formatPreco(totalSelecionado) }}
                </p>
              </div>
              <button type="button" class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors" @click="modalServicosAberto = false">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <!-- Lista de serviços com foto -->
            <div class="overflow-y-auto flex-1 px-4 pb-2">
              <div class="grid grid-cols-1 gap-3 py-2">
                <button
                  v-for="s in servicosAtivos"
                  :key="s.id"
                  type="button"
                  class="group relative rounded-2xl border-2 transition-all duration-200 text-left w-full overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5"
                  :class="form.servicosSelecionados.includes(s.id) ? '' : 'border-gray-200 bg-white'"
                  :style="form.servicosSelecionados.includes(s.id) ? { borderColor: '#ec4899', background: '#fff' } : {}"
                  @click="form.servicosSelecionados.includes(s.id)
                    ? form.servicosSelecionados.splice(form.servicosSelecionados.indexOf(s.id), 1)
                    : form.servicosSelecionados.push(s.id)"
                >
                  <!-- Foto -->
                  <div class="relative h-28 w-full overflow-hidden">
                    <img
                      v-if="s.foto_url"
                      :src="s.foto_url"
                      :alt="s.nome"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div
                      v-else
                      class="w-full h-full flex items-center justify-center"
                      style="background: linear-gradient(135deg, #fce7f3, #f5d0fe)"
                    >
                      <svg class="w-8 h-8 text-pink-200" fill="none" stroke="currentColor" stroke-width="1.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>
                    </div>
                    <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <!-- Preço sobre a foto -->
                    <div class="absolute bottom-2 right-3">
                      <span class="text-sm font-black text-white drop-shadow">{{ formatPreco(s.preco) }}</span>
                    </div>
                    <!-- Check badge -->
                    <div
                      v-if="form.servicosSelecionados.includes(s.id)"
                      class="absolute top-2 right-3 w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
                      style="background:#ec4899"
                    >
                      <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                    </div>
                    <div v-else class="absolute top-2 right-3 w-6 h-6 rounded-full border-2 border-white/70 bg-white/20 backdrop-blur-sm" />
                  </div>
                  <!-- Conteúdo -->
                  <div class="px-3 py-2.5">
                    <p class="text-sm font-black text-gray-900 leading-tight">{{ s.nome }}</p>
                    <div class="flex items-center gap-3 mt-1.5">
                      <span class="inline-flex items-center gap-1 text-[11px] text-gray-400 font-semibold">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"/></svg>
                        {{ s.duracao_min }}min
                      </span>
                      <span
                        v-if="s.servico_funcionarios?.[0]?.funcionarios?.nome"
                        class="inline-flex items-center gap-1 text-[11px] font-semibold"
                        style="color:#ec4899"
                      >
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>
                        {{ s.servico_funcionarios[0]!.funcionarios?.nome }}
                      </span>
                    </div>
                  </div>
                  <!-- Barra colorida quando selecionado -->
                  <div v-if="form.servicosSelecionados.includes(s.id)" class="h-1 w-full" style="background:linear-gradient(90deg,#ec4899,#c026d3)" />
                </button>
                <p v-if="!servicosAtivos.length" class="text-xs text-gray-400 text-center py-6 bg-gray-50 rounded-2xl">Nenhum serviço ativo cadastrado</p>
              </div>
            </div>
            <!-- Rodapé -->
            <div class="px-4 py-4 shrink-0 border-t border-gray-100">
              <button
                type="button"
                :disabled="!form.servicosSelecionados.length"
                class="w-full py-3 rounded-2xl text-sm font-black transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg text-white"
                style="background:linear-gradient(135deg,#ec4899,#f43f5e)"
                @click="modalServicosAberto = false"
              >
                {{ form.servicosSelecionados.length ? `Confirmar ${form.servicosSelecionados.length} serviço${form.servicosSelecionados.length > 1 ? 's' : ''}` : 'Selecione ao menos um serviço' }}
              </button>
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
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
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

interface ClienteOption { id: number; nome: string; telefone?: string | null }
interface FuncionarioOption { id: number; nome: string | null; email: string | null; profile_id: string | null }
interface ServicoOption { id: number; nome: string; preco: number; duracao_min: number; comissao_percentual: number | null; funcionario_id: number | null; funcionario_profile_id: string | null; foto_url: string | null; servico_funcionarios: { funcionarios: { id: number; nome: string | null } }[] }

interface SlotItemInterno {
  servico: ServicoOption
  data: string
  diaFechado: boolean
  slots: Date[]
  loading: boolean
  error: string | null
  horario: Date | null
  funcionarioBigintId: number | null
  funcionarioUuid: string | null
}

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
const modalServicosAberto = ref(false)

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
  status:               'agendado',
  observacoes:          '',
  servicosSelecionados: [] as number[],
})

const formErrors = reactive({ cliente_id: '', slots: '' })
const slotsPerServicoInterno = ref<SlotItemInterno[]>([])

// ── Busca de cliente no agendamento ───────────────────────────
const buscaCliente = ref('')
const clienteDropdownAberto = ref(false)

const clientesFiltradosAgendamento = computed(() => {
  const q = buscaCliente.value.trim().toLowerCase()
  if (q.length < 1) return []
  return clientes.value.filter(c => c.nome.toLowerCase().includes(q)).slice(0, 10)
})

const clienteSelecionadoNome = computed(() => {
  if (!form.cliente_id) return ''
  const c = clientes.value.find(c => c.id === form.cliente_id)
  return c?.nome ?? ''
})

function selecionarCliente(cliente: { id: number; nome: string }) {
  form.cliente_id = cliente.id
  buscaCliente.value = ''
  clienteDropdownAberto.value = false
}
// ── Serviços simultâneos ──────────────────────────────────────
// Armazena pares "idA-idB" que podem ser feitos ao mesmo tempo
const simultaneosPares = ref<Set<string>>(new Set())

function isSimultaneo(idA: number, idB: number): boolean {
  return simultaneosPares.value.has(`${idA}-${idB}`) || simultaneosPares.value.has(`${idB}-${idA}`)
}

async function carregarSimultaneos(ids: number[]) {
  if (ids.length < 2) { simultaneosPares.value = new Set(); return }
  const { data } = await supabase
    .from('servico_simultaneos')
    .select('servico_id, servico_par_id')
    .in('servico_id', ids)
    .in('servico_par_id', ids)
  const pares = new Set<string>()
  for (const row of (data ?? []) as { servico_id: number; servico_par_id: number }[])
    pares.add(`${row.servico_id}-${row.servico_par_id}`)
  simultaneosPares.value = pares
}

// Se item tem um parceiro simultâneo que aparece ANTES dele na lista → modo "simultâneo"
function getSimultaneoAnterior(item: SlotItemInterno): SlotItemInterno | null {
  const idx = slotsPerServicoInterno.value.indexOf(item)
  return slotsPerServicoInterno.value.slice(0, idx).find(
    other => isSimultaneo(other.servico.id, item.servico.id)
  ) ?? null
}

// Auto-sincroniza data + horário para pares simultâneos.
// Depende TAMBÉM de simultaneosPares para re-executar quando os pares chegam do servidor.
watch(
  [    () => slotsPerServicoInterno.value.map(i => ({ id: i.servico.id, data: i.data, ts: i.horario?.getTime() ?? null })),
    simultaneosPares,
  ],
  () => {
    for (const item of slotsPerServicoInterno.value) {
      if (!item.horario || !item.data) continue
      for (const other of slotsPerServicoInterno.value) {
        if (other.servico.id === item.servico.id) continue
        if (!isSimultaneo(item.servico.id, other.servico.id)) continue
        if (other.horario?.getTime() !== item.horario.getTime() || other.data !== item.data) {
          other.data    = item.data
          other.horario = item.horario
        }
      }
    }
  },
  { deep: true }
)



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
    const iso = d.toISOString().split('T')[0] as string
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
  const inicio = new Date((dias[0]?.iso ?? '') + 'T12:00:00')
  const fim = new Date((dias[6]?.iso ?? '') + 'T12:00:00')
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
  Object.keys(map).forEach(k => map[k]?.sort((a, b) => a.data_hora.localeCompare(b.data_hora)))
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
  if (idx !== -1) agendamentos.value[idx] = { ...agendamentos.value[idx], data_hora: newDataHora } as AgendamentoRow

  const { error: err } = await supabase
    .from('agendamentos')
    .update({ data_hora: newDataHora })
    .eq('id', ag.id)

  if (err) {
    // Revert on error
    if (idx !== -1) agendamentos.value[idx] = { ...agendamentos.value[idx], data_hora: ag.data_hora } as AgendamentoRow
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

const totalSelecionado = computed(() =>
  slotsPerServicoInterno.value.reduce((sum, item) => sum + item.servico.preco, 0)
)

// Ao alterar serviços selecionados, reconstrói a lista de slot items e recarrega simultâneos
watch(() => [...form.servicosSelecionados], async (ids, idsAnterior) => {
  const anterior = new Map(slotsPerServicoInterno.value.map(i => [i.servico.id, i]))

  // Captura pares simultâneos ANTES de atualizar (para saber quem precisa recarregar)
  const paresAntes = new Set(simultaneosPares.value)
  const removidos = new Set((idsAnterior ?? []).filter(id => !ids.includes(id)))

  slotsPerServicoInterno.value = ids.map(id => {
    const exist = anterior.get(id)
    if (exist) return exist
    const svc = servicosAtivos.value.find(s => s.id === id)!
    const firstFunc = svc.servico_funcionarios?.[0]?.funcionarios
    const funcBigint = firstFunc
      ? (funcionarios.value.find(f => f.id === firstFunc.id)?.id ?? svc.funcionario_id)
      : svc.funcionario_id
    const funcUuid = firstFunc
      ? (funcionarios.value.find(f => f.id === firstFunc.id)?.profile_id ?? svc.funcionario_profile_id)
      : svc.funcionario_profile_id
    return {
      servico:            svc,
      data:               '',
      diaFechado:         false,
      slots:              [],
      loading:            false,
      error:              null,
      horario:            null,
      funcionarioBigintId: funcBigint,
      funcionarioUuid:    funcUuid,
    } as SlotItemInterno
  })
  // Garante que simultaneosParés está atualizado para os serviços selecionados antes de renderizar
  await carregarSimultaneos(ids)

  // Recarrega slots de itens que eram parceiros dos serviços removidos
  // Usa paresAntes (antes da atualização) para identificar os parceiros corretos
  if (removidos.size > 0) {
    for (const item of slotsPerServicoInterno.value) {
      const eraSimultaneoComRemovido = [...removidos].some(rid =>
        paresAntes.has(`${item.servico.id}-${rid}`) || paresAntes.has(`${rid}-${item.servico.id}`)
      )
      if (eraSimultaneoComRemovido && item.data) {
        item.horario = null
        await carregarSlotsItemInterno(item)
      }
    }
  }

  // Recarrega slots de itens existentes que são parceiros dos serviços adicionados
  // Usa simultaneosPares já atualizado para identificar os novos pares
  const adicionados = new Set(ids.filter(id => !(idsAnterior ?? []).includes(id)))
  if (adicionados.size > 0) {
    for (const item of slotsPerServicoInterno.value) {
      // Apenas itens que já existiam (não os recém-criados, que têm slots vazios)
      if (!anterior.has(item.servico.id)) continue
      const ehParceiroDaNovidade = [...adicionados].some(aid =>
        simultaneosPares.value.has(`${item.servico.id}-${aid}`) || simultaneosPares.value.has(`${aid}-${item.servico.id}`)
      )
      if (ehParceiroDaNovidade && item.data) {
        item.horario = null
        await carregarSlotsItemInterno(item)
      }
    }
  }
})

// Ao trocar funcionario num item, recarrega slots daquele item
function onFuncionarioChangeItem(item: SlotItemInterno) {
  const func = funcionarios.value.find(f => f.id === item.funcionarioBigintId)
  item.funcionarioUuid = func?.profile_id ?? null
  if (item.data) onDataChangeItemInterno(item)
}

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
      if (row.servicos?.nome) servicosMap[row.agendamento_id]!.push(row.servicos.nome)
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
    .select('id, nome, telefone')
    .eq('empresa_id', empresaId.value!)
    .eq('ativo', true)
    .order('nome')
  clientes.value = (data ?? []) as ClienteOption[]
}

async function fetchFuncionarios() {
  const { data, error: funcErr } = await supabase
    .from('funcionarios')
    .select('id, nome, email, profile_id')
    .eq('empresa_id', empresaId.value!)
    .eq('ativo', true)
    .order('nome')
  if (funcErr) { console.error('[fetchFuncionarios]', funcErr.message); return }

  funcionarios.value = (data ?? []).map((f: any) => ({
    id:         f.id,
    nome:       f.nome,
    email:      f.email,
    profile_id: f.profile_id ?? null,
  })) as FuncionarioOption[]
}

async function fetchServicos() {
  // IMPORTANTE: chamar após fetchFuncionarios para que funcionarios.value esteja populado
  const { data, error: err } = await supabase
    .from('servicos')
    .select('id, nome, preco, duracao_min, comissao_percentual, foto_url, servico_funcionarios(funcionarios(id, nome))')
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
      comissao_percentual:    s.comissao_percentual ?? null,
      funcionario_id:         funcBigintId,
      funcionario_profile_id: func?.profile_id ?? null,
      foto_url:               s.foto_url ?? null,
      servico_funcionarios:   (s.servico_funcionarios ?? []),
    }
  }) as ServicoOption[]

  // Pré-carrega pares simultâneos para todos os serviços ativos agora que a lista está pronta
  await carregarSimultaneos(servicosAtivos.value.map(s => s.id))
}


// ── CRUD ──────────────────────────────────────────────────────

function resetForm() {
  form.cliente_id = null; form.status = 'agendado'
  form.observacoes = ''; form.servicosSelecionados = []
  formErrors.cliente_id = ''; formErrors.slots = ''
  slotsPerServicoInterno.value = []
  buscaCliente.value = ''
  clienteDropdownAberto.value = false
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
  formErrors.cliente_id = ''; formErrors.slots = ''
  form.cliente_id = ag.cliente_id
  form.status = ag.status
  form.observacoes = ag.observacoes ?? ''
  form.servicosSelecionados = []
  slotsPerServicoInterno.value = []

  // Carrega serviço vinculado e monta o slot item pré-populado
  supabase
    .from('agendamento_servicos')
    .select('servico_id, funcionario_id')
    .eq('agendamento_id', ag.id)
    .then(({ data }) => {
      const row = data?.[0]
      const servicoId = row?.servico_id ?? null
      if (!servicoId) return
      form.servicosSelecionados = [servicoId]
      // Após o watch criar o item, preenche data/hora e carrega slots
      nextTick(() => {
        const item = slotsPerServicoInterno.value[0]
        if (!item) return
        // Usa o funcionário gravado em agendamento_servicos (bigint direto, sem UUID)
        if (row?.funcionario_id != null) {
          item.funcionarioBigintId = row.funcionario_id
          item.funcionarioUuid     = funcionarios.value.find(f => Number(f.id) === Number(row.funcionario_id))?.profile_id ?? ag.funcionario_id
        } else {
          item.funcionarioUuid = ag.funcionario_id
        }
        const _dtSP = new Date(ag.data_hora)
        item.data = _dtSP.toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' })
        carregarSlotsItemInterno(item).then(() => {
          // Compara por timestamp (evita diferenças de formato do toLocaleTimeString)
          const targetMs = new Date(ag.data_hora).getTime()
          let match = item.slots.find(s => s.getTime() === targetMs)
          if (!match) {
            // Slot bloqueado pelo próprio agendamento — injeta de volta para exibir a hora atual
            const forceSlot = new Date(ag.data_hora)
            const insertIdx = item.slots.findIndex(s => s.getTime() > targetMs)
            if (insertIdx === -1) item.slots.push(forceSlot)
            else item.slots.splice(insertIdx, 0, forceSlot)
            match = forceSlot
          }
          item.horario = match
        })
      })
    })
}

function validateForm(): boolean {
  formErrors.cliente_id = ''; formErrors.slots = ''
  let ok = true
  if (!form.cliente_id) { formErrors.cliente_id = 'Selecione o cliente.'; ok = false }
  if (!form.servicosSelecionados.length) { formErrors.slots = 'Selecione ao menos um serviço.'; ok = false }
  if (slotsPerServicoInterno.value.some(i => !i.horario || !i.data)) { formErrors.slots = 'Selecione data e horário para todos os serviços.'; ok = false }
  return ok
}

// ── Slot-picker interno (modal de adicionar/editar) ─────────────

function formatHoraSlot(d: Date) {
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Sao_Paulo' })
}

function calcularSlotsInterno(
  dataISO: string,
  duracao: number,
  ocupados: { inicio: string; fim: string }[],
): Date[] {
  const result: Date[] = []
  const [abH, abM] = horarios.abertura.split(':').map(Number) as [number, number]
  const [fhH, fhM] = horarios.fechamento.split(':').map(Number) as [number, number]

  const SP_OFFSET_MS = 3 * 60 * 60 * 1000
  const spMidnight   = new Date(dataISO + 'T00:00:00Z').getTime() + SP_OFFSET_MS

  const isToday      = dataISO === hoje
  const minMinutesSP = isToday ? Math.floor((Date.now() - spMidnight) / 60_000) : 0

  let almocoInicioMs: number | null = null
  let almocoFimMs:    number | null = null
  if (horarios.almoco_ativo && horarios.almoco_inicio && horarios.almoco_fim) {
    const [alH, alM] = horarios.almoco_inicio.split(':').map(Number) as [number, number]
    const [afH, afM] = horarios.almoco_fim.split(':').map(Number) as [number, number]
    almocoInicioMs = spMidnight + (alH * 60 + alM) * 60_000
    almocoFimMs    = spMidnight + (afH * 60 + afM) * 60_000
  }

  let cursorMin = abH * 60 + abM
  const endMin  = fhH * 60 + fhM

  while (cursorMin + duracao <= endMin) {
    if (!isToday || cursorMin >= minMinutesSP) {
      const slotStart = spMidnight + cursorMin * 60_000
      const slotEnd   = slotStart + duracao * 60_000

      const bloqueadoAlmoco = almocoInicioMs !== null && almocoFimMs !== null
        && slotStart < almocoFimMs && slotEnd > almocoInicioMs

      const disponivel = !bloqueadoAlmoco && !ocupados.some(oc => {
        const ocStart = new Date(oc.inicio).getTime()
        const ocEnd   = new Date(oc.fim).getTime()
        return slotStart < ocEnd && slotEnd > ocStart
      })
      if (disponivel) result.push(new Date(slotStart))
    }
    cursorMin += horarios.intervalo
  }
  return result
}

async function carregarSlotsItemInterno(item: SlotItemInterno) {
  item.slots  = []
  item.error  = null
  if (!item.data) return

  const d = new Date(item.data + 'T00:00:00')
  item.diaFechado = !horarios.dias.includes(d.getDay())
  if (item.diaFechado) return

  item.loading = true
  const { data, error: rpcError } = await supabase.rpc('get_horarios_ocupados_funcionario', {
    p_empresa_id:     empresaId.value,
    p_data:           item.data,
    p_servico_id:     item.servico.id,
    p_funcionario_id: item.funcionarioBigintId ?? null,
  })

  if (rpcError) { item.error = 'Não foi possível verificar a disponibilidade.'; item.loading = false; return }

  let slots = calcularSlotsInterno(item.data, item.servico.duracao_min ?? 60, (data ?? []) as { inicio: string; fim: string }[])

  // Se este item é o PRIMÁRIO de pares simultâneos (não tem anterior),
  // filtra os slots para a intersecção onde TODOS os parceiros também estão livres.
  // Cada parceiro verifica o seu próprio funcionário pela SUA própria duração.
  if (!getSimultaneoAnterior(item)) {
    const parceiros = slotsPerServicoInterno.value.filter(
      other => other.servico.id !== item.servico.id && isSimultaneo(item.servico.id, other.servico.id)
    )

    // Pré-calcula o timestamp de fechamento para filtrar duração dos parceiros
    const [fhH, fhM] = horarios.fechamento.split(':').map(Number) as [number, number]
    const SP_OFFSET_MS = 3 * 60 * 60 * 1000
    const spMidnight = new Date(item.data + 'T00:00:00Z').getTime() + SP_OFFSET_MS
    const fechamentoMs = spMidnight + (fhH * 60 + fhM) * 60_000

    for (const par of parceiros) {
      const durParMs = (par.servico.duracao_min ?? 60) * 60_000

      // Remove slots onde o parceiro (com duração maior) ultrapassaria o fechamento
      slots = slots.filter(slot => slot.getTime() + durParMs <= fechamentoMs)

      const { data: parOcupados, error: parErr } = await supabase.rpc('get_horarios_ocupados_funcionario', {
        p_empresa_id:     empresaId.value,
        p_data:           item.data,
        p_servico_id:     par.servico.id,
        p_funcionario_id: par.funcionarioBigintId ?? null,
      })
      if (parErr) continue
      const ocupadosPar = (parOcupados ?? []) as { inicio: string; fim: string }[]
      slots = slots.filter(slot => {
        const s = slot.getTime()
        const e = s + durParMs
        return !ocupadosPar.some(oc => {
          const os = new Date(oc.inicio).getTime()
          const oe = new Date(oc.fim).getTime()
          return s < oe && e > os
        })
      })
    }
  }

  item.slots   = slots
  item.loading = false
}

async function onDataChangeItemInterno(item: SlotItemInterno) {
  item.horario = null
  await carregarSlotsItemInterno(item)
}

// Bloqueia slots que conflitam por duração com outro serviço já selecionado no mesmo funcionário.
// Serviços simultâneos não se bloqueiam entre si (por definição podem sobrepor).
function isSlotTakenInterno(slot: Date, currentItem: SlotItemInterno): boolean {
  const slotStart = slot.getTime()
  const slotEnd   = slotStart + (currentItem.servico.duracao_min ?? 60) * 60_000
  return slotsPerServicoInterno.value.some(item => {
    if (item.servico.id === currentItem.servico.id) return false
    if (!item.horario || item.data !== currentItem.data) return false
    if (isSimultaneo(currentItem.servico.id, item.servico.id)) return false
    // Só bloqueia se for o mesmo funcionário (calendarios independentes não se conflitam)
    if (item.funcionarioBigintId !== currentItem.funcionarioBigintId) return false
    const otherStart = item.horario.getTime()
    const otherEnd   = otherStart + (item.servico.duracao_min ?? 60) * 60_000
    return slotStart < otherEnd && slotEnd > otherStart
  })
}

async function syncServicos(agendamentoId: number, servicoId: number, preco: number, funcionarioId: number | null) {
  await supabase.from('agendamento_servicos').delete().eq('agendamento_id', agendamentoId)
  await supabase.from('agendamento_servicos').insert({
    agendamento_id: agendamentoId,
    servico_id:     servicoId,
    preco_cobrado:  preco,
    funcionario_id: funcionarioId ?? null,
  })
}

async function gerarComissoes(
  agendamentoId: number,
  dataHora: string,
  funcBigintId: number | null,
  funcNome: string | null,
): Promise<string | null> {
  // Idempotência: se já existe comissão para este agendamento, não lança de novo
  const { data: jaExiste } = await supabase
    .from('comissoes')
    .select('id')
    .eq('agendamento_id', agendamentoId)
    .limit(1)
  if (jaExiste?.length) return null

  const { data: agServicos, error: agErr } = await supabase
    .from('agendamento_servicos')
    .select('servico_id, preco_cobrado')
    .eq('agendamento_id', agendamentoId)

  if (agErr) return `Erro ao buscar serviços do agendamento: ${agErr.message}`
  if (!agServicos?.length) return null

  const comissaoRows: any[] = []
  const dataISO = dataHora.slice(0, 10)

  for (const as of agServicos) {
    const svc = servicosAtivos.value.find(s => s.id === Number(as.servico_id))
    if (!svc?.comissao_percentual) continue

    const valorServico = Number(as.preco_cobrado ?? svc.preco)
    const valorComissao = +(valorServico * svc.comissao_percentual / 100).toFixed(2)

    comissaoRows.push({
      empresa_id:     empresaId.value!,
      agendamento_id: agendamentoId,
      funcionario_id: funcBigintId,
      servico_id:     svc.id,
      servico_nome:   svc.nome,
      valor_servico:  valorServico,
      percentual:     svc.comissao_percentual,
      valor_comissao: valorComissao,
      data:           dataISO,
    })
  }

  if (!comissaoRows.length) return null

  // 1) Upsert na tabela comissoes
  const { data: comissoesSalvas, error: comErr } = await supabase
    .from('comissoes')
    .upsert(comissaoRows, { onConflict: 'agendamento_id,servico_id' })
    .select('id, servico_nome, valor_comissao, servico_id')

  if (comErr) return `Erro ao salvar comissões: ${comErr.message}`

  const funcNomeLabel = funcNome ? ` — ${funcNome}` : ''

  // 2) Lança cada comissão em contas_pagar (INSERT, ignora duplicata 23505)
  for (const salva of (comissoesSalvas ?? [])) {
    const { error: cpErr } = await supabase
      .from('contas_pagar')
      .insert({
        empresa_id:      empresaId.value!,
        descricao:       `Comissão: ${salva.servico_nome}${funcNomeLabel}`,
        valor:           salva.valor_comissao,
        data_vencimento: dataISO,
        status:          'pendente',
        categoria:       'Comissão',
        origem:          'comissao',
        comissao_id:     salva.id,
      })
    if (cpErr && cpErr.code !== '23505') {
      return `Erro ao lançar comissão em contas a pagar: ${cpErr.message}`
    }
  }
  return null
}

async function salvarEdicao() {
  if (!editando.value || !validateForm()) return
  saving.value = true
  modalError.value = null

  const item = slotsPerServicoInterno.value[0]
  if (!item) { saving.value = false; return }
  const hora = item.horario ? formatHoraSlot(item.horario) : ''
  const dataHora = `${item?.data}T${hora}:00-03:00`

  const statusAnterior = editando.value.status

  const { error: updateError } = await supabase
    .from('agendamentos')
    .update({
      cliente_id:     form.cliente_id ?? null,
      funcionario_id: item?.funcionarioUuid ?? null,
      data_hora:      dataHora,
      status:         form.status,
      observacoes:    form.observacoes.trim() || null,
      empresa_id:     empresaId.value!,
    })
    .eq('id', editando.value.id)

  if (updateError) { modalError.value = updateError.message; saving.value = false; return }

  await syncServicos(editando.value.id, item.servico.id, item.servico.preco, item?.funcionarioBigintId ?? null)

  // Gera comissões ao concluir (apenas quando o status muda para concluido)
  // Resolve funcionário via profile_id (UUID) que já está no item
  // funcionarios.value tem profile_id preenchido desde fetchFuncionarios
  if (form.status === 'concluido' && statusAnterior !== 'concluido') {
    const funcId   = item?.funcionarioBigintId ?? null
    const funcNome = funcId != null
      ? (funcionarios.value.find(f => Number(f.id) === Number(funcId))?.nome ?? null)
      : null
    const comissaoErr = await gerarComissoes(editando.value.id, dataHora, funcId, funcNome)
    if (comissaoErr) { modalError.value = comissaoErr; saving.value = false; return }
  }

  saving.value = false
  editando.value = null
  await fetchAgendamentos()
}

async function salvarAdicao() {
  if (!validateForm()) return
  saving.value = true
  modalError.value = null

  try {
    for (const item of slotsPerServicoInterno.value) {
      if (!item.horario || !item.data) continue
      const hora      = formatHoraSlot(item.horario)
      const dataHora  = `${item.data}T${hora}:00-03:00`

      const { data, error: insertError } = await supabase
        .from('agendamentos')
        .insert({
          cliente_id:     form.cliente_id ?? null,
          funcionario_id: item.funcionarioUuid ?? null,
          data_hora:      dataHora,
          status:         form.status,
          observacoes:    form.observacoes.trim() || null,
          empresa_id:     empresaId.value!,
        })
        .select('id')
        .single()

      if (insertError) throw insertError
      await syncServicos(data.id, item.servico.id, item.servico.preco, item.funcionarioBigintId ?? null)
    }
  } catch (e: any) {
    modalError.value = e?.message ?? 'Erro ao salvar agendamento.'
    saving.value = false
    return
  }

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
  const [aY = 0, aM = 1, aD = 1] = ag.data_hora.slice(0, 10).split('-').map(Number)
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

/* Header stats — usar primary-text, imune aos overrides do tema */
.header-stats .stat-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-primary-text, #ffffff) !important;
  opacity: 0.7;
}
.header-stats .stat-value {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--color-primary-text, #ffffff) !important;
}
</style>

