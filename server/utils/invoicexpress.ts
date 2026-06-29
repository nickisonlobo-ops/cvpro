// =====================================================================
// Cliente InvoiceXpress — server-side only (nunca exposto ao browser)
// =====================================================================

export interface IxCredentials {
  accountName: string
  apiKey: string
}

export interface IxItem {
  name: string
  unitPrice: number
  quantity: number
  taxName: string
  taxExemption?: string
  description?: string
}

export interface IxClientData {
  name: string
  nif: string
  email?: string
}

const DOC = {
  invoice: { path: 'invoices', wrapper: 'invoice' },
  invoice_receipt: { path: 'invoice_receipts', wrapper: 'invoice_receipt' },
  simplified_invoice: { path: 'simplified_invoices', wrapper: 'simplified_invoice' },
} as const

export type DocType = keyof typeof DOC

const base = (account: string) => `https://${account}.app.invoicexpress.com`
const jsonHeaders = { 'Content-Type': 'application/json', Accept: 'application/json' }

// Fetch com retry em 429 e 5xx
async function ixFetch(url: string, init: RequestInit, attempt = 0): Promise<Response> {
  const res = await fetch(url, init)
  if ((res.status === 429 || res.status >= 500) && attempt < 5) {
    const waitMs = Math.min(2 ** attempt * 600, 8000)
    await new Promise((r) => setTimeout(r, waitMs))
    return ixFetch(url, init, attempt + 1)
  }
  return res
}

async function parse(res: Response): Promise<any> {
  const text = await res.text()
  if (!res.ok) {
    throw new Error(`InvoiceXpress ${res.status}: ${text.slice(0, 500)}`)
  }
  return text ? JSON.parse(text) : {}
}

function ixDate(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`
}

// Valida credenciais (lista séries)
export async function validateCredentials(c: IxCredentials): Promise<boolean> {
  const res = await ixFetch(
    `${base(c.accountName)}/sequences.json?api_key=${c.apiKey}`,
    { method: 'GET', headers: jsonHeaders },
  )
  return res.ok
}

// Garante cliente no InvoiceXpress
export async function ensureClient(c: IxCredentials, client: IxClientData): Promise<void> {
  const find = await ixFetch(
    `${base(c.accountName)}/clients/find-by-code.json?client_code=${encodeURIComponent(client.nif)}&api_key=${c.apiKey}`,
    { method: 'GET', headers: jsonHeaders },
  )
  if (find.status === 200) return

  await parse(await ixFetch(
    `${base(c.accountName)}/clients.json?api_key=${c.apiKey}`,
    {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({
        client: {
          name: client.name,
          code: client.nif,
          fiscal_id: client.nif,
          email: client.email,
          country: 'Portugal',
        },
      }),
    },
  ))
}

// Cria documento em rascunho
export async function createDraft(
  c: IxCredentials,
  docType: DocType,
  opts: { client: IxClientData; items: IxItem[]; date?: Date; dueDate?: Date },
): Promise<any> {
  const cfg = DOC[docType]
  const now = opts.date ?? new Date()
  const body = {
    [cfg.wrapper]: {
      date: ixDate(now),
      due_date: ixDate(opts.dueDate ?? now),
      client: { name: opts.client.name, code: opts.client.nif },
      items: opts.items.map((i) => ({
        name: i.name,
        description: i.description,
        unit_price: i.unitPrice,
        quantity: i.quantity,
        tax: { name: i.taxName },
        ...(i.taxExemption ? { tax_exemption: i.taxExemption } : {}),
      })),
    },
  }
  const data = await parse(await ixFetch(
    `${base(c.accountName)}/${cfg.path}.json?api_key=${c.apiKey}`,
    { method: 'POST', headers: jsonHeaders, body: JSON.stringify(body) },
  ))
  return data[cfg.wrapper] ?? Object.values(data)[0]
}

// Finaliza (ganha ATCUD, QR, comunicado à AT)
export async function finalize(c: IxCredentials, docType: DocType, id: number): Promise<any> {
  const cfg = DOC[docType]
  const data = await parse(await ixFetch(
    `${base(c.accountName)}/${cfg.path}/${id}/change-state.json?api_key=${c.apiKey}`,
    { method: 'PUT', headers: jsonHeaders, body: JSON.stringify({ [cfg.wrapper]: { state: 'finalized' } }) },
  ))
  return data[cfg.wrapper] ?? Object.values(data)[0]
}

// Obtém PDF (polling curto)
export async function getPdfUrl(c: IxCredentials, id: number, tries = 4): Promise<string | null> {
  for (let i = 0; i < tries; i++) {
    const res = await ixFetch(
      `${base(c.accountName)}/api/pdf/${id}.json?api_key=${c.apiKey}`,
      { method: 'GET', headers: jsonHeaders },
    )
    if (res.status === 200) {
      const data = await res.json()
      return data?.output?.pdfUrl ?? null
    }
    if (res.status === 202) {
      await new Promise((r) => setTimeout(r, 1500))
      continue
    }
    return null
  }
  return null
}
