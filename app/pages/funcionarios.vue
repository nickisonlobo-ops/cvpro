<template>
  <div class="min-h-full bg-transparent px-6 md:px-8 lg:px-12 py-6">

    <!-- �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� CABE�?ALHO �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� -->
    <div class="relative rounded-3xl overflow-hidden mb-6 shadow-xl">
      <div class="absolute inset-0" :style="{ background: 'var(--color-primary-bg, linear-gradient(135deg, #ec4899, #f43f5e))' }" />
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />
      <div class="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/[0.03] pointer-events-none" />
      <div class="absolute -bottom-20 left-1/4 w-96 h-96 rounded-full bg-white/[0.02] pointer-events-none" />
      <PageLogo />

      <div class="relative px-4 sm:px-8 pt-5 sm:pt-7 pb-5 sm:pb-7">
        <!-- Título + ações -->
        <div class="flex flex-wrap items-start justify-between gap-3 sm:gap-6">
          <div class="flex items-center gap-3 sm:gap-5">
            <div class="flex items-center justify-center w-10 sm:w-14 h-10 sm:h-14 rounded-2xl bg-white/[0.12] backdrop-blur-sm border border-white/20 shadow-lg">
              <svg class="w-5 sm:w-7 h-5 sm:h-7 text-white" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg>
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-semibold text-white/80 uppercase tracking-widest">Gestão</span>
                <span class="w-1 h-1 rounded-full bg-white/40" />
                <span class="text-xs text-white/70 hidden sm:inline">UpStudio</span>
              </div>
              <h1 class="text-xl sm:text-3xl font-bold text-white tracking-tight leading-none">Funcionários</h1>
              <p class="text-sm text-white/80 mt-1.5">
                {{ loading ? 'Carregando...' : `${funcionariosFiltrados.length} de ${funcionarios.length} funcionário(s) exibido(s)` }}
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
              <span v-if="buscaAtiva" class="inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-white text-primary text-xs font-black">1</span>
            </button>
            <button
              v-if="isAdminOrGerente"
              type="button"
              class="inline-flex items-center gap-2 text-sm font-bold px-3 sm:px-5 py-2.5 rounded-xl bg-white text-primary hover:bg-primary-5 shadow-lg transition-all duration-200 hover:scale-[1.02]"
              @click="modalFolha = true"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
              <span class="hidden sm:inline">Lançar Folha</span>
            </button>
            <button
              v-if="isAdminOrGerente"
              type="button"
              class="inline-flex items-center gap-2 text-sm font-bold px-3 sm:px-5 py-2.5 rounded-xl bg-white text-primary hover:bg-primary-5 shadow-lg transition-all duration-200 hover:scale-[1.02]"
              @click="abrirAdicionar"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
              <span class="hidden sm:inline">Adicionar Funcionário</span>
            </button>
          </div>
        </div>

        <!-- Divisor -->
        <div class="h-px bg-white/10 my-4 sm:my-6" />

        <!-- Stats -->
        <div v-if="!loading" class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="flex flex-col gap-1 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/10 hover:bg-white/15 transition-colors">
            <span class="text-xs font-semibold text-white/70 uppercase tracking-widest">Total</span>
            <span class="text-xl font-black text-white leading-tight">{{ funcionarios.length }}</span>
            <span class="text-xs text-white/50">funcionário(s)</span>
          </div>
          <div class="flex flex-col gap-1 bg-white/10 rounded-2xl px-5 py-4 border border-white/10 hover:bg-white/15 transition-colors">
            <span class="text-xs font-semibold text-white/70 uppercase tracking-widest">Folha Salarial</span>
            <span class="text-xl font-black text-white leading-tight">{{ formatCurrency(totalFolha) }}</span>
            <span class="text-xs text-white/50">soma dos salários</span>
          </div>
          <div class="flex flex-col gap-1 bg-white/10 rounded-2xl px-5 py-4 border border-white/10 hover:bg-white/15 transition-colors">
            <span class="text-xs font-semibold text-white/70 uppercase tracking-widest">Média Salarial</span>
            <span class="text-xl font-black text-white leading-tight">{{ formatCurrency(mediaSalarial) }}</span>
            <span class="text-xs text-white/50">por funcionário</span>
          </div>
          <div class="flex flex-col gap-1 bg-white/[0.07] rounded-2xl px-5 py-4 border border-white/10 hover:bg-white/12 transition-colors">
            <span class="text-xs font-semibold text-white/70 uppercase tracking-widest">Com Cargo</span>
            <span class="text-xl font-black text-white leading-tight">{{ comCargo }}</span>
            <span class="text-xs text-white/50">de {{ funcionarios.length }} cadastrados</span>
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
          <button v-if="buscaAtiva" type="button" class="text-xs font-semibold text-primary hover:text-primary hover:underline" @click="busca = ''">
            Limpar
          </button>
        </div>
        <div class="p-7 grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div class="lg:col-span-2 flex flex-col gap-1.5">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Busca</label>
            <div class="relative">
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="m21 21-4.35-4.35"/></svg>
              <input
                v-model="busca"
                type="text"
                placeholder="Nome, e-mail, CPF ou cargo..."
                class="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#6b7280)] focus:border-[var(--color-primary,#6b7280)] transition-shadow"
              />
            </div>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Filtrar por cargo</label>
            <select
              v-model="filtroCargo"
              class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Todos os cargos</option>
              <option v-for="cargo in cargosUnicos" :key="cargo" :value="cargo">{{ cargo }}</option>
            </select>
          </div>
        </div>
      </div>
    </Transition>

    <!-- �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� LOADING �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� -->
    <div v-if="loading" class="flex flex-col items-center justify-center gap-4 py-32">
      <span class="inline-block w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      <span class="text-sm text-gray-400 font-medium">Carregando funcionários...</span>
    </div>

    <!-- �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� ERRO �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� -->
    <div v-else-if="error" class="flex items-center gap-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-2xl px-6 py-4">
      <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" d="M12 8v4m0 4h.01"/></svg>
      {{ error }}
    </div>

    <!-- �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� TABELA �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� -->
    <AppCard v-else elevation="raised" padding="none">
      <template #header>
        <div class="flex items-center justify-between px-7 py-4">
        <span class="text-sm font-semibold text-gray-600">
          <span class="text-primary font-black">{{ funcionariosFiltrados.length }}</span>
          resultado(s)
          <span v-if="buscaAtiva || filtroCargo" class="text-gray-400 font-normal"> �?" filtros aplicados</span>
        </span>
        <span class="text-xs text-gray-400">Ordenado por ID</span>
      </div>
      </template>

      <div class="overflow-x-auto">
        <table class="min-w-full text-sm whitespace-nowrap">
          <thead>
            <tr class="bg-primary-5">
              <th class="text-left px-7 py-4 text-[11px] font-semibold text-primary-500 uppercase tracking-[0.05em]">#</th>
              <th class="text-left px-5 py-4 text-[11px] font-semibold text-primary-500 uppercase tracking-[0.05em]">Nome</th>
              <th class="text-left px-5 py-4 text-[11px] font-semibold text-primary-500 uppercase tracking-[0.05em]">E-mail</th>
              <th class="text-left px-5 py-4 text-[11px] font-semibold text-primary-500 uppercase tracking-[0.05em]">CPF</th>
              <th class="text-left px-5 py-4 text-[11px] font-semibold text-primary-500 uppercase tracking-[0.05em]">Idade</th>
              <th class="text-left px-5 py-4 text-[11px] font-semibold text-primary-500 uppercase tracking-[0.05em]">Cargo</th>
              <th class="text-left px-5 py-4 text-[11px] font-semibold text-primary-500 uppercase tracking-[0.05em]">Perfil</th>
              <th class="text-left px-5 py-4 text-[11px] font-semibold text-primary-500 uppercase tracking-[0.05em]">Salário</th>
              <th class="text-left px-5 py-4 text-[11px] font-semibold text-primary-500 uppercase tracking-[0.05em]">Endereço</th>
              <th class="px-7 py-4 text-right text-[11px] font-semibold text-primary-500 uppercase tracking-[0.05em] sm:sticky sm:right-0 bg-gray-50">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-if="funcionariosFiltrados.length === 0">
              <td colspan="10" class="text-center py-20">
                <div class="flex flex-col items-center gap-3">
                  <svg class="w-14 h-14 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.25" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg>
                  <span class="text-base font-semibold text-gray-400">Nenhum funcionário encontrado</span>
                  <span v-if="buscaAtiva || filtroCargo" class="text-sm text-gray-400">Tente ajustar os filtros</span>
                </div>
              </td>
            </tr>
            <tr
              v-for="func in funcionariosFiltrados"
              :key="func.id"
              class="hover:bg-primary-5/40 transition-colors duration-150 group"
            >
              <td class="px-7 py-4">
                <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-primary font-black text-xs">
                  {{ func.id }}
                </span>
              </td>
              <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm shadow-pink-200 select-none">
                    {{ initials(func.nome) }}
                  </div>
                  <span class="font-semibold text-gray-800">{{ func.nome }}</span>
                </div>
              </td>
              <td class="px-5 py-4 text-gray-500 font-medium">{{ func.email ?? '�?"' }}</td>
              <td class="px-5 py-4 text-gray-500 font-medium tabular-nums">{{ func.cpf ?? '�?"' }}</td>
              <td class="px-5 py-4 text-gray-500 font-medium text-center">{{ func.idade ?? '�?"' }}</td>
              <td class="px-5 py-4">
                <span v-if="func.cargo" class="inline-block text-xs font-bold bg-primary-5 text-primary border border-primary-10 rounded-xl px-3 py-1.5">
                  {{ func.cargo }}
                </span>
                <span v-else class="text-gray-300">�?"</span>
              </td>              <td class="px-5 py-4">
                <span
                  class="inline-block text-xs font-bold rounded-xl px-3 py-1.5 capitalize"
                  :class="{
                    'bg-red-50 text-red-700 border border-red-200': func.perfil === 'admin',
                    'bg-blue-50 text-blue-700 border border-blue-200': func.perfil === 'gerente',
                    'bg-gray-100 text-gray-600 border border-gray-200': !func.perfil || func.perfil === 'funcionario',
                  }"
                >
                  {{ func.perfil ?? 'funcionario' }}
                </span>
              </td>              <td class="px-5 py-4">
                <span v-if="func.salario" class="text-[15px] font-bold text-gray-900 font-[tabular-nums]">{{ formatCurrency(func.salario) }}</span>
                <span v-else class="text-gray-300">�?"</span>
              </td>
              <td class="px-5 py-4">
                <span class="text-gray-400 text-xs max-w-[200px] block truncate" :title="func.endereco ?? ''">{{ func.endereco ?? '�?"' }}</span>
              </td>
              <td class="px-7 py-4 text-right sm:sticky sm:right-0 group-hover:bg-primary-5/60 transition-colors">
                <div class="flex items-center justify-end gap-1">
                  <button
                    v-if="isAdminOrGerente"
                    type="button"
                    title="Editar"
                    class="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-primary hover:bg-primary-10 transition-colors"
                    @click="editFuncionario(func)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2.414a2 2 0 01.586-1.414z"/></svg>
                  </button>
                  <button
                    v-if="isAdmin"
                    type="button"
                    title="Excluir"
                    class="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-red-400 hover:bg-red-50 transition-colors"
                    @click="confirmarExclusao(func)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a1 1 0 01-1-1V5a1 1 0 011-1h8a1 1 0 011 1v1a1 1 0 01-1 1H9z"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </AppCard>

    <!-- �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� MODAL LAN�?AR FOLHA �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="modalFolha"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md px-4"
          @click.self="fecharModalFolha"
        >
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div class="flex items-center justify-between px-8 py-6 border-b border-white/10" :style="{ background: 'var(--color-primary-bg, linear-gradient(135deg, #111827, #1f2937))' }">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                </div>
                <h2 class="text-lg font-bold text-white">Lançar Folha Salarial</h2>
              </div>
              <button type="button" class="w-8 h-8 flex items-center justify-center rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors" @click="fecharModalFolha">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div class="px-8 py-6 space-y-5">
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-bold text-gray-700">Mês de referência</label>
                <input
                  v-model="folhaMes"
                  type="month"
                  class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#6b7280)] focus:border-[var(--color-primary,#6b7280)]"
                />
                <p class="text-xs text-gray-400">Será criada uma conta a pagar para cada funcionário com salário cadastrado, com vencimento no dia 5 do mês seguinte.</p>
              </div>

              <!-- Preview -->
              <div v-if="folhaMes" class="rounded-2xl border border-gray-100 overflow-hidden">
                <div class="bg-gray-50 px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
                  <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">Pré-visualização</span>
                  <span class="text-xs font-semibold text-green-700">{{ funcionariosComSalario.length }} funcionário(s)</span>
                </div>
                <div class="max-h-48 overflow-y-auto divide-y divide-gray-50">
                  <div v-if="funcionariosComSalario.length === 0" class="px-4 py-8 text-center text-sm text-gray-400">
                    Nenhum funcionário com salário cadastrado.
                  </div>
                  <div v-for="f in funcionariosComSalario" :key="f.id" class="flex items-center justify-between px-4 py-3">
                    <div class="flex items-center gap-2.5">
                      <div class="w-7 h-7 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white font-black text-[10px]">
                        {{ initials(f.nome) }}
                      </div>
                      <span class="text-sm font-medium text-gray-700">{{ f.nome }}</span>
                    </div>
                    <span class="text-sm font-black text-gray-900 tabular-nums">{{ formatCurrency(f.salario!) }}</span>
                  </div>
                </div>
                <div v-if="funcionariosComSalario.length > 0" class="flex items-center justify-between px-4 py-3 bg-orange-50 border-t border-orange-100">
                  <span class="text-xs font-bold text-orange-700 uppercase tracking-wider">Total da Folha</span>
                  <span class="text-base font-black text-orange-700 tabular-nums">{{ formatCurrency(totalFolhaPreview) }}</span>
                </div>
              </div>

              <p v-if="folhaError" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {{ folhaError }}
              </p>
              <p v-if="folhaSucesso" class="text-sm text-primary bg-primary-5 border border-primary-10 rounded-xl px-4 py-3">
                {{ folhaSucesso }}
              </p>

              <div class="flex gap-3 pt-1">
                <button type="button" class="flex-1 py-3 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors text-sm font-semibold" @click="fecharModalFolha">
                  Cancelar
                </button>
                <button
                  type="button"
                  class="flex-1 py-3 rounded-xl bg-primary hover:opacity-90 text-primary-text font-bold text-sm transition-colors shadow-sm disabled:opacity-60"
                  :disabled="lanandoFolha || !folhaMes || funcionariosComSalario.length === 0"
                  @click="lancarFolha"
                >
                  <span v-if="lanandoFolha" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                  {{ lanandoFolha ? 'Lançando...' : `Lançar ${funcionariosComSalario.length} entrada(s)` }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� MODAL ADICIONAR / EDITAR �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="editando !== null || adicionando"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md px-4"
          @click.self="fecharModal"
        >
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div class="flex items-center justify-between px-8 py-6 border-b border-white/10" :style="{ background: 'var(--color-primary-bg, linear-gradient(135deg, #111827, #1f2937))' }">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>
                </div>
                <h2 class="text-lg font-bold text-white">{{ adicionando ? 'Adicionar Funcionário' : 'Editar Funcionário' }}</h2>
              </div>
              <button type="button" class="w-8 h-8 flex items-center justify-center rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors" @click="fecharModal">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <form class="flex flex-col gap-5 px-8 py-7 overflow-y-auto max-h-[70vh]" @submit.prevent="adicionando ? salvarAdicao() : salvarEdicao()">
              <AppInput v-model="form.nome" label="Nome completo" placeholder="Ex: João da Silva" :error="editErrors.nome" required />
              <AppInput v-model="form.email" label="E-mail" type="email" placeholder="email@exemplo.com" :error="editErrors.email" />
              <div class="grid grid-cols-2 gap-4">
                <AppInput v-model="form.cargo" label="Cargo" placeholder="Ex: Veterinário" />
                <AppInput v-model="form.idade" label="Idade" type="number" placeholder="Ex: 30" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <AppInput v-model="form.cpf" label="CPF" placeholder="Ex: 12345678900" />
                <AppInput v-model="form.salario" label="Salário (R$)" type="number" placeholder="Ex: 3500.00" />
              </div>
              <AppInput v-model="form.endereco" label="Endereço" placeholder="Rua, número, cidade" />

              <!-- Permissão -->
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Permissão / Perfil</label>
                <select
                  v-model="form.perfil"
                  class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#6b7280)] focus:border-[var(--color-primary,#6b7280)]"
                >
                  <option value="funcionario">Funcionário — acesso básico</option>
                  <option value="gerente">Gerente — acesso intermediário</option>
                  <option value="admin">Admin — acesso total</option>
                </select>
              </div>

              <!-- Criar login (só no modo adicionar) -->
              <div v-if="adicionando" class="rounded-2xl border border-dashed border-gray-200 p-4 flex flex-col gap-4">
                <label class="flex items-center gap-3 cursor-pointer">
                  <input v-model="form.criarLogin" type="checkbox" class="w-4 h-4 rounded accent-green-600" />
                  <span class="text-sm font-semibold text-gray-700">Criar login de acesso ao sistema</span>
                </label>
                <div v-if="form.criarLogin" class="flex flex-col gap-3">
                  <p class="text-xs text-gray-400 -mt-1">O funcionário poderá fazer login com o e-mail acima e a senha abaixo.</p>
                  <AppInput
                    v-model="form.senha"
                    label="Senha temporária"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
              </div>

              <p v-if="editError" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {{ editError }}
              </p>

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
              <h2 class="text-xl font-bold text-gray-800">Excluir funcionário?</h2>
              <p class="text-sm text-gray-500 mt-2 leading-relaxed">
                Tem certeza que deseja excluir<br /><strong class="text-gray-800">{{ excluindo.nome }}</strong>?<br />
                <span class="text-red-500 text-xs font-semibold">Essa ação não pode ser desfeita.</span>
              </p>
            </div>
            <p v-if="deleteError" class="text-sm text-red-600 bg-red-50 border-t border-b border-red-200 px-8 py-3 text-center">
              {{ deleteError }}
            </p>
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

interface Funcionario {
  id: number
  nome: string
  idade: number | null
  cargo: string | null
  endereco: string | null
  email: string | null
  salario: number | null
  cpf: number | null
  perfil: string | null
}

const supabase = createSupabaseClient()
const { empresaId, loadEmpresa } = useEmpresa()
const { isAdmin, isAdminOrGerente } = useAdmin()

const funcionarios = ref<Funcionario[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const editando = ref<Funcionario | null>(null)
const adicionando = ref(false)
const saving = ref(false)
const editError = ref<string | null>(null)

const excluindo = ref<Funcionario | null>(null)
const deleting = ref(false)
const deleteError = ref<string | null>(null)

const form = reactive({
  nome: '', email: '', cargo: '', idade: '', cpf: '', salario: '', endereco: '',
  perfil: 'funcionario' as string,
  senha: '',
  criarLogin: false,
})

const editErrors = reactive({ nome: '', email: '' })

const filtroAberto = ref(false)
const busca = ref('')
const filtroCargo = ref('')

const buscaAtiva = computed(() => busca.value.trim() !== '')

const cargosUnicos = computed(() => {
  const set = new Set(funcionarios.value.map(f => f.cargo).filter(Boolean) as string[])
  return Array.from(set).sort()
})

const funcionariosFiltrados = computed(() => {
  return funcionarios.value.filter(f => {
    if (filtroCargo.value && f.cargo !== filtroCargo.value) return false
    if (busca.value.trim()) {
      const q = busca.value.toLowerCase()
      return (
        f.nome.toLowerCase().includes(q) ||
        (f.email ?? '').toLowerCase().includes(q) ||
        String(f.cpf ?? '').includes(q) ||
        (f.cargo ?? '').toLowerCase().includes(q)
      )
    }
    return true
  })
})

const totalFolha = computed(() =>
  funcionarios.value.reduce((sum, f) => sum + (f.salario ?? 0), 0)
)

const mediaSalarial = computed(() => {
  const comSalario = funcionarios.value.filter(f => f.salario != null)
  if (comSalario.length === 0) return 0
  return comSalario.reduce((sum, f) => sum + (f.salario ?? 0), 0) / comSalario.length
})

const comCargo = computed(() =>
  funcionarios.value.filter(f => f.cargo != null && f.cargo.trim() !== '').length
)

// �"?�"? Folha Salarial �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?
const modalFolha = ref(false)
const folhaMes = ref('')
const folhaError = ref<string | null>(null)
const folhaSucesso = ref<string | null>(null)
const lanandoFolha = ref(false)

const funcionariosComSalario = computed(() =>
  funcionarios.value.filter(f => f.salario != null && f.salario > 0)
)

const totalFolhaPreview = computed(() =>
  funcionariosComSalario.value.reduce((sum, f) => sum + (f.salario ?? 0), 0)
)

function fecharModalFolha() {
  modalFolha.value = false
  folhaError.value = null
  folhaSucesso.value = null
}

async function lancarFolha() {
  if (!folhaMes.value || funcionariosComSalario.value.length === 0) return

  const parts = folhaMes.value.split('-').map(Number)
  const ano = parts[0]!
  const mes = parts[1]!
  // vencimento = dia 5 do mês seguinte
  const vencimento = new Date(ano, mes, 5)
  const vencimentoStr = vencimento.toISOString().split('T')[0]!
  const mesFormatado = new Date(ano, mes - 1).toLocaleString('pt-BR', { month: 'long', year: 'numeric' })

  lanandoFolha.value = true
  folhaError.value = null
  folhaSucesso.value = null

  const registros = funcionariosComSalario.value.map(f => ({
    descricao: `Salário �?" ${f.nome} (${mesFormatado})`,
    valor: f.salario!,
    data_vencimento: vencimentoStr,
    status: 'pendente',
    categoria: 'Folha Salarial',
    periodicidade: 'mensal',
    funcionario_id: f.id,
    empresa_id: empresaId.value!,
  }))

  const { error: insertError } = await supabase.from('contas_pagar').insert(registros)

  lanandoFolha.value = false

  if (insertError) {
    folhaError.value = insertError.message
    return
  }

  folhaSucesso.value = `${registros.length} entrada(s) lançada(s) com sucesso para ${mesFormatado}!`
  setTimeout(fecharModalFolha, 2500)
}

const columns = [
  { key: 'id',       label: '#' },
  { key: 'nome',     label: 'Nome' },
  { key: 'email',    label: 'E-mail' },
  { key: 'cpf',      label: 'CPF' },
  { key: 'idade',    label: 'Idade' },
  { key: 'cargo',    label: 'Cargo' },
  { key: 'salario',  label: 'Salário' },
  { key: 'endereco', label: 'Endereço' },
]

onMounted(async () => {
  await loadEmpresa()
  await fetchFuncionarios()
})

async function fetchFuncionarios() {
  loading.value = true
  const { data, error: fetchError } = await supabase
    .from('funcionarios')
    .select('*')
    .eq('empresa_id', empresaId.value!)
    .order('id', { ascending: true })

  loading.value = false

  if (fetchError) { error.value = fetchError.message; return }
  funcionarios.value = (data ?? []) as Funcionario[]
}

function initials(nome: string): string {
  const parts = nome.trim().split(' ').filter(Boolean)
  if (parts.length >= 2) return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase()
  return (nome[0] ?? '?').toUpperCase()
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function abrirAdicionar() {
  adicionando.value = true
  editando.value = null
  editError.value = null
  editErrors.nome = ''
  editErrors.email = ''
  form.nome = ''; form.email = ''; form.cargo = ''
  form.idade = ''; form.cpf = ''; form.salario = ''; form.endereco = ''
  form.perfil = 'funcionario'; form.senha = ''; form.criarLogin = false
}

function fecharModal() {
  editando.value = null
  adicionando.value = false
}

function editFuncionario(func: Funcionario) {
  editando.value = func
  editError.value = null
  editErrors.nome = ''
  editErrors.email = ''
  form.nome     = func.nome ?? ''
  form.email    = func.email ?? ''
  form.cargo    = func.cargo ?? ''
  form.idade    = func.idade != null ? String(func.idade) : ''
  form.cpf      = func.cpf != null ? String(func.cpf) : ''
  form.salario  = func.salario != null ? String(func.salario) : ''
  form.endereco = func.endereco ?? ''
  form.perfil   = func.perfil ?? 'funcionario'
  form.senha    = ''
  form.criarLogin = false
}

async function salvarEdicao() {
  if (!editando.value) return
  editErrors.nome = ''
  editErrors.email = ''

  if (!form.nome.trim()) { editErrors.nome = 'O nome é obrigatório.'; return }

  saving.value = true
  editError.value = null

  const { error: updateError } = await supabase
    .from('funcionarios')
    .update({
      nome:     form.nome.trim(),
      email:    form.email || null,
      cargo:    form.cargo || null,
      idade:    form.idade ? Number(form.idade) : null,
      cpf:      form.cpf ? Number(form.cpf) : null,
      salario:  form.salario ? Number(form.salario) : null,
      endereco: form.endereco || null,
    })
    .eq('id', editando.value.id)

  saving.value = false

  if (updateError) { editError.value = updateError.message; return }

  editando.value = null
  await fetchFuncionarios()
}

async function salvarAdicao() {
  editErrors.nome = ''
  editErrors.email = ''
  if (!form.nome.trim()) { editErrors.nome = 'O nome é obrigatório.'; return }
  if (form.criarLogin && !form.email.trim()) { editErrors.email = 'E-mail é obrigatório para criar login.'; return }
  if (form.criarLogin && form.senha.length < 6) { editError.value = 'A senha precisa ter pelo menos 6 caracteres.'; return }

  saving.value = true
  editError.value = null

  // Garante que empresaId está carregado
  await loadEmpresa()
  if (!empresaId.value) {
    editError.value = 'Sessão sem empresa vinculada. Faça logout e login novamente.'
    saving.value = false
    return
  }

  // 1. Insert funcionario record
  const { data: novoFunc, error: insertError } = await supabase
    .from('funcionarios')
    .insert({
      nome:     form.nome.trim(),
      email:    form.email || null,
      cargo:    form.cargo || null,
      idade:    form.idade ? Number(form.idade) : null,
      cpf:      form.cpf ? Number(form.cpf) : null,
      salario:  form.salario ? Number(form.salario) : null,
      endereco: form.endereco || null,
      empresa_id: empresaId.value,
    })
    .select('id')
    .single()

  if (insertError) { saving.value = false; editError.value = insertError.message; return }

  // 2. Create auth account if requested
  if (form.criarLogin && form.email.trim() && form.senha.trim()) {
    // Captura empresa_id e sessão do admin ANTES do signUp
    const adminEmpresaId = empresaId.value!
    const { data: { session: adminSession } } = await supabase.auth.getSession()

    // Nunca permite 'admin' via criação de funcionário
    const perfilFuncionario = (form.perfil === 'admin' ? 'funcionario' : form.perfil) || 'funcionario'

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.senha.trim(),
      options: {
        data: {
          // O trigger handle_new_user lê estes campos e já cria o profile correto no banco
          full_name:  form.nome.trim(),
          empresa_id: adminEmpresaId,
          perfil:     perfilFuncionario,
        },
      },
    })

    // Restaura sessão do admin IMEDIATAMENTE após o signUp
    // O signUp pode ter trocado a sessão ativa (Supabase auto-confirm ON)
    if (adminSession) {
      await supabase.auth.setSession({
        access_token:  adminSession.access_token,
        refresh_token: adminSession.refresh_token,
      })
    }

    if (signUpError) {
      editError.value = `Funcionário salvo, mas erro ao criar login: ${signUpError.message}`
      saving.value = false
      adicionando.value = false
      await fetchFuncionarios()
      return
    }

    // Redundância: chama RPC SECURITY DEFINER para garantir que o profile
    // tem empresa_id e perfil corretos, mesmo que o trigger tenha falhado.
    // Se a RPC não existir no Supabase (SQL ainda não executado), apenas loga o aviso.
    if (signUpData.user) {
      const { error: rpcError } = await supabase.rpc('create_employee_profile', {
        p_user_id:    signUpData.user.id,
        p_empresa_id: adminEmpresaId,
        p_email:      form.email.trim(),
        p_nome:       form.nome.trim(),
        p_perfil:     perfilFuncionario,
      })
      if (rpcError) {
        // Não bloqueia o fluxo — o trigger já criou o profile correto
        console.warn('[funcionarios] create_employee_profile RPC aviso:', rpcError.message)
      }
    }
  }

  saving.value = false
  adicionando.value = false
  await fetchFuncionarios()
}

function confirmarExclusao(func: Funcionario) {
  excluindo.value = func
  deleteError.value = null
}

async function executarExclusao() {
  if (!excluindo.value) return
  deleting.value = true
  deleteError.value = null

  const { error: deleteErr } = await supabase
    .from('funcionarios')
    .delete()
    .eq('id', excluindo.value.id)

  deleting.value = false
  if (deleteErr) { deleteError.value = deleteErr.message; return }

  excluindo.value = null
  await fetchFuncionarios()
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-fade-enter-active { transition: all 0.2s ease; }
.slide-fade-leave-active { transition: all 0.15s ease; }
.slide-fade-enter-from, .slide-fade-leave-to { transform: translateY(-8px); opacity: 0; }
</style>

