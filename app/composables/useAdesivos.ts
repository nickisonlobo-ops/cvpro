/**
 * Composable de lógica de domínio pura para o módulo de Adesivos.
 * Todas as funções são puras (sem side effects, sem Supabase).
 */
export function useAdesivos() {
  // ─────────────────────────────────────────────
  // Cálculos numéricos
  // ─────────────────────────────────────────────

  /** Calcula área em m² a partir de largura (cm), altura (cm) e quantidade */
  function calcularArea(larguraCm: number, alturaCm: number, quantidade: number): number {
    return (larguraCm * alturaCm * quantidade) / 10000
  }

  /**
   * Calcula valor total do orçamento.
   * Fórmula: (area × precoM2 + maoObra) - desconto aplicado
   * O valor retornado é sempre > 0 (floor em 0.01 se necessário).
   */
  function calcularOrcamento(
    area: number,
    precoM2: number,
    maoObra: number,
    descontoPercentual: number,
    descontoValor: number,
  ): number {
    const subtotal = area * precoM2 + maoObra
    const descontoPerc = subtotal * (descontoPercentual / 100)
    const total = subtotal - descontoPerc - descontoValor
    return Math.max(total, 0.01)
  }

  /**
   * Calcula total do carrinho (venda de catálogo).
   * Soma de (preco × quantidade) para cada item.
   */
  function calcularTotalCarrinho(itens: { preco: number; quantidade: number }[]): number {
    return itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0)
  }

  // ─────────────────────────────────────────────
  // Status machine
  // ─────────────────────────────────────────────

  /** Labels de status para exibição */
  const statusLabels: Record<string, string> = {
    novo: 'Novo',
    orcamento_enviado: 'Orçamento Enviado',
    aprovado: 'Aprovado',
    em_producao: 'Em Produção',
    pronto: 'Pronto',
    entregue: 'Entregue',
    cancelado: 'Cancelado',
  }

  /** Cores de badge por status (classes Tailwind) */
  const statusColors: Record<string, string> = {
    novo: 'bg-blue-100 text-blue-700',
    orcamento_enviado: 'bg-yellow-100 text-yellow-700',
    aprovado: 'bg-green-100 text-green-700',
    em_producao: 'bg-purple-100 text-purple-700',
    pronto: 'bg-teal-100 text-teal-700',
    entregue: 'bg-gray-100 text-gray-700',
    cancelado: 'bg-red-100 text-red-700',
  }

  /** Transições de status válidas */
  const transicoesValidas: Record<string, string[]> = {
    novo: ['orcamento_enviado', 'cancelado'],
    orcamento_enviado: ['aprovado', 'cancelado'],
    aprovado: ['em_producao', 'cancelado'],
    em_producao: ['pronto', 'cancelado'],
    pronto: ['entregue', 'cancelado'],
  }

  /** Verifica se uma transição de status é permitida */
  function podeTransitar(statusAtual: string, statusNovo: string): boolean {
    return transicoesValidas[statusAtual]?.includes(statusNovo) ?? false
  }

  // ─────────────────────────────────────────────
  // Classificação de urgência
  // ─────────────────────────────────────────────

  /**
   * Classifica a urgência de um pedido com base no prazo estimado.
   * - "overdue": now > prazo
   * - "urgent": prazo - now < 24h
   * - "normal": prazo >= now + 24h
   * - null: sem prazo definido
   */
  function classificarUrgencia(
    prazoEstimado: Date | string | null,
    now?: Date,
  ): 'overdue' | 'urgent' | 'normal' | null {
    if (prazoEstimado === null || prazoEstimado === undefined) return null

    const prazo = prazoEstimado instanceof Date ? prazoEstimado : new Date(prazoEstimado)
    if (isNaN(prazo.getTime())) return null

    const agora = now ?? new Date()
    const diffMs = prazo.getTime() - agora.getTime()

    if (diffMs < 0) return 'overdue'
    if (diffMs < 24 * 60 * 60 * 1000) return 'urgent'
    return 'normal'
  }

  // ─────────────────────────────────────────────
  // Validação de formulários
  // ─────────────────────────────────────────────

  interface ValidationResult {
    valid: boolean
    errors: Record<string, string>
  }

  /** Valida dados de cadastro de material */
  function validarMaterial(data: {
    nome?: string | null
    preco_m2?: number | null
  }): ValidationResult {
    const errors: Record<string, string> = {}

    // nome: obrigatório, max 100
    if (!data.nome || data.nome.trim().length === 0) {
      errors.nome = 'Nome é obrigatório'
    } else if (data.nome.trim().length > 100) {
      errors.nome = 'Nome deve ter no máximo 100 caracteres'
    }

    // preco_m2: obrigatório, entre 0.01 e 99999.99
    if (data.preco_m2 === null || data.preco_m2 === undefined) {
      errors.preco_m2 = 'Preço por m² é obrigatório'
    } else if (data.preco_m2 < 0.01 || data.preco_m2 > 99999.99) {
      errors.preco_m2 = 'Preço por m² deve estar entre 0.01 e 99999.99'
    }

    return { valid: Object.keys(errors).length === 0, errors }
  }

  /** Valida dados de cadastro de produto do catálogo (Requirement 1.1) */
  function validarProdutoCatalogo(data: {
    nome?: string | null
    categoria?: string | null
    material_id?: number | null
    largura_cm?: number | null
    altura_cm?: number | null
    preco_venda?: number | null
    descricao?: string | null
    imagem_url?: string | null
  }): ValidationResult {
    const errors: Record<string, string> = {}

    // nome: obrigatório, max 100
    if (!data.nome || data.nome.trim().length === 0) {
      errors.nome = 'Nome é obrigatório'
    } else if (data.nome.trim().length > 100) {
      errors.nome = 'Nome deve ter no máximo 100 caracteres'
    }

    // categoria: obrigatória
    if (!data.categoria || data.categoria.trim().length === 0) {
      errors.categoria = 'Categoria é obrigatória'
    }

    // material_id: obrigatório
    if (!data.material_id) {
      errors.material_id = 'Material é obrigatório'
    }

    // largura_cm: opcional, se informada entre 0.1 e 9999
    if (data.largura_cm != null && (data.largura_cm < 0.1 || data.largura_cm > 9999)) {
      errors.largura_cm = 'Largura deve estar entre 0.1 e 9999 cm'
    }

    // altura_cm: opcional, se informada entre 0.1 e 9999
    if (data.altura_cm != null && (data.altura_cm < 0.1 || data.altura_cm > 9999)) {
      errors.altura_cm = 'Altura deve estar entre 0.1 e 9999 cm'
    }

    // preco_venda: obrigatório, entre 0.01 e 999999.99
    if (data.preco_venda === null || data.preco_venda === undefined) {
      errors.preco_venda = 'Preço de venda é obrigatório'
    } else if (data.preco_venda < 0.01 || data.preco_venda > 999999.99) {
      errors.preco_venda = 'Preço de venda deve estar entre 0.01 e 999999.99'
    }

    // descricao: opcional, max 500
    if (data.descricao && data.descricao.length > 500) {
      errors.descricao = 'Descrição deve ter no máximo 500 caracteres'
    }

    return { valid: Object.keys(errors).length === 0, errors }
  }

  /** Valida dados de criação de pedido sob encomenda (Requirement 3.1) */
  function validarPedidoEncomenda(data: {
    cliente_id?: number | null
    descricao?: string | null
    largura_cm?: number | null
    altura_cm?: number | null
    material_id?: number | null
    quantidade?: number | null
    observacoes?: string | null
  }): ValidationResult {
    const errors: Record<string, string> = {}

    // cliente_id: obrigatório
    if (!data.cliente_id) {
      errors.cliente_id = 'Cliente é obrigatório'
    }

    // descricao: obrigatória, max 500
    if (!data.descricao || data.descricao.trim().length === 0) {
      errors.descricao = 'Descrição é obrigatória'
    } else if (data.descricao.trim().length > 500) {
      errors.descricao = 'Descrição deve ter no máximo 500 caracteres'
    }

    // largura_cm: obrigatória, entre 0.1 e 9999.9
    if (data.largura_cm === null || data.largura_cm === undefined) {
      errors.largura_cm = 'Largura é obrigatória'
    } else if (data.largura_cm < 0.1 || data.largura_cm > 9999.9) {
      errors.largura_cm = 'Largura deve estar entre 0.1 e 9999.9 cm'
    }

    // altura_cm: obrigatória, entre 0.1 e 9999.9
    if (data.altura_cm === null || data.altura_cm === undefined) {
      errors.altura_cm = 'Altura é obrigatória'
    } else if (data.altura_cm < 0.1 || data.altura_cm > 9999.9) {
      errors.altura_cm = 'Altura deve estar entre 0.1 e 9999.9 cm'
    }

    // material_id: obrigatório
    if (!data.material_id) {
      errors.material_id = 'Material é obrigatório'
    }

    // quantidade: obrigatória, inteiro entre 1 e 99999
    if (data.quantidade === null || data.quantidade === undefined) {
      errors.quantidade = 'Quantidade é obrigatória'
    } else if (!Number.isInteger(data.quantidade) || data.quantidade < 1 || data.quantidade > 99999) {
      errors.quantidade = 'Quantidade deve ser um inteiro entre 1 e 99999'
    }

    // observacoes: opcional, max 1000
    if (data.observacoes && data.observacoes.length > 1000) {
      errors.observacoes = 'Observações devem ter no máximo 1000 caracteres'
    }

    return { valid: Object.keys(errors).length === 0, errors }
  }

  /**
   * Valida arquivo de arte do cliente (Requirement 3.3).
   * Formatos aceitos: PNG, JPG, PDF, SVG, AI
   * Tamanho máximo: 20MB
   */
  function validarArquivoArte(file: { name?: string; size?: number; type?: string }): ValidationResult {
    const errors: Record<string, string> = {}

    const formatosValidos = [
      'image/png',
      'image/jpeg',
      'application/pdf',
      'image/svg+xml',
      'application/postscript', // AI files
    ]

    const extensoesValidas = ['.png', '.jpg', '.jpeg', '.pdf', '.svg', '.ai']
    const maxSize = 20 * 1024 * 1024 // 20MB

    // Validar formato (por MIME type ou extensão)
    const tipo = file.type?.toLowerCase() ?? ''
    const nome = file.name?.toLowerCase() ?? ''
    const extensao = nome.includes('.') ? '.' + nome.split('.').pop() : ''

    const formatoValido = formatosValidos.includes(tipo) || extensoesValidas.includes(extensao)
    if (!formatoValido) {
      errors.formato = 'Formato inválido. Aceitos: PNG, JPG, PDF, SVG, AI'
    }

    // Validar tamanho
    if (file.size !== undefined && file.size > maxSize) {
      errors.tamanho = 'Arquivo excede o tamanho máximo de 20 MB'
    }

    return { valid: Object.keys(errors).length === 0, errors }
  }

  /**
   * Valida imagem de produto do catálogo (Requirement 1.6).
   * Formatos aceitos: PNG, JPG, WEBP
   * Tamanho máximo: 5MB
   */
  function validarImagemProduto(file: { name?: string; size?: number; type?: string }): ValidationResult {
    const errors: Record<string, string> = {}

    const formatosValidos = ['image/png', 'image/jpeg', 'image/webp']
    const extensoesValidas = ['.png', '.jpg', '.jpeg', '.webp']
    const maxSize = 5 * 1024 * 1024 // 5MB

    // Validar formato
    const tipo = file.type?.toLowerCase() ?? ''
    const nome = file.name?.toLowerCase() ?? ''
    const extensao = nome.includes('.') ? '.' + nome.split('.').pop() : ''

    const formatoValido = formatosValidos.includes(tipo) || extensoesValidas.includes(extensao)
    if (!formatoValido) {
      errors.formato = 'Formato inválido. Aceitos: PNG, JPG, WEBP'
    }

    // Validar tamanho
    if (file.size !== undefined && file.size > maxSize) {
      errors.tamanho = 'Imagem excede o tamanho máximo de 5 MB'
    }

    return { valid: Object.keys(errors).length === 0, errors }
  }

  // ─────────────────────────────────────────────
  // Retorno público
  // ─────────────────────────────────────────────

  return {
    // Cálculos
    calcularArea,
    calcularOrcamento,
    calcularTotalCarrinho,

    // Status machine
    statusLabels,
    statusColors,
    transicoesValidas,
    podeTransitar,

    // Urgência
    classificarUrgencia,

    // Validações
    validarMaterial,
    validarProdutoCatalogo,
    validarPedidoEncomenda,
    validarArquivoArte,
    validarImagemProduto,
  }
}
