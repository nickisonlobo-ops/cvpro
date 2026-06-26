<template>
  <div
    v-if="diasRestantes !== null && diasRestantes >= 0"
    class="w-full flex-shrink-0 relative overflow-hidden"
    :class="diasRestantes <= 2 ? 'bg-amber-50 border-b border-amber-200' : 'bg-emerald-50 border-b border-emerald-200'"
  >
    <!-- Barra de progresso sutil no fundo -->
    <div
      class="absolute inset-0 opacity-20"
      :style="{
        background: `linear-gradient(90deg, ${diasRestantes <= 2 ? '#f59e0b' : '#10b981'} ${Math.max(4, ((7 - diasRestantes) / 7) * 100)}%, transparent ${Math.max(4, ((7 - diasRestantes) / 7) * 100)}%)`
      }"
    />

    <div class="relative flex items-center justify-between px-4 sm:px-6 py-2.5 gap-4">
      <div class="flex items-center gap-3 min-w-0">
        <!-- Ícone -->
        <div
          class="hidden sm:flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0"
          :class="diasRestantes <= 2 ? 'bg-amber-200/60' : 'bg-emerald-200/60'"
        >
          <svg v-if="diasRestantes <= 2" class="w-3.5 h-3.5 text-amber-700" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg v-else class="w-3.5 h-3.5 text-emerald-700" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        </div>

        <!-- Texto -->
        <span class="text-[13px] font-medium truncate" :class="diasRestantes <= 2 ? 'text-amber-800' : 'text-emerald-800'">
          <template v-if="diasRestantes === 0">Último dia do teste gratuito — assine para não perder acesso</template>
          <template v-else-if="diasRestantes <= 2">{{ diasRestantes }} dia{{ diasRestantes > 1 ? 's' : '' }} restantes no teste gratuito</template>
          <template v-else>Teste gratuito — {{ diasRestantes }} dias restantes</template>
        </span>

        <!-- Badge dias -->
        <span
          class="hidden md:inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
          :class="diasRestantes <= 2 ? 'bg-amber-200/80 text-amber-900' : 'bg-emerald-200/80 text-emerald-900'"
        >
          {{ diasRestantes }}/7 dias
        </span>
      </div>

      <!-- CTA -->
      <a
        href="/landing#precos"
        class="flex-shrink-0 text-xs font-bold px-4 py-1.5 rounded-lg transition-all hover:scale-105 active:scale-95 shadow-sm"
        :class="diasRestantes <= 2
          ? 'bg-amber-600 text-white hover:bg-amber-700 shadow-amber-600/20'
          : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20'"
      >
        Ver planos
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { createSupabaseClient } from '~/lib/supabase'

const supabase = createSupabaseClient()
const diasRestantes = ref<number | null>(null)

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const perfil = user.user_metadata?.perfil as string | undefined
  if (perfil === 'funcionario') return

  let empresaId = (user.user_metadata?.empresa_id as number | null) ?? null
  if (!empresaId) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('empresa_id')
      .eq('id', user.id)
      .maybeSingle()
    empresaId = profile?.empresa_id ?? null
  }

  if (empresaId) {
    const { data: rows } = await supabase.rpc('get_empresa_plano', { p_empresa_id: empresaId })
    const info = rows?.[0]
    if (info && info.plano === 'trial' && info.trial_end) {
      const diffDias = Math.ceil((new Date(info.trial_end).getTime() - Date.now()) / 86400000)
      if (diffDias >= 0) diasRestantes.value = diffDias
    }
  }
})
</script>
