-- Flexibilizar constraints da tabela itens_orcamento para suportar itens manuais (sem material, sem dimensões)

-- Permitir material_id NULL (item manual sem produto do catálogo)
ALTER TABLE public.itens_orcamento ALTER COLUMN material_id DROP NOT NULL;

-- Permitir largura_cm e altura_cm NULL (item por unidade não precisa de dimensões)
ALTER TABLE public.itens_orcamento ALTER COLUMN largura_cm DROP NOT NULL;
ALTER TABLE public.itens_orcamento ALTER COLUMN altura_cm DROP NOT NULL;

-- Remover check constraint de preco_m2 que bloqueia valor NULL/0
ALTER TABLE public.itens_orcamento DROP CONSTRAINT IF EXISTS itens_orcamento_preco_m2_check;

-- Remover check constraints de dimensões que exigem > 0
ALTER TABLE public.itens_orcamento DROP CONSTRAINT IF EXISTS itens_orcamento_largura_cm_check;
ALTER TABLE public.itens_orcamento DROP CONSTRAINT IF EXISTS itens_orcamento_altura_cm_check;
