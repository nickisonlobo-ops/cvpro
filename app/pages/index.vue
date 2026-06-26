<template>
  <div class="min-h-full bg-transparent p-3 sm:p-8">

    <!-- �.��.��.��.��.��.��.��.��.��.��.� VIS�fO FUNCIONÁRIO �.��.��.��.��.��.��.��.��.��.��.� -->
    <template v-if="!adminLoading && !isAdminOrGerente">
      <!-- Cabeçalho funcionário -->
      <div class="relative rounded-3xl overflow-hidden mb-7 shadow-xl">
        <div class="absolute inset-0" :style="{ background: 'var(--color-primary-bg, linear-gradient(135deg, #ec4899, #f43f5e))' }" />
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
        <PageLogo />

        <div class="relative px-4 sm:px-8 pt-6 pb-6">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-white/[0.15] backdrop-blur-sm border border-white/20 shadow-lg flex items-center justify-center">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
                </svg>
              </div>
              <div>
                <p class="text-xs font-bold text-white/80 uppercase tracking-widest">UpStudio</p>
                <h1 class="text-2xl font-black text-white leading-tight">
                  {{ funcionarioLogado ? `Olá, ${primeiroNome(funcionarioLogado.nome)}!` : 'Minhas Atividades' }}
                </h1>
                <p class="text-sm text-gray-300/80 mt-0.5">{{ dataHoje }}</p>
              </div>
            </div>
            <div v-if="funcionarioLogado" class="flex flex-wrap gap-2">
              <span class="inline-flex items-center gap-1.5 text-xs font-bold bg-white/10 border border-white/15 text-white px-3 py-1.5 rounded-xl">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"/></svg>
                {{ funcionarioLogado.cargo ?? 'Funcionário' }}
              </span>
              <span class="inline-flex items-center gap-1 text-xs font-bold bg-white/10 border border-white/15 text-white px-3 py-1.5 rounded-xl">
                <span class="w-2 h-2 rounded-full bg-primary" />
                {{ minhasAtividades.length }} atividade(s)
              </span>
            </div>
          </div>

          <!-- Stats rápidos -->
          <div v-if="funcionarioLogado && !loadingAtividades" class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            <div class="flex flex-col gap-1 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/10">
              <span class="text-[10px] font-bold text-primary/70 uppercase tracking-widest">Pendentes</span>
              <span class="text-xl font-black text-white">{{ countAtivStatus('pendente') }}</span>
            </div>
            <div class="flex flex-col gap-1 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/10">
              <span class="text-[10px] font-bold text-blue-300 uppercase tracking-widest">Em Andamento</span>
              <span class="text-xl font-black text-white">{{ countAtivStatus('em_andamento') }}</span>
            </div>
            <div class="flex flex-col gap-1 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/10">
              <span class="text-[10px] font-bold text-green-300 uppercase tracking-widest">Concluídas</span>
              <span class="text-xl font-black text-white">{{ countAtivStatus('concluida') }}</span>
            </div>
            <div class="flex flex-col gap-1 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/10">
              <span class="text-[10px] font-bold text-red-300 uppercase tracking-widest">Urgentes</span>
              <span class="text-xl font-black text-white">{{ minhasAtividades.filter(a => a.prioridade === 'urgente').length }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sem funcionário vinculado -->
      <div v-if="!loadingAtividades && !funcionarioLogado" class="flex flex-col items-center justify-center py-24 gap-4">
        <div class="w-16 h-16 rounded-2xl bg-primary-5 border border-primary-border flex items-center justify-center">
          <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>
        </div>
        <div class="text-center">
          <p class="text-base font-bold text-gray-700">Nenhum funcionário vinculado</p>
          <p class="text-sm text-gray-400 mt-1">Peça ao administrador para cadastrar seu e-mail na ficha de funcionário.</p>
        </div>
      </div>

      <!-- Loading -->
      <div v-else-if="loadingAtividades" class="flex items-center justify-center py-24">
        <span class="spinner spinner-md" />
      </div>

      <!-- Tabs e lista de atividades -->
      <template v-else-if="funcionarioLogado">
        <!-- ─── Kanban de agendamentos do funcionário ─── -->
        <div class="mb-8">
          <div class="flex items-center gap-3 mb-4">
            <svg class="w-5 h-5 shrink-0" :style="{ color: 'var(--color-primary, #ec4899)' }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/></svg>
            <h2 class="text-base font-bold text-gray-800 capitalize">{{ meuKanbanMesLabel }}</h2>
            <button type="button" class="text-xs font-semibold px-3 py-1.5 rounded-xl bg-primary-10 text-primary hover:bg-primary-10 transition-colors" @click="meuKanbanIrParaHoje">Hoje</button>
            <div class="ml-auto flex gap-2">
              <button type="button" class="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-primary-5 hover:text-primary transition-colors shadow-sm" @click="meuKanbanSemanaAnterior">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
              </button>
              <button type="button" class="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-primary-5 hover:text-primary transition-colors shadow-sm" @click="meuKanbanSemanaProxima">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>

          <div v-if="meuKanbanLoading" class="flex justify-center py-8">
            <div class="w-8 h-8 rounded-full border-4 border-gray-200 animate-spin" :style="{ borderTopColor: 'var(--color-primary, #ec4899)' }" />
          </div>

          <template v-else>
            <!-- Mobile: 4+3 -->
            <div class="sm:hidden space-y-2">
              <div class="grid grid-cols-4 gap-2">
                <div v-for="dia in meuKanbanDias.slice(0, 4)" :key="dia.iso" class="flex flex-col min-w-0">
                  <div class="flex flex-col items-center py-2 px-1 rounded-2xl mb-2 border transition-colors" :class="dia.ehHoje ? 'border-transparent shadow-md' : 'bg-white border-gray-200'" :style="dia.ehHoje ? { background: 'var(--color-primary-bg, linear-gradient(180deg,#ec4899,#f43f5e))' } : {}">
                    <span class="text-[10px] font-bold tracking-widest" :class="dia.ehHoje ? 'text-white/80' : 'text-gray-400'">{{ dia.diaSemana }}</span>
                    <span class="text-xl font-black leading-none mt-0.5" :class="dia.ehHoje ? 'text-white' : 'text-gray-800'">{{ dia.diaNum }}</span>
                    <span class="text-[10px] font-bold mt-1 rounded-full px-2 py-0.5" :class="dia.ehHoje ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'">{{ (meuKanbanPorDia[dia.iso] ?? []).length }}</span>
                  </div>
                  <div class="flex flex-col gap-1.5 flex-1 rounded-2xl p-1 min-h-[48px]">
                    <div v-for="ag in meuKanbanPorDia[dia.iso]" :key="ag.id" class="rounded-xl border shadow-sm px-2.5 py-2 bg-white border-gray-200/80">
                      <div class="h-0.5 w-full rounded-full mb-2" :class="agKanbanStatusCor(ag.status)" />
                      <p class="text-xs font-bold text-gray-900 truncate leading-tight">{{ ag.cliente_nome ?? ag.nome_solicitante ?? '\u2014' }}</p>
                      <p class="text-[10px] font-semibold mt-0.5" :style="{ color: 'var(--color-primary, #ec4899)' }">{{ agKanbanFormatHora(ag.data_hora) }}</p>
                      <p v-if="ag.servicos_nomes" class="text-[10px] text-gray-400 mt-0.5 truncate">{{ ag.servicos_nomes }}</p>
                      <p v-if="ag.funcionario_nome" class="text-[10px] text-indigo-500 font-semibold mt-0.5 truncate">👤 {{ ag.funcionario_nome }}</p>
                      <span class="inline-flex mt-1.5 items-center rounded-full px-1.5 py-0.5 text-[9px] font-semibold" :class="agKanbanStatusBadge(ag.status)">{{ agKanbanStatusLabel(ag.status) }}</span>
                      <a v-if="ag.cliente_telefone" :href="`https://wa.me/55${ag.cliente_telefone.replace(/\D/g, '')}`" target="_blank" rel="noopener noreferrer" class="mt-1.5 flex items-center justify-center w-full py-1 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors">
                        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex justify-center gap-2">
                <div v-for="dia in meuKanbanDias.slice(4)" :key="dia.iso" class="flex flex-col min-w-0 shrink-0 basis-[calc(25%-6px)]">
                  <div class="flex flex-col items-center py-2 px-1 rounded-2xl mb-2 border transition-colors" :class="dia.ehHoje ? 'border-transparent shadow-md' : 'bg-white border-gray-200'" :style="dia.ehHoje ? { background: 'var(--color-primary-bg, linear-gradient(180deg,#ec4899,#f43f5e))' } : {}">
                    <span class="text-[10px] font-bold tracking-widest" :class="dia.ehHoje ? 'text-white/80' : 'text-gray-400'">{{ dia.diaSemana }}</span>
                    <span class="text-xl font-black leading-none mt-0.5" :class="dia.ehHoje ? 'text-white' : 'text-gray-800'">{{ dia.diaNum }}</span>
                    <span class="text-[10px] font-bold mt-1 rounded-full px-2 py-0.5" :class="dia.ehHoje ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'">{{ (meuKanbanPorDia[dia.iso] ?? []).length }}</span>
                  </div>
                  <div class="flex flex-col gap-1.5 flex-1 rounded-2xl p-1 min-h-[48px]">
                    <div v-for="ag in meuKanbanPorDia[dia.iso]" :key="ag.id" class="rounded-xl border shadow-sm px-2.5 py-2 bg-white border-gray-200/80">
                      <div class="h-0.5 w-full rounded-full mb-2" :class="agKanbanStatusCor(ag.status)" />
                      <p class="text-xs font-bold text-gray-900 truncate leading-tight">{{ ag.cliente_nome ?? ag.nome_solicitante ?? '\u2014' }}</p>
                      <p class="text-[10px] font-semibold mt-0.5" :style="{ color: 'var(--color-primary, #ec4899)' }">{{ agKanbanFormatHora(ag.data_hora) }}</p>
                      <p v-if="ag.servicos_nomes" class="text-[10px] text-gray-400 mt-0.5 truncate">{{ ag.servicos_nomes }}</p>
                      <p v-if="ag.funcionario_nome" class="text-[10px] text-indigo-500 font-semibold mt-0.5 truncate">👤 {{ ag.funcionario_nome }}</p>
                      <span class="inline-flex mt-1.5 items-center rounded-full px-1.5 py-0.5 text-[9px] font-semibold" :class="agKanbanStatusBadge(ag.status)">{{ agKanbanStatusLabel(ag.status) }}</span>
                      <a v-if="ag.cliente_telefone" :href="`https://wa.me/55${ag.cliente_telefone.replace(/\D/g, '')}`" target="_blank" rel="noopener noreferrer" class="mt-1.5 flex items-center justify-center w-full py-1 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors">
                        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Desktop: 7 colunas -->
            <div class="hidden sm:grid grid-cols-7 gap-2">
              <div v-for="dia in meuKanbanDias" :key="dia.iso" class="flex flex-col min-w-0">
                <div class="flex flex-col items-center py-2 px-1 rounded-2xl mb-2 border transition-colors" :class="dia.ehHoje ? 'border-transparent shadow-md' : 'bg-white border-gray-200'" :style="dia.ehHoje ? { background: 'var(--color-primary-bg, linear-gradient(180deg,#ec4899,#f43f5e))' } : {}">
                  <span class="text-[10px] font-bold tracking-widest" :class="dia.ehHoje ? 'text-white/80' : 'text-gray-400'">{{ dia.diaSemana }}</span>
                  <span class="text-xl font-black leading-none mt-0.5" :class="dia.ehHoje ? 'text-white' : 'text-gray-800'">{{ dia.diaNum }}</span>
                  <span class="text-[10px] font-bold mt-1 rounded-full px-2 py-0.5" :class="dia.ehHoje ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'">{{ (meuKanbanPorDia[dia.iso] ?? []).length }}</span>
                </div>
                <div class="flex flex-col gap-1.5 flex-1 rounded-2xl p-1 min-h-[48px]">
                  <div v-for="ag in meuKanbanPorDia[dia.iso]" :key="ag.id" class="rounded-xl border shadow-sm px-2.5 py-2 bg-white border-gray-200/80">
                    <div class="h-0.5 w-full rounded-full mb-2" :class="agKanbanStatusCor(ag.status)" />
                    <p class="text-xs font-bold text-gray-900 truncate leading-tight">{{ ag.cliente_nome ?? ag.nome_solicitante ?? '\u2014' }}</p>
                    <p class="text-[10px] font-semibold mt-0.5" :style="{ color: 'var(--color-primary, #ec4899)' }">{{ agKanbanFormatHora(ag.data_hora) }}</p>
                    <p v-if="ag.servicos_nomes" class="text-[10px] text-gray-400 mt-0.5 truncate">{{ ag.servicos_nomes }}</p>
                    <p v-if="ag.funcionario_nome" class="text-[10px] text-indigo-500 font-semibold mt-0.5 truncate">👤 {{ ag.funcionario_nome }}</p>
                    <span class="inline-flex mt-1.5 items-center rounded-full px-1.5 py-0.5 text-[9px] font-semibold" :class="agKanbanStatusBadge(ag.status)">{{ agKanbanStatusLabel(ag.status) }}</span>
                    <a v-if="ag.cliente_telefone" :href="`https://wa.me/55${ag.cliente_telefone.replace(/\D/g, '')}`" target="_blank" rel="noopener noreferrer" class="mt-1.5 flex items-center justify-center w-full py-1 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors">
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Divisor -->
        <div class="flex items-center gap-3 mb-6">
          <div class="flex-1 h-px bg-gray-100" />
          <span class="text-[10px] font-black uppercase tracking-widest text-gray-400">Minhas Tarefas</span>
          <div class="flex-1 h-px bg-gray-100" />
        </div>

        <!-- Tabs -->
        <div class="flex gap-2 mb-6 overflow-x-auto pb-1">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            type="button"
            class="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-150"
            :class="tabAtiva === tab.value
              ? 'bg-primary text-primary-text shadow-md'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary'"
            @click="tabAtiva = tab.value"
          >
            {{ tab.label }}
            <span
              class="inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full text-xs font-black"
              :class="tabAtiva === tab.value ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'"
            >
              {{ atividadesPorTab(tab.value).length }}
            </span>
          </button>
        </div>

        <!-- Frase motivacional -->
        <div v-if="funcionarioLogado" class="mb-5 flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-gray-50 to-primary-5 border border-primary-border">
          <div class="shrink-0 w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>
          </div>
          <p class="text-sm font-semibold text-gray-800 leading-snug">{{ fraseAtual }}</p>
        </div>

        <!-- Cards de atividades -->
        <div v-if="atividadesPorTab(tabAtiva).length === 0" class="flex flex-col items-center justify-center py-20 gap-3">
          <svg class="w-14 h-14 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.25" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <span class="text-base font-semibold text-gray-400">Nenhuma atividade para este período</span>
        </div>

        <template v-else>
          <!-- Ativas -->
          <div v-if="ativasTab(tabAtiva).length > 0" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <div
            v-for="at in ativasTab(tabAtiva)"
            :key="at.id"
            class="group bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden relative"
            :class="at.status === 'em_andamento'
              ? 'border-blue-300 ring-2 ring-blue-100'
              : at.prioridade === 'urgente' ? 'border-red-200' : 'border-gray-100'"
          >
            <!-- Borda topo: barra animada se em andamento, cor de prioridade caso contrário -->
            <div v-if="at.status === 'em_andamento'" class="h-1 w-full bg-blue-100 overflow-hidden">
              <div class="h-full bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400 animate-[progress_2s_ease-in-out_infinite]" style="background-size:200% 100%" />
            </div>
            <div v-else class="h-1" :class="prioridadeAccent(at.prioridade)" />

            <!-- Cabeçalho premium do título -->
            <div class="relative px-5 pt-4 pb-3 overflow-hidden" :style="{ background: 'var(--color-primary-bg)' }">
              <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12),transparent_65%)]" />
              <div class="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/5" />
              <div class="relative flex items-start justify-between gap-2">
                <h3 class="font-black text-white text-sm leading-snug tracking-tight drop-shadow-sm">{{ at.titulo }}</h3>
                <span :class="['shrink-0 inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border',
                  at.status === 'em_andamento' ? 'bg-blue-500/20 border-blue-400/40 text-blue-200' :
                  at.status === 'pendente'     ? 'bg-primary/20 border-primary/40 text-white/80' :
                  'bg-white/10 border-white/20 text-white/80']">
                  <span v-if="at.status === 'em_andamento'" class="relative flex w-2 h-2">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-300 opacity-75" />
                    <span class="relative inline-flex rounded-full w-2 h-2 bg-blue-300" />
                  </span>
                  <span v-else :class="['w-1.5 h-1.5 rounded-full', statusDotClass(at.status)]" />
                  {{ statusLabel(at.status) }}
                </span>
              </div>
              <p v-if="at.descricao" class="relative mt-1.5 text-xs text-green-100/75 leading-relaxed line-clamp-2">{{ at.descricao }}</p>
            </div>

            <div class="px-5 py-4 flex flex-col gap-3">
              <div class="flex flex-wrap gap-2">
                <span :class="['inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full', prioridadeBadgeClass(at.prioridade)]">
                  {{ prioridadeLabel(at.prioridade) }}
                </span>
                <span :class="['inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full', periodicidadeBadgeClass(at.periodicidade)]">
                  {{ periodicidadeLabel(at.periodicidade) }}
                </span>
              </div>

              <div class="flex items-center justify-between pt-1 border-t border-gray-50">
                <div class="flex items-center gap-1.5 text-xs text-gray-400">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5"/></svg>
                  {{ at.data_atividade ? formatarData(at.data_atividade) : 'Sem data definida' }}
                </div>
                <div v-if="at.hora_inicio" class="flex items-center gap-1 text-xs text-gray-400">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75v5.25l3 1.5"/></svg>
                  {{ at.hora_inicio }}{{ at.hora_fim ? ` �?" ${at.hora_fim}` : '' }}
                </div>
              </div>

              <p v-if="at.observacao" class="text-xs text-gray-400 italic border-t border-gray-50 pt-2">{{ at.observacao }}</p>

              <!-- Botão alterar status -->
              <div class="flex gap-2 pt-1" v-if="at.status !== 'concluida' && at.status !== 'cancelada'">
                <button
                  v-if="at.status === 'pendente'"
                  type="button"
                  class="flex-1 text-xs font-bold py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100 transition-colors"
                  :disabled="atualizando === at.id"
                  @click="alterarStatus(at, 'em_andamento')"
                >
                  {{ atualizando === at.id ? '...' : 'Iniciar' }}
                </button>
                <button
                  v-if="at.status === 'em_andamento'"
                  type="button"
                  class="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 border border-green-100 transition-colors"
                  :disabled="atualizando === at.id"
                  @click="alterarStatus(at, 'concluida')"
                >
                  <svg v-if="atualizando !== at.id" class="w-3.5 h-3.5 animate-spin text-green-500" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg>
                  {{ atualizando === at.id ? '...' : 'Concluir' }}
                </button>
              </div>
              <div v-else-if="at.status === 'concluida'" class="flex items-center gap-1.5 text-xs font-bold text-green-600 pt-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Concluída
              </div>
            </div>
          </div>
          </div>

          <!-- Banner: tudo concluído nesta aba -->
          <div
            v-if="ativasTab(tabAtiva).length === 0 && concluidasTab(tabAtiva).length > 0"
            class="mb-6 relative overflow-hidden rounded-2xl p-5 shadow-lg"
            :style="{ background: 'var(--color-primary-bg)' }"
          >
            <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.2),transparent_60%)]" />
            <div class="relative flex items-center gap-4">
              <div class="shrink-0 w-14 h-14 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-3xl select-none">
                �Y�?
              </div>
              <div>
                <p class="text-base font-black text-white leading-tight">Parabéns, {{ funcionarioLogado ? primeiroNome(funcionarioLogado.nome) : 'campeão' }}!</p>
                <p class="text-sm text-white/80 mt-0.5">Todas as tarefas desta aba foram concluídas. Excelente trabalho! Continue assim! 🎉</p>
              </div>
            </div>
          </div>

          <!-- Divisor Concluídas -->
          <div v-if="concluidasTab(tabAtiva).length > 0" class="mt-8">
            <div class="flex items-center gap-3 mb-4">
              <div class="flex-1 h-px bg-primary-border" />
              <span class="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary-5 border border-primary-border px-3 py-1 rounded-full">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Concluídas ({{ concluidasTab(tabAtiva).length }})
              </span>
              <div class="flex-1 h-px bg-primary-10" />
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 opacity-70">
              <div
                v-for="at in concluidasTab(tabAtiva)"
                :key="at.id"
                class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <!-- Header concluída neutro -->
                <div class="px-5 pt-4 pb-3 bg-gray-50 border-b border-gray-100">
                  <div class="flex items-start justify-between gap-2">
                    <div class="flex items-start gap-2">
                      <svg class="w-4 h-4 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      <h3 class="font-semibold text-gray-400 text-sm leading-snug line-through decoration-gray-300">{{ at.titulo }}</h3>
                    </div>
                    <span class="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                      <span class="w-1.5 h-1.5 rounded-full bg-green-500" />
                      Concluída
                    </span>
                  </div>
                  <p v-if="at.descricao" class="mt-1 text-xs text-gray-400 leading-relaxed line-clamp-2">{{ at.descricao }}</p>
                </div>

                <div class="px-5 py-3 flex flex-wrap gap-2">
                  <span :class="['inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full', prioridadeBadgeClass(at.prioridade)]">
                    {{ prioridadeLabel(at.prioridade) }}
                  </span>
                  <span :class="['inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full', periodicidadeBadgeClass(at.periodicidade)]">
                    {{ periodicidadeLabel(at.periodicidade) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
    </template>

    <!-- �.��.��.��.��.��.��.��.��.��.��.� VIS�fO ADMIN �.��.��.��.��.��.��.��.��.��.��.� -->
    <template v-if="!adminLoading && isAdminOrGerente">

      <!-- Header compacto -->
      <section class="relative overflow-hidden rounded-3xl shadow-xl mb-6" :style="{ background: 'var(--color-primary-bg)' }">
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
        <div class="relative px-6 sm:px-10 py-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p class="text-[11px] font-bold uppercase tracking-[0.25em] text-white/80 mb-1">UpStudio · Painel Admin</p>
            <h1 class="text-xl sm:text-3xl font-black text-white leading-tight">Visão Geral do Negócio</h1>
            <p class="text-sm text-gray-300/70 mt-1">{{ dataHoje }}</p>
          </div>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all"
              :class="filtroAberto ? 'bg-white text-primary shadow-lg' : 'bg-white/10 text-white hover:bg-white/20 border border-white/15'"
              @click="filtroAberto = !filtroAberto"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/></svg>
              Filtros
              <span v-if="filtroPeriodo !== 'mes_atual'" class="w-2 h-2 rounded-full bg-primary" />
            </button>
            <div class="shrink-0 w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      <!-- FILTRO AVANÇADO -->
      <Transition name="slide-down">
        <div v-if="filtroAberto" class="bg-white rounded-3xl border border-gray-100 shadow-md mb-6 overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/60">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/></svg>
              <span class="text-sm font-black text-gray-700">Filtro Avançado</span>
            </div>
            <button type="button" class="text-xs font-bold text-primary hover:text-primary" @click="resetarFiltros">Redefinir</button>
          </div>
          <div class="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <!-- Período financeiro -->
            <div>
              <p class="text-[10px] font-black uppercase tracking-widest text-primary mb-3">Período</p>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="opt in periodoOpcoes"
                  :key="opt.value"
                  type="button"
                  class="flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all text-left"
                  :class="filtroPeriodo === opt.value ? 'bg-primary-5 border-primary-border text-primary' : 'border-gray-200 text-gray-600 hover:border-primary-border hover:text-primary'"
                  @click="filtroPeriodo = opt.value; aplicarFiltros()"
                >
                  <span class="w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0" :class="filtroPeriodo === opt.value ? 'border-primary' : 'border-gray-300'">
                    <span v-if="filtroPeriodo === opt.value" class="w-1.5 h-1.5 rounded-full bg-primary" />
                  </span>
                  {{ opt.label }}
                </button>
              </div>
            </div>

            <!-- Mês/Ano específico -->
            <div>
              <p class="text-[10px] font-black uppercase tracking-widest text-primary mb-3">Mês / Ano Específico</p>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-gray-500 mb-1.5">Mês</label>
                  <select
                    v-model="filtroMes"
                    class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    @change="filtroPeriodo = 'personalizado'; aplicarFiltros()"
                  >
                    <option v-for="m in mesesOpcoes" :key="m.value" :value="m.value">{{ m.label }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-500 mb-1.5">Ano</label>
                  <select
                    v-model="filtroAno"
                    class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    @change="filtroPeriodo = 'personalizado'; aplicarFiltros()"
                  >
                    <option v-for="a in anosOpcoes" :key="a" :value="a">{{ a }}</option>
                  </select>
                </div>
              </div>
              <div class="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
                <svg class="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                Exibindo: <span class="font-bold text-gray-600 ml-0.5">{{ periodoLabelAtual }}</span>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Financeiro -->
      <div class="mb-3 flex items-center gap-2 px-1">
        <span class="text-[11px] font-black uppercase tracking-widest text-gray-400">Financeiro</span>
        <div class="flex-1 h-px bg-primary-10" />
        <span class="text-[10px] font-bold text-primary">{{ periodoLabelAtual }}</span>
      </div>
      <div class="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-6">

        <!-- Faturamento -->
        <div class="relative overflow-hidden rounded-2xl bg-white border border-primary-10 p-4 shadow-sm">


          <div class="relative flex items-center gap-2 mb-3">
            <svg class="w-5 h-5 shrink-0" style="color: var(--color-card-texto, #374151); opacity: 0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span class="text-[10px] font-black uppercase tracking-widest text-gray-400">Faturamento / Mês</span>
          </div>
          <p class="relative text-lg sm:text-2xl font-black text-gray-900 truncate">{{ resumoLoading ? '...' : formatCurrency(faturamentoMes) }}</p>
          <p class="relative text-[11px] text-gray-500 mt-1">agendamentos confirmados</p>
        </div>

        <!-- Agendamentos do mês -->
        <div class="relative overflow-hidden rounded-2xl bg-white border border-primary-10 p-4 shadow-sm">


          <div class="relative flex items-center gap-2 mb-3">
            <svg class="w-5 h-5 shrink-0" style="color: var(--color-card-texto, #374151); opacity: 0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/></svg>
            <span class="text-[10px] font-black uppercase tracking-widest text-gray-400">Agendamentos / Mês</span>
          </div>
          <p class="relative text-2xl font-black text-gray-900">{{ resumoLoading ? '...' : agendamentosMes }}</p>
          <p class="relative text-[11px] text-gray-500 mt-1">este mês</p>
        </div>

        <!-- Contas a pagar -->
        <div class="relative overflow-hidden rounded-2xl bg-white border border-primary-10 p-4 shadow-sm">


          <div class="relative flex items-center gap-2 mb-3">
            <svg class="w-5 h-5 shrink-0" style="color: var(--color-card-texto, #374151); opacity: 0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"/></svg>
            <span class="text-[10px] font-black uppercase tracking-widest text-gray-400">Contas a Pagar</span>
          </div>
          <p class="relative text-lg sm:text-xl font-black text-gray-900 truncate">{{ resumoLoading ? '...' : formatCurrency(valorContasPagar) }}</p>
          <div class="relative flex items-center gap-1.5 mt-1">
            <span class="text-[11px] text-gray-500">em aberto</span>
            <span class="inline-flex items-center justify-center text-[10px] font-black px-1.5 py-0.5 rounded-full bg-primary-5 text-gray-600 border border-primary-10">
              {{ resumoLoading ? '...' : totalContasPagar }} conta{{ totalContasPagar !== 1 ? 's' : '' }}
            </span>
          </div>
        </div>

        <!-- Contas vencidas -->
        <div class="relative overflow-hidden rounded-2xl bg-white border border-primary-10 p-4 shadow-sm">


          <div class="relative flex items-center gap-2 mb-3">
            <svg class="w-5 h-5 shrink-0" :class="contasVencidas > 0 ? 'text-red-400' : ''" :style="contasVencidas > 0 ? {} : { color: 'var(--color-card-texto, #374151)', opacity: '0.5' }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>
            <span class="text-[10px] font-black uppercase tracking-widest text-gray-400">Vencidas</span>
          </div>
          <p class="relative text-2xl font-black text-gray-900 flex items-center gap-2">
            {{ resumoLoading ? '...' : contasVencidas }}
            <span v-if="contasVencidas > 0" class="inline-block w-2 h-2 rounded-full bg-red-400 animate-ping" />
          </p>
          <p class="relative text-[11px] mt-1" :class="contasVencidas > 0 ? 'text-red-500' : 'text-gray-500'">
            {{ contasVencidas > 0 ? 'atenção necessária' : 'tudo em dia ✅' }}
          </p>
        </div>
      </div>

      <!-- Operacional -->
      <div class="mb-3 flex items-center gap-2 px-1">
        <span class="text-[11px] font-black uppercase tracking-widest text-gray-400">Operacional</span>
        <div class="flex-1 h-px bg-primary-10" />
        <span class="text-[10px] font-bold text-primary">{{ periodoLabelAtual }}</span>
      </div>
      <div class="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-8">

        <!-- Ticket Médio -->
        <div class="relative overflow-hidden rounded-2xl bg-white border border-primary-10 p-4 shadow-sm">


          <div class="relative flex items-center gap-2 mb-3">
            <svg class="w-5 h-5 shrink-0" style="color: var(--color-card-texto, #374151); opacity: 0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/></svg>
            <span class="text-[10px] font-black uppercase tracking-widest text-gray-400">Ticket Médio</span>
          </div>
          <p class="relative text-lg sm:text-2xl font-black text-gray-900 truncate">{{ resumoLoading ? '...' : formatCurrency(ticketMedio) }}</p>
          <p class="relative text-[11px] text-gray-500 mt-1">por agendamento este mês</p>
        </div>

        <!-- Produtos em estoque -->
        <div class="relative overflow-hidden rounded-2xl bg-white border border-primary-10 p-4 shadow-sm">


          <div class="relative flex items-center gap-2 mb-3">
            <svg class="w-5 h-5 shrink-0" style="color: var(--color-card-texto, #374151); opacity: 0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/></svg>
            <span class="text-[10px] font-black uppercase tracking-widest text-gray-400">Produtos</span>
          </div>
          <p class="relative text-2xl font-black text-gray-900">{{ resumoLoading ? '...' : produtosTotal }}</p>
          <div class="relative flex items-center gap-2 mt-1 flex-wrap">
            <span v-if="produtosBaixoEstoque > 0" class="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary-10 text-primary">
              <span class="w-1.5 h-1.5 rounded-full bg-primary" />{{ produtosBaixoEstoque }} estoque baixo
            </span>
            <span v-else class="text-[11px] text-gray-500">todos ok</span>
          </div>
        </div>

        <!-- Tarefas Hoje -->
        <div class="relative overflow-hidden rounded-2xl bg-white border border-primary-10 p-4 shadow-sm">


          <div class="relative flex items-center gap-2 mb-3">
            <svg class="w-5 h-5 shrink-0" style="color: var(--color-card-texto, #374151); opacity: 0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
            <span class="text-[10px] font-black uppercase tracking-widest text-gray-400">Tarefas Hoje</span>
          </div>
          <p class="relative text-2xl font-black text-gray-900">{{ resumoLoading ? '...' : tarefasHoje }}</p>
          <p class="relative text-[11px] text-gray-500 mt-1">{{ resumoLoading ? '' : tarefasConcluidasHoje + ' concluídas hoje' }}</p>
        </div>

        <!-- Clientes -->
        <div class="relative overflow-hidden rounded-2xl bg-white border border-primary-10 p-4 shadow-sm">


          <div class="relative flex items-center gap-2 mb-3">
            <svg class="w-5 h-5 shrink-0" style="color: var(--color-card-texto, #374151); opacity: 0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg>
            <span class="text-[10px] font-black uppercase tracking-widest text-gray-400">Clientes</span>
          </div>
          <p class="relative text-2xl font-black text-gray-900">{{ resumoLoading ? '...' : totalClientes }}</p>
          <p class="relative text-[11px] text-gray-500 mt-1">cadastrados</p>
        </div>
      </div>

      <!-- Atalhos -->
      <div class="mb-3 flex items-center gap-2 px-1">
        <span class="text-[11px] font-black uppercase tracking-widest text-gray-400">Atalhos</span>
        <div class="flex-1 h-px bg-primary-10" />
      </div>
      <div class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
        <NuxtLink
          v-for="atalho in atalhosVisiveis"
          :key="atalho.to"
          :to="atalho.to"
          class="group relative overflow-hidden flex flex-col items-center justify-center gap-2.5 py-5 px-2 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          :style="{ background: 'var(--color-primary-bg, var(--color-primary, #ec4899))' }"
        >
          <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_65%)] pointer-events-none" />
          <AppNavIcon
            :name="atalho.icon"
            class="relative w-6 h-6 text-white transition-transform duration-200 group-hover:scale-110"
          />
          <span class="relative text-[11px] font-bold text-white/90 text-center leading-tight">{{ atalho.title }}</span>
        </NuxtLink>
      </div>

    </template>

    <!-- Loading inicial -->
    <div v-if="adminLoading" class="flex items-center justify-center py-32">
      <span class="spinner spinner-md" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useAdmin } from '~/composables/useAdmin'
import { useEmpresa } from '~/composables/useEmpresa'
import { createSupabaseClient } from '~/lib/supabase'
import AppNavIcon from '~/components/AppNavIcon.vue'

const supabase = createSupabaseClient()
const { isAdmin, isAdminOrGerente, adminLoading } = useAdmin()
const { empresaId, userPerfil, loadEmpresa } = useEmpresa()

// �"?�"? ADMIN: resumo �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?
const resumoLoading      = ref(true)
const totalClientes      = ref(0)
const clientesAtivos     = ref(0)
const agendamentosMes    = ref(0)
const faturamentoMes     = ref(0)
const totalContasPagar   = ref(0)
const valorContasPagar   = ref(0)
const contasVencidas     = ref(0)
const tarefasHoje           = ref(0)
const tarefasConcluidasHoje = ref(0)
const tarefasPendentes      = ref(0)
const produtosTotal         = ref(0)
const produtosBaixoEstoque  = ref(0)
const ticketMedio           = ref(0)

// ── Filtros painel admin ────────────────────────────────────────────────────
const filtroAberto = ref(false)
const filtroPeriodo = ref<'mes_atual' | 'semana_atual' | 'trimestre' | 'ano_atual' | 'personalizado'>('mes_atual')
const filtroMes = ref(new Date().getMonth() + 1)
const filtroAno = ref(new Date().getFullYear())
const filtroOp = reactive({ agendamentos: true, contas: true, estoque: true, tarefas: true })

const periodoOpcoes = [
  { value: 'mes_atual',    label: 'Mes Atual' },
  { value: 'semana_atual', label: 'Semana Atual' },
  { value: 'trimestre',    label: 'Trimestre Atual' },
  { value: 'ano_atual',    label: 'Ano Atual' },
]

const mesesOpcoes = [
  { value: 1, label: 'Janeiro' }, { value: 2, label: 'Fevereiro' }, { value: 3, label: 'Marco' },
  { value: 4, label: 'Abril' },   { value: 5, label: 'Maio' },      { value: 6, label: 'Junho' },
  { value: 7, label: 'Julho' },   { value: 8, label: 'Agosto' },    { value: 9, label: 'Setembro' },
  { value: 10, label: 'Outubro' },{ value: 11, label: 'Novembro' }, { value: 12, label: 'Dezembro' },
]

const anosOpcoes = computed(() => {
  const y = new Date().getFullYear()
  return [y - 2, y - 1, y, y + 1]
})

const periodoLabelAtual = computed(() => {
  if (filtroPeriodo.value === 'mes_atual') {
    const now = new Date()
    return now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  }
  if (filtroPeriodo.value === 'semana_atual') return 'Esta semana'
  if (filtroPeriodo.value === 'trimestre') {
    const m = new Date().getMonth()
    const q = Math.floor(m / 3) + 1
    return String(q) + 'o Trimestre ' + String(new Date().getFullYear())
  }
  if (filtroPeriodo.value === 'ano_atual') return 'Ano ' + String(new Date().getFullYear())
  if (filtroPeriodo.value === 'personalizado') {
    const mes = mesesOpcoes.find(m => m.value === filtroMes.value)?.label ?? ''
    return mes + ' ' + String(filtroAno.value)
  }
  return ''
})

function getPeriodoRange(): { inicio: string; fim: string } {
  const now = new Date()
  const y = now.getFullYear(), m = now.getMonth()
  if (filtroPeriodo.value === 'mes_atual')
    return { inicio: new Date(y, m, 1).toISOString().slice(0, 10), fim: new Date(y, m + 1, 0).toISOString().slice(0, 10) }
  if (filtroPeriodo.value === 'semana_atual') {
    const d = new Date(now); const day = d.getDay()
    const mon = new Date(d); mon.setDate(d.getDate() + (day === 0 ? -6 : 1 - day))
    const sun = new Date(mon); sun.setDate(mon.getDate() + 6)
    return { inicio: mon.toISOString().slice(0, 10), fim: sun.toISOString().slice(0, 10) }
  }
  if (filtroPeriodo.value === 'trimestre') {
    const q = Math.floor(m / 3)
    return { inicio: new Date(y, q * 3, 1).toISOString().slice(0, 10), fim: new Date(y, q * 3 + 3, 0).toISOString().slice(0, 10) }
  }
  if (filtroPeriodo.value === 'ano_atual') return { inicio: y + '-01-01', fim: y + '-12-31' }
  const pm = filtroMes.value - 1, py = filtroAno.value
  return { inicio: new Date(py, pm, 1).toISOString().slice(0, 10), fim: new Date(py, pm + 1, 0).toISOString().slice(0, 10) }
}

function resetarFiltros() {
  filtroPeriodo.value = 'mes_atual'
  filtroMes.value = new Date().getMonth() + 1
  filtroAno.value = new Date().getFullYear()
  filtroOp.agendamentos = true; filtroOp.contas = true; filtroOp.estoque = true; filtroOp.tarefas = true
  aplicarFiltros()
}

async function aplicarFiltros() {
  resumoLoading.value = true
  const { inicio, fim } = getPeriodoRange()
  const todayIso = new Date().toISOString().slice(0, 10)

  const [clientesResp, agendamentosResp, contasResp, tarefasResp, produtosResp] = await Promise.all([
    supabase.from('clientes').select('ativo').eq('empresa_id', empresaId.value!),
    filtroOp.agendamentos
      ? supabase.from('agendamentos').select('valor_total, data_hora, status').eq('empresa_id', empresaId.value!).gte('data_hora', inicio).lte('data_hora', fim + 'T23:59:59')
      : Promise.resolve({ data: [], error: null }),
    filtroOp.contas
      ? supabase.from('contas_pagar').select('valor, data_vencimento, status').eq('empresa_id', empresaId.value!).gte('data_vencimento', inicio).lte('data_vencimento', fim)
      : Promise.resolve({ data: [], error: null }),
    filtroOp.tarefas
      ? supabase.from('atividades_funcionarios').select('status, data_atividade').eq('empresa_id', empresaId.value!).gte('data_atividade', inicio).lte('data_atividade', fim)
      : Promise.resolve({ data: [], error: null }),
    filtroOp.estoque
      ? supabase.from('produtos_casa_racao').select('estoque, ativo').eq('empresa_id', empresaId.value!)
      : Promise.resolve({ data: [], error: null }),
  ])

  const clientes = clientesResp.data ?? []
  totalClientes.value = clientes.length
  clientesAtivos.value = clientes.filter((c: any) => c.ativo !== false).length

  const agendamentos = agendamentosResp.data ?? []
  const confirmados = agendamentos.filter((a: any) => a.status !== 'cancelado')
  agendamentosMes.value = agendamentos.length
  faturamentoMes.value = confirmados.reduce((sum: number, a: any) => sum + Number(a.valor_total ?? 0), 0)
  ticketMedio.value = confirmados.length > 0 ? faturamentoMes.value / confirmados.length : 0

  const contas = (contasResp.data ?? []).filter((c: any) => c.status !== 'pago' && c.status !== 'cancelado')
  totalContasPagar.value = contas.length
  valorContasPagar.value = contas.reduce((sum: number, c: any) => sum + Number(c.valor ?? 0), 0)
  contasVencidas.value = contas.filter((c: any) => c.data_vencimento && c.data_vencimento < todayIso).length

  const tf = tarefasResp.data ?? []
  tarefasHoje.value = tf.length
  tarefasConcluidasHoje.value = tf.filter((t: any) => t.status === 'concluida').length
  tarefasPendentes.value = tf.filter((t: any) => t.status === 'pendente').length

  const prods = (produtosResp.data ?? []).filter((p: any) => p.ativo !== false)
  produtosTotal.value = prods.length
  produtosBaixoEstoque.value = prods.filter((p: any) => p.estoque <= 5).length

  resumoLoading.value = false
}

// �"?�"? FUNCIONÁRIO: atividades �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?
interface AtividadeFuncionario {
  id: number
  titulo: string
  descricao: string | null
  status: string | null
  prioridade: string | null
  periodicidade: string | null
  data_atividade: string | null
  hora_inicio: string | null
  hora_fim: string | null
  observacao: string | null
}
interface FuncionarioLite { id: number; nome: string; cargo: string | null }

const funcionarioLogado  = ref<FuncionarioLite | null>(null)
const minhasAtividades   = ref<AtividadeFuncionario[]>([])
const loadingAtividades  = ref(true)
const atualizando        = ref<number | null>(null)
const tabAtiva           = ref<'hoje' | 'semana' | 'quinzena' | 'mes'>('hoje')

const tabs = [
  { label: 'Hoje',     value: 'hoje'     },
  { label: 'Semana',   value: 'semana'   },
  { label: 'Quinzena', value: 'quinzena' },
  { label: 'Mês',      value: 'mes'      },
] as const

// �"?�"? Datas de referência �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?
const hoje = new Date()
hoje.setHours(0, 0, 0, 0)

const dataHoje = hoje.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })

function toISODate(d: Date) {
  return d.toISOString().slice(0, 10)
}

function inicioSemana(): Date {
  const d = new Date(hoje)
  const dia = d.getDay() // 0=Dom
  d.setDate(d.getDate() - dia)
  return d
}
function fimSemana(): Date {
  const d = new Date(inicioSemana())
  d.setDate(d.getDate() + 6)
  return d
}
function inicioQuinzena(): Date {
  const d = new Date(hoje)
  d.setDate(hoje.getDate() <= 15 ? 1 : 16)
  return d
}
function fimQuinzena(): Date {
  const d = new Date(hoje)
  if (hoje.getDate() <= 15) {
    d.setDate(15)
  } else {
    d.setMonth(d.getMonth() + 1, 0) // último dia do mês
  }
  return d
}
function inicioMes(): Date {
  return new Date(hoje.getFullYear(), hoje.getMonth(), 1)
}
function fimMes(): Date {
  return new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0)
}

function ativasTab(tab: string): AtividadeFuncionario[] {
  return atividadesPorTab(tab).filter(a => a.status !== 'concluida' && a.status !== 'cancelada')
}
function concluidasTab(tab: string): AtividadeFuncionario[] {
  return atividadesPorTab(tab).filter(a => a.status === 'concluida')
}

const frasesMotivacionais = [
  'Cada cliente que sai daqui carrega sua arte no rosto!',
  'Beleza é o reflexo do cuidado que você dedica a cada atendimento.',
  'Um serviço especial faz toda a diferença no dia do cliente!',
  'Sua habilidade transforma autoestima — isso é incrível!',
  'Organização e dedicação são o segredo de um salão de sucesso.',
  'Hoje é mais um dia para encantar e fazer a diferença!',
  'Cada detalhe importa quando o objetivo é a excelência.',
  'Clientes satisfeitos são a melhor propaganda do seu trabalho.',
]
const fraseAtual = computed(() => {
  const idx = new Date().getDate() % frasesMotivacionais.length
  return frasesMotivacionais[idx]
})

function atividadesPorTab(tab: string): AtividadeFuncionario[] {
  const todaIso = toISODate(hoje)
  return minhasAtividades.value.filter(a => {
    const dataAtiv = a.data_atividade
    if (tab === 'hoje') {
      // diárias de hoje OU sem data definida com periodicidade diária
      if (a.periodicidade === 'diaria') {
        return !dataAtiv || dataAtiv === todaIso
      }
      return dataAtiv === todaIso
    }
    if (tab === 'semana') {
      if (a.periodicidade !== 'diaria') return false
      if (!dataAtiv) return true // recorrente diária sem data fixa
      return dataAtiv >= toISODate(inicioSemana()) && dataAtiv <= toISODate(fimSemana())
    }
    if (tab === 'quinzena') {
      if (a.periodicidade !== 'quinzenal') return false
      if (!dataAtiv) return true
      return dataAtiv >= toISODate(inicioQuinzena()) && dataAtiv <= toISODate(fimQuinzena())
    }
    if (tab === 'mes') {
      if (a.periodicidade !== 'mensal') return false
      if (!dataAtiv) return true
      return dataAtiv >= toISODate(inicioMes()) && dataAtiv <= toISODate(fimMes())
    }
    return false
  })
}

function countAtivStatus(s: string) {
  return minhasAtividades.value.filter(a => a.status === s).length
}

function primeiroNome(nome: string) {
  return nome.split(' ')[0]
}

function formatarData(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

function statusLabel(s: string | null) {
  if (s === 'pendente')     return 'Pendente'
  if (s === 'em_andamento') return 'Em Andamento'
  if (s === 'concluida')    return 'Concluída'
  if (s === 'cancelada')    return 'Cancelada'
  return s ?? '�?"'
}
function statusBadgeClass(s: string | null) {
  if (s === 'pendente')     return 'bg-primary-10 text-primary'
  if (s === 'em_andamento') return 'bg-blue-100 text-blue-700'
  if (s === 'concluida')    return 'bg-green-100 text-green-700'
  if (s === 'cancelada')    return 'bg-red-100 text-red-700'
  return 'bg-gray-100 text-gray-500'
}
function statusDotClass(s: string | null) {
  if (s === 'pendente')     return 'bg-primary'
  if (s === 'em_andamento') return 'bg-blue-500'
  if (s === 'concluida')    return 'bg-green-500'
  if (s === 'cancelada')    return 'bg-red-500'
  return 'bg-gray-400'
}
function prioridadeLabel(p: string | null) {
  if (p === 'baixa')   return 'Baixa'
  if (p === 'media')   return 'Média'
  if (p === 'alta')    return 'Alta'
  if (p === 'urgente') return 'Urgente'
  return p ?? '�?"'
}
function prioridadeBadgeClass(p: string | null) {
  if (p === 'baixa')   return 'bg-gray-100 text-gray-600'
  if (p === 'media')   return 'bg-sky-100 text-sky-700'
  if (p === 'alta')    return 'bg-orange-100 text-orange-700'
  if (p === 'urgente') return 'bg-red-100 text-red-700'
  return 'bg-gray-100 text-gray-500'
}
function prioridadeAccent(p: string | null) {
  if (p === 'baixa')   return 'bg-gray-300'
  if (p === 'media')   return 'bg-sky-400'
  if (p === 'alta')    return 'bg-orange-400'
  if (p === 'urgente') return 'bg-red-500'
  return 'bg-gray-200'
}
function periodicidadeLabel(p: string | null) {
  if (p === 'diaria')    return 'Diária'
  if (p === 'quinzenal') return 'Quinzenal'
  if (p === 'mensal')    return 'Mensal'
  return p ?? '�?"'
}
function periodicidadeBadgeClass(p: string | null) {
  if (p === 'diaria')    return 'bg-primary-10 text-primary'
  if (p === 'quinzenal') return 'bg-teal-100 text-teal-700'
  if (p === 'mensal')    return 'bg-rose-100 text-rose-700'
  return 'bg-gray-100 text-gray-500'
}

async function alterarStatus(at: AtividadeFuncionario, novoStatus: string) {
  atualizando.value = at.id
  await supabase.from('atividades_funcionarios').update({ status: novoStatus }).eq('id', at.id)
  at.status = novoStatus
  atualizando.value = null
}

// ── Kanban de agendamentos do funcionário ────────────────────
interface AgKanban {
  id: number
  data_hora: string
  status: string
  cliente_nome: string | null
  nome_solicitante: string | null
  cliente_telefone: string | null
  servicos_nomes: string | null
  funcionario_nome: string | null
}

const meuKanban          = ref<AgKanban[]>([])
const meuKanbanLoading   = ref(false)

function getMondayOfWeekFun(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day))
  d.setHours(0, 0, 0, 0)
  return d
}

const meuKanbanSemanaInicio = ref<Date>(getMondayOfWeekFun(new Date()))
const hojeIso = new Date().toISOString().split('T')[0]

const meuKanbanDias = computed(() =>
  Array.from({ length: 7 }, (_, i) => {
    const d = new Date(meuKanbanSemanaInicio.value)
    d.setDate(d.getDate() + i)
    const iso = d.toISOString().split('T')[0]
    return {
      iso,
      diaSemana: d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '').toUpperCase(),
      diaNum: d.toLocaleDateString('pt-BR', { day: '2-digit' }),
      ehHoje: iso === hojeIso,
    }
  })
)

const meuKanbanMesLabel = computed(() => {
  const dias = meuKanbanDias.value
  const inicio = new Date(dias[0].iso + 'T12:00:00')
  const fim    = new Date(dias[6].iso + 'T12:00:00')
  if (inicio.getMonth() === fim.getMonth())
    return inicio.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  return `${inicio.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')} – ${fim.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }).replace('.', '')}`
})

const meuKanbanPorDia = computed(() => {
  const map: Record<string, AgKanban[]> = {}
  meuKanbanDias.value.forEach(d => { map[d.iso] = [] })
  meuKanban.value.forEach(ag => {
    const key = ag.data_hora.slice(0, 10)
    if (map[key]) map[key].push(ag)
  })
  Object.keys(map).forEach(k => map[k].sort((a, b) => a.data_hora.localeCompare(b.data_hora)))
  return map
})

function meuKanbanSemanaAnterior() {
  const d = new Date(meuKanbanSemanaInicio.value)
  d.setDate(d.getDate() - 7)
  meuKanbanSemanaInicio.value = d
}
function meuKanbanSemanaProxima() {
  const d = new Date(meuKanbanSemanaInicio.value)
  d.setDate(d.getDate() + 7)
  meuKanbanSemanaInicio.value = d
}
function meuKanbanIrParaHoje() {
  meuKanbanSemanaInicio.value = getMondayOfWeekFun(new Date())
}

function agKanbanFormatHora(iso: string) { return iso.slice(11, 16) }

function agKanbanStatusCor(s: string) {
  return { solicitado: 'bg-amber-400', agendado: 'bg-blue-400', confirmado: 'bg-green-400', concluido: 'bg-violet-500', cancelado: 'bg-red-400', faltou: 'bg-orange-400' }[s] ?? 'bg-gray-300'
}
function agKanbanStatusBadge(s: string) {
  return { solicitado: 'bg-amber-100 text-amber-700', agendado: 'bg-blue-100 text-blue-700', confirmado: 'bg-green-100 text-green-700', concluido: 'bg-primary-10 text-primary', cancelado: 'bg-red-100 text-red-600', faltou: 'bg-orange-100 text-orange-600' }[s] ?? 'bg-gray-100 text-gray-600'
}
function agKanbanStatusLabel(s: string) {
  return { solicitado: 'Solicitado', agendado: 'Agendado', confirmado: 'Confirmado', concluido: 'Concluído', cancelado: 'Cancelado', faltou: 'Faltou' }[s] ?? s
}

async function fetchMeuKanban(userId: string, funcId: number, eId: number) {
  meuKanbanLoading.value = true

  // Estratégia 1: agendamentos onde funcionario_id = uuid do usuário logado
  const { data: rowsByUuid } = await supabase
    .from('agendamentos')
    .select('id, data_hora, status, nome_solicitante, telefone_solicitante, funcionario_id, clientes(nome, telefone)')
    .eq('empresa_id', eId)
    .eq('funcionario_id', userId)
    .not('status', 'in', '(cancelado,faltou)')
    .order('data_hora', { ascending: true })

  // Estratégia 2: agendamentos cujo serviço está vinculado ao funcionário (bigint id)
  // — cobre os casos em que funcionario_id ainda é null no banco
  const { data: meusSvcs } = await supabase
    .from('servico_funcionarios')
    .select('servico_id')
    .eq('funcionario_id', funcId)

  const meusSvcIds = (meusSvcs ?? []).map((s: any) => Number(s.servico_id))
  let rowsByServico: any[] = []
  if (meusSvcIds.length) {
    const { data: agLinks } = await supabase
      .from('agendamento_servicos')
      .select('agendamento_id')
      .in('servico_id', meusSvcIds)

    const agIds = [...new Set((agLinks ?? []).map((l: any) => Number(l.agendamento_id)))]
    if (agIds.length) {
      const { data: rowsSvc } = await supabase
        .from('agendamentos')
        .select('id, data_hora, status, nome_solicitante, telefone_solicitante, funcionario_id, clientes(nome, telefone)')
        .eq('empresa_id', eId)
        .in('id', agIds)
        .not('status', 'in', '(cancelado,faltou)')
        .order('data_hora', { ascending: true })
      rowsByServico = rowsSvc ?? []
    }
  }

  // Mescla as duas listas sem duplicar (por id)
  const seenIds = new Set<number>()
  const allRows: any[] = []
  for (const r of [...(rowsByUuid ?? []), ...rowsByServico]) {
    if (!seenIds.has(Number(r.id))) {
      seenIds.add(Number(r.id))
      allRows.push(r)
    }
  }
  allRows.sort((a, b) => a.data_hora.localeCompare(b.data_hora))

  // Busca nomes dos serviços
  const ids = allRows.map((r: any) => r.id)
  let servicosMap: Record<number, string[]> = {}
  if (ids.length) {
    const { data: agSvcs } = await supabase
      .from('agendamento_servicos')
      .select('agendamento_id, servicos(nome)')
      .in('agendamento_id', ids)
    ;(agSvcs ?? []).forEach((row: any) => {
      if (!servicosMap[row.agendamento_id]) servicosMap[row.agendamento_id] = []
      if (row.servicos?.nome) servicosMap[row.agendamento_id].push(row.servicos.nome)
    })
  }

  // Busca nome do profissional direto de funcionarios (cadastro)
  // uuid → nome via profiles.email → funcionarios.nome
  const funcUuids = [...new Set(allRows.map((r: any) => r.funcionario_id).filter(Boolean))] as string[]
  const funcNomeByUuid: Record<string, string> = {}
  if (funcUuids.length) {
    const { data: profs } = await supabase
      .from('profiles').select('id, email').in('id', funcUuids)
    const emailToUuid: Record<string, string> = {}
    ;(profs ?? []).forEach((p: any) => { if (p.email) emailToUuid[p.email.toLowerCase()] = p.id })
    const { data: funcs } = await supabase
      .from('funcionarios').select('nome, email').eq('empresa_id', eId)
    ;(funcs ?? []).forEach((f: any) => {
      if (f.email) {
        const uuid = emailToUuid[f.email.toLowerCase()]
        if (uuid) funcNomeByUuid[uuid] = f.nome
      }
    })
  }

  meuKanban.value = allRows.map((r: any) => ({
    id:               r.id,
    data_hora:        r.data_hora,
    status:           r.status,
    cliente_nome:     r.clientes?.nome ?? null,
    nome_solicitante: r.nome_solicitante ?? null,
    cliente_telefone: r.clientes?.telefone ?? r.telefone_solicitante ?? null,
    servicos_nomes:   servicosMap[r.id]?.join(', ') ?? null,
    funcionario_nome: funcNomeByUuid[r.funcionario_id] ?? null,
  }))
  meuKanbanLoading.value = false
}

// �"?�"? Fetch �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?
onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  const email = session?.user?.email
  await loadEmpresa()

  // Funcionário: buscar pelo email
  if (userPerfil.value === 'funcionario') {
    const { data: func } = await supabase
      .from('funcionarios')
      .select('id, nome, cargo')
      .eq('empresa_id', empresaId.value!)
      .ilike('email', email ?? '')
      .maybeSingle()

    if (func) {
      funcionarioLogado.value = func as FuncionarioLite
      const { data: ativs } = await supabase
        .from('atividades_funcionarios')
        .select('id, titulo, descricao, status, prioridade, periodicidade, data_atividade, hora_inicio, hora_fim, observacao')
        .eq('funcionario_id', func.id)
        .eq('empresa_id', empresaId.value!)
        .order('data_atividade', { ascending: true })
      minhasAtividades.value = (ativs ?? []) as AtividadeFuncionario[]
      // Buscar agendamentos do funcionário (por uuid E por serviço vinculado)
      if (session?.user?.id) {
        await fetchMeuKanban(session.user.id, func.id, empresaId.value!)
      }
    }
    loadingAtividades.value = false
    resumoLoading.value = false
    return
  }

  // Admin: buscar resumo
  loadingAtividades.value = false
  await aplicarFiltros()
})

function formatCurrency(val: number): string {
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const atalhos = [
  { to: '/agendamentos',  icon: 'calendar',       title: 'Agendamentos',  minPerfil: 'all'     },
  { to: '/servicos',      icon: 'sparkles',       title: 'Serviços',      minPerfil: 'all'     },
  { to: '/clientes',      icon: 'identification', title: 'Clientes',      minPerfil: 'all'     },
  { to: '/estoque',       icon: 'package',        title: 'Estoque',       minPerfil: 'all'     },
  { to: '/funcionarios',  icon: 'users',          title: 'Funcionários',  minPerfil: 'manager' },
  { to: '/atividades',    icon: 'clipboard',      title: 'Atividades',    minPerfil: 'all'     },
  { to: '/contas-pagar',  icon: 'wallet',         title: 'Contas a Pagar', minPerfil: 'manager' },
  { to: '/configuracoes', icon: 'settings',       title: 'Configurações', minPerfil: 'manager' },
] as const

const atalhosVisiveis = computed(() =>
  atalhos.filter(item => item.minPerfil === 'all' || isAdminOrGerente.value)
)
</script>
