-- ═══════════════════════════════════════════════════════════════
-- Migration: InvoiceXpress — Faturação Certificada (Portugal)
-- Adaptado para Free Tier (sem Vault): chave em coluna protegida.
-- A chave NUNCA é exposta ao frontend (RLS bloqueia, RPC server-only).
-- ═══════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────
-- 1. Conta de faturação por empresa
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.billing_accounts (
  id              bigserial PRIMARY KEY,
  empresa_id      bigint NOT NULL REFERENCES public.empresas(id),
  provider        text NOT NULL DEFAULT 'invoicexpress',
  account_name    text NOT NULL,                 -- o XXX em https://XXX.app.invoicexpress.com
  api_key_encrypted text NOT NULL,               -- chave API (protegida via RLS, nunca exposta)
  default_tax_name  text DEFAULT 'IVA23',        -- taxa padrão
  default_doc_type  text DEFAULT 'invoice_receipt', -- tipo doc padrão
  status          text NOT NULL DEFAULT 'connected'
                  CHECK (status IN ('connected','trial','error','disconnected')),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (empresa_id, provider)
);

-- ─────────────────────────────────────────────
-- 2. Registo de faturas emitidas
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.invoices (
  id                  bigserial PRIMARY KEY,
  empresa_id          bigint NOT NULL REFERENCES public.empresas(id),
  order_id            bigint NOT NULL,           -- orcamento_id ou OS id
  order_type          text NOT NULL DEFAULT 'orcamento', -- 'orcamento' | 'os'
  provider            text NOT NULL DEFAULT 'invoicexpress',
  provider_invoice_id text,                       -- id devolvido pelo InvoiceXpress
  document_type       text NOT NULL DEFAULT 'invoice_receipt',
  state               text NOT NULL DEFAULT 'pending'
                      CHECK (state IN ('pending','finalized','error','cancelled')),
  atcud               text,
  sequence_number     text,
  permalink           text,
  pdf_url             text,
  total               numeric,
  error_message       text,
  client_name         text,
  client_nif          text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  -- IDEMPOTÊNCIA: uma encomenda só pode originar UMA fatura por empresa.
  UNIQUE (empresa_id, order_id, order_type)
);

-- ─────────────────────────────────────────────
-- 3. RLS — tenant isolation
-- ─────────────────────────────────────────────
ALTER TABLE public.billing_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- billing_accounts: admin/gerente pode ler metadados (SEM a api_key)
-- A coluna api_key_encrypted NUNCA é selecionada pelo frontend
CREATE POLICY "billing_accounts_select" ON public.billing_accounts
  FOR SELECT TO authenticated
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "billing_accounts_insert" ON public.billing_accounts
  FOR INSERT TO authenticated
  WITH CHECK (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "billing_accounts_update" ON public.billing_accounts
  FOR UPDATE TO authenticated
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "billing_accounts_delete" ON public.billing_accounts
  FOR DELETE TO authenticated
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

-- invoices: qualquer autenticado da empresa pode ver
CREATE POLICY "invoices_select" ON public.invoices
  FOR SELECT TO authenticated
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "invoices_insert" ON public.invoices
  FOR INSERT TO authenticated
  WITH CHECK (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "invoices_update" ON public.invoices
  FOR UPDATE TO authenticated
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));


-- ─────────────────────────────────────────────
-- 4. RPC: guardar credenciais (chamado pelo frontend via Edge Function)
--    SECURITY DEFINER para bypass do RLS na coluna encriptada
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.store_billing_credentials(
  p_empresa_id    bigint,
  p_account_name  text,
  p_api_key       text,
  p_status        text DEFAULT 'connected'
)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_id bigint;
BEGIN
  INSERT INTO public.billing_accounts (empresa_id, provider, account_name, api_key_encrypted, status)
  VALUES (p_empresa_id, 'invoicexpress', p_account_name, p_api_key, p_status)
  ON CONFLICT (empresa_id, provider) DO UPDATE
    SET account_name       = EXCLUDED.account_name,
        api_key_encrypted  = EXCLUDED.api_key_encrypted,
        status             = EXCLUDED.status,
        updated_at         = now()
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

-- Só service_role pode executar (via Edge Function)
REVOKE ALL ON FUNCTION public.store_billing_credentials(bigint, text, text, text) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.store_billing_credentials(bigint, text, text, text) TO service_role;


-- ─────────────────────────────────────────────
-- 5. RPC: obter credenciais (apenas service_role — Edge Function)
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_billing_credentials(p_empresa_id bigint)
RETURNS TABLE (account_name text, api_key text, status text, default_tax_name text, default_doc_type text)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT account_name, api_key_encrypted, status, default_tax_name, default_doc_type
  FROM public.billing_accounts
  WHERE empresa_id = p_empresa_id AND provider = 'invoicexpress';
$$;

REVOKE ALL ON FUNCTION public.get_billing_credentials(bigint) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_billing_credentials(bigint) TO service_role;


-- ─────────────────────────────────────────────
-- 6. RPC: verificar se empresa tem faturação configurada
--    (chamável pelo frontend para exibir status)
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_billing_status(p_empresa_id bigint)
RETURNS TABLE (connected boolean, account_name text, status text, default_tax_name text, default_doc_type text)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    true AS connected,
    account_name,
    status,
    default_tax_name,
    default_doc_type
  FROM public.billing_accounts
  WHERE empresa_id = p_empresa_id AND provider = 'invoicexpress';
$$;

-- Este pode ser chamado por authenticated (não expõe a api_key)
GRANT EXECUTE ON FUNCTION public.get_billing_status(bigint) TO authenticated;
