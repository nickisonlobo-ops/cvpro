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
              <svg class="w-5 sm:w-7 h-5 sm:h-7 text-white" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/></svg>
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-semibold text-white/80 uppercase tracking-widest">Estoque</span>
                <span class="w-1 h-1 rounded-full bg-white/40" />
                <span class="text-xs text-white/70 hidden sm:inline">UpStudio</span>
              </div>
              <h1 class="text-xl sm:text-3xl font-bold text-white tracking-tight leading-none">Produtos</h1>
              <p class="text-sm text-white/80 mt-1.5">
                {{ loading ? 'Carregando...' : `${produtosFiltrados.length} de ${produtos.length} produto(s) exibido(s)` }}
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
            <button
              v-if="isAdminOrGerente"
              type="button"
              class="inline-flex items-center gap-2 text-sm font-bold px-3 sm:px-5 py-2.5 rounded-xl bg-white text-primary hover:bg-primary-5 shadow-lg transition-all duration-200 hover:scale-[1.02]"
              @click="abrirAdicionar"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
              <span class="hidden sm:inline">Adicionar Produto</span>
            </button>
          </div>
        </div>

        <div class="h-px bg-white/10 my-4 sm:my-6" />

        <!-- Stats -->
        <div v-if="!loading" class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="flex flex-col gap-1 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/10 hover:bg-white/15 transition-colors">
            <span class="text-xs font-semibold text-green-300 uppercase tracking-widest">Total</span>
            <span class="text-xl font-black text-white leading-tight">{{ produtos.length }}</span>
            <span class="text-xs text-white/50">produto(s)</span>
          </div>
          <div class="flex flex-col gap-1 bg-white/10 rounded-2xl px-5 py-4 border border-white/10 hover:bg-white/15 transition-colors">
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-white/70" />
              <span class="text-xs font-semibold text-white/70 uppercase tracking-widest">Ativos</span>
            </div>
            <span class="text-xl font-black text-white leading-tight">{{ produtosAtivos }}</span>
            <span class="text-xs text-white/50">em catálogo</span>
          </div>
          <div class="flex flex-col gap-1 bg-white/10 rounded-2xl px-5 py-4 border border-white/10 hover:bg-white/15 transition-colors">
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-white/70" />
              <span class="text-xs font-semibold text-white/70 uppercase tracking-widest">Estoque Baixo</span>
            </div>
            <span class="text-xl font-black text-white leading-tight">{{ estoqueBaixo }}</span>
            <span class="text-xs text-white/50">abaixo do mínimo</span>
          </div>
          <div class="flex flex-col gap-1 bg-white/10 rounded-2xl px-5 py-4 border border-white/10 hover:bg-white/15 transition-colors">
            <span class="text-xs font-semibold text-white/70 uppercase tracking-widest">Valor em Estoque</span>
            <span class="text-xl font-black text-white leading-tight">{{ formatCurrency(valorTotalEstoque) }}</span>
            <span class="text-xs text-white/50">preço de venda</span>
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
          <button v-if="filtrosAtivos > 0" type="button" class="text-xs font-semibold text-primary hover:text-primary hover:underline" @click="limparFiltros">
            Limpar todos
          </button>
        </div>
        <div class="p-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div class="sm:col-span-2 flex flex-col gap-1.5">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Busca</label>
            <div class="relative">
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="m21 21-4.35-4.35"/></svg>
              <input v-model="filtros.busca" type="text" placeholder="Nome, SKU, marca ou código de barras..." class="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow" />
            </div>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Categoria</label>
            <select v-model="filtros.categoria" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Todas</option>
              <option v-for="cat in categoriasUnicas" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Status</label>
            <div class="flex gap-2">
              <button
                v-for="op in [{ label: 'Todos', value: '' }, { label: 'Ativo', value: 'true' }, { label: 'Inativo', value: 'false' }]"
                :key="op.value"
                type="button"
                class="flex-1 text-xs font-bold py-2 rounded-xl border transition-colors"
                :class="filtros.ativo === op.value
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-gray-200 text-gray-500 hover:border-primary hover:text-primary bg-white'"
                @click="filtros.ativo = op.value"
              >
                {{ op.label }}
              </button>
            </div>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Estoque</label>
            <div class="flex gap-2">
              <button
                v-for="op in [{ label: 'Todos', value: '' }, { label: 'Baixo', value: 'baixo' }]"
                :key="op.value"
                type="button"
                class="flex-1 text-xs font-bold py-2 rounded-xl border transition-colors"
                :class="filtros.estoque === op.value
                  ? 'bg-red-500 border-red-500 text-white'
                  : 'border-gray-200 text-gray-500 hover:border-red-400 hover:text-red-600 bg-white'"
                @click="filtros.estoque = op.value"
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
      <span class="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <span class="text-sm text-gray-400 font-medium">Carregando produtos...</span>
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
          <span class="text-primary font-black">{{ produtosFiltrados.length }}</span>
          resultado(s)
          <span v-if="filtrosAtivos > 0" class="text-gray-400 font-normal"> �?" filtros aplicados</span>
        </span>
        <span class="text-xs text-gray-400">Ordenado por nome</span>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full text-sm whitespace-nowrap">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="text-left px-7 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">#</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Nome</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">SKU</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Categoria</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Marca</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Preço Custo</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Preço Venda</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Estoque</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Unid.</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Status</th>
              <th class="px-7 py-4 text-right text-xs font-extrabold text-gray-400 uppercase tracking-widest sm:sticky sm:right-0 bg-gray-50">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-if="produtosFiltrados.length === 0">
              <td colspan="11" class="text-center py-20">
                <div class="flex flex-col items-center gap-3">
                  <svg class="w-14 h-14 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.25" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/></svg>
                  <span class="text-base font-semibold text-gray-400">Nenhum produto encontrado</span>
                  <span v-if="filtrosAtivos > 0" class="text-sm text-gray-400">Tente ajustar os filtros</span>
                </div>
              </td>
            </tr>
            <tr
              v-for="prod in produtosFiltrados"
              :key="prod.id"
              class="hover:bg-primary-5/40 transition-colors duration-150 group"
            >
              <td class="px-7 py-4">
                <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-primary font-black text-xs">
                  {{ prod.id }}
                </span>
              </td>
              <td class="px-5 py-4">
                <span class="font-semibold text-gray-800 max-w-[180px] block truncate">{{ prod.nome }}</span>
                <span v-if="prod.descricao" class="text-xs text-gray-400 max-w-[180px] block truncate">{{ prod.descricao }}</span>
              </td>
              <td class="px-5 py-4">
                <span v-if="prod.sku" class="font-mono text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">{{ prod.sku }}</span>
                <span v-else class="text-gray-300">�?"</span>
              </td>
              <td class="px-5 py-4">
                <span v-if="prod.categoria" class="inline-block text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 rounded-lg px-2.5 py-1">{{ prod.categoria }}</span>
                <span v-else class="text-gray-300">�?"</span>
              </td>
              <td class="px-5 py-4 text-gray-500 font-medium">{{ prod.marca ?? '�?"' }}</td>
              <td class="px-5 py-4">
                <span v-if="prod.preco_custo != null" class="text-gray-500 font-medium tabular-nums">{{ formatCurrency(prod.preco_custo) }}</span>
                <span v-else class="text-gray-300">�?"</span>
              </td>
              <td class="px-5 py-4">
                <span class="font-black text-gray-900 tabular-nums">{{ formatCurrency(prod.preco_venda) }}</span>
              </td>
              <td class="px-5 py-4">
                <div class="flex items-center gap-2">
                  <span
                    class="font-black tabular-nums text-sm"
                    :class="(prod.estoque_atual ?? 0) <= (prod.estoque_minimo ?? 0) ? 'text-red-600' : 'text-gray-800'"
                  >
                    {{ prod.estoque_atual ?? 0 }}
                  </span>
                  <span class="text-xs text-gray-400">/ mín {{ prod.estoque_minimo ?? 0 }}</span>
                  <span v-if="(prod.estoque_atual ?? 0) <= (prod.estoque_minimo ?? 0)" class="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 rounded-full px-2 py-0.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-red-500" />
                    Baixo
                  </span>
                </div>
              </td>
              <td class="px-5 py-4">
                <span class="inline-block text-xs font-bold bg-gray-100 text-gray-600 rounded-lg px-2.5 py-1 uppercase">{{ prod.unidade_medida ?? 'un' }}</span>
              </td>
              <td class="px-5 py-4">
                <span
                  :class="['inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full',
                    prod.ativo !== false
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500']"
                >
                  <span :class="['w-1.5 h-1.5 rounded-full', prod.ativo !== false ? 'bg-green-500' : 'bg-gray-400']" />
                  {{ prod.ativo !== false ? 'Ativo' : 'Inativo' }}
                </span>
              </td>
              <td class="px-7 py-4 text-right sm:sticky sm:right-0 group-hover:bg-primary-5/40 transition-colors">
                <div class="flex items-center justify-end gap-1">
                  <button
                    v-if="isAdminOrGerente"
                    type="button"
                    class="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-primary hover:bg-primary-10 transition-colors"
                    title="Editar"
                    @click="editProduto(prod)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 7.125L18 8.625"/></svg>
                  </button>
                  <button
                    v-if="isAdmin"
                    type="button"
                    class="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-red-400 hover:bg-red-50 transition-colors"
                    title="Excluir"
                    @click="confirmarExclusao(prod)"
                  >
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
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div class="flex items-center justify-between px-8 py-6 border-b border-white/10" :style="{ background: 'var(--color-primary-bg, linear-gradient(135deg, #111827, #1f2937))' }">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/></svg>
                </div>
                <h2 class="text-lg font-bold text-white">{{ adicionando ? 'Adicionar Produto' : 'Editar Produto' }}</h2>
              </div>
              <button type="button" class="w-8 h-8 flex items-center justify-center rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors" @click="fecharModal">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <form class="flex flex-col gap-5 px-8 py-7 overflow-y-auto max-h-[70vh]" @submit.prevent="adicionando ? salvarAdicao() : salvarEdicao()">
              <!-- Linha 1: Nome + Marca -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AppInput v-model="form.nome" label="Nome *" placeholder="Nome do Produto" :error="formErrors.nome" required />
                <AppInput v-model="form.marca" label="Marca" placeholder="Ex: Royal Canin" />
              </div>
              <!-- Linha 2: SKU + Código de barras -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AppInput v-model="form.sku" label="SKU" placeholder="Ex: RC-ADL-15" :error="formErrors.sku" />
                <AppInput v-model="form.codigo_barras" label="Código de Barras" placeholder="Ex: 7891000123456" />
              </div>
              <!-- Linha 3: Categoria + Unidade -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AppInput v-model="form.categoria" label="Categoria" placeholder="Ex: Ração, Petisco, Acessório" />
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-semibold text-gray-700">Unidade de Medida</label>
                  <select v-model="form.unidade_medida" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#6b7280)] focus:border-[var(--color-primary,#6b7280)]">
                    <option value="un">un — Unidade</option>
                    <option value="kg">kg — Quilograma</option>
                    <option value="g">g — Grama</option>
                    <option value="l">l — Litro</option>
                    <option value="ml">ml — Mililitro</option>
                    <option value="pct">pct — Pacote</option>
                    <option value="sc">sc — Saco</option>
                  </select>
                </div>
              </div>
              <!-- Linha 4: Peso + Descrição -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <AppInput v-model="form.peso" label="Peso (kg)" type="number" placeholder="Ex: 15.000" />
                <div class="sm:col-span-2 flex flex-col gap-1.5">
                  <label class="text-sm font-semibold text-gray-700">Descrição</label>
                  <textarea
                    v-model="form.descricao"
                    rows="2"
                    placeholder="Descrição breve do produto..."
                    class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#6b7280)] focus:border-[var(--color-primary,#6b7280)] resize-none"
                  />
                </div>
              </div>
              <!-- Linha 5: Preços -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AppInput v-model="form.preco_custo" label="Preço de Custo (R$)" type="number" placeholder="0,00" />
                <AppInput v-model="form.preco_venda" label="Preço de Venda (R$) *" type="number" placeholder="0,00" :error="formErrors.preco_venda" required />
              </div>
              <!-- Linha 6: Estoques -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AppInput v-model="form.estoque_atual" label="Estoque Atual" type="number" placeholder="0" />
                <AppInput v-model="form.estoque_minimo" label="Estoque Mínimo" type="number" placeholder="0" />
              </div>
              <!-- Ativo -->
              <div class="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                <button
                  type="button"
                  class="relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none"
                  :class="form.ativo ? 'bg-green-500' : 'bg-gray-300'"
                  @click="form.ativo = !form.ativo"
                >
                  <span class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200" :class="form.ativo ? 'translate-x-5' : 'translate-x-0'" />
                </button>
                <div>
                  <p class="text-sm font-semibold text-gray-700">Produto ativo</p>
                  <p class="text-xs text-gray-400">{{ form.ativo ? 'Visível e disponível para venda' : 'Oculto do catálogo' }}</p>
                </div>
              </div>

              <p v-if="modalError" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{{ modalError }}</p>

              <div class="flex gap-3 pt-1">
                <button type="button" class="flex-1 py-3 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors text-sm font-semibold" @click="fecharModal">
                  Cancelar
                </button>
                <AppButton variant="primary" size="md" type="submit" :loading="saving" class="flex-1">
                  {{ adicionando ? 'Adicionar' : 'Salvar alterações' }}
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
              <h2 class="text-xl font-bold text-gray-800">Excluir produto?</h2>
              <p class="text-sm text-gray-500 mt-2 leading-relaxed">
                Tem certeza que deseja excluir <br /><strong class="text-gray-800">{{ excluindo.nome }}</strong>?<br />
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
import AppInput from '~/components/AppInput.vue'
import AppButton from '~/components/AppButton.vue'

interface Produto {
  id: number
  nome: string
  categoria: string | null
  marca: string | null
  descricao: string | null
  sku: string | null
  codigo_barras: string | null
  peso: number | null
  unidade_medida: string | null
  preco_custo: number | null
  preco_venda: number
  estoque_atual: number | null
  estoque_minimo: number | null
  ativo: boolean | null
  created_at: string | null
}

const supabase = createSupabaseClient()
const { isAdmin, isAdminOrGerente } = useAdmin()
const { empresaId, loadEmpresa } = useEmpresa()

const produtos = ref<Produto[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const editando = ref<Produto | null>(null)
const adicionando = ref(false)
const saving = ref(false)
const modalError = ref<string | null>(null)

const excluindo = ref<Produto | null>(null)
const deleting = ref(false)
const deleteError = ref<string | null>(null)

const form = reactive({
  nome: '',
  marca: '',
  sku: '',
  codigo_barras: '',
  categoria: '',
  unidade_medida: 'un',
  peso: '',
  descricao: '',
  preco_custo: '',
  preco_venda: '',
  estoque_atual: '0',
  estoque_minimo: '0',
  ativo: true,
})

const formErrors = reactive({ nome: '', sku: '', preco_venda: '' })

const filtroAberto = ref(false)
const filtros = reactive({
  busca: '',
  categoria: '',
  ativo: '',
  estoque: '',
})

// �"?�"? Stats �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?
const produtosAtivos = computed(() =>
  produtos.value.filter(p => p.ativo !== false).length
)

const estoqueBaixo = computed(() =>
  produtos.value.filter(p => (p.estoque_atual ?? 0) <= (p.estoque_minimo ?? 0)).length
)

const valorTotalEstoque = computed(() =>
  produtos.value.reduce((sum, p) => sum + p.preco_venda * (p.estoque_atual ?? 0), 0)
)

// �"?�"? Filtros �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?
const categoriasUnicas = computed(() => {
  const set = new Set(produtos.value.map(p => p.categoria).filter(Boolean) as string[])
  return Array.from(set).sort()
})

const filtrosAtivos = computed(() => {
  let c = 0
  if (filtros.busca) c++
  if (filtros.categoria) c++
  if (filtros.ativo) c++
  if (filtros.estoque) c++
  return c
})

const produtosFiltrados = computed(() => {
  return produtos.value.filter(p => {
    if (filtros.categoria && p.categoria !== filtros.categoria) return false
    if (filtros.ativo === 'true' && p.ativo === false) return false
    if (filtros.ativo === 'false' && p.ativo !== false) return false
    if (filtros.estoque === 'baixo' && (p.estoque_atual ?? 0) > (p.estoque_minimo ?? 0)) return false
    if (filtros.busca.trim()) {
      const q = filtros.busca.toLowerCase()
      return (
        p.nome.toLowerCase().includes(q) ||
        (p.sku ?? '').toLowerCase().includes(q) ||
        (p.marca ?? '').toLowerCase().includes(q) ||
        (p.codigo_barras ?? '').includes(q) ||
        (p.categoria ?? '').toLowerCase().includes(q)
      )
    }
    return true
  })
})

function limparFiltros() {
  filtros.busca = ''
  filtros.categoria = ''
  filtros.ativo = ''
  filtros.estoque = ''
}

// �"?�"? CRUD �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?
onMounted(async () => { await loadEmpresa(); await fetchProdutos() })

async function fetchProdutos() {
  loading.value = true
  const { data, error: fetchError } = await supabase
    .from('produtos_casa_racao')
    .select('*')
    .eq('empresa_id', empresaId.value!)
    .order('nome', { ascending: true })

  loading.value = false
  if (fetchError) { error.value = fetchError.message; return }
  produtos.value = (data ?? []) as Produto[]
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function abrirAdicionar() {
  adicionando.value = true
  editando.value = null
  modalError.value = null
  formErrors.nome = ''; formErrors.sku = ''; formErrors.preco_venda = ''
  form.nome = ''; form.marca = ''; form.sku = ''; form.codigo_barras = ''
  form.categoria = ''; form.unidade_medida = 'un'; form.peso = ''
  form.descricao = ''; form.preco_custo = ''; form.preco_venda = ''
  form.estoque_atual = '0'; form.estoque_minimo = '0'; form.ativo = true
}

function fecharModal() {
  editando.value = null
  adicionando.value = false
}

function editProduto(prod: Produto) {
  editando.value = prod
  modalError.value = null
  formErrors.nome = ''; formErrors.sku = ''; formErrors.preco_venda = ''
  form.nome           = prod.nome
  form.marca          = prod.marca ?? ''
  form.sku            = prod.sku ?? ''
  form.codigo_barras  = prod.codigo_barras ?? ''
  form.categoria      = prod.categoria ?? ''
  form.unidade_medida = prod.unidade_medida ?? 'un'
  form.peso           = prod.peso != null ? String(prod.peso) : ''
  form.descricao      = prod.descricao ?? ''
  form.preco_custo    = prod.preco_custo != null ? String(prod.preco_custo) : ''
  form.preco_venda    = String(prod.preco_venda)
  form.estoque_atual  = String(prod.estoque_atual ?? 0)
  form.estoque_minimo = String(prod.estoque_minimo ?? 0)
  form.ativo          = prod.ativo !== false
}

function buildPayload() {
  return {
    nome:           form.nome.trim(),
    marca:          form.marca.trim() || null,
    sku:            form.sku.trim() || null,
    codigo_barras:  form.codigo_barras.trim() || null,
    categoria:      form.categoria.trim() || null,
    unidade_medida: form.unidade_medida,
    peso:           form.peso ? Number(form.peso) : null,
    descricao:      form.descricao.trim() || null,
    preco_custo:    form.preco_custo ? Number(form.preco_custo) : null,
    preco_venda:    Number(form.preco_venda),
    estoque_atual:  Number(form.estoque_atual),
    estoque_minimo: Number(form.estoque_minimo),
    ativo:          form.ativo,
    empresa_id:     empresaId.value!,
  }
}

function validateForm(): boolean {
  formErrors.nome = ''; formErrors.sku = ''; formErrors.preco_venda = ''
  let ok = true
  if (!form.nome.trim()) { formErrors.nome = 'O nome é obrigatório.'; ok = false }
  if (!form.preco_venda || Number(form.preco_venda) < 0) { formErrors.preco_venda = 'Informe um preço de venda válido.'; ok = false }
  return ok
}

async function salvarEdicao() {
  if (!editando.value || !validateForm()) return
  saving.value = true
  modalError.value = null

  const { error: updateError } = await supabase
    .from('produtos_casa_racao')
    .update(buildPayload())
    .eq('id', editando.value.id)

  saving.value = false
  if (updateError) { modalError.value = updateError.message; return }

  editando.value = null
  await fetchProdutos()
}

async function salvarAdicao() {
  if (!validateForm()) return
  saving.value = true
  modalError.value = null

  const { error: insertError } = await supabase
    .from('produtos_casa_racao')
    .insert(buildPayload())

  saving.value = false
  if (insertError) { modalError.value = insertError.message; return }

  adicionando.value = false
  await fetchProdutos()
}

function confirmarExclusao(prod: Produto) {
  excluindo.value = prod
  deleteError.value = null
}

async function executarExclusao() {
  if (!excluindo.value) return
  deleting.value = true
  deleteError.value = null

  const { error: deleteErr } = await supabase
    .from('produtos_casa_racao')
    .delete()
    .eq('id', excluindo.value.id)

  deleting.value = false
  if (deleteErr) { deleteError.value = deleteErr.message; return }

  excluindo.value = null
  await fetchProdutos()
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-fade-enter-active { transition: all 0.2s ease; }
.slide-fade-leave-active { transition: all 0.15s ease; }
.slide-fade-enter-from, .slide-fade-leave-to { transform: translateY(-8px); opacity: 0; }
</style>
