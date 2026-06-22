# Requirements Document

## Introduction

O catálogo de produtos de adesivos atualmente suporta apenas um único material por produto, com dimensões fixas (largura e altura) e preço de venda estático. Esta feature evolui o catálogo para suportar múltiplas matérias-primas por produto, cada uma com fórmulas de consumo customizáveis que calculam o custo baseado em variáveis de medida fornecidas no momento do orçamento. O custo é sempre dinâmico, baseado no preço atual dos materiais, e a composição detalhada (cada material, fórmula e custo parcial) é exibida ao operador.

## Glossary

- **Sistema_Catalogo**: Módulo de gerenciamento do catálogo de produtos de adesivos dentro da aplicação
- **Produto_Catalogo**: Item do catálogo de adesivos que pode ser composto por uma ou mais matérias-primas
- **Material**: Matéria-prima cadastrada na tabela materiais_adesivo, com preço por metro quadrado (preco_m2)
- **Composicao_Material**: Associação entre um Produto_Catalogo e um Material, contendo a fórmula de consumo
- **Formula_Consumo**: Expressão matemática customizável que define quanto de um Material é consumido para produzir um Produto_Catalogo, podendo referenciar variáveis de medida
- **Variavel_Medida**: Parâmetro dimensional (ex: largura, altura, comprimento) cujo valor é informado no momento do orçamento para calcular o consumo real de material
- **Custo_Composicao**: Valor monetário resultante da avaliação da Formula_Consumo multiplicada pelo preço atual do Material
- **Custo_Total**: Soma de todos os valores de Custo_Composicao de um Produto_Catalogo
- **Operador**: Usuário autenticado do sistema com permissão para gerenciar o catálogo e orçamentos
- **Orcamento**: Documento gerado com dimensões reais do cliente, onde as fórmulas são avaliadas para calcular custos efetivos

## Requirements

### Requirement 1: Composição Multi-Material do Produto

**User Story:** Como Operador, quero associar múltiplas matérias-primas a um produto do catálogo, para que a composição real do produto seja representada fielmente.

#### Acceptance Criteria

1. WHEN o Operador cadastrar ou editar um Produto_Catalogo, THE Sistema_Catalogo SHALL permitir a adição de uma ou mais Composicao_Material, cada uma vinculando um Material ativo da mesma empresa ao Produto_Catalogo
2. THE Sistema_Catalogo SHALL armazenar cada Composicao_Material com referência ao Produto_Catalogo, ao Material selecionado e à Formula_Consumo definida pelo Operador
3. WHEN o Operador adicionar uma Composicao_Material, THE Sistema_Catalogo SHALL exigir a seleção de um Material e o preenchimento da Formula_Consumo antes de permitir a gravação
4. THE Sistema_Catalogo SHALL permitir ao Operador remover uma Composicao_Material existente de um Produto_Catalogo
5. THE Sistema_Catalogo SHALL impedir a gravação de um Produto_Catalogo que possua zero Composicao_Material associadas
6. THE Sistema_Catalogo SHALL isolar os dados de Composicao_Material por empresa_id, garantindo que cada empresa visualize apenas seus próprios registros

### Requirement 2: Fórmulas de Consumo Customizáveis

**User Story:** Como Operador, quero definir fórmulas livres de consumo para cada material de um produto, para que eu possa representar cálculos fracionados e complexos de forma flexível.

#### Acceptance Criteria

1. THE Sistema_Catalogo SHALL aceitar Formula_Consumo como expressão textual contendo operadores aritméticos (soma, subtração, multiplicação, divisão), parênteses, números decimais e nomes de Variavel_Medida
2. WHEN o Operador informar uma Formula_Consumo, THE Sistema_Catalogo SHALL validar a sintaxe da expressão antes de permitir a gravação, rejeitando fórmulas com erros de sintaxe
3. THE Sistema_Catalogo SHALL reconhecer como Variavel_Medida válidas os nomes definidos pelo contexto do produto (ex: largura, altura, comprimento, quantidade)
4. IF a Formula_Consumo contiver uma Variavel_Medida não reconhecida, THEN THE Sistema_Catalogo SHALL exibir mensagem de erro indicando a variável inválida
5. THE Sistema_Catalogo SHALL permitir fórmulas com constantes numéricas (ex: largura * altura * 1.1 + 0.5)
6. WHEN o Operador editar uma Formula_Consumo existente, THE Sistema_Catalogo SHALL preservar a fórmula anterior até que a nova expressão seja validada e confirmada

### Requirement 3: Cálculo Dinâmico de Custo

**User Story:** Como Operador, quero que o custo do produto seja calculado dinamicamente com base no preço atual dos materiais, para que os orçamentos reflitam sempre os custos reais.

#### Acceptance Criteria

1. WHEN o Sistema_Catalogo calcular o Custo_Composicao de um Material, THE Sistema_Catalogo SHALL utilizar o preco_m2 atual do Material no momento do cálculo
2. WHEN variáveis de medida forem fornecidas no contexto de orçamento, THE Sistema_Catalogo SHALL avaliar cada Formula_Consumo substituindo as Variavel_Medida pelos valores reais informados
3. THE Sistema_Catalogo SHALL calcular o Custo_Composicao de cada Material como o resultado da Formula_Consumo avaliada multiplicado pelo preco_m2 atual do Material
4. THE Sistema_Catalogo SHALL calcular o Custo_Total do Produto_Catalogo como a soma de todos os valores de Custo_Composicao dos materiais associados
5. IF a avaliação de uma Formula_Consumo resultar em erro (divisão por zero, valor negativo), THEN THE Sistema_Catalogo SHALL sinalizar o erro e impedir o uso do resultado no Custo_Total
6. WHEN o preco_m2 de um Material for atualizado na tabela materiais_adesivo, THE Sistema_Catalogo SHALL refletir o novo preço em qualquer cálculo subsequente de Custo_Composicao sem necessidade de ação do Operador

### Requirement 4: Exibição Detalhada da Composição de Custo

**User Story:** Como Operador, quero visualizar o detalhamento completo da composição de custo de um produto, para entender a contribuição de cada material no custo final.

#### Acceptance Criteria

1. WHEN o Operador visualizar o custo de um Produto_Catalogo, THE Sistema_Catalogo SHALL exibir uma lista com cada Composicao_Material contendo: nome do Material, Formula_Consumo, resultado numérico da fórmula avaliada, preco_m2 atual do Material e Custo_Composicao resultante
2. THE Sistema_Catalogo SHALL exibir o Custo_Total do Produto_Catalogo como a soma dos valores de Custo_Composicao de todos os materiais listados
3. WHEN variáveis de medida ainda não tiverem sido informadas (contexto de catálogo sem orçamento), THE Sistema_Catalogo SHALL exibir a Formula_Consumo em formato textual sem valores calculados, indicando que as variáveis serão preenchidas no orçamento
4. WHEN variáveis de medida forem informadas (contexto de orçamento), THE Sistema_Catalogo SHALL exibir os valores calculados para cada linha da composição

### Requirement 5: Variáveis de Medida no Orçamento

**User Story:** Como Operador, quero informar as dimensões reais do produto no momento do orçamento, para que as fórmulas genéricas do catálogo calculem o custo efetivo da peça.

#### Acceptance Criteria

1. WHEN o Operador selecionar um Produto_Catalogo para um orçamento, THE Sistema_Catalogo SHALL apresentar campos para preenchimento de cada Variavel_Medida referenciada nas fórmulas do produto
2. THE Sistema_Catalogo SHALL aceitar valores numéricos positivos com até uma casa decimal para cada Variavel_Medida
3. WHEN o Operador preencher todas as Variavel_Medida, THE Sistema_Catalogo SHALL calcular e exibir imediatamente o Custo_Total atualizado e a composição detalhada
4. IF o Operador deixar uma Variavel_Medida sem valor, THEN THE Sistema_Catalogo SHALL impedir a finalização do orçamento e indicar qual variável está pendente
5. THE Sistema_Catalogo SHALL armazenar os valores das Variavel_Medida informados no orçamento junto ao item do pedido para consulta futura

### Requirement 6: Migração e Compatibilidade

**User Story:** Como Operador, quero que os produtos existentes com material único continuem funcionando após a migração, para que não haja perda de dados nem interrupção do serviço.

#### Acceptance Criteria

1. WHEN a migração de dados for executada, THE Sistema_Catalogo SHALL criar automaticamente uma Composicao_Material para cada Produto_Catalogo existente, utilizando o material_id atual e uma Formula_Consumo padrão de "largura * altura" (representando área em cm²)
2. THE Sistema_Catalogo SHALL manter a integridade referencial da tabela catalogo_adesivos com a nova estrutura de Composicao_Material
3. WHEN a migração for concluída, THE Sistema_Catalogo SHALL remover a coluna material_id da tabela catalogo_adesivos, eliminando a associação direta com material único
4. THE Sistema_Catalogo SHALL manter as colunas largura_cm e altura_cm na tabela catalogo_adesivos como dimensões padrão do produto para exibição no catálogo
5. IF a migração encontrar um Produto_Catalogo com material_id referenciando um Material inativo, THEN THE Sistema_Catalogo SHALL criar a Composicao_Material normalmente preservando a referência ao Material
