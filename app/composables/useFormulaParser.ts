// app/composables/useFormulaParser.ts
// Parser seguro de fórmulas matemáticas (sem eval) para cálculo de consumo de materiais.
// Usa tokenização + recursive descent parser.

// ─── Types ────────────────────────────────────────────────

export interface FormulaEvalResult {
  success: boolean
  value?: number
  error?: string
}

export interface FormulaValidation {
  valid: boolean
  variables: string[]
  error?: string
  invalidVariable?: string
}

export interface CustoComposicaoDetalhado {
  material_nome: string
  formula_consumo: string
  resultado_formula: number | null
  preco_unitario: number
  unidade_medida: string
  custo_parcial: number | null
}

export interface CustoTotalProduto {
  composicoes: CustoComposicaoDetalhado[]
  custo_total: number | null
  erro?: string
}

// ─── Constants ────────────────────────────────────────────

export const VARIAVEIS_PERMITIDAS = ['largura', 'altura', 'comprimento', 'quantidade', 'espessura'] as const
export type VariavelMedida = typeof VARIAVEIS_PERMITIDAS[number]

// ─── Token Types ──────────────────────────────────────────

type TokenType = 'NUMBER' | 'VARIABLE' | 'OPERATOR' | 'LPAREN' | 'RPAREN'

interface Token {
  type: TokenType
  value: string
}

// ─── Tokenizer ────────────────────────────────────────────

function tokenize(formula: string): { tokens: Token[]; error?: string } {
  const tokens: Token[] = []
  let i = 0
  const src = formula.trim()

  while (i < src.length) {
    const ch = src[i]

    // Whitespace
    if (/\s/.test(ch)) {
      i++
      continue
    }

    // Number (integer or decimal)
    if (/[0-9]/.test(ch) || (ch === '.' && i + 1 < src.length && /[0-9]/.test(src[i + 1]))) {
      let num = ''
      while (i < src.length && /[0-9.]/.test(src[i])) {
        num += src[i]
        i++
      }
      if (num.split('.').length > 2) {
        return { tokens: [], error: `Número inválido: ${num}` }
      }
      tokens.push({ type: 'NUMBER', value: num })
      continue
    }

    // Variable (starts with letter)
    if (/[a-zA-Z_]/.test(ch)) {
      let name = ''
      while (i < src.length && /[a-zA-Z0-9_]/.test(src[i])) {
        name += src[i]
        i++
      }
      tokens.push({ type: 'VARIABLE', value: name.toLowerCase() })
      continue
    }

    // Operators
    if ('+-*/'.includes(ch)) {
      tokens.push({ type: 'OPERATOR', value: ch })
      i++
      continue
    }

    // Parentheses
    if (ch === '(') {
      tokens.push({ type: 'LPAREN', value: '(' })
      i++
      continue
    }
    if (ch === ')') {
      tokens.push({ type: 'RPAREN', value: ')' })
      i++
      continue
    }

    return { tokens: [], error: `Caractere inesperado: '${ch}'` }
  }

  return { tokens }
}

// ─── Recursive Descent Parser ─────────────────────────────

class Parser {
  private tokens: Token[]
  private pos: number
  private variables: Record<string, number>

  constructor(tokens: Token[], variables: Record<string, number>) {
    this.tokens = tokens
    this.pos = 0
    this.variables = variables
  }

  parse(): number {
    const result = this.expression()
    if (this.pos < this.tokens.length) {
      throw new Error(`Token inesperado: '${this.tokens[this.pos].value}'`)
    }
    return result
  }

  private expression(): number {
    let result = this.term()
    while (this.pos < this.tokens.length && this.tokens[this.pos].type === 'OPERATOR' && '+-'.includes(this.tokens[this.pos].value)) {
      const op = this.tokens[this.pos].value
      this.pos++
      const right = this.term()
      result = op === '+' ? result + right : result - right
    }
    return result
  }

  private term(): number {
    let result = this.factor()
    while (this.pos < this.tokens.length && this.tokens[this.pos].type === 'OPERATOR' && '*/'.includes(this.tokens[this.pos].value)) {
      const op = this.tokens[this.pos].value
      this.pos++
      const right = this.factor()
      if (op === '/') {
        if (right === 0) throw new Error('Divisão por zero')
        result = result / right
      } else {
        result = result * right
      }
    }
    return result
  }

  private factor(): number {
    const token = this.tokens[this.pos]

    if (!token) {
      throw new Error('Expressão incompleta')
    }

    // Unary minus
    if (token.type === 'OPERATOR' && token.value === '-') {
      this.pos++
      return -this.factor()
    }

    // Number
    if (token.type === 'NUMBER') {
      this.pos++
      return parseFloat(token.value)
    }

    // Variable
    if (token.type === 'VARIABLE') {
      this.pos++
      const val = this.variables[token.value]
      if (val === undefined) {
        throw new Error(`Variável não definida: '${token.value}'`)
      }
      return val
    }

    // Parenthesized expression
    if (token.type === 'LPAREN') {
      this.pos++
      const result = this.expression()
      if (this.pos >= this.tokens.length || this.tokens[this.pos].type !== 'RPAREN') {
        throw new Error('Parêntese de fechamento esperado')
      }
      this.pos++
      return result
    }

    throw new Error(`Token inesperado: '${token.value}'`)
  }
}

// ─── Composable ───────────────────────────────────────────

export function useFormulaParser() {
  /**
   * Valida a sintaxe de uma fórmula e extrai variáveis.
   */
  function validarFormula(
    formula: string,
    variaveisPermitidas: string[] = [...VARIAVEIS_PERMITIDAS]
  ): FormulaValidation {
    if (!formula || !formula.trim()) {
      return { valid: false, variables: [], error: 'Fórmula é obrigatória' }
    }

    const { tokens, error: tokenError } = tokenize(formula)
    if (tokenError) {
      return { valid: false, variables: [], error: tokenError }
    }

    if (tokens.length === 0) {
      return { valid: false, variables: [], error: 'Fórmula vazia' }
    }

    // Extract variables
    const variables = [...new Set(tokens.filter(t => t.type === 'VARIABLE').map(t => t.value))]

    // Check if all variables are in the allowed set
    for (const v of variables) {
      if (!variaveisPermitidas.includes(v)) {
        return {
          valid: false,
          variables,
          error: `Variável não reconhecida: '${v}'. Variáveis permitidas: ${variaveisPermitidas.join(', ')}`,
          invalidVariable: v,
        }
      }
    }

    // Try to parse with dummy values to validate syntax
    try {
      const dummyVars: Record<string, number> = {}
      for (const v of variables) dummyVars[v] = 1
      const parser = new Parser(tokens, dummyVars)
      parser.parse()
    } catch (e: any) {
      return { valid: false, variables, error: e.message }
    }

    return { valid: true, variables }
  }

  /**
   * Avalia uma fórmula com variáveis substituídas por valores numéricos.
   */
  function avaliarFormula(
    formula: string,
    variaveis: Record<string, number>
  ): FormulaEvalResult {
    const { tokens, error: tokenError } = tokenize(formula)
    if (tokenError) {
      return { success: false, error: tokenError }
    }

    try {
      const parser = new Parser(tokens, variaveis)
      const value = parser.parse()

      if (value < 0) {
        return { success: false, error: 'Resultado negativo' }
      }

      return { success: true, value }
    } catch (e: any) {
      return { success: false, error: e.message }
    }
  }

  /**
   * Extrai nomes de variáveis únicas de uma ou mais fórmulas.
   */
  function extrairVariaveis(formulas: string[]): string[] {
    const allVars = new Set<string>()
    for (const formula of formulas) {
      const { tokens } = tokenize(formula)
      for (const token of tokens) {
        if (token.type === 'VARIABLE') {
          allVars.add(token.value)
        }
      }
    }
    return [...allVars]
  }

  /**
   * Calcula o custo de uma composição individual.
   */
  function calcularCustoComposicao(
    formula: string,
    variaveis: Record<string, number>,
    precoUnitario: number
  ): FormulaEvalResult {
    const resultado = avaliarFormula(formula, variaveis)
    if (!resultado.success) return resultado
    return { success: true, value: resultado.value! * precoUnitario }
  }

  /**
   * Calcula o custo total de todas as composições de um produto.
   */
  function calcularCustoTotal(
    composicoes: Array<{ formula_consumo: string; preco_unitario: number; material_nome: string; unidade_medida: string }>,
    variaveis: Record<string, number>
  ): CustoTotalProduto {
    const detalhes: CustoComposicaoDetalhado[] = []
    let total = 0
    let erro: string | undefined

    for (const comp of composicoes) {
      const resultado = avaliarFormula(comp.formula_consumo, variaveis)

      if (!resultado.success) {
        detalhes.push({
          material_nome: comp.material_nome,
          formula_consumo: comp.formula_consumo,
          resultado_formula: null,
          preco_unitario: comp.preco_unitario,
          unidade_medida: comp.unidade_medida,
          custo_parcial: null,
        })
        erro = resultado.error
        continue
      }

      const custoParcial = resultado.value! * comp.preco_unitario
      total += custoParcial

      detalhes.push({
        material_nome: comp.material_nome,
        formula_consumo: comp.formula_consumo,
        resultado_formula: resultado.value!,
        preco_unitario: comp.preco_unitario,
        unidade_medida: comp.unidade_medida,
        custo_parcial: custoParcial,
      })
    }

    return {
      composicoes: detalhes,
      custo_total: erro ? null : total,
      erro,
    }
  }

  return {
    validarFormula,
    avaliarFormula,
    extrairVariaveis,
    calcularCustoComposicao,
    calcularCustoTotal,
    VARIAVEIS_PERMITIDAS,
  }
}
