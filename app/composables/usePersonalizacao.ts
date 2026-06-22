import { useState } from '#app'
import { ref } from 'vue'
import { createSupabaseClient } from '~/lib/supabase'
import { useEmpresa } from './useEmpresa'

export interface PersonalizacaoConfig {
  cor_primaria: string
  cor_primaria_texto: string
  cor_fundo: string
  cor_sidebar: string
  cor_card: string
  cor_card_texto: string
  nome_empresa: string
  logo_url: string | null
  logo_size: string
  // Gradiente opcional — segunda cor
  cor_primaria_grad: string | null
  cor_fundo_grad: string | null
  cor_sidebar_grad: string | null
  cor_card_grad: string | null
  // Direção do gradiente
  grad_direction: string
  // Botão e ícone separados da cor principal
  cor_botao: string
  cor_botao_texto: string
  cor_icone: string
}

const DEFAULTS: PersonalizacaoConfig = {
  cor_primaria: '#ec4899',
  cor_primaria_texto: '#ffffff',
  cor_fundo: '#f9fafb',
  cor_sidebar: '#ec4899',
  cor_card: '#ffffff',
  cor_card_texto: '#374151',
  nome_empresa: '',
  logo_url: null,
  logo_size: 'md',
  cor_primaria_grad: '#a855f7',
  cor_fundo_grad: null,
  cor_sidebar_grad: '#a855f7',
  cor_card_grad: null,
  grad_direction: '135deg',
  cor_botao: '#ffffff',
  cor_botao_texto: '#ec4899',
  cor_icone: '#ffffff',
}

export function usePersonalizacao() {
  const supabase = createSupabaseClient()
  const { empresaId, loadEmpresa } = useEmpresa()

  const config = useState<PersonalizacaoConfig>('personalizacao_config', () => ({ ...DEFAULTS }))
  const loading = ref(false)
  const saving = ref(false)
  const uploadingLogo = ref(false)
  const error = ref<string | null>(null)

  async function loadPersonalizacao(apply = true) {
    await loadEmpresa()
    if (!empresaId.value) return

    const [personalizacaoRes, empresaRes] = await Promise.all([
      supabase.from('empresa_personalizacao').select('*').eq('empresa_id', empresaId.value).maybeSingle(),
      supabase.from('empresas').select('nome').eq('id', empresaId.value).maybeSingle(),
    ])

    if (personalizacaoRes.error) {
      console.error('[usePersonalizacao] load error:', personalizacaoRes.error.message)
      return
    }

    const nomeEmpresaFallback = empresaRes.data?.nome ?? ''
    const data = personalizacaoRes.data

    if (data) {
      config.value = {
        cor_primaria:        data.cor_primaria        ?? DEFAULTS.cor_primaria,
        cor_primaria_texto:  data.cor_primaria_texto  ?? DEFAULTS.cor_primaria_texto,
        cor_fundo:           data.cor_fundo           ?? DEFAULTS.cor_fundo,
        cor_sidebar:         data.cor_sidebar         ?? DEFAULTS.cor_sidebar,
        cor_card:            data.cor_card            ?? DEFAULTS.cor_card,
        cor_card_texto:      data.cor_card_texto      ?? DEFAULTS.cor_card_texto,
        nome_empresa:        data.nome_empresa ?? nomeEmpresaFallback,
        logo_url:            data.logo_url            ?? null,
        logo_size:           data.logo_size           ?? DEFAULTS.logo_size,
        cor_primaria_grad:   data.cor_primaria_grad   ?? null,
        cor_fundo_grad:      data.cor_fundo_grad      ?? null,
        cor_sidebar_grad:    data.cor_sidebar_grad    ?? null,
        cor_card_grad:       data.cor_card_grad       ?? null,
        grad_direction:      data.grad_direction      ?? DEFAULTS.grad_direction,
        cor_botao:           data.cor_botao           ?? DEFAULTS.cor_botao,
        cor_botao_texto:     data.cor_botao_texto     ?? DEFAULTS.cor_botao_texto,
        cor_icone:           data.cor_icone           ?? DEFAULTS.cor_icone,
      }
    } else {
      // Sem personalização configurada — usa defaults com o nome real da empresa
      config.value = { ...DEFAULTS, nome_empresa: nomeEmpresaFallback }
    }

    if (apply) applyTheme(config.value)

  }

  async function savePersonalizacao(newConfig: PersonalizacaoConfig) {
    await loadEmpresa()
    if (!empresaId.value) {
      error.value = 'Empresa não identificada. Faça login novamente.'
      return false
    }

    saving.value = true
    error.value = null

    const payload = {
      empresa_id:          empresaId.value,
      cor_primaria:        newConfig.cor_primaria,
      cor_primaria_texto:  newConfig.cor_primaria_texto,
      cor_fundo:           newConfig.cor_fundo,
      cor_sidebar:         newConfig.cor_sidebar,
      cor_card:            newConfig.cor_card           ?? DEFAULTS.cor_card,
      cor_card_texto:      newConfig.cor_card_texto     ?? DEFAULTS.cor_card_texto,
      nome_empresa:        newConfig.nome_empresa,
      logo_url:            newConfig.logo_url,
      logo_size:           newConfig.logo_size          ?? DEFAULTS.logo_size,
      cor_primaria_grad:   newConfig.cor_primaria_grad   ?? null,
      cor_fundo_grad:      newConfig.cor_fundo_grad      ?? null,
      cor_sidebar_grad:    newConfig.cor_sidebar_grad    ?? null,
      cor_card_grad:       newConfig.cor_card_grad       ?? null,
      grad_direction:      newConfig.grad_direction      ?? DEFAULTS.grad_direction,
      cor_botao:           newConfig.cor_botao           ?? DEFAULTS.cor_botao,
      cor_botao_texto:     newConfig.cor_botao_texto     ?? DEFAULTS.cor_botao_texto,
      cor_icone:           newConfig.cor_icone           ?? DEFAULTS.cor_icone,
      updated_at:          new Date().toISOString(),
    }

    const { data, error: err } = await supabase
      .from('empresa_personalizacao')
      .upsert(payload, { onConflict: 'empresa_id' })
      .select()
      .single()

    saving.value = false

    if (err) {
      error.value = 'Erro ao salvar personalização: ' + err.message
      console.error('[usePersonalizacao] save error:', err)
      return false
    }

    if (!data) {
      error.value = 'Não foi possível salvar. Verifique suas permissões.'
      return false
    }

    config.value = { ...newConfig }
    applyTheme(config.value)
    return true
  }

  async function uploadLogo(file: File): Promise<string | null> {
    await loadEmpresa()
    if (!empresaId.value) return null

    uploadingLogo.value = true
    error.value = null

    // Valida tipo e tamanho
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      error.value = 'Formato inválido. Use PNG, JPG, WebP ou SVG.'
      uploadingLogo.value = false
      return null
    }
    if (file.size > 2 * 1024 * 1024) {
      error.value = 'Arquivo muito grande. Máximo 2MB.'
      uploadingLogo.value = false
      return null
    }

    const ext = file.name.split('.').pop()
    const path = `logos/${empresaId.value}/logo.${ext}`

    const { error: uploadErr } = await supabase.storage
      .from('empresa-assets')
      .upload(path, file, { upsert: true, contentType: file.type })

    uploadingLogo.value = false

    if (uploadErr) {
      error.value = 'Erro ao enviar logo: ' + uploadErr.message
      return null
    }

    const { data } = supabase.storage
      .from('empresa-assets')
      .getPublicUrl(path)

    return `${data.publicUrl}?t=${Date.now()}`
  }

  function applyTheme(cfg: PersonalizacaoConfig) {
    if (typeof document === 'undefined') return
    const root = document.documentElement

    // Persiste no localStorage para restauração imediata no próximo carregamento
    try { localStorage.setItem('empresa_tema', JSON.stringify(cfg)) } catch {}

    const dir = cfg.grad_direction ?? '135deg'

    // ── Cor primária (com ou sem gradiente) ─────────────────────
    const primaryBg = cfg.cor_primaria_grad
      ? `linear-gradient(${dir}, ${cfg.cor_primaria}, ${cfg.cor_primaria_grad})`
      : cfg.cor_primaria

    // ── Fundo (com ou sem gradiente) ────────────────────────────
    const bgValue = cfg.cor_fundo_grad
      ? `linear-gradient(${dir}, ${cfg.cor_fundo}, ${cfg.cor_fundo_grad})`
      : cfg.cor_fundo

    // ── Sidebar (com ou sem gradiente) ──────────────────────────
    const sidebarBg = cfg.cor_sidebar_grad
      ? `linear-gradient(${dir}, ${cfg.cor_sidebar}, ${cfg.cor_sidebar_grad})`
      : cfg.cor_sidebar

    // ── Variáveis base ──────────────────────────────────────────
    root.style.setProperty('--color-primary',        cfg.cor_primaria)
    root.style.setProperty('--color-primary-text',   cfg.cor_primaria_texto)
    root.style.setProperty('--color-bg',             bgValue)
    root.style.setProperty('--color-sidebar',        sidebarBg)
    root.style.setProperty('--color-primary-bg',     primaryBg)
    root.style.setProperty('--grad-direction',       dir)

    // ── Variantes automáticas ───────────────────────────────────
    root.style.setProperty('--color-primary-5',      hexToRgba(cfg.cor_primaria, 0.05))
    root.style.setProperty('--color-primary-10',     hexToRgba(cfg.cor_primaria, 0.10))
    root.style.setProperty('--color-primary-12',     hexToRgba(cfg.cor_primaria, 0.12))
    root.style.setProperty('--color-primary-15',     hexToRgba(cfg.cor_primaria, 0.15))
    root.style.setProperty('--color-primary-20',     hexToRgba(cfg.cor_primaria, 0.20))
    root.style.setProperty('--color-primary-30',     hexToRgba(cfg.cor_primaria, 0.30))
    root.style.setProperty('--color-primary-light',  hexToRgba(cfg.cor_primaria, 0.12))
    root.style.setProperty('--color-primary-border', hexToRgba(cfg.cor_primaria, 0.30))

    // Shades claras/escuras derivadas via luminância
    root.style.setProperty('--color-primary-50',  lighten(cfg.cor_primaria, 0.90))
    root.style.setProperty('--color-primary-100', lighten(cfg.cor_primaria, 0.80))
    root.style.setProperty('--color-primary-200', lighten(cfg.cor_primaria, 0.60))
    root.style.setProperty('--color-primary-300', lighten(cfg.cor_primaria, 0.40))
    root.style.setProperty('--color-primary-400', lighten(cfg.cor_primaria, 0.20))
    root.style.setProperty('--color-primary-500', cfg.cor_primaria)
    root.style.setProperty('--color-primary-600', darken(cfg.cor_primaria, 0.10))
    root.style.setProperty('--color-primary-700', darken(cfg.cor_primaria, 0.20))
    root.style.setProperty('--color-primary-800', darken(cfg.cor_primaria, 0.35))
    root.style.setProperty('--color-primary-900', darken(cfg.cor_primaria, 0.50))

    // ── Botão e ícone separados ──────────────────────────────────
    root.style.setProperty('--color-btn',          cfg.cor_botao)
    root.style.setProperty('--color-btn-text',     cfg.cor_botao_texto)
    root.style.setProperty('--color-icon',         cfg.cor_icone)
    root.style.setProperty('--color-icon-10',      hexToRgba(cfg.cor_icone, 0.10))
    root.style.setProperty('--color-icon-light',   hexToRgba(cfg.cor_icone, 0.12))
    root.style.setProperty('--color-icon-border',  hexToRgba(cfg.cor_icone, 0.30))

    // ── Card (background + texto) ────────────────────────────────
    const cardBg = cfg.cor_card_grad
      ? `linear-gradient(${dir}, ${cfg.cor_card}, ${cfg.cor_card_grad})`
      : cfg.cor_card
    root.style.setProperty('--color-card',         cardBg)
    root.style.setProperty('--color-card-texto',   cfg.cor_card_texto)
    // Detectar se é card escuro para ajustar borda
    const isCardDark = isColorDark(cfg.cor_card)
    root.style.setProperty('--color-card-border',  isCardDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)')

    // ── Injeta CSS global para sobrescrever classes Tailwind pink ──
    injectGlobalThemeCSS(cfg)
  }

  function injectGlobalThemeCSS(cfg: PersonalizacaoConfig) {
    const styleId = 'upstudio-theme-override'
    let el = document.getElementById(styleId) as HTMLStyleElement | null
    if (!el) {
      el = document.createElement('style')
      el.id = styleId
      document.head.appendChild(el)
    }

    const p   = cfg.cor_primaria
    const p2  = cfg.cor_primaria_grad
    const dir = cfg.grad_direction ?? '135deg'

    // Gradiente principal usado nos cabeçalhos das páginas
    const headerGrad = p2
      ? `linear-gradient(${dir}, ${darken(p, 0.10)}, ${p}, ${p2})`
      : `linear-gradient(${dir}, ${darken(p, 0.15)}, ${p}, ${lighten(p, 0.15)})`

    el.textContent = `
      /* ── Backgrounds ── */
      .bg-pink-50  { background-color: ${lighten(p, 0.90)} !important; }
      .bg-pink-100 { background-color: ${lighten(p, 0.80)} !important; }
      .bg-pink-200 { background-color: ${lighten(p, 0.60)} !important; }
      .bg-pink-300 { background-color: ${lighten(p, 0.40)} !important; }
      .bg-pink-400 { background-color: ${lighten(p, 0.20)} !important; }
      .bg-pink-500 { background-color: ${p} !important; }
      .bg-pink-600 { background-color: ${darken(p, 0.10)} !important; }
      .bg-pink-700 { background-color: ${darken(p, 0.20)} !important; }
      .bg-pink-800 { background-color: ${darken(p, 0.35)} !important; }
      .bg-pink-900 { background-color: ${darken(p, 0.50)} !important; }
      .bg-rose-400 { background-color: ${lighten(p, 0.15)} !important; }

      /* ── Textos ── */
      .text-pink-400 { color: ${lighten(p, 0.20)} !important; }
      .text-pink-500 { color: ${p} !important; }
      .text-pink-600 { color: ${darken(p, 0.10)} !important; }
      .text-pink-700 { color: ${darken(p, 0.20)} !important; }
      .text-pink-300 { color: ${lighten(p, 0.40)} !important; }
      .text-pink-100 { color: ${lighten(p, 0.80)} !important; }

      /* ── Bordas ── */
      .border-pink-100 { border-color: ${lighten(p, 0.80)} !important; }
      .border-pink-200 { border-color: ${lighten(p, 0.60)} !important; }
      .border-pink-300 { border-color: ${lighten(p, 0.40)} !important; }
      .border-pink-500 { border-color: ${p} !important; }

      /* ── Ring/focus ── */
      .focus\\:ring-pink-300:focus { --tw-ring-color: ${lighten(p, 0.40)} !important; }
      .focus\\:ring-pink-400:focus { --tw-ring-color: ${lighten(p, 0.20)} !important; }

      /* ── Gradientes (cabeçalhos das páginas) ── */
      .from-pink-600 { --tw-gradient-from: ${darken(p, 0.10)} !important; }
      .from-pink-500 { --tw-gradient-from: ${p} !important; }
      .from-pink-400 { --tw-gradient-from: ${lighten(p, 0.20)} !important; }
      .via-pink-500  { --tw-gradient-via: ${p} !important; }
      .to-pink-600   { --tw-gradient-to: ${darken(p, 0.10)} !important; }
      .to-pink-400   { --tw-gradient-to: ${lighten(p, 0.20)} !important; }
      .to-rose-400   { --tw-gradient-to: ${p2 ?? lighten(p, 0.15)} !important; }

      /* ── Gradiente composto nos headers das páginas ── */
      .bg-gradient-to-br.from-pink-600 {
        background-image: ${headerGrad} !important;
      }

      /* ── Hover states ── */
      .hover\\:bg-pink-50:hover  { background-color: ${lighten(p, 0.90)} !important; }
      .hover\\:bg-pink-100:hover { background-color: ${lighten(p, 0.80)} !important; }
      .hover\\:bg-pink-400:hover { background-color: ${lighten(p, 0.20)} !important; }
      .hover\\:bg-pink-600:hover { background-color: ${darken(p, 0.10)} !important; }
      .hover\\:text-pink-500:hover { color: ${p} !important; }
      .hover\\:text-pink-600:hover { color: ${darken(p, 0.10)} !important; }
      .hover\\:text-pink-700:hover { color: ${darken(p, 0.20)} !important; }
      .hover\\:border-pink-200:hover { border-color: ${lighten(p, 0.60)} !important; }
      .hover\\:border-pink-300:hover { border-color: ${lighten(p, 0.40)} !important; }
      .hover\\:border-pink-400:hover { border-color: ${lighten(p, 0.20)} !important; }

      /* ── Shadow pink ── */
      .shadow-pink-200\\/40 { --tw-shadow-color: ${hexToRgba(p, 0.4)} !important; box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), 0 4px 6px -1px ${hexToRgba(p, 0.4)} !important; }
      .shadow-pink-900\\/40 { --tw-shadow-color: ${hexToRgba(darken(p, 0.50), 0.4)} !important; }

      /* ── exact-active-class da nav bottom ── */
      .text-pink-600.bg-pink-100 { background-color: ${lighten(p, 0.80)} !important; color: ${darken(p, 0.10)} !important; }

      /* ── Classe hardcoded #ff46a2 gerada pelo Tailwind JIT ── */
      .text-\\[\\#ff46a2\\] { color: ${p} !important; }
      .hover\\:text-\\[\\#ff46a2\\]:hover { color: ${p} !important; }
      .bg-\\[\\#ff46a2\\] { background-color: ${p} !important; }
      .hover\\:bg-\\[\\#ff46a2\\]:hover { background-color: ${p} !important; }
      .border-\\[\\#ff46a2\\] { border-color: ${p} !important; }

      /* ── Spinner de loading ── */
      .border-t-transparent { border-top-color: transparent !important; }

      /* ── Cards (fundo + texto) ── */
      .bg-white.rounded-3xl,
      .bg-white.rounded-2xl,
      .bg-white.rounded-xl,
      .bg-white.shadow-sm,
      .bg-white.shadow-md,
      .bg-white.border {
        ${cfg.cor_card_grad
          ? `background: linear-gradient(${cfg.grad_direction ?? '135deg'}, ${cfg.cor_card}, ${cfg.cor_card_grad}) !important;`
          : `background-color: ${cfg.cor_card} !important;`}
        color: ${cfg.cor_card_texto} !important;
        border-color: ${isColorDark(cfg.cor_card) ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'} !important;
      }
      .bg-white.rounded-3xl .text-gray-800,
      .bg-white.rounded-2xl .text-gray-800,
      .bg-white.rounded-xl .text-gray-800,
      .bg-white.shadow-sm .text-gray-800,
      .bg-white.shadow-md .text-gray-800 {
        color: ${cfg.cor_card_texto} !important;
      }
      .bg-white.rounded-3xl .text-gray-400,
      .bg-white.rounded-2xl .text-gray-400,
      .bg-white.rounded-xl .text-gray-400,
      .bg-white.shadow-sm .text-gray-400 {
        color: ${isColorDark(cfg.cor_card) ? 'rgba(255,255,255,0.5)' : '#9ca3af'} !important;
      }
      /* Overrides para tema dark */
      ${isColorDark(cfg.cor_card) ? `
      .bg-gray-50, .bg-gray-50\\/80, .bg-gray-50\\/50, .bg-gray-100 {
        background-color: rgba(255,255,255,0.04) !important;
        color: ${cfg.cor_card_texto} !important;
      }
      .bg-white {
        background-color: ${cfg.cor_card} !important;
        color: ${cfg.cor_card_texto} !important;
      }
      .border-gray-100, .border-gray-200, .border-gray-50 {
        border-color: rgba(255,255,255,0.06) !important;
      }
      .divide-gray-50 > * + *, .divide-gray-100 > * + * {
        border-color: rgba(255,255,255,0.06) !important;
      }
      .text-gray-800, .text-gray-900, .text-gray-950 {
        color: ${cfg.cor_card_texto} !important;
      }
      .text-gray-600, .text-gray-700 {
        color: rgba(255,255,255,0.7) !important;
      }
      .text-gray-500 {
        color: rgba(255,255,255,0.5) !important;
      }
      .text-gray-400 {
        color: rgba(255,255,255,0.4) !important;
      }
      .text-gray-300 {
        color: rgba(255,255,255,0.3) !important;
      }
      /* Placeholder text */
      ::placeholder {
        color: rgba(255,255,255,0.3) !important;
      }
      /* Inputs e selects */
      input, select, textarea {
        background-color: rgba(255,255,255,0.05) !important;
        color: ${cfg.cor_card_texto} !important;
        border-color: rgba(255,255,255,0.1) !important;
      }
      input:focus, select:focus, textarea:focus {
        border-color: ${cfg.cor_primaria} !important;
      }
      /* Links e textos indigo/blue hardcoded */
      .text-indigo-600, .text-indigo-700, .text-blue-600, .text-blue-700 {
        color: ${lighten(cfg.cor_primaria, 0.20)} !important;
      }
      .text-indigo-500, .text-blue-500 {
        color: ${cfg.cor_primaria} !important;
      }
      /* Font semibold/bold em cards */
      .font-semibold, .font-bold, .font-black {
        color: inherit;
      }
      /* Proteger textos brancos em headers/overlays — nunca sobrescrever */
      .text-white { color: #ffffff !important; }
      .text-white\\/70 { color: rgba(255,255,255,0.7) !important; }
      .text-white\\/80 { color: rgba(255,255,255,0.8) !important; }
      .text-white\\/60 { color: rgba(255,255,255,0.6) !important; }
      .text-white\\/50 { color: rgba(255,255,255,0.5) !important; }
      .text-white\\/40 { color: rgba(255,255,255,0.4) !important; }
      /* Stats no header — texto sempre segue primary-text */
      .header-stats * {
        color: var(--color-primary-text, #ffffff) !important;
      }
      .header-stats .stat-label {
        opacity: 0.7 !important;
      }
      /* Badges/tags que usam bg-gray-100 text-gray-600 */
      .bg-gray-100.text-gray-600 {
        background-color: rgba(255,255,255,0.08) !important;
        color: rgba(255,255,255,0.7) !important;
      }
      .shadow-sm, .shadow-md {
        box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;
      }
      table thead, table thead tr {
        background-color: rgba(255,255,255,0.03) !important;
      }
      table thead th {
        color: rgba(255,255,255,0.5) !important;
      }
      /* Hover rows */
      tr:hover, .hover\\:bg-indigo-50\\/30:hover, .hover\\:bg-gray-50:hover {
        background-color: rgba(255,255,255,0.03) !important;
      }
      /* Modals e dropdowns */
      .bg-white.rounded-2xl, .bg-white.rounded-xl, .bg-white.rounded-3xl {
        background-color: ${cfg.cor_card} !important;
        color: ${cfg.cor_card_texto} !important;
      }
      /* Todas as seções bg-white dentro de modais (fixed overlays) */
      .fixed .bg-white, [class*="fixed"] .bg-white {
        background-color: ${cfg.cor_card} !important;
        color: ${cfg.cor_card_texto} !important;
      }
      /* Footer e sub-seções de modais */
      .bg-gray-50\\/50, .bg-gray-50\\/70 {
        background-color: rgba(255,255,255,0.03) !important;
        color: ${cfg.cor_card_texto} !important;
      }
      /* Labels de formulário em modais */
      label {
        color: ${cfg.cor_card_texto} !important;
        opacity: 0.7;
      }
      ` : ''}

      /* ═══ Veículos — amber → cor primária ═══ */
      .bg-amber-50  { background-color: ${lighten(p, 0.90)} !important; }
      .bg-amber-100 { background-color: ${lighten(p, 0.80)} !important; }
      .bg-amber-200 { background-color: ${lighten(p, 0.60)} !important; }
      .bg-amber-400 { background-color: ${lighten(p, 0.20)} !important; }
      .bg-amber-500 { background-color: ${p} !important; }
      .bg-amber-600 { background-color: ${darken(p, 0.10)} !important; }
      .text-amber-400 { color: ${lighten(p, 0.20)} !important; }
      .text-amber-500 { color: ${p} !important; }
      .text-amber-600 { color: ${darken(p, 0.10)} !important; }
      .text-amber-700 { color: ${darken(p, 0.20)} !important; }
      .border-amber-200 { border-color: ${lighten(p, 0.60)} !important; }
      .border-amber-400 { border-color: ${lighten(p, 0.20)} !important; }
      .from-amber-500 { --tw-gradient-from: ${p} !important; }
      .to-amber-500   { --tw-gradient-to: ${p} !important; }
      .hover\\:bg-amber-50:hover { background-color: ${lighten(p, 0.90)} !important; }
      input[type=range].accent-amber-500 { accent-color: ${p} !important; }

      /* ═══ Botões de ação ═══ */
      .inline-flex.rounded-xl.shadow-lg {
        background-color: ${cfg.cor_botao || p} !important;
        color: ${cfg.cor_botao_texto || '#ffffff'} !important;
      }
      .inline-flex.rounded-xl.shadow-lg:hover {
        background-color: ${darken(cfg.cor_botao || p, 0.08)} !important;
      }
    `
  }

  function hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  /** Detecta se uma cor hex é escura (luminância < 0.4) */
  function isColorDark(hex: string): boolean {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
    return luminance < 0.4
  }

  /** Mistura a cor com branco (amount 0–1: 1 = branco puro) */
  function lighten(hex: string, amount: number): string {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    const lr = Math.round(r + (255 - r) * amount)
    const lg = Math.round(g + (255 - g) * amount)
    const lb = Math.round(b + (255 - b) * amount)
    return `rgb(${lr}, ${lg}, ${lb})`
  }

  /** Mistura a cor com preto (amount 0–1: 1 = preto puro) */
  function darken(hex: string, amount: number): string {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    const dr = Math.round(r * (1 - amount))
    const dg = Math.round(g * (1 - amount))
    const db = Math.round(b * (1 - amount))
    return `rgb(${dr}, ${dg}, ${db})`
  }

  function resetToDefaults() {
    config.value = { ...DEFAULTS }
    applyTheme(config.value)
  }

  /** Carrega personalização pelo ID da empresa sem exigir login — para páginas públicas (/loja) */
  async function loadPersonalizacaoPublic(eId: number) {
    // Busca personalização e nome da empresa em paralelo
    const [personalizacaoRes, empresaRes] = await Promise.all([
      supabase.from('empresa_personalizacao').select('*').eq('empresa_id', eId).maybeSingle(),
      supabase.from('empresas').select('nome').eq('id', eId).maybeSingle(),
    ])

    if (personalizacaoRes.error) {
      console.error('[usePersonalizacao] public load error:', personalizacaoRes.error.message)
    }

    // Nome da empresa: prioridade para o campo configurado, fallback para empresas.nome
    const nomeEmpresaFallback = empresaRes.data?.nome ?? ''

    const data = personalizacaoRes.data
    if (data) {
      config.value = {
        cor_primaria:        data.cor_primaria        ?? DEFAULTS.cor_primaria,
        cor_primaria_texto:  data.cor_primaria_texto  ?? DEFAULTS.cor_primaria_texto,
        cor_fundo:           data.cor_fundo           ?? DEFAULTS.cor_fundo,
        cor_sidebar:         data.cor_sidebar         ?? DEFAULTS.cor_sidebar,
        cor_card:            data.cor_card            ?? DEFAULTS.cor_card,
        cor_card_texto:      data.cor_card_texto      ?? DEFAULTS.cor_card_texto,
        nome_empresa:        data.nome_empresa ?? nomeEmpresaFallback,
        logo_url:            data.logo_url            ?? null,
        logo_size:           data.logo_size           ?? DEFAULTS.logo_size,
        cor_primaria_grad:   data.cor_primaria_grad   ?? null,
        cor_fundo_grad:      data.cor_fundo_grad      ?? null,
        cor_sidebar_grad:    data.cor_sidebar_grad    ?? null,
        cor_card_grad:       data.cor_card_grad       ?? null,
        grad_direction:      data.grad_direction      ?? DEFAULTS.grad_direction,
        cor_botao:           data.cor_botao           ?? DEFAULTS.cor_botao,
        cor_botao_texto:     data.cor_botao_texto     ?? DEFAULTS.cor_botao_texto,
        cor_icone:           data.cor_icone           ?? DEFAULTS.cor_icone,
      }
    } else {
      // Sem personalização configurada — usa o nome real da empresa sem fallback fixo
      config.value = { ...DEFAULTS, nome_empresa: nomeEmpresaFallback }
    }

    applyTheme(config.value)
  }

  return {
    config,
    loading,
    saving,
    uploadingLogo,
    error,
    loadPersonalizacao,
    loadPersonalizacaoPublic,
    savePersonalizacao,
    uploadLogo,
    applyTheme,
    resetToDefaults,
    DEFAULTS,
  }
}
