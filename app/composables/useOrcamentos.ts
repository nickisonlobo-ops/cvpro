// app/composables/useOrcamentos.ts

import { createSupabaseClient } from '~/lib/supabase'

export interface ItemOrcamento {
  id?: number
  descricao: string
  material_id: number
  material_nome?: string
  largura_cm: number
  altura_cm: number
  quantidade: number
  modalidade_preco: 'm2' | 'unidade'
  preco_unitario?: number
  preco_m2?: number
  area_m2?: number
  valor_item: number
  foto_arte_url?: string | null
  foto_arte_file?: File | null
  foto_local_url?: string | null
  foto_local_file?: File | null
  arquivo_url?: string | null
  arquivo_file?: File | null
}

export interface ItemOrcamentoCompleto extends ItemOrcamento {
  id: number
  foto_arte_url: string | null
  foto_local_url: string | null
  arquivo_url: string | null
}

export interface OrcamentoCompleto {
  id: number
  numero_orcamento: string
  status: 'rascunho' | 'enviado' | 'aprovado' | 'rejeitado' | 'vencido'
  cliente_id: number
  validade_dias: number
  prazo_estimado_dias: number | null
  valor_mao_obra_global: number
  desconto_percentual: number
  desconto_valor: number
  valor_total: number
  token_aprovacao: string | null
  endereco_instalacao: string | null
  nome_trabalho: string | null
  itens: ItemOrcamentoCompleto[]
}

export interface DiffItens {
  inserir: ItemOrcamento[]
  atualizar: ItemOrcamentoCompleto[]
  deletar: number[]
}

export function useOrcamentos() {

  // ─── Cálculo de valor do material ───────────────────────
  function calcularValorMaterial(
    modalidade: 'm2' | 'unidade',
    opts: { area_m2?: number; preco_m2?: number; preco_unitario?: number; quantidade?: number }
  ): number {
    if (modalidade === 'm2') {
      return (opts.area_m2 ?? 0) * (opts.preco_m2 ?? 0)
    }
    return (opts.preco_unitario ?? 0) * (opts.quantidade ?? 0)
  }

  // ─── Seleção de regra de desconto por volume ────────────
  interface RegraDesconto {
    quantidade_minima: number
    desconto_percentual: number
  }

  function selecionarDescontoVolume(
    regras: RegraDesconto[],
    quantidade: number
  ): RegraDesconto | null {
    const aplicaveis = regras
      .filter(r => quantidade >= r.quantidade_minima)
      .sort((a, b) => b.quantidade_minima - a.quantidade_minima)
    return aplicaveis[0] ?? null
  }

  // ─── Cálculo do valor final do orçamento ────────────────
  function calcularValorFinal(
    valorMaterial: number,
    maoObra: number,
    descontoVolumePercentual: number,
    descontoManualPercentual: number,
    descontoManualValor: number
  ): number {
    const subtotal = valorMaterial + maoObra
    const descVolume = subtotal * (descontoVolumePercentual / 100)
    const aposVolume = subtotal - descVolume
    const descManualPerc = aposVolume * (descontoManualPercentual / 100)
    const total = aposVolume - descManualPerc - descontoManualValor
    return Math.max(total, 0.01)
  }

  // ─── Classificação de status do orçamento ───────────────
  type StatusOrcamento = 'pendente' | 'aprovado' | 'vencido' | 'rejeitado'

  function classificarStatusOrcamento(
    statusPedido: string,
    dataValidade: Date | string,
    now?: Date
  ): StatusOrcamento {
    const agora = now ?? new Date()
    const validade = dataValidade instanceof Date ? dataValidade : new Date(dataValidade)

    if (statusPedido === 'aprovado' || statusPedido === 'em_producao'
      || statusPedido === 'pronto' || statusPedido === 'entregue') return 'aprovado'
    if (statusPedido === 'cancelado') return 'rejeitado'
    if (statusPedido === 'orcamento_enviado' && agora > validade) return 'vencido'
    return 'pendente'
  }

  // ─── Composição de mensagem WhatsApp ────────────────────
  function comporMensagemWhatsApp(dados: {
    nomeCliente: string
    descricao: string
    dimensoes: string
    quantidade: number
    valorTotal: number
    validade: string
    linkAprovacao: string
  }): string {
    const msg = [
      `Olá ${dados.nomeCliente}! 👋`,
      ``,
      `Segue seu orçamento:`,
      `📋 ${dados.descricao}`,
      `📐 ${dados.dimensoes}`,
      `🔢 Qtd: ${dados.quantidade}`,
      `💰 Total: R$ ${dados.valorTotal.toFixed(2)}`,
      `📅 Válido até: ${dados.validade}`,
      ``,
      `Aprove ou rejeite pelo link:`,
      `👉 ${dados.linkAprovacao}`,
    ].join('\n')
    return msg.slice(0, 1000)
  }

  // ─── Composição do link WhatsApp ────────────────────────
  function comporLinkWhatsApp(telefone: string, mensagem: string): string {
    const tel = telefone.replace(/\D/g, '')
    const prefixo = tel.startsWith('55') ? tel : `55${tel}`
    return `https://wa.me/${prefixo}?text=${encodeURIComponent(mensagem)}`
  }

  // ─── Composição do link de aprovação ────────────────────
  function comporLinkAprovacao(baseUrl: string, token: string): string {
    return `${baseUrl}/orcamento-aprovacao/${token}`
  }

  // ─── Truncar descrição para listagem ────────────────────
  function truncarDescricao(texto: string, max: number = 60): string {
    if (texto.length <= max) return texto
    return texto.slice(0, max - 3) + '...'
  }

  // ─── Validação de telefone brasileiro ───────────────────
  function validarTelefone(telefone: string): boolean {
    const digits = telefone.replace(/\D/g, '')
    return digits.length === 10 || digits.length === 11
  }

  // ─── Validação de regra de desconto ─────────────────────
  interface ValidacaoResult { valid: boolean; errors: Record<string, string> }

  function validarRegraDesconto(data: {
    quantidade_minima?: number | null
    desconto_percentual?: number | null
  }): ValidacaoResult {
    const errors: Record<string, string> = {}
    if (data.quantidade_minima == null || data.quantidade_minima < 2 || data.quantidade_minima > 99999
        || !Number.isInteger(data.quantidade_minima)) {
      errors.quantidade_minima = 'Quantidade mínima deve ser inteiro entre 2 e 99999'
    }
    if (data.desconto_percentual == null || data.desconto_percentual < 0.01
        || data.desconto_percentual > 99.99) {
      errors.desconto_percentual = 'Percentual deve estar entre 0.01 e 99.99'
    }
    return { valid: Object.keys(errors).length === 0, errors }
  }

  // ─── Detecção de sobreposição de faixas ─────────────────
  function detectarSobreposicao(
    regrasExistentes: { quantidade_minima: number }[],
    novaQuantidade: number
  ): boolean {
    return regrasExistentes.some(r => r.quantidade_minima === novaQuantidade)
  }

  // ─── KPIs da listagem ───────────────────────────────────
  interface OrcamentoResumo {
    status_pedido: string
    data_validade: string | Date
    valor_total: number
    data_criacao: string | Date
  }

  function calcularKPIs(
    orcamentos: OrcamentoResumo[],
    now?: Date
  ): { pendentes: number; vencidos: number; valorAprovadosMes: number; taxaConversao: number } {
    const agora = now ?? new Date()
    const mesAtual = agora.getMonth()
    const anoAtual = agora.getFullYear()

    let pendentes = 0
    let vencidos = 0
    let valorAprovadosMes = 0
    let totalMes = 0
    let aprovadosMes = 0

    for (const o of orcamentos) {
      const validade = new Date(o.data_validade)
      const criacao = new Date(o.data_criacao)
      const noMes = criacao.getMonth() === mesAtual && criacao.getFullYear() === anoAtual

      if (o.status_pedido === 'orcamento_enviado' && agora <= validade) pendentes++
      if (o.status_pedido === 'orcamento_enviado' && agora > validade) vencidos++
      if (noMes) {
        totalMes++
        if (o.status_pedido === 'aprovado' || o.status_pedido === 'em_producao'
          || o.status_pedido === 'pronto' || o.status_pedido === 'entregue') {
          aprovadosMes++
          valorAprovadosMes += o.valor_total
        }
      }
    }

    const taxaConversao = totalMes > 0 ? (aprovadosMes / totalMes) * 100 : 0
    return { pendentes, vencidos, valorAprovadosMes, taxaConversao }
  }

  // ─── Tipos para status V2 (novo fluxo) ───────────────────
  type StatusOrcamentoV2 = 'rascunho' | 'enviado' | 'aprovado' | 'rejeitado' | 'vencido'

  interface StatusOrcamentoDisplay {
    status: StatusOrcamentoV2
    label: string
    cor: string
  }

  // ─── Classificação de status V2 (novo fluxo direto) ─────
  function classificarStatusOrcamentoV2(
    status: StatusOrcamentoV2,
    dataValidade: Date | string,
    now?: Date
  ): StatusOrcamentoDisplay {
    const agora = now ?? new Date()
    const validade = dataValidade instanceof Date ? dataValidade : new Date(dataValidade)

    if (status === 'enviado' && agora > validade) {
      return { status: 'vencido', label: 'Vencido', cor: 'red' }
    }
    if (status === 'rascunho') return { status: 'rascunho', label: 'Rascunho', cor: 'gray' }
    if (status === 'enviado') return { status: 'enviado', label: 'Enviado', cor: 'blue' }
    if (status === 'aprovado') return { status: 'aprovado', label: 'Aprovado', cor: 'green' }
    if (status === 'rejeitado') return { status: 'rejeitado', label: 'Rejeitado', cor: 'red' }
    // status === 'vencido' (already marked as vencido in DB)
    return { status: 'vencido', label: 'Vencido', cor: 'orange' }
  }

  // ─── Geração de número de orçamento ─────────────────────
  function gerarNumeroOrcamento(ultimoNumero: number): string {
    return `ORC-${ultimoNumero + 1}`
  }

  // ─── Validação completa do orçamento ────────────────────
  interface OrcamentoFormData {
    cliente_id?: number | null
    validade_dias?: number | null
    valor_mao_obra?: number
    desconto_percentual?: number
    desconto_valor?: number
    itens: ItemOrcamento[]
  }

  function validarOrcamento(dados: OrcamentoFormData): ValidacaoResult {
    const errors: Record<string, string> = {}

    // Validar cliente
    if (!dados.cliente_id || dados.cliente_id <= 0) {
      errors.cliente_id = 'Cliente é obrigatório'
    }

    // Validar validade
    if (!dados.validade_dias || Number(dados.validade_dias) <= 0) {
      errors.validade_dias = 'Validade deve ser maior que zero'
    }

    // Validar itens - mínimo 1
    if (!dados.itens || dados.itens.length === 0) {
      errors.itens = 'Orçamento deve ter pelo menos 1 item'
    } else {
      // Validar cada item
      for (let i = 0; i < dados.itens.length; i++) {
        const item = dados.itens[i]
        if (!item.descricao || item.descricao.trim() === '') {
          errors[`itens[${i}].descricao`] = `Item ${i + 1}: descrição é obrigatória`
        }
        if (!item.material_id || item.material_id <= 0) {
          errors[`itens[${i}].material_id`] = `Item ${i + 1}: material é obrigatório`
        }
        const largura = Number(item.largura_cm) || 0
        if (largura < 0.1 || largura > 9999.9) {
          errors[`itens[${i}].largura_cm`] = `Item ${i + 1}: largura deve estar entre 0.1 e 9999.9 cm`
        }
        const altura = Number(item.altura_cm) || 0
        if (altura < 0.1 || altura > 9999.9) {
          errors[`itens[${i}].altura_cm`] = `Item ${i + 1}: altura deve estar entre 0.1 e 9999.9 cm`
        }
        const qtd = Number(item.quantidade) || 0
        if (qtd < 1 || qtd > 99999) {
          errors[`itens[${i}].quantidade`] = `Item ${i + 1}: quantidade deve estar entre 1 e 99999`
        }
        const valor = Number(item.valor_item) || 0
        if (valor <= 0) {
          errors[`itens[${i}].valor_item`] = `Item ${i + 1}: valor deve ser maior que zero`
        }
      }
    }

    // Validar valor total > 0
    if (dados.itens && dados.itens.length > 0 && Object.keys(errors).length === 0) {
      const somaItens = dados.itens.reduce((sum, item) => sum + (Number(item.valor_item) || 0), 0)
      const maoObra = Number(dados.valor_mao_obra) || 0
      const descontoPerc = Number(dados.desconto_percentual) || 0
      const descontoVal = Number(dados.desconto_valor) || 0
      const subtotal = somaItens + maoObra
      const totalAposDescontos = subtotal - (subtotal * descontoPerc / 100) - descontoVal

      if (totalAposDescontos <= 0) {
        errors.valor_total = 'Valor total do orçamento deve ser maior que zero'
      }
    }

    return { valid: Object.keys(errors).length === 0, errors }
  }

  // ─── Interface e cálculos multi-item ─────────────────────

  function calcularAreaItem(largura_cm: number, altura_cm: number, quantidade: number): number {
    return (largura_cm * altura_cm * quantidade) / 10000
  }

  function calcularValorItem(item: ItemOrcamento): number {
    if (item.modalidade_preco === 'm2') {
      const area = (item.largura_cm * item.altura_cm * item.quantidade) / 10000
      return area * (item.preco_m2 ?? 0)
    }
    return (item.preco_unitario ?? 0) * item.quantidade
  }

  function calcularTotalItens(itens: ItemOrcamento[]): number {
    return itens.reduce((total, item) => total + item.valor_item, 0)
  }

  function calcularQuantidadeTotal(itens: ItemOrcamento[]): number {
    return itens.reduce((total, item) => total + item.quantidade, 0)
  }

  // ─── Composição de mensagem WhatsApp multi-itens ─────────
  function comporMensagemWhatsAppMultiItens(dados: {
    nomeCliente: string
    quantidadeItens: number
    descricaoResumida: string
    valorTotal: number
    validade: string
    linkAprovacao: string
  }): string {
    const valorFormatado = dados.valorTotal
      .toFixed(2)
      .replace('.', ',')
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.')

    const buildMessage = (descricao: string): string => {
      return [
        `Olá ${dados.nomeCliente}! 👋`,
        ``,
        `Segue seu orçamento:`,
        `📦 ${dados.quantidadeItens} itens - ${descricao}`,
        `💰 Total: R$ ${valorFormatado}`,
        `📅 Válido até: ${dados.validade}`,
        ``,
        `Visualize os detalhes e aprove pelo link:`,
        `👉 ${dados.linkAprovacao}`,
      ].join('\n')
    }

    const LIMIT = 1000
    const fullMessage = buildMessage(dados.descricaoResumida)

    if (fullMessage.length <= LIMIT) {
      return fullMessage
    }

    // Truncate descricaoResumida to fit within limit
    // Calculate space available for descricaoResumida
    const messageWithoutDesc = buildMessage('')
    const availableChars = LIMIT - messageWithoutDesc.length
    if (availableChars <= 3) {
      // Edge case: even empty description doesn't fit, return truncated without description
      return buildMessage('').slice(0, LIMIT)
    }
    const truncatedDesc = dados.descricaoResumida.slice(0, availableChars - 3) + '...'
    return buildMessage(truncatedDesc)
  }

  // ─── Status editável (edição de orçamento) ───────────────
  function isStatusEditavel(status: string): boolean {
    return status === 'rascunho' || status === 'enviado' || status === 'aprovado'
  }

  // ─── Diff de itens para sincronização ───────────────────
  function calcularDiffItens(
    originais: ItemOrcamentoCompleto[],
    atuais: ItemOrcamento[]
  ): DiffItens {
    const idsOriginais = new Set(originais.map(item => item.id))

    const inserir: ItemOrcamento[] = []
    const atualizar: ItemOrcamentoCompleto[] = []
    const idsPresentes = new Set<number>()

    for (const item of atuais) {
      if (item.id != null && idsOriginais.has(item.id)) {
        // Item existente sendo atualizado
        atualizar.push(item as ItemOrcamentoCompleto)
        idsPresentes.add(item.id)
      } else {
        // Item novo (sem ID ou ID não encontrado nos originais)
        inserir.push(item)
      }
    }

    // IDs que estavam nos originais mas não estão nos atuais = deletar
    const deletar: number[] = []
    for (const id of idsOriginais) {
      if (!idsPresentes.has(id)) {
        deletar.push(id)
      }
    }

    return { inserir, atualizar, deletar }
  }

  // ─── Atualizar orçamento existente ──────────────────────
  async function atualizarOrcamento(
    id: number,
    dados: {
      cliente_id: number
      validade_dias: number
      prazo_estimado_dias?: number | null
      valor_mao_obra_global?: number
      desconto_percentual?: number
      desconto_valor?: number
      valor_total: number
      valor_material: number
      quantidade_total_itens: number
      data_validade: string
      endereco_instalacao?: string | null
      nome_trabalho?: string | null
    },
    diffItens: DiffItens
  ): Promise<{ success: boolean; error?: string }> {
    const supabase = createSupabaseClient()

    // 1. Update orcamento record (preserva status e token_aprovacao)
    const { error: updateError } = await supabase
      .from('orcamentos_adesivo')
      .update({
        cliente_id: dados.cliente_id,
        validade_dias: dados.validade_dias || 30,
        prazo_estimado_dias: dados.prazo_estimado_dias || null,
        valor_mao_obra_global: Number(dados.valor_mao_obra_global) || 0,
        desconto_percentual: Number(dados.desconto_percentual) || 0,
        desconto_valor: Number(dados.desconto_valor) || 0,
        valor_total: Number(dados.valor_total) || 0,
        valor_material: Number(dados.valor_material) || 0,
        quantidade_total_itens: dados.quantidade_total_itens,
        data_validade: dados.data_validade,
        endereco_instalacao: dados.endereco_instalacao || null,
        nome_trabalho: dados.nome_trabalho || null,
      })
      .eq('id', id)

    if (updateError) {
      return { success: false, error: `Erro ao atualizar orçamento: ${updateError.message}` }
    }

    // 2. Delete removed items
    if (diffItens.deletar.length > 0) {
      const { error: deleteError } = await supabase
        .from('itens_orcamento')
        .delete()
        .in('id', diffItens.deletar)

      if (deleteError) {
        return { success: false, error: `Erro ao remover itens: ${deleteError.message}` }
      }
    }

    // 3. Update existing items
    for (const item of diffItens.atualizar) {
      const { error: itemUpdateError } = await supabase
        .from('itens_orcamento')
        .update({
          material_id: item.material_id,
          descricao: item.descricao || item.material_nome || '',
          largura_cm: Number(item.largura_cm) || 0,
          altura_cm: Number(item.altura_cm) || 0,
          quantidade: Number(item.quantidade) || 1,
          modalidade_preco: item.modalidade_preco,
          preco_unitario: item.modalidade_preco === 'unidade' ? (Number(item.preco_unitario) || null) : null,
          preco_m2: item.modalidade_preco === 'm2' ? (Number(item.preco_m2) || null) : null,
          area_m2: Number(item.area_m2) || 0,
          valor_item: Number(item.valor_item) || 0,
          foto_arte_url: item.foto_arte_url || null,
          foto_local_url: item.foto_local_url || null,
          arquivo_url: item.arquivo_url || null,
        })
        .eq('id', item.id)

      if (itemUpdateError) {
        return { success: false, error: `Erro ao atualizar item ${item.id}: ${itemUpdateError.message}` }
      }
    }

    // 4. Insert new items
    if (diffItens.inserir.length > 0) {
      const itensParaInserir = diffItens.inserir.map(item => ({
        orcamento_id: id,
        material_id: item.material_id,
        descricao: item.descricao || item.material_nome || '',
        largura_cm: Number(item.largura_cm) || 0,
        altura_cm: Number(item.altura_cm) || 0,
        quantidade: Number(item.quantidade) || 1,
        modalidade_preco: item.modalidade_preco,
        preco_unitario: item.modalidade_preco === 'unidade' ? (Number(item.preco_unitario) || null) : null,
        preco_m2: item.modalidade_preco === 'm2' ? (Number(item.preco_m2) || null) : null,
        area_m2: Number(item.area_m2) || 0,
        valor_item: Number(item.valor_item) || 0,
        foto_arte_url: item.foto_arte_url || null,
        foto_local_url: item.foto_local_url || null,
        arquivo_url: item.arquivo_url || null,
      }))

      const { error: insertError } = await supabase
        .from('itens_orcamento')
        .insert(itensParaInserir)

      if (insertError) {
        return { success: false, error: `Erro ao inserir novos itens: ${insertError.message}` }
      }
    }

    return { success: true }
  }

  // ─── Validação de arquivo para upload ────────────────────
  function validarArquivoUpload(
    file: { type: string; size: number },
    tiposAceitos: string[],
    tamanhoMaxBytes: number
  ): ValidacaoArquivo {
    if (!tiposAceitos.includes(file.type)) {
      return { valido: false, erro: 'Formato de arquivo não suportado' }
    }
    if (file.size > tamanhoMaxBytes) {
      return { valido: false, erro: 'Arquivo excede o tamanho máximo permitido' }
    }
    return { valido: true }
  }

  // ─── Validação de preço por m² ──────────────────────────
  function validarPrecoM2(valor: number | null | undefined): ValidacaoResult {
    const errors: Record<string, string> = {}
    if (valor == null || valor < 0.01 || valor > 9999.99) {
      errors.preco_m2 = 'Preço deve estar entre R$ 0,01 e R$ 9.999,99'
    }
    return { valid: Object.keys(errors).length === 0, errors }
  }

  // ─── Indicador de override de preço ─────────────────────
  function isPrecoOverride(precoItem: number, precoMaterial: number): boolean {
    return precoItem !== precoMaterial
  }

  // ─── Geração de path para foto do local ─────────────────
  function gerarPathFotoLocal(empresaId: number, orcamentoId: number, itemId: string, extensao: string): string {
    return `${empresaId}/${orcamentoId}/itens/${itemId}/local-instalacao.${extensao}`
  }

  // ─── Geração de path para foto da arte ──────────────────
  function gerarPathFotoArte(empresaId: number, orcamentoId: number, itemId: string, extensao: string): string {
    return `${empresaId}/${orcamentoId}/itens/${itemId}/arte.${extensao}`
  }

  // ─── Mapeamento de itens do orçamento para OS ───────────
  function mapearItensParaOS(
    itensOrcamento: ItemOrcamentoCompleto[],
    ordemServicoId: number
  ): ItemOrdemServico[] {
    return itensOrcamento.map(item => ({
      ordem_servico_id: ordemServicoId,
      item_orcamento_id: item.id,
      descricao: item.descricao,
      material_id: item.material_id,
      largura_cm: item.largura_cm,
      altura_cm: item.altura_cm,
      quantidade: item.quantidade,
      valor_item: item.valor_item,
      foto_arte_url: item.foto_arte_url,
      foto_local_url: item.foto_local_url,
    }))
  }

  // ─── Filtragem de orçamentos ────────────────────────────
  interface FiltrosOrcamento {
    dataInicio?: string | null
    dataFim?: string | null
    status?: StatusOrcamento | '' | null
    nomeCliente?: string | null
  }

  function filtrarOrcamentos(
    orcamentos: Array<OrcamentoResumo & { nome_cliente: string }>,
    filtros: FiltrosOrcamento,
    now?: Date
  ): Array<OrcamentoResumo & { nome_cliente: string }> {
    return orcamentos.filter(o => {
      const criacao = new Date(o.data_criacao)
      if (filtros.dataInicio && criacao < new Date(filtros.dataInicio)) return false
      if (filtros.dataFim && criacao > new Date(filtros.dataFim + 'T23:59:59')) return false
      if (filtros.status) {
        const statusCalc = classificarStatusOrcamento(o.status_pedido, o.data_validade, now)
        if (statusCalc !== filtros.status) return false
      }
      if (filtros.nomeCliente && filtros.nomeCliente.trim().length >= 3) {
        if (!o.nome_cliente.toLowerCase().includes(filtros.nomeCliente.toLowerCase())) return false
      }
      return true
    })
  }

  return {
    calcularValorMaterial,
    selecionarDescontoVolume,
    calcularValorFinal,
    classificarStatusOrcamento,
    classificarStatusOrcamentoV2,
    comporMensagemWhatsApp,
    comporMensagemWhatsAppMultiItens,
    comporLinkWhatsApp,
    comporLinkAprovacao,
    truncarDescricao,
    validarTelefone,
    validarRegraDesconto,
    validarOrcamento,
    detectarSobreposicao,
    calcularKPIs,
    filtrarOrcamentos,
    calcularAreaItem,
    calcularValorItem,
    calcularTotalItens,
    calcularQuantidadeTotal,
    gerarNumeroOrcamento,
    isStatusEditavel,
    calcularDiffItens,
    atualizarOrcamento,
    validarArquivoUpload,
    validarPrecoM2,
    isPrecoOverride,
    gerarPathFotoLocal,
    gerarPathFotoArte,
    mapearItensParaOS,
  }
}
