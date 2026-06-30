<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0f] text-white px-6">
    <!-- Background effects -->
    <div class="fixed inset-0 pointer-events-none">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px]" />
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px]" />
    </div>

    <!-- Content -->
    <div class="relative z-10 flex flex-col items-center gap-10 max-w-lg w-full">
      <!-- Logo -->
      <img src="/logo-signpro.png" alt="SignPRO" class="h-12 sm:h-14 w-auto" />

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
          class="group relative flex flex-col items-center gap-4 p-8 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-orange-500/30 transition-all duration-300 cursor-pointer"
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
          class="group relative flex flex-col items-center gap-4 p-8 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-orange-500/30 transition-all duration-300 cursor-pointer"
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
