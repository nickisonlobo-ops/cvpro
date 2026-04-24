<template>
  <div class="max-w-md mx-auto">

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-24 gap-4">
      <div class="w-12 h-12 rounded-full border-4 border-gray-200 animate-spin" :style="{ borderTopColor: 'var(--color-primary, #ec4899)' }" />
      <p class="text-sm text-gray-500">Carregando...</p>
    </div>

    <!-- Empresa não encontrada -->
    <div v-else-if="errorMsg" class="flex flex-col items-center justify-center py-24 px-6 text-center">
      <div class="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
        <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
        </svg>
      </div>
      <h2 class="text-lg font-bold text-gray-800 mb-2">Página não encontrada</h2>
      <p class="text-sm text-gray-500">{{ errorMsg }}</p>
    </div>

    <template v-else>
      <!-- Header: logo + nome da empresa -->
      <div class="flex flex-col items-center gap-3 mb-8">
        <img
          v-if="personalizacao.logo_url"
          :src="personalizacao.logo_url"
          :alt="personalizacao.nome_empresa || 'Logo'"
          class="object-contain"
          :style="{
            maxHeight: personalizacao.logo_size === 'sm' ? '200px'
              : personalizacao.logo_size === 'lg' ? '400px'
              : '300px'
          }"
        />
        <h1
          v-if="personalizacao.nome_empresa"
          class="text-xl font-black tracking-tight text-center"
          :style="{ color: 'var(--color-primary, #ec4899)' }"
        >{{ personalizacao.nome_empresa }}</h1>
      </div>

      <!-- Indicador de passos (1–3) -->
      <div v-if="step < 4" class="flex items-center mb-8 px-1">
        <template v-for="(lbl, i) in stepLabels" :key="i">
          <div class="flex flex-col items-center gap-1 shrink-0">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200"
              :class="step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? '' : 'bg-gray-200 text-gray-500'"
              :style="step === i + 1 ? { background: 'var(--color-primary-bg, linear-gradient(135deg,#ec4899,#f43f5e))', color: 'var(--color-primary-text, #fff)' } : {}"
            >
              <svg v-if="step > i + 1" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
              </svg>
              <span v-else>{{ i + 1 }}</span>
            </div>
            <span
              class="text-[9px] font-bold uppercase tracking-widest"
              :class="step === i + 1 ? 'text-pink-500' : step > i + 1 ? 'text-green-600' : 'text-gray-400'"
            >{{ lbl }}</span>
          </div>
          <div v-if="i < stepLabels.length - 1" class="flex-1 h-0.5 mx-1 mb-3 transition-colors duration-300" :class="step > i + 1 ? 'bg-green-400' : 'bg-gray-200'" />
        </template>
      </div>

      <!-- ─────────────── STEP 1: Serviços ─────────────── -->
      <Transition name="fade" mode="out-in">
        <div v-if="step === 1" class="flex flex-col gap-5">
          <div>
            <h2 class="text-xl font-black text-gray-900">Escolha os serviços</h2>
            <p class="text-sm text-gray-500 mt-0.5">Selecione um ou mais serviços desejados</p>
          </div>

          <div class="grid grid-cols-1 gap-3">
            <button
              v-for="s in servicos"
              :key="s.id"
              type="button"
              class="group relative rounded-3xl border-2 transition-all duration-200 text-left w-full overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5"
              :class="servicosSelecionados.includes(s.id) ? 'shadow-lg -translate-y-0.5' : 'border-gray-200 bg-white'"
              :style="servicosSelecionados.includes(s.id)
                ? { borderColor: 'var(--color-primary, #ec4899)', background: '#fff' }
                : {}"
              @click="toggleServico(s.id)"
            >
              <!-- Foto em destaque (topo) -->
              <div class="relative h-36 w-full overflow-hidden">
                <img
                  v-if="s.foto_url"
                  :src="s.foto_url"
                  :alt="s.nome"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center"
                  style="background: linear-gradient(135deg, #fce7f3, #f5d0fe)"
                >
                  <svg class="w-10 h-10 text-pink-200" fill="none" stroke="currentColor" stroke-width="1.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>
                </div>
                <!-- Overlay escuro sutil na foto -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <!-- Preço sobre a foto (canto inferior direito) -->
                <div class="absolute bottom-2.5 right-3">
                  <span class="text-base font-black text-white drop-shadow">{{ formatPreco(s.preco) }}</span>
                </div>
                <!-- Check badge selecionado -->
                <div
                  v-if="servicosSelecionados.includes(s.id)"
                  class="absolute top-2.5 right-3 w-7 h-7 rounded-full flex items-center justify-center shadow-lg"
                  :style="{ background: 'var(--color-primary, #ec4899)' }"
                >
                  <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                  </svg>
                </div>
                <!-- Círculo vazio não selecionado -->
                <div
                  v-else
                  class="absolute top-2.5 right-3 w-7 h-7 rounded-full border-2 border-white/70 bg-white/20 backdrop-blur-sm"
                />
              </div>

              <!-- Conteúdo inferior -->
              <div class="px-4 py-3">
                <p class="text-sm font-black text-gray-900 leading-tight">{{ s.nome }}</p>
                <p v-if="s.descricao" class="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">{{ s.descricao }}</p>
                <div class="flex items-center gap-3 mt-2.5">
                  <span class="inline-flex items-center gap-1 text-[11px] text-gray-400 font-semibold">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"/></svg>
                    {{ s.duracao_min }}min
                  </span>
                  <span
                    v-if="s.servico_funcionarios?.[0]?.funcionarios?.nome"
                    class="inline-flex items-center gap-1 text-[11px] font-semibold"
                    :style="{ color: 'var(--color-primary, #ec4899)' }"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>
                    {{ s.servico_funcionarios[0].funcionarios!.nome }}
                  </span>
                </div>
              </div>

              <!-- Barra colorida no rodapé quando selecionado -->
              <div
                v-if="servicosSelecionados.includes(s.id)"
                class="h-1 w-full"
                :style="{ background: 'var(--color-primary-bg, linear-gradient(90deg,#ec4899,#c026d3))' }"
              />
            </button>

            <p v-if="!servicos.length" class="text-center text-sm text-gray-400 py-10 bg-gray-50 rounded-2xl">
              Nenhum serviço disponível no momento.
            </p>
          </div>

          <!-- Totais -->
          <div
            v-if="servicosSelecionados.length"
            class="flex items-center justify-between rounded-2xl px-5 py-4 border"
            :style="{ background: 'color-mix(in srgb, var(--color-primary,#ec4899) 8%, #fff)', borderColor: 'color-mix(in srgb, var(--color-primary,#ec4899) 30%, #fff)' }"
          >
            <p class="text-xs font-semibold text-gray-500">
              {{ servicosSelecionados.length }} serviço{{ servicosSelecionados.length > 1 ? 's' : '' }} · {{ duracaoTotal }}min
            </p>
            <p class="text-base font-black" :style="{ color: 'var(--color-primary, #ec4899)' }">{{ formatPreco(precoTotal) }}</p>
          </div>

          <button
            type="button"
            :disabled="!servicosSelecionados.length"
            class="w-full py-4 rounded-2xl text-sm font-black transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
            :style="{ background: 'var(--color-primary-bg, linear-gradient(135deg,#ec4899,#f43f5e))', color: 'var(--color-primary-text, #fff)' }"
            @click="irParaAgenda"
          >
            Próximo →
          </button>
        </div>
      </Transition>

      <!-- ─────────────── STEP 2: Agenda (data + horário por serviço) ─────────────── -->
      <Transition name="fade" mode="out-in">
        <div v-if="step === 2" class="flex flex-col gap-5">
          <div>
            <h2 class="text-xl font-black text-gray-900">Escolha data e horário</h2>
            <p class="text-sm text-gray-500 mt-0.5">Selecione data e horário para cada serviço</p>
          </div>

          <!-- Legenda de dias de funcionamento -->
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="(nome, idx) in nomesDias"
              :key="idx"
              class="text-[10px] font-bold px-2 py-1 rounded-full"
              :class="diasAtivos.includes(idx) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'"
            >{{ nome }}</span>
          </div>

          <!-- Um card por serviço -->
          <div
            v-for="(item, idx) in slotsPerServico"
            :key="item.servico.id"
            class="flex flex-col gap-3 bg-white rounded-2xl border-2 p-4 transition-all"
            :style="item.data && !item.diaFechado && item.horario
              ? { borderColor: 'var(--color-primary, #ec4899)' }
              : { borderColor: '#e5e7eb' }"
          >
            <!-- Cabeçalho do serviço -->
            <div class="flex items-center gap-2">
              <div
                class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0"
                :style="{ background: 'var(--color-primary-bg, #ec4899)' }"
              >{{ idx + 1 }}</div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-gray-900">{{ item.servico.nome }}</p>
                <!-- Profissional: selector se há mais de um, texto fixo se só um -->
                <div v-if="item.servico.servico_funcionarios?.length > 1" class="flex flex-wrap gap-1 mt-1">
                  <button
                    v-for="sf in item.servico.servico_funcionarios"
                    :key="sf.funcionarios?.id"
                    type="button"
                    class="text-[11px] font-bold px-2 py-0.5 rounded-full border transition-all"
                    :class="item.funcionarioSelecionado?.id === sf.funcionarios?.id
                      ? 'text-white border-transparent'
                      : 'border-gray-200 text-gray-400 bg-white hover:border-gray-300'"
                    :style="item.funcionarioSelecionado?.id === sf.funcionarios?.id
                      ? { background: 'var(--color-primary, #ec4899)', borderColor: 'var(--color-primary, #ec4899)' }
                      : {}"
                    @click="item.funcionarioSelecionado = sf.funcionarios ? { id: sf.funcionarios.id, nome: sf.funcionarios.nome } : null"
                  >{{ sf.funcionarios?.nome }}</button>
                </div>
                <p v-else-if="item.funcionarioSelecionado" class="text-xs font-semibold" :style="{ color: 'var(--color-primary, #ec4899)' }">
                  {{ item.funcionarioSelecionado.nome }}
                </p>
              </div>
              <span v-if="item.data && !item.diaFechado && item.horario" class="text-xs font-black px-2 py-1 rounded-full bg-green-100 text-green-700 shrink-0">
                ✓ {{ formatHora(item.horario) }}
              </span>
            </div>

            <!-- Seleção de data -->
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Data</label>
              <input
                v-model="item.data"
                type="date"
                :min="hoje"
                class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2"
                :style="{ '--tw-ring-color': 'var(--color-primary, #ec4899)' }"
                @change="onDataChange(item)"
              />
              <p v-if="item.data && !item.diaFechado" class="text-xs font-semibold" :style="{ color: 'var(--color-primary, #ec4899)' }">
                {{ formatDataCompleta(item.data) }}
              </p>
              <div v-if="item.diaFechado" class="flex items-start gap-2 p-2.5 bg-orange-50 border border-orange-200 rounded-xl">
                <svg class="w-4 h-4 text-orange-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
                </svg>
                <p class="text-xs text-orange-600 font-semibold">Não atendemos neste dia.</p>
              </div>
            </div>

            <!-- Slots de horário (aparece só quando a data é válida) -->
            <template v-if="item.data && !item.diaFechado">
              <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Horário</label>

              <div v-if="item.loading" class="flex items-center gap-2 py-4 justify-center">
                <div class="w-5 h-5 rounded-full border-2 border-gray-200 animate-spin" :style="{ borderTopColor: 'var(--color-primary, #ec4899)' }" />
                <p class="text-xs text-gray-400">Verificando disponibilidade...</p>
              </div>

              <div v-else-if="item.error" class="bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-xs text-red-600 flex items-center justify-between">
                <span>{{ item.error }}</span>
                <button type="button" class="underline ml-2 font-semibold shrink-0" @click="carregarSlotsServico(item)">Tentar novamente</button>
              </div>

              <div v-else-if="!item.slots.length" class="bg-orange-50 border border-orange-200 rounded-xl px-3 py-2.5 text-xs text-orange-600 font-semibold text-center">
                Nenhum horário disponível neste dia.
              </div>

              <div v-else class="grid grid-cols-3 sm:grid-cols-4 gap-2">
                <button
                  v-for="slot in item.slots"
                  :key="slot.getTime()"
                  type="button"
                  :disabled="isSlotTaken(slot, item)"
                  class="py-2 rounded-xl border-2 text-sm font-bold transition-all"
                  :class="item.horario?.getTime() === slot.getTime()
                    ? 'shadow-md scale-[1.04]'
                    : isSlotTaken(slot, item)
                      ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:scale-[1.02]'"
                  :style="item.horario?.getTime() === slot.getTime()
                    ? { background: 'var(--color-primary-bg, #ec4899)', color: 'var(--color-primary-text, #fff)', borderColor: 'transparent' }
                    : {}"
                  :title="isSlotTaken(slot, item) ? 'Horário já escolhido para outro serviço' : ''"
                  @click="!isSlotTaken(slot, item) && (item.horario = slot)"
                >{{ formatHora(slot) }}</button>
              </div>
            </template>
          </div>

          <div class="flex gap-3">
            <button
              type="button"
              class="flex-1 py-3.5 rounded-2xl border-2 border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
              @click="step = 1"
            >← Voltar</button>
            <button
              type="button"
              :disabled="!todosHorariosEscolhidos"
              class="flex-[2] py-3.5 rounded-2xl text-sm font-black transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
              :style="{ background: 'var(--color-primary-bg, linear-gradient(135deg,#ec4899,#f43f5e))', color: 'var(--color-primary-text, #fff)' }"
              @click="step = 3"
            >Próximo →</button>
          </div>
        </div>
      </Transition>

      <!-- ─────────────── STEP 3: Dados pessoais ─────────────── -->
      <Transition name="fade" mode="out-in">
        <div v-if="step === 3" class="flex flex-col gap-4">
          <div>
            <h2 class="text-xl font-black text-gray-900">Seus dados</h2>
            <p class="text-sm text-gray-500 mt-0.5">Preencha para confirmar o agendamento</p>
          </div>

          <!-- Resumo do pedido -->
          <div class="bg-gray-50 rounded-2xl border border-gray-200 px-4 py-3.5 flex flex-col gap-2">
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Resumo</p>
            <div v-for="item in slotsPerServico" :key="item.servico.id" class="flex flex-col gap-0.5">
              <div class="flex items-start justify-between gap-2 text-sm">
                <div>
                  <span class="font-bold text-gray-900">{{ item.servico.nome }}</span>
                  <span v-if="item.funcionarioSelecionado" class="text-xs font-semibold ml-1.5" :style="{ color: 'var(--color-primary, #ec4899)' }">
                    {{ item.funcionarioSelecionado.nome }}
                  </span>
                </div>
              </div>
              <p class="text-xs text-gray-500">
                📅 {{ formatDataCompleta(item.data) }} · 🕐 {{ item.horario ? formatHora(item.horario) : '—' }}
              </p>
            </div>
            <div class="flex items-center justify-between pt-1.5 border-t border-gray-200 mt-0.5">
              <span class="text-xs text-gray-500">{{ duracaoTotal }}min · {{ servicosSelecionados.length }} serviço(s)</span>
              <span class="text-sm font-black text-gray-900">{{ formatPreco(precoTotal) }}</span>
            </div>
          </div>

          <!-- Formulário -->
          <div class="flex flex-col gap-3">
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                Seu nome <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.nome"
                type="text"
                placeholder="Nome completo"
                class="w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2"
                :class="formErrors.nome ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'"
                :style="{ '--tw-ring-color': 'var(--color-primary, #ec4899)' }"
              />
              <p v-if="formErrors.nome" class="text-xs text-red-500 mt-1">{{ formErrors.nome }}</p>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                Telefone / WhatsApp <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.telefone"
                type="tel"
                placeholder="(00) 00000-0000"
                class="w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2"
                :class="formErrors.telefone ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'"
                :style="{ '--tw-ring-color': 'var(--color-primary, #ec4899)' }"
              />
              <p v-if="formErrors.telefone" class="text-xs text-red-500 mt-1">{{ formErrors.telefone }}</p>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">E-mail</label>
              <input
                v-model="form.email"
                type="email"
                placeholder="seu@email.com (opcional)"
                class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2"
                :style="{ '--tw-ring-color': 'var(--color-primary, #ec4899)' }"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Observações</label>
              <textarea
                v-model="form.observacoes"
                rows="2"
                placeholder="Alguma observação? (opcional)"
                class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 resize-none"
                :style="{ '--tw-ring-color': 'var(--color-primary, #ec4899)' }"
              />
            </div>
          </div>

          <div
            v-if="submitError"
            class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
          >{{ submitError }}</div>

          <div class="flex gap-3">
            <button
              type="button"
              class="flex-1 py-3.5 rounded-2xl border-2 border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
              @click="step = 2"
            >← Voltar</button>
            <button
              type="button"
              :disabled="submitting"
              class="flex-[2] py-3.5 rounded-2xl text-sm font-black transition-all disabled:opacity-50 shadow-lg"
              :style="{ background: 'var(--color-primary-bg, linear-gradient(135deg,#ec4899,#f43f5e))', color: 'var(--color-primary-text, #fff)' }"
              @click="enviarSolicitacao"
            >{{ submitting ? 'Enviando...' : 'Confirmar agendamento ✓' }}</button>
          </div>
        </div>
      </Transition>

      <!-- ─────────────── STEP 4: Sucesso ─────────────── -->
      <Transition name="fade" mode="out-in">
        <div v-if="step === 4" class="flex flex-col items-center text-center gap-6 py-6">
          <div class="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>

          <div>
            <h2 class="text-2xl font-black text-gray-900 mb-2">Pedido enviado!</h2>
            <p class="text-sm text-gray-500 max-w-xs leading-relaxed">
              Em breve nossa equipe entrará em contato pelo WhatsApp para confirmar seu agendamento.
            </p>
          </div>

          <!-- Resumo final -->
          <div class="w-full bg-gray-50 rounded-2xl border border-gray-200 px-5 py-4 text-left flex flex-col gap-2">
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Detalhes do pedido</p>
            <div v-for="item in slotsPerServico" :key="item.servico.id" class="flex flex-col gap-0.5 border-t border-gray-100 pt-1.5">
              <p class="text-sm font-bold text-gray-900">{{ item.servico.nome }}</p>
              <p v-if="item.funcionarioSelecionado" class="text-xs font-semibold" :style="{ color: 'var(--color-primary, #ec4899)' }">
                {{ item.funcionarioSelecionado.nome }}
              </p>
              <p class="text-xs text-gray-500">
                📅 {{ formatDataCompleta(item.data) }} · 🕐 {{ item.horario ? formatHora(item.horario) : '—' }}
              </p>
            </div>
            <div class="flex items-center justify-between pt-2 border-t border-gray-200 mt-1">
              <span class="text-xs text-gray-500">Total estimado</span>
              <span class="text-sm font-black text-gray-900">{{ formatPreco(precoTotal) }}</span>
            </div>
            <p class="text-sm text-gray-600">👤 {{ form.nome }}</p>
            <p class="text-sm text-gray-600">📱 {{ form.telefone }}</p>
          </div>

          <p class="text-xs text-gray-400">Este pedido aguarda confirmação da equipe.</p>
        </div>
      </Transition>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { createSupabaseClient } from '~/lib/supabase'
import { usePersonalizacao } from '~/composables/usePersonalizacao'

definePageMeta({ layout: 'public' })
useHead({ title: 'Agendamento Online' })

interface ServicoProfissional {
  funcionarios: { id: number; nome: string; email?: string | null } | null
}

interface Servico {
  id: number
  nome: string
  descricao: string | null
  duracao_min: number
  preco: number
  foto_url: string | null
  servico_funcionarios: ServicoProfissional[]
}

interface HorarioOcupado {
  inicio: string
  fim: string
}

interface SlotItem {
  servico: Servico
  data: string
  diaFechado: boolean
  slots: Date[]
  loading: boolean
  error: string | null
  horario: Date | null
  funcionarioSelecionado: { id: number; nome: string } | null
}

const route        = useRoute()
const supabase     = createSupabaseClient()
const { loadPersonalizacaoPublic, config: personalizacao } = usePersonalizacao()

const empresaId = computed(() => Number(route.params.empresa_id))

// ── Estado geral ────────────────────────────────────────────────
const loading   = ref(true)
const errorMsg  = ref<string | null>(null)
const step      = ref<1 | 2 | 3 | 4>(1)

// ── Dados carregados ────────────────────────────────────────────
const servicos     = ref<Servico[]>([])
const diasAtivos   = ref<number[]>([1, 2, 3, 4, 5]) // padrão Seg–Sex
const horariosConf = ref({ abertura: '08:00', fechamento: '18:00', intervalo: 30, almoco_inicio: null as string | null, almoco_fim: null as string | null })

// ── Seleções do wizard ──────────────────────────────────────────
const servicosSelecionados = ref<number[]>([])
const slotsPerServico      = ref<SlotItem[]>([])

// ── Formulário de dados pessoais ────────────────────────────────
const form        = reactive({ nome: '', telefone: '', email: '', observacoes: '' })
const formErrors  = reactive({ nome: '', telefone: '' })
const submitting  = ref(false)
const submitError = ref<string | null>(null)

// ── Constantes ──────────────────────────────────────────────────
const stepLabels = ['Serviços', 'Agenda', 'Dados']
const nomesDias  = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MESES      = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
                    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
const DIAS_EXT   = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
                    'Quinta-feira', 'Sexta-feira', 'Sábado']

// ── Computed ────────────────────────────────────────────────────
const hoje = computed(() => {
  // Sempre usa a data no fuso de São Paulo (UTC-3), independente do browser
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date())
})

const servicosSelecionadosData = computed(() =>
  servicos.value.filter(s => servicosSelecionados.value.includes(s.id))
)
const duracaoTotal = computed(() => servicosSelecionadosData.value.reduce((a, s) => a + s.duracao_min, 0))
const precoTotal   = computed(() => servicosSelecionadosData.value.reduce((a, s) => a + Number(s.preco), 0))

const todosHorariosEscolhidos = computed(() =>
  slotsPerServico.value.length > 0 &&
  slotsPerServico.value.every(item => !!item.data && !item.diaFechado && !!item.horario)
)

// ── Helpers de formatação ────────────────────────────────────────
function formatPreco(val: number) {
  return Number(val).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatHora(d: Date | null) {
  if (!d) return ''
  // Força exibição no fuso de São Paulo, independente do fuso do browser
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Sao_Paulo' })
}

function formatDataCompleta(iso: string) {
  if (!iso) return ''
  const d = new Date(iso + 'T00:00:00')
  return `${DIAS_EXT[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`
}

// ── Wizard: toggles e navegação ──────────────────────────────────
function toggleServico(id: number) {
  const idx = servicosSelecionados.value.indexOf(id)
  if (idx >= 0) {
    servicosSelecionados.value.splice(idx, 1)
  } else {
    servicosSelecionados.value.push(id)
  }
}

async function carregarSlotsServico(item: SlotItem) {
  item.loading = true
  item.error   = null
  item.slots   = []

  const { data, error } = await supabase.rpc('get_horarios_ocupados_funcionario', {
    p_empresa_id:     empresaId.value,
    p_data:           item.data,
    p_servico_id:     item.servico.id,
    p_funcionario_id: item.funcionarioSelecionado?.id ?? null,
  })

  if (error) {
    item.error = 'Não foi possível verificar a disponibilidade.'
    item.loading = false
    return
  }

  item.slots = calcularSlots(
    item.data,
    horariosConf.value.abertura,
    horariosConf.value.fechamento,
    horariosConf.value.intervalo,
    item.servico.duracao_min || 60,
    (data ?? []) as HorarioOcupado[],
    horariosConf.value.almoco_inicio,
    horariosConf.value.almoco_fim,
  )
  item.loading = false
}

async function onDataChange(item: SlotItem) {
  item.horario = null
  item.slots   = []
  item.error   = null
  if (!item.data) return
  const d = new Date(item.data + 'T00:00:00')
  item.diaFechado = !diasAtivos.value.includes(d.getDay())
  if (item.diaFechado) return
  await carregarSlotsServico(item)
}

function irParaAgenda() {
  // Preserva dados já preenchidos ao voltar e avançar novamente
  const anterior = new Map(slotsPerServico.value.map(i => [i.servico.id, i]))

  slotsPerServico.value = servicosSelecionadosData.value.map(s => {
    const exist = anterior.get(s.id)
    if (exist) return exist // preserva data, horario, slots, profissional

    // Profissional principal do serviço
    const func = s.servico_funcionarios?.[0]?.funcionarios
    return {
      servico:               s,
      data:                  '',
      diaFechado:            false,
      slots:                 [],
      loading:               false,
      error:                 null,
      horario:               null,
      funcionarioSelecionado: func ? { id: func.id, nome: func.nome } : null,
    }
  })
  step.value = 2
}

// Retorna true se o slot já foi escolhido por outro serviço na mesma data
function isSlotTaken(slot: Date, currentItem: SlotItem): boolean {
  return slotsPerServico.value.some(
    item =>
      item.servico.id !== currentItem.servico.id &&
      item.data === currentItem.data &&
      item.horario?.getTime() === slot.getTime()
  )
}

/**
 * Gera a lista de slots disponíveis para um dia, considerando:
 * - Horário de abertura/fechamento
 * - Intervalo entre slots
 * - Duração total dos serviços selecionados
 * - Intervalos já ocupados (agendamentos + solicitações pendentes)
 * - Para hoje: só mostra slots a partir de agora + 1h de buffer
 */
function calcularSlots(
  dataISO: string,
  abertura: string,
  fechamento: string,
  intervalo: number,
  duracao: number,
  ocupados: HorarioOcupado[],
  almocoInicio?: string | null,
  almocoFim?: string | null,
): Date[] {
  const result: Date[] = []
  const [abH, abM] = abertura.split(':').map(Number) as [number, number]
  const [fhH, fhM] = fechamento.split(':').map(Number) as [number, number]

  // SP é UTC-3: meia-noite SP = 03:00 UTC
  const SP_OFFSET_MS = 3 * 60 * 60 * 1000
  const spMidnight = new Date(dataISO + 'T00:00:00Z').getTime() + SP_OFFSET_MS

  // Horário mínimo em minutos SP desde meia-noite (para "hoje")
  // Usa spMidnight já calculado acima: epoch do meia-noite SP
  // (Date.now() - spMidnight) / 60000 = minutos decorridos no dia SP
  // 100% independente do fuso do browser
  // Para hoje: oculta slots que já passaram (sem buffer extra de antecedência)
  const isToday = dataISO === hoje.value
  const minMinutesSP = isToday ? Math.floor((Date.now() - spMidnight) / 60_000) : 0

  // Almoço em epoch UTC
  let almocoInicioMs: number | null = null
  let almocoFimMs: number | null = null
  if (almocoInicio && almocoFim) {
    const [alH, alM] = almocoInicio.split(':').map(Number) as [number, number]
    const [afH, afM] = almocoFim.split(':').map(Number) as [number, number]
    almocoInicioMs = spMidnight + (alH * 60 + alM) * 60_000
    almocoFimMs    = spMidnight + (afH * 60 + afM) * 60_000
  }

  // Itera usando minutos SP desde meia-noite (sem depender do fuso do browser)
  let cursorMinutesSP = abH * 60 + abM
  const endMinutesSP  = fhH * 60 + fhM

  while (cursorMinutesSP + duracao <= endMinutesSP) {
    if (!isToday || cursorMinutesSP >= minMinutesSP) {
      const slotStart = spMidnight + cursorMinutesSP * 60_000
      const slotEnd   = slotStart + duracao * 60_000

      const bloqueadoAlmoco = almocoInicioMs !== null && almocoFimMs !== null
        && slotStart < almocoFimMs && slotEnd > almocoInicioMs

      const disponivel = !bloqueadoAlmoco && !ocupados.some(oc => {
        const ocStart = new Date(oc.inicio).getTime()
        const ocEnd   = new Date(oc.fim).getTime()
        return slotStart < ocEnd && slotEnd > ocStart
      })
      if (disponivel) result.push(new Date(slotStart))
    }
    cursorMinutesSP += intervalo
  }

  return result
}

// ── Envio da solicitação ─────────────────────────────────────────
async function enviarSolicitacao() {
  formErrors.nome     = ''
  formErrors.telefone = ''
  if (!form.nome.trim())     { formErrors.nome     = 'Nome é obrigatório'; return }
  if (!form.telefone.trim()) { formErrors.telefone = 'Telefone é obrigatório'; return }
  if (!todosHorariosEscolhidos.value) return

  submitting.value  = true
  submitError.value = null

  try {
    // Buscar cliente pelo telefone
    const telefoneLimpo = form.telefone.trim().replace(/\D/g, '')
    const { data: clienteEncontrado } = await supabase
      .from('clientes')
      .select('id')
      .eq('empresa_id', empresaId.value)
      .or(`telefone.eq.${form.telefone.trim()},telefone.eq.${telefoneLimpo}`)
      .maybeSingle()

    // Criar cliente automaticamente se não encontrado
    let clienteId: number | null = clienteEncontrado?.id ?? null
    if (!clienteId) {
      const { data: novoCliente } = await supabase
        .from('clientes')
        .insert({
          empresa_id: empresaId.value,
          nome:       form.nome.trim(),
          telefone:   form.telefone.trim(),
          email:      form.email.trim() || null,
        })
        .select('id')
        .single()
      clienteId = novoCliente?.id ?? null
    }

    // Criar um agendamento por serviço
    for (const item of slotsPerServico.value) {
      if (!item.horario || !item.data) continue

      const h = formatHora(item.horario)  // hora no fuso SP (ex: "15:00")
      const dataHoraStr = `${item.data}T${h}:00-03:00`  // salva com offset SP explícito
      // Resolver o uuid (profiles.id) do profissional pelo id do funcionário selecionado
      const funcId = item.funcionarioSelecionado?.id ?? item.servico.servico_funcionarios?.[0]?.funcionarios?.id ?? null
      let funcionarioUuid: string | null = null
      if (funcId) {
        const { data: prof } = await supabase
          .from('funcionarios')
          .select('profile_id')
          .eq('id', funcId)
          .maybeSingle()
        funcionarioUuid = (prof as { profile_id?: string | null } | null)?.profile_id ?? null
      }

      const { data: agRow, error: agErr } = await supabase
        .from('agendamentos')
        .insert({
          empresa_id:           empresaId.value,
          cliente_id:           clienteId,
          funcionario_id:       funcionarioUuid,
          nome_solicitante:     form.nome.trim(),
          telefone_solicitante: form.telefone.trim(),
          data_hora:            dataHoraStr,
          status:               'solicitado',
          observacoes:          form.observacoes.trim() || null,
        })
        .select('id')
        .single()

      if (agErr) throw agErr

      if (agRow?.id) {
        const { error: svcsErr } = await supabase
          .from('agendamento_servicos')
          .insert({ agendamento_id: agRow.id, servico_id: item.servico.id, preco_cobrado: item.servico.preco })
        if (svcsErr) throw svcsErr
      }
    }

    step.value = 4
  } catch (e: unknown) {
    const pgErr = e as { message?: string; details?: string }
    submitError.value = pgErr?.message ?? 'Erro ao enviar solicitação. Tente novamente.'
  } finally {
    submitting.value = false
  }
}

// ── Carregamento inicial ─────────────────────────────────────────
onMounted(async () => {
  if (!empresaId.value || isNaN(empresaId.value)) {
    errorMsg.value = 'ID de empresa inválido.'
    loading.value  = false
    return
  }

  try {
    await loadPersonalizacaoPublic(empresaId.value)

    // Carregar serviços (obrigatório) e configurações (opcionais) em paralelo
    const [servicosRes, configRes, diasRes] = await Promise.all([
      supabase
        .from('servicos')
        .select('id, nome, descricao, duracao_min, preco, foto_url, servico_funcionarios(funcionarios(id, nome, email))')
        .eq('empresa_id', empresaId.value)
        .eq('ativo', true)
        .order('nome'),
      supabase
        .from('empresa_personalizacao')
        .select('horario_abertura, horario_fechamento, intervalo_min, almoco_inicio, almoco_fim')
        .eq('empresa_id', empresaId.value)
        .maybeSingle(),
      supabase
        .from('empresa_dias_funcionamento')
        .select('dia_semana')
        .eq('empresa_id', empresaId.value)
        .eq('ativo', true),
    ])

    if (servicosRes.error) throw servicosRes.error
    servicos.value = (servicosRes.data ?? []) as unknown as Servico[]

    // Horários de funcionamento — usa defaults se colunas ainda não existirem
    if (configRes.data) {
      horariosConf.value = {
        abertura:        (configRes.data as { horario_abertura?: string | null }).horario_abertura    ?? '08:00',
        fechamento:      (configRes.data as { horario_fechamento?: string | null }).horario_fechamento ?? '18:00',
        intervalo:       (configRes.data as { intervalo_min?: number | null }).intervalo_min           ?? 30,
        almoco_inicio:   (configRes.data as { almoco_inicio?: string | null }).almoco_inicio            ?? null,
        almoco_fim:      (configRes.data as { almoco_fim?: string | null }).almoco_fim                  ?? null,
      }
    }

    // Dias de funcionamento — usa padrão Seg–Sex se tabela ainda não existir ou estiver vazia
    if (!diasRes.error && diasRes.data && diasRes.data.length > 0) {
      diasAtivos.value = diasRes.data.map(d => d.dia_semana)
    }
  } catch (e: unknown) {
    errorMsg.value = e instanceof Error ? e.message : 'Erro ao carregar a página.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
