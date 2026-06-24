-- ═══ Adicionar campo data_entrega ao orcamento e OS ═══

-- Adicionar coluna data_entrega no orcamento
ALTER TABLE public.orcamentos_adesivo
  ADD COLUMN IF NOT EXISTS data_entrega DATE;

-- Adicionar coluna data_entrega na OS (se nao existir)
ALTER TABLE public.ordens_servico_adesivo
  ADD COLUMN IF NOT EXISTS data_entrega DATE;

-- Atualizar a funcao RPC para passar data_entrega do orcamento para a OS
CREATE OR REPLACE FUNCTION public.gerar_ordem_servico(
  p_orcamento_id bigint,
  p_forma_pagamento text DEFAULT NULL,
  p_origem text DEFAULT 'sistema'
)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_orc record;
  v_os_id bigint;
  v_numero_os text;
  v_next_pos integer;
  v_next_num integer;
BEGIN
  SELECT * INTO v_orc FROM public.orcamentos_adesivo WHERE id = p_orcamento_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Orcamento nao encontrado'; END IF;
  IF v_orc.status NOT IN ('enviado', 'rascunho') THEN
    RAISE EXCEPTION 'Orcamento nao esta em status valido para aprovacao';
  END IF;
  IF EXISTS (SELECT 1 FROM public.ordens_servico_adesivo WHERE orcamento_id = p_orcamento_id) THEN
    RAISE EXCEPTION 'Ordem de Servico ja gerada para este orcamento';
  END IF;

  SELECT COALESCE(MAX(CAST(REPLACE(numero_os, 'OS-', '') AS integer)), 0) + 1
  INTO v_next_num FROM public.ordens_servico_adesivo WHERE empresa_id = v_orc.empresa_id;
  v_numero_os := 'OS-' || v_next_num;

  SELECT COALESCE(MAX(posicao_fila), 0) + 1 INTO v_next_pos
  FROM public.ordens_servico_adesivo
  WHERE empresa_id = v_orc.empresa_id AND status IN ('aguardando_producao', 'em_producao');

  INSERT INTO public.ordens_servico_adesivo (
    empresa_id, orcamento_id, cliente_id, numero_os, status,
    forma_pagamento, valor_total, posicao_fila, data_aprovacao,
    origem_aprovacao, prazo_estimado, data_entrega, endereco_instalacao, nome_trabalho
  ) VALUES (
    v_orc.empresa_id, p_orcamento_id, v_orc.cliente_id, v_numero_os,
    'aguardando_producao', p_forma_pagamento, v_orc.valor_total,
    v_next_pos, now(), p_origem,
    CASE WHEN v_orc.prazo_estimado_dias IS NOT NULL
      THEN now() + (v_orc.prazo_estimado_dias || ' days')::interval
      ELSE NULL
    END,
    v_orc.data_entrega,
    v_orc.endereco_instalacao,
    v_orc.nome_trabalho
  ) RETURNING id INTO v_os_id;

  INSERT INTO public.itens_ordem_servico (
    ordem_servico_id, item_orcamento_id, descricao, material_id,
    largura_cm, altura_cm, quantidade, valor_item,
    foto_arte_url, foto_local_url, arquivo_url
  )
  SELECT v_os_id, id, descricao, material_id,
         largura_cm, altura_cm, quantidade, valor_item,
         foto_arte_url, foto_local_url, arquivo_url
  FROM public.itens_orcamento
  WHERE orcamento_id = p_orcamento_id;

  UPDATE public.orcamentos_adesivo
  SET status = 'aprovado', data_aprovacao = now(), origem_aprovacao = p_origem
  WHERE id = p_orcamento_id;

  RETURN v_os_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.gerar_ordem_servico(bigint, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.gerar_ordem_servico(bigint, text, text) TO anon;
