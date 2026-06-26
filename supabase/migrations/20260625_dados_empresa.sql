-- Adicionar campos de dados da empresa e dados bancarios na personalizacao
ALTER TABLE public.empresa_personalizacao
  ADD COLUMN IF NOT EXISTS razao_social TEXT,
  ADD COLUMN IF NOT EXISTS cnpj TEXT,
  ADD COLUMN IF NOT EXISTS endereco TEXT,
  ADD COLUMN IF NOT EXISTS telefone TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS banco TEXT,
  ADD COLUMN IF NOT EXISTS agencia TEXT,
  ADD COLUMN IF NOT EXISTS conta TEXT,
  ADD COLUMN IF NOT EXISTS tipo_conta TEXT,
  ADD COLUMN IF NOT EXISTS chave_pix TEXT,
  ADD COLUMN IF NOT EXISTS titular_conta TEXT;
