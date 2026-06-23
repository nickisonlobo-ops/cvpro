-- Unificar contas a pagar e receber na mesma tabela
-- Adicionar tipo, vínculo com orçamento, e parcelas

ALTER TABLE public.contas_pagar
  ADD COLUMN IF NOT EXISTS tipo TEXT NOT NULL DEFAULT 'pagar'
    CHECK (tipo IN ('pagar', 'receber'));

ALTER TABLE public.contas_pagar
  ADD COLUMN IF NOT EXISTS orcamento_id BIGINT REFERENCES public.orcamentos_adesivo(id) ON DELETE SET NULL;

ALTER TABLE public.contas_pagar
  ADD COLUMN IF NOT EXISTS parcela_numero INTEGER DEFAULT NULL;

ALTER TABLE public.contas_pagar
  ADD COLUMN IF NOT EXISTS total_parcelas INTEGER DEFAULT NULL;

ALTER TABLE public.contas_pagar
  ADD COLUMN IF NOT EXISTS cliente_nome TEXT DEFAULT NULL;

-- Índices
CREATE INDEX IF NOT EXISTS idx_contas_pagar_tipo ON public.contas_pagar(tipo);
CREATE INDEX IF NOT EXISTS idx_contas_pagar_orcamento ON public.contas_pagar(orcamento_id) WHERE orcamento_id IS NOT NULL;

COMMENT ON COLUMN public.contas_pagar.tipo IS 'pagar = despesa | receber = receita (vinda de orçamento aprovado)';
COMMENT ON COLUMN public.contas_pagar.orcamento_id IS 'Vínculo com orçamento que gerou o recebível';
COMMENT ON COLUMN public.contas_pagar.parcela_numero IS 'Número da parcela (1, 2, 3...)';
COMMENT ON COLUMN public.contas_pagar.total_parcelas IS 'Total de parcelas do pagamento';
COMMENT ON COLUMN public.contas_pagar.cliente_nome IS 'Nome do cliente (para recebíveis)';
