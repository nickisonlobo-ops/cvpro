-- ═══════════════════════════════════════════════════════════════
-- Migration: Categorias de Produtos
-- Cria tabela de categorias para o catálogo de produtos.
-- Migra categorias existentes (texto livre) para a nova tabela.
-- ═══════════════════════════════════════════════════════════════

-- 1. Criar tabela de categorias
CREATE TABLE IF NOT EXISTS public.catalogo_categorias (
  id BIGSERIAL PRIMARY KEY,
  empresa_id BIGINT NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  cor TEXT DEFAULT '#6b7280',
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT uq_categoria_nome UNIQUE (empresa_id, nome)
);

-- 2. Índice
CREATE INDEX IF NOT EXISTS idx_catalogo_categorias_empresa
  ON public.catalogo_categorias(empresa_id);

-- 3. RLS
ALTER TABLE public.catalogo_categorias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Empresa acessa suas categorias"
  ON public.catalogo_categorias
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

-- 4. Migrar categorias existentes do texto livre para a nova tabela
INSERT INTO public.catalogo_categorias (empresa_id, nome)
SELECT DISTINCT empresa_id, categoria
FROM public.catalogo_adesivos
WHERE categoria IS NOT NULL AND categoria != ''
ON CONFLICT (empresa_id, nome) DO NOTHING;

-- 5. Adicionar coluna categoria_id no catalogo_adesivos
ALTER TABLE public.catalogo_adesivos
  ADD COLUMN IF NOT EXISTS categoria_id BIGINT REFERENCES public.catalogo_categorias(id) ON DELETE SET NULL;

-- 6. Atualizar categoria_id com base no texto existente
UPDATE public.catalogo_adesivos ca
SET categoria_id = cc.id
FROM public.catalogo_categorias cc
WHERE ca.empresa_id = cc.empresa_id
  AND ca.categoria = cc.nome
  AND ca.categoria_id IS NULL;
