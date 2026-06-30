# Implementation Plan: Dashboard Visão Geral

## Overview

Redesenho completo da seção admin/gerente do dashboard principal (`app/pages/index.vue`) do SignPRO, substituindo atalhos e métricas genéricas por métricas financeiras, pipeline de orçamentos, status de produção, atividade recente e alertas de prazos. A implementação utiliza um composable centralizado `useDashboardAdmin` com funções puras testáveis para lógica de negócio.

## Tasks

- [x] 1. Criar funções utilitárias puras do dashboard
  - [x] 1.1 Implementar `calcularPeriodoRange` em `app/utils/dashboard.ts`
    - Criar o arquivo `app/utils/dashboard.ts`
    - Implementar a função pura `calcularPeriodoRange(filtro, custom, hoje?)` que converte `PeriodoFiltro` em `PeriodoRange` com datas ISO
    - Cobrir os casos: `mes_atual`, `semana_atual`, `trimestre_atual`, `ano_atual`, `personalizado`
    - Exportar os tipos `PeriodoFiltro`, `PeriodoRange`
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 1.2 Implementar `buildAtividadeFeed` em `app/utils/dashboard.ts`
    - Implementar a função pura `buildAtividadeFeed(events, limit?)` que ordena por `criadoEm` decrescente e limita a `limit` (padrão 10)
    - Exportar o tipo `RawEvent` e `AtividadeItem`
    - _Requirements: 5.1_

  - [x] 1.3 Implementar `calcularAlertas` em `app/utils/dashboard.ts`
    - Implementar a função pura `calcularAlertas(input, hoje?)` que calcula alertas de orçamentos expirando, contas vencidas e OS atrasadas
    - Calcular `temAlertas` como `true` se qualquer contagem > 0
    - Exportar os tipos `AlertasInput` e `AlertasDashboard`
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ]* 1.4 Escrever testes unitários para funções utilitárias
    - Criar `tests/unit/dashboard-utils.test.ts`
    - Testar `calcularPeriodoRange`: ano bissexto, dezembro→janeiro, trimestres, semana atual
    - Testar `buildAtividadeFeed`: lista vazia, 1 item, >10 items
    - Testar `calcularAlertas`: sem alertas, todas categorias, validade = hoje
    - _Requirements: 2.1, 2.4, 5.1, 6.1, 6.2_

  - [ ]* 1.5 Escrever property test — Property 2: Period range produces valid date boundaries
    - **Property 2: Period range produces valid date boundaries**
    - **Validates: Requirements 2.1, 2.2, 2.4**
    - Para qualquer `PeriodoFiltro` válido e data de referência, `calcularPeriodoRange` produz `inicio <= fim` em formato ISO

  - [ ]* 1.6 Escrever property test — Property 3: Period filter defaults to mês atual
    - **Property 3: Period filter defaults to mês atual**
    - **Validates: Requirements 2.3**
    - Para qualquer data de referência, `calcularPeriodoRange('mes_atual', ...)` produz range correspondente ao primeiro e último dia do mês

  - [ ]* 1.7 Escrever property test — Property 5: Activity feed is ordered and bounded
    - **Property 5: Activity feed is ordered and bounded**
    - **Validates: Requirements 5.1**
    - Para qualquer lista de eventos, `buildAtividadeFeed` retorna no máximo 10 items ordenados por `criadoEm` decrescente

  - [ ]* 1.8 Escrever property test — Property 6: Alertas visibility is consistent with alert counts
    - **Property 6: Alertas visibility is consistent with alert counts**
    - **Validates: Requirements 6.3, 6.4**
    - `temAlertas` é `true` se e somente se ao menos um dos contadores (`orcamentosExpirando`, `contasVencidas`, `osAtrasadas`) é > 0

  - [ ]* 1.9 Escrever property test — Property 7: Overdue bills calculation is correct
    - **Property 7: Overdue bills calculation is correct**
    - **Validates: Requirements 1.4, 6.2**
    - A contagem de `contasVencidas` é igual ao número de entradas onde `data_vencimento < hoje` e status não é `pago`/`cancelado`

  - [ ]* 1.10 Escrever property test — Property 8: Expiring quotations detection
    - **Property 8: Expiring quotations detection**
    - **Validates: Requirements 6.1**
    - A contagem de `orcamentosExpirando` é igual ao número de orçamentos enviados cuja data de expiração está dentro dos próximos 7 dias

- [x] 2. Checkpoint - Garantir que funções utilitárias estão corretas
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Implementar o composable `useDashboardAdmin`
  - [x] 3.1 Criar estrutura base do composable em `app/composables/useDashboardAdmin.ts`
    - Definir e exportar todas as interfaces: `MetricasFinanceiras`, `PipelineOrcamentos`, `StatusProducao`, `AtividadeItem`, `AlertasDashboard`, `DashboardAdminState`
    - Implementar a função `useDashboardAdmin()` com state reativo (loading, financeiro, pipeline, producao, atividades, alertas)
    - Implementar `periodoFiltro` como ref com default `'mes_atual'` e `periodoRange` como computed usando `calcularPeriodoRange`
    - Implementar `periodoLabel` computed que retorna label legível
    - _Requirements: 1.1, 1.2, 1.3, 2.3, 9.2_

  - [x] 3.2 Implementar queries Supabase dentro do composable
    - Implementar `fetchFinanceiro()`: query `orcamentos_adesivo` (status=aprovado, period) + query `contas_pagar` (status≠cancelado, period)
    - Implementar `fetchPipeline()`: query `orcamentos_adesivo` agrupado por status no período
    - Implementar `fetchProducao()`: query `ordens_servico_adesivo` por status + `processos_instancia` ativos
    - Implementar `fetchAtividade()`: query combinada das últimas atividades com join em `clientes`
    - Implementar `fetchAlertas()`: usar `calcularAlertas` com dados de orçamentos enviados, contas vencidas e OS com prazo
    - Todas as queries filtradas por `empresa_id` via `useEmpresa()`
    - Usar `Promise.allSettled` para queries independentes
    - _Requirements: 1.1, 1.2, 1.4, 3.1, 3.2, 4.1, 4.2, 4.3, 5.1, 6.1, 6.2, 9.1, 9.3_

  - [x] 3.3 Implementar watch reativo e método `refresh()`
    - Adicionar `watch` em `periodoFiltro` e `periodoCustom` para re-executar todas as queries automaticamente
    - Implementar método público `refresh()` para recarregamento manual
    - Garantir que nenhuma query executa quando `empresaId` é null
    - _Requirements: 2.2, 9.2_

  - [ ]* 3.4 Escrever property test — Property 1: Lucro Estimado é Faturamento menos Despesas
    - **Property 1: Lucro Estimado é Faturamento menos Despesas**
    - **Validates: Requirements 1.3**
    - Para quaisquer valores de faturamento ≥ 0 e despesas ≥ 0, `lucroEstimado` é sempre `faturamento - despesas`

  - [ ]* 3.5 Escrever property test — Property 4: Pipeline counts are non-negative and sum to total
    - **Property 4: Pipeline counts are non-negative and sum to total**
    - **Validates: Requirements 3.1**
    - A soma dos counts por status é igual ao total de orçamentos no período, e cada count individual é ≥ 0

  - [ ]* 3.6 Escrever property test — Property 10: All queries filter by empresa_id
    - **Property 10: All queries filter by empresa_id**
    - **Validates: Requirements 9.1, 9.2, 9.3**
    - Quando `empresaId` está definido, todos os dados pertencem a esse `empresa_id`; quando é null, nenhuma query executa

  - [ ]* 3.7 Escrever testes de integração para o composable
    - Criar `tests/integration/useDashboardAdmin.test.ts`
    - Mockar Supabase client e testar que queries retornam dados corretos
    - Testar que mudança de período dispara re-fetch
    - Testar isolamento multi-tenant com mock de múltiplas empresas
    - _Requirements: 2.2, 9.1, 9.3_

- [x] 4. Checkpoint - Garantir que composable funciona corretamente
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implementar o template do dashboard na page
  - [x] 5.1 Refatorar `app/pages/index.vue` — Remover atalhos e métricas antigas
    - Remover a seção "Atalhos" (shortcut grid) do template admin
    - Remover cards de "produtos_casa_racao" e métricas específicas de salão
    - Manter a estrutura condicional `useAdmin` existente intacta
    - _Requirements: 8.1, 8.2_

  - [x] 5.2 Implementar seção de Alertas no template
    - Renderizar seção de alertas no topo da página quando `alertas.temAlertas` é true
    - Exibir contadores: orçamentos expirando, contas vencidas (valor total), OS atrasadas
    - Aplicar tratamento visual distinto (cor de destaque, ícones de alerta)
    - Não renderizar a seção quando não há alertas
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [x] 5.3 Implementar cards de Métricas Financeiras
    - Criar grid responsivo com 4 cards: Faturamento, Despesas, Lucro Estimado, Contas Vencidas
    - Usar `formatCurrency()` de `useLocale` para todos os valores monetários
    - Exibir indicador visual no card de Contas Vencidas quando count > 0
    - Aplicar layout: 4 cards/row desktop (xl), 2 cards/row mobile
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 7.1_

  - [x] 5.4 Implementar filtro de período no template
    - Criar componente de seleção de período com opções: mês atual, semana atual, trimestre, ano, personalizado
    - Quando `personalizado` selecionado, mostrar seletores de mês e ano
    - Vincular ao `periodoFiltro` e `periodoCustom` do composable
    - Exibir `periodoLabel` como texto descritivo do período ativo
    - _Requirements: 2.1, 2.3, 2.4_

  - [x] 5.5 Implementar seção Pipeline de Orçamentos
    - Exibir contadores por status: rascunho, enviado, aprovado, rejeitado, vencido com badges coloridos
    - Exibir valor "Em Negociação" (orçamentos enviados) formatado com `formatCurrency()`
    - Exibir mensagem zero-state quando não há orçamentos no período
    - _Requirements: 3.1, 3.2, 3.3_

  - [x] 5.6 Implementar seção Status de Produção
    - Exibir contadores: OS em Produção, OS Prontas, Processos Ativos
    - Exibir indicador visual de warning para OS com prazo vencido
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 5.7 Implementar Feed de Atividade Recente
    - Exibir lista das 10 atividades mais recentes com: ícone do tipo, descrição, nome do cliente, timestamp relativo
    - Implementar navegação ao clicar no item (rota para detalhe correspondente)
    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 5.8 Implementar loading skeletons e layout responsivo
    - Adicionar skeleton placeholders para cada seção durante carregamento (`loading` = true)
    - Aplicar classes TailwindCSS consistentes: rounded-2xl, border-primary-10, shadow-sm
    - Garantir stacking vertical em mobile com full-width
    - Exibir botão "Tentar novamente" após timeout de 10 segundos
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [ ]* 5.9 Escrever property test — Property 9: Currency formatting respects locale
    - **Property 9: Currency formatting respects locale**
    - **Validates: Requirements 1.5**
    - Para qualquer valor numérico, `formatCurrency(value)` produz string com símbolo de moeda apropriado ao locale (`R$` para BR, `€` para PT)

- [x] 6. Final checkpoint - Garantir que tudo funciona integrado
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marcadas com `*` são opcionais e podem ser puladas para um MVP mais rápido
- Cada task referencia requisitos específicos para rastreabilidade
- Checkpoints garantem validação incremental
- Property tests validam propriedades universais de corretude definidas no design
- Testes unitários validam exemplos específicos e edge cases
- O projeto usa Nuxt 3 + Supabase + TailwindCSS + Vitest + fast-check
- O composable `useLocale` já existe e fornece `formatCurrency()`
- O composable `useEmpresa` já existe e fornece `empresa_id`
- O composable `useAdmin` já existe e controla visibilidade do template admin

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3"] },
    { "id": 1, "tasks": ["1.4", "1.5", "1.6", "1.7", "1.8", "1.9", "1.10"] },
    { "id": 2, "tasks": ["3.1"] },
    { "id": 3, "tasks": ["3.2", "3.3"] },
    { "id": 4, "tasks": ["3.4", "3.5", "3.6", "3.7"] },
    { "id": 5, "tasks": ["5.1", "5.4"] },
    { "id": 6, "tasks": ["5.2", "5.3", "5.5", "5.6", "5.7"] },
    { "id": 7, "tasks": ["5.8", "5.9"] }
  ]
}
```
