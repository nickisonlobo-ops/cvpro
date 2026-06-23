-- Tabela de extratos bancários importados
CREATE TABLE IF NOT EXISTS public.extratos_bancarios (
  id BIGSERIAL PRIMARY KEY,
  empresa_id BIGINT NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  nome_arquivo TEXT NOT NULL,
  banco TEXT,
  conta TEXT,
  data_importacao TIMESTAMPTZ DEFAULT now(),
  periodo_inicio DATE,
  periodo_fim DATE,
  total_transacoes INTEGER DEFAULT 0,
  total_conciliadas INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de transações do extrato
CREATE TABLE IF NOT EXISTS public.transacoes_extrato (
  id BIGSERIAL PRIMARY KEY,
  extrato_id BIGINT NOT NULL REFERENCES public.extratos_bancarios(id) ON DELETE CASCADE,
  empresa_id BIGINT NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  data_transacao DATE NOT NULL,
  descricao TEXT NOT NULL,
  valor NUMERIC(12,2) NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('credito', 'debito')),
  saldo NUMERIC(12,2),
  referencia TEXT,
  -- Conciliação
  conta_pagar_id BIGINT REFERENCES public.contas_pagar(id) ON DELETE SET NULL,
  status_conciliacao TEXT NOT NULL DEFAULT 'pendente' CHECK (status_conciliacao IN ('pendente', 'conciliada', 'ignorada')),
  conciliada_em TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_transacoes_extrato_empresa ON public.transacoes_extrato(empresa_id);
CREATE INDEX IF NOT EXISTS idx_transacoes_extrato_status ON public.transacoes_extrato(status_conciliacao);
CREATE INDEX IF NOT EXISTS idx_transacoes_extrato_data ON public.transacoes_extrato(data_transacao);
CREATE INDEX IF NOT EXISTS idx_extratos_bancarios_empresa ON public.extratos_bancarios(empresa_id);

-- RLS
ALTER TABLE public.extratos_bancarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transacoes_extrato ENABLE ROW LEVEL SECURITY;

CREATE POLICY "extratos_bancarios_select" ON public.extratos_bancarios
  FOR SELECT TO authenticated
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "extratos_bancarios_insert" ON public.extratos_bancarios
  FOR INSERT TO authenticated
  WITH CHECK (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "extratos_bancarios_delete" ON public.extratos_bancarios
  FOR DELETE TO authenticated
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "transacoes_extrato_select" ON public.transacoes_extrato
  FOR SELECT TO authenticated
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "transacoes_extrato_insert" ON public.transacoes_extrato
  FOR INSERT TO authenticated
  WITH CHECK (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "transacoes_extrato_update" ON public.transacoes_extrato
  FOR UPDATE TO authenticated
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "transacoes_extrato_delete" ON public.transacoes_extrato
  FOR DELETE TO authenticated
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));
