import { createSupabaseClient } from '~/lib/supabase'
import { useEmpresa } from './useEmpresa'

export interface TransacaoExtrato {
  id?: number
  extrato_id?: number
  data_transacao: string
  descricao: string
  valor: number
  tipo: 'credito' | 'debito'
  saldo?: number | null
  referencia?: string | null
  conta_pagar_id?: number | null
  status_conciliacao: 'pendente' | 'conciliada' | 'ignorada'
  conciliada_em?: string | null
}

export interface ContaPagarMatch {
  id: number
  descricao: string
  valor: number
  data_vencimento: string
  status: string
  score: number // 0-100 match confidence
}

export interface ExtratoImportado {
  id?: number
  nome_arquivo: string
  banco?: string
  conta?: string
  periodo_inicio?: string
  periodo_fim?: string
  total_transacoes: number
  total_conciliadas: number
}

export function useConciliacao() {
  const supabase = createSupabaseClient()
  const { empresaId, loadEmpresa } = useEmpresa()

  // ─── Parser OFX ─────────────────────────────────────────────────────────────
  function parseOFX(content: string): { transacoes: TransacaoExtrato[]; banco?: string; conta?: string } {
    const transacoes: TransacaoExtrato[] = []
    let banco: string | undefined
    let conta: string | undefined

    // Extrair info do banco
    const orgMatch = content.match(/<ORG>([^<\n]+)/)
    if (orgMatch) banco = orgMatch[1].trim()

    const acctMatch = content.match(/<ACCTID>([^<\n]+)/)
    if (acctMatch) conta = acctMatch[1].trim()

    // Extrair transações
    const stmtTrnRegex = /<STMTTRN>([\s\S]*?)<\/STMTTRN>/gi
    let match: RegExpExecArray | null

    while ((match = stmtTrnRegex.exec(content)) !== null) {
      const block = match[1]

      const trnType = block.match(/<TRNTYPE>([^<\n]+)/)
      const dtPosted = block.match(/<DTPOSTED>([^<\n]+)/)
      const trnAmt = block.match(/<TRNAMT>([^<\n]+)/)
      const name = block.match(/<NAME>([^<\n]+)/)
      const memo = block.match(/<MEMO>([^<\n]+)/)
      const fitid = block.match(/<FITID>([^<\n]+)/)

      if (!dtPosted || !trnAmt) continue

      const rawDate = dtPosted[1].trim()
      const year = rawDate.substring(0, 4)
      const month = rawDate.substring(4, 6)
      const day = rawDate.substring(6, 8)
      const dataTransacao = `${year}-${month}-${day}`

      const valor = parseFloat(trnAmt[1].trim().replace(',', '.'))
      const descricao = (name?.[1] || memo?.[1] || 'Sem descrição').trim()
      const referencia = fitid?.[1]?.trim() || null

      transacoes.push({
        data_transacao: dataTransacao,
        descricao,
        valor: Math.abs(valor),
        tipo: valor >= 0 ? 'credito' : 'debito',
        saldo: null,
        referencia,
        status_conciliacao: 'pendente',
      })
    }

    return { transacoes, banco, conta }
  }


  // ─── Parser CSV ─────────────────────────────────────────────────────────────
  function parseCSV(content: string): { transacoes: TransacaoExtrato[] } {
    const transacoes: TransacaoExtrato[] = []
    const lines = content.split(/\r?\n/).filter(l => l.trim())
    if (lines.length < 2) return { transacoes }

    // Detectar separador
    const sep = lines[0].includes(';') ? ';' : ','
    const headers = lines[0].split(sep).map(h => h.trim().toLowerCase().replace(/"/g, ''))

    // Mapear colunas comuns
    const colData = headers.findIndex(h => h.includes('data') || h.includes('date'))
    const colDesc = headers.findIndex(h => h.includes('descri') || h.includes('hist') || h.includes('memo'))
    const colValor = headers.findIndex(h => h.includes('valor') || h.includes('amount') || h.includes('quantia'))
    const colSaldo = headers.findIndex(h => h.includes('saldo') || h.includes('balance'))

    if (colData === -1 || colValor === -1) return { transacoes }

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(sep).map(c => c.trim().replace(/^"|"$/g, ''))
      if (cols.length < Math.max(colData, colValor) + 1) continue

      const rawDate = cols[colData]
      const dataTransacao = parseFlexDate(rawDate)
      if (!dataTransacao) continue

      const rawValor = cols[colValor].replace(/[^\d.,-]/g, '').replace(',', '.')
      const valor = parseFloat(rawValor)
      if (isNaN(valor)) continue

      const descricao = colDesc >= 0 ? (cols[colDesc] || 'Sem descrição') : 'Sem descrição'
      const saldo = colSaldo >= 0 ? parseFloat(cols[colSaldo].replace(/[^\d.,-]/g, '').replace(',', '.')) : null

      transacoes.push({
        data_transacao: dataTransacao,
        descricao,
        valor: Math.abs(valor),
        tipo: valor >= 0 ? 'credito' : 'debito',
        saldo: isNaN(saldo as number) ? null : saldo,
        referencia: null,
        status_conciliacao: 'pendente',
      })
    }

    return { transacoes }
  }

  function parseFlexDate(raw: string): string | null {
    // Tenta DD/MM/YYYY ou DD-MM-YYYY
    const brMatch = raw.match(/(\d{2})[/\-](\d{2})[/\-](\d{4})/)
    if (brMatch) return `${brMatch[3]}-${brMatch[2]}-${brMatch[1]}`
    // Tenta YYYY-MM-DD
    const isoMatch = raw.match(/(\d{4})-(\d{2})-(\d{2})/)
    if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`
    return null
  }


  // ─── Matching automático ────────────────────────────────────────────────────
  function calcularMatches(transacao: TransacaoExtrato, contas: { id: number; descricao: string; valor: number; data_vencimento: string; status: string }[]): ContaPagarMatch[] {
    const matches: ContaPagarMatch[] = []

    for (const conta of contas) {
      if (conta.status === 'pago' || conta.status === 'cancelado') continue

      let score = 0

      // Score por valor (peso alto - 40 pontos)
      const diffValor = Math.abs(conta.valor - transacao.valor)
      if (diffValor === 0) score += 40
      else if (diffValor <= 0.5) score += 35
      else if (diffValor <= 5) score += 20
      else if (diffValor <= 20) score += 10
      else continue // Diferença > R$20 — nem considera

      // Score por data (peso alto - 40 pontos)
      const dataTransacao = new Date(transacao.data_transacao)
      const dataVencimento = new Date(conta.data_vencimento)
      const diffDias = Math.abs(Math.floor((dataTransacao.getTime() - dataVencimento.getTime()) / 86400000))
      if (diffDias === 0) score += 40
      else if (diffDias <= 1) score += 35
      else if (diffDias <= 3) score += 28
      else if (diffDias <= 7) score += 18
      else if (diffDias <= 15) score += 8
      else score += 0 // Mais de 15 dias — só o valor não basta

      // Score por descrição (peso menor - 20 pontos)
      const descT = transacao.descricao.toLowerCase()
      const descC = conta.descricao.toLowerCase()
      if (descT.includes(descC) || descC.includes(descT)) score += 20
      else {
        const palavrasC = descC.split(/\s+/).filter(p => p.length > 3)
        const matchPalavras = palavrasC.filter(p => descT.includes(p)).length
        score += Math.min(20, matchPalavras * 7)
      }

      if (score >= 40) {
        matches.push({ ...conta, score })
      }
    }

    return matches.sort((a, b) => b.score - a.score).slice(0, 5)
  }


  // ─── Salvar extrato importado ───────────────────────────────────────────────
  async function salvarExtrato(
    nomeArquivo: string,
    transacoes: TransacaoExtrato[],
    banco?: string,
    conta?: string
  ): Promise<{ success: boolean; extratoId?: number; error?: string }> {
    await loadEmpresa()
    if (!empresaId.value) return { success: false, error: 'Empresa não identificada' }

    const datas = transacoes.map(t => t.data_transacao).sort()
    const periodoInicio = datas[0] || null
    const periodoFim = datas[datas.length - 1] || null

    // Inserir extrato
    const { data: extrato, error: errExtrato } = await supabase
      .from('extratos_bancarios')
      .insert({
        empresa_id: empresaId.value,
        nome_arquivo: nomeArquivo,
        banco: banco || null,
        conta: conta || null,
        periodo_inicio: periodoInicio,
        periodo_fim: periodoFim,
        total_transacoes: transacoes.length,
        total_conciliadas: 0,
      })
      .select('id')
      .single()

    if (errExtrato || !extrato) return { success: false, error: errExtrato?.message || 'Erro ao salvar extrato' }

    // Inserir transações
    const rows = transacoes.map(t => ({
      extrato_id: extrato.id,
      empresa_id: empresaId.value!,
      data_transacao: t.data_transacao,
      descricao: t.descricao,
      valor: t.valor,
      tipo: t.tipo,
      saldo: t.saldo ?? null,
      referencia: t.referencia ?? null,
      status_conciliacao: 'pendente',
    }))

    const { error: errTransacoes } = await supabase
      .from('transacoes_extrato')
      .insert(rows)

    if (errTransacoes) return { success: false, error: errTransacoes.message }

    return { success: true, extratoId: extrato.id }
  }


  // ─── Conciliar transação ────────────────────────────────────────────────────
  async function conciliarTransacao(
    transacaoId: number,
    contaPagarId: number
  ): Promise<{ success: boolean; error?: string }> {
    // 1. Marcar transação como conciliada
    const { error: errT } = await supabase
      .from('transacoes_extrato')
      .update({
        conta_pagar_id: contaPagarId,
        status_conciliacao: 'conciliada',
        conciliada_em: new Date().toISOString(),
      })
      .eq('id', transacaoId)

    if (errT) return { success: false, error: errT.message }

    // 2. Marcar conta como paga
    const { error: errC } = await supabase
      .from('contas_pagar')
      .update({
        status: 'pago',
        data_pagamento: new Date().toISOString().split('T')[0],
      })
      .eq('id', contaPagarId)

    if (errC) return { success: false, error: errC.message }

    return { success: true }
  }

  // ─── Ignorar transação ──────────────────────────────────────────────────────
  async function ignorarTransacao(transacaoId: number): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase
      .from('transacoes_extrato')
      .update({ status_conciliacao: 'ignorada' })
      .eq('id', transacaoId)

    if (error) return { success: false, error: error.message }
    return { success: true }
  }

  // ─── Carregar transações de um extrato ──────────────────────────────────────
  async function carregarTransacoes(extratoId: number): Promise<TransacaoExtrato[]> {
    const { data, error } = await supabase
      .from('transacoes_extrato')
      .select('*')
      .eq('extrato_id', extratoId)
      .order('data_transacao', { ascending: true })

    if (error) { console.error('Erro ao carregar transações:', error); return [] }
    return data ?? []
  }

  // ─── Carregar extratos ──────────────────────────────────────────────────────
  async function carregarExtratos(): Promise<ExtratoImportado[]> {
    await loadEmpresa()
    if (!empresaId.value) return []

    const { data, error } = await supabase
      .from('extratos_bancarios')
      .select('*')
      .eq('empresa_id', empresaId.value)
      .order('data_importacao', { ascending: false })

    if (error) { console.error('Erro ao carregar extratos:', error); return [] }
    return data ?? []
  }

  // ─── Carregar contas pendentes para matching ────────────────────────────────
  async function carregarContasPendentes(): Promise<{ id: number; descricao: string; valor: number; data_vencimento: string; status: string; tipo: string }[]> {
    await loadEmpresa()
    if (!empresaId.value) return []

    const { data, error } = await supabase
      .from('contas_pagar')
      .select('id, descricao, valor, data_vencimento, status, tipo')
      .eq('empresa_id', empresaId.value)
      .in('status', ['pendente', 'vencido'])
      .order('data_vencimento', { ascending: true })

    if (error) { console.error('Erro ao carregar contas:', error); return [] }
    return data ?? []
  }

  // ─── Excluir extrato ────────────────────────────────────────────────────────
  async function excluirExtrato(extratoId: number): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase
      .from('extratos_bancarios')
      .delete()
      .eq('id', extratoId)

    if (error) return { success: false, error: error.message }
    return { success: true }
  }

  return {
    parseOFX,
    parseCSV,
    calcularMatches,
    salvarExtrato,
    conciliarTransacao,
    ignorarTransacao,
    carregarTransacoes,
    carregarExtratos,
    carregarContasPendentes,
    excluirExtrato,
  }
}


// ─── Gerar contas a receber a partir de orçamento aprovado ────────────────────
export function useContasReceber() {
  const supabase = createSupabaseClient()
  const { empresaId, loadEmpresa } = useEmpresa()

  async function gerarRecebiveisOrcamento(params: {
    orcamentoId: number
    valorTotal: number
    clienteNome: string
    descricao: string
    formaPagamento: string
    parcelas: number
  }): Promise<{ success: boolean; error?: string }> {
    await loadEmpresa()
    if (!empresaId.value) return { success: false, error: 'Empresa não identificada' }

    const { orcamentoId, valorTotal, clienteNome, descricao, formaPagamento, parcelas } = params
    const valorParcela = Math.round((valorTotal / parcelas) * 100) / 100

    const rows = []
    const hoje = new Date()

    for (let i = 1; i <= parcelas; i++) {
      const vencimento = new Date(hoje)
      vencimento.setDate(hoje.getDate() + (i * 30)) // 30 dias entre parcelas

      const descParcela = parcelas > 1
        ? `${descricao} - Parcela ${i}/${parcelas}`
        : descricao

      rows.push({
        empresa_id: empresaId.value,
        tipo: 'receber',
        descricao: descParcela,
        valor: i === parcelas ? valorTotal - (valorParcela * (parcelas - 1)) : valorParcela,
        data_vencimento: vencimento.toISOString().split('T')[0],
        status: 'pendente',
        forma_pagamento: formaPagamento,
        orcamento_id: orcamentoId,
        parcela_numero: i,
        total_parcelas: parcelas,
        cliente_nome: clienteNome,
        categoria: 'Orçamento',
        periodicidade: parcelas > 1 ? 'mensal' : 'avulsa',
      })
    }

    const { error } = await supabase.from('contas_pagar').insert(rows)
    if (error) return { success: false, error: error.message }
    return { success: true }
  }

  return { gerarRecebiveisOrcamento }
}
