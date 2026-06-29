<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-8" :style="{ background: pageBg }">

    <!-- ═══ LOADING ═══ -->
    <div v-if="pageState === 'loading'" class="text-center">
      <div class="w-10 h-10 border-4 rounded-full animate-spin mx-auto mb-4" style="border-color: rgba(0,0,0,0.1); border-top-color: var(--color-primary, #4f46e5)"></div>
      <p class="text-sm text-gray-500">Carregando orçamento...</p>
    </div>

    <!-- ═══ NOT FOUND ═══ -->
    <div v-else-if="pageState === 'not_found'" class="max-w-md w-full text-center bg-white rounded-2xl shadow-lg p-8">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
        <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h1 class="text-xl font-bold text-gray-800 mb-2">Orçamento não encontrado</h1>
      <p class="text-sm text-gray-500">O link que você acessou é inválido ou o orçamento não existe.</p>
    </div>

    <!-- ═══ EXPIRED ═══ -->
    <div v-else-if="pageState === 'expired'" class="max-w-md w-full text-center bg-white rounded-2xl shadow-lg p-8">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
        <svg class="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 class="text-xl font-bold text-gray-800 mb-2">Orçamento vencido</h1>
      <p class="text-sm text-gray-500">Este orçamento expirou em {{ formatDate(orcamento?.data_validade) }} e não pode mais ser aprovado.</p>
    </div>

    <!-- ═══ ALREADY DECIDED ═══ -->
    <div v-else-if="pageState === 'already_decided'" class="max-w-md w-full text-center bg-white rounded-2xl shadow-lg p-8">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
        :class="decisionStatus === 'rejeitado' ? 'bg-red-100' : 'bg-green-100'">
        <svg v-if="decisionStatus === 'rejeitado'" class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <svg v-else class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 class="text-xl font-bold text-gray-800 mb-2">
        {{ decisionStatus === 'rejeitado' ? 'Orçamento rejeitado' : 'Orçamento aprovado' }}
      </h1>
      <p class="text-sm text-gray-500">
        {{ decisionStatus === 'rejeitado'
          ? 'Este orçamento já foi rejeitado anteriormente.'
          : 'Este orçamento já foi aprovado e está em processamento.' }}
      </p>
    </div>

    <!-- ═══ ACTIVE — Full approval page (Fiscal Layout) ═══ -->
    <div v-else-if="pageState === 'active'" class="max-w-[800px] w-full space-y-5">

      <!-- Documento principal — Layout Fiscal -->
      <div v-if="!isLegacy" class="space-y-4">

        <!-- ═══ BLOCO EMPRESA (separado) ═══ -->
        <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <!-- HEADER: Logo + Dados Empresa -->
          <div class="px-8 py-6 flex items-start justify-between">
            <div class="flex-shrink-0">
              <img v-if="empresa.logo_url" :src="empresa.logo_url" :alt="empresa.nome" class="object-contain" :style="{ height: Math.min(logoOrcSizePx, 80) + 'px', maxWidth: '180px' }" />
              <div v-else class="w-12 h-12 rounded bg-gray-100 flex items-center justify-center">
                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
              </div>
            </div>
            <div class="text-right text-[13px] leading-relaxed text-gray-600">
              <p class="font-semibold text-gray-900">{{ empresa.razao_social || empresa.nome }}</p>
              <p v-if="empresa.cnpj" class="mt-0.5">{{ empresa.cnpj }}</p>
              <p v-if="empresa.endereco" class="mt-0.5">{{ empresa.endereco }}</p>
              <p v-if="empresa.telefone" class="mt-0.5">{{ empresa.telefone }}</p>
            </div>
          </div>

          <!-- Nº Proposta + Data -->
          <div class="px-8 py-4 flex items-center justify-between bg-gray-50 border-t border-gray-200">
            <div>
              <span class="text-[11px] font-semibold uppercase text-gray-400">Proposta</span>
              <p class="text-sm font-bold text-gray-900 mt-0.5">{{ orcamento?.numero_orcamento || `#${orcamento?.id}` }}</p>
            </div>
            <div class="text-right">
              <span class="text-[11px] font-semibold uppercase text-gray-400">Data de emissão</span>
              <p class="text-sm font-medium text-gray-700 mt-0.5">{{ formatDate(orcamento?.created_at) }}</p>
            </div>
          </div>
        </div>

        <!-- ═══ BLOCO CONTEÚDO (destinatário + itens + valores) ═══ -->
        <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">

        <!-- ═══ BLOCO CLIENTE ═══ -->
        <div class="px-8 py-5 border-b border-gray-200">
          <p class="text-[11px] font-semibold uppercase text-gray-400 mb-2">CLIENTE</p>
          <p class="text-sm font-semibold text-gray-900">{{ orcamento?.cliente_nome || '—' }}</p>
          <p v-if="orcamento?.cliente_cpf_cnpj" class="text-[13px] text-gray-600 mt-0.5">{{ orcamento.cliente_cpf_cnpj }}</p>
        </div>

        <!-- ═══ TABELA DE ITENS ═══ -->
        <div class="px-8 py-5">
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-200">
                  <th class="text-[11px] font-semibold uppercase text-gray-500 px-3 py-2.5 w-12">Item</th>
                  <th class="text-[11px] font-semibold uppercase text-gray-500 px-3 py-2.5">Descrição</th>
                  <th class="text-[11px] font-semibold uppercase text-gray-500 px-3 py-2.5 text-right w-16">Qtd</th>
                  <th class="text-[11px] font-semibold uppercase text-gray-500 px-3 py-2.5 text-right w-28">Valor Unit.</th>
                  <th class="text-[11px] font-semibold uppercase text-gray-500 px-3 py-2.5 text-right w-28">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in itensOrcamento" :key="item.id" class="border-b border-gray-100 even:bg-gray-50">
                  <td class="px-3 py-3 text-[13px] text-gray-700 font-medium tabular-nums">{{ idx + 1 }}</td>
                  <td class="px-3 py-3">
                    <p class="text-[13px] font-medium text-gray-900">{{ item.descricao || '—' }}</p>
                    <p class="text-[11px] text-gray-500 mt-0.5">{{ item.material_nome }} · {{ item.largura_cm }}×{{ item.altura_cm }}cm</p>
                  </td>
                  <td class="px-3 py-3 text-[13px] text-gray-700 text-right tabular-nums">{{ item.quantidade }}</td>
                  <td class="px-3 py-3 text-[13px] text-gray-700 text-right tabular-nums">{{ formatCurrency(item.valor_item / (item.quantidade || 1)) }}</td>
                  <td class="px-3 py-3 text-[13px] font-semibold text-gray-900 text-right tabular-nums">{{ formatCurrency(item.valor_item) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Fotos dos itens (se houver) -->
          <div v-if="itensOrcamento.some(i => i.foto_arte_url || i.foto_local_url)" class="mt-5 pt-4 border-t border-gray-200">
            <p class="text-[11px] font-semibold uppercase text-gray-400 mb-3">Anexos</p>
            <div class="space-y-3">
              <div v-for="(item, idx) in itensOrcamento.filter(i => i.foto_arte_url || i.foto_local_url)" :key="'foto-'+item.id" class="grid grid-cols-2 gap-3">
                <div v-if="item.foto_arte_url">
                  <span class="text-[10px] font-medium uppercase text-gray-400 block mb-1">Item {{ itensOrcamento.indexOf(item) + 1 }} — Arte</span>
                  <a v-if="isPdf(item.foto_arte_url)" :href="item.foto_arte_url" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/></svg>
                    Ver PDF
                  </a>
                  <img v-else :src="item.foto_arte_url" alt="Arte" class="w-full h-24 rounded object-cover cursor-pointer hover:opacity-80 transition-opacity" @click="openLightbox(item.foto_arte_url)" />
                </div>
                <div v-if="item.foto_local_url">
                  <span class="text-[10px] font-medium uppercase text-gray-400 block mb-1">Item {{ itensOrcamento.indexOf(item) + 1 }} — Local</span>
                  <a v-if="isPdf(item.foto_local_url)" :href="item.foto_local_url" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/></svg>
                    Ver PDF
                  </a>
                  <img v-else :src="item.foto_local_url" alt="Local" class="w-full h-24 rounded object-cover cursor-pointer hover:opacity-80 transition-opacity" @click="openLightbox(item.foto_local_url)" />
                </div>
              </div>
            </div>
          </div>

          <!-- ═══ RESUMO DE VALORES ═══ -->
          <div class="mt-6 pt-4 border-t border-gray-200">
            <div class="space-y-2 max-w-[280px] ml-auto">
              <div class="flex justify-between text-[13px]">
                <span class="text-gray-500">Subtotal</span>
                <span class="text-gray-700 tabular-nums">{{ formatCurrency(subtotalItens) }}</span>
              </div>
              <div v-if="orcamento?.valor_mao_obra_global > 0" class="flex justify-between text-[13px]">
                <span class="text-gray-500">Mão de obra</span>
                <span class="text-gray-700 tabular-nums">{{ formatCurrency(orcamento.valor_mao_obra_global) }}</span>
              </div>
              <div v-if="totalDescontos > 0" class="flex justify-between text-[13px]">
                <span class="text-gray-500">Desconto</span>
                <span class="text-green-600 tabular-nums">-{{ formatCurrency(totalDescontos) }}</span>
              </div>
              <div class="flex justify-between items-center pt-3 mt-2 border-t border-gray-200">
                <span class="text-sm font-semibold text-gray-900">Total</span>
                <span class="text-xl font-bold text-gray-900 tabular-nums">{{ formatCurrency(orcamento?.valor_total) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ═══ RODAPÉ: Validade + Condições ═══ -->
        <div class="px-8 py-4 border-t border-gray-200 bg-gray-50/50">
          <div class="flex flex-wrap gap-x-8 gap-y-2 text-xs text-gray-500">
            <div>
              <span class="font-medium">Validade da proposta:</span> {{ formatDate(orcamento?.data_validade) }}
            </div>
            <div v-if="orcamento?.data_entrega">
              <span class="font-medium">Previsão de entrega:</span> {{ formatDate(orcamento.data_entrega) }}
            </div>
            <div v-else-if="orcamento?.prazo_estimado_dias">
              <span class="font-medium">Prazo estimado:</span> {{ orcamento.prazo_estimado_dias }} dias
            </div>
          </div>
        </div>

      </div><!-- fim BLOCO CONTEÚDO -->

      </div><!-- fim v-if="!isLegacy" space-y-4 -->

      <!-- Orçamento data card — LEGACY (pedido-based) -->
      <div v-else class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 class="text-sm font-bold text-gray-700 uppercase tracking-wide">Detalhes do Orçamento</h3>
        </div>

        <div class="px-5 py-4 space-y-3">
          <div>
            <span class="text-xs font-semibold text-gray-400 uppercase">Descrição</span>
            <p class="text-sm text-gray-800 mt-0.5">{{ orcamento?.descricao || '—' }}</p>
          </div>
          <div>
            <span class="text-xs font-semibold text-gray-400 uppercase">Material</span>
            <p class="text-sm text-gray-800 mt-0.5">{{ orcamento?.material_nome || '—' }}</p>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <span class="text-xs font-semibold text-gray-400 uppercase">Dimensões</span>
              <p class="text-sm text-gray-800 mt-0.5">{{ orcamento?.largura_cm }} × {{ orcamento?.altura_cm }} cm</p>
            </div>
            <div>
              <span class="text-xs font-semibold text-gray-400 uppercase">Quantidade</span>
              <p class="text-sm text-gray-800 mt-0.5">{{ orcamento?.quantidade }}</p>
            </div>
          </div>

          <!-- Valores discriminados (legacy) -->
          <div class="border-t border-gray-100 pt-3 space-y-1.5">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Material</span>
              <span class="text-gray-700">{{ formatCurrency(orcamento?.valor_material) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Mão de obra</span>
              <span class="text-gray-700">{{ formatCurrency(orcamento?.valor_mao_obra) }}</span>
            </div>
            <div v-if="totalDescontos > 0" class="flex justify-between text-sm">
              <span class="text-gray-500">Descontos</span>
              <span class="text-green-600">-{{ formatCurrency(totalDescontos) }}</span>
            </div>
            <div class="flex justify-between text-base font-bold border-t border-gray-100 pt-2 mt-2">
              <span class="text-gray-800">Total</span>
              <span class="text-green-600">{{ formatCurrency(orcamento?.valor_total) }}</span>
            </div>
          </div>

          <!-- Prazo e Validade (legacy) -->
          <div class="grid grid-cols-2 gap-4 border-t border-gray-100 pt-3">
            <div>
              <span class="text-xs font-semibold text-gray-400 uppercase">Prazo estimado</span>
              <p class="text-sm text-gray-800 mt-0.5">{{ orcamento?.prazo_estimado_dias ? `${orcamento.prazo_estimado_dias} dias` : '—' }}</p>
            </div>
            <div>
              <span class="text-xs font-semibold text-gray-400 uppercase">Válido até</span>
              <p class="text-sm text-gray-800 mt-0.5">{{ formatDate(orcamento?.data_validade) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Artes anexadas (legacy only) -->
      <div v-if="isLegacy && artes.length > 0" class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 class="text-sm font-bold text-gray-700 uppercase tracking-wide">Artes Anexadas</h3>
        </div>
        <div class="px-5 py-4">
          <div class="grid grid-cols-3 gap-3">
            <a
              v-for="arte in artes"
              :key="arte.id"
              :href="arte.url"
              target="_blank"
              rel="noopener noreferrer"
              class="aspect-square rounded-xl overflow-hidden border-2 border-gray-100 hover:border-indigo-300 transition-colors group"
            >
              <img
                :src="arte.url"
                :alt="arte.nome_arquivo"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </a>
          </div>
        </div>
      </div>

      <!-- Mobile bottom spacer (so fixed buttons don't overlap content) -->
      <div v-if="!actionDone && !showRejectReason && feedbackState === 'idle'" class="sm:hidden h-24"></div>

      <!-- Action buttons -->
      <div v-if="!actionDone && feedbackState === 'idle'" class="space-y-3">
        <!-- Reject reason textarea (shown after reject click) -->
        <div v-if="showRejectReason" class="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
          <label class="text-sm font-semibold text-gray-700 block mb-2">Motivo da rejeição (opcional)</label>
          <textarea
            v-model="rejectReason"
            maxlength="500"
            rows="3"
            placeholder="Informe o motivo, se desejar..."
            class="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:border-red-300 resize-none transition-colors"
          ></textarea>
          <p class="text-xs text-gray-400 mt-1 text-right">{{ rejectReason.length }}/500</p>
          <div class="flex gap-3 mt-3">
            <button
              type="button"
              class="flex-1 py-3 rounded-xl text-sm font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              :disabled="actionLoading"
              @click="showRejectReason = false"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="flex-1 py-3 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
              :disabled="actionLoading"
              @click="confirmReject"
            >
              <span v-if="actionLoading" class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
              Confirmar Rejeição
            </button>
          </div>
        </div>

        <!-- Main action buttons: fixed on mobile, inline on desktop -->
        <div v-else>
          <!-- Mobile fixed bottom bar -->
          <div class="fixed bottom-0 inset-x-0 bg-white p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] z-50 sm:hidden space-y-3">
            <div class="flex gap-3">
              <button
                type="button"
                class="flex-1 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-all disabled:opacity-50 active:scale-[0.98]"
                :disabled="actionLoading"
                @click="handleReject"
              >
                <span v-if="actionLoading && actionType === 'reject'" class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                <span class="flex items-center justify-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  Reprovar
                </span>
              </button>
              <button
                type="button"
                class="flex-1 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-green-500 hover:bg-green-600 transition-all disabled:opacity-50 active:scale-[0.98]"
                :disabled="actionLoading"
                @click="handleApprove"
              >
                <span v-if="actionLoading && actionType === 'approve'" class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                <span class="flex items-center justify-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  Aprovar
                </span>
              </button>
            </div>
            <button
              type="button"
              class="w-full py-3.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-white bg-gray-800 hover:bg-gray-900 active:scale-[0.98]"
              :disabled="gerandoPdf"
              @click="gerarPdfOrcamento"
            >
              <span v-if="gerandoPdf" class="inline-block w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></span>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
              {{ gerandoPdf ? 'Gerando...' : 'Baixar PDF' }}
            </button>
          </div>

          <!-- Desktop inline buttons -->
          <div class="hidden sm:block">
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
              <!-- Dados para Pagamento -->
              <div v-if="empresa.banco || empresa.chave_pix">
                <div class="flex items-center justify-between mb-3">
                  <p class="text-[11px] font-semibold uppercase text-gray-400">Dados para Pagamento</p>
                  <button type="button" class="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium transition-all hover:bg-gray-100" :class="copiouDados ? 'text-green-600' : 'text-gray-500'" @click="copiarDadosBancarios">
                    <svg v-if="!copiouDados" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></svg>
                    <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    {{ copiouDados ? 'Copiado!' : 'Copiar' }}
                  </button>
                </div>
                <div class="grid grid-cols-2 gap-x-6 gap-y-2 text-xs text-gray-700">
                  <div v-if="empresa.banco"><p class="text-[10px] font-medium uppercase text-gray-400">Banco</p><p class="font-semibold">{{ empresa.banco }}</p></div>
                  <div v-if="empresa.agencia"><p class="text-[10px] font-medium uppercase text-gray-400">Agência</p><p class="font-semibold">{{ empresa.agencia }}</p></div>
                  <div v-if="empresa.conta"><p class="text-[10px] font-medium uppercase text-gray-400">Conta</p><p class="font-semibold">{{ empresa.conta }} <span v-if="empresa.tipo_conta" class="font-normal text-gray-400">({{ empresa.tipo_conta }})</span></p></div>
                  <div v-if="empresa.titular_conta"><p class="text-[10px] font-medium uppercase text-gray-400">Titular</p><p class="font-semibold">{{ empresa.titular_conta }}</p></div>
                </div>
                <div v-if="empresa.chave_pix" class="mt-3 pt-3 border-t border-dashed border-gray-200">
                  <p class="text-[10px] font-medium uppercase text-gray-400">Chave PIX</p>
                  <p class="text-sm font-mono font-bold text-gray-900 mt-0.5">{{ empresa.chave_pix }}</p>
                </div>
              </div>
              <!-- Aprovar/Reprovar -->
              <div class="pt-4 border-t border-gray-100 space-y-3">
                <div class="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    class="relative py-4 px-5 rounded-xl text-base font-bold text-white bg-red-500 hover:bg-red-600 transition-all disabled:opacity-50 active:scale-[0.98]"
                    :disabled="actionLoading"
                    @click="handleReject"
                  >
                    <span v-if="actionLoading && actionType === 'reject'" class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                    <span class="flex items-center justify-center gap-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      Reprovar
                    </span>
                  </button>
                  <button
                    type="button"
                    class="relative py-4 px-5 rounded-xl text-base font-bold text-white bg-green-500 hover:bg-green-600 transition-all disabled:opacity-50 active:scale-[0.98]"
                    :disabled="actionLoading"
                    @click="handleApprove"
                  >
                    <span v-if="actionLoading && actionType === 'approve'" class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                    <span class="flex items-center justify-center gap-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                      Aprovar
                    </span>
                  </button>
                </div>
                <!-- Baixar PDF -->
                <button
                  type="button"
                  class="w-full py-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-white bg-gray-800 hover:bg-gray-900 active:scale-[0.98]"
                  :disabled="gerandoPdf"
                  @click="gerarPdfOrcamento"
                >
                  <span v-if="gerandoPdf" class="inline-block w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></span>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                  {{ gerandoPdf ? 'Gerando...' : 'Baixar PDF' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Success confirmation (after feedback animation completes) -->
      <div v-if="actionDone && feedbackState === 'idle'" class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
        <div class="w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center"
          :class="actionType === 'approve' ? 'bg-green-100' : 'bg-red-100'">
          <svg v-if="actionType === 'approve'" class="w-7 h-7 text-green-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg v-else class="w-7 h-7 text-red-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-gray-800 mb-1">
          {{ actionType === 'approve' ? 'Orçamento aprovado!' : 'Orçamento rejeitado' }}
        </h3>
        <p class="text-sm text-gray-500">
          {{ actionType === 'approve'
            ? 'Seu pedido foi aprovado com sucesso. A Ordem de Serviço foi gerada e a produção será iniciada.'
            : 'O orçamento foi rejeitado. A empresa será notificada.' }}
        </p>
      </div>

      <!-- Error message -->
      <div v-if="actionError" class="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
        {{ actionError }}
      </div>
    </div>

  </div>

  <!-- Lightbox para fotos -->
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="lightboxUrl"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        @click="lightboxUrl = null"
      >
        <img
          :src="lightboxUrl"
          alt="Foto ampliada"
          class="max-w-full max-h-[90vh] rounded-xl shadow-2xl object-contain"
          @click.stop
        />
        <button
          type="button"
          class="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          @click="lightboxUrl = null"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
    </Transition>
  </Teleport>

  <!-- ═══ FEEDBACK OVERLAY: Aprovação/Rejeição ═══ -->
  <Teleport to="body">
    <Transition name="feedback-overlay">
      <div
        v-if="feedbackState !== 'idle'"
        class="fixed inset-0 z-[200] flex items-center justify-center bg-white/95 backdrop-blur-sm"
      >
        <div class="flex flex-col items-center gap-4">
          <!-- Animated check icon (approval) -->
          <div
            v-if="feedbackState === 'approved'"
            class="feedback-icon w-24 h-24 rounded-full bg-green-100 flex items-center justify-center"
            :class="{ 'feedback-icon-active': feedbackAnimating }"
          >
            <svg class="w-12 h-12 text-green-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <!-- Animated X icon (rejection) -->
          <div
            v-if="feedbackState === 'rejected'"
            class="feedback-icon w-24 h-24 rounded-full bg-red-100 flex items-center justify-center"
            :class="{ 'feedback-icon-active': feedbackAnimating }"
          >
            <svg class="w-12 h-12 text-red-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <!-- Label -->
          <p class="text-lg font-semibold" :class="feedbackState === 'approved' ? 'text-green-700' : 'text-red-700'">
            {{ feedbackState === 'approved' ? 'Proposta aprovada!' : 'Proposta rejeitada' }}
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { createSupabaseClient } from '~/lib/supabase'

definePageMeta({ layout: false })

useHead({ title: 'Aprovação de Orçamento' })

const route = useRoute()
const supabase = createSupabaseClient()
const { formatCurrency, formatDate } = useLocale()

// ─── State ─────────────────────────────────────────
type PageState = 'loading' | 'not_found' | 'expired' | 'already_decided' | 'active'

const pageState = ref<PageState>('loading')
const orcamento = ref<any>(null)
const itensOrcamento = ref<any[]>([])
const artes = ref<{ id: number; nome_arquivo: string; url: string }[]>([])
const empresa = ref<{ nome: string; logo_url: string | null; razao_social?: string | null; cnpj?: string | null; endereco?: string | null; telefone?: string | null; email?: string | null; banco?: string | null; agencia?: string | null; conta?: string | null; tipo_conta?: string | null; chave_pix?: string | null; titular_conta?: string | null }>({ nome: '', logo_url: null })
const pageBg = ref('var(--color-bg, #f8fafc)')
const lightboxUrl = ref<string | null>(null)
const logoOrcSizePx = ref(160)
const isLegacy = ref(false)
const copiouDados = ref(false)

function copiarDadosBancarios() {
  const parts: string[] = []
  if (empresa.value.banco) parts.push(`Banco: ${empresa.value.banco}`)
  if (empresa.value.agencia) parts.push(`Ag: ${empresa.value.agencia}`)
  if (empresa.value.conta) parts.push(`CC: ${empresa.value.conta}${empresa.value.tipo_conta ? ' (' + empresa.value.tipo_conta + ')' : ''}`)
  if (empresa.value.titular_conta) parts.push(`Titular: ${empresa.value.titular_conta}`)
  if (empresa.value.chave_pix) parts.push(`PIX: ${empresa.value.chave_pix}`)
  const text = parts.join('\n')
  if (text && navigator.clipboard) {
    navigator.clipboard.writeText(text)
    copiouDados.value = true
    setTimeout(() => { copiouDados.value = false }, 2000)
  }
}

const showRejectReason = ref(false)
const rejectReason = ref('')
const actionLoading = ref(false)
const actionDone = ref(false)
const actionType = ref<'approve' | 'reject' | null>(null)
const actionError = ref<string | null>(null)
const gerandoPdf = ref(false)

// ─── Feedback animation state ──────────────────────
type FeedbackState = 'idle' | 'approved' | 'rejected'
const feedbackState = ref<FeedbackState>('idle')
const feedbackAnimating = ref(false)

function triggerFeedback(type: 'approved' | 'rejected') {
  feedbackState.value = type
  // Trigger scale+opacity animation after a tick
  nextTick(() => {
    feedbackAnimating.value = true
  })
  // After 1.8s, hide overlay and show the success card
  setTimeout(() => {
    feedbackState.value = 'idle'
    feedbackAnimating.value = false
  }, 1800)
}

// ─── Computed ──────────────────────────────────────
const subtotalItens = computed(() => {
  if (!itensOrcamento.value.length) return 0
  return itensOrcamento.value.reduce((sum: number, item: any) => sum + (item.valor_item ?? 0), 0)
})

const totalDescontos = computed(() => {
  if (!orcamento.value) return 0
  if (isLegacy.value) {
    // Legacy: based on pedido values
    const subtotal = (orcamento.value.valor_material ?? 0) + (orcamento.value.valor_mao_obra ?? 0)
    const descVolume = subtotal * ((orcamento.value.desconto_volume_percentual ?? 0) / 100)
    const aposVolume = subtotal - descVolume
    const descManualPerc = aposVolume * ((orcamento.value.desconto_percentual ?? 0) / 100)
    const descManualVal = orcamento.value.desconto_valor ?? 0
    return descVolume + descManualPerc + descManualVal
  } else {
    // New flow: based on itens total + mao de obra global
    const subtotal = subtotalItens.value + (orcamento.value.valor_mao_obra_global ?? 0)
    const descVolume = subtotal * ((orcamento.value.desconto_volume_percentual ?? 0) / 100)
    const aposVolume = subtotal - descVolume
    const descManualPerc = aposVolume * ((orcamento.value.desconto_percentual ?? 0) / 100)
    const descManualVal = orcamento.value.desconto_valor ?? 0
    return descVolume + descManualPerc + descManualVal
  }
})

const decisionStatus = computed(() => {
  if (!orcamento.value) return ''
  if (isLegacy.value) {
    // Legacy: map pedido status
    return orcamento.value.status_pedido === 'cancelado' ? 'rejeitado' : 'aprovado'
  }
  return orcamento.value.status
})

// ─── Helpers ───────────────────────────────────────
function openLightbox(url: string) {
  lightboxUrl.value = url
}

function isPdf(url: string | null | undefined): boolean {
  if (!url) return false
  return url.toLowerCase().endsWith('.pdf')
}

// ─── Fetch orcamento by token ──────────────────────
async function loadOrcamento() {
  const token = route.params.token as string
  if (!token) {
    pageState.value = 'not_found'
    return
  }

  // First: fetch the orcamento base data
  const { data, error } = await supabase
    .from('orcamentos_adesivo')
    .select(`
      id,
      pedido_id,
      empresa_id,
      cliente_id,
      numero_orcamento,
      status,
      valor_material,
      valor_mao_obra,
      valor_mao_obra_global,
      desconto_volume_percentual,
      desconto_percentual,
      desconto_valor,
      valor_total,
      prazo_estimado_dias,
      data_entrega,
      data_validade,
      created_at,
      token_aprovacao,
      origem_aprovacao,
      motivo_rejeicao,
      foto_local_url,
      clientes(nome, cpf_cnpj)
    `)
    .eq('token_aprovacao', token)
    .maybeSingle()

  if (error || !data) {
    pageState.value = 'not_found'
    return
  }

  // Determine if legacy (has pedido_id, no V2 status)
  const hasV2Status = data.status && ['rascunho', 'enviado', 'aprovado', 'rejeitado', 'vencido'].includes(data.status)
  isLegacy.value = !!data.pedido_id && !hasV2Status

  if (isLegacy.value) {
    // ═══ LEGACY FLOW: fetch pedido data ═══
    await loadLegacyOrcamento(data)
  } else {
    // ═══ NEW FLOW: fetch itens_orcamento ═══
    await loadNewFlowOrcamento(data)
  }
}

// ─── Legacy flow (pedido-based) ────────────────────
async function loadLegacyOrcamento(data: any) {
  // Fetch pedido details
  const { data: pedidoData } = await supabase
    .from('pedidos_adesivo')
    .select(`
      id,
      status,
      descricao,
      largura_cm,
      altura_cm,
      quantidade,
      area_total_m2,
      material_id,
      empresa_id,
      materiais_adesivo(nome)
    `)
    .eq('id', data.pedido_id)
    .maybeSingle()

  if (!pedidoData) {
    pageState.value = 'not_found'
    return
  }

  orcamento.value = {
    id: data.id,
    pedido_id: data.pedido_id,
    empresa_id: data.empresa_id,
    descricao: pedidoData.descricao ?? null,
    material_nome: (pedidoData as any).materiais_adesivo?.nome ?? null,
    largura_cm: pedidoData.largura_cm ?? null,
    altura_cm: pedidoData.altura_cm ?? null,
    quantidade: pedidoData.quantidade ?? null,
    valor_material: data.valor_material,
    valor_mao_obra: data.valor_mao_obra,
    desconto_volume_percentual: data.desconto_volume_percentual ?? 0,
    desconto_percentual: data.desconto_percentual ?? 0,
    desconto_valor: data.desconto_valor ?? 0,
    valor_total: data.valor_total,
    prazo_estimado_dias: data.prazo_estimado_dias,
    data_validade: data.data_validade,
    created_at: data.created_at,
    status_pedido: pedidoData.status ?? 'orcamento_enviado',
    pedido_empresa_id: pedidoData.empresa_id ?? data.empresa_id,
  }

  // Fetch artes (legacy)
  const { data: artesData } = await supabase
    .from('pedidos_adesivo_artes')
    .select('id, nome_arquivo, url')
    .eq('pedido_id', data.pedido_id)

  artes.value = artesData ?? []

  // Fetch empresa info
  const eId = orcamento.value.pedido_empresa_id ?? orcamento.value.empresa_id
  await loadEmpresaInfo(eId)

  // Determine page state (legacy)
  const status = orcamento.value.status_pedido
  const now = new Date()
  const validade = new Date(orcamento.value.data_validade)

  if (status === 'aprovado' || status === 'em_producao' || status === 'pronto' || status === 'entregue' || status === 'cancelado') {
    pageState.value = 'already_decided'
  } else if (status === 'orcamento_enviado' && now > validade) {
    pageState.value = 'expired'
  } else {
    pageState.value = 'active'
  }
}

// ─── New flow (multi-item) ─────────────────────────
async function loadNewFlowOrcamento(data: any) {
  orcamento.value = {
    id: data.id,
    pedido_id: data.pedido_id,
    empresa_id: data.empresa_id,
    cliente_id: data.cliente_id,
    cliente_nome: data.clientes?.nome ?? null,
    cliente_cpf_cnpj: data.clientes?.cpf_cnpj ?? null,
    numero_orcamento: data.numero_orcamento,
    status: data.status,
    valor_material: data.valor_material,
    valor_mao_obra_global: data.valor_mao_obra_global ?? 0,
    desconto_volume_percentual: data.desconto_volume_percentual ?? 0,
    desconto_percentual: data.desconto_percentual ?? 0,
    desconto_valor: data.desconto_valor ?? 0,
    valor_total: data.valor_total,
    prazo_estimado_dias: data.prazo_estimado_dias,
    data_entrega: data.data_entrega ?? null,
    data_validade: data.data_validade,
    created_at: data.created_at,
  }

  // Fetch itens_orcamento with material name, foto_arte_url and foto_local_url
  const { data: itensData } = await supabase
    .from('itens_orcamento')
    .select(`
      id,
      descricao,
      material_id,
      largura_cm,
      altura_cm,
      quantidade,
      modalidade_preco,
      preco_unitario,
      area_m2,
      valor_item,
      foto_arte_url,
      foto_local_url,
      materiais_adesivo(nome)
    `)
    .eq('orcamento_id', data.id)
    .order('id', { ascending: true })

  itensOrcamento.value = (itensData ?? []).map((item: any) => ({
    ...item,
    material_nome: item.materiais_adesivo?.nome ?? '—',
    foto_arte_url: item.foto_arte_url ?? null,
    foto_local_url: item.foto_local_url ?? null,
  }))

  // Fetch empresa info
  await loadEmpresaInfo(data.empresa_id)

  // Determine page state (new flow V2 status)
  const status = data.status
  const now = new Date()
  const validade = data.data_validade ? new Date(data.data_validade) : null

  if (status === 'aprovado' || status === 'rejeitado') {
    pageState.value = 'already_decided'
  } else if (status === 'enviado' && validade && now > validade) {
    pageState.value = 'expired'
  } else if (status === 'vencido') {
    pageState.value = 'expired'
  } else if (status === 'enviado') {
    pageState.value = 'active'
  } else {
    // rascunho or other unexpected status - not actionable via public link
    pageState.value = 'not_found'
  }
}

// ─── Load empresa info ─────────────────────────────
async function loadEmpresaInfo(empresaId: number) {
  if (!empresaId) return

  const [personalRes, empresaRes] = await Promise.all([
    supabase.from('empresa_personalizacao').select('*').eq('empresa_id', empresaId).maybeSingle(),
    supabase.from('empresas').select('nome').eq('id', empresaId).maybeSingle(),
  ])

  const data = personalRes.data
  empresa.value = {
    nome: data?.nome_empresa || empresaRes.data?.nome || '',
    logo_url: data?.logo_orcamento_url || data?.logo_url || null,
    razao_social: data?.razao_social || null,
    cnpj: data?.cnpj || null,
    endereco: data?.endereco || null,
    telefone: data?.telefone || null,
    email: data?.email || null,
    banco: data?.banco || null,
    agencia: data?.agencia || null,
    conta: data?.conta || null,
    tipo_conta: data?.tipo_conta || null,
    chave_pix: data?.chave_pix || null,
    titular_conta: data?.titular_conta || null,
  }

  // Tamanho do logo — usa logo_orcamento_size (valor numérico em px)
  const sizeStr = data?.logo_orcamento_size || '160'
  const parsed = parseInt(sizeStr)
  logoOrcSizePx.value = isNaN(parsed) ? 160 : Math.max(parsed, 80)

  // Aplicar tema da empresa na página de aprovação
  if (data && typeof document !== 'undefined') {
    const root = document.documentElement.style
    const cor = data.cor_primaria || '#4f46e5'
    const corTexto = data.cor_primaria_texto || '#ffffff'
    const dir = data.grad_direction || '135deg'
    const corGrad = data.cor_primaria_grad || null
    const corFundo = data.cor_fundo || '#f8fafc'
    const corFundoGrad = data.cor_fundo_grad || null
    const corCard = data.cor_card || '#ffffff'
    const corCardTexto = data.cor_card_texto || '#1e293b'
    const corCardBorder = data.cor_card_border || 'rgba(0,0,0,0.06)'

    const primaryBg = corGrad
      ? `linear-gradient(${dir}, ${cor}, ${corGrad})`
      : cor

    // Background da página
    const bgValue = corFundoGrad
      ? `linear-gradient(${dir}, ${corFundo}, ${corFundoGrad})`
      : corFundo
    pageBg.value = bgValue

    root.setProperty('--color-primary', cor)
    root.setProperty('--color-primary-text', corTexto)
    root.setProperty('--color-primary-bg', primaryBg)
    root.setProperty('--color-bg', bgValue)
    root.setProperty('--color-card', corCard)
    root.setProperty('--color-card-texto', corCardTexto)
    root.setProperty('--color-card-border', corCardBorder)

    // Botão e accent
    root.setProperty('--color-btn', primaryBg)
    root.setProperty('--color-btn-text', corTexto)
  }
}

// ─── Approve action ────────────────────────────────
async function handleApprove() {
  actionLoading.value = true
  actionType.value = 'approve'
  actionError.value = null

  try {
    if (isLegacy.value) {
      await handleApproveLegacy()
    } else {
      await handleApproveNewFlow()
    }
  } catch (e) {
    actionError.value = 'Ocorreu um erro inesperado. Tente novamente.'
  } finally {
    actionLoading.value = false
  }
}

// ─── Approve: New flow (RPC gerar_ordem_servico) ───
async function handleApproveNewFlow() {
  const token = route.params.token as string
  const { error: rpcError } = await supabase.rpc('gerar_ordem_servico', {
    p_orcamento_id: orcamento.value.id,
    p_token: token,
    p_forma_pagamento: null,
    p_origem: 'link_externo',
  })

  if (rpcError) {
    // Check if it's a duplicate approval (req 3.8)
    if (rpcError.message?.includes('já gerada') || rpcError.message?.includes('já foi')) {
      actionError.value = 'Este orçamento já foi aprovado anteriormente.'
    } else if (rpcError.message?.includes('não está em status válido')) {
      actionError.value = 'Este orçamento não pode mais ser aprovado.'
    } else if (rpcError.message?.includes('Token')) {
      actionError.value = 'Token de aprovação inválido.'
    } else {
      actionError.value = 'Erro ao aprovar o orçamento. Tente novamente.'
    }
    return
  }

  // Atualizar data_entrega na OS a partir do orçamento
  if (orcamento.value.data_entrega) {
    const { data: osData } = await supabase
      .from('ordens_servico_adesivo')
      .select('id')
      .eq('orcamento_id', orcamento.value.id)
      .limit(1)
      .single()
    if (osData?.id) {
      await supabase.from('ordens_servico_adesivo').update({ data_entrega: orcamento.value.data_entrega }).eq('id', osData.id)
    }
  }

  actionDone.value = true
  triggerFeedback('approved')
}

// ─── Approve: Legacy flow (RPC aprovar_pedido_legacy) ──────────
async function handleApproveLegacy() {
  const token = route.params.token as string
  const { error: rpcError } = await supabase.rpc('aprovar_pedido_legacy', {
    p_orcamento_id: orcamento.value.id,
    p_token: token,
  })

  if (rpcError) {
    if (rpcError.message?.includes('Token')) {
      actionError.value = 'Token de aprovação inválido.'
    } else {
      actionError.value = 'Erro ao aprovar. Tente novamente.'
    }
    return
  }

  actionDone.value = true
  triggerFeedback('approved')
}

// ─── Reject action ─────────────────────────────────
function handleReject() {
  showRejectReason.value = true
}

async function confirmReject() {
  actionLoading.value = true
  actionType.value = 'reject'
  actionError.value = null

  try {
    if (isLegacy.value) {
      await confirmRejectLegacy()
    } else {
      await confirmRejectNewFlow()
    }
  } catch (e) {
    actionError.value = 'Ocorreu um erro inesperado. Tente novamente.'
  } finally {
    actionLoading.value = false
  }
}

// ─── Reject: New flow ──────────────────────────────
async function confirmRejectNewFlow() {
  const token = route.params.token as string
  const motivo = rejectReason.value.trim().slice(0, 500) || null

  const { error: rpcError } = await supabase.rpc('rejeitar_orcamento', {
    p_orcamento_id: orcamento.value.id,
    p_token: token,
    p_motivo: motivo,
    p_origem: 'link_externo',
  })

  if (rpcError) {
    if (rpcError.message?.includes('Token')) {
      actionError.value = 'Token de aprovação inválido.'
    } else if (rpcError.message?.includes('não está em status válido')) {
      actionError.value = 'Este orçamento não pode mais ser rejeitado.'
    } else {
      actionError.value = 'Erro ao rejeitar o orçamento. Tente novamente.'
    }
    return
  }

  actionDone.value = true
  showRejectReason.value = false
  triggerFeedback('rejected')
}

// ─── Reject: Legacy flow ───────────────────────────
async function confirmRejectLegacy() {
  const token = route.params.token as string
  const motivo = rejectReason.value.trim().slice(0, 500) || null

  const { error: rpcError } = await supabase.rpc('rejeitar_pedido_legacy', {
    p_orcamento_id: orcamento.value.id,
    p_token: token,
    p_motivo: motivo,
  })

  if (rpcError) {
    if (rpcError.message?.includes('Token')) {
      actionError.value = 'Token de aprovação inválido.'
    } else {
      actionError.value = 'Erro ao rejeitar. Tente novamente.'
    }
    return
  }

  actionDone.value = true
  showRejectReason.value = false
  triggerFeedback('rejected')
}

// ─── Gerar PDF do Orçamento ────────────────────────
async function gerarPdfOrcamento() {
  if (!orcamento.value) return
  gerandoPdf.value = true

  try {
    const { default: jsPDF } = await import('jspdf')
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const marginL = 20
    const marginR = pageWidth - 20
    const contentW = marginR - marginL
    let y = 20

    function checkPage(needed: number) {
      if (y + needed > pageHeight - 20) { doc.addPage(); y = 20 }
    }

    async function loadImageData(url: string): Promise<{ data: string; w: number; h: number } | null> {
      try {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve()
          img.onerror = () => reject()
          img.src = url
        })
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0)
        return { data: canvas.toDataURL('image/png'), w: img.naturalWidth, h: img.naturalHeight }
      } catch { return null }
    }

    // ─── LOGO ───
    if (empresa.value.logo_url) {
      const logoImg = await loadImageData(empresa.value.logo_url)
      if (logoImg) {
        const logoH = Math.min(22, logoOrcSizePx.value * 0.12)
        const logoW = (logoImg.w / logoImg.h) * logoH
        doc.addImage(logoImg.data, 'PNG', (pageWidth - logoW) / 2, y, logoW, logoH)
        y += logoH + 6
      }
    }

    // ─── NÚMERO + DATA ───
    const numero = orcamento.value.numero_orcamento ?? `ORC-${orcamento.value.id}`
    const dataEmissao = new Date(orcamento.value.created_at).toLocaleDateString('pt-BR')
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(242, 147, 37)
    doc.text(numero, pageWidth / 2 - 2, y, { align: 'right' })
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(140)
    doc.text(`  Emitido em ${dataEmissao}`, pageWidth / 2 + 2, y)
    y += 10

    // ─── ITENS DO ORÇAMENTO ───
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(30)
    doc.text('ITENS DO ORÇAMENTO', marginL, y)
    y += 7

    const oItens = itensOrcamento.value
    for (let i = 0; i < oItens.length; i++) {
      const item = oItens[i]
      checkPage(55)

      // Item N + valor
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(242, 147, 37)
      doc.text(`Item ${i + 1}`, marginL + 2, y)
      doc.setTextColor(30)
      doc.text(formatCurrency(item.valor_item), marginR - 2, y, { align: 'right' })
      y += 5.5

      // Descrição
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(30)
      doc.text(item.descricao || '—', marginL + 2, y)
      y += 6.5

      // Material | Dimensões | Qtd labels
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(160)
      doc.text('MATERIAL', marginL + 2, y)
      doc.text('DIMENSÕES', marginL + 50, y)
      doc.text('QTD', marginL + 100, y)
      y += 3.5
      // Material | Dimensões | Qtd values
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(60)
      doc.text(item.material_nome || '—', marginL + 2, y)
      doc.text(`${item.largura_cm} × ${item.altura_cm} cm`, marginL + 50, y)
      doc.text(`${item.quantidade}`, marginL + 100, y)
      y += 6

      // Fotos Arte e Local
      if (item.foto_arte_url || item.foto_local_url) {
        const imgH = 42
        checkPage(imgH + 10)

        doc.setFontSize(7)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(160)
        if (item.foto_arte_url && !isPdf(item.foto_arte_url)) doc.text('ARTE', marginL + 2, y)
        if (item.foto_local_url && !isPdf(item.foto_local_url)) doc.text('LOCAL', marginL + contentW / 2 + 2, y)
        y += 3

        const imgStartY = y
        if (item.foto_arte_url && !isPdf(item.foto_arte_url)) {
          const arteImg = await loadImageData(item.foto_arte_url)
          if (arteImg) {
            const maxW = contentW / 2 - 4
            const ratio = arteImg.w / arteImg.h
            let iw = maxW; let ih = iw / ratio
            if (ih > imgH) { ih = imgH; iw = ih * ratio }
            doc.addImage(arteImg.data, 'PNG', marginL + 2, y, iw, ih)
          }
        }
        if (item.foto_local_url && !isPdf(item.foto_local_url)) {
          const localImg = await loadImageData(item.foto_local_url)
          if (localImg) {
            const maxW = contentW / 2 - 4
            const ratio = localImg.w / localImg.h
            let iw = maxW; let ih = iw / ratio
            if (ih > imgH) { ih = imgH; iw = ih * ratio }
            doc.addImage(localImg.data, 'PNG', marginL + contentW / 2 + 2, y, iw, ih)
          }
        }
        y = imgStartY + imgH + 4
      }

      // Separador entre itens
      if (i < oItens.length - 1) {
        doc.setDrawColor(235)
        doc.line(marginL + 2, y, marginR - 2, y)
        y += 5
      }
    }

    // ─── RESUMO FINANCEIRO ───
    y += 4
    checkPage(30)
    doc.setDrawColor(230)
    doc.line(marginL, y, marginR, y)
    y += 5

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100)
    doc.text('Subtotal dos itens', marginL + 2, y)
    doc.text(formatCurrency(subtotalItens.value), marginR - 2, y, { align: 'right' })
    y += 5

    if (orcamento.value.valor_mao_obra_global > 0) {
      doc.text('Mão de obra', marginL + 2, y)
      doc.text(formatCurrency(orcamento.value.valor_mao_obra_global), marginR - 2, y, { align: 'right' })
      y += 5
    }
    if (totalDescontos.value > 0) {
      doc.setTextColor(34, 139, 34)
      doc.text('Descontos', marginL + 2, y)
      doc.text(`-${formatCurrency(totalDescontos.value)}`, marginR - 2, y, { align: 'right' })
      y += 5
    }

    // Total
    doc.setDrawColor(240)
    doc.line(marginL + 2, y, marginR - 2, y)
    y += 5
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(30)
    doc.text('Total', marginL + 2, y)
    doc.setTextColor(34, 139, 34)
    doc.text(formatCurrency(orcamento.value.valor_total), marginR - 2, y, { align: 'right' })
    y += 8

    // ─── PRAZO + VALIDADE ───
    checkPage(12)
    doc.setDrawColor(240)
    doc.line(marginL, y, marginR, y)
    y += 5
    doc.setFontSize(7)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(160)
    doc.text('PRAZO ESTIMADO', marginL + 2, y)
    doc.text('VÁLIDO ATÉ', marginL + contentW / 2, y)
    y += 3.5
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(60)
    doc.text(orcamento.value.prazo_estimado_dias ? `${orcamento.value.prazo_estimado_dias} dias` : '—', marginL + 2, y)
    doc.text(orcamento.value.data_validade ? new Date(orcamento.value.data_validade).toLocaleDateString('pt-BR') : '—', marginL + contentW / 2, y)

    // Download
    const nomeArquivo = `Orcamento_${numero.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
    doc.save(nomeArquivo)
  } catch (err) {
    console.error('Erro ao gerar PDF:', err)
  } finally {
    gerandoPdf.value = false
  }
}

// ─── Mount ─────────────────────────────────────────
onMounted(() => {
  loadOrcamento()
})
</script>


<style scoped>
/* ═══ Feedback overlay transitions ═══ */
.feedback-overlay-enter-active,
.feedback-overlay-leave-active {
  transition: opacity 300ms ease;
}
.feedback-overlay-enter-from,
.feedback-overlay-leave-to {
  opacity: 0;
}

/* ═══ Feedback icon: scale + opacity animation (400ms ease) ═══ */
.feedback-icon {
  transform: scale(0);
  opacity: 0;
  transition: transform 400ms ease, opacity 400ms ease;
}
.feedback-icon-active {
  transform: scale(1);
  opacity: 1;
}

/* ═══ Fade transition (lightbox) ═══ */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
