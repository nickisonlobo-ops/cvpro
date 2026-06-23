<template>
  <div class="min-h-full p-3 sm:p-6">

    <!-- CABEÇALHO -->
    <div class="relative rounded-3xl overflow-hidden mb-8 shadow-xl">
      <div class="absolute inset-0" :style="{ background: 'var(--color-primary-bg, linear-gradient(135deg, #0d9488, #059669))' }" />
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />
      <div class="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/[0.03] pointer-events-none" />

      <div class="relative px-4 sm:px-8 pt-5 sm:pt-7 pb-5 sm:pb-7">
        <div class="flex flex-wrap items-start justify-between gap-3 sm:gap-6">
          <div class="flex items-center gap-3 sm:gap-5">
            <div class="flex items-center justify-center w-10 sm:w-14 h-10 sm:h-14 rounded-2xl bg-white/[0.12] backdrop-blur-sm border border-white/20 shadow-lg">
              <svg class="w-5 sm:w-7 h-5 sm:h-7 text-white" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" />
              </svg>
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-semibold text-white/80 uppercase tracking-widest">Produção</span>
                <span class="w-1 h-1 rounded-full bg-white/40" />
                <span class="text-xs text-white/50 hidden sm:inline">Catálogo</span>
              </div>
              <h1 class="text-xl sm:text-3xl font-bold text-white tracking-tight leading-none">Catálogo de Produtos</h1>
              <p class="text-sm text-gray-300/80 mt-1.5">
                {{ loading ? 'Carregando...' : `${totalItems} produto(s) cadastrado(s)` }}
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
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-2 text-sm font-bold px-3 sm:px-5 py-2.5 rounded-xl bg-amber-500 text-gray-950 hover:bg-amber-400 shadow-lg shadow-amber-900/30 transition-all duration-200 hover:scale-[1.02]"
              @click="abrirCriar"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
              <span class="hidden sm:inline">Novo Produto</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- FILTROS -->
    <Transition name="slide-fade">
      <div v-show="filtroAberto" class="bg-white rounded-3xl border border-gray-100 shadow-md mb-6 overflow-hidden">
        <div class="flex items-center justify-between px-7 py-4 border-b border-gray-100 bg-gray-50/70">
          <div class="flex items-center gap-2.5">
            <svg class="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/></svg>
            <span class="text-sm font-bold text-gray-700">Filtros</span>
          </div>
          <button type="button" class="text-xs font-semibold text-teal-500 hover:text-teal-700 hover:underline" @click="limparFiltros">
            Limpar todos
          </button>
        </div>
        <div class="p-7 grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Categoria</label>
            <select v-model="filtroCategoria" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
              <option value="">Todas</option>
              <option v-for="cat in categoriasUnicas" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Material</label>
            <select v-model="filtroMaterial" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
              <option value="">Todos</option>
              <option v-for="m in materiaisLista" :key="m.id" :value="m.id">{{ m.nome }}</option>
            </select>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Status</label>
            <select v-model="filtroStatus" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
              <option value="">Todos</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>
        </div>
      </div>
    </Transition>

    <!-- LOADING -->
    <div v-if="loading" class="flex flex-col items-center justify-center gap-4 py-32">
      <span class="inline-block w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      <span class="text-sm text-gray-400 font-medium">Carregando catálogo...</span>
    </div>

    <!-- ERRO -->
    <div v-else-if="error" class="flex items-center gap-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-2xl px-6 py-4">
      <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" d="M12 8v4m0 4h.01"/></svg>
      {{ error }}
    </div>

    <!-- TABELA / GRID -->
    <div v-else class="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
      <div class="flex items-center justify-between px-7 py-4 border-b border-gray-100 bg-gray-50/50">
        <span class="text-sm font-semibold text-gray-600">
          <span class="text-teal-600 font-black">{{ produtos.length }}</span>
          resultado(s) — Página {{ paginaAtual }} de {{ totalPaginas }}
        </span>
        <span class="text-xs text-gray-400">Ordenado por nome (A-Z)</span>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest w-16">Img</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Nome</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Categoria</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Materiais</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Dimensões</th>
              <th class="text-right px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Preço</th>
              <th class="text-center px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Status</th>
              <th class="px-6 py-4 text-right text-xs font-extrabold text-gray-400 uppercase tracking-widest w-24">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-if="produtos.length === 0">
              <td colspan="8" class="text-center py-20">
                <div class="flex flex-col items-center gap-3">
                  <svg class="w-14 h-14 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.25" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                  </svg>
                  <span class="text-base font-semibold text-gray-400">Nenhum produto encontrado</span>
                  <span class="text-sm text-gray-400">Tente ajustar os filtros ou adicione um novo produto</span>
                </div>
              </td>
            </tr>
            <template v-for="produto in produtos" :key="produto.id">
              <tr
                class="hover:bg-teal-50/30 transition-colors duration-150 group cursor-pointer"
                @click="toggleExpand(produto.id)"
              >
                <!-- Img -->
                <td class="px-5 py-3">
                  <div class="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    <img v-if="produto.imagem_url" :src="produto.imagem_url" :alt="produto.nome" class="w-full h-full object-cover" loading="lazy" />
                    <div v-else class="w-full h-full flex items-center justify-center">
                      <svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z"/></svg>
                    </div>
                  </div>
                </td>
                <!-- Nome -->
                <td class="px-5 py-3">
                  <span class="font-semibold text-gray-800">{{ produto.nome }}</span>
                </td>
                <!-- Categoria -->
                <td class="px-5 py-3">
                  <span class="text-sm text-gray-600">{{ produto.categoria }}</span>
                </td>
                <!-- Materiais (badge count) -->
                <td class="px-5 py-3">
                  <span class="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>
                    {{ (produto.composicoes?.length ?? 0) }} mat.
                  </span>
                </td>
                <!-- Dimensões -->
                <td class="px-5 py-3">
                  <span class="text-sm text-gray-500">{{ produto.largura_cm }} × {{ produto.altura_cm }} cm</span>
                </td>
                <!-- Preço -->
                <td class="px-5 py-3 text-right">
                  <span class="font-bold text-gray-800">{{ formatCurrency(produto.preco_venda) }}</span>
                </td>
                <!-- Status -->
                <td class="px-5 py-3 text-center">
                  <button
                    type="button"
                    class="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full cursor-pointer transition-colors"
                    :class="produto.ativo ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'"
                    :title="produto.ativo ? 'Clique para desativar' : 'Clique para ativar'"
                    @click.stop="toggleAtivo(produto)"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :class="produto.ativo ? 'bg-green-500' : 'bg-red-500'" />
                    {{ produto.ativo ? 'Ativo' : 'Inativo' }}
                  </button>
                </td>
                <!-- Ações -->
                <td class="px-6 py-3 text-right">
                  <div class="flex items-center justify-end gap-1">
                    <button type="button" class="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-teal-500 hover:bg-teal-100 transition-colors" title="Editar" @click.stop="abrirEditar(produto)">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
              <!-- Expandable cost breakdown row -->
              <tr v-if="expandedRows.has(produto.id) && produto.composicoes?.length">
                <td colspan="8" class="px-5 py-0">
                  <div class="bg-gray-50/80 rounded-xl border border-gray-100 my-2 overflow-hidden">
                    <div class="px-4 py-2.5 border-b border-gray-100 flex items-center gap-2">
                      <svg class="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-1.902 1.902a2.25 2.25 0 01-2.387.541l-.819-.328a2.25 2.25 0 00-2.384.541L9.5 19.06a2.25 2.25 0 01-2.387.541l-.819-.328a2.25 2.25 0 00-2.384.541L2 21.75"/></svg>
                      <span class="text-xs font-bold text-gray-600 uppercase tracking-wider">Composição de Custo</span>
                    </div>
                    <table class="w-full text-xs">
                      <thead>
                        <tr class="text-gray-400">
                          <th class="text-left px-4 py-2 font-bold uppercase tracking-wider">Material</th>
                          <th class="text-left px-4 py-2 font-bold uppercase tracking-wider">Fórmula</th>
                          <th class="text-right px-4 py-2 font-bold uppercase tracking-wider">Preço Unit.</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-100">
                        <tr v-for="comp in produto.composicoes" :key="comp.id">
                          <td class="px-4 py-2 font-semibold text-gray-700">{{ comp.material_nome }}</td>
                          <td class="px-4 py-2">
                            <code class="text-[11px] bg-white px-1.5 py-0.5 rounded border border-gray-200 text-indigo-600 font-mono">{{ comp.formula_consumo }}</code>
                          </td>
                          <td class="px-4 py-2 text-right font-semibold text-gray-600">{{ formatCurrency(comp.preco_unitario) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- PAGINAÇÃO -->
      <div v-if="totalPaginas > 1" class="flex items-center justify-between px-7 py-4 border-t border-gray-100 bg-gray-50/50">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="paginaAtual <= 1"
          @click="irParaPagina(paginaAtual - 1)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>
          Anterior
        </button>
        <span class="text-sm text-gray-500 font-medium">
          Página <span class="font-bold text-gray-700">{{ paginaAtual }}</span> de <span class="font-bold text-gray-700">{{ totalPaginas }}</span>
        </span>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="paginaAtual >= totalPaginas"
          @click="irParaPagina(paginaAtual + 1)"
        >
          Próxima
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>
        </button>
      </div>
    </div>

    <!-- MODAL CRIAR / EDITAR -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="modalAberto"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4 py-4"
          @click.self="fecharModal"
        >
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden" style="max-height:92vh">

            <!-- Header -->
            <div class="relative bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 px-8 py-6 shrink-0">
              <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.12),transparent_60%)] pointer-events-none" />
              <div class="relative flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="w-11 h-11 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center shadow-lg">
                    <svg class="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"/></svg>
                  </div>
                  <div>
                    <p class="text-[10px] font-bold text-teal-400 uppercase tracking-[0.2em] mb-0.5">{{ editandoProduto ? 'Editar' : 'Cadastrar' }}</p>
                    <h2 class="text-xl font-black text-white leading-none">{{ editandoProduto ? 'Editar Produto' : 'Novo Produto' }}</h2>
                  </div>
                </div>
                <button type="button" class="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors" @click="fecharModal">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </div>

            <!-- Form -->
            <form class="flex flex-col gap-5 px-8 py-7 overflow-y-auto" @submit.prevent="salvar">

              <!-- Nome -->
              <div class="flex flex-col gap-1.5">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Nome *</label>
                <input
                  v-model="form.nome"
                  type="text"
                  maxlength="100"
                  placeholder="Nome do produto"
                  class="w-full rounded-xl border-2 px-4 py-3 text-sm font-semibold text-gray-800 bg-gray-50 focus:outline-none focus:ring-0 transition-all"
                  :class="formErrors.nome ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-teal-400'"
                />
                <p v-if="formErrors.nome" class="text-xs text-red-500 font-semibold">{{ formErrors.nome }}</p>
              </div>

              <!-- Categoria -->
              <!-- Categoria -->
              <div class="flex flex-col gap-1.5">
                <div class="flex items-center justify-between">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Categoria *</label>
                  <button
                    type="button"
                    class="text-[10px] font-bold text-teal-600 hover:text-teal-800 transition-colors"
                    @click="showCategoriasModal = true"
                  >
                    + Gerenciar
                  </button>
                </div>
                <select
                  v-model="form.categoria_id"
                  class="w-full rounded-xl border-2 px-4 py-3 text-sm font-semibold text-gray-800 bg-gray-50 focus:outline-none focus:ring-0 transition-all"
                  :class="formErrors.categoria ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-teal-400'"
                >
                  <option :value="null">Selecione uma categoria...</option>
                  <option v-for="cat in categorias" :key="cat.id" :value="cat.id">{{ cat.nome }}</option>
                </select>
                <p v-if="formErrors.categoria" class="text-xs text-red-500 font-semibold">{{ formErrors.categoria }}</p>
              </div>

              <!-- ═══ Composição de Materiais ═══ -->
              <div class="flex flex-col gap-3">
                <div class="flex items-center justify-between">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Composição de Materiais *</label>
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-800 transition-colors"
                    @click="adicionarComposicao"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
                    Adicionar Material
                  </button>
                </div>

                <p v-if="formErrors.composicoes" class="text-xs text-red-500 font-semibold -mt-1">{{ formErrors.composicoes }}</p>

                <!-- Empty state -->
                <div v-if="form.composicoes.length === 0" class="border-2 border-dashed border-gray-200 rounded-xl px-4 py-6 text-center">
                  <p class="text-sm text-gray-400">Nenhum material adicionado. Clique em "Adicionar Material" acima.</p>
                </div>

                <!-- Composition rows -->
                <div
                  v-for="(comp, idx) in form.composicoes"
                  :key="idx"
                  class="relative border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-3"
                >
                  <!-- Delete button -->
                  <button
                    type="button"
                    class="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Remover material"
                    @click="removerComposicao(idx)"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>

                  <!-- Material select -->
                  <div class="flex flex-col gap-1">
                    <label class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Material {{ idx + 1 }}</label>
                    <select
                      v-model="comp.material_id"
                      class="w-full rounded-lg border px-3 py-2 text-sm font-semibold text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-teal-400 transition-all"
                      :class="comp.errors?.material_id ? 'border-red-400 bg-red-50' : 'border-gray-200'"
                    >
                      <option :value="null">Selecione o material...</option>
                      <option v-for="m in materiaisAtivos" :key="m.id" :value="m.id">{{ m.nome }}</option>
                    </select>
                    <p v-if="comp.errors?.material_id" class="text-[10px] text-red-500 font-semibold">{{ comp.errors.material_id }}</p>
                  </div>

                  <!-- Formula input -->
                  <div class="flex flex-col gap-1">
                    <label class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Fórmula de Consumo</label>
                    <input
                      v-model="comp.formula_consumo"
                      type="text"
                      placeholder="Ex: largura * altura / 10000"
                      class="w-full rounded-lg border px-3 py-2 text-sm font-mono text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-teal-400 transition-all"
                      :class="comp.errors?.formula ? 'border-red-400 bg-red-50' : 'border-gray-200'"
                      @input="validarFormulaRow(idx)"
                    />
                    <p v-if="comp.errors?.formula" class="text-[10px] text-red-500 font-semibold">{{ comp.errors.formula }}</p>

                    <!-- Variable badges -->
                    <div v-if="comp.detectedVars.length > 0" class="flex flex-wrap gap-1 mt-0.5">
                      <span
                        v-for="v in comp.detectedVars"
                        :key="v"
                        class="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                        :class="VARIAVEIS_PERMITIDAS.includes(v as any) ? 'bg-teal-100 text-teal-700' : 'bg-red-100 text-red-600'"
                      >
                        {{ v }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <!-- ═══ Fim Composição ═══ -->

              <!-- Dimensões (opcionais - medidas padrão para exibição) -->
              <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col gap-1.5">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Largura (cm)</label>
                  <input
                    v-model.number="form.largura_cm"
                    type="number"
                    step="0.1"
                    min="0"
                    max="9999"
                    placeholder="Opcional"
                    class="w-full rounded-xl border-2 px-4 py-3 text-sm font-semibold text-gray-800 bg-gray-50 focus:outline-none focus:ring-0 transition-all border-gray-200 focus:border-teal-400"
                  />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Altura (cm)</label>
                  <input
                    v-model.number="form.altura_cm"
                    type="number"
                    step="0.1"
                    min="0"
                    max="9999"
                    placeholder="Opcional"
                    class="w-full rounded-xl border-2 px-4 py-3 text-sm font-semibold text-gray-800 bg-gray-50 focus:outline-none focus:ring-0 transition-all border-gray-200 focus:border-teal-400"
                  />
                </div>
              </div>

              <!-- Preço -->
              <div class="flex flex-col gap-1.5">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Preço de Venda (R$) *</label>
                <input
                  v-model.number="form.preco_venda"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="999999.99"
                  placeholder="0.00"
                  class="w-full rounded-xl border-2 px-4 py-3 text-sm font-semibold text-gray-800 bg-gray-50 focus:outline-none focus:ring-0 transition-all"
                  :class="formErrors.preco_venda ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-teal-400'"
                />
                <p v-if="formErrors.preco_venda" class="text-xs text-red-500 font-semibold">{{ formErrors.preco_venda }}</p>
              </div>

              <!-- Descrição -->
              <div class="flex flex-col gap-1.5">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Descrição</label>
                <textarea
                  v-model="form.descricao"
                  rows="3"
                  maxlength="500"
                  placeholder="Descrição opcional do produto (máx 500 caracteres)"
                  class="w-full rounded-xl border-2 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 bg-gray-50 focus:outline-none focus:border-teal-400 transition-colors resize-none"
                  :class="formErrors.descricao ? 'border-red-400 bg-red-50' : 'border-gray-200'"
                />
                <p v-if="formErrors.descricao" class="text-xs text-red-500 font-semibold">{{ formErrors.descricao }}</p>
              </div>

              <!-- Upload Imagem -->
              <div class="flex flex-col gap-1.5">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Imagem de Referência</label>
                <div class="flex items-center gap-4">
                  <!-- Preview -->
                  <div v-if="imagemPreview || form.imagem_url" class="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200 shrink-0">
                    <img :src="imagemPreview || form.imagem_url!" alt="Preview" class="w-full h-full object-cover" />
                  </div>
                  <!-- Input -->
                  <div class="flex-1">
                    <label
                      class="flex items-center justify-center gap-2 w-full rounded-xl border-2 border-dashed px-4 py-4 text-sm font-semibold cursor-pointer transition-all"
                      :class="formErrors.imagem_url ? 'border-red-300 text-red-400 hover:border-red-400 bg-red-50' : 'border-gray-200 text-gray-400 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50/30'"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/></svg>
                      <span>{{ imagemArquivo ? imagemArquivo.name : 'Selecionar imagem (PNG, JPG, WEBP - max 5MB)' }}</span>
                      <input type="file" accept="image/png,image/jpeg,image/webp" class="hidden" @change="onImagemSelecionada" />
                    </label>
                  </div>
                </div>
                <p v-if="formErrors.imagem_url" class="text-xs text-red-500 font-semibold">{{ formErrors.imagem_url }}</p>
              </div>

              <!-- Processos de Produção -->
              <div>
                <label class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Processos de Produção</label>
                <div v-if="processosDisponiveis.length > 0" class="space-y-1.5 max-h-32 overflow-y-auto rounded-xl border border-gray-200 p-3">
                  <label v-for="p in processosDisponiveis" :key="p.id" class="flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 px-2 py-1.5 rounded-lg transition-colors">
                    <input type="checkbox" :value="p.id" v-model="processosSelecionados" class="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                    <span class="text-sm text-gray-700">{{ p.nome }}</span>
                    <span class="text-[10px] text-gray-400">({{ p.etapas?.length ?? 0 }} etapas)</span>
                  </label>
                </div>
                <p v-else class="text-[10px] text-gray-400 mt-1">Nenhum processo cadastrado. Crie em Processos de Produção.</p>

                <!-- Ordem dos processos selecionados -->
                <div v-if="processosSelecionados.length > 1" class="mt-3 space-y-2">
                  <label class="text-[10px] font-bold text-gray-400 uppercase">Ordem de execução</label>
                  <div class="space-y-1 rounded-lg border border-gray-200 p-2">
                    <div v-for="(pid, idx) in processosSelecionados" :key="pid" class="flex items-center gap-2 px-2 py-2 rounded-md bg-gray-50">
                      <span class="text-[10px] font-black text-gray-400 w-4">{{ idx + 1 }}</span>
                      <span class="text-xs font-medium text-gray-700 flex-1">{{ processosDisponiveis.find(p => p.id === pid)?.nome }}</span>
                      <label v-if="idx > 0" class="flex items-center gap-1 cursor-pointer" :title="processosDepende[idx] ? 'Depende do anterior (sequencial)' : 'Independente (paralelo)'">
                        <input type="checkbox" :checked="processosDepende[idx]" class="w-3.5 h-3.5 rounded border-gray-300 text-red-500 focus:ring-red-400" @change="processosDepende[idx] = !processosDepende[idx]" />
                        <svg class="w-3.5 h-3.5" :class="processosDepende[idx] ? 'text-red-500' : 'text-gray-300'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                      </label>
                      <button v-if="idx > 0" type="button" class="w-5 h-5 rounded bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100" @click="moverProcesso(idx, -1)">
                        <svg class="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>
                      </button>
                      <button v-if="idx < processosSelecionados.length - 1" type="button" class="w-5 h-5 rounded bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100" @click="moverProcesso(idx, 1)">
                        <svg class="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                      </button>
                    </div>
                  </div>
                  <p class="text-[9px] text-gray-400">🔒 = depende do anterior estar concluído</p>
                </div>
              </div>

              <!-- Erro geral -->
              <p v-if="modalError" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{{ modalError }}</p>

              <!-- Ações -->
              <div class="flex gap-3 pb-1">
                <button
                  type="button"
                  class="flex-1 py-3.5 rounded-xl border-2 border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-colors text-sm font-bold"
                  @click="fecharModal"
                >
                  Cancelar
                </button>
                <AppButton variant="primary" size="md" type="submit" :loading="saving" class="flex-1">
                  {{ editandoProduto ? 'Salvar Alterações' : 'Cadastrar Produto' }}
                </AppButton>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- MODAL GERENCIAR CATEGORIAS -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showCategoriasModal"
          class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          @click.self="showCategoriasModal = false"
        >
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 class="text-base font-bold text-gray-800">Gerenciar Categorias</h3>
              <button type="button" class="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors" @click="showCategoriasModal = false">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div class="p-6 space-y-4">
              <!-- Criar nova -->
              <form class="flex gap-2" @submit.prevent="criarCategoria">
                <input
                  v-model="novaCategoriaInput"
                  type="text"
                  placeholder="Nova categoria..."
                  maxlength="50"
                  class="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400 focus:border-teal-400"
                />
                <button
                  type="submit"
                  :disabled="!novaCategoriaInput.trim()"
                  class="px-4 py-2 rounded-lg text-sm font-bold text-white bg-teal-500 hover:bg-teal-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Criar
                </button>
              </form>

              <!-- Lista -->
              <div class="max-h-[300px] overflow-y-auto space-y-1.5">
                <div
                  v-for="cat in categorias"
                  :key="cat.id"
                  class="flex items-center justify-between px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors"
                >
                  <span class="text-sm font-semibold text-gray-700">{{ cat.nome }}</span>
                  <button
                    type="button"
                    class="w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Desativar"
                    @click="excluirCategoria(cat.id)"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
                <p v-if="categorias.length === 0" class="text-sm text-gray-400 text-center py-4">Nenhuma categoria cadastrada</p>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- TOAST DE SUCESSO -->
    <Transition name="slide-fade">
      <div v-if="toastMsg" class="fixed bottom-6 right-6 z-[100] bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-semibold flex items-center gap-2">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd"/></svg>
        {{ toastMsg }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { createSupabaseClient } from '~/lib/supabase'
import { useEmpresa } from '~/composables/useEmpresa'
import { useAdesivos } from '~/composables/useAdesivos'
import { useProcessos, type ProcessoTemplate } from '~/composables/useProcessos'
import { useFormulaParser, VARIAVEIS_PERMITIDAS } from '~/composables/useFormulaParser'
import AppButton from '~/components/AppButton.vue'

// ─── Types ────────────────────────────────────────────────────────────────────
interface ComposicaoRow {
  material_id: number | null
  formula_consumo: string
  detectedVars: string[]
  errors?: {
    material_id?: string
    formula?: string
  }
}

interface ComposicaoLoaded {
  id: number
  material_id: number
  material_nome: string
  preco_unitario: number
  formula_consumo: string
}

interface Produto {
  id: number
  nome: string
  descricao: string | null
  categoria: string
  largura_cm: number
  altura_cm: number
  preco_venda: number
  imagem_url: string | null
  ativo: boolean
  composicoes?: ComposicaoLoaded[]
}

interface Material {
  id: number
  nome: string
  ativo: boolean
}

// ─── Composables ──────────────────────────────────────────────────────────────
const supabase = createSupabaseClient()
const { empresaId, loadEmpresa } = useEmpresa()
const { validarProdutoCatalogo, validarImagemProduto } = useAdesivos()
const { carregarTemplates, vincularProdutoProcessos, desvincularProduto, carregarVinculos } = useProcessos()
const { validarFormula } = useFormulaParser()

const processosDisponiveis = ref<ProcessoTemplate[]>([])
const processosSelecionados = ref<number[]>([])
const processosSequenciais = ref(true)
const processosDepende = ref<boolean[]>([])
const vinculosProcesso = ref<{ produto_id: number; processo_template_id: number; sequencial: boolean }[]>([])

// ─── State ────────────────────────────────────────────────────────────────────
const produtos = ref<Produto[]>([])
const materiaisLista = ref<Material[]>([])
const categorias = ref<{ id: number; nome: string; cor: string | null; ativo: boolean }[]>([])
const showCategoriasModal = ref(false)
const novaCategoriaInput = ref('')
const loading = ref(true)
const error = ref<string | null>(null)
const toastMsg = ref('')
const expandedRows = ref<Set<number>>(new Set())

// Paginação
const PAGE_SIZE = 20
const paginaAtual = ref(1)
const totalItems = ref(0)
const totalPaginas = computed(() => Math.max(1, Math.ceil(totalItems.value / PAGE_SIZE)))

// Filtros
const filtroAberto = ref(false)
const filtroCategoria = ref('')
const filtroMaterial = ref<number | string>('')
const filtroStatus = ref('')

// Modal
const modalAberto = ref(false)
const editandoProduto = ref<Produto | null>(null)
const saving = ref(false)
const modalError = ref<string | null>(null)
const imagemArquivo = ref<File | null>(null)
const imagemPreview = ref<string | null>(null)

const form = reactive({
  nome: '',
  categoria_id: null as number | null,
  categoria: '', // kept for backwards compat with validation
  largura_cm: null as number | null,
  altura_cm: null as number | null,
  preco_venda: null as number | null,
  descricao: '',
  imagem_url: null as string | null,
  composicoes: [] as ComposicaoRow[],
})

const formErrors = reactive({
  nome: '',
  categoria: '',
  largura_cm: '',
  altura_cm: '',
  preco_venda: '',
  descricao: '',
  imagem_url: '',
  composicoes: '',
})

// ─── Computed ─────────────────────────────────────────────────────────────────
const materiaisAtivos = computed(() => materiaisLista.value.filter(m => m.ativo))
const categoriaNomeSelecionada = computed(() => {
  if (!form.categoria_id) return ''
  return categorias.value.find(c => c.id === form.categoria_id)?.nome ?? ''
})

const categoriasUnicas = computed(() => {
  return categorias.value.map(c => c.nome).sort()
})

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatCurrency(val: number | null | undefined): string {
  if (val == null) return 'R$ 0,00'
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function showToast(msg: string) {
  toastMsg.value = msg
  setTimeout(() => { toastMsg.value = '' }, 3000)
}

function limparFiltros() {
  filtroCategoria.value = ''
  filtroMaterial.value = ''
  filtroStatus.value = ''
}

function toggleExpand(produtoId: number) {
  if (expandedRows.value.has(produtoId)) {
    expandedRows.value.delete(produtoId)
  } else {
    expandedRows.value.add(produtoId)
  }
}

// ─── Composição helpers ───────────────────────────────────────────────────────
function adicionarComposicao() {
  form.composicoes.push({
    material_id: null,
    formula_consumo: 'largura * altura',
    detectedVars: ['largura', 'altura'],
    errors: {},
  })
  formErrors.composicoes = ''
}

function removerComposicao(idx: number) {
  form.composicoes.splice(idx, 1)
}

function validarFormulaRow(idx: number) {
  const comp = form.composicoes[idx]
  if (!comp.formula_consumo.trim()) {
    comp.detectedVars = []
    comp.errors = { ...comp.errors, formula: 'Fórmula é obrigatória' }
    return
  }
  const result = validarFormula(comp.formula_consumo)
  comp.detectedVars = result.variables
  if (!result.valid) {
    comp.errors = { ...comp.errors, formula: result.error ?? 'Fórmula inválida' }
  } else {
    comp.errors = { ...comp.errors, formula: undefined }
  }
}

function validarTodasComposicoes(): boolean {
  let valid = true

  if (form.composicoes.length === 0) {
    formErrors.composicoes = 'Adicione pelo menos um material à composição'
    return false
  }

  formErrors.composicoes = ''

  for (let i = 0; i < form.composicoes.length; i++) {
    const comp = form.composicoes[i]
    const errors: ComposicaoRow['errors'] = {}

    if (!comp.material_id) {
      errors.material_id = 'Selecione um material'
      valid = false
    }

    if (!comp.formula_consumo.trim()) {
      errors.formula = 'Fórmula é obrigatória'
      valid = false
    } else {
      const result = validarFormula(comp.formula_consumo)
      if (!result.valid) {
        errors.formula = result.error ?? 'Fórmula inválida'
        valid = false
      }
    }

    comp.errors = errors
  }

  return valid
}

// ─── Fetch ────────────────────────────────────────────────────────────────────
async function fetchProdutos() {
  if (!empresaId.value) return
  loading.value = true
  error.value = null

  try {
    let query = supabase
      .from('catalogo_adesivos')
      .select('*', { count: 'exact' })
      .eq('empresa_id', empresaId.value)
      .order('nome', { ascending: true })

    // Filtros
    if (filtroCategoria.value) {
      query = query.eq('categoria', filtroCategoria.value)
    }
    if (filtroStatus.value === 'ativo') {
      query = query.eq('ativo', true)
    } else if (filtroStatus.value === 'inativo') {
      query = query.eq('ativo', false)
    }

    // Paginação
    const from = (paginaAtual.value - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1
    query = query.range(from, to)

    const { data, error: fetchErr, count } = await query

    if (fetchErr) throw fetchErr

    const produtosRaw = (data ?? []) as Omit<Produto, 'composicoes'>[]
    const produtoIds = produtosRaw.map(p => p.id)

    // Fetch compositions for all products in this page
    let composicoesMap: Record<number, ComposicaoLoaded[]> = {}
    if (produtoIds.length > 0) {
      const { data: comps } = await supabase
        .from('catalogo_produto_materiais')
        .select('id, produto_id, material_id, formula_consumo, ordem, materiais_adesivo(nome, preco_m2)')
        .in('produto_id', produtoIds)
        .order('ordem', { ascending: true })

      if (comps) {
        for (const c of comps as any[]) {
          const prodId = c.produto_id as number
          if (!composicoesMap[prodId]) composicoesMap[prodId] = []
          composicoesMap[prodId].push({
            id: c.id,
            material_id: c.material_id,
            material_nome: c.materiais_adesivo?.nome ?? '—',
            preco_unitario: c.materiais_adesivo?.preco_m2 ?? 0,
            formula_consumo: c.formula_consumo,
          })
        }
      }
    }

    // Filter by material if set (client-side since column is now in junction table)
    let filtered = produtosRaw.map(p => ({
      ...p,
      composicoes: composicoesMap[p.id] ?? [],
    })) as Produto[]

    if (filtroMaterial.value) {
      const matId = Number(filtroMaterial.value)
      filtered = filtered.filter(p =>
        p.composicoes?.some(c => c.material_id === matId)
      )
    }

    produtos.value = filtered
    totalItems.value = filtroMaterial.value ? filtered.length : (count ?? 0)
  } catch (e: any) {
    error.value = e.message || 'Erro ao carregar produtos'
    console.error('[adesivos-catalogo] fetchProdutos error:', e)
  } finally {
    loading.value = false
  }
}

async function fetchMateriais() {
  if (!empresaId.value) return

  const { data } = await supabase
    .from('materiais_adesivo')
    .select('id, nome, ativo')
    .eq('empresa_id', empresaId.value)
    .order('nome', { ascending: true })

  materiaisLista.value = (data ?? []) as Material[]
}

async function fetchCategorias() {
  if (!empresaId.value) return

  const { data } = await supabase
    .from('catalogo_categorias')
    .select('id, nome, cor, ativo')
    .eq('empresa_id', empresaId.value)
    .eq('ativo', true)
    .order('nome', { ascending: true })

  categorias.value = (data ?? []) as typeof categorias.value
}

async function criarCategoria() {
  const nome = novaCategoriaInput.value.trim()
  if (!nome || !empresaId.value) return

  const { data, error: insertErr } = await supabase
    .from('catalogo_categorias')
    .insert({ empresa_id: empresaId.value, nome })
    .select('id, nome, cor, ativo')
    .single()

  if (insertErr) {
    console.error('Erro ao criar categoria:', insertErr.message)
    return
  }

  categorias.value.push(data as any)
  categorias.value.sort((a, b) => a.nome.localeCompare(b.nome))
  novaCategoriaInput.value = ''
}

async function excluirCategoria(catId: number) {
  await supabase.from('catalogo_categorias').update({ ativo: false }).eq('id', catId)
  categorias.value = categorias.value.filter(c => c.id !== catId)
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function irParaPagina(pagina: number) {
  if (pagina < 1 || pagina > totalPaginas.value) return
  paginaAtual.value = pagina
  fetchProdutos()
}

// Reset page on filter change
watch([filtroCategoria, filtroMaterial, filtroStatus], () => {
  paginaAtual.value = 1
  fetchProdutos()
})

// ─── Toggle Ativo ─────────────────────────────────────────────────────────────
async function toggleAtivo(produto: Produto) {
  const novoStatus = !produto.ativo
  const { error: updateErr } = await supabase
    .from('catalogo_adesivos')
    .update({ ativo: novoStatus })
    .eq('id', produto.id)

  if (updateErr) {
    showToast('Erro ao atualizar status')
    console.error(updateErr)
    return
  }

  produto.ativo = novoStatus
  showToast(novoStatus ? 'Produto ativado' : 'Produto desativado')
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function resetForm() {
  form.nome = ''
  form.categoria_id = null
  form.categoria = ''
  form.largura_cm = null
  form.altura_cm = null
  form.preco_venda = null
  form.descricao = ''
  form.imagem_url = null
  form.composicoes = []
  imagemArquivo.value = null
  imagemPreview.value = null
  modalError.value = null
  Object.keys(formErrors).forEach(k => (formErrors as any)[k] = '')
}

function abrirCriar() {
  resetForm()
  editandoProduto.value = null
  modalAberto.value = true
}

async function abrirEditar(produto: Produto) {
  resetForm()
  editandoProduto.value = produto
  form.nome = produto.nome
  form.categoria_id = (produto as any).categoria_id ?? null
  form.categoria = produto.categoria
  form.largura_cm = produto.largura_cm
  form.altura_cm = produto.altura_cm
  form.preco_venda = produto.preco_venda
  form.descricao = produto.descricao ?? ''
  form.imagem_url = produto.imagem_url

  // Load compositions for this product
  const { data: comps } = await supabase
    .from('catalogo_produto_materiais')
    .select('id, material_id, formula_consumo, ordem, materiais_adesivo(nome, preco_m2)')
    .eq('produto_id', produto.id)
    .order('ordem', { ascending: true })

  if (comps && comps.length > 0) {
    form.composicoes = (comps as any[]).map(c => {
      const result = validarFormula(c.formula_consumo)
      return {
        material_id: c.material_id,
        formula_consumo: c.formula_consumo,
        detectedVars: result.variables,
        errors: {},
      } as ComposicaoRow
    })
  }

  // Pre-selecionar processos vinculados
  const vinculosProduto = vinculosProcesso.value.filter(v => v.produto_id === produto.id)
  processosSelecionados.value = vinculosProduto.map(v => v.processo_template_id)
  processosDepende.value = vinculosProduto.map(v => v.sequencial)
  processosSequenciais.value = true

  modalAberto.value = true
}

function fecharModal() {
  modalAberto.value = false
  editandoProduto.value = null
  processosSelecionados.value = []
  processosDepende.value = []
  processosSequenciais.value = true
}

function moverProcesso(idx: number, dir: -1 | 1) {
  const arr = [...processosSelecionados.value]
  const newIdx = idx + dir
  if (newIdx < 0 || newIdx >= arr.length) return
  ;[arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]]
  processosSelecionados.value = arr
}

// ─── Image handling ───────────────────────────────────────────────────────────
function onImagemSelecionada(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  // Validate using composable
  const validation = validarImagemProduto({ name: file.name, size: file.size, type: file.type })
  if (!validation.valid) {
    formErrors.imagem_url = Object.values(validation.errors).join('. ')
    input.value = ''
    return
  }

  formErrors.imagem_url = ''
  imagemArquivo.value = file
  imagemPreview.value = URL.createObjectURL(file)
}

async function uploadImagem(): Promise<string | null> {
  if (!imagemArquivo.value || !empresaId.value) return null

  const ext = imagemArquivo.value.name.split('.').pop()?.toLowerCase() ?? 'png'
  const fileName = `${empresaId.value}/catalogo/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { error: uploadErr } = await supabase.storage
    .from('artes-cliente')
    .upload(fileName, imagemArquivo.value, {
      contentType: imagemArquivo.value.type,
      upsert: false,
    })

  if (uploadErr) {
    throw new Error(`Erro no upload: ${uploadErr.message}`)
  }

  const { data: urlData } = supabase.storage
    .from('artes-cliente')
    .getPublicUrl(fileName)

  return urlData.publicUrl
}

// ─── Save ─────────────────────────────────────────────────────────────────────
async function salvar() {
  // Clear errors
  Object.keys(formErrors).forEach(k => (formErrors as any)[k] = '')
  modalError.value = null

  // Validate base fields with composable (pass dummy material_id since it's removed)
  const validation = validarProdutoCatalogo({
    nome: form.nome,
    categoria: categoriaNomeSelecionada.value || '',
    material_id: 1, // dummy — no longer validated, composicoes replace this
    largura_cm: form.largura_cm,
    altura_cm: form.altura_cm,
    preco_venda: form.preco_venda,
    descricao: form.descricao || null,
    imagem_url: form.imagem_url,
  })

  // Remove material_id error from validation since we use composicoes now
  delete validation.errors.material_id

  // Image is optional — no validation needed

  // Validate compositions
  const composicoesValid = validarTodasComposicoes()

  if (!validation.valid || Object.keys(validation.errors).length > 0) {
    // Map errors to formErrors
    Object.entries(validation.errors).forEach(([key, msg]) => {
      if (key in formErrors) (formErrors as any)[key] = msg
    })
    if (!composicoesValid) return
    return
  }

  if (!composicoesValid) return

  saving.value = true

  try {
    // Upload image if a new file was selected
    let imagemUrl = form.imagem_url
    if (imagemArquivo.value) {
      imagemUrl = await uploadImagem()
    }

    const payload = {
      nome: form.nome.trim(),
      categoria: categoriaNomeSelecionada.value || '',
      categoria_id: form.categoria_id,
      largura_cm: form.largura_cm || null,
      altura_cm: form.altura_cm || null,
      preco_venda: form.preco_venda!,
      descricao: form.descricao?.trim() || null,
      imagem_url: imagemUrl,
      empresa_id: empresaId.value!,
    }

    let produtoId: number

    if (editandoProduto.value) {
      // UPDATE product
      const { error: updateErr } = await supabase
        .from('catalogo_adesivos')
        .update(payload)
        .eq('id', editandoProduto.value.id)

      if (updateErr) throw updateErr
      produtoId = editandoProduto.value.id
    } else {
      // INSERT product
      const { data: inserted, error: insertErr } = await supabase
        .from('catalogo_adesivos')
        .insert(payload)
        .select('id')
        .single()

      if (insertErr) throw insertErr
      produtoId = inserted.id
    }

    // ─── Save compositions ────────────────────────────────────────
    // Delete old compositions
    await supabase
      .from('catalogo_produto_materiais')
      .delete()
      .eq('produto_id', produtoId)

    // Insert new compositions
    const composicoesPayload = form.composicoes.map((comp, idx) => ({
      empresa_id: empresaId.value!,
      produto_id: produtoId,
      material_id: comp.material_id!,
      formula_consumo: comp.formula_consumo.trim(),
      ordem: idx,
    }))

    if (composicoesPayload.length > 0) {
      const { error: compErr } = await supabase
        .from('catalogo_produto_materiais')
        .insert(composicoesPayload)

      if (compErr) throw compErr
    }

    // Salvar vínculo processo ↔ produto
    const produtoIdFinal = produtoId
    await vincularProdutoProcessos(produtoIdFinal, processosSelecionados.value, processosDepende.value)
    vinculosProcesso.value = await carregarVinculos()

    showToast(editandoProduto.value ? 'Produto atualizado com sucesso' : 'Produto cadastrado com sucesso')
    fecharModal()
    await fetchProdutos()
  } catch (e: any) {
    modalError.value = e.message || 'Erro ao salvar produto'
    console.error('[adesivos-catalogo] salvar error:', e)
  } finally {
    saving.value = false
  }
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(async () => {
  await loadEmpresa()
  await Promise.all([fetchProdutos(), fetchMateriais(), fetchCategorias()])
  processosDisponiveis.value = await carregarTemplates()
  vinculosProcesso.value = await carregarVinculos()
})
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
