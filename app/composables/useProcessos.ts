import { createSupabaseClient } from '~/lib/supabase'
import { useEmpresa } from './useEmpresa'

export interface ProcessoTemplate {
  id: number
  nome: string
  descricao: string | null
  cor: string
  ativo: boolean
  etapas?: EtapaTemplate[]
}

export interface EtapaTemplate {
  id?: number
  processo_template_id?: number
  titulo: string
  descricao: string | null
  ordem: number
  obrigatoria: boolean
  tempo_estimado_min: number | null
}

export interface ProcessoInstancia {
  id: number
  processo_template_id: number
  os_id: number | null
  os_numero: string | null
  titulo: string
  produto_nome: string | null
  status: 'pendente' | 'em_andamento' | 'concluido' | 'cancelado'
  responsavel_nome: string | null
  prioridade: 'baixa' | 'normal' | 'alta' | 'urgente'
  data_inicio: string | null
  data_prazo: string | null
  data_conclusao: string | null
  progresso: number
  ordem: number
  sequencial: boolean
  observacoes: string | null
  checklist?: ChecklistItem[]
  template_nome?: string
  template_cor?: string
}

export interface ChecklistItem {
  id: number
  instancia_id: number
  titulo: string
  descricao: string | null
  ordem: number
  concluida: boolean
  concluida_em: string | null
  concluida_por: string | null
  obrigatoria: boolean
  observacao: string | null
}

export function useProcessos() {
  const supabase = createSupabaseClient()
  const { empresaId, loadEmpresa } = useEmpresa()

  // ─── Templates ──────────────────────────────────────────────────────────────
  async function carregarTemplates(): Promise<ProcessoTemplate[]> {
    await loadEmpresa()
    if (!empresaId.value) return []
    const { data, error } = await supabase
      .from('processos_template')
      .select('*, processos_etapas_template(id, titulo, descricao, ordem, obrigatoria, tempo_estimado_min)')
      .eq('empresa_id', empresaId.value)
      .order('nome', { ascending: true })
    if (error) { console.error('Erro templates:', error.message); return [] }
    return (data ?? []).map((t: any) => ({
      ...t,
      etapas: (t.processos_etapas_template ?? []).sort((a: any, b: any) => a.ordem - b.ordem),
    }))
  }

  async function salvarTemplate(template: Partial<ProcessoTemplate> & { etapas?: EtapaTemplate[] }): Promise<{ success: boolean; id?: number; error?: string }> {
    await loadEmpresa()
    if (!empresaId.value) return { success: false, error: 'Empresa não identificada' }

    const isEdit = !!template.id
    let templateId = template.id

    if (isEdit) {
      const { error } = await supabase.from('processos_template').update({
        nome: template.nome!, descricao: template.descricao ?? null, cor: template.cor ?? '#3b82f6', ativo: template.ativo ?? true,
      }).eq('id', templateId!)
      if (error) return { success: false, error: error.message }
    } else {
      const { data, error } = await supabase.from('processos_template').insert({
        empresa_id: empresaId.value, nome: template.nome!, descricao: template.descricao ?? null, cor: template.cor ?? '#3b82f6', ativo: true,
      }).select('id').single()
      if (error || !data) return { success: false, error: error?.message ?? 'Erro' }
      templateId = data.id
    }

    // Salvar etapas: delete all + re-insert
    if (template.etapas && templateId) {
      await supabase.from('processos_etapas_template').delete().eq('processo_template_id', templateId)
      if (template.etapas.length > 0) {
        const rows = template.etapas.map((e, i) => ({
          processo_template_id: templateId!, titulo: e.titulo, descricao: e.descricao ?? null,
          ordem: i, obrigatoria: e.obrigatoria, tempo_estimado_min: e.tempo_estimado_min ?? null,
        }))
        const { error: etErr } = await supabase.from('processos_etapas_template').insert(rows)
        if (etErr) return { success: false, error: etErr.message }
      }
    }

    return { success: true, id: templateId }
  }

  async function excluirTemplate(id: number): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase.from('processos_template').delete().eq('id', id)
    if (error) return { success: false, error: error.message }
    return { success: true }
  }


  // ─── Vínculo Produto ↔ Processo (N:N) ────────────────────────────────────────
  async function vincularProdutoProcessos(produtoId: number, processoIds: number[], dependencias: boolean[] = []): Promise<{ success: boolean; error?: string }> {
    // Delete all existing and re-insert
    await supabase.from('produto_processo').delete().eq('produto_id', produtoId)
    if (processoIds.length === 0) return { success: true }
    const rows = processoIds.map((pid, i) => ({
      produto_id: produtoId,
      processo_template_id: pid,
      ordem: i,
      sequencial: dependencias[i] ?? (i > 0), // Por padrão, todos exceto o primeiro dependem do anterior
    }))
    const { error } = await supabase.from('produto_processo').insert(rows)
    if (error) return { success: false, error: error.message }
    return { success: true }
  }

  async function desvincularProduto(produtoId: number): Promise<{ success: boolean }> {
    await supabase.from('produto_processo').delete().eq('produto_id', produtoId)
    return { success: true }
  }

  async function carregarVinculos(): Promise<{ produto_id: number; processo_template_id: number; sequencial: boolean; ordem: number }[]> {
    await loadEmpresa()
    if (!empresaId.value) return []
    const { data } = await supabase
      .from('produto_processo')
      .select('produto_id, processo_template_id, sequencial, ordem')
      .order('ordem', { ascending: true })
    return data ?? []
  }

  // ─── Instâncias (Kanban) ────────────────────────────────────────────────────
  async function carregarInstancias(filtroStatus?: string[]): Promise<ProcessoInstancia[]> {
    await loadEmpresa()
    if (!empresaId.value) return []
    let query = supabase
      .from('processos_instancia')
      .select('*, processos_template(nome, cor), ordens_servico_adesivo(numero_os)')
      .eq('empresa_id', empresaId.value)
      .order('data_prazo', { ascending: true, nullsFirst: false })
    if (filtroStatus?.length) query = query.in('status', filtroStatus)
    const { data, error } = await query
    if (error) { console.error('Erro instancias:', error); return [] }
    return (data ?? []).map((i: any) => ({
      ...i,
      template_nome: i.processos_template?.nome ?? '',
      template_cor: i.processos_template?.cor ?? '#3b82f6',
      os_numero: i.ordens_servico_adesivo?.numero_os ?? null,
    }))
  }

  async function carregarChecklist(instanciaId: number): Promise<ChecklistItem[]> {
    const { data, error } = await supabase
      .from('processos_checklist')
      .select('*')
      .eq('instancia_id', instanciaId)
      .order('ordem', { ascending: true })
    if (error) { console.error('Erro checklist:', error); return [] }
    return data ?? []
  }

  async function toggleChecklist(itemId: number, concluida: boolean, usuario?: string): Promise<{ success: boolean }> {
    const update: any = { concluida }
    if (concluida) { update.concluida_em = new Date().toISOString(); update.concluida_por = usuario ?? null }
    else { update.concluida_em = null; update.concluida_por = null }
    const { error } = await supabase.from('processos_checklist').update(update).eq('id', itemId)
    if (error) return { success: false }
    return { success: true }
  }

  async function atualizarProgresso(instanciaId: number): Promise<void> {
    const checklist = await carregarChecklist(instanciaId)
    if (checklist.length === 0) return
    const concluidas = checklist.filter(c => c.concluida).length
    const progresso = Math.round((concluidas / checklist.length) * 100)
    const status = progresso === 100 ? 'concluido' : progresso > 0 ? 'em_andamento' : 'pendente'
    const update: any = { progresso, status }
    if (status === 'concluido') update.data_conclusao = new Date().toISOString()
    if (status === 'em_andamento' && !checklist.some(c => c.concluida)) update.data_inicio = new Date().toISOString().split('T')[0]
    await supabase.from('processos_instancia').update(update).eq('id', instanciaId)
  }

  async function atualizarInstancia(id: number, dados: Partial<ProcessoInstancia>): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase.from('processos_instancia').update(dados).eq('id', id)
    if (error) return { success: false, error: error.message }
    return { success: true }
  }


  // ─── Gerar instâncias a partir da OS ────────────────────────────────────────
  async function gerarProcessosParaOS(osId: number, itens: { descricao: string; material_id: number }[]): Promise<{ success: boolean; criados: number }> {
    await loadEmpresa()
    if (!empresaId.value) return { success: false, criados: 0 }

    // Buscar todos os vínculos produto→processo da empresa
    const vinculos = await carregarVinculos()
    if (vinculos.length === 0) { console.log('[Processos] Nenhum vínculo produto→processo encontrado'); return { success: true, criados: 0 } }

    // Mapeamento: produto_id → lista de { processo_template_id, ordem, sequencial }
    const vinculoMap = new Map<number, { processo_template_id: number; ordem: number; sequencial: boolean }[]>()
    for (const v of vinculos) {
      const arr = vinculoMap.get(v.produto_id) ?? []
      arr.push({ processo_template_id: v.processo_template_id, ordem: arr.length, sequencial: (v as any).sequencial ?? true })
      vinculoMap.set(v.produto_id, arr)
    }

    // Buscar mapeamento material_id → produto_id via catalogo_produto_materiais
    const { data: matProd } = await supabase
      .from('catalogo_produto_materiais')
      .select('material_id, produto_id')

    const materialToProdutos = new Map<number, number[]>()
    for (const mp of matProd ?? []) {
      const arr = materialToProdutos.get(mp.material_id) ?? []
      arr.push(mp.produto_id)
      materialToProdutos.set(mp.material_id, arr)
    }

    let criados = 0

    for (const item of itens) {
      // Encontrar produto(s) vinculado(s) ao material deste item
      let produtoIds = materialToProdutos.get(item.material_id) ?? []

      // Fallback: se material_id é na verdade um produto_id (catalogo_adesivos.id)
      if (produtoIds.length === 0 && vinculoMap.has(item.material_id)) {
        produtoIds = [item.material_id]
      }

      // Para cada produto, buscar processos vinculados
      for (const produtoId of produtoIds) {
        const processos = vinculoMap.get(produtoId) ?? []

        for (const proc of processos) {
          const processoTemplateId = proc.processo_template_id
          // Buscar etapas do template
          const { data: etapas } = await supabase
            .from('processos_etapas_template')
            .select('titulo, descricao, ordem, obrigatoria')
            .eq('processo_template_id', processoTemplateId)
            .order('ordem')

          // Criar instância
          const { data: instancia, error: instErr } = await supabase
            .from('processos_instancia')
            .insert({
              empresa_id: empresaId.value!,
              processo_template_id: processoTemplateId,
              os_id: osId,
              titulo: item.descricao || 'Processo de produção',
              produto_nome: item.descricao,
              status: 'pendente',
              prioridade: 'normal',
              progresso: 0,
              ordem: proc.ordem,
              sequencial: proc.sequencial,
            })
            .select('id')
            .single()

          if (instErr || !instancia) { console.error('[Processos] Erro ao criar instância:', instErr?.message); continue }

          // Criar checklist a partir das etapas
          if (etapas && etapas.length > 0) {
            const checklistRows = etapas.map(e => ({
              instancia_id: instancia.id,
              titulo: e.titulo,
              descricao: e.descricao,
              ordem: e.ordem,
              obrigatoria: e.obrigatoria,
              concluida: false,
            }))
            await supabase.from('processos_checklist').insert(checklistRows)
          }

          criados++
        }
      }
    }

    console.log(`[Processos] ${criados} instância(s) criada(s) para OS ${osId}`)
    return { success: true, criados }
  }

  return {
    carregarTemplates, salvarTemplate, excluirTemplate,
    vincularProdutoProcessos, desvincularProduto, carregarVinculos,
    carregarInstancias, carregarChecklist, toggleChecklist, atualizarProgresso, atualizarInstancia,
    gerarProcessosParaOS,
  }
}
