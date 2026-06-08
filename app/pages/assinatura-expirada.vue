<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-5 font-sans antialiased" style="background: linear-gradient(180deg, #f0fdfa 0%, #ecfeff 100%)">

    <!-- Ícone -->
    <div class="w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl mb-8" style="background: linear-gradient(135deg, #0d9488, #0891b2)">
      <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
      </svg>
    </div>

    <!-- Texto -->
    <h1 class="text-3xl sm:text-4xl font-black text-center mb-3" style="color: #0f766e">
      {{ plano === 'bloqueado' ? 'Acesso suspenso' : 'Seu período de teste encerrou' }}
    </h1>
    <p class="text-teal-900/60 text-center max-w-sm mb-10 leading-relaxed">
      {{ plano === 'bloqueado'
        ? 'Sua conta foi suspensa. Entre em contato pelo WhatsApp para reativar.'
        : 'Os 7 dias gratuitos chegaram ao fim. Escolha um plano para continuar.' }}
    </p>

    <!-- Planos -->
    <div v-if="plano !== 'bloqueado'" class="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
      <div
        v-for="p in planos" :key="p.nome"
        class="rounded-2xl p-5 border flex flex-col gap-3"
        :class="p.destaque ? 'border-teal-400 shadow-xl shadow-teal-100/60' : 'border-teal-100 bg-white'"
        :style="p.destaque ? 'background: linear-gradient(135deg,#f0fdfa,#ecfeff)' : ''"
      >
        <div>
          <p class="text-sm font-black" style="color: #0f766e">{{ p.nome }}</p>
          <p class="text-xs text-teal-900/50">{{ p.desc }}</p>
        </div>
        <p class="text-2xl font-black" style="color: #0d9488">
          {{ p.preco }}<span class="text-sm font-normal text-teal-900/50">/mês</span>
        </p>
        <a
          :href="`https://wa.me/SEU_NUMERO?text=Quero+assinar+o+plano+${encodeURIComponent(p.nome)}`"
          target="_blank" rel="noopener noreferrer"
          class="text-center text-sm font-bold py-2.5 rounded-xl transition-all hover:scale-105"
          :style="p.destaque
            ? 'background: linear-gradient(135deg,#0d9488,#0891b2); color:#fff'
            : 'background:#f0fdfa; color:#0f766e; border:1px solid #99f6e4'"
        >
          Assinar {{ p.nome }}
        </a>
      </div>
    </div>

    <!-- CTA WhatsApp -->
    <a
      href="https://wa.me/SEU_NUMERO"
      target="_blank" rel="noopener noreferrer"
      class="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-black text-white text-sm shadow-lg transition-all hover:scale-105"
      style="background: linear-gradient(135deg, #22c55e, #16a34a); box-shadow: 0 8px 24px rgba(34,197,94,0.3)"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      Falar com suporte no WhatsApp
    </a>

    <!-- Logout -->
    <button
      type="button"
      class="mt-6 text-sm text-teal-900/40 hover:text-teal-900/70 transition-colors"
      @click="handleLogout"
    >
      Sair da conta
    </button>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { createSupabaseClient } from '~/lib/supabase'

definePageMeta({ layout: false })

const router = useRouter()
const { logout } = useAuth()
const plano = ref<string>('trial')

const planos = [
  { nome: '💅 Essencial', preco: 'R$57',  desc: '1 conta · Até 100 clientes',                  destaque: false },
  { nome: '✨ Pro',        preco: 'R$97',  desc: 'Até 200 clientes · Até 3 funcionárias',    destaque: true  },
  { nome: '🏆 Elite',     preco: 'R$197', desc: 'Clientes e funcionárias ilimitados',         destaque: false },
]

onMounted(async () => {
  const supabase = createSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return

  let empresaId: number | null = (session.user.user_metadata?.empresa_id as number | null) ?? null
  if (!empresaId) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('empresa_id')
      .eq('id', session.user.id)
      .maybeSingle()
    empresaId = profile?.empresa_id ?? null
  }

  if (empresaId) {
    const { data: rows } = await supabase.rpc('get_empresa_plano', { p_empresa_id: empresaId })
    if (rows?.[0]) plano.value = rows[0].plano
  }
})

async function handleLogout() {
  await logout()
  router.push('/login')
}
</script>
