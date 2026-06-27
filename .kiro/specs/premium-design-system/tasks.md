# Implementation Plan: Premium Design System

## Overview

Redesign completo do sistema visual do App CV PRO, implementado em camadas: tokens de design (Tailwind config + CSS), componentes base (AppButton, AppCard, AppInput, AppModal, AppTable), template de página, refinamentos de sidebar, e redesign da proposta comercial. A implementação segue a ordem tokens → componentes → páginas para garantir consistência e minimizar retrabalho.

## Tasks

- [x] 1. Design Tokens e Fundação Visual
  - [x] 1.1 Atualizar tailwind.config.ts com novos tokens de tipografia, sombras e border-radius
    - Adicionar escala tipográfica completa (display, h1, h2, h3, body, caption) com Inter, pesos e letter-spacing
    - Adicionar boxShadow customizados (card, card-hover, panel, modal, header)
    - Adicionar borderRadius customizados (badge, input, btn, btn-lg, card, panel, modal, header)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 4.1, 4.3_

  - [x] 1.2 Atualizar main.css com utility classes base e variáveis CSS
    - Adicionar classes utilitárias para a escala tipográfica (.text-display, .text-h1, etc.) caso Tailwind não as resolva diretamente
    - Adicionar animações de shimmer para skeleton loading
    - Garantir fallback de fonte Inter → ui-sans-serif, system-ui, sans-serif
    - Adicionar regra para tema escuro que reduz font-weight em headings (700→600, 600→500)
    - _Requirements: 1.1, 1.5, 2.1, 8.4_

- [x] 2. Checkpoint - Tokens de design configurados
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Componentes Base - Botões e Inputs
  - [x] 3.1 Refatorar AppButton.vue com novos tamanhos, border-radius e variantes
    - Aplicar alturas fixas: xs, sm (h-8), md (h-10), lg (h-11)
    - Padding horizontal: sm (px-3), md (px-4), lg (px-5)
    - Font-size: sm (13px), md (13px ou 14px), lg (15px) com font-weight 500
    - Border-radius: rounded-lg (8px) em vez de rounded-xl
    - Transição: transition-all duration-150 com active:scale-[0.98]
    - Variantes em tema escuro: secondary com border border-primary-10 bg-primary-5, outline com border border-primary-20
    - Loading state com spinner integrado
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 8.6_

  - [x] 3.2 Criar/Refatorar AppInput.vue com novo design
    - Props: modelValue, label, placeholder, error, size (md/lg), type, disabled
    - Altura: h-10 (md), h-11 (lg) com px-3.5
    - Border-radius: rounded-lg (8px)
    - Label: text-[13px] font-medium mb-1.5 acima do campo
    - Focus state: ring-2 ring-primary ring-offset-2 transition-all duration-150
    - Error state: border-error + mensagem text-xs text-error mt-1.5 com ícone inline
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ]* 3.3 Escrever unit tests para AppButton e AppInput
    - Testar todas as variantes e tamanhos de AppButton renderizam corretamente
    - Testar loading state mostra spinner e desabilita clique
    - Testar AppInput exibe label, placeholder, mensagem de erro
    - Testar focus e blur states
    - _Requirements: 3.1, 3.5, 6.4, 6.5_

- [x] 4. Componentes Base - Cards e Modais
  - [x] 4.1 Criar AppCard.vue com 3 níveis de elevação
    - Props: elevation (flat/raised/elevated), padding (none/sm/md/lg)
    - Slots: header, default (body), footer
    - Flat: border border-primary-border rounded-xl (sem sombra)
    - Raised: border border-primary-border rounded-xl shadow-card
    - Elevated: border border-primary-border rounded-xl shadow-panel
    - Header interno: pb-4 border-b border-primary-border com título text-h3
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.6_

  - [x] 4.2 Refatorar AppModal.vue com nova estrutura e proporções
    - Props: show, size (sm/md/lg), title, closable
    - Tamanhos: sm (max-w-[400px]), md (max-w-[540px]), lg (max-w-[680px])
    - Overlay: bg-black/40 backdrop-blur-[4px]
    - Header: px-6 py-5 com título + botão fechar, border-b separador
    - Body: px-6 py-5 overflow-y-auto (scroll interno)
    - Footer: px-6 py-5 border-t com botões alinhados à direita
    - Animação entrada: translate-y-2 opacity-0 → translate-y-0 opacity-100 em 200ms ease-out
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

  - [ ]* 4.3 Escrever unit tests para AppCard e AppModal
    - Testar 3 elevações de AppCard renderizam classes corretas
    - Testar slots (header, body, footer) de AppCard
    - Testar AppModal fecha ao clicar overlay quando closable=true
    - Testar AppModal NÃO fecha ao clicar overlay quando closable=false
    - Testar scroll interno do body quando conteúdo excede altura
    - _Requirements: 4.1, 7.2, 7.6_

- [x] 5. Componente AppTable
  - [x] 5.1 Criar AppTable.vue com header sticky e formatação numérica
    - Props: columns (key, label, align, minWidth, numeric), data, loading, stickyHeader, emptyTitle, emptyDescription
    - Header: bg-primary-5 text-[11px] font-semibold uppercase tracking-[0.05em] px-4 py-3
    - Células: px-4 py-3 text-[13px]
    - Hover: hover:bg-primary-5 transition-colors duration-100
    - Numéricos: text-right font-[tabular-nums]
    - Sticky header: sticky top-0 z-10 (ativado quando stickyHeader=true)
    - Scroll horizontal: container com overflow-x-auto
    - Empty state: ícone + título + descrição centralizados
    - Loading state: skeleton rows com animate-pulse
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 8.5_

  - [ ]* 5.2 Escrever unit tests para AppTable
    - Testar renderização de colunas e dados
    - Testar empty state quando data está vazio
    - Testar alinhamento numérico à direita
    - Testar sticky header quando stickyHeader=true
    - _Requirements: 10.5, 10.6, 8.5_

- [x] 6. Checkpoint - Componentes base concluídos
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Template de Página e Sidebar
  - [x] 7.1 Criar PageTemplate padrão e aplicar em páginas existentes
    - Header: flex items-center justify-between mb-6 com título H1 + subtítulo + botões
    - Padding de página: px-6 md:px-8 lg:px-12
    - Gap entre seções: space-y-8 (32px)
    - Skeleton loading: animate-pulse bg-primary-5 rounded-lg
    - Empty state padrão: ícone + título + descrição centralizados
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [x] 7.2 Refinar AppSidebar.vue com opacidades, transições e tooltips
    - Itens inativos: opacity-60 (ajustar de 0.55 para 0.6)
    - Item ativo: opacity-100 bg-white/12
    - Transição largura: duration-250 cubic-bezier(0.4, 0, 0.2, 1) (antes 280ms)
    - Ícones: w-5 h-5 com stroke-width 1.5
    - Tooltip em estado colapsado: delay 300ms, posição à direita
    - Labels de seção: text-[10px] font-bold uppercase opacity-40
    - Gap entre seções: gap-5 (20px)
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [ ]* 7.3 Escrever unit tests para Sidebar tooltip e transições
    - Testar tooltip aparece após 300ms de hover no estado colapsado
    - Testar opacidade de itens ativos vs inativos
    - _Requirements: 9.1, 9.4_

- [x] 8. Checkpoint - Template e sidebar concluídos
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Redesign da Proposta Comercial
  - [x] 9.1 Redesenhar layout da página /orcamento-aprovacao/[token] com visual fiscal
    - Container: max-w-[800px] mx-auto bg-white border border-gray-200
    - Header: logo à esquerda, dados empresa (nome, CNPJ, endereço, telefone) à direita, separador 1px
    - Bloco destinatário: label "DESTINATÁRIO" em text-[11px] font-semibold uppercase text-gray-400
    - Tabela de itens: colunas Item | Descrição | Qtd | Valor Unit. | Total com header cinza claro e even:bg-gray-50
    - Resumo valores: subtotal, desconto, total (text-xl font-bold) alinhado à direita
    - Rodapé: validade + condições em text-xs text-gray-500
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [x] 9.2 Implementar botões fixos mobile e feedback de aprovação/rejeição
    - Botões mobile: fixed bottom-0 inset-x-0 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.08)] p-4
    - Feedback aprovação: animação check com transform 400ms ease + opacity 400ms ease
    - Feedback rejeição: animação X com mesma duração
    - Responsividade: botões inline em desktop, fixos em mobile
    - _Requirements: 5.7, 5.8_

  - [ ]* 9.3 Escrever unit tests para proposta comercial
    - Testar renderização de dados da empresa e cliente
    - Testar tabela de itens com valores formatados
    - Testar botões fixos aparecem em viewport mobile
    - Testar feedback visual após aprovação/rejeição
    - _Requirements: 5.1, 5.4, 5.7, 5.8_

- [ ] 10. Consistência e Formulários
  - [x] 10.1 Aplicar padrão de formulário premium em formulários existentes
    - Fieldsets visuais com gap-4 entre campos e gap-6 entre grupos
    - Botões de ação à direita com gap-3 entre secundário e primário
    - Garantir todos os inputs usem AppInput com labels padronizados
    - _Requirements: 6.6, 6.7_

  - [ ] 10.2 Aplicar novos componentes e tokens em todas as páginas existentes
    - Substituir cards manuais por AppCard com elevação adequada
    - Substituir tabelas manuais por AppTable
    - Aplicar PageTemplate padrão em páginas sem header consistente
    - Garantir espaçamento consistente (mb-6 header→conteúdo, space-y-8 entre seções)
    - Verificar contraste WCAG AA em valores numéricos de destaque (font-size ≥24px, weight 700)
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 4.5, 4.6, 8.1, 8.2, 8.3_

- [ ] 11. Final checkpoint - Verificação completa
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Este feature não utiliza property-based testing — os valores são estáticos de CSS
- Testes recomendados: visual regression (Playwright screenshots), unit tests (Vitest + @vue/test-utils), accessibility audits (axe-core)
- O sistema de temas dinâmicos existente (CSS custom properties) é preservado sem alteração
- A fonte Inter já deve estar instalada no projeto; caso contrário, adicionar via Google Fonts ou @fontsource

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2"] },
    { "id": 2, "tasks": ["3.1", "3.2"] },
    { "id": 3, "tasks": ["3.3", "4.1", "4.2"] },
    { "id": 4, "tasks": ["4.3", "5.1"] },
    { "id": 5, "tasks": ["5.2", "7.1", "7.2"] },
    { "id": 6, "tasks": ["7.3", "9.1"] },
    { "id": 7, "tasks": ["9.2"] },
    { "id": 8, "tasks": ["9.3", "10.1"] },
    { "id": 9, "tasks": ["10.2"] }
  ]
}
```
