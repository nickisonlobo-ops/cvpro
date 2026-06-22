-- Tornar largura_cm e altura_cm opcionais no catálogo de produtos
-- (as medidas vêm do orçamento, nem todo produto tem dimensões fixas)

ALTER TABLE public.catalogo_adesivos ALTER COLUMN largura_cm DROP NOT NULL;
ALTER TABLE public.catalogo_adesivos ALTER COLUMN altura_cm DROP NOT NULL;
