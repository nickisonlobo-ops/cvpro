# Design Document: Catálogo Multi-Material

## Overview

A feature evolui o catálogo de produtos (`catalogo_adesivos`) de uma associação direta com um único material para um modelo de composição N:N via junction table, com fórmulas de consumo avaliadas dinamicamente. O custo do produto passa a ser calculado em tempo real com base nos preços atuais dos materiais e nas dimensões informadas no orçamento.

## Architecture

A arquitetura segue o padrão existente do projeto: Nuxt 3 + Vue 3 Composition API no frontend, Supabase PostgreSQL com RLS no backend. A lógica de domínio (parsing de fórmulas, cálculos) fica isolada em composables puros, testáveis sem dependências externas.

### Camadas

```
┌─────────────────────────────────────────────────────┐
│  UI Layer (Vue Components / Pages)                  │
│  app/pages/adesivos-catalogo.vue (existente, mod.)  │
├─────────────────────────────────────────────────────┤
│  Domain Logic Layer (Composables - puro)            │
│  app/composables/useAdesivos.ts (estendido)         │
│  app/composables/useFormulaParser.ts (novo)         │
├─────────────────────────────────────────────────────┤
│  Data Layer (Supabase Client)                       │
│  app/lib/supabase.ts (existente, sem mudanças)      │
├─────────────────────────────────────────────────────┤
│  Database (PostgreSQL + RLS)                        │
│  catalogo_produto_materiais (nova junction table)   │
│  catalogo_adesivos (alterada - remove material_id)  │
└─────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Junction Table: `catalogo_produto_materiais`

Nova tabela de associação entre produto e materiais com fórmula de consumo.

### 2. Formula Parser: `useFormulaParser.ts`

Composable puro (sem side effects) responsável por:
- Validar sintaxe de expressões matemáticas
- Identificar variáveis referenciadas na fórmula
- Avaliar fórmulas com variáveis substituídas por valores reais
- Usar avaliação segura (sem `eval()`) via tokenization + recursive descent parser

### 3. Composição UI: Seção no modal de produto

Componente inline no modal existente de criar/editar produto que permite:
- Adicionar/remover linhas de composição
- Selecionar material + digitar fórmula por linha
- Preview de variáveis detectadas
- Cálculo de custo em tempo real quando variáveis são preenchidas

### 4. Validação estendida no `useAdesivos.ts`

Nova função `validarProdutoCatalogoMultiMaterial()` que substitui a validação atual, exigindo pelo menos uma composição válida.

## Data Models

### Database Schema

```sql
-- Nova junction table
CREATE TABLE public.catalogo_produto_materiais (
  id bigserial PRIMARY KEY,
  empresa_id bigint NOT NULL REFERENCES public.empresas(id),
  produto_id bigint NOT NULL REFERENCES public.catalogo_adesivos(id) ON DELETE CASCADE,
  material_id bigint NOT NULL REFERENCES public.materiais_adesivo(id),
  formula_consumo text NOT NULL,
  ordem integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(produto_id, material_id)
);

-- RLS policy
ALTER TABLE public.catalogo_produto_materiais ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Empresa isolation" ON public.catalogo_produto_materiais
  USING (empresa_id = (SELECT empresa_id FROM auth_context()));

-- Migration: converter produtos existentes
INSERT INTO public.catalogo_produto_materiais (empresa_id, produto_id, material_id, formula_consumo, ordem)
SELECT empresa_id, id, material_id, 'largura * altura', 0
FROM public.catalogo_adesivos
WHERE material_id IS NOT NULL;

-- Remover coluna legada
ALTER TABLE public.catalogo_adesivos DROP COLUMN material_id;
```

### TypeScript Interfaces

```typescript
// ─── Composição de Material ───────────────────────────────
interface ComposicaoMaterial {
  id?: number
  produto_id: number
  material_id: number
  formula_consumo: string
  ordem: number
  // Joined fields (read)
  material_nome?: string
  material_preco_m2?: number
  material_unidade?: string
}

// ─── Resultado de avaliação de fórmula ────────────────────
interface FormulaEvalResult {
  success: true
  value: number
} | {
  success: false
  error: string
}

// ─── Resultado de validação de fórmula ────────────────────
interface FormulaValidation {
  valid: boolean
  variables: string[]        // variáveis encontradas na fórmula
  error?: string             // mensagem de erro se inválida
  invalidVariable?: string   // nome da variável inválida (se houver)
}

// ─── Variáveis de medida disponíveis ──────────────────────
const VARIAVEIS_PERMITIDAS = ['largura', 'altura', 'comprimento', 'quantidade'] as const
type VariavelMedida = typeof VARIAVEIS_PERMITIDAS[number]

// ─── Custo detalhado por composição ───────────────────────
interface CustoComposicaoDetalhado {
  material_nome: string
  formula_consumo: string
  resultado_formula: number | null  // null se variáveis não preenchidas
  preco_m2: number
  custo_parcial: number | null      // null se variáveis não preenchidas
}

// ─── Resultado do cálculo completo do produto ─────────────
interface CustoTotalProduto {
  composicoes: CustoComposicaoDetalhado[]
  custo_total: number | null
  erro?: string
}
```

## Interfaces

### `useFormulaParser` — Composable API

```typescript
export function useFormulaParser() {
  /**
   * Valida a sintaxe de uma fórmula e extrai variáveis.
   * Retorna lista de variáveis encontradas e indica se a sintaxe é válida.
   */
  function validarFormula(
    formula: string,
    variaveisPermitidas?: string[]
  ): FormulaValidation

  /**
   * Avalia uma fórmula com variáveis substituídas por valores numéricos.
   * Retorna erro se divisão por zero ou resultado negativo.
   */
  function avaliarFormula(
    formula: string,
    variaveis: Record<string, number>
  ): FormulaEvalResult

  /**
   * Extrai nomes de variáveis únicas de uma ou mais fórmulas.
   */
  function extrairVariaveis(formulas: string[]): string[]

  /**
   * Calcula o custo de uma composição individual.
   * custo = avaliarFormula(formula, vars).value * preco_m2
   */
  function calcularCustoComposicao(
    formula: string,
    variaveis: Record<string, number>,
    precoM2: number
  ): FormulaEvalResult

  /**
   * Calcula o custo total de todas as composições de um produto.
   * Soma de todos os custos individuais.
   */
  function calcularCustoTotal(
    composicoes: Array<{ formula_consumo: string; preco_m2: number }>,
    variaveis: Record<string, number>
  ): CustoTotalProduto

  return {
    validarFormula,
    avaliarFormula,
    extrairVariaveis,
    calcularCustoComposicao,
    calcularCustoTotal,
  }
}
```

### `useAdesivos` — Extensão

```typescript
// Nova função de validação para produto multi-material
function validarProdutoCatalogoMultiMaterial(data: {
  nome?: string | null
  categoria?: string | null
  largura_cm?: number | null
  altura_cm?: number | null
  preco_venda?: number | null
  descricao?: string | null
  imagem_url?: string | null
  composicoes?: Array<{
    material_id: number | null
    formula_consumo: string
  }>
}): ValidationResult
```

## Formula Parser — Implementation Strategy

O parser usa **recursive descent** com tokenização prévia para segurança (sem `eval()`).

### Gramática suportada

```
expression  → term (('+' | '-') term)*
term        → factor (('*' | '/') factor)*
factor      → NUMBER | VARIABLE | '(' expression ')' | '-' factor
NUMBER      → [0-9]+ ('.' [0-9]+)?
VARIABLE    → [a-z][a-z0-9_]*
```

### Tokens válidos

| Tipo       | Exemplos                          |
|------------|-----------------------------------|
| NUMBER     | `1`, `3.14`, `0.5`, `100`         |
| VARIABLE   | `largura`, `altura`, `quantidade` |
| OPERATOR   | `+`, `-`, `*`, `/`                |
| PAREN      | `(`, `)`                          |

### Variáveis permitidas

- `largura` — largura em cm (informada no orçamento)
- `altura` — altura em cm (informada no orçamento)
- `comprimento` — comprimento em cm (para materiais lineares)
- `quantidade` — quantidade de unidades

### Exemplos de fórmulas válidas

```
largura * altura                    → área simples
(largura * altura) / 10000         → área em m²
largura * altura * 1.1              → área + 10% de margem
(largura + 4) * (altura + 4)       → área com sangria de 2cm
quantidade * 0.5                    → meio metro por unidade
(largura * altura) / 10000 + 0.3   → área em m² + margem fixa
```

## Error Handling

| Cenário                          | Comportamento                                                    |
|----------------------------------|------------------------------------------------------------------|
| Fórmula com sintaxe inválida     | `validarFormula` retorna `valid: false` com mensagem descritiva  |
| Variável não reconhecida         | `validarFormula` retorna `invalidVariable` com o nome            |
| Divisão por zero na avaliação    | `avaliarFormula` retorna `success: false, error: "Divisão por zero"` |
| Resultado negativo               | `avaliarFormula` retorna `success: false, error: "Resultado negativo"` |
| Produto sem composições          | Validação bloqueia gravação com mensagem clara                   |
| Variável não preenchida no orçamento | Bloqueia finalização, indica qual variável falta              |
| Material inativo na composição   | Permitido na migração, bloqueado em novas adições                |

## Migration Strategy

1. **Fase 1**: Criar tabela `catalogo_produto_materiais` com RLS
2. **Fase 2**: Migrar dados — para cada produto com `material_id`, criar entrada na junction table com fórmula `largura * altura`
3. **Fase 3**: Remover coluna `material_id` de `catalogo_adesivos`
4. **Ordem**: Executada em uma única migration SQL transacional

## Testing Strategy

### Unit Tests (example-based)
- Validação de formulário de produto com composições válidas/inválidas
- Remoção de composição de um produto
- Exibição condicional (com/sem variáveis preenchidas)
- Migração de produtos existentes para a nova estrutura

### Property-Based Tests
- Parser de fórmulas: validação de sintaxe, extração de variáveis, avaliação aritmética
- Cálculo de custos: invariantes aritméticas (custo = formula × preço, total = soma parciais)
- Validação de entrada: composições obrigatórias, variáveis completas

### Integration Tests
- RLS: isolamento de dados por empresa_id
- Atualização de preço refletida em cálculos subsequentes
- Migração end-to-end com dados reais

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Composição requer material e fórmula

*For any* composition entry submission where `material_id` is null OR `formula_consumo` is an empty/whitespace-only string, the validation function SHALL return an error and reject the submission.

**Validates: Requirements 1.3**

### Property 2: Produto exige ao menos uma composição

*For any* product form submission where the `composicoes` array is empty (length === 0), the validation function SHALL return an error indicating that at least one composition is required.

**Validates: Requirements 1.5**

### Property 3: Fórmulas válidas são aceitas pelo parser

*For any* string composed exclusively of valid tokens (decimal numbers, allowed variable names, arithmetic operators `+`, `-`, `*`, `/`, and balanced parentheses) forming a syntactically correct expression, the `validarFormula` function SHALL return `valid: true`.

**Validates: Requirements 2.1, 2.2**

### Property 4: Variáveis na fórmula devem pertencer ao conjunto permitido

*For any* formula string, `validarFormula` SHALL return `valid: true` if and only if every variable identifier in the formula belongs to the set of allowed variables (`largura`, `altura`, `comprimento`, `quantidade`). If any variable is not in the set, it SHALL return `valid: false` with the name of the invalid variable.

**Validates: Requirements 2.3, 2.4**

### Property 5: Avaliação de fórmula produz resultado aritmético correto

*For any* syntactically valid formula and *for any* set of positive numeric variable bindings, `avaliarFormula(formula, bindings)` SHALL produce a numeric result equal to the arithmetic evaluation of the expression with variables substituted by their respective values.

**Validates: Requirements 3.2**

### Property 6: Custo de composição é resultado da fórmula vezes preço do material

*For any* valid formula that evaluates to a positive number R, and *for any* material with `preco_m2` = P (where P > 0), `calcularCustoComposicao` SHALL return a value equal to R × P.

**Validates: Requirements 3.1, 3.3**

### Property 7: Custo total é a soma dos custos de composição

*For any* product with N compositions (N ≥ 1), each with a successfully calculated `custo_parcial`, the `custo_total` SHALL equal the sum of all `custo_parcial` values.

**Validates: Requirements 3.4, 4.2**

### Property 8: Erros aritméticos são sinalizados

*For any* formula evaluation that results in division by zero OR a negative result, `avaliarFormula` SHALL return `success: false` with a descriptive error message, and the result SHALL NOT be included in cost calculations.

**Validates: Requirements 3.5**

### Property 9: Extração de variáveis retorna todas as variáveis únicas das fórmulas

*For any* set of formulas, `extrairVariaveis(formulas)` SHALL return a list containing every unique variable name referenced across all formulas, with no duplicates and no omissions.

**Validates: Requirements 5.1**

### Property 10: Variáveis incompletas bloqueiam finalização

*For any* set of required variables (extracted from the product's formulas) where at least one variable has no value assigned, the validation SHALL fail and indicate which variable(s) are missing.

**Validates: Requirements 5.4**
