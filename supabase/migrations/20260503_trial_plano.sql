-- Adiciona controle de trial e plano na tabela empresas

ALTER TABLE public.empresas
  ADD COLUMN IF NOT EXISTS plano       text NOT NULL DEFAULT 'trial'
    CHECK (plano IN ('trial','essencial','pro','elite','bloqueado')),
  ADD COLUMN IF NOT EXISTS trial_start timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS trial_end   timestamptz NOT NULL DEFAULT (now() + interval '7 days');

-- Empresas existentes que já estão em produção ficam no plano 'pro' (equivalente ao plano principal deste sistema)
UPDATE public.empresas
SET plano = 'pro',
    trial_start = created_at,
    trial_end   = created_at + interval '7 days'
WHERE plano = 'trial';

-- RPC para leitura do plano por empresa (acessível sem RLS elevado)
CREATE OR REPLACE FUNCTION public.get_empresa_plano(p_empresa_id bigint)
RETURNS TABLE(plano text, trial_end timestamptz)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT plano, trial_end
  FROM public.empresas
  WHERE id = p_empresa_id;
$$;

GRANT EXECUTE ON FUNCTION public.get_empresa_plano TO authenticated;
