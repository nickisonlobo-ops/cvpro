<template>
  <div class="min-h-full bg-gray-50/60 p-3 sm:p-8">

    <!-- �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� CABE�?ALHO �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� -->
    <div class="page-header relative rounded-3xl overflow-hidden mb-8 shadow-xl">
      <div class="page-header-overlay absolute inset-0" />
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />
      <div class="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/[0.03] pointer-events-none" />
      <div class="absolute -bottom-20 left-1/4 w-96 h-96 rounded-full bg-white/[0.02] pointer-events-none" />

      <div class="relative px-4 sm:px-8 pt-5 sm:pt-7 pb-5 sm:pb-7">
        <div class="flex flex-wrap items-start justify-between gap-3 sm:gap-6">
          <div class="flex items-center gap-3 sm:gap-5">
            <div class="flex items-center justify-center w-10 sm:w-14 h-10 sm:h-14 rounded-2xl bg-white/[0.12] backdrop-blur-sm border border-white/20 shadow-lg">
              <svg class="w-5 sm:w-7 h-5 sm:h-7 text-white" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 4.5h.008v.008h-.008V13.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/></svg>
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-semibold text-white/80 uppercase tracking-widest">Financeiro</span>
                <span class="w-1 h-1 rounded-full bg-white/40" />
                <span class="text-xs text-white/50 hidden sm:inline">AutoFlow</span>
              </div>
              <h1 class="text-xl sm:text-3xl font-bold text-white tracking-tight leading-none">Vendas</h1>
              <p class="text-sm text-gray-300/80 mt-1.5">
                {{ loading ? 'Carregando...' : `${vendasFiltradas.length} de ${vendas.length} venda(s) exibida(s)` }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <button
              type="button"
              class="inline-flex items-center gap-2 text-sm font-semibold px-3 sm:px-5 py-2.5 rounded-xl transition-all duration-200"
              :class="filtroAberto
                ? 'bg-white/20 text-white shadow-lg scale-[1.02]'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/15 backdrop-blur-sm'"
              @click="filtroAberto = !filtroAberto"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/></svg>
              <span class="hidden sm:inline">Filtros</span>
              <span v-if="filtrosAtivos > 0" class="inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-gray-950 text-amber-400 text-xs font-black">{{ filtrosAtivos }}</span>
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-2 text-sm font-semibold px-3 sm:px-5 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 border border-white/15 backdrop-blur-sm transition-all duration-200 hover:scale-[1.02]"
              title="Exportar relatório em PDF"
              @click="exportarPDF"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>
              <span class="hidden sm:inline">Exportar PDF</span>
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-2 text-sm font-bold px-3 sm:px-5 py-2.5 rounded-xl bg-amber-500 text-gray-950 hover:bg-amber-400 shadow-lg shadow-amber-900/30 transition-all duration-200 hover:scale-[1.02]"
              @click="abrirAdicionar"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
              <span class="hidden sm:inline">Nova Venda</span>
            </button>
          </div>
        </div>

        <div class="h-px bg-white/10 my-4 sm:my-6" />

        <!-- Stats -->
        <div v-if="!loading" class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="flex flex-col gap-1 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/10 hover:bg-white/15 transition-colors">
            <span class="text-xs font-semibold text-gray-400 uppercase tracking-widest">Total Vendas</span>
            <span class="text-xl font-black text-white leading-tight">{{ vendas.length }}</span>
            <span class="text-xs text-gray-500">registros</span>
          </div>
          <div class="flex flex-col gap-1 bg-green-400/10 rounded-2xl px-5 py-4 border border-green-300/20 hover:bg-green-400/15 transition-colors">
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-amber-400" />
              <span class="text-xs font-semibold text-amber-300 uppercase tracking-widest">Faturamento</span>
            </div>
            <span class="text-xl font-black text-amber-200 leading-tight truncate">{{ formatCurrency(faturamentoTotal) }}</span>
            <span class="text-xs text-amber-300/50">total acumulado</span>
          </div>
          <div class="flex flex-col gap-1 bg-white/[0.07] rounded-2xl px-5 py-4 border border-white/10 hover:bg-white/12 transition-colors">
            <span class="text-xs font-semibold text-gray-400 uppercase tracking-widest">Ticket Médio</span>
            <span class="text-xl font-black text-white leading-tight truncate">{{ formatCurrency(ticketMedio) }}</span>
            <span class="text-xs text-gray-500">por venda</span>
          </div>
          <div class="flex flex-col gap-1 bg-white/[0.07] rounded-2xl px-5 py-4 border border-white/10 hover:bg-white/12 transition-colors">
            <span class="text-xs font-semibold text-gray-400 uppercase tracking-widest">Este Mês</span>
            <span class="text-xl font-black text-white leading-tight">{{ vendasMes }}</span>
            <span class="text-xs text-gray-500">venda(s)</span>
          </div>
        </div>
      </div>
    </div>

    <!-- �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� FILTRO �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� -->
    <Transition name="slide-fade">
      <div v-show="filtroAberto" class="bg-white rounded-3xl border border-gray-100 shadow-md mb-6 overflow-hidden">
        <div class="flex items-center justify-between px-7 py-4 border-b border-gray-100 bg-gray-50/70">
          <div class="flex items-center gap-2.5">
            <svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/></svg>
            <span class="text-sm font-bold text-gray-700">Filtros</span>
          </div>
          <button v-if="filtrosAtivos > 0" type="button" class="text-xs font-semibold text-orange-500 hover:text-orange-700 hover:underline" @click="limparFiltros">
            Limpar todos
          </button>
        </div>
        <div class="p-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div class="sm:col-span-2 flex flex-col gap-1.5">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Busca</label>
            <div class="relative">
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="m21 21-4.35-4.35"/></svg>
              <input v-model="filtros.busca" type="text" placeholder="Nome do cliente ou produto..." class="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-shadow" />
            </div>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Forma de Pagto.</label>
            <select v-model="filtros.formaPagamento" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
              <option value="">Todas</option>
              <option v-for="fp in formasPagamento" :key="fp" :value="fp">{{ fp }}</option>
            </select>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Status</label>
            <div class="flex gap-2">
              <button
                v-for="op in [{ label: 'Todos', value: '' }, { label: 'Finalizada', value: 'finalizada' }, { label: 'Pendente', value: 'pendente' }, { label: 'Cancelada', value: 'cancelada' }]"
                :key="op.value"
                type="button"
                class="flex-1 text-xs font-bold py-2 rounded-xl border transition-colors"
                :class="filtros.status === op.value
                  ? 'bg-orange-500 border-orange-500 text-white'
                  : 'border-gray-200 text-gray-500 hover:border-orange-400 hover:text-orange-700 bg-white'"
                @click="filtros.status = op.value"
              >
                {{ op.label }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� LOADING �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� -->
    <div v-if="loading" class="flex flex-col items-center justify-center gap-4 py-32">
      <span class="inline-block w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      <span class="text-sm text-gray-400 font-medium">Carregando vendas...</span>
    </div>

    <!-- �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� ERRO �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� -->
    <div v-else-if="error" class="flex items-center gap-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-2xl px-6 py-4">
      <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" d="M12 8v4m0 4h.01"/></svg>
      {{ error }}
    </div>

    <!-- �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� TABELA �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� -->
    <div v-else class="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
      <div class="flex items-center justify-between px-7 py-4 border-b border-gray-100 bg-gray-50/50">
        <span class="text-sm font-semibold text-gray-600">
          <span class="text-orange-600 font-black">{{ vendasFiltradas.length }}</span>
          resultado(s)
          <span v-if="filtrosAtivos > 0" class="text-gray-400 font-normal"> �?" filtros aplicados</span>
        </span>
        <span class="text-xs text-gray-400">Ordenado por data</span>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="text-left px-6 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest w-12">#</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Cliente</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Item</th>
              <th class="text-right px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Subtotal</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Pagamento / Status</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest whitespace-nowrap">Data</th>
              <th class="px-6 py-4 text-right text-xs font-extrabold text-gray-400 uppercase tracking-widest sm:sticky sm:right-0 bg-gray-50 w-24">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-if="vendasFiltradas.length === 0">
              <td colspan="7" class="text-center py-20">
                <div class="flex flex-col items-center gap-3">
                  <svg class="w-14 h-14 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.25" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 4.5h.008v.008h-.008V13.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/></svg>
                  <span class="text-base font-semibold text-gray-400">Nenhuma venda encontrada</span>
                  <span v-if="filtrosAtivos > 0" class="text-sm text-gray-400">Tente ajustar os filtros</span>
                </div>
              </td>
            </tr>
            <tr
              v-for="venda in vendasFiltradas"
              :key="venda.id"
              class="hover:bg-orange-50/30 transition-colors duration-150 group"
            >
              <!-- # -->
              <td class="px-6 py-4">
                <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-700 font-black text-xs">
                  {{ venda.id }}
                </span>
              </td>

              <!-- Cliente -->
              <td class="px-5 py-4">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-text font-black text-xs shrink-0 shadow-sm select-none">
                    {{ (venda.clientes?.nome ?? '?')[0]?.toUpperCase() }}
                  </div>
                  <span class="font-semibold text-gray-800 max-w-[160px] block truncate whitespace-nowrap">{{ venda.clientes?.nome ?? '�?"' }}</span>
                </div>
              </td>

              <!-- Veículo / Itens da venda -->
              <td class="px-5 py-4">
                <div class="flex flex-col gap-1">
                  <!-- Veículo vinculado -->
                  <template v-if="venda.veiculos">
                    <div class="flex items-center gap-1.5 min-w-0">
                      <svg class="w-3.5 h-3.5 text-amber-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/></svg>
                      <span class="font-bold text-gray-800 max-w-[180px] truncate text-sm">{{ venda.veiculos.marca }} {{ venda.veiculos.modelo }}</span>
                    </div>
                    <span class="text-xs text-gray-400 pl-5">{{ anoVeiculoLabel(venda.veiculos) }}</span>
                    <span v-if="venda.vendas_itens && venda.vendas_itens.length > 0" class="text-[11px] text-orange-500 font-semibold pl-5">+{{ venda.vendas_itens.length }} adicional(is)</span>
                  </template>
                  <!-- Apenas produtos -->
                  <template v-else-if="venda.vendas_itens && venda.vendas_itens.length > 0">
                    <div v-for="item in venda.vendas_itens.slice(0, 2)" :key="item.produto_id" class="flex items-center gap-1.5 min-w-0">
                      <span class="font-semibold text-gray-800 max-w-[160px] truncate text-sm">{{ item.produtos_casa_racao?.nome ?? '—' }}</span>
                      <span class="text-xs text-gray-400 whitespace-nowrap shrink-0">{{ item.quantidade }}x {{ formatCurrency(item.preco_unitario) }}</span>
                    </div>
                    <span v-if="venda.vendas_itens.length > 2" class="text-xs text-orange-500 font-semibold">+{{ venda.vendas_itens.length - 2 }} item(ns)</span>
                  </template>
                  <span v-else class="text-sm text-gray-400">—</span>
                </div>
              </td>

              <!-- Subtotal -->
              <td class="px-5 py-4 text-right">
                <div class="flex flex-col items-end gap-0.5">
                  <span class="text-base font-black text-gray-800 whitespace-nowrap">
                    {{ formatCurrency(vendaTotalValor(venda)) }}
                  </span>
                  <span class="text-[11px] text-gray-400 font-medium">
                    {{ venda.veiculos ? '1 veículo' : '' }}{{ (venda.veiculos && venda.vendas_itens?.length) ? ' + ' : '' }}{{ venda.vendas_itens?.length ? venda.vendas_itens.length + ' produto(s)' : '' }}
                  </span>
                </div>
              </td>

              <!-- Pagamento / Status -->
              <td class="px-5 py-4">
                <div class="flex flex-col gap-1.5">
                  <span :class="['inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full w-fit', statusBadgeClass(venda.status)]">
                    <span :class="['w-1.5 h-1.5 rounded-full', statusDotClass(venda.status)]" />
                    {{ statusLabel(venda.status) }}
                  </span>
                  <span v-if="venda.forma_pagamento" class="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500 whitespace-nowrap">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 21z"/></svg>
                    {{ venda.forma_pagamento }}
                  </span>
                  <span v-else class="text-[11px] text-gray-300">Sem pagamento</span>
                </div>
              </td>

              <!-- Data -->
              <td class="px-5 py-4 text-xs text-gray-500 font-medium whitespace-nowrap">{{ formatDate(venda.data_venda) }}</td>

              <!-- Ações -->
              <td class="px-6 py-4 text-right sm:sticky sm:right-0 group-hover:bg-orange-50/30 transition-colors">
                <div class="flex items-center justify-end gap-1">
                  <button v-if="isAdminOrGerente" type="button" class="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-orange-500 hover:bg-orange-100 transition-colors" title="Editar" @click="editVenda(venda)">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 7.125L18 8.625"/></svg>
                  </button>
                  <button v-if="isAdmin" type="button" class="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-red-400 hover:bg-red-50 transition-colors" title="Excluir" @click="confirmarExclusao(venda)">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a1 1 0 01-1-1V5a1 1 0 011-1h8a1 1 0 011 1v1a1 1 0 01-1 1H9z"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL ADICIONAR / EDITAR -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="editando !== null || adicionando"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4 py-4"
          @click.self="fecharModal"
        >
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden" style="max-height:92vh">

            <!-- Header escuro -->
            <div class="relative bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 px-8 py-6 shrink-0">
              <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.12),transparent_60%)] pointer-events-none" />
              <div class="relative flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shadow-lg">
                    <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185z"/></svg>
                  </div>
                  <div>
                    <p class="text-[10px] font-bold text-amber-400 uppercase tracking-[0.2em] mb-0.5">{{ adicionando ? 'Registrar' : 'Editar' }}</p>
                    <h2 class="text-xl font-black text-white leading-none">{{ adicionando ? 'Nova Venda' : 'Editar Venda' }}</h2>
                  </div>
                </div>
                <button type="button" class="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors" @click="fecharModal">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </div>

            <form class="flex flex-col gap-6 px-8 py-7 overflow-y-auto" @submit.prevent="adicionando ? salvarAdicao() : salvarEdicao()">

              <!-- Cliente -->
              <div class="flex flex-col gap-2">
                <div class="flex items-center justify-between">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Cliente *</label>
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-800 hover:underline transition-colors"
                    @click="abrirNovoCliente"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
                    Novo cliente
                  </button>
                </div>
                <select
                  v-model="form.cliente_id"
                  required
                  class="w-full rounded-xl border-2 px-4 py-3 text-sm font-semibold text-gray-800 bg-gray-50 focus:outline-none focus:ring-0 transition-all"
                  :class="formErrors.cliente_id ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-amber-400'"
                >
                  <option :value="null">Selecione o cliente...</option>
                  <option v-for="c in clientesOpcoes" :key="c.id" :value="c.id">{{ c.nome }}</option>
                </select>
                <p v-if="formErrors.cliente_id" class="text-xs text-red-500 font-semibold flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
                  {{ formErrors.cliente_id }}
                </p>
              </div>

              <!-- Veículo do estoque -->
              <div class="flex flex-col gap-2">
                <div class="flex items-center justify-between">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Veículo do Estoque *</label>
                  <span class="text-xs font-semibold text-gray-400">{{ veiculosParaForm.length }} disponível(is)</span>
                </div>

                <!-- Preview do veículo selecionado -->
                <Transition name="slide-fade">
                  <div v-if="veiculoSelecionado" class="flex flex-col gap-2">
                    <div class="flex items-center gap-3 rounded-2xl border-2 border-amber-400 bg-amber-50 p-2.5 shadow-md">
                      <div class="w-20 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        <img
                          v-if="veiculoSelecionado.fotos?.length"
                          :src="veiculoSelecionado.fotos[0]"
                          :alt="`${veiculoSelecionado.marca} ${veiculoSelecionado.modelo}`"
                          class="w-full h-full object-cover"
                        />
                        <div v-else class="w-full h-full flex items-center justify-center">
                          <svg class="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/></svg>
                        </div>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="font-black text-gray-900 leading-tight truncate">{{ veiculoSelecionado.marca }} {{ veiculoSelecionado.modelo }}</p>
                        <p class="text-xs text-gray-500 mt-0.5">
                          <span v-if="anoVeiculoLabel(veiculoSelecionado)">{{ anoVeiculoLabel(veiculoSelecionado) }}</span>
                          <span v-if="veiculoSelecionado.km != null"> · {{ veiculoSelecionado.km.toLocaleString('pt-BR') }} km</span>
                          <span v-if="veiculoSelecionado.placa"> · {{ veiculoSelecionado.placa }}</span>
                        </p>
                        <p class="text-sm font-black text-amber-700 mt-0.5">{{ formatCurrency(veiculoSelecionado.preco_venda) }}</p>
                      </div>
                      <button
                        type="button"
                        class="shrink-0 text-xs font-bold text-gray-400 hover:text-amber-600 px-2 py-1 rounded-lg hover:bg-amber-100 transition-colors"
                        @click="seletorVeiculoAberto = true"
                      >Trocar</button>
                    </div>

                    <!-- Preço negociado -->
                    <div class="flex items-center gap-4 bg-gradient-to-r from-gray-950 to-gray-900 rounded-2xl px-5 py-4 border border-amber-500/25 shadow-lg">
                      <div class="flex flex-col gap-1 flex-1 min-w-0">
                        <span class="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em]">Preço negociado</span>
                        <div class="flex items-baseline gap-1.5">
                          <span class="text-sm font-bold text-gray-500">R$</span>
                          <input
                            type="text"
                            inputmode="numeric"
                            :value="precoVeiculoDisplay"
                            placeholder="0,00"
                            class="flex-1 bg-transparent text-2xl font-black text-white placeholder:text-gray-700 focus:outline-none min-w-0"
                            @input="onPrecoVeiculoInput"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Transition>

                <!-- Botão para abrir o seletor (quando nenhum veículo selecionado) -->
                <button
                  v-if="!veiculoSelecionado"
                  type="button"
                  class="w-full flex items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed py-7 transition-all duration-150"
                  :class="formErrors.veiculo ? 'border-red-300 bg-red-50 text-red-400 hover:border-red-400' : 'border-gray-200 text-gray-400 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50/30'"
                  @click="seletorVeiculoAberto = true"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/></svg>
                  <span class="text-sm font-semibold">Selecionar veículo do estoque</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
                </button>

                <p v-if="formErrors.veiculo" class="text-xs text-red-500 font-semibold flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
                  {{ formErrors.veiculo }}
                </p>
              </div>

              <!-- Forma de pagamento (chips) + Status -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">

                <!-- Pagamento -->
                <div class="flex flex-col gap-2.5">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Forma de Pagamento</label>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="fp in formasPagamento"
                      :key="fp"
                      type="button"
                      class="text-xs font-bold px-3 py-2 rounded-xl border-2 transition-all"
                      :class="form.forma_pagamento === fp
                        ? 'bg-gray-900 border-gray-900 text-white shadow-md'
                        : 'bg-white border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700'"
                      @click="form.forma_pagamento = form.forma_pagamento === fp ? '' : fp"
                    >
                      {{ fp }}
                    </button>
                  </div>
                </div>

                <!-- Status -->
                <div class="flex flex-col gap-2.5">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Status</label>
                  <div class="flex flex-col gap-2">
                    <button
                      v-for="op in statusOpcoes"
                      :key="op.value"
                      type="button"
                      class="flex items-center gap-2.5 text-sm font-bold py-2.5 px-4 rounded-xl border-2 transition-all text-left"
                      :class="form.status === op.value ? op.activeClass : 'bg-white border-gray-100 text-gray-400 hover:border-gray-300 hover:text-gray-600'"
                      @click="form.status = op.value"
                    >
                      <span class="w-2 h-2 rounded-full shrink-0" :class="op.dotClass" />
                      {{ op.label }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Data + Observação -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="flex flex-col gap-2">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Data da Venda</label>
                  <input
                    v-model="form.data_venda"
                    type="datetime-local"
                    class="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <div class="flex flex-col gap-2">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Observação</label>
                  <textarea
                    v-model="form.observacao"
                    rows="3"
                    placeholder="Informações adicionais..."
                    class="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 bg-gray-50 focus:outline-none focus:border-amber-400 transition-colors resize-none"
                  />
                </div>
              </div>

              <!-- Banner total -->
              <Transition name="slide-fade">
                <div
                  v-if="form.veiculo_id"
                  class="flex items-center justify-between bg-gradient-to-r from-amber-500 to-amber-400 rounded-2xl px-6 py-4 shadow-lg shadow-amber-200/60"
                >
                  <div>
                    <p class="text-[10px] font-black text-amber-950/60 uppercase tracking-[0.2em]">Total da venda</p>
                    <p class="text-2xl font-black text-gray-950 leading-tight">{{ formatCurrency(form.preco_veiculo) }}</p>
                  </div>
                  <div class="w-12 h-12 rounded-2xl bg-amber-950/10 flex items-center justify-center">
                    <svg class="w-6 h-6 text-amber-950/50" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185z"/></svg>
                  </div>
                </div>
              </Transition>

              <p v-if="modalError" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{{ modalError }}</p>

              <div class="flex gap-3 pb-1">
                <button
                  type="button"
                  class="flex-1 py-3.5 rounded-xl border-2 border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-colors text-sm font-bold"
                  @click="fecharModal"
                >
                  Cancelar
                </button>
                <AppButton variant="primary" size="md" type="submit" :loading="saving" class="flex-1">
                  {{ adicionando ? 'Registrar Venda' : 'Salvar alterações' }}
                </AppButton>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
    <!-- �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� MODAL EXCLUIR �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� -->
    <!-- ── MODAL SELETOR DE VEÍCULO ── -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="seletorVeiculoAberto"
          class="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-md px-0 sm:px-4"
          @click.self="seletorVeiculoAberto = false"
        >
          <div class="relative bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92dvh] flex flex-col overflow-hidden">

            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
              <div>
                <p class="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">Estoque</p>
                <h3 class="text-lg font-black text-gray-900 leading-tight">Selecionar Veículo</h3>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-semibold text-gray-400">{{ veiculosParaFormFiltrados.length }} veículo(s)</span>
                <button
                  type="button"
                  class="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  @click="seletorVeiculoAberto = false"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </div>

            <!-- Busca -->
            <div class="px-6 pt-4 pb-3 shrink-0">
              <div class="relative">
                <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="m21 21-4.35-4.35"/></svg>
                <input
                  v-model="veiculoBusca"
                  type="text"
                  placeholder="Buscar por marca, modelo ou placa..."
                  class="w-full rounded-xl border-2 border-gray-200 pl-10 pr-4 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
              <p class="text-xs text-gray-400 mt-2 leading-relaxed">Toque no card para selecionar · Toque novamente para remover a seleção</p>
            </div>

            <!-- Grade estilo catálogo -->
            <div class="overflow-y-auto flex-1 px-6 pb-6">
              <div v-if="veiculosParaFormFiltrados.length === 0" class="flex flex-col items-center justify-center gap-3 py-16">
                <svg class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.25" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/></svg>
                <span class="text-sm text-gray-400 font-semibold">Nenhum veículo encontrado</span>
                <button v-if="veiculoBusca" type="button" class="text-xs text-amber-600 font-semibold hover:underline" @click="veiculoBusca = ''">Limpar busca</button>
              </div>

              <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <button
                  v-for="v in veiculosParaFormFiltrados"
                  :key="v.id"
                  type="button"
                  class="group flex flex-col rounded-2xl border-2 overflow-hidden text-left transition-all duration-200 bg-white"
                  :class="form.veiculo_id === v.id
                    ? 'border-amber-400 shadow-lg shadow-amber-100/80 ring-2 ring-amber-400/20'
                    : 'border-gray-100 hover:border-amber-300 hover:shadow-md'"
                  @click="selecionarVeiculo(v.id)"
                >
                  <!-- Foto -->
                  <div class="relative h-28 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden shrink-0">
                    <img
                      v-if="v.fotos?.length"
                      :src="v.fotos[0]"
                      :alt="`${v.marca} ${v.modelo}`"
                      class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div v-else class="absolute inset-0 flex items-center justify-center">
                      <svg class="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/></svg>
                    </div>
                    <!-- Badge selecionado -->
                    <Transition name="fade">
                      <div v-if="form.veiculo_id === v.id" class="absolute inset-0 bg-amber-400/20 flex items-center justify-center">
                        <span class="w-9 h-9 rounded-full bg-amber-500 shadow-lg flex items-center justify-center">
                          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd"/></svg>
                        </span>
                      </div>
                    </Transition>
                    <!-- Contador de fotos -->
                    <span v-if="v.fotos && v.fotos.length > 1" class="absolute bottom-2 right-2 flex items-center gap-1 text-[10px] font-bold bg-black/60 text-white px-1.5 py-0.5 rounded-full">
                      <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/></svg>
                      {{ v.fotos.length }}
                    </span>
                  </div>

                  <!-- Detalhes -->
                  <div class="p-3 flex flex-col gap-0.5 flex-1">
                    <p class="text-sm font-black text-gray-900 leading-tight truncate group-hover:text-amber-700 transition-colors">{{ v.marca }} {{ v.modelo }}</p>
                    <p class="text-[11px] text-gray-400 truncate">
                      {{ anoVeiculoLabel(v) }}<span v-if="v.km != null"> · {{ v.km.toLocaleString('pt-BR') }} km</span>
                    </p>
                    <p v-if="v.placa" class="text-[10px] font-mono font-black text-gray-500 uppercase tracking-wider">{{ v.placa }}</p>
                    <div class="mt-auto pt-2 border-t border-gray-50 flex items-end justify-between">
                      <div>
                        <p class="text-[9px] text-gray-400 uppercase tracking-widest font-semibold">Preço</p>
                        <p class="text-sm font-black" :class="form.veiculo_id === v.id ? 'text-amber-700' : 'text-gray-900'">{{ formatCurrency(v.preco_venda) }}</p>
                      </div>
                      <span v-if="form.veiculo_id !== v.id" class="text-[10px] font-bold text-amber-500 group-hover:text-amber-600 transition-colors">Selecionar</span>
                      <span v-else class="text-[10px] font-bold text-red-400">Remover</span>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
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
              <h2 class="text-xl font-bold text-gray-800">Excluir venda?</h2>
              <p class="text-sm text-gray-500 mt-2 leading-relaxed">
                Venda <strong class="text-gray-800">#{{ excluindo.id }}</strong> de
                <strong class="text-gray-800">{{ excluindo.clientes?.nome }}</strong>.<br />
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
    <!-- ═══════════════════════════════ MODAL RÁPIDO NOVO CLIENTE ═══════════════════════════════ -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="adicionandoCliente"
          class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-md px-4"
          @click.self="adicionandoCliente = false"
        >
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div class="flex items-center justify-between px-7 py-5 border-b border-white/10" :style="{ background: 'var(--color-primary-bg, linear-gradient(135deg, #111827, #1f2937))' }">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"/></svg>
                </div>
                <div>
                  <h2 class="text-base font-bold text-white">Novo Cliente</h2>
                  <p class="text-xs text-white/60">Cadastro rápido</p>
                </div>
              </div>
              <button type="button" class="w-8 h-8 flex items-center justify-center rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors" @click="adicionandoCliente = false">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <form class="flex flex-col gap-4 px-7 py-6" @submit.prevent="salvarNovoCliente">
              <AppInput v-model="formCliente.nome" label="Nome *" placeholder="Nome completo" :error="formCliente.nomeError" required />
              <AppInput v-model="formCliente.telefone" label="Telefone" placeholder="(00) 00000-0000" />
              <AppInput v-model="formCliente.email" label="E-mail" type="email" placeholder="cliente@email.com" />

              <p v-if="clienteModalError" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{{ clienteModalError }}</p>

              <div class="flex gap-3 pt-1">
                <button type="button" class="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors text-sm font-semibold" @click="adicionandoCliente = false">
                  Cancelar
                </button>
                <AppButton variant="primary" size="md" type="submit" :loading="savingCliente" class="flex-1">
                  Adicionar
                </AppButton>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { createSupabaseClient } from '~/lib/supabase'
import { useAdmin } from '~/composables/useAdmin'
import { useEmpresa } from '~/composables/useEmpresa'
import AppButton from '~/components/AppButton.vue'
import AppInput from '~/components/AppInput.vue'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface ClienteOpcao  { id: number; nome: string }
interface VeiculoOpcao  { id: number; marca: string; modelo: string; ano_fabricacao: number | null; ano_modelo: number | null; preco_venda: number; km: number | null; placa: string | null; fotos: string[] | null }
interface ItemVenda { produto_id: number; quantidade: number; preco_unitario: number; valor_total?: number | null; produtos_casa_racao?: { nome: string } | null }
interface Venda {
  id: number
  cliente_id: number
  veiculo_id: number | null
  preco_veiculo: number | null
  forma_pagamento: string | null
  status: string | null
  observacao: string | null
  data_venda: string | null
  created_at: string | null
  clientes: { nome: string } | null
  veiculos: { marca: string; modelo: string; ano_fabricacao: number | null; ano_modelo: number | null } | null
  vendas_itens: ItemVenda[]
}

const supabase = createSupabaseClient()
const { empresaId, loadEmpresa } = useEmpresa()
const { isAdmin, isAdminOrGerente } = useAdmin()

const vendas             = ref<Venda[]>([])
const clientesOpcoes     = ref<ClienteOpcao[]>([])
const veiculosOpcoes     = ref<VeiculoOpcao[]>([])
const veiculoEdicaoExtra = ref<VeiculoOpcao | null>(null)
const loading            = ref(true)
const error              = ref<string | null>(null)

const editando    = ref<Venda | null>(null)
const adicionando = ref(false)
const saving      = ref(false)
const modalError  = ref<string | null>(null)

const excluindo   = ref<Venda | null>(null)
const deleting    = ref(false)
const deleteError = ref<string | null>(null)
const seletorVeiculoAberto = ref(false)

// ── Novo cliente rápido ───────────────────────────────────────────────────────
const adicionandoCliente = ref(false)
const savingCliente      = ref(false)
const clienteModalError  = ref<string | null>(null)
const formCliente = reactive({ nome: '', telefone: '', email: '', nomeError: '' })

function abrirNovoCliente() {
  formCliente.nome = ''; formCliente.telefone = ''; formCliente.email = ''
  formCliente.nomeError = ''; clienteModalError.value = null
  adicionandoCliente.value = true
}

async function salvarNovoCliente() {
  formCliente.nomeError = ''
  if (!formCliente.nome.trim()) { formCliente.nomeError = 'O nome é obrigatório.'; return }
  savingCliente.value = true; clienteModalError.value = null

  const { data, error: insertError } = await supabase
    .from('clientes')
    .insert({
      nome:      formCliente.nome.trim(),
      telefone:  formCliente.telefone.trim() || null,
      email:     formCliente.email.trim() || null,
      ativo:     true,
      empresa_id: empresaId.value!,
    })
    .select('id, nome')
    .single()

  savingCliente.value = false
  if (insertError) { clienteModalError.value = insertError.message; return }

  clientesOpcoes.value = [...clientesOpcoes.value, data as ClienteOpcao]
    .sort((a, b) => a.nome.localeCompare(b.nome))
  form.cliente_id = (data as ClienteOpcao).id
  adicionandoCliente.value = false
}
// ─────────────────────────────────────────────────────────────────────────────

const form = reactive({
  cliente_id:      null as number | null,
  veiculo_id:      null as number | null,
  preco_veiculo:   0,
  forma_pagamento: '',
  status:          'finalizada',
  observacao:      '',
  data_venda:      '',
})
const precoVeiculoDisplay = ref('')
const veiculoBusca        = ref('')
const formErrors = reactive({ cliente_id: '', veiculo: '' })

const filtroAberto = ref(false)
const filtros = reactive({ busca: '', status: '', formaPagamento: '' })

const formasPagamento = ['Dinheiro', 'Pix', 'Cartão de Débito', 'Cartão de Crédito', 'Boleto', 'Transferência']

const statusOpcoes = [
  { label: 'Finalizada', value: 'finalizada', dotClass: 'bg-green-500', activeClass: 'bg-green-50 border-green-400 text-green-800' },
  { label: 'Pendente',   value: 'pendente',   dotClass: 'bg-amber-500', activeClass: 'bg-amber-50 border-amber-400 text-amber-800' },
  { label: 'Cancelada',  value: 'cancelada',  dotClass: 'bg-red-500',   activeClass: 'bg-red-50 border-red-400 text-red-800' },
]

// Veículos disponíveis para o formulário (inclui o veículo atual se estiver em edição)
const veiculosParaForm = computed(() => {
  if (!veiculoEdicaoExtra.value) return veiculosOpcoes.value
  if (veiculosOpcoes.value.some(v => v.id === veiculoEdicaoExtra.value!.id)) return veiculosOpcoes.value
  return [veiculoEdicaoExtra.value, ...veiculosOpcoes.value]
})

// Veículos filtrados pela busca no form
const veiculosParaFormFiltrados = computed(() => {
  const q = veiculoBusca.value.trim().toLowerCase()
  if (!q) return veiculosParaForm.value
  return veiculosParaForm.value.filter(v =>
    `${v.marca} ${v.modelo}`.toLowerCase().includes(q) ||
    (v.placa?.toLowerCase().includes(q) ?? false)
  )
})

const veiculoSelecionado = computed(() =>
  veiculosParaForm.value.find(v => v.id === form.veiculo_id) ?? null
)

function selecionarVeiculo(id: number) {
  if (form.veiculo_id === id) {
    form.veiculo_id = null
  } else {
    form.veiculo_id = id
    seletorVeiculoAberto.value = false
  }
}

// Auto-preenche o preço ao selecionar um veículo
watch(() => form.veiculo_id, (id) => {
  if (!id) { form.preco_veiculo = 0; precoVeiculoDisplay.value = ''; return }
  const v = veiculosParaForm.value.find(v => v.id === id)
  if (v) {
    form.preco_veiculo = v.preco_venda
    precoVeiculoDisplay.value = v.preco_venda.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
})

function onPrecoVeiculoInput(e: Event) {
  const raw = (e.target as HTMLInputElement).value.replace(/\D/g, '')
  const val = raw ? Number(raw) / 100 : 0
  form.preco_veiculo = val
  precoVeiculoDisplay.value = val > 0
    ? val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : ''
  ;(e.target as HTMLInputElement).value = precoVeiculoDisplay.value
}

function anoVeiculoLabel(v: { ano_fabricacao: number | null; ano_modelo: number | null }): string {
  if (!v.ano_fabricacao) return ''
  return v.ano_modelo && v.ano_modelo !== v.ano_fabricacao
    ? `${v.ano_fabricacao}/${v.ano_modelo}`
    : String(v.ano_fabricacao)
}

// �"?�"? Stats �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?
const faturamentoTotal = computed(() =>
  vendas.value.reduce((s, v) => s + vendaTotalValor(v), 0)
)
const ticketMedio = computed(() =>
  vendas.value.length ? faturamentoTotal.value / vendas.value.length : 0
)
const vendasMes = computed(() => {
  const now = new Date()
  return vendas.value.filter(v => {
    if (!v.data_venda) return false
    const d = new Date(v.data_venda)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  }).length
})

// �"?�"? Filtros �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?
const filtrosAtivos = computed(() => {
  let c = 0
  if (filtros.busca) c++
  if (filtros.status) c++
  if (filtros.formaPagamento) c++
  return c
})
const vendasFiltradas = computed(() => {
  return vendas.value.filter(v => {
    if (filtros.status && v.status !== filtros.status) return false
    if (filtros.formaPagamento && v.forma_pagamento !== filtros.formaPagamento) return false
    if (filtros.busca.trim()) {
      const q = filtros.busca.toLowerCase()
      return (
        (v.clientes?.nome ?? '').toLowerCase().includes(q) ||
        (v.veiculos ? `${v.veiculos.marca} ${v.veiculos.modelo}`.toLowerCase().includes(q) : false) ||
        (v.vendas_itens ?? []).some(i => (i.produtos_casa_racao?.nome ?? '').toLowerCase().includes(q))
      )
    }
    return true
  })
})
function limparFiltros() { filtros.busca = ''; filtros.status = ''; filtros.formaPagamento = '' }

// �"?�"? Helpers �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?
function formatCurrency(val: number | null | undefined): string {
  if (val == null) return '�?"'
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
function formatDate(iso: string | null): string {
  if (!iso) return '�?"'
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
function toDatetimeLocal(iso: string | null): string {
  if (!iso) return ''
  return new Date(iso).toISOString().slice(0, 16)
}
function statusLabel(s: string | null): string {
  if (s === 'finalizada') return 'Finalizada'
  if (s === 'pendente')   return 'Pendente'
  if (s === 'cancelada')  return 'Cancelada'
  return s ?? '�?"'
}
function statusBadgeClass(s: string | null): string {
  if (s === 'finalizada') return 'bg-green-100 text-green-700'
  if (s === 'pendente')   return 'bg-amber-100 text-amber-700'
  if (s === 'cancelada')  return 'bg-red-100 text-red-700'
  return 'bg-gray-100 text-gray-500'
}
function statusDotClass(s: string | null): string {
  if (s === 'finalizada') return 'bg-green-500'
  if (s === 'pendente')   return 'bg-amber-500'
  if (s === 'cancelada')  return 'bg-red-500'
  return 'bg-gray-400'
}
function vendaTotalValor(v: Venda): number {
  const itemsTotal = (v.vendas_itens ?? []).reduce((s, i) => s + (i.valor_total ?? i.quantidade * i.preco_unitario), 0)
  return (v.preco_veiculo ?? 0) + itemsTotal
}

// �"?�"? CRUD �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?
onMounted(async () => {
  await loadEmpresa()
  await Promise.all([fetchVendas(), fetchOpcoes()])
})

async function fetchVendas() {
  loading.value = true
  const { data, error: fetchError } = await supabase
    .from('vendas')
    .select('*, clientes(nome), vendas_itens(id, produto_id, quantidade, preco_unitario, valor_total)')
    .eq('empresa_id', empresaId.value!)
    .order('data_venda', { ascending: false })

  loading.value = false
  if (fetchError) { error.value = fetchError.message; return }

  const rows = (data ?? []) as Venda[]

  // Enriquece com dados dos veículos via query separada (sem depender de FK no schema cache)
  const veiculoIds = [...new Set(rows.map(v => v.veiculo_id).filter(Boolean))] as number[]
  let veiculosMap: Record<number, { marca: string; modelo: string; ano_fabricacao: number | null; ano_modelo: number | null }> = {}
  if (veiculoIds.length > 0) {
    const { data: veics } = await supabase
      .from('veiculos')
      .select('id, marca, modelo, ano_fabricacao, ano_modelo')
      .in('id', veiculoIds)
    for (const veic of veics ?? []) {
      veiculosMap[veic.id] = { marca: veic.marca, modelo: veic.modelo, ano_fabricacao: veic.ano_fabricacao, ano_modelo: veic.ano_modelo }
    }
  }
  for (const v of rows) {
    v.veiculos = v.veiculo_id ? (veiculosMap[v.veiculo_id] ?? null) : null
  }

  // Enriquece itens com nome do produto via query separada (sem depender de FK)
  const produtoIds = [...new Set(
    rows.flatMap(v => (v.vendas_itens ?? []).map(i => i.produto_id).filter(Boolean))
  )]
  let nomesMap: Record<number, string> = {}
  if (produtoIds.length > 0) {
    const { data: prods } = await supabase
      .from('produtos_casa_racao')
      .select('id, nome')
      .in('id', produtoIds)
    for (const p of prods ?? []) nomesMap[p.id] = p.nome
  }

  for (const v of rows) {
    for (const item of v.vendas_itens ?? []) {
      item.produtos_casa_racao = item.produto_id ? { nome: nomesMap[item.produto_id] ?? '?' } : null
    }
  }

  vendas.value = rows
}

async function fetchOpcoes() {
  const [{ data: clis }, { data: veics }] = await Promise.all([
    supabase.from('clientes').select('id, nome').eq('ativo', true).eq('empresa_id', empresaId.value!).order('nome'),
    supabase.from('veiculos').select('id, marca, modelo, ano_fabricacao, ano_modelo, preco_venda, km, placa, fotos').eq('empresa_id', empresaId.value!).eq('status', 'disponivel').order('marca'),
  ])
  clientesOpcoes.value = (clis ?? []) as ClienteOpcao[]
  veiculosOpcoes.value = (veics ?? []) as VeiculoOpcao[]
}


function abrirAdicionar() {
  adicionando.value = true
  editando.value = null
  modalError.value = null
  formErrors.cliente_id = ''; formErrors.veiculo = ''
  form.cliente_id = null
  form.veiculo_id = null; form.preco_veiculo = 0; precoVeiculoDisplay.value = ''
  veiculoEdicaoExtra.value = null
  veiculoBusca.value = ''
  seletorVeiculoAberto.value = false
  form.forma_pagamento = ''; form.status = 'finalizada'
  form.observacao = ''; form.data_venda = toDatetimeLocal(new Date().toISOString())
}

function fecharModal() {
  editando.value = null
  adicionando.value = false
}

function editVenda(v: Venda) {
  editando.value = v
  modalError.value = null
  formErrors.cliente_id = ''; formErrors.veiculo = ''
  form.cliente_id      = v.cliente_id
  form.veiculo_id      = v.veiculo_id ?? null
  form.preco_veiculo   = v.preco_veiculo ?? 0
  precoVeiculoDisplay.value = v.preco_veiculo
    ? v.preco_veiculo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : ''
  // Garante que o veículo vinculado apareça no seletor mesmo que não esteja disponível
  if (v.veiculo_id && v.veiculos) {
    veiculoEdicaoExtra.value = {
      id: v.veiculo_id,
      marca: v.veiculos.marca,
      modelo: v.veiculos.modelo,
      ano_fabricacao: v.veiculos.ano_fabricacao,
      ano_modelo: v.veiculos.ano_modelo,
      preco_venda: v.preco_veiculo ?? 0,
      km: null,
      placa: null,
    }
  } else {
    veiculoEdicaoExtra.value = null
  }
  form.forma_pagamento = v.forma_pagamento ?? ''
  form.status          = v.status ?? 'finalizada'
  form.observacao      = v.observacao ?? ''
  form.data_venda      = toDatetimeLocal(v.data_venda)
  veiculoBusca.value   = ''
  seletorVeiculoAberto.value = false
}

function validateForm(): boolean {
  formErrors.cliente_id = ''; formErrors.veiculo = ''
  let ok = true
  if (!form.cliente_id)  { formErrors.cliente_id = 'Selecione o cliente.'; ok = false }
  if (!form.veiculo_id)  { formErrors.veiculo = 'Selecione um veículo do estoque.'; ok = false }
  return ok
}

async function salvarEdicao() {
  if (!editando.value || !validateForm()) return
  saving.value = true; modalError.value = null

  const oldVeiculoId = editando.value.veiculo_id
  const oldStatus    = editando.value.status

  const { error: updateError } = await supabase
    .from('vendas')
    .update({
      cliente_id:      form.cliente_id!,
      veiculo_id:      form.veiculo_id || null,
      preco_veiculo:   form.veiculo_id ? form.preco_veiculo : null,
      forma_pagamento: form.forma_pagamento || null,
      status:          form.status,
      observacao:      form.observacao.trim() || null,
      data_venda:      form.data_venda || null,
    })
    .eq('id', editando.value.id)

  if (updateError) { modalError.value = updateError.message; saving.value = false; return }

  // Gerencia status do veículo
  // Reverte o veículo antigo se necessário
  if (oldVeiculoId && oldStatus === 'finalizada' &&
      (oldVeiculoId !== form.veiculo_id || form.status !== 'finalizada')) {
    await supabase.from('veiculos').update({ status: 'disponivel' }).eq('id', oldVeiculoId)
    await fetchOpcoes()
  }
  // Marca o novo veículo como vendido
  if (form.status === 'finalizada' && form.veiculo_id) {
    await supabase.from('veiculos').update({ status: 'vendido' }).eq('id', form.veiculo_id)
    veiculosOpcoes.value = veiculosOpcoes.value.filter(v => v.id !== form.veiculo_id)
  }

  saving.value = false
  editando.value = null
  await fetchVendas()
}

async function salvarAdicao() {
  if (!validateForm()) return
  saving.value = true; modalError.value = null

  const { data: vendaData, error: insertVendaError } = await supabase
    .from('vendas')
    .insert({
      cliente_id:      form.cliente_id!,
      veiculo_id:      form.veiculo_id || null,
      preco_veiculo:   form.veiculo_id ? form.preco_veiculo : null,
      forma_pagamento: form.forma_pagamento || null,
      status:          form.status,
      observacao:      form.observacao.trim() || null,
      data_venda:      form.data_venda || null,
      empresa_id:      empresaId.value!,
    })
    .select('id')
    .single()

  if (insertVendaError) { modalError.value = insertVendaError.message; saving.value = false; return }

  // Marca o veículo como vendido quando a venda é finalizada
  if (form.status === 'finalizada' && form.veiculo_id) {
    await supabase.from('veiculos').update({ status: 'vendido' }).eq('id', form.veiculo_id)
    veiculosOpcoes.value = veiculosOpcoes.value.filter(v => v.id !== form.veiculo_id)
  }

  saving.value = false
  adicionando.value = false
  await fetchVendas()
}

function confirmarExclusao(v: Venda) { excluindo.value = v; deleteError.value = null }

async function executarExclusao() {
  if (!excluindo.value) return
  deleting.value = true; deleteError.value = null
  const vendaParaExcluir = excluindo.value
  const { error: deleteErr } = await supabase.from('vendas').delete().eq('id', vendaParaExcluir.id)
  deleting.value = false
  if (deleteErr) { deleteError.value = deleteErr.message; return }
  // Reverte o veículo para disponível se a venda era finalizada
  if (vendaParaExcluir.veiculo_id && vendaParaExcluir.status === 'finalizada') {
    await supabase.from('veiculos').update({ status: 'disponivel' }).eq('id', vendaParaExcluir.veiculo_id)
    await fetchOpcoes()
  }
  excluindo.value = null
  await fetchVendas()
}

function exportarPDF() {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })
  const now = new Date()
  const dataGeracao = now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  // Cabeçalho
  doc.setFillColor(20, 83, 45)
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 56, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('PetFlow �?" Relatório de Vendas', 40, 34)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(`Gerado em: ${dataGeracao}`, 40, 48)

  if (filtrosAtivos.value > 0) {
    const parts: string[] = []
    if (filtros.status) parts.push(`Status: ${statusLabel(filtros.status)}`)
    if (filtros.formaPagamento) parts.push(`Pagamento: ${filtros.formaPagamento}`)
    if (filtros.busca) parts.push(`Busca: "${filtros.busca}"`)
    doc.text(`Filtros aplicados: ${parts.join(' · ')}`, doc.internal.pageSize.getWidth() - 40, 48, { align: 'right' })
  }

  // Resumo
  doc.setTextColor(20, 83, 45)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  const resumoY = 74
  const totalVendasFiltradas = vendasFiltradas.value.length
  const faturamentoFiltrado = vendasFiltradas.value.reduce((s, v) => s + vendaTotalValor(v), 0)
  const ticketFiltrado = totalVendasFiltradas ? faturamentoFiltrado / totalVendasFiltradas : 0
  doc.text(
    `Total: ${totalVendasFiltradas} venda(s)   |   Faturamento: ${formatCurrency(faturamentoFiltrado)}   |   Ticket Médio: ${formatCurrency(ticketFiltrado)}`,
    40, resumoY
  )

  // Tabela
  autoTable(doc, {
    startY: resumoY + 14,
    head: [['#', 'Cliente', 'Itens', 'Total', 'Pagamento', 'Status', 'Data']],
    body: vendasFiltradas.value.map(v => [
      String(v.id),
      v.clientes?.nome ?? '�?"',
      (v.vendas_itens ?? []).map(i => `${i.produtos_casa_racao?.nome ?? '?'} �?" ${i.quantidade}�- ${formatCurrency(i.preco_unitario)}`).join('\n') || '�?"',
      formatCurrency(vendaTotalValor(v)),
      v.forma_pagamento ?? '�?"',
      statusLabel(v.status),
      formatDate(v.data_venda),
    ]),
    headStyles: { fillColor: [20, 83, 45], textColor: 255, fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 8, textColor: [30, 30, 30] },
    alternateRowStyles: { fillColor: [240, 253, 244] },
    columnStyles: {
      0: { cellWidth: 28, halign: 'center' },
      3: { cellWidth: 70, halign: 'right' },
      4: { cellWidth: 80 },
      5: { cellWidth: 60, halign: 'center' },
      6: { cellWidth: 90 },
    },
    margin: { left: 40, right: 40 },
    tableLineColor: [220, 252, 231],
    tableLineWidth: 0.5,
  })

  // Rodapé
  const pageCount = (doc.internal as any).getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(150, 150, 150)
    doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 16, { align: 'center' })
  }

  const filename = `vendas_${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}.pdf`
  doc.save(filename)
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-fade-enter-active { transition: all 0.2s ease; }
.slide-fade-leave-active { transition: all 0.15s ease; }
.slide-fade-enter-from, .slide-fade-leave-to { transform: translateY(-8px); opacity: 0; }
</style>