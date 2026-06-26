import type { Config } from 'tailwindcss'

export default {
  content: [],
  theme: {
    extend: {
      keyframes: {
        progress: {
          '0%':   { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        progress: 'progress 2s linear infinite',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // ─── Paleta estática (para cores de status/feedback) ─────────────────
        green: {
          50:  '#f0faf0',
          100: '#d9f2d9',
          200: '#b3e6b3',
          300: '#7dd17d',
          400: '#4db84d',
          500: '#2e9e2e',
          600: '#1f7f1f',
          700: '#165f16',
          800: '#0e3f0e',
          900: '#072007',
        },
        orange: {
          50:  '#fff8f0',
          100: '#feecd8',
          200: '#fdd4a8',
          300: '#fbb46a',
          400: '#f8902f',
          500: '#f07010',
          600: '#d4570a',
          700: '#a83f07',
          800: '#7a2b05',
          900: '#4d1a02',
        },
        navy: {
          50:  '#eef2f8',
          100: '#d5dff0',
          200: '#aabfe0',
          300: '#7095c8',
          400: '#3f6aad',
          500: '#254d8e',
          600: '#1a3b72',
          700: '#112b56',
          800: '#0a1c39',
          900: '#040e1e',
        },

        // ─── Tokens dinâmicos do tema (mapeiam para variáveis CSS) ───────────
        // Uso: bg-primary, text-primary, border-primary, etc.
        primary: {
          DEFAULT: 'var(--color-primary, #374151)',
          text:    'var(--color-primary-text, #ffffff)',
          bg:      'var(--color-primary-bg, #1f2937)',
          light:   'var(--color-primary-light, rgba(55,65,81,0.12))',
          border:  'var(--color-primary-border, rgba(55,65,81,0.30))',
          // Variantes com opacidade pré-calculada
          5:       'var(--color-primary-5,  rgba(55,65,81,0.05))',
          10:      'var(--color-primary-10, rgba(55,65,81,0.10))',
          12:      'var(--color-primary-12, rgba(55,65,81,0.12))',
          15:      'var(--color-primary-15, rgba(55,65,81,0.15))',
          20:      'var(--color-primary-20, rgba(55,65,81,0.20))',
          30:      'var(--color-primary-30, rgba(55,65,81,0.30))',
          // Escala numérica (gerada pelo applyTheme)
          50:      'var(--color-primary-50,  #f9fafb)',
          100:     'var(--color-primary-100, #f3f4f6)',
          200:     'var(--color-primary-200, #e5e7eb)',
          300:     'var(--color-primary-300, #d1d5db)',
          400:     'var(--color-primary-400, #9ca3af)',
          500:     'var(--color-primary-500, #6b7280)',
          600:     'var(--color-primary-600, #4b5563)',
          700:     'var(--color-primary-700, #374151)',
          800:     'var(--color-primary-800, #1f2937)',
          900:     'var(--color-primary-900, #111827)',
        },

        // ─── Superfícies do tema ─────────────────────────────────────────────
        theme: {
          card:       'var(--color-card,        #ffffff)',
          'card-text':'var(--color-card-texto,  #1e293b)',
          sidebar:    'var(--color-sidebar,     #1f2937)',
          bg:         'var(--color-bg,          #111827)',
          btn:        'var(--color-btn,         #374151)',
          'btn-text': 'var(--color-btn-text,   #ffffff)',
          icon:       'var(--color-icon,        #6b7280)',
        },

        // ─── Feedback (estáticos — cores semânticas universais) ───────────────
        success: {
          DEFAULT: '#2e9e2e',
          light:   '#d9f2d9',
          text:    '#0e3f0e',
        },
        warning: {
          DEFAULT: '#f07010',
          light:   '#feecd8',
          text:    '#7a2b05',
        },
        error: {
          DEFAULT: '#c0392b',
          light:   '#fef2f2',
          text:    '#7f1d1d',
        },
        info: {
          DEFAULT: '#254d8e',
          light:   '#eef2f8',
          text:    '#040e1e',
        },
      },

      // ─── Escala tipográfica premium ────────────────────────────────────────
      fontSize: {
        'display': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.025em', fontWeight: '700' }],
        'h1':      ['1.75rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h2':      ['1.375rem', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h3':      ['1rem', { lineHeight: '1.3', fontWeight: '600' }],
        'body':    ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }],
        'caption': ['0.75rem', { lineHeight: '1.5', fontWeight: '400' }],
      },

      // ─── Escala de sombras padronizada ───────────────────────────────────
      boxShadow: {
        'card':       '0 1px 3px 0 rgb(0 0 0 / .04), 0 1px 2px -1px rgb(0 0 0 / .04)',
        'card-hover': '0 4px 12px -2px rgb(0 0 0 / .08), 0 2px 4px -2px rgb(0 0 0 / .04)',
        'panel':      '0 4px 6px -1px rgb(0 0 0 / .06), 0 2px 4px -2px rgb(0 0 0 / .05)',
        'modal':      '0 20px 60px -12px rgb(0 0 0 / .25), 0 8px 20px -8px rgb(0 0 0 / .1)',
        'header':     '0 10px 15px -3px rgb(0 0 0 / .08), 0 4px 6px -4px rgb(0 0 0 / .06)',
      },

      // ─── Raio de borda padronizado ────────────────────────────────────────
      borderRadius: {
        'badge':  '9999px',
        'input':  '0.5rem',    // 8px
        'btn':    '0.5rem',    // 8px
        'btn-lg': '0.625rem',  // 10px
        'card':   '0.75rem',   // 12px
        'panel':  '1rem',      // 16px
        'modal':  '1rem',      // 16px
        'header': '1rem',
      },
    },
  },
  plugins: [],
} satisfies Config
