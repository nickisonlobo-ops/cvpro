-- ============================================================
-- Migração: Criar tabela pipeline_etapas
-- Descrição: Tabela para armazenar etapas customizáveis dos
--            pipelines Kanban (CRM, Produção, Orçamentos)
-- Requisitos: 7.1, 7.2, 7.3
-- ============================================================

-- 1. Criar tabela pipeline_etapas
CREATE TABLE pipeline_etapas (
  id BIGSERIAL PRIMARY KEY,
  empresa_id BIGINT NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  pipeline_tipo TEXT NOT NULL CHECK (pipeline_tipo IN ('crm', 'producao', 'orcamentos')),
  nome TEXT NOT NULL,
  cor TEXT NOT NULL DEFAULT '#6b7280',
  posicao INTEGER NOT NULL DEFAULT 0,
  is_final BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Garante unicidade de nome por empresa + pipeline
  CONSTRAINT uq_etapa_nome UNIQUE (empresa_id, pipeline_tipo, nome)
);

-- 2. Índice para queries frequentes (listagem de etapas por empresa e pipeline ordenadas por posição)
CREATE INDEX idx_pipeline_etapas_empresa_tipo
  ON pipeline_etapas(empresa_id, pipeline_tipo, posicao);

-- 3. Trigger para atualização automática de updated_at
CREATE OR REPLACE FUNCTION update_pipeline_etapas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_pipeline_etapas_updated_at
  BEFORE UPDATE ON pipeline_etapas
  FOR EACH ROW
  EXECUTE FUNCTION update_pipeline_etapas_updated_at();

-- 4. Row Level Security
ALTER TABLE pipeline_etapas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Empresa acessa suas etapas"
  ON pipeline_etapas
  FOR ALL
  USING (
    empresa_id = (
      SELECT empresa_id FROM profiles WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    empresa_id = (
      SELECT empresa_id FROM profiles WHERE id = auth.uid()
    )
  );
