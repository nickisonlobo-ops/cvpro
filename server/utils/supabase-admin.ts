// =====================================================================
// Supabase Admin Client — server-side only (service_role)
// Nunca importar isto no client/browser!
// =====================================================================
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let _adminClient: SupabaseClient | null = null

export function useSupabaseAdmin(): SupabaseClient {
  if (_adminClient) return _adminClient

  const config = useRuntimeConfig()
  const url = config.public.supabaseUrl as string
  const serviceRoleKey = config.supabaseServiceRoleKey as string

  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY não está definida. Configure no Easypanel.')
  }

  _adminClient = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  return _adminClient
}

// Extrai empresa_id do token JWT do request
export async function getEmpresaIdFromRequest(event: any): Promise<number | null> {
  const authHeader = getRequestHeader(event, 'authorization')
  if (!authHeader) return null

  const config = useRuntimeConfig()
  const userClient = createClient(
    config.public.supabaseUrl as string,
    config.public.supabaseKey as string,
    { global: { headers: { Authorization: authHeader } } },
  )

  const { data: { user } } = await userClient.auth.getUser()
  if (!user) return null

  // empresa_id do user_metadata (sincronizado no login)
  const empresaId = (user.user_metadata as any)?.empresa_id
  if (empresaId) return Number(empresaId)

  // Fallback: buscar do profile
  const { data: profile } = await userClient
    .from('profiles')
    .select('empresa_id')
    .eq('id', user.id)
    .maybeSingle()

  return profile?.empresa_id ?? null
}
