<template>
  <Teleport to="body">
    <div
      v-if="show && orcamento"
      class="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4"
      @click.self="emit('close')"
    >
      <div class="bg-white rounded-[2rem] max-w-4xl w-full max-h-[94vh] overflow-y-auto shadow-2xl relative ring-1 ring-black/5">

        <!-- ═══ HEADER PREMIUM ═══ -->
        <div class="relative overflow-hidden rounded-t-[2rem]">
          <!-- Gradiente de fundo baseado no status -->
          <div class="absolute inset-0" :style="{ background: headerGradient }"></div>
          <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]"></div>

          <div class="relative px-6 sm:px-8 pt-5 pb-6">
            <!-- Top row: número + status + close -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2.5">
                <span class="text-sm font-black text-white/90">{{ orcamento.numero_orcamento ?? `#${orcamento.id}` }}</span>
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/20 text-white backdrop-blur-sm border border-white/10">
                  {{ statusDisplay.label }}
                </span>
                <span v-if="orcamento.pedido_id" class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-white/60">Legado</span>
              </div>
              <button type="button" class="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all backdrop-blur-sm" @click="emit('close')">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <!-- Valor total destaque -->
            <div class="text-center">
              <p class="text-xs font-semibold text-white/60 uppercase tracking-widest mb-1">Valor Total</p>
              <p class="text-3xl sm:text-4xl font-black text-white tracking-tight">{{ formatCurrency(orcamento.valor_total) }}</p>
            </div>

            <!-- Cliente inline -->
            <div class="flex items-center justify-center gap-4 mt-4 text-white/70 text-xs">
              <span class="flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" /></svg>
                <b class="text-white font-semibold">{{ orcamento.cliente_nome ?? '—' }}</b>
              </span>
              <span v-if="orcamento.cliente_telefone" class="flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                {{ orcamento.cliente_telefone }}
              </span>
              <span class="flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                <span :class="isVencido ? 'text-red-300 font-bold' : ''">{{ formatDate(orcamento.data_validade) }}</span>
              </span>
            </div>
          </div>
        </div>

        <div class="px-6 sm:px-8 py-6 space-y-6">

          <!-- Itens do Orçamento -->
          <section>
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em]">Itens do Orçamento</h3>
              <span class="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{{ itens.length }} item(s)</span>
            </div>
            <div v-if="loadingItens" class="flex items-center justify-center py-10">
              <span class="inline-block w-7 h-7 border-[3px] rounded-full animate-spin" style="border-color: rgba(0,0,0,0.08); border-top-color: var(--color-primary, #f97316)" />
            </div>
            <div v-else class="space-y-3">
              <div v-for="(item, idx) in itens" :key="item.id" class="rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50/30 hover:border-gray-200 hover:shadow-md transition-all overflow-hidden group">
                <!-- Item header -->
                <div class="flex items-center justify-between px-5 py-3.5">
                  <div class="flex items-center gap-3 min-w-0">
                    <span class="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black text-white flex-shrink-0" style="background: var(--color-primary, #f97316)">{{ idx + 1 }}</span>
                    <div class="min-w-0">
                      <p class="text-sm font-bold text-gray-900 truncate">{{ item.descricao }}</p>
                      <p class="text-[10px] text-gray-400 font-medium">{{ item.material_nome ?? '' }}</p>
                    </div>
                  </div>
                  <span class="text-base font-black text-gray-900 flex-shrink-0 ml-3">{{ formatCurrency(item.valor_item) }}</span>
                </div>
                <!-- Item metrics -->
                <div class="px-5 pb-3 flex flex-wrap items-center gap-2">
                  <span class="inline-flex items-center gap-1 text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md font-medium">{{ item.largura_cm }} × {{ item.altura_cm }} cm</span>
                  <span class="inline-flex items-center text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md font-medium">Qtd: {{ item.quantidade }}</span>
                  <span v-if="item.area_m2" class="inline-flex items-center text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md font-medium">{{ item.area_m2.toFixed(2) }} m²</span>
                </div>
                <!-- Fotos grandes com clique para ampliar -->
                <div v-if="item.foto_arte_url || item.foto_local_url" class="px-4 pb-4 flex flex-wrap gap-3">
                  <!-- Foto Arte -->
                  <div v-if="item.foto_arte_url && !isPdf(item.foto_arte_url)" class="relative group">
                    <img
                      :src="item.foto_arte_url"
                      alt="Arte"
                      class="w-28 h-28 sm:w-36 sm:h-36 rounded-xl object-cover border border-gray-200 cursor-pointer hover:shadow-md transition-all"
                      @click="lightboxUrl = item.foto_arte_url"
                    />
                    <span class="absolute bottom-1.5 left-1.5 text-[9px] font-bold bg-black/60 text-white px-1.5 py-0.5 rounded">Arte</span>
                  </div>
                  <a v-else-if="item.foto_arte_url && isPdf(item.foto_arte_url)" :href="item.foto_arte_url" target="_blank" rel="noopener" class="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 transition-colors text-xs font-bold">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4z"/></svg>
                    Arte (PDF)
                  </a>
                  <!-- Foto Local -->
                  <div v-if="item.foto_local_url && !isPdf(item.foto_local_url)" class="relative group">
                    <img
                      :src="item.foto_local_url"
                      alt="Local"
                      class="w-28 h-28 sm:w-36 sm:h-36 rounded-xl object-cover border border-gray-200 cursor-pointer hover:shadow-md transition-all"
                      @click="lightboxUrl = item.foto_local_url"
                    />
                    <span class="absolute bottom-1.5 left-1.5 text-[9px] font-bold bg-black/60 text-white px-1.5 py-0.5 rounded">Local</span>
                  </div>
                  <a v-else-if="item.foto_local_url && isPdf(item.foto_local_url)" :href="item.foto_local_url" target="_blank" rel="noopener" class="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-50 border border-green-100 text-green-600 hover:bg-green-100 transition-colors text-xs font-bold">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4z"/></svg>
                    Local (PDF)
                  </a>
                </div>
              </div>
              <div v-if="itens.length === 0" class="text-center py-8 text-gray-400 text-sm">Nenhum item encontrado</div>
            </div>
          </section>

          <!-- Resumo Financeiro -->
          <section>
            <h3 class="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] mb-3">Resumo Financeiro</h3>
            <div class="bg-gray-50/80 rounded-2xl border border-gray-100 p-5 space-y-2.5">
              <div class="flex justify-between text-sm text-gray-600">
                <span>Subtotal ({{ orcamento.quantidade_total_itens ?? itens.length }} itens)</span>
                <span class="font-semibold">{{ formatCurrency(subtotalItens) }}</span>
              </div>
              <div v-if="orcamento.valor_mao_obra_global > 0" class="flex justify-between text-sm text-gray-600">
                <span>Mão de obra</span>
                <span class="font-semibold">+ {{ formatCurrency(orcamento.valor_mao_obra_global) }}</span>
              </div>
              <div v-if="orcamento.desconto_volume_percentual > 0" class="flex justify-between text-sm text-green-600">
                <span>Desconto volume ({{ orcamento.desconto_volume_percentual }}%)</span>
                <span class="font-semibold">- {{ formatCurrency(descontoVolumeValor) }}</span>
              </div>
              <div v-if="orcamento.desconto_percentual > 0" class="flex justify-between text-sm text-green-600">
                <span>Desconto manual ({{ orcamento.desconto_percentual }}%)</span>
                <span class="font-semibold">- {{ formatCurrency(descontoManualPercValor) }}</span>
              </div>
              <div v-if="orcamento.desconto_valor > 0" class="flex justify-between text-sm text-green-600">
                <span>Desconto valor fixo</span>
                <span class="font-semibold">- {{ formatCurrency(orcamento.desconto_valor) }}</span>
              </div>
              <div class="border-t border-gray-200 pt-3 mt-3 flex justify-between items-center">
                <span class="text-base font-black text-gray-900">Total</span>
                <span class="text-2xl font-black" style="color: var(--color-primary, #f97316)">{{ formatCurrency(orcamento.valor_total) }}</span>
              </div>
            </div>
          </section>

          <!-- OS vinculada -->
          <section v-if="orcamento.os_numero">
            <h3 class="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] mb-3">Ordem de Serviço Vinculada</h3>
            <div class="flex items-center gap-3">
              <OSIndicadorBadge :numero-os="orcamento.os_numero" :status="orcamento.os_status" @click="emit('openOS')" />
              <span class="text-sm text-gray-500">Clique para ver detalhes da OS</span>
            </div>

            <!-- Ações para orçamento aprovado com OS -->
            <div class="mt-4 pt-4 border-t border-gray-100">
              <div v-if="toastMessage" class="mb-3 p-3.5 rounded-2xl text-sm font-semibold" :class="toastType === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'">
                {{ toastMessage }}
              </div>

              <div class="grid grid-cols-2 gap-3">
                <button type="button" class="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold bg-white text-amber-700 border-2 border-amber-200 hover:bg-amber-50 hover:border-amber-300 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50" :disabled="processando" @click="showVoltarEtapa = true">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></svg>
                  Voltar Etapa
                </button>
                <button type="button" class="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold bg-white text-red-600 border-2 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50" :disabled="processando" @click="showExcluirOS = true">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                  Excluir OS
                </button>
              </div>

              <!-- Confirmação Voltar Etapa -->
              <div v-if="showVoltarEtapa" class="mt-4 p-5 bg-amber-50 rounded-2xl border border-amber-200">
                <p class="text-sm text-gray-700 mb-4">Isso vai reverter o orçamento para <b>Enviado</b> e excluir a OS vinculada.</p>
                <div class="flex items-center gap-3">
                  <button type="button" class="flex-1 py-3 rounded-xl text-sm font-bold bg-amber-600 text-white hover:bg-amber-700 transition-all shadow-sm disabled:opacity-50" :disabled="processando" @click="voltarEtapa">
                    <span v-if="processando" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span v-else>Confirmar</span>
                  </button>
                  <button type="button" class="flex-1 py-3 rounded-xl text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-all" @click="showVoltarEtapa = false">Cancelar</button>
                </div>
              </div>

              <!-- Confirmação Excluir OS -->
              <div v-if="showExcluirOS" class="mt-4 p-5 bg-red-50 rounded-2xl border border-red-200">
                <p class="text-sm text-gray-700 mb-4">Tem certeza? A OS <b>{{ orcamento.os_numero }}</b> será excluída permanentemente.</p>
                <div class="flex items-center gap-3">
                  <button type="button" class="flex-1 py-3 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition-all shadow-sm disabled:opacity-50" :disabled="processando" @click="excluirOS">
                    <span v-if="processando" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span v-else>Excluir OS</span>
                  </button>
                  <button type="button" class="flex-1 py-3 rounded-xl text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-all" @click="showExcluirOS = false">Cancelar</button>
                </div>
              </div>
            </div>
          </section>

          <!-- ═══ AÇÕES ═══ -->
          <section v-if="!orcamento.os_numero" class="border-t border-gray-100 pt-6">
            <!-- Toast -->
            <div v-if="toastMessage" class="mb-4 p-3.5 rounded-2xl text-sm font-semibold" :class="toastType === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'">
              {{ toastMessage }}
            </div>

            <!-- Ações primárias (aprovar/reprovar) -->
            <div v-if="statusDisplay.status !== 'rejeitado' && statusDisplay.status !== 'aprovado'" class="grid grid-cols-2 gap-3 mb-4">
              <button type="button" class="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50" :disabled="processando" @click="showAprovacaoInterna = true">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                Aprovar
              </button>
              <button type="button" class="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold bg-white text-red-600 border-2 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50" :disabled="processando" @click="showReprovar = true">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                Reprovar
              </button>
            </div>

            <!-- Voltar Etapa (aprovados) -->
            <div v-if="statusDisplay.status === 'aprovado'" class="mb-4">
              <button type="button" class="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold bg-amber-50 text-amber-700 border-2 border-amber-200 hover:bg-amber-100 transition-all disabled:opacity-50" :disabled="processando" @click="showVoltarEtapa = true">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></svg>
                Voltar para Enviado
              </button>
            </div>

            <!-- Ações secundárias (grid de ícones) -->
            <div class="grid grid-cols-4 gap-2">
              <button type="button" class="flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-100 hover:border-gray-200 transition-all group disabled:opacity-50" :disabled="processando" @click="gerarLinkAprovacao">
                <div class="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center group-hover:border-gray-300 transition-colors shadow-sm">
                  <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.06a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.34 8.374" /></svg>
                </div>
                <span class="text-[10px] font-bold text-gray-600">Link</span>
              </button>
              <button type="button" class="flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl bg-gray-50 hover:bg-green-50 border border-gray-100 hover:border-green-200 transition-all group disabled:opacity-50" :disabled="processando" @click="iniciarEnvioWhatsApp">
                <div class="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center group-hover:border-green-300 transition-colors shadow-sm">
                  <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492l4.634-1.215A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-2.168 0-4.19-.586-5.932-1.609l-.424-.255-4.398 1.154 1.174-4.293-.279-.443A9.785 9.785 0 012.182 12c0-5.423 4.395-9.818 9.818-9.818 5.423 0 9.818 4.395 9.818 9.818 0 5.423-4.395 9.818-9.818 9.818z"/></svg>
                </div>
                <span class="text-[10px] font-bold text-gray-600">WhatsApp</span>
              </button>
              <button v-if="linkGerado || orcamento.token_aprovacao" type="button" class="flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 transition-all group" @click="abrirLinkNovaPagina">
                <div class="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center group-hover:border-blue-300 transition-colors shadow-sm">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                </div>
                <span class="text-[10px] font-bold text-gray-600">Abrir</span>
              </button>
              <button type="button" class="flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-100 hover:border-gray-200 transition-all group disabled:opacity-50" :disabled="gerandoPdf" @click="gerarPdfOrcamento">
                <div class="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center group-hover:border-gray-300 transition-colors shadow-sm">
                  <span v-if="gerandoPdf" class="inline-block w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></span>
                  <svg v-else class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                </div>
                <span class="text-[10px] font-bold text-gray-600">PDF</span>
              </button>
            </div>

            <!-- Link gerado -->
            <div v-if="linkGerado" class="mt-4 p-4 rounded-2xl border" style="background: var(--color-primary-5, rgba(249,115,22,0.05)); border-color: var(--color-primary-20, rgba(249,115,22,0.2))">
              <label class="text-[10px] font-black uppercase tracking-[0.15em] mb-2 block" style="color: var(--color-primary, #f97316)">Link de Aprovação</label>
              <div class="flex items-center gap-2">
                <input type="text" :value="linkGerado" readonly class="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs text-gray-700 font-mono" />
                <button type="button" class="px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-colors" style="background: var(--color-primary, #f97316)" @click="copiarLink">
                  {{ linkCopiado ? '✓ Copiado' : 'Copiar' }}
                </button>
              </div>
            </div>

            <!-- Campo telefone manual -->
            <div v-if="showTelefoneManual" class="mt-4 p-4 bg-green-50 rounded-2xl border border-green-200">
              <label class="text-[10px] font-black text-green-600 uppercase tracking-[0.15em] mb-2 block">Telefone do cliente (DDD + número)</label>
              <div class="flex items-center gap-2">
                <input v-model="telefoneManual" type="tel" placeholder="Ex: 11999998888" class="flex-1 rounded-xl border border-green-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-green-400" />
                <button type="button" class="px-4 py-2.5 rounded-xl text-sm font-bold bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50" :disabled="!telefoneValido" @click="enviarWhatsApp(telefoneManual)">
                  Enviar
                </button>
              </div>
              <p v-if="telefoneManual && !telefoneValido" class="text-xs text-red-500 mt-1.5">Formato inválido. Use 10 ou 11 dígitos (DDD + número).</p>
            </div>

            <!-- Modal Aprovação Interna -->
            <div v-if="showAprovacaoInterna" class="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
              <label class="text-[10px] font-black text-emerald-600 uppercase tracking-[0.15em] block">Forma de Pagamento e Parcelas</label>
              <div class="grid grid-cols-2 gap-3">
                <select v-model="formaPagamentoAprovacao" class="rounded-xl border border-emerald-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400">
                  <option value="" disabled>Forma de pagamento...</option>
                  <option value="dinheiro">Dinheiro</option>
                  <option value="pix">{{ locale.pais === 'PT' ? 'MB Way' : 'PIX' }}</option>
                  <option value="cartao">Cartão</option>
                  <option value="boleto">{{ locale.pais === 'PT' ? 'Ref. Multibanco' : 'Boleto' }}</option>
                  <option value="transferencia">Transferência</option>
                  <option value="parcelado">Parcelado</option>
                </select>
                <div class="flex items-center gap-2">
                  <input v-model.number="parcelasAprovacao" type="number" min="1" max="24" class="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-400" />
                  <span class="text-xs text-gray-500 whitespace-nowrap">parcela(s)</span>
                </div>
              </div>
              <p v-if="parcelasAprovacao > 1 && orcamento" class="text-[11px] text-emerald-700 font-medium">
                {{ parcelasAprovacao }}x de {{ formatCurrency(orcamento.valor_total / parcelasAprovacao) }}
              </p>
              <div class="flex items-center gap-3 pt-1">
                <button type="button" class="px-5 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-50 shadow-sm" :disabled="!formaPagamentoAprovacao || processando" @click="aprovarInternamente">
                  <span v-if="processando" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span v-else>Confirmar Aprovação</span>
                </button>
                <button type="button" class="px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors" @click="showAprovacaoInterna = false">Cancelar</button>
              </div>
            </div>

            <!-- Modal Reprovar -->
            <div v-if="showReprovar" class="mt-4 p-4 bg-red-50 rounded-2xl border border-red-200">
              <label class="text-[10px] font-black text-red-600 uppercase tracking-[0.15em] mb-2 block">Confirmar Reprovação</label>
              <p class="text-sm text-gray-600 mb-3">Tem certeza que deseja reprovar este orçamento?</p>
              <div class="flex items-center gap-3">
                <button type="button" class="px-5 py-2.5 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 shadow-sm" :disabled="processando" @click="reprovarOrcamento">
                  <span v-if="processando" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span v-else>Confirmar Reprovação</span>
                </button>
                <button type="button" class="px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors" @click="showReprovar = false">Cancelar</button>
              </div>
            </div>

            <!-- Confirmação Voltar Etapa (sem OS) -->
            <div v-if="showVoltarEtapa && !orcamento.os_numero" class="mt-4 p-4 bg-amber-50 rounded-2xl border border-amber-200">
              <p class="text-sm text-gray-700 mb-3">Isso vai reverter o orçamento para <b>Enviado</b>.</p>
              <div class="flex items-center gap-3">
                <button type="button" class="px-5 py-2.5 rounded-xl text-sm font-bold bg-amber-600 text-white hover:bg-amber-700 transition-colors disabled:opacity-50 shadow-sm" :disabled="processando" @click="voltarEtapaSemOS">
                  <span v-if="processando" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span v-else>Confirmar</span>
                </button>
                <button type="button" class="px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors" @click="showVoltarEtapa = false">Cancelar</button>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>

    <!-- Lightbox para ampliar imagens -->
    <div v-if="lightboxUrl" class="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4" @click="lightboxUrl = null">
      <button type="button" class="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors" @click.stop="lightboxUrl = null">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
      <img :src="lightboxUrl!" alt="Imagem ampliada" class="max-w-[90vw] max-h-[90vh] rounded-2xl object-contain shadow-2xl" @click.stop />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { createSupabaseClient } from '~/lib/supabase'
import { useContasReceber } from '~/composables/useConciliacao'
import { useProcessos } from '~/composables/useProcessos'
import type { StatusOS } from '~/composables/useOrdensServico'
import OSIndicadorBadge from '~/components/OSIndicadorBadge.vue'

const { formatCurrency, locale } = useLocale()

interface OrcamentoDetalhe {
  id: number
  pedido_id: number | null
  numero_orcamento: string | null
  cliente_id: number | null
  cliente_nome: string | null
  cliente_telefone: string | null
  quantidade_total_itens: number | null
  valor_total: number
  valor_mao_obra_global: number
  desconto_volume_percentual: number
  desconto_percentual: number
  desconto_valor: number
  created_at: string
  data_validade: string
  status: string
  token_aprovacao: string | null
  prazo_estimado_dias: number | null
  data_entrega: string | null
  os_numero: string | null
  os_status: StatusOS | null
}

interface ItemOrcamentoDetalhe {
  id: number
  descricao: string
  material_id: number
  material_nome?: string
  largura_cm: number
  altura_cm: number
  quantidade: number
  modalidade_preco: string
  preco_unitario: number | null
  area_m2: number | null
  valor_item: number
  foto_arte_url: string | null
  foto_local_url: string | null
}

const props = defineProps<{
  show: boolean
  orcamento: OrcamentoDetalhe | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'openOS'): void
  (e: 'refresh'): void
}>()

const supabase = createSupabaseClient()
const { gerarRecebiveisOrcamento } = useContasReceber()
const { gerarProcessosParaOS } = useProcessos()
const {
  comporMensagemWhatsAppMultiItens,
  comporLinkWhatsApp,
  comporLinkAprovacao,
  validarTelefone,
  truncarDescricao,
  classificarStatusOrcamentoV2,
} = useOrcamentos()

// State
const itens = ref<ItemOrcamentoDetalhe[]>([])
const loadingItens = ref(false)
const processando = ref(false)
const linkGerado = ref('')
const linkCopiado = ref(false)
const showTelefoneManual = ref(false)
const telefoneManual = ref('')
const showAprovacaoInterna = ref(false)
const showReprovar = ref(false)
const showVoltarEtapa = ref(false)
const showExcluirOS = ref(false)
const formaPagamentoAprovacao = ref('')
const parcelasAprovacao = ref(1)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')
const lightboxUrl = ref<string | null>(null)
const gerandoPdf = ref(false)

// Computed
const statusDisplay = computed(() => {
  if (!props.orcamento) return { status: 'rascunho', label: 'Rascunho', cor: 'gray' }
  return classificarStatusOrcamentoV2(props.orcamento.status as any, props.orcamento.data_validade)
})

const headerGradient = computed(() => {
  const s = statusDisplay.value.status
  switch (s) {
    case 'aprovado': return 'linear-gradient(135deg, #059669, #10b981)'
    case 'enviado': return 'linear-gradient(135deg, #1d4ed8, #3b82f6)'
    case 'rejeitado': return 'linear-gradient(135deg, #dc2626, #ef4444)'
    case 'vencido': return 'linear-gradient(135deg, #d97706, #f59e0b)'
    default: return 'linear-gradient(135deg, #374151, #4b5563)'
  }
})

const statusBadgeClass = computed(() => {
  const colorMap: Record<string, string> = {
    rascunho: 'bg-gray-100 text-gray-600',
    enviado: 'bg-blue-50 text-blue-700 border border-blue-200',
    aprovado: 'bg-green-50 text-green-700 border border-green-200',
    rejeitado: 'bg-red-50 text-red-700 border border-red-200',
    vencido: 'bg-orange-50 text-orange-700 border border-orange-200',
  }
  return colorMap[statusDisplay.value.status] ?? 'bg-gray-100 text-gray-600'
})

const isVencido = computed(() => statusDisplay.value.status === 'vencido')

const subtotalItens = computed(() => itens.value.reduce((sum, item) => sum + item.valor_item, 0))

const descontoVolumeValor = computed(() => {
  if (!props.orcamento) return 0
  const sub = subtotalItens.value + (props.orcamento.valor_mao_obra_global ?? 0)
  return sub * ((props.orcamento.desconto_volume_percentual ?? 0) / 100)
})

const descontoManualPercValor = computed(() => {
  if (!props.orcamento) return 0
  const sub = subtotalItens.value + (props.orcamento.valor_mao_obra_global ?? 0)
  const aposVolume = sub - descontoVolumeValor.value
  return aposVolume * ((props.orcamento.desconto_percentual ?? 0) / 100)
})

const telefoneValido = computed(() => validarTelefone(telefoneManual.value))

// Watchers
watch(() => props.show, (newVal) => {
  if (newVal && props.orcamento) {
    fetchItens()
    resetState()
  }
})

// Methods
function resetState() {
  linkGerado.value = ''
  linkCopiado.value = false
  showTelefoneManual.value = false
  telefoneManual.value = ''
  showAprovacaoInterna.value = false
  showReprovar.value = false
  showVoltarEtapa.value = false
  showExcluirOS.value = false
  formaPagamentoAprovacao.value = ''
  toastMessage.value = ''
  lightboxUrl.value = null
}

async function fetchItens() {
  if (!props.orcamento) return
  loadingItens.value = true
  try {
    const { data, error } = await supabase
      .from('itens_orcamento')
      .select('id, descricao, material_id, largura_cm, altura_cm, quantidade, modalidade_preco, preco_unitario, area_m2, valor_item, foto_arte_url, foto_local_url, materiais_adesivo(nome)')
      .eq('orcamento_id', props.orcamento.id)
      .order('id', { ascending: true })

    if (error) { console.error('Erro ao buscar itens:', error); return }

    itens.value = (data ?? []).map((row: any) => ({
      id: row.id,
      descricao: row.descricao,
      material_id: row.material_id,
      material_nome: row.materiais_adesivo?.nome ?? null,
      largura_cm: row.largura_cm,
      altura_cm: row.altura_cm,
      quantidade: row.quantidade,
      modalidade_preco: row.modalidade_preco,
      preco_unitario: row.preco_unitario,
      area_m2: row.area_m2,
      valor_item: row.valor_item,
      foto_arte_url: row.foto_arte_url ?? null,
      foto_local_url: row.foto_local_url ?? null,
    }))
  } finally {
    loadingItens.value = false
  }
}

function showToast(message: string, type: 'success' | 'error' = 'success') {
  toastMessage.value = message
  toastType.value = type
  setTimeout(() => { toastMessage.value = '' }, 4000)
}

async function atualizarStatusParaEnviado() {
  if (!props.orcamento || props.orcamento.status !== 'rascunho') return
  try {
    const { data: etapaData } = await supabase
      .from('pipeline_etapas')
      .select('id')
      .eq('pipeline_tipo', 'orcamentos')
      .eq('nome', 'Enviado')
      .limit(1)
      .single()

    const updatePayload: Record<string, unknown> = { status: 'enviado' }
    if (etapaData) updatePayload.etapa_id = etapaData.id

    await supabase
      .from('orcamentos_adesivo')
      .update(updatePayload)
      .eq('id', props.orcamento.id)
  } catch (err) {
    console.error('Erro ao atualizar status para enviado:', err)
  }
}

function abrirLinkNovaPagina() {
  if (!props.orcamento) return
  const token = linkGerado.value
    ? linkGerado.value
    : `${window.location.origin}/orcamento-aprovacao/${props.orcamento.token_aprovacao}`
  const url = linkGerado.value || `${window.location.origin}/orcamento-aprovacao/${props.orcamento.token_aprovacao}`
  window.open(url, '_blank')
}

async function gerarLinkAprovacao() {
  if (!props.orcamento) return
  processando.value = true
  try {
    const newToken = crypto.randomUUID()
    const { error } = await supabase
      .from('orcamentos_adesivo')
      .update({ token_aprovacao: newToken })
      .eq('id', props.orcamento.id)

    if (error) { showToast('Erro ao gerar token de aprovação.', 'error'); console.error(error); return }

    await atualizarStatusParaEnviado()
    const baseUrl = window.location.origin
    linkGerado.value = comporLinkAprovacao(baseUrl, newToken)
    showToast('Link de aprovação gerado com sucesso!')
    emit('refresh')
  } catch (err) {
    showToast('Erro inesperado ao gerar link.', 'error')
    console.error(err)
  } finally {
    processando.value = false
  }
}

async function copiarLink() {
  try {
    await navigator.clipboard.writeText(linkGerado.value)
    linkCopiado.value = true
    setTimeout(() => { linkCopiado.value = false }, 2000)
  } catch (err) {
    console.error('Erro ao copiar para clipboard:', err)
  }
}

async function iniciarEnvioWhatsApp() {
  if (!props.orcamento) return
  const telefone = props.orcamento.cliente_telefone
  if (!telefone || !validarTelefone(telefone)) {
    showTelefoneManual.value = true
    return
  }
  await enviarWhatsApp(telefone)
}

async function enviarWhatsApp(telefone: string) {
  if (!props.orcamento) return
  processando.value = true
  try {
    let token = props.orcamento.token_aprovacao
    if (!token) {
      token = crypto.randomUUID()
      const { error } = await supabase
        .from('orcamentos_adesivo')
        .update({ token_aprovacao: token })
        .eq('id', props.orcamento.id)
      if (error) { showToast('Erro ao gerar token para o link.', 'error'); console.error(error); return }
    }

    await atualizarStatusParaEnviado()
    const baseUrl = window.location.origin
    const linkAprovacao = comporLinkAprovacao(baseUrl, token)

    const descricaoResumida = itens.value.length > 0
      ? truncarDescricao(itens.value.map(i => i.descricao).join(', '), 80)
      : 'Adesivos personalizados'

    const mensagem = comporMensagemWhatsAppMultiItens({
      nomeCliente: props.orcamento.cliente_nome ?? 'Cliente',
      quantidadeItens: props.orcamento.quantidade_total_itens ?? itens.value.length,
      descricaoResumida,
      valorTotal: props.orcamento.valor_total,
      validade: formatDate(props.orcamento.data_validade),
      linkAprovacao,
    })

    const waLink = comporLinkWhatsApp(telefone, mensagem)
    window.open(waLink, '_blank')
    showTelefoneManual.value = false
    showToast('WhatsApp aberto em nova aba!')
    emit('refresh')
  } catch (err) {
    showToast('Erro ao preparar envio WhatsApp.', 'error')
    console.error(err)
  } finally {
    processando.value = false
  }
}

async function aprovarInternamente() {
  if (!props.orcamento || !formaPagamentoAprovacao.value) return
  processando.value = true
  try {
    const { data, error } = await supabase.rpc('gerar_ordem_servico', {
      p_orcamento_id: props.orcamento.id,
      p_token: null,
      p_forma_pagamento: formaPagamentoAprovacao.value,
      p_origem: 'interno',
    })

    if (error) { showToast(`Erro na aprovação: ${error.message}`, 'error'); console.error(error); return }

    // Buscar OS gerada para este orçamento
    const { data: osData } = await supabase
      .from('ordens_servico_adesivo')
      .select('id')
      .eq('orcamento_id', props.orcamento.id)
      .limit(1)
      .single()

    // Atualizar data_entrega na OS a partir do orçamento
    if (osData?.id && props.orcamento.data_entrega) {
      await supabase.from('ordens_servico_adesivo').update({ data_entrega: props.orcamento.data_entrega }).eq('id', osData.id)
    }

    // Gerar processos de produção a partir dos itens
    if (osData?.id && itens.value.length > 0) {
      const procResult = await gerarProcessosParaOS(osData.id, itens.value.map(i => ({ descricao: i.descricao, material_id: i.material_id })))
      console.log('[Aprovação] Processos criados:', procResult.criados)
    }

    // Gerar contas a receber
    const recResult = await gerarRecebiveisOrcamento({
      orcamentoId: props.orcamento.id,
      valorTotal: props.orcamento.valor_total,
      clienteNome: props.orcamento.cliente_nome ?? 'Cliente',
      descricao: `${props.orcamento.numero_orcamento ?? 'Orçamento'} - ${props.orcamento.cliente_nome ?? 'Cliente'}`,
      formaPagamento: formaPagamentoAprovacao.value,
      parcelas: parcelasAprovacao.value,
    })

    showAprovacaoInterna.value = false
    if (recResult.success) {
      showToast('Orçamento aprovado! OS gerada e contas a receber criadas.')
    } else {
      showToast(`OS gerada, mas erro nas contas a receber: ${recResult.error}`, 'error')
    }
    emit('refresh')
  } catch (err: any) {
    showToast(`Erro inesperado: ${err?.message ?? 'Tente novamente.'}`, 'error')
    console.error(err)
  } finally {
    processando.value = false
  }
}

async function reprovarOrcamento() {
  if (!props.orcamento) return
  processando.value = true
  try {
    const { data: etapaData } = await supabase
      .from('pipeline_etapas')
      .select('id')
      .eq('pipeline_tipo', 'orcamentos')
      .eq('nome', 'Rejeitado')
      .limit(1)
      .maybeSingle()

    const updatePayload: Record<string, unknown> = { status: 'rejeitado' }
    if (etapaData) updatePayload.etapa_id = etapaData.id

    const { error } = await supabase
      .from('orcamentos_adesivo')
      .update(updatePayload)
      .eq('id', props.orcamento.id)

    if (error) { showToast(`Erro ao reprovar: ${error.message}`, 'error'); console.error(error); return }

    showReprovar.value = false
    showToast('Orçamento reprovado.')
    emit('refresh')
  } catch (err: any) {
    showToast(`Erro inesperado: ${err?.message ?? 'Tente novamente.'}`, 'error')
    console.error(err)
  } finally {
    processando.value = false
  }
}

async function voltarEtapa() {
  if (!props.orcamento) return
  processando.value = true
  try {
    // 1. Buscar etapa "Enviado"
    const { data: etapaData } = await supabase
      .from('pipeline_etapas')
      .select('id')
      .eq('pipeline_tipo', 'orcamentos')
      .eq('nome', 'Enviado')
      .limit(1)
      .maybeSingle()

    // 2. Excluir a OS vinculada
    if (props.orcamento.os_numero) {
      await supabase
        .from('ordens_servico_adesivo')
        .delete()
        .eq('numero_os', props.orcamento.os_numero)
    }

    // 3. Reverter orçamento para "enviado"
    const updatePayload: Record<string, unknown> = { status: 'enviado' }
    if (etapaData) updatePayload.etapa_id = etapaData.id

    const { error } = await supabase
      .from('orcamentos_adesivo')
      .update(updatePayload)
      .eq('id', props.orcamento.id)

    if (error) { showToast(`Erro ao voltar etapa: ${error.message}`, 'error'); return }

    showVoltarEtapa.value = false
    showToast('Orçamento revertido para Enviado. OS excluída.')
    emit('refresh')
  } catch (err: any) {
    showToast(`Erro: ${err?.message ?? 'Tente novamente.'}`, 'error')
  } finally {
    processando.value = false
  }
}

async function voltarEtapaSemOS() {
  if (!props.orcamento) return
  processando.value = true
  try {
    const { data: etapaData } = await supabase
      .from('pipeline_etapas')
      .select('id')
      .eq('pipeline_tipo', 'orcamentos')
      .eq('nome', 'Enviado')
      .limit(1)
      .maybeSingle()

    const updatePayload: Record<string, unknown> = { status: 'enviado' }
    if (etapaData) updatePayload.etapa_id = etapaData.id

    const { error } = await supabase
      .from('orcamentos_adesivo')
      .update(updatePayload)
      .eq('id', props.orcamento.id)

    if (error) { showToast(`Erro ao voltar etapa: ${error.message}`, 'error'); return }

    showVoltarEtapa.value = false
    showToast('Orçamento revertido para Enviado.')
    emit('refresh')
  } catch (err: any) {
    showToast(`Erro: ${err?.message ?? 'Tente novamente.'}`, 'error')
  } finally {
    processando.value = false
  }
}

async function excluirOS() {
  if (!props.orcamento || !props.orcamento.os_numero) return
  processando.value = true
  try {
    const { error } = await supabase
      .from('ordens_servico_adesivo')
      .delete()
      .eq('numero_os', props.orcamento.os_numero)

    if (error) { showToast(`Erro ao excluir OS: ${error.message}`, 'error'); return }

    // Reverter status do orçamento para enviado
    const { data: etapaData } = await supabase
      .from('pipeline_etapas')
      .select('id')
      .eq('pipeline_tipo', 'orcamentos')
      .eq('nome', 'Enviado')
      .limit(1)
      .maybeSingle()

    const updatePayload: Record<string, unknown> = { status: 'enviado' }
    if (etapaData) updatePayload.etapa_id = etapaData.id

    await supabase
      .from('orcamentos_adesivo')
      .update(updatePayload)
      .eq('id', props.orcamento.id)

    showExcluirOS.value = false
    showToast('OS excluída. Orçamento voltou para Enviado.')
    emit('refresh')
  } catch (err: any) {
    showToast(`Erro: ${err?.message ?? 'Tente novamente.'}`, 'error')
  } finally {
    processando.value = false
  }
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('pt-BR')
}

function isPdf(url: string | null | undefined): boolean {
  if (!url) return false
  return url.toLowerCase().endsWith('.pdf')
}

async function gerarPdfOrcamento() {
  if (!props.orcamento) return
  gerandoPdf.value = true
  try {
    const { default: jsPDF } = await import('jspdf')
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pageWidth = doc.internal.pageSize.getWidth()
    let y = 20

    // Header
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    const numero = props.orcamento.numero_orcamento ?? `#${props.orcamento.id}`
    doc.text(`Orçamento ${numero}`, pageWidth / 2, y, { align: 'center' })
    y += 6
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100)
    doc.text(`Emitido em ${formatDate(props.orcamento.created_at)}`, pageWidth / 2, y, { align: 'center' })
    y += 10

    // Separador
    doc.setDrawColor(230)
    doc.line(20, y, pageWidth - 20, y)
    y += 8

    // Cliente
    doc.setTextColor(60)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('DADOS DO CLIENTE', 20, y)
    y += 6
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(`Nome: ${props.orcamento.cliente_nome ?? '—'}`, 20, y); y += 5
    doc.text(`Telefone: ${props.orcamento.cliente_telefone ?? 'Não informado'}`, 20, y); y += 5
    doc.text(`Validade: ${formatDate(props.orcamento.data_validade)}`, 20, y); y += 10

    // Itens
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('ITENS DO ORÇAMENTO', 20, y)
    y += 7

    for (let i = 0; i < itens.value.length; i++) {
      const item = itens.value[i]
      if (y > 260) { doc.addPage(); y = 20 }

      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(80)
      doc.text(`Item ${i + 1} — ${item.descricao}`, 20, y)
      doc.text(formatCurrency(item.valor_item), pageWidth - 20, y, { align: 'right' })
      y += 5

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(120)
      doc.text(`${item.largura_cm} × ${item.altura_cm} cm | Qtd: ${item.quantidade} | ${item.material_nome ?? ''}`, 22, y)
      y += 7
    }

    // Separador
    y += 3
    doc.setDrawColor(230)
    doc.line(20, y, pageWidth - 20, y)
    y += 8

    // Total
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(60)
    doc.text('RESUMO', 20, y)
    y += 7
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Subtotal:', 20, y)
    doc.text(formatCurrency(subtotalItens.value), pageWidth - 20, y, { align: 'right' })
    y += 6
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(0)
    doc.text('TOTAL:', 20, y)
    doc.text(formatCurrency(props.orcamento.valor_total), pageWidth - 20, y, { align: 'right' })

    // Download
    const nomeArquivo = `Orcamento_${numero.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
    doc.save(nomeArquivo)
  } catch (err) {
    console.error('Erro ao gerar PDF:', err)
    showToast('Erro ao gerar PDF', 'error')
  } finally {
    gerandoPdf.value = false
  }
}
</script>
