# Requirements Document

## Introduction

Redesenho completo da visão admin/gerente do dashboard principal (app/pages/index.vue) do SignPRO. O dashboard atual apresenta problemas de busca de dados, atalhos desnecessários e não oferece uma visão clara da saúde do negócio. O novo dashboard deve fornecer uma visão rápida e prática com métricas financeiras, pipeline de orçamentos, status de produção, atividade recente e alertas de prazos — sem duplicar funcionalidades das páginas Consultor IA e Financeiro.

## Glossary

- **Dashboard**: Página principal (`app/pages/index.vue`) exibida quando um admin ou gerente faz login no sistema SignPRO
- **Admin_View**: Seção do Dashboard visível exclusivamente para usuários com perfil `admin` ou `gerente`
- **Empresa_Id**: Identificador do tenant; todas as queries devem filtrar por `empresa_id` para garantir isolamento multi-tenant
- **Faturamento**: Soma dos valores de orçamentos aprovados (tabela `orcamentos_adesivo` com status `aprovado`) no período selecionado
- **Despesas**: Soma dos valores de contas a pagar (tabela `contas_pagar`) com status diferente de `cancelado` no período selecionado
- **Lucro_Estimado**: Diferença entre Faturamento e Despesas no mesmo período
- **Pipeline_Orcamentos**: Distribuição dos orçamentos ativos por status (`rascunho`, `enviado`, `aprovado`, `rejeitado`, `vencido`)
- **OS_Em_Producao**: Ordens de serviço (tabela `ordens_servico_adesivo`) com status `aguardando_producao` ou `em_producao`
- **Processos_Ativos**: Instâncias de processos de produção (tabela `processos_instancia`) que ainda não foram finalizados
- **Contas_Vencidas**: Contas a pagar com `data_vencimento` anterior à data atual e status diferente de `pago` ou `cancelado`
- **useLocale**: Composable que fornece `formatCurrency()` e `valorComIva()` para formatação monetária localizada (BRL/EUR)
- **Periodo_Filtro**: Intervalo de datas selecionado pelo usuário para filtrar métricas (mês atual, semana, trimestre, ano, personalizado)

## Requirements

### Requirement 1: Métricas Financeiras Resumidas

**User Story:** As an admin/gerente, I want to see key financial metrics at a glance, so that I can quickly assess the financial health of my business.

#### Acceptance Criteria

1. WHEN the Admin_View loads, THE Dashboard SHALL display Faturamento for the selected Periodo_Filtro calculated as the sum of `valor_total` from `orcamentos_adesivo` where status is `aprovado` and `created_at` falls within the Periodo_Filtro, filtered by Empresa_Id
2. WHEN the Admin_View loads, THE Dashboard SHALL display Despesas for the selected Periodo_Filtro calculated as the sum of `valor` from `contas_pagar` where status is not `pago` and not `cancelado` and `data_vencimento` falls within the Periodo_Filtro, filtered by Empresa_Id
3. WHEN the Admin_View loads, THE Dashboard SHALL display Lucro_Estimado calculated as Faturamento minus Despesas for the selected Periodo_Filtro
4. WHEN the Admin_View loads, THE Dashboard SHALL display the count of Contas_Vencidas with a visual alert indicator when the count is greater than zero
5. THE Dashboard SHALL format all monetary values using the `useLocale` composable `formatCurrency()` function to respect the tenant locale (BRL or EUR)

### Requirement 2: Filtro de Período

**User Story:** As an admin/gerente, I want to filter dashboard metrics by time period, so that I can analyze business performance across different intervals.

#### Acceptance Criteria

1. THE Dashboard SHALL provide a period filter with the following options: mês atual, semana atual, trimestre atual, ano atual, and a custom month/year selector
2. WHEN the user selects a Periodo_Filtro, THE Dashboard SHALL recalculate and re-render all financial metrics and operational counts for the selected period
3. THE Dashboard SHALL default to `mês atual` as the initial Periodo_Filtro on page load
4. WHEN the user selects `personalizado`, THE Dashboard SHALL display month and year selectors and apply the selected month/year range

### Requirement 3: Pipeline de Orçamentos

**User Story:** As an admin/gerente, I want to see a summary of my quotation pipeline, so that I can track sales progress and identify bottlenecks.

#### Acceptance Criteria

1. WHEN the Admin_View loads, THE Dashboard SHALL display the count of `orcamentos_adesivo` grouped by status (`rascunho`, `enviado`, `aprovado`, `rejeitado`, `vencido`) filtered by Empresa_Id and Periodo_Filtro
2. WHEN the Admin_View loads, THE Dashboard SHALL display the total monetary value of orçamentos with status `enviado` (pending approval) as "Em Negociação" using `formatCurrency()`
3. IF no orçamentos exist for the selected Periodo_Filtro, THEN THE Dashboard SHALL display a zero-state message indicating no quotations in the period

### Requirement 4: Status de Produção

**User Story:** As an admin/gerente, I want to see production status at a glance, so that I can monitor work-in-progress and delivery timelines.

#### Acceptance Criteria

1. WHEN the Admin_View loads, THE Dashboard SHALL display the count of OS_Em_Producao filtered by Empresa_Id
2. WHEN the Admin_View loads, THE Dashboard SHALL display the count of ordens de serviço with status `pronto` (ready for delivery) filtered by Empresa_Id
3. WHEN the Admin_View loads, THE Dashboard SHALL display the count of Processos_Ativos from `processos_instancia` where `data_conclusao` is null, filtered by Empresa_Id
4. IF any OS_Em_Producao has `prazo_estimado` earlier than or equal to today, THEN THE Dashboard SHALL display a visual warning indicating overdue production items

### Requirement 5: Feed de Atividade Recente

**User Story:** As an admin/gerente, I want to see recent business activity, so that I can stay informed about what happened without navigating to individual modules.

#### Acceptance Criteria

1. WHEN the Admin_View loads, THE Dashboard SHALL display the 10 most recent events from a combined list of: new orçamentos created, orçamentos approved, new ordens de serviço created, and contas a pagar created, ordered by creation date descending
2. WHEN the Admin_View loads, THE Dashboard SHALL display for each event: the event type icon, a brief description, the associated client name when available, and a relative timestamp (e.g., "há 2 horas")
3. WHEN the user clicks an activity item, THE Dashboard SHALL navigate to the corresponding detail page for that item

### Requirement 6: Alertas e Prazos

**User Story:** As an admin/gerente, I want to see upcoming deadlines and critical alerts, so that I can take proactive action before problems occur.

#### Acceptance Criteria

1. WHEN the Admin_View loads, THE Dashboard SHALL display a count of orçamentos with status `enviado` where `validade_dias` from `created_at` results in an expiry date within the next 7 days
2. WHEN the Admin_View loads, THE Dashboard SHALL display the count of Contas_Vencidas and highlight the total overdue monetary value
3. IF any alerts exist (overdue bills, expiring quotations, or overdue production), THEN THE Dashboard SHALL display an alerts section at the top of the page with a distinct visual treatment
4. IF no alerts exist, THEN THE Dashboard SHALL not render the alerts section

### Requirement 7: Layout Responsivo

**User Story:** As an admin/gerente, I want the dashboard to be usable on both desktop and mobile, so that I can check business health from any device.

#### Acceptance Criteria

1. THE Dashboard SHALL use a grid layout that displays 4 metric cards per row on desktop (xl breakpoint) and 2 cards per row on mobile
2. THE Dashboard SHALL stack the pipeline summary, production status, activity feed, and alerts sections vertically on mobile with full-width rendering
3. THE Dashboard SHALL apply consistent spacing and typography using TailwindCSS utility classes matching the existing design system (rounded-2xl cards, border-primary-10, shadow-sm)
4. THE Dashboard SHALL display a loading skeleton or spinner while data is being fetched

### Requirement 8: Remoção dos Atalhos

**User Story:** As an admin/gerente, I want the dashboard to focus on business overview data, so that I can get immediate value without navigating to other pages.

#### Acceptance Criteria

1. THE Dashboard SHALL not render the "Atalhos" shortcut grid section that currently exists in the admin view
2. THE Dashboard SHALL not render the "produtos_casa_racao" stock card or any salon-specific metrics that do not apply to the signage business context

### Requirement 9: Isolamento Multi-Tenant

**User Story:** As a platform operator, I want each tenant to see only their own data, so that business information remains private and secure.

#### Acceptance Criteria

1. THE Dashboard SHALL filter all Supabase queries by the authenticated user's `empresa_id` obtained from the `useEmpresa()` composable
2. IF `empresa_id` is null or undefined, THEN THE Dashboard SHALL not execute any data queries and SHALL display a loading state until `empresa_id` is resolved
3. THE Dashboard SHALL not expose data from other tenants under any query condition
