// app/composables/useDashboardAdmin.ts
// Composable centralizado para o dashboard admin/gerente

import type { Ref, ComputedRef } from 'vue'
import type {
  PeriodoFiltro,
  PeriodoRange,
  AtividadeItem,
  AlertasDashboard,
  RawEvent,
} from '~/utils/dashboard'
import { calcularPeriodoRange, calcularAlertas, buildAtividadeFeed } from '~/utils/dashboard'
import { createSupabaseClient } from '~/lib/supabase'
import { useEmpresa } from '~/composables/useEmpresa'
import { useRealtimeMulti } from '~/composables/useRealtime'

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface MetricasFinanceiras {
  faturamento: number
  despesas: number
  lucroEstimado: number
  contasVencidas: number
  valorContasVencidas: number
}

export interface PrevisaoFinanceira {
  aReceber: number
  aPagar: number
  saldo: number
  qtdReceber: number
  qtdPagar: number
}

export interface PipelineOrcamentos {
  rascunho: number
  enviado: number
  aprovado: number
  rejeitado: number
  vencido: number
  valorEmNegociacao: number
}

export interface StatusProducao {
  osEmProducao: number
  osProntas: number
  processosAtivos: number
  osAtrasadas: number
}

export interface TopCliente {
  nome: string
  total: number
}

export interface EvolucaoMensal {
  mes: string // "Jan", "Fev", etc.
  faturamento: number
  despesas: number
  receitaAReceber: number
}

export interface Comparativo {
  faturamentoAnterior: number
  despesasAnterior: number
  variacaoFaturamento: number // percentage change
  variacaoDespesas: number
}

export interface TicketMedio {
  valor: number
  quantidade: number
}

export interface ProximoVencimento {
  id: number
  descricao: string
  valor: number
  dataVencimento: string
  diasRestantes: number
}

export interface DashboardAdminState {
  loading: Ref<boolean>
  financeiro: Ref<MetricasFinanceiras>
  previsao: Ref<PrevisaoFinanceira>
  pipeline: Ref<PipelineOrcamentos>
  producao: Ref<StatusProducao>
  atividades: Ref<AtividadeItem[]>
  alertas: Ref<AlertasDashboard>
  topClientes: Ref<TopCliente[]>
  evolucaoMensal: Ref<EvolucaoMensal[]>
  comparativo: Ref<Comparativo>
  ticketMedio: Ref<TicketMedio>
  proximosVencimentos: Ref<ProximoVencimento[]>
  periodoFiltro: Ref<PeriodoFiltro>
  periodoCustom: Ref<{ mes: number; ano: number }>
  periodoRange: ComputedRef<PeriodoRange>
  periodoLabel: ComputedRef<string>
  refresh: () => Promise<void>
}

// ─── Composable ──────────────────────────────────────────────────────────────

export function useDashboardAdmin(): DashboardAdminState {
  const supabase = createSupabaseClient()
  const { empresaId } = useEmpresa()

  // ── Reactive State ───────────────────────────────────────────────────────

  const loading = ref<boolean>(false)

  const financeiro = ref<MetricasFinanceiras>({
    faturamento: 0,
    despesas: 0,
    lucroEstimado: 0,
    contasVencidas: 0,
    valorContasVencidas: 0,
  })

  const previsao = ref<PrevisaoFinanceira>({
    aReceber: 0,
    aPagar: 0,
    saldo: 0,
    qtdReceber: 0,
    qtdPagar: 0,
  })

  const pipeline = ref<PipelineOrcamentos>({
    rascunho: 0,
    enviado: 0,
    aprovado: 0,
    rejeitado: 0,
    vencido: 0,
    valorEmNegociacao: 0,
  })

  const producao = ref<StatusProducao>({
    osEmProducao: 0,
    osProntas: 0,
    processosAtivos: 0,
    osAtrasadas: 0,
  })

  const atividades = ref<AtividadeItem[]>([])

  const topClientes = ref<TopCliente[]>([])

  const evolucaoMensal = ref<EvolucaoMensal[]>([])

  const comparativo = ref<Comparativo>({
    faturamentoAnterior: 0,
    despesasAnterior: 0,
    variacaoFaturamento: 0,
    variacaoDespesas: 0,
  })

  const ticketMedio = ref<TicketMedio>({
    valor: 0,
    quantidade: 0,
  })

  const proximosVencimentos = ref<ProximoVencimento[]>([])

  const alertas = ref<AlertasDashboard>({
    orcamentosExpirando: 0,
    contasVencidas: 0,
    valorContasVencidas: 0,
    osAtrasadas: 0,
    temAlertas: false,
  })

  // ── Period Filter ────────────────────────────────────────────────────────

  const periodoFiltro = ref<PeriodoFiltro>('mes_atual')

  const now = new Date()
  const periodoCustom = ref<{ mes: number; ano: number }>({
    mes: now.getMonth() + 1, // 1-indexed
    ano: now.getFullYear(),
  })

  const periodoRange = computed<PeriodoRange>(() => {
    return calcularPeriodoRange(periodoFiltro.value, periodoCustom.value)
  })

  const periodoLabel = computed<string>(() => {
    switch (periodoFiltro.value) {
      case 'mes_atual': {
        const hoje = new Date()
        const nomesMeses = [
          'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
          'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
        ]
        return `${nomesMeses[hoje.getMonth()]} ${hoje.getFullYear()}`
      }
      case 'semana_atual':
        return 'Semana Atual'
      case 'trimestre_atual':
        return 'Trimestre Atual'
      case 'ano_atual':
        return 'Ano Atual'
      case 'personalizado': {
        const nomesMeses = [
          'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
          'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
        ]
        return `${nomesMeses[periodoCustom.value.mes - 1]} ${periodoCustom.value.ano}`
      }
      default:
        return 'Mês Atual'
    }
  })

  // ── Fetch Functions ─────────────────────────────────────────────────────

  async function fetchFinanceiro(): Promise<void> {
    const inicio = periodoRange.value.inicio
    const fim = periodoRange.value.fim
    // Para comparação com campos date-only, usar formato YYYY-MM-DD
    const inicioDate = inicio.split('T')[0]
    const fimDate = fim.split('T')[0]

    // RECEITA: Contas a receber pagas no período
    const { data: contasReceber } = await supabase
      .from('contas_pagar')
      .select('valor, data_pagamento, data_vencimento')
      .eq('empresa_id', empresaId.value)
      .eq('tipo', 'receber')
      .eq('status', 'pago')

    const receitaContas = (contasReceber ?? []).filter(c => {
      const dateStr = c.data_pagamento ?? c.data_vencimento
      if (!dateStr) return false
      const d = dateStr.split('T')[0]
      return d >= inicioDate && d <= fimDate
    }).reduce((sum, c) => sum + (c.valor ?? 0), 0)

    // RECEITA: OS entregues no período
    const { data: osEntregues } = await supabase
      .from('ordens_servico_adesivo')
      .select('valor_total')
      .eq('empresa_id', empresaId.value)
      .eq('status', 'entregue')
      .gte('data_entrega', inicioDate)
      .lte('data_entrega', fimDate)

    const receitaOS = (osEntregues ?? []).reduce((sum, o) => sum + (o.valor_total ?? 0), 0)

    // RECEITA: Vendas finalizadas no período
    const { data: vendasFinalizadas } = await supabase
      .from('vendas')
      .select('preco_veiculo, vendas_itens(preco_unitario, quantidade, valor_total)')
      .eq('empresa_id', empresaId.value)
      .eq('status', 'finalizada')
      .gte('data_venda', inicioDate)
      .lte('data_venda', fimDate)

    const receitaVendas = (vendasFinalizadas ?? []).reduce((sum, v: any) => {
      const itemsTotal = (v.vendas_itens ?? []).reduce((s: number, it: any) => s + (it.valor_total ?? it.preco_unitario * it.quantidade), 0)
      return sum + (v.preco_veiculo ?? 0) + itemsTotal
    }, 0)

    // RECEITA: Agendamentos concluídos no período
    const { data: agendConcluidos } = await supabase
      .from('agendamentos')
      .select('valor_total')
      .eq('empresa_id', empresaId.value)
      .eq('status', 'concluido')
      .not('valor_total', 'is', null)
      .gt('valor_total', 0)
      .gte('data_hora', inicio)
      .lte('data_hora', fim)

    const receitaAgendamentos = (agendConcluidos ?? []).reduce((sum, a) => sum + (a.valor_total ?? 0), 0)

    // Faturamento = todas as fontes de receita
    const faturamento = receitaContas + receitaOS + receitaVendas + receitaAgendamentos

    // DESPESAS: contas (tipo ≠ receber, status ≠ cancelado) no período
    const { data: contas } = await supabase
      .from('contas_pagar')
      .select('valor, data_vencimento, status')
      .eq('empresa_id', empresaId.value)
      .neq('tipo', 'receber')
      .neq('status', 'cancelado')
      .gte('data_vencimento', inicioDate)
      .lte('data_vencimento', fimDate)

    const despesas = (contas ?? []).reduce((sum, c) => sum + (c.valor ?? 0), 0)

    // Contas vencidas (despesas): data_vencimento < hoje e status ≠ pago
    const hoje = new Date().toISOString().split('T')[0]
    const contasVencidasList = (contas ?? []).filter(
      (c) => c.data_vencimento < hoje && c.status !== 'pago'
    )
    const contasVencidasCount = contasVencidasList.length
    const valorContasVencidas = contasVencidasList.reduce((sum, c) => sum + (c.valor ?? 0), 0)

    financeiro.value = {
      faturamento,
      despesas,
      lucroEstimado: faturamento - despesas,
      contasVencidas: contasVencidasCount,
      valorContasVencidas,
    }
  }

  async function fetchPrevisao(): Promise<void> {
    const inicioDate = periodoRange.value.inicio.split('T')[0]
    const fimDate = periodoRange.value.fim.split('T')[0]

    // A RECEBER: contas tipo='receber', status ≠ pago, ≠ cancelado, vencimento no período
    const { data: aReceberData } = await supabase
      .from('contas_pagar')
      .select('valor')
      .eq('empresa_id', empresaId.value)
      .eq('tipo', 'receber')
      .neq('status', 'pago')
      .neq('status', 'cancelado')
      .gte('data_vencimento', inicioDate)
      .lte('data_vencimento', fimDate)

    const itensReceber = aReceberData ?? []
    const aReceber = itensReceber.reduce((sum, c) => sum + (c.valor ?? 0), 0)

    // A PAGAR: contas tipo ≠ receber, status ≠ pago, ≠ cancelado, vencimento no período
    const { data: aPagarData } = await supabase
      .from('contas_pagar')
      .select('valor')
      .eq('empresa_id', empresaId.value)
      .neq('tipo', 'receber')
      .neq('status', 'pago')
      .neq('status', 'cancelado')
      .gte('data_vencimento', inicioDate)
      .lte('data_vencimento', fimDate)

    const itensPagar = aPagarData ?? []
    const aPagar = itensPagar.reduce((sum, c) => sum + (c.valor ?? 0), 0)

    previsao.value = {
      aReceber,
      aPagar,
      saldo: aReceber - aPagar,
      qtdReceber: itensReceber.length,
      qtdPagar: itensPagar.length,
    }
  }

  async function fetchPipeline(): Promise<void> {
    const inicio = periodoRange.value.inicio
    const fim = periodoRange.value.fim

    const { data: orcamentos } = await supabase
      .from('orcamentos_adesivo')
      .select('status, valor_total')
      .eq('empresa_id', empresaId.value)
      .gte('created_at', inicio)
      .lte('created_at', fim)

    const items = orcamentos ?? []

    pipeline.value = {
      rascunho: items.filter((o) => o.status === 'rascunho').length,
      enviado: items.filter((o) => o.status === 'enviado').length,
      aprovado: items.filter((o) => o.status === 'aprovado').length,
      rejeitado: items.filter((o) => o.status === 'rejeitado').length,
      vencido: items.filter((o) => o.status === 'vencido').length,
      valorEmNegociacao: items
        .filter((o) => o.status === 'enviado')
        .reduce((sum, o) => sum + (o.valor_total ?? 0), 0),
    }
  }

  async function fetchProducao(): Promise<void> {
    // OS em produção (NÃO finalizadas) — usar data_entrega para calcular atraso
    // pois é o campo que o calendário de entregas gerencia
    const { data: osEmAndamento } = await supabase
      .from('ordens_servico_adesivo')
      .select('id, status, data_entrega')
      .eq('empresa_id', empresaId.value)
      .in('status', ['aguardando_producao', 'em_producao'])

    // OS prontas (separado, apenas contagem)
    const { count: countProntas } = await supabase
      .from('ordens_servico_adesivo')
      .select('id', { count: 'exact', head: true })
      .eq('empresa_id', empresaId.value)
      .eq('status', 'pronto')

    const items = osEmAndamento ?? []
    const hoje = new Date().toISOString().slice(0, 10)

    const osEmProducao = items.length

    const osProntas = countProntas ?? 0

    // OS atrasadas: usar data_entrega (calendário de entregas) como referência
    const osAtrasadas = items.filter((o) => {
      const dataRef = o.data_entrega
      if (!dataRef) return false
      const dataStr = dataRef.includes('T') ? dataRef.split('T')[0] : dataRef
      return dataStr < hoje
    }).length

    // Processos ativos: data_conclusao is null
    const { count } = await supabase
      .from('processos_instancia')
      .select('id', { count: 'exact', head: true })
      .eq('empresa_id', empresaId.value)
      .is('data_conclusao', null)

    producao.value = {
      osEmProducao,
      osProntas,
      processosAtivos: count ?? 0,
      osAtrasadas,
    }
  }

  async function fetchAtividade(): Promise<void> {
    const inicio = periodoRange.value.inicio
    const fim = periodoRange.value.fim

    // Orçamentos criados no período (com join em clientes)
    const { data: orcCriados } = await supabase
      .from('orcamentos_adesivo')
      .select('id, status, created_at, cliente_id, clientes(nome)')
      .eq('empresa_id', empresaId.value)
      .gte('created_at', inicio)
      .lte('created_at', fim)
      .order('created_at', { ascending: false })
      .limit(10)

    // OS criadas no período (com join em clientes)
    const { data: osCriadas } = await supabase
      .from('ordens_servico_adesivo')
      .select('id, created_at, cliente_id, clientes(nome)')
      .eq('empresa_id', empresaId.value)
      .gte('created_at', inicio)
      .lte('created_at', fim)
      .order('created_at', { ascending: false })
      .limit(10)

    // Contas criadas no período
    const { data: contasCriadas } = await supabase
      .from('contas_pagar')
      .select('id, created_at')
      .eq('empresa_id', empresaId.value)
      .gte('created_at', inicio)
      .lte('created_at', fim)
      .order('created_at', { ascending: false })
      .limit(10)

    const events: RawEvent[] = []

    // Map orçamentos to events
    for (const orc of orcCriados ?? []) {
      const clienteNome = (orc.clientes as any)?.nome ?? null
      if (orc.status === 'aprovado') {
        events.push({
          id: orc.id,
          tipo: 'orcamento_aprovado',
          descricao: `Orçamento #${orc.id} aprovado`,
          clienteNome,
          criadoEm: orc.created_at,
        })
      } else {
        events.push({
          id: orc.id,
          tipo: 'orcamento_criado',
          descricao: `Orçamento #${orc.id} criado`,
          clienteNome,
          criadoEm: orc.created_at,
        })
      }
    }

    // Map OS to events
    for (const os of osCriadas ?? []) {
      const clienteNome = (os.clientes as any)?.nome ?? null
      events.push({
        id: os.id,
        tipo: 'os_criada',
        descricao: `OS #${os.id} criada`,
        clienteNome,
        criadoEm: os.created_at,
      })
    }

    // Map contas to events
    for (const conta of contasCriadas ?? []) {
      events.push({
        id: conta.id,
        tipo: 'conta_criada',
        descricao: `Conta #${conta.id} registrada`,
        clienteNome: null,
        criadoEm: conta.created_at,
      })
    }

    atividades.value = buildAtividadeFeed(events)
  }

  async function fetchTopClientes(): Promise<void> {
    const inicio = periodoRange.value.inicio
    const fim = periodoRange.value.fim

    // Fetch approved orçamentos with client info in the period
    const { data: orcAprovados } = await supabase
      .from('orcamentos_adesivo')
      .select('valor_total, cliente_id, clientes(nome)')
      .eq('empresa_id', empresaId.value)
      .eq('status', 'aprovado')
      .gte('created_at', inicio)
      .lte('created_at', fim)

    // Group by cliente_id and sum valor_total
    const clienteMap = new Map<number, { nome: string; total: number }>()
    for (const orc of orcAprovados ?? []) {
      if (!orc.cliente_id) continue
      const nome = (orc.clientes as any)?.nome ?? 'Cliente sem nome'
      const existing = clienteMap.get(orc.cliente_id)
      if (existing) {
        existing.total += orc.valor_total ?? 0
      } else {
        clienteMap.set(orc.cliente_id, { nome, total: orc.valor_total ?? 0 })
      }
    }

    // Sort descending by total, take top 5
    topClientes.value = [...clienteMap.values()]
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
  }

  async function fetchEvolucaoMensal(): Promise<void> {
    const mesesNomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    const hoje = new Date()

    // Calcular range de 12 meses
    const primeiroMes = new Date(hoje.getFullYear(), hoje.getMonth() - 11, 1)
    const inicioRange = `${primeiroMes.getFullYear()}-${String(primeiroMes.getMonth() + 1).padStart(2, '0')}-01`
    const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0)
    const fimRange = `${ultimoDia.getFullYear()}-${String(ultimoDia.getMonth() + 1).padStart(2, '0')}-${String(ultimoDia.getDate()).padStart(2, '0')}`

    // 4 queries em paralelo (em vez de ~72 sequenciais)
    const [vendasRes, contasRes, agendRes, osRes] = await Promise.all([
      supabase.from('vendas')
        .select('preco_veiculo, data_venda, vendas_itens(preco_unitario, quantidade, valor_total)')
        .eq('empresa_id', empresaId.value)
        .eq('status', 'finalizada')
        .gte('data_venda', inicioRange)
        .lte('data_venda', fimRange),
      supabase.from('contas_pagar')
        .select('valor, data_vencimento, data_pagamento, status, tipo')
        .eq('empresa_id', empresaId.value),
      supabase.from('agendamentos')
        .select('data_hora, valor_total')
        .eq('empresa_id', empresaId.value)
        .eq('status', 'concluido')
        .not('valor_total', 'is', null)
        .gt('valor_total', 0)
        .gte('data_hora', inicioRange)
        .lte('data_hora', fimRange + 'T23:59:59'),
      supabase.from('ordens_servico_adesivo')
        .select('valor_total, data_entrega')
        .eq('empresa_id', empresaId.value)
        .eq('status', 'entregue')
        .not('valor_total', 'is', null)
        .gt('valor_total', 0)
        .gte('data_entrega', inicioRange)
        .lte('data_entrega', fimRange),
    ])

    const vendasData = vendasRes.data ?? []
    const contasData = contasRes.data ?? []
    const agendData = agendRes.data ?? []
    const osData = osRes.data ?? []

    // Processar em memória por mês
    const resultados: EvolucaoMensal[] = []
    for (let i = 11; i >= 0; i--) {
      const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1)
      const year = d.getFullYear()
      const month = d.getMonth() + 1

      const receitaVendas = vendasData
        .filter((v: any) => {
          if (!v.data_venda) return false
          const dv = new Date(v.data_venda)
          return dv.getFullYear() === year && dv.getMonth() + 1 === month
        })
        .reduce((sum, v: any) => {
          const itemsTotal = (v.vendas_itens ?? []).reduce((s: number, it: any) => s + (it.valor_total ?? it.preco_unitario * it.quantidade), 0)
          return sum + (v.preco_veiculo ?? 0) + itemsTotal
        }, 0)

      const receitaAgendamentos = agendData
        .filter((a: any) => {
          if (!a.data_hora) return false
          const da = new Date(a.data_hora)
          return da.getFullYear() === year && da.getMonth() + 1 === month
        })
        .reduce((sum, a: any) => sum + (a.valor_total ?? 0), 0)

      const receitaOS = osData
        .filter((os: any) => {
          if (!os.data_entrega) return false
          const de = new Date(os.data_entrega)
          return de.getFullYear() === year && de.getMonth() + 1 === month
        })
        .reduce((sum, os: any) => sum + (os.valor_total ?? 0), 0)

      const receitaContas = contasData
        .filter((c: any) => {
          if ((c.tipo ?? 'pagar') !== 'receber' || c.status !== 'pago') return false
          const dateStr = c.data_pagamento ?? c.data_vencimento
          if (!dateStr) return false
          const dp = new Date(dateStr + 'T12:00:00')
          return dp.getFullYear() === year && dp.getMonth() + 1 === month
        })
        .reduce((sum, c: any) => sum + (c.valor ?? 0), 0)

      const faturamento = receitaVendas + receitaAgendamentos + receitaOS + receitaContas

      const despesas = contasData
        .filter((c: any) => {
          if ((c.tipo ?? 'pagar') === 'receber') return false
          if (c.status === 'cancelado' || !c.data_vencimento) return false
          const dv = new Date(c.data_vencimento + 'T12:00:00')
          return dv.getFullYear() === year && dv.getMonth() + 1 === month
        })
        .reduce((sum, c: any) => sum + (c.valor ?? 0), 0)

      const isCurrentMonth = (i === 0)
      const receitaAReceber = contasData
        .filter((c: any) => {
          if ((c.tipo ?? 'pagar') !== 'receber' || c.status !== 'pendente' || !c.valor) return false
          if (isCurrentMonth) return true
          const dateStr = c.data_vencimento
          if (!dateStr) return false
          const dv = new Date(dateStr + 'T12:00:00')
          return dv.getFullYear() === year && dv.getMonth() + 1 === month
        })
        .reduce((sum, c: any) => sum + (c.valor ?? 0), 0)

      resultados.push({
        mes: mesesNomes[d.getMonth()],
        faturamento,
        despesas,
        receitaAReceber,
      })
    }

    evolucaoMensal.value = resultados
  }

  async function fetchComparativo(): Promise<void> {
    const inicio = periodoRange.value.inicio
    const fim = periodoRange.value.fim

    // Calculate duration of current period in ms
    const inicioDate = new Date(inicio)
    const fimDate = new Date(fim)
    const duracao = fimDate.getTime() - inicioDate.getTime()

    // Previous period: same duration ending right before current starts
    const prevFim = new Date(inicioDate.getTime() - 1).toISOString()
    const prevInicio = new Date(inicioDate.getTime() - duracao).toISOString()

    // Receita anterior: OS entregues no período anterior
    const { data: osEntreguesAnterior } = await supabase
      .from('ordens_servico_adesivo')
      .select('valor_total')
      .eq('empresa_id', empresaId.value)
      .eq('status', 'entregue')
      .gte('data_entrega', prevInicio)
      .lte('data_entrega', prevFim)

    const receitaOSAnterior = (osEntreguesAnterior ?? []).reduce(
      (sum, o) => sum + (o.valor_total ?? 0), 0
    )

    // Receita anterior: Contas a receber pagas no período anterior
    const { data: contasReceberAnterior } = await supabase
      .from('contas_pagar')
      .select('valor')
      .eq('empresa_id', empresaId.value)
      .eq('tipo', 'receber')
      .eq('status', 'pago')
      .gte('data_vencimento', prevInicio)
      .lte('data_vencimento', prevFim)

    const receitaContasAnterior = (contasReceberAnterior ?? []).reduce(
      (sum, c) => sum + (c.valor ?? 0), 0
    )

    const faturamentoAnterior = receitaOSAnterior + receitaContasAnterior

    // Despesas anteriores
    const { data: contasAnterior } = await supabase
      .from('contas_pagar')
      .select('valor')
      .eq('empresa_id', empresaId.value)
      .neq('tipo', 'receber')
      .neq('status', 'cancelado')
      .gte('data_vencimento', prevInicio)
      .lte('data_vencimento', prevFim)

    const despesasAnterior = (contasAnterior ?? []).reduce(
      (sum, c) => sum + (c.valor ?? 0), 0
    )

    // Calculate percentage variations
    const variacaoFaturamento = faturamentoAnterior > 0
      ? ((financeiro.value.faturamento - faturamentoAnterior) / faturamentoAnterior) * 100
      : 0

    const variacaoDespesas = despesasAnterior > 0
      ? ((financeiro.value.despesas - despesasAnterior) / despesasAnterior) * 100
      : 0

    comparativo.value = {
      faturamentoAnterior,
      despesasAnterior,
      variacaoFaturamento,
      variacaoDespesas,
    }
  }

  async function fetchTicketMedio(): Promise<void> {
    const inicio = periodoRange.value.inicio
    const fim = periodoRange.value.fim

    const { data: orcAprovados } = await supabase
      .from('orcamentos_adesivo')
      .select('valor_total')
      .eq('empresa_id', empresaId.value)
      .eq('status', 'aprovado')
      .gte('created_at', inicio)
      .lte('created_at', fim)

    const items = orcAprovados ?? []
    const quantidade = items.length
    const somaTotal = items.reduce((sum, o) => sum + (o.valor_total ?? 0), 0)

    ticketMedio.value = {
      valor: quantidade > 0 ? somaTotal / quantidade : 0,
      quantidade,
    }
  }

  async function fetchProximosVencimentos(): Promise<void> {
    const hoje = new Date().toISOString().slice(0, 10)

    const { data: contas } = await supabase
      .from('contas_pagar')
      .select('id, descricao, valor, data_vencimento')
      .eq('empresa_id', empresaId.value)
      .gte('data_vencimento', hoje)
      .neq('status', 'pago')
      .neq('status', 'cancelado')
      .order('data_vencimento', { ascending: true })
      .limit(5)

    const hojeDate = new Date(hoje)
    proximosVencimentos.value = (contas ?? []).map((c) => {
      const vencDate = new Date(c.data_vencimento)
      const diffMs = vencDate.getTime() - hojeDate.getTime()
      const diasRestantes = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
      return {
        id: c.id,
        descricao: c.descricao ?? 'Sem descrição',
        valor: c.valor ?? 0,
        dataVencimento: c.data_vencimento,
        diasRestantes,
      }
    })
  }

  async function fetchAlertas(): Promise<void> {
    // Orçamentos enviados (para calcular os que estão expirando)
    const { data: orcEnviados } = await supabase
      .from('orcamentos_adesivo')
      .select('created_at, validade_dias')
      .eq('empresa_id', empresaId.value)
      .eq('status', 'enviado')

    // Contas vencidas: data_vencimento < hoje, tipo='pagar', status ≠ pago, ≠ cancelado
    const hoje = new Date().toISOString()
    const { data: contasVencidasData } = await supabase
      .from('contas_pagar')
      .select('valor')
      .eq('empresa_id', empresaId.value)
      .neq('tipo', 'receber')
      .lt('data_vencimento', hoje)
      .neq('status', 'pago')
      .neq('status', 'cancelado')

    // Calcular orçamentos expirando
    const hojeStart = new Date()
    hojeStart.setHours(0, 0, 0, 0)
    const sevenDaysFromNow = new Date(hojeStart.getTime() + 7 * 24 * 60 * 60 * 1000)

    const orcamentosExpirando = (orcEnviados ?? []).filter((orc) => {
      const createdAt = new Date(orc.created_at)
      const expiryDate = new Date(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate() + orc.validade_dias)
      return expiryDate >= hojeStart && expiryDate <= sevenDaysFromNow
    }).length

    const contasVencidas = (contasVencidasData ?? []).length
    const valorContasVencidas = (contasVencidasData ?? []).reduce((sum, c) => sum + (c.valor ?? 0), 0)

    // OS atrasadas: usar o MESMO valor calculado em fetchProducao para consistência
    const osAtrasadas = producao.value.osAtrasadas

    const temAlertas = orcamentosExpirando > 0 || contasVencidas > 0 || osAtrasadas > 0

    alertas.value = {
      orcamentosExpirando,
      contasVencidas,
      valorContasVencidas,
      osAtrasadas,
      temAlertas,
    }
  }

  // ── Refresh ──────────────────────────────────────────────────────────────

  async function refresh(): Promise<void> {
    // Guard: don't execute queries if empresaId is not resolved
    if (!empresaId.value) return

    loading.value = true
    try {
      // Primeiro: buscar dados de produção (osAtrasadas é usado por alertas)
      await Promise.allSettled([
        fetchFinanceiro(),
        fetchPrevisao(),
        fetchPipeline(),
        fetchProducao(),
        fetchAtividade(),
        fetchTopClientes(),
        fetchEvolucaoMensal(),
        fetchComparativo(),
        fetchTicketMedio(),
        fetchProximosVencimentos(),
      ])
      // Depois: calcular alertas (depende de producao.osAtrasadas)
      await fetchAlertas()
    } finally {
      loading.value = false
    }
  }

  // ── Reactive Watches ─────────────────────────────────────────────────────

  // Re-execute all queries when period filter or custom period changes
  watch([periodoFiltro, periodoCustom], () => {
    refresh()
  }, { immediate: true, deep: true })

  // When empresaId becomes available (non-null), trigger refresh
  watch(empresaId, (newId) => {
    if (newId) {
      refresh()
    }
  })

  // Realtime: atualiza dashboard ao vivo quando dados mudam
  useRealtimeMulti(['contas_pagar', 'vendas', 'agendamentos', 'ordens_servico_adesivo', 'orcamentos_adesivo'], () => {
    refresh()
  })

  // ── Return ───────────────────────────────────────────────────────────────

  return {
    loading,
    financeiro,
    previsao,
    pipeline,
    producao,
    atividades,
    alertas,
    topClientes,
    evolucaoMensal,
    comparativo,
    ticketMedio,
    proximosVencimentos,
    periodoFiltro,
    periodoCustom,
    periodoRange,
    periodoLabel,
    refresh,
  }
}
