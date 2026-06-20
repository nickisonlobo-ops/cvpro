// app/composables/useEtapas.ts

import { createSupabaseClient } from '~/lib/supabase'
import { useEmpresa } from './useEmpresa'

// ─── Tipos e Interfaces ───────────────────────────────────

export type PipelineTipo = 'crm' | 'producao' | 'orcamentos'

export interface Etapa {
  id: number
  empresa_id: number
  pipeline_tipo: PipelineTipo
  nome: string
  cor: string
  posicao: number
  is_final: boolean
  created_at: string
  updated_at: string
}

export interface CriarEtapaInput {
  nome: string
  cor: string
  pipeline_tipo: PipelineTipo
}

export interface AtualizarEtapaInput {
  nome?: string
  cor?: string
  is_final?: boolean
}

// ─── Dados de Seed (Etapas Padrão) ───────────────────────

type EtapaSeed = Omit<Etapa, 'id' | 'empresa_id' | 'created_at' | 'updated_at'>

const SEED_CRM: EtapaSeed[] = [
  { pipeline_tipo: 'crm', nome: 'Lead', cor: '#3b82f6', posicao: 0, is_final: false },
  { pipeline_tipo: 'crm', nome: 'Prospectando', cor: '#8b5cf6', posicao: 1, is_final: false },
  { pipeline_tipo: 'crm', nome: 'Orçamento Enviado', cor: '#f59e0b', posicao: 2, is_final: false },
  { pipeline_tipo: 'crm', nome: 'Cliente Ativo', cor: '#10b981', posicao: 3, is_final: false },
  { pipeline_tipo: 'crm', nome: 'Inativo', cor: '#6b7280', posicao: 4, is_final: true },
]

const SEED_PRODUCAO: EtapaSeed[] = [
  { pipeline_tipo: 'producao', nome: 'Aguardando', cor: '#f59e0b', posicao: 0, is_final: false },
  { pipeline_tipo: 'producao', nome: 'Em Produção', cor: '#3b82f6', posicao: 1, is_final: false },
  { pipeline_tipo: 'producao', nome: 'Pronto', cor: '#10b981', posicao: 2, is_final: false },
  { pipeline_tipo: 'producao', nome: 'Entregue', cor: '#059669', posicao: 3, is_final: true },
]

const SEED_ORCAMENTOS: EtapaSeed[] = [
  { pipeline_tipo: 'orcamentos', nome: 'Novo', cor: '#f59e0b', posicao: 0, is_final: false },
  { pipeline_tipo: 'orcamentos', nome: 'Em Análise', cor: '#3b82f6', posicao: 1, is_final: false },
  { pipeline_tipo: 'orcamentos', nome: 'Enviado', cor: '#8b5cf6', posicao: 2, is_final: false },
  { pipeline_tipo: 'orcamentos', nome: 'Aprovado', cor: '#10b981', posicao: 3, is_final: false },
  { pipeline_tipo: 'orcamentos', nome: 'Reprovado', cor: '#ef4444', posicao: 4, is_final: true },
]

// ─── Composable ───────────────────────────────────────────

export function useEtapas() {
  const supabase = createSupabaseClient()
  const { empresaId, loadEmpresa } = useEmpresa()

  // ─── Helpers internos ─────────────────────────────────

  async function getEmpresaId(): Promise<number> {
    await loadEmpresa()
    if (!empresaId.value) {
      throw new Error('Empresa não identificada. Faça login novamente.')
    }
    return empresaId.value
  }

  // ─── Gerar etapas padrão para um pipeline ─────────────
  function gerarEtapasPadrao(pipelineTipo: PipelineTipo): EtapaSeed[] {
    switch (pipelineTipo) {
      case 'crm':
        return [...SEED_CRM]
      case 'producao':
        return [...SEED_PRODUCAO]
      case 'orcamentos':
        return [...SEED_ORCAMENTOS]
    }
  }

  // ─── Validação de etapa ───────────────────────────────
  function validarEtapa(input: CriarEtapaInput): { valid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {}

    if (!input.nome || input.nome.trim().length === 0) {
      errors.nome = 'Nome da etapa é obrigatório'
    } else if (input.nome.trim().length > 50) {
      errors.nome = 'Nome deve ter no máximo 50 caracteres'
    }

    if (!input.cor || !/^#[0-9a-fA-F]{6}$/.test(input.cor)) {
      errors.cor = 'Cor inválida (formato: #RRGGBB)'
    }

    return { valid: Object.keys(errors).length === 0, errors }
  }

  // ─── Carregar etapas (com seed automático no primeiro acesso) ───
  async function carregarEtapas(pipelineTipo: PipelineTipo): Promise<Etapa[]> {
    const empId = await getEmpresaId()

    const { data, error } = await supabase
      .from('pipeline_etapas')
      .select('*')
      .eq('empresa_id', empId)
      .eq('pipeline_tipo', pipelineTipo)
      .order('posicao', { ascending: true })

    if (error) {
      throw new Error(`Erro ao carregar etapas: ${error.message}`)
    }

    // Primeiro acesso: array vazio → inserir etapas padrão
    if (!data || data.length === 0) {
      const seedData = gerarEtapasPadrao(pipelineTipo)
      const insertPayload = seedData.map((etapa) => ({
        empresa_id: empId,
        pipeline_tipo: etapa.pipeline_tipo,
        nome: etapa.nome,
        cor: etapa.cor,
        posicao: etapa.posicao,
        is_final: etapa.is_final,
      }))

      const { data: inserted, error: insertError } = await supabase
        .from('pipeline_etapas')
        .insert(insertPayload)
        .select()
        .order('posicao', { ascending: true })

      if (insertError) {
        throw new Error(`Erro ao criar etapas padrão: ${insertError.message}`)
      }

      return inserted as Etapa[]
    }

    return data as Etapa[]
  }

  // ─── Criar etapa na última posição ────────────────────
  async function criarEtapa(input: CriarEtapaInput): Promise<Etapa> {
    const empId = await getEmpresaId()

    // Buscar a maior posição atual no pipeline
    const { data: existing, error: fetchError } = await supabase
      .from('pipeline_etapas')
      .select('posicao')
      .eq('empresa_id', empId)
      .eq('pipeline_tipo', input.pipeline_tipo)
      .order('posicao', { ascending: false })
      .limit(1)

    if (fetchError) {
      throw new Error(`Erro ao buscar posição: ${fetchError.message}`)
    }

    const novaPosicao = existing && existing.length > 0 ? existing[0].posicao + 1 : 0

    const { data, error } = await supabase
      .from('pipeline_etapas')
      .insert({
        empresa_id: empId,
        pipeline_tipo: input.pipeline_tipo,
        nome: input.nome.trim(),
        cor: input.cor,
        posicao: novaPosicao,
        is_final: false,
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Erro ao criar etapa: ${error.message}`)
    }

    return data as Etapa
  }

  // ─── Atualizar etapa (nome, cor, is_final) ────────────
  async function atualizarEtapa(etapaId: number, input: AtualizarEtapaInput): Promise<Etapa> {
    const empId = await getEmpresaId()

    // Se marcando como is_final, desmarcar a anterior no mesmo pipeline
    if (input.is_final === true) {
      // Buscar a etapa sendo atualizada para saber o pipeline_tipo
      const { data: etapaAtual, error: fetchErr } = await supabase
        .from('pipeline_etapas')
        .select('pipeline_tipo')
        .eq('id', etapaId)
        .single()

      if (fetchErr) {
        throw new Error(`Erro ao buscar etapa: ${fetchErr.message}`)
      }

      // Desmarcar todas as is_final do mesmo pipeline/empresa
      const { error: unmarkError } = await supabase
        .from('pipeline_etapas')
        .update({ is_final: false })
        .eq('empresa_id', empId)
        .eq('pipeline_tipo', etapaAtual.pipeline_tipo)
        .eq('is_final', true)

      if (unmarkError) {
        throw new Error(`Erro ao desmarcar etapa final anterior: ${unmarkError.message}`)
      }
    }

    // Montar payload de atualização (somente campos informados)
    const updatePayload: Record<string, unknown> = {}
    if (input.nome !== undefined) updatePayload.nome = input.nome.trim()
    if (input.cor !== undefined) updatePayload.cor = input.cor
    if (input.is_final !== undefined) updatePayload.is_final = input.is_final

    const { data, error } = await supabase
      .from('pipeline_etapas')
      .update(updatePayload)
      .eq('id', etapaId)
      .eq('empresa_id', empId)
      .select()
      .single()

    if (error) {
      throw new Error(`Erro ao atualizar etapa: ${error.message}`)
    }

    return data as Etapa
  }

  // ─── Excluir etapa (com validações) ───────────────────
  async function excluirEtapa(etapaId: number): Promise<void> {
    const empId = await getEmpresaId()

    // Buscar a etapa para saber o pipeline_tipo
    const { data: etapa, error: fetchErr } = await supabase
      .from('pipeline_etapas')
      .select('pipeline_tipo')
      .eq('id', etapaId)
      .eq('empresa_id', empId)
      .single()

    if (fetchErr || !etapa) {
      throw new Error('Etapa não encontrada.')
    }

    // Verificar mínimo de 2 etapas no pipeline
    const { count, error: countErr } = await supabase
      .from('pipeline_etapas')
      .select('id', { count: 'exact', head: true })
      .eq('empresa_id', empId)
      .eq('pipeline_tipo', etapa.pipeline_tipo)

    if (countErr) {
      throw new Error(`Erro ao contar etapas: ${countErr.message}`)
    }

    if ((count ?? 0) <= 2) {
      throw new Error('Pipeline deve ter no mínimo 2 etapas.')
    }

    // Verificar se há itens associados
    const temItens = await etapaTemItens(etapaId, etapa.pipeline_tipo as PipelineTipo)
    if (temItens) {
      throw new Error('Não é possível excluir esta etapa enquanto houver itens associados a ela.')
    }

    // Excluir a etapa
    const { error: deleteErr } = await supabase
      .from('pipeline_etapas')
      .delete()
      .eq('id', etapaId)
      .eq('empresa_id', empId)

    if (deleteErr) {
      throw new Error(`Erro ao excluir etapa: ${deleteErr.message}`)
    }
  }

  // ─── Reordenar etapas (posições sequenciais 0..N-1) ───
  async function reordenarEtapas(etapaIds: number[]): Promise<void> {
    const empId = await getEmpresaId()

    // Atualizar posição de cada etapa na ordem recebida
    const updates = etapaIds.map((id, index) =>
      supabase
        .from('pipeline_etapas')
        .update({ posicao: index })
        .eq('id', id)
        .eq('empresa_id', empId)
    )

    const results = await Promise.all(updates)

    const firstError = results.find((r) => r.error)
    if (firstError?.error) {
      throw new Error(`Erro ao reordenar etapas: ${firstError.error.message}`)
    }
  }

  // ─── Verificar se etapa tem itens associados ──────────
  async function etapaTemItens(etapaId: number, pipelineTipo: PipelineTipo): Promise<boolean> {
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

    const { count, error } = await supabase
      .from(tabela)
      .select('id', { count: 'exact', head: true })
      .eq('etapa_id', etapaId)

    if (error) {
      throw new Error(`Erro ao verificar itens da etapa: ${error.message}`)
    }

    return (count ?? 0) > 0
  }

  return {
    gerarEtapasPadrao,
    validarEtapa,
    carregarEtapas,
    criarEtapa,
    atualizarEtapa,
    excluirEtapa,
    reordenarEtapas,
    etapaTemItens,
  }
}
