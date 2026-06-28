<template>
  <div class="min-h-full p-3 sm:p-6">

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
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-semibold text-white/80 uppercase tracking-widest">Produção</span>
                <span class="w-1 h-1 rounded-full bg-white/40" />
                <span class="text-xs text-white/50 hidden sm:inline">Materiais</span>
              </div>
              <h1 class="text-xl sm:text-3xl font-bold text-white tracking-tight leading-none">Materiais</h1>
              <p class="text-sm text-gray-300/80 mt-1.5">
                {{ loading ? 'Carregando...' : `${materiais.length} material(is) cadastrado(s)` }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <button
              type="button"
              class="inline-flex items-center gap-2 text-sm font-bold px-3 sm:px-5 py-2.5 rounded-xl bg-amber-500 text-gray-950 hover:bg-amber-400 shadow-lg shadow-amber-900/30 transition-all duration-200 hover:scale-[1.02]"
              @click="abrirCriar"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
              <span class="hidden sm:inline">Novo Material</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="flex flex-col items-center justify-center gap-4 py-32">
      <span class="inline-block w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      <span class="text-sm text-gray-400 font-medium">Carregando materiais...</span>
    </div>

    <!-- ERRO -->
    <div v-else-if="error" class="flex items-center gap-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-2xl px-6 py-4">
      <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" d="M12 8v4m0 4h.01"/></svg>
      {{ error }}
    </div>

    <!-- TABELA DE MATERIAIS -->
    <div v-else class="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
      <div class="flex items-center justify-between px-7 py-4 border-b border-gray-100 bg-gray-50/50">
        <span class="text-sm font-semibold text-gray-600">
          <span class="text-indigo-600 font-black">{{ materiais.length }}</span>
          material(is)
        </span>
        <span class="text-xs text-gray-400">Ordenado por nome (A–Z)</span>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="text-left px-6 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Nome</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Tipo</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Descrição</th>
              <th class="text-right px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Preço</th>
              <th class="text-center px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Unidade</th>
              <th class="text-right px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Estoque Mín.</th>
              <th class="text-center px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Status</th>
              <th class="px-6 py-4 text-right text-xs font-extrabold text-gray-400 uppercase tracking-widest w-28">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-if="materiais.length === 0">
              <td colspan="8" class="text-center py-20">
                <div class="flex flex-col items-center gap-3">
                  <svg class="w-14 h-14 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.25" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                  </svg>
                  <span class="text-base font-semibold text-gray-400">Nenhum material cadastrado</span>
                  <span class="text-sm text-gray-400">Clique em "Novo Material" para começar</span>
                </div>
              </td>
            </tr>
            <tr
              v-for="mat in materiais"
              :key="mat.id"
              class="hover:bg-indigo-50/30 transition-colors duration-150 group"
            >
              <td class="px-6 py-4">
                <span class="font-semibold text-gray-800">{{ mat.nome }}</span>
              </td>
              <td class="px-5 py-4">
                <span v-if="mat.tipo" class="inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">{{ mat.tipo }}</span>
                <span v-else class="text-gray-300">—</span>
              </td>
              <td class="px-5 py-4">
                <span class="text-gray-500 max-w-[200px] block truncate">{{ mat.descricao || '—' }}</span>
              </td>
              <td class="px-5 py-4 text-right">
                <span class="font-bold text-gray-800 whitespace-nowrap">{{ formatCurrency(mat.preco_m2) }}/{{ mat.unidade_medida || 'm²' }}</span>
              </td>
              <td class="px-5 py-4 text-center">
                <span v-if="mat.unidade_medida" class="text-xs font-semibold text-gray-600">{{ mat.unidade_medida }}</span>
                <span v-else class="text-gray-300">m²</span>
              </td>
              <td class="px-5 py-4 text-right">
                <span class="text-gray-600">{{ mat.estoque_minimo ?? 0 }} {{ mat.unidade_medida || 'm²' }}</span>
              </td>
              <td class="px-5 py-4 text-center">
                <span
                  :class="['inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full', mat.ativo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600']"
                >
                  <span :class="['w-1.5 h-1.5 rounded-full', mat.ativo ? 'bg-green-500' : 'bg-red-500']" />
                  {{ mat.ativo ? 'Ativo' : 'Inativo' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    class="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-indigo-500 hover:bg-indigo-100 transition-colors"
                    title="Editar"
                    @click="abrirEditar(mat)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/></svg>
                  </button>
                  <button
                    type="button"
                    class="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm transition-colors"
                    :class="mat.ativo ? 'text-red-400 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'"
                    :title="mat.ativo ? 'Desativar' : 'Ativar'"
                    @click="confirmarToggle(mat)"
                  >
                    <svg v-if="mat.ativo" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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
          <div class="bg-white rounded-2xl shadow-2xl w-full sm:max-w-5xl flex flex-col overflow-hidden" style="max-height:92vh">

            <!-- Header -->
            <div class="px-6 sm:px-8 py-5 border-b border-gray-100 shrink-0">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                    <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                  </div>
                  <div>
                    <h2 class="text-lg font-bold text-gray-900 leading-tight">{{ editandoMaterial ? 'Editar Material' : 'Novo material' }}</h2>
                    <p class="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                      Cadastre um novo item para o estoque
                      <span class="inline-flex items-center px-2 py-0.5 rounded-md bg-orange-50 text-orange-600 text-[10px] font-semibold uppercase tracking-wide">Cadastro</span>
                    </p>
                  </div>
                </div>
                <button type="button" class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors" @click="fecharModal">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </div>

            <!-- Body: 2-column layout -->
            <div class="flex flex-1 overflow-hidden">

              <!-- Left column: scrollable form -->
              <div class="flex-1 overflow-y-auto px-6 sm:px-8 py-6">
                <form id="material-form" class="flex flex-col gap-6" @submit.prevent="salvar">

                  <!-- Section 1: Dados do material -->
                  <div class="space-y-5">
                    <div class="flex items-center gap-3 mb-1">
                      <span class="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">1</span>
                      <h3 class="text-sm font-bold text-gray-900">Dados do material</h3>
                    </div>

                    <!-- Nome -->
                    <div class="flex flex-col gap-1.5">
                      <label class="text-xs font-semibold text-gray-600">Nome *</label>
                      <input
                        v-model="form.nome"
                        type="text"
                        maxlength="100"
                        placeholder="Ex: Vinil adesivo brilhante"
                        class="w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                        :class="formErrors.nome ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-orange-400'"
                      />
                      <p v-if="formErrors.nome" class="text-xs text-red-500 font-medium flex items-center gap-1">
                        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
                        {{ formErrors.nome }}
                      </p>
                    </div>

                    <!-- Descrição -->
                    <div class="flex flex-col gap-1.5">
                      <label class="text-xs font-semibold text-gray-600">Descrição</label>
                      <textarea
                        v-model="form.descricao"
                        rows="3"
                        maxlength="500"
                        placeholder="Descrição opcional do material..."
                        class="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 transition-colors resize-none"
                      />
                    </div>

                    <!-- Grid: Preço + Estoque Mínimo -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-semibold text-gray-600">Preço por {{ form.unidade_medida || 'm²' }} (R$) *</label>
                        <input
                          v-model.number="form.preco_m2"
                          type="number"
                          step="0.01"
                          min="0.01"
                          max="99999.99"
                          placeholder="0,00"
                          class="w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                          :class="formErrors.preco_m2 ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-orange-400'"
                        />
                        <p v-if="formErrors.preco_m2" class="text-xs text-red-500 font-medium flex items-center gap-1">
                          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
                          {{ formErrors.preco_m2 }}
                        </p>
                      </div>
                      <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-semibold text-gray-600">Estoque Mínimo ({{ form.unidade_medida || 'm²' }})</label>
                        <input
                          v-model.number="form.estoque_minimo"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0"
                          class="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 transition-all"
                        />
                      </div>
                    </div>

                    <!-- Nota -->
                    <p class="text-xs text-gray-400 italic">Valor base utilizado para cálculo de consumo e custos.</p>

                    <!-- Grid: Tipo + Unidade -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-semibold text-gray-600">Tipo</label>
                        <input
                          v-model="form.tipo"
                          type="text"
                          maxlength="50"
                          placeholder="Ex: Vinil, Lona, ACM, Papel..."
                          class="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-gray-400"
                        />
                      </div>
                      <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-semibold text-gray-600">Unidade de Medida</label>
                        <select
                          v-model="form.unidade_medida"
                          class="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 transition-all"
                        >
                          <option value="">m² (padrão)</option>
                          <option value="m²">m²</option>
                          <option value="m">metro linear</option>
                          <option value="un">unidade</option>
                          <option value="kg">kg</option>
                          <option value="L">litro</option>
                          <option value="rolo">rolo</option>
                          <option value="chapa">chapa</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <!-- Section 2: Classificação e controle -->
                  <div class="space-y-4 pt-2 border-t border-gray-100">
                    <div class="flex items-center gap-3 mb-1">
                      <span class="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">2</span>
                      <h3 class="text-sm font-bold text-gray-900">Classificação e controle</h3>
                    </div>

                    <!-- Checkboxes de classificação -->
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <label class="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:border-orange-200 hover:bg-orange-50/30 transition-all cursor-pointer">
                        <input v-model="form.controle_estoque" type="checkbox" class="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400" />
                        <div class="flex items-center gap-2">
                          <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m19.5 0a4.5 4.5 0 00-.87-1.838L18.122 2.87A2.25 2.25 0 0016.317 2H7.683a2.25 2.25 0 00-1.805.87L2.12 5.662A4.5 4.5 0 001.25 7.5"/></svg>
                          <span class="text-xs font-medium text-gray-700">Ativar controle de estoque</span>
                        </div>
                      </label>
                      <label class="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:border-orange-200 hover:bg-orange-50/30 transition-all cursor-pointer">
                        <input v-model="form.uso_orcamentos" type="checkbox" class="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400" />
                        <div class="flex items-center gap-2">
                          <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>
                          <span class="text-xs font-medium text-gray-700">Permitir uso em orçamentos</span>
                        </div>
                      </label>
                      <label class="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:border-orange-200 hover:bg-orange-50/30 transition-all cursor-pointer">
                        <input v-model="form.material_padrao" type="checkbox" class="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400" />
                        <div class="flex items-center gap-2">
                          <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/></svg>
                          <span class="text-xs font-medium text-gray-700">Material padrão</span>
                        </div>
                      </label>
                    </div>

                    <!-- Status (apenas na edição) -->
                    <div v-if="editandoMaterial" class="flex flex-col gap-2">
                      <label class="text-xs font-semibold text-gray-600">Status</label>
                      <div class="flex gap-2">
                        <button
                          type="button"
                          class="flex-1 text-xs font-bold py-2.5 rounded-lg border transition-colors"
                          :class="form.ativo ? 'bg-green-50 border-green-400 text-green-800' : 'border-gray-200 text-gray-500 hover:border-green-400 hover:text-green-700 bg-white'"
                          @click="form.ativo = true"
                        >
                          Ativo
                        </button>
                        <button
                          type="button"
                          class="flex-1 text-xs font-bold py-2.5 rounded-lg border transition-colors"
                          :class="!form.ativo ? 'bg-red-50 border-red-400 text-red-800' : 'border-gray-200 text-gray-500 hover:border-red-400 hover:text-red-700 bg-white'"
                          @click="form.ativo = false"
                        >
                          Inativo
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Erro geral do modal -->
                  <p v-if="modalError" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{{ modalError }}</p>

                  <!-- Botões mobile -->
                  <div class="flex gap-3 pb-1 sm:hidden">
                    <button
                      type="button"
                      class="flex-1 py-3 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-colors text-sm font-semibold"
                      @click="fecharModal"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      class="flex-1 py-3 rounded-lg bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm transition-colors disabled:opacity-60"
                      :disabled="saving"
                    >
                      <span v-if="saving" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                      {{ saving ? 'Salvando...' : (editandoMaterial ? 'Salvar Alterações' : 'Cadastrar Material') }}
                    </button>
                  </div>
                </form>
              </div>

              <!-- Right sidebar -->
              <div class="w-[320px] border-l border-gray-100 bg-gray-50/50 hidden sm:flex flex-col p-6 overflow-y-auto">

                <!-- Resumo do material -->
                <div class="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                  <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wide">Resumo do material</h4>
                  <div class="space-y-3">
                    <div class="flex justify-between items-start">
                      <span class="text-xs text-gray-500">Nome</span>
                      <span class="text-xs font-semibold text-gray-800 text-right max-w-[140px] truncate">{{ form.nome || 'Novo material' }}</span>
                    </div>
                    <div class="flex justify-between items-start">
                      <span class="text-xs text-gray-500">Tipo</span>
                      <span class="text-xs font-semibold text-gray-800">{{ form.tipo || 'Não definido' }}</span>
                    </div>
                    <div class="flex justify-between items-start">
                      <span class="text-xs text-gray-500">Unidade</span>
                      <span class="text-xs font-semibold text-gray-800">{{ form.unidade_medida || 'm²' }}</span>
                    </div>
                    <div class="flex justify-between items-start">
                      <span class="text-xs text-gray-500">Preço base</span>
                      <span class="text-xs font-semibold text-gray-800">{{ formatCurrency(form.preco_m2 ?? 0) }}</span>
                    </div>
                    <div class="flex justify-between items-start">
                      <span class="text-xs text-gray-500">Estoque mínimo</span>
                      <span class="text-xs font-semibold text-gray-800">{{ form.estoque_minimo || '0' }} {{ form.unidade_medida || 'm²' }}</span>
                    </div>
                    <div class="flex justify-between items-center pt-2 border-t border-gray-100">
                      <span class="text-xs text-gray-500">Status</span>
                      <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600">
                        <span class="w-1.5 h-1.5 rounded-full bg-orange-500" />
                        Rascunho
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Info notice -->
                <div class="mt-4 bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <p class="text-xs text-orange-700 leading-relaxed">
                    Antes de cadastrar, revise o preço, unidade e regras de controle deste material.
                  </p>
                </div>

                <!-- Sidebar buttons -->
                <div class="mt-auto pt-6 flex flex-col gap-2.5">
                  <button
                    type="submit"
                    form="material-form"
                    class="w-full py-2.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm transition-colors disabled:opacity-60"
                    :disabled="saving"
                  >
                    <span v-if="saving" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                    {{ saving ? 'Salvando...' : (editandoMaterial ? 'Salvar Alterações' : 'Cadastrar material') }}
                  </button>
                  <button
                    type="submit"
                    form="material-form"
                    class="w-full py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 font-semibold text-sm transition-colors disabled:opacity-60"
                    :disabled="saving"
                  >
                    Salvar rascunho
                  </button>
                  <button
                    type="button"
                    class="w-full py-2.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 font-medium text-sm transition-colors flex items-center justify-center gap-1.5"
                    @click="fecharModal"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                    Cancelar
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- MODAL CONFIRMAÇÃO TOGGLE -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="toggleTarget"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md px-4"
          @click.self="toggleTarget = null"
        >
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div class="flex flex-col items-center gap-4 px-8 pt-8 pb-4">
              <div class="w-16 h-16 rounded-full flex items-center justify-center" :class="toggleTarget.ativo ? 'bg-red-100' : 'bg-green-100'">
                <svg v-if="toggleTarget.ativo" class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
                <svg v-else class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <h2 class="text-xl font-bold text-gray-800">{{ toggleTarget.ativo ? 'Desativar material?' : 'Ativar material?' }}</h2>
              <p class="text-sm text-gray-500 text-center leading-relaxed">
                <template v-if="toggleTarget.ativo">
                  O material <strong class="text-gray-800">{{ toggleTarget.nome }}</strong> não poderá ser selecionado em novos orçamentos e produtos.
                </template>
                <template v-else>
                  O material <strong class="text-gray-800">{{ toggleTarget.nome }}</strong> voltará a ficar disponível para uso.
                </template>
              </p>
            </div>
            <div class="flex gap-3 px-8 pb-8 pt-4">
              <button type="button" class="flex-1 py-3 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors text-sm font-semibold" @click="toggleTarget = null">
                Cancelar
              </button>
              <button
                type="button"
                class="flex-1 py-3 rounded-xl font-bold text-sm transition-colors shadow-sm disabled:opacity-60"
                :class="toggleTarget.ativo ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-200' : 'bg-green-500 hover:bg-green-600 text-white shadow-green-200'"
                :disabled="toggling"
                @click="executarToggle"
              >
                <span v-if="toggling" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                {{ toggleTarget.ativo ? 'Desativar' : 'Ativar' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- TOAST DE SUCESSO -->
    <Transition name="slide-fade">
      <div
        v-if="successMsg"
        class="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg shadow-green-200/40"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <span class="text-sm font-semibold">{{ successMsg }}</span>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { createSupabaseClient } from '~/lib/supabase'

// ─── Types ───────────────────────────────────────────────────────────────────
interface Material {
  id: number
  nome: string
  descricao: string | null
  preco_m2: number
  estoque_minimo: number
  ativo: boolean
  created_at: string | null
  tipo: string | null
  unidade_medida: string | null
}

// ─── Composables ─────────────────────────────────────────────────────────────
const supabase = createSupabaseClient()
const { empresaId, loadEmpresa } = useEmpresa()
const { validarMaterial } = useAdesivos()
const { formatCurrency } = useLocale()

// ─── State ───────────────────────────────────────────────────────────────────
const materiais   = ref<Material[]>([])
const loading     = ref(true)
const error       = ref<string | null>(null)
const saving      = ref(false)
const modalError  = ref<string | null>(null)
const successMsg  = ref<string | null>(null)

const modalAberto       = ref(false)
const editandoMaterial  = ref<Material | null>(null)

const toggleTarget = ref<Material | null>(null)
const toggling     = ref(false)

const form = reactive({
  nome: '',
  descricao: '',
  preco_m2: null as number | null,
  estoque_minimo: 0,
  ativo: true,
  tipo: '',
  unidade_medida: '',
  controle_estoque: false,
  uso_orcamentos: true,
  material_padrao: false,
})
const formErrors = reactive({ nome: '', preco_m2: '' })

// ─── Helpers ─────────────────────────────────────────────────────────────────
function showSuccess(msg: string) {
  successMsg.value = msg
  setTimeout(() => { successMsg.value = null }, 3000)
}

// ─── Fetch ───────────────────────────────────────────────────────────────────
onMounted(async () => {
  await loadEmpresa()
  await fetchMateriais()
})

async function fetchMateriais() {
  loading.value = true
  error.value = null

  const { data, error: fetchError } = await supabase
    .from('materiais_adesivo')
    .select('id, nome, descricao, preco_m2, estoque_minimo, ativo, created_at, tipo, unidade_medida')
    .eq('empresa_id', empresaId.value!)
    .order('nome', { ascending: true })

  loading.value = false
  if (fetchError) { error.value = fetchError.message; return }
  materiais.value = (data ?? []) as Material[]
}

// ─── Modal Criar / Editar ────────────────────────────────────────────────────
function resetForm() {
  form.nome = ''
  form.descricao = ''
  form.preco_m2 = null
  form.estoque_minimo = 0
  form.ativo = true
  form.tipo = ''
  form.unidade_medida = ''
  form.controle_estoque = false
  form.uso_orcamentos = true
  form.material_padrao = false
  formErrors.nome = ''
  formErrors.preco_m2 = ''
  modalError.value = null
}

function abrirCriar() {
  resetForm()
  editandoMaterial.value = null
  modalAberto.value = true
}

function abrirEditar(mat: Material) {
  resetForm()
  editandoMaterial.value = mat
  form.nome = mat.nome
  form.descricao = mat.descricao ?? ''
  form.preco_m2 = mat.preco_m2
  form.estoque_minimo = mat.estoque_minimo
  form.ativo = mat.ativo
  form.tipo = mat.tipo ?? ''
  form.unidade_medida = mat.unidade_medida ?? ''
  form.controle_estoque = (mat as any).controle_estoque ?? false
  form.uso_orcamentos = (mat as any).uso_orcamentos ?? true
  form.material_padrao = (mat as any).material_padrao ?? false
  modalAberto.value = true
}

function fecharModal() {
  modalAberto.value = false
  editandoMaterial.value = null
}

async function salvar() {
  // Reset errors
  formErrors.nome = ''
  formErrors.preco_m2 = ''
  modalError.value = null

  // Validate with composable
  const validation = validarMaterial({ nome: form.nome, preco_m2: form.preco_m2 })
  if (!validation.valid) {
    if (validation.errors.nome) formErrors.nome = validation.errors.nome
    if (validation.errors.preco_m2) formErrors.preco_m2 = validation.errors.preco_m2
    return
  }

  // Check duplicate name within same empresa
  const nomeTrimmed = form.nome.trim()
  const { data: existing } = await supabase
    .from('materiais_adesivo')
    .select('id')
    .eq('empresa_id', empresaId.value!)
    .ilike('nome', nomeTrimmed)
    .limit(1)

  if (existing && existing.length > 0) {
    const isDuplicate = editandoMaterial.value
      ? existing.some(e => e.id !== editandoMaterial.value!.id)
      : true
    if (isDuplicate) {
      formErrors.nome = 'Já existe um material com este nome na sua empresa'
      return
    }
  }

  saving.value = true

  if (editandoMaterial.value) {
    // Editar
    const { error: updateError } = await supabase
      .from('materiais_adesivo')
      .update({
        nome: nomeTrimmed,
        descricao: form.descricao.trim() || null,
        preco_m2: form.preco_m2!,
        estoque_minimo: form.estoque_minimo,
        ativo: form.ativo,
        tipo: form.tipo.trim() || null,
        unidade_medida: form.unidade_medida.trim() || null,
        controle_estoque: form.controle_estoque,
        uso_orcamentos: form.uso_orcamentos,
        material_padrao: form.material_padrao,
      })
      .eq('id', editandoMaterial.value.id)

    saving.value = false
    if (updateError) { modalError.value = updateError.message; return }

    // Update local state
    const idx = materiais.value.findIndex(m => m.id === editandoMaterial.value!.id)
    if (idx !== -1) {
      materiais.value[idx] = {
        ...materiais.value[idx],
        nome: nomeTrimmed,
        descricao: form.descricao.trim() || null,
        preco_m2: form.preco_m2!,
        estoque_minimo: form.estoque_minimo,
        ativo: form.ativo,
        tipo: form.tipo.trim() || null,
        unidade_medida: form.unidade_medida.trim() || null,
      }
      // Re-sort alphabetically
      materiais.value.sort((a, b) => a.nome.localeCompare(b.nome))
    }
    fecharModal()
    showSuccess('Material atualizado com sucesso')
  } else {
    // Criar
    const { data, error: insertError } = await supabase
      .from('materiais_adesivo')
      .insert({
        empresa_id: empresaId.value!,
        nome: nomeTrimmed,
        descricao: form.descricao.trim() || null,
        preco_m2: form.preco_m2!,
        estoque_minimo: form.estoque_minimo,
        ativo: true,
        tipo: form.tipo.trim() || null,
        unidade_medida: form.unidade_medida.trim() || null,
        controle_estoque: form.controle_estoque,
        uso_orcamentos: form.uso_orcamentos,
        material_padrao: form.material_padrao,
      })
      .select('id, nome, descricao, preco_m2, estoque_minimo, ativo, created_at, tipo, unidade_medida')
      .single()

    saving.value = false
    if (insertError) { modalError.value = insertError.message; return }

    // Add to local state sorted
    materiais.value = [...materiais.value, data as Material]
      .sort((a, b) => a.nome.localeCompare(b.nome))
    fecharModal()
    showSuccess('Material cadastrado com sucesso')
  }
}

// ─── Toggle Ativo/Inativo ────────────────────────────────────────────────────
function confirmarToggle(mat: Material) {
  toggleTarget.value = mat
}

async function executarToggle() {
  if (!toggleTarget.value) return
  toggling.value = true

  const novoStatus = !toggleTarget.value.ativo
  const { error: updateError } = await supabase
    .from('materiais_adesivo')
    .update({ ativo: novoStatus })
    .eq('id', toggleTarget.value.id)

  toggling.value = false
  if (updateError) {
    toggleTarget.value = null
    error.value = updateError.message
    return
  }

  // Update local state
  const idx = materiais.value.findIndex(m => m.id === toggleTarget.value!.id)
  if (idx !== -1) {
    materiais.value[idx] = { ...materiais.value[idx], ativo: novoStatus }
  }

  const msg = novoStatus ? 'Material ativado com sucesso' : 'Material desativado com sucesso'
  toggleTarget.value = null
  showSuccess(msg)
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-fade-enter-active { transition: all 0.3s ease-out; }
.slide-fade-leave-active { transition: all 0.2s ease-in; }
.slide-fade-enter-from { transform: translateY(10px); opacity: 0; }
.slide-fade-leave-to { transform: translateY(-5px); opacity: 0; }
</style>


