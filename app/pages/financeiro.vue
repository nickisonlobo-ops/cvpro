<template>
  <div class="min-h-full bg-transparent p-3 sm:p-8">

    <!-- ══════════════════════════════════════════════════════ CABEÇALHO -->
    <div class="relative rounded-3xl overflow-hidden mb-8 shadow-xl">
      <div class="absolute inset-0" :style="{ background: 'var(--color-primary-bg, linear-gradient(135deg, #059669, #0d9488))' }"></div>
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_60%)]"></div>
      <div class="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/[0.03] pointer-events-none"></div>
      <div class="absolute -bottom-20 left-1/4 w-96 h-96 rounded-full bg-white/[0.02] pointer-events-none"></div>

      <div class="relative px-4 sm:px-8 pt-5 sm:pt-7 pb-5 sm:pb-7">
        <div class="flex flex-wrap items-start justify-between gap-3 sm:gap-6">
          <div class="flex items-center gap-3 sm:gap-5">
            <div class="flex items-center justify-center w-10 sm:w-14 h-10 sm:h-14 rounded-2xl bg-white/[0.12] backdrop-blur-sm border border-white/20 shadow-lg">
              <svg class="w-5 sm:w-7 h-5 sm:h-7 text-white" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-semibold text-white/80 uppercase tracking-widest">Financeiro</span>
                <span class="w-1 h-1 rounded-full bg-white/40"></span>
                <span class="text-xs text-white/50 hidden sm:inline">Dashboard</span>
              </div>
              <h1 class="text-xl sm:text-3xl font-bold text-white tracking-tight leading-none">Análise Financeira</h1>
              <p class="text-sm text-white/60 mt-1.5 capitalize">{{ mesAtualLabel }}</p>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <button
              type="button"
              class="inline-flex items-center gap-2 text-sm font-semibold px-3 sm:px-5 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 border border-white/15 backdrop-blur-sm transition-all duration-200"
              @click="fetchAll"
            >
              <svg class="w-4 h-4" :class="loading ? 'animate-spin' : ''" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              <span class="hidden sm:inline">Atualizar</span>
            </button>
          </div>
        </div>

        <div class="h-px bg-white/10 my-4 sm:my-6"></div>

        <!-- Quick stats no header -->
        <div v-if="!loading" class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="flex flex-col gap-1 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/10">
            <span class="text-xs font-semibold text-white/60 uppercase tracking-widest">Receita Mês</span>
            <span class="text-lg font-black text-white leading-tight truncate">{{ formatCurrency(receitaMes) }}</span>
            <div class="flex items-center gap-1 mt-0.5">
              <svg v-if="crescimentoMoM >= 0" class="w-3 h-3 text-emerald-300" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
              <svg v-else class="w-3 h-3 text-red-300" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25" /></svg>
              <span :class="crescimentoMoM >= 0 ? 'text-emerald-300' : 'text-red-300'" class="text-xs font-bold">{{ crescimentoMoM >= 0 ? '+' : '' }}{{ crescimentoMoM.toFixed(1) }}%</span>
              <span class="text-xs text-white/40">vs mês ant.</span>
            </div>
          </div>
          <div class="flex flex-col gap-1 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/10">
            <span class="text-xs font-semibold text-white/60 uppercase tracking-widest">Despesas Mês</span>
            <span class="text-lg font-black text-white leading-tight truncate">{{ formatCurrency(despesasMes) }}</span>
            <span class="text-xs text-white/40">{{ contasMes.length }} conta(s) no mês</span>
          </div>
          <div class="flex flex-col gap-1 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/10">
            <span class="text-xs font-semibold text-white/60 uppercase tracking-widest">Lucro Bruto</span>
            <span class="text-lg font-black leading-tight truncate" :class="lucroBruto >= 0 ? 'text-emerald-300' : 'text-red-300'">{{ formatCurrency(lucroBruto) }}</span>
            <span class="text-xs text-white/40">Margem {{ margemLucro.toFixed(1) }}%</span>
          </div>
          <div class="flex flex-col gap-1 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/10">
            <span class="text-xs font-semibold text-white/60 uppercase tracking-widest">Inadimplência</span>
            <span class="text-lg font-black text-red-300 leading-tight truncate">{{ formatCurrency(totalVencidas) }}</span>
            <span class="text-xs text-white/40">{{ contasVencidas.length }} conta(s) vencida(s)</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col items-center justify-center gap-4 py-32">
      <span class="inline-block w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>
      <span class="text-sm text-gray-400 font-medium">Carregando dados financeiros...</span>
    </div>

    <template v-else>

      <!-- ══════════════════════════════════════════════════════ KPI CARDS -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">

        <!-- Receita do Mês -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-md p-5 hover:shadow-lg transition-shadow">
          <div class="flex items-start justify-between mb-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div class="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full" :class="crescimentoMoM >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path v-if="crescimentoMoM >= 0" stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25" />
              </svg>
              {{ Math.abs(crescimentoMoM).toFixed(1) }}%
            </div>
          </div>
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Receita do Mês</p>
          <p class="text-2xl font-black text-gray-900 leading-tight truncate">{{ formatCurrency(receitaMes) }}</p>
          <p class="text-xs text-gray-400 mt-1">{{ vendasMes }} receita(s) no mês</p>
        </div>

        <!-- Despesas do Mês -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-md p-5 hover:shadow-lg transition-shadow">
          <div class="flex items-start justify-between mb-3">
            <div class="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg>
            </div>
            <span class="text-xs font-bold px-2 py-1 rounded-full bg-gray-50 text-gray-500">{{ contasMes.length }} conta(s)</span>
          </div>
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Despesas do Mês</p>
          <p class="text-2xl font-black text-gray-900 leading-tight truncate">{{ formatCurrency(despesasMes) }}</p>
          <p class="text-xs text-gray-400 mt-1">Vencimento no mês atual</p>
        </div>

        <!-- Lucro Bruto -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-md p-5 hover:shadow-lg transition-shadow">
          <div class="flex items-start justify-between mb-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="lucroBruto >= 0 ? 'bg-blue-50' : 'bg-orange-50'">
              <svg class="w-5 h-5" :class="lucroBruto >= 0 ? 'text-blue-600' : 'text-orange-500'" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
            </div>
            <span class="text-xs font-bold px-2 py-1 rounded-full" :class="margemLucro >= 30 ? 'bg-emerald-50 text-emerald-700' : margemLucro >= 10 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-600'">{{ margemLucro.toFixed(1) }}%</span>
          </div>
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Lucro Bruto</p>
          <p class="text-2xl font-black leading-tight truncate" :class="lucroBruto >= 0 ? 'text-gray-900' : 'text-red-500'">{{ formatCurrency(lucroBruto) }}</p>
          <p class="text-xs text-gray-400 mt-1">Margem líquida de {{ margemLucro.toFixed(1) }}%</p>
        </div>

        <!-- Ticket Médio -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-md p-5 hover:shadow-lg transition-shadow">
          <div class="flex items-start justify-between mb-3">
            <div class="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185z" /></svg>
            </div>
            <div class="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full" :class="crescTicketMedio >= 0 ? 'bg-purple-50 text-purple-700' : 'bg-gray-50 text-gray-500'">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path v-if="crescTicketMedio >= 0" stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25" />
              </svg>
              {{ Math.abs(crescTicketMedio).toFixed(1) }}%
            </div>
          </div>
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Ticket Médio</p>
          <p class="text-2xl font-black text-gray-900 leading-tight truncate">{{ formatCurrency(ticketMedioMes) }}</p>
          <p class="text-xs text-gray-400 mt-1">Baseado em {{ vendasMes }} receita(s)</p>
        </div>

      </div>

      <!-- ══════════════════════════════════════════════════════ CHARTS ROW 1 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        <!-- Gráfico de Barras: Receita vs Despesas (6 meses) -->
        <div class="lg:col-span-2 bg-white rounded-3xl shadow-md border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-5">
            <div>
              <h3 class="text-base font-black text-gray-800">Receita × Despesas</h3>
              <p class="text-xs text-gray-400 mt-0.5">Comparativo dos últimos 6 meses</p>
            </div>
            <div class="flex items-center gap-4 text-xs font-semibold text-gray-500">
              <div class="flex items-center gap-1.5">
                <span class="w-3 h-3 rounded-sm bg-emerald-500"></span>
                Receita
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-3 h-3 rounded-sm bg-red-400"></span>
                Despesas
              </div>
            </div>
          </div>

          <!-- SVG Bar Chart -->
          <div v-if="last6MonthsData.every(m => m.receita === 0 && m.despesas === 0)" class="flex flex-col items-center justify-center py-12 gap-2">
            <svg class="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" stroke-width="1.25" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z" /></svg>
            <p class="text-sm text-gray-400">Sem dados no período</p>
          </div>

          <svg v-else viewBox="0 0 500 210" class="w-full" style="max-height:220px" aria-hidden="true">
            <defs>
              <linearGradient id="gradReceita" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#34d399" />
                <stop offset="100%" stop-color="#059669" />
              </linearGradient>
              <linearGradient id="gradDespesa" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#f87171" />
                <stop offset="100%" stop-color="#dc2626" />
              </linearGradient>
            </defs>

            <!-- Grid lines -->
            <line v-for="n in 5" :key="`gl${n}`" x1="55" :y1="15 + (n - 1) * 37.5" x2="490" :y2="15 + (n - 1) * 37.5" stroke="#f3f4f6" stroke-width="1" />

            <!-- Y-axis labels -->
            <text v-for="n in 5" :key="`yl${n}`" x="50" :y="15 + (n - 1) * 37.5 + 4" text-anchor="end" font-size="8.5" fill="#9ca3af">
              {{ formatCurrencyShort(barMaxVal * (1 - (n - 1) / 4)) }}
            </text>

            <!-- Bars per month -->
            <g v-for="(m, i) in last6MonthsData" :key="`bar${i}`">
              <!-- Revenue bar -->
              <rect
                :x="55 + i * (430 / 6) + (430 / 6 - 57) / 2"
                :y="165 - barH(m.receita)"
                width="26"
                :height="Math.max(barH(m.receita), 2)"
                rx="4"
                fill="url(#gradReceita)"
                class="bar-anim"
              />
              <!-- Expense bar -->
              <rect
                :x="55 + i * (430 / 6) + (430 / 6 - 57) / 2 + 31"
                :y="165 - barH(m.despesas)"
                width="26"
                :height="Math.max(barH(m.despesas), 2)"
                rx="4"
                fill="url(#gradDespesa)"
                class="bar-anim"
              />
              <!-- Month label -->
              <text
                :x="55 + i * (430 / 6) + (430 / 6) / 2"
                y="180"
                text-anchor="middle"
                font-size="9.5"
                fill="#6b7280"
                font-weight="600"
              >{{ m.label }}</text>
            </g>

            <!-- Baseline -->
            <line x1="55" y1="165" x2="490" y2="165" stroke="#e5e7eb" stroke-width="1.5" />
          </svg>
        </div>

        <!-- Donut: Formas de Pagamento -->
        <div class="bg-white rounded-3xl shadow-md border border-gray-100 p-6">
          <div class="mb-4">
            <h3 class="text-base font-black text-gray-800">Formas de Pagamento</h3>
            <p class="text-xs text-gray-400 mt-0.5">Distribuição da receita no mês</p>
          </div>

          <div v-if="donutData.length === 0" class="flex flex-col items-center justify-center py-10 gap-2">
            <svg class="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" stroke-width="1.25" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path stroke-linecap="round" d="M12 8v4m0 4h.01" /></svg>
            <p class="text-sm text-gray-400">Sem vendas no mês</p>
          </div>

          <template v-else>
            <!-- SVG Donut -->
            <div class="flex items-center justify-center mb-4">
              <svg viewBox="0 0 200 160" class="w-full" style="max-height:160px" aria-hidden="true">
                <!-- Background ring -->
                <circle cx="100" cy="80" r="44" fill="none" stroke="#f3f4f6" stroke-width="22" />
                <!-- Slices -->
                <circle
                  v-for="(slice, i) in donutSlices"
                  :key="`ds${i}`"
                  cx="100"
                  cy="80"
                  r="44"
                  fill="none"
                  :stroke="DONUT_COLORS[i % DONUT_COLORS.length]"
                  stroke-width="22"
                  :stroke-dasharray="`${slice.dash.toFixed(2)} ${donutCircumference.toFixed(2)}`"
                  :transform="`rotate(${slice.startAngle - 90} 100 80)`"
                  class="cursor-pointer hover:opacity-80 transition-opacity"
                />
                <!-- Center labels -->
                <text x="100" y="76" text-anchor="middle" font-size="10" fill="#9ca3af" font-weight="600">Total</text>
                <text x="100" y="92" text-anchor="middle" font-size="12.5" fill="#111827" font-weight="900">{{ formatCurrencyShort(receitaMes) }}</text>
              </svg>
            </div>

            <!-- Legend -->
            <div class="flex flex-col gap-2">
              <div v-for="(item, i) in donutData" :key="`dl${i}`" class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2 min-w-0">
                  <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ background: DONUT_COLORS[i % DONUT_COLORS.length] }"></span>
                  <span class="text-xs font-semibold text-gray-600 truncate">{{ item.label }}</span>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <span class="text-xs text-gray-400">{{ formatCurrencyShort(item.value) }}</span>
                  <span class="text-xs font-black text-gray-800">{{ item.pct.toFixed(1) }}%</span>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════════ AREA LINE CHART -->
      <div class="bg-white rounded-3xl shadow-md border border-gray-100 p-6 mb-6">
        <div class="flex items-center justify-between mb-5">
          <div>
            <h3 class="text-base font-black text-gray-800">Evolução da Receita</h3>
            <p class="text-xs text-gray-400 mt-0.5">Últimos 12 meses — valores mensais</p>
          </div>
          <div class="flex items-center gap-4 text-xs font-semibold text-gray-500">
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-sm bg-emerald-500"></span>
              Receita
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-sm border-2 border-dashed border-emerald-300 bg-emerald-50"></span>
              A Receber
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-sm bg-red-400"></span>
              Despesas
            </div>
          </div>
        </div>

        <div class="relative" @mouseleave="lineTooltip = null">
          <svg viewBox="0 0 960 175" class="w-full" aria-hidden="true">
            <defs>
              <linearGradient id="areaGradReceita" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#10b981" stop-opacity="0.22" />
                <stop offset="100%" stop-color="#10b981" stop-opacity="0.02" />
              </linearGradient>
              <linearGradient id="areaGradDespesa" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#ef4444" stop-opacity="0.1" />
                <stop offset="100%" stop-color="#ef4444" stop-opacity="0.01" />
              </linearGradient>
              <linearGradient id="areaGradAReceber" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#6ee7b7" stop-opacity="0.15" />
                <stop offset="100%" stop-color="#6ee7b7" stop-opacity="0.02" />
              </linearGradient>
            </defs>

            <!-- Grid lines -->
            <line v-for="(step, n) in lineYSteps" :key="`lgl${n}`" x1="60" :y1="15 + n * (120 / (lineYSteps.length - 1))" x2="940" :y2="15 + n * (120 / (lineYSteps.length - 1))" stroke="#f3f4f6" stroke-width="1" />

            <!-- Y-axis labels -->
            <text v-for="(step, n) in lineYSteps" :key="`lyl${n}`" x="56" :y="15 + n * (120 / (lineYSteps.length - 1)) + 4" text-anchor="end" font-size="9" fill="#9ca3af">
              {{ formatCurrencyShort(step) }}
            </text>

            <!-- Area fills -->
            <path v-if="lineChartPoints.length > 0" :d="areaPathDespesas" fill="url(#areaGradDespesa)" />
            <path v-if="lineChartPoints.length > 0" :d="areaPathAReceber" fill="url(#areaGradAReceber)" />
            <path v-if="lineChartPoints.length > 0" :d="areaPathReceita" fill="url(#areaGradReceita)" />

            <!-- Expense line (solid) -->
            <path v-if="lineChartPoints.length > 0" :d="lineDespesasPath" fill="none" stroke="#f87171" stroke-width="2" stroke-linecap="round" />

            <!-- A Receber line (dashed, light green) -->
            <path v-if="lineChartPoints.length > 0" :d="lineAReceberPath" fill="none" stroke="#6ee7b7" stroke-width="2" stroke-dasharray="5,3" stroke-linecap="round" />

            <!-- Revenue line -->
            <path v-if="lineChartPoints.length > 0" :d="lineReceitaPath" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />

            <!-- Data point circles (a receber) -->
            <circle
              v-for="(p, i) in lineChartPoints"
              :key="`ptar${i}`"
              :cx="p.x"
              :cy="p.yAReceber"
              r="3"
              fill="#6ee7b7"
              stroke="white"
              stroke-width="1.5"
            />

            <!-- Data point circles (revenue) -->
            <circle
              v-for="(p, i) in lineChartPoints"
              :key="`pt${i}`"
              :cx="p.x"
              :cy="p.yReceita"
              r="3.5"
              fill="#10b981"
              stroke="white"
              stroke-width="2"
            />

            <!-- Hover vertical line indicator -->
            <line
              v-if="lineTooltip !== null"
              :x1="lineChartPoints[lineTooltip].x"
              :y1="15"
              :x2="lineChartPoints[lineTooltip].x"
              :y2="135"
              stroke="#d1d5db"
              stroke-width="1"
              stroke-dasharray="3,2"
            />

            <!-- Invisible hover zones per month -->
            <rect
              v-for="(p, i) in lineChartPoints"
              :key="`hz${i}`"
              :x="p.x - 40"
              y="0"
              width="80"
              height="175"
              fill="transparent"
              style="cursor: pointer"
              @mouseenter="lineTooltip = i"
              @mouseleave="lineTooltip = null"
            />

            <!-- Month labels -->
            <text
              v-for="(p, i) in lineChartPoints"
              :key="`ptl${i}`"
              :x="p.x"
              y="162"
              text-anchor="middle"
              font-size="9"
              fill="#9ca3af"
              font-weight="600"
            >{{ p.label }}</text>

            <!-- Baseline -->
            <line x1="60" y1="135" x2="940" y2="135" stroke="#e5e7eb" stroke-width="1.5" />
          </svg>

          <!-- Tooltip -->
          <Transition name="fade">
            <div
              v-if="lineTooltip !== null"
              class="absolute z-10 pointer-events-none bg-white rounded-xl shadow-lg border border-gray-200 px-3 py-2.5 text-xs min-w-[140px]"
              :style="{ left: `${(lineChartPoints[lineTooltip].x / 960) * 100}%`, top: '0px', transform: 'translateX(-50%)' }"
            >
              <p class="font-bold text-gray-700 mb-1.5 capitalize">{{ lineChartPoints[lineTooltip].label }}</p>
              <div class="flex items-center gap-1.5 mb-1">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span class="text-gray-500">Receita:</span>
                <span class="font-bold text-gray-800 ml-auto">{{ formatCurrency(lineChartPoints[lineTooltip].receita) }}</span>
              </div>
              <div class="flex items-center gap-1.5 mb-1">
                <span class="w-2 h-2 rounded-full bg-emerald-300"></span>
                <span class="text-gray-500">A Receber:</span>
                <span class="font-bold text-gray-800 ml-auto">{{ formatCurrency(lineChartPoints[lineTooltip].receitaAReceber) }}</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-red-400"></span>
                <span class="text-gray-500">Despesas:</span>
                <span class="font-bold text-gray-800 ml-auto">{{ formatCurrency(lineChartPoints[lineTooltip].despesas) }}</span>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════════ BOTTOM ROW -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- Top Categorias de Despesa -->
        <div class="lg:col-span-2 bg-white rounded-3xl shadow-md border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-5">
            <div>
              <h3 class="text-base font-black text-gray-800">Categorias de Despesa</h3>
              <p class="text-xs text-gray-400 mt-0.5">Top {{ topCategorias.length }} categorias — histórico total</p>
            </div>
            <span class="text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-xl">{{ formatCurrency(totalDespesasHistorico) }}</span>
          </div>

          <div v-if="topCategorias.length === 0" class="flex flex-col items-center py-8 gap-2">
            <p class="text-sm text-gray-400">Nenhuma categoria registrada</p>
          </div>

          <div v-else class="flex flex-col gap-4">
            <div v-for="(cat, i) in topCategorias" :key="`cat${i}`" class="flex flex-col gap-1.5">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black text-white shrink-0" :style="{ background: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }">{{ i + 1 }}</span>
                  <span class="text-sm font-semibold text-gray-700 truncate max-w-[180px]">{{ cat.label }}</span>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <span class="text-xs font-bold text-gray-400">{{ cat.pct.toFixed(1) }}%</span>
                  <span class="text-sm font-black text-gray-800">{{ formatCurrency(cat.value) }}</span>
                </div>
              </div>
              <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-700 ease-out"
                  :style="{ width: cat.pct + '%', background: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Resumo pagamentos -->
          <div class="mt-6 pt-5 border-t border-gray-100 grid grid-cols-3 gap-3">
            <div class="bg-yellow-50 rounded-2xl px-4 py-3 text-center border border-yellow-100">
              <p class="text-xs font-bold text-yellow-700 uppercase tracking-widest mb-1">Pendente</p>
              <p class="text-sm font-black text-yellow-800">{{ formatCurrency(totalPorStatus('pendente')) }}</p>
              <p class="text-xs text-yellow-600 mt-0.5">{{ qtdPorStatus('pendente') }} conta(s)</p>
            </div>
            <div class="bg-red-50 rounded-2xl px-4 py-3 text-center border border-red-100">
              <p class="text-xs font-bold text-red-600 uppercase tracking-widest mb-1">Vencido</p>
              <p class="text-sm font-black text-red-700">{{ formatCurrency(totalPorStatus('vencido')) }}</p>
              <p class="text-xs text-red-500 mt-0.5">{{ qtdPorStatus('vencido') }} conta(s)</p>
            </div>
            <div class="bg-emerald-50 rounded-2xl px-4 py-3 text-center border border-emerald-100">
              <p class="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-1">Pago</p>
              <p class="text-sm font-black text-emerald-800">{{ formatCurrency(totalPorStatus('pago')) }}</p>
              <p class="text-xs text-emerald-600 mt-0.5">{{ qtdPorStatus('pago') }} conta(s)</p>
            </div>
          </div>
        </div>

        <!-- Alertas + Saúde Financeira + Insights -->
        <div class="flex flex-col gap-4">

          <!-- Alertas -->
          <div class="bg-white rounded-3xl shadow-md border border-gray-100 p-5">
            <h3 class="text-sm font-black text-gray-800 mb-4 flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <svg class="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
              </span>
              Alertas Financeiros
              <span v-if="alertCount > 0" class="ml-auto inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-red-100 text-red-600 text-xs font-black">{{ alertCount }}</span>
            </h3>

            <div v-if="alertCount === 0" class="text-center py-4">
              <svg class="w-8 h-8 text-emerald-300 mx-auto mb-2" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p class="text-xs text-gray-400 font-semibold">Tudo em dia!</p>
            </div>

            <div v-else class="flex flex-col gap-2">
              <div
                v-for="c in contasVencidas.slice(0, 3)"
                :key="`v${c.id}`"
                class="flex items-start gap-2.5 p-2.5 bg-red-50 rounded-xl border border-red-100"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></span>
                <div class="min-w-0 flex-1">
                  <p class="text-xs font-bold text-red-700 truncate">{{ c.descricao }}</p>
                  <p class="text-xs text-red-500">{{ formatCurrency(c.valor) }} · Venceu {{ formatDateShort(c.data_vencimento) }}</p>
                </div>
              </div>
              <div
                v-for="c in contasProximos7.slice(0, 2)"
                :key="`p${c.id}`"
                class="flex items-start gap-2.5 p-2.5 bg-amber-50 rounded-xl border border-amber-100"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                <div class="min-w-0 flex-1">
                  <p class="text-xs font-bold text-amber-700 truncate">{{ c.descricao }}</p>
                  <p class="text-xs text-amber-500">{{ formatCurrency(c.valor) }} · Vence {{ formatDateShort(c.data_vencimento) }}</p>
                </div>
              </div>
              <p v-if="alertCount > 5" class="text-xs text-gray-400 text-center pt-1">
                +{{ alertCount - 5 }} alerta(s) adicionais
              </p>
            </div>
          </div>

          <!-- Saúde Financeira -->
          <div class="bg-white rounded-3xl shadow-md border border-gray-100 p-5">
            <h3 class="text-sm font-black text-gray-800 mb-3">Índice de Saúde Financeira</h3>

            <!-- Gauge bar -->
            <div class="flex items-center gap-3 mb-2">
              <div class="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-700 ease-out"
                  :style="{ width: Math.min(saudeScore, 100) + '%', background: saudeGradient }"
                ></div>
              </div>
              <span class="text-lg font-black tabular-nums" :style="{ color: saudeColor }">{{ saudeScore.toFixed(0) }}</span>
            </div>
            <p class="text-xs font-semibold mb-4" :style="{ color: saudeColor }">{{ saudeLabel }}</p>

            <!-- Micro-indicators -->
            <div class="grid grid-cols-3 gap-2">
              <div class="bg-gray-50 rounded-xl p-2.5 text-center">
                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1">Adimplência</p>
                <p class="text-sm font-black" :class="adimplenciaScore >= 80 ? 'text-emerald-600' : adimplenciaScore >= 50 ? 'text-amber-600' : 'text-red-500'">{{ adimplenciaScore.toFixed(0) }}%</p>
              </div>
              <div class="bg-gray-50 rounded-xl p-2.5 text-center">
                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1">Margem</p>
                <p class="text-sm font-black" :class="margemLucro >= 30 ? 'text-emerald-600' : margemLucro >= 10 ? 'text-amber-600' : 'text-red-500'">{{ margemLucro.toFixed(0) }}%</p>
              </div>
              <div class="bg-gray-50 rounded-xl p-2.5 text-center">
                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1">Crescim.</p>
                <p class="text-sm font-black" :class="crescimentoMoM >= 0 ? 'text-emerald-600' : 'text-red-500'">{{ crescimentoMoM >= 0 ? '+' : '' }}{{ crescimentoMoM.toFixed(0) }}%</p>
              </div>
            </div>
          </div>

          <!-- Insights Inteligentes -->
          <div class="rounded-3xl p-5 shadow-md" style="background: linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)">
            <h3 class="text-sm font-black text-white mb-3 flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" /></svg>
              </span>
              Insights Automáticos
            </h3>
            <div class="flex flex-col gap-2.5">
              <div v-for="(tip, i) in insights" :key="`tip${i}`" class="flex items-start gap-2.5">
                <span class="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-black text-white" :class="tip.badgeClass">
                  {{ i + 1 }}
                </span>
                <p class="text-xs text-white/80 leading-relaxed">{{ tip.msg }}</p>
              </div>
              <div v-if="insights.length === 0" class="text-xs text-white/50 text-center py-2">Adicione mais dados para gerar insights.</div>
            </div>
          </div>

        </div>
      </div>

    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { createSupabaseClient } from '~/lib/supabase'
import { useRealtimeMulti } from '~/composables/useRealtime'
import { useAdmin } from '~/composables/useAdmin'
import { useEmpresa } from '~/composables/useEmpresa'

defineOptions({ name: 'FinanceiroDashboard' })

// ── Interfaces ────────────────────────────────────────────────────────────────
interface ItemVenda {
  preco_unitario: number
  quantidade: number
  valor_total: number | null
}

interface Venda {
  id: number
  preco_veiculo: number | null
  forma_pagamento: string | null
  status: string | null
  data_venda: string | null
  vendas_itens: ItemVenda[]
}

interface ContaPagar {
  id: number
  descricao: string
  valor: number
  data_vencimento: string
  data_pagamento: string | null
  status: string | null
  categoria: string | null
  tipo: string
}

interface Agendamento {
  id: number
  data_hora: string | null
  status: string
  valor_total: number | null
}

interface OrdemServicoFinanceiro {
  id: number
  valor_total: number | null
  status: string
  data_entrega: string | null
  data_aprovacao: string | null
  forma_pagamento: string | null
}

// ── Estado ────────────────────────────────────────────────────────────────────
const supabase = createSupabaseClient()
const { empresaId, loadEmpresa } = useEmpresa()
const { isAdminOrGerente } = useAdmin()
const { formatCurrency } = useLocale()

const vendas = ref<Venda[]>([])
const contas = ref<ContaPagar[]>([])
const agendamentos = ref<Agendamento[]>([])
const ordensServico = ref<OrdemServicoFinanceiro[]>([])
const loading = ref(true)
const lineTooltip = ref<number | null>(null)

// ── Constantes visuais ────────────────────────────────────────────────────────
const DONUT_COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899', '#14b8a6', '#f97316']
const CATEGORY_COLORS = ['#0ea5e9', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981', '#ec4899', '#14b8a6', '#f97316']
const CHART_H = 150
const donutCircumference = 2 * Math.PI * 44

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatCurrencyShort(val: number): string {
  const { locale } = useLocale()
  const sym = locale.value.simboloMoeda
  if (val >= 1_000_000) return `${sym}${(val / 1_000_000).toFixed(1)}M`
  if (val >= 10_000) return `${sym}${(val / 1_000).toFixed(0)}k`
  if (val >= 1_000) return `${sym}${(val / 1_000).toFixed(1)}k`
  return `${sym}${val.toFixed(0)}`
}

function formatDateShort(iso: string | null): string {
  if (!iso) return '–'
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

function vendaTotalValor(v: Venda): number {
  const itemsTotal = (v.vendas_itens ?? []).reduce((s, i) => s + (i.valor_total ?? i.preco_unitario * i.quantidade), 0)
  return (v.preco_veiculo ?? 0) + itemsTotal
}

function makeSmoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return ''
  let d = `M ${pts[0].x.toFixed(2)},${pts[0].y.toFixed(2)}`
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 1]
    const p1 = pts[i]
    const dx = p1.x - p0.x
    const cp1x = (p0.x + dx * 0.4).toFixed(2)
    const cp2x = (p1.x - dx * 0.4).toFixed(2)
    d += ` C ${cp1x},${p0.y.toFixed(2)} ${cp2x},${p1.y.toFixed(2)} ${p1.x.toFixed(2)},${p1.y.toFixed(2)}`
  }
  return d
}

// ── Dados mensais (12 meses) ──────────────────────────────────────────────────
const monthlyData = computed(() => {
  const now = new Date()
  return Array.from({ length: 12 }, (_, idx) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (11 - idx), 1)
    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const label = d.toLocaleDateString('pt-BR', { month: 'short' })

    const receitaVendas = vendas.value
      .filter(v => {
        if (v.status !== 'finalizada' || !v.data_venda) return false
        const dv = new Date(v.data_venda)
        return dv.getFullYear() === year && dv.getMonth() + 1 === month
      })
      .reduce((s, v) => s + vendaTotalValor(v), 0)

    const receitaAgendamentos = agendamentos.value
      .filter(a => {
        if (!a.data_hora || !a.valor_total) return false
        const da = new Date(a.data_hora)
        return da.getFullYear() === year && da.getMonth() + 1 === month
      })
      .reduce((s, a) => s + (a.valor_total ?? 0), 0)

    const receitaOS = ordensServico.value
      .filter(os => {
        if (os.status !== 'entregue' || !os.data_entrega || !os.valor_total) return false
        const de = new Date(os.data_entrega)
        return de.getFullYear() === year && de.getMonth() + 1 === month
      })
      .reduce((s, os) => s + (os.valor_total ?? 0), 0)

    // Receitas vindas de contas a receber (orçamentos aprovados, etc.)
    const receitaContas = contas.value
      .filter(c => {
        if ((c.tipo ?? 'pagar') !== 'receber') return false
        if (c.status !== 'pago') return false
        // Usar data_pagamento se disponível, senão data_vencimento
        const dateStr = c.data_pagamento ?? c.data_vencimento
        if (!dateStr) return false
        const dp = new Date(dateStr + 'T12:00:00')
        return dp.getFullYear() === year && dp.getMonth() + 1 === month
      })
      .reduce((s, c) => s + (c.valor ?? 0), 0)

    const receita = receitaVendas + receitaAgendamentos + receitaOS + receitaContas

    // Receita a Receber: contas tipo='receber', status pendente
    // Mostra no mês atual o total acumulado de todas receitas pendentes (futuras incluídas)
    // Para meses passados, mostra receitas pendentes que venceram nesse mês
    const isCurrentMonth = (year === now.getFullYear() && month === now.getMonth() + 1)
    const receitaAReceber = contas.value
      .filter(c => {
        if ((c.tipo ?? 'pagar') !== 'receber') return false
        if (c.status !== 'pendente') return false
        if (!c.valor) return false
        if (isCurrentMonth) {
          // No mês atual: acumula todas receitas pendentes (vencimento atual ou futuro)
          return true
        }
        // Meses passados: filtra pelo mês de vencimento
        const dateStr = c.data_vencimento
        if (!dateStr) return false
        const dv = new Date(dateStr + 'T12:00:00')
        return dv.getFullYear() === year && dv.getMonth() + 1 === month
      })
      .reduce((s, c) => s + (c.valor ?? 0), 0)

    const despesas = contas.value
      .filter(c => {
        if ((c.tipo ?? 'pagar') === 'receber') return false // Não conta recebíveis como despesa
        if (c.status === 'cancelado' || !c.data_vencimento) return false
        const dv = new Date(c.data_vencimento + 'T12:00:00')
        return dv.getFullYear() === year && dv.getMonth() + 1 === month
      })
      .reduce((s, c) => s + (c.valor ?? 0), 0)

    return { year, month, label, receita, despesas, receitaAReceber, lucro: receita - despesas }
  })
})

const last6MonthsData = computed(() => monthlyData.value.slice(6))

// ── KPIs ──────────────────────────────────────────────────────────────────────
const receitaMes = computed(() => monthlyData.value[11]?.receita ?? 0)
const despesasMes = computed(() => monthlyData.value[11]?.despesas ?? 0)
const lucroBruto = computed(() => receitaMes.value - despesasMes.value)
const margemLucro = computed(() => receitaMes.value > 0 ? (lucroBruto.value / receitaMes.value) * 100 : 0)

const receitaMesAnterior = computed(() => monthlyData.value[10]?.receita ?? 0)
const crescimentoMoM = computed(() => {
  if (!receitaMesAnterior.value) return receitaMes.value > 0 ? 100 : 0
  return ((receitaMes.value - receitaMesAnterior.value) / receitaMesAnterior.value) * 100
})

const vendasMes = computed(() => {
  const now = new Date()
  const vendaMesCount = vendas.value.filter(v => {
    if (v.status !== 'finalizada' || !v.data_venda) return false
    const d = new Date(v.data_venda)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  }).length
  const agendMesCount = agendamentos.value.filter(a => {
    if (!a.data_hora) return false
    const d = new Date(a.data_hora)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  }).length
  const osMesCount = ordensServico.value.filter(os => {
    if (os.status !== 'entregue' || !os.data_entrega) return false
    const d = new Date(os.data_entrega)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  }).length
  return vendaMesCount + agendMesCount + osMesCount
})

const contasMes = computed(() => {
  const now = new Date()
  return contas.value.filter(c => {
    if ((c.tipo ?? 'pagar') !== 'pagar') return false // Só despesas
    if (c.status === 'cancelado' || !c.data_vencimento) return false
    const d = new Date(c.data_vencimento + 'T12:00:00')
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  })
})

const ticketMedioMes = computed(() => vendasMes.value > 0 ? receitaMes.value / vendasMes.value : 0)
const ticketMedioMesAnterior = computed(() => {
  const prevReceita = monthlyData.value[10]?.receita ?? 0
  const now = new Date()
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const prevVendas = vendas.value.filter(v => {
    if (v.status !== 'finalizada' || !v.data_venda) return false
    const d = new Date(v.data_venda)
    return d.getFullYear() === prev.getFullYear() && d.getMonth() === prev.getMonth()
  }).length
  const prevAgends = agendamentos.value.filter(a => {
    if (!a.data_hora) return false
    const d = new Date(a.data_hora)
    return d.getFullYear() === prev.getFullYear() && d.getMonth() === prev.getMonth()
  }).length
  const prevTotal = prevVendas + prevAgends
  return prevTotal > 0 ? prevReceita / prevTotal : 0
})
const crescTicketMedio = computed(() => {
  if (!ticketMedioMesAnterior.value) return 0
  return ((ticketMedioMes.value - ticketMedioMesAnterior.value) / ticketMedioMesAnterior.value) * 100
})

const contasVencidas = computed(() => contas.value.filter(c => c.status === 'vencido' && (c.tipo ?? 'pagar') === 'pagar'))
const totalVencidas = computed(() => contasVencidas.value.reduce((s, c) => s + (c.valor ?? 0), 0))

const contasProximos7 = computed(() => {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const in7 = new Date(today); in7.setDate(in7.getDate() + 7)
  return contas.value.filter(c => {
    if ((c.tipo ?? 'pagar') !== 'pagar') return false
    if (c.status !== 'pendente' || !c.data_vencimento) return false
    const dv = new Date(c.data_vencimento + 'T12:00:00')
    return dv >= today && dv <= in7
  })
})

const alertCount = computed(() => contasVencidas.value.length + contasProximos7.value.length)

const mesAtualLabel = computed(() =>
  new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
)

// ── Totais por status (apenas despesas - tipo pagar) ──────────────────────────
function totalPorStatus(s: string): number {
  return contas.value.filter(c => (c.tipo ?? 'pagar') === 'pagar' && (c.status ?? 'pendente') === s).reduce((acc, c) => acc + (c.valor ?? 0), 0)
}
function qtdPorStatus(s: string): number {
  return contas.value.filter(c => (c.status ?? 'pendente') === s).length
}

// ── Categorias de despesa (apenas tipo pagar) ─────────────────────────────────
const totalDespesasHistorico = computed(() =>
  contas.value.filter(c => (c.tipo ?? 'pagar') === 'pagar' && c.status !== 'cancelado').reduce((s, c) => s + (c.valor ?? 0), 0)
)

const topCategorias = computed(() => {
  const map: Record<string, number> = {}
  for (const c of contas.value) {
    if ((c.tipo ?? 'pagar') !== 'pagar') continue // Só despesas
    if (c.status === 'cancelado') continue
    const cat = c.categoria ?? 'Sem categoria'
    map[cat] = (map[cat] ?? 0) + (c.valor ?? 0)
  }
  const total = Object.values(map).reduce((s, v) => s + v, 0)
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(([label, value]) => ({ label, value, pct: total > 0 ? (value / total) * 100 : 0 }))
})

// ── Donut (Formas de Pagamento) ───────────────────────────────────────────────
const donutData = computed(() => {
  const now = new Date()
  const vendaMes = vendas.value.filter(v => {
    if (v.status !== 'finalizada' || !v.data_venda) return false
    const d = new Date(v.data_venda)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  })
  const agendMes = agendamentos.value.filter(a => {
    if (!a.data_hora) return false
    const d = new Date(a.data_hora)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  })
  const osMes = ordensServico.value.filter(os => {
    if (os.status !== 'entregue' || !os.data_entrega) return false
    const d = new Date(os.data_entrega)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  })
  const map: Record<string, number> = {}
  for (const v of vendaMes) {
    const fp = v.forma_pagamento ?? 'Não informado'
    map[fp] = (map[fp] ?? 0) + vendaTotalValor(v)
  }
  const agendTotal = agendMes.reduce((s, a) => s + (a.valor_total ?? 0), 0)
  if (agendTotal > 0) {
    map['Consultas/Serviços'] = (map['Consultas/Serviços'] ?? 0) + agendTotal
  }
  // Receita de Ordens de Serviço
  for (const os of osMes) {
    const fp = os.forma_pagamento ?? 'Produção (OS)'
    map[fp] = (map[fp] ?? 0) + (os.valor_total ?? 0)
  }
  const total = Object.values(map).reduce((s, v) => s + v, 0)
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({ label, value, pct: total > 0 ? (value / total) * 100 : 0 }))
})

const donutSlices = computed(() => {
  let cumAngle = 0
  return donutData.value.map(item => {
    const dash = (item.pct / 100) * donutCircumference
    const startAngle = cumAngle
    cumAngle += (item.pct / 100) * 360
    return { ...item, dash, startAngle }
  })
})

// ── Bar Chart ─────────────────────────────────────────────────────────────────
const barMaxVal = computed(() =>
  Math.max(...last6MonthsData.value.flatMap(m => [m.receita, m.despesas]), 1)
)
function barH(val: number): number {
  return Math.max((val / barMaxVal.value) * CHART_H, 0)
}

// ── Line / Area Chart ─────────────────────────────────────────────────────────
const lineRawMax = computed(() =>
  Math.max(...monthlyData.value.flatMap(m => [m.receita, m.despesas, m.receitaAReceber]), 1)
)
// Arredonda para cima ao próximo múltiplo de 250
const lineMaxVal = computed(() =>
  Math.ceil(lineRawMax.value / 250) * 250 || 250
)
// Steps dinâmicos para o eixo Y (evita muitas linhas)
const lineYSteps = computed(() => {
  const max = lineMaxVal.value
  // Step de 500 se max >= 2000, senão 250
  const step = max >= 2000 ? 500 : 250
  const steps: number[] = []
  for (let v = 0; v <= max; v += step) {
    steps.push(v)
  }
  return steps.reverse() // do maior para o menor (topo → base)
})

const lineChartPoints = computed(() => {
  const pts = monthlyData.value
  const maxVal = lineMaxVal.value
  return pts.map((m, i) => ({
    x: 60 + i * (880 / 11),
    yReceita: 135 - (m.receita / maxVal) * 120,
    yDespesas: 135 - (m.despesas / maxVal) * 120,
    yAReceber: 135 - (m.receitaAReceber / maxVal) * 120,
    label: m.label,
    receita: m.receita,
    despesas: m.despesas,
    receitaAReceber: m.receitaAReceber,
  }))
})

const lineReceitaPath = computed(() =>
  makeSmoothPath(lineChartPoints.value.map(p => ({ x: p.x, y: p.yReceita })))
)
const lineDespesasPath = computed(() =>
  makeSmoothPath(lineChartPoints.value.map(p => ({ x: p.x, y: p.yDespesas })))
)
const lineAReceberPath = computed(() =>
  makeSmoothPath(lineChartPoints.value.map(p => ({ x: p.x, y: p.yAReceber })))
)
const areaPathReceita = computed(() => {
  const pts = lineChartPoints.value
  if (!pts.length) return ''
  const line = makeSmoothPath(pts.map(p => ({ x: p.x, y: p.yReceita })))
  return `${line} L ${pts[pts.length - 1].x.toFixed(2)},135 L ${pts[0].x.toFixed(2)},135 Z`
})
const areaPathDespesas = computed(() => {
  const pts = lineChartPoints.value
  if (!pts.length) return ''
  const line = makeSmoothPath(pts.map(p => ({ x: p.x, y: p.yDespesas })))
  return `${line} L ${pts[pts.length - 1].x.toFixed(2)},135 L ${pts[0].x.toFixed(2)},135 Z`
})
const areaPathAReceber = computed(() => {
  const pts = lineChartPoints.value
  if (!pts.length) return ''
  const line = makeSmoothPath(pts.map(p => ({ x: p.x, y: p.yAReceber })))
  return `${line} L ${pts[pts.length - 1].x.toFixed(2)},135 L ${pts[0].x.toFixed(2)},135 Z`
})

// ── Saúde Financeira ──────────────────────────────────────────────────────────
const adimplenciaScore = computed(() => {
  const total = contas.value.filter(c => c.status !== 'cancelado').length
  if (!total) return 100
  return (contas.value.filter(c => c.status === 'pago').length / total) * 100
})

const saudeScore = computed(() => {
  const margemPts = Math.min(Math.max(margemLucro.value, 0), 40)
  const adimPts = Math.min(adimplenciaScore.value * 0.4, 40)
  const crescPts = 10 + Math.max(Math.min(crescimentoMoM.value, 10), -10)
  return Math.min(Math.max(margemPts + adimPts + crescPts, 0), 100)
})

const saudeColor = computed(() => {
  if (saudeScore.value >= 70) return '#059669'
  if (saudeScore.value >= 40) return '#d97706'
  return '#dc2626'
})

const saudeGradient = computed(() => {
  if (saudeScore.value >= 70) return 'linear-gradient(90deg, #34d399, #059669)'
  if (saudeScore.value >= 40) return 'linear-gradient(90deg, #fbbf24, #d97706)'
  return 'linear-gradient(90deg, #f87171, #dc2626)'
})

const saudeLabel = computed(() => {
  if (saudeScore.value >= 70) return 'Excelente — continue assim!'
  if (saudeScore.value >= 50) return 'Boa — pequenos ajustes podem melhorar'
  if (saudeScore.value >= 30) return 'Atenção — avalie despesas e inadimplência'
  return 'Crítico — tome ação imediata para estabilizar'
})

// ── Insights ──────────────────────────────────────────────────────────────────
const insights = computed(() => {
  const tips: { msg: string; badgeClass: string }[] = []

  if (lucroBruto.value < 0) {
    tips.push({ msg: `Prejuízo de ${formatCurrency(Math.abs(lucroBruto.value))} este mês. Revise as despesas com urgência.`, badgeClass: 'bg-red-500' })
  } else if (margemLucro.value < 20) {
    tips.push({ msg: `Margem de ${margemLucro.value.toFixed(1)}% abaixo do ideal. Recomendado: 30%+. Analise custos variáveis.`, badgeClass: 'bg-amber-500' })
  } else if (margemLucro.value >= 40) {
    tips.push({ msg: `Margem de ${margemLucro.value.toFixed(1)}% excelente! Ótima relação entre receita e despesas.`, badgeClass: 'bg-emerald-500' })
  } else {
    tips.push({ msg: `Margem de ${margemLucro.value.toFixed(1)}% saudável. Mantenha o controle de despesas.`, badgeClass: 'bg-emerald-500' })
  }

  if (crescimentoMoM.value > 10) {
    tips.push({ msg: `Crescimento de ${crescimentoMoM.value.toFixed(1)}% vs mês anterior. Excelente ritmo de vendas!`, badgeClass: 'bg-emerald-500' })
  } else if (crescimentoMoM.value < -10) {
    tips.push({ msg: `Queda de ${Math.abs(crescimentoMoM.value).toFixed(1)}% na receita. Avalie agendamentos e promoções.`, badgeClass: 'bg-red-500' })
  }

  if (contasVencidas.value.length > 0) {
    tips.push({ msg: `${contasVencidas.value.length} conta(s) vencida(s) somando ${formatCurrency(totalVencidas.value)}. Regularize para evitar encargos.`, badgeClass: 'bg-red-500' })
  }

  if (contasProximos7.value.length > 0) {
    const totalProx = contasProximos7.value.reduce((s, c) => s + (c.valor ?? 0), 0)
    tips.push({ msg: `${contasProximos7.value.length} conta(s) vencendo em 7 dias — ${formatCurrency(totalProx)}. Prepare o caixa.`, badgeClass: 'bg-amber-500' })
  }

  if (adimplenciaScore.value < 60) {
    tips.push({ msg: `Adimplência de ${adimplenciaScore.value.toFixed(0)}%. Alta proporção de contas pendentes/vencidas.`, badgeClass: 'bg-amber-500' })
  }

  return tips.slice(0, 4)
})

// ── Fetch ─────────────────────────────────────────────────────────────────────
async function fetchAll() {
  loading.value = true
  await Promise.all([fetchVendas(), fetchContas(), fetchAgendamentos(), fetchOrdensServico()])
  loading.value = false
}

async function fetchVendas() {
  if (!empresaId.value) return
  const { data } = await supabase
    .from('vendas')
    .select('id, preco_veiculo, forma_pagamento, status, data_venda, vendas_itens(preco_unitario, quantidade, valor_total)')
    .eq('empresa_id', empresaId.value)
    .order('data_venda', { ascending: false })
  vendas.value = (data ?? []) as Venda[]
}

async function fetchContas() {
  if (!empresaId.value) return
  const { data } = await supabase
    .from('contas_pagar')
    .select('id, descricao, valor, data_vencimento, data_pagamento, status, categoria, tipo')
    .eq('empresa_id', empresaId.value)
    .order('data_vencimento', { ascending: false })
  contas.value = (data ?? []) as ContaPagar[]
}

async function fetchAgendamentos() {
  if (!empresaId.value) return
  const { data } = await supabase
    .from('agendamentos')
    .select('id, data_hora, status, valor_total')
    .eq('empresa_id', empresaId.value)
    .eq('status', 'concluido')
    .not('valor_total', 'is', null)
    .gt('valor_total', 0)
  agendamentos.value = (data ?? []) as Agendamento[]
}

async function fetchOrdensServico() {
  if (!empresaId.value) return
  const { data } = await supabase
    .from('ordens_servico_adesivo')
    .select('id, valor_total, status, data_entrega, data_aprovacao, forma_pagamento')
    .not('valor_total', 'is', null)
    .gt('valor_total', 0)
  ordensServico.value = (data ?? []) as OrdemServicoFinanceiro[]
}

onMounted(async () => {
  await loadEmpresa()
  await fetchAll()
})

// Realtime: atualiza dashboard ao vivo
useRealtimeMulti(['contas_pagar', 'vendas', 'agendamentos', 'ordens_servico_adesivo'], () => { fetchAll() })
</script>

<style scoped>
.bar-anim {
  transform-origin: bottom;
  animation: barGrow 0.5s ease-out both;
}

@keyframes barGrow {
  from { transform: scaleY(0); }
  to   { transform: scaleY(1); }
}
</style>
