<template>
  <div class="min-h-full bg-transparent p-3 sm:p-8">

    <!-- CABEÇALHO -->
    <div class="page-header relative rounded-3xl overflow-hidden mb-8 shadow-xl">
      <div class="page-header-overlay absolute inset-0" />
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />
      <div class="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/[0.03] pointer-events-none" />
      <PageLogo />

      <div class="relative px-4 sm:px-8 pt-5 sm:pt-7 pb-5 sm:pb-7">
        <div class="flex flex-wrap items-start justify-between gap-3 sm:gap-6">
          <div class="flex items-center gap-3 sm:gap-5">
            <div class="flex items-center justify-center w-10 sm:w-14 h-10 sm:h-14 rounded-2xl bg-white/[0.12] backdrop-blur-sm border border-white/20 shadow-lg">
              <AppNavIcon name="sparkles" class="w-5 sm:w-7 h-5 sm:h-7 text-white" />
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-semibold text-white/80 uppercase tracking-widest">Catálogo</span>
              </div>
              <h1 class="text-xl sm:text-3xl font-bold text-white tracking-tight leading-none">Serviços</h1>
              <p class="text-sm text-white/80 mt-1.5">
                {{ loading ? 'Carregando...' : `${servicosFiltrados.length} de ${servicos.length} serviço(s)` }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <button
              type="button"
              class="inline-flex items-center gap-2 text-sm font-semibold px-3 sm:px-5 py-2.5 rounded-xl transition-all duration-200"
              :class="filtroAberto ? 'bg-white text-primary shadow-lg scale-[1.02]' : 'bg-white/10 text-white hover:bg-white/20 border border-white/15 backdrop-blur-sm'"
              @click="filtroAberto = !filtroAberto"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/></svg>
              <span class="hidden sm:inline">Filtros</span>
            </button>
            <button
              v-if="isAdminOrGerente"
              type="button"
              class="inline-flex items-center gap-2 text-sm font-bold px-3 sm:px-5 py-2.5 rounded-xl bg-white text-primary hover:bg-primary-5 shadow-lg shadow-pink-200/40 transition-all duration-200 hover:scale-[1.02]"
              @click="abrirAdicionar"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
              <span class="hidden sm:inline">Novo Serviço</span>
            </button>
          </div>
        </div>

        <div class="h-px bg-white/10 my-4 sm:my-6" />

        <!-- Stats -->
        <div v-if="!loading" class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="flex flex-col gap-1 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/10">
            <span class="text-xs font-semibold text-white/70 uppercase tracking-widest">Total</span>
            <span class="text-2xl font-black text-white">{{ servicos.length }}</span>
          </div>
          <div class="flex flex-col gap-1 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/10">
            <span class="text-xs font-semibold text-white/70 uppercase tracking-widest">Ativos</span>
            <span class="text-2xl font-black text-white">{{ servicos.filter(s => s.ativo).length }}</span>
          </div>

        </div>
      </div>
    </div>

    <!-- FILTROS -->
    <div v-if="filtroAberto" class="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-4 sm:p-6 mb-6 flex flex-wrap gap-4">
      <div class="flex-1 min-w-[200px]">
        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Buscar</label>
        <input
          v-model="filtro.busca"
          type="text"
          placeholder="Nome do serviço..."
          class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div class="min-w-[160px]">
        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Categoria</label>
        <select v-model="filtro.categoria" class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="">Todas</option>
          <option v-for="cat in categoriasDisponiveis" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>
      <div class="min-w-[140px]">
        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Status</label>
        <select v-model="filtro.ativo" class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="">Todos</option>
          <option value="true">Ativo</option>
          <option value="false">Inativo</option>
        </select>
      </div>
    </div>

    <!-- ERRO -->
    <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4 mb-6 text-sm">{{ error }}</div>

    <!-- LOADING -->
    <div v-if="loading" class="flex justify-center py-20">
      <svg class="animate-spin w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
    </div>

    <!-- LISTA DE SERVIÇOS -->
    <div v-else-if="servicosFiltrados.length" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      <div
        v-for="s in servicosFiltrados"
        :key="s.id"
        class="group bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
      >
        <!-- Photo / Gradient fallback -->
        <div class="relative h-44 overflow-hidden flex-shrink-0">
          <img
            v-if="s.foto_url"
            :src="s.foto_url"
            :alt="s.nome"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center"
            :class="categoriaGradient(s.categoria)"
          >
            <AppNavIcon name="sparkles" class="w-12 h-12 text-white/30" />
          </div>
          <!-- Category badge -->
          <div class="absolute top-3 left-3">
            <span
              class="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm shadow-sm"
              :class="categoriaBadgeOverlay(s.categoria)"
            >{{ categoriaLabel(s.categoria) }}</span>
          </div>
          <!-- Status badge -->
          <div class="absolute top-3 right-3">
            <span
              class="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm shadow-sm"
              :class="s.ativo ? 'bg-emerald-500/90 text-white' : 'bg-gray-500/70 text-white'"
            >{{ s.ativo ? 'Ativo' : 'Inativo' }}</span>
          </div>
        </div>

        <div class="p-5 flex flex-col flex-1">
          <div class="flex-1">
            <h3 class="font-black text-gray-900 text-base leading-tight mb-1">{{ s.nome }}</h3>
            <p v-if="s.descricao" class="text-xs text-gray-500 line-clamp-2 leading-relaxed">{{ s.descricao }}</p>
          </div>

          <div class="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
            <span class="inline-flex items-center gap-1.5 text-xs text-gray-400 font-medium">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"/></svg>
              {{ s.duracao_min }}min
            </span>
            <span class="ml-auto text-xl font-black text-primary">{{ formatPreco(s.preco) }}</span>
          </div>

          <!-- Funcionários vinculados -->
          <div v-if="s.servico_funcionarios?.length" class="flex flex-wrap gap-1.5 mt-2.5">
            <span
              v-for="sf in s.servico_funcionarios"
              :key="sf.funcionario_id"
              class="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100"
            >
              <svg class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>
              {{ sf.funcionarios?.nome }}
            </span>
          </div>

          <!-- Comissão -->
          <div v-if="s.comissao_percentual" class="mt-2.5">
            <span class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
              <svg class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Comissão {{ s.comissao_percentual }}%
            </span>
          </div>

          <div v-if="isAdminOrGerente" class="flex gap-2 mt-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              class="flex-1 text-xs font-bold py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              @click="editServico(s)"
            >Editar</button>
            <button
              type="button"
              class="flex-1 text-xs font-bold py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
              @click="confirmarExclusao(s)"
            >Excluir</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
      <div class="flex flex-col items-center justify-center py-20 text-gray-400">
        <AppNavIcon name="sparkles" class="w-14 h-14 mb-4 text-gray-300" />
        <p class="text-base font-semibold text-gray-400">Nenhum serviço encontrado</p>
        <p class="text-sm text-gray-400 mt-1">Adicione o primeiro serviço do studio</p>
      </div>
    </div>

    <!-- MODAL ADICIONAR / EDITAR -->
    <Teleport to="body">
      <div v-if="adicionando || editando" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="fecharModal" />
        <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div class="px-6 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between">
            <h2 class="text-lg font-bold text-gray-900">{{ editando ? 'Editar Serviço' : 'Novo Serviço' }}</h2>
            <button type="button" class="text-gray-400 hover:text-gray-600 transition-colors" @click="fecharModal">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <form class="px-6 py-5 flex flex-col gap-4" @submit.prevent="editando ? salvarEdicao() : salvarAdicao()">
            <div v-if="modalError" class="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">{{ modalError }}</div>

            <!-- Foto do Serviço -->
            <div>
              <label class="block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-2">Foto do Serviço</label>
              <!-- Preview -->
              <div v-if="fotoPreview" class="relative mb-3 rounded-2xl overflow-hidden h-44 bg-gray-100">
                <img :src="fotoPreview" alt="Preview" class="w-full h-full object-cover" />
                <button
                  type="button"
                  class="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                  @click="removerFoto"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
              <!-- Upload area -->
              <label
                v-else
                class="flex flex-col items-center justify-center h-32 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-primary-5 hover:border-primary-border cursor-pointer transition-colors group"
              >
                <svg class="w-8 h-8 text-gray-300 group-hover:text-primary transition-colors mb-2" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/></svg>
                <span class="text-xs text-gray-400 group-hover:text-primary font-medium">Clique para adicionar foto</span>
                <span class="text-xs text-gray-300 mt-0.5">JPG, PNG ou WebP · Máx. 5 MB</span>
                <input type="file" accept="image/jpeg,image/png,image/webp" class="hidden" @change="handleFotoChange" />
              </label>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-1.5">Nome <span class="text-red-500">*</span></label>
              <input
                v-model="form.nome"
                type="text"
                placeholder="Nome do Serviço"
                class="w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                :class="formErrors.nome ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'"
              />
              <p v-if="formErrors.nome" class="text-xs text-red-500 mt-1">{{ formErrors.nome }}</p>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-1.5">Descrição</label>
              <textarea
                v-model="form.descricao"
                rows="2"
                placeholder="Descreva o serviço..."
                class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-1.5">Categoria <span class="text-red-500">*</span></label>
                <input
                  v-model="form.categoria"
                  list="categorias-list"
                  placeholder="Digite ou selecione..."
                  class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#6b7280)] focus:border-[var(--color-primary,#6b7280)]"
                />
                <datalist id="categorias-list">
                  <option v-for="cat in categoriasDisponiveis" :key="cat" :value="cat">{{ cat }}</option>
                </datalist>
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-1.5">Duração (min) <span class="text-red-500">*</span></label>
                <input
                  v-model.number="form.duracao_min"
                  type="number"
                  min="1"
                  placeholder="60"
                  class="w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  :class="formErrors.duracao_min ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'"
                />
                <p v-if="formErrors.duracao_min" class="text-xs text-red-500 mt-1">{{ formErrors.duracao_min }}</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-1.5">Preço (R$) <span class="text-red-500">*</span></label>
                <input
                  v-model.number="form.preco"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0,00"
                  class="w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  :class="formErrors.preco ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'"
                />
                <p v-if="formErrors.preco" class="text-xs text-red-500 mt-1">{{ formErrors.preco }}</p>
              </div>
              <div class="flex flex-col justify-end">
                <label class="flex items-center gap-2 cursor-pointer select-none">
                  <div
                    class="relative w-10 h-5 rounded-full transition-colors"
                    :class="form.ativo ? 'bg-green-400' : 'bg-gray-300'"
                    @click="form.ativo = !form.ativo"
                  >
                    <div class="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform" :class="form.ativo ? 'translate-x-5' : ''" />
                  </div>
                  <span class="text-sm font-medium text-gray-700">{{ form.ativo ? 'Ativo' : 'Inativo' }}</span>
                </label>
              </div>
            </div>

            <!-- Comissão -->
            <div>
              <label class="block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-1.5">Comissão do funcionário (%)</label>
              <div class="relative">
                <input
                  v-model.number="form.comissao_percentual"
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  placeholder="0"
                  class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 pr-10"
                />
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">%</span>
              </div>
              <p class="text-[10px] text-gray-400 mt-1">
                Ao concluir o agendamento, o sistema registra automaticamente a comissão para o funcionário.
                {{ form.comissao_percentual && form.preco ? `Exemplo: ${new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(form.preco * form.comissao_percentual / 100)} por serviço.` : '' }}
              </p>
            </div>

            <!-- Funcionários -->
            <div>
              <label class="block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-2">Funcionários que realizam este serviço</label>
              <div v-if="funcionarios.length === 0" class="text-xs text-gray-400 py-2">Nenhum funcionário cadastrado.</div>
              <div v-else class="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                <label
                  v-for="func in funcionarios"
                  :key="func.id"
                  class="flex items-center gap-2 text-sm cursor-pointer select-none px-3 py-2 rounded-xl border transition-colors"
                  :class="form.funcionarioIds.includes(func.id) ? 'border-primary bg-primary-5 text-primary font-semibold' : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'"
                >
                  <input type="checkbox" :value="func.id" v-model="form.funcionarioIds" class="accent-primary w-3.5 h-3.5 shrink-0" />
                  <span class="truncate">{{ func.nome }}</span>
                </label>
              </div>
            </div>

            <!-- Simultâneos -->
            <div>
              <label class="block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-1">
                Pode ser feito junto com
                <span class="text-[10px] font-normal text-gray-400 normal-case tracking-normal ml-1">(simultâneo)</span>
              </label>
              <p class="text-xs text-gray-400 mb-2">Marque serviços que podem ser realizados ao mesmo tempo que este — ex: cabelo + unhas.</p>
              <div v-if="outrosServicos.length === 0" class="text-xs text-gray-400 py-2">Nenhum outro serviço ativo cadastrado.</div>
              <div v-else class="flex flex-col gap-1.5 max-h-36 overflow-y-auto pr-1">
                <label
                  v-for="s in outrosServicos"
                  :key="s.id"
                  class="flex items-center gap-2.5 text-sm cursor-pointer select-none px-3 py-2 rounded-xl border transition-colors"
                  :class="form.simultaneosIds.includes(s.id) ? 'border-primary bg-primary-5 text-primary font-semibold' : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'"
                >
                  <input type="checkbox" :value="s.id" v-model="form.simultaneosIds" class="accent-primary w-3.5 h-3.5 shrink-0" />
                  <span class="flex-1 truncate">{{ s.nome }}</span>
                  <span class="text-xs text-gray-400 shrink-0">{{ s.duracao_min }}min</span>
                </label>
              </div>
            </div>

            <div class="flex gap-3 pt-2">
              <button type="button" class="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50" @click="fecharModal">Cancelar</button>
              <button
                type="submit"
                :disabled="saving"
                class="flex-1 py-2.5 rounded-xl bg-primary text-primary-text text-sm font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ saving ? 'Salvando...' : (editando ? 'Salvar' : 'Adicionar') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- MODAL EXCLUIR -->
    <Teleport to="body">
      <div v-if="excluindo" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="excluindo = null" />
        <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-2">Excluir serviço?</h2>
          <p class="text-sm text-gray-500 mb-1">Você está prestes a excluir <strong class="text-gray-800">{{ excluindo.nome }}</strong>.</p>
          <p class="text-xs text-red-500 mb-5">Esta ação não pode ser desfeita.</p>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { createSupabaseClient } from '~/lib/supabase'
import { useEmpresa } from '~/composables/useEmpresa'
import { useAdmin } from '~/composables/useAdmin'
import AppNavIcon from '~/components/AppNavIcon.vue'

defineOptions({ name: 'ServicosPage' })
useHead({ title: 'Serviços' })

interface FuncionarioVinculado {
  funcionario_id: number
  funcionarios: { id: number; nome: string } | null
}

interface FuncionarioSimples {
  id: number
  nome: string
}

interface Servico {
  id: number
  nome: string
  descricao: string | null
  categoria: string
  duracao_min: number
  preco: number
  comissao_percentual: number | null
  ativo: boolean
  foto_url: string | null
  created_at: string | null
  servico_funcionarios?: FuncionarioVinculado[]
}

const supabase = createSupabaseClient()
const { empresaId, loadEmpresa } = useEmpresa()
const { isAdminOrGerente } = useAdmin()

const servicos = ref<Servico[]>([])
const funcionarios = ref<FuncionarioSimples[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const editando = ref<Servico | null>(null)
const adicionando = ref(false)
const saving = ref(false)
const modalError = ref<string | null>(null)

const excluindo = ref<Servico | null>(null)
const deleting = ref(false)
const deleteError = ref<string | null>(null)

const filtroAberto = ref(false)
const filtro = reactive({ busca: '', categoria: '', ativo: '' })

const fotoFile = ref<File | null>(null)
const fotoPreview = ref<string | null>(null)

const form = reactive({
  nome: '',
  descricao: '',
  categoria: '',
  duracao_min: 60,
  preco: 0,
  comissao_percentual: null as number | null,
  ativo: true,
  foto_url: null as string | null,
  funcionarioIds: [] as number[],
  simultaneosIds: [] as number[],
})

const outrosServicos = computed(() =>
  servicos.value.filter(s => s.ativo && s.id !== editando.value?.id)
)

const formErrors = reactive({ nome: '', duracao_min: '', preco: '' })

const servicosFiltrados = computed(() =>
  servicos.value.filter(s => {
    if (filtro.busca && !s.nome.toLowerCase().includes(filtro.busca.toLowerCase())) return false
    if (filtro.categoria && s.categoria !== filtro.categoria) return false
    if (filtro.ativo === 'true' && !s.ativo) return false
    if (filtro.ativo === 'false' && s.ativo) return false
    return true
  })
)

// Categorias disponíveis: apenas categorias já cadastradas nos serviços
const categoriasDisponiveis = computed(() => {
  const existentes = servicos.value.map(s => s.categoria).filter(Boolean)
  return [...new Set(existentes)].sort()
})

function formatPreco(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
}

function categoriaLabel(cat: string) {
  return { cilios: 'Cílios', unhas: 'Unhas', combo: 'Combo', outro: 'Outro' }[cat] ?? cat
}

function categoriaCor(cat: string) {
  return { cilios: 'bg-primary', unhas: 'bg-purple-500', combo: 'bg-indigo-500', outro: 'bg-gray-400' }[cat] ?? 'bg-gray-300'
}

function categoriaBadge(cat: string) {
  return {
    cilios: 'bg-primary-10 text-primary',
    unhas: 'bg-purple-100 text-purple-700',
    combo: 'bg-indigo-100 text-indigo-700',
    outro: 'bg-gray-100 text-gray-600',
  }[cat] ?? 'bg-gray-100 text-gray-600'
}

function categoriaGradient(cat: string) {
  return {
    cilios: 'bg-gradient-to-br from-pink-400 to-rose-500',
    unhas: 'bg-gradient-to-br from-purple-400 to-violet-500',
    combo: 'bg-gradient-to-br from-indigo-400 to-blue-500',
    outro: 'bg-gradient-to-br from-gray-400 to-slate-500',
  }[cat] ?? 'bg-gradient-to-br from-gray-400 to-slate-500'
}

function categoriaBadgeOverlay(cat: string) {
  return {
    cilios: 'bg-primary/80 text-white',
    unhas: 'bg-purple-500/80 text-white',
    combo: 'bg-indigo-500/80 text-white',
    outro: 'bg-gray-500/80 text-white',
  }[cat] ?? 'bg-gray-500/80 text-white'
}

onMounted(async () => {
  await loadEmpresa()
  await Promise.all([fetchServicos(), fetchFuncionarios()])
})

async function fetchServicos() {
  loading.value = true
  const { data, error: fetchError } = await supabase
    .from('servicos')
    .select('*, servico_funcionarios(funcionario_id, funcionarios(id, nome))')
    .eq('empresa_id', empresaId.value!)
    .order('categoria', { ascending: true })
    .order('nome', { ascending: true })

  loading.value = false
  if (fetchError) { error.value = fetchError.message; return }
  servicos.value = (data ?? []) as Servico[]
}

async function fetchFuncionarios() {
  const { data } = await supabase
    .from('funcionarios')
    .select('id, nome')
    .eq('empresa_id', empresaId.value!)
    .order('nome', { ascending: true })
  funcionarios.value = (data ?? []) as FuncionarioSimples[]
}

function resetForm() {
  form.nome = ''; form.descricao = ''; form.categoria = ''
  form.duracao_min = 60; form.preco = 0; form.comissao_percentual = null; form.ativo = true
  form.foto_url = null
  form.funcionarioIds = []
  form.simultaneosIds = []
  fotoFile.value = null
  fotoPreview.value = null
  formErrors.nome = ''; formErrors.duracao_min = ''; formErrors.preco = ''
}

function abrirAdicionar() {
  resetForm()
  adicionando.value = true
  editando.value = null
  modalError.value = null
}

function fecharModal() {
  editando.value = null
  adicionando.value = false
}

async function editServico(s: Servico) {
  editando.value = s
  adicionando.value = false
  modalError.value = null
  formErrors.nome = ''; formErrors.duracao_min = ''; formErrors.preco = ''
  form.nome = s.nome
  form.descricao = s.descricao ?? ''
  form.categoria = s.categoria
  form.duracao_min = s.duracao_min
  form.preco = s.preco
  form.comissao_percentual = s.comissao_percentual ?? null
  form.ativo = s.ativo
  form.foto_url = s.foto_url ?? null
  fotoFile.value = null
  fotoPreview.value = s.foto_url ?? null
  form.funcionarioIds = (s.servico_funcionarios ?? []).map(sf => sf.funcionario_id)
  const { data: simData } = await supabase
    .from('servico_simultaneos')
    .select('servico_par_id')
    .eq('servico_id', s.id)
  form.simultaneosIds = (simData ?? []).map((r: any) => Number(r.servico_par_id))
}

function validateForm(): boolean {
  formErrors.nome = ''; formErrors.duracao_min = ''; formErrors.preco = ''
  let ok = true
  if (!form.nome.trim()) { formErrors.nome = 'O nome é obrigatório.'; ok = false }
  if (!form.duracao_min || form.duracao_min < 1) { formErrors.duracao_min = 'Informe a duração.'; ok = false }
  if (form.preco < 0) { formErrors.preco = 'Preço inválido.'; ok = false }
  return ok
}

function buildPayload() {
  return {
    nome: form.nome.trim(),
    descricao: form.descricao.trim() || null,
    categoria: form.categoria,
    duracao_min: form.duracao_min,
    preco: form.preco,
    comissao_percentual: form.comissao_percentual ?? null,
    ativo: form.ativo,
    foto_url: form.foto_url,
    empresa_id: empresaId.value!,
  }
}

function handleFotoChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  fotoFile.value = file
  fotoPreview.value = URL.createObjectURL(file)
}

function removerFoto() {
  fotoFile.value = null
  fotoPreview.value = null
  form.foto_url = null
}

async function uploadFotoServico(servicoId: number): Promise<string | null> {
  if (!fotoFile.value) return form.foto_url
  const ext = fotoFile.value.name.split('.').pop() ?? 'jpg'
  const path = `${empresaId.value}/${servicoId}/foto.${ext}`
  const { error: upErr } = await supabase.storage
    .from('servicos-fotos')
    .upload(path, fotoFile.value, { upsert: true })
  if (upErr) throw new Error(upErr.message)
  const { data } = supabase.storage.from('servicos-fotos').getPublicUrl(path)
  return data.publicUrl
}

async function syncFuncionarios(servicoId: number) {
  await supabase.from('servico_funcionarios').delete().eq('servico_id', servicoId)
  if (form.funcionarioIds.length > 0) {
    const rows = form.funcionarioIds.map(fid => ({
      servico_id: servicoId,
      funcionario_id: fid,
    }))
    await supabase.from('servico_funcionarios').insert(rows)
  }
}

async function syncSimultaneos(servicoId: number) {
  const [delA, delB] = await Promise.all([
    supabase.from('servico_simultaneos').delete().eq('servico_id', servicoId),
    supabase.from('servico_simultaneos').delete().eq('servico_par_id', servicoId),
  ])
  if (delA.error) throw new Error('Erro ao remover simultâneos (A): ' + delA.error.message)
  if (delB.error) throw new Error('Erro ao remover simultâneos (B): ' + delB.error.message)

  if (form.simultaneosIds.length > 0) {
    const rows = form.simultaneosIds.flatMap(parId => [
      { servico_id: servicoId, servico_par_id: parId },
      { servico_id: parId, servico_par_id: servicoId },
    ])
    const { error: upsertErr } = await supabase
      .from('servico_simultaneos')
      .upsert(rows, { onConflict: 'servico_id,servico_par_id' })
    if (upsertErr) throw new Error('Erro ao salvar simultâneos: ' + upsertErr.message)
  }
}

async function salvarEdicao() {
  if (!editando.value || !validateForm()) return
  saving.value = true
  modalError.value = null

  try {
    form.foto_url = await uploadFotoServico(editando.value.id)
  } catch (e: any) {
    saving.value = false
    modalError.value = 'Erro ao enviar foto: ' + e.message
    return
  }

  const { error: updateError } = await supabase
    .from('servicos')
    .update(buildPayload())
    .eq('id', editando.value.id)

  if (updateError) { saving.value = false; modalError.value = updateError.message; return }

  await syncFuncionarios(editando.value.id)
  try {
    await syncSimultaneos(editando.value.id)
  } catch (e: any) {
    saving.value = false; modalError.value = e.message; return
  }

  saving.value = false
  editando.value = null
  await fetchServicos()
}

async function salvarAdicao() {
  if (!validateForm()) return
  saving.value = true
  modalError.value = null

  const { data: inserted, error: insertError } = await supabase
    .from('servicos')
    .insert(buildPayload())
    .select('id')
    .single()

  if (insertError) { saving.value = false; modalError.value = insertError.message; return }

  try {
    const fotoUrl = await uploadFotoServico(inserted.id)
    if (fotoUrl) {
      await supabase.from('servicos').update({ foto_url: fotoUrl }).eq('id', inserted.id)
    }
  } catch (e: any) {
    console.warn('Foto não enviada:', e.message)
  }

  await syncFuncionarios(inserted.id)
  try {
    await syncSimultaneos(inserted.id)
  } catch (e: any) {
    saving.value = false; modalError.value = e.message; return
  }
  saving.value = false
  adicionando.value = false
  await fetchServicos()
}

function confirmarExclusao(s: Servico) {
  excluindo.value = s
  deleteError.value = null
}

async function executarExclusao() {
  if (!excluindo.value) return
  deleting.value = true
  deleteError.value = null

  const { error: deleteErr } = await supabase
    .from('servicos')
    .delete()
    .eq('id', excluindo.value.id)

  deleting.value = false
  if (deleteErr) { deleteError.value = deleteErr.message; return }
  excluindo.value = null
  await fetchServicos()
}
</script>
