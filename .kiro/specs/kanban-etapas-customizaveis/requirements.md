# Requirements Document

## Introduction

Este documento define os requisitos para o sistema de Kanban com Etapas Customizáveis da aplicação CV PRO. A funcionalidade permite que usuários criem pipelines personalizados com etapas configuráveis para três contextos: CRM de Clientes, Produção de Ordens de Serviço e Orçamentos. O sistema substitui as colunas fixas de status do kanban atual por etapas dinâmicas que podem ser criadas, renomeadas, reordenadas e excluídas pelo usuário.

## Glossary

- **Pipeline**: Conjunto ordenado de etapas que representa um fluxo de trabalho (ex: funil de CRM ou fluxo de produção)
- **Etapa**: Uma fase dentro de um pipeline, com nome, cor e posição de ordenação
- **Etapa_Final**: Uma etapa marcada como conclusão do fluxo, que indica que o item está finalizado
- **Pipeline_CRM**: Pipeline dedicado ao gerenciamento de clientes no funil de vendas
- **Pipeline_Producao**: Pipeline dedicado ao fluxo de produção das Ordens de Serviço
- **Pipeline_Orcamentos**: Pipeline dedicado ao acompanhamento do ciclo de vida dos orçamentos (quotes/budgets)
- **Card_Kanban**: Representação visual de um item (cliente, OS ou orçamento) dentro de uma coluna do kanban
- **Gerenciador_Etapas**: Interface de configuração onde o usuário administra as etapas de um pipeline
- **Sistema_Kanban**: Módulo responsável pela visualização e interação com o quadro kanban
- **Servico_Etapas**: Camada de serviço que gerencia operações CRUD e validações das etapas no banco de dados
- **Motor_DragDrop**: Componente responsável por gerenciar as interações de arrastar e soltar (drag and drop)

## Requirements

### Requirement 1: Criação de Pipelines com Etapas Padrão

**User Story:** As a usuário da empresa, I want que etapas padrão sejam criadas automaticamente no primeiro acesso, so that eu tenha um ponto de partida funcional sem precisar configurar manualmente.

#### Acceptance Criteria

1. WHEN um usuário acessa o Pipeline_CRM pela primeira vez e nenhuma etapa existe para a empresa, THE Servico_Etapas SHALL criar as etapas padrão na ordem: "Lead", "Prospectando", "Orçamento Enviado", "Cliente Ativo", "Inativo"
2. WHEN um usuário acessa o Pipeline_Producao pela primeira vez e nenhuma etapa existe para a empresa, THE Servico_Etapas SHALL criar as etapas padrão na ordem: "Aguardando", "Impressão", "Corte", "Aplicação", "Pronto", "Entregue"
3. WHEN um usuário acessa o Pipeline_Orcamentos pela primeira vez e nenhuma etapa existe para a empresa, THE Servico_Etapas SHALL criar as etapas padrão na ordem: "Novo", "Em Análise", "Enviado", "Aprovado", "Reprovado"
4. THE Servico_Etapas SHALL associar cada etapa criada ao empresa_id do usuário logado
5. THE Servico_Etapas SHALL atribuir uma cor padrão distinta a cada etapa criada automaticamente
6. WHEN as etapas padrão do Pipeline_Producao são criadas, THE Servico_Etapas SHALL marcar a etapa "Entregue" como Etapa_Final
7. WHEN as etapas padrão do Pipeline_CRM são criadas, THE Servico_Etapas SHALL marcar a etapa "Inativo" como Etapa_Final
8. WHEN as etapas padrão do Pipeline_Orcamentos são criadas, THE Servico_Etapas SHALL marcar a etapa "Reprovado" como Etapa_Final

### Requirement 2: Gerenciamento de Etapas (CRUD)

**User Story:** As a administrador ou gerente, I want gerenciar as etapas dos pipelines, so that eu possa adaptar o fluxo de trabalho às necessidades específicas da minha empresa.

#### Acceptance Criteria

1. WHEN o usuário adiciona uma nova etapa informando nome e cor, THE Gerenciador_Etapas SHALL criar a etapa na última posição do pipeline selecionado
2. WHEN o usuário renomeia uma etapa existente, THE Gerenciador_Etapas SHALL atualizar o nome da etapa sem alterar a posição dos itens associados
3. WHEN o usuário reordena etapas via drag and drop, THE Gerenciador_Etapas SHALL atualizar a posição de ordenação de todas as etapas afetadas
4. WHEN o usuário tenta excluir uma etapa que não contém itens associados, THE Gerenciador_Etapas SHALL remover a etapa do pipeline
5. IF o usuário tenta excluir uma etapa que contém itens associados, THEN THE Gerenciador_Etapas SHALL exibir uma mensagem informando que a etapa não pode ser excluída enquanto houver itens nela
6. WHEN o usuário altera a cor de uma etapa, THE Gerenciador_Etapas SHALL atualizar a cor da etapa e refletir a mudança imediatamente no kanban
7. WHEN o usuário marca uma etapa como Etapa_Final, THE Gerenciador_Etapas SHALL desmarcar qualquer outra etapa que estivesse marcada como Etapa_Final no mesmo pipeline
8. THE Gerenciador_Etapas SHALL impedir que um pipeline tenha menos de duas etapas

### Requirement 3: Kanban de Clientes (CRM)

**User Story:** As a usuário da empresa, I want visualizar meus clientes organizados em um quadro kanban por etapa do funil, so that eu tenha uma visão clara do progresso de cada lead/cliente.

#### Acceptance Criteria

1. WHEN o usuário acessa a visualização kanban de clientes, THE Sistema_Kanban SHALL exibir uma coluna para cada etapa do Pipeline_CRM na ordem configurada
2. THE Sistema_Kanban SHALL exibir em cada Card_Kanban de cliente: nome, telefone e data da última interação
3. WHEN o usuário clica em um Card_Kanban de cliente, THE Sistema_Kanban SHALL abrir o modal de detalhes do cliente correspondente
4. THE Sistema_Kanban SHALL exibir o contador de itens em cada coluna do kanban
5. WHEN o usuário arrasta um Card_Kanban de cliente para outra coluna, THE Sistema_Kanban SHALL atualizar a etapa do cliente no banco de dados

### Requirement 4: Kanban de Ordens de Serviço com Etapas Customizáveis

**User Story:** As a usuário da empresa, I want que o kanban de OS use etapas customizáveis em vez de status fixos, so that eu possa adaptar o fluxo de produção ao processo real da minha empresa.

#### Acceptance Criteria

1. WHEN o usuário acessa a visualização kanban de OS, THE Sistema_Kanban SHALL exibir uma coluna para cada etapa do Pipeline_Producao na ordem configurada
2. WHEN o usuário arrasta um Card_Kanban de OS para outra coluna, THE Sistema_Kanban SHALL atualizar a etapa da OS no banco de dados
3. WHEN uma OS é movida para a Etapa_Final do Pipeline_Producao, THE Sistema_Kanban SHALL marcar a OS como concluída e registrar a data de conclusão
4. THE Sistema_Kanban SHALL exibir em cada Card_Kanban de OS: número da OS, nome do trabalho, nome do cliente, valor total e data de aprovação
5. WHEN o usuário clica em um Card_Kanban de OS, THE Sistema_Kanban SHALL abrir o modal de detalhes da OS

### Requirement 5: Kanban de Orçamentos

**User Story:** As a usuário da empresa, I want visualizar meus orçamentos organizados em um quadro kanban por etapa do ciclo, so that eu tenha uma visão clara do status de cada proposta enviada.

#### Acceptance Criteria

1. WHEN o usuário acessa a visualização kanban de orçamentos, THE Sistema_Kanban SHALL exibir uma coluna para cada etapa do Pipeline_Orcamentos na ordem configurada
2. THE Sistema_Kanban SHALL exibir em cada Card_Kanban de orçamento: número do orçamento, nome do cliente, valor total e data de criação
3. WHEN o usuário clica em um Card_Kanban de orçamento, THE Sistema_Kanban SHALL abrir o modal de detalhes do orçamento correspondente
4. THE Sistema_Kanban SHALL exibir o contador de itens em cada coluna do kanban de orçamentos
5. WHEN o usuário arrasta um Card_Kanban de orçamento para outra coluna, THE Sistema_Kanban SHALL atualizar a etapa do orçamento no banco de dados
6. WHEN um orçamento é movido para a Etapa_Final do Pipeline_Orcamentos, THE Sistema_Kanban SHALL marcar o orçamento como finalizado e registrar a data de conclusão

### Requirement 6: Drag and Drop com Suporte a Touch

**User Story:** As a usuário, I want arrastar cards entre colunas do kanban tanto no desktop quanto no mobile, so that eu possa atualizar o status dos itens de forma intuitiva em qualquer dispositivo.

#### Acceptance Criteria

1. WHEN o usuário inicia o arraste de um Card_Kanban no desktop, THE Motor_DragDrop SHALL exibir um elemento ghost (cópia visual semi-transparente) seguindo o cursor
2. WHEN o usuário arrasta um Card_Kanban sobre uma coluna de destino, THE Motor_DragDrop SHALL destacar visualmente a coluna para indicar que é uma zona de soltura válida
3. WHEN o usuário solta o Card_Kanban em uma coluna diferente da original, THE Motor_DragDrop SHALL mover o card para a nova coluna e persistir a mudança no banco de dados
4. WHEN o usuário realiza um toque longo (500ms) em um Card_Kanban em dispositivo touch, THE Motor_DragDrop SHALL iniciar o modo de arraste com feedback tátil (vibração)
5. WHILE o arraste está em andamento, THE Motor_DragDrop SHALL impedir o scroll da página para evitar conflito de gestos
6. IF a operação de persistência no banco falha após o soltar, THEN THE Motor_DragDrop SHALL reverter o card para a coluna original e exibir uma mensagem de erro
7. THE Motor_DragDrop SHALL utilizar a API nativa HTML5 Drag and Drop combinada com Touch Events, sem dependência de bibliotecas externas

### Requirement 7: Armazenamento e Estrutura de Dados

**User Story:** As a desenvolvedor, I want que as etapas e associações sejam armazenadas de forma estruturada no Supabase PostgreSQL, so that os dados sejam consistentes e performáticos.

#### Acceptance Criteria

1. THE Servico_Etapas SHALL armazenar cada etapa com os campos: id, empresa_id, pipeline_tipo (crm, producao ou orcamentos), nome, cor, posicao, is_final e timestamps (created_at, updated_at)
2. THE Servico_Etapas SHALL garantir que a combinação empresa_id + pipeline_tipo + nome seja única para evitar etapas duplicadas no mesmo pipeline
3. WHEN uma etapa é criada ou atualizada, THE Servico_Etapas SHALL registrar o timestamp correspondente
4. THE Servico_Etapas SHALL armazenar a associação cliente-etapa na tabela de clientes usando o campo etapa_id
5. THE Servico_Etapas SHALL armazenar a associação OS-etapa na tabela de ordens de serviço usando o campo etapa_id
6. THE Servico_Etapas SHALL armazenar a associação orçamento-etapa na tabela de orçamentos usando o campo etapa_id
7. THE Servico_Etapas SHALL utilizar Row Level Security (RLS) para garantir que cada empresa acesse somente suas próprias etapas

### Requirement 8: Integração Visual com o Sistema de Temas

**User Story:** As a usuário, I want que o kanban respeite o tema visual configurado na aplicação, so that a experiência seja consistente com o restante do sistema.

#### Acceptance Criteria

1. THE Sistema_Kanban SHALL utilizar CSS variables do tema ativo para cores de fundo, bordas e elementos de interface
2. THE Sistema_Kanban SHALL aplicar a cor configurada da etapa apenas no indicador da coluna (dot/badge), preservando o restante do layout conforme o tema
3. WHILE o tema escuro estiver ativo, THE Sistema_Kanban SHALL adaptar os cards e colunas para manter contraste adequado e legibilidade
