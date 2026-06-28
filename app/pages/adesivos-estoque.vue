<template>
  <div class="min-h-full p-3 sm:p-6">

    <!-- CABEÇALHO -->
    <div class="page-header relative rounded-3xl overflow-hidden mb-8 shadow-xl">
      <div class="page-header-overlay absolute inset-0" />
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />
      <div class="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/[0.03] pointer-events-none" />
      <div class="absolute -bottom-20 left-1/4 w-96 h-96 rounded-full bg-white/[0.02] pointer-events-none" />

      <div class="relative px-4 sm:px-8 pt-5 sm:pt-7 pb-5 sm:pb-7">
        <div class="flex flex-wrap items-start justify-between gap-3 sm:gap-6">
          <div class="flex items-center gap-3 sm:gap-5">
            <div class="flex items-center justify-center w-10 sm:w-14 h-10 sm:h-14 rounded-2xl bg-white/[0.12] backdrop-blur-sm border border-white/20 shadow-lg">
              <svg class="w-5 sm:w-7 h-5 sm:h-7 text-white" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-semibold text-white/80 uppercase tracking-widest">Produção</span>
                <span class="w-1 h-1 rounded-full bg-white/40" />
                <span class="text-xs text-white/50 hidden sm:inline">Estoque</span>
              </div>
              <h1 class="text-xl sm:text-3xl font-bold text-white tracking-tight leading-none">Estoque de Materiais</h1>
              <p class="text-sm text-gray-300/80 mt-1.5">
                {{ loading ? 'Carregando...' : `${materiais.length} material(is) em estoque` }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <button
              type="button"
              class="inline-flex items-center gap-2 text-sm font-bold px-3 sm:px-5 py-2.5 rounded-xl bg-amber-500 text-gray-950 hover:bg-amber-400 shadow-lg shadow-amber-900/30 transition-all duration-200 hover:scale-[1.02]"
              @click="abrirEntrada"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
              <span class="hidden sm:inline">Registrar Entrada</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="flex flex-col items-center justify-center gap-4 py-32">
      <span class="spinner spinner-lg" />
      <span class="text-sm text-gray-400 font-medium">Carregando estoque...</span>
    </div>

    <!-- ERRO -->
    <div v-else-if="error" class="flex items-center gap-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-2xl px-6 py-4">
      <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" d="M12 8v4m0 4h.01"/></svg>
      {{ error }}
    </div>

    <!-- CARDS DE MATERIAIS (Saldo) -->
    <div v-else>
      <div class="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden mb-8">
        <div class="flex items-center justify-between px-7 py-4 border-b border-gray-100 bg-gray-50/50">
          <span class="text-sm font-semibold text-gray-600">
            <span class="text-purple-600 font-black">{{ materiais.length }}</span>
            material(is)
          </span>
          <span class="text-xs text-gray-400">Saldo atual em m²</span>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-100">
                <th class="text-left px-6 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Material</th>
                <th class="text-right px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Estoque Atual</th>
                <th class="text-right px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Estoque Mín.</th>
                <th class="text-center px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-if="materiais.length === 0">
                <td colspan="4" class="text-center py-20">
                  <div class="flex flex-col items-center gap-3">
                    <svg class="w-14 h-14 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.25" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                    <span class="text-base font-semibold text-gray-400">Nenhum material cadastrado</span>
                    <span class="text-sm text-gray-400">Cadastre materiais na página de Materiais</span>
                  </div>
                </td>
              </tr>
              <tr
                v-for="mat in materiais"
                :key="mat.id"
                class="hover:bg-purple-50/30 transition-colors duration-150"
              >
                <td class="px-6 py-4">
                  <span class="font-semibold text-gray-800">{{ mat.nome }}</span>
                </td>
                <td class="px-5 py-4 text-right">
                  <span class="font-bold text-gray-800 whitespace-nowrap">{{ formatNumber(mat.estoque_atual) }} m²</span>
                </td>
                <td class="px-5 py-4 text-right">
                  <span class="text-gray-600">{{ formatNumber(mat.estoque_minimo) }} m²</span>
                </td>
                <td class="px-5 py-4 text-center">
                  <span
                    v-if="mat.estoque_atual < mat.estoque_minimo"
                    class="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-700"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    Abaixo do mínimo
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-700"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Normal
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- HISTÓRICO DE MOVIMENTAÇÕES -->
      <div class="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
        <div class="flex items-center justify-between px-7 py-4 border-b border-gray-100 bg-gray-50/50">
          <span class="text-sm font-semibold text-gray-600">
            Histórico de Movimentações
          </span>
          <span class="text-xs text-gray-400">{{ totalMovimentacoes }} registro(s)</span>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-100">
                <th class="text-left px-6 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Data</th>
                <th class="text-center px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Tipo</th>
                <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Material</th>
                <th class="text-right px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Quantidade</th>
                <th class="text-right px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Saldo Result.</th>
                <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Referência</th>
                <th class="text-right px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Custo</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-if="movimentacoes.length === 0">
                <td colspan="7" class="text-center py-16">
                  <span class="text-sm text-gray-400">Nenhuma movimentação registrada</span>
                </td>
              </tr>
              <tr
                v-for="mov in movimentacoes"
                :key="mov.id"
                class="hover:bg-gray-50/50 transition-colors duration-150"
              >
                <td class="px-6 py-4 text-gray-600 whitespace-nowrap">{{ formatDate(mov.created_at) }}</td>
                <td class="px-5 py-4 text-center">
                  <span
                    :class="['inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full', mov.tipo === 'entrada' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700']"
                  >
                    <svg v-if="mov.tipo === 'entrada'" class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m0 0l-4-4m4 4l4-4"/></svg>
                    <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 20V4m0 0l-4 4m4-4l4 4"/></svg>
                    {{ mov.tipo === 'entrada' ? 'Entrada' : 'Saída' }}
                  </span>
                </td>
                <td class="px-5 py-4 font-medium text-gray-800">{{ mov.material_nome }}</td>
                <td class="px-5 py-4 text-right font-semibold text-gray-800">{{ formatNumber(mov.quantidade_m2) }} m²</td>
                <td class="px-5 py-4 text-right text-gray-600">{{ formatNumber(mov.saldo_resultante) }} m²</td>
                <td class="px-5 py-4 text-gray-500">{{ mov.referencia || '—' }}</td>
                <td class="px-5 py-4 text-right text-gray-600">{{ mov.custo_compra ? formatCurrency(mov.custo_compra) : '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- PAGINAÇÃO -->
        <div v-if="totalMovimentacoes > pageSize" class="flex items-center justify-between px-7 py-4 border-t border-gray-100">
          <span class="text-xs text-gray-400">
            Página {{ currentPage }} de {{ totalPages }}
          </span>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              :disabled="currentPage <= 1"
              @click="changePage(currentPage - 1)"
            >
              Anterior
            </button>
            <button
              type="button"
              class="px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              :disabled="currentPage >= totalPages"
              @click="changePage(currentPage + 1)"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL REGISTRAR ENTRADA -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="modalEntrada"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4 py-4"
          @click.self="fecharModal"
        >
          <div class="bg-white rounded-2xl shadow-2xl w-full sm:max-w-5xl flex flex-col overflow-hidden" style="max-height:92vh">

            <!-- Header -->
            <div class="px-6 py-5 border-b border-gray-100 shrink-0">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                    <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                  </div>
                  <div>
                    <h2 class="text-lg font-bold text-gray-900 leading-tight">Registrar entrada</h2>
                    <p class="text-sm text-gray-500 flex items-center gap-2 mt-0.5">
                      Adicione material ao estoque
                      <span class="inline-flex items-center px-2 py-0.5 rounded-md bg-orange-50 text-orange-600 text-[11px] font-semibold">Estoque</span>
                    </p>
                  </div>
                </div>
                <button type="button" class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors" @click="fecharModal">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </div>

            <!-- Body: 2-column -->
            <div class="flex flex-1 overflow-hidden">

              <!-- Left: Scrollable form -->
              <form id="entrada-form" class="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6" @submit.prevent="confirmarEntrada">

                <!-- Section 1: Dados da entrada -->
                <div class="flex flex-col gap-5">
                  <div class="flex items-center gap-2.5">
                    <span class="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">1</span>
                    <h3 class="text-sm font-bold text-gray-900">Dados da entrada</h3>
                  </div>

                  <!-- Material -->
                  <div class="flex flex-col gap-1.5">
                    <label class="text-xs font-semibold text-gray-600">Material *</label>
                    <select
                      v-model.number="entradaForm.material_id"
                      class="w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
                      :class="entradaErrors.material_id ? 'border-red-400 bg-red-50' : 'border-gray-200'"
                    >
                      <option :value="null" disabled>Selecione o material</option>
                      <option v-for="mat in materiais" :key="mat.id" :value="mat.id">{{ mat.nome }}</option>
                    </select>
                    <p v-if="entradaErrors.material_id" class="text-xs text-red-500 font-medium flex items-center gap-1">
                      <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
                      {{ entradaErrors.material_id }}
                    </p>
                  </div>

                  <!-- Quantidade -->
                  <div class="flex flex-col gap-1.5">
                    <label class="text-xs font-semibold text-gray-600">Quantidade ({{ unidadeMaterialSelecionado }}) *</label>
                    <input
                      v-model.number="entradaForm.quantidade_m2"
                      type="number"
                      step="0.01"
                      min="0.01"
                      max="9999.99"
                      placeholder="0,00"
                      class="w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
                      :class="entradaErrors.quantidade_m2 ? 'border-red-400 bg-red-50' : 'border-gray-200'"
                    />
                    <p v-if="entradaErrors.quantidade_m2" class="text-xs text-red-500 font-medium flex items-center gap-1">
                      <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
                      {{ entradaErrors.quantidade_m2 }}
                    </p>
                  </div>

                  <!-- Custo da Compra -->
                  <div class="flex flex-col gap-1.5">
                    <label class="text-xs font-semibold text-gray-600">Custo da compra (R$) *</label>
                    <input
                      v-model.number="entradaForm.custo_compra"
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0,00"
                      class="w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
                      :class="entradaErrors.custo_compra ? 'border-red-400 bg-red-50' : 'border-gray-200'"
                    />
                    <p v-if="entradaErrors.custo_compra" class="text-xs text-red-500 font-medium flex items-center gap-1">
                      <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
                      {{ entradaErrors.custo_compra }}
                    </p>
                    <p class="text-[11px] text-gray-400 mt-0.5">Informe o valor pago para atualizar o custo médio do material.</p>
                  </div>

                  <!-- Observações -->
                  <div class="flex flex-col gap-1.5">
                    <label class="text-xs font-semibold text-gray-600">Observações</label>
                    <textarea
                      v-model="entradaForm.observacoes"
                      rows="3"
                      maxlength="500"
                      placeholder="Observações opcionais..."
                      class="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all resize-none"
                    />
                  </div>
                </div>

                <!-- Section 2: Atualização no estoque -->
                <div class="flex flex-col gap-4">
                  <div class="flex items-center gap-2.5">
                    <span class="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">2</span>
                    <h3 class="text-sm font-bold text-gray-900">Atualização no estoque</h3>
                  </div>

                  <div class="flex flex-col gap-3 pl-8">
                    <label class="flex items-center gap-2.5 text-sm text-gray-700">
                      <input type="checkbox" checked disabled class="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500/20" />
                      Atualizar custo médio
                    </label>
                    <label class="flex items-center gap-2.5 text-sm text-gray-700">
                      <input type="checkbox" checked disabled class="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500/20" />
                      Gerar movimentação de entrada
                    </label>
                    <label class="flex items-center gap-2.5 text-sm text-gray-700">
                      <input type="checkbox" checked disabled class="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500/20" />
                      Vincular ao histórico do material
                    </label>
                  </div>
                </div>

                <!-- Erro geral do modal -->
                <p v-if="modalError" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{{ modalError }}</p>

                <!-- Botões mobile -->
                <div class="flex gap-3 pb-1 sm:hidden">
                  <button
                    type="button"
                    class="flex-1 py-3 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-sm font-semibold"
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
                    {{ saving ? 'Registrando...' : 'Confirmar entrada' }}
                  </button>
                </div>
              </form>

              <!-- Right sidebar -->
              <aside class="w-[320px] hidden sm:flex flex-col border-l border-gray-100 bg-gray-50/50 p-5 overflow-y-auto gap-5">

                <!-- Resumo da entrada -->
                <div class="bg-white rounded-xl border border-gray-100 p-4 flex flex-col gap-3">
                  <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wide">Resumo da entrada</h4>

                  <div class="flex flex-col gap-2.5 text-sm">
                    <div class="flex justify-between">
                      <span class="text-gray-500">Material</span>
                      <span class="font-medium text-gray-800 text-right max-w-[160px] truncate">{{ materiais.find(m => m.id === entradaForm.material_id)?.nome || 'Não definido' }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-500">Quantidade</span>
                      <span class="font-medium text-gray-800">{{ entradaForm.quantidade_m2 || '0,00' }} {{ unidadeMaterialSelecionado }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-500">Custo</span>
                      <span class="font-medium text-gray-800">{{ formatCurrency(entradaForm.custo_compra ?? 0) }}</span>
                    </div>
                    <div class="border-t border-gray-100 my-1" />
                    <div class="flex justify-between">
                      <span class="text-gray-500">Movimento</span>
                      <span class="font-medium text-gray-800">Entrada</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-500">Impacto no estoque</span>
                      <span class="font-semibold text-green-600">+{{ entradaForm.quantidade_m2 || '0,00' }} {{ unidadeMaterialSelecionado }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-gray-500">Status</span>
                      <span class="flex items-center gap-1.5 text-sm font-medium text-orange-600">
                        <span class="w-2 h-2 rounded-full bg-orange-400" />
                        Rascunho
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Info notice -->
                <div class="flex gap-2.5 bg-orange-50 border border-orange-100 rounded-lg px-3.5 py-3">
                  <svg class="w-4 h-4 text-orange-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd" />
                  </svg>
                  <p class="text-[12px] text-orange-700 leading-relaxed">Revise material, quantidade e custo antes de confirmar a entrada no estoque.</p>
                </div>

                <!-- Sidebar buttons -->
                <div class="flex flex-col gap-2.5 mt-auto">
                  <button
                    type="submit"
                    form="entrada-form"
                    class="w-full py-2.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm transition-colors disabled:opacity-60"
                    :disabled="saving"
                  >
                    <span v-if="saving" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                    {{ saving ? 'Registrando...' : 'Confirmar entrada' }}
                  </button>
                  <button
                    type="button"
                    class="w-full py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-sm font-semibold"
                  >
                    Salvar rascunho
                  </button>
                  <button
                    type="button"
                    class="w-full py-2.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center gap-1.5"
                    @click="fecharModal"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                    Cancelar
                  </button>
                </div>
              </aside>
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
import { ref, reactive, onMounted, computed } from 'vue'
import { createSupabaseClient } from '~/lib/supabase'

// ─── Types ───────────────────────────────────────────────────────────────────
interface Material {
  id: number
  nome: string
  estoque_atual: number
  estoque_minimo: number
  unidade_medida?: string | null
}

interface Movimentacao {
  id: number
  material_id: number
  material_nome: string
  tipo: 'entrada' | 'saida'
  quantidade_m2: number
  saldo_resultante: number
  custo_compra: number | null
  referencia: string | null
  created_at: string
}

// ─── Composables ─────────────────────────────────────────────────────────────
const supabase = createSupabaseClient()
const { empresaId, loadEmpresa } = useEmpresa()
const { formatCurrency, formatDate } = useLocale()

// ─── State ───────────────────────────────────────────────────────────────────
const materiais = ref<Material[]>([])
const movimentacoes = ref<Movimentacao[]>([])
const totalMovimentacoes = ref(0)
const loading = ref(true)
const error = ref<string | null>(null)
const saving = ref(false)
const modalError = ref<string | null>(null)
const successMsg = ref<string | null>(null)
const modalEntrada = ref(false)

// Pagination
const pageSize = 20
const currentPage = ref(1)
const totalPages = computed(() => Math.max(1, Math.ceil(totalMovimentacoes.value / pageSize)))

// ─── Form ────────────────────────────────────────────────────────────────────
const entradaForm = reactive({
  material_id: null as number | null,
  quantidade_m2: null as number | null,
  custo_compra: null as number | null,
  observacoes: '',
})
const entradaErrors = reactive({
  material_id: '',
  quantidade_m2: '',
  custo_compra: '',
})

const unidadeMaterialSelecionado = computed(() => {
  if (!entradaForm.material_id) return 'm²'
  const mat = materiais.value.find(m => m.id === entradaForm.material_id)
  return mat?.unidade_medida || 'm²'
})

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatNumber(val: number | null | undefined): string {
  if (val == null) return '0,00'
  return val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function showSuccess(msg: string) {
  successMsg.value = msg
  setTimeout(() => { successMsg.value = null }, 3000)
}

// ─── Fetch ───────────────────────────────────────────────────────────────────
onMounted(async () => {
  await loadEmpresa()
  await Promise.all([fetchMateriais(), fetchMovimentacoes()])
  loading.value = false
})

async function fetchMateriais() {
  const { data, error: fetchError } = await supabase
    .from('materiais_adesivo')
    .select('id, nome, estoque_atual, estoque_minimo, unidade_medida')
    .eq('empresa_id', empresaId.value!)
    .order('nome', { ascending: true })

  if (fetchError) { error.value = fetchError.message; return }
  materiais.value = (data ?? []) as Material[]
}

async function fetchMovimentacoes() {
  const from = (currentPage.value - 1) * pageSize
  const to = from + pageSize - 1

  // Get count
  const { count } = await supabase
    .from('estoque_movimentacoes')
    .select('id', { count: 'exact', head: true })
    .eq('empresa_id', empresaId.value!)

  totalMovimentacoes.value = count ?? 0

  // Get data with material name
  const { data, error: fetchError } = await supabase
    .from('estoque_movimentacoes')
    .select(`
      id,
      material_id,
      tipo,
      quantidade_m2,
      saldo_resultante,
      custo_compra,
      referencia_pedido_id,
      referencia_venda_id,
      observacoes,
      created_at,
      materiais_adesivo!inner(nome)
    `)
    .eq('empresa_id', empresaId.value!)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (fetchError) { error.value = fetchError.message; return }

  movimentacoes.value = (data ?? []).map((row: any) => ({
    id: row.id,
    material_id: row.material_id,
    material_nome: row.materiais_adesivo?.nome ?? '—',
    tipo: row.tipo,
    quantidade_m2: row.quantidade_m2,
    saldo_resultante: row.saldo_resultante,
    custo_compra: row.custo_compra,
    referencia: row.referencia_pedido_id
      ? `Pedido #${row.referencia_pedido_id}`
      : row.referencia_venda_id
        ? `Venda #${row.referencia_venda_id}`
        : null,
    created_at: row.created_at,
  })) as Movimentacao[]
}

async function changePage(page: number) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  await fetchMovimentacoes()
}

// ─── Modal Entrada ───────────────────────────────────────────────────────────
function resetEntradaForm() {
  entradaForm.material_id = null
  entradaForm.quantidade_m2 = null
  entradaForm.custo_compra = null
  entradaForm.observacoes = ''
  entradaErrors.material_id = ''
  entradaErrors.quantidade_m2 = ''
  entradaErrors.custo_compra = ''
  modalError.value = null
}

function abrirEntrada() {
  resetEntradaForm()
  modalEntrada.value = true
}

function fecharModal() {
  modalEntrada.value = false
}

function validarEntrada(): boolean {
  entradaErrors.material_id = ''
  entradaErrors.quantidade_m2 = ''
  entradaErrors.custo_compra = ''

  let valid = true

  if (!entradaForm.material_id) {
    entradaErrors.material_id = 'Selecione um material'
    valid = false
  }

  if (entradaForm.quantidade_m2 === null || entradaForm.quantidade_m2 === undefined) {
    entradaErrors.quantidade_m2 = 'Quantidade é obrigatória'
    valid = false
  } else if (entradaForm.quantidade_m2 < 0.01 || entradaForm.quantidade_m2 > 9999.99) {
    entradaErrors.quantidade_m2 = 'Quantidade deve estar entre 0.01 e 9999.99 m²'
    valid = false
  }

  if (entradaForm.custo_compra === null || entradaForm.custo_compra === undefined) {
    entradaErrors.custo_compra = 'Custo da compra é obrigatório'
    valid = false
  } else if (entradaForm.custo_compra <= 0) {
    entradaErrors.custo_compra = 'Custo deve ser maior que zero'
    valid = false
  }

  return valid
}

async function confirmarEntrada() {
  modalError.value = null
  if (!validarEntrada()) return

  saving.value = true

  const materialId = entradaForm.material_id!
  const quantidade = entradaForm.quantidade_m2!
  const custo = entradaForm.custo_compra!

  // 1. Get current stock
  const material = materiais.value.find(m => m.id === materialId)
  if (!material) {
    modalError.value = 'Material não encontrado'
    saving.value = false
    return
  }

  const novoSaldo = material.estoque_atual + quantidade

  // 2. Update estoque_atual in materiais_adesivo
  const { error: updateError } = await supabase
    .from('materiais_adesivo')
    .update({ estoque_atual: novoSaldo })
    .eq('id', materialId)

  if (updateError) {
    modalError.value = updateError.message
    saving.value = false
    return
  }

  // 3. Insert movimentação
  const { error: insertError } = await supabase
    .from('estoque_movimentacoes')
    .insert({
      empresa_id: empresaId.value!,
      material_id: materialId,
      tipo: 'entrada',
      quantidade_m2: quantidade,
      saldo_resultante: novoSaldo,
      custo_compra: custo,
      observacoes: entradaForm.observacoes.trim() || null,
    })

  if (insertError) {
    // Rollback stock update
    await supabase
      .from('materiais_adesivo')
      .update({ estoque_atual: material.estoque_atual })
      .eq('id', materialId)

    modalError.value = insertError.message
    saving.value = false
    return
  }

  // 4. Refresh data
  saving.value = false
  fecharModal()
  showSuccess('Entrada de estoque registrada com sucesso')

  // Update local material stock
  material.estoque_atual = novoSaldo

  // Reload movimentações
  currentPage.value = 1
  await fetchMovimentacoes()
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


