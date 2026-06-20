// app/composables/useOrdensServico.ts

import { createSupabaseClient } from '~/lib/supabase'

export type StatusOS = 'aguardando_producao' | 'em_producao' | 'pronto' | 'entregue' | 'cancelado'
export type FormaPagamento = 'dinheiro' | 'pix' | 'cartao' | 'boleto' | 'parcelado'

export interface OrdemServico {
  id: number
  empresa_id: number
  orcamento_id: number
  cliente_id: number
  numero_os: string
  status: StatusOS
  forma_pagamento: FormaPagamento | null
  valor_total: number
  posicao_fila: number
  data_aprovacao: string
  origem_aprovacao: 'interno' | 'link_externo'
  prazo_estimado: string | null
  observacoes: string | null
}

export interface ItemOS {
  id: number
  ordem_servico_id: number
  item_orcamento_id: number
  descricao: string
  material_id: number
  largura_cm: number
  altura_cm: number
  quantidade: number
  valor_item: number
  foto_arte_url?: string | null
  foto_local_url?: string | null
  arquivo_url?: string | null
  foto_instalacao_url?: string | null
  created_at?: string
}

export function useOrdensServico() {
  const supabase = createSupabaseClient()

  // ─── Transições válidas de status da OS ─────────────────
  const transicoesValidas: Record<StatusOS, StatusOS[]> = {
    aguardando_producao: ['em_producao', 'cancelado'],
    em_producao: ['pronto', 'cancelado'],
    pronto: ['entregue', 'cancelado'],
    entregue: ['cancelado'],
    cancelado: [],
  }

  /**
   * Valida se a transição de status é permitida.
   * Transições válidas:
   * - aguardando_producao → em_producao
   * - em_producao → pronto
   * - pronto → entregue
   * - qualquer status (exceto cancelado) → cancelado
   */
  function validarTransicaoOS(atual: StatusOS, novo: StatusOS): boolean {
    if (atual === novo) return false
    const permitidas = transicoesValidas[atual]
    if (!permitidas) return false
    return permitidas.includes(novo)
  }

  // ─── Geração de número sequencial da OS ─────────────────
  /**
   * Gera número da OS no formato "OS-{N}" onde N = ultimoNumero + 1
   */
  function gerarNumeroOS(ultimoNumero: number): string {
    return `OS-${ultimoNumero + 1}`
  }

  // ─── CRUD: Buscar OS por orçamento ──────────────────────
  /**
   * Busca a Ordem de Serviço vinculada a um orçamento específico.
   */
  async function buscarOSPorOrcamento(orcamentoId: number): Promise<OrdemServico | null> {
    const { data, error } = await supabase
      .from('ordens_servico_adesivo')
      .select('*')
      .eq('orcamento_id', orcamentoId)
      .maybeSingle()

    if (error) {
      console.error('Erro ao buscar OS por orçamento:', error)
      throw error
    }

    return data as OrdemServico | null
  }

  // ─── CRUD: Atualizar status da OS ───────────────────────
  /**
   * Atualiza o status de uma OS, validando a transição antes.
   * Registra a data/hora da transição nos campos correspondentes.
   */
  async function atualizarStatusOS(
    osId: number,
    statusAtual: StatusOS,
    novoStatus: StatusOS
  ): Promise<OrdemServico> {
    if (!validarTransicaoOS(statusAtual, novoStatus)) {
      throw new Error(
        `Transição de status inválida: ${statusAtual} → ${novoStatus}`
      )
    }

    const updateData: Record<string, unknown> = { status: novoStatus }

    // Registrar data/hora de cada transição
    if (novoStatus === 'em_producao') {
      updateData.data_inicio_producao = new Date().toISOString()
    } else if (novoStatus === 'pronto') {
      updateData.data_fim_producao = new Date().toISOString()
    } else if (novoStatus === 'entregue') {
      updateData.data_entrega = new Date().toISOString()
    }

    // Sincronizar etapa_id do kanban com o novo status
    try {
      const etapaCorrespondente = await buscarEtapaPorNomeStatus(novoStatus)
      if (etapaCorrespondente) {
        updateData.etapa_id = etapaCorrespondente.id
      }
    } catch (e) {
      // Se falhar a busca da etapa, continua sem atualizar etapa_id
      console.warn('[useOrdensServico] Não foi possível sincronizar etapa_id:', e)
    }

    const { data, error } = await supabase
      .from('ordens_servico_adesivo')
      .update(updateData)
      .eq('id', osId)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar status da OS:', error)
      throw error
    }

    return data as OrdemServico
  }

  /**
   * Busca a etapa do pipeline de produção que corresponde ao status da OS.
   * Usa posição e is_final em vez de nomes (que podem ser customizados):
   * - aguardando_producao → primeira etapa (posicao 0)
   * - entregue → etapa com is_final = true
   * - em_producao/pronto → etapas intermediárias (busca pela posição relativa)
   */
  async function buscarEtapaPorNomeStatus(status: StatusOS) {
    const { data: etapas } = await supabase
      .from('pipeline_etapas')
      .select('id, is_final, posicao')
      .eq('pipeline_tipo', 'producao')
      .order('posicao', { ascending: true })

    if (!etapas || etapas.length === 0) return null

    if (status === 'entregue') {
      // Etapa final
      return etapas.find(e => e.is_final) ?? etapas[etapas.length - 1]
    } else if (status === 'aguardando_producao') {
      // Primeira etapa
      return etapas[0]
    } else {
      // Intermediárias (em_producao, pronto) — pegar a segunda etapa ou intermediárias
      // em_producao = segunda etapa, pronto = penúltima etapa (antes da final)
      const nonFinal = etapas.filter(e => !e.is_final)
      if (status === 'pronto' && nonFinal.length >= 3) {
        return nonFinal[nonFinal.length - 1] // penúltima não-final
      }
      // Default: segunda etapa
      return nonFinal.length >= 2 ? nonFinal[1] : nonFinal[0]
    }
  }

  // ─── CRUD: Cancelar OS ──────────────────────────────────
  /**
   * Cancela uma OS registrando o motivo obrigatório.
   */
  async function cancelarOS(
    osId: number,
    statusAtual: StatusOS,
    motivo: string
  ): Promise<OrdemServico> {
    if (!motivo || motivo.trim().length === 0) {
      throw new Error('Motivo de cancelamento é obrigatório')
    }

    if (!validarTransicaoOS(statusAtual, 'cancelado')) {
      throw new Error(
        `Não é possível cancelar uma OS com status: ${statusAtual}`
      )
    }

    const { data, error } = await supabase
      .from('ordens_servico_adesivo')
      .update({
        status: 'cancelado',
        motivo_cancelamento: motivo.trim(),
        etapa_id: null,
      })
      .eq('id', osId)
      .select()
      .single()

    if (error) {
      console.error('Erro ao cancelar OS:', error)
      throw error
    }

    return data as OrdemServico
  }

  // ─── CRUD: Atualizar forma de pagamento ─────────────────
  /**
   * Atualiza a forma de pagamento de uma OS (quando pendente).
   */
  async function atualizarFormaPagamento(
    osId: number,
    formaPagamento: FormaPagamento
  ): Promise<OrdemServico> {
    const { data, error } = await supabase
      .from('ordens_servico_adesivo')
      .update({ forma_pagamento: formaPagamento })
      .eq('id', osId)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar forma de pagamento:', error)
      throw error
    }

    return data as OrdemServico
  }

  return {
    validarTransicaoOS,
    gerarNumeroOS,
    buscarOSPorOrcamento,
    atualizarStatusOS,
    cancelarOS,
    atualizarFormaPagamento,
  }
}
