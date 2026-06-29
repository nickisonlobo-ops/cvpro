import { ref } from 'vue'
import { createSupabaseClient } from '~/lib/supabase'
import { useEmpresa } from './useEmpresa'

const N8N_BASE = 'https://n8n-n8n-start.arepen.easypanel.host/webhook'

export interface BillingStatus {
  connected: boolean
  account_name: string | null
  status: string | null
  default_tax_name: string | null
  default_doc_type: string | null
}

export interface Invoice {
  id: number
  empresa_id: number
  order_id: number
  order_type: string
  document_type: string
  state: string
  atcud: string | null
  sequence_number: string | null
  permalink: string | null
  pdf_url: string | null
  total: number | null
  client_name: string | null
  client_nif: string | null
  error_message: string | null
  created_at: string
}

export function useBilling() {
  const supabase = createSupabaseClient()
  const { empresaId } = useEmpresa()

  const billingStatus = ref<BillingStatus | null>(null)
  const billingLoading = ref(false)
  const billingError = ref<string | null>(null)
  const invoices = ref<Invoice[]>([])
  const invoicesLoading = ref(false)

  // Verificar se a empresa tem faturação configurada
  async function loadBillingStatus() {
    if (!empresaId.value) return
    billingLoading.value = true
    billingError.value = null
    try {
      const { data, error } = await supabase
        .from('billing_accounts')
        .select('account_name, status, default_tax_name, default_doc_type')
        .eq('empresa_id', empresaId.value)
        .eq('provider', 'invoicexpress')
        .maybeSingle()

      if (error) throw error
      if (data && data.status === 'connected') {
        billingStatus.value = { connected: true, ...data }
      } else {
        billingStatus.value = null
      }
    } catch (e: any) {
      billingError.value = e.message
      billingStatus.value = null
    } finally {
      billingLoading.value = false
    }
  }

  // Ligar conta InvoiceXpress (grava direto no Supabase — sem n8n)
  async function connectAccount(accountName: string, apiKey: string): Promise<{ ok: boolean; error?: string }> {
    billingLoading.value = true
    billingError.value = null
    try {
      if (!empresaId.value) return { ok: false, error: 'Empresa não carregada' }

      // Upsert na tabela billing_accounts
      const { error } = await supabase
        .from('billing_accounts')
        .upsert({
          empresa_id: empresaId.value,
          provider: 'invoicexpress',
          account_name: accountName,
          api_key_encrypted: apiKey,
          status: 'connected',
          updated_at: new Date().toISOString(),
        }, { onConflict: 'empresa_id,provider' })

      if (error) {
        billingError.value = error.message
        return { ok: false, error: error.message }
      }

      await loadBillingStatus()
      return { ok: true }
    } catch (e: any) {
      billingError.value = e.message
      return { ok: false, error: e.message }
    } finally {
      billingLoading.value = false
    }
  }

  // Desconectar conta
  async function disconnectAccount(): Promise<boolean> {
    if (!empresaId.value) return false
    const { error } = await supabase
      .from('billing_accounts')
      .update({ status: 'disconnected', updated_at: new Date().toISOString() })
      .eq('empresa_id', empresaId.value)
    if (error) { billingError.value = error.message; return false }
    billingStatus.value = null
    return true
  }

  // Emitir fatura (chama webhook n8n — ele busca credenciais do banco)
  async function emitInvoice(params: {
    orderId: number
    orderType?: 'orcamento' | 'os'
    documentType?: string
    client: { name: string; nif: string; email?: string }
    items: { name: string; unitPrice: number; quantity: number; taxName?: string }[]
  }): Promise<{ ok: boolean; invoice?: Invoice; error?: string }> {
    try {
      const res = await fetch(`${N8N_BASE}/billing-emit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empresa_id: empresaId.value,
          order_id: params.orderId,
          order_type: params.orderType ?? 'orcamento',
          document_type: params.documentType ?? 'invoice_receipt',
          client: params.client,
          items: params.items.map(i => ({
            name: i.name,
            unitPrice: i.unitPrice,
            quantity: i.quantity,
            taxName: i.taxName ?? 'IVA23',
          })),
        }),
      })

      const result = await res.json()
      if (!res.ok || result.error) {
        return { ok: false, error: result.error || result.message || 'Erro ao emitir fatura' }
      }
      return { ok: true, invoice: result.invoice }
    } catch (e: any) {
      return { ok: false, error: e.message }
    }
  }

  // Carregar faturas emitidas
  async function loadInvoices(limit = 50) {
    if (!empresaId.value) return
    invoicesLoading.value = true
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('empresa_id', empresaId.value)
      .order('created_at', { ascending: false })
      .limit(limit)
    invoicesLoading.value = false
    if (!error && data) invoices.value = data as Invoice[]
  }

  return {
    billingStatus,
    billingLoading,
    billingError,
    invoices,
    invoicesLoading,
    loadBillingStatus,
    connectAccount,
    disconnectAccount,
    emitInvoice,
    loadInvoices,
  }
}
