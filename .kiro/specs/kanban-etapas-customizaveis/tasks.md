# Implementation Plan: Kanban com Etapas Customizáveis

## Overview

Implementação do sistema de Kanban com Etapas Customizáveis para a aplicação CV PRO (Nuxt.js + Supabase). O plano segue uma abordagem incremental: primeiro a estrutura de dados (migração SQL), depois os composables de lógica de negócio, os componentes visuais e por fim a integração com drag and drop. O sistema suporta três pipelines: CRM de Clientes, Produção de Ordens de Serviço e Orçamentos.

## Tasks

- [x] 1. Configurar estrutura de dados no Supabase
  - [x] 1.1 Criar migração SQL para a tabela `pipeline_etapas`
    - Criar tabela com campos: id, empresa_id, pipeline_tipo, nome, cor, posicao, is_final, created_at, updated_at
    - Adicionar constraint CHECK para pipeline_tipo IN ('crm', 'producao', 'orcamentos')
    - Adicionar constraint UNIQUE (empresa_id, pipeline_tipo, nome)
    - Criar índice idx_pipeline_etapas_empresa_tipo em (empresa_id, pipeline_tipo, posicao)
    - Criar trigger para atualização automática de updated_at
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 1.2 Criar migração SQL para adicionar etapa_id nas tabelas existentes
    - Adicionar coluna etapa_id (BIGINT, nullable, FK para pipeline_etapas) na tabela `clientes`
    - Adicionar coluna etapa_id (BIGINT, nullable, FK para pipeline_etapas) na tabela `ordens_servico_adesivo`
    - Adicionar coluna etapa_id (BIGINT, nullable, FK para pipeline_etapas) na tabela `orcamentos`
    - Criar índices idx_clientes_etapa, idx_os_etapa e idx_orcamentos_etapa
    - Configurar ON DELETE SET NULL nas foreign keys
    - _Requirements: 7.4, 7.5, 7.6_

  - [x] 1.3 Configurar Row Level Security para `pipeline_etapas`
    - Habilitar RLS na tabela pipeline_etapas
    - Criar policy "Empresa acessa suas etapas" para ALL operations
    - Usar subquery em profiles para resolver empresa_id a partir de auth.uid()
    - _Requirements: 7.7_

- [x] 2. Implementar composable `useEtapas`
  - [x] 2.1 Criar composable `useEtapas` com tipos e interfaces base
    - Criar arquivo `app/composables/useEtapas.ts`
    - Definir tipos: PipelineTipo ('crm' | 'producao' | 'orcamentos'), Etapa, CriarEtapaInput, AtualizarEtapaInput
    - Implementar função `gerarEtapasPadrao` com dados de seed para CRM, Produção e Orçamentos
    - Seed Orçamentos: "Novo" (amber), "Em Análise" (blue), "Enviado" (purple), "Aprovado" (green), "Reprovado" (red, is_final=true)
    - Implementar função `validarEtapa` com validações de nome (obrigatório, max 50 chars) e cor (formato hex)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8_

  - [ ]* 2.2 Escrever property tests para `gerarEtapasPadrao`
    - **Property 1: Cores únicas nas etapas padrão**
    - **Validates: Requirements 1.4**

  - [x] 2.3 Implementar operações CRUD no `useEtapas`
    - Implementar `carregarEtapas` com detecção de primeiro acesso e seed automático
    - Implementar `criarEtapa` posicionando na última posição (max posição + 1)
    - Implementar `atualizarEtapa` para nome, cor e is_final
    - Implementar `excluirEtapa` com validação de itens associados e mínimo 2 etapas
    - Implementar `reordenarEtapas` atribuindo posições sequenciais 0..N-1
    - Implementar `etapaTemItens` verificando FK nas tabelas clientes, ordens_servico_adesivo e orcamentos
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_

  - [ ]* 2.4 Escrever property tests para lógica de posicionamento e reordenação
    - **Property 2: Nova etapa posicionada após a última**
    - **Property 3: Reordenação produz posições sequenciais**
    - **Validates: Requirements 2.1, 2.3**

  - [ ]* 2.5 Escrever property tests para regras de is_final e mínimo de etapas
    - **Property 4: Exatamente uma Etapa_Final por pipeline**
    - **Property 5: Mínimo de duas etapas por pipeline**
    - **Validates: Requirements 2.7, 2.8**

  - [ ]* 2.6 Escrever property test para unicidade de nome
    - **Property 9: Unicidade de nome por empresa e pipeline**
    - **Validates: Requirements 7.2**

- [x] 3. Implementar composable `useKanban`
  - [x] 3.1 Criar composable `useKanban` com estado reativo
    - Criar arquivo `app/composables/useKanban.ts`
    - Definir interfaces KanbanCard e KanbanState
    - Implementar `inicializar` que carrega etapas + cards do pipeline (crm, producao ou orcamentos)
    - Para pipeline 'orcamentos': carregar dados da tabela `orcamentos` com campos: número, cliente, valor_total, data de criação
    - Implementar `cardsPorEtapa` como computed que filtra cards por etapa_id
    - Implementar `contagemPorEtapa` como computed de contagem
    - _Requirements: 3.1, 3.4, 4.1, 5.1, 5.4_

  - [x] 3.2 Implementar lógica de movimentação de cards
    - Implementar `moverCard` com atualização otimista e persistência no Supabase
    - Para Pipeline_Producao: ao mover para Etapa_Final, registrar data_conclusao e marcar como concluída
    - Para Pipeline_Orcamentos: ao mover para Etapa_Final, registrar data_conclusao e marcar como finalizado
    - Para ambos: ao mover de Etapa_Final para não-final, limpar data_conclusao
    - Implementar rollback em caso de falha na persistência
    - _Requirements: 3.5, 4.2, 4.3, 5.5, 5.6, 6.6_

  - [ ]* 3.3 Escrever property tests para movimentação e conclusão
    - **Property 7: Mover para Etapa_Final registra conclusão**
    - **Property 8: Rollback restaura estado original em caso de falha**
    - **Validates: Requirements 4.3, 5.6**

- [x] 4. Checkpoint - Garantir que composables estão funcionais
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implementar composable `useDragDrop`
  - [x] 5.1 Criar composable `useDragDrop` com suporte a desktop
    - Criar arquivo `app/composables/useDragDrop.ts`
    - Definir interfaces DragState e DragDropOptions
    - Implementar handlers `onDragStart`, `onDragOver`, `onDragLeave`, `onDrop`
    - Gerenciar estado reativo do drag (cardId, sourceEtapaId, currentOverEtapaId)
    - Criar elemento ghost semi-transparente durante arraste
    - _Requirements: 6.1, 6.2, 6.3_

  - [x] 5.2 Adicionar suporte a touch (mobile) no `useDragDrop`
    - Implementar `onTouchStart` com detecção de toque longo (500ms) e vibração
    - Implementar `onTouchMove` para mover elemento ghost com o dedo
    - Implementar `onTouchEnd` para detectar coluna de destino e finalizar
    - Bloquear scroll da página durante arraste ativo
    - Implementar `cancelDrag` para limpeza de estado
    - _Requirements: 6.4, 6.5, 6.7_

  - [ ]* 5.3 Escrever unit tests para `useDragDrop`
    - Testar transições de estado do drag (idle → dragging → dropped)
    - Testar cancelamento e rollback de estado
    - Testar detecção de coluna de destino
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.6_

- [x] 6. Implementar componentes visuais do Kanban
  - [x] 6.1 Criar componentes de cards do Kanban
    - Criar `app/components/kanban/KanbanCard.vue` como template base
    - Criar `app/components/kanban/KanbanCardCliente.vue` exibindo: nome, telefone, data última interação
    - Criar `app/components/kanban/KanbanCardOS.vue` exibindo: número OS, nome trabalho, cliente, valor total, data aprovação
    - Criar `app/components/kanban/KanbanCardOrcamento.vue` exibindo: número do orçamento, nome do cliente, valor total, data de criação
    - Aplicar estilos usando CSS variables do tema ativo
    - Emitir evento de clique para abrir modal de detalhes
    - _Requirements: 3.2, 3.3, 4.4, 4.5, 5.2, 5.3, 8.1_

  - [x] 6.2 Criar componente `KanbanColumn.vue`
    - Criar `app/components/kanban/KanbanColumn.vue`
    - Exibir header com nome da etapa, dot colorido (usando cor da etapa) e contador de itens
    - Renderizar lista de cards com slot para tipo específico (cliente, OS ou orçamento)
    - Aplicar highlight visual quando coluna é alvo de drop
    - Integrar com eventos de drag/drop do composable
    - _Requirements: 3.1, 3.4, 4.1, 5.1, 5.4, 6.2, 8.2_

  - [x] 6.3 Criar componente `KanbanBoard.vue`
    - Criar `app/components/kanban/KanbanBoard.vue`
    - Container horizontal scrollável com colunas
    - Integrar com `useKanban` e `useDragDrop`
    - Gerenciar inicialização e loading state
    - Layout responsivo (scroll horizontal no mobile)
    - _Requirements: 3.1, 4.1, 5.1, 8.1, 8.3_

- [x] 7. Implementar páginas de Kanban (CRM, Produção e Orçamentos)
  - [x] 7.1 Criar página `kanban-crm.vue`
    - Criar `app/pages/kanban-crm.vue`
    - Utilizar `KanbanBoard` com pipelineTipo='crm'
    - Carregar clientes com etapa_id e montar KanbanCards de cliente
    - Implementar abertura de modal de detalhes do cliente ao clicar no card
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 7.2 Criar página `kanban-producao.vue`
    - Criar `app/pages/kanban-producao.vue`
    - Utilizar `KanbanBoard` com pipelineTipo='producao'
    - Carregar OS com etapa_id e montar KanbanCards de OS
    - Implementar abertura de modal de detalhes da OS ao clicar no card
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 7.3 Criar página `kanban-orcamentos.vue`
    - Criar `app/pages/kanban-orcamentos.vue`
    - Utilizar `KanbanBoard` com pipelineTipo='orcamentos'
    - Carregar orçamentos com etapa_id e montar KanbanCardOrcamento
    - Exibir número do orçamento, nome do cliente, valor total e data de criação em cada card
    - Implementar abertura de modal de detalhes do orçamento ao clicar no card
    - Exibir contador de itens em cada coluna
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [x] 8. Implementar Gerenciador de Etapas
  - [x] 8.1 Criar componente `EtapasManager.vue`
    - Criar `app/components/kanban/EtapasManager.vue`
    - Formulário para adicionar nova etapa (nome + seletor de cor)
    - Lista de etapas com opções: renomear, alterar cor, marcar como final, excluir
    - Suporte a drag and drop para reordenar etapas
    - Exibir validações e mensagens de erro inline
    - Bloquear exclusão quando etapa tem itens (exibir mensagem informativa)
    - Bloquear exclusão quando pipeline tem apenas 2 etapas
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_

  - [x] 8.2 Criar página `kanban-config.vue`
    - Criar `app/pages/kanban-config.vue`
    - Tabs para alternar entre Pipeline CRM, Pipeline Produção e Pipeline Orçamentos
    - Integrar com `EtapasManager` passando o pipeline_tipo selecionado
    - Exibir preview visual das etapas na ordem configurada
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_

- [x] 9. Checkpoint - Garantir integração completa
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Integração com tema e ajustes finais
  - [x] 10.1 Aplicar integração visual com sistema de temas
    - Usar CSS variables do tema ativo em todos os componentes kanban
    - Aplicar cor da etapa apenas no dot/badge do header da coluna
    - Garantir contraste adequado no tema escuro para cards e colunas
    - Testar visualmente em tema claro e escuro
    - _Requirements: 8.1, 8.2, 8.3_

  - [x] 10.2 Conectar navegação e wiring final
    - Adicionar links de navegação para as novas páginas (kanban-crm, kanban-producao, kanban-orcamentos, kanban-config)
    - Garantir que modais de detalhes (cliente, OS e orçamento) são abertos corretamente ao clicar nos cards
    - Verificar que todas as operações CRUD refletem em tempo real no kanban
    - _Requirements: 3.3, 4.5, 5.3_

- [x] 11. Final checkpoint - Garantir que tudo funciona end-to-end
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marcadas com `*` são opcionais e podem ser puladas para um MVP mais rápido
- Cada task referencia requisitos específicos para rastreabilidade
- Checkpoints garantem validação incremental
- Property tests validam propriedades universais de corretude usando `fast-check`
- Unit tests validam exemplos específicos e edge cases
- O projeto usa Nuxt.js (Vue 3) + Supabase + TypeScript
- As migrações SQL devem ser aplicadas manualmente no Supabase Dashboard ou via CLI
- O pipeline 'orcamentos' segue o mesmo padrão de 'crm' e 'producao' — mesma lógica de seed, movimentação e conclusão via Etapa_Final

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3"] },
    { "id": 1, "tasks": ["2.1"] },
    { "id": 2, "tasks": ["2.2", "2.3"] },
    { "id": 3, "tasks": ["2.4", "2.5", "2.6", "3.1"] },
    { "id": 4, "tasks": ["3.2", "5.1"] },
    { "id": 5, "tasks": ["3.3", "5.2"] },
    { "id": 6, "tasks": ["5.3", "6.1"] },
    { "id": 7, "tasks": ["6.2"] },
    { "id": 8, "tasks": ["6.3"] },
    { "id": 9, "tasks": ["7.1", "7.2", "7.3", "8.1"] },
    { "id": 10, "tasks": ["8.2"] },
    { "id": 11, "tasks": ["10.1", "10.2"] }
  ]
}
```
