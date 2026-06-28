-- Adicionar campos de classificação e controle ao material
ALTER TABLE public.materiais_adesivo
  ADD COLUMN IF NOT EXISTS controle_estoque BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS uso_orcamentos BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS material_padrao BOOLEAN NOT NULL DEFAULT false;
