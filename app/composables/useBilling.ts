import { ref } from 'vue'
import { createSupabaseClient } from '~/lib/supabase'
import { useEmpresa } from './useEmpresa'

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
      const { data, error } = await supabase.rpc('get_billing_status', {
        p_empresa_id: empresaId.value,
      })
      if (error) throw error
      if (data && data.length > 0) {
        billingStatus.value = data[0]
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

  // Ligar conta InvoiceXpress (chama server route)
  async function connectAccount(accountName: string, apiKey: string): Promise<{ ok: boolean; error?: string }> {
    billingLoading.value = true
    billingError.value = null
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return { ok: false, error: 'Não autenticado' }

      const res = await fetch('/api/billing/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ account_name: accountName, api_key: apiKey }),
      })

      const result = await res.json()
      if (!res.ok) {
        const msg = result.statusMessage || result.error || 'Erro ao conectar'
        billingError.value = msg
        return { ok: false, error: msg }
      }

      // Recarregar status
      await loadBillingStatus()
      return { ok: true }
    } catch (e: any) {
      billingError.value = e.message
      return { ok: false, error: e.message }
    } finally {
      billingLoading.value = false
    }
  }

  // Desconectar conta (marca como disconnected)
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

  // Emitir fatura (chama server route)
  async function emitInvoice(params: {
    orderId: number
    orderType?: 'orcamento' | 'os'
    documentType?: string
    client: { name: string; nif: string; email?: string }
    items: { name: string; unitPrice: number; quantity: number; taxName?: string }[]
  }): Promise<{ ok: boolean; invoice?: Invoice; error?: string }> {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return { ok: false, error: 'Não autenticado' }

      const res = await fetch('/api/billing/emit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
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
      if (!res.ok) return { ok: false, error: result.statusMessage || result.error || 'Erro ao emitir fatura' }
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
