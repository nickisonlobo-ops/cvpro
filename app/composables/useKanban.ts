// app/composables/useKanban.ts

import { ref, computed, type ComputedRef } from 'vue'
import { createSupabaseClient } from '~/lib/supabase'
import { useEtapas, type Etapa, type PipelineTipo } from './useEtapas'
import { useEmpresa } from './useEmpresa'

// ─── Interfaces ───────────────────────────────────────────

export interface KanbanCard {
  id: number
  etapa_id: number
  titulo: string
  subtitulo?: string
  info_extra?: Record<string, string>
}

export interface KanbanState {
  etapas: Etapa[]
  cards: KanbanCard[]
  loading: boolean
  error: string | null
}

// ─── Composable ───────────────────────────────────────────

export function useKanban(pipelineTipo: PipelineTipo) {
  const supabase = createSupabaseClient()
  const { carregarEtapas } = useEtapas()
  const { empresaId, loadEmpresa } = useEmpresa()

  // ─── Estado reativo ─────────────────────────────────────
  const state = ref<KanbanState>({
    etapas: [],
    cards: [],
    loading: false,
    error: null,
  })

  // ─── Inicializar: carrega etapas + cards do pipeline ────
  async function inicializar(): Promise<void> {
    state.value.loading = true
    state.value.error = null

    try {
      // Garantir que empresa está carregada
      await loadEmpresa()
      if (!empresaId.value) {
        throw new Error('Empresa não identificada. Faça login novamente.')
      }

      // Carregar etapas (com seed automático no primeiro acesso)
      const etapas = await carregarEtapas(pipelineTipo)
      state.value.etapas = etapas

      // Carregar cards conforme o pipeline
      const cards = await carregarCards()
      state.value.cards = cards
    } catch (err: any) {
      state.value.error = err.message ?? 'Erro ao inicializar o kanban.'
      console.error('[useKanban] Erro ao inicializar:', err)
    } finally {
      state.value.loading = false
    }
  }

  // ─── Carregar cards conforme pipeline_tipo ──────────────
  async function carregarCards(): Promise<KanbanCard[]> {
    switch (pipelineTipo) {
      case 'crm':
        return await carregarCardsCRM()
      case 'producao':
        return await carregarCardsProducao()
      case 'orcamentos':
        return await carregarCardsOrcamentos()
    }
  }

  // ─── CRM: tabela `clientes` ─────────────────────────────
  async function carregarCardsCRM(): Promise<KanbanCard[]> {
    const { data, error } = await supabase
      .from('clientes')
      .select('id, nome, telefone, etapa_id, created_at')
      .eq('empresa_id', empresaId.value!)

    if (error) {
      throw new Error(`Erro ao carregar clientes: ${error.message}`)
    }

    // Atribuir primeira etapa aos itens sem etapa_id
    const primeiraEtapaId = state.value.etapas[0]?.id ?? null
    const itensParaAtualizar: number[] = []

    const cards = (data ?? []).map((cliente: any) => {
      let etapaId = cliente.etapa_id
      if (!etapaId && primeiraEtapaId) {
        etapaId = primeiraEtapaId
        itensParaAtualizar.push(cliente.id)
      }
      return {
        id: cliente.id,
        etapa_id: etapaId,
        titulo: cliente.nome ?? 'Sem nome',
        subtitulo: cliente.telefone ?? undefined,
        info_extra: {
          telefone: cliente.telefone ?? '—',
          ultima_interacao: formatarData(cliente.created_at),
        },
      }
    }).filter((c: any) => c.etapa_id != null)

    // Persistir atribuição em batch (background, sem bloquear)
    if (itensParaAtualizar.length > 0 && primeiraEtapaId) {
      supabase
        .from('clientes')
        .update({ etapa_id: primeiraEtapaId })
        .in('id', itensParaAtualizar)
        .then(({ error: batchErr }) => {
          if (batchErr) console.warn('[useKanban] Erro ao atribuir etapa_id em clientes:', batchErr.message)
        })
    }

    return cards
  }

  // ─── Produção: tabela `ordens_servico_adesivo` ──────────
  async function carregarCardsProducao(): Promise<KanbanCard[]> {
    const { data, error } = await supabase
      .from('ordens_servico_adesivo')
      .select('id, numero_os, nome_trabalho, valor_total, data_aprovacao, etapa_id, status, clientes(nome)')

    if (error) {
      throw new Error(`Erro ao carregar ordens de serviço: ${error.message}`)
    }

    // Mapear status existente → etapa correspondente (por posição, não por nome)
    const etapas = state.value.etapas
    const primeiraEtapaId = etapas[0]?.id ?? null
    const etapaFinalId = etapas.find(e => e.is_final)?.id ?? etapas[etapas.length - 1]?.id ?? null
    // Etapas intermediárias (nem primeira nem final)
    const etapasIntermediarias = etapas.filter(e => e.posicao > 0 && !e.is_final)
    const itensParaAtualizar: { id: number; etapa_id: number }[] = []

    const cards = (data ?? []).map((os: any) => {
      let etapaId = os.etapa_id
      if (!etapaId) {
        // Atribuir etapa com base no status atual da OS (sem depender de nomes)
        if (os.status === 'entregue') {
          etapaId = etapaFinalId
        } else if (os.status === 'aguardando_producao') {
          etapaId = primeiraEtapaId
        } else {
          // em_producao, pronto → colocar na primeira intermediária
          etapaId = etapasIntermediarias[0]?.id ?? primeiraEtapaId
        }
        if (etapaId) {
          itensParaAtualizar.push({ id: os.id, etapa_id: etapaId })
        }
      }
      return {
        id: os.id,
        etapa_id: etapaId,
        titulo: os.numero_os ?? `OS #${os.id}`,
        subtitulo: os.nome_trabalho ?? undefined,
        info_extra: {
          numero_os: os.numero_os ?? '—',
          nome_trabalho: os.nome_trabalho ?? '—',
          cliente: os.clientes?.nome ?? '—',
          valor_total: formatarValor(os.valor_total),
          data_aprovacao: formatarData(os.data_aprovacao),
        },
      }
    }).filter((c: any) => c.etapa_id != null)

    // Persistir atribuição em batch (background, sem bloquear)
    if (itensParaAtualizar.length > 0) {
      Promise.all(
        itensParaAtualizar.map(item =>
          supabase
            .from('ordens_servico_adesivo')
            .update({ etapa_id: item.etapa_id })
            .eq('id', item.id)
        )
      ).catch(err => console.warn('[useKanban] Erro ao atribuir etapa_id em OS:', err))
    }

    return cards
  }

  // ─── Orçamentos: tabela `orcamentos_adesivo` ────────────
  async function carregarCardsOrcamentos(): Promise<KanbanCard[]> {
    const { data, error } = await supabase
      .from('orcamentos_adesivo')
      .select('id, numero_orcamento, valor_total, created_at, etapa_id, clientes(nome)')

    if (error) {
      throw new Error(`Erro ao carregar orçamentos: ${error.message}`)
    }

    // Atribuir primeira etapa aos itens sem etapa_id
    const primeiraEtapaId = state.value.etapas[0]?.id ?? null
    const itensParaAtualizar: number[] = []

    const cards = (data ?? []).map((orc: any) => {
      let etapaId = orc.etapa_id
      if (!etapaId && primeiraEtapaId) {
        etapaId = primeiraEtapaId
        itensParaAtualizar.push(orc.id)
      }
      return {
        id: orc.id,
        etapa_id: etapaId,
        titulo: orc.numero_orcamento ?? `ORC #${orc.id}`,
        subtitulo: orc.clientes?.nome ?? undefined,
        info_extra: {
          numero: orc.numero_orcamento ?? '—',
          cliente: orc.clientes?.nome ?? '—',
          valor_total: formatarValor(orc.valor_total),
          data_criacao: formatarData(orc.created_at),
        },
      }
    }).filter((c: any) => c.etapa_id != null)

    // Persistir atribuição em batch (background, sem bloquear)
    if (itensParaAtualizar.length > 0 && primeiraEtapaId) {
      supabase
        .from('orcamentos_adesivo')
        .update({ etapa_id: primeiraEtapaId })
        .in('id', itensParaAtualizar)
        .then(({ error: batchErr }) => {
          if (batchErr) console.warn('[useKanban] Erro ao atribuir etapa_id em orçamentos:', batchErr.message)
        })
    }

    return cards
  }

  // ─── Mover card para outra etapa (otimista + persistência) ──
  async function moverCard(cardId: number, novaEtapaId: number): Promise<void> {
    // Encontrar o card no estado local
    const cardIndex = state.value.cards.findIndex((c) => c.id === cardId)
    if (cardIndex === -1) {
      throw new Error('Card não encontrado no estado local.')
    }

    const card = state.value.cards[cardIndex]
    const etapaAnteriorId = card.etapa_id

    // Se a etapa não mudou, nada a fazer
    if (etapaAnteriorId === novaEtapaId) return

    // ─── 1. Atualização otimista: move o card localmente ──
    state.value.cards[cardIndex] = { ...card, etapa_id: novaEtapaId }

    // ─── 2. Determinar a tabela do banco de dados ─────────
    let tabela: string
    switch (pipelineTipo) {
      case 'crm':
        tabela = 'clientes'
        break
      case 'producao':
        tabela = 'ordens_servico_adesivo'
        break
      case 'orcamentos':
        tabela = 'orcamentos_adesivo'
        break
    }

    // ─── 3. Verificar se a etapa destino é final ──────────
    const etapaDestino = state.value.etapas.find((e) => e.id === novaEtapaId)
    const etapaOrigem = state.value.etapas.find((e) => e.id === etapaAnteriorId)
    const destinoIsFinal = etapaDestino?.is_final ?? false
    const origemIsFinal = etapaOrigem?.is_final ?? false

    // ─── 4. Montar payload de persistência ────────────────
    const updatePayload: Record<string, unknown> = {
      etapa_id: novaEtapaId,
    }

    // Para pipelines producao e orcamentos: gerenciar conclusão
    if (pipelineTipo === 'producao') {
      if (destinoIsFinal) {
        updatePayload.data_entrega = new Date().toISOString()
      } else if (origemIsFinal && !destinoIsFinal) {
        updatePayload.data_entrega = null
      }
    }

    // Para pipeline producao: sincronizar campo `status` baseado na POSIÇÃO da etapa (não no nome)
    if (pipelineTipo === 'producao' && etapaDestino) {
      if (etapaDestino.is_final) {
        // Etapa final = entregue
        updatePayload.status = 'entregue'
        if (!updatePayload.data_entrega) {
          updatePayload.data_entrega = new Date().toISOString()
        }
      } else if (etapaDestino.posicao === 0) {
        // Primeira etapa = aguardando
        updatePayload.status = 'aguardando_producao'
      } else {
        // Qualquer etapa intermediária = em produção
        updatePayload.status = 'em_producao'
        // Registrar inicio de produção se saiu da primeira etapa
        if (etapaOrigem && etapaOrigem.posicao === 0) {
          updatePayload.data_inicio_producao = new Date().toISOString()
        }
      }
    }

    // Para pipeline orcamentos: sincronizar campo `status` baseado na POSIÇÃO da etapa
    if (pipelineTipo === 'orcamentos' && etapaDestino) {
      if (etapaDestino.is_final) {
        // Etapa final = rejeitado (reprovado)
        updatePayload.status = 'rejeitado'
      } else if (etapaDestino.posicao === 0) {
        // Primeira etapa = rascunho
        updatePayload.status = 'rascunho'
      } else {
        // Intermediárias: verificar qual
        const etapas = state.value.etapas
        const nonFinal = etapas.filter(e => !e.is_final)
        const ultimaNonFinal = nonFinal[nonFinal.length - 1]
        if (ultimaNonFinal && etapaDestino.id === ultimaNonFinal.id) {
          // Penúltima não-final = aprovado
          updatePayload.status = 'aprovado'
        } else {
          // Demais intermediárias = enviado
          updatePayload.status = 'enviado'
        }
      }
    }

    // ─── 5. Persistir no Supabase ─────────────────────────
    try {
      const { error } = await supabase
        .from(tabela)
        .update(updatePayload)
        .eq('id', cardId)

      if (error) {
        throw new Error(`Erro ao mover card: ${error.message}`)
      }
    } catch (err: any) {
      // ─── 6. Rollback: reverter card para etapa original ──
      state.value.cards[cardIndex] = { ...state.value.cards[cardIndex], etapa_id: etapaAnteriorId }
      console.error('[useKanban] Falha ao mover card, rollback realizado:', err)
      throw err
    }
  }

  // ─── Computed: cards filtrados por etapa ─────────────────
  function cardsPorEtapa(etapaId: number): ComputedRef<KanbanCard[]> {
    return computed(() =>
      state.value.cards.filter((card) => card.etapa_id === etapaId)
    )
  }

  // ─── Computed: contagem de cards por etapa ──────────────
  function contagemPorEtapa(etapaId: number): ComputedRef<number> {
    return computed(() =>
      state.value.cards.filter((card) => card.etapa_id === etapaId).length
    )
  }

  // ─── Helpers de formatação ──────────────────────────────
  function formatarData(data: string | null): string {
    if (!data) return '—'
    try {
      return new Date(data).toLocaleDateString('pt-BR')
    } catch {
      return '—'
    }
  }

  function formatarValor(valor: number | null): string {
    if (valor == null) return 'R$ 0,00'
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  return {
    state,
    inicializar,
    moverCard,
    cardsPorEtapa,
    contagemPorEtapa,
  }
}
