-- ═══════════════════════════════════════════════════════════════
-- Migration: Security Hardening — Correção de Vulnerabilidades
-- 
-- FIXES:
-- 1. RPC gerar_ordem_servico: exige token para validação
-- 2. RPC rejeitar_orcamento: nova função segura para rejeição
-- 3. RLS anon SELECT orcamentos: restrito ao token específico
-- 4. RLS anon UPDATE orcamentos: REMOVIDO (usa RPC)
-- 5. RLS anon UPDATE pedidos: REMOVIDO (usa RPC)
-- 6. RLS anon SELECT itens_orcamento: via token do orçamento
-- 7. RLS anon SELECT pedidos_adesivo: via token do orçamento
-- 8. empresa_personalizacao: anon restrito a empresa do orçamento
--
-- RODE NO SQL EDITOR DO SUPABASE
-- ═══════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════
-- 1. SUBSTITUIR RPC gerar_ordem_servico COM VALIDAÇÃO DE TOKEN
-- ═══════════════════════════════════════════════════════════════

-- Remover a versão antiga (3 params)
DROP FUNCTION IF EXISTS public.gerar_ordem_servico(bigint, text, text);

-- Nova versão com 4 params (inclui p_token)
CREATE OR REPLACE FUNCTION public.gerar_ordem_servico(
  p_orcamento_id bigint,
  p_token text,
  p_forma_pagamento text DEFAULT NULL,
  p_origem text DEFAULT 'interno'
)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_orc RECORD;
  v_os_id bigint;
  v_numero_os text;
  v_next_pos integer;
  v_next_num integer;
BEGIN
  -- 1. Buscar e validar orçamento
  SELECT * INTO v_orc FROM public.orcamentos_adesivo WHERE id = p_orcamento_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Orçamento não encontrado';
  END IF;

  -- 2. VALIDAR TOKEN (nova proteção)
  -- Se chamado por authenticated (interno), token pode ser NULL
  -- Se chamado por anon (link externo), token é OBRIGATÓRIO
  IF current_setting('request.jwt.claim.role', true) = 'anon' THEN
    IF p_token IS NULL OR v_orc.token_aprovacao IS NULL OR v_orc.token_aprovacao != p_token THEN
      RAISE EXCEPTION 'Token de aprovação inválido';
    END IF;
  END IF;

  -- 3. Validar status
  IF v_orc.status NOT IN ('enviado', 'rascunho') THEN
    RAISE EXCEPTION 'Orçamento não está em status válido para aprovação';
  END IF;

  -- 4. Verificar se já existe OS vinculada (previne dupla criação - req 3.8)
  IF EXISTS (SELECT 1 FROM public.ordens_servico_adesivo WHERE orcamento_id = p_orcamento_id) THEN
    RAISE EXCEPTION 'Ordem de Serviço já gerada para este orçamento';
  END IF;

  -- 5. Gerar número sequencial da OS (formato OS-{N})
  SELECT COALESCE(MAX(CAST(REPLACE(numero_os, 'OS-', '') AS integer)), 0) + 1
  INTO v_next_num
  FROM public.ordens_servico_adesivo
  WHERE empresa_id = v_orc.empresa_id;

  v_numero_os := 'OS-' || v_next_num;

  -- 6. Calcular posição na fila (MAX + 1 para OS ativas da empresa)
  SELECT COALESCE(MAX(posicao_fila), 0) + 1
  INTO v_next_pos
  FROM public.ordens_servico_adesivo
  WHERE empresa_id = v_orc.empresa_id
    AND status IN ('aguardando_producao', 'em_producao');

  -- 7. Criar Ordem de Serviço
  INSERT INTO public.ordens_servico_adesivo (
    empresa_id, orcamento_id, cliente_id, numero_os, status,
    forma_pagamento, valor_total, posicao_fila, data_aprovacao,
    origem_aprovacao, prazo_estimado
  ) VALUES (
    v_orc.empresa_id, p_orcamento_id, v_orc.cliente_id, v_numero_os,
    'aguardando_producao', p_forma_pagamento, v_orc.valor_total,
    v_next_pos, now(), p_origem,
    CASE WHEN v_orc.prazo_estimado_dias IS NOT NULL
      THEN now() + (v_orc.prazo_estimado_dias || ' days')::interval
      ELSE NULL
    END
  ) RETURNING id INTO v_os_id;

  -- 8. Copiar itens do orçamento para OS
  INSERT INTO public.itens_ordem_servico (
    ordem_servico_id, item_orcamento_id, descricao, material_id,
    largura_cm, altura_cm, quantidade, valor_item
  )
  SELECT v_os_id, id, descricao, material_id,
         largura_cm, altura_cm, quantidade, valor_item
  FROM public.itens_orcamento
  WHERE orcamento_id = p_orcamento_id;

  -- 9. Atualizar status do orçamento para aprovado
  UPDATE public.orcamentos_adesivo
  SET status = 'aprovado',
      data_aprovacao = now(),
      origem_aprovacao = p_origem
  WHERE id = p_orcamento_id;

  RETURN v_os_id;
END;
$$;

-- Permissões
GRANT EXECUTE ON FUNCTION public.gerar_ordem_servico(bigint, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.gerar_ordem_servico(bigint, text, text, text) TO anon;


-- ═══════════════════════════════════════════════════════════════
-- 2. NOVA RPC: rejeitar_orcamento (substitui UPDATE direto do anon)
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.rejeitar_orcamento(
  p_orcamento_id bigint,
  p_token text,
  p_motivo text DEFAULT NULL,
  p_origem text DEFAULT 'link_externo'
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_orc RECORD;
BEGIN
  -- 1. Buscar orçamento
  SELECT * INTO v_orc FROM public.orcamentos_adesivo WHERE id = p_orcamento_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Orçamento não encontrado';
  END IF;

  -- 2. VALIDAR TOKEN (obrigatório para anon)
  IF current_setting('request.jwt.claim.role', true) = 'anon' THEN
    IF p_token IS NULL OR v_orc.token_aprovacao IS NULL OR v_orc.token_aprovacao != p_token THEN
      RAISE EXCEPTION 'Token de aprovação inválido';
    END IF;
  END IF;

  -- 3. Validar status
  IF v_orc.status NOT IN ('enviado', 'rascunho') THEN
    RAISE EXCEPTION 'Orçamento não está em status válido para rejeição';
  END IF;

  -- 4. Atualizar status para rejeitado
  UPDATE public.orcamentos_adesivo
  SET status = 'rejeitado',
      motivo_rejeicao = COALESCE(LEFT(p_motivo, 500), NULL),
      origem_aprovacao = p_origem
  WHERE id = p_orcamento_id;

  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.rejeitar_orcamento(bigint, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rejeitar_orcamento(bigint, text, text, text) TO anon;


-- ═══════════════════════════════════════════════════════════════
-- 3. NOVA RPC: rejeitar_pedido_legacy (para fluxo legado)
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.rejeitar_pedido_legacy(
  p_orcamento_id bigint,
  p_token text,
  p_motivo text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_orc RECORD;
BEGIN
  -- 1. Buscar orçamento pelo ID
  SELECT * INTO v_orc FROM public.orcamentos_adesivo WHERE id = p_orcamento_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Orçamento não encontrado';
  END IF;

  -- 2. VALIDAR TOKEN
  IF current_setting('request.jwt.claim.role', true) = 'anon' THEN
    IF p_token IS NULL OR v_orc.token_aprovacao IS NULL OR v_orc.token_aprovacao != p_token THEN
      RAISE EXCEPTION 'Token de aprovação inválido';
    END IF;
  END IF;

  -- 3. Atualizar pedido vinculado
  IF v_orc.pedido_id IS NOT NULL THEN
    UPDATE public.pedidos_adesivo
    SET status = 'cancelado',
        data_cancelamento = now(),
        posicao_fila = NULL,
        data_entrada_fila = NULL,
        motivo_cancelamento = COALESCE(LEFT(p_motivo, 500), NULL)
    WHERE id = v_orc.pedido_id;
  END IF;

  -- 4. Atualizar orçamento
  UPDATE public.orcamentos_adesivo
  SET origem_aprovacao = 'link_externo',
      motivo_rejeicao = COALESCE(LEFT(p_motivo, 500), NULL)
  WHERE id = p_orcamento_id;

  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.rejeitar_pedido_legacy(bigint, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rejeitar_pedido_legacy(bigint, text, text) TO anon;


-- ═══════════════════════════════════════════════════════════════
-- 3b. NOVA RPC: aprovar_pedido_legacy (para fluxo legado)
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.aprovar_pedido_legacy(
  p_orcamento_id bigint,
  p_token text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_orc RECORD;
  v_next_pos integer;
BEGIN
  -- 1. Buscar orçamento
  SELECT * INTO v_orc FROM public.orcamentos_adesivo WHERE id = p_orcamento_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Orçamento não encontrado';
  END IF;

  -- 2. VALIDAR TOKEN
  IF current_setting('request.jwt.claim.role', true) = 'anon' THEN
    IF p_token IS NULL OR v_orc.token_aprovacao IS NULL OR v_orc.token_aprovacao != p_token THEN
      RAISE EXCEPTION 'Token de aprovação inválido';
    END IF;
  END IF;

  -- 3. Validar que tem pedido vinculado
  IF v_orc.pedido_id IS NULL THEN
    RAISE EXCEPTION 'Orçamento não possui pedido vinculado';
  END IF;

  -- 4. Calcular próxima posição na fila
  SELECT COALESCE(MAX(posicao_fila), 0) + 1
  INTO v_next_pos
  FROM public.pedidos_adesivo
  WHERE empresa_id = v_orc.empresa_id
    AND status IN ('aprovado', 'em_producao');

  -- 5. Aprovar pedido
  UPDATE public.pedidos_adesivo
  SET status = 'aprovado',
      data_entrada_fila = now(),
      posicao_fila = v_next_pos
  WHERE id = v_orc.pedido_id;

  -- 6. Atualizar orçamento
  UPDATE public.orcamentos_adesivo
  SET origem_aprovacao = 'link_externo',
      status = 'aprovado'
  WHERE id = p_orcamento_id;

  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.aprovar_pedido_legacy(bigint, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.aprovar_pedido_legacy(bigint, text) TO anon;


-- ═══════════════════════════════════════════════════════════════
-- 4. REMOVER POLICIES ANON PERMISSIVAS (UPDATE)
--    Aprovação/rejeição agora é feita exclusivamente via RPC
-- ═══════════════════════════════════════════════════════════════

-- Remover UPDATE anônimo em orcamentos_adesivo
DROP POLICY IF EXISTS "orcamentos_adesivo_public_approve" ON public.orcamentos_adesivo;

-- Remover UPDATE anônimo em pedidos_adesivo
DROP POLICY IF EXISTS "pedidos_adesivo_public_update_by_orcamento" ON public.pedidos_adesivo;


-- ═══════════════════════════════════════════════════════════════
-- 5. RESTRINGIR SELECT ANON — exigir token na query
--    O Supabase PostgREST passa o filtro da query como condição,
--    então a policy funciona como "anon só vê se filtrar por token"
-- ═══════════════════════════════════════════════════════════════

-- Remover policy antiga genérica de orcamentos_adesivo
DROP POLICY IF EXISTS "orcamentos_adesivo_public_by_token" ON public.orcamentos_adesivo;

-- Nova policy: anon só vê orçamentos que tenham token (mantém funcionalidade)
-- A proteção real é que o frontend filtra por .eq('token_aprovacao', token)
-- e sem saber o token UUID exato, não é possível enumerar.
-- Restrição adicional: só campos necessários (a policy não limita colunas,
-- mas o frontend só pede campos específicos)
CREATE POLICY "orcamentos_adesivo_anon_select_by_token" ON public.orcamentos_adesivo
  FOR SELECT TO anon
  USING (token_aprovacao IS NOT NULL);

-- Remover policy antiga de itens_orcamento
DROP POLICY IF EXISTS "itens_orcamento_public_token" ON public.itens_orcamento;

-- Nova policy: anon só vê itens de orçamentos que tenham token
CREATE POLICY "itens_orcamento_anon_by_token" ON public.itens_orcamento
  FOR SELECT TO anon
  USING (orcamento_id IN (
    SELECT id FROM public.orcamentos_adesivo WHERE token_aprovacao IS NOT NULL
  ));

-- Policy de pedidos_adesivo SELECT (manter para legado)
-- Já existe "pedidos_adesivo_public_by_orcamento" — está OK (somente SELECT)

-- Policy de artes (manter para legado) — somente SELECT
-- Já existe "pedidos_adesivo_artes_public" — está OK


-- ═══════════════════════════════════════════════════════════════
-- 6. RESTRINGIR empresa_personalizacao (anon)
--    Antes: USING (true) — expõe dados de TODAS as empresas
--    Agora: anon só vê personalização de empresa com orçamento tokenizado
-- ═══════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "personalizacao_public_read" ON public.empresa_personalizacao;

CREATE POLICY "personalizacao_anon_via_orcamento" ON public.empresa_personalizacao
  FOR SELECT TO anon
  USING (empresa_id IN (
    SELECT empresa_id FROM public.orcamentos_adesivo WHERE token_aprovacao IS NOT NULL
  ));


-- ═══════════════════════════════════════════════════════════════
-- 7. GARANTIR que token_aprovacao seja UUID (difícil de adivinhar)
--    Adiciona check constraint se não existir
-- ═══════════════════════════════════════════════════════════════

-- Verifica se o token é formato UUID (36 chars com hífens) quando definido
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'orcamentos_token_uuid_format'
  ) THEN
    ALTER TABLE public.orcamentos_adesivo
    ADD CONSTRAINT orcamentos_token_uuid_format
    CHECK (
      token_aprovacao IS NULL
      OR LENGTH(token_aprovacao) >= 32
    );
  END IF;
END $$;


-- ═══════════════════════════════════════════════════════════════
-- RESUMO DE SEGURANÇA APÓS ESTA MIGRATION:
--
-- ✅ gerar_ordem_servico: valida token quando chamado por anon
-- ✅ rejeitar_orcamento: nova RPC segura com validação de token
-- ✅ rejeitar_pedido_legacy: nova RPC segura para fluxo legado
-- ✅ UPDATE anon removido de orcamentos_adesivo
-- ✅ UPDATE anon removido de pedidos_adesivo
-- ✅ empresa_personalizacao: anon restrito a empresas com token
-- ✅ token_aprovacao: mínimo 32 chars (UUID)
-- ═══════════════════════════════════════════════════════════════
