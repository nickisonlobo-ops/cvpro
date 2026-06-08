<template>
  <div class="min-h-screen font-sans antialiased overflow-x-hidden" style="background: #fff5f9; color: #2d1a2e">

    <!-- NAV -->
    <nav class="nav-bar" :class="{ 'nav-bar--scrolled': scrolled }">
      <div class="nav-inner">

        <!-- Logo -->
        <NuxtLink to="/" class="nav-logo">
          <div class="nav-logo__icon">
            <svg width="16" height="16" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
            </svg>
          </div>
          <span class="nav-logo__text">Glow Up Studio</span>
        </NuxtLink>

        <!-- Desktop links -->
        <div class="nav-links">
          <a v-for="link in navLinks" :key="link.href" :href="link.href" class="nav-link">{{ link.label }}</a>
        </div>

        <!-- Desktop actions -->
        <div class="nav-actions">
          
          <a href="https://wa.me/5511940527609" target="_blank" rel="noopener noreferrer" class="nav-btn-primary">Experimentar grátis</a>
        </div>

        <!-- Hamburger (mobile) -->
        <button class="nav-hamburger" @click="mobileOpen = !mobileOpen" aria-label="Menu">
          <span class="nav-hamburger__line" :class="{ 'nav-hamburger__line--top-open': mobileOpen }"></span>
          <span class="nav-hamburger__line" :class="{ 'nav-hamburger__line--mid-open': mobileOpen }"></span>
          <span class="nav-hamburger__line" :class="{ 'nav-hamburger__line--bot-open': mobileOpen }"></span>
        </button>

      </div>

      <!-- Mobile drawer -->
      <div v-if="mobileOpen" class="nav-mobile">
        <a v-for="link in navLinks" :key="link.href" :href="link.href" class="nav-mobile__link" @click="mobileOpen = false">{{ link.label }}</a>
        <div class="nav-mobile__actions">
          <a href="https://wa.me/5511940527609" target="_blank" rel="noopener noreferrer" class="nav-btn-ghost" @click="mobileOpen = false">Entrar</a>
          <a href="https://wa.me/5511940527609" target="_blank" rel="noopener noreferrer" class="nav-btn-primary" @click="mobileOpen = false">Experimentar grátis</a>
        </div>
      </div>
    </nav>

    <!-- HERO -->
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-16">
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div class="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-30 blur-[100px]" style="background: radial-gradient(circle, #fbcfe8, transparent 70%)"></div>
        <div class="absolute -bottom-40 -right-40 w-[700px] h-[700px] rounded-full opacity-25 blur-[120px]" style="background: radial-gradient(circle, #f5d0fe, transparent 70%)"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-20 blur-[80px]" style="background: radial-gradient(circle, #fce7f3, transparent 70%)"></div>
        <div class="absolute top-20 right-16 w-3.5 h-3.5 rounded-full bg-pink-300/40" style="animation: float 4s ease-in-out infinite"></div>
        <div class="absolute top-40 right-40 w-2 h-2 rounded-full bg-fuchsia-300/45" style="animation: float 5s ease-in-out infinite; animation-delay:.7s"></div>
        <div class="absolute top-60 left-20 w-2.5 h-2.5 rounded-full bg-rose-300/40" style="animation: float 4.5s ease-in-out infinite; animation-delay:1.3s"></div>
        <div class="absolute bottom-32 left-32 w-2 h-2 rounded-full bg-pink-400/35" style="animation: float 3.5s ease-in-out infinite; animation-delay:.4s"></div>
        <div class="absolute bottom-48 right-24 w-2.5 h-2.5 rounded-full bg-fuchsia-400/30" style="animation: float 4.2s ease-in-out infinite; animation-delay:1s"></div>
        <div class="absolute top-1/3 left-1/4 w-1.5 h-1.5 rounded-full bg-pink-300/30" style="animation: float 6s ease-in-out infinite; animation-delay:.2s"></div>
      </div>

      <div class="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 text-center">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-pink-100 border border-pink-200 mb-10 shadow-sm">
          <svg class="w-3.5 h-3.5 text-pink-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>
          <span class="text-xs font-bold text-pink-600 tracking-wider uppercase">Para mulheres que fazem acontecer</span>
        </div>

        <!-- Headline -->
        <h1 class="font-black tracking-tight mb-6" style="line-height: 1.04;">
          <span class="block" style="font-size: clamp(2.4rem, 6vw, 4.8rem); background: linear-gradient(135deg, #be185d, #7e22ce); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Organize sua agenda,</span>
          <span class="block" style="font-size: clamp(2.4rem, 6vw, 4.8rem); background: linear-gradient(135deg, #be185d, #7e22ce); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">controle seu estúdio</span>
          <span class="block mt-2" style="font-size: clamp(2.2rem, 5.5vw, 4.4rem); background: linear-gradient(135deg, #f472b6, #c026d3, #f43f5e); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">e pare de trabalhar</span>
          <span class="block" style="font-size: clamp(2.2rem, 5.5vw, 4.4rem); background: linear-gradient(135deg, #f472b6, #c026d3, #f43f5e); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">no caos.</span>
        </h1>

        <!-- Subheadline -->
        <p class="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style="color: rgba(120,40,60,0.6)">
          A plataforma completa para <strong class="text-pink-500 font-semibold">lash designers</strong>, <strong class="text-fuchsia-600 font-semibold">nail designers</strong> e <strong class="text-pink-500 font-semibold">studios de beleza</strong> que querem mais clientes, menos faltas e total controle — da agenda ao financeiro, tudo em um só lugar.
        </p>

        <!-- CTAs -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <a href="https://wa.me/5511940527609" target="_blank" rel="noopener noreferrer"
            class="inline-flex items-center text-base font-black px-10 py-4 rounded-full text-white transition-all duration-200 hover:scale-105"
            style="background: linear-gradient(135deg, #f472b6, #c026d3); box-shadow: 0 8px 28px rgba(236,72,153,0.4);">
            Entrar em contato
          </a>
          <a href="#funcionalidades"
            class="inline-flex items-center gap-2 text-base font-semibold px-8 py-4 rounded-full border-2 border-pink-200 text-pink-500 bg-white hover:bg-pink-50 hover:border-pink-300 transition-all duration-200 shadow-sm">
            Ver como funciona
          </a>
        </div>

        <!-- Social proof -->
        <div class="flex flex-wrap items-center justify-center gap-5 text-sm" style="color: rgba(120,40,60,0.5)">
          <div class="flex items-center gap-2">
            <div class="flex -space-x-2">
              <div v-for="(c, i) in avatarColors" :key="i"
                class="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-black text-white"
                :style="{ background: c }">{{ avatarInitials[i] }}</div>
            </div>
            <span class="font-semibold">+500 estúdios ativos</span>
          </div>
          <span class="text-pink-200 hidden sm:inline">|</span>
          <div class="flex items-center gap-1.5">
            <svg v-for="s in 5" :key="s" class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            <span class="font-semibold" style="color: rgba(120,40,60,0.7)">4.9 de satisfação</span>
          </div>
          <span class="text-pink-200 hidden sm:inline">|</span>
          <div class="flex items-center gap-1.5">
            <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span>Sem cartão de crédito</span>
          </div>
        </div>
      </div>
    </section>

    <!-- PARA QUEM -->
    <section class="py-16 sm:py-24 relative" style="background: linear-gradient(180deg, #fff5f9 0%, #fdf2fb 100%)">
      <div class="max-w-5xl mx-auto px-5 sm:px-10">
        <div class="text-center mb-12">
          <p class="section-label">Para quem e</p>
          <h2 class="text-4xl sm:text-5xl font-black mb-3" style="background: linear-gradient(135deg, #ec4899, #c026d3); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Feito para o seu negócio de beleza</h2>
          <p class="text-rose-900/50 max-w-md mx-auto mt-2">Não importa a especialidade, se você cuida de mulheres, essa plataforma é para você.</p>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div v-for="tipo in tiposNegocio" :key="tipo.label"
            class="group flex flex-col items-center text-center gap-3 px-4 py-8 rounded-2xl border border-pink-100 bg-white hover:border-pink-300 hover:shadow-xl hover:shadow-pink-100/60 hover:-translate-y-1 transition-all duration-300 cursor-default">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-pink-200/60 transition-all duration-300" :style="{ background: tipo.bg }">
              <svg class="w-6 h-6" :style="{ color: tipo.color }" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" v-html="tipo.svg"></svg>
            </div>
            <span class="text-sm font-bold leading-tight" style="color: #be185d">{{ tipo.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- FUNCIONALIDADES -->
    <section id="funcionalidades" class="py-16 sm:py-24 relative" style="background: linear-gradient(180deg, #fdf2fb 0%, #fce7f3 100%)">
      <div class="max-w-6xl mx-auto px-5 sm:px-10">
        <div class="text-center mb-12">
          <p class="section-label">Funcionalidades</p>
          <h2 class="text-4xl sm:text-5xl font-black mb-3" style="background: linear-gradient(135deg, #ec4899, #c026d3); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Tudo para o seu dia a dia</h2>
          <p class="text-rose-900/50 max-w-lg mx-auto">Da agenda ao caixa, do estoque a equipe. Uma plataforma que entende o ritmo do seu studio.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div v-for="feat in features" :key="feat.title"
            class="group relative p-6 rounded-3xl bg-white border border-pink-100 hover:border-pink-200 hover:shadow-xl hover:shadow-pink-100/50 transition-all duration-300 overflow-hidden">
            <div class="absolute inset-x-0 top-0 h-[2px] rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style="background: linear-gradient(90deg, #f472b6, #e879f9, #c084fc)"></div>
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 group-hover:shadow-pink-200/80 transition-all duration-300" :style="{ background: feat.bg }">
              <svg class="w-5 h-5" :style="{ color: feat.color }" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" v-html="feat.svg"></svg>
            </div>
            <h3 class="text-base font-bold mb-2" style="color: #7e22ce">{{ feat.title }}</h3>
            <p class="text-sm text-rose-900/55 leading-relaxed">{{ feat.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- STATS -->
    <section class="py-14 sm:py-20" style="background: linear-gradient(135deg, #fdf4ff, #fce7f3)">
      <div class="max-w-4xl mx-auto px-5 sm:px-10">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div v-for="stat in stats" :key="stat.label" class="text-center bg-white/80 backdrop-blur-sm rounded-2xl py-8 px-4 border border-pink-100 shadow-sm hover:shadow-md hover:shadow-pink-100/80 transition-all duration-200 group">
            <div class="text-4xl sm:text-5xl font-black mb-2 group-hover:scale-105 transition-transform duration-200" style="background: linear-gradient(135deg, #ec4899, #c026d3); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text">{{ stat.value }}</div>
            <div class="text-xs font-semibold text-rose-900/50 uppercase tracking-wider leading-snug">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- MOBILE SHOWCASE -->
    <section class="py-20 sm:py-28 relative overflow-hidden" style="background: linear-gradient(180deg, #fce7f3 0%, #fdf4ff 100%)">
      <div class="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full opacity-20 blur-[100px] pointer-events-none" style="background: radial-gradient(circle, #f9a8d4, transparent)"></div>
      <div class="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full opacity-20 blur-[100px] pointer-events-none" style="background: radial-gradient(circle, #e879f9, transparent)"></div>

      <div class="relative max-w-6xl mx-auto px-6 sm:px-10">
        <div class="text-center mb-16">
          <p class="section-label">Acesso em qualquer lugar</p>
          <h2 class="text-4xl sm:text-5xl font-black mb-3" style="background: linear-gradient(135deg, #ec4899, #c026d3); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Na palma da sua mão</h2>
          <p class="text-rose-900/50 max-w-lg mx-auto">Gerencie seu studio de onde estiver. Celular, tablet ou computador — tudo sincronizado em tempo real.</p>
        </div>

        <div class="flex flex-col items-center gap-16">

          <!-- Phone mockup -->
          <div class="relative flex-shrink-0">
            <!-- Phone frame -->
            <div class="relative" style="width:260px; height:540px; border-radius:44px; border:7px solid #1a0a1e; background:#f3f4f6; box-shadow: 0 32px 64px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.08) inset;">
              <!-- Screen -->
              <div class="absolute flex flex-col" style="inset:0; border-radius:38px; overflow:hidden; background:#f3f4f6;">

                <!-- App header — espelho do sistema real -->
                <div class="relative flex-shrink-0" style="background:linear-gradient(135deg,#ec4899,#c026d3); padding:12px 12px 12px 12px; min-height:110px;">
                  <!-- Dynamic island dentro da tela -->
                  <div style="display:flex; justify-content:center; margin-bottom:10px;">
                    <div style="width:72px; height:18px; border-radius:999px; background:#1a0a1e;"></div>
                  </div>
                  <!-- radial highlight igual ao sistema -->
                  <div class="absolute" style="inset:0; border-radius:inherit; background:radial-gradient(ellipse at top right, rgba(255,255,255,0.18), transparent 65%);"></div>
                  <!-- Logo badge -->
                  <div class="absolute" style="top:10px; right:10px; width:26px; height:26px; border-radius:8px; background:rgba(255,255,255,0.15); backdrop-filter:blur(4px); border:1px solid rgba(255,255,255,0.2); display:flex; align-items:center; justify-content:center;">
                    <svg style="width:13px;height:13px;color:white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>
                  </div>
                  <div class="relative">
                    <p style="font-size:7px; font-weight:700; color:rgba(255,210,240,0.8); letter-spacing:0.1em; text-transform:uppercase; margin:0 0 2px;">Glow Up Studio</p>
                    <p style="font-size:13px; font-weight:900; color:white; margin:0; line-height:1.1;">Olá, Ana! 👋</p>
                    <p style="font-size:7px; color:rgba(255,220,245,0.7); margin:3px 0 0;">Domingo, 20 de abril de 2026</p>
                  </div>
                  <!-- Stats row — igual ao sistema -->
                  <div style="display:flex; gap:5px; margin-top:10px; position:relative;">
                    <div style="flex:1; background:rgba(255,255,255,0.13); backdrop-filter:blur(4px); border:1px solid rgba(255,255,255,0.12); border-radius:10px; padding:6px 5px; text-align:center;">
                      <p style="font-size:7px; font-weight:700; color:rgba(255,200,235,0.9); letter-spacing:0.05em; margin:0; text-transform:uppercase;">Agenda</p>
                      <p style="font-size:14px; font-weight:900; color:white; margin:1px 0 0; line-height:1;">8</p>
                    </div>
                    <div style="flex:1; background:rgba(255,255,255,0.13); backdrop-filter:blur(4px); border:1px solid rgba(255,255,255,0.12); border-radius:10px; padding:6px 5px; text-align:center;">
                      <p style="font-size:7px; font-weight:700; color:rgba(255,200,235,0.9); letter-spacing:0.05em; margin:0; text-transform:uppercase;">Receita</p>
                      <p style="font-size:11px; font-weight:900; color:white; margin:1px 0 0; line-height:1;">R$940</p>
                    </div>
                    <div style="flex:1; background:rgba(255,255,255,0.13); backdrop-filter:blur(4px); border:1px solid rgba(255,255,255,0.12); border-radius:10px; padding:6px 5px; text-align:center;">
                      <p style="font-size:7px; font-weight:700; color:rgba(255,200,235,0.9); letter-spacing:0.05em; margin:0; text-transform:uppercase;">Livres</p>
                      <p style="font-size:14px; font-weight:900; color:white; margin:1px 0 0; line-height:1;">2</p>
                    </div>
                  </div>
                </div>

                <!-- Body -->
                <div style="flex:1; overflow:hidden; padding:10px 8px 8px; display:flex; flex-direction:column; gap:7px;">
                  <!-- Section label -->
                  <p style="font-size:7px; font-weight:800; text-transform:uppercase; letter-spacing:0.1em; color:rgba(80,30,60,0.4); margin:0;">Próximos atendimentos</p>

                  <!-- Appointment cards — espelho do sistema real -->
                  <div v-for="appt in mockAppts" :key="appt.name" style="background:white; border-radius:12px; overflow:hidden; box-shadow:0 1px 4px rgba(0,0,0,0.06); border:1px solid rgba(240,220,235,0.8);">
                    <!-- Barra colorida no topo igual ao sistema -->
                    <div style="height:3px;" :style="{ background: appt.accent }"></div>
                    <div style="display:flex; align-items:center; gap:7px; padding:7px 9px;">
                      <!-- Avatar -->
                      <div style="width:26px; height:26px; border-radius:8px; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:9px; font-weight:900; color:white;" :style="{ background: appt.color }">{{ appt.init }}</div>
                      <div style="flex:1; min-width:0;">
                        <p style="font-size:9px; font-weight:800; color:#3b0764; margin:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">{{ appt.name }}</p>
                        <p style="font-size:7px; color:rgba(100,40,80,0.5); margin:1px 0 0;">{{ appt.service }}</p>
                      </div>
                      <!-- Time badge -->
                      <div style="flex-shrink:0; padding:3px 6px; border-radius:6px; font-size:8px; font-weight:700;" :style="{ background: appt.timeBg, color: appt.timeColor }">{{ appt.time }}</div>
                    </div>
                  </div>

                  <!-- Motivational banner — igual ao sistema -->
                  <div style="margin-top:2px; border-radius:10px; padding:7px 9px; background:linear-gradient(90deg,#fdf2f8,#faf0ff); border:1px solid #f5d0fe; display:flex; align-items:center; gap:7px;">
                    <div style="width:20px; height:20px; border-radius:6px; background:#ec4899; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                      <svg style="width:11px;height:11px;color:white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>
                    </div>
                    <p style="font-size:7px; font-weight:600; color:#6b21a8; margin:0; line-height:1.4;">Foco! Você tem 6 atendimentos pela frente hoje. 💪</p>
                  </div>
                </div>

                <!-- Bottom nav — igual ao sistema (sidebar mobile) -->
                <div style="flex-shrink:0; border-top:1px solid #f3e8ff; background:white; padding:6px 0; display:flex; align-items:center; justify-content:space-around;">
                  <div style="display:flex; flex-direction:column; align-items:center; gap:2px;">
                    <svg style="width:14px;height:14px;color:#ec4899;" fill="currentColor" viewBox="0 0 24 24"><path d="M11.47 3.841a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.061l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 101.061 1.06l8.69-8.689z"/><path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z"/></svg>
                    <span style="font-size:6px; font-weight:700; color:#ec4899;">Início</span>
                  </div>
                  <div style="display:flex; flex-direction:column; align-items:center; gap:2px; opacity:0.35;">
                    <svg style="width:14px;height:14px;color:#6b7280;" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/></svg>
                    <span style="font-size:6px; font-weight:600; color:#9ca3af;">Agenda</span>
                  </div>
                  <div style="display:flex; flex-direction:column; align-items:center; gap:2px; opacity:0.35;">
                    <svg style="width:14px;height:14px;color:#6b7280;" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>
                    <span style="font-size:6px; font-weight:600; color:#9ca3af;">Clientes</span>
                  </div>
                  <div style="display:flex; flex-direction:column; align-items:center; gap:2px; opacity:0.35;">
                    <svg style="width:14px;height:14px;color:#6b7280;" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75"/></svg>
                    <span style="font-size:6px; font-weight:600; color:#9ca3af;">Caixa</span>
                  </div>
                </div>
              </div>
              <!-- Side buttons -->
              <div class="absolute" style="right:-5px; top:96px; width:4px; height:56px; border-radius:999px; background:#1a0a1e;"></div>
              <div class="absolute" style="left:-5px; top:82px; width:4px; height:38px; border-radius:999px; background:#1a0a1e;"></div>
              <div class="absolute" style="left:-5px; top:130px; width:4px; height:38px; border-radius:999px; background:#1a0a1e;"></div>
            </div>
            <!-- Glow -->
            <div class="absolute -z-10" style="inset:-24px; border-radius:999px; filter:blur(50px); opacity:0.5; background:radial-gradient(circle, #f9a8d4, #e879f9);"></div>
          </div>

          <!-- Bottom features row -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl" style="margin-top: 2.5rem;">
            <div v-for="f in mobileFeatures" :key="f.title" class="group flex items-start gap-4 bg-white rounded-2xl p-5 border border-pink-100 hover:border-pink-200 hover:shadow-lg hover:shadow-pink-100/50 transition-all duration-300">
              <div class="w-11 h-11 shrink-0 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200" :style="{ background: f.bg }">
                <svg class="w-5 h-5" :style="{ color: f.color }" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" v-html="f.svg"></svg>
              </div>
              <div>
                <p class="text-sm font-black mb-0.5" style="color: #be185d">{{ f.title }}</p>
                <p class="text-xs text-rose-900/50 leading-snug">{{ f.desc }}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- COMO FUNCIONA -->
    <section id="como-funciona" class="py-16 sm:py-24" style="background: #fff5f9">
      <div class="max-w-4xl mx-auto px-5 sm:px-10">
        <div class="text-center mb-14">
          <p class="section-label">Simples assim</p>
          <h2 class="text-4xl sm:text-5xl font-black mb-3" style="background: linear-gradient(135deg, #ec4899, #c026d3); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Comeca em 3 passos</h2>
          <p class="text-rose-900/50 max-w-md mx-auto">Sem complicação. Em 5 minutos sua conta está criada e funcionando.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
          <div class="hidden sm:block absolute top-10 left-[18%] right-[18%] h-px" style="background: linear-gradient(to right, #f9a8d4, #e879f9, #f9a8d4)"></div>
          <div v-for="(step, i) in steps" :key="step.title" class="flex flex-col items-center text-center gap-4">
            <div class="relative w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl z-10 border-2 border-white" :style="{ background: step.bg }">
              <svg class="w-8 h-8" :style="{ color: step.color }" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" v-html="step.svg"></svg>
              <span class="absolute -top-2 -right-2 w-7 h-7 rounded-full text-xs font-black flex items-center justify-center text-white shadow-md" style="background: linear-gradient(135deg, #f472b6, #c026d3)">{{ i + 1 }}</span>
            </div>
            <h3 class="text-base font-black" style="color: #7e22ce">{{ step.title }}</h3>
            <p class="text-sm text-rose-900/55 leading-relaxed">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- DEPOIMENTOS -->
    <section id="depoimentos" class="py-16 sm:py-24 relative overflow-hidden" style="background: linear-gradient(135deg, #fdf4ff 0%, #fce7f3 50%, #fdf2f8 100%)">
      <div class="absolute top-8 left-8 opacity-10 pointer-events-none select-none"><svg width="64" height="64" fill="none" stroke="#f472b6" stroke-width="1.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg></div>
      <div class="absolute bottom-8 right-8 opacity-10 pointer-events-none select-none"><svg width="64" height="64" fill="none" stroke="#e879f9" stroke-width="1.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg></div>
      <div class="relative max-w-6xl mx-auto px-5 sm:px-10">
        <div class="text-center mb-12">
          <p class="section-label">Depoimentos</p>
          <h2 class="text-4xl sm:text-5xl font-black mb-3" style="background: linear-gradient(135deg, #ec4899, #c026d3); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Elas ja transformaram seus studios</h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div v-for="review in reviews" :key="review.name"
            class="relative p-6 rounded-3xl bg-white border border-pink-100 shadow-sm hover:shadow-lg hover:shadow-pink-100 hover:border-pink-200 transition-all duration-300 flex flex-col gap-4 overflow-hidden">
            <span class="absolute top-3 right-5 leading-none text-pink-100 pointer-events-none select-none" style="font-size: 5rem; font-family: Georgia, serif; line-height: 1">“</span>
            <div class="flex gap-1">
              <svg v-for="s in 5" :key="s" class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            </div>
            <p class="text-sm text-rose-900/65 leading-relaxed flex-1 italic">"{{ review.text }}"</p>
            <div class="flex items-center gap-3 pt-3 border-t border-pink-50">
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white shadow-md shrink-0" :style="{ background: review.avatarBg }">{{ review.name[0] }}</div>
              <div>
                <p class="text-sm font-black" style="color: #7e22ce">{{ review.name }}</p>
                <p class="text-xs text-rose-900/40">{{ review.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PLANOS -->
    <section id="precos" class="py-16 sm:py-24" style="background: #fff5f9">
      <div class="max-w-5xl mx-auto px-5 sm:px-10">
        <div class="text-center mb-12">
          <p class="section-label">Planos</p>
          <h2 class="text-4xl sm:text-5xl font-black mb-3" style="background: linear-gradient(135deg, #ec4899, #c026d3); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Investimento que cabe no seu orçamento</h2>
          <p class="text-rose-900/50 max-w-sm mx-auto">Planos a partir de R$47/mês. Cancele quando quiser.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
          <div v-for="plan in plans" :key="plan.name"
            class="relative rounded-3xl p-7 flex flex-col gap-5 transition-all duration-300"
            :class="plan.featured ? 'border-2 border-pink-300 shadow-2xl shadow-pink-200/60 sm:scale-[1.04]' : 'border border-pink-100 bg-white hover:shadow-lg hover:shadow-pink-100 hover:border-pink-200'"
            :style="plan.featured ? 'background: linear-gradient(135deg, #fdf4ff, #fce7f3)' : ''">
            <div v-if="plan.featured"
              class="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-[11px] font-black text-white shadow-lg whitespace-nowrap"
              style="background: linear-gradient(135deg, #f472b6, #c026d3)">
              MAIS POPULAR
            </div>
            <div>
              <h3 class="text-xl font-black mb-1" style="color: #7e22ce">{{ plan.name }}</h3>
              <p class="text-xs text-rose-900/40">{{ plan.desc }}</p>
            </div>
            <div class="flex items-end gap-1">
              <span class="text-5xl font-black" style="color: #be185d">{{ plan.price }}</span>
              <span v-if="plan.period" class="text-sm text-rose-900/40 mb-1.5">{{ plan.period }}</span>
            </div>
            <ul class="flex flex-col gap-3 flex-1">
              <li v-for="item in plan.items" :key="item" class="flex items-start gap-2.5 text-sm text-rose-900/65">
                <svg class="mt-0.5 shrink-0 w-4 h-4 text-pink-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                {{ item }}
              </li>
            </ul>
            <a :href="plan.url" target="_blank" rel="noopener noreferrer"
              class="mt-2 w-full py-3.5 rounded-full text-sm font-black text-center transition-all duration-200 hover:scale-[1.02] block"
              :class="plan.featured ? 'text-white shadow-lg hover:shadow-pink-300/60' : 'border-2 border-pink-200 text-pink-500 hover:border-pink-400 hover:bg-pink-50'"
              :style="plan.featured ? 'background: linear-gradient(135deg, #f472b6, #c026d3)' : ''">
              {{ plan.cta }}
            </a>
          </div>
        </div>
        <p class="text-center text-xs text-rose-900/35 mt-8">✅ 7 dias grátis em todos os planos · Sem cartão de crédito · Sem fidelidade · Cancele quando quiser</p>
      </div>
    </section>

    <!-- FAQ -->
    <section class="py-16 sm:py-24" style="background: linear-gradient(180deg, #fdf4ff, #fff5f9)">
      <div class="max-w-2xl mx-auto px-5 sm:px-10">
        <div class="text-center mb-10">
          <p class="section-label">Dúvidas</p>
          <h2 class="text-4xl sm:text-5xl font-black" style="background: linear-gradient(135deg, #ec4899, #c026d3); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Perguntas frequentes</h2>
        </div>
        <div class="flex flex-col gap-3">
          <div v-for="(faq, i) in faqs" :key="i"
            class="rounded-2xl border border-pink-100 bg-white overflow-hidden shadow-sm transition-shadow hover:shadow-md">
            <button class="w-full flex items-center justify-between gap-4 px-6 py-4 text-left" @click="toggleFaq(i)">
              <span class="text-sm font-bold" style="color: #7e22ce">{{ faq.q }}</span>
              <svg class="w-4 h-4 text-pink-400 shrink-0 transition-transform duration-200" :class="faqOpen === i ? 'rotate-180' : ''" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            <div v-if="faqOpen === i" class="px-6 pb-5">
              <p class="text-sm text-rose-900/55 leading-relaxed">{{ faq.a }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA FINAL -->
    <section class="py-20 sm:py-28 relative overflow-hidden" style="background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fdf4ff 100%)">
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div class="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-30 blur-[80px]" style="background: radial-gradient(circle, #f9a8d4, transparent)"></div>
        <div class="absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-30 blur-[80px]" style="background: radial-gradient(circle, #e879f9, transparent)"></div>
      </div>
      <div class="relative max-w-2xl mx-auto px-5 sm:px-10 text-center">
        <div class="w-16 h-16 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl shadow-pink-200 border-2 border-pink-100" style="background: linear-gradient(135deg, #fce7f3, #fdf4ff)">
          <svg class="w-7 h-7 text-pink-400" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg>
        </div>
        <h2 class="text-3xl sm:text-5xl font-black mb-5 leading-tight" style="background: linear-gradient(135deg, #ec4899, #c026d3); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
          Sua cliente merece uma experiência incrível
        </h2>
        <p class="text-rose-900/55 text-lg mb-10 max-w-md mx-auto leading-relaxed">
          E voce merece um sistema que organiza tudo sem dor de cabeca. Comece hoje, de graça.
        </p>
        <a href="https://wa.me/5511940527609" target="_blank" rel="noopener noreferrer"
          class="inline-flex items-center gap-3 text-lg font-black px-12 py-5 rounded-full text-white shadow-2xl shadow-pink-300/50 transition-all duration-200 hover:scale-105 hover:shadow-pink-400/60"
          style="background: linear-gradient(135deg, #f472b6, #c026d3)">
          Começar agora, de graça
        </a>
        <p class="text-xs text-rose-900/35 mt-5">Sem cartão de crédito. Pronto em 5 minutos. Suporte via WhatsApp.</p>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="border-t border-pink-100 py-8 bg-white">
      <div class="max-w-6xl mx-auto px-5 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg flex items-center justify-center" style="background: linear-gradient(135deg, #f472b6, #c026d3)">
            <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
            </svg>
          </div>
          <span class="text-sm font-black" style="background: linear-gradient(135deg, #ec4899, #c026d3); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text">Glow Up Studio</span>
        </div>
        <p class="text-xs text-rose-900/35 text-center">2026 Glow Up Studio. Feito com amor para empreendedoras da beleza.</p>
        <a href="https://wa.me/5511940527609" target="_blank" rel="noopener noreferrer" class="text-xs font-semibold text-pink-400 hover:text-pink-600 transition-colors">Acessar plataforma</a>
      </div>
    </footer>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

definePageMeta({ layout: false })

useHead({
  script: [
    {
      innerHTML: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','2418191055286734');fbq('track','PageView');`,
      type: 'text/javascript',
    },
  ],
  noscript: [
    {
      innerHTML: '<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=2418191055286734&ev=PageView&noscript=1" />',
    },
  ],
})

const scrolled = ref(false)
const mobileOpen = ref(false)
function onScroll() { scrolled.value = window.scrollY > 30 }
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

const faqOpen = ref<number | null>(null)
function toggleFaq(i: number) { faqOpen.value = faqOpen.value === i ? null : i }

const navLinks = [
  { href: '#funcionalidades', label: 'Funcionalidades' },
  { href: '#como-funciona',   label: 'Como funciona' },
  { href: '#depoimentos',     label: 'Depoimentos' },
  { href: '#precos',          label: 'Planos' },
]

const avatarColors   = ['linear-gradient(135deg,#f472b6,#c026d3)', 'linear-gradient(135deg,#e879f9,#a21caf)', 'linear-gradient(135deg,#fb7185,#f43f5e)', 'linear-gradient(135deg,#f472b6,#e879f9)']
const avatarInitials = ['C', 'F', 'B', 'J']

const mockAppts = [
  { init: 'A', name: 'Ana Lima',   service: 'Lash Classic',  time: '14h00', color: 'linear-gradient(135deg,#f472b6,#c026d3)', accent: 'linear-gradient(90deg,#f472b6,#c026d3)', timeBg: '#fce7f3', timeColor: '#be185d' },
  { init: 'C', name: 'Carol S.',   service: 'Manicure',      time: '14h45', color: 'linear-gradient(135deg,#e879f9,#a21caf)', accent: 'linear-gradient(90deg,#e879f9,#a21caf)', timeBg: '#fdf4ff', timeColor: '#7e22ce' },
  { init: 'B', name: 'Beatriz M.', service: 'Sobrancelha',   time: '15h30', color: 'linear-gradient(135deg,#fb7185,#f43f5e)', accent: 'linear-gradient(90deg,#fb7185,#f43f5e)', timeBg: '#fff1f2', timeColor: '#be123c' },
]

const mobileFeatures = [
  { title: 'Agenda em tempo real',  desc: 'Visualize e gerencie todos os horários na palma da mão, sem precisar ligar.',         bg: 'linear-gradient(135deg,#fce7f3,#fdf4ff)', color: '#ec4899', svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/>' },
  { title: 'Caixa no celular',      desc: 'Acompanhe entradas, saídas e saldo do dia diretamente no app sem abrir o computador.', bg: 'linear-gradient(135deg,#fdf4ff,#ede9fe)',   color: '#a855f7', svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75"/>' },
  { title: 'Clientes sempre à mão', desc: 'Histórico completo de cada cliente, serviços anteriores e preferências registradas.',  bg: 'linear-gradient(135deg,#fce7f3,#fee2e2)',   color: '#f43f5e', svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>' },
]

const tiposNegocio = [
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.5 3a.5.5 0 01.5.5v1a.5.5 0 01-1 0v-1a.5.5 0 01.5-.5zm4 2a.5.5 0 01.5.5v1a.5.5 0 01-1 0v-.5h-.5a.5.5 0 010-1H13a.5.5 0 01.5.5zM3 8a1 1 0 011-1h16a1 1 0 011 1v10a2 2 0 01-2 2H4a2 2 0 01-2-2V8zm2 0v10h14V8H5zm3 3a1 1 0 100 2 1 1 0 000-2zm4 0a1 1 0 100 2 1 1 0 000-2zm4 0a1 1 0 100 2 1 1 0 000-2z"/>', label: 'Nails Designer',      bg: 'linear-gradient(135deg,#fce7f3,#fdf4ff)', color: '#ec4899' },
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>',       label: 'Lash Designer',       bg: 'linear-gradient(135deg,#ede9fe,#fdf4ff)', color: '#a855f7' },
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M7.848 8.25l1.536.887M7.848 8.25a3 3 0 11-5.196-3 3 3 0 015.196 3zm1.536.887a2.165 2.165 0 011.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 8.25a3 3 0 00-2.548 1.45M9.384 9.137l2.077 1.199m0 0l1.568.908m-3.645-2.107a3 3 0 00-.871 2.823m3.645 2.107a2.165 2.165 0 001.083 1.839M16.5 6.75a3 3 0 11-6 0 3 3 0 016 0zM12 9.75v6.75m0 0l-3-3m3 3l3-3"/>',     label: 'Salao de Beleza',     bg: 'linear-gradient(135deg,#fce7f3,#fee2e2)', color: '#f43f5e' },
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 9.75h.008v.008H9V9.75zm6 0h.008v.008H15V9.75z"/>',  label: 'Studio Sobrancelha',  bg: 'linear-gradient(135deg,#fff7ed,#fce7f3)', color: '#fb923c' },
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>', label: 'Estética e Massagem', bg: 'linear-gradient(135deg,#f0fdf4,#fdf4ff)', color: '#10b981' },

]

const features = [
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"/>',        color: '#ec4899', title: 'Agendamentos',        bg: 'linear-gradient(135deg,#fce7f3,#fdf4ff)', desc: 'Organize todos os horários da equipe. Evite conflitos e nunca perca um atendimento.' },
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/>',            color: '#a855f7', title: 'Clientes',            bg: 'linear-gradient(135deg,#ede9fe,#fdf4ff)', desc: 'Histórico completo de cada cliente: preferências, últimas visitas e contatos.' },
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>',          color: '#10b981', title: 'Atividades',          bg: 'linear-gradient(135deg,#fce7f3,#fee2e2)', desc: 'Distribua tarefas por profissional, defina prioridades e acompanhe em tempo real.' },
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"/>',           color: '#f59e0b', title: 'Financeiro',          bg: 'linear-gradient(135deg,#f0fdf4,#fce7f3)', desc: 'Controle contas a pagar, categorize despesas e visualize o fluxo de caixa.' },
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>',  color: '#f97316', title: 'Produtos e Estoque', bg: 'linear-gradient(135deg,#fff7ed,#fce7f3)', desc: 'Cadastre produtos com preço e controle de estoque. Saiba o que repor na hora.' },
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/>',           color: '#8b5cf6', title: 'Equipe',             bg: 'linear-gradient(135deg,#ede9fe,#fce7f3)', desc: 'Gerencie cargos, salários e acesso de cada profissional da equipe.' },
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"/>',     color: '#c026d3', title: 'Personalização',     bg: 'linear-gradient(135deg,#fdf4ff,#ede9fe)', desc: 'Cores, logo e nome do seu estúdio. A plataforma com a identidade do seu negócio.' },
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>',    color: '#10b981', title: 'Seguranca Total',    bg: 'linear-gradient(135deg,#f0fdf4,#fdf4ff)', desc: 'Dados isolados por empresa. Cada studio ve apenas o que e seu.' },
]

const stats = [
  { value: '500+',  label: 'Studios ativos' },
  { value: '98%',   label: 'Satisfacao' },
  { value: '8h',    label: 'Economizadas por semana' },
  { value: '5 min', label: 'Para configurar' },
]

const steps = [
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>',  color: '#ec4899', title: 'Crie sua conta',       bg: 'linear-gradient(135deg,#fce7f3,#fdf4ff)', desc: 'Cadastre seu estúdio em menos de 5 minutos. Sem burocracia e sem cartão de crédito.' },
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>',  color: '#a855f7', title: 'Configure seu studio', bg: 'linear-gradient(135deg,#ede9fe,#fdf4ff)', desc: 'Adicione serviços, equipe e personalize as cores com o visual do seu negócio.' },
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/>',  color: '#f59e0b', title: 'Comece a usar',         bg: 'linear-gradient(135deg,#fce7f3,#fff7ed)', desc: 'Agenda, clientes e financas organizados. Acesse do celular ou computador a qualquer hora.' },
]

const reviews = [
  { name: 'Camila Rocha',   role: 'Lash Designer - São Paulo',     avatarBg: 'linear-gradient(135deg,#f472b6,#c026d3)', text: 'Acabei com o caderninho de vez! Agenda organizada, sem conflito de horários e o caixa do mês na palma da mão.' },
  { name: 'Fernanda Lima',  role: 'Nail Designer - Rio de Janeiro', avatarBg: 'linear-gradient(135deg,#e879f9,#a21caf)', text: 'O controle de estoque foi o que me conquistou. Sei exatamente o que comprar e nunca fico sem insumo.' },
  { name: 'Beatriz Santos', role: 'Salao - Belo Horizonte',         avatarBg: 'linear-gradient(135deg,#fb7185,#f43f5e)', text: 'Tenho 6 funcionarias e a gestao de atividades resolveu tudo. Acompanho tudo pelo celular.' },
  { name: 'Juliana Melo',   role: 'Studio Sobrancelha - Curitiba',  avatarBg: 'linear-gradient(135deg,#f472b6,#e879f9)', text: 'A personalizacao me encantou. A plataforma ficou com as cores do meu studio. Parece feita so pra mim!' },
  { name: 'Patricia Alves', role: 'Esteticista - Porto Alegre',     avatarBg: 'linear-gradient(135deg,#34d399,#0ea5e9)', text: 'Nunca mais perdi data de conta a pagar. Organizado por categoria e com alertas. Minha saude financeira melhorou!' },
  { name: 'Renata Costa',   role: 'Studio Beleza - Brasilia',       avatarBg: 'linear-gradient(135deg,#fbbf24,#f43f5e)', text: 'Testei 3 sistemas antes. Esse e o unico que funciona sem precisar chamar suporte. Simples, bonito e completo.' },
]

const plans = [
  {
    name: '💅 Essencial', price: 'R$57', period: '/mês', featured: false,
    desc: 'Para quem está começando',
    cta: 'Testar 7 dias grátis',
    url: 'https://wa.me/5511940527609?text=Quero+assinar+o+plano+Essencial+do+Glow+Up+Studio',
    items: [
      '1 conta de acesso',
      'Até 100 clientes',
      'Até 100 agendamentos/mês',
      'Todas as funcionalidades',
      'Suporte por e-mail',
    ],
  },
  {
    name: '✨ Pro', price: 'R$97', period: '/mês', featured: true,
    desc: 'Para studios em crescimento',
    cta: 'Testar 7 dias grátis',
    url: 'https://wa.me/5511940527609?text=Quero+assinar+o+plano+Pro+do+Glow+Up+Studio',
    items: [
      'Até 200 clientes',
      'Até 3 funcionárias',
      'Até 200 agendamentos/mês',
      'Todas as funcionalidades',
      'Suporte e-mail + chat',
    ],
  },
  {
    name: '🏆 Elite', price: 'R$197', period: '/mês', featured: false,
    desc: 'Para redes e franquias',
    cta: 'Falar com a gente',
    url: 'https://wa.me/5511940527609?text=Quero+assinar+o+plano+Elite+do+Glow+Up+Studio',
    items: [
      'Clientes ilimitados',
      'Funcionárias ilimitadas',
      'Agendamentos ilimitados',
      'Todas as funcionalidades',
      'Suporte prioritário via WhatsApp',
      'Onboarding personalizado',
    ],
  },
]

const faqs = [
  { q: 'Preciso instalar alguma coisa?',         a: 'Nao! O Glow Up Studio e 100% online, funciona em qualquer celular ou computador, sem instalacao.' },
  { q: 'Meus dados ficam seguros?',              a: 'Sim. Cada studio tem seus dados completamente isolados. Usamos criptografia e backups automaticos.' },
  { q: 'Posso cancelar quando quiser?',          a: 'Sim, sem fidelidade e sem multa. Cancele quando quiser pelo painel ou pelo WhatsApp de suporte.' },
  { q: 'Quantas funcionárias posso adicionar?',  a: 'No plano Essencial até 3 funcionárias. No Pro até 10 funcionárias. No Elite, ilimitadas.' },
  { q: 'Funciona para mais de um serviço?',      a: 'Sim! Cadastre lash, unhas, sobrancelha e outros serviços no mesmo sistema com preços individuais.' },
  { q: 'Tem app para celular?',                  a: 'A plataforma é totalmente responsiva no celular pelo navegador. Um app nativo está a caminho!' },
]
</script>

<style scoped>
html { scroll-behavior: smooth; }

/* ── NAV ──────────────────────────────────────────────── */
.nav-bar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 50;
  transition: background .4s, box-shadow .4s, border-color .4s;
}
.nav-bar--scrolled {
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 1px 0 #fce7f3;
  border-bottom: 1px solid #fce7f3;
}
.nav-inner {
  max-width: 1152px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  gap: 0;
}
.nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;
}
.nav-logo__icon {
  width: 32px; height: 32px; flex-shrink: 0;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #f472b6, #e879f9);
  box-shadow: 0 2px 8px rgba(244,114,182,.35);
}
.nav-logo__text {
  font-size: 14px;
  font-weight: 900;
  letter-spacing: -0.02em;
  white-space: nowrap;
  background: linear-gradient(135deg, #ec4899, #c026d3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.nav-links {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
}
@media (max-width: 767px) { .nav-links { display: none; } }
.nav-link {
  font-size: 14px; font-weight: 500;
  color: rgba(120,40,60,.6);
  text-decoration: none;
  white-space: nowrap;
  transition: color .2s;
}
.nav-link:hover { color: #ec4899; }
.nav-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  margin-left: auto;
}
@media (max-width: 767px) { .nav-actions { display: none; } }
.nav-btn-ghost {
  display: inline-flex; align-items: center;
  font-size: 14px; font-weight: 600;
  color: #ec4899;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 9999px;
  white-space: nowrap;
  transition: background .2s;
}
.nav-btn-ghost:hover { background: rgba(252,231,243,.8); }
.nav-btn-primary {
  display: inline-flex; align-items: center;
  font-size: 14px; font-weight: 700;
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 9999px;
  white-space: nowrap;
  background: linear-gradient(135deg, #f472b6, #c026d3);
  box-shadow: 0 4px 14px rgba(236,72,153,.35);
  transition: transform .2s, box-shadow .2s;
}
.nav-btn-primary:hover { transform: scale(1.04); box-shadow: 0 6px 20px rgba(236,72,153,.45); }
.nav-hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 36px; height: 36px;
  margin-left: auto;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 8px;
  transition: background .2s;
}
.nav-hamburger:hover { background: rgba(252,231,243,.8); }
@media (max-width: 767px) { .nav-hamburger { display: flex; } }
.nav-hamburger__line {
  display: block;
  width: 22px; height: 2px;
  background: #ec4899;
  border-radius: 9999px;
  transition: transform .25s, opacity .25s;
  transform-origin: center;
}
.nav-hamburger__line--top-open { transform: translateY(7px) rotate(45deg); }
.nav-hamburger__line--mid-open { opacity: 0; }
.nav-hamburger__line--bot-open { transform: translateY(-7px) rotate(-45deg); }
.nav-mobile {
  background: rgba(255,255,255,0.97);
  backdrop-filter: blur(20px);
  border-top: 1px solid #fce7f3;
  padding: 16px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.nav-mobile__link {
  font-size: 15px; font-weight: 600;
  color: rgba(120,40,60,.7);
  text-decoration: none;
  padding: 12px 8px;
  border-radius: 12px;
  transition: background .2s, color .2s;
}
.nav-mobile__link:hover { background: #fdf2f8; color: #ec4899; }
.nav-mobile__actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 12px;
  padding-top: 16px;
  border-top: 1px solid #fce7f3;
}
.nav-mobile__actions .nav-btn-ghost,
.nav-mobile__actions .nav-btn-primary {
  width: 100%;
  justify-content: center;
  padding: 14px 20px;
  font-size: 15px;
}
/* ────────────────────────────────────────────────────── */

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-14px); }
}

.section-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #f472b6;
  margin-bottom: 0.75rem;
}
.section-label::before {
  content: '';
  display: inline-block;
  width: 18px;
  height: 2px;
  border-radius: 9999px;
  background: linear-gradient(90deg, #f472b6, #e879f9);
}
</style>
