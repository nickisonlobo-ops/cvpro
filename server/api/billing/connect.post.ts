// =====================================================================
// POST /api/billing/connect
// Valida credenciais InvoiceXpress e guarda no banco (protegido).
// =====================================================================

export default defineEventHandler(async (event) => {
  // 1. Autenticar utilizador
  const empresaId = await getEmpresaIdFromRequest(event)
  if (!empresaId) {
    throw createError({ statusCode: 401, statusMessage: 'Não autenticado' })
  }

  // 2. Ler body
  const body = await readBody(event)
  const { account_name, api_key } = body || {}

  if (!account_name || !api_key) {
    throw createError({ statusCode: 400, statusMessage: 'account_name e api_key são obrigatórios' })
  }

  // 3. Validar credenciais no InvoiceXpress
  const creds = { accountName: account_name, apiKey: api_key }
  const ok = await validateCredentials(creds)
  if (!ok) {
    throw createError({ statusCode: 422, statusMessage: 'Credenciais inválidas ou conta inacessível' })
  }

  // 4. Guardar no banco via service_role (RPC protegida)
  const admin = useSupabaseAdmin()
  const { data, error } = await admin.rpc('store_billing_credentials', {
    p_empresa_id: empresaId,
    p_account_name: account_name,
    p_api_key: api_key,
    p_status: 'connected',
  })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return { billing_account_id: data, status: 'connected' }
})
