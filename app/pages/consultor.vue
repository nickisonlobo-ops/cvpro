<template>
  <div class="min-h-full" style="background: var(--color-bg, #f4f6f9)">

    <!-- ══════════════════════ HERO HEADER -->
    <div class="px-5 sm:px-8 pt-7 pb-6" style="background: var(--color-bg, #f4f6f9)">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-xs mb-1 text-gray-400">Bem-vindo de volta!</p>
          <h1 class="text-2xl sm:text-3xl font-black tracking-tight leading-none text-gray-900">
            Consultor de Negócios <span :style="{ color: 'var(--color-primary, #6366f1)' }">IA</span>
          </h1>
          <p class="text-sm mt-1.5 text-gray-500">Análises automáticas com base nos dados reais da sua empresa</p>
        </div>
        <button
          type="button"
          class="inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-200 shrink-0"
          :style="{ background: 'var(--color-btn, var(--color-primary, #6366f1))', color: 'var(--color-btn-text, #fff)', border: '1px solid rgba(0,0,0,0.08)' }"
          @click="fetchAll"
        >
          <svg class="w-3.5 h-3.5" :class="loading ? 'animate-spin' : ''" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Atualizar Dados
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col items-center justify-center gap-4 py-32">
      <div class="relative w-14 h-14">
        <svg class="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
          <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(99,102,241,0.2)" stroke-width="4"/>
          <circle cx="28" cy="28" r="24" fill="none" stroke="#6366f1" stroke-width="4" stroke-dasharray="150.796" stroke-dashoffset="75" stroke-linecap="round" class="animate-spin origin-center"/>
        </svg>
      </div>
      <p class="text-sm font-semibold text-gray-400">Analisando dados da sua empresa…</p>
    </div>

    <template v-else>
      <div class="p-4 sm:p-6 lg:p-8 space-y-4">

        <!-- ══════════════════════ SCORE GERAL — CARD PREMIUM -->
        <div class="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm" style="border-left: 4px solid var(--color-primary, #6366f1)">
          <div class="px-6 sm:px-10 py-7 sm:py-8">
            <div class="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">

              <!-- Gauge circular SVG -->
              <div class="relative shrink-0 flex items-center justify-center mx-auto lg:mx-0">
                <svg width="180" height="180" viewBox="0 0 160 160">
                  <!-- Trilha -->
                  <circle cx="80" cy="80" r="64" fill="none" stroke="#e5e7eb" stroke-width="12" stroke-linecap="round"/>
                  <!-- Progresso colorido -->
                  <circle
                    cx="80" cy="80" r="64"
                    fill="none"
                    :stroke="scoreGeral.geral >= 80 ? '#10b981' : scoreGeral.geral >= 60 ? '#f59e0b' : '#ef4444'"
                    stroke-width="12"
                    stroke-linecap="round"
                    :stroke-dasharray="402.124"
                    :stroke-dashoffset="402.124 - (402.124 * scoreGeral.geral / 100)"
                    transform="rotate(-90 80 80)"
                    style="transition: stroke-dashoffset 1s ease"
                  />
                  <!-- Valor central -->
                  <text x="80" y="72" text-anchor="middle" fill="#111827" font-size="36" font-weight="900" font-family="Inter, sans-serif">{{ scoreGeral.geral }}</text>
                  <text x="80" y="90" text-anchor="middle" fill="#9ca3af" font-size="12" font-weight="700" font-family="Inter, sans-serif">/100</text>
                  <text x="80" y="110" text-anchor="middle" :fill="scoreGeral.geral >= 80 ? '#059669' : scoreGeral.geral >= 60 ? '#d97706' : '#dc2626'" font-size="10" font-weight="800" font-family="Inter, sans-serif" letter-spacing="2">{{ scoreGeral.geral >= 80 ? 'SAUDÁVEL' : scoreGeral.geral >= 60 ? 'ATENÇÃO' : 'CRÍTICO' }}</text>
                </svg>
              </div>

              <!-- Info + módulos -->
              <div class="flex-1 min-w-0">
                <div class="mb-4">
                  <p class="text-[10px] font-black uppercase tracking-[0.2em] mb-1" style="color: var(--color-primary, #6366f1)">Score Geral da Empresa</p>
                  <p class="text-gray-500 text-sm leading-relaxed">Índice calculado cruzando receita, clientes, estoque, operação e crescimento</p>
                </div>

                <!-- Grid de módulos -->
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  <div
                    v-for="item in scoreGeral.modulos"
                    :key="item.nome"
                    class="rounded-xl px-4 py-3.5 border border-gray-100 bg-gray-50/80 flex flex-col gap-2"
                  >
                    <div class="flex items-center justify-between">
                      <p class="text-[11px] font-bold text-gray-500 truncate">{{ item.nome }}</p>
                      <span
                        class="text-[9px] font-black px-1.5 py-0.5 rounded-full"
                        :style="{
                          background: item.score >= 80 ? 'rgba(16,185,129,0.15)' : item.score >= 60 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                          color: item.score >= 80 ? '#059669' : item.score >= 60 ? '#d97706' : '#dc2626'
                        }"
                      >{{ item.score }}</span>
                    </div>
                    <!-- Mini barra -->
                    <div class="h-1 rounded-full bg-gray-100">
                      <div
                        class="h-full rounded-full transition-all duration-700"
                        :style="{
                          width: item.score + '%',
                          background: item.score >= 80 ? '#10b981' : item.score >= 60 ? '#f59e0b' : '#ef4444'
                        }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Rodapé do card -->
          <div class="px-6 sm:px-8 py-3 border-t border-gray-100 flex items-center gap-2">
            <svg class="w-3 h-3 text-gray-300 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
            <p class="text-[10px] text-gray-400">Score ponderado: Financeiro 30% · Vendas 20% · Clientes 20% · Operação 15% · Estoque 15%</p>
          </div>
        </div>

        <!-- ══════════════════════ MÓDULO FINANCEIRO -->
        <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <button type="button" class="w-full flex items-center justify-between px-5 py-4 transition-colors" @click="openFinanceiro = !openFinanceiro">
            <div class="flex items-center gap-3.5">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style="background: linear-gradient(135deg,#d1fae5,#a7f3d0)">
                <svg class="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div class="text-left min-w-0">
                <p class="text-sm font-bold text-gray-800 leading-none">Módulo Financeiro</p>
                <p class="text-[11px] text-gray-400 mt-0.5">Receita · Despesas · Lucro · Fluxo · Inadimplência · Ticket</p>
              </div>
              <span class="hidden sm:inline-flex shrink-0 ml-1 text-[10px] font-bold px-2.5 py-1 rounded-full"
                :class="diagnosticosFinanceiros.length > 0 ? 'bg-red-50 text-red-500 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'">
                {{ diagnosticosFinanceiros.length > 0 ? diagnosticosFinanceiros.length + ' alertas' : '✓ Saudável' }}
              </span>
            </div>
            <div class="flex items-center gap-2 ml-4 shrink-0">
              <span class="text-[11px] text-gray-300 hidden sm:block">{{ openFinanceiro ? 'Recolher' : 'Ver análise' }}</span>
              <svg class="w-4 h-4 text-gray-400 transition-transform duration-300" :class="openFinanceiro ? 'rotate-180' : ''" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </div>
          </button>

        <!-- Conteúdo expansível -->
        <div v-show="openFinanceiro" class="px-5 py-5 border-t border-gray-100">

          <!-- KPI Cards Financeiro — premium com tema -->
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">

            <div class="relative rounded-xl overflow-hidden p-4 border border-white/60 shadow-sm" :style="{ background: 'var(--color-primary-bg, linear-gradient(135deg,#059669,#0d9488))' }">
              <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_70%)]"></div>
              <div class="relative">
                <p class="text-[9px] font-black uppercase tracking-[0.18em] text-white/60 mb-1.5">Receita (mês)</p>
                <p class="text-lg font-black text-white leading-tight truncate">{{ formatCurrency(fin.receitaMes) }}</p>
                <div class="flex items-center gap-1 mt-1.5">
                  <span class="text-[10px] font-black" :class="fin.crescimentoMoM >= 0 ? 'text-white' : 'text-red-200'">
                    {{ fin.crescimentoMoM >= 0 ? '▲' : '▼' }} {{ Math.abs(fin.crescimentoMoM).toFixed(1) }}%
                  </span>
                  <span class="text-[9px] text-white/40">vs ant.</span>
                </div>
              </div>
            </div>

            <div class="relative rounded-xl overflow-hidden p-4 bg-gray-50 border border-gray-100 shadow-sm">
              <div class="absolute top-0 left-0 w-1 h-full rounded-l-xl" :style="{ background: 'var(--color-primary, #6366f1)' }"></div>
              <p class="text-[9px] font-black uppercase tracking-[0.18em] text-gray-400 mb-1.5 pl-2">Despesas</p>
              <p class="text-lg font-black text-gray-900 leading-tight truncate pl-2">{{ formatCurrency(fin.despesasMes) }}</p>
              <p class="text-[10px] text-gray-400 mt-1 pl-2">
                <span :class="fin.propDespesas > 70 ? 'text-red-500 font-bold' : 'text-gray-400'">{{ fin.propDespesas.toFixed(0) }}%</span> da receita
              </p>
            </div>

            <div class="relative rounded-xl overflow-hidden p-4 bg-gray-50 border border-gray-100 shadow-sm">
              <div class="absolute top-0 left-0 w-1 h-full rounded-l-xl" :class="fin.lucro >= 0 ? 'bg-emerald-400' : 'bg-red-400'"></div>
              <p class="text-[9px] font-black uppercase tracking-[0.18em] text-gray-400 mb-1.5 pl-2">Lucro Bruto</p>
              <p class="text-lg font-black leading-tight truncate pl-2" :class="fin.lucro >= 0 ? 'text-emerald-600' : 'text-red-500'">{{ formatCurrency(fin.lucro) }}</p>
              <p class="text-[10px] text-gray-400 mt-1 pl-2">Margem <span :class="fin.margem < 15 ? 'text-amber-500 font-bold' : 'text-gray-400'">{{ fin.margem.toFixed(1) }}%</span></p>
            </div>

            <div class="relative rounded-xl overflow-hidden p-4 bg-gray-50 border border-gray-100 shadow-sm">
              <div class="absolute top-0 left-0 w-1 h-full rounded-l-xl" :style="{ background: 'var(--color-primary, #6366f1)' }"></div>
              <p class="text-[9px] font-black uppercase tracking-[0.18em] text-gray-400 mb-1.5 pl-2">Ticket Médio</p>
              <p class="text-lg font-black text-gray-900 leading-tight truncate pl-2">{{ formatCurrency(fin.ticketMedio) }}</p>
              <p class="text-[10px] text-gray-400 mt-1 pl-2">{{ fin.totalAtendimentos }} atend.</p>
            </div>

            <div class="relative rounded-xl overflow-hidden p-4 bg-gray-50 border border-gray-100 shadow-sm">
              <div class="absolute top-0 left-0 w-1 h-full rounded-l-xl" :class="fin.inadimplencia > 0 ? 'bg-red-400' : 'bg-emerald-400'"></div>
              <p class="text-[9px] font-black uppercase tracking-[0.18em] text-gray-400 mb-1.5 pl-2">Inadimplência</p>
              <p class="text-lg font-black leading-tight truncate pl-2" :class="fin.inadimplencia > 0 ? 'text-red-500' : 'text-emerald-600'">{{ formatCurrency(fin.inadimplencia) }}</p>
              <p class="text-[10px] text-gray-400 mt-1 pl-2">{{ fin.qtdVencidas }} vencida(s)</p>
            </div>

            <div class="relative rounded-xl overflow-hidden p-4 bg-gray-50 border border-gray-100 shadow-sm">
              <div class="absolute top-0 left-0 w-1 h-full rounded-l-xl" :class="fin.fluxoCaixa >= 0 ? 'bg-emerald-400' : 'bg-red-400'"></div>
              <p class="text-[9px] font-black uppercase tracking-[0.18em] text-gray-400 mb-1.5 pl-2">Fluxo de Caixa</p>
              <p class="text-lg font-black leading-tight truncate pl-2" :class="fin.fluxoCaixa >= 0 ? 'text-emerald-600' : 'text-red-500'">{{ formatCurrency(fin.fluxoCaixa) }}</p>
              <p class="text-[10px] text-gray-400 mt-1 pl-2">Receita − desp. pagas</p>
            </div>

          </div>

          <!-- Diagnósticos -->
          <div class="flex flex-col gap-3">
            <div
              v-for="(diag, i) in diagnosticosFinanceiros"
              :key="i"
              class="rounded-xl border overflow-hidden"
              :class="{
                'border-red-200':   diag.prioridade === 'Alta',
                'border-amber-200': diag.prioridade === 'Média',
                'border-blue-200':  diag.prioridade === 'Baixa',
              }"
            >
              <div
                class="px-4 py-3 flex items-start gap-3"
                :class="{
                  'bg-red-900/30':   diag.prioridade === 'Alta',
                  'bg-amber-900/30': diag.prioridade === 'Média',
                  'bg-blue-900/30':  diag.prioridade === 'Baixa',
                }"
              >
                <div
                  class="mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  :class="{
                    'bg-red-100 text-red-600':    diag.prioridade === 'Alta',
                    'bg-amber-100 text-amber-600': diag.prioridade === 'Média',
                    'bg-blue-100 text-blue-600':   diag.prioridade === 'Baixa',
                  }"
                >
                  <svg v-if="diag.prioridade === 'Alta'" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                  <svg v-else-if="diag.prioridade === 'Média'" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                  <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap mb-1">
                    <span
                      class="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                      :class="{
                        'bg-red-100 text-red-700':    diag.prioridade === 'Alta',
                        'bg-amber-100 text-amber-700': diag.prioridade === 'Média',
                        'bg-blue-100 text-blue-700':   diag.prioridade === 'Baixa',
                      }"
                    >{{ diag.prioridade }}</span>
                    <span class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{{ diag.categoria }}</span>
                  </div>
                  <p class="text-sm font-semibold text-gray-800 leading-snug">{{ diag.diagnostico }}</p>
                </div>
              </div>
              <div class="px-4 py-4 grid sm:grid-cols-2 gap-4 bg-white">
                <div>
                  <div class="flex items-center gap-1.5 mb-2">
                    <div class="w-1 h-4 rounded-full" :style="{ background: 'var(--color-primary, #6366f1)' }"></div>
                    <p class="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">Impacto Estimado</p>
                  </div>
                  <p class="text-sm text-gray-600 leading-relaxed">{{ diag.impacto }}</p>
                  <p v-if="diag.valorImpacto" class="text-lg font-black text-emerald-600 mt-2">
                    +{{ formatCurrency(diag.valorImpacto) }}<span class="text-xs font-semibold text-gray-400">/mês</span>
                  </p>
                </div>
                <div>
                  <div class="flex items-center gap-1.5 mb-2">
                    <div class="w-1 h-4 rounded-full" :style="{ background: 'var(--color-primary, #6366f1)' }"></div>
                    <p class="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">Ações Recomendadas</p>
                  </div>
                  <ul class="flex flex-col gap-2">
                    <li v-for="(acao, j) in diag.acoes" :key="j" class="flex items-start gap-2.5">
                      <span class="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[9px] font-black text-white" :style="{ background: 'var(--color-primary, #6366f1)' }">{{ j + 1 }}</span>
                      <span class="text-sm text-gray-600 leading-snug">{{ acao }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div v-if="diagnosticosFinanceiros.length === 0" class="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
              <p class="text-sm font-bold text-emerald-700">✅ Finanças saudáveis! Nenhum alerta identificado.</p>
            </div>
          </div>
        </div>
      </div>

        <!-- MÓDULO VENDAS -->
        <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <button type="button" class="w-full flex items-center justify-between px-5 py-4 transition-colors" @click="openVendas = !openVendas">
            <div class="flex items-center gap-3.5">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style="background: linear-gradient(135deg,#fef3c7,#fde68a)">
                <svg class="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>
              </div>
              <div class="text-left min-w-0">
                <p class="text-sm font-bold text-gray-800 leading-none">Módulo Vendas</p>
                <p class="text-[11px] text-gray-400 mt-0.5">Volume · Conversão · Ticket · Produtos mais vendidos · Evolução</p>
              </div>
              <span class="hidden sm:inline-flex shrink-0 ml-1 text-[10px] font-bold px-2.5 py-1 rounded-full"
                :class="fin.crescimentoMoM >= 0 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-500 border border-red-100'">
                {{ fin.crescimentoMoM >= 0 ? '▲ ' + fin.crescimentoMoM.toFixed(0) + '%' : '▼ ' + Math.abs(fin.crescimentoMoM).toFixed(0) + '%' }}
              </span>
            </div>
            <div class="flex items-center gap-2 ml-4 shrink-0">
              <span class="text-[11px] hidden sm:block" :style="{ color: 'var(--color-primary, #6366f1)' }">{{ openVendas ? 'Recolher' : 'Ver detalhes' }}</span>
              <svg class="w-4 h-4 text-gray-400 transition-transform duration-300" :class="openVendas ? 'rotate-180' : ''" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </div>
          </button>

          <div v-show="openVendas" class="px-5 py-5 border-t border-gray-100">

            <!-- KPI Cards Vendas -->
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">

              <div class="relative rounded-xl overflow-hidden p-4 border border-white/60 shadow-sm" :style="{ background: 'var(--color-primary-bg, linear-gradient(135deg,#6366f1,#8b5cf6))' }">
                <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_70%)]"></div>
                <div class="relative">
                  <p class="text-[9px] font-black uppercase tracking-[0.18em] text-white/60 mb-1.5">Vendas no Mês</p>
                  <p class="text-3xl font-black text-white leading-none">{{ fin.totalAtendimentos }}</p>
                  <p class="text-[10px] text-white/50 mt-1.5">atendimentos concluídos</p>
                </div>
              </div>

              <div class="relative rounded-xl overflow-hidden p-4 bg-gray-50 border border-gray-100 shadow-sm">
                <div class="absolute top-0 left-0 w-1 h-full rounded-l-xl" :class="fin.crescimentoMoM >= 0 ? 'bg-emerald-400' : 'bg-red-400'"></div>
                <p class="text-[9px] font-black uppercase tracking-[0.18em] text-gray-400 mb-1.5 pl-2">Crescimento</p>
                <p class="text-2xl font-black text-gray-900 leading-none pl-2" :class="fin.crescimentoMoM >= 0 ? 'text-emerald-400' : 'text-red-400'">{{ fin.crescimentoMoM >= 0 ? '+' : '' }}{{ fin.crescimentoMoM.toFixed(1) }}%</p>
                <p class="text-[10px] text-gray-400 mt-1.5 pl-2">vs mês anterior</p>
              </div>

              <div class="relative rounded-xl overflow-hidden p-4 bg-gray-50 border border-gray-100 shadow-sm">
                <div class="absolute top-0 left-0 w-1 h-full rounded-l-xl" :style="{ background: 'var(--color-primary, #6366f1)' }"></div>
                <p class="text-[9px] font-black uppercase tracking-[0.18em] text-gray-400 mb-1.5 pl-2">Ticket Médio</p>
                <p class="text-xl font-black text-gray-900 leading-none pl-2">{{ formatCurrency(fin.ticketMedio) }}</p>
                <p class="text-[10px] text-gray-400 mt-1.5 pl-2">por atendimento</p>
              </div>

              <div class="relative rounded-xl overflow-hidden p-4 bg-gray-50 border border-gray-100 shadow-sm">
                <div class="absolute top-0 left-0 w-1 h-full rounded-l-xl" :style="{ background: 'var(--color-primary, #6366f1)' }"></div>
                <p class="text-[9px] font-black uppercase tracking-[0.18em] text-gray-400 mb-1.5 pl-2">Receita Mês</p>
                <p class="text-xl font-black text-gray-900 leading-none pl-2 truncate">{{ formatCurrency(fin.receitaMes) }}</p>
                <p class="text-[10px] text-gray-400 mt-1.5 pl-2">faturamento total</p>
              </div>

              <div class="relative rounded-xl overflow-hidden p-4 bg-gray-50 border border-gray-100 shadow-sm">
                <div class="absolute top-0 left-0 w-1 h-full rounded-l-xl" :style="{ background: 'var(--color-primary, #6366f1)' }"></div>
                <p class="text-[9px] font-black uppercase tracking-[0.18em] text-gray-400 mb-1.5 pl-2">Mês Anterior</p>
                <p class="text-xl font-black text-gray-900 leading-none pl-2 truncate">{{ formatCurrency(fin.receitaPrev) }}</p>
                <p class="text-[10px] text-gray-400 mt-1.5 pl-2">receita anterior</p>
              </div>

            </div>

            <!-- Insights de vendas -->
            <div class="flex flex-col gap-3">

              <div v-if="fin.crescimentoMoM < -5" class="rounded-xl border border-red-200 overflow-hidden">
                <div class="px-4 py-3 bg-red-50 flex items-start gap-3">
                  <div class="mt-0.5 w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-semibold text-gray-800">Queda de {{ Math.abs(fin.crescimentoMoM).toFixed(1) }}% no faturamento vs. mês anterior</p>
                    <p class="text-xs text-gray-500 mt-1">Receita caiu de {{ formatCurrency(fin.receitaPrev) }} para {{ formatCurrency(fin.receitaMes) }}. Ações comerciais urgentes são necessárias.</p>
                  </div>
                </div>
              </div>

              <div v-if="fin.ticketMedio > 0 && fin.ticketMedio < 80" class="rounded-xl border border-amber-200 overflow-hidden">
                <div class="px-4 py-3 bg-amber-50 flex items-start gap-3">
                  <div class="mt-0.5 w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-semibold text-gray-800">Ticket médio baixo: {{ formatCurrency(fin.ticketMedio) }}</p>
                    <p class="text-xs text-gray-500 mt-1">Aumente em R$ 20 por atendimento para gerar +{{ formatCurrency(20 * fin.totalAtendimentos) }}/mês com o mesmo volume.</p>
                  </div>
                </div>
              </div>

              <div v-if="fin.crescimentoMoM >= 0 && fin.totalAtendimentos > 0" class="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                <p class="text-sm font-bold text-emerald-700">✓ Vendas em alta! Crescimento de {{ fin.crescimentoMoM.toFixed(1) }}% com {{ fin.totalAtendimentos }} atendimentos.</p>
              </div>

              <div v-if="fin.totalAtendimentos === 0" class="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
                <p class="text-sm font-bold text-red-600">Nenhuma venda registrada este mês. Verifique se os agendamentos estão sendo concluídos.</p>
              </div>

            </div>
          </div>
        </div>

        <!-- MÓDULO CLIENTES -->
        <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <button type="button" class="w-full flex items-center justify-between px-5 py-4 transition-colors" @click="openClientes = !openClientes">
            <div class="flex items-center gap-3.5">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style="background: linear-gradient(135deg,#dbeafe,#bfdbfe)">
                <svg class="w-4 h-4 text-blue-700" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
              </div>
              <div class="text-left min-w-0">
                <p class="text-sm font-bold text-gray-800 leading-none">Módulo Clientes</p>
                <p class="text-[11px] text-gray-400 mt-0.5">Ativos · Inativos · Frequência · Tempo sem comprar · Valor</p>
              </div>
              <span class="hidden sm:inline-flex shrink-0 ml-1 text-[10px] font-bold px-2.5 py-1 rounded-full"
                :class="cli.inativosMais30 > 0 ? 'bg-amber-50 text-amber-500 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'">
                {{ cli.inativosMais30 > 0 ? cli.inativosMais30 + ' inativos' : '✓ Base ativa' }}
              </span>
            </div>
            <div class="flex items-center gap-2 ml-4 shrink-0">
              <span class="text-[11px] text-gray-300 hidden sm:block">{{ openClientes ? 'Recolher' : 'Ver análise' }}</span>
              <svg class="w-4 h-4 text-gray-400 transition-transform duration-300" :class="openClientes ? 'rotate-180' : ''" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </div>
          </button>

        <!-- Conteúdo expansível -->
        <div v-show="openClientes" class="px-5 py-5 border-t border-gray-100">

          <!-- KPI Cards clientes -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">

            <div class="relative rounded-xl overflow-hidden p-4 border border-white/60 shadow-sm" :style="{ background: 'var(--color-primary-bg, linear-gradient(135deg,#3b82f6,#6366f1))' }">
              <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_70%)]"></div>
              <div class="relative">
                <p class="text-[9px] font-black uppercase tracking-[0.18em] text-white/60 mb-1.5">Total de Clientes</p>
                <p class="text-3xl font-black text-white leading-none">{{ cli.total }}</p>
                <p class="text-[10px] text-white/50 mt-1.5">cadastrados</p>
              </div>
            </div>

            <div class="relative rounded-xl overflow-hidden p-4 bg-gray-50 border border-gray-100 shadow-sm">
              <div class="absolute top-0 left-0 w-1 h-full rounded-l-xl bg-emerald-400"></div>
              <p class="text-[9px] font-black uppercase tracking-[0.18em] text-gray-400 mb-1.5 pl-2">Ativos (90d)</p>
              <p class="text-3xl font-black text-emerald-600 leading-none pl-2">{{ cli.ativos90 }}</p>
              <p class="text-[10px] text-gray-400 mt-1.5 pl-2">compraram recente</p>
            </div>

            <div class="relative rounded-xl overflow-hidden p-4 bg-gray-50 border border-gray-100 shadow-sm">
              <div class="absolute top-0 left-0 w-1 h-full rounded-l-xl" :class="cli.inativosMais60 > 0 ? 'bg-amber-400' : 'bg-emerald-400'"></div>
              <p class="text-[9px] font-black uppercase tracking-[0.18em] text-gray-400 mb-1.5 pl-2">Inativos +60d</p>
              <p class="text-3xl font-black leading-none pl-2" :class="cli.inativosMais60 > 0 ? 'text-amber-500' : 'text-gray-900'">{{ cli.inativosMais60 }}</p>
              <p class="text-[10px] text-gray-400 mt-1.5 pl-2">sem comprar</p>
            </div>

            <div class="relative rounded-xl overflow-hidden p-4 bg-gray-50 border border-gray-100 shadow-sm">
              <div class="absolute top-0 left-0 w-1 h-full rounded-l-xl" :style="{ background: 'var(--color-primary, #6366f1)' }"></div>
              <p class="text-[9px] font-black uppercase tracking-[0.18em] text-gray-400 mb-1.5 pl-2">Valor/Visita</p>
              <p class="text-xl font-black text-gray-900 leading-none pl-2 truncate">{{ formatCurrency(cli.valorPorVisitaAtivos || cli.ticketMedioCliente) }}</p>
              <p class="text-[10px] text-gray-400 mt-1.5 pl-2">média por atendimento</p>
            </div>

          </div>

          <!-- Potencial de recuperação -->
          <div v-if="cli.potencialRecuperacao > 0" class="mb-5 rounded-xl overflow-hidden shadow-sm border border-white/20" :style="{ background: 'var(--color-primary-bg, linear-gradient(135deg,#3b82f6,#6366f1))' }">
            <div class="relative px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_right,rgba(255,255,255,0.08),transparent_60%)]"></div>
              <div class="relative flex-1">
                <p class="text-[9px] font-black uppercase tracking-[0.18em] text-white/60 mb-1">Potencial de Recuperação Estimado</p>
                <p class="text-sm text-white/80 leading-snug">
                  Se {{ cli.inativosMais30 }} clientes inativos voltarem a comprar, você recupera até:
                </p>
              </div>
              <div class="relative shrink-0 text-right">
                <p class="text-3xl font-black text-white leading-none">{{ formatCurrency(cli.potencialRecuperacao) }}</p>
                <p class="text-[10px] text-white/50 font-bold uppercase tracking-widest mt-1">em receita</p>
              </div>
            </div>
          </div>

          <!-- Insights + Campanhas -->
          <div class="flex flex-col gap-3">

            <!-- Insight: clientes inativos +30 dias -->
            <div v-if="cli.inativosMais30 > 0" class="rounded-xl border border-amber-200 overflow-hidden">
              <div class="px-4 py-3 bg-amber-50 flex items-start gap-3">
                <div class="mt-0.5 w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Média</span>
                    <span class="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Retenção</span>
                  </div>
                  <p class="text-sm font-semibold text-gray-800">
                    {{ cli.inativosMais30 }} cliente{{ cli.inativosMais30 > 1 ? 's' : '' }}
                    não {{ cli.inativosMais30 > 1 ? 'retornam' : 'retorna' }} há mais de 30 dias.
                    <span v-if="cli.inativosMais60 > 0" class="text-amber-600 font-bold"> {{ cli.inativosMais60 }} há +60 dias.</span>
                    <span v-if="cli.inativosMais90 > 0" class="text-red-500 font-bold"> {{ cli.inativosMais90 }} há +90 dias.</span>
                  </p>
                </div>
              </div>
              <div class="px-4 py-3 grid sm:grid-cols-2 gap-4 bg-white">
                <div>
                  <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">💡 Impacto Estimado</p>
                  <p class="text-sm text-gray-600 leading-relaxed">
                    Se {{ cli.inativosMais30 > 1 ? 'esses clientes voltarem' : 'esse cliente voltar' }} este mês, você pode gerar
                    <span class="font-bold text-emerald-600">{{ formatCurrency(cli.potencialRecuperacao) }}</span>
                    em receita adicional.
                  </p>
                </div>
                <div>
                  <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">📣 Campanhas Recomendadas</p>
                  <ul class="flex flex-col gap-1.5">
                    <li class="flex items-start gap-2">
                      <span class="mt-0.5 w-4 h-4 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0 text-[9px] font-black">1</span>
                      <span class="text-sm text-gray-700">Enviar cupom de retorno com desconto exclusivo por WhatsApp.</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="mt-0.5 w-4 h-4 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0 text-[9px] font-black">2</span>
                      <span class="text-sm text-gray-700">Criar mensagem automática de "sentimos sua falta" para inativos +60 dias.</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="mt-0.5 w-4 h-4 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0 text-[9px] font-black">3</span>
                      <span class="text-sm text-gray-700">Implantar programa de fidelidade com pontos por agendamento.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Lista de clientes inativos com WhatsApp -->
              <div v-if="cli.listaInativos.length > 0" class="border-t border-gray-100">
                <div class="px-4 py-2.5 bg-gray-50 flex items-center justify-between">
                  <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Clientes inativos — contatar agora</p>
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] font-semibold text-gray-400">{{ cli.listaInativos.filter((c: any) => !clientesContatados.has(c.id)).length }} pendente{{ cli.listaInativos.filter((c: any) => !clientesContatados.has(c.id)).length !== 1 ? 's' : '' }}</span>
                    <button
                      v-if="clientesContatados.size > 0"
                      type="button"
                      class="text-[10px] font-bold text-red-500 hover:text-red-700 hover:underline transition-colors"
                      @click="limparTodosContatados"
                    >
                      Limpar enviados
                    </button>
                  </div>
                </div>
                <div class="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                  <div
                    v-for="inativo in cli.listaInativos"
                    :key="inativo.id"
                    class="px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                    :class="clientesContatados.has(inativo.id) ? 'opacity-60 bg-emerald-50/30' : ''"
                  >
                    <!-- Avatar -->
                    <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[10px] font-black text-white" :style="{ background: clientesContatados.has(inativo.id) ? '#10b981' : 'var(--color-primary, #6366f1)' }">
                      <svg v-if="clientesContatados.has(inativo.id)" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                      <span v-else>{{ inativo.nome.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase() }}</span>
                    </div>

                    <!-- Info -->
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-semibold text-gray-800 truncate">
                        {{ inativo.nome }}
                        <span v-if="clientesContatados.has(inativo.id)" class="text-[10px] font-bold text-emerald-600 ml-1">✓ Enviado</span>
                      </p>
                      <p class="text-[10px] text-gray-400">
                        Inativo há {{ inativo.diasInativo }} dias · Gasta {{ formatCurrency(inativo.ticketIndividual) }} por visita
                      </p>
                    </div>

                    <!-- Botões -->
                    <div class="flex items-center gap-1.5 shrink-0">
                      <!-- Botão WhatsApp -->
                      <button
                        v-if="inativo.telefone && !clientesContatados.has(inativo.id)"
                        type="button"
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors"
                        @click="enviarWhatsAppInativo(inativo)"
                      >
                        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        Enviar
                      </button>

                      <!-- Botão marcar como enviado (sem abrir WhatsApp) -->
                      <button
                        v-if="inativo.telefone && !clientesContatados.has(inativo.id)"
                        type="button"
                        class="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors border border-gray-200"
                        title="Marcar como enviado"
                        @click="marcarComoEnviado(inativo.id)"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                      </button>

                      <!-- Botão desmarcar (já enviado) -->
                      <button
                        v-if="clientesContatados.has(inativo.id)"
                        type="button"
                        class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                        @click="desmarcarEnviado(inativo.id)"
                      >
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                        Enviado
                      </button>

                      <!-- Sem telefone -->
                      <span v-if="!inativo.telefone" class="text-[10px] text-gray-300 font-medium">Sem tel.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Insight: nenhum cliente inativo -->
            <div v-if="cli.inativosMais30 === 0 && cli.total > 0" class="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p class="text-sm font-bold text-emerald-700">✅ Ótimo! Nenhum cliente inativo nos últimos 30 dias.</p>
            </div>

            <!-- Insight: base pequena -->
            <div v-if="cli.total < 10" class="rounded-xl border border-blue-200 overflow-hidden">
              <div class="px-4 py-3 bg-blue-50 flex items-start gap-3">
                <div class="mt-0.5 w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Baixa</span>
                    <span class="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Captação</span>
                  </div>
                  <p class="text-sm font-semibold text-gray-800">
                    Sua base de clientes tem apenas {{ cli.total }} cadastro{{ cli.total !== 1 ? 's' : '' }}.
                    Aumentar a carteira é essencial para o crescimento sustentável.
                  </p>
                </div>
              </div>
              <div class="px-4 py-3 grid sm:grid-cols-2 gap-4 bg-white">
                <div>
                  <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">💡 Impacto Estimado</p>
                  <p class="text-sm text-gray-700">Cada 10 novos clientes com ticket médio de {{ formatCurrency(cli.valorPorVisitaAtivos || 100) }} representam {{ formatCurrency((cli.valorPorVisitaAtivos || 100) * 10) }} em receita potencial.</p>
                </div>
                <div>
                  <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">✅ Ações Recomendadas</p>
                  <ul class="flex flex-col gap-1.5">
                    <li class="flex items-start gap-2">
                      <span class="mt-0.5 w-4 h-4 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 text-[9px] font-black">1</span>
                      <span class="text-sm text-gray-700">Criar campanha de indicação: cliente indica e ganha desconto.</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="mt-0.5 w-4 h-4 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 text-[9px] font-black">2</span>
                      <span class="text-sm text-gray-700">Divulgar o link de agendamento online nas redes sociais.</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="mt-0.5 w-4 h-4 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 text-[9px] font-black">3</span>
                      <span class="text-sm text-gray-700">Oferecer desconto ou brinde na primeira visita para novos clientes.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Insight: frequência baixa -->
            <div v-if="cli.total > 0 && cli.frequenciaMedia < 2 && cli.ativos90 > 0" class="rounded-xl border border-purple-200 overflow-hidden">
              <div class="px-4 py-3 bg-purple-50 flex items-start gap-3">
                <div class="mt-0.5 w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">Baixa</span>
                    <span class="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Frequência</span>
                  </div>
                  <p class="text-sm font-semibold text-gray-800">
                    A frequência média de retorno dos clientes ativos é de {{ cli.frequenciaMedia.toFixed(1) }} visita(s) nos últimos 90 dias — abaixo do ideal de 2 ou mais.
                  </p>
                </div>
              </div>
              <div class="px-4 py-3 grid sm:grid-cols-2 gap-4 bg-white">
                <div>
                  <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">💡 Impacto Estimado</p>
                  <p class="text-sm text-gray-700">Se cada cliente ativo retornar apenas mais 1x por trimestre, você gera {{ formatCurrency(cli.ativos90 * cli.valorPorVisitaAtivos) }} extras.</p>
                  <p v-if="cli.ativos90 > 0" class="text-base font-black text-purple-600 mt-1">{{ formatCurrency(cli.ativos90 * cli.valorPorVisitaAtivos) }}<span class="text-xs font-semibold text-gray-400">/trimestre</span></p>
                </div>
                <div>
                  <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">✅ Ações Recomendadas</p>
                  <ul class="flex flex-col gap-1.5">
                    <li class="flex items-start gap-2">
                      <span class="mt-0.5 w-4 h-4 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 text-[9px] font-black">1</span>
                      <span class="text-sm text-gray-700">Criar lembretes automáticos de retorno via WhatsApp após cada atendimento.</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="mt-0.5 w-4 h-4 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 text-[9px] font-black">2</span>
                      <span class="text-sm text-gray-700">Oferecer pacotes mensais com desconto para incentivar retorno regular.</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="mt-0.5 w-4 h-4 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 text-[9px] font-black">3</span>
                      <span class="text-sm text-gray-700">Criar programa de fidelidade com benefício na 5ª visita.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Top 5 clientes por valor -->
            <div v-if="cli.topClientes.length > 0" class="rounded-xl border border-gray-200 overflow-hidden">
              <div class="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <p class="text-xs font-bold text-gray-700">🏆 Top 5 Clientes por Receita Gerada</p>
              </div>
              <div class="divide-y divide-gray-50">
                <div v-for="(c, idx) in cli.topClientes" :key="c.cliente_id" class="px-4 py-2.5 flex items-center gap-3 bg-white hover:bg-gray-50 transition-colors">
                  <span class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
                    :class="idx === 0 ? 'bg-yellow-100 text-yellow-700' : idx === 1 ? 'bg-gray-100 text-gray-600' : 'bg-orange-50 text-orange-600'">
                    {{ idx + 1 }}
                  </span>
                  <span class="flex-1 text-sm font-semibold text-gray-800 truncate">{{ c.nome }}</span>
                  <span class="text-xs text-gray-400">{{ c.visitas }}x</span>
                  <span class="text-sm font-bold text-emerald-600">{{ formatCurrency(c.total) }}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

        <!-- MÓDULO PRODUÇÃO -->
        <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <button type="button" class="w-full flex items-center justify-between px-5 py-4 transition-colors" @click="openProducao = !openProducao">
            <div class="flex items-center gap-3.5">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style="background: linear-gradient(135deg,#dbeafe,#bfdbfe)">
                <svg class="w-4 h-4 text-blue-700" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6z" /></svg>
              </div>
              <div class="text-left min-w-0">
                <p class="text-sm font-bold text-gray-800 leading-none">Módulo Produção</p>
                <p class="text-[11px] text-gray-400 mt-0.5">Processos · Fila · Agendamento · Progresso</p>
              </div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full" :class="prodMetrics.score >= 80 ? 'bg-emerald-100 text-emerald-700' : prodMetrics.score >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'">{{ prodMetrics.statusLabel }}</span>
              <span class="text-xs text-gray-400 font-medium">Ver análise</span>
              <svg class="w-4 h-4 text-gray-300 transition-transform" :class="openProducao ? 'rotate-180' : ''" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </div>
          </button>
          <div v-show="openProducao" class="px-5 pb-5 pt-1 border-t border-gray-100 space-y-4">
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div class="bg-gray-50 rounded-xl p-3 text-center">
                <p class="text-lg font-black text-gray-900">{{ prodMetrics.naoAgendados }}</p>
                <p class="text-[10px] text-gray-400 font-semibold">Na fila</p>
              </div>
              <div class="bg-gray-50 rounded-xl p-3 text-center">
                <p class="text-lg font-black text-blue-600">{{ prodMetrics.processosAndamento }}</p>
                <p class="text-[10px] text-gray-400 font-semibold">Em produção</p>
              </div>
              <div class="bg-gray-50 rounded-xl p-3 text-center">
                <p class="text-lg font-black" :class="prodMetrics.atrasados > 0 ? 'text-red-600' : 'text-gray-400'">{{ prodMetrics.atrasados }}</p>
                <p class="text-[10px] text-gray-400 font-semibold">Atrasados</p>
              </div>
              <div class="bg-gray-50 rounded-xl p-3 text-center">
                <p class="text-lg font-black text-emerald-600">{{ prodMetrics.concluidos }}</p>
                <p class="text-[10px] text-gray-400 font-semibold">Concluídos</p>
              </div>
            </div>
            <div class="space-y-2">
              <p v-for="(dica, i) in prodMetrics.dicas" :key="i" class="text-sm text-gray-600 leading-relaxed flex items-start gap-2">
                <span class="text-base mt-0.5">{{ dica.icon }}</span>
                <span>{{ dica.texto }}</span>
              </p>
            </div>
          </div>
        </div>

        <!-- MÓDULO ESTOQUE (REMOVIDO) -->
        <div v-if="false" class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <button type="button" class="w-full flex items-center justify-between px-5 py-4 transition-colors" @click="openEstoque = !openEstoque">
            <div class="flex items-center gap-3.5">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style="background: linear-gradient(135deg,#ffedd5,#fed7aa)">
                <svg class="w-4 h-4 text-orange-700" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
              </div>
              <div class="text-left min-w-0">
                <p class="text-sm font-bold text-gray-800 leading-none">Módulo Estoque</p>
                <p class="text-[11px] text-gray-400 mt-0.5">Giro · Produtos parados · Ruptura · Curva ABC</p>
              </div>
              <span class="hidden sm:inline-flex shrink-0 ml-1 text-[10px] font-bold px-2.5 py-1 rounded-full"
                :class="est.alertasTotal > 0 ? 'bg-orange-50 text-orange-500 border-orange-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'">
                {{ est.alertasTotal > 0 ? est.alertasTotal + ' alertas' : '✓ Saudável' }}
              </span>
            </div>
            <div class="flex items-center gap-2 ml-4 shrink-0">
              <span class="text-[11px] text-gray-300 hidden sm:block">{{ openEstoque ? 'Recolher' : 'Ver análise' }}</span>
              <svg class="w-4 h-4 text-gray-400 transition-transform duration-300" :class="openEstoque ? 'rotate-180' : ''" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </div>
          </button>

        <!-- Conteúdo expansível -->
        <div v-show="openEstoque" class="px-5 py-5 border-t border-gray-100">

          <!-- KPI Cards estoque -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">

            <div class="relative rounded-xl overflow-hidden p-4 border border-white/60 shadow-sm" :style="{ background: 'var(--color-primary-bg, linear-gradient(135deg,#f97316,#fb923c))' }">
              <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_70%)]"></div>
              <div class="relative">
                <p class="text-[9px] font-black uppercase tracking-[0.18em] text-white/60 mb-1.5">Total Produtos</p>
                <p class="text-3xl font-black text-white leading-none">{{ est.total }}</p>
                <p class="text-[10px] text-white/50 mt-1.5">cadastrados</p>
              </div>
            </div>

            <div class="relative rounded-xl overflow-hidden p-4 bg-gray-50 border border-gray-100 shadow-sm">
              <div class="absolute top-0 left-0 w-1 h-full rounded-l-xl" :style="{ background: 'var(--color-primary, #6366f1)' }"></div>
              <p class="text-[9px] font-black uppercase tracking-[0.18em] text-gray-400 mb-1.5 pl-2">Valor Estoque</p>
              <p class="text-lg font-black text-gray-900 leading-none pl-2 truncate">{{ formatCurrency(est.valorTotal) }}</p>
              <p class="text-[10px] text-gray-400 mt-1.5 pl-2">capital imobilizado</p>
            </div>

            <div class="relative rounded-xl overflow-hidden p-4 bg-gray-50 border border-gray-100 shadow-sm">
              <div class="absolute top-0 left-0 w-1 h-full rounded-l-xl" :class="est.parados90 > 0 ? 'bg-red-400' : 'bg-emerald-400'"></div>
              <p class="text-[9px] font-black uppercase tracking-[0.18em] text-gray-400 mb-1.5 pl-2">Parados +90d</p>
              <p class="text-3xl font-black leading-none pl-2" :class="est.parados90 > 0 ? 'text-red-500' : 'text-gray-900'">{{ est.parados90 }}</p>
              <p class="text-[10px] text-gray-400 mt-1.5 pl-2">sem venda</p>
            </div>

            <div class="relative rounded-xl overflow-hidden p-4 bg-gray-50 border border-gray-100 shadow-sm">
              <div class="absolute top-0 left-0 w-1 h-full rounded-l-xl" :class="est.rupturaIminente > 0 ? 'bg-amber-400' : 'bg-emerald-400'"></div>
              <p class="text-[9px] font-black uppercase tracking-[0.18em] text-gray-400 mb-1.5 pl-2">Ruptura Iminente</p>
              <p class="text-3xl font-black leading-none pl-2" :class="est.rupturaIminente > 0 ? 'text-amber-500' : 'text-gray-900'">{{ est.rupturaIminente }}</p>
              <p class="text-[10px] text-gray-400 mt-1.5 pl-2">≤ 3 unidades</p>
            </div>

          </div>

          <!-- Curva ABC mini visualização -->
          <div v-if="est.curvaABC.length > 0" class="mb-5 rounded-xl overflow-hidden border border-white/20 shadow-sm" :style="{ background: 'var(--color-primary-bg, linear-gradient(135deg,#f97316,#fb923c))' }">
            <div class="relative px-5 py-4">
              <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_right,rgba(255,255,255,0.08),transparent_60%)]"></div>
              <div class="relative">
                <p class="text-[9px] font-black uppercase tracking-[0.18em] text-white/60 mb-3">Curva ABC — Concentração de Valor no Estoque</p>
                <div class="flex flex-wrap gap-3">
                  <div class="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 border border-white/10">
                    <span class="w-2 h-2 rounded-full bg-emerald-300 shrink-0"></span>
                    <span class="text-xs font-bold text-white">Curva A</span>
                    <span class="text-xs text-white/60">{{ est.curvaABC.filter((p) => p.curva === 'A').length }} prod.</span>
                    <span class="text-xs font-black text-white">{{ formatCurrency(est.curvaABC.filter((p) => p.curva === 'A').reduce((s, p) => s + p.valorEstoque, 0)) }}</span>
                  </div>
                  <div class="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 border border-white/10">
                    <span class="w-2 h-2 rounded-full bg-amber-300 shrink-0"></span>
                    <span class="text-xs font-bold text-white">Curva B</span>
                    <span class="text-xs text-white/60">{{ est.curvaABC.filter((p) => p.curva === 'B').length }} prod.</span>
                    <span class="text-xs font-black text-white">{{ formatCurrency(est.curvaABC.filter((p) => p.curva === 'B').reduce((s, p) => s + p.valorEstoque, 0)) }}</span>
                  </div>
                  <div class="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 border border-white/10">
                    <span class="w-2 h-2 rounded-full bg-white/40 shrink-0"></span>
                    <span class="text-xs font-bold text-white">Curva C</span>
                    <span class="text-xs text-white/60">{{ est.curvaABC.filter((p) => p.curva === 'C').length }} prod.</span>
                    <span class="text-xs font-black text-white">{{ formatCurrency(est.curvaABC.filter((p) => p.curva === 'C').reduce((s, p) => s + p.valorEstoque, 0)) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Alertas e Recomendações -->
          <div class="flex flex-col gap-3">

            <!-- Alerta: produtos parados -->
            <div v-if="est.parados90 > 0" class="rounded-xl border border-red-200 overflow-hidden">
              <div class="px-4 py-3 bg-red-50 flex items-start gap-3">
                <div class="mt-0.5 w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1 flex-wrap">
                    <span class="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-red-100 text-red-700">Alta</span>
                    <span class="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Giro de Estoque</span>
                  </div>
                  <p class="text-sm font-semibold text-gray-800">
                    {{ est.parados90 }} produto{{ est.parados90 > 1 ? 's' : '' }} sem venda há mais de 90 dias,
                    representando {{ formatCurrency(est.valorParados90) }} em capital imobilizado.
                  </p>
                </div>
              </div>
              <div class="px-4 py-3 grid sm:grid-cols-2 gap-4 bg-white">
                <div>
                  <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">💡 Impacto Estimado</p>
                  <p class="text-sm text-gray-600 leading-relaxed">
                    Converter esses produtos em caixa libera
                    <span class="font-bold text-emerald-600">{{ formatCurrency(est.valorParados90 * 0.7) }}</span>
                    (estimado com desconto de 30%) para reinvestimento ou pagamento de despesas.
                  </p>
                  <p class="text-base font-black text-emerald-600 mt-1">{{ formatCurrency(est.valorParados90 * 0.7) }}<span class="text-xs font-semibold text-gray-400"> recuperado</span></p>
                </div>
                <div>
                  <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">✅ Ações Recomendadas</p>
                  <ul class="flex flex-col gap-1.5">
                    <li class="flex items-start gap-2">
                      <span class="mt-0.5 w-4 h-4 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0 text-[9px] font-black">1</span>
                      <span class="text-sm text-gray-700">Criar promoção de queima de estoque com desconto de 20–40%.</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="mt-0.5 w-4 h-4 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0 text-[9px] font-black">2</span>
                      <span class="text-sm text-gray-700">Incluir produtos parados como brinde em vendas acima de determinado valor.</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="mt-0.5 w-4 h-4 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0 text-[9px] font-black">3</span>
                      <span class="text-sm text-gray-700">Avaliar devolver ou trocar itens com fornecedores caso possível.</span>
                    </li>
                  </ul>
                </div>
              </div>
              <!-- Lista dos produtos parados -->
              <div v-if="est.listaProdutosParados.length > 0" class="border-t border-gray-100">
                <div class="px-4 py-2 bg-gray-50">
                  <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Produtos parados identificados</p>
                </div>
                <div class="divide-y divide-gray-50 max-h-48 overflow-y-auto">
                  <div
                    v-for="prod in est.listaProdutosParados"
                    :key="prod.id"
                    class="px-4 py-2 flex items-center gap-3 bg-white hover:bg-gray-50"
                  >
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-semibold text-gray-800 truncate">{{ prod.nome }}</p>
                      <p class="text-[10px] text-gray-400">{{ prod.estoque }} un. em estoque</p>
                    </div>
                    <span class="text-sm font-bold text-red-500 shrink-0">{{ formatCurrency(prod.preco * prod.estoque) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Alerta: ruptura iminente -->
            <div v-if="est.rupturaIminente > 0" class="rounded-xl border border-amber-200 overflow-hidden">
              <div class="px-4 py-3 bg-amber-50 flex items-start gap-3">
                <div class="mt-0.5 w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1 flex-wrap">
                    <span class="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Média</span>
                    <span class="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Ruptura de Estoque</span>
                  </div>
                  <p class="text-sm font-semibold text-gray-800">
                    {{ est.rupturaIminente }} produto{{ est.rupturaIminente > 1 ? 's' : '' }} com estoque crítico (≤ 3 unidades).
                    Risco de ruptura imediata e perda de vendas.
                  </p>
                </div>
              </div>
              <div class="px-4 py-3 grid sm:grid-cols-2 gap-4 bg-white">
                <div>
                  <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">💡 Impacto Estimado</p>
                  <p class="text-sm text-gray-600 leading-relaxed">
                    A falta desses itens pode gerar perda de vendas e insatisfação de clientes.
                    Reposição imediata garante continuidade da receita.
                  </p>
                </div>
                <div>
                  <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">✅ Ações Recomendadas</p>
                  <ul class="flex flex-col gap-1.5">
                    <li class="flex items-start gap-2">
                      <span class="mt-0.5 w-4 h-4 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 text-[9px] font-black">1</span>
                      <span class="text-sm text-gray-700">Fazer pedido de reposição imediata junto ao fornecedor.</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="mt-0.5 w-4 h-4 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 text-[9px] font-black">2</span>
                      <span class="text-sm text-gray-700">Definir estoque mínimo para esses itens no sistema.</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="mt-0.5 w-4 h-4 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 text-[9px] font-black">3</span>
                      <span class="text-sm text-gray-700">Avisar clientes frequentes sobre disponibilidade limitada.</span>
                    </li>
                  </ul>
                </div>
              </div>
              <!-- Lista dos produtos em ruptura -->
              <div v-if="est.listaProdutosRuptura.length > 0" class="border-t border-gray-100">
                <div class="px-4 py-2 bg-gray-50">
                  <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Produtos em estoque crítico</p>
                </div>
                <div class="divide-y divide-gray-50">
                  <div
                    v-for="prod in est.listaProdutosRuptura"
                    :key="prod.id"
                    class="px-4 py-2 flex items-center gap-3 bg-white hover:bg-gray-50"
                  >
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-semibold text-gray-800 truncate">{{ prod.nome }}</p>
                      <p class="text-[10px] text-gray-400">{{ formatCurrency(prod.preco) }} un.</p>
                    </div>
                    <span
                      class="text-sm font-black px-2.5 py-1 rounded-lg shrink-0"
                      :class="prod.estoque === 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'"
                    >
                      {{ prod.estoque === 0 ? 'Zerado' : prod.estoque + ' un.' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Insight: capital imobilizado na curva C -->
            <div v-if="est.capitalCurvaC > 0 && est.capitalCurvaC > est.valorTotal * 0.2" class="rounded-xl border border-blue-200 overflow-hidden">
              <div class="px-4 py-3 bg-blue-50 flex items-start gap-3">
                <div class="mt-0.5 w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1 flex-wrap">
                    <span class="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Baixa</span>
                    <span class="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Curva ABC</span>
                  </div>
                  <p class="text-sm font-semibold text-gray-800">
                    Produtos da Curva C representam {{ formatCurrency(est.capitalCurvaC) }} em estoque
                    ({{ est.valorTotal > 0 ? ((est.capitalCurvaC / est.valorTotal) * 100).toFixed(0) : 0 }}% do capital total).
                    Esses itens têm menor giro e maior custo de manutenção.
                  </p>
                </div>
              </div>
              <div class="px-4 py-3 grid sm:grid-cols-2 gap-4 bg-white">
                <div>
                  <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">💡 Impacto Estimado</p>
                  <p class="text-sm text-gray-700">Reduzir o estoque da Curva C em 50% libera aproximadamente <span class="font-bold text-emerald-600">{{ formatCurrency(est.capitalCurvaC * 0.5) }}</span> em capital de giro.</p>
                </div>
                <div>
                  <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">✅ Ações Recomendadas</p>
                  <ul class="flex flex-col gap-1.5">
                    <li class="flex items-start gap-2">
                      <span class="mt-0.5 w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 text-[9px] font-black">1</span>
                      <span class="text-sm text-gray-700">Parar de repor itens da Curva C com baixo giro.</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="mt-0.5 w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 text-[9px] font-black">2</span>
                      <span class="text-sm text-gray-700">Criar promoções focadas nesses itens para liquidar o estoque.</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="mt-0.5 w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 text-[9px] font-black">3</span>
                      <span class="text-sm text-gray-700">Concentrar compras nos itens da Curva A de maior retorno.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Estado vazio -->
            <div v-if="est.alertasTotal === 0" class="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
              <p class="text-sm font-bold text-emerald-700">✅ Estoque saudável! Nenhum alerta identificado.</p>
            </div>

          </div>
        </div>
      </div>

        <!-- CENTRAL DE OPORTUNIDADES -->
        <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <button type="button" class="w-full flex items-center justify-between px-5 py-4 transition-colors" @click="openOportunidades = !openOportunidades">
            <div class="flex items-center gap-3.5">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style="background: linear-gradient(135deg,#fef9c3,#fde68a)">
                <svg class="w-4 h-4 text-yellow-700" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
              </div>
              <div class="text-left min-w-0">
                <p class="text-sm font-bold text-gray-800 leading-none">Central de Oportunidades</p>
                <p class="text-[11px] text-gray-400 mt-0.5">Maiores ganhos rápidos identificados automaticamente</p>
              </div>
              <span v-if="oportunidades.length > 0" class="hidden sm:inline-flex shrink-0 ml-1 text-[10px] font-bold px-2.5 py-1 rounded-full border bg-yellow-50 text-yellow-600 border-yellow-100">
                {{ oportunidades.length }} oportunidade{{ oportunidades.length > 1 ? 's' : '' }}
              </span>
            </div>
            <div class="flex items-center gap-2 ml-4 shrink-0">
              <span class="text-[11px] text-gray-300 hidden sm:block">{{ openOportunidades ? 'Recolher' : 'Ver análise' }}</span>
              <svg class="w-4 h-4 text-gray-400 transition-transform duration-300" :class="openOportunidades ? 'rotate-180' : ''" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </div>
          </button>

        <!-- Conteúdo -->
        <div v-show="openOportunidades" class="px-5 py-5 border-t border-gray-100">

          <!-- ── Banner impacto total ── -->
          <div v-if="totalImpacto > 0" class="relative rounded-2xl overflow-hidden mb-5 shadow-sm" :style="{ background: 'var(--color-primary-bg, linear-gradient(135deg, #6366f1, #8b5cf6))' }">
            <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12),transparent_60%)]"></div>

            <div class="relative px-5 pt-5 pb-4">
              <!-- Topo: label + valor -->
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <div class="flex items-center gap-2 mb-1.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse"></span>
                    <p class="text-[10px] font-bold uppercase tracking-widest text-white/70">Potencial Total Identificado</p>
                  </div>
                  <p class="text-white/80 text-sm leading-relaxed max-w-md">
                    Executando todas as oportunidades abaixo, sua empresa pode aumentar a receita em:
                  </p>
                </div>
                <div class="shrink-0 sm:text-right">
                  <p class="text-4xl font-black text-white leading-none tracking-tight">+{{ formatCurrency(totalImpacto) }}</p>
                  <p class="text-white/60 text-xs font-bold uppercase tracking-widest mt-1">por mês</p>
                </div>
              </div>

              <!-- Divisor -->
              <div class="h-px bg-white/15 mb-4"></div>

              <!-- Mini cards por oportunidade -->
              <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                <div
                  v-for="op in oportunidades"
                  :key="'mini-' + op.id"
                  class="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 border border-white/10"
                >
                  <span class="w-2 h-2 rounded-full shrink-0 bg-white/80"></span>
                  <div class="min-w-0">
                    <p class="text-[10px] text-white/50 font-semibold truncate">{{ op.categoria }}</p>
                    <p class="text-xs font-black text-white leading-none">+{{ formatCurrency(op.valor) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ── Cards de oportunidades ── -->
          <div v-if="oportunidades.length > 0" class="flex flex-col gap-3">
            <div
              v-for="(op, idx) in oportunidades"
              :key="op.id"
              class="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <!-- Cabeçalho -->
              <div class="px-4 py-3 flex items-start gap-3 bg-gray-50/50">
                <!-- Badge ranking com cor do tema -->
                <div
                  class="mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-[11px] font-black"
                  :style="{ background: 'var(--color-primary, #6366f1)', color: 'var(--color-primary-text, #fff)' }"
                >
                  {{ idx + 1 }}
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap mb-1">
                    <span
                      class="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                      :style="{ background: 'var(--color-primary, #6366f1)', color: 'var(--color-primary-text, #fff)' }"
                    >
                      {{ op.categoria }}
                    </span>
                    <span
                      class="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                      :class="{
                        'bg-red-100 text-red-700':    op.prazo === 'Urgente',
                        'bg-amber-100 text-amber-700': op.prazo === 'Esta semana',
                        'bg-blue-100 text-blue-700':   op.prazo === 'Este mês',
                      }"
                    >
                      {{ op.prazo }}
                    </span>
                  </div>
                  <p class="text-sm font-semibold text-gray-800 leading-snug">{{ op.titulo }}</p>
                  <p class="text-xs text-gray-500 mt-0.5 leading-relaxed">{{ op.descricao }}</p>
                </div>

                <!-- Valor potencial com cor do tema -->
                <div class="shrink-0 text-right ml-2">
                  <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Potencial</p>
                  <p class="text-xl font-black leading-none" :style="{ color: 'var(--color-primary, #6366f1)' }">+{{ formatCurrency(op.valor) }}</p>
                  <p class="text-[10px] text-gray-400 font-semibold">/mês</p>
                </div>
              </div>

              <!-- Corpo: impacto + ações -->
              <div class="px-4 py-3 grid sm:grid-cols-2 gap-4 bg-white border-t border-gray-100">
                <div>
                  <div class="flex items-center gap-1.5 mb-1.5">
                    <div class="w-1 h-4 rounded-full" :style="{ background: 'var(--color-primary, #6366f1)' }"></div>
                    <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Impacto Estimado</p>
                  </div>
                  <p class="text-sm text-gray-600 leading-relaxed">{{ op.descricao }}</p>
                  <p class="text-base font-black mt-1.5" :style="{ color: 'var(--color-primary, #6366f1)' }">
                    +{{ formatCurrency(op.valor) }}<span class="text-xs font-semibold text-gray-400">/mês</span>
                  </p>
                </div>
                <div>
                  <div class="flex items-center gap-1.5 mb-1.5">
                    <div class="w-1 h-4 rounded-full" :style="{ background: 'var(--color-primary, #6366f1)' }"></div>
                    <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Ações Recomendadas</p>
                  </div>
                  <ul class="flex flex-col gap-1.5">
                    <li v-for="(acao, j) in op.acoes" :key="j" class="flex items-start gap-2">
                      <span
                        class="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[9px] font-black"
                        :style="{ background: 'var(--color-primary, #6366f1)', color: 'var(--color-primary-text, #fff)' }"
                      >{{ j + 1 }}</span>
                      <span class="text-sm text-gray-700">{{ acao }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Estado vazio -->
          <div v-else class="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
            <p class="text-sm font-bold text-emerald-700">✅ Nenhuma oportunidade crítica identificada no momento.</p>
            <p class="text-xs text-emerald-500 mt-1">Continue monitorando — novas oportunidades surgem com a evolução dos dados.</p>
          </div>

        </div>
      </div>

        <!-- PLANO DE AÇÃO INTELIGENTE -->
        <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <button type="button" class="w-full flex items-center justify-between px-5 py-4 transition-colors" @click="openPlanoAcao = !openPlanoAcao">
            <div class="flex items-center gap-3.5">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style="background: linear-gradient(135deg,#e0e7ff,#c7d2fe)">
                <svg class="w-4 h-4 text-indigo-700" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>
              </div>
              <div class="text-left min-w-0">
                <p class="text-sm font-bold text-gray-800 leading-none">Plano de Ação Inteligente</p>
                <p class="text-[11px] text-gray-400 mt-0.5">Tarefas geradas por prioridade e impacto financeiro</p>
              </div>
              <span v-if="planoAcao.length > 0" class="hidden sm:inline-flex shrink-0 ml-1 text-[10px] font-bold px-2.5 py-1 rounded-full border bg-indigo-50 text-indigo-600 border-indigo-100">
                {{ planoAcao.length }} tarefa{{ planoAcao.length > 1 ? 's' : '' }}
              </span>
            </div>
            <div class="flex items-center gap-2 ml-4 shrink-0">
              <span class="text-[11px] text-gray-300 hidden sm:block">{{ openPlanoAcao ? 'Recolher' : 'Ver plano' }}</span>
              <svg class="w-4 h-4 text-gray-400 transition-transform duration-300" :class="openPlanoAcao ? 'rotate-180' : ''" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </div>
          </button>

        <!-- Conteúdo -->
        <div v-show="openPlanoAcao" class="px-5 py-5 border-t border-gray-100">

          <!-- Agrupamento por semana -->
          <template v-for="grupo in gruposPlano" :key="grupo.semana">
            <div class="mb-6">

              <!-- Cabeçalho do grupo / semana -->
              <div class="flex items-center gap-3 mb-3">
                <div
                  class="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                  :class="{
                    'bg-red-100':    grupo.semana === 'Urgente — Hoje',
                    'bg-amber-100':  grupo.semana === 'Esta Semana',
                    'bg-blue-100':   grupo.semana === 'Este Mês',
                  }"
                >
                  <svg
                    class="w-3.5 h-3.5 shrink-0"
                    :class="{
                      'text-red-600':   grupo.semana === 'Urgente — Hoje',
                      'text-amber-600': grupo.semana === 'Esta Semana',
                      'text-blue-600':  grupo.semana === 'Este Mês',
                    }"
                    fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  <span
                    class="text-xs font-black uppercase tracking-widest"
                    :class="{
                      'text-red-700':   grupo.semana === 'Urgente — Hoje',
                      'text-amber-700': grupo.semana === 'Esta Semana',
                      'text-blue-700':  grupo.semana === 'Este Mês',
                    }"
                  >{{ grupo.semana }}</span>
                </div>
                <span class="text-xs text-gray-400 font-semibold">{{ grupo.tarefas.length }} tarefa{{ grupo.tarefas.length > 1 ? 's' : '' }}</span>
                <div class="flex-1 h-px bg-gray-100"></div>
                <span class="text-xs font-bold text-emerald-600">+{{ formatCurrency(grupo.tarefas.reduce((s, t) => s + t.impactoValor, 0)) }}/mês</span>
              </div>

              <!-- Lista de tarefas do grupo -->
              <div class="flex flex-col gap-2">
                <div
                  v-for="(tarefa, ti) in grupo.tarefas"
                  :key="tarefa.id"
                  class="rounded-xl border overflow-hidden"
                  :class="{
                    'border-red-200':   tarefa.prioridade === 'Alta',
                    'border-amber-200': tarefa.prioridade === 'Média',
                    'border-blue-200':  tarefa.prioridade === 'Baixa',
                  }"
                >
                  <!-- Linha principal da tarefa -->
                  <div
                    class="px-4 py-3 flex items-start gap-3"
                    :class="{
                      'bg-red-50':   tarefa.prioridade === 'Alta',
                      'bg-amber-50': tarefa.prioridade === 'Média',
                      'bg-blue-50':  tarefa.prioridade === 'Baixa',
                    }"
                  >
                    <!-- Checkbox visual -->
                    <div
                      class="mt-0.5 w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center"
                      :class="{
                        'border-red-400':   tarefa.prioridade === 'Alta',
                        'border-amber-400': tarefa.prioridade === 'Média',
                        'border-blue-400':  tarefa.prioridade === 'Baixa',
                      }"
                    ></div>

                    <!-- Conteúdo da tarefa -->
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          class="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                          :class="{
                            'bg-red-100 text-red-700':    tarefa.prioridade === 'Alta',
                            'bg-amber-100 text-amber-700': tarefa.prioridade === 'Média',
                            'bg-blue-100 text-blue-700':   tarefa.prioridade === 'Baixa',
                          }"
                        >{{ tarefa.prioridade }}</span>
                        <span class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{{ tarefa.modulo }}</span>
                      </div>
                      <p class="text-sm font-semibold text-gray-800 leading-snug">{{ tarefa.titulo }}</p>
                    </div>

                    <!-- Impacto à direita -->
                    <div class="shrink-0 text-right ml-2">
                      <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Impacto</p>
                      <p
                        class="text-base font-black leading-none"
                        :class="{
                          'text-red-600':   tarefa.prioridade === 'Alta',
                          'text-amber-600': tarefa.prioridade === 'Média',
                          'text-blue-600':  tarefa.prioridade === 'Baixa',
                        }"
                      >+{{ formatCurrency(tarefa.impactoValor) }}</p>
                      <p class="text-[10px] text-gray-400 font-semibold">/mês</p>
                    </div>
                  </div>

                  <!-- Detalhes expandidos: objetivo + prazo -->
                  <div class="px-4 py-3 grid sm:grid-cols-2 gap-4 bg-white">
                    <div>
                      <div class="flex items-center gap-1.5 mb-1.5">
                        <svg class="w-3.5 h-3.5 text-indigo-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" /></svg>
                        <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Objetivo</p>
                      </div>
                      <p class="text-sm text-gray-600 leading-relaxed">{{ tarefa.objetivo }}</p>
                    </div>
                    <div>
                      <div class="flex items-center gap-1.5 mb-1.5">
                        <svg class="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Prazo Sugerido</p>
                      </div>
                      <p class="text-sm font-semibold text-gray-800">{{ tarefa.prazo }}</p>
                      <p class="text-xs text-gray-400 mt-0.5">{{ tarefa.descricaoPrazo }}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </template>

          <!-- Estado vazio -->
          <div v-if="planoAcao.length === 0" class="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
            <p class="text-sm font-bold text-emerald-700">✅ Nenhuma tarefa pendente gerada. Seu negócio está no caminho certo!</p>
          </div>

        </div>
      </div>

        <!-- ASSISTENTE IA (REMOVIDO) -->
        <div v-if="false" class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <button type="button" class="w-full flex items-center justify-between px-5 py-4 transition-colors" @click="openIA = !openIA">
            <div class="flex items-center gap-3.5">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style="background: linear-gradient(135deg, #6366f1, #8b5cf6)">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" /></svg>
              </div>
              <div class="text-left min-w-0">
                <p class="text-sm font-bold text-gray-800 leading-none">Assistente IA</p>
                <p class="text-[11px] text-gray-400 mt-0.5">Pergunte qualquer coisa — responde com dados reais do ERP</p>
              </div>
              <span class="hidden sm:inline-flex shrink-0 ml-1 text-[10px] font-bold px-2.5 py-1 rounded-full border bg-indigo-50 text-indigo-600 border-indigo-100">
                ● Online
              </span>
            </div>
            <div class="flex items-center gap-2 ml-4 shrink-0">
              <span class="text-[11px] text-gray-300 hidden sm:block">{{ openIA ? 'Recolher' : 'Perguntar' }}</span>
              <svg class="w-4 h-4 text-gray-400 transition-transform duration-300" :class="openIA ? 'rotate-180' : ''" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </div>
          </button>

        <!-- Conteúdo do chat -->
        <div v-show="openIA" class="border-t border-gray-100">

          <!-- Histórico de mensagens -->
          <div ref="chatContainer" class="px-5 py-4 flex flex-col gap-4 max-h-[520px] overflow-y-auto scroll-smooth bg-gray-50/50">

            <!-- Mensagem de boas-vindas da IA (sempre visível) -->
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center" style="background: linear-gradient(135deg, #6366f1, #8b5cf6)">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
              </div>
              <div class="flex-1 max-w-2xl">
                <div class="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl rounded-tl-sm px-4 py-3">
                  <p class="text-sm font-semibold text-indigo-900 mb-1">Assistente IA do seu negócio</p>
                  <p class="text-sm text-gray-600 leading-relaxed">
                    Olá! Estou analisando os dados reais do seu ERP em tempo real. Pode me perguntar sobre lucro, clientes, estoque, despesas, vendas e muito mais. Como posso ajudar?
                  </p>
                </div>
                <p class="text-[10px] text-gray-400 mt-1 ml-1">Agora</p>
              </div>
            </div>

            <!-- Histórico de conversa -->
            <template v-for="(msg, idx) in chatHistory" :key="idx">

              <!-- Pergunta do usuário -->
              <div class="flex items-start gap-3 justify-end">
                <div class="max-w-sm sm:max-w-lg">
                  <div class="bg-gray-900 rounded-2xl rounded-tr-sm px-4 py-3">
                    <p class="text-sm text-white leading-relaxed">{{ msg.pergunta }}</p>
                  </div>
                  <p class="text-[10px] text-gray-400 mt-1 mr-1 text-right">Você</p>
                </div>
                <div class="w-8 h-8 rounded-xl bg-gray-200 shrink-0 flex items-center justify-center">
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                </div>
              </div>

              <!-- Resposta da IA -->
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center" style="background: linear-gradient(135deg, #6366f1, #8b5cf6)">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                  </svg>
                </div>
                <div class="flex-1 max-w-2xl">
                  <div class="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl rounded-tl-sm px-4 py-3">
                    <p class="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{{ msg.resposta }}</p>
                  </div>
                  <p class="text-[10px] text-gray-400 mt-1 ml-1">Assistente IA</p>
                </div>
              </div>

            </template>

            <!-- Digitando... -->
            <div v-if="iaDigitando" class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center" style="background: linear-gradient(135deg, #6366f1, #8b5cf6)">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
              </div>
              <div class="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl rounded-tl-sm px-4 py-3">
                <div class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style="animation-delay: 0ms"></span>
                  <span class="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style="animation-delay: 150ms"></span>
                  <span class="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style="animation-delay: 300ms"></span>
                </div>
              </div>
            </div>

          </div>

          <!-- Sugestões rápidas -->
          <div class="px-5 py-3 border-t border-gray-50">
            <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Perguntas sugeridas</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="sugestao in sugestoesPergunta"
                :key="sugestao"
                type="button"
                class="text-xs font-semibold px-3 py-1.5 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                @click="usarSugestao(sugestao)"
              >
                {{ sugestao }}
              </button>
            </div>
          </div>

          <!-- Input de pergunta -->
          <div class="px-5 pb-5 pt-3 border-t border-gray-100">
            <div class="flex gap-3 items-end">
              <div class="flex-1 relative">
                <textarea
                  v-model="perguntaUsuario"
                  rows="1"
                  placeholder="Ex: Como aumentar meu lucro este mês?"
                  class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 resize-none transition-all leading-relaxed"
                  style="min-height: 48px; max-height: 120px;"
                  @keydown.enter.prevent="enviarPergunta"
                  @input="autoResize"
                ></textarea>
              </div>
              <button
                type="button"
                :disabled="!perguntaUsuario.trim() || iaDigitando"
                class="flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                style="background: linear-gradient(135deg, #6366f1, #8b5cf6)"
                @click="enviarPergunta"
              >
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
            <p class="text-[10px] text-gray-400 mt-2">Pressione Enter para enviar · Respostas baseadas nos dados reais do seu ERP</p>
          </div>
        </div>
      </div>

      </div><!-- /space-y-4 -->

    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { createSupabaseClient } from '~/lib/supabase'
import { useEmpresa } from '~/composables/useEmpresa'

defineOptions({ name: 'ConsultorPage' })

const supabase = createSupabaseClient()
const { empresaId, loadEmpresa } = useEmpresa()
const { formatCurrency } = useLocale()
const loading = ref(true)

// ── accordion state ───────────────────────────────────────────
const openFinanceiro    = ref(false)
const openVendas        = ref(false)
const openClientes      = ref(false)
const openEstoque       = ref(false)
const openProducao     = ref(false)
const openOportunidades = ref(false)
const openPlanoAcao     = ref(false)
const openIA            = ref(false)

// ── dados brutos ──────────────────────────────────────────────
const agendamentos = ref<any[]>([])
const contasPagar  = ref<any[]>([])
const clientes     = ref<any[]>([])
const agendTodos   = ref<any[]>([])   // todos agendamentos (para análise de clientes)
const produtos     = ref<any[]>([])   // produtos_casa_racao
const orcamentos   = ref<any[]>([])   // orcamentos_adesivo
const ordensServico = ref<any[]>([])  // ordens_servico_adesivo
const processos    = ref<any[]>([])   // processos_instancia

// Clientes contatados — persiste no localStorage
const clientesContatados = ref<Set<number>>(new Set())

function carregarContatados() {
  try {
    const saved = localStorage.getItem('consultor_clientes_contatados')
    if (saved) clientesContatados.value = new Set(JSON.parse(saved))
  } catch {}
}

function salvarContatados() {
  try {
    localStorage.setItem('consultor_clientes_contatados', JSON.stringify([...clientesContatados.value]))
  } catch {}
}

// ── helpers ───────────────────────────────────────────────────
function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1) }
function endOfMonth(d: Date)   { return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59) }
function startOfPrevMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth() - 1, 1) }
function endOfPrevMonth(d: Date)   { return new Date(d.getFullYear(), d.getMonth(), 0, 23, 59, 59) }

// ── fetch ─────────────────────────────────────────────────────
async function fetchAll() {
  loading.value = true
  await loadEmpresa()
  if (!empresaId.value) { loading.value = false; return }

  const now   = new Date()
  const mIni  = startOfMonth(now).toISOString()
  const mFim  = endOfMonth(now).toISOString()
  const pmIni = startOfPrevMonth(now).toISOString()
  const pmFim = endOfPrevMonth(now).toISOString()

  const [
    { data: agMes },
    { data: agPrev },
    { data: contas },
    { data: clientesData },
    { data: agHistorico },
    { data: produtosData },
    { data: orcamentosData },
    { data: osData },
    { data: processosData },
    { data: materiaisData },
    { data: catalogoData },
  ] = await Promise.all([
    supabase
      .from('agendamentos')
      .select('id, valor_total, status, data_hora, cliente_id')
      .eq('empresa_id', empresaId.value)
      .gte('data_hora', mIni)
      .lte('data_hora', mFim),
    supabase
      .from('agendamentos')
      .select('id, valor_total, status, data_hora')
      .eq('empresa_id', empresaId.value)
      .gte('data_hora', pmIni)
      .lte('data_hora', pmFim),
    supabase
      .from('contas_pagar')
      .select('id, valor, status, data_vencimento, data_pagamento, descricao, tipo')
      .eq('empresa_id', empresaId.value),
    supabase
      .from('clientes')
      .select('id, nome, telefone, ativo, created_at')
      .eq('empresa_id', empresaId.value),
    supabase
      .from('agendamentos')
      .select('id, cliente_id, valor_total, status, data_hora')
      .eq('empresa_id', empresaId.value)
      .eq('status', 'concluido')
      .order('data_hora', { ascending: false }),
    supabase
      .from('produtos_casa_racao')
      .select('id, nome, preco, estoque, ativo, created_at')
      .eq('empresa_id', empresaId.value),
    supabase
      .from('orcamentos_adesivo')
      .select('id, status, valor_total, created_at, data_validade')
      .eq('empresa_id', empresaId.value)
      .order('created_at', { ascending: false })
      .limit(100),
    supabase
      .from('ordens_servico_adesivo')
      .select('id, status, valor_total, data_aprovacao, data_entrega')
      .eq('empresa_id', empresaId.value)
      .order('data_aprovacao', { ascending: false })
      .limit(100),
    supabase
      .from('processos_instancia')
      .select('id, status, progresso, data_prazo, titulo')
      .eq('empresa_id', empresaId.value),
    supabase
      .from('materiais_adesivo')
      .select('id, nome, estoque_atual, estoque_minimo, preco_m2, ativo')
      .eq('empresa_id', empresaId.value),
    supabase
      .from('catalogo_adesivos')
      .select('id, nome, preco_venda, ativo, created_at')
      .eq('empresa_id', empresaId.value),
  ])

  agendamentos.value = [
    ...(agMes ?? []),
    ...((agPrev ?? []).map(a => ({ ...a, _prev: true }))),
  ]
  contasPagar.value = contas ?? []
  clientes.value    = clientesData ?? []
  agendTodos.value  = agHistorico ?? []
  produtos.value    = produtosData ?? []
  orcamentos.value  = orcamentosData ?? []
  ordensServico.value = osData ?? []
  processos.value   = processosData ?? []

  // Merge materiais into produtos for estoque analysis (if produtos is empty)
  if (produtos.value.length === 0 && (materiaisData ?? []).length > 0) {
    produtos.value = (materiaisData ?? []).map((m: any) => ({
      id: m.id,
      nome: m.nome,
      preco: m.preco_m2 ?? 0,
      estoque: m.estoque_atual ?? 0,
      ativo: m.ativo,
      created_at: null,
    }))
  }
  // Also merge catalogo if available and produtos still empty
  if (produtos.value.length === 0 && (catalogoData ?? []).length > 0) {
    produtos.value = (catalogoData ?? []).map((c: any) => ({
      id: c.id,
      nome: c.nome,
      preco: c.preco_venda ?? 0,
      estoque: 0,
      ativo: c.ativo,
      created_at: c.created_at,
    }))
  }

  loading.value = false
}

onMounted(() => {
  carregarContatados()
  fetchAll()
})

// ── métricas financeiras ──────────────────────────────────────
const fin = computed(() => {
  const now  = new Date()
  const mIni = startOfMonth(now)
  const mFim = endOfMonth(now)

  const agMes  = agendamentos.value.filter(a => !a._prev && new Date(a.data_hora) >= mIni && new Date(a.data_hora) <= mFim && a.status === 'concluido')
  const agPrev = agendamentos.value.filter(a => a._prev && a.status === 'concluido')

  const receitaMes  = agMes.reduce((s, a) => s + (Number(a.valor_total) || 0), 0)
  const receitaPrev = agPrev.reduce((s, a) => s + (Number(a.valor_total) || 0), 0)
  const crescimentoMoM = receitaPrev > 0 ? ((receitaMes - receitaPrev) / receitaPrev) * 100 : 0
  const totalAtendimentos = agMes.length
  const ticketMedio = totalAtendimentos > 0 ? receitaMes / totalAtendimentos : 0

  const despesasMes = contasPagar.value
    .filter(c => { const d = new Date(c.data_vencimento + 'T00:00:00'); return d >= mIni && d <= mFim && c.status !== 'cancelado' })
    .reduce((s, c) => s + Number(c.valor), 0)

  const despesasPagas = contasPagar.value
    .filter(c => { if (c.status !== 'pago' || !c.data_pagamento) return false; const d = new Date(c.data_pagamento + 'T00:00:00'); return d >= mIni && d <= mFim })
    .reduce((s, c) => s + Number(c.valor), 0)

  const today = new Date(); today.setHours(0, 0, 0, 0)
  const contasVencidas = contasPagar.value.filter(c => { const d = new Date(c.data_vencimento + 'T00:00:00'); return d < today && c.status === 'pendente' })
  const inadimplencia  = contasVencidas.reduce((s, c) => s + Number(c.valor), 0)

  const lucro       = receitaMes - despesasMes
  const margem      = receitaMes > 0 ? (lucro / receitaMes) * 100 : 0
  const propDespesas = receitaMes > 0 ? (despesasMes / receitaMes) * 100 : 0
  const fluxoCaixa  = receitaMes - despesasPagas

  return { receitaMes, receitaPrev, crescimentoMoM, despesasMes, despesasPagas, lucro, margem, propDespesas, ticketMedio, totalAtendimentos, inadimplencia, qtdVencidas: contasVencidas.length, fluxoCaixa }
})

// ── métricas de clientes ──────────────────────────────────────
const cli = computed(() => {
  const total  = clientes.value.length
  const hoje   = new Date(); hoje.setHours(0, 0, 0, 0)
  const d30    = new Date(hoje); d30.setDate(d30.getDate() - 30)
  const d60    = new Date(hoje); d60.setDate(d60.getDate() - 60)
  const d90    = new Date(hoje); d90.setDate(d90.getDate() - 90)

  // Último agendamento por cliente
  const ultimoPorCliente = new Map<number, { data: Date; total: number; visitas: number }>()
  for (const ag of agendTodos.value) {
    if (!ag.cliente_id) continue
    const d = new Date(ag.data_hora)
    const atual = ultimoPorCliente.get(ag.cliente_id)
    if (!atual || d > atual.data) {
      ultimoPorCliente.set(ag.cliente_id, {
        data: d,
        total: (atual?.total ?? 0) + (Number(ag.valor_total) || 0),
        visitas: (atual?.visitas ?? 0) + 1,
      })
    } else {
      atual.total   += Number(ag.valor_total) || 0
      atual.visitas += 1
    }
  }

  // Clientes ativos nos últimos 90 dias
  let ativos90       = 0
  let inativosMais30 = 0
  let inativosMais60 = 0
  let inativosMais90 = 0
  let totalGasto     = 0
  let clientesComHistorico = 0

  for (const cliente of clientes.value) {
    const hist = ultimoPorCliente.get(cliente.id)
    if (!hist) continue
    clientesComHistorico++
    totalGasto += hist.total
    if (hist.data >= d90) ativos90++
    if (hist.data < d30)  inativosMais30++
    if (hist.data < d60)  inativosMais60++
    if (hist.data < d90)  inativosMais90++
  }

  const ticketMedioCliente = clientesComHistorico > 0 ? totalGasto / clientesComHistorico : 0

  // Frequência média e valor real por visita dos clientes ativos (últimos 90 dias)
  let somaVisitas = 0
  let qtdAtivos   = 0
  let somaValorAtivos = 0
  let somaVisitasAtivos = 0
  for (const [clienteId, hist] of ultimoPorCliente) {
    if (hist.data >= d90) {
      somaVisitas += hist.visitas
      qtdAtivos++
      somaValorAtivos += hist.total
      somaVisitasAtivos += hist.visitas
    }
  }
  const frequenciaMedia = qtdAtivos > 0 ? somaVisitas / qtdAtivos : 0
  // Valor real médio por visita dos clientes ativos (baseado em atendimentos reais)
  const valorPorVisitaAtivos = somaVisitasAtivos > 0 ? somaValorAtivos / somaVisitasAtivos : 0

  // Lista de clientes inativos +30 dias (com nome e telefone para WhatsApp)
  const listaInativos = clientes.value
    .filter(cliente => {
      const hist = ultimoPorCliente.get(cliente.id)
      return hist && hist.data < d30
    })
    .map(cliente => {
      const hist = ultimoPorCliente.get(cliente.id)!
      const diasInativo = Math.floor((hoje.getTime() - hist.data.getTime()) / (1000 * 60 * 60 * 24))
      // Valor médio por visita deste cliente (baseado no histórico real dele)
      const ticketIndividual = hist.visitas > 0 ? hist.total / hist.visitas : hist.total
      return { id: cliente.id, nome: cliente.nome, telefone: (cliente as any).telefone ?? null, diasInativo, totalGasto: hist.total, ticketIndividual }
    })
    .sort((a, b) => b.diasInativo - a.diasInativo)
    .slice(0, 20)

  // Potencial de recuperação = soma do ticket individual de cada cliente inativo
  // (quanto cada um gastava por visita, baseado no histórico real dele)
  const potencialRecuperacao = listaInativos.reduce((soma, c) => soma + c.ticketIndividual, 0)

  // Top 5 clientes por receita total
  const topClientes = clientes.value
    .map(c => {
      const h = ultimoPorCliente.get(c.id)
      return { cliente_id: c.id, nome: c.nome, total: h?.total ?? 0, visitas: h?.visitas ?? 0 }
    })
    .filter(c => c.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)

  return { total, ativos90, inativosMais30, inativosMais60, inativosMais90, ticketMedioCliente, valorPorVisitaAtivos, frequenciaMedia, potencialRecuperacao, topClientes, listaInativos }
})

// ── diagnósticos financeiros ──────────────────────────────────
const diagnosticosFinanceiros = computed(() => {
  const f    = fin.value
  const list: any[] = []

  if (f.receitaMes > 0 && f.propDespesas > 70) {
    const reducao10 = f.despesasMes * 0.1
    list.push({
      prioridade: f.propDespesas > 85 ? 'Alta' : 'Média',
      categoria: 'Despesas',
      diagnostico: `Suas despesas representam ${f.propDespesas.toFixed(0)}% da receita — acima do recomendado de 70%. Isso comprime sua margem de lucro.`,
      impacto: `Se reduzir as despesas em 10%, seu lucro aumentará aproximadamente ${formatCurrency(reducao10)} por mês.`,
      valorImpacto: reducao10,
      acoes: ['Revisar contratos com fornecedores e renegociar valores.', 'Identificar despesas fixas que podem ser cortadas.', 'Reduzir gastos administrativos supérfluos.'],
    })
  }
  if (f.crescimentoMoM < -5) {
    list.push({
      prioridade: f.crescimentoMoM < -15 ? 'Alta' : 'Média',
      categoria: 'Receita',
      diagnostico: `Seu faturamento caiu ${Math.abs(f.crescimentoMoM).toFixed(1)}% em relação ao mês anterior. Tendência de queda que precisa ser revertida.`,
      impacto: `Se recuperar o nível do mês passado, você ganharia mais ${formatCurrency(f.receitaPrev - f.receitaMes)} por mês.`,
      valorImpacto: f.receitaPrev - f.receitaMes > 0 ? f.receitaPrev - f.receitaMes : 0,
      acoes: ['Realizar campanha de reativação de clientes inativos.', 'Aumentar a oferta de serviços complementares (upsell).', 'Criar promoções para estimular novas vendas.'],
    })
  }
  if (f.receitaMes > 0 && f.margem < 15 && f.margem >= 0) {
    list.push({
      prioridade: f.margem < 5 ? 'Alta' : 'Média',
      categoria: 'Margem de Lucro',
      diagnostico: `Sua margem de lucro está em ${f.margem.toFixed(1)}% — abaixo do mínimo saudável de 15%. O negócio opera com folga financeira muito pequena.`,
      impacto: `Para atingir 15% de margem, você precisaria aumentar receita ou reduzir despesas em ${formatCurrency(f.receitaMes * 0.15 - f.lucro)}.`,
      valorImpacto: null,
      acoes: ['Revisar o preço dos serviços mais procurados.', 'Reduzir despesas com menor impacto na operação.', 'Eliminar serviços com custo alto e baixo retorno.'],
    })
  }
  if (f.lucro < 0) {
    list.push({
      prioridade: 'Alta',
      categoria: 'Resultado Negativo',
      diagnostico: `Sua empresa está operando no prejuízo este mês: ${formatCurrency(Math.abs(f.lucro))} negativos. As despesas superam a receita.`,
      impacto: `Cada mês no prejuízo consome o caixa. A continuidade coloca a saúde financeira em risco.`,
      valorImpacto: null,
      acoes: ['Cortar imediatamente despesas não essenciais.', 'Intensificar vendas e atendimentos neste mês.', 'Avaliar se algum serviço opera no negativo.'],
    })
  }
  if (f.inadimplencia > 0) {
    const percInad = f.receitaMes > 0 ? (f.inadimplencia / f.receitaMes) * 100 : 100
    list.push({
      prioridade: percInad > 20 ? 'Alta' : 'Média',
      categoria: 'Inadimplência',
      diagnostico: `Você possui ${f.qtdVencidas} conta(s) vencida(s) totalizando ${formatCurrency(f.inadimplencia)} em aberto. Isso representa ${percInad.toFixed(0)}% da sua receita mensal.`,
      impacto: `Quitar ou renegociar essas contas evita juros e multas adicionais.`,
      valorImpacto: null,
      acoes: ['Listar e priorizar as contas vencidas por valor.', 'Contatar fornecedores para renegociar prazos.', 'Reservar parte da receita dos próximos dias para quitação.'],
    })
  }
  if (f.ticketMedio > 0 && f.ticketMedio < 80) {
    list.push({
      prioridade: 'Baixa',
      categoria: 'Ticket Médio',
      diagnostico: `Seu ticket médio está em ${formatCurrency(f.ticketMedio)} — considerado baixo. Aumentar o valor por atendimento é uma das formas mais rápidas de crescer.`,
      impacto: `Se aumentar o ticket em R$ 20 com ${f.totalAtendimentos} atendimentos, você ganharia mais ${formatCurrency(20 * f.totalAtendimentos)} por mês.`,
      valorImpacto: 20 * f.totalAtendimentos,
      acoes: ['Criar combos de serviços com valor diferenciado.', 'Treinar a equipe para oferecer serviços complementares.', 'Revisar a tabela de preços onde há margem.'],
    })
  }
  if (f.fluxoCaixa < 0) {
    list.push({
      prioridade: 'Alta',
      categoria: 'Fluxo de Caixa',
      diagnostico: `Seu fluxo de caixa está negativo em ${formatCurrency(Math.abs(f.fluxoCaixa))} este mês. Saiu mais dinheiro do que entrou.`,
      impacto: `Fluxo negativo reduz o capital de giro e pode impedir pagamentos futuros.`,
      valorImpacto: null,
      acoes: ['Antecipar recebíveis ou negociar pagamentos antecipados.', 'Postergar pagamentos não urgentes para o próximo mês.', 'Evitar novas despesas até o caixa se recuperar.'],
    })
  }
  if (f.receitaMes === 0 && f.totalAtendimentos === 0) {
    list.push({
      prioridade: 'Alta',
      categoria: 'Sem Receita',
      diagnostico: `Nenhuma receita registrada neste mês. Verifique se os agendamentos estão sendo marcados como "concluído".`,
      impacto: `Sem dados de receita não é possível gerar análises precisas.`,
      valorImpacto: null,
      acoes: ['Conferir se agendamentos do mês foram concluídos.', 'Registrar todas as receitas no módulo financeiro.', 'Verificar se o período está correto no sistema.'],
    })
  }

  const ordem: Record<string, number> = { Alta: 0, Média: 1, Baixa: 2 }
  return list.sort((a, b) => ordem[a.prioridade] - ordem[b.prioridade])
})

// ── métricas de estoque ───────────────────────────────────────
const est = computed(() => {
  const lista = produtos.value
  if (lista.length === 0) {
    return {
      total: 0, valorTotal: 0, parados90: 0, valorParados90: 0,
      rupturaIminente: 0, capitalCurvaC: 0, alertasTotal: 0,
      curvaABC: [] as any[], listaProdutosParados: [] as any[], listaProdutosRuptura: [] as any[],
    }
  }

  const hoje = new Date(); hoje.setHours(0, 0, 0, 0)
  const d90  = new Date(hoje); d90.setDate(d90.getDate() - 90)

  const total      = lista.length
  const valorTotal = lista.reduce((s, p) => s + (Number(p.preco) || 0) * (Number(p.estoque) || 0), 0)

  // Produtos parados: cadastrados há mais de 90 dias E estoque > 0
  // (sem histórico de venda no sistema — usamos created_at como proxy)
  const listaProdutosParados = lista.filter(p => {
    const criado = new Date(p.created_at)
    return criado <= d90 && (Number(p.estoque) || 0) > 0
  })
  const parados90      = listaProdutosParados.length
  const valorParados90 = listaProdutosParados.reduce((s, p) => s + (Number(p.preco) || 0) * (Number(p.estoque) || 0), 0)

  // Ruptura iminente: estoque ≤ 3 e produto ativo
  const listaProdutosRuptura = lista
    .filter(p => p.ativo && (Number(p.estoque) || 0) <= 3)
    .sort((a, b) => (Number(a.estoque) || 0) - (Number(b.estoque) || 0))
  const rupturaIminente = listaProdutosRuptura.length

  // Curva ABC por valor de estoque
  const produtosOrdenados = [...lista]
    .map(p => ({ ...p, valorEstoque: (Number(p.preco) || 0) * (Number(p.estoque) || 0) }))
    .sort((a, b) => b.valorEstoque - a.valorEstoque)

  let acumulado    = 0
  const curvaABC   = produtosOrdenados.map(p => {
    acumulado += p.valorEstoque
    const pct  = valorTotal > 0 ? (acumulado / valorTotal) * 100 : 0
    return { ...p, curva: pct <= 70 ? 'A' : pct <= 90 ? 'B' : 'C' }
  })

  const capitalCurvaC = curvaABC.filter(p => p.curva === 'C').reduce((s, p) => s + p.valorEstoque, 0)

  const alertasTotal = (parados90 > 0 ? 1 : 0) + (rupturaIminente > 0 ? 1 : 0) + (capitalCurvaC > valorTotal * 0.2 ? 1 : 0)

  return {
    total, valorTotal, parados90, valorParados90, rupturaIminente,
    capitalCurvaC, alertasTotal, curvaABC,
    listaProdutosParados: listaProdutosParados.slice(0, 10),
    listaProdutosRuptura,
  }
})

// ── central de oportunidades ──────────────────────────────────
const oportunidades = computed(() => {
  const f   = fin.value
  const c   = cli.value
  const e   = est.value
  const ops: any[] = []

  // 1. Recuperar clientes inativos
  if (c.potencialRecuperacao > 0) {
    ops.push({
      id: 'clientes-inativos',
      titulo: 'Recuperar clientes inativos',
      descricao: `${c.inativosMais30} cliente${c.inativosMais30 > 1 ? 's' : ''} não retorna${c.inativosMais30 > 1 ? 'm' : ''} há mais de 30 dias. Campanha de retorno pode reativar a base.`,
      categoria: 'Clientes',
      prazo: 'Esta semana',
      valor: Math.round(c.potencialRecuperacao),
      cor: '#3b82f6',
      acoes: ['Enviar cupom de retorno', 'WhatsApp personalizado', 'Oferta exclusiva por tempo limitado'],
    })
  }

  // 2. Reduzir despesas operacionais
  if (f.receitaMes > 0 && f.propDespesas > 70) {
    const ganho = Math.round(f.despesasMes * 0.1)
    ops.push({
      id: 'reduzir-despesas',
      titulo: 'Reduzir despesas operacionais',
      descricao: `Suas despesas estão em ${f.propDespesas.toFixed(0)}% da receita. Reduzir apenas 10% libera ${formatCurrency(ganho)} por mês direto no lucro.`,
      categoria: 'Financeiro',
      prazo: 'Este mês',
      valor: ganho,
      cor: '#10b981',
      acoes: ['Revisar fornecedores', 'Renegociar contratos', 'Cortar gastos fixos'],
    })
  }

  // 3. Aumentar ticket médio
  if (f.ticketMedio > 0) {
    const aumento = f.ticketMedio * 0.2
    const ganho   = Math.round(aumento * f.totalAtendimentos)
    if (ganho > 0) {
      ops.push({
        id: 'ticket-medio',
        titulo: 'Aumentar ticket médio em 20%',
        descricao: `Com ${f.totalAtendimentos} atendimentos no mês, aumentar o ticket em ${formatCurrency(aumento)} gera ${formatCurrency(ganho)} adicionais sem precisar de novos clientes.`,
        categoria: 'Comercial',
        prazo: 'Este mês',
        valor: ganho,
        cor: '#8b5cf6',
        acoes: ['Criar combos de serviços', 'Treinamento da equipe', 'Upsell no atendimento'],
      })
    }
  }

  // 4. Liquidar estoque parado
  if (e.valorParados90 > 0) {
    const ganho = Math.round(e.valorParados90 * 0.7)
    ops.push({
      id: 'estoque-parado',
      titulo: 'Liquidar estoque parado',
      descricao: `${e.parados90} produto${e.parados90 > 1 ? 's' : ''} sem venda há mais de 90 dias representam ${formatCurrency(e.valorParados90)} imobilizados. Queima rápida converte em caixa.`,
      categoria: 'Estoque',
      prazo: 'Esta semana',
      valor: ganho,
      cor: '#f59e0b',
      acoes: ['Promoção de 30–40% off', 'Combo com produtos populares', 'Divulgação nas redes sociais'],
    })
  }

  // 5. Aumentar frequência dos clientes ativos
  if (c.ativos90 > 0 && c.frequenciaMedia < 2) {
    const ganho = Math.round(c.ativos90 * c.valorPorVisitaAtivos)
    if (ganho > 0) {
      ops.push({
        id: 'frequencia-clientes',
        titulo: 'Aumentar retorno dos clientes ativos',
        descricao: `Clientes ativos visitam em média ${c.frequenciaMedia.toFixed(1)}x por trimestre. Aumentar para 2x por cliente pode gerar ${formatCurrency(ganho)} mensais extras.`,
        categoria: 'Retenção',
        prazo: 'Este mês',
        valor: ganho,
        cor: 'var(--color-primary)',
        acoes: ['Lembretes automáticos', 'Pacote mensal com desconto', 'Programa de fidelidade'],
      })
    }
  }

  // 6. Quitar inadimplência
  if (f.inadimplencia > 0) {
    ops.push({
      id: 'inadimplencia',
      titulo: 'Quitar contas em atraso',
      descricao: `${f.qtdVencidas} conta${f.qtdVencidas > 1 ? 's' : ''} vencida${f.qtdVencidas > 1 ? 's' : ''} somam ${formatCurrency(f.inadimplencia)}. Regularizar evita juros que aumentam ainda mais o passivo.`,
      categoria: 'Financeiro',
      prazo: 'Urgente',
      valor: Math.round(f.inadimplencia * 0.15), // economia de juros estimada
      cor: '#ef4444',
      acoes: ['Negociar parcelamento', 'Priorizar pelo vencimento', 'Reservar % da receita diária'],
    })
  }

  // 7. Recuperar crescimento perdido
  if (f.crescimentoMoM < -5 && f.receitaPrev > 0) {
    const diff = Math.round(f.receitaPrev - f.receitaMes)
    if (diff > 0) {
      ops.push({
        id: 'crescimento',
        titulo: 'Recuperar queda de faturamento',
        descricao: `Faturamento caiu ${Math.abs(f.crescimentoMoM).toFixed(1)}% vs. mês anterior. Retornar ao nível anterior representa ${formatCurrency(diff)} a mais por mês.`,
        categoria: 'Comercial',
        prazo: 'Este mês',
        valor: diff,
        cor: '#06b6d4',
        acoes: ['Campanha de vendas', 'Promoção por tempo limitado', 'Reativar clientes antigos'],
      })
    }
  }

  // Ordena por valor decrescente (maior potencial primeiro)
  return ops.sort((a, b) => b.valor - a.valor)
})

const totalImpacto = computed(() =>
  oportunidades.value.reduce((s, op) => s + op.valor, 0)
)

// ── score geral da empresa ────────────────────────────────────
const scoreGeral = computed(() => {
  const f = fin.value
  const c = cli.value
  const e = est.value

  // ── Score Financeiro (0-100) ──────────────────────────────
  // Penaliza: margem baixa, despesas altas, prejuízo, fluxo negativo, inadimplência
  let scoreFinanceiro = 100
  if (f.receitaMes === 0)                        scoreFinanceiro -= 50
  if (f.lucro < 0)                               scoreFinanceiro -= 30
  if (f.propDespesas > 85)                       scoreFinanceiro -= 25
  else if (f.propDespesas > 70)                  scoreFinanceiro -= 15
  if (f.margem < 5 && f.receitaMes > 0)          scoreFinanceiro -= 20
  else if (f.margem < 15 && f.receitaMes > 0)    scoreFinanceiro -= 10
  if (f.fluxoCaixa < 0)                          scoreFinanceiro -= 15
  if (f.inadimplencia > 0) {
    const pct = f.receitaMes > 0 ? (f.inadimplencia / f.receitaMes) * 100 : 100
    if (pct > 30)      scoreFinanceiro -= 15
    else if (pct > 10) scoreFinanceiro -= 8
  }
  scoreFinanceiro = Math.max(0, Math.min(100, scoreFinanceiro))

  // ── Score Vendas (0-100) ──────────────────────────────────
  // Baseado em crescimento MoM, ticket médio e volume de atendimentos
  let scoreVendas = 70
  if (f.crescimentoMoM >= 10)        scoreVendas += 20
  else if (f.crescimentoMoM >= 0)    scoreVendas += 10
  else if (f.crescimentoMoM >= -5)   scoreVendas -= 5
  else if (f.crescimentoMoM >= -15)  scoreVendas -= 15
  else                               scoreVendas -= 25
  if (f.ticketMedio >= 150)          scoreVendas += 15
  else if (f.ticketMedio >= 80)      scoreVendas += 5
  else if (f.ticketMedio > 0)        scoreVendas -= 10
  if (f.totalAtendimentos === 0)     scoreVendas -= 20
  scoreVendas = Math.max(0, Math.min(100, scoreVendas))

  // ── Score Clientes (0-100) ────────────────────────────────
  let scoreClientes = 80
  if (c.total === 0)                             scoreClientes = 0
  else {
    const pctInativos = c.total > 0 ? (c.inativosMais60 / c.total) * 100 : 0
    if (pctInativos > 50)      scoreClientes -= 30
    else if (pctInativos > 25) scoreClientes -= 15
    else if (pctInativos > 10) scoreClientes -= 8
    if (c.frequenciaMedia < 1)      scoreClientes -= 15
    else if (c.frequenciaMedia < 2) scoreClientes -= 8
    if (c.total < 10)               scoreClientes -= 15
    else if (c.total < 30)          scoreClientes -= 5
  }
  scoreClientes = Math.max(0, Math.min(100, scoreClientes))

  // ── Score Operação (0-100) ────────────────────────────────
  // Baseado em agendamentos do mês + taxa de conclusão
  const agMesTodos = agendamentos.value.filter(a => !a._prev)
  const agTotal    = agMesTodos.length
  const agConc     = agMesTodos.filter(a => a.status === 'concluido').length
  const agCancel   = agMesTodos.filter(a => a.status === 'cancelado' || a.status === 'faltou').length
  let scoreOperacao = 80
  if (agTotal === 0)                         scoreOperacao = 40
  else {
    const taxaCancelamento = (agCancel / agTotal) * 100
    if (taxaCancelamento > 20) scoreOperacao -= 25
    else if (taxaCancelamento > 10) scoreOperacao -= 12
    else if (taxaCancelamento > 5)  scoreOperacao -= 5
    const taxaConclusao = (agConc / agTotal) * 100
    if (taxaConclusao >= 80) scoreOperacao += 15
    else if (taxaConclusao >= 60) scoreOperacao += 5
    else scoreOperacao -= 10
  }
  scoreOperacao = Math.max(0, Math.min(100, scoreOperacao))

  // ── Score Estoque (0-100) ─────────────────────────────────
  let scoreEstoque = 85
  if (e.total === 0) {
    scoreEstoque = 50 // sem dados
  } else {
    if (e.rupturaIminente > 0) {
      const pctRuptura = (e.rupturaIminente / e.total) * 100
      if (pctRuptura > 20)      scoreEstoque -= 25
      else if (pctRuptura > 10) scoreEstoque -= 15
      else                      scoreEstoque -= 8
    }
    if (e.parados90 > 0) {
      const pctParados = (e.parados90 / e.total) * 100
      if (pctParados > 50)      scoreEstoque -= 25
      else if (pctParados > 25) scoreEstoque -= 15
      else if (pctParados > 10) scoreEstoque -= 8
    }
    if (e.valorTotal > 0 && e.capitalCurvaC / e.valorTotal > 0.4) scoreEstoque -= 10
  }
  scoreEstoque = Math.max(0, Math.min(100, scoreEstoque))

  // ── Score Produção (0-100) ────────────────────────────────
  // Baseado em orçamentos (conversão), OS (andamento), processos (progresso)
  let scoreProducao = 75
  const totalOrc = orcamentos.value.length
  const orcAprovados = orcamentos.value.filter((o: any) => o.status === 'aprovado').length
  const taxaConversaoOrc = totalOrc > 0 ? (orcAprovados / totalOrc) * 100 : 0
  if (taxaConversaoOrc >= 50) scoreProducao += 15
  else if (taxaConversaoOrc >= 30) scoreProducao += 5
  else if (taxaConversaoOrc < 15 && totalOrc > 3) scoreProducao -= 15

  const totalProcessos = processos.value.length
  const procConcluidos = processos.value.filter((p: any) => p.status === 'concluido').length
  const procAtrasados = processos.value.filter((p: any) => p.data_prazo && new Date(p.data_prazo) < new Date() && p.status !== 'concluido').length
  if (procAtrasados > 0) {
    const pctAtrasados = totalProcessos > 0 ? (procAtrasados / totalProcessos) * 100 : 0
    if (pctAtrasados > 30) scoreProducao -= 25
    else if (pctAtrasados > 15) scoreProducao -= 12
  }
  if (totalProcessos > 0 && procConcluidos > 0) {
    const taxaConclusaoProc = (procConcluidos / totalProcessos) * 100
    if (taxaConclusaoProc >= 70) scoreProducao += 10
  }
  scoreProducao = Math.max(0, Math.min(100, scoreProducao))

  // ── Saúde Geral: média ponderada ─────────────────────────
  // Financeiro 30% | Vendas 20% | Clientes 15% | Produção 20% | Operação 15%
  const geral = Math.round(
    scoreFinanceiro * 0.30 +
    scoreVendas     * 0.20 +
    scoreClientes   * 0.15 +
    scoreOperacao   * 0.15 +
    scoreProducao   * 0.20
  )

  const iconPaths: Record<string, string> = {
    Financeiro: 'M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    Vendas:     'M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941',
    Clientes:   'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z',
    Operação:   'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5',
    Produção:   'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6z',
  }

  return {
    geral,
    modulos: [
      { nome: 'Financeiro', score: scoreFinanceiro, iconPath: iconPaths.Financeiro },
      { nome: 'Vendas',     score: scoreVendas,     iconPath: iconPaths.Vendas     },
      { nome: 'Clientes',   score: scoreClientes,   iconPath: iconPaths.Clientes   },
      { nome: 'Produção',   score: scoreProducao,   iconPath: iconPaths.Produção   },
      { nome: 'Operação',   score: scoreOperacao,   iconPath: iconPaths.Operação   },
    ],
  }
})

// ── métricas de produção ──────────────────────────────────────
const prodMetrics = computed(() => {
  const totalOrc = orcamentos.value.length
  const aprovados = orcamentos.value.filter((o: any) => o.status === 'aprovado').length
  const taxaConversao = totalOrc > 0 ? Math.round((aprovados / totalOrc) * 100) : 0

  const totalProc = processos.value.length
  const procAndamento = processos.value.filter((p: any) => p.status === 'em_andamento').length
  const procConcluidos = processos.value.filter((p: any) => p.status === 'concluido').length
  const atrasados = processos.value.filter((p: any) => p.data_prazo && new Date(p.data_prazo) < new Date() && p.status !== 'concluido').length
  const naoAgendados = processos.value.filter((p: any) => !p.data_prazo && p.status !== 'concluido' && p.status !== 'cancelado').length
  const pendentes = processos.value.filter((p: any) => p.status === 'pendente').length

  const score = totalProc === 0 ? 50 :
    Math.min(100, Math.max(0, 80 + (atrasados > 0 ? -25 : 0) + (naoAgendados > 3 ? -15 : 0) + (procConcluidos > 0 ? 10 : 0)))

  const statusLabel = score >= 80 ? '✓ Saudável' : score >= 60 ? '⚠ Atenção' : '✗ Crítico'

  const dicas: { icon: string; texto: string }[] = []

  // Dicas sobre fila de produção
  if (naoAgendados > 0) dicas.push({ icon: '📋', texto: `${naoAgendados} processo(s) na fila sem data agendada. Distribua no kanban semanal.` })
  if (naoAgendados > 5) dicas.push({ icon: '🚨', texto: `Fila acumulada! ${naoAgendados} processos aguardando. Priorize os de maior urgência.` })
  if (atrasados > 0) dicas.push({ icon: '⏰', texto: `${atrasados} processo(s) atrasado(s). Verifique gargalos e redistribua a carga.` })
  if (procAndamento > 5) dicas.push({ icon: '🔥', texto: `${procAndamento} processos em andamento simultâneo. Atenção à capacidade da equipe.` })
  if (procConcluidos > 0 && totalProc > 0) {
    const pctConcluido = Math.round((procConcluidos / totalProc) * 100)
    dicas.push({ icon: '✅', texto: `${procConcluidos} de ${totalProc} processos concluídos (${pctConcluido}%).` })
  }
  if (pendentes > 0 && naoAgendados === 0) dicas.push({ icon: '⏳', texto: `${pendentes} processo(s) pendente(s) agendados — acompanhe no kanban.` })
  if (dicas.length === 0) dicas.push({ icon: '💡', texto: 'Cadastre processos e vincule aos produtos para análises automáticas.' })

  return { processosAndamento: procAndamento, atrasados, naoAgendados, concluidos: procConcluidos, score, statusLabel, dicas }
})

// ── plano de ação inteligente ─────────────────────────────────
const planoAcao = computed(() => {
  const f   = fin.value
  const c   = cli.value
  const e   = est.value
  const ops = oportunidades.value
  const tarefas: any[] = []

  // 1. Clientes inativos → urgente se muitos, semana se poucos
  if (c.inativosMais30 > 0) {
    tarefas.push({
      id: 'tarefa-clientes-inativos',
      titulo: `Entrar em contato com ${c.inativosMais30} cliente${c.inativosMais30 > 1 ? 's' : ''} inativo${c.inativosMais60 > 1 ? 's' : ''}`,
      modulo: 'Clientes',
      prioridade: c.inativosMais60 >= 10 ? 'Alta' : 'Média',
      semana: c.inativosMais60 >= 10 ? 'Urgente — Hoje' : 'Esta Semana',
      objetivo: `Reativar clientes que não compram há mais de 60 dias, oferecendo um motivo de retorno (cupom, promoção ou mensagem personalizada).`,
      impactoValor: Math.round(c.potencialRecuperacao),
      prazo: c.inativosMais60 >= 10 ? 'Iniciar hoje' : 'Nos próximos 3 dias',
      descricaoPrazo: 'Quanto mais rápido o contato, maior a taxa de reativação.',
    })
  }

  // 2. Despesas altas → renegociar fornecedores
  if (f.receitaMes > 0 && f.propDespesas > 70) {
    tarefas.push({
      id: 'tarefa-despesas',
      titulo: 'Revisar e renegociar despesas de fornecedores',
      modulo: 'Financeiro',
      prioridade: f.propDespesas > 85 ? 'Alta' : 'Média',
      semana: f.propDespesas > 85 ? 'Urgente — Hoje' : 'Esta Semana',
      objetivo: `Reduzir as despesas que estão em ${f.propDespesas.toFixed(0)}% da receita — acima do limite saudável de 70% — para ampliar a margem de lucro.`,
      impactoValor: Math.round(f.despesasMes * 0.1),
      prazo: 'Nos próximos 7 dias',
      descricaoPrazo: 'Levantar todos os contratos ativos e ligar para os principais fornecedores.',
    })
  }

  // 3. Estoque parado → promoção de queima
  if (e.parados90 > 0) {
    tarefas.push({
      id: 'tarefa-estoque',
      titulo: `Criar promoção de queima para ${e.parados90} produto${e.parados90 > 1 ? 's' : ''} parado${e.parados90 > 1 ? 's' : ''}`,
      modulo: 'Estoque',
      prioridade: 'Média',
      semana: 'Esta Semana',
      objetivo: `Liquidar produtos sem giro há mais de 90 dias, convertendo ${formatCurrency(e.valorParados90)} em capital parado de volta ao caixa.`,
      impactoValor: Math.round(e.valorParados90 * 0.7),
      prazo: 'Esta semana',
      descricaoPrazo: 'Definir desconto de 20–40% e divulgar nas redes sociais e para clientes frequentes.',
    })
  }

  // 4. Ticket médio baixo → treinar equipe
  if (f.ticketMedio > 0 && f.ticketMedio < 80) {
    tarefas.push({
      id: 'tarefa-ticket',
      titulo: 'Treinar equipe para aumentar ticket médio',
      modulo: 'Comercial',
      prioridade: 'Média',
      semana: 'Esta Semana',
      objetivo: `Capacitar a equipe para oferecer serviços complementares e combos, visando aumentar o ticket médio atual de ${formatCurrency(f.ticketMedio)}.`,
      impactoValor: Math.round(20 * f.totalAtendimentos),
      prazo: 'Nos próximos 5 dias',
      descricaoPrazo: 'Realizar reunião de alinhamento e criar script de oferta de serviços adicionais.',
    })
  }

  // 5. Ruptura iminente → repor estoque
  if (e.rupturaIminente > 0) {
    tarefas.push({
      id: 'tarefa-ruptura',
      titulo: `Fazer reposição imediata de ${e.rupturaIminente} produto${e.rupturaIminente > 1 ? 's' : ''} em falta`,
      modulo: 'Estoque',
      prioridade: 'Alta',
      semana: 'Urgente — Hoje',
      objetivo: `Evitar ruptura de estoque e perda de vendas nos itens com ≤ 3 unidades. Acionar fornecedor para entrega urgente.`,
      impactoValor: 0,
      prazo: 'Hoje',
      descricaoPrazo: 'Entrar em contato com fornecedor agora. Cada dia sem estoque é venda perdida.',
    })
  }

  // 6. Inadimplência → quitar contas
  if (f.inadimplencia > 0) {
    tarefas.push({
      id: 'tarefa-inadimplencia',
      titulo: `Regularizar ${f.qtdVencidas} conta${f.qtdVencidas > 1 ? 's' : ''} vencida${f.qtdVencidas > 1 ? 's' : ''}`,
      modulo: 'Financeiro',
      prioridade: 'Alta',
      semana: 'Urgente — Hoje',
      objetivo: `Quitar ou renegociar as contas vencidas que somam ${formatCurrency(f.inadimplencia)}, evitando juros, multas e restrições com fornecedores.`,
      impactoValor: Math.round(f.inadimplencia * 0.15),
      prazo: 'Nos próximos 2 dias',
      descricaoPrazo: 'Priorizar pela data de vencimento e ligar para fornecedores para negociar.',
    })
  }

  // 7. Queda de receita → campanha de vendas
  if (f.crescimentoMoM < -5) {
    tarefas.push({
      id: 'tarefa-receita',
      titulo: 'Lançar campanha para recuperar queda de faturamento',
      modulo: 'Comercial',
      prioridade: f.crescimentoMoM < -15 ? 'Alta' : 'Média',
      semana: f.crescimentoMoM < -15 ? 'Urgente — Hoje' : 'Esta Semana',
      objetivo: `Reverter a queda de ${Math.abs(f.crescimentoMoM).toFixed(1)}% no faturamento vs. mês anterior com ações comerciais ativas.`,
      impactoValor: Math.round(f.receitaPrev - f.receitaMes > 0 ? f.receitaPrev - f.receitaMes : 0),
      prazo: 'Nos próximos 3 dias',
      descricaoPrazo: 'Criar oferta por tempo limitado e comunicar para toda a base de clientes.',
    })
  }

  // 8. Frequência baixa → programa de retorno
  if (c.ativos90 > 0 && c.frequenciaMedia < 2) {
    tarefas.push({
      id: 'tarefa-frequencia',
      titulo: 'Implantar lembrete automático de retorno para clientes',
      modulo: 'Clientes',
      prioridade: 'Baixa',
      semana: 'Este Mês',
      objetivo: `Aumentar a frequência média de visitas (atual: ${c.frequenciaMedia.toFixed(1)}x/trimestre) criando um fluxo de comunicação pós-atendimento.`,
      impactoValor: Math.round(c.ativos90 * c.valorPorVisitaAtivos),
      prazo: 'Nos próximos 15 dias',
      descricaoPrazo: 'Configurar mensagem automática de WhatsApp 30 dias após cada atendimento.',
    })
  }

  // Ordena: Alta → Média → Baixa
  const ordemPrio: Record<string, number> = { Alta: 0, Média: 1, Baixa: 2 }
  return tarefas.sort((a, b) => ordemPrio[a.prioridade] - ordemPrio[b.prioridade])
})

// Agrupa por semana na ordem: Urgente → Esta Semana → Este Mês
const gruposPlano = computed(() => {
  const ordemSemana: Record<string, number> = { 'Urgente — Hoje': 0, 'Esta Semana': 1, 'Este Mês': 2 }
  const mapa = new Map<string, any[]>()
  for (const t of planoAcao.value) {
    if (!mapa.has(t.semana)) mapa.set(t.semana, [])
    mapa.get(t.semana)!.push(t)
  }
  return Array.from(mapa.entries())
    .map(([semana, tarefas]) => ({ semana, tarefas }))
    .sort((a, b) => (ordemSemana[a.semana] ?? 9) - (ordemSemana[b.semana] ?? 9))
})

// ── IA Conversacional ─────────────────────────────────────────
interface ChatMsg { pergunta: string; resposta: string }

const chatHistory    = ref<ChatMsg[]>([])
const perguntaUsuario = ref('')
const iaDigitando    = ref(false)
const chatContainer  = ref<HTMLElement | null>(null)

const sugestoesPergunta = [
  'Como aumentar meu lucro?',
  'Onde estou perdendo dinheiro?',
  'Quais clientes devo recuperar?',
  'Quais produtos devo promover?',
  'Como melhorar meu fluxo de caixa?',
  'O que fazer para vender mais este mês?',
]

function autoResize(e: Event) {
  const el = e.target as HTMLTextAreaElement
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 120) + 'px'
}

function enviarWhatsAppInativo(cliente: { id: number; nome: string; telefone: string | null; diasInativo: number }) {
  if (!cliente.telefone) return
  const numero = cliente.telefone.replace(/\D/g, '')
  const tel = numero.length <= 11 ? '55' + numero : numero
  const msg = encodeURIComponent(
    `Olá ${cliente.nome.split(' ')[0]}! 😊\n\nSentimos sua falta! Faz ${cliente.diasInativo} dias que não nos visitou.\n\nPreparamos algo especial para seu retorno — entre em contato para saber mais! 💜`
  )
  window.open(`https://wa.me/${tel}?text=${msg}`, '_blank')
  clientesContatados.value.add(cliente.id)
  salvarContatados()
}

function marcarComoEnviado(clienteId: number) {
  clientesContatados.value.add(clienteId)
  salvarContatados()
}

function desmarcarEnviado(clienteId: number) {
  clientesContatados.value.delete(clienteId)
  salvarContatados()
}

function limparTodosContatados() {
  clientesContatados.value.clear()
  salvarContatados()
}

function usarSugestao(sugestao: string) {
  perguntaUsuario.value = sugestao
  enviarPergunta()
}

async function scrollToBottom() {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

function gerarResposta(pergunta: string): string {
  const p    = pergunta.toLowerCase().trim()
  const f    = fin.value
  const c    = cli.value
  const e    = est.value
  const sc   = scoreGeral.value
  const ops  = oportunidades.value
  const fmt  = formatCurrency

  // ── Como aumentar meu lucro / lucro ──────────────────────
  if (p.includes('lucro') || p.includes('aumentar lucro') || p.includes('ganhar mais')) {
    const linhas = [`📊 Análise do seu lucro atual:`]
    linhas.push(`• Receita este mês: ${fmt(f.receitaMes)}`)
    linhas.push(`• Despesas: ${fmt(f.despesasMes)} (${f.propDespesas.toFixed(0)}% da receita)`)
    linhas.push(`• Lucro atual: ${fmt(f.lucro)} — margem de ${f.margem.toFixed(1)}%`)
    linhas.push('')
    if (f.lucro < 0) {
      linhas.push(`⚠️ Seu negócio está no prejuízo. Prioridade máxima: cortar despesas imediatamente.`)
    } else if (f.margem < 15) {
      linhas.push(`⚠️ Margem abaixo de 15%. Para melhorar, você tem 3 caminhos principais:`)
    } else {
      linhas.push(`✅ Margem razoável. Para crescer o lucro:`)
    }
    if (f.propDespesas > 70) linhas.push(`1. Reduzir despesas em 10% geraria +${fmt(f.despesasMes * 0.1)}/mês direto no lucro.`)
    if (f.ticketMedio > 0 && f.ticketMedio < 150) linhas.push(`2. Aumentar ticket médio em R$ 20 com ${f.totalAtendimentos} atendimentos = +${fmt(20 * f.totalAtendimentos)}/mês.`)
    if (c.inativosMais30 > 0) linhas.push(`3. Recuperar ${c.inativosMais30} clientes inativos pode gerar +${fmt(c.potencialRecuperacao)}/mês.`)
    if (e.parados90 > 0) linhas.push(`4. Liquidar ${e.parados90} produto(s) parado(s) libera ${fmt(e.valorParados90 * 0.7)} em caixa.`)
    const totalOps = ops.reduce((s, o) => s + o.valor, 0)
    if (totalOps > 0) linhas.push(`\n💡 Potencial total identificado: +${fmt(totalOps)}/mês executando todas as oportunidades.`)
    return linhas.join('\n')
  }

  // ── Onde estou perdendo dinheiro ─────────────────────────
  if (p.includes('perdendo') || p.includes('perda') || p.includes('vazamento') || p.includes('onde estou')) {
    const linhas = [`🔍 Pontos de perda identificados nos seus dados:`]
    let encontrou = false
    if (f.propDespesas > 70) {
      linhas.push(`\n💸 Despesas altas: ${f.propDespesas.toFixed(0)}% da receita vai para custos — acima do recomendado de 70%.`)
      linhas.push(`   → Revise contratos e fornecedores. Potencial de economia: ${fmt(f.despesasMes * 0.1)}/mês.`)
      encontrou = true
    }
    if (f.inadimplencia > 0) {
      linhas.push(`\n💳 Inadimplência: ${f.qtdVencidas} conta(s) vencida(s) = ${fmt(f.inadimplencia)} parados.`)
      linhas.push(`   → Regularizar evita juros e multas crescentes.`)
      encontrou = true
    }
    if (f.fluxoCaixa < 0) {
      linhas.push(`\n🔻 Fluxo de caixa negativo: saiu ${fmt(Math.abs(f.fluxoCaixa))} a mais do que entrou este mês.`)
      encontrou = true
    }
    if (e.valorParados90 > 0) {
      linhas.push(`\n📦 Capital imobilizado: ${fmt(e.valorParados90)} em ${e.parados90} produto(s) parado(s) há 90+ dias sem giro.`)
      encontrou = true
    }
    if (c.inativosMais30 > 0) {
      linhas.push(`\n👥 Clientes inativos: ${c.inativosMais30} cliente(s) não retornam há 30+ dias — ${fmt(c.potencialRecuperacao)} em receita potencial perdida.`)
      encontrou = true
    }
    if (!encontrou) linhas.push(`\n✅ Não identifiquei perdas significativas nos dados atuais. Continue monitorando!`)
    return linhas.join('\n')
  }

  // ── Quais clientes devo recuperar ────────────────────────
  if (p.includes('clientes') && (p.includes('recuperar') || p.includes('reativar') || p.includes('contatar') || p.includes('devo'))) {
    const linhas = [`👥 Análise da sua base de clientes:`]
    linhas.push(`• Total cadastrado: ${c.total} clientes`)
    linhas.push(`• Ativos (compraram nos últimos 90 dias): ${c.ativos90}`)
    linhas.push(`• Inativos há mais de 60 dias: ${c.inativosMais60}`)
    linhas.push(`• Inativos há mais de 90 dias: ${c.inativosMais90}`)
    linhas.push('')
    if (c.inativosMais30 > 0) {
      linhas.push(`🎯 Priorize os ${c.inativosMais30} clientes inativos há 30+ dias.`)
      linhas.push(`Valor médio por visita: ${fmt(c.valorPorVisitaAtivos)}`)
      linhas.push(`Potencial se todos voltarem: ${fmt(c.potencialRecuperacao)}/mês`)
      linhas.push('')
      linhas.push(`📣 Estratégia recomendada:`)
      linhas.push(`1. Enviar mensagem personalizada pelo WhatsApp com cupom de retorno.`)
      linhas.push(`2. Oferecer desconto exclusivo válido por 7 dias.`)
      linhas.push(`3. Mencionar o serviço que o cliente mais utilizou anteriormente.`)
    } else {
      linhas.push(`✅ Ótimo! Nenhum cliente importante inativo no momento.`)
    }
    return linhas.join('\n')
  }

  // ── Quais produtos devo promover ─────────────────────────
  if (p.includes('produto') || p.includes('promover') || p.includes('estoque') || p.includes('promoção')) {
    const linhas = [`📦 Análise do seu estoque:`]
    linhas.push(`• Total de produtos: ${e.total}`)
    linhas.push(`• Valor total em estoque: ${fmt(e.valorTotal)}`)
    linhas.push(`• Produtos parados 90+ dias: ${e.parados90} (${fmt(e.valorParados90)})`)
    linhas.push(`• Produtos com ruptura iminente (≤ 3 un.): ${e.rupturaIminente}`)
    linhas.push('')
    if (e.parados90 > 0) {
      linhas.push(`🏷️ Produtos para promover AGORA (parados há 90+ dias):`)
      linhas.push(`→ Crie promoção com 20–40% de desconto para girar o estoque.`)
      linhas.push(`→ Capital a recuperar (com 30% desconto): ${fmt(e.valorParados90 * 0.7)}`)
    }
    if (e.rupturaIminente > 0) {
      linhas.push(`\n⚠️ ${e.rupturaIminente} produto(s) precisam de REPOSIÇÃO IMEDIATA (≤ 3 unidades).`)
      linhas.push(`→ Acione fornecedor hoje para evitar perda de vendas.`)
    }
    const prodA = e.curvaABC.filter((p: any) => p.curva === 'A').length
    if (prodA > 0) linhas.push(`\n⭐ Foque a reposição nos ${prodA} produto(s) da Curva A — são os de maior valor no estoque.`)
    if (e.total === 0) return `Nenhum produto cadastrado no estoque. Adicione produtos no módulo Estoque para receber análises.`
    return linhas.join('\n')
  }

  // ── Fluxo de caixa ───────────────────────────────────────
  if (p.includes('fluxo') || p.includes('caixa') || p.includes('dinheiro') || p.includes('capital')) {
    const linhas = [`💰 Análise do fluxo de caixa:`]
    linhas.push(`• Receita este mês: ${fmt(f.receitaMes)}`)
    linhas.push(`• Despesas pagas: ${fmt(f.despesasPagas)}`)
    linhas.push(`• Fluxo de caixa: ${fmt(f.fluxoCaixa)} ${f.fluxoCaixa >= 0 ? '✅' : '⚠️'}`)
    linhas.push('')
    if (f.fluxoCaixa < 0) {
      linhas.push(`⚠️ Fluxo negativo! Saiu ${fmt(Math.abs(f.fluxoCaixa))} a mais do que entrou.`)
      linhas.push(`\n🛠️ Ações para melhorar:`)
      linhas.push(`1. Antecipar recebíveis — peça pagamento adiantado de clientes.`)
      linhas.push(`2. Postergar pagamentos não urgentes para o próximo mês.`)
      linhas.push(`3. Liquidar estoque parado (${fmt(e.valorParados90)}) para gerar caixa rápido.`)
      if (c.inativosMais30 > 0) linhas.push(`4. Reativar ${c.inativosMais30} clientes inativos — potencial ${fmt(c.potencialRecuperacao)}.`)
    } else {
      linhas.push(`✅ Fluxo positivo! Você tem ${fmt(f.fluxoCaixa)} de saldo este mês.`)
      linhas.push(`\n💡 Sugestões para manter o fluxo saudável:`)
      linhas.push(`1. Construa uma reserva de 3 meses de despesas fixas.`)
      linhas.push(`2. Evite comprometer mais de 70% da receita em despesas.`)
    }
    return linhas.join('\n')
  }

  // ── Vender mais ──────────────────────────────────────────
  if (p.includes('vender') || p.includes('vendas') || p.includes('faturamento') || p.includes('receita')) {
    const linhas = [`📈 Análise de vendas e receita:`]
    linhas.push(`• Receita este mês: ${fmt(f.receitaMes)}`)
    linhas.push(`• Mês anterior: ${fmt(f.receitaPrev)}`)
    linhas.push(`• Variação: ${f.crescimentoMoM >= 0 ? '+' : ''}${f.crescimentoMoM.toFixed(1)}% ${f.crescimentoMoM >= 0 ? '📈' : '📉'}`)
    linhas.push(`• Atendimentos: ${f.totalAtendimentos} | Ticket médio: ${fmt(f.ticketMedio)}`)
    linhas.push('')
    linhas.push(`🎯 Para vender mais este mês:`)
    if (c.inativosMais30 > 0) linhas.push(`1. Recupere ${c.inativosMais30} cliente(s) inativo(s) — potencial imediato de ${fmt(c.potencialRecuperacao)}.`)
    if (f.ticketMedio < 150) linhas.push(`2. Aumente o ticket médio oferecendo combos e serviços complementares no atendimento.`)
    if (e.parados90 > 0) linhas.push(`3. Crie promoção dos ${e.parados90} produto(s) parado(s) para atrair clientes à loja.`)
    linhas.push(`4. Peça indicações: clientes satisfeitos indicam com pequenos incentivos (desconto na próxima visita).`)
    if (f.crescimentoMoM < 0) {
      linhas.push(`\n⚠️ Queda de ${Math.abs(f.crescimentoMoM).toFixed(1)}% vs. mês anterior. Ação urgente: lançar campanha especial esta semana.`)
    }
    return linhas.join('\n')
  }

  // ── Score / saúde ────────────────────────────────────────
  if (p.includes('saúde') || p.includes('score') || p.includes('situação') || p.includes('como está')) {
    const linhas = [`🏥 Saúde geral da sua empresa: ${sc.geral}/100`]
    const status = sc.geral >= 80 ? '🟢 Saudável' : sc.geral >= 60 ? '🟡 Atenção' : '🔴 Crítico'
    linhas.push(`Status: ${status}`)
    linhas.push('')
    for (const m of sc.modulos) {
      const emoji = m.score >= 80 ? '🟢' : m.score >= 60 ? '🟡' : '🔴'
      linhas.push(`${emoji} ${m.nome}: ${m.score}/100`)
    }
    linhas.push('')
    const piores = [...sc.modulos].sort((a, b) => a.score - b.score).slice(0, 2)
    linhas.push(`🎯 Foque primeiro nos módulos mais críticos: ${piores.map(m => m.nome).join(' e ')}.`)
    return linhas.join('\n')
  }

  // ── Despesas ─────────────────────────────────────────────
  if (p.includes('despesa') || p.includes('custo') || p.includes('gasto') || p.includes('fornecedor')) {
    const linhas = [`💳 Análise de despesas:`]
    linhas.push(`• Total de despesas este mês: ${fmt(f.despesasMes)}`)
    linhas.push(`• Proporção da receita: ${f.propDespesas.toFixed(0)}% ${f.propDespesas > 70 ? '⚠️ (acima do recomendado de 70%)' : '✅'}`)
    linhas.push(`• Inadimplência: ${fmt(f.inadimplencia)} (${f.qtdVencidas} conta(s) vencida(s))`)
    linhas.push('')
    if (f.propDespesas > 70) {
      linhas.push(`🛠️ Ações recomendadas para reduzir custos:`)
      linhas.push(`1. Listar todos os fornecedores e verificar possibilidade de renegociação.`)
      linhas.push(`2. Cancelar assinaturas e serviços não essenciais.`)
      linhas.push(`3. Reduzir 10% nas despesas = +${fmt(f.despesasMes * 0.1)}/mês de lucro adicional.`)
    } else {
      linhas.push(`✅ Suas despesas estão dentro do limite saudável.`)
    }
    return linhas.join('\n')
  }

  // ── Resposta genérica inteligente ────────────────────────
  const linhas = [`🤖 Analisando seus dados para responder: "${pergunta}"`]
  linhas.push('')
  linhas.push(`📊 Resumo atual do seu negócio:`)
  linhas.push(`• Receita este mês: ${fmt(f.receitaMes)} (${f.crescimentoMoM >= 0 ? '+' : ''}${f.crescimentoMoM.toFixed(1)}% vs. mês anterior)`)
  linhas.push(`• Lucro: ${fmt(f.lucro)} — margem ${f.margem.toFixed(1)}%`)
  linhas.push(`• Clientes ativos: ${c.ativos90} | Inativos: ${c.inativosMais60}`)
  linhas.push(`• Saúde geral: ${sc.geral}/100`)
  linhas.push('')
  linhas.push(`💡 Tente reformular com uma dessas perguntas:`)
  linhas.push(`"Como aumentar meu lucro?", "Onde estou perdendo dinheiro?", "O que fazer para vender mais?", "Como melhorar meu fluxo de caixa?"`)
  return linhas.join('\n')
}

async function enviarPergunta() {
  const texto = perguntaUsuario.value.trim()
  if (!texto || iaDigitando.value) return

  perguntaUsuario.value = ''
  iaDigitando.value = true
  await scrollToBottom()

  // Simula latência de "processamento" (mais realista)
  await new Promise(resolve => setTimeout(resolve, 900 + Math.random() * 600))

  const resposta = gerarResposta(texto)
  chatHistory.value.push({ pergunta: texto, resposta })
  iaDigitando.value = false
  await scrollToBottom()
}
</script>
