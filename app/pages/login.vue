<template>
  <div class="min-h-screen relative overflow-hidden font-sans antialiased bg-[#0a0a0f] text-white">

    <!-- Background effects -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-15 blur-[160px]" style="background: radial-gradient(circle, #ea580c, transparent 70%)"></div>
      <div class="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-10 blur-[120px]" style="background: radial-gradient(circle, #3b82f6, transparent 70%)"></div>
      <div class="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-8 blur-[100px]" style="background: radial-gradient(circle, #f97316, transparent 70%)"></div>
      <!-- Grid -->
      <div class="absolute inset-0 opacity-[0.02]" style="background-image: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 60px 60px;"></div>
      <!-- Particles -->
      <div class="particle" style="top:10%;right:15%;width:12px;height:12px;background:#ea580c"></div>
      <div class="particle" style="top:20%;right:35%;width:8px;height:8px;background:#ea580c;animation-delay:.7s"></div>
      <div class="particle" style="top:55%;left:10%;width:10px;height:10px;background:#f97316;animation-delay:1.3s"></div>
      <div class="particle" style="bottom:25%;left:25%;width:7px;height:7px;background:#fb923c;animation-delay:.4s"></div>
      <div class="particle" style="bottom:35%;right:20%;width:9px;height:9px;background:#ea580c;animation-delay:1s"></div>
    </div>

    <!-- --- INTRO HERO --- -->
    <Transition name="intro">
      <div v-if="showIntro" class="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-16 text-center">

        <!-- Logo -->
        <NuxtLink to="/welcome" class="mb-8 intro-badge">
          <img src="/logo-signpro.png" alt="SignPRO" class="h-10 sm:h-12 w-auto" />
        </NuxtLink>

        <!-- Headline -->
        <h1 class="font-bold tracking-tight leading-[1.08] mb-6 intro-headline">
          <span class="block text-[clamp(2rem,5.5vw,3.5rem)] text-white">Da arte à entrega.</span>
          <span class="block text-[clamp(2rem,5.5vw,3.5rem)] bg-gradient-to-r from-orange-400 via-orange-400 to-orange-500 bg-clip-text text-transparent">Controle total da produção.</span>
        </h1>

        <!-- Sub -->
        <p class="text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed text-white/50 intro-sub">
          Gerencie orçamentos, ordens de serviço, produção e entregas — tudo em um só lugar. O sistema que sua gráfica precisa.
        </p>

        <!-- Benefit pills -->
        <div class="flex flex-wrap items-center justify-center gap-3 mb-10 intro-pills">
          <div v-for="b in benefits" :key="b.text" class="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-white/70">
            <span class="text-base">{{ b.emoji }}</span>
            <span>{{ b.text }}</span>
          </div>
        </div>

        <!-- CTAs -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 intro-ctas">
          <button
            class="group inline-flex items-center gap-2 text-base font-semibold px-10 py-4 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 transition-all duration-200"
            @click="goTo('register')"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-6.463 0 4.493 4.493 0 006.463 0z"/></svg>
            Começar agora
            <svg class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
          </button>
          <button
            class="inline-flex items-center gap-2 text-base font-medium px-8 py-4 rounded-full border border-white/15 text-white/80 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-200"
            @click="goTo('login')"
          >
            Já tenho uma conta
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
          </button>
        </div>

        <!-- Social proof -->
        <div class="flex flex-wrap items-center justify-center gap-5 text-sm text-white/40 intro-proof">
          <div class="flex items-center gap-2">
            <div class="flex -space-x-2">
              <div v-for="(c, i) in 4" :key="i" class="w-8 h-8 rounded-full border-2 border-[#0a0a0f] bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-[10px] font-bold text-white">{{ ['G','R','P','V'][i] }}</div>
            </div>
            <span class="font-medium">+200 empresas ativas</span>
          </div>
          <div class="flex items-center gap-1">
            <svg v-for="s in 5" :key="s" class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            <span class="font-medium text-white/50 ml-1">4.9</span>
          </div>
          <div class="flex items-center gap-1.5">
            <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span>Sem cartão de crédito</span>
          </div>
        </div>
      </div>
    </Transition>

    <!-- --- FORMULÁRIO --- -->
    <Transition name="form">
      <div v-if="!showIntro" class="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <!-- Botão voltar -->
        <button
          class="absolute top-5 left-5 flex items-center gap-2 text-sm font-medium text-orange-400 hover:text-orange-300 transition-colors"
          @click="showIntro = true"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>
          Voltar
        </button>

        <LoginForm :initial-tab="initialTab" class="relative z-10" />
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LoginForm from '~/components/LoginForm.vue'

definePageMeta({ layout: false })

const showIntro = ref(true)
const initialTab = ref<'login' | 'register'>('register')

function goTo(tab: 'login' | 'register') {
  initialTab.value = tab
  showIntro.value = false
}

const benefits = [
  { emoji: '📋', text: 'Orçamentos → OS' },
  { emoji: '📊', text: 'Kanban produção' },
  { emoji: '💰', text: 'Dashboard financeiro' },
  { emoji: '👥', text: 'Gestão de clientes' },
  { emoji: '🚚', text: 'Controle de entregas' },
]
</script>

<style scoped>
.particle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.3;
  animation: float 4s linear infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) scale(1); }
  50%       { transform: translateY(-14px) scale(1.1); }
}

.intro-badge   { animation: fadeUp .55s ease both; }
.intro-icon    { animation: fadeUp .6s .08s ease both; }
.intro-headline{ animation: fadeUp .65s .15s ease both; }
.intro-sub     { animation: fadeUp .65s .22s ease both; }
.intro-pills   { animation: fadeUp .65s .30s ease both; }
.intro-ctas    { animation: fadeUp .65s .38s ease both; }
.intro-proof   { animation: fadeUp .65s .46s ease both; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
}

.intro-leave-active { transition: all .45s cubic-bezier(.4,0,.2,1); }
.intro-leave-to     { opacity: 0; transform: translateY(-30px); }
.intro-enter-active { transition: all .45s cubic-bezier(.4,0,.2,1); }
.intro-enter-from   { opacity: 0; transform: translateY(-30px); }

.form-enter-active { transition: all .5s cubic-bezier(.4,0,.2,1) .1s; }
.form-enter-from   { opacity: 0; transform: translateY(30px); }
.form-leave-active { transition: all .35s cubic-bezier(.4,0,.2,1); }
.form-leave-to     { opacity: 0; transform: translateY(30px); }
</style>
