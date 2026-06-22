<template>
  <div class="min-h-screen relative overflow-hidden font-sans antialiased" style="background: linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%); color: #1e293b">

    <!-- Blobs de fundo (sempre visíveis) -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-25 blur-[100px]" style="background: radial-gradient(circle, #bfdbfe, transparent 70%)"></div>
      <div class="absolute -bottom-40 -right-40 w-[700px] h-[700px] rounded-full opacity-20 blur-[120px]" style="background: radial-gradient(circle, #c7d2fe, transparent 70%)"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-15 blur-[80px]" style="background: radial-gradient(circle, #dbeafe, transparent 70%)"></div>
      <!-- Partículas flutuantes -->
      <div class="particle" style="top:8%;right:12%;width:14px;height:14px;background:#60a5fa;animation-duration:4s"></div>
      <div class="particle" style="top:18%;right:30%;width:9px;height:9px;background:#818cf8;animation-duration:5s;animation-delay:.7s"></div>
      <div class="particle" style="top:55%;left:8%;width:11px;height:11px;background:#6366f1;animation-duration:4.5s;animation-delay:1.3s"></div>
      <div class="particle" style="bottom:20%;left:22%;width:8px;height:8px;background:#3b82f6;animation-duration:3.5s;animation-delay:.4s"></div>
      <div class="particle" style="bottom:35%;right:18%;width:10px;height:10px;background:#a5b4fc;animation-duration:4.2s;animation-delay:1s"></div>
      <div class="particle" style="top:40%;left:40%;width:6px;height:6px;background:#93c5fd;animation-duration:6s;animation-delay:.2s"></div>
    </div>

    <!-- ═══════════════ INTRO HERO ═══════════════ -->
    <Transition name="intro">
      <div v-if="showIntro" class="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-16 text-center">

        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-50 border border-indigo-200 mb-8 shadow-sm intro-badge">
          <svg class="w-3.5 h-3.5 text-indigo-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 8.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/>
          </svg>
          <span class="text-xs font-bold text-indigo-600 tracking-wider uppercase">Sistema completo para comunicação visual</span>
        </div>

        <!-- Ícone central -->
        <div class="w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-900/30 mb-8 intro-icon" style="background: linear-gradient(135deg, #1e40af, #4f46e5)">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"/>
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"/>
          </svg>
        </div>

        <!-- Headline -->
        <h1 class="font-black tracking-tight mb-5 intro-headline" style="line-height:1.08">
          <span class="block" style="font-size:clamp(2rem,5.5vw,3.8rem);background:linear-gradient(135deg,#1e40af,#4f46e5);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">
            Da arte à entrega.
          </span>
          <span class="block mt-1" style="font-size:clamp(2rem,5.5vw,3.8rem);background:linear-gradient(135deg,#3b82f6,#6366f1,#4f46e5);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">
            Controle total da sua produção.
          </span>
        </h1>

        <!-- Subheadline -->
        <p class="text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed intro-sub" style="color:rgba(30,41,59,0.65)">
          Gerencie orçamentos, ordens de serviço, produção e entregas — tudo em um só lugar. O sistema que sua gráfica precisa.
        </p>

        <!-- Benefícios em pills -->
        <div class="flex flex-wrap items-center justify-center gap-3 mb-10 intro-pills">
          <div v-for="b in benefits" :key="b.text" class="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-indigo-100 shadow-sm text-sm font-semibold" style="color:#1e40af">
            <span class="text-base">{{ b.emoji }}</span>
            <span>{{ b.text }}</span>
          </div>
        </div>

        <!-- CTAs -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 intro-ctas">
          <button
            class="inline-flex items-center gap-2 text-base font-black px-10 py-4 rounded-full text-white transition-all duration-200 hover:scale-105 active:scale-100 shadow-xl"
            style="background:linear-gradient(135deg,#1e40af,#4f46e5);box-shadow:0 8px 28px rgba(79,70,229,0.4)"
            @click="goTo('register')"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-6.463 0 4.493 4.493 0 006.463 0z"/></svg>
            Começar agora
          </button>
          <button
            class="inline-flex items-center gap-2 text-base font-semibold px-8 py-4 rounded-full border-2 border-indigo-200 bg-white hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 shadow-sm"
            style="color:#4f46e5"
            @click="goTo('login')"
          >
            Já tenho uma conta
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
          </button>
        </div>

        <!-- Social proof -->
        <div class="flex flex-wrap items-center justify-center gap-5 text-sm intro-proof" style="color:rgba(30,41,59,0.5)">
          <div class="flex items-center gap-2">
            <div class="flex -space-x-2">
              <div v-for="(c, i) in avatarColors" :key="i" class="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-black text-white" :style="{ background: c }">{{ avatarInitials[i] }}</div>
            </div>
            <span class="font-semibold">+100 gráficas ativas</span>
          </div>
          <span class="text-indigo-200 hidden sm:inline">|</span>
          <div class="flex items-center gap-1">
            <svg v-for="s in 5" :key="s" class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            <span class="font-semibold ml-1" style="color:rgba(30,41,59,0.7)">4.9 de satisfação</span>
          </div>
          <span class="text-indigo-200 hidden sm:inline">|</span>
          <div class="flex items-center gap-1.5">
            <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span>Sem cartão de crédito</span>
          </div>
        </div>

      </div>
    </Transition>

    <!-- ═══════════════ FORMULÁRIO ═══════════════ -->
    <Transition name="form">
      <div v-if="!showIntro" class="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">

        <!-- Botão voltar -->
        <button
          class="absolute top-5 left-5 flex items-center gap-2 text-sm font-semibold text-indigo-500 hover:text-indigo-700 transition-colors"
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
  { emoji: '🎨', text: 'Kanban produção' },
  { emoji: '📊', text: 'Dashboard financeiro' },
  { emoji: '👥', text: 'Gestão de clientes' },
  { emoji: '🚚', text: 'Controle de entregas' },
]

const avatarColors = ['#3b82f6', '#6366f1', '#1e40af', '#818cf8']
const avatarInitials = ['G', 'R', 'P', 'V']
</script>

<style scoped>
/* Partícula flutuante */
.particle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.45;
  animation: float linear infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) scale(1); }
  50%       { transform: translateY(-14px) scale(1.1); }
}

/* Animação de entrada dos elementos do intro */
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

/* Transition: intro sai para cima */
.intro-leave-active { transition: all .45s cubic-bezier(.4,0,.2,1); }
.intro-leave-to     { opacity: 0; transform: translateY(-30px); }
.intro-enter-active { transition: all .45s cubic-bezier(.4,0,.2,1); }
.intro-enter-from   { opacity: 0; transform: translateY(-30px); }

/* Transition: form entra por baixo */
.form-enter-active { transition: all .5s cubic-bezier(.4,0,.2,1) .1s; }
.form-enter-from   { opacity: 0; transform: translateY(30px); }
.form-leave-active { transition: all .35s cubic-bezier(.4,0,.2,1); }
.form-leave-to     { opacity: 0; transform: translateY(30px); }
</style>
