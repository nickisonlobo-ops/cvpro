<template>
  <div class="min-h-full p-3 sm:p-6">

    <!-- MODAL NOVO/EDITAR ORÇAMENTO -->
    <OrcamentoNovoModal
      :show="showNovoModal"
      :clientes="clientes"
      :materiais="materiais"
      :mode="modalMode"
      :orcamento-para-editar="orcamentoParaEditar"
      @close="fecharModal"
      @created="onOrcamentoCriado"
      @updated="onOrcamentoAtualizado"
    />

    <!-- MODAL DETALHES DO ORÇAMENTO -->
    <OrcamentoDetalhesModal
      :show="showDetalheModal"
      :orcamento="orcamentoSelecionado"
      @close="showDetalheModal = false"
      @refresh="onDetalheRefresh"
      @open-o-s="onAbrirOS"
    />

    <!-- CABEÇALHO -->
    <div class="relative rounded-3xl overflow-hidden mb-8 shadow-xl">
      <div class="absolute inset-0" :style="{ background: 'var(--color-primary-bg, linear-gradient(135deg, #6366f1, #8b5cf6))' }" />
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />
      <div class="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/[0.03] pointer-events-none" />
      <div class="absolute -bottom-20 left-1/4 w-96 h-96 rounded-full bg-white/[0.02] pointer-events-none" />

      <div class="relative px-4 sm:px-8 pt-5 sm:pt-7 pb-5 sm:pb-7">
        <div class="flex flex-wrap items-start justify-between gap-3 sm:gap-6">
          <div class="flex items-center gap-3 sm:gap-5">
            <div class="flex items-center justify-center w-10 sm:w-14 h-10 sm:h-14 rounded-2xl bg-white/[0.12] backdrop-blur-sm border border-white/20 shadow-lg">
              <svg class="w-5 sm:w-7 h-5 sm:h-7 text-white" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-semibold text-white/80 uppercase tracking-widest">Produção</span>
                <span class="w-1 h-1 rounded-full bg-white/40" />
                <span class="text-xs text-white/50 hidden sm:inline">Orçamentos</span>
              </div>
              <h1 class="text-xl sm:text-3xl font-bold text-white tracking-tight leading-none">Orçamentos</h1>
              <p class="text-sm text-gray-300/80 mt-1.5">
                {{ loading ? 'Carregando...' : `${totalOrcamentos} orçamento(s) encontrado(s)` }}
              </p>
            </div>
          </div>

          <!-- Botão Novo Orçamento -->
          <button
            type="button"
            class="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/95 text-sm font-bold shadow-lg transition-all duration-200 hover:scale-[1.02] backdrop-blur-sm"
            :style="{ color: 'var(--color-primary, #6366f1)' }"
            @click="abrirNovoOrcamento"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
            Novo Orçamento
          </button>
        </div>
      </div>
    </div>

    <!-- KPI CARDS -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      <!-- Pendentes -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-shadow">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center" :style="{ background: 'var(--color-primary-5, rgba(99,102,241,0.05))', border: '1px solid var(--color-primary-10, rgba(99,102,241,0.1))' }">
            <svg class="w-5 h-5" :style="{ color: 'var(--color-primary, #6366f1)' }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Pendentes</span>
        </div>
        <p class="text-2xl sm:text-3xl font-black text-gray-800">{{ kpis.pendentes }}</p>
      </div>

      <!-- Vencidos -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-shadow">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-9 h-9 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center">
            <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <span class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Vencidos</span>
        </div>
        <p class="text-2xl sm:text-3xl font-black text-gray-800">{{ kpis.vencidos }}</p>
      </div>

      <!-- Valor Aprovados Mês -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-shadow">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center" :style="{ background: 'var(--color-primary-5, rgba(99,102,241,0.05))', border: '1px solid var(--color-primary-10, rgba(99,102,241,0.1))' }">
            <svg class="w-5 h-5" :style="{ color: 'var(--color-primary, #6366f1)' }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Aprovados (mês)</span>
        </div>
        <p class="text-2xl sm:text-3xl font-black text-gray-800">{{ formatCurrency(kpis.valorAprovadosMes) }}</p>
      </div>

      <!-- Taxa de Conversão -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-shadow">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center" :style="{ background: 'var(--color-primary-5, rgba(99,102,241,0.05))', border: '1px solid var(--color-primary-10, rgba(99,102,241,0.1))' }">
            <svg class="w-5 h-5" :style="{ color: 'var(--color-primary, #6366f1)' }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          </div>
          <span class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Conversão</span>
        </div>
        <p class="text-2xl sm:text-3xl font-black text-gray-800">{{ kpis.taxaConversao.toFixed(1) }}%</p>
      </div>
    </div>

    <!-- FILTROS -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <span class="text-xs font-black text-gray-400 uppercase tracking-[0.15em]">Filtros</span>
        <!-- Toggle Lista / Kanban -->
        <div class="flex rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
          <button type="button" class="px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5"
            :class="viewMode === 'list' ? 'text-white' : 'bg-white text-gray-500 hover:bg-gray-50'"
            :style="viewMode === 'list' ? { background: 'var(--color-primary, #059669)' } : {}"
            @click="viewMode = 'list'">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" /></svg>
            Lista
          </button>
          <button type="button" class="px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5"
            :class="viewMode === 'kanban' ? 'text-white' : 'bg-white text-gray-500 hover:bg-gray-50'"
            :style="viewMode === 'kanban' ? { background: 'var(--color-primary, #059669)' } : {}"
            @click="viewMode = 'kanban'">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z" /></svg>
            Kanban
          </button>
        </div>
      </div>
      <div v-if="viewMode === 'list'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <!-- Data Início -->
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Data Início</label>
          <input v-model="filtroDataInicio" type="date" class="w-full rounded-xl border-2 border-gray-200 px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:border-indigo-400 transition-colors" @change="aplicarFiltros" />
        </div>
        <!-- Data Fim -->
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Data Fim</label>
          <input v-model="filtroDataFim" type="date" class="w-full rounded-xl border-2 border-gray-200 px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:border-indigo-400 transition-colors" @change="aplicarFiltros" />
        </div>
        <!-- Status -->
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Status</label>
          <select v-model="filtroStatus" class="w-full rounded-xl border-2 border-gray-200 px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:border-indigo-400 transition-colors" @change="aplicarFiltros">
            <option value="">Todos</option>
            <option value="rascunho">Rascunho</option>
            <option value="enviado">Enviado</option>
            <option value="aprovado">Aprovado</option>
            <option value="rejeitado">Rejeitado</option>
            <option value="vencido">Vencido</option>
          </select>
        </div>
        <!-- Nome do Cliente -->
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Cliente</label>
          <input v-model="filtroNomeCliente" type="text" placeholder="Buscar por nome (min. 3 caracteres)..." class="w-full rounded-xl border-2 border-gray-200 px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:border-indigo-400 transition-colors placeholder:text-gray-400" @input="debounceClienteFilter" />
          <p v-if="filtroNomeCliente.length > 0 && filtroNomeCliente.length < 3" class="text-xs text-amber-600 font-medium">Digite pelo menos 3 caracteres</p>
        </div>
      </div>
    </div>

    <!-- ═══ MODO LISTA ═══ -->
    <template v-if="viewMode === 'list'">
      <!-- LOADING -->
      <div v-if="loading" class="flex flex-col items-center justify-center gap-4 py-32">
        <span class="inline-block w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <span class="text-sm text-gray-400 font-medium">Carregando orçamentos...</span>
      </div>

      <!-- ERRO -->
      <div v-else-if="error" class="flex items-center gap-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-2xl px-6 py-4">
        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" d="M12 8v4m0 4h.01"/></svg>
        {{ error }}
        <button type="button" class="ml-auto text-xs font-bold text-red-600 hover:text-red-800 underline" @click="fetchOrcamentos">Tentar novamente</button>
      </div>

    <!-- TABELA DE ORÇAMENTOS -->
    <div v-else class="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
      <div class="flex items-center justify-between px-7 py-4 border-b border-gray-100 bg-gray-50/50">
        <span class="text-sm font-semibold text-gray-600">
          <span class="text-indigo-600 font-black">{{ orcamentosFiltrados.length }}</span> orçamento(s)
        </span>
        <span class="text-xs text-gray-400">Ordenado por data (mais recente)</span>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="text-left px-6 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Número</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Cliente</th>
              <th class="text-center px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Itens</th>
              <th class="text-right px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Valor Total</th>
              <th class="text-center px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Criação</th>
              <th class="text-center px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Validade</th>
              <th class="text-center px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Status</th>
              <th class="text-center px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">OS</th>
              <th class="text-center px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-if="orcamentosFiltrados.length === 0">
              <td colspan="9" class="text-center py-20">
                <div class="flex flex-col items-center gap-3">
                  <svg class="w-14 h-14 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.25" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <span class="text-base font-semibold text-gray-400">Nenhum orçamento encontrado</span>
                  <span class="text-sm text-gray-400">Clique em "Novo Orçamento" para começar</span>
                </div>
              </td>
            </tr>
            <tr
              v-for="orc in orcamentosFiltrados"
              :key="orc.id"
              class="hover:bg-indigo-50/30 transition-colors duration-150 cursor-pointer group"
              @click="abrirDetalhe(orc)"
            >
              <td class="px-6 py-4">
                <div class="flex flex-col">
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-indigo-600">{{ orc.numero_orcamento ?? `#${orc.id}` }}</span>
                    <span v-if="orc.pedido_id" class="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-200 text-gray-500">Legado</span>
                  </div>
                  <span v-if="orc.nome_trabalho" class="text-xs text-gray-500 font-medium truncate max-w-[200px]">{{ orc.nome_trabalho }}</span>
                </div>
              </td>
              <td class="px-5 py-4">
                <span class="font-semibold text-gray-800">{{ orc.cliente_nome ?? '—' }}</span>
              </td>
              <td class="px-5 py-4 text-center">
                <span class="text-gray-600 font-medium">{{ orc.quantidade_total_itens ?? '—' }}</span>
              </td>
              <td class="px-5 py-4 text-right">
                <span class="font-semibold text-gray-800">{{ formatCurrency(orc.valor_total) }}</span>
              </td>
              <td class="px-5 py-4 text-center">
                <span class="text-gray-500 text-xs">{{ formatDate(orc.created_at) }}</span>
              </td>
              <td class="px-5 py-4 text-center">
                <span class="text-xs" :class="isVencido(orc) ? 'text-red-500 font-bold' : 'text-gray-500'">{{ formatDate(orc.data_validade) }}</span>
              </td>
              <td class="px-5 py-4 text-center">
                <span
                  class="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full"
                  :class="statusBadgeClass(orc)"
                >
                  {{ statusLabel(orc) }}
                </span>
              </td>
              <td class="px-5 py-4 text-center">
                <OSIndicadorBadge
                  v-if="orc.os_numero"
                  :numero-os="orc.os_numero"
                  :status="orc.os_status"
                  @click.stop
                />
                <span v-else class="text-gray-300">—</span>
              </td>
              <td class="px-5 py-4 text-center">
                <button
                  v-if="isOrcamentoEditavel(orc)"
                  type="button"
                  class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors duration-150"
                  @click.stop="abrirEdicao(orc)"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/></svg>
                  Editar
                </button>
                <span
                  v-else
                  class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-400 bg-gray-100 cursor-not-allowed"
                  :title="'Orçamentos aprovados/rejeitados/vencidos não podem ser editados'"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/></svg>
                  Editar
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- PAGINAÇÃO -->
      <div v-if="totalOrcamentos > pageSize" class="flex items-center justify-between px-7 py-4 border-t border-gray-100 bg-gray-50/50">
        <span class="text-xs text-gray-500">Página {{ currentPage }} de {{ totalPages }}</span>
        <div class="flex gap-2">
          <button type="button" class="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-colors" :disabled="currentPage <= 1" @click="goToPage(currentPage - 1)">Anterior</button>
          <button type="button" class="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-colors" :disabled="currentPage >= totalPages" @click="goToPage(currentPage + 1)">Próxima</button>
        </div>
      </div>
    </div>
    </template>

    <!-- ═══ MODO KANBAN ═══ -->
    <div v-if="viewMode === 'kanban'">
      <KanbanBoard pipeline-tipo="orcamentos" @card-click="onKanbanCardClick" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { createSupabaseClient } from '~/lib/supabase'
import type { StatusOS } from '~/composables/useOrdensServico'
import type { OrcamentoCompleto } from '~/composables/useOrcamentos'
import type { KanbanCard } from '~/composables/useKanban'
import OrcamentoNovoModal from '~/components/OrcamentoNovoModal.vue'
import OrcamentoDetalhesModal from '~/components/OrcamentoDetalhesModal.vue'
import OSIndicadorBadge from '~/components/OSIndicadorBadge.vue'
import KanbanBoard from '~/components/kanban/KanbanBoard.vue'

// ─── Types ───────────────────────────────────────────────────────────────────
interface OrcamentoListItem {
  id: number
  pedido_id: number | null
  numero_orcamento: string | null
  nome_trabalho: string | null
  cliente_nome: string | null
  quantidade_total_itens: number | null
  valor_total: number
  created_at: string
  data_validade: string
  status: string
  os_numero: string | null
  os_status: StatusOS | null
}

interface Cliente {
  id: number
  nome: string
}

interface Material {
  id: number
  nome: string
  preco_m2?: number
}

// ─── Composables ─────────────────────────────────────────────────────────────
const supabase = createSupabaseClient()
const { empresaId, loadEmpresa } = useEmpresa()
const { classificarStatusOrcamentoV2, isStatusEditavel } = useOrcamentos()

// ─── State ───────────────────────────────────────────────────────────────────
const orcamentos = ref<OrcamentoListItem[]>([])
const totalOrcamentos = ref(0)
const loading = ref(true)
const error = ref<string | null>(null)
const currentPage = ref(1)
const pageSize = 20
const viewMode = ref<'list' | 'kanban'>('kanban')

// ─── Modal Novo/Editar Orçamento ─────────────────────────────────────────────
const showNovoModal = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const orcamentoParaEditar = ref<OrcamentoCompleto | undefined>(undefined)
const clientes = ref<Cliente[]>([])
const materiais = ref<Material[]>([])

// ─── Modal Detalhes do Orçamento ─────────────────────────────────────────────
const showDetalheModal = ref(false)
const orcamentoSelecionado = ref<any>(null)

// ─── Filtros ─────────────────────────────────────────────────────────────────
const filtroDataInicio = ref('')
const filtroDataFim = ref('')
const filtroStatus = ref('')
const filtroNomeCliente = ref('')
let debounceTimer: ReturnType<typeof setTimeout> | null = null

// ─── KPIs ────────────────────────────────────────────────────────────────────
const kpis = ref({
  pendentes: 0,
  vencidos: 0,
  valorAprovadosMes: 0,
  taxaConversao: 0,
})

// ─── Computed ────────────────────────────────────────────────────────────────
const orcamentosFiltrados = computed(() => {
  let lista = orcamentos.value

  // Filtro por data de criação
  if (filtroDataInicio.value) {
    const inicio = new Date(filtroDataInicio.value)
    lista = lista.filter(o => new Date(o.created_at) >= inicio)
  }
  if (filtroDataFim.value) {
    const fim = new Date(filtroDataFim.value + 'T23:59:59')
    lista = lista.filter(o => new Date(o.created_at) <= fim)
  }

  // Filtro por status V2
  if (filtroStatus.value) {
    lista = lista.filter(o => {
      const display = classificarStatusOrcamentoV2(
        o.status as any,
        o.data_validade
      )
      return display.status === filtroStatus.value
    })
  }

  // Filtro por nome do cliente
  if (filtroNomeCliente.value.trim().length >= 3) {
    const termo = filtroNomeCliente.value.toLowerCase()
    lista = lista.filter(o => o.cliente_nome?.toLowerCase().includes(termo))
  }

  return lista
})

const totalPages = computed(() => Math.max(1, Math.ceil(totalOrcamentos.value / pageSize)))

// ─── Status helpers (V2) ─────────────────────────────────────────────────────
const statusColorMap: Record<string, string> = {
  rascunho: 'bg-gray-100 text-gray-600',
  enviado: 'bg-blue-50 text-blue-700',
  aprovado: 'bg-green-50 text-green-700',
  rejeitado: 'bg-red-50 text-red-700',
  vencido: 'bg-orange-50 text-orange-700',
}

function statusBadgeClass(orc: OrcamentoListItem): string {
  const display = classificarStatusOrcamentoV2(orc.status as any, orc.data_validade)
  return statusColorMap[display.status] ?? 'bg-gray-100 text-gray-600'
}

function statusLabel(orc: OrcamentoListItem): string {
  const display = classificarStatusOrcamentoV2(orc.status as any, orc.data_validade)
  return display.label
}

function isVencido(orc: OrcamentoListItem): boolean {
  const display = classificarStatusOrcamentoV2(orc.status as any, orc.data_validade)
  return display.status === 'vencido'
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatCurrency(val: number | null | undefined): string {
  if (val == null) return 'R$ 0,00'
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('pt-BR')
}

// ─── Actions ─────────────────────────────────────────────────────────────────
function aplicarFiltros() {
  currentPage.value = 1
  fetchOrcamentos()
}

function debounceClienteFilter() {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    aplicarFiltros()
  }, 400)
}

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  fetchOrcamentos()
}

function abrirNovoOrcamento() {
  modalMode.value = 'create'
  orcamentoParaEditar.value = undefined
  showNovoModal.value = true
}

function fecharModal() {
  showNovoModal.value = false
  modalMode.value = 'create'
  orcamentoParaEditar.value = undefined
}

function onOrcamentoCriado(_data: any) {
  fecharModal()
  currentPage.value = 1
  fetchOrcamentos()
  fetchKPIs()
}

function onOrcamentoAtualizado(data: any) {
  fecharModal()
  // Update the listing item in-place if possible
  const idx = orcamentos.value.findIndex(o => o.id === data.id)
  if (idx !== -1) {
    orcamentos.value[idx] = {
      ...orcamentos.value[idx],
      valor_total: data.valor_total ?? orcamentos.value[idx].valor_total,
    }
  }
  // Refresh for accurate data
  fetchOrcamentos()
  fetchKPIs()
}

function isOrcamentoEditavel(orc: OrcamentoListItem): boolean {
  const display = classificarStatusOrcamentoV2(orc.status as any, orc.data_validade)
  return isStatusEditavel(display.status)
}

async function abrirEdicao(orc: OrcamentoListItem) {
  try {
    const dados = await fetchOrcamentoCompletoParaEdicao(orc.id)
    if (dados) {
      orcamentoParaEditar.value = dados
      modalMode.value = 'edit'
      showNovoModal.value = true
    }
  } catch (e) {
    console.error('[adesivos-orcamentos] Erro ao abrir edição:', e)
  }
}

function abrirDetalhe(orc: OrcamentoListItem) {
  fetchOrcamentoDetalhe(orc.id)
}

function onDetalheRefresh() {
  fetchOrcamentos()
  fetchKPIs()
}

function onAbrirOS() {
  showDetalheModal.value = false
}

async function onKanbanCardClick(card: KanbanCard) {
  // Reuse the existing detalhe modal flow
  await fetchOrcamentoDetalhe(card.id)
}

// ─── Data Fetching ───────────────────────────────────────────────────────────
onMounted(async () => {
  try {
    await loadEmpresa()
    await Promise.all([
      fetchOrcamentos(),
      fetchKPIs(),
      fetchClientes(),
      fetchMateriais(),
    ])
  } catch (e) {
    console.error('[adesivos-orcamentos] Erro ao carregar dados:', e)
    loading.value = false
  }
})

async function fetchOrcamentos() {
  loading.value = true
  error.value = null

  try {
    const from = (currentPage.value - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabase
      .from('orcamentos_adesivo')
      .select(`
        id,
        pedido_id,
        numero_orcamento,
        nome_trabalho,
        status,
        valor_total,
        quantidade_total_itens,
        created_at,
        data_validade,
        clientes(nome, telefone),
        ordens_servico_adesivo(id, numero_os, status)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    // Apply server-side filters when possible
    if (filtroDataInicio.value) {
      query = query.gte('created_at', filtroDataInicio.value)
    }
    if (filtroDataFim.value) {
      query = query.lte('created_at', filtroDataFim.value + 'T23:59:59')
    }
    if (filtroStatus.value && filtroStatus.value !== 'vencido') {
      query = query.eq('status', filtroStatus.value)
    }

    const { data, error: queryError, count } = await query

    if (queryError) {
      error.value = 'Erro ao carregar orçamentos. Tente novamente.'
      console.error('Supabase query error:', queryError)
      return
    }

    totalOrcamentos.value = count ?? 0
    orcamentos.value = (data ?? []).map((row: any) => {
      const os = row.ordens_servico_adesivo?.[0] ?? row.ordens_servico_adesivo ?? null
      return {
        id: row.id,
        pedido_id: row.pedido_id ?? null,
        numero_orcamento: row.numero_orcamento ?? null,
        nome_trabalho: row.nome_trabalho ?? null,
        cliente_nome: row.clientes?.nome ?? null,
        quantidade_total_itens: row.quantidade_total_itens ?? null,
        valor_total: row.valor_total,
        created_at: row.created_at,
        data_validade: row.data_validade,
        status: row.status ?? 'rascunho',
        os_numero: os?.numero_os ?? null,
        os_status: os?.status ?? null,
      }
    })
  } catch (e) {
    error.value = 'Erro inesperado ao carregar orçamentos.'
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function fetchKPIs() {
  try {
    const { data } = await supabase
      .from('orcamentos_adesivo')
      .select('status, valor_total, created_at, data_validade')

    if (!data) return

    const agora = new Date()
    const mesAtual = agora.getMonth()
    const anoAtual = agora.getFullYear()

    let pendentes = 0
    let vencidos = 0
    let valorAprovadosMes = 0
    let totalMes = 0
    let aprovadosMes = 0

    for (const o of data) {
      const validade = new Date(o.data_validade)
      const criacao = new Date(o.created_at)
      const noMes = criacao.getMonth() === mesAtual && criacao.getFullYear() === anoAtual
      const statusDisplay = classificarStatusOrcamentoV2(o.status as any, o.data_validade, agora)

      if (statusDisplay.status === 'enviado') pendentes++
      if (statusDisplay.status === 'vencido') vencidos++

      if (noMes) {
        totalMes++
        if (statusDisplay.status === 'aprovado') {
          aprovadosMes++
          valorAprovadosMes += o.valor_total
        }
      }
    }

    const taxaConversao = totalMes > 0 ? (aprovadosMes / totalMes) * 100 : 0
    kpis.value = { pendentes, vencidos, valorAprovadosMes, taxaConversao }
  } catch (e) {
    console.error('Erro ao calcular KPIs:', e)
  }
}

async function fetchClientes() {
  try {
    const { data } = await supabase
      .from('clientes')
      .select('id, nome')
      .order('nome', { ascending: true })

    clientes.value = data ?? []
  } catch (e) {
    console.error('Erro ao buscar clientes:', e)
  }
}

async function fetchMateriais() {
  try {
    const { data } = await supabase
      .from('materiais_adesivo')
      .select('id, nome, preco_m2')
      .order('nome', { ascending: true })

    materiais.value = data ?? []
  } catch (e) {
    console.error('Erro ao buscar materiais:', e)
  }
}

async function fetchOrcamentoDetalhe(id: number) {
  try {
    const { data, error: queryError } = await supabase
      .from('orcamentos_adesivo')
      .select(`
        id,
        pedido_id,
        numero_orcamento,
        cliente_id,
        status,
        valor_total,
        valor_mao_obra_global,
        desconto_volume_percentual,
        desconto_percentual,
        desconto_valor,
        quantidade_total_itens,
        created_at,
        data_validade,
        token_aprovacao,
        prazo_estimado_dias,
        clientes(nome, telefone),
        ordens_servico_adesivo(id, numero_os, status)
      `)
      .eq('id', id)
      .single()

    if (queryError || !data) {
      console.error('Erro ao buscar detalhes do orçamento:', queryError)
      return
    }

    const os = Array.isArray(data.ordens_servico_adesivo)
      ? data.ordens_servico_adesivo[0]
      : data.ordens_servico_adesivo

    orcamentoSelecionado.value = {
      id: data.id,
      pedido_id: data.pedido_id ?? null,
      numero_orcamento: data.numero_orcamento ?? null,
      cliente_id: data.cliente_id ?? null,
      cliente_nome: (data as any).clientes?.nome ?? null,
      cliente_telefone: (data as any).clientes?.telefone ?? null,
      quantidade_total_itens: data.quantidade_total_itens ?? null,
      valor_total: data.valor_total,
      valor_mao_obra_global: data.valor_mao_obra_global ?? 0,
      desconto_volume_percentual: data.desconto_volume_percentual ?? 0,
      desconto_percentual: data.desconto_percentual ?? 0,
      desconto_valor: data.desconto_valor ?? 0,
      created_at: data.created_at,
      data_validade: data.data_validade,
      status: data.status ?? 'rascunho',
      token_aprovacao: data.token_aprovacao ?? null,
      prazo_estimado_dias: data.prazo_estimado_dias ?? null,
      os_numero: os?.numero_os ?? null,
      os_status: os?.status ?? null,
    }

    showDetalheModal.value = true
  } catch (e) {
    console.error('Erro inesperado ao buscar detalhes:', e)
  }
}

async function fetchOrcamentoCompletoParaEdicao(id: number): Promise<OrcamentoCompleto | null> {
  try {
    const { data, error: queryError } = await supabase
      .from('orcamentos_adesivo')
      .select(`
        id,
        numero_orcamento,
        cliente_id,
        status,
        valor_total,
        valor_mao_obra_global,
        desconto_percentual,
        desconto_valor,
        validade_dias,
        prazo_estimado_dias,
        data_validade,
        token_aprovacao,
        endereco_instalacao,
        nome_trabalho,
        itens_orcamento(
          id,
          material_id,
          descricao,
          largura_cm,
          altura_cm,
          quantidade,
          modalidade_preco,
          preco_unitario,
          preco_m2,
          area_m2,
          valor_item,
          foto_arte_url,
          foto_local_url,
          arquivo_url,
          materiais_adesivo(nome)
        )
      `)
      .eq('id', id)
      .single()

    if (queryError || !data) {
      console.error('Erro ao buscar orçamento completo para edição:', queryError)
      return null
    }

    const itens = ((data as any).itens_orcamento ?? []).map((item: any) => ({
      id: item.id,
      descricao: item.descricao ?? '',
      material_id: item.material_id,
      material_nome: item.materiais_adesivo?.nome ?? '',
      largura_cm: item.largura_cm,
      altura_cm: item.altura_cm,
      quantidade: item.quantidade,
      modalidade_preco: item.modalidade_preco ?? 'm2',
      preco_unitario: item.preco_unitario ?? undefined,
      preco_m2: item.preco_m2 ?? 0,
      area_m2: item.area_m2 ?? 0,
      valor_item: item.valor_item ?? 0,
      foto_arte_url: item.foto_arte_url ?? null,
      foto_local_url: item.foto_local_url ?? null,
      arquivo_url: item.arquivo_url ?? null,
    }))

    return {
      id: data.id,
      numero_orcamento: data.numero_orcamento ?? '',
      status: data.status as OrcamentoCompleto['status'],
      cliente_id: data.cliente_id,
      validade_dias: data.validade_dias ?? 30,
      prazo_estimado_dias: data.prazo_estimado_dias ?? null,
      valor_mao_obra_global: data.valor_mao_obra_global ?? 0,
      desconto_percentual: data.desconto_percentual ?? 0,
      desconto_valor: data.desconto_valor ?? 0,
      valor_total: data.valor_total ?? 0,
      token_aprovacao: data.token_aprovacao ?? null,
      endereco_instalacao: (data as any).endereco_instalacao ?? null,
      nome_trabalho: (data as any).nome_trabalho ?? null,
      itens,
    }
  } catch (e) {
    console.error('Erro inesperado ao buscar orçamento para edição:', e)
    return null
  }
}
</script>
