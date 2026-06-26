-- Fix: alterar coluna cpf_cnpj de integer para text
ALTER TABLE public.clientes
  ALTER COLUMN cpf_cnpj TYPE text USING cpf_cnpj::text;
