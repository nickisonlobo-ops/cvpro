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
              <svg class="w-5 sm:w-7 h-5 sm:h-7 text-white" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.5 0a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm-1.5 6.75a3.375 3.375 0 00-6.75 0h6.75z"/></svg>
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-semibold text-white/80 uppercase tracking-widest">CRM</span>
                <span class="w-1 h-1 rounded-full bg-white/40" />
                <span class="text-xs text-white/70 hidden sm:inline">UpStudio</span>
              </div>
              <h1 class="text-xl sm:text-3xl font-bold text-white tracking-tight leading-none">Clientes</h1>
              <p class="text-sm text-white/80 mt-1.5">
                {{ loading ? 'Carregando...' : `${clientesFiltrados.length} de ${clientes.length} cliente(s) exibido(s)` }}
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
              <span class="hidden sm:inline">Adicionar Cliente</span>
            </button>
          </div>
        </div>

        <div class="h-px bg-white/10 my-4 sm:my-6" />

        <!-- Stats -->
        <div v-if="!loading" class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="flex flex-col gap-1 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/10 hover:bg-white/15 transition-colors">
            <span class="text-xs font-semibold text-white/70 uppercase tracking-widest">Total</span>
            <span class="text-xl font-black text-white leading-tight">{{ clientes.length }}</span>
            <span class="text-xs text-white/50">cliente(s)</span>
          </div>
          <div class="flex flex-col gap-1 bg-white/10 rounded-2xl px-5 py-4 border border-white/10 hover:bg-white/15 transition-colors">
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-white" />
              <span class="text-xs font-semibold text-white/70 uppercase tracking-widest">Ativos</span>
            </div>
            <span class="text-xl font-black text-white leading-tight">{{ clientesAtivos }}</span>
            <span class="text-xs text-white/50">habilitados</span>
          </div>
          <div class="flex flex-col gap-1 bg-white/[0.07] rounded-2xl px-5 py-4 border border-white/10 hover:bg-white/12 transition-colors">
            <span class="text-xs font-semibold text-white/70 uppercase tracking-widest">Com E-mail</span>
            <span class="text-xl font-black text-white leading-tight">{{ comEmail }}</span>
            <span class="text-xs text-white/50">de {{ clientes.length }} cadastrados</span>
          </div>
          <div class="flex flex-col gap-1 bg-white/[0.07] rounded-2xl px-5 py-4 border border-white/10 hover:bg-white/12 transition-colors">
            <span class="text-xs font-semibold text-white/70 uppercase tracking-widest">Cidades</span>
            <span class="text-xl font-black text-white leading-tight">{{ cidadesUnicas.length }}</span>
            <span class="text-xs text-white/50">distintas</span>
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
              <input v-model="filtros.busca" type="text" placeholder="Nome, CPF/CNPJ, telefone ou e-mail..." class="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#6b7280)] focus:border-[var(--color-primary,#6b7280)] transition-shadow" />
            </div>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Cidade</label>
            <select v-model="filtros.cidade" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
              <option value="">Todas</option>
              <option v-for="c in cidadesUnicas" :key="c" :value="c">{{ c }}</option>
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
                  ? 'bg-primary border-primary text-white'
                  : 'border-gray-200 text-gray-500 hover:border-primary hover:text-primary bg-white'"
                @click="filtros.ativo = op.value"
              >
                {{ op.label }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ═══ Toggle Lista / Kanban ═══ -->
    <div class="flex items-center justify-end mb-4">
      <div class="flex rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
        <button type="button" class="px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5"
          :class="viewMode === 'list' ? 'text-white' : 'bg-white text-gray-500 hover:bg-gray-50'"
          :style="viewMode === 'list' ? { background: 'var(--color-primary)' } : {}"
          @click="viewMode = 'list'">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" /></svg>
          Lista
        </button>
        <button type="button" class="px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5"
          :class="viewMode === 'kanban' ? 'text-white' : 'bg-white text-gray-500 hover:bg-gray-50'"
          :style="viewMode === 'kanban' ? { background: 'var(--color-primary)' } : {}"
          @click="viewMode = 'kanban'">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z" /></svg>
          Kanban
        </button>
      </div>
    </div>

    <!-- ═══ MODO LISTA ═══ -->
    <div v-if="viewMode === 'list'">
      <div v-if="loading" class="flex flex-col items-center justify-center gap-4 py-32">
      <span class="spinner spinner-lg" />
      <span class="text-sm text-gray-400 font-medium">Carregando clientes...</span>
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
          <span class="text-primary font-black">{{ clientesFiltrados.length }}</span>
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
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">CPF / CNPJ</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Telefone</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">E-mail</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Cidade / Estado</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Status</th>
              <th class="px-7 py-4 text-right text-xs font-extrabold text-gray-400 uppercase tracking-widest sm:sticky sm:right-0 bg-gray-50">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-if="clientesFiltrados.length === 0">
              <td colspan="8" class="text-center py-20">
                <div class="flex flex-col items-center gap-3">
                  <svg class="w-14 h-14 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.25" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.5 0a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm-1.5 6.75a3.375 3.375 0 00-6.75 0h6.75z"/></svg>
                  <span class="text-base font-semibold text-gray-400">Nenhum cliente encontrado</span>
                  <span v-if="filtrosAtivos > 0" class="text-sm text-gray-400">Tente ajustar os filtros</span>
                </div>
              </td>
            </tr>
            <tr
              v-for="cli in clientesFiltrados"
              :key="cli.id"
              class="hover:bg-primary-5/40 transition-colors duration-150 group"
            >
              <td class="px-7 py-4">
                <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-10 text-primary font-black text-xs">
                  {{ cli.id }}
                </span>
              </td>
              <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-text font-black text-sm shrink-0 shadow-sm select-none">
                    {{ initials(cli.nome) }}
                  </div>
                  <button
                    type="button"
                    class="font-semibold text-gray-800 max-w-[160px] block truncate hover:text-primary transition-colors cursor-pointer"
                    @click="abrirDetalhesCliente(cli)"
                  >
                    {{ cli.nome }}
                  </button>
                </div>
              </td>
              <td class="px-5 py-4">
                <span v-if="cli.cpf_cnpj" class="font-mono text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">{{ cli.cpf_cnpj }}</span>
                <span v-else class="text-gray-300">-</span>
              </td>
              <td class="px-5 py-4 text-gray-500 font-medium">{{ cli.telefone ?? '-' }}</td>
              <td class="px-5 py-4 text-gray-500 font-medium">
                <span class="max-w-[180px] block truncate">{{ cli.email ?? '-' }}</span>
              </td>
              <td class="px-5 py-4">
                <span v-if="cli.cidade || cli.estado" class="text-gray-600 font-medium">
                  {{ [cli.cidade, cli.estado].filter(Boolean).join(' / ') }}
                </span>
                <span v-else class="text-gray-300">-</span>
              </td>
              <td class="px-5 py-4">
                <span
                  :class="['inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full',
                    cli.ativo !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500']"
                >
                  <span :class="['w-1.5 h-1.5 rounded-full', cli.ativo !== false ? 'bg-green-500' : 'bg-gray-400']" />
                  {{ cli.ativo !== false ? 'Ativo' : 'Inativo' }}
                </span>
              </td>
              <td class="px-7 py-4 text-right sm:sticky sm:right-0 group-hover:bg-primary-5/40 transition-colors">
                <div class="flex items-center justify-end gap-1">
                  <button
                    v-if="cli.telefone"
                    type="button"
                    class="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-green-500 hover:bg-green-50 transition-colors"
                    title="WhatsApp"
                    @click="abrirWhatsApp(cli)"
                  >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </button>
                  <button
                    v-if="isAdminOrGerente"
                    type="button"
                    class="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-primary hover:bg-primary-10 transition-colors"
                    title="Editar"
                    @click="editCliente(cli)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 7.125L18 8.625"/></svg>
                  </button>
                  <button
                    v-if="isAdminOrGerente"
                    type="button"
                    class="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-red-400 hover:bg-red-50 transition-colors"
                    title="Excluir"
                    @click="confirmarExclusao(cli)"
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
    </div>

    <!-- ═══ MODO KANBAN ═══ -->
    <div v-else-if="viewMode === 'kanban'">
      <KanbanBoard pipeline-tipo="crm" @card-click="onKanbanCardClick" />
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
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.5 0a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm-1.5 6.75a3.375 3.375 0 00-6.75 0h6.75z"/></svg>
                </div>
                <h2 class="text-lg font-bold text-white">{{ adicionando ? 'Adicionar Cliente' : 'Editar Cliente' }}</h2>
              </div>
              <button type="button" class="w-8 h-8 flex items-center justify-center rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors" @click="fecharModal">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <form class="flex flex-col gap-5 px-8 py-7 overflow-y-auto max-h-[70vh]" @submit.prevent="adicionando ? salvarAdicao() : salvarEdicao()">
              <!-- Nome + CPF/CNPJ -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AppInput v-model="form.nome" label="Nome *" placeholder="Ex: João da Silva" :error="formErrors.nome" required />
                <AppInput v-model="form.cpf_cnpj" label="CPF / CNPJ" placeholder="Ex: 000.000.000-00" :error="formErrors.cpf_cnpj" />
              </div>
              <!-- Telefone + E-mail -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AppInput v-model="form.telefone" label="Telefone" placeholder="Ex: (11) 99999-9999" />
                <AppInput v-model="form.email" label="E-mail" type="email" placeholder="Ex: joao@email.com" :error="formErrors.email" />
              </div>
              <!-- Endereço + Número -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="sm:col-span-2">
                  <AppInput v-model="form.endereco" label="Endereço" placeholder="Ex: Rua das Flores" />
                </div>
                <AppInput v-model="form.numero" label="Número" placeholder="Ex: 123" />
              </div>
              <!-- Bairro + CEP -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AppInput v-model="form.bairro" label="Bairro" placeholder="Ex: Centro" />
                <AppInput v-model="form.cep" label="CEP" placeholder="Ex: 00000-000" />
              </div>
              <!-- Cidade + Estado -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AppInput v-model="form.cidade" label="Cidade" placeholder="Ex: São Paulo" />
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-semibold text-gray-700">Estado</label>
                  <select v-model="form.estado" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                    <option value="">Selecione</option>
                    <option v-for="uf in ufs" :key="uf" :value="uf">{{ uf }}</option>
                  </select>
                </div>
              </div>
              <!-- Observação -->
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-semibold text-gray-700">Observação</label>
                <textarea
                  v-model="form.observacao"
                  rows="2"
                  placeholder="Informações adicionais..."
                  class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#6b7280)] focus:border-[var(--color-primary,#6b7280)] resize-none"
                />
              </div>
              <!-- Ativo -->
              <div class="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                <button
                  type="button"
                  class="relative w-11 h-6 rounded-full transition-colors duration-200"
                  :class="form.ativo ? 'bg-green-500' : 'bg-gray-300'"
                  @click="form.ativo = !form.ativo"
                >
                  <span class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200" :class="form.ativo ? 'translate-x-5' : 'translate-x-0'" />
                </button>
                <div>
                  <p class="text-sm font-semibold text-gray-700">Cliente ativo</p>
                  <p class="text-xs text-gray-400">{{ form.ativo ? 'Habilitado para novas vendas' : 'Desativado' }}</p>
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
              <h2 class="text-xl font-bold text-gray-800">Excluir cliente?</h2>
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

    <!-- MODAL DE DETALHES DO CLIENTE -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="modalDetalhesAberto"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          @click.self="fecharDetalhes"
        >
          <div class="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <!-- CABEÇALHO -->
            <div class="sticky top-0 flex items-center justify-between px-6 sm:px-8 py-4 sm:py-6 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h2 class="text-2xl sm:text-3xl font-bold text-gray-900">{{ clienteSelecionado?.nome }}</h2>
                <p class="text-sm text-gray-500 mt-1">Detalhes do cliente</p>
              </div>
              <button
                type="button"
                class="w-8 h-8 flex items-center justify-center rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors"
                @click="fecharDetalhes"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- CONTEÚDO -->
            <div class="px-6 sm:px-8 py-6 space-y-6">
              <!-- INFORMAÇÕES BÁSICAS -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="bg-gray-50 rounded-2xl p-4">
                  <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">Telefone</span>
                  <p class="text-lg font-bold text-gray-900 mt-2">{{ clienteSelecionado?.telefone || '—' }}</p>
                </div>
                <div class="bg-gray-50 rounded-2xl p-4">
                  <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">Email</span>
                  <p class="text-lg font-bold text-gray-900 mt-2 truncate">{{ clienteSelecionado?.email || '—' }}</p>
                </div>
                <div class="bg-gray-50 rounded-2xl p-4">
                  <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">CPF/CNPJ</span>
                  <p class="text-lg font-bold text-gray-900 mt-2">{{ clienteSelecionado?.cpf_cnpj || '—' }}</p>
                </div>
                <div class="bg-gray-50 rounded-2xl p-4 sm:col-span-2">
                  <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">Endereço</span>
                  <p class="text-lg font-bold text-gray-900 mt-2">
                    {{ clienteSelecionado ? formatarEndereco(clienteSelecionado) : '—' }}
                  </p>
                </div>
                <div class="bg-gray-50 rounded-2xl p-4">
                  <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">Status</span>
                  <div class="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold"
                    :class="clienteSelecionado?.ativo
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'"
                  >
                    <span class="w-2 h-2 rounded-full"
                      :class="clienteSelecionado?.ativo ? 'bg-green-600' : 'bg-red-600'"
                    />
                    {{ clienteSelecionado?.ativo ? 'Ativo' : 'Inativo' }}
                  </div>
                </div>
              </div>

              <!-- BOTÕES DE AÇÃO -->
              <div class="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  v-if="clienteSelecionado?.telefone"
                  @click="abrirWhatsApp(clienteSelecionado!)"
                  class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </button>
                <button
                  v-if="isAdminOrGerente"
                  @click="editCliente(clienteSelecionado!)"
                  class="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </button>
              </div>

              <!-- HISTÓRICO DE ATENDIMENTOS -->
              <div class="border-t border-gray-100 pt-6">
                <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center justify-between">
                  <span>Histórico de Atendimentos</span>
                  <span class="inline-flex items-center justify-center min-w-[32px] h-8 px-2 rounded-lg bg-primary-10 text-primary text-sm font-bold">
                    {{ atendimentosCliente.length }}
                  </span>
                </h3>

                <div v-if="carregandoAtendimentos" class="flex items-center justify-center gap-3 py-8">
                  <span class="spinner spinner-md" />
                  <span class="text-sm text-gray-500">Carregando atendimentos...</span>
                </div>

                <div v-else-if="atendimentosCliente.length === 0" class="py-8 text-center text-gray-500">
                  <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p class="text-sm">Nenhum atendimento registrado</p>
                </div>

                <div v-else class="space-y-3 max-h-[300px] overflow-y-auto">
                  <div
                    v-for="atendimento in atendimentosCliente"
                    :key="atendimento.id"
                    class="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div class="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <p class="text-sm font-bold text-gray-500 uppercase tracking-widest">
                          {{ formatarData(atendimento.data_hora) }}
                        </p>
                        <p class="text-base font-bold text-gray-900">
                          {{ atendimento.servicos?.join(', ') || 'Serviço não especificado' }}
                        </p>
                      </div>
                      <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap"
                        :class="statusClass(atendimento.status)"
                      >
                        <span class="w-2 h-2 rounded-full" :class="statusDotClass(atendimento.status)" />
                        {{ formatarStatus(atendimento.status) }}
                      </div>
                    </div>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                      <div v-if="atendimento.funcionario">
                        <span class="text-gray-500 text-xs">Profissional</span>
                        <p class="font-semibold text-gray-900">{{ atendimento.funcionario }}</p>
                      </div>
                      <div>
                        <span class="text-gray-500 text-xs">Valor</span>
                        <p class="font-semibold text-gray-900">{{ formatarValor(atendimento.valor_total) }}</p>
                      </div>
                      <div v-if="atendimento.observacoes" class="sm:col-span-3">
                        <span class="text-gray-500 text-xs">Observações</span>
                        <p class="font-semibold text-gray-900 line-clamp-2">{{ atendimento.observacoes }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- MODAL ENVIAR MENSAGEM (DENTRO DO MODAL PRINCIPAL) -->
              <div v-if="modalMensagem" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div class="bg-white rounded-3xl shadow-2xl max-w-2xl w-full">
                  <div class="flex items-center justify-between px-6 sm:px-8 py-4 sm:py-6 border-b border-gray-100 bg-gray-50/50">
                    <h3 class="text-xl sm:text-2xl font-bold text-gray-900">Enviar Mensagem</h3>
                    <button
                      type="button"
                      class="w-8 h-8 flex items-center justify-center rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors"
                      @click="fecharModalMensagem"
                    >
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div class="px-6 sm:px-8 py-6 space-y-4">
                    <div>
                      <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Para</label>
                      <p class="text-lg font-bold text-gray-900 mt-2">{{ clienteSelecionado?.nome }}</p>
                    </div>
                    <div>
                      <label class="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Mensagem</label>
                      <textarea
                        v-model="formularioMensagem.conteudo"
                        placeholder="Digite sua mensagem aqui..."
                        rows="5"
                        class="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-400 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                      />
                    </div>
                    <div v-if="erroMensagem" class="flex items-center gap-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                      <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <path stroke-linecap="round" d="M12 8v4m0 4h.01" />
                      </svg>
                      {{ erroMensagem }}
                    </div>
                  </div>
                  <div class="flex gap-3 px-6 sm:px-8 py-4 border-t border-gray-100 bg-gray-50/50">
                    <button
                      type="button"
                      class="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors font-bold text-sm"
                      @click="fecharModalMensagem"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      class="flex-1 py-3 rounded-xl bg-primary text-primary-text hover:shadow-lg hover:scale-[1.02] transition-all font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      :disabled="!formularioMensagem.conteudo.trim() || enviarMensagemLoading"
                      @click="enviarMensagem"
                    >
                      <span v-if="enviarMensagemLoading" class="inline-flex items-center gap-2">
                        <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Enviando...
                      </span>
                      <span v-else>Enviar</span>
                    </button>
                  </div>
                </div>
              </div>
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
import KanbanBoard from '~/components/kanban/KanbanBoard.vue'
import type { KanbanCard } from '~/composables/useKanban'

interface Cliente {
  id: number
  nome: string
  cpf_cnpj: string | null
  telefone: string | null
  email: string | null
  endereco: string | null
  numero: string | null
  bairro: string | null
  cidade: string | null
  estado: string | null
  cep: string | null
  observacao: string | null
  ativo: boolean | null
  created_at: string | null
}

const supabase = createSupabaseClient()
const router = useRouter()
const { empresaId, loadEmpresa } = useEmpresa()
const { isAdminOrGerente } = useAdmin()

const clientes = ref<Cliente[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const viewMode = ref<'list' | 'kanban'>('kanban')

const editando = ref<Cliente | null>(null)
const adicionando = ref(false)
const saving = ref(false)
const modalError = ref<string | null>(null)

const excluindo = ref<Cliente | null>(null)
const deleting = ref(false)
const deleteError = ref<string | null>(null)

const clienteSelecionado = ref<Cliente | null>(null)
const modalDetalhesAberto = ref(false)
const carregandoAtendimentos = ref(false)
const atendimentosCliente = ref<any[]>([])
const modalMensagem = ref(false)
const formularioMensagem = reactive({ conteudo: '' })
const enviarMensagemLoading = ref(false)
const erroMensagem = ref<string | null>(null)

const form = reactive({
  nome: '',
  cpf_cnpj: '',
  telefone: '',
  email: '',
  endereco: '',
  numero: '',
  bairro: '',
  cidade: '',
  estado: '',
  cep: '',
  observacao: '',
  ativo: true,
})

const formErrors = reactive({ nome: '', cpf_cnpj: '', email: '' })

const filtroAberto = ref(false)
const filtros = reactive({ busca: '', cidade: '', ativo: '' })

const ufs = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
  'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
]

// �"?�"? Stats �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?
const clientesAtivos = computed(() =>
  clientes.value.filter(c => c.ativo !== false).length
)
const comEmail = computed(() =>
  clientes.value.filter(c => c.email).length
)
const cidadesUnicas = computed(() => {
  const set = new Set(clientes.value.map(c => c.cidade).filter(Boolean) as string[])
  return Array.from(set).sort()
})

// �"?�"? Filtros �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?
const filtrosAtivos = computed(() => {
  let c = 0
  if (filtros.busca) c++
  if (filtros.cidade) c++
  if (filtros.ativo) c++
  return c
})

const clientesFiltrados = computed(() => {
  return clientes.value.filter(c => {
    if (filtros.cidade && c.cidade !== filtros.cidade) return false
    if (filtros.ativo === 'true' && c.ativo === false) return false
    if (filtros.ativo === 'false' && c.ativo !== false) return false
    if (filtros.busca.trim()) {
      const q = filtros.busca.toLowerCase()
      return (
        c.nome.toLowerCase().includes(q) ||
        (c.cpf_cnpj ?? '').includes(q) ||
        (c.telefone ?? '').includes(q) ||
        (c.email ?? '').toLowerCase().includes(q)
      )
    }
    return true
  })
})

function limparFiltros() {
  filtros.busca = ''
  filtros.cidade = ''
  filtros.ativo = ''
}

// �"?�"? Helpers �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?
function initials(nome: string): string {
  const parts = nome.trim().split(' ').filter(Boolean)
  if (parts.length >= 2) return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase()
  return (nome[0] ?? '?').toUpperCase()
}

// �"?�"? CRUD �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?
onMounted(async () => { await loadEmpresa(); await fetchClientes() })

async function abrirDetalhesCliente(cliente: Cliente) {
  clienteSelecionado.value = cliente
  modalDetalhesAberto.value = true
  await fetchAtendimentosCliente(cliente.id)
}

async function onKanbanCardClick(card: KanbanCard) {
  // Fetch full client data and open details modal
  const { data, error: fetchError } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', card.id)
    .single()

  if (fetchError || !data) {
    console.error('Erro ao carregar cliente do kanban:', fetchError?.message)
    return
  }

  await abrirDetalhesCliente(data as Cliente)
}

function fecharDetalhes() {
  clienteSelecionado.value = null
  modalDetalhesAberto.value = false
  atendimentosCliente.value = []
}

function abrirWhatsApp(cliente: Cliente) {
  if (!cliente.telefone) return
  // Remove tudo que não é número
  const numero = cliente.telefone.replace(/\D/g, '')
  // Adiciona 55 (Brasil) se não tiver código de país
  const tel = numero.length <= 11 ? '55' + numero : numero
  const msg = encodeURIComponent(`Olá ${cliente.nome}! `)
  window.open(`https://wa.me/${tel}?text=${msg}`, '_blank')
}

async function fetchAtendimentosCliente(clienteId: string) {
  carregandoAtendimentos.value = true
  const { data, error: fetchError } = await supabase
    .from('agendamentos')
    .select(`
      id,
      data_hora,
      status,
      valor_total,
      observacoes,
      funcionario_id,
      agendamento_servicos (
        servico_id,
        servicos (nome)
      )
    `)
    .eq('cliente_id', clienteId)
    .eq('empresa_id', empresaId.value!)
    .order('data_hora', { ascending: false })

  carregandoAtendimentos.value = false
  
  if (fetchError) {
    console.error('Erro ao carregar atendimentos:', fetchError)
    return
  }

  if (data) {
    const funcionarioIds = [...new Set(data.map((a: any) => a.funcionario_id).filter(Boolean))]
    let funcionarios: Record<string, string> = {}

    if (funcionarioIds.length > 0) {
      const { data: funcs } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', funcionarioIds)

      if (funcs) {
        funcionarios = Object.fromEntries(funcs.map((f: any) => [f.id, f.full_name]))
      }
    }

    atendimentosCliente.value = data.map((a: any) => ({
      id: a.id,
      data_hora: a.data_hora,
      status: a.status,
      valor_total: a.valor_total,
      observacoes: a.observacoes,
      funcionario: a.funcionario_id ? funcionarios[a.funcionario_id] || 'Não especificado' : null,
      servicos: a.agendamento_servicos?.map((s: any) => s.servicos?.nome).filter(Boolean) || [],
    }))
  }
}

async function fetchClientes() {
  loading.value = true
  const { data, error: fetchError } = await supabase
    .from('clientes')
    .select('*')
    .eq('empresa_id', empresaId.value!)
    .order('nome', { ascending: true })

  loading.value = false
  if (fetchError) { error.value = fetchError.message; return }
  clientes.value = (data ?? []) as Cliente[]
}

function abrirAdicionar() {
  adicionando.value = true
  editando.value = null
  modalError.value = null
  formErrors.nome = ''; formErrors.cpf_cnpj = ''; formErrors.email = ''
  form.nome = ''; form.cpf_cnpj = ''; form.telefone = ''; form.email = ''
  form.endereco = ''; form.numero = ''; form.bairro = ''; form.cidade = ''
  form.estado = ''; form.cep = ''; form.observacao = ''; form.ativo = true
}

function fecharModal() {
  editando.value = null
  adicionando.value = false
}

function editCliente(cli: Cliente) {
  editando.value = cli
  modalError.value = null
  formErrors.nome = ''; formErrors.cpf_cnpj = ''; formErrors.email = ''
  form.nome       = cli.nome
  form.cpf_cnpj   = cli.cpf_cnpj ?? ''
  form.telefone   = cli.telefone ?? ''
  form.email      = cli.email ?? ''
  form.endereco   = cli.endereco ?? ''
  form.numero     = cli.numero ?? ''
  form.bairro     = cli.bairro ?? ''
  form.cidade     = cli.cidade ?? ''
  form.estado     = cli.estado ?? ''
  form.cep        = cli.cep ?? ''
  form.observacao = cli.observacao ?? ''
  form.ativo      = cli.ativo !== false
}

function buildPayload() {
  return {
    nome:       form.nome.trim(),
    cpf_cnpj:   form.cpf_cnpj.trim() || null,
    telefone:   form.telefone.trim() || null,
    email:      form.email.trim() || null,
    endereco:   form.endereco.trim() || null,
    numero:     form.numero.trim() || null,
    bairro:     form.bairro.trim() || null,
    cidade:     form.cidade.trim() || null,
    estado:     form.estado || null,
    cep:        form.cep.trim() || null,
    observacao: form.observacao.trim() || null,
    ativo:      form.ativo,
    empresa_id: empresaId.value!,
  }
}

function validateForm(): boolean {
  formErrors.nome = ''; formErrors.cpf_cnpj = ''; formErrors.email = ''
  let ok = true
  if (!form.nome.trim()) { formErrors.nome = 'O nome é obrigatório.'; ok = false }
  return ok
}

async function salvarEdicao() {
  if (!editando.value || !validateForm()) return
  saving.value = true
  modalError.value = null

  const { error: updateError } = await supabase
    .from('clientes')
    .update(buildPayload())
    .eq('id', editando.value.id)

  saving.value = false
  if (updateError) {
    modalError.value = updateError.message.includes('clientes_cpf_cnpj_key')
      ? 'Este CPF/CNPJ já está cadastrado.'
      : updateError.message.includes('clientes_email_key')
        ? 'Este e-mail já está cadastrado.'
        : updateError.message
    return
  }

  editando.value = null
  await fetchClientes()
}

async function salvarAdicao() {
  if (!validateForm()) return
  saving.value = true
  modalError.value = null

  const { error: insertError } = await supabase
    .from('clientes')
    .insert(buildPayload())

  saving.value = false
  if (insertError) {
    modalError.value = insertError.message.includes('clientes_cpf_cnpj_key')
      ? 'Este CPF/CNPJ já está cadastrado.'
      : insertError.message.includes('clientes_email_key')
        ? 'Este e-mail já está cadastrado.'
        : insertError.message
    return
  }

  adicionando.value = false
  await fetchClientes()
}

function confirmarExclusao(cli: Cliente) {
  excluindo.value = cli
  deleteError.value = null
}

async function executarExclusao() {
  if (!excluindo.value) return
  deleting.value = true
  deleteError.value = null

  const { error: deleteErr } = await supabase
    .from('clientes')
    .delete()
    .eq('id', excluindo.value.id)

  deleting.value = false
  if (deleteErr) { deleteError.value = deleteErr.message; return }

  excluindo.value = null
  await fetchClientes()
}

// 🔹 Funções para Modal de Detalhes 🔹
function formatarEndereco(cliente: Cliente): string {
  const parts = [
    cliente.endereco,
    cliente.numero,
    cliente.bairro,
    cliente.cidade,
    cliente.estado,
    cliente.cep,
  ].filter(Boolean)
  return parts.join(', ')
}

function formatarData(data: string): string {
  return new Date(data).toLocaleDateString('pt-BR', {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatarValor(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor || 0)
}

function formatarStatus(status: string): string {
  const statusMap: Record<string, string> = {
    agendado: 'Agendado',
    confirmado: 'Confirmado',
    concluido: 'Concluído',
    cancelado: 'Cancelado',
    faltou: 'Faltou',
  }
  return statusMap[status] || status
}

function statusClass(status: string): string {
  const classes: Record<string, string> = {
    agendado: 'bg-blue-100 text-blue-700',
    confirmado: 'bg-purple-100 text-purple-700',
    concluido: 'bg-green-100 text-green-700',
    cancelado: 'bg-red-100 text-red-700',
    faltou: 'bg-orange-100 text-orange-700',
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

function statusDotClass(status: string): string {
  const classes: Record<string, string> = {
    agendado: 'bg-blue-600',
    confirmado: 'bg-purple-600',
    concluido: 'bg-green-600',
    cancelado: 'bg-red-600',
    faltou: 'bg-orange-600',
  }
  return classes[status] || 'bg-gray-600'
}

function abrirModalMensagem() {
  modalMensagem.value = true
  formularioMensagem.conteudo = ''
  erroMensagem.value = null
}

function fecharModalMensagem() {
  modalMensagem.value = false
  formularioMensagem.conteudo = ''
  erroMensagem.value = null
}

async function enviarMensagem() {
  if (!formularioMensagem.conteudo.trim() || !clienteSelecionado.value) return

  enviarMensagemLoading.value = true
  erroMensagem.value = null

  const { error: insertError } = await supabase
    .from('mensagens')
    .insert({
      empresa_id: empresaId.value,
      cliente_id: clienteSelecionado.value.id,
      usuario_id: (await supabase.auth.getUser()).data.user?.id,
      conteudo: formularioMensagem.conteudo.trim(),
      tipo: 'saida',
    })

  enviarMensagemLoading.value = false

  if (insertError) {
    erroMensagem.value = 'Erro ao enviar mensagem: ' + insertError.message
    return
  }

  fecharModalMensagem()
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-fade-enter-active { transition: all 0.2s ease; }
.slide-fade-leave-active { transition: all 0.15s ease; }
.slide-fade-enter-from, .slide-fade-leave-to { transform: translateY(-8px); opacity: 0; }
</style>
