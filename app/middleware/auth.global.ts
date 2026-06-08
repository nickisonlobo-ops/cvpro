import { createSupabaseClient } from '~/lib/supabase'

// Rotas bloqueadas para funcionario (somente admin/gerente)
const MANAGER_ROUTES = ['/contas-pagar', '/produtos', '/funcionarios']
// Rotas públicas (sem login)
const PUBLIC_ROUTES = ['/catalogo', '/loja', '/agendar', '/landing']

const BLOCKED_ROUTE = '/assinatura-expirada'

export default defineNuxtRouteMiddleware(async (to) => {
  const supabase = createSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()

  // Permite acesso sem login para catálogo e páginas de detalhe de veículo
  if (PUBLIC_ROUTES.some(r => to.path === r || to.path.startsWith(r + '/'))) {
    return
  }

  if (to.path === BLOCKED_ROUTE) return

  if (to.path === '/login') {
    if (session) {
      // Redireciona para /atividades se for funcionario, senão para /
      const { data: profile } = await supabase
        .from('profiles')
        .select('perfil')
        .eq('id', session.user.id)
        .maybeSingle()
      const perfil = profile?.perfil ?? session.user.user_metadata?.perfil ?? null
      if (perfil === 'funcionario') return navigateTo('/atividades')
      return navigateTo('/')
    }
    return
  }

  if (!session) {
    return navigateTo('/login')
  }

  // Verificação de trial / plano (somente para admin/gerente)
  const metaPerfil = (session.user.user_metadata?.perfil as string | undefined) ?? null
  const isAdmin = !metaPerfil || metaPerfil === 'admin' || metaPerfil === 'gerente'

  if (isAdmin) {
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
      const info = rows?.[0]
      if (info) {
        const plano = info.plano as string
        const trialEnd = info.trial_end ? new Date(info.trial_end) : null
        const expirado = plano === 'trial' && trialEnd && trialEnd < new Date()
        if (plano === 'bloqueado' || expirado) return navigateTo(BLOCKED_ROUTE)
      }
    }
  }

  // Lê perfil para todas as rotas restritas
  const needsCheck = MANAGER_ROUTES.includes(to.path)
  if (needsCheck) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('perfil')
      .eq('id', session.user.id)
      .maybeSingle()

    const perfil: string | null =
      profile?.perfil ??
      (session.user.user_metadata?.perfil as string | undefined) ??
      null

    // Só bloqueia se SOUBER que é funcionario — se perfil for null, deixa passar
    if (perfil === 'funcionario') {
      return navigateTo('/atividades')
    }
  }
})
