<template>
  <div class="min-h-screen font-sans antialiased overflow-x-hidden" style="background: #f8fafc; color: #1e293b">

    <!-- NAV -->
    <nav class="nav-bar" :class="{ 'nav-bar--scrolled': scrolled }">
      <div class="nav-inner">

        <!-- Logo -->
        <NuxtLink to="/" class="nav-logo">
          <div class="nav-logo__icon">
            <svg width="16" height="16" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L12 12.75 6.429 9.75m11.142 0l4.179 2.25L12 17.25 2.25 12l4.179-2.25m11.142 0L12 12.75m0 0v4.5m0 4.5l9.75-5.25V7.5M12 21.75l-9.75-5.25V7.5"/>
            </svg>
          </div>
          <span class="nav-logo__text">CV Pro</span>
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
        <div class="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-30 blur-[100px]" style="background: radial-gradient(circle, #bfdbfe, transparent 70%)"></div>
        <div class="absolute -bottom-40 -right-40 w-[700px] h-[700px] rounded-full opacity-25 blur-[120px]" style="background: radial-gradient(circle, #c7d2fe, transparent 70%)"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-20 blur-[80px]" style="background: radial-gradient(circle, #dbeafe, transparent 70%)"></div>
        <div class="absolute top-20 right-16 w-3.5 h-3.5 rounded-full bg-blue-300/40" style="animation: float 4s ease-in-out infinite"></div>
        <div class="absolute top-40 right-40 w-2 h-2 rounded-full bg-indigo-300/45" style="animation: float 5s ease-in-out infinite; animation-delay:.7s"></div>
        <div class="absolute top-60 left-20 w-2.5 h-2.5 rounded-full bg-blue-400/40" style="animation: float 4.5s ease-in-out infinite; animation-delay:1.3s"></div>
        <div class="absolute bottom-32 left-32 w-2 h-2 rounded-full bg-indigo-400/35" style="animation: float 3.5s ease-in-out infinite; animation-delay:.4s"></div>
        <div class="absolute bottom-48 right-24 w-2.5 h-2.5 rounded-full bg-blue-400/30" style="animation: float 4.2s ease-in-out infinite; animation-delay:1s"></div>
        <div class="absolute top-1/3 left-1/4 w-1.5 h-1.5 rounded-full bg-indigo-300/30" style="animation: float 6s ease-in-out infinite; animation-delay:.2s"></div>
      </div>

      <div class="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 text-center">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-50 border border-indigo-200 mb-10 shadow-sm">
          <svg class="w-3.5 h-3.5 text-indigo-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L12 12.75 6.429 9.75"/></svg>
          <span class="text-xs font-bold text-indigo-600 tracking-wider uppercase">Sistema completo para comunicação visual</span>
        </div>

        <!-- Headline -->
        <h1 class="font-black tracking-tight mb-6" style="line-height: 1.04;">
          <span class="block" style="font-size: clamp(2.4rem, 6vw, 4.8rem); background: linear-gradient(135deg, #1e40af, #4f46e5); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Gerencie sua gráfica</span>
          <span class="block" style="font-size: clamp(2.4rem, 6vw, 4.8rem); background: linear-gradient(135deg, #1e40af, #4f46e5); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">do orçamento à entrega</span>
          <span class="block mt-2" style="font-size: clamp(2.2rem, 5.5vw, 4.4rem); background: linear-gradient(135deg, #6366f1, #4f46e5, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Com controle total</span>
          <span class="block" style="font-size: clamp(2.2rem, 5.5vw, 4.4rem); background: linear-gradient(135deg, #6366f1, #4f46e5, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">da produção.</span>
        </h1>

        <!-- Subheadline -->
        <p class="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style="color: rgba(30,41,59,0.6)">
          A plataforma completa para <strong class="text-indigo-600 font-semibold">gráficas</strong>, <strong class="text-blue-700 font-semibold">empresas de comunicação visual</strong> e <strong class="text-indigo-600 font-semibold">adesiveiros</strong> — orçamentos, ordens de serviço, kanban de produção, financeiro e CRM. Tudo em um só lugar.
        </p>

        <!-- CTAs -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <a href="https://wa.me/5511940527609" target="_blank" rel="noopener noreferrer"
            class="inline-flex items-center text-base font-black px-10 py-4 rounded-full text-white transition-all duration-200 hover:scale-105"
            style="background: linear-gradient(135deg, #1e40af, #4f46e5); box-shadow: 0 8px 28px rgba(79,70,229,0.4);">
            Experimentar grátis
          </a>
          <a href="#funcionalidades"
            class="inline-flex items-center gap-2 text-base font-semibold px-8 py-4 rounded-full border-2 border-indigo-200 text-indigo-600 bg-white hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 shadow-sm">
            Ver como funciona
          </a>
        </div>

        <!-- Social proof -->
        <div class="flex flex-wrap items-center justify-center gap-5 text-sm" style="color: rgba(30,41,59,0.5)">
          <div class="flex items-center gap-2">
            <div class="flex -space-x-2">
              <div v-for="(c, i) in avatarColors" :key="i"
                class="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-black text-white"
                :style="{ background: c }">{{ avatarInitials[i] }}</div>
            </div>
            <span class="font-semibold">+200 empresas ativas</span>
          </div>
          <span class="text-indigo-200 hidden sm:inline">|</span>
          <div class="flex items-center gap-1.5">
            <svg v-for="s in 5" :key="s" class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            <span class="font-semibold" style="color: rgba(30,41,59,0.7)">4.9 de satisfação</span>
          </div>
          <span class="text-indigo-200 hidden sm:inline">|</span>
          <div class="flex items-center gap-1.5">
            <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span>Sem cartão de crédito</span>
          </div>
        </div>
      </div>
    </section>

    <!-- PARA QUEM -->
    <section class="py-16 sm:py-24 relative" style="background: linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)">
      <div class="max-w-5xl mx-auto px-5 sm:px-10">
        <div class="text-center mb-12">
          <p class="section-label">Para quem é</p>
          <h2 class="text-4xl sm:text-5xl font-black mb-3" style="background: linear-gradient(135deg, #1e40af, #4f46e5); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Feito para o seu negócio</h2>
          <p class="text-slate-500 max-w-md mx-auto mt-2">Se você trabalha com comunicação visual, esse sistema foi pensado para a sua operação.</p>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div v-for="tipo in tiposNegocio" :key="tipo.label"
            class="group flex flex-col items-center text-center gap-3 px-4 py-8 rounded-2xl border border-indigo-100 bg-white hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100/60 hover:-translate-y-1 transition-all duration-300 cursor-default">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-indigo-200/60 transition-all duration-300" :style="{ background: tipo.bg }">
              <svg class="w-6 h-6" :style="{ color: tipo.color }" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" v-html="tipo.svg"></svg>
            </div>
            <span class="text-sm font-bold leading-tight" style="color: #1e40af">{{ tipo.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- FUNCIONALIDADES -->
    <section id="funcionalidades" class="py-16 sm:py-24 relative" style="background: linear-gradient(180deg, #eef2ff 0%, #e0e7ff 100%)">
      <div class="max-w-6xl mx-auto px-5 sm:px-10">
        <div class="text-center mb-12">
          <p class="section-label">Funcionalidades</p>
          <h2 class="text-4xl sm:text-5xl font-black mb-3" style="background: linear-gradient(135deg, #1e40af, #4f46e5); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Tudo para o seu dia a dia</h2>
          <p class="text-slate-500 max-w-lg mx-auto">Do orçamento à entrega, do financeiro à equipe. Uma plataforma que entende o ritmo da sua produção.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div v-for="feat in features" :key="feat.title"
            class="group relative p-6 rounded-3xl bg-white border border-indigo-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 overflow-hidden">
            <div class="absolute inset-x-0 top-0 h-[2px] rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style="background: linear-gradient(90deg, #6366f1, #3b82f6, #818cf8)"></div>
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 group-hover:shadow-indigo-200/80 transition-all duration-300" :style="{ background: feat.bg }">
              <svg class="w-5 h-5" :style="{ color: feat.color }" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" v-html="feat.svg"></svg>
            </div>
            <h3 class="text-base font-bold mb-2" style="color: #1e40af">{{ feat.title }}</h3>
            <p class="text-sm text-slate-500 leading-relaxed">{{ feat.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- STATS -->
    <section class="py-14 sm:py-20" style="background: linear-gradient(135deg, #eef2ff, #e0e7ff)">
      <div class="max-w-4xl mx-auto px-5 sm:px-10">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div v-for="stat in stats" :key="stat.label" class="text-center bg-white/80 backdrop-blur-sm rounded-2xl py-8 px-4 border border-indigo-100 shadow-sm hover:shadow-md hover:shadow-indigo-100/80 transition-all duration-200 group">
            <div class="text-4xl sm:text-5xl font-black mb-2 group-hover:scale-105 transition-transform duration-200" style="background: linear-gradient(135deg, #1e40af, #4f46e5); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text">{{ stat.value }}</div>
            <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider leading-snug">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- MOBILE SHOWCASE -->
    <section class="py-20 sm:py-28 relative overflow-hidden" style="background: linear-gradient(180deg, #e0e7ff 0%, #eef2ff 100%)">
      <div class="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full opacity-20 blur-[100px] pointer-events-none" style="background: radial-gradient(circle, #93c5fd, transparent)"></div>
      <div class="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full opacity-20 blur-[100px] pointer-events-none" style="background: radial-gradient(circle, #a5b4fc, transparent)"></div>

      <div class="relative max-w-6xl mx-auto px-6 sm:px-10">
        <div class="text-center mb-16">
          <p class="section-label">Acesso em qualquer lugar</p>
          <h2 class="text-4xl sm:text-5xl font-black mb-3" style="background: linear-gradient(135deg, #1e40af, #4f46e5); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Na palma da sua mão</h2>
          <p class="text-slate-500 max-w-lg mx-auto">Gerencie sua empresa de onde estiver. Celular, tablet ou computador — tudo sincronizado em tempo real.</p>
        </div>

        <div class="flex flex-col items-center gap-16">

          <!-- Phone mockup -->
          <div class="relative flex-shrink-0">
            <!-- Phone frame -->
            <div class="relative" style="width:260px; height:540px; border-radius:44px; border:7px solid #1e293b; background:#f3f4f6; box-shadow: 0 32px 64px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.08) inset;">
              <!-- Screen -->
              <div class="absolute flex flex-col" style="inset:0; border-radius:38px; overflow:hidden; background:#f3f4f6;">

                <!-- App header -->
                <div class="relative flex-shrink-0" style="background:linear-gradient(135deg,#1e40af,#4f46e5); padding:12px 12px 12px 12px; min-height:110px;">
                  <!-- Dynamic island -->
                  <div style="display:flex; justify-content:center; margin-bottom:10px;">
                    <div style="width:72px; height:18px; border-radius:999px; background:#1e293b;"></div>
                  </div>
                  <!-- radial highlight -->
                  <div class="absolute" style="inset:0; border-radius:inherit; background:radial-gradient(ellipse at top right, rgba(255,255,255,0.18), transparent 65%);"></div>
                  <!-- Logo badge -->
                  <div class="absolute" style="top:10px; right:10px; width:26px; height:26px; border-radius:8px; background:rgba(255,255,255,0.15); backdrop-filter:blur(4px); border:1px solid rgba(255,255,255,0.2); display:flex; align-items:center; justify-content:center;">
                    <svg style="width:13px;height:13px;color:white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25"/></svg>
                  </div>
                  <div class="relative">
                    <p style="font-size:7px; font-weight:700; color:rgba(191,219,254,0.8); letter-spacing:0.1em; text-transform:uppercase; margin:0 0 2px;">CV Pro</p>
                    <p style="font-size:13px; font-weight:900; color:white; margin:0; line-height:1.1;">Olá, Ricardo! 👋</p>
                    <p style="font-size:7px; color:rgba(191,219,254,0.7); margin:3px 0 0;">Segunda, 23 de junho de 2025</p>
                  </div>
                  <!-- Stats row -->
                  <div style="display:flex; gap:5px; margin-top:10px; position:relative;">
                    <div style="flex:1; background:rgba(255,255,255,0.13); backdrop-filter:blur(4px); border:1px solid rgba(255,255,255,0.12); border-radius:10px; padding:6px 5px; text-align:center;">
                      <p style="font-size:7px; font-weight:700; color:rgba(191,219,254,0.9); letter-spacing:0.05em; margin:0; text-transform:uppercase;">Pedidos</p>
                      <p style="font-size:14px; font-weight:900; color:white; margin:1px 0 0; line-height:1;">12</p>
                    </div>
                    <div style="flex:1; background:rgba(255,255,255,0.13); backdrop-filter:blur(4px); border:1px solid rgba(255,255,255,0.12); border-radius:10px; padding:6px 5px; text-align:center;">
                      <p style="font-size:7px; font-weight:700; color:rgba(191,219,254,0.9); letter-spacing:0.05em; margin:0; text-transform:uppercase;">Receita</p>
                      <p style="font-size:11px; font-weight:900; color:white; margin:1px 0 0; line-height:1;">R$4.800</p>
                    </div>
                    <div style="flex:1; background:rgba(255,255,255,0.13); backdrop-filter:blur(4px); border:1px solid rgba(255,255,255,0.12); border-radius:10px; padding:6px 5px; text-align:center;">
                      <p style="font-size:7px; font-weight:700; color:rgba(191,219,254,0.9); letter-spacing:0.05em; margin:0; text-transform:uppercase;">Produção</p>
                      <p style="font-size:14px; font-weight:900; color:white; margin:1px 0 0; line-height:1;">5</p>
                    </div>
                  </div>
                </div>

                <!-- Body -->
                <div style="flex:1; overflow:hidden; padding:10px 8px 8px; display:flex; flex-direction:column; gap:7px;">
                  <!-- Section label -->
                  <p style="font-size:7px; font-weight:800; text-transform:uppercase; letter-spacing:0.1em; color:rgba(30,41,59,0.4); margin:0;">Ordens em produção</p>

                  <!-- Order cards -->
                  <div v-for="appt in mockAppts" :key="appt.name" style="background:white; border-radius:12px; overflow:hidden; box-shadow:0 1px 4px rgba(0,0,0,0.06); border:1px solid rgba(199,210,254,0.8);">
                    <div style="height:3px;" :style="{ background: appt.accent }"></div>
                    <div style="display:flex; align-items:center; gap:7px; padding:7px 9px;">
                      <!-- Avatar -->
                      <div style="width:26px; height:26px; border-radius:8px; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:9px; font-weight:900; color:white;" :style="{ background: appt.color }">{{ appt.init }}</div>
                      <div style="flex:1; min-width:0;">
                        <p style="font-size:9px; font-weight:800; color:#1e3a5f; margin:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">{{ appt.name }}</p>
                        <p style="font-size:7px; color:rgba(30,41,59,0.5); margin:1px 0 0;">{{ appt.service }}</p>
                      </div>
                      <!-- Status badge -->
                      <div style="flex-shrink:0; padding:3px 6px; border-radius:6px; font-size:8px; font-weight:700;" :style="{ background: appt.timeBg, color: appt.timeColor }">{{ appt.time }}</div>
                    </div>
                  </div>

                  <!-- Motivational banner -->
                  <div style="margin-top:2px; border-radius:10px; padding:7px 9px; background:linear-gradient(90deg,#eef2ff,#e0e7ff); border:1px solid #c7d2fe; display:flex; align-items:center; gap:7px;">
                    <div style="width:20px; height:20px; border-radius:6px; background:#4f46e5; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                      <svg style="width:11px;height:11px;color:white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>
                    </div>
                    <p style="font-size:7px; font-weight:600; color:#1e40af; margin:0; line-height:1.4;">Produção em dia! 5 pedidos para finalizar hoje. 🚀</p>
                  </div>
                </div>

                <!-- Bottom nav -->
                <div style="flex-shrink:0; border-top:1px solid #e0e7ff; background:white; padding:6px 0; display:flex; align-items:center; justify-content:space-around;">
                  <div style="display:flex; flex-direction:column; align-items:center; gap:2px;">
                    <svg style="width:14px;height:14px;color:#4f46e5;" fill="currentColor" viewBox="0 0 24 24"><path d="M11.47 3.841a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.061l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 101.061 1.06l8.69-8.689z"/><path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z"/></svg>
                    <span style="font-size:6px; font-weight:700; color:#4f46e5;">Início</span>
                  </div>
                  <div style="display:flex; flex-direction:column; align-items:center; gap:2px; opacity:0.35;">
                    <svg style="width:14px;height:14px;color:#6b7280;" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"/></svg>
                    <span style="font-size:6px; font-weight:600; color:#9ca3af;">Pedidos</span>
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
              <div class="absolute" style="right:-5px; top:96px; width:4px; height:56px; border-radius:999px; background:#1e293b;"></div>
              <div class="absolute" style="left:-5px; top:82px; width:4px; height:38px; border-radius:999px; background:#1e293b;"></div>
              <div class="absolute" style="left:-5px; top:130px; width:4px; height:38px; border-radius:999px; background:#1e293b;"></div>
            </div>
            <!-- Glow -->
            <div class="absolute -z-10" style="inset:-24px; border-radius:999px; filter:blur(50px); opacity:0.5; background:radial-gradient(circle, #93c5fd, #a5b4fc);"></div>
          </div>

          <!-- Bottom features row -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl" style="margin-top: 2.5rem;">
            <div v-for="f in mobileFeatures" :key="f.title" class="group flex items-start gap-4 bg-white rounded-2xl p-5 border border-indigo-100 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/50 transition-all duration-300">
              <div class="w-11 h-11 shrink-0 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200" :style="{ background: f.bg }">
                <svg class="w-5 h-5" :style="{ color: f.color }" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" v-html="f.svg"></svg>
              </div>
              <div>
                <p class="text-sm font-black mb-0.5" style="color: #1e40af">{{ f.title }}</p>
                <p class="text-xs text-slate-500 leading-snug">{{ f.desc }}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- COMO FUNCIONA -->
    <section id="como-funciona" class="py-16 sm:py-24" style="background: #f8fafc">
      <div class="max-w-4xl mx-auto px-5 sm:px-10">
        <div class="text-center mb-14">
          <p class="section-label">Simples assim</p>
          <h2 class="text-4xl sm:text-5xl font-black mb-3" style="background: linear-gradient(135deg, #1e40af, #4f46e5); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Começa em 3 passos</h2>
          <p class="text-slate-500 max-w-md mx-auto">Sem complicação. Em 5 minutos sua conta está criada e funcionando.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
          <div class="hidden sm:block absolute top-10 left-[18%] right-[18%] h-px" style="background: linear-gradient(to right, #93c5fd, #a5b4fc, #93c5fd)"></div>
          <div v-for="(step, i) in steps" :key="step.title" class="flex flex-col items-center text-center gap-4">
            <div class="relative w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl z-10 border-2 border-white" :style="{ background: step.bg }">
              <svg class="w-8 h-8" :style="{ color: step.color }" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" v-html="step.svg"></svg>
              <span class="absolute -top-2 -right-2 w-7 h-7 rounded-full text-xs font-black flex items-center justify-center text-white shadow-md" style="background: linear-gradient(135deg, #1e40af, #4f46e5)">{{ i + 1 }}</span>
            </div>
            <h3 class="text-base font-black" style="color: #1e40af">{{ step.title }}</h3>
            <p class="text-sm text-slate-500 leading-relaxed">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- DEPOIMENTOS -->
    <section id="depoimentos" class="py-16 sm:py-24 relative overflow-hidden" style="background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 50%, #f1f5f9 100%)">
      <div class="absolute top-8 left-8 opacity-10 pointer-events-none select-none"><svg width="64" height="64" fill="none" stroke="#6366f1" stroke-width="1.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25"/></svg></div>
      <div class="absolute bottom-8 right-8 opacity-10 pointer-events-none select-none"><svg width="64" height="64" fill="none" stroke="#3b82f6" stroke-width="1.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/></svg></div>
      <div class="relative max-w-6xl mx-auto px-5 sm:px-10">
        <div class="text-center mb-12">
          <p class="section-label">Depoimentos</p>
          <h2 class="text-4xl sm:text-5xl font-black mb-3" style="background: linear-gradient(135deg, #1e40af, #4f46e5); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Quem usa, recomenda</h2>
          <p class="text-slate-500 max-w-md mx-auto">Veja o que donos de gráficas e empresas de comunicação visual falam sobre o CV Pro.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div v-for="review in reviews" :key="review.name"
            class="relative p-6 rounded-3xl bg-white border border-indigo-100 shadow-sm hover:shadow-lg hover:shadow-indigo-100 hover:border-indigo-200 transition-all duration-300 flex flex-col gap-4 overflow-hidden">
            <span class="absolute top-3 right-5 leading-none text-indigo-100 pointer-events-none select-none" style="font-size: 5rem; font-family: Georgia, serif; line-height: 1">"</span>
            <div class="flex gap-1">
              <svg v-for="s in 5" :key="s" class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            </div>
            <p class="text-sm text-slate-600 leading-relaxed flex-1 italic">"{{ review.text }}"</p>
            <div class="flex items-center gap-3 pt-3 border-t border-indigo-50">
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white shadow-md shrink-0" :style="{ background: review.avatarBg }">{{ review.name[0] }}</div>
              <div>
                <p class="text-sm font-black" style="color: #1e40af">{{ review.name }}</p>
                <p class="text-xs text-slate-400">{{ review.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PLANOS -->
    <section id="precos" class="py-16 sm:py-24" style="background: #f8fafc">
      <div class="max-w-5xl mx-auto px-5 sm:px-10">
        <div class="text-center mb-12">
          <p class="section-label">Planos</p>
          <h2 class="text-4xl sm:text-5xl font-black mb-3" style="background: linear-gradient(135deg, #1e40af, #4f46e5); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Investimento que cabe no seu orçamento</h2>
          <p class="text-slate-500 max-w-sm mx-auto">Planos a partir de R$97/mês. Cancele quando quiser.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
          <div v-for="plan in plans" :key="plan.name"
            class="relative rounded-3xl p-7 flex flex-col gap-5 transition-all duration-300"
            :class="plan.featured ? 'border-2 border-indigo-300 shadow-2xl shadow-indigo-200/60 sm:scale-[1.04]' : 'border border-indigo-100 bg-white hover:shadow-lg hover:shadow-indigo-100 hover:border-indigo-200'"
            :style="plan.featured ? 'background: linear-gradient(135deg, #eef2ff, #e0e7ff)' : ''">
            <div v-if="plan.featured"
              class="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-[11px] font-black text-white shadow-lg whitespace-nowrap"
              style="background: linear-gradient(135deg, #1e40af, #4f46e5)">
              MAIS POPULAR
            </div>
            <div>
              <h3 class="text-xl font-black mb-1" style="color: #1e40af">{{ plan.name }}</h3>
              <p class="text-xs text-slate-400">{{ plan.desc }}</p>
            </div>
            <div class="flex items-end gap-1">
              <span class="text-5xl font-black" style="color: #4f46e5">{{ plan.price }}</span>
              <span v-if="plan.period" class="text-sm text-slate-400 mb-1.5">{{ plan.period }}</span>
            </div>
            <ul class="flex flex-col gap-3 flex-1">
              <li v-for="item in plan.items" :key="item" class="flex items-start gap-2.5 text-sm text-slate-600">
                <svg class="mt-0.5 shrink-0 w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                {{ item }}
              </li>
            </ul>
            <a :href="plan.url" target="_blank" rel="noopener noreferrer"
              class="mt-2 w-full py-3.5 rounded-full text-sm font-black text-center transition-all duration-200 hover:scale-[1.02] block"
              :class="plan.featured ? 'text-white shadow-lg hover:shadow-indigo-300/60' : 'border-2 border-indigo-200 text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50'"
              :style="plan.featured ? 'background: linear-gradient(135deg, #1e40af, #4f46e5)' : ''">
              {{ plan.cta }}
            </a>
          </div>
        </div>
        <p class="text-center text-xs text-slate-400 mt-8">✅ 7 dias grátis em todos os planos · Sem cartão de crédito · Sem fidelidade · Cancele quando quiser</p>
      </div>
    </section>

    <!-- FAQ -->
    <section class="py-16 sm:py-24" style="background: linear-gradient(180deg, #eef2ff, #f8fafc)">
      <div class="max-w-2xl mx-auto px-5 sm:px-10">
        <div class="text-center mb-10">
          <p class="section-label">Dúvidas</p>
          <h2 class="text-4xl sm:text-5xl font-black" style="background: linear-gradient(135deg, #1e40af, #4f46e5); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Perguntas frequentes</h2>
        </div>
        <div class="flex flex-col gap-3">
          <div v-for="(faq, i) in faqs" :key="i"
            class="rounded-2xl border border-indigo-100 bg-white overflow-hidden shadow-sm transition-shadow hover:shadow-md">
            <button class="w-full flex items-center justify-between gap-4 px-6 py-4 text-left" @click="toggleFaq(i)">
              <span class="text-sm font-bold" style="color: #1e40af">{{ faq.q }}</span>
              <svg class="w-4 h-4 text-indigo-400 shrink-0 transition-transform duration-200" :class="faqOpen === i ? 'rotate-180' : ''" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            <div v-if="faqOpen === i" class="px-6 pb-5">
              <p class="text-sm text-slate-500 leading-relaxed">{{ faq.a }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA FINAL -->
    <section class="py-20 sm:py-28 relative overflow-hidden" style="background: linear-gradient(135deg, #f1f5f9 0%, #e0e7ff 50%, #eef2ff 100%)">
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div class="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-30 blur-[80px]" style="background: radial-gradient(circle, #93c5fd, transparent)"></div>
        <div class="absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-30 blur-[80px]" style="background: radial-gradient(circle, #a5b4fc, transparent)"></div>
      </div>
      <div class="relative max-w-2xl mx-auto px-5 sm:px-10 text-center">
        <div class="w-16 h-16 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl shadow-indigo-200 border-2 border-indigo-100" style="background: linear-gradient(135deg, #eef2ff, #e0e7ff)">
          <svg class="w-7 h-7 text-indigo-500" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>
        </div>
        <h2 class="text-3xl sm:text-5xl font-black mb-5 leading-tight" style="background: linear-gradient(135deg, #1e40af, #4f46e5); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
          Da arte à entrega. Controle total.
        </h2>
        <p class="text-slate-500 text-lg mb-10 max-w-md mx-auto leading-relaxed">
          Sua empresa merece um sistema que organiza tudo sem dor de cabeça. Comece hoje, de graça.
        </p>
        <a href="https://wa.me/5511940527609" target="_blank" rel="noopener noreferrer"
          class="inline-flex items-center gap-3 text-lg font-black px-12 py-5 rounded-full text-white shadow-2xl shadow-indigo-300/50 transition-all duration-200 hover:scale-105 hover:shadow-indigo-400/60"
          style="background: linear-gradient(135deg, #1e40af, #4f46e5)">
          Experimentar grátis
        </a>
        <p class="text-xs text-slate-400 mt-5">Sem cartão de crédito. Pronto em 5 minutos. Suporte via WhatsApp.</p>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="border-t border-indigo-100 py-8 bg-white">
      <div class="max-w-6xl mx-auto px-5 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg flex items-center justify-center" style="background: linear-gradient(135deg, #1e40af, #4f46e5)">
            <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L12 12.75 6.429 9.75"/>
            </svg>
          </div>
          <span class="text-sm font-black" style="background: linear-gradient(135deg, #1e40af, #4f46e5); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text">CV Pro</span>
        </div>
        <p class="text-xs text-slate-400 text-center">2025 CV Pro. Da arte à entrega. Controle total.</p>
        <a href="https://wa.me/5511940527609" target="_blank" rel="noopener noreferrer" class="text-xs font-semibold text-indigo-500 hover:text-indigo-700 transition-colors">Acessar plataforma</a>
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

const avatarColors   = ['linear-gradient(135deg,#1e40af,#4f46e5)', 'linear-gradient(135deg,#6366f1,#4338ca)', 'linear-gradient(135deg,#3b82f6,#2563eb)', 'linear-gradient(135deg,#6366f1,#3b82f6)']
const avatarInitials = ['R', 'M', 'L', 'F']

const mockAppts = [
  { init: 'A', name: 'Auto Center SP',   service: 'Adesivo recorte - Fachada',  time: 'Corte', color: 'linear-gradient(135deg,#1e40af,#4f46e5)', accent: 'linear-gradient(90deg,#1e40af,#4f46e5)', timeBg: '#eef2ff', timeColor: '#1e40af' },
  { init: 'M', name: 'Mercado Bom Preço', service: 'Banner lona 440g - 3x1m',   time: 'Impr.', color: 'linear-gradient(135deg,#6366f1,#4338ca)', accent: 'linear-gradient(90deg,#6366f1,#4338ca)', timeBg: '#e0e7ff', timeColor: '#4338ca' },
  { init: 'D', name: 'Dra. Carla Souza',  service: 'Placa ACM - Consultório',    time: 'Acab.', color: 'linear-gradient(135deg,#3b82f6,#2563eb)', accent: 'linear-gradient(90deg,#3b82f6,#2563eb)', timeBg: '#dbeafe', timeColor: '#1d4ed8' },
]

const mobileFeatures = [
  { title: 'Pedidos em tempo real',   desc: 'Visualize e gerencie todas as ordens de serviço na palma da mão, de qualquer lugar.',     bg: 'linear-gradient(135deg,#eef2ff,#e0e7ff)', color: '#4f46e5', svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"/>' },
  { title: 'Financeiro no celular',   desc: 'Acompanhe entradas, saídas e saldo do dia diretamente no app sem abrir o computador.',    bg: 'linear-gradient(135deg,#e0e7ff,#ede9fe)', color: '#6366f1', svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75"/>' },
  { title: 'Clientes sempre à mão',  desc: 'Histórico completo de cada cliente, pedidos anteriores e preferências registradas.',       bg: 'linear-gradient(135deg,#dbeafe,#eef2ff)', color: '#2563eb', svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>' },
]

const tiposNegocio = [
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18.75 7.5H5.25"/>', label: 'Gráficas',             bg: 'linear-gradient(135deg,#eef2ff,#e0e7ff)', color: '#4f46e5' },
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"/>',  label: 'Comunicação Visual', bg: 'linear-gradient(135deg,#e0e7ff,#ede9fe)', color: '#6366f1' },
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/>',  label: 'Adesiveiros',        bg: 'linear-gradient(135deg,#dbeafe,#eef2ff)', color: '#2563eb' },
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M10.875 12c-.621 0-1.125.504-1.125 1.125M12 10.875c-.621 0-1.125.504-1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m-1.125 1.125c0 .621.504 1.125 1.125 1.125"/>',  label: 'Sinalização',         bg: 'linear-gradient(135deg,#fff7ed,#eef2ff)', color: '#f59e0b' },
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/>',  label: 'Frotas e Plotagem',  bg: 'linear-gradient(135deg,#f0fdf4,#eef2ff)', color: '#10b981' },
]

const features = [
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z"/>',        color: '#4f46e5', title: 'Orçamentos inteligentes',  bg: 'linear-gradient(135deg,#eef2ff,#e0e7ff)', desc: 'Crie orçamentos profissionais em segundos com cálculo automático de materiais, mão de obra e margem.' },
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/>',        color: '#6366f1', title: 'Kanban de produção',        bg: 'linear-gradient(135deg,#e0e7ff,#ede9fe)', desc: 'Acompanhe cada pedido por etapas: arte, aprovação, produção, acabamento e entrega. Tudo visual.' },
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"/>',           color: '#10b981', title: 'Dashboard financeiro',        bg: 'linear-gradient(135deg,#f0fdf4,#eef2ff)', desc: 'Receita, despesas, lucro, fluxo de caixa e inadimplência — tudo visual em tempo real.' },
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/>',            color: '#3b82f6', title: 'Gestão de clientes',            bg: 'linear-gradient(135deg,#dbeafe,#eef2ff)', desc: 'Ficha completa com histórico de pedidos, valor gasto, frequência e contato direto via WhatsApp.' },
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/>',           color: '#f59e0b', title: 'Controle de entregas',          bg: 'linear-gradient(135deg,#fff7ed,#eef2ff)', desc: 'Gerencie prazos, status e logística de entrega. Nunca mais atrase um pedido.' },
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/>',           color: '#8b5cf6', title: 'Catálogo de materiais',          bg: 'linear-gradient(135deg,#ede9fe,#eef2ff)', desc: 'Cadastre lonas, vinis, ACM e insumos com preço por m², controle de estoque e alertas de reposição.' },
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"/>',           color: '#06b6d4', title: 'Ordens de serviço',             bg: 'linear-gradient(135deg,#ecfeff,#eef2ff)', desc: 'Gere OS completas com dados do cliente, arte, materiais, prazo e valor. Envie por WhatsApp.' },
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"/>',           color: '#f97316', title: 'Contas a pagar/receber',             bg: 'linear-gradient(135deg,#fff7ed,#eef2ff)', desc: 'Controle vencimentos, categorize despesas, acompanhe inadimplência e status de pagamento.' },
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/>',           color: '#ec4899', title: 'Equipe e comissões',             bg: 'linear-gradient(135deg,#fce7f3,#eef2ff)', desc: 'Gerencie profissionais, calcule comissões por serviço e acompanhe produtividade da equipe.' },
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"/>',           color: '#22c55e', title: 'WhatsApp integrado',             bg: 'linear-gradient(135deg,#f0fdf4,#eef2ff)', desc: 'Envie orçamentos, atualizações de pedido e cobranças direto para o WhatsApp do cliente.' },
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"/>',        color: '#7c3aed', title: 'Consultor IA',        bg: 'linear-gradient(135deg,#ede9fe,#eef2ff)', desc: 'Inteligência artificial que analisa seus dados e gera diagnósticos, oportunidades e planos de ação.' },
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>',    color: '#1e40af', title: 'Multi-tenant seguro',    bg: 'linear-gradient(135deg,#dbeafe,#eef2ff)', desc: 'Cada empresa vê apenas seus dados. Controle de acesso por perfil: admin, gerente e operador.' },
]

const stats = [
  { value: '200+',  label: 'Empresas ativas' },
  { value: '98%',   label: 'Satisfação' },
  { value: '10h',   label: 'Economizadas por semana' },
  { value: '5 min', label: 'Para configurar' },
]

const steps = [
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>',  color: '#4f46e5', title: 'Crie sua conta',       bg: 'linear-gradient(135deg,#eef2ff,#e0e7ff)', desc: 'Cadastre sua empresa em menos de 5 minutos. Sem burocracia e sem cartão de crédito.' },
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>',  color: '#6366f1', title: 'Configure sua operação', bg: 'linear-gradient(135deg,#e0e7ff,#ede9fe)', desc: 'Adicione materiais, equipe e configure as etapas do seu fluxo de produção.' },
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/>',  color: '#f59e0b', title: 'Comece a produzir',      bg: 'linear-gradient(135deg,#eef2ff,#fff7ed)', desc: 'Orçamentos, pedidos e financeiro organizados. Acesse do celular ou computador a qualquer hora.' },
]

const reviews = [
  { name: 'Ricardo Mendes',   role: 'Gráfica Express - São Paulo',         avatarBg: 'linear-gradient(135deg,#1e40af,#4f46e5)', text: 'Acabei com a planilha de orçamentos. Agora faço tudo em 2 minutos e o cliente recebe na hora pelo WhatsApp.' },
  { name: 'Marcos Silva',     role: 'MS Comunicação Visual - Campinas',    avatarBg: 'linear-gradient(135deg,#6366f1,#4338ca)', text: 'O kanban de produção mudou tudo. Sei exatamente o que está em cada etapa e nunca mais atrasei entrega.' },
  { name: 'Luciana Ferreira', role: 'Print & Go - Belo Horizonte',         avatarBg: 'linear-gradient(135deg,#3b82f6,#2563eb)', text: 'Tenho 4 operadores e o controle ficou perfeito. Cada um sabe o que fazer e eu acompanho tudo pelo celular.' },
  { name: 'Felipe Rocha',     role: 'Adesiva Digital - Curitiba',          avatarBg: 'linear-gradient(135deg,#6366f1,#3b82f6)', text: 'O catálogo de materiais com preço por m² agilizou demais meus orçamentos. Não erro mais no valor.' },
  { name: 'Patrícia Alves',   role: 'Visual Signs - Porto Alegre',         avatarBg: 'linear-gradient(135deg,#10b981,#0ea5e9)', text: 'Nunca mais perdi data de conta a pagar. Organizado por categoria e com alertas. Minha saúde financeira melhorou!' },
  { name: 'Roberto Costa',    role: 'RC Gráfica Rápida - Brasília',        avatarBg: 'linear-gradient(135deg,#f59e0b,#3b82f6)', text: 'Testei 3 sistemas antes. Esse é o único que funciona sem precisar chamar suporte. Simples, bonito e completo.' },
]

const plans = [
  {
    name: '🏷️ Starter', price: 'R$97', period: '/mês', featured: false,
    desc: 'Para quem está começando',
    cta: 'Testar 7 dias grátis',
    url: 'https://wa.me/5511940527609?text=Quero+assinar+o+plano+Starter+do+CV+Pro',
    items: [
      '1 conta de acesso',
      'Até 100 clientes',
      'Até 100 pedidos/mês',
      'Todas as funcionalidades',
      'Suporte por e-mail',
    ],
  },
  {
    name: '⚡ Pro', price: 'R$197', period: '/mês', featured: true,
    desc: 'Para empresas em crescimento',
    cta: 'Testar 7 dias grátis',
    url: 'https://wa.me/5511940527609?text=Quero+assinar+o+plano+Pro+do+CV+Pro',
    items: [
      'Até 500 clientes',
      'Até 5 operadores',
      'Até 300 pedidos/mês',
      'Todas as funcionalidades',
      'Suporte e-mail + chat',
    ],
  },
  {
    name: '🏆 Enterprise', price: 'R$297', period: '/mês', featured: false,
    desc: 'Para operações de alto volume',
    cta: 'Falar com a gente',
    url: 'https://wa.me/5511940527609?text=Quero+assinar+o+plano+Enterprise+do+CV+Pro',
    items: [
      'Clientes ilimitados',
      'Operadores ilimitados',
      'Pedidos ilimitados',
      'Todas as funcionalidades',
      'Suporte prioritário via WhatsApp',
      'Onboarding personalizado',
    ],
  },
]

const faqs = [
  { q: 'Preciso instalar alguma coisa?',         a: 'Não! O CV Pro é 100% online, funciona em qualquer celular ou computador, sem instalação.' },
  { q: 'Meus dados ficam seguros?',              a: 'Sim. Cada empresa tem seus dados completamente isolados. Usamos criptografia e backups automáticos.' },
  { q: 'Posso cancelar quando quiser?',          a: 'Sim, sem fidelidade e sem multa. Cancele quando quiser pelo painel ou pelo WhatsApp de suporte.' },
  { q: 'Quantos operadores posso adicionar?',    a: 'No plano Starter até 2 operadores. No Pro até 5. No Enterprise, ilimitados.' },
  { q: 'Funciona para diferentes tipos de serviço?', a: 'Sim! Cadastre adesivos, banners, placas, fachadas e qualquer outro serviço com preços individuais.' },
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
  box-shadow: 0 1px 0 #e0e7ff;
  border-bottom: 1px solid #e0e7ff;
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
  background: linear-gradient(135deg, #1e40af, #4f46e5);
  box-shadow: 0 2px 8px rgba(79,70,229,.35);
}
.nav-logo__text {
  font-size: 14px;
  font-weight: 900;
  letter-spacing: -0.02em;
  white-space: nowrap;
  background: linear-gradient(135deg, #1e40af, #4f46e5);
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
  color: rgba(30,41,59,.6);
  text-decoration: none;
  white-space: nowrap;
  transition: color .2s;
}
.nav-link:hover { color: #4f46e5; }
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
  color: #4f46e5;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 9999px;
  white-space: nowrap;
  transition: background .2s;
}
.nav-btn-ghost:hover { background: rgba(224,231,255,.8); }
.nav-btn-primary {
  display: inline-flex; align-items: center;
  font-size: 14px; font-weight: 700;
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 9999px;
  white-space: nowrap;
  background: linear-gradient(135deg, #1e40af, #4f46e5);
  box-shadow: 0 4px 14px rgba(79,70,229,.35);
  transition: transform .2s, box-shadow .2s;
}
.nav-btn-primary:hover { transform: scale(1.04); box-shadow: 0 6px 20px rgba(79,70,229,.45); }
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
.nav-hamburger:hover { background: rgba(224,231,255,.8); }
@media (max-width: 767px) { .nav-hamburger { display: flex; } }
.nav-hamburger__line {
  display: block;
  width: 22px; height: 2px;
  background: #4f46e5;
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
  border-top: 1px solid #e0e7ff;
  padding: 16px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.nav-mobile__link {
  font-size: 15px; font-weight: 600;
  color: rgba(30,41,59,.7);
  text-decoration: none;
  padding: 12px 8px;
  border-radius: 12px;
  transition: background .2s, color .2s;
}
.nav-mobile__link:hover { background: #eef2ff; color: #4f46e5; }
.nav-mobile__actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 12px;
  padding-top: 16px;
  border-top: 1px solid #e0e7ff;
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
  color: #6366f1;
  margin-bottom: 0.75rem;
}
.section-label::before {
  content: '';
  display: inline-block;
  width: 18px;
  height: 2px;
  border-radius: 9999px;
  background: linear-gradient(90deg, #6366f1, #3b82f6);
}
</style>
