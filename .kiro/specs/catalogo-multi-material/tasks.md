# Implementation Plan: Catálogo Multi-Material

## Overview

Implementação do suporte a múltiplos materiais por produto no catálogo de adesivos, com fórmulas de consumo customizáveis e cálculo dinâmico de custo. A implementação segue a ordem: migration SQL → parser de fórmulas → composable de dados → UI de composição → integração com orçamento.

## Tasks

- [ ] 1. Database Migration e Schema
  - [ ] 1.1 Criar migration SQL para a junction table `catalogo_produto_materiais`
    - Criar arquivo `supabase/migrations/20260622_catalogo_multi_material.sql`
    - Criar tabela `catalogo_produto_materiais` com colunas: id (bigserial PK), empresa_id, produto_id (FK catalogo_adesivos ON DELETE CASCADE), material_id (FK materiais_adesivo), formula_consumo (text NOT NULL), ordem (integer DEFAULT 0), created_at
    - Adicionar constraint UNIQUE(produto_id, material_id)
    - Habilitar RLS com policy de isolamento por empresa_id
    - Migrar dados existentes: INSERT INTO catalogo_produto_materiais a partir de catalogo_adesivos WHERE material_id IS NOT NULL, usando fórmula padrão `largura * altura`
    - Remover coluna `material_id` de `catalogo_adesivos`
    - _Requirements: 6.1, 6.2, 6.3, 6.5, 1.6_

- [ ] 2. Formula Parser (Domain Logic)
  - [ ] 2.1 Criar composable `useFormulaParser.ts` com tokenizer e recursive descent parser
    - Criar arquivo `app/composables/useFormulaParser.ts`
    - Implementar tokenizer que reconhece: NUMBER, VARIABLE, OPERATOR (+,-,*,/), PAREN
    - Implementar recursive descent parser seguindo a gramática: expression → term → factor
    - Implementar `validarFormula(formula, variaveisPermitidas?)` que valida sintaxe e extrai variáveis
    - Implementar `avaliarFormula(formula, variaveis)` que avalia com substituição de variáveis
    - Implementar `extrairVariaveis(formulas)` que retorna variáveis únicas de múltiplas fórmulas
    - Implementar `calcularCustoComposicao(formula, variaveis, precoM2)` que retorna custo de uma composição
    - Implementar `calcularCustoTotal(composicoes, variaveis)` que retorna soma de custos parciais
    - Tratar erros: divisão por zero, resultado negativo, variável inválida, sintaxe incorreta
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ]* 2.2 Write property test: Fórmulas válidas aceitas pelo parser
    - **Property 3: Fórmulas válidas são aceitas pelo parser**
    - **Validates: Requirements 2.1, 2.2**

  - [ ]* 2.3 Write property test: Variáveis devem pertencer ao conjunto permitido
    - **Property 4: Variáveis na fórmula devem pertencer ao conjunto permitido**
    - **Validates: Requirements 2.3, 2.4**

  - [ ]* 2.4 Write property test: Avaliação aritmética correta
    - **Property 5: Avaliação de fórmula produz resultado aritmético correto**
    - **Validates: Requirements 3.2**

  - [ ]* 2.5 Write property test: Custo de composição é resultado × preço
    - **Property 6: Custo de composição é resultado da fórmula vezes preço do material**
    - **Validates: Requirements 3.1, 3.3**

  - [ ]* 2.6 Write property test: Custo total é soma dos custos parciais
    - **Property 7: Custo total é a soma dos custos de composição**
    - **Validates: Requirements 3.4, 4.2**

  - [ ]* 2.7 Write property test: Erros aritméticos sinalizados
    - **Property 8: Erros aritméticos são sinalizados**
    - **Validates: Requirements 3.5**

  - [ ]* 2.8 Write property test: Extração de variáveis únicas
    - **Property 9: Extração de variáveis retorna todas as variáveis únicas das fórmulas**
    - **Validates: Requirements 5.1**

- [ ] 3. Checkpoint - Validar parser de fórmulas
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Composable de Dados e Validação
  - [ ] 4.1 Estender `useAdesivos.ts` com CRUD de composições multi-material
    - Adicionar TypeScript interfaces: `ComposicaoMaterial`, `FormulaEvalResult`, `FormulaValidation`, `CustoComposicaoDetalhado`, `CustoTotalProduto`
    - Implementar `carregarComposicoes(produtoId)` que busca composições com JOIN no material (nome, preco_m2, unidade)
    - Implementar `salvarComposicoes(produtoId, composicoes[])` que faz upsert/delete de composições
    - Implementar `removerComposicao(composicaoId)` para remoção individual
    - Implementar `validarProdutoCatalogoMultiMaterial(data)` que valida: nome obrigatório, ao menos uma composição, cada composição com material_id e fórmula válida
    - Garantir que queries filtrem por empresa_id (RLS)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

  - [ ]* 4.2 Write property test: Composição requer material e fórmula
    - **Property 1: Composição requer material e fórmula**
    - **Validates: Requirements 1.3**

  - [ ]* 4.3 Write property test: Produto exige ao menos uma composição
    - **Property 2: Produto exige ao menos uma composição**
    - **Validates: Requirements 1.5**

  - [ ]* 4.4 Write property test: Variáveis incompletas bloqueiam finalização
    - **Property 10: Variáveis incompletas bloqueiam finalização**
    - **Validates: Requirements 5.4**

- [ ] 5. Checkpoint - Validar composable de dados
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. UI de Composição no Modal de Produto
  - [ ] 6.1 Implementar seção de composição multi-material no modal de criar/editar produto
    - Modificar `app/pages/adesivos-catalogo.vue`
    - Adicionar seção "Composição de Materiais" no modal existente de produto
    - Implementar lista de linhas de composição com: select de material (filtrado por empresa ativa), input de fórmula com validação em tempo real, botão de remover linha
    - Implementar botão "Adicionar Material" para incluir nova linha de composição
    - Exibir preview de variáveis detectadas na fórmula (badges com nomes das variáveis)
    - Exibir mensagens de erro de validação inline (sintaxe inválida, variável não reconhecida)
    - Integrar validação `validarProdutoCatalogoMultiMaterial` no submit do formulário
    - Bloquear gravação se zero composições (mensagem clara)
    - Usar TailwindCSS para estilização consistente com o restante do app
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [ ] 6.2 Implementar exibição de custo detalhado por composição
    - Adicionar seção de preview de custo no modal/detalhe do produto
    - Exibir tabela com colunas: Material, Fórmula, Resultado, Preço/m², Custo Parcial
    - Quando variáveis não preenchidas, exibir fórmula textual com indicação "preencher no orçamento"
    - Quando variáveis preenchidas, calcular e exibir valores em tempo real
    - Exibir linha de Custo Total (soma dos parciais)
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 7. Integração com Orçamento
  - [ ] 7.1 Implementar campos de variáveis de medida na tela de orçamento
    - Modificar a tela de orçamento para detectar variáveis necessárias ao selecionar um produto
    - Usar `extrairVariaveis` para identificar quais campos apresentar
    - Renderizar inputs numéricos para cada variável (largura, altura, comprimento, quantidade conforme necessário)
    - Validar: valores numéricos positivos, até uma casa decimal
    - Ao preencher variáveis, calcular e exibir Custo_Total e composição detalhada imediatamente
    - Bloquear finalização do orçamento se alguma variável obrigatória estiver vazia (indicar qual)
    - Armazenar valores das variáveis junto ao item do pedido
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 3.2, 3.6_

- [ ] 8. Checkpoint Final - Validar integração completa
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- The formula parser is implemented as a pure composable without side effects, facilitating isolated testing
- A migration SQL transacional garante atomicidade na mudança de schema
- O parser usa recursive descent (sem `eval()`) para segurança

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["2.1"] },
    { "id": 2, "tasks": ["2.2", "2.3", "2.4", "2.5", "2.6", "2.7", "2.8"] },
    { "id": 3, "tasks": ["4.1"] },
    { "id": 4, "tasks": ["4.2", "4.3", "4.4"] },
    { "id": 5, "tasks": ["6.1", "6.2"] },
    { "id": 6, "tasks": ["7.1"] }
  ]
}
```
