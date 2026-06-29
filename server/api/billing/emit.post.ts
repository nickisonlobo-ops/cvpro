// =====================================================================
// POST /api/billing/emit
// Emite fatura no InvoiceXpress (idempotente).
// Fluxo: idempotência → credenciais → cliente IX → rascunho → finalizar → PDF
// =====================================================================
import type { DocType, IxItem } from '~~/server/utils/invoicexpress'

export default defineEventHandler(async (event) => {
  const admin = useSupabaseAdmin()

  // 1. Autenticar
  const empresaId = await getEmpresaIdFromRequest(event)
  if (!empresaId) {
    throw createError({ statusCode: 401, statusMessage: 'Não autenticado' })
  }

  // 2. Ler body
  const body = await readBody(event)
  const orderType: string = body.order_type ?? 'orcamento'
  const docType: DocType = body.document_type ?? 'invoice_receipt'

  if (!body.order_id || !body.client?.nif || !body.items?.length) {
    throw createError({ statusCode: 400, statusMessage: 'order_id, client.nif e items são obrigatórios' })
  }

  // 3. IDEMPOTÊNCIA: verificar se já existe
  const { data: existing } = await admin
    .from('invoices')
    .select('*')
    .eq('empresa_id', empresaId)
    .eq('order_id', body.order_id)
    .eq('order_type', orderType)
    .maybeSingle()

  if (existing?.state === 'finalized') {
    return { status: 'already_finalized', invoice: existing }
  }

  // 4. Reservar linha (pending)
  const { data: pending, error: upErr } = await admin
    .from('invoices')
    .upsert(
      {
        empresa_id: empresaId,
        order_id: body.order_id,
        order_type: orderType,
        document_type: docType,
        state: 'pending',
        client_name: body.client.name,
        client_nif: body.client.nif,
      },
      { onConflict: 'empresa_id,order_id,order_type' },
    )
    .select()
    .single()

  if (upErr) {
    throw createError({ statusCode: 500, statusMessage: upErr.message })
  }

  // 5. Obter credenciais (via RPC server-only)
  const { data: credRows, error: credErr } = await admin
    .rpc('get_billing_credentials', { p_empresa_id: empresaId })

  if (credErr) throw createError({ statusCode: 500, statusMessage: credErr.message })
  const cred = credRows?.[0]
  if (!cred) {
    throw createError({ statusCode: 412, statusMessage: 'Empresa sem conta de faturação configurada' })
  }
  if (cred.status !== 'connected') {
    throw createError({ statusCode: 412, statusMessage: `Conta com status: ${cred.status}` })
  }

  const creds = { accountName: cred.account_name, apiKey: cred.api_key }

  // 6. Fluxo InvoiceXpress
  try {
    const items: IxItem[] = body.items.map((i: any) => ({
      name: i.name,
      unitPrice: Number(i.unitPrice),
      quantity: Number(i.quantity),
      taxName: i.taxName ?? 'IVA23',
      description: i.description,
      taxExemption: i.taxExemption,
    }))

    await ensureClient(creds, body.client)
    const draft = await createDraft(creds, docType, { client: body.client, items })
    const final = await finalize(creds, docType, Number(draft.id))
    const pdfUrl = await getPdfUrl(creds, Number(final.id))

    // 7. Guardar resultado
    const { data: saved } = await admin
      .from('invoices')
      .update({
        provider_invoice_id: String(final.id),
        state: 'finalized',
        atcud: final.atcud ?? null,
        sequence_number: final.sequence_number ?? null,
        permalink: final.permalink ?? null,
        pdf_url: pdfUrl,
        total: final.total ?? null,
        error_message: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', pending.id)
      .select()
      .single()

    return { status: 'finalized', invoice: saved }
  } catch (e: any) {
    // Marca erro para reprocessamento
    await admin.from('invoices')
      .update({ state: 'error', error_message: e.message, updated_at: new Date().toISOString() })
      .eq('id', pending.id)

    throw createError({ statusCode: 500, statusMessage: e.message })
  }
})
