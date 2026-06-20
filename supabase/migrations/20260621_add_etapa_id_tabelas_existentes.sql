-- ═══════════════════════════════════════════════════════════════
-- Migration: Adicionar etapa_id nas tabelas existentes
-- Adiciona coluna etapa_id (FK para pipeline_etapas) nas tabelas
-- clientes, ordens_servico_adesivo e orcamentos_adesivo.
-- Permite migração gradual do sistema de status fixo para
-- etapas customizáveis do kanban.
-- Depende de: tabela pipeline_etapas (migration anterior)
-- ═══════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────
-- Adiciona etapa_id na tabela clientes
-- ─────────────────────────────────────────────
ALTER TABLE public.clientes
  ADD COLUMN IF NOT EXISTS etapa_id BIGINT
    REFERENCES public.pipeline_etapas(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_clientes_etapa
  ON public.clientes(etapa_id);

-- ─────────────────────────────────────────────
-- Adiciona etapa_id na tabela ordens_servico_adesivo
-- ─────────────────────────────────────────────
ALTER TABLE public.ordens_servico_adesivo
  ADD COLUMN IF NOT EXISTS etapa_id BIGINT
    REFERENCES public.pipeline_etapas(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_os_etapa
  ON public.ordens_servico_adesivo(etapa_id);

-- ─────────────────────────────────────────────
-- Adiciona etapa_id na tabela orcamentos_adesivo
-- ─────────────────────────────────────────────
ALTER TABLE public.orcamentos_adesivo
  ADD COLUMN IF NOT EXISTS etapa_id BIGINT
    REFERENCES public.pipeline_etapas(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_orcamentos_etapa
  ON public.orcamentos_adesivo(etapa_id);
