<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0f] text-white px-6">
    <!-- Background effects -->
    <div class="fixed inset-0 pointer-events-none">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px]" />
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]" />
    </div>

    <!-- Content -->
    <div class="relative z-10 flex flex-col items-center gap-10 max-w-lg w-full">
      <!-- Logo -->
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-violet-500/25">
          <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        </div>
        <span class="text-2xl font-bold tracking-tight">Sign<span class="text-violet-400">PRO</span></span>
      </div>

      <!-- Title -->
      <div class="text-center">
        <h1 class="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Escolha sua região</h1>
        <p class="text-white/50 text-sm sm:text-base">Selecione o país para acessar a versão correta da plataforma</p>
      </div>

      <!-- Country buttons -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        <!-- Brasil -->
        <NuxtLink
          to="/landing"
          class="group relative flex flex-col items-center gap-4 p-8 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-violet-500/30 transition-all duration-300 cursor-pointer"
        >
          <div class="absolute inset-0 rounded-2xl bg-gradient-to-b from-green-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span class="relative text-5xl">🇧🇷</span>
          <div class="relative text-center">
            <p class="text-lg font-bold text-white">Brasil</p>
            <p class="text-xs text-white/40 mt-1">Português (BR)</p>
          </div>
        </NuxtLink>

        <!-- Portugal -->
        <NuxtLink
          to="/landing-pt"
          class="group relative flex flex-col items-center gap-4 p-8 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-violet-500/30 transition-all duration-300 cursor-pointer"
        >
          <div class="absolute inset-0 rounded-2xl bg-gradient-to-b from-red-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span class="relative text-5xl">🇵🇹</span>
          <div class="relative text-center">
            <p class="text-lg font-bold text-white">Portugal</p>
            <p class="text-xs text-white/40 mt-1">Português (PT)</p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
</script>
