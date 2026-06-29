// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  ssr: false,
  modules: ['@nuxtjs/tailwindcss'],
  tailwindcss: {
    configPath: '~/tailwind.config.ts',
  },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
      ],
      script: [
        {
          // Restaura tema do localStorage antes do primeiro render — elimina flash de cor
          innerHTML: `(function(){try{var t=localStorage.getItem('empresa_tema');if(!t)return;var c=JSON.parse(t);var r=document.documentElement;var s=r.style;var dir=c.grad_direction||'135deg';var p=c.cor_primaria||'#374151';var p2=c.cor_primaria_grad||null;var bg=c.cor_fundo||'#111827';var bg2=c.cor_fundo_grad||null;var sb=c.cor_sidebar||'#1f2937';var sb2=c.cor_sidebar_grad||null;s.setProperty('--color-primary',p);s.setProperty('--color-primary-text',c.cor_primaria_texto||'#ffffff');s.setProperty('--color-primary-bg',p2?'linear-gradient('+dir+','+p+','+p2+')':p);s.setProperty('--color-bg',bg2?'linear-gradient('+dir+','+bg+','+bg2+')':bg);s.setProperty('--color-sidebar',sb2?'linear-gradient('+dir+','+sb+','+sb2+')':sb);s.setProperty('--color-btn',c.cor_botao||'#374151');s.setProperty('--color-btn-text',c.cor_botao_texto||'#ffffff');s.setProperty('--color-icon',c.cor_icone||'#6b7280');}catch(e){}})();`,
          type: 'text/javascript',
        },
      ],
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap',
        },
      ],
    },
  },
  components: {
    dirs: [
      '~/components',
      '~/components/kanban',
    ],
  },
  runtimeConfig: {
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY,
    },
  },
})