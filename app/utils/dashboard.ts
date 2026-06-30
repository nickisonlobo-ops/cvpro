// app/utils/dashboard.ts
// Dashboard utility functions - pure functions for business logic

// ─── Types for Period Filter (Task 1.1) ──────────────────────────────────────

export type PeriodoFiltro = 'mes_atual' | 'semana_atual' | 'trimestre_atual' | 'ano_atual' | 'personalizado'

export interface PeriodoRange {
  inicio: string // ISO date string (start of day)
  fim: string    // ISO date string (end of day)
}

// ─── calcularPeriodoRange ────────────────────────────────────────────────────

/**
 * Converte um PeriodoFiltro em um PeriodoRange com datas ISO.
 * Função pura — sem side-effects.
 *
 * @param filtro - Tipo de período selecionado
 * @param custom - Mês e ano selecionados (usado quando filtro = 'personalizado')
 * @param hoje - Data de referência (default: new Date())
 * @returns PeriodoRange com início (midnight) e fim (end of day)
 */
export function calcularPeriodoRange(
  filtro: PeriodoFiltro,
  custom: { mes: number; ano: number },
  hoje?: Date
): PeriodoRange {
  const referencia = hoje ?? new Date()

  switch (filtro) {
    case 'mes_atual': {
      const ano = referencia.getFullYear()
      const mes = referencia.getMonth()
      const inicio = new Date(ano, mes, 1)
      const fim = new Date(ano, mes + 1, 0, 23, 59, 59, 999)
      return { inicio: inicio.toISOString(), fim: fim.toISOString() }
    }

    case 'semana_atual': {
      // Segunda-feira = 1, Domingo = 0 (JS), ajustar para semana começando na segunda
      const dia = referencia.getDay()
      // Se domingo (0), offset = -6. Se segunda (1), offset = 0. Se terça (2), offset = -1, etc.
      const offsetSegunda = dia === 0 ? -6 : 1 - dia
      const segunda = new Date(referencia.getFullYear(), referencia.getMonth(), referencia.getDate() + offsetSegunda)
      const domingo = new Date(segunda.getFullYear(), segunda.getMonth(), segunda.getDate() + 6, 23, 59, 59, 999)
      const inicio = new Date(segunda.getFullYear(), segunda.getMonth(), segunda.getDate())
      return { inicio: inicio.toISOString(), fim: domingo.toISOString() }
    }

    case 'trimestre_atual': {
      const mes = referencia.getMonth()
      const ano = referencia.getFullYear()
      // Trimestres: jan-mar (0-2), abr-jun (3-5), jul-set (6-8), out-dez (9-11)
      const trimestreInicio = Math.floor(mes / 3) * 3
      const inicio = new Date(ano, trimestreInicio, 1)
      const fim = new Date(ano, trimestreInicio + 3, 0, 23, 59, 59, 999)
      return { inicio: inicio.toISOString(), fim: fim.toISOString() }
    }

    case 'ano_atual': {
      const ano = referencia.getFullYear()
      const inicio = new Date(ano, 0, 1)
      const fim = new Date(ano, 11, 31, 23, 59, 59, 999)
      return { inicio: inicio.toISOString(), fim: fim.toISOString() }
    }

    case 'personalizado': {
      // custom.mes é 1-indexed (1 = janeiro, 12 = dezembro)
      const mesIndex = custom.mes - 1
      const inicio = new Date(custom.ano, mesIndex, 1)
      const fim = new Date(custom.ano, mesIndex + 1, 0, 23, 59, 59, 999)
      return { inicio: inicio.toISOString(), fim: fim.toISOString() }
    }

    default: {
      // Fallback para mes_atual caso um valor inválido seja passado
      const ano = referencia.getFullYear()
      const mes = referencia.getMonth()
      const inicio = new Date(ano, mes, 1)
      const fim = new Date(ano, mes + 1, 0, 23, 59, 59, 999)
      return { inicio: inicio.toISOString(), fim: fim.toISOString() }
    }
  }
}

// ─── Types for Activity Feed (Task 1.2) ─────────────────────────────────────

export interface AtividadeItem {
  id: number
  tipo: 'orcamento_criado' | 'orcamento_aprovado' | 'os_criada' | 'conta_criada'
  descricao: string
  clienteNome: string | null
  criadoEm: string // ISO timestamp
}

export interface RawEvent {
  id: number
  tipo: AtividadeItem['tipo']
  descricao: string
  clienteNome: string | null
  criadoEm: string
}

// ─── buildAtividadeFeed ──────────────────────────────────────────────────────

/**
 * Builds the activity feed by sorting events by `criadoEm` descending
 * and limiting the result to `limit` items (default 10).
 *
 * @param events - Raw events from combined sources
 * @param limit - Maximum number of items to return (default: 10)
 * @returns Sorted and limited list of AtividadeItem
 */
export function buildAtividadeFeed(events: RawEvent[], limit: number = 10): AtividadeItem[] {
  return [...events]
    .sort((a, b) => {
      // Sort descending by criadoEm (most recent first)
      if (a.criadoEm > b.criadoEm) return -1
      if (a.criadoEm < b.criadoEm) return 1
      return 0
    })
    .slice(0, limit)
    .map((event) => ({
      id: event.id,
      tipo: event.tipo,
      descricao: event.descricao,
      clienteNome: event.clienteNome,
      criadoEm: event.criadoEm,
    }))
}

// ─── Types for Alertas (Task 1.3) ────────────────────────────────────────────

export interface AlertasInput {
  orcamentosEnviados: Array<{ created_at: string; validade_dias: number }>
  contasVencidas: Array<{ valor: number }>
  osComPrazo: Array<{ data_entrega: string | null; status: string }>
}

export interface AlertasDashboard {
  orcamentosExpirando: number // enviados com validade <= 7 dias
  contasVencidas: number
  valorContasVencidas: number
  osAtrasadas: number
  temAlertas: boolean // computed: any of above > 0
}

// ─── calcularAlertas ─────────────────────────────────────────────────────────

/**
 * Calculates dashboard alerts from raw input data.
 *
 * Business rules:
 * - orcamentosExpirando: count of orçamentos enviados where created_at + validade_dias
 *   results in an expiry date within the next 7 days from `hoje`
 * - contasVencidas: count of items in the contasVencidas array (already filtered as overdue)
 * - valorContasVencidas: sum of valor from contasVencidas array
 * - osAtrasadas: count of OS where data_entrega < hoje and status is active
 *   (aguardando_producao or em_producao)
 * - temAlertas: true if any count > 0
 *
 * @param input - Raw data for alert calculation
 * @param hoje - Reference date (defaults to current date)
 * @returns Calculated alert metrics
 */
export function calcularAlertas(input: AlertasInput, hoje?: Date): AlertasDashboard {
  const referenceDate = hoje ?? new Date()

  // Normalize reference date to start of day for consistent comparison
  const hojeStart = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate())

  // Calculate expiring quotations: enviados where expiry is within next 7 days
  const orcamentosExpirando = input.orcamentosEnviados.filter((orc) => {
    const createdAt = new Date(orc.created_at)
    // Expiry date = created_at + validade_dias
    const expiryDate = new Date(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate() + orc.validade_dias)

    // Must be expiring within the next 7 days (expiry > hoje and expiry <= hoje + 7 days)
    const sevenDaysFromNow = new Date(hojeStart.getFullYear(), hojeStart.getMonth(), hojeStart.getDate() + 7)

    return expiryDate >= hojeStart && expiryDate <= sevenDaysFromNow
  }).length

  // Overdue bills: input already filtered, just count and sum
  const contasVencidas = input.contasVencidas.length
  const valorContasVencidas = input.contasVencidas.reduce((sum, conta) => sum + conta.valor, 0)

  // Overdue OS: usar data_entrega (calendário de entregas) como única referência
  const activeStatuses = ['aguardando_producao', 'em_producao']
  const osAtrasadas = input.osComPrazo.filter((os) => {
    if (!activeStatuses.includes(os.status)) return false
    if (!os.data_entrega) return false

    const prazo = new Date(os.data_entrega)
    const prazoDate = new Date(prazo.getFullYear(), prazo.getMonth(), prazo.getDate())

    return prazoDate < hojeStart
  }).length

  const temAlertas = orcamentosExpirando > 0 || contasVencidas > 0 || osAtrasadas > 0

  return {
    orcamentosExpirando,
    contasVencidas,
    valorContasVencidas,
    osAtrasadas,
    temAlertas,
  }
}
