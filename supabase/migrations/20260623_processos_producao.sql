-- ═══ MÓDULO DE PROCESSOS DE PRODUÇÃO ═══
-- Processos são vinculados a produtos do catálogo.
-- Quando uma OS é gerada, os processos dos produtos são instanciados automaticamente.

-- Templates de processo (cada produto pode ter um processo com etapas)
CREATE TABLE IF NOT EXISTS public.processos_template (
  id BIGSERIAL PRIMARY KEY,
  empresa_id BIGINT NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  descricao TEXT,
  cor TEXT DEFAULT '#3b82f6',
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(empresa_id, nome)
);

-- Etapas do template (checklist padrão do processo)
CREATE TABLE IF NOT EXISTS public.processos_etapas_template (
  id BIGSERIAL PRIMARY KEY,
  processo_template_id BIGINT NOT NULL REFERENCES public.processos_template(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  ordem INTEGER NOT NULL DEFAULT 0,
  obrigatoria BOOLEAN NOT NULL DEFAULT true,
  tempo_estimado_min INTEGER DEFAULT NULL
);

-- Vínculo produto ↔ processo (um produto pode ter VÁRIOS processos)
CREATE TABLE IF NOT EXISTS public.produto_processo (
  id BIGSERIAL PRIMARY KEY,
  produto_id BIGINT NOT NULL REFERENCES public.catalogo_adesivos(id) ON DELETE CASCADE,
  processo_template_id BIGINT NOT NULL REFERENCES public.processos_template(id) ON DELETE CASCADE,
  ordem INTEGER NOT NULL DEFAULT 0,
  sequencial BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(produto_id, processo_template_id)
);

-- Instâncias de processo (criadas automaticamente ao gerar OS)
CREATE TABLE IF NOT EXISTS public.processos_instancia (
  id BIGSERIAL PRIMARY KEY,
  empresa_id BIGINT NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  processo_template_id BIGINT NOT NULL REFERENCES public.processos_template(id),
  os_id BIGINT REFERENCES public.ordens_servico_adesivo(id) ON DELETE CASCADE,
  item_os_id BIGINT,
  produto_nome TEXT,
  titulo TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_andamento', 'concluido', 'cancelado')),
  responsavel_nome TEXT,
  prioridade TEXT NOT NULL DEFAULT 'normal' CHECK (prioridade IN ('baixa', 'normal', 'alta', 'urgente')),
  data_inicio DATE,
  data_prazo DATE,
  data_conclusao TIMESTAMPTZ,
  progresso INTEGER NOT NULL DEFAULT 0,
  ordem INTEGER NOT NULL DEFAULT 0,
  sequencial BOOLEAN NOT NULL DEFAULT true,
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Checklist da instância (etapas individuais a cumprir)
CREATE TABLE IF NOT EXISTS public.processos_checklist (
  id BIGSERIAL PRIMARY KEY,
  instancia_id BIGINT NOT NULL REFERENCES public.processos_instancia(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  ordem INTEGER NOT NULL DEFAULT 0,
  concluida BOOLEAN NOT NULL DEFAULT false,
  concluida_em TIMESTAMPTZ,
  concluida_por TEXT,
  obrigatoria BOOLEAN NOT NULL DEFAULT true,
  observacao TEXT
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_processos_template_empresa ON public.processos_template(empresa_id);
CREATE INDEX IF NOT EXISTS idx_processos_instancia_empresa ON public.processos_instancia(empresa_id);
CREATE INDEX IF NOT EXISTS idx_processos_instancia_status ON public.processos_instancia(status);
CREATE INDEX IF NOT EXISTS idx_processos_instancia_os ON public.processos_instancia(os_id);
CREATE INDEX IF NOT EXISTS idx_processos_checklist_instancia ON public.processos_checklist(instancia_id);
CREATE INDEX IF NOT EXISTS idx_produto_processo_produto ON public.produto_processo(produto_id);

-- RLS
ALTER TABLE public.processos_template ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processos_etapas_template ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produto_processo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processos_instancia ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processos_checklist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "processos_template_all" ON public.processos_template FOR ALL TO authenticated
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()))
  WITH CHECK (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "processos_etapas_template_all" ON public.processos_etapas_template FOR ALL TO authenticated
  USING (processo_template_id IN (SELECT id FROM public.processos_template WHERE empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid())))
  WITH CHECK (processo_template_id IN (SELECT id FROM public.processos_template WHERE empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid())));

CREATE POLICY "produto_processo_all" ON public.produto_processo FOR ALL TO authenticated
  USING (produto_id IN (SELECT id FROM public.catalogo_adesivos WHERE empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid())))
  WITH CHECK (produto_id IN (SELECT id FROM public.catalogo_adesivos WHERE empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid())));

CREATE POLICY "processos_instancia_all" ON public.processos_instancia FOR ALL TO authenticated
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()))
  WITH CHECK (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "processos_checklist_all" ON public.processos_checklist FOR ALL TO authenticated
  USING (instancia_id IN (SELECT id FROM public.processos_instancia WHERE empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid())))
  WITH CHECK (instancia_id IN (SELECT id FROM public.processos_instancia WHERE empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid())));

COMMENT ON TABLE public.processos_template IS 'Templates de processos de produção reutilizáveis';
COMMENT ON TABLE public.produto_processo IS 'Vínculo 1:1 entre produto do catálogo e seu processo de produção';
COMMENT ON TABLE public.processos_instancia IS 'Instâncias de processo criadas ao gerar OS — uma por produto/item';
COMMENT ON TABLE public.processos_checklist IS 'Etapas do checklist de cada instância de processo';
