<template>
  <div class="min-h-full bg-transparent p-3 sm:p-8">

    <!-- �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� CABE�?ALHO �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� -->
    <div class="relative rounded-3xl overflow-hidden mb-8 shadow-xl">
      <div class="absolute inset-0" :style="{ background: 'var(--color-primary-bg, linear-gradient(135deg, #ec4899, #f43f5e))' }" />
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />
      <div class="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/[0.03] pointer-events-none" />
      <div class="absolute -bottom-20 left-1/4 w-96 h-96 rounded-full bg-white/[0.02] pointer-events-none" />
      <PageLogo />

      <div class="relative px-4 sm:px-8 pt-5 sm:pt-7 pb-5 sm:pb-7">
        <div class="flex flex-wrap items-start justify-between gap-3 sm:gap-6">
          <div class="flex items-center gap-3 sm:gap-5">
            <div class="flex items-center justify-center w-10 sm:w-14 h-10 sm:h-14 rounded-2xl bg-white/[0.12] backdrop-blur-sm border border-white/20 shadow-lg">
              <svg class="w-5 sm:w-7 h-5 sm:h-7 text-white" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
              </svg>
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-semibold text-white/80 uppercase tracking-widest">Gestão</span>
                <span class="w-1 h-1 rounded-full bg-white/40" />
                <span class="text-xs text-white/70 hidden sm:inline">UpStudio</span>
              </div>
              <h1 class="text-xl sm:text-3xl font-bold text-white tracking-tight leading-none">Atividades</h1>
              <p class="text-sm text-white/80 mt-1.5">
                {{ loading ? 'Carregando...' : `${atividadesFiltradas.length} de ${atividades.length} atividade(s) exibida(s)` }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <button
              type="button"
              class="inline-flex items-center gap-2 text-sm font-semibold px-3 sm:px-5 py-2.5 rounded-xl transition-all duration-200"
              :class="filtroAberto
                ? 'bg-white text-primary shadow-lg scale-[1.02]'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/15 backdrop-blur-sm'"
              @click="filtroAberto = !filtroAberto"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/></svg>
              <span class="hidden sm:inline">Filtros</span>
              <span v-if="filtrosAtivos > 0" class="inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-white text-primary text-xs font-black">{{ filtrosAtivos }}</span>
            </button>
            <!-- toggle Instâncias / Modelos -->
            <div class="flex rounded-xl overflow-hidden border border-white/20">
              <button
                type="button"
                class="px-3 py-2 text-xs font-bold transition-colors"
                :class="viewMode === 'instancias' ? 'bg-white text-primary' : 'text-white hover:bg-white/20'"
                @click="viewMode = 'instancias'"
              >Instâncias</button>
              <button
                type="button"
                class="px-3 py-2 text-xs font-bold transition-colors"
                :class="viewMode === 'modelos' ? 'bg-white text-primary' : 'text-white hover:bg-white/20'"
                @click="viewMode = 'modelos'"
              >Modelos</button>
            </div>
            <!-- Gerar Hoje (só admin) -->
            <button
              v-if="viewMode === 'modelos' && isAdminOrGerente"
              type="button"
              :disabled="gerando"
              class="inline-flex items-center gap-2 text-sm font-bold px-3 sm:px-4 py-2.5 rounded-xl bg-white text-primary hover:bg-primary-5 shadow-lg transition-all duration-200 hover:scale-[1.02] disabled:opacity-60"
              @click="gerarHoje"
            >
              <span v-if="gerando" class="inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/></svg>
              <span class="hidden sm:inline">{{ gerando ? 'Gerando...' : 'Gerar Hoje' }}</span>
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-2 text-sm font-bold px-3 sm:px-5 py-2.5 rounded-xl bg-white text-primary hover:bg-primary-5 shadow-lg transition-all duration-200 hover:scale-[1.02]"
              @click="abrirAdicionar"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
              <span class="hidden sm:inline">{{ viewMode === 'modelos' ? 'Novo Modelo' : 'Nova Atividade' }}</span>
            </button>
          </div>
        </div>

        <div class="h-px bg-white/10 my-4 sm:my-6" />

        <!-- Stats -->
        <div v-if="!loading" class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="flex flex-col gap-1 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/10 hover:bg-white/15 transition-colors">
            <span class="text-xs font-semibold text-white/70 uppercase tracking-widest">Total</span>
            <span class="text-xl font-black text-white leading-tight">{{ atividades.length }}</span>
            <span class="text-xs text-white/50">atividade(s)</span>
          </div>
          <div class="flex flex-col gap-1 bg-white/10 rounded-2xl px-5 py-4 border border-white/10 hover:bg-white/15 transition-colors">
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-white" />
              <span class="text-xs font-semibold text-white/70 uppercase tracking-widest">Pendentes</span>
            </div>
            <span class="text-xl font-black text-white leading-tight">{{ countByStatus('pendente') }}</span>
            <span class="text-xs text-white/50">aguardando início</span>
          </div>
          <div class="flex flex-col gap-1 bg-white/10 rounded-2xl px-5 py-4 border border-white/10 hover:bg-white/15 transition-colors">
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-white/70" />
              <span class="text-xs font-semibold text-white/70 uppercase tracking-widest">Em Andamento</span>
            </div>
            <span class="text-xl font-black text-white leading-tight">{{ countByStatus('em_andamento') }}</span>
            <span class="text-xs text-white/50">em execução</span>
          </div>
          <div class="flex flex-col gap-1 bg-white/10 rounded-2xl px-5 py-4 border border-white/10 hover:bg-white/15 transition-colors">
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-white/70" />
              <span class="text-xs font-semibold text-white/70 uppercase tracking-widest">Concluídas</span>
            </div>
            <span class="text-xl font-black text-white leading-tight">{{ countByStatus('concluida') }}</span>
            <span class="text-xs text-white/50">finalizadas</span>
          </div>
        </div>
      </div>
    </div>

    <!-- �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� FILTRO �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� -->
    <Transition name="slide-fade">
      <div v-show="filtroAberto" class="bg-white rounded-3xl border border-gray-100 shadow-md mb-6 overflow-hidden">
        <div class="flex items-center justify-between px-7 py-4 border-b border-gray-100 bg-gray-50/70">
          <div class="flex items-center gap-2.5">
            <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/></svg>
            <span class="text-sm font-bold text-gray-700">Filtros</span>
          </div>
          <button v-if="filtrosAtivos > 0" type="button" class="text-xs font-semibold text-primary hover:underline" @click="limparFiltros">
            Limpar todos
          </button>
        </div>
        <div class="p-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Busca</label>
            <div class="relative">
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="m21 21-4.35-4.35"/></svg>
              <input v-model="filtros.busca" type="text" placeholder="Título ou funcionário..." class="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" />
            </div>
          </div>
          <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Responsável</label>
            <select v-model="filtros.funcionarioId" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">Todos</option>
              <option v-for="f in funcionariosOpcoes" :key="f.id" :value="String(f.id)">{{ f.nome }}</option>
            </select>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Status</label>
            <select v-model="filtros.status" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">Todos</option>
              <option value="pendente">Pendente</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="concluida">Concluída</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Prioridade</label>
            <select v-model="filtros.prioridade" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">Todas</option>
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
              <option value="urgente">Urgente</option>
            </select>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Periodicidade</label>
            <select v-model="filtros.periodicidade" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">Todas</option>
              <option value="diaria">Diária</option>
              <option value="quinzenal">Quinzenal</option>
              <option value="mensal">Mensal</option>
            </select>
          </div>
        </div>
      </div>
    </Transition>

    <!-- �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� LOADING �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� -->
    <div v-if="loading" class="flex flex-col items-center justify-center gap-4 py-32">
      <span class="inline-block w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      <span class="text-sm text-gray-400 font-medium">Carregando atividades...</span>
    </div>

    <!-- �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� ERRO �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� -->
    <div v-else-if="error" class="flex items-center gap-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-2xl px-6 py-4">
      <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" d="M12 8v4m0 4h.01"/></svg>
      {{ error }}
    </div>

    <!-- �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� TABELA �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� -->
    <div v-else class="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
      <!-- Banner Modelos -->
      <div v-if="viewMode === 'modelos'" class="flex items-center gap-3 px-7 py-3 bg-primary-5 border-b border-primary-border">
        <svg class="w-4 h-4 text-primary shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/></svg>
        <p class="text-xs font-semibold text-primary">
          Modelos são atividades <strong>sem data definida</strong> usadas como base para geração automática.
          Ao clicar em <strong>Gerar Hoje</strong>, instâncias com a data de hoje são criadas para cada modelo conforme a periodicidade.
        </p>
        <span v-if="geracaoMsg" class="ml-auto text-xs font-bold text-primary bg-primary-10 px-3 py-1 rounded-full shrink-0">{{ geracaoMsg }}</span>
      </div>

      <div class="flex items-center justify-between px-7 py-4 border-b border-gray-100 bg-gray-50/50">
        <span class="text-sm font-semibold text-gray-600">
          <span class="text-indigo-600 font-black">{{ atividadesFiltradas.length }}</span>
          {{ viewMode === 'modelos' ? ' modelo(s)' : ' resultado(s)' }}
          <span v-if="filtrosAtivos > 0" class="text-gray-400 font-normal"> �?" filtros aplicados</span>
        </span>
        <span class="text-xs text-gray-400">{{ viewMode === 'modelos' ? 'Recorrentes' : 'Ordenado por data' }}</span>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="text-left px-6 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest w-12">#</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Responsável</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Título / Descrição</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Periodicidade</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Prioridade</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Status</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest whitespace-nowrap">Data / Horário</th>
              <th class="px-6 py-4 text-right text-xs font-extrabold text-gray-400 uppercase tracking-widest sm:sticky sm:right-0 bg-gray-50 w-24">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-if="atividadesFiltradas.length === 0">
              <td colspan="8" class="text-center py-20">
                <div class="flex flex-col items-center gap-3">
                  <svg class="w-14 h-14 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.25" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
                  </svg>
                  <span class="text-base font-semibold text-gray-400">Nenhuma atividade encontrada</span>
                  <span v-if="filtrosAtivos > 0" class="text-sm text-gray-400">Tente ajustar os filtros</span>
                </div>
              </td>
            </tr>
            <tr
              v-for="at in atividadesFiltradas"
              :key="at.id"
              class="hover:bg-indigo-50/30 transition-colors duration-150 group"
            >
              <!-- # -->
              <td class="px-6 py-4">
                <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-black text-xs">
                  {{ at.id }}
                </span>
              </td>

              <!-- Funcionário -->
              <td class="px-5 py-4">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-black text-xs shrink-0 shadow-sm shadow-green-200 select-none">
                    {{ (at.funcionarios?.nome ?? '?')[0]?.toUpperCase() }}
                  </div>
                  <div class="flex flex-col min-w-0">
                    <span class="font-semibold text-gray-800 max-w-[140px] block truncate whitespace-nowrap">{{ at.funcionarios?.nome ?? '—' }}</span>
                    <span v-if="at.funcionarios?.cargo" class="text-xs text-gray-400 truncate">{{ at.funcionarios.cargo }}</span>
                  </div>
                </div>
              </td>

              <!-- Título / Descrição -->
              <td class="px-5 py-4">
                <div class="flex flex-col gap-0.5">
                  <span class="font-bold text-gray-800 max-w-[260px] block truncate">{{ at.titulo }}</span>
                  <span v-if="at.descricao" class="text-xs text-gray-400 max-w-[260px] block truncate">{{ at.descricao }}</span>
                </div>
              </td>

              <!-- Periodicidade -->
              <td class="px-5 py-4">
                <span :class="['inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full', periodicidadeBadgeClass(at.periodicidade)]">
                  {{ periodicidadeLabel(at.periodicidade) }}
                </span>
              </td>

              <!-- Prioridade -->
              <td class="px-5 py-4">
                <span :class="['inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full', prioridadeBadgeClass(at.prioridade)]">
                  <span :class="['w-1.5 h-1.5 rounded-full', prioridadeDotClass(at.prioridade)]" />
                  {{ prioridadeLabel(at.prioridade) }}
                </span>
              </td>

              <!-- Status -->
              <td class="px-5 py-4">
                <span :class="['inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full', statusBadgeClass(at.status)]">
                  <span :class="['w-1.5 h-1.5 rounded-full', statusDotClass(at.status)]" />
                  {{ statusLabel(at.status) }}
                </span>
              </td>

              <!-- Data / Horário -->
              <td class="px-5 py-4">
                <div class="flex flex-col gap-0.5 text-xs text-gray-500 font-medium whitespace-nowrap">
                  <span v-if="at.data_atividade">{{ formatDate(at.data_atividade) }}</span>
                  <span v-else class="inline-flex items-center gap-1 text-[11px] font-bold bg-primary-10 text-primary px-2 py-0.5 rounded-full">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/></svg>
                    Recorrente
                  </span>
                  <span v-if="at.hora_inicio || at.hora_fim" class="text-gray-400">
                    {{ at.hora_inicio ?? '–' }}{{ at.hora_fim ? ` → ${at.hora_fim}` : '' }}
                  </span>
                </div>
              </td>

              <!-- Ações -->
              <td class="px-6 py-4 text-right sm:sticky sm:right-0 group-hover:bg-indigo-50/30 transition-colors">
                <div class="flex items-center justify-end gap-1">
                  <button v-if="isAdminOrGerente" type="button" class="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-indigo-500 hover:bg-indigo-100 transition-colors" title="Editar" @click="editAtividade(at)">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 7.125L18 8.625"/></svg>
                  </button>
                  <button v-if="isAdmin" type="button" class="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-red-400 hover:bg-red-50 transition-colors" title="Excluir" @click="confirmarExclusao(at)">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a1 1 0 01-1-1V5a1 1 0 011-1h8a1 1 0 011 1v1a1 1 0 01-1 1H9z"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� MODAL ADICIONAR / EDITAR �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="editando !== null || adicionando"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md px-4"
          @click.self="fecharModal"
        >
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden">
            <div class="flex items-center justify-between px-8 py-6 border-b border-white/10" :style="{ background: 'var(--color-primary-bg, linear-gradient(135deg, #111827, #1f2937))' }">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
                  </svg>
                </div>
                <h2 class="text-lg font-bold text-white">{{ adicionando ? 'Nova Atividade' : 'Editar Atividade' }}</h2>
              </div>
              <button type="button" class="w-8 h-8 flex items-center justify-center rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors" @click="fecharModal">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <form class="flex flex-col gap-5 px-8 py-7 overflow-y-auto max-h-[75vh]" @submit.prevent="adicionando ? salvarAdicao() : salvarEdicao()">
              <!-- Funcionário -->
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-semibold text-gray-700">Responsável *</label>
                <select v-model="form.funcionario_id" required class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#6b7280)] focus:border-[var(--color-primary,#6b7280)]" :class="formErrors.funcionario_id ? 'border-red-400 ring-1 ring-red-400' : ''">
                  <option :value="null">Selecione o responsável</option>
                  <option v-for="f in funcionariosOpcoes" :key="f.id" :value="f.id">{{ f.nome }}{{ f.cargo ? ` · ${f.cargo}` : '' }}</option>
                </select>
                <p v-if="formErrors.funcionario_id" class="text-xs text-red-500 font-medium">{{ formErrors.funcionario_id }}</p>
              </div>

              <!-- Título -->
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-semibold text-gray-700">Título *</label>
                <input v-model="form.titulo" type="text" required maxlength="200" placeholder="Ex: Alimentação dos animais da manhã" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#6b7280)] focus:border-[var(--color-primary,#6b7280)]" :class="formErrors.titulo ? 'border-red-400 ring-1 ring-red-400' : ''" />
                <p v-if="formErrors.titulo" class="text-xs text-red-500 font-medium">{{ formErrors.titulo }}</p>
              </div>

              <!-- Descrição -->
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-semibold text-gray-700">Descrição</label>
                <textarea v-model="form.descricao" rows="2" placeholder="Detalhes da atividade..." class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#6b7280)] focus:border-[var(--color-primary,#6b7280)] resize-none" />
              </div>

              <!-- Periodicidade -->
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-semibold text-gray-700">Periodicidade</label>
                <div class="flex gap-2">
                  <button
                    v-for="op in [{ label: 'Diária', value: 'diaria' }, { label: 'Quinzenal', value: 'quinzenal' }, { label: 'Mensal', value: 'mensal' }]"
                    :key="op.value"
                    type="button"
                    class="flex-1 text-xs font-bold py-2.5 rounded-xl border transition-colors"
                    :class="form.periodicidade === op.value ? 'border-transparent' : 'border-gray-200 text-gray-500 hover:border-gray-300 bg-white'"
                    :style="form.periodicidade === op.value ? { background: 'var(--color-btn, var(--color-primary, #6b7280))', color: 'var(--color-btn-text, #ffffff)', boxShadow: '0 0 0 2px var(--color-primary, #6b7280)' } : {}"
                    @click="form.periodicidade = op.value"
                  >
                    {{ op.label }}
                  </button>
                </div>
              </div>

              <!-- Dias da Semana (só em modelos) -->
              <div v-if="viewMode === 'modelos'" class="flex flex-col gap-1.5">
                <label class="text-sm font-semibold text-gray-700">
                  Dias da Semana
                  <span class="ml-1 text-xs font-normal text-gray-400">(vazio = todos os dias)</span>
                </label>
                <div class="flex gap-1.5">
                  <button
                    v-for="dia in [{ label: 'Dom', value: 'dom' }, { label: 'Seg', value: 'seg' }, { label: 'Ter', value: 'ter' }, { label: 'Qua', value: 'qua' }, { label: 'Qui', value: 'qui' }, { label: 'Sex', value: 'sex' }, { label: 'Sáb', value: 'sab' }]"
                    :key="dia.value"
                    type="button"
                    class="flex-1 text-xs font-bold py-2 rounded-xl border transition-colors"
                    :class="form.dias_semana.includes(dia.value) ? 'border-transparent' : 'border-gray-200 text-gray-500 hover:border-gray-300 bg-white'"
                    :style="form.dias_semana.includes(dia.value) ? { background: 'var(--color-btn, var(--color-primary, #6b7280))', color: 'var(--color-btn-text, #ffffff)', boxShadow: '0 0 0 2px var(--color-primary, #6b7280)' } : {}"
                    @click="toggleDia(dia.value)"
                  >{{ dia.label }}</button>
                </div>
              </div>

              <!-- Prioridade + Status -->
              <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-semibold text-gray-700">Prioridade</label>
                  <select v-model="form.prioridade" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#6b7280)] focus:border-[var(--color-primary,#6b7280)]">
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-semibold text-gray-700">Status</label>
                  <select v-model="form.status" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#6b7280)] focus:border-[var(--color-primary,#6b7280)]">
                    <option value="pendente">Pendente</option>
                    <option value="em_andamento">Em Andamento</option>
                    <option value="concluida">Concluída</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>
              </div>

              <!-- Data -->
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-semibold text-gray-700">
                  Data da Atividade

                </label>
                <input v-model="form.data_atividade" type="date" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#6b7280)] focus:border-[var(--color-primary,#6b7280)]" />
              </div>

              <!-- Hora início + fim -->
              <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-semibold text-gray-700">Hora Início</label>
                  <input v-model="form.hora_inicio" type="time" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#6b7280)] focus:border-[var(--color-primary,#6b7280)]" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-semibold text-gray-700">Hora Fim</label>
                  <input v-model="form.hora_fim" type="time" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#6b7280)] focus:border-[var(--color-primary,#6b7280)]" />
                </div>
              </div>

              <!-- Observação -->
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-semibold text-gray-700">Observação</label>
                <textarea v-model="form.observacao" rows="2" placeholder="Observações adicionais..." class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#6b7280)] focus:border-[var(--color-primary,#6b7280)] resize-none" />
              </div>

              <p v-if="modalError" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{{ modalError }}</p>

              <div class="flex gap-3 pt-1">
                <button type="button" class="flex-1 py-3 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors text-sm font-semibold" @click="fecharModal">
                  Cancelar
                </button>
                <AppButton variant="primary" size="md" type="submit" :loading="saving" class="flex-1">
                  {{ adicionando ? (viewMode === 'modelos' ? 'Criar Modelo' : 'Criar Atividade') : 'Salvar Alterações' }}
                </AppButton>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� MODAL EXCLUIR �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="excluindo"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md px-4"
          @click.self="excluindo = null"
        >
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div class="px-8 pt-8 pb-6 text-center">
              <div class="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-5">
                <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a1 1 0 01-1-1V5a1 1 0 011-1h8a1 1 0 011 1v1a1 1 0 01-1 1H9z"/></svg>
              </div>
              <h2 class="text-xl font-bold text-gray-800">Excluir atividade?</h2>
              <p class="text-sm text-gray-500 mt-2 leading-relaxed">
                <strong class="text-gray-800">{{ excluindo.titulo }}</strong><br />
                de <strong class="text-gray-800">{{ excluindo.funcionarios?.nome }}</strong>.<br />
                <span class="text-red-500 text-xs font-semibold">Essa ação não pode ser desfeita.</span>
              </p>
            </div>
            <p v-if="deleteError" class="text-sm text-red-600 bg-red-50 border-t border-b border-red-200 px-8 py-3 text-center">{{ deleteError }}</p>
            <div class="flex gap-3 px-8 pb-8 pt-4">
              <button type="button" class="flex-1 py-3 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors text-sm font-semibold" @click="excluindo = null">
                Cancelar
              </button>
              <button
                type="button"
                class="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-colors shadow-sm shadow-red-200 disabled:opacity-60"
                :disabled="deleting"
                @click="executarExclusao"
              >
                <span v-if="deleting" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                {{ deleting ? 'Excluindo...' : 'Excluir' }}
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
import AppButton from '~/components/AppButton.vue'
import { gerarTarefasDiarias, chaveGeracaoHoje } from '~/composables/useGerarTarefas'

interface FuncionarioOpcao { id: number; nome: string; cargo: string | null }
interface Atividade {
  id: number
  funcionario_id: number
  titulo: string
  descricao: string | null
  status: string | null
  prioridade: string | null
  periodicidade: string | null
  data_atividade: string | null
  hora_inicio: string | null
  hora_fim: string | null
  observacao: string | null
  dias_semana: string[] | null
  created_at: string | null
  funcionarios: { nome: string; cargo: string | null } | null
}

const supabase = createSupabaseClient()
const { empresaId, loadEmpresa } = useEmpresa()
const { isAdmin, isAdminOrGerente } = useAdmin()

const atividades         = ref<Atividade[]>([])
const funcionariosOpcoes = ref<FuncionarioOpcao[]>([])
const loading            = ref(true)
const error              = ref<string | null>(null)

const editando   = ref<Atividade | null>(null)
const adicionando = ref(false)
const saving     = ref(false)
const modalError = ref<string | null>(null)

const excluindo   = ref<Atividade | null>(null)
const deleting    = ref(false)
const deleteError = ref<string | null>(null)

const viewMode   = ref<'instancias' | 'modelos'>('instancias')
const gerando    = ref(false)
const geracaoMsg = ref('')

const filtroAberto = ref(false)
const filtros = reactive({ busca: '', funcionarioId: '', status: '', prioridade: '', periodicidade: '' })

const form = reactive({
  funcionario_id: null as number | null,
  titulo:         '',
  descricao:      '',
  status:         'pendente',
  prioridade:     'media',
  periodicidade:  'diaria',
  dias_semana:    [] as string[],
  data_atividade: '',
  hora_inicio:    '',
  hora_fim:       '',
  observacao:     '',
})
const formErrors = reactive({ funcionario_id: '', titulo: '' })

// �"?�"? Stats �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?
function countByStatus(s: string) {
  return atividades.value.filter(a => a.status === s).length
}

// �"?�"? Filtros �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?
const filtrosAtivos = computed(() => {
  let c = 0
  if (filtros.busca) c++
  if (filtros.funcionarioId) c++
  if (filtros.status) c++
  if (filtros.prioridade) c++
  if (filtros.periodicidade) c++
  return c
})

const atividadesFiltradas = computed(() => {
  return atividades.value.filter(a => {
    // Filtro por modo de visualização
    if (viewMode.value === 'modelos'    && a.data_atividade !== null) return false
    if (viewMode.value === 'instancias' && a.data_atividade === null) return false

    if (filtros.status && a.status !== filtros.status) return false
    if (filtros.prioridade && a.prioridade !== filtros.prioridade) return false
    if (filtros.periodicidade && a.periodicidade !== filtros.periodicidade) return false
    if (filtros.funcionarioId && String(a.funcionario_id) !== filtros.funcionarioId) return false
    if (filtros.busca.trim()) {
      const q = filtros.busca.toLowerCase()
      return (
        a.titulo.toLowerCase().includes(q) ||
        (a.funcionarios?.nome ?? '').toLowerCase().includes(q) ||
        (a.descricao ?? '').toLowerCase().includes(q)
      )
    }
    return true
  })
})

function limparFiltros() {
  filtros.busca = ''; filtros.funcionarioId = ''; filtros.status = ''; filtros.prioridade = ''; filtros.periodicidade = ''
}

// �"?�"? Helpers �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?
function formatDate(iso: string | null): string {
  if (!iso) return '�?"'
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

function statusLabel(s: string | null): string {
  if (s === 'pendente')     return 'Pendente'
  if (s === 'em_andamento') return 'Em Andamento'
  if (s === 'concluida')    return 'Concluída'
  if (s === 'cancelada')    return 'Cancelada'
  return s ?? '�?"'
}
function statusBadgeClass(s: string | null): string {
  if (s === 'pendente')     return 'bg-primary-10 text-primary'
  if (s === 'em_andamento') return 'bg-blue-100 text-blue-700'
  if (s === 'concluida')    return 'bg-green-100 text-green-700'
  if (s === 'cancelada')    return 'bg-red-100 text-red-700'
  return 'bg-gray-100 text-gray-500'
}
function statusDotClass(s: string | null): string {
  if (s === 'pendente')     return 'bg-primary'
  if (s === 'em_andamento') return 'bg-blue-500'
  if (s === 'concluida')    return 'bg-green-500'
  if (s === 'cancelada')    return 'bg-red-500'
  return 'bg-gray-400'
}

function prioridadeLabel(p: string | null): string {
  if (p === 'baixa')   return 'Baixa'
  if (p === 'media')   return 'Média'
  if (p === 'alta')    return 'Alta'
  if (p === 'urgente') return 'Urgente'
  return p ?? '�?"'
}
function prioridadeBadgeClass(p: string | null): string {
  if (p === 'baixa')   return 'bg-gray-100 text-gray-600'
  if (p === 'media')   return 'bg-sky-100 text-sky-700'
  if (p === 'alta')    return 'bg-orange-100 text-orange-700'
  if (p === 'urgente') return 'bg-red-100 text-red-700'
  return 'bg-gray-100 text-gray-500'
}
function prioridadeDotClass(p: string | null): string {
  if (p === 'baixa')   return 'bg-gray-400'
  if (p === 'media')   return 'bg-sky-500'
  if (p === 'alta')    return 'bg-orange-500'
  if (p === 'urgente') return 'bg-red-500'
  return 'bg-gray-400'
}

function periodicidadeLabel(p: string | null): string {
  if (p === 'diaria')    return 'Diária'
  if (p === 'quinzenal') return 'Quinzenal'
  if (p === 'mensal')    return 'Mensal'
  return p ?? '�?"'
}
function periodicidadeBadgeClass(p: string | null): string {
  if (p === 'diaria')    return 'bg-primary-10 text-primary'
  if (p === 'quinzenal') return 'bg-teal-100 text-teal-700'
  if (p === 'mensal')    return 'bg-rose-100 text-rose-700'
  return 'bg-gray-100 text-gray-500'
}

// �"?�"? CRUD �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?
onMounted(async () => {
  await loadEmpresa()
  await Promise.all([fetchAtividades(), fetchFuncionarios()])
})

async function fetchAtividades() {
  loading.value = true
  const { data, error: fetchError } = await supabase
    .from('atividades_funcionarios')
    .select('*, funcionarios(nome, cargo)')
    .eq('empresa_id', empresaId.value!)
    .order('data_atividade', { ascending: false })
    .order('created_at', { ascending: false })
  loading.value = false
  if (fetchError) { error.value = fetchError.message; return }
  atividades.value = (data ?? []) as Atividade[]
}

async function fetchFuncionarios() {
  const { data } = await supabase
    .from('funcionarios')
    .select('id, nome, cargo')
    .eq('empresa_id', empresaId.value!)
    .order('nome')
  funcionariosOpcoes.value = (data ?? []) as FuncionarioOpcao[]
}

function resetForm() {
  form.funcionario_id = null
  form.titulo         = ''
  form.descricao      = ''
  form.status         = 'pendente'
  form.prioridade     = 'media'
  form.periodicidade  = 'diaria'
  form.dias_semana    = []
  form.data_atividade = ''
  form.hora_inicio    = ''
  form.hora_fim       = ''
  form.observacao     = ''
  formErrors.funcionario_id = ''
  formErrors.titulo         = ''
  modalError.value = null
}

function abrirAdicionar() {
  adicionando.value = true
  editando.value    = null
  resetForm()
  // No modo modelos, garante data em branco (recorrente)
  if (viewMode.value === 'modelos') form.data_atividade = ''
}

async function gerarHoje() {
  gerando.value = true
  geracaoMsg.value = ''
  const resultado = await gerarTarefasDiarias(empresaId.value!)
  gerando.value = false
  if (resultado.erro) {
    geracaoMsg.value = `Erro: ${resultado.erro}`
  } else if (resultado.geradas === 0) {
    geracaoMsg.value = 'Nenhuma nova tarefa (já geradas ou sem modelos para hoje)'
  } else {
    geracaoMsg.value = `${resultado.geradas} tarefa(s) gerada(s) com sucesso!`
    // Marca local para evitar re-geração
    localStorage.setItem(chaveGeracaoHoje(), String(resultado.geradas))
    await fetchAtividades()
  }
  // Limpa a mensagem após 5 s
  setTimeout(() => { geracaoMsg.value = '' }, 5000)
}

function fecharModal() {
  editando.value    = null
  adicionando.value = false
}

function editAtividade(at: Atividade) {
  editando.value = at
  modalError.value = null
  formErrors.funcionario_id = ''; formErrors.titulo = ''
  form.funcionario_id = at.funcionario_id
  form.titulo         = at.titulo
  form.descricao      = at.descricao ?? ''
  form.status         = at.status ?? 'pendente'
  form.prioridade     = at.prioridade ?? 'media'
  form.periodicidade  = at.periodicidade ?? 'diaria'
  form.dias_semana    = at.dias_semana ? [...at.dias_semana] : []
  form.data_atividade = at.data_atividade ?? ''
  form.hora_inicio    = at.hora_inicio ?? ''
  form.hora_fim       = at.hora_fim ?? ''
  form.observacao     = at.observacao ?? ''
}

function toggleDia(dia: string) {
  const idx = form.dias_semana.indexOf(dia)
  if (idx >= 0) form.dias_semana.splice(idx, 1)
  else form.dias_semana.push(dia)
}

function validateForm(): boolean {
  formErrors.funcionario_id = ''; formErrors.titulo = ''
  let ok = true
  if (!form.funcionario_id) { formErrors.funcionario_id = 'Selecione o responsável.'; ok = false }
  if (!form.titulo.trim())  { formErrors.titulo = 'O título é obrigatório.'; ok = false }
  return ok
}

function buildPayload() {
  const isModelo = viewMode.value === 'modelos'
  return {
    funcionario_id: form.funcionario_id!,
    titulo:         form.titulo.trim(),
    descricao:      form.descricao.trim() || null,
    status:         form.status,
    prioridade:     form.prioridade,
    periodicidade:  form.periodicidade,
    // Modelos têm data_atividade null (são recorrentes); instâncias precisam de uma data
    data_atividade: isModelo ? null : (form.data_atividade || new Date().toISOString().slice(0, 10)),
    dias_semana:    isModelo && form.dias_semana.length > 0 ? form.dias_semana : null,
    hora_inicio:    form.hora_inicio || null,
    hora_fim:       form.hora_fim || null,
    observacao:     form.observacao.trim() || null,
    empresa_id:     empresaId.value!,
  }
}

async function salvarAdicao() {
  if (!validateForm()) return
  saving.value = true; modalError.value = null
  const { error: insertError } = await supabase
    .from('atividades_funcionarios')
    .insert(buildPayload())
  saving.value = false
  if (insertError) { modalError.value = insertError.message; return }
  adicionando.value = false
  await fetchAtividades()
}

async function salvarEdicao() {
  if (!editando.value || !validateForm()) return
  saving.value = true; modalError.value = null
  const { error: updateError } = await supabase
    .from('atividades_funcionarios')
    .update(buildPayload())
    .eq('id', editando.value.id)
  saving.value = false
  if (updateError) { modalError.value = updateError.message; return }
  editando.value = null
  await fetchAtividades()
}

function confirmarExclusao(at: Atividade) { excluindo.value = at; deleteError.value = null }

async function executarExclusao() {
  if (!excluindo.value) return
  deleting.value = true; deleteError.value = null
  const { error: deleteErr } = await supabase
    .from('atividades_funcionarios')
    .delete()
    .eq('id', excluindo.value.id)
  deleting.value = false
  if (deleteErr) { deleteError.value = deleteErr.message; return }
  excluindo.value = null
  await fetchAtividades()
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-fade-enter-active { transition: all 0.2s ease; }
.slide-fade-leave-active { transition: all 0.15s ease; }
.slide-fade-enter-from, .slide-fade-leave-to { transform: translateY(-8px); opacity: 0; }
</style>
