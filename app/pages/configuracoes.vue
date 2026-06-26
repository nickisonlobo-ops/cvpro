<template>
  <div class="max-w-3xl mx-auto space-y-8">
    <!-- Cabeçalho -->
    <div>
      <h1 class="text-2xl font-black text-gray-900">Personalização</h1>
      <p class="text-sm text-gray-500 mt-1">Customize as cores, logo e nome da sua empresa no sistema.</p>
    </div>

    <!-- Alerta de erro -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
      {{ error }}
    </div>

    <!-- Loading inicial -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <svg class="animate-spin w-8 h-8 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
      </svg>
    </div>

    <template v-else>
      <!-- Logo da Empresa -->
      <section class="bg-white rounded-2xl border border-primary-10 shadow-sm p-6 space-y-4">
        <h2 class="text-base font-bold text-gray-800">Logo da Empresa</h2>

        <div class="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <!-- Preview do logo -->
          <div class="w-24 h-24 rounded-2xl border-2 border-dashed border-primary-10 bg-primary-5 flex items-center justify-center overflow-hidden shrink-0">
            <img v-if="form.logo_url" :src="form.logo_url" alt="Logo" class="w-full h-full object-contain p-2" />
            <svg v-else class="w-10 h-10 text-white/50" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>

          <!-- Ações -->
          <div class="flex flex-col gap-3">
            <label class="cursor-pointer">
              <span
                class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-colors"
                :class="uploadingLogo ? 'opacity-60 cursor-not-allowed bg-gray-50 border-gray-200 text-gray-400' : 'bg-white border-primary-10 text-primary hover:bg-primary-5'"
              >
                <svg v-if="uploadingLogo" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                {{ uploadingLogo ? 'Enviando…' : 'Enviar logo' }}
              </span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                class="hidden"
                :disabled="uploadingLogo"
                @change="handleLogoUpload"
              />
            </label>
            <button
              v-if="form.logo_url"
              type="button"
              class="text-sm text-gray-400 hover:text-red-500 transition-colors text-left"
              @click="handleRemoveLogo"
            >
              Remover logo
            </button>
            <p class="text-xs text-gray-400">PNG, JPG, WebP ou SVG. Máximo 2MB.</p>
          </div>
        </div>

        <!-- Tamanho do logo -->
        <div v-if="form.logo_url" class="space-y-3 pt-3 border-t border-gray-100">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-gray-700">Tamanho do logo no cabeçalho</label>
            <span class="text-sm font-black px-2.5 py-0.5 rounded-lg bg-primary-5 text-primary border border-primary-10">{{ logoSizePx }}px</span>
          </div>
          <!-- Preview em tempo real -->
          <div class="flex items-center justify-center bg-gray-50 rounded-2xl border border-gray-100 py-6" style="min-height: 120px">
            <img
              :src="form.logo_url!"
              alt="preview logo"
              class="object-contain rounded-xl transition-all duration-100"
              :style="{ width: logoSizePx + 'px', height: logoSizePx + 'px' }"
            />
          </div>
          <!-- Slider -->
          <input
            type="range"
            min="20"
            max="256"
            step="2"
            :value="logoSizePx"
            class="w-full h-2 rounded-full cursor-pointer"
            style="accent-color: var(--color-primary, #ec4899)"
            @input="onLogoSlider($event)"
          />
          <div class="flex justify-between text-[10px] text-gray-400 font-semibold select-none">
            <span>20px</span>
            <span>128px</span>
            <span>256px</span>
          </div>
        </div>
      </section>

      <!-- Nome da empresa -->
      <section class="bg-white rounded-2xl border border-primary-10 shadow-sm p-6 space-y-4">
        <h2 class="text-base font-bold text-gray-800">Logo para Documentos</h2>
        <p class="text-xs text-gray-500">Versão do logo para fundo claro (orçamentos, links externos). Se não configurado, usa o logo principal.</p>

        <div class="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <div class="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
            <img v-if="form.logo_orcamento_url" :src="form.logo_orcamento_url" alt="Logo docs" class="w-full h-full object-contain p-2" />
            <svg v-else class="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <div class="flex flex-col gap-2">
            <label class="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
              {{ uploadingLogoDoc ? 'Enviando…' : 'Enviar logo' }}
              <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" class="hidden" :disabled="uploadingLogoDoc" @change="handleLogoDocUpload" />
            </label>
            <button v-if="form.logo_orcamento_url" type="button" class="text-sm text-gray-400 hover:text-red-500 transition-colors text-left" @click="form.logo_orcamento_url = null; handleSave()">
              Remover
            </button>
            <p class="text-xs text-gray-400">Use versão colorida/escura para fundos claros.</p>
          </div>
        </div>

        <!-- Tamanho do logo para documentos -->
        <div v-if="form.logo_orcamento_url" class="space-y-3 pt-3 border-t border-gray-100">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-gray-700">Tamanho do logo no orçamento</label>
            <span class="text-sm font-black px-2.5 py-0.5 rounded-lg bg-gray-50 text-gray-600 border border-gray-100">{{ logoDocSizePx }}px</span>
          </div>
          <div class="flex items-center justify-center bg-gray-50 rounded-2xl border border-gray-100 py-6" style="min-height: 120px">
            <img :src="form.logo_orcamento_url!" alt="preview logo docs" class="object-contain rounded-xl transition-all duration-100" :style="{ height: logoDocSizePx + 'px' }" />
          </div>
          <input type="range" min="40" max="300" step="4" :value="logoDocSizePx" class="w-full h-2 rounded-full cursor-pointer" style="accent-color: var(--color-primary, #ec4899)" @input="onLogoDocSlider($event)" />
          <div class="flex justify-between text-[10px] text-gray-400 font-semibold select-none">
            <span>40px</span>
            <span>170px</span>
            <span>300px</span>
          </div>
        </div>
      </section>

      <!-- Nome da empresa -->
      <section class="bg-white rounded-2xl border border-primary-10 shadow-sm p-6 space-y-4">
        <h2 class="text-base font-bold text-gray-800">Nome Exibido</h2>
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700">Nome da empresa no sistema</label>
          <input
            v-model="form.nome_empresa"
            type="text"
            maxlength="60"
            class="w-full max-w-sm border border-primary-10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="UpStudio"
          />
        </div>
      </section>

      <!-- Cores -->
      <section class="bg-white rounded-2xl border border-primary-10 shadow-sm p-6 space-y-6">
        <h2 class="text-base font-bold text-gray-800">Esquema de Cores</h2>

        <!-- Temas pré-definidos -->
        <div class="space-y-4">
          <p class="text-sm font-medium text-gray-600">Temas prontos</p>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <button
              v-for="tema in temasProntos"
              :key="tema.nome"
              type="button"
              class="group relative rounded-xl border-2 overflow-hidden transition-all text-left"
              :class="isTemaSelecionado(tema) ? 'border-gray-800 shadow-lg ring-1 ring-gray-800/20' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'"
              @click="aplicarTema(tema)"
            >
              <!-- Mini preview -->
              <div class="h-8 w-full" :style="{ background: tema.cor_primaria_grad ? `linear-gradient(90deg, ${tema.cor_primaria}, ${tema.cor_primaria_grad})` : tema.cor_primaria }" />
              <div class="p-2.5 space-y-1.5" :style="{ background: tema.cor_fundo }">
                <div class="flex gap-1.5">
                  <div class="w-8 h-5 rounded" :style="{ background: tema.cor_sidebar_grad ? `linear-gradient(135deg, ${tema.cor_sidebar}, ${tema.cor_sidebar_grad})` : tema.cor_sidebar, border: '1px solid rgba(0,0,0,0.06)' }" />
                  <div class="flex-1 h-5 rounded" :style="{ background: tema.cor_card_grad ? `linear-gradient(135deg, ${tema.cor_card}, ${tema.cor_card_grad})` : tema.cor_card, border: '1px solid rgba(0,0,0,0.06)' }" />
                </div>
                <p class="text-[10px] font-bold truncate" :style="{ color: tema.cor_card_texto }">{{ tema.nome }}</p>
              </div>
              <div v-if="isTemaSelecionado(tema)" class="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-white shadow flex items-center justify-center">
                <svg class="w-2.5 h-2.5 text-gray-800" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
              </div>
            </button>
          </div>
        </div>

        <div class="border-t border-gray-100 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <!-- Cor primária -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Cor principal</label>
            <p class="text-xs text-gray-400">Botões, links ativos e destaques</p>
            <div class="flex items-center gap-2 mt-2 flex-wrap">
              <input v-model="form.cor_primaria" type="color" class="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
              <input v-model="form.cor_primaria" type="text" class="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary" maxlength="7" @input="sanitizeHex('cor_primaria')" />
              <!-- Degradê -->
              <label class="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer select-none">
                <input v-model="usarGradPrimaria" type="checkbox" class="rounded" />
                Degradê
              </label>
              <template v-if="usarGradPrimaria">
                <input v-model="form.cor_primaria_grad" type="color" class="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
                <input v-model="form.cor_primaria_grad" type="text" class="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary" maxlength="7" @input="sanitizeHex('cor_primaria_grad')" />
                <div class="h-5 w-20 rounded-full border border-gray-200" :style="{ background: `linear-gradient(90deg, ${form.cor_primaria}, ${form.cor_primaria_grad ?? form.cor_primaria})` }" />
              </template>
            </div>
          </div>

          <!-- Cor do texto sobre primária -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Texto sobre cor principal</label>
            <p class="text-xs text-gray-400">Texto em botões e badges coloridos</p>
            <div class="flex items-center gap-2 mt-2">
              <input v-model="form.cor_primaria_texto" type="color" class="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
              <input v-model="form.cor_primaria_texto" type="text" class="w-28 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary" maxlength="7" @input="sanitizeHex('cor_primaria_texto')" />
            </div>
          </div>

          <!-- Cor de fundo -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Cor de fundo</label>
            <p class="text-xs text-gray-400">Background geral do sistema</p>
            <div class="flex items-center gap-2 mt-2 flex-wrap">
              <input v-model="form.cor_fundo" type="color" class="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
              <input v-model="form.cor_fundo" type="text" class="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary" maxlength="7" @input="sanitizeHex('cor_fundo')" />
              <label class="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer select-none">
                <input v-model="usarGradFundo" type="checkbox" class="rounded" />
                Degradê
              </label>
              <template v-if="usarGradFundo">
                <input v-model="form.cor_fundo_grad" type="color" class="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
                <input v-model="form.cor_fundo_grad" type="text" class="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary" maxlength="7" @input="sanitizeHex('cor_fundo_grad')" />
                <div class="h-5 w-20 rounded-full border border-gray-200" :style="{ background: `linear-gradient(90deg, ${form.cor_fundo}, ${form.cor_fundo_grad ?? form.cor_fundo})` }" />
              </template>
            </div>
          </div>

          <!-- Cor da sidebar -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Cor da sidebar / header</label>
            <p class="text-xs text-gray-400">Fundo do menu lateral e cabeçalho</p>
            <div class="flex items-center gap-2 mt-2 flex-wrap">
              <input v-model="form.cor_sidebar" type="color" class="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
              <input v-model="form.cor_sidebar" type="text" class="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary" maxlength="7" @input="sanitizeHex('cor_sidebar')" />
              <label class="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer select-none">
                <input v-model="usarGradSidebar" type="checkbox" class="rounded" />
                Degradê
              </label>
              <template v-if="usarGradSidebar">
                <input v-model="form.cor_sidebar_grad" type="color" class="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
                <input v-model="form.cor_sidebar_grad" type="text" class="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary" maxlength="7" @input="sanitizeHex('cor_sidebar_grad')" />
                <div class="h-5 w-20 rounded-full border border-gray-200" :style="{ background: `linear-gradient(90deg, ${form.cor_sidebar}, ${form.cor_sidebar_grad ?? form.cor_sidebar})` }" />
              </template>
            </div>
          </div>

          <!-- Cor do card -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Cor do card</label>
            <p class="text-xs text-gray-400">Fundo das tabelas, listas e painéis</p>
            <div class="flex items-center gap-2 mt-2 flex-wrap">
              <input v-model="form.cor_card" type="color" class="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
              <input v-model="form.cor_card" type="text" class="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary" maxlength="7" @input="sanitizeHex('cor_card')" />
              <label class="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer select-none">
                <input v-model="usarGradCard" type="checkbox" class="rounded" />
                Degradê
              </label>
              <template v-if="usarGradCard">
                <input v-model="form.cor_card_grad" type="color" class="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
                <input v-model="form.cor_card_grad" type="text" class="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary" maxlength="7" @input="sanitizeHex('cor_card_grad')" />
                <div class="h-5 w-20 rounded-full border border-gray-200" :style="{ background: `linear-gradient(90deg, ${form.cor_card}, ${form.cor_card_grad ?? form.cor_card})` }" />
              </template>
            </div>
          </div>

          <!-- Cor do texto do card -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Texto dos cards</label>
            <p class="text-xs text-gray-400">Cor dos textos dentro de tabelas e painéis</p>
            <div class="flex items-center gap-2 mt-2">
              <input v-model="form.cor_card_texto" type="color" class="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
              <input v-model="form.cor_card_texto" type="text" class="w-28 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary" maxlength="7" @input="sanitizeHex('cor_card_texto')" />
            </div>
          </div>

          <!-- Cor dos botões -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Cor dos botões</label>
            <p class="text-xs text-gray-400">Background dos botões de ação (Adicionar, Salvar...)</p>
            <div class="flex items-center gap-2 mt-2 flex-wrap">
              <input v-model="form.cor_botao" type="color" class="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
              <input v-model="form.cor_botao" type="text" class="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary" maxlength="7" @input="sanitizeHex('cor_botao')" />
              <div class="h-8 px-3 rounded-lg border border-gray-200 flex items-center text-xs font-bold" :style="{ background: form.cor_botao, color: form.cor_botao_texto }">+ Adicionar</div>
            </div>
          </div>

          <!-- Texto dos botões -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Texto dos botões</label>
            <p class="text-xs text-gray-400">Cor do texto e ícone dentro dos botões</p>
            <div class="flex items-center gap-2 mt-2">
              <input v-model="form.cor_botao_texto" type="color" class="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
              <input v-model="form.cor_botao_texto" type="text" class="w-28 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary" maxlength="7" @input="sanitizeHex('cor_botao_texto')" />
            </div>
          </div>

          <!-- Cor dos ícones -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Cor dos ícones / nav</label>
            <p class="text-xs text-gray-400">Ícones ativos na sidebar e barra de navegação inferior</p>
            <div class="flex items-center gap-2 mt-2 flex-wrap">
              <input v-model="form.cor_icone" type="color" class="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
              <input v-model="form.cor_icone" type="text" class="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary" maxlength="7" @input="sanitizeHex('cor_icone')" />
              <div class="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center" :style="{ background: hexToRgba(form.cor_icone, 0.12) }">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" :style="{ color: form.cor_icone }"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z"/></svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Direção do degradê -->
        <div v-if="usarGradPrimaria || usarGradFundo || usarGradSidebar || usarGradCard" class="border-t border-gray-100 pt-4 space-y-2">
          <label class="text-sm font-medium text-gray-700">Direção do degradê</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="dir in direcoes"
              :key="dir.value"
              type="button"
              class="px-3 py-1.5 rounded-lg text-xs font-medium border-2 transition-all"
              :class="form.grad_direction === dir.value ? 'border-gray-800 bg-gray-100' : 'border-gray-200 hover:border-gray-300'"
              @click="form.grad_direction = dir.value"
            >
              {{ dir.label }}
            </button>
          </div>
        </div>
      </section>

      <!-- Horários de Agendamento -->
      <section class="bg-white rounded-2xl border border-primary-10 shadow-sm p-6 space-y-5">
        <div>
          <h2 class="text-base font-bold text-gray-800">Horários de Agendamento</h2>
          <p class="text-xs text-gray-400 mt-0.5">Configure os dias e horários que sua empresa recebe agendamentos pelo link público.</p>
        </div>

        <div v-if="horarioError" class="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{{ horarioError }}</div>

        <!-- Dias da semana -->
        <div class="space-y-2">
          <label class="text-sm font-semibold text-gray-700">Dias de atendimento</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="dia in DIAS_SEMANA"
              :key="dia.value"
              type="button"
              class="px-3 py-1.5 rounded-xl text-sm font-bold border-2 transition-colors"
              :class="horarios.dias.includes(dia.value)
                ? 'border-transparent text-white'
                : 'border-gray-200 text-gray-400 bg-white hover:border-gray-300'"
              :style="horarios.dias.includes(dia.value) ? { background: form.cor_primaria, color: form.cor_primaria_texto } : {}"
              @click="toggleDia(dia.value)"
            >
              {{ dia.label }}
            </button>
          </div>
        </div>

        <!-- Horários -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-sm font-semibold text-gray-700">Abertura</label>
            <input
              v-model="horarios.abertura"
              type="time"
              class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-semibold text-gray-700">Fechamento</label>
            <input
              v-model="horarios.fechamento"
              type="time"
              class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <!-- Pausa / Almoço -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="text-sm font-semibold text-gray-700">Pausa / Almoço</label>
            <button
              type="button"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors border-2"
              :class="horarios.almoco_ativo ? 'border-transparent' : 'bg-gray-200 border-gray-200'"
              :style="horarios.almoco_ativo ? { background: form.cor_primaria } : {}"
              @click="horarios.almoco_ativo = !horarios.almoco_ativo"
            >
              <span
                class="inline-block h-4 w-4 rounded-full bg-white shadow transition-transform"
                :class="horarios.almoco_ativo ? 'translate-x-5' : 'translate-x-0.5'"
              />
            </button>
          </div>
          <div v-if="horarios.almoco_ativo" class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-gray-700">Início</label>
              <input
                v-model="horarios.almoco_inicio"
                type="time"
                class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-gray-700">Fim</label>
              <input
                v-model="horarios.almoco_fim"
                type="time"
                class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <!-- Intervalo -->
        <div class="space-y-1.5">
          <label class="text-sm font-semibold text-gray-700">Intervalo entre agendamentos</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="min in [15, 20, 30, 45, 60, 90]" :key="min"
              type="button"
              class="px-3 py-1.5 rounded-xl text-sm font-bold border-2 transition-colors"
              :class="horarios.intervalo === min
                ? 'border-transparent text-white'
                : 'border-gray-200 text-gray-400 bg-white hover:border-gray-300'"
              :style="horarios.intervalo === min ? { background: form.cor_primaria, color: form.cor_primaria_texto } : {}"
              @click="horarios.intervalo = min"
            >
              {{ min }}min
            </button>
          </div>
        </div>

        <!-- Antecedência mínima -->
        <div class="space-y-2">
          <div class="space-y-0.5">
            <label class="text-sm font-semibold text-gray-700">Antecedência mínima para agendamento</label>
            <p class="text-xs text-gray-400">Tempo mínimo de antecedência que a cliente precisa ter para marcar um horário hoje.</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="min in [0, 30, 60, 120, 180, 240]" :key="min"
              type="button"
              class="px-3 py-1.5 rounded-xl text-sm font-bold border-2 transition-colors"
              :class="horarios.antecedencia === min
                ? 'border-transparent text-white'
                : 'border-gray-200 text-gray-400 bg-white hover:border-gray-300'"
              :style="horarios.antecedencia === min ? { background: form.cor_primaria, color: form.cor_primaria_texto } : {}"
              @click="horarios.antecedencia = min"
            >
              {{ min === 0 ? 'Sem limite' : min < 60 ? `${min}min` : `${min / 60}h` }}
            </button>
          </div>
        </div>

        <!-- Ações -->
        <div class="flex items-center justify-end gap-3 pt-1">
          <span v-if="savedHorariosFeedback" class="text-sm text-green-600 font-medium">✓ Salvo!</span>
          <button
            type="button"
            :disabled="savingHorarios"
            class="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-colors disabled:opacity-60"
            :style="{ background: form.cor_primaria, color: form.cor_primaria_texto }"
            @click="saveHorarios"
          >
            <svg v-if="savingHorarios" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
            {{ savingHorarios ? 'Salvando…' : 'Salvar horários' }}
          </button>
        </div>
      </section>

      <!-- Preview -->
      <section class="bg-white rounded-2xl border border-primary-10 shadow-sm p-6 space-y-4">
        <h2 class="text-base font-bold text-gray-800">Preview</h2>
        <div class="rounded-xl overflow-hidden border border-gray-200 shadow-md">
          <!-- Mini header -->
          <div class="h-10 flex items-center justify-between px-4" :style="{ background: previewSidebarBg }">
            <div class="flex items-center gap-2">
              <img v-if="form.logo_url" :src="form.logo_url" class="w-5 h-5 object-contain rounded" alt="Logo" />
              <div v-else class="w-5 h-5 rounded-md flex items-center justify-center" :style="{ background: previewPrimaryBg }">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" :style="{ color: form.cor_primaria_texto }">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <span class="text-xs font-bold" :style="{ color: form.cor_card_texto }">{{ form.nome_empresa || 'UpStudio' }}</span>
            </div>
            <div class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black" :style="{ background: previewPrimaryBg, color: form.cor_primaria_texto }">A</div>
          </div>

          <!-- Mini conteúdo -->
          <div class="flex" :style="{ background: previewFundoBg }">
            <div class="w-10 shrink-0 flex flex-col items-center py-3 gap-2.5 border-r" :style="{ background: previewSidebarBg, borderColor: 'rgba(128,128,128,0.1)' }">
              <div v-for="i in 4" :key="i" class="w-4 h-4 rounded" :style="{ background: i === 1 ? previewPrimaryBg : 'rgba(128,128,128,0.15)' }" />
            </div>
            <div class="flex-1 p-3 space-y-2.5">
              <!-- Mini banner -->
              <div class="h-7 rounded-lg" :style="{ background: previewPrimaryBg }" />
              <!-- Mini cards -->
              <div class="grid grid-cols-3 gap-2">
                <div v-for="i in 3" :key="i" class="rounded-lg p-2 space-y-1" :style="{ background: previewCardBg, border: '1px solid rgba(128,128,128,0.1)' }">
                  <div class="h-1.5 rounded-full w-10" :style="{ background: 'rgba(128,128,128,0.2)' }" />
                  <div class="h-3 rounded w-8 font-black text-[8px] flex items-center" :style="{ color: form.cor_card_texto }">{{ ['R$ 400', '12', '3'][i-1] }}</div>
                  <div class="h-1 rounded-full w-12" :style="{ background: 'rgba(128,128,128,0.12)' }" />
                </div>
              </div>
              <!-- Mini botões -->
              <div class="flex gap-2">
                <div class="px-3 py-1.5 rounded-lg text-[10px] font-bold" :style="{ background: previewPrimaryBg, color: form.cor_primaria_texto }">Salvar</div>
                <div class="px-3 py-1.5 rounded-lg text-[10px] font-bold" :style="{ background: 'rgba(128,128,128,0.1)', color: form.cor_card_texto }">Cancelar</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Dados da Empresa -->
      <section class="bg-white rounded-2xl border border-primary-10 shadow-sm p-6 space-y-5">
        <div>
          <h2 class="text-base font-bold text-gray-800">Dados da Empresa</h2>
          <p class="text-xs text-gray-500 mt-1">Informações que aparecem nos orçamentos e documentos.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="text-xs font-bold text-gray-500">Razão Social</label>
            <input v-model="dadosEmpresa.razao_social" type="text" placeholder="Razão Social da empresa" class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all" />
          </div>
          <div class="space-y-1">
            <label class="text-xs font-bold text-gray-500">CNPJ</label>
            <input v-model="dadosEmpresa.cnpj" type="text" placeholder="00.000.000/0000-00" class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all" />
          </div>
        </div>

        <div class="space-y-1">
          <label class="text-xs font-bold text-gray-500">Endereço Completo</label>
          <input v-model="dadosEmpresa.endereco" type="text" placeholder="Rua, número, bairro, cidade - UF, CEP" class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all" />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="text-xs font-bold text-gray-500">Telefone</label>
            <input v-model="dadosEmpresa.telefone" type="text" placeholder="(11) 99999-9999" class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all" />
          </div>
          <div class="space-y-1">
            <label class="text-xs font-bold text-gray-500">E-mail</label>
            <input v-model="dadosEmpresa.email" type="text" placeholder="contato@empresa.com" class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all" />
          </div>
        </div>

        <!-- Dados Bancários -->
        <div class="pt-3 border-t border-gray-100">
          <h3 class="text-sm font-bold text-gray-700 mb-3">Dados Bancários</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-xs font-bold text-gray-500">Banco</label>
              <input v-model="dadosEmpresa.banco" type="text" placeholder="Ex: Banco do Brasil" class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all" />
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold text-gray-500">Agência</label>
              <input v-model="dadosEmpresa.agencia" type="text" placeholder="0000" class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all" />
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold text-gray-500">Conta</label>
              <input v-model="dadosEmpresa.conta" type="text" placeholder="00000-0" class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all" />
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold text-gray-500">Tipo de Conta</label>
              <select v-model="dadosEmpresa.tipo_conta" class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all">
                <option value="">Selecione</option>
                <option value="corrente">Corrente</option>
                <option value="poupanca">Poupança</option>
              </select>
            </div>
          </div>
          <div class="space-y-1 mt-4">
            <label class="text-xs font-bold text-gray-500">Chave PIX</label>
            <input v-model="dadosEmpresa.chave_pix" type="text" placeholder="CPF, CNPJ, e-mail, telefone ou chave aleatória" class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all" />
          </div>
          <div class="space-y-1 mt-4">
            <label class="text-xs font-bold text-gray-500">Titular da Conta</label>
            <input v-model="dadosEmpresa.titular_conta" type="text" placeholder="Nome do titular" class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all" />
          </div>
        </div>

        <div class="flex justify-end pt-2">
          <button
            type="button"
            :disabled="salvandoDadosEmpresa"
            class="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold bg-gray-900 text-white hover:bg-gray-800 transition-colors disabled:opacity-60"
            @click="salvarDadosEmpresa"
          >
            <svg v-if="salvandoDadosEmpresa" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
            {{ salvandoDadosEmpresa ? 'Salvando...' : 'Salvar dados' }}
          </button>
        </div>
        <p v-if="dadosEmpresaSaved" class="text-xs text-green-600 font-medium text-right">✓ Dados salvos!</p>
      </section>

      <!-- Ações -->
      <div class="flex items-center justify-between pb-6">
        <button
          type="button"
          class="text-sm text-gray-400 hover:text-gray-600 transition-colors underline"
          @click="handleReset"
        >
          Restaurar padrões
        </button>

        <div class="flex items-center gap-3">
          <span v-if="savedFeedback" class="text-sm text-green-600 font-medium">✓ Salvo!</span>
          <button
            type="button"
            :disabled="saving"
            class="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-colors disabled:opacity-60"
            :style="{ background: form.cor_primaria, color: form.cor_primaria_texto }"
            @click="handleSave"
          >
            <svg v-if="saving" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
            {{ saving ? 'Salvando…' : 'Salvar personalização' }}
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import { usePersonalizacao, type PersonalizacaoConfig } from '~/composables/usePersonalizacao'
import { createSupabaseClient } from '~/lib/supabase'
import { useEmpresa } from '~/composables/useEmpresa'

defineOptions({ name: 'ConfiguracoesPage' })

const supabase = createSupabaseClient()
const { empresaId, loadEmpresa } = useEmpresa()

const { config, loading, saving, uploadingLogo, error, loadPersonalizacao, savePersonalizacao, uploadLogo, applyTheme, DEFAULTS } = usePersonalizacao()

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  if (isNaN(r) || isNaN(g) || isNaN(b)) return `rgba(107,114,128,${alpha})`
  return `rgba(${r},${g},${b},${alpha})`
}

const savedFeedback = ref(false)
const formLoaded = ref(false)

// ── Horários de agendamento ──────────────────────────────────────────
const DIAS_SEMANA = [
  { value: 0, label: 'Dom' },
  { value: 1, label: 'Seg' },
  { value: 2, label: 'Ter' },
  { value: 3, label: 'Qua' },
  { value: 4, label: 'Qui' },
  { value: 5, label: 'Sex' },
  { value: 6, label: 'Sáb' },
]
const horarios = reactive({
  abertura:        '08:00',
  fechamento:      '18:00',
  intervalo:       30,
  antecedencia:    60,
  dias:            [1, 2, 3, 4, 5] as number[],
  almoco_ativo:    false,
  almoco_inicio:   '12:00',
  almoco_fim:      '13:00',
})
const savingHorarios = ref(false)
const savedHorariosFeedback = ref(false)
const horarioError = ref<string | null>(null)

async function loadHorarios() {
  await loadEmpresa()
  if (!empresaId.value) return

  const [configRes, diasRes] = await Promise.all([
    supabase
      .from('empresa_personalizacao')
      .select('horario_abertura, horario_fechamento, intervalo_min, almoco_inicio, almoco_fim, antecedencia_min')
      .eq('empresa_id', empresaId.value)
      .maybeSingle(),
    supabase
      .from('empresa_dias_funcionamento')
      .select('dia_semana, ativo')
      .eq('empresa_id', empresaId.value),
  ])

  if (configRes.data) {
    const d = configRes.data as { horario_abertura?: string | null; horario_fechamento?: string | null; intervalo_min?: number | null; almoco_inicio?: string | null; almoco_fim?: string | null; antecedencia_min?: number | null }
    horarios.abertura      = d.horario_abertura   ?? '08:00'
    horarios.fechamento    = d.horario_fechamento ?? '18:00'
    horarios.intervalo     = d.intervalo_min      ?? 30
    horarios.antecedencia  = d.antecedencia_min   ?? 60
    horarios.almoco_inicio = d.almoco_inicio      ?? '12:00'
    horarios.almoco_fim    = d.almoco_fim         ?? '13:00'
    horarios.almoco_ativo  = !!d.almoco_inicio
  }

  if (diasRes.data && diasRes.data.length > 0) {
    horarios.dias = diasRes.data.filter((r: { dia_semana: number; ativo: boolean }) => r.ativo).map((r: { dia_semana: number; ativo: boolean }) => r.dia_semana)
  }
}

async function saveHorarios() {
  await loadEmpresa()
  if (!empresaId.value) return
  savingHorarios.value = true
  horarioError.value = null

  const { error: updateErr } = await supabase
    .from('empresa_personalizacao')
    .update({
      horario_abertura:   horarios.abertura,
      horario_fechamento: horarios.fechamento,
      intervalo_min:      horarios.intervalo,
      antecedencia_min:   horarios.antecedencia,
      almoco_inicio:      horarios.almoco_ativo ? horarios.almoco_inicio : null,
      almoco_fim:         horarios.almoco_ativo ? horarios.almoco_fim    : null,
    })
    .eq('empresa_id', empresaId.value)

  if (updateErr) {
    horarioError.value = 'Erro ao salvar horários: ' + updateErr.message
    savingHorarios.value = false
    return
  }

  // Upsert todos os 7 dias
  const diasRows = DIAS_SEMANA.map(d => ({
    empresa_id: empresaId.value as number,
    dia_semana: d.value,
    ativo:      horarios.dias.includes(d.value),
  }))
  const { error: diasErr } = await supabase
    .from('empresa_dias_funcionamento')
    .upsert(diasRows, { onConflict: 'empresa_id,dia_semana' })

  savingHorarios.value = false
  if (diasErr) {
    horarioError.value = 'Erro ao salvar dias: ' + diasErr.message
    return
  }

  savedHorariosFeedback.value = true
  setTimeout(() => { savedHorariosFeedback.value = false }, 2500)
}

function toggleDia(dia: number) {
  const idx = horarios.dias.indexOf(dia)
  if (idx === -1) horarios.dias.push(dia)
  else horarios.dias.splice(idx, 1)
}

const form = reactive<PersonalizacaoConfig>({ ...DEFAULTS })

// Controles de toggle para degradê
const usarGradPrimaria = ref(false)
const usarGradFundo    = ref(false)
const usarGradSidebar  = ref(false)
const usarGradCard     = ref(false)

const direcoes = [
  { label: '↘ Diagonal', value: '135deg' },
  { label: '→ Direita',  value: '90deg'  },
  { label: '↓ Baixo',    value: '180deg' },
  { label: '↗ Diagonal', value: '45deg'  },
  { label: '← Esquerda', value: '270deg' },
]

/** Converte logo_size (string nomeada ou numérica) → px */
const logoSizePx = computed(() => {
  const s = form.logo_size
  const num = parseInt(s)
  if (!isNaN(num)) return num
  switch (s) {
    case 'sm':  return 28
    case 'lg':  return 44
    case 'xl':  return 56
    case '2xl': return 72
    default:    return 32
  }
})

function onLogoSlider(e: Event) {
  form.logo_size = String((e.target as HTMLInputElement).value)
}

const logoDocSizePx = computed(() => parseInt(form.logo_orcamento_size || '160') || 160)

let _logoDocSaveTimer: ReturnType<typeof setTimeout> | null = null
function onLogoDocSlider(e: Event) {
  form.logo_orcamento_size = (e.target as HTMLInputElement).value
  // Debounce auto-save (500ms)
  if (_logoDocSaveTimer) clearTimeout(_logoDocSaveTimer)
  _logoDocSaveTimer = setTimeout(() => handleSave(), 500)
}

// Computed para preview — usa degradê se ativado
const previewPrimaryBg = computed(() =>
  usarGradPrimaria.value && form.cor_primaria_grad
    ? `linear-gradient(${form.grad_direction}, ${form.cor_primaria}, ${form.cor_primaria_grad})`
    : form.cor_primaria
)
const previewFundoBg = computed(() =>
  usarGradFundo.value && form.cor_fundo_grad
    ? `linear-gradient(${form.grad_direction}, ${form.cor_fundo}, ${form.cor_fundo_grad})`
    : form.cor_fundo
)
const previewSidebarBg = computed(() =>
  usarGradSidebar.value && form.cor_sidebar_grad
    ? `linear-gradient(${form.grad_direction}, ${form.cor_sidebar}, ${form.cor_sidebar_grad})`
    : form.cor_sidebar
)
const previewCardBg = computed(() =>
  usarGradCard.value && form.cor_card_grad
    ? `linear-gradient(${form.grad_direction}, ${form.cor_card}, ${form.cor_card_grad})`
    : form.cor_card
)

const temasProntos = [
  // ─── DARK PREMIUM ───────────────────────────────────────────────
  { nome: '🖤 Neon Studio',     cor_primaria: '#22c55e', cor_primaria_texto: '#ffffff', cor_fundo: '#0f172a', cor_sidebar: '#0f172a', cor_card: '#1e293b', cor_card_texto: '#e2e8f0', cor_primaria_grad: '#16a34a', cor_fundo_grad: '#1e293b', cor_sidebar_grad: '#1e293b', cor_card_grad: null, grad_direction: '180deg', cor_botao: '#22c55e', cor_botao_texto: '#000000', cor_icone: '#4ade80' },
  { nome: '🔥 Fire Print',      cor_primaria: '#f97316', cor_primaria_texto: '#ffffff', cor_fundo: '#0c0a09', cor_sidebar: '#1c1917', cor_card: '#1c1917', cor_card_texto: '#fafaf9', cor_primaria_grad: '#ef4444', cor_fundo_grad: '#1c1917', cor_sidebar_grad: '#292524', cor_card_grad: null, grad_direction: '135deg', cor_botao: '#f97316', cor_botao_texto: '#000000', cor_icone: '#fb923c' },
  { nome: '⚡ Electric Blue',   cor_primaria: '#3b82f6', cor_primaria_texto: '#ffffff', cor_fundo: '#020617', cor_sidebar: '#0f172a', cor_card: '#1e293b', cor_card_texto: '#e2e8f0', cor_primaria_grad: '#06b6d4', cor_fundo_grad: '#0f172a', cor_sidebar_grad: '#1e293b', cor_card_grad: null, grad_direction: '135deg', cor_botao: '#3b82f6', cor_botao_texto: '#ffffff', cor_icone: '#60a5fa' },
  { nome: '🎨 Iron Design',     cor_primaria: '#a855f7', cor_primaria_texto: '#ffffff', cor_fundo: '#09090b', cor_sidebar: '#18181b', cor_card: '#27272a', cor_card_texto: '#fafafa', cor_primaria_grad: '#ec4899', cor_fundo_grad: '#18181b', cor_sidebar_grad: '#27272a', cor_card_grad: null, grad_direction: '135deg', cor_botao: '#a855f7', cor_botao_texto: '#ffffff', cor_icone: '#c084fc' },
  { nome: '🌊 Ocean Vinyl',     cor_primaria: '#06b6d4', cor_primaria_texto: '#ffffff', cor_fundo: '#042f2e', cor_sidebar: '#0f3d3c', cor_card: '#134e4a', cor_card_texto: '#ccfbf1', cor_primaria_grad: '#14b8a6', cor_fundo_grad: '#0f3d3c', cor_sidebar_grad: '#134e4a', cor_card_grad: null, grad_direction: '180deg', cor_botao: '#06b6d4', cor_botao_texto: '#000000', cor_icone: '#22d3ee' },
  { nome: '🥊 Bold Red',        cor_primaria: '#ef4444', cor_primaria_texto: '#ffffff', cor_fundo: '#0f172a', cor_sidebar: '#1e293b', cor_card: '#1e293b', cor_card_texto: '#f1f5f9', cor_primaria_grad: '#dc2626', cor_fundo_grad: '#1e293b', cor_sidebar_grad: '#334155', cor_card_grad: null, grad_direction: '135deg', cor_botao: '#ef4444', cor_botao_texto: '#ffffff', cor_icone: '#f87171' },
  { nome: '✨ Gold Premium',    cor_primaria: '#eab308', cor_primaria_texto: '#000000', cor_fundo: '#0c0a09', cor_sidebar: '#1c1917', cor_card: '#292524', cor_card_texto: '#fafaf9', cor_primaria_grad: '#f59e0b', cor_fundo_grad: '#1c1917', cor_sidebar_grad: '#292524', cor_card_grad: null, grad_direction: '135deg', cor_botao: '#eab308', cor_botao_texto: '#000000', cor_icone: '#fbbf24' },
  { nome: '💚 Lime Fresh',      cor_primaria: '#84cc16', cor_primaria_texto: '#000000', cor_fundo: '#0f172a', cor_sidebar: '#1e293b', cor_card: '#1e293b', cor_card_texto: '#f1f5f9', cor_primaria_grad: '#22c55e', cor_fundo_grad: '#1e293b', cor_sidebar_grad: '#334155', cor_card_grad: null, grad_direction: '90deg',  cor_botao: '#84cc16', cor_botao_texto: '#000000', cor_icone: '#a3e635' },

  // ─── LIGHT PREMIUM ────────────────────────────────────────────────
  { nome: '☀️ Fresh Green',     cor_primaria: '#16a34a', cor_primaria_texto: '#ffffff', cor_fundo: '#f0fdf4', cor_sidebar: '#166534', cor_card: '#ffffff', cor_card_texto: '#1f2937', cor_primaria_grad: '#22c55e', cor_fundo_grad: null, cor_sidebar_grad: '#15803d', cor_card_grad: null, grad_direction: '135deg', cor_botao: '#16a34a', cor_botao_texto: '#ffffff', cor_icone: '#ffffff' },
  { nome: '🌤️ Energize',       cor_primaria: '#ea580c', cor_primaria_texto: '#ffffff', cor_fundo: '#fffbeb', cor_sidebar: '#9a3412', cor_card: '#ffffff', cor_card_texto: '#1f2937', cor_primaria_grad: '#dc2626', cor_fundo_grad: null, cor_sidebar_grad: '#b91c1c', cor_card_grad: null, grad_direction: '135deg', cor_botao: '#ea580c', cor_botao_texto: '#ffffff', cor_icone: '#ffffff' },
  { nome: '💎 Clean Blue',      cor_primaria: '#2563eb', cor_primaria_texto: '#ffffff', cor_fundo: '#f8fafc', cor_sidebar: '#1e40af', cor_card: '#ffffff', cor_card_texto: '#1e293b', cor_primaria_grad: '#0891b2', cor_fundo_grad: null, cor_sidebar_grad: '#1e3a8a', cor_card_grad: null, grad_direction: '135deg', cor_botao: '#2563eb', cor_botao_texto: '#ffffff', cor_icone: '#ffffff' },
  { nome: '🌿 Mint Light',      cor_primaria: '#0d9488', cor_primaria_texto: '#ffffff', cor_fundo: '#f0fdfa', cor_sidebar: '#134e4a', cor_card: '#ffffff', cor_card_texto: '#1f2937', cor_primaria_grad: '#06b6d4', cor_fundo_grad: null, cor_sidebar_grad: '#164e63', cor_card_grad: null, grad_direction: '135deg', cor_botao: '#0d9488', cor_botao_texto: '#ffffff', cor_icone: '#ffffff' },
  { nome: '🩷 Aurora Pink',     cor_primaria: '#ec4899', cor_primaria_texto: '#ffffff', cor_fundo: '#fdf2f8', cor_sidebar: '#9d174d', cor_card: '#ffffff', cor_card_texto: '#1f2937', cor_primaria_grad: '#a855f7', cor_fundo_grad: null, cor_sidebar_grad: '#be185d', cor_card_grad: null, grad_direction: '135deg', cor_botao: '#ec4899', cor_botao_texto: '#ffffff', cor_icone: '#ffffff' },
  { nome: '👑 Royal Indigo',    cor_primaria: '#4f46e5', cor_primaria_texto: '#ffffff', cor_fundo: '#eef2ff', cor_sidebar: '#3730a3', cor_card: '#ffffff', cor_card_texto: '#312e81', cor_primaria_grad: '#7c3aed', cor_fundo_grad: null, cor_sidebar_grad: '#4c1d95', cor_card_grad: null, grad_direction: '135deg', cor_botao: '#4f46e5', cor_botao_texto: '#ffffff', cor_icone: '#ffffff' },

  // ─── CONTRAST / BOLD ──────────────────────────────────────────────
  { nome: '🖤 Stealth',         cor_primaria: '#22c55e', cor_primaria_texto: '#000000', cor_fundo: '#000000', cor_sidebar: '#000000', cor_card: '#111111', cor_card_texto: '#ffffff', cor_primaria_grad: null,     cor_fundo_grad: '#111111', cor_sidebar_grad: '#111111', cor_card_grad: null, grad_direction: '180deg', cor_botao: '#22c55e', cor_botao_texto: '#000000', cor_icone: '#22c55e' },
  { nome: '⚪ Minimal',         cor_primaria: '#18181b', cor_primaria_texto: '#ffffff', cor_fundo: '#ffffff', cor_sidebar: '#18181b', cor_card: '#ffffff', cor_card_texto: '#18181b', cor_primaria_grad: null,     cor_fundo_grad: null, cor_sidebar_grad: '#27272a', cor_card_grad: null, grad_direction: '180deg', cor_botao: '#18181b', cor_botao_texto: '#ffffff', cor_icone: '#ffffff' },
  { nome: '🟣 Purple Beast',    cor_primaria: '#7c3aed', cor_primaria_texto: '#ffffff', cor_fundo: '#0f0720', cor_sidebar: '#1a0a3e', cor_card: '#1e1145', cor_card_texto: '#e9d5ff', cor_primaria_grad: '#a855f7', cor_fundo_grad: '#1a0a3e', cor_sidebar_grad: '#1e1145', cor_card_grad: null, grad_direction: '135deg', cor_botao: '#7c3aed', cor_botao_texto: '#ffffff', cor_icone: '#a78bfa' },
  { nome: '🩵 Soft Blue',       cor_primaria: '#0ea5e9', cor_primaria_texto: '#ffffff', cor_fundo: '#0c4a6e', cor_sidebar: '#082f49', cor_card: '#0c4a6e', cor_card_texto: '#e0f2fe', cor_primaria_grad: '#38bdf8', cor_fundo_grad: '#082f49', cor_sidebar_grad: '#0c4a6e', cor_card_grad: null, grad_direction: '180deg', cor_botao: '#0ea5e9', cor_botao_texto: '#000000', cor_icone: '#38bdf8' },
]

// ── Dados da Empresa ──────────────────────────────────────────────────────────
const dadosEmpresa = reactive({
  razao_social: '',
  cnpj: '',
  endereco: '',
  telefone: '',
  email: '',
  banco: '',
  agencia: '',
  conta: '',
  tipo_conta: '',
  chave_pix: '',
  titular_conta: '',
})
const salvandoDadosEmpresa = ref(false)
const dadosEmpresaSaved = ref(false)

async function carregarDadosEmpresa() {
  await loadEmpresa()
  if (!empresaId.value) return
  const { data, error: err } = await supabase
    .from('empresa_personalizacao')
    .select('*')
    .eq('empresa_id', empresaId.value)
    .single()
  if (err) { console.error('Erro ao carregar dados empresa:', err); return }
  if (data) {
    dadosEmpresa.razao_social = data.razao_social ?? ''
    dadosEmpresa.cnpj = data.cnpj ?? ''
    dadosEmpresa.endereco = data.endereco ?? ''
    dadosEmpresa.telefone = data.telefone ?? ''
    dadosEmpresa.email = data.email ?? ''
    dadosEmpresa.banco = data.banco ?? ''
    dadosEmpresa.agencia = data.agencia ?? ''
    dadosEmpresa.conta = data.conta ?? ''
    dadosEmpresa.tipo_conta = data.tipo_conta ?? ''
    dadosEmpresa.chave_pix = data.chave_pix ?? ''
    dadosEmpresa.titular_conta = data.titular_conta ?? ''
  }
}

async function salvarDadosEmpresa() {
  if (!empresaId.value) return
  salvandoDadosEmpresa.value = true
  dadosEmpresaSaved.value = false
  const { error: err } = await supabase
    .from('empresa_personalizacao')
    .update({
      razao_social: dadosEmpresa.razao_social || null,
      cnpj: dadosEmpresa.cnpj || null,
      endereco: dadosEmpresa.endereco || null,
      telefone: dadosEmpresa.telefone || null,
      email: dadosEmpresa.email || null,
      banco: dadosEmpresa.banco || null,
      agencia: dadosEmpresa.agencia || null,
      conta: dadosEmpresa.conta || null,
      tipo_conta: dadosEmpresa.tipo_conta || null,
      chave_pix: dadosEmpresa.chave_pix || null,
      titular_conta: dadosEmpresa.titular_conta || null,
    })
    .eq('empresa_id', empresaId.value)
  salvandoDadosEmpresa.value = false
  if (err) {
    console.error('Erro ao salvar dados empresa:', err)
    alert('Erro ao salvar: ' + err.message)
  } else {
    dadosEmpresaSaved.value = true
    setTimeout(() => { dadosEmpresaSaved.value = false }, 3000)
  }
}

onMounted(async () => {
  loading.value = true
  await Promise.all([loadPersonalizacao(false), loadHorarios(), carregarDadosEmpresa()])
  loading.value = false
  Object.assign(form, config.value)
  // Inicializa toggles com base nos dados salvos
  usarGradPrimaria.value = !!form.cor_primaria_grad
  usarGradFundo.value    = !!form.cor_fundo_grad
  usarGradSidebar.value  = !!form.cor_sidebar_grad
  usarGradCard.value     = !!form.cor_card_grad
  // Só habilita o watcher de preview depois de carregar os dados salvos
  nextTick(() => { formLoaded.value = true })
})

// Limpa campos de gradiente quando toggle é desligado
watch(usarGradPrimaria, (v) => { if (!v) form.cor_primaria_grad = null })
watch(usarGradFundo,    (v) => { if (!v) form.cor_fundo_grad    = null })
watch(usarGradSidebar,  (v) => { if (!v) form.cor_sidebar_grad  = null })
watch(usarGradCard,     (v) => { if (!v) form.cor_card_grad     = null })

// Preview em tempo real — só aplica depois que os dados salvos foram carregados
watch(form, (val) => {
  if (!formLoaded.value) return
  applyTheme(val)
}, { deep: true })

function aplicarTema(tema: typeof temasProntos[0]) {
  form.cor_primaria       = tema.cor_primaria
  form.cor_primaria_texto = tema.cor_primaria_texto
  form.cor_fundo          = tema.cor_fundo
  form.cor_sidebar        = tema.cor_sidebar
  form.cor_card           = tema.cor_card
  form.cor_card_texto     = tema.cor_card_texto
  form.cor_primaria_grad  = tema.cor_primaria_grad  ?? null
  form.cor_fundo_grad     = tema.cor_fundo_grad     ?? null
  form.cor_sidebar_grad   = tema.cor_sidebar_grad   ?? null
  form.cor_card_grad      = tema.cor_card_grad      ?? null
  form.grad_direction     = tema.grad_direction     ?? '135deg'
  form.cor_botao          = tema.cor_botao          ?? tema.cor_primaria
  form.cor_botao_texto    = tema.cor_botao_texto    ?? '#ffffff'
  form.cor_icone          = tema.cor_icone          ?? tema.cor_primaria
  usarGradPrimaria.value  = !!tema.cor_primaria_grad
  usarGradFundo.value     = !!tema.cor_fundo_grad
  usarGradSidebar.value   = !!tema.cor_sidebar_grad
  usarGradCard.value      = !!tema.cor_card_grad
}

function isTemaSelecionado(tema: typeof temasProntos[0]): boolean {
  return form.cor_primaria === tema.cor_primaria
    && form.cor_fundo === tema.cor_fundo
    && (form.cor_primaria_grad ?? null) === (tema.cor_primaria_grad ?? null)
}

function sanitizeHex(field: keyof PersonalizacaoConfig) {
  const val = form[field] as string
  if (val && !/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
    ;(form as any)[field] = val.replace(/[^#0-9A-Fa-f]/g, '')
  }
}

async function handleLogoUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const url = await uploadLogo(file)
  if (url) {
    form.logo_url = url
    await handleSave()
  }
  input.value = ''
}

const uploadingLogoDoc = ref(false)

async function handleLogoDocUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  uploadingLogoDoc.value = true

  // Upload com path separado (logo-doc) para não sobrescrever o principal
  const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
  if (!allowedTypes.includes(file.type)) { uploadingLogoDoc.value = false; return }
  if (file.size > 2 * 1024 * 1024) { uploadingLogoDoc.value = false; return }

  const ext = file.name.split('.').pop()
  const path = `logos/${empresaId.value}/logo-doc.${ext}`
  const { error: uploadErr } = await supabase.storage
    .from('empresa-assets')
    .upload(path, file, { upsert: true, contentType: file.type })

  uploadingLogoDoc.value = false
  if (uploadErr) { console.error('Erro upload logo doc:', uploadErr); return }

  const { data } = supabase.storage.from('empresa-assets').getPublicUrl(path)
  const url = `${data.publicUrl}?t=${Date.now()}`

  form.logo_orcamento_url = url
  await handleSave()
  input.value = ''
}

async function handleSave() {
  const ok = await savePersonalizacao({ ...form })
  if (ok) {
    savedFeedback.value = true
    setTimeout(() => { savedFeedback.value = false }, 2500)
  } else if (!error.value) {
    error.value = 'Não foi possível salvar. Tente novamente.'
  }
}

function handleReset() {
  Object.assign(form, DEFAULTS)
  usarGradPrimaria.value = false
  usarGradFundo.value    = false
  usarGradSidebar.value  = false
  usarGradCard.value     = false
}

async function handleRemoveLogo() {
  form.logo_url = null
  await handleSave()
}
</script>
