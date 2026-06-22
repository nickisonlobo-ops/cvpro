-- ═══════════════════════════════════════════════════════════════
-- Migration: Catálogo Multi-Material
-- Adiciona suporte a múltiplas matérias-primas por produto
-- com fórmulas de consumo customizáveis.
-- ═══════════════════════════════════════════════════════════════

-- 1. Criar junction table: catalogo_produto_materiais
CREATE TABLE IF NOT EXISTS public.catalogo_produto_materiais (
  id BIGSERIAL PRIMARY KEY,
  empresa_id BIGINT NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  produto_id BIGINT NOT NULL REFERENCES public.catalogo_adesivos(id) ON DELETE CASCADE,
  material_id BIGINT NOT NULL REFERENCES public.materiais_adesivo(id),
  formula_consumo TEXT NOT NULL DEFAULT 'largura * altura',
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT uq_produto_material UNIQUE (produto_id, material_id)
);

-- 2. Índices para queries frequentes
CREATE INDEX IF NOT EXISTS idx_catalogo_prod_mat_produto
  ON public.catalogo_produto_materiais(produto_id);

CREATE INDEX IF NOT EXISTS idx_catalogo_prod_mat_empresa
  ON public.catalogo_produto_materiais(empresa_id);

-- 3. RLS - Isolamento por empresa
ALTER TABLE public.catalogo_produto_materiais ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Empresa acessa suas composicoes"
  ON public.catalogo_produto_materiais
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

-- 4. Migrar dados existentes: produtos com material_id → composição
INSERT INTO public.catalogo_produto_materiais (empresa_id, produto_id, material_id, formula_consumo, ordem)
SELECT empresa_id, id, material_id, 'largura * altura', 0
FROM public.catalogo_adesivos
WHERE material_id IS NOT NULL
ON CONFLICT (produto_id, material_id) DO NOTHING;

-- 5. Remover coluna legada material_id
ALTER TABLE public.catalogo_adesivos DROP COLUMN IF EXISTS material_id;
