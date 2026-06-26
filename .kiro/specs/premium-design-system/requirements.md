# Requirements Document

## Introduction

Redesign completo do sistema visual do App CV PRO para transmitir profissionalismo e credibilidade adequados a grandes empresas de comunicação visual. O sistema já está funcional — esta especificação trata exclusivamente de melhorias visuais, tipográficas, de espaçamento e de consistência UX, preservando o sistema de temas dinâmicos via CSS custom properties já existente.

## Glossary

- **Design_System**: Conjunto de componentes reutilizáveis (AppButton, AppInput, AppHeader, AppSidebar, cards, modais) com tokens de design padronizados que compõem a interface do App CV PRO.
- **Token_De_Design**: Variável CSS ou classe Tailwind que define um valor atômico de estilo (cor, espaçamento, tipografia, sombra, raio de borda) reutilizável em toda a aplicação.
- **Proposta_Comercial**: Página pública de aprovação de orçamento (`/orcamento-aprovacao/[token]`) enviada ao cliente final para revisão e decisão.
- **Hierarquia_Visual**: Organização de elementos visuais em níveis de importância através de tamanho, peso, cor e espaçamento para guiar a leitura do usuário.
- **Breathing_Room**: Espaço negativo intencional entre elementos da interface que melhora legibilidade e percepção de qualidade.
- **Tema_Dinâmico**: Sistema existente de personalização via CSS custom properties (--color-primary, --color-card, --color-sidebar etc.) que permite cada empresa configurar suas cores.
- **Escala_Tipográfica**: Conjunto definido de tamanhos de fonte, pesos e alturas de linha para headings, body text, labels e captions.
- **Card**: Componente de superfície elevada que agrupa informações relacionadas (orçamentos, ordens de serviço, dados financeiros).
- **Modal**: Janela sobreposta que exige ação do usuário antes de retornar ao conteúdo principal.
- **Formulário**: Conjunto de campos de entrada (inputs, selects, textareas) para coleta de dados do usuário.

## Requirements

### Requirement 1: Escala Tipográfica Premium

**User Story:** Como proprietário de empresa de comunicação visual, eu quero que a tipografia do sistema transmita sofisticação e clareza, para que meus clientes percebam profissionalismo ao receberem propostas.

#### Acceptance Criteria

1. THE Design_System SHALL definir uma escala tipográfica com no mínimo 6 níveis distintos (Display, H1, H2, H3, Body, Caption) utilizando a fonte Inter com pesos 400, 500, 600 e 700.
2. THE Design_System SHALL aplicar letter-spacing negativo (-0.01em a -0.025em) em headings de nível Display, H1 e H2 para transmitir densidade profissional.
3. THE Design_System SHALL definir line-height de 1.2 a 1.3 para headings e 1.5 a 1.6 para body text.
4. THE Design_System SHALL utilizar font-weight 600 ou 700 exclusivamente para títulos e elementos de destaque, reservando 400 e 500 para body text e labels.
5. WHEN o Tema_Dinâmico estiver em modo escuro, THE Design_System SHALL reduzir o font-weight dos headings em um nível (700 para 600, 600 para 500) para manter legibilidade equivalente.

### Requirement 2: Sistema de Espaçamento e Breathing Room

**User Story:** Como usuário do sistema, eu quero espaçamento generoso e consistente entre elementos, para que a interface pareça organizada e fácil de navegar.

#### Acceptance Criteria

1. THE Design_System SHALL definir uma escala de espaçamento baseada em múltiplos de 4px (4, 8, 12, 16, 20, 24, 32, 40, 48, 64) para uso consistente em padding, margin e gap.
2. THE Design_System SHALL aplicar padding interno mínimo de 24px em Cards e 32px em Modais.
3. THE Design_System SHALL manter gap mínimo de 16px entre Cards adjacentes em layouts de lista e 20px em layouts de grid.
4. THE Design_System SHALL aplicar padding de página de 24px em mobile e 32px a 48px em desktop para todas as páginas internas do sistema.
5. THE Design_System SHALL manter distância mínima de 32px entre seções de conteúdo distintas dentro de uma mesma página.

### Requirement 3: Redesign de Botões para Temas Escuros e Claros

**User Story:** Como usuário, eu quero botões visualmente proporcionais e elegantes independente do tema configurado, para que a interface mantenha qualidade em qualquer configuração de cores.

#### Acceptance Criteria

1. THE Design_System SHALL definir tamanhos de botão com altura máxima de 40px para tamanho md e 44px para tamanho lg.
2. THE Design_System SHALL aplicar padding horizontal proporcional (12px para sm, 16px para md, 20px para lg) que evite botões visualmente largos demais.
3. WHEN o Tema_Dinâmico estiver em modo escuro, THE Design_System SHALL utilizar bordas de 1px com opacidade entre 10% e 20% da cor primária nos botões de variante secondary e outline.
4. WHEN o Tema_Dinâmico estiver em modo escuro, THE Design_System SHALL reduzir o border-radius dos botões para 8px (rounded-lg) em vez de 12px (rounded-xl).
5. THE Design_System SHALL aplicar font-size de 13px para botões sm, 14px para md e 15px para lg com font-weight 500.
6. THE Design_System SHALL utilizar transições de 150ms em hover e active states com transformações sutis (scale 0.98 no active).

### Requirement 4: Hierarquia Visual de Cards e Superfícies

**User Story:** Como gerente, eu quero distinguir visualmente a importância relativa de diferentes informações exibidas em cards, para que eu identifique rapidamente dados críticos.

#### Acceptance Criteria

1. THE Design_System SHALL definir 3 níveis de elevação para Cards: flat (sem sombra, apenas borda), raised (shadow-card) e elevated (shadow-panel).
2. THE Design_System SHALL aplicar border de 1px com cor `var(--color-primary-border)` em todos os Cards para definição clara de limites.
3. THE Design_System SHALL reduzir o border-radius de Cards de rounded-2xl (16px) para rounded-xl (12px) para transmitir formalidade.
4. THE Design_System SHALL definir um header de Card com padding-bottom de 16px, border-bottom de 1px e tipografia H3 (font-size 16px, weight 600).
5. WHEN um Card contiver dados numéricos ou financeiros, THE Design_System SHALL exibir o valor principal com font-size mínimo de 24px e weight 700 para destaque.
6. THE Design_System SHALL manter contraste mínimo de 4.5:1 entre texto de Card e cor de fundo do Card conforme WCAG 2.1 AA.

### Requirement 5: Proposta Comercial com Visual Formal/Fiscal

**User Story:** Como proprietário de empresa, eu quero que a proposta comercial enviada ao cliente pareça um documento fiscal profissional, para que transmita credibilidade e facilite a aprovação.

#### Acceptance Criteria

1. THE Proposta_Comercial SHALL utilizar layout com largura máxima de 800px centralizado e fundo branco com borda de 1px em cinza claro (#e5e7eb).
2. THE Proposta_Comercial SHALL exibir um cabeçalho com logo da empresa à esquerda, dados da empresa (nome, CNPJ, endereço, telefone) à direita, separados por linha horizontal de 1px.
3. THE Proposta_Comercial SHALL exibir informações do cliente (nome, CNPJ/CPF, endereço) em bloco distinto abaixo do cabeçalho com label "DESTINATÁRIO" em caixa alta, font-size 11px, weight 600, cor cinza.
4. THE Proposta_Comercial SHALL apresentar itens do orçamento em tabela com colunas (Item, Descrição, Qtd, Valor Unit., Total) com header em fundo cinza claro e linhas alternadas com fundo sutil.
5. THE Proposta_Comercial SHALL exibir o resumo de valores (subtotal, desconto, total) alinhado à direita em bloco separado com o total em font-size 20px e weight 700.
6. THE Proposta_Comercial SHALL exibir informações de validade e condições de pagamento em seção de rodapé com tipografia Caption (font-size 12px, cor cinza 500).
7. THE Proposta_Comercial SHALL manter os botões de ação (Aprovar/Rejeitar) fixos na parte inferior da viewport em telas mobile com fundo branco e sombra superior.
8. WHEN o cliente aprovar ou rejeitar a proposta, THE Proposta_Comercial SHALL exibir feedback visual imediato com animação de check ou X com duração de 400ms.

### Requirement 6: Formulários com UX Premium

**User Story:** Como operador do sistema, eu quero formulários claros e confortáveis de preencher, para que eu cometa menos erros e trabalhe com mais agilidade.

#### Acceptance Criteria

1. THE Design_System SHALL definir altura de input de 40px para tamanho md e 44px para lg com padding horizontal de 14px.
2. THE Design_System SHALL aplicar border-radius de 8px (rounded-lg) em inputs, selects e textareas.
3. THE Design_System SHALL exibir labels acima dos campos com font-size 13px, weight 500 e margin-bottom de 6px.
4. WHEN um campo de Formulário receber foco, THE Design_System SHALL exibir ring de 2px na cor primária com offset de 2px e transição de 150ms.
5. WHEN um campo de Formulário contiver erro de validação, THE Design_System SHALL exibir borda vermelha (error), mensagem de erro abaixo do campo em font-size 12px cor error e ícone de alerta inline.
6. THE Design_System SHALL agrupar campos relacionados em fieldsets visuais com gap de 16px entre campos e 24px entre grupos.
7. THE Design_System SHALL posicionar botões de ação do formulário à direita do container com gap de 12px entre botão secundário e primário.

### Requirement 7: Modais com Hierarquia e Proporção

**User Story:** Como usuário, eu quero modais bem proporcionados com estrutura clara, para que eu entenda rapidamente o que preciso fazer e não me sinta sobrecarregado.

#### Acceptance Criteria

1. THE Design_System SHALL definir larguras de Modal em 3 tamanhos: sm (400px), md (540px) e lg (680px).
2. THE Design_System SHALL estruturar Modais com header (título + botão fechar), body (conteúdo scrollável) e footer (botões de ação) como seções distintas com separadores visuais de 1px.
3. THE Design_System SHALL aplicar padding de 24px no header e footer e 24px horizontal + 20px vertical no body.
4. THE Design_System SHALL exibir overlay com backdrop-filter blur de 4px e fundo preto com opacidade 40%.
5. THE Design_System SHALL animar a entrada do Modal com translate-y de 8px e opacity de 0 para valores finais com duração de 200ms e easing ease-out.
6. WHEN o conteúdo do body do Modal exceder a altura disponível, THE Design_System SHALL exibir scroll interno no body mantendo header e footer fixos.

### Requirement 8: Consistência Visual entre Páginas

**User Story:** Como usuário, eu quero que todas as páginas do sistema sigam o mesmo padrão visual, para que eu não sinta que estou usando ferramentas diferentes a cada navegação.

#### Acceptance Criteria

1. THE Design_System SHALL definir um template de página padrão com: título (H1, weight 700), subtítulo opcional (Body, cor muted) e área de ações (botões) alinhada à direita no mesmo nível do título.
2. THE Design_System SHALL manter espaçamento de 24px entre o header da página e o conteúdo principal em todas as páginas.
3. THE Design_System SHALL utilizar o mesmo padrão de tabela (header sticky, linhas com hover state, ações na última coluna) em todas as páginas com listagem tabular.
4. THE Design_System SHALL aplicar skeleton loading com animação shimmer durante carregamento de dados em todas as páginas que fazem fetch de dados.
5. THE Design_System SHALL utilizar empty states com ilustração/ícone, título e descrição centralizados quando uma listagem não contiver dados.
6. WHILE uma operação assíncrona estiver em andamento, THE Design_System SHALL exibir indicador de loading no botão que disparou a ação sem bloquear o resto da interface.

### Requirement 9: Sidebar e Navegação Refinada

**User Story:** Como usuário, eu quero uma navegação lateral sofisticada e funcional, para que eu me movimente pelo sistema com facilidade e o visual reforce a qualidade do produto.

#### Acceptance Criteria

1. THE Design_System SHALL reduzir a opacidade de itens inativos na sidebar para 0.6 e aplicar opacidade 1.0 com fundo sutil no item ativo.
2. THE Design_System SHALL aplicar transição de largura da sidebar com duração de 250ms e cubic-bezier(0.4, 0, 0.2, 1).
3. THE Design_System SHALL utilizar ícones com stroke-width de 1.5px e tamanho de 20px na sidebar para consistência visual.
4. THE Design_System SHALL exibir tooltip com nome da página ao fazer hover em ícones quando a sidebar estiver colapsada com delay de 300ms.
5. THE Design_System SHALL separar grupos de navegação com espaçamento de 20px e labels de seção em uppercase com font-size 10px, weight 700 e opacidade 0.4.

### Requirement 10: Tabelas e Listagens Profissionais

**User Story:** Como gerente, eu quero visualizar listagens de dados em tabelas limpas e escaneáveis, para que eu encontre informações rapidamente sem esforço visual.

#### Acceptance Criteria

1. THE Design_System SHALL definir células de tabela com padding vertical de 12px e horizontal de 16px com font-size 13px para dados e 12px para headers.
2. THE Design_System SHALL aplicar header de tabela com fundo sutil (primary-5), font-weight 600, text-transform uppercase, letter-spacing 0.05em e font-size 11px.
3. THE Design_System SHALL aplicar hover state em linhas de tabela com fundo primary-5 e transição de 100ms.
4. THE Design_System SHALL definir largura mínima por coluna para evitar quebra de layout em telas menores, com scroll horizontal quando necessário.
5. WHEN uma tabela contiver mais de 10 linhas, THE Design_System SHALL manter o header fixo (sticky) durante scroll vertical.
6. THE Design_System SHALL alinhar valores numéricos e monetários à direita nas colunas correspondentes com font-variant-numeric tabular-nums.
