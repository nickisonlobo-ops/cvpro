<template>
  <div class="min-h-full bg-transparent p-3 sm:p-8" @click="statusDropdownId = null">

    <!-- �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� CABE�?ALHO �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� -->
    <div class="relative rounded-3xl overflow-hidden mb-8 shadow-xl page-header">
      <div class="absolute inset-0 page-header-overlay" />
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />
      <div class="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/[0.03] pointer-events-none" />
      <div class="absolute -bottom-20 left-1/4 w-96 h-96 rounded-full bg-white/[0.02] pointer-events-none" />
      <PageLogo />

      <div class="relative px-4 sm:px-8 pt-5 sm:pt-7 pb-5 sm:pb-7">
        <!-- Linha superior: identidade + ações -->
        <div class="flex flex-wrap items-start justify-between gap-3 sm:gap-6">
          <div class="flex items-center gap-3 sm:gap-5">
            <div class="flex items-center justify-center w-10 sm:w-14 h-10 sm:h-14 rounded-2xl bg-white/[0.12] backdrop-blur-sm border border-white/20 shadow-lg">
              <svg class="w-5 sm:w-7 h-5 sm:h-7 text-white" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"/></svg>
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-semibold text-white/80 uppercase tracking-widest">Financeiro</span>
                <span class="w-1 h-1 rounded-full bg-white/40" />
                <span class="text-xs text-white/70 hidden sm:inline">UpStudio</span>
              </div>
              <h1 class="text-xl sm:text-3xl font-bold text-white tracking-tight leading-none">Contas a Pagar / Receber</h1>
              <p class="text-sm text-white/80 mt-1.5">
                {{ loading ? 'Carregando...' : `${contasFiltradas.length} de ${contas.length} conta(s) exibida(s)` }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <button
              type="button"
              class="inline-flex items-center gap-2 text-sm font-semibold px-3 sm:px-5 py-2.5 rounded-xl transition-all duration-200"
              :class="filtrosAbertos
                ? 'bg-white text-primary shadow-lg scale-[1.02]'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/15 backdrop-blur-sm'"
              @click="filtrosAbertos = !filtrosAbertos"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/></svg>
              <span class="hidden sm:inline">Filtros</span>
              <span v-if="filtrosAtivos > 0" class="inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-white text-primary text-xs font-black">
                {{ filtrosAtivos }}
              </span>
            </button>
            <button
              v-if="isAdminOrGerente"
              type="button"
              class="inline-flex items-center gap-2 text-sm font-bold px-3 sm:px-5 py-2.5 rounded-xl bg-white text-primary hover:bg-primary-5 shadow-lg shadow-pink-200/40 transition-all duration-200 hover:scale-[1.02]"
              @click="abrirAdicionar"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
              <span class="hidden sm:inline">Adicionar Conta</span>
            </button>
          </div>
        </div>

        <!-- Divisor -->
        <div class="h-px bg-white/10 my-4 sm:my-6" />

        <!-- Subtítulo -->
        <p class="text-sm text-white/60">Controle financeiro de receitas, despesas, vencimentos e pagamentos</p>
      </div>
    </div>

    <!-- ══════ CARDS FINANCEIROS ══════ -->
    <div v-if="!loading" class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      <!-- A Pagar -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 relative overflow-hidden">
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-red-500 rounded-b-2xl"></div>
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
            <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"/></svg>
          </div>
          <span class="text-[10px] font-black uppercase tracking-widest text-red-600">A Pagar</span>
        </div>
        <p class="text-xl font-black text-red-600">{{ formatCurrency(totalDespesas) }}</p>
        <p class="text-[11px] text-gray-500 mt-0.5">{{ contasDespesas }} conta pendente</p>
      </div>

      <!-- A Receber -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 relative overflow-hidden">
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-green-500 rounded-b-2xl"></div>
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
            <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <span class="text-[10px] font-black uppercase tracking-widest text-green-600">A Receber</span>
        </div>
        <p class="text-xl font-black text-green-600">{{ formatCurrency(totalReceitas) }}</p>
        <p class="text-[11px] text-gray-500 mt-0.5">{{ contasReceitas }} contas</p>
      </div>

      <!-- Vencidas -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 relative overflow-hidden">
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-amber-500 rounded-b-2xl"></div>
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center">
            <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>
          </div>
          <span class="text-[10px] font-black uppercase tracking-widest text-amber-600">Vencidas</span>
        </div>
        <p class="text-xl font-black text-amber-600">{{ formatCurrency(totalVencidas) }}</p>
        <p class="text-[11px] text-gray-500 mt-0.5">{{ contasVencidasCount }} contas em atraso</p>
      </div>

      <!-- Saldo Previsto -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 relative overflow-hidden">
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 rounded-b-2xl"></div>
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
            <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"/></svg>
          </div>
          <span class="text-[10px] font-black uppercase tracking-widest text-emerald-600">Saldo Previsto</span>
        </div>
        <p class="text-xl font-black" :class="saldoGeral >= 0 ? 'text-emerald-600' : 'text-red-600'">{{ formatCurrency(saldoGeral) }}</p>
        <p class="text-[11px] text-gray-500 mt-0.5">receitas - despesas</p>
      </div>
    </div>

    <!-- ══════ FAIXA DE ALERTA FINANCEIRO ══════ -->
    <div v-if="!loading && contasVencidasCount > 0" class="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4 mb-6">
      <div class="shrink-0 w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
        <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>
      </div>
      <div class="flex-1">
        <p class="text-sm font-bold text-gray-800">{{ contasVencidasCount }} contas vencidas somando {{ formatCurrency(totalVencidas) }}</p>
        <p class="text-xs text-gray-500 mt-0.5">Revise os vencimentos e mantenha seu financeiro em dia.</p>
      </div>
      <button type="button" class="text-sm font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1 shrink-0" @click="filtros.status = ['vencido']; filtros.tipo = ''">
        Ver detalhes
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>
      </button>
    </div>

    <!-- ══════ BUSCA + TABS ══════ -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
      <!-- Busca -->
      <div class="relative w-full sm:w-80">
        <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="m21 21-4.35-4.35"/></svg>
        <input
          v-model="filtros.busca"
          type="text"
          placeholder="Buscar por descrição, cliente, categoria..."
          class="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white transition-shadow"
        />
      </div>

      <!-- Tabs -->
      <div class="flex items-center gap-1 flex-wrap">
        <button type="button" class="px-4 py-2 rounded-lg text-xs font-bold transition-all" :class="filtros.tipo === '' && filtros.status.length === 0 ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'" @click="filtros.tipo = ''; filtros.status = []">Todas</button>
        <button type="button" class="px-4 py-2 rounded-lg text-xs font-bold transition-all" :class="filtros.tipo === 'receber' && filtros.status.length === 1 && filtros.status[0] === 'pendente' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'" @click="filtros.tipo = 'receber'; filtros.status = ['pendente']">A receber</button>
        <button type="button" class="px-4 py-2 rounded-lg text-xs font-bold transition-all" :class="filtros.tipo === 'pagar' && filtros.status.length === 1 && filtros.status[0] === 'pendente' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'" @click="filtros.tipo = 'pagar'; filtros.status = ['pendente']">A pagar</button>
        <button type="button" class="px-4 py-2 rounded-lg text-xs font-bold transition-all" :class="filtros.status.length === 1 && filtros.status[0] === 'vencido' && filtros.tipo === '' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'" @click="filtros.tipo = ''; filtros.status = ['vencido']">Vencidas</button>
        <button type="button" class="px-4 py-2 rounded-lg text-xs font-bold transition-all" :class="filtros.status.length === 1 && filtros.status[0] === 'pendente' && filtros.tipo === '' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'" @click="filtros.tipo = ''; filtros.status = ['pendente']">Pendentes</button>
        <button type="button" class="px-4 py-2 rounded-lg text-xs font-bold transition-all" :class="filtros.status.length === 1 && filtros.status[0] === 'pago' && filtros.tipo === '' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'" @click="filtros.tipo = ''; filtros.status = ['pago']">Pagas</button>
        <button type="button" class="px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ml-auto border border-gray-200" :class="filtrosAbertos ? 'bg-gray-900 text-white border-gray-900' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'" @click="filtrosAbertos = !filtrosAbertos">
          Filtros avançados
          <span v-if="filtrosAtivos > 0" class="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-black" :class="filtrosAbertos ? 'bg-white text-gray-900' : 'bg-primary text-white'">{{ filtrosAtivos }}</span>
          <svg class="w-3.5 h-3.5 transition-transform" :class="filtrosAbertos ? 'rotate-180' : ''" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
        </button>
      </div>
    </div>

    <Transition name="slide-fade">
      <div v-show="filtrosAbertos" class="bg-white rounded-3xl border border-gray-100 shadow-md mb-6 overflow-hidden">
        <!-- Header do painel -->
        <div class="flex items-center justify-between px-7 py-4 border-b border-gray-100 bg-gray-50/70">
          <div class="flex items-center gap-2.5">
            <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/></svg>
            <span class="text-sm font-bold text-gray-700">Filtros avançados</span>
            <span v-if="filtrosAtivos > 0" class="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-primary-5 text-primary text-xs font-bold">
              {{ filtrosAtivos }} ativo(s)
            </span>
          </div>
          <button
            v-if="filtrosAtivos > 0"
            type="button"
            class="text-xs font-semibold text-primary hover:text-primary hover:underline transition-colors"
            @click="limparFiltros"
          >
            Limpar tudo
          </button>
        </div>

        <div class="p-7 space-y-6">
          <!-- Linha 1: busca + datas -->
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-5">
            <div class="lg:col-span-2 flex flex-col gap-1.5">
              <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Busca livre</label>
              <div class="relative">
                <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="m21 21-4.35-4.35"/></svg>
                <input
                  v-model="filtros.busca"
                  type="text"
                  placeholder="Descrição, categoria ou observação..."
                  class="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50/50 transition-shadow"
                />
              </div>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Vencimento de</label>
              <input v-model="filtros.vencimentoDe" type="date" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow" />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Vencimento até</label>
              <input v-model="filtros.vencimentoAte" type="date" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow" />
            </div>
          </div>

          <!-- Atalhos de período -->
          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Atalhos de período</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="preset in presetsDePeriodo"
                :key="preset.label"
                type="button"
                class="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl border transition-all duration-150"
                :class="filtros.presetAtivo === preset.label
                  ? 'bg-primary border-primary text-primary-text shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-primary hover:text-primary hover:bg-primary-5'"
                @click="aplicarPreset(preset)"
              >
                {{ preset.label }}
              </button>
            </div>
          </div>

          <!-- Linha 2: valor + categoria + forma -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Valor mínimo</label>
              <input v-model="filtros.valorMin" type="number" min="0" :placeholder="locale.simboloMoeda + ' 0,00'" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow" />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Valor máximo</label>
              <input v-model="filtros.valorMax" type="number" min="0" placeholder="Sem limite" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow" />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Categoria</label>
              <input v-model="filtros.categoria" type="text" placeholder="Ex: Infraestrutura" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow" />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Forma de Pgto</label>
              <input v-model="filtros.formaPagamento" type="text" placeholder="Ex: PIX" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow" />
            </div>
          </div>

          <!-- Linha 3: pills de status e periodicidade -->
          <div class="flex flex-wrap gap-6 pt-2 border-t border-gray-100">
            <div class="flex items-center gap-2.5 flex-wrap">
              <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">Status</span>
              <button
                v-for="s in statusOpcoes"
                :key="s.value"
                type="button"
                class="text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all duration-150"
                :class="filtros.status.includes(s.value) ? s.activeClass : 'bg-white border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700'"
                @click="toggleFiltroStatus(s.value)"
              >
                {{ s.label }}
              </button>
            </div>
            <div class="flex items-center gap-2.5">
              <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">Periodicidade</span>
              <button
                v-for="p in ['avulsa', 'mensal']"
                :key="p"
                type="button"
                class="text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all duration-150 capitalize"
                :class="filtros.periodicidade.includes(p) ? 'bg-primary-10 border-primary text-primary' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700'"
                @click="toggleFiltroPeriodicidade(p)"
              >
                {{ p }}
              </button>
            </div>
            <div class="flex items-center gap-2.5">
              <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">Origem</span>
              <button
                type="button"
                class="text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all duration-150"
                :class="filtros.origem === '' ? 'bg-gray-800 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700'"
                @click="filtros.origem = ''"
              >Todas</button>
              <button
                type="button"
                class="text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all duration-150"
                :class="filtros.origem === 'manual' ? 'bg-blue-100 border-blue-400 text-blue-700' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700'"
                @click="filtros.origem = filtros.origem === 'manual' ? '' : 'manual'"
              >Manual</button>
              <button
                type="button"
                class="text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all duration-150"
                :class="filtros.origem === 'comissao' ? 'bg-amber-100 border-amber-400 text-amber-700' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700'"
                @click="filtros.origem = filtros.origem === 'comissao' ? '' : 'comissao'"
              >Comissões</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� LOADING �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� -->
    <div v-if="loading" class="flex flex-col items-center justify-center gap-4 py-32">
      <span class="inline-block w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      <span class="text-sm text-gray-400 font-medium">Carregando contas...</span>
    </div>

    <!-- �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� ERRO �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� -->
    <div v-else-if="error" class="flex items-center gap-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-2xl px-6 py-4">
      <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" d="M12 8v4m0 4h.01"/></svg>
      {{ error }}
    </div>

    <!-- �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� TABELA �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� -->
    <div v-else class="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
      <!-- Barra acima da tabela -->
      <div class="flex items-center justify-between px-7 py-4 border-b border-gray-100 bg-gray-50/50">
        <span class="text-sm font-semibold text-gray-600">
          <span class="text-primary font-black">{{ contasFiltradas.length }}</span>
          resultado(s)
          <span v-if="filtrosAtivos > 0" class="text-gray-400 font-normal"> - filtros aplicados</span>
        </span>
        <span class="text-xs text-gray-400">Ordenado por vencimento</span>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full text-sm whitespace-nowrap">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="text-left px-7 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">#</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Conta / Cliente</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Tipo</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Valor</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Status</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Vencimento</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Pagamento</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Categoria</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Forma</th>
              <th class="px-7 py-4 text-right text-xs font-extrabold text-gray-400 uppercase tracking-widest sm:sticky sm:right-0 bg-gray-50">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-if="contasFiltradas.length === 0">
              <td colspan="10" class="text-center py-20">
                <div class="flex flex-col items-center gap-3">
                  <svg class="w-14 h-14 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.25" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"/></svg>
                  <span class="text-base font-semibold text-gray-400">Nenhuma conta encontrada</span>
                  <span v-if="filtrosAtivos > 0" class="text-sm text-gray-400">Tente ajustar os filtros</span>
                </div>
              </td>
            </tr>
            <tr
              v-for="conta in contasPaginadas"
              :key="conta.id"
              class="hover:bg-primary-5/40 transition-colors duration-150 group"
            >
              <td class="px-7 py-4">
                <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-primary font-black text-xs">
                  {{ conta.id }}
                </span>
              </td>
              <td class="px-5 py-4 whitespace-normal">
                <div class="flex flex-col gap-0.5">
                  <span class="font-semibold text-gray-800 break-words">{{ conta.descricao }}</span>
                  <span v-if="conta.parcela_numero && conta.total_parcelas" class="text-[10px] text-gray-400 font-medium">
                    Parcela {{ conta.parcela_numero }}/{{ conta.total_parcelas }}
                  </span>
                  <span v-if="conta.cliente_nome" class="text-[10px] text-gray-400 font-medium">
                    {{ conta.cliente_nome }}
                  </span>
                  <span v-if="conta.origem === 'comissao'" class="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100 w-fit">
                    <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    Comissão
                  </span>
                </div>
              </td>
              <td class="px-5 py-4">
                <span class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full" :class="(conta.tipo || 'pagar') === 'receber' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                  {{ (conta.tipo || 'pagar') === 'receber' ? '↑ Receita' : '↓ Despesa' }}
                </span>
              </td>
              <td class="px-5 py-4">
                <span class="font-black tabular-nums" :class="(conta.tipo ?? 'pagar') === 'receber' ? 'text-emerald-600' : 'text-gray-900'">
                  {{ (conta.tipo ?? 'pagar') === 'receber' ? '+' : '' }}{{ formatCurrency(conta.valor) }}
                </span>
              </td>
              <td class="px-5 py-4 relative">
                <button
                  type="button"
                  :class="['inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full cursor-pointer transition-opacity hover:opacity-80', statusClass(conta.status)]"
                  @click.stop="statusDropdownId = statusDropdownId === conta.id ? null : conta.id"
                >
                  <span :class="['w-1.5 h-1.5 rounded-full', statusDot(conta.status)]" />
                  {{ conta.status ?? 'pendente' }}
                  <svg class="w-3 h-3 ml-0.5 opacity-60" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                </button>
                <Transition name="dropdown">
                  <div
                    v-if="statusDropdownId === conta.id"
                    class="absolute z-50 top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 p-1.5 flex flex-col gap-0.5 min-w-[130px]"
                    @click.stop
                  >
                    <button
                      v-for="s in ['pendente','pago','vencido','cancelado']"
                      :key="s"
                      type="button"
                      :class="['inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg w-full text-left transition-colors',
                        (conta.status ?? 'pendente') === s
                          ? statusClass(s)
                          : 'text-gray-500 hover:bg-gray-50']"
                      :disabled="mudandoStatusId === conta.id"
                      @click="mudarStatus(conta, s)"
                    >
                      <span :class="['w-1.5 h-1.5 rounded-full flex-shrink-0', statusDot(s)]" />
                      {{ s }}
                      <span v-if="(conta.status ?? 'pendente') === s" class="ml-auto">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                      </span>
                    </button>
                  </div>
                </Transition>
              </td>
              <td class="px-5 py-4">
                <span class="font-medium text-gray-600 tabular-nums">{{ formatDate(conta.data_vencimento) }}</span>
                <span v-if="(conta.status ?? 'pendente') === 'vencido' || ((conta.status ?? 'pendente') === 'pendente' && isOverdue(conta))" class="block text-[10px] font-semibold text-red-500 mt-0.5">
                  Vencido há {{ diasDesde(conta.data_vencimento) }} dias
                </span>
                <span v-else-if="(conta.status ?? 'pendente') === 'pago'" class="block text-[10px] font-semibold text-emerald-500 mt-0.5">
                  Venceu
                </span>
                <span v-else-if="(conta.status ?? 'pendente') === 'pendente'" class="block text-[10px] font-semibold text-gray-400 mt-0.5">
                  Vence em {{ diasAte(conta.data_vencimento) }} dias
                </span>
              </td>
              <td class="px-5 py-4">
                <span v-if="conta.data_pagamento" class="font-medium text-emerald-600 tabular-nums">{{ formatDate(conta.data_pagamento) }}</span>
                <span v-else class="text-gray-300 font-medium">-</span>
              </td>
              <td class="px-5 py-4">
                <span v-if="conta.categoria" class="inline-block text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 rounded-lg px-2.5 py-1">{{ conta.categoria }}</span>
                <span v-else class="text-gray-300">-</span>
              </td>
              <td class="px-5 py-4">
                <span v-if="conta.forma_pagamento" class="inline-block text-xs font-semibold bg-gray-100 text-gray-600 rounded-lg px-2.5 py-1">{{ conta.forma_pagamento }}</span>
                <span v-else class="text-gray-300">-</span>
              </td>

              <td class="px-4 py-3 text-right sm:sticky sm:right-0 group-hover:bg-primary-5/60 transition-colors">
                <div class="flex items-center justify-end gap-1">
                  <button
                    v-if="isAdminOrGerente"
                    type="button"
                    title="Editar"
                    class="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-primary hover:bg-primary-10 transition-colors"
                    @click="editConta(conta)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2.414a2 2 0 01.586-1.414z"/></svg>
                  </button>
                  <button
                    v-if="isAdmin"
                    type="button"
                    title="Excluir"
                    class="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-red-400 hover:bg-red-50 transition-colors"
                    @click="confirmarExclusao(conta)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a1 1 0 01-1-1V5a1 1 0 011-1h8a1 1 0 011 1v1a1 1 0 01-1 1H9z"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginação -->
      <div v-if="contasFiltradas.length > 0" class="flex items-center justify-between px-7 py-4 border-t border-gray-100">
        <div class="flex items-center gap-2">
          <select v-model="porPagina" class="rounded-lg border border-gray-200 text-xs py-1.5 px-2.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary">
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>
          <span class="text-xs text-gray-400">por página</span>
        </div>

        <div class="flex items-center gap-1">
          <button type="button" :disabled="paginaAtual <= 1" class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors" :class="paginaAtual <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100'" @click="paginaAtual = 1">«</button>
          <button
            v-for="p in totalPaginas"
            :key="p"
            type="button"
            class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors"
            :class="p === paginaAtual ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100'"
            @click="paginaAtual = p"
          >{{ p }}</button>
          <button type="button" :disabled="paginaAtual >= totalPaginas" class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors" :class="paginaAtual >= totalPaginas ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100'" @click="paginaAtual = totalPaginas">»</button>
        </div>

        <span class="text-xs text-gray-400">
          Mostrando {{ (paginaAtual - 1) * porPagina + 1 }} a {{ Math.min(paginaAtual * porPagina, contasFiltradas.length) }} de {{ contasFiltradas.length }} contas
        </span>
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
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <!-- Header do modal -->
            <div class="flex items-center justify-between px-8 py-6 border-b border-white/10" :style="{ background: 'var(--color-primary-bg, linear-gradient(135deg, #111827, #1f2937))' }">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"/></svg>
                </div>
                <h2 class="text-lg font-bold text-white">{{ adicionando ? 'Adicionar Conta' : 'Editar Conta' }}</h2>
              </div>
              <button type="button" class="w-8 h-8 flex items-center justify-center rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors" @click="fecharModal">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <form class="flex flex-col gap-5 px-8 py-7 overflow-y-auto max-h-[70vh]" @submit.prevent="adicionando ? salvarAdicao() : salvarEdicao()">
              <AppInput v-model="form.descricao" label="Descrição" placeholder="Ex: Aluguel do espaço" :error="formErrors.descricao" required />
              <div class="grid grid-cols-2 gap-4">
                <AppInput v-model="form.valor" label="Valor (R$)" type="number" placeholder="1500.00" :error="formErrors.valor" required />
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-semibold text-gray-700">Status</label>
                  <select v-model="form.status" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#6b7280)] focus:border-[var(--color-primary,#6b7280)]">
                    <option value="pendente">Pendente</option>
                    <option value="pago">Pago</option>
                    <option value="vencido">Vencido</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <AppInput v-model="form.data_vencimento" label="Vencimento" type="date" :error="formErrors.data_vencimento" required />
                <AppInput v-model="form.data_pagamento" label="Data de Pagamento" type="date" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <AppInput v-model="form.categoria" label="Categoria" placeholder="Ex: Infraestrutura" />
                <AppInput v-model="form.forma_pagamento" label="Forma de Pagamento" placeholder="Ex: PIX" />
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-semibold text-gray-700">Periodicidade</label>
                <select v-model="form.periodicidade" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500">
                  <option value="avulsa">Avulsa</option>
                  <option value="mensal">Mensal (lança até dez/{{ new Date().getFullYear() }})</option>
                </select>
                <p v-if="form.periodicidade === 'mensal'" class="text-xs text-primary font-semibold">
                  Serão criadas {{ mesesRestantes }} parcela(s) a partir do vencimento informado.
                </p>
              </div>
              <AppInput v-model="form.observacao" label="Observação" placeholder="Informações adicionais" />

              <p v-if="modalError" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {{ modalError }}
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
              <h2 class="text-xl font-bold text-gray-800">Excluir conta?</h2>
              <p class="text-sm text-gray-500 mt-2 leading-relaxed">
                Tem certeza que deseja excluir <br /><strong class="text-gray-800">{{ excluindo.descricao }}</strong>?<br />
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
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { createSupabaseClient } from '~/lib/supabase'
import { useRealtime } from '~/composables/useRealtime'
import { useAdmin } from '~/composables/useAdmin'
import { useEmpresa } from '~/composables/useEmpresa'
import AppInput from '~/components/AppInput.vue'
import AppButton from '~/components/AppButton.vue'

interface ContaPagar {
  id: number
  descricao: string
  valor: number
  data_vencimento: string
  data_pagamento: string | null
  status: string | null
  categoria: string | null
  forma_pagamento: string | null
  observacao: string | null
  periodicidade: string | null
  origem: string | null
  comissao_id: number | null
  tipo: string
  orcamento_id: number | null
  parcela_numero: number | null
  total_parcelas: number | null
  cliente_nome: string | null
  created_at: string | null
}

const supabase = createSupabaseClient()
const { empresaId, loadEmpresa } = useEmpresa()
const { isAdmin, isAdminOrGerente } = useAdmin()
const { formatCurrency, formatDate, locale } = useLocale()

const contas = ref<ContaPagar[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const paginaAtual = ref(1)
const porPagina = ref(10)

const editando = ref<ContaPagar | null>(null)
const adicionando = ref(false)
const saving = ref(false)
const modalError = ref<string | null>(null)

const excluindo = ref<ContaPagar | null>(null)
const deleting = ref(false)
const deleteError = ref<string | null>(null)

const statusDropdownId = ref<number | null>(null)
const mudandoStatusId = ref<number | null>(null)

const form = reactive({
  descricao: '', valor: '', data_vencimento: '', data_pagamento: '',
  status: 'pendente', categoria: '', forma_pagamento: '', observacao: '', periodicidade: 'avulsa',
})

const formErrors = reactive({ descricao: '', valor: '', data_vencimento: '' })

const filtrosAbertos = ref(false)

const filtros = reactive({
  busca: '',
  tipo: '' as '' | 'pagar' | 'receber',
  status: [] as string[],
  periodicidade: [] as string[],
  vencimentoDe: '',
  vencimentoAte: '',
  valorMin: '',
  valorMax: '',
  categoria: '',
  formaPagamento: '',
  presetAtivo: '',
  origem: '',   // '' | 'manual' | 'comissao'
})

const statusOpcoes = [
  { value: 'pendente',  label: 'Pendente',  activeClass: 'bg-yellow-100 border-yellow-400 text-yellow-800' },
  { value: 'pago',      label: 'Pago',      activeClass: 'bg-primary-10 border-primary text-primary' },
  { value: 'vencido',   label: 'Vencido',   activeClass: 'bg-red-100 border-red-400 text-red-700' },
  { value: 'cancelado', label: 'Cancelado', activeClass: 'bg-gray-200 border-gray-400 text-gray-700' },
]

const filtrosAtivos = computed(() => {
  let count = 0
  if (filtros.busca) count++
  if (filtros.status.length > 0) count++
  if (filtros.periodicidade.length > 0) count++
  if (filtros.vencimentoDe) count++
  if (filtros.vencimentoAte) count++
  if (filtros.valorMin !== '') count++
  if (filtros.valorMax !== '') count++
  if (filtros.categoria) count++
  if (filtros.formaPagamento) count++
  if (filtros.origem) count++
  return count
})

const contasFiltradas = computed(() => {
  return contas.value.filter(conta => {
    if (filtros.tipo && (conta.tipo || 'pagar') !== filtros.tipo) return false
    if (filtros.busca) {
      const q = filtros.busca.toLowerCase()
      const match =
        conta.descricao.toLowerCase().includes(q) ||
        (conta.categoria ?? '').toLowerCase().includes(q) ||
        (conta.observacao ?? '').toLowerCase().includes(q) ||
        (conta.cliente_nome ?? '').toLowerCase().includes(q)
      if (!match) return false
    }
    if (filtros.status.length > 0 && !filtros.status.includes(conta.status ?? 'pendente')) return false
    if (filtros.periodicidade.length > 0 && !filtros.periodicidade.includes(conta.periodicidade ?? 'avulsa')) return false
    if (filtros.vencimentoDe && conta.data_vencimento < filtros.vencimentoDe) return false
    if (filtros.vencimentoAte && conta.data_vencimento > filtros.vencimentoAte) return false
    if (filtros.valorMin !== '' && conta.valor < Number(filtros.valorMin)) return false
    if (filtros.valorMax !== '' && conta.valor > Number(filtros.valorMax)) return false
    if (filtros.categoria && !(conta.categoria ?? '').toLowerCase().includes(filtros.categoria.toLowerCase())) return false
    if (filtros.formaPagamento && !(conta.forma_pagamento ?? '').toLowerCase().includes(filtros.formaPagamento.toLowerCase())) return false
    if (filtros.origem && (conta.origem ?? 'manual') !== filtros.origem) return false
    return true
  })
})

// Paginação
const totalPaginas = computed(() => Math.ceil(contasFiltradas.value.length / porPagina.value) || 1)
const contasPaginadas = computed(() => {
  const start = (paginaAtual.value - 1) * porPagina.value
  return contasFiltradas.value.slice(start, start + porPagina.value)
})
// Reset página ao filtrar
watch(contasFiltradas, () => { paginaAtual.value = 1 })

// Limpa o preset ativo se o usuário editar as datas manualmente
watch(() => filtros.vencimentoDe, () => { if (filtros.presetAtivo) filtros.presetAtivo = '' })
watch(() => filtros.vencimentoAte, () => { if (filtros.presetAtivo) filtros.presetAtivo = '' })

const totalValor = computed(() =>
  contas.value.reduce((sum, c) => sum + c.valor, 0)
)

const totalDespesas = computed(() => contas.value.filter(c => (c.tipo || 'pagar') === 'pagar' && (c.status ?? 'pendente') === 'pendente').reduce((sum, c) => sum + c.valor, 0))
const totalReceitas = computed(() => contas.value.filter(c => (c.tipo || 'pagar') === 'receber' && (c.status ?? 'pendente') === 'pendente').reduce((sum, c) => sum + c.valor, 0))
const contasDespesas = computed(() => contas.value.filter(c => (c.tipo || 'pagar') === 'pagar' && (c.status ?? 'pendente') === 'pendente').length)
const contasReceitas = computed(() => contas.value.filter(c => (c.tipo || 'pagar') === 'receber' && (c.status ?? 'pendente') === 'pendente').length)
const saldoGeral = computed(() => totalReceitas.value - totalDespesas.value)

function totalPorStatus(status: string): number {
  return contas.value.filter(c => (c.status ?? 'pendente') === status).reduce((sum, c) => sum + c.valor, 0)
}

function contasPorStatus(status: string): number {
  return contas.value.filter(c => (c.status ?? 'pendente') === status).length
}

const contasVencidasCount = computed(() => contasPorStatus('vencido'))
const totalVencidas = computed(() => totalPorStatus('vencido'))

function aplicarPresetEsteMes() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const lastDay = new Date(y, now.getMonth() + 1, 0).getDate()
  filtros.vencimentoDe = `${y}-${m}-01`
  filtros.vencimentoAte = `${y}-${m}-${String(lastDay).padStart(2, '0')}`
  filtros.presetAtivo = 'Este mês'
  filtros.tipo = ''
  filtros.status = []
}

function statusDot(status: string | null): string {
  switch (status) {
    case 'pago':      return 'bg-emerald-600'
    case 'vencido':   return 'bg-red-500'
    case 'cancelado': return 'bg-gray-400'
    default:          return 'bg-yellow-500'
  }
}

function toggleFiltroStatus(status: string) {
  const idx = filtros.status.indexOf(status)
  if (idx === -1) filtros.status.push(status)
  else filtros.status.splice(idx, 1)
}

function toISODate(d: Date): string {
  return d.toISOString().split('T')[0]!
}

function isOverdue(conta: ContaPagar): boolean {
  const status = conta.status ?? 'pendente'
  if (status === 'pago' || status === 'cancelado' || status === 'vencido') return false
  const dueDate = new Date(conta.data_vencimento + 'T23:59:59')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return dueDate < today
}

async function atualizarContasVencidas(contasList: ContaPagar[]) {
  const overdueIds = contasList
    .filter(isOverdue)
    .map(conta => conta.id)

  if (overdueIds.length === 0) return

  const { error: updateError } = await supabase
    .from('contas_pagar')
    .update({ status: 'vencido' })
    .in('id', overdueIds)

  if (!updateError) {
    contasList.forEach(conta => {
      if (overdueIds.includes(conta.id)) {
        conta.status = 'vencido'
      }
    })
  }
}

const presetsDePeriodo = [
  { label: 'Hoje',        days: 0  },
  { label: 'Esta semana', days: 6  },
  { label: 'Quinzenal',   days: 14 },
  { label: 'Este mês',    days: 29 },
  { label: 'Bimestre',    days: 59 },
  { label: 'Semestre',    days: 179 },
  { label: 'Anual',       days: 364 },
]

function aplicarPreset(preset: { label: string; days: number }) {
  if (filtros.presetAtivo === preset.label) {
    // toggle off
    filtros.presetAtivo = ''
    filtros.vencimentoDe = ''
    filtros.vencimentoAte = ''
    return
  }
  const hoje = new Date()
  const fim = new Date()
  fim.setDate(hoje.getDate() + preset.days)
  filtros.vencimentoDe = toISODate(hoje)
  filtros.vencimentoAte = toISODate(fim)
  filtros.presetAtivo = preset.label
}

function toggleFiltroPeriodicidade(p: string) {
  const idx = filtros.periodicidade.indexOf(p)
  if (idx === -1) filtros.periodicidade.push(p)
  else filtros.periodicidade.splice(idx, 1)
}

function limparFiltros() {
  filtros.busca = ''
  filtros.status = []
  filtros.periodicidade = []
  filtros.vencimentoDe = ''
  filtros.vencimentoAte = ''
  filtros.valorMin = ''
  filtros.valorMax = ''
  filtros.categoria = ''
  filtros.formaPagamento = ''
  filtros.presetAtivo = ''
  filtros.origem = ''
}

const columns = [
  { key: 'id',               label: '#' },
  { key: 'descricao',        label: 'Descrição' },
  { key: 'valor',            label: 'Valor' },
  { key: 'status',           label: 'Status' },
  { key: 'data_vencimento',  label: 'Vencimento' },
  { key: 'data_pagamento',   label: 'Pagamento' },
  { key: 'categoria',        label: 'Categoria' },
  { key: 'forma_pagamento',  label: 'Forma Pgto' },
  { key: 'periodicidade',    label: 'Periodicidade' },
  { key: 'observacao',       label: 'Observação' },
  { key: 'created_at',       label: 'Criado em' },
]

onMounted(async () => { await loadEmpresa(); await fetchContas() })

// Realtime
useRealtime('contas_pagar', async () => { await fetchContas() })

async function fetchContas() {
  loading.value = true
  const { data, error: fetchError } = await supabase
    .from('contas_pagar')
    .select('*')
    .eq('empresa_id', empresaId.value!)
    .order('data_vencimento', { ascending: true })

  loading.value = false
  if (fetchError) { error.value = fetchError.message; return }

  contas.value = (data ?? []) as ContaPagar[]
  await atualizarContasVencidas(contas.value)
}

async function mudarStatus(conta: ContaPagar, novoStatus: string) {
  if ((conta.status ?? 'pendente') === novoStatus) {
    statusDropdownId.value = null
    return
  }
  mudandoStatusId.value = conta.id
  statusDropdownId.value = null

  // Se muda para 'pago', lançar data_pagamento automaticamente (data de hoje)
  const updateData: Record<string, any> = { status: novoStatus }
  if (novoStatus === 'pago' && !conta.data_pagamento) {
    updateData.data_pagamento = new Date().toISOString().split('T')[0]
  }
  // Se desfazer o pago (voltar para pendente/outro), limpar data_pagamento
  if (novoStatus !== 'pago' && conta.status === 'pago') {
    updateData.data_pagamento = null
  }

  const { error: updateError } = await supabase
    .from('contas_pagar')
    .update(updateData)
    .eq('id', conta.id)
  mudandoStatusId.value = null
  if (!updateError) {
    conta.status = novoStatus
    if (updateData.data_pagamento !== undefined) {
      conta.data_pagamento = updateData.data_pagamento
    }
  }
}

function formatDateTime(dt: string | null): string {
  if (!dt) return '-'
  return new Date(dt).toLocaleDateString('pt-BR')
}

function diasDesde(dateStr: string): number {
  const d = new Date(dateStr + 'T12:00:00')
  const hoje = new Date()
  hoje.setHours(12, 0, 0, 0)
  return Math.max(0, Math.floor((hoje.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)))
}

function diasAte(dateStr: string): number {
  const d = new Date(dateStr + 'T12:00:00')
  const hoje = new Date()
  hoje.setHours(12, 0, 0, 0)
  return Math.max(0, Math.floor((d.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)))
}

function statusClass(status: string | null): string {
  switch (status) {
    case 'pago':      return 'bg-green-100 text-green-800'
    case 'vencido':   return 'bg-red-100 text-red-700'
    case 'cancelado': return 'bg-gray-100 text-gray-600'
    default:          return 'bg-yellow-100 text-yellow-800'
  }
}

function limparForm() {
  form.descricao = ''; form.valor = ''; form.data_vencimento = ''; form.data_pagamento = ''
  form.status = 'pendente'; form.categoria = ''; form.forma_pagamento = ''
  form.observacao = ''; form.periodicidade = 'avulsa'
  formErrors.descricao = ''; formErrors.valor = ''; formErrors.data_vencimento = ''
  modalError.value = null
}

function abrirAdicionar() {
  limparForm()
  adicionando.value = true
  editando.value = null
}

function editConta(conta: ContaPagar) {
  limparForm()
  editando.value = conta
  adicionando.value = false
  form.descricao       = conta.descricao
  form.valor           = String(conta.valor)
  form.data_vencimento = conta.data_vencimento
  form.data_pagamento  = conta.data_pagamento ?? ''
  form.status          = conta.status ?? 'pendente'
  form.categoria       = conta.categoria ?? ''
  form.forma_pagamento = conta.forma_pagamento ?? ''
  form.observacao      = conta.observacao ?? ''

  form.periodicidade   = conta.periodicidade ?? 'avulsa'
}

function fecharModal() {
  editando.value = null
  adicionando.value = false
}

function validarForm(): boolean {
  formErrors.descricao = ''
  formErrors.valor = ''
  formErrors.data_vencimento = ''
  if (!form.descricao.trim()) { formErrors.descricao = 'A descrição é obrigatória.'; return false }
  if (!form.valor) { formErrors.valor = 'O valor é obrigatório.'; return false }
  if (!form.data_vencimento) { formErrors.data_vencimento = 'O vencimento é obrigatório.'; return false }
  return true
}

const mesesRestantes = computed(() => {
  if (!form.data_vencimento) return 0
  const ano = new Date().getFullYear()
  const [y = 0, m = 1] = form.data_vencimento.split('-').map(Number)
  if (y > ano) return 0
  const mesInicio = y === ano ? m : 1
  return Math.max(0, 12 - mesInicio + 1)
})

function buildPayload(dataVencimento?: string): Record<string, any> {
  return {
    descricao:       form.descricao.trim(),
    valor:           Number(form.valor),
    data_vencimento: dataVencimento ?? form.data_vencimento,
    data_pagamento:  form.data_pagamento || null,
    status:          form.status || 'pendente',
    categoria:       form.categoria || null,
    forma_pagamento: form.forma_pagamento || null,
    observacao:      form.observacao || null,
    periodicidade:   form.periodicidade || 'avulsa',
    empresa_id:      empresaId.value!,
    tipo:            'pagar',
  }
}

async function salvarAdicao() {
  if (!validarForm()) return
  saving.value = true

  if (form.periodicidade === 'mensal' && form.data_vencimento) {
    const ano = new Date().getFullYear()
    const [startY = 0, startM = 1, startD = 1] = form.data_vencimento.split('-').map(Number)
    const parcelas = []
    let y = startY, m = startM
    while (y < ano || (y === ano && m <= 12)) {
      const mm = String(m).padStart(2, '0')
      const dd = String(startD).padStart(2, '0')
      parcelas.push(buildPayload(`${y}-${mm}-${dd}`))
      m++; if (m > 12) { m = 1; y++ }
    }
    const { error: insertError } = await supabase.from('contas_pagar').insert(parcelas)
    saving.value = false
    if (insertError) { modalError.value = insertError.message; return }
  } else {
    const { error: insertError } = await supabase.from('contas_pagar').insert(buildPayload())
    saving.value = false
    if (insertError) { modalError.value = insertError.message; return }
  }

  adicionando.value = false
  await fetchContas()
}

async function salvarEdicao() {
  if (!editando.value || !validarForm()) return
  saving.value = true
  const payload = buildPayload()
  // Preservar o tipo original da conta (não sobrescrever receber → pagar)
  payload.tipo = editando.value.tipo || 'pagar'
  const { error: updateError } = await supabase
    .from('contas_pagar')
    .update(payload)
    .eq('id', editando.value.id)
  saving.value = false
  if (updateError) { modalError.value = updateError.message; return }
  editando.value = null
  await fetchContas()
}

function confirmarExclusao(conta: ContaPagar) {
  excluindo.value = conta
  deleteError.value = null
}

async function executarExclusao() {
  if (!excluindo.value) return
  deleting.value = true
  const { error: deleteErr } = await supabase.from('contas_pagar').delete().eq('id', excluindo.value.id)
  deleting.value = false
  if (deleteErr) { deleteError.value = deleteErr.message; return }
  excluindo.value = null
  await fetchContas()
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-fade-enter-active { transition: all 0.2s ease; }
.slide-fade-leave-active { transition: all 0.15s ease; }
.slide-fade-enter-from, .slide-fade-leave-to { transform: translateY(-8px); opacity: 0; }
.dropdown-enter-active { transition: all 0.12s ease; }
.dropdown-leave-active { transition: all 0.08s ease; }
.dropdown-enter-from, .dropdown-leave-to { transform: translateY(-4px); opacity: 0; }
</style>
