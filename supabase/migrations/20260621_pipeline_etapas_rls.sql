-- ═══════════════════════════════════════════════════════════════
-- Migration: Pipeline Etapas — Row Level Security
-- Habilita RLS e cria policy de tenant isolation para a tabela
-- pipeline_etapas, garantindo que cada empresa acesse somente
-- suas próprias etapas.
-- Validates: Requirement 7.7
-- ═══════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────
-- Habilita RLS na tabela pipeline_etapas
-- ─────────────────────────────────────────────
ALTER TABLE public.pipeline_etapas ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────
-- Policy: Empresa acessa suas etapas
-- Usa subquery em profiles para resolver empresa_id
-- a partir de auth.uid()
-- ─────────────────────────────────────────────
CREATE POLICY "Empresa acessa suas etapas"
  ON public.pipeline_etapas
  FOR ALL
  TO authenticated
  USING (
    empresa_id IN (
      SELECT empresa_id FROM public.profiles WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    empresa_id IN (
      SELECT empresa_id FROM public.profiles WHERE id = auth.uid()
    )
  );
