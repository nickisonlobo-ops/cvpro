<template>
  <div class="min-h-screen font-sans antialiased overflow-x-hidden bg-[#0a0a0f] text-white">

    <!-- ═══ NAV ═══ -->
    <nav
      class="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      :class="scrolled ? 'bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5' : ''"
    >
      <div class="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between h-16 sm:h-20">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <span class="text-lg font-bold tracking-tight">Sign<span class="text-violet-400">PRO</span></span>
        </NuxtLink>

        <!-- Desktop links -->
        <div class="hidden md:flex items-center gap-8">
          <a v-for="link in navLinks" :key="link.href" :href="link.href" class="text-sm text-white/60 hover:text-white transition-colors font-medium">{{ link.label }}</a>
        </div>

        <!-- Desktop CTA -->
        <div class="hidden md:flex items-center gap-4">
          <NuxtLink to="/login" class="text-sm font-medium text-white/70 hover:text-white transition-colors">Entrar</NuxtLink>
          <a href="/login"
            class="px-5 py-2.5 rounded-full text-sm font-semibold bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105 transition-all duration-200">
            Começar grátis
          </a>
        </div>

        <!-- Hamburger -->
        <button class="md:hidden flex flex-col gap-1.5 p-2" @click="mobileOpen = !mobileOpen" aria-label="Menu">
          <span class="w-5 h-0.5 bg-white/80 rounded transition-all" :class="mobileOpen ? 'rotate-45 translate-y-[4px]' : ''"></span>
          <span class="w-5 h-0.5 bg-white/80 rounded transition-all" :class="mobileOpen ? 'opacity-0' : ''"></span>
          <span class="w-5 h-0.5 bg-white/80 rounded transition-all" :class="mobileOpen ? '-rotate-45 -translate-y-[4px]' : ''"></span>
        </button>
      </div>

      <!-- Mobile drawer -->
      <div v-if="mobileOpen" class="md:hidden bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/5 px-6 py-6 space-y-4">
        <a v-for="link in navLinks" :key="link.href" :href="link.href" class="block text-sm text-white/70 font-medium py-2" @click="mobileOpen = false">{{ link.label }}</a>
        <div class="flex flex-col gap-3 pt-3 border-t border-white/10">
          <NuxtLink to="/login" class="text-sm font-medium text-white/70 py-2" @click="mobileOpen = false">Entrar</NuxtLink>
          <a href="/login"
            class="px-5 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-violet-500 to-indigo-600 text-white text-center" @click="mobileOpen = false">
            Começar grátis
          </a>
        </div>
      </div>
    </nav>

    <!-- ═══ HERO ═══ -->
    <section class="relative min-h-screen flex items-center justify-center pt-24 pb-20 overflow-hidden">
      <!-- Background effects -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-20 blur-[160px]" style="background: radial-gradient(circle, #7c3aed, transparent 70%)"></div>
        <div class="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full opacity-10 blur-[120px]" style="background: radial-gradient(circle, #3b82f6, transparent 70%)"></div>
        <div class="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-10 blur-[100px]" style="background: radial-gradient(circle, #8b5cf6, transparent 70%)"></div>
        <!-- Grid overlay -->
        <div class="absolute inset-0 opacity-[0.03]" style="background-image: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 60px 60px;"></div>
      </div>

      <div class="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 text-center">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
          <div class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span class="text-xs font-medium text-white/70">Sistema #1 para comunicação visual em Portugal</span>
        </div>

        <!-- Headline -->
        <h1 class="font-bold tracking-tight leading-[1.05] mb-7">
          <span class="block text-[clamp(2.5rem,7vw,5rem)] text-white">Gerencie sua produção</span>
          <span class="block text-[clamp(2.5rem,7vw,5rem)] bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">do orçamento à entrega</span>
        </h1>

        <!-- Sub -->
        <p class="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Orçamentos, ordens de serviço, kanban de produção, financeiro e CRM.
          Tudo num só lugar para gráficas e empresas de comunicação visual.
        </p>

        <!-- CTAs -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a href="/login"
            class="group inline-flex items-center gap-2 text-base font-semibold px-8 py-4 rounded-full bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 transition-all duration-200">
            Começar grátis — 7 dias
            <svg class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
          </a>
          <a href="#funcionalidades"
            class="inline-flex items-center gap-2 text-base font-medium px-8 py-4 rounded-full border border-white/15 text-white/80 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"/></svg>
            Ver como funciona
          </a>
        </div>

        <!-- Social proof -->
        <div class="flex flex-wrap items-center justify-center gap-6 text-sm text-white/40">
          <div class="flex items-center gap-2">
            <div class="flex -space-x-2">
              <div v-for="(c, i) in 4" :key="i" class="w-8 h-8 rounded-full border-2 border-[#0a0a0f] bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">{{ ['R','M','L','F'][i] }}</div>
            </div>
            <span class="font-medium">+200 empresas ativas</span>
          </div>
          <div class="flex items-center gap-1.5">
            <svg v-for="s in 5" :key="s" class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            <span class="font-medium text-white/50">4.9 de satisfação</span>
          </div>
          <div class="flex items-center gap-1.5">
            <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span>Sem cartão de crédito</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ LOGOS / TRUST ═══ -->
    <section class="py-16 border-y border-white/5">
      <div class="max-w-5xl mx-auto px-6 sm:px-10 text-center">
        <p class="text-xs font-medium text-white/30 uppercase tracking-widest mb-8">Feito para quem trabalha com</p>
        <div class="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-white/25">
          <span v-for="tipo in ['Gráficas', 'Comunicação Visual', 'Aplicadores de Vinil', 'Sinalética', 'Frotas e Rotulagem']" :key="tipo" class="text-sm font-semibold tracking-wide">{{ tipo }}</span>
        </div>
      </div>
    </section>

    <!-- ═══ FUNCIONALIDADES ═══ -->
    <section id="funcionalidades" class="py-24 sm:py-32 relative">
      <div class="max-w-6xl mx-auto px-6 sm:px-10">
        <div class="text-center mb-16">
          <p class="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3">Funcionalidades</p>
          <h2 class="text-3xl sm:text-5xl font-bold tracking-tight mb-4">Tudo para o seu dia a dia</h2>
          <p class="text-white/50 max-w-lg mx-auto">Do orçamento à entrega, do financeiro à equipa. Uma plataforma que compreende o ritmo da sua produção.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div v-for="feat in features" :key="feat.title"
            class="group relative p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-violet-500/30 hover:bg-white/[0.05] transition-all duration-300">
            <div class="w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br" :class="feat.iconClass">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" v-html="feat.svg"></svg>
            </div>
            <h3 class="text-[15px] font-semibold text-white mb-2">{{ feat.title }}</h3>
            <p class="text-sm text-white/40 leading-relaxed">{{ feat.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ STATS ═══ -->
    <section class="py-20 relative">
      <div class="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-transparent to-indigo-500/5"></div>
      <div class="relative max-w-4xl mx-auto px-6 sm:px-10">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <div class="text-4xl sm:text-5xl font-bold bg-gradient-to-br from-violet-300 to-indigo-400 bg-clip-text text-transparent mb-2">{{ stat.value }}</div>
            <div class="text-xs font-medium text-white/40 uppercase tracking-wider">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ COMO FUNCIONA ═══ -->
    <section id="como-funciona" class="py-24 sm:py-32">
      <div class="max-w-4xl mx-auto px-6 sm:px-10">
        <div class="text-center mb-16">
          <p class="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3">Simples assim</p>
          <h2 class="text-3xl sm:text-5xl font-bold tracking-tight mb-4">Começa em 3 passos</h2>
          <p class="text-white/50 max-w-md mx-auto">Em 5 minutos sua conta está criada e funcionando.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div v-for="(step, i) in steps" :key="step.title" class="relative text-center">
            <div class="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20">
              <svg class="w-7 h-7 text-violet-400" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" v-html="step.svg"></svg>
              <span class="absolute -top-2 -right-2 w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center bg-violet-500 text-white">{{ i + 1 }}</span>
            </div>
            <h3 class="text-base font-semibold text-white mb-2">{{ step.title }}</h3>
            <p class="text-sm text-white/40 leading-relaxed">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ DEPOIMENTOS ═══ -->
    <section id="depoimentos" class="py-24 sm:py-32 relative">
      <div class="max-w-6xl mx-auto px-6 sm:px-10">
        <div class="text-center mb-16">
          <p class="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3">Depoimentos</p>
          <h2 class="text-3xl sm:text-5xl font-bold tracking-tight mb-4">Quem usa, recomenda</h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div v-for="review in reviews" :key="review.name"
            class="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/10 transition-all duration-300 flex flex-col gap-4">
            <div class="flex gap-1">
              <svg v-for="s in 5" :key="s" class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            </div>
            <p class="text-sm text-white/60 leading-relaxed flex-1">"{{ review.text }}"</p>
            <div class="flex items-center gap-3 pt-3 border-t border-white/5">
              <div class="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">{{ review.name[0] }}</div>
              <div>
                <p class="text-sm font-medium text-white/90">{{ review.name }}</p>
                <p class="text-xs text-white/40">{{ review.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ PLANOS ═══ -->
    <section id="precos" class="py-24 sm:py-32 relative">
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/5 to-transparent"></div>
      <div class="relative max-w-5xl mx-auto px-6 sm:px-10">
        <div class="text-center mb-16">
          <p class="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3">Planos</p>
          <h2 class="text-3xl sm:text-5xl font-bold tracking-tight mb-4">Investimento que se paga numa semana</h2>
          <p class="text-white/50 max-w-sm mx-auto">A partir de €97/mês. Cancele quando quiser.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
          <div v-for="plan in plans" :key="plan.name"
            class="relative rounded-2xl p-7 flex flex-col gap-5 transition-all duration-300"
            :class="plan.featured
              ? 'border-2 border-violet-500/50 bg-white/[0.05] shadow-2xl shadow-violet-500/10 sm:scale-[1.03]'
              : 'border border-white/[0.08] bg-white/[0.02] hover:border-white/15'">
            <div v-if="plan.featured"
              class="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-bold text-white bg-gradient-to-r from-violet-500 to-indigo-600 shadow-lg whitespace-nowrap">
              MAIS POPULAR
            </div>
            <div>
              <h3 class="text-lg font-bold text-white mb-1">{{ plan.name }}</h3>
              <p class="text-xs text-white/40">{{ plan.desc }}</p>
            </div>
            <div class="flex items-end gap-1">
              <span class="text-4xl font-bold text-white">{{ plan.price }}</span>
              <span v-if="plan.period" class="text-sm text-white/40 mb-1">{{ plan.period }}</span>
            </div>
            <ul class="flex flex-col gap-2.5 flex-1">
              <li v-for="item in plan.items" :key="item" class="flex items-start gap-2.5 text-sm text-white/60">
                <svg class="mt-0.5 shrink-0 w-4 h-4 text-violet-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                {{ item }}
              </li>
            </ul>
            <a :href="plan.url"
              :target="plan.url.startsWith('http') ? '_blank' : undefined"
              :rel="plan.url.startsWith('http') ? 'noopener noreferrer' : undefined"
              class="mt-2 w-full py-3.5 rounded-full text-sm font-semibold text-center transition-all duration-200 hover:scale-[1.02] block"
              :class="plan.featured
                ? 'bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/25'
                : 'border border-white/15 text-white/80 hover:bg-white/5 hover:border-white/25'">
              {{ plan.cta }}
            </a>
          </div>
        </div>
        <p class="text-center text-xs text-white/30 mt-8">✅ 7 dias grátis em todos os planos · Sem cartão de crédito · Cancele quando quiser</p>
      </div>
    </section>

    <!-- ═══ FAQ ═══ -->
    <section class="py-24 sm:py-32">
      <div class="max-w-2xl mx-auto px-6 sm:px-10">
        <div class="text-center mb-12">
          <p class="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3">Dúvidas</p>
          <h2 class="text-3xl sm:text-5xl font-bold tracking-tight">Perguntas frequentes</h2>
        </div>
        <div class="flex flex-col gap-3">
          <div v-for="(faq, i) in faqs" :key="i"
            class="rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden transition-all hover:border-white/15">
            <button class="w-full flex items-center justify-between gap-4 px-5 py-4 text-left" @click="toggleFaq(i)">
              <span class="text-sm font-medium text-white/90">{{ faq.q }}</span>
              <svg class="w-4 h-4 text-white/40 shrink-0 transition-transform duration-200" :class="faqOpen === i ? 'rotate-180' : ''" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
            </button>
            <div v-if="faqOpen === i" class="px-5 pb-4">
              <p class="text-sm text-white/50 leading-relaxed">{{ faq.a }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ CTA FINAL ═══ -->
    <section class="py-24 sm:py-32 relative overflow-hidden">
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]" style="background: radial-gradient(circle, #7c3aed, transparent 70%)"></div>
      </div>
      <div class="relative max-w-2xl mx-auto px-6 sm:px-10 text-center">
        <h2 class="text-3xl sm:text-5xl font-bold tracking-tight mb-6 leading-tight">
          Da arte à entrega.<br><span class="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Controle total.</span>
        </h2>
        <p class="text-white/50 text-lg mb-10 max-w-md mx-auto leading-relaxed">
          A sua empresa merece um sistema que organiza tudo sem dores de cabeça. Comece hoje, de graça.
        </p>
        <a href="/login"
          class="inline-flex items-center gap-2 text-lg font-semibold px-10 py-5 rounded-full bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 transition-all duration-200">
          Começar grátis
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
        </a>
        <p class="text-xs text-white/30 mt-5">Sem cartão de crédito. Pronto em 5 minutos.</p>
      </div>
    </section>

    <!-- ═══ FOOTER ═══ -->
    <footer class="border-t border-white/5 py-8">
      <div class="max-w-6xl mx-auto px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>
          </div>
          <span class="text-sm font-bold">Sign<span class="text-violet-400">PRO</span></span>
        </div>
        <p class="text-xs text-white/30">© 2025 SignPRO. Da arte à entrega, controle total.</p>
        <NuxtLink to="/login" class="text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors">Acessar plataforma</NuxtLink>
      </div>
    </footer>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

definePageMeta({ layout: false })

useHead({
  title: 'SignPRO — Sistema para Gráficas e Comunicação Visual em Portugal',
  meta: [
    { name: 'description', content: 'Sistema completo para gráficas e empresas de comunicação visual em Portugal. Orçamentos, OS, kanban de produção, financeiro e CRM num só lugar.' }
  ],
  script: [
    {
      innerHTML: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','2418191055286734');fbq('track','PageView');`,
      type: 'text/javascript',
    },
  ],
  noscript: [
    { innerHTML: '<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=2418191055286734&ev=PageView&noscript=1" />' },
  ],
})

const scrolled = ref(false)
const mobileOpen = ref(false)
const faqOpen = ref<number | null>(null)

function onScroll() { scrolled.value = window.scrollY > 30 }
function toggleFaq(i: number) { faqOpen.value = faqOpen.value === i ? null : i }

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

const navLinks = [
  { href: '#funcionalidades', label: 'Funcionalidades' },
  { href: '#como-funciona', label: 'Como funciona' },
  { href: '#depoimentos', label: 'Depoimentos' },
  { href: '#precos', label: 'Planos' },
]

const features = [
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z"/>', iconClass: 'from-violet-500/20 to-violet-600/20', title: 'Orçamentos inteligentes', desc: 'Crie orçamentos profissionais em segundos com cálculo automático de materiais e margem.' },
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/>', iconClass: 'from-indigo-500/20 to-indigo-600/20', title: 'Kanban de produção', desc: 'Acompanhe cada pedido por etapas visuais: arte, aprovação, produção, acabamento e entrega.' },
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"/>', iconClass: 'from-emerald-500/20 to-emerald-600/20', title: 'Dashboard financeiro', desc: 'Receita, despesas, lucro e fluxo de caixa — tudo visual em tempo real.' },
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/>', iconClass: 'from-blue-500/20 to-blue-600/20', title: 'Gestão de clientes', desc: 'Ficha completa com histórico de pedidos, valor gasto e contato via WhatsApp.' },
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"/>', iconClass: 'from-cyan-500/20 to-cyan-600/20', title: 'Ordens de serviço', desc: 'Gere OS com arte, materiais, prazo e valor. Envie por WhatsApp ao cliente.' },
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/>', iconClass: 'from-purple-500/20 to-purple-600/20', title: 'Catálogo de materiais', desc: 'Lonas, vinis, ACM e insumos com preço por m², estoque e alertas de reposição.' },
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75"/>', iconClass: 'from-orange-500/20 to-orange-600/20', title: 'Contas a pagar/receber', desc: 'Vencimentos, categorias, inadimplência e status de pagamento em um só lugar.' },
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/>', iconClass: 'from-pink-500/20 to-pink-600/20', title: 'Equipe e comissões', desc: 'Gerencie profissionais, calcule comissões e acompanhe produtividade.' },
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"/>', iconClass: 'from-fuchsia-500/20 to-fuchsia-600/20', title: 'Consultor IA', desc: 'IA que analisa seus dados e gera diagnósticos, oportunidades e planos de ação.' },
]

const stats = [
  { value: '200+', label: 'Empresas ativas' },
  { value: '98%', label: 'Satisfação' },
  { value: '10h', label: 'Economizadas por semana' },
  { value: '5 min', label: 'Para configurar' },
]

const steps = [
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>', title: 'Crie a sua conta', desc: 'Registe a sua empresa em menos de 5 minutos. Sem burocracia e sem cartão.' },
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>', title: 'Configure a sua operação', desc: 'Adicione materiais, equipa e configure as etapas de produção.' },
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/>', title: 'Comece a produzir', desc: 'Orçamentos, encomendas e financeiro organizados. Aceda a partir de qualquer lugar.' },
]

const reviews = [
  { name: 'António Ferreira', role: 'Gráfica Lusitana — Lisboa', text: 'Acabei com as folhas de Excel. Agora faço orçamentos em 2 minutos e o cliente recebe logo pelo WhatsApp.' },
  { name: 'Marta Oliveira', role: 'VisuArt — Porto', text: 'O kanban de produção mudou tudo. Sei exatamente o que está em cada fase e nunca mais atrasei uma entrega.' },
  { name: 'Pedro Santos', role: 'PrintMax — Braga', text: 'Tenho 4 operadores e o controlo ficou perfeito. Cada um sabe o que fazer sem eu precisar de andar atrás.' },
]

const plans = [
  { name: 'Starter', desc: 'Para quem está a começar', price: '€97', period: '/mês', featured: false, url: '/login', cta: 'Começar grátis', items: ['Até 2 utilizadores', 'Orçamentos ilimitados', 'OS e kanban', 'Financeiro básico', 'Suporte via WhatsApp'] },
  { name: 'Profissional', desc: 'O mais completo', price: '€197', period: '/mês', featured: true, url: '/login', cta: 'Começar grátis', items: ['Até 10 utilizadores', 'Tudo do Starter', 'Dashboard avançado', 'Consultor IA', 'Comissões e equipa', 'Relatórios PDF'] },
  { name: 'Enterprise', desc: 'Para grandes operações', price: 'Sob consulta', period: '', featured: false, url: 'https://wa.me/5511940527609', cta: 'Falar com consultor', items: ['Utilizadores ilimitados', 'Tudo do Profissional', 'API e integrações', 'Onboarding dedicado', 'SLA prioritário'] },
]

const faqs = [
  { q: 'Preciso de instalar alguma coisa?', a: 'Não. O SignPRO funciona 100% no navegador — telemóvel, tablet ou computador. Basta aceder e utilizar.' },
  { q: 'O teste gratuito é mesmo grátis?', a: 'Sim. 7 dias sem cartão de crédito. Se não gostar, não paga nada.' },
  { q: 'Posso usar no telemóvel?', a: 'Sim, o sistema é totalmente responsivo. Funciona perfeitamente no telemóvel como uma app nativa.' },
  { q: 'Os meus dados ficam seguros?', a: 'Utilizamos encriptação de ponta a ponta e servidores com redundância. Os seus dados são exclusivamente seus.' },
  { q: 'Consigo importar os meus clientes?', a: 'Sim. Pode importar clientes via ficheiro CSV ou registar manualmente de forma rápida.' },
  { q: 'Tem contrato de fidelização?', a: 'Não. Cancele quando quiser, sem multa. Sem letras pequenas.' },
]
</script>
