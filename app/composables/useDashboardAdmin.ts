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

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface MetricasFinanceiras {
  faturamento: number
  despesas: number
  lucroEstimado: number
  contasVencidas: number
  valorContasVencidas: number
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

    // Faturamento: soma valor_total de orçamentos aprovados no período
    const { data: orcAprovados } = await supabase
      .from('orcamentos_adesivo')
      .select('valor_total')
      .eq('empresa_id', empresaId.value)
      .eq('status', 'aprovado')
      .gte('created_at', inicio)
      .lte('created_at', fim)

    const faturamento = (orcAprovados ?? []).reduce(
      (sum, o) => sum + (o.valor_total ?? 0), 0
    )

    // Despesas: soma valor de contas_pagar (status ≠ cancelado) no período
    const { data: contas } = await supabase
      .from('contas_pagar')
      .select('valor, data_vencimento, status')
      .eq('empresa_id', empresaId.value)
      .neq('status', 'cancelado')
      .gte('data_vencimento', inicio)
      .lte('data_vencimento', fim)

    const despesas = (contas ?? []).reduce(
      (sum, c) => sum + (c.valor ?? 0), 0
    )

    // Contas vencidas: data_vencimento < hoje e status ≠ pago (already ≠ cancelado from above)
    const hoje = new Date().toISOString()
    const contasVencidasList = (contas ?? []).filter(
      (c) => c.data_vencimento < hoje && c.status !== 'pago'
    )
    const contasVencidasCount = contasVencidasList.length
    const valorContasVencidas = contasVencidasList.reduce(
      (sum, c) => sum + (c.valor ?? 0), 0
    )

    financeiro.value = {
      faturamento,
      despesas,
      lucroEstimado: faturamento - despesas,
      contasVencidas: contasVencidasCount,
      valorContasVencidas,
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
    const resultados: EvolucaoMensal[] = []

    for (let i = 5; i >= 0; i--) {
      const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1)
      const inicioMes = d.toISOString()
      const fimMes = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59).toISOString()

      const { data: orcMes } = await supabase
        .from('orcamentos_adesivo')
        .select('valor_total')
        .eq('empresa_id', empresaId.value)
        .eq('status', 'aprovado')
        .gte('created_at', inicioMes)
        .lte('created_at', fimMes)

      const faturamento = (orcMes ?? []).reduce((sum, o) => sum + (o.valor_total ?? 0), 0)

      const { data: contasMes } = await supabase
        .from('contas_pagar')
        .select('valor')
        .eq('empresa_id', empresaId.value)
        .neq('status', 'cancelado')
        .gte('data_vencimento', inicioMes)
        .lte('data_vencimento', fimMes)

      const despesas = (contasMes ?? []).reduce((sum, c) => sum + (c.valor ?? 0), 0)

      resultados.push({
        mes: mesesNomes[d.getMonth()],
        faturamento,
        despesas,
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

    // Faturamento anterior
    const { data: orcAnterior } = await supabase
      .from('orcamentos_adesivo')
      .select('valor_total')
      .eq('empresa_id', empresaId.value)
      .eq('status', 'aprovado')
      .gte('created_at', prevInicio)
      .lte('created_at', prevFim)

    const faturamentoAnterior = (orcAnterior ?? []).reduce(
      (sum, o) => sum + (o.valor_total ?? 0), 0
    )

    // Despesas anteriores
    const { data: contasAnterior } = await supabase
      .from('contas_pagar')
      .select('valor')
      .eq('empresa_id', empresaId.value)
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

    // Contas vencidas: data_vencimento < hoje, status ≠ pago, ≠ cancelado
    const hoje = new Date().toISOString()
    const { data: contasVencidasData } = await supabase
      .from('contas_pagar')
      .select('valor')
      .eq('empresa_id', empresaId.value)
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

  // ── Return ───────────────────────────────────────────────────────────────

  return {
    loading,
    financeiro,
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
