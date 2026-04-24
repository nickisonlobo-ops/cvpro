-- ─────────────────────────────────────────────────────────────────
-- Libera acesso anônimo (público) para agendamentos online
-- Execute no SQL Editor do Supabase
-- ─────────────────────────────────────────────────────────────────

-- ── agendamentos: anon pode inserir solicitações ──────────────────
DROP POLICY IF EXISTS "agendamentos_anon_insert"  ON public.agendamentos;
DROP POLICY IF EXISTS "agendamentos_anon_select"  ON public.agendamentos;
CREATE POLICY "agendamentos_anon_insert" ON public.agendamentos
  FOR INSERT TO anon
  WITH CHECK (status = 'solicitado');

-- anon precisa ler horários ocupados para calcular disponibilidade
CREATE POLICY "agendamentos_anon_select" ON public.agendamentos
  FOR SELECT TO anon
  USING (true);

-- ── agendamento_servicos: anon pode inserir serviços do agendamento ─
DROP POLICY IF EXISTS "ag_servicos_anon_insert"   ON public.agendamento_servicos;
DROP POLICY IF EXISTS "ag_servicos_anon_select"   ON public.agendamento_servicos;
CREATE POLICY "ag_servicos_anon_insert" ON public.agendamento_servicos
  FOR INSERT TO anon
  WITH CHECK (
    agendamento_id IN (
      SELECT id FROM public.agendamentos WHERE status = 'solicitado'
    )
  );
CREATE POLICY "ag_servicos_anon_select" ON public.agendamento_servicos
  FOR SELECT TO anon
  USING (true);

-- ── clientes: anon pode buscar por telefone e criar novo cadastro ──
DROP POLICY IF EXISTS "clientes_anon_select"      ON public.clientes;
DROP POLICY IF EXISTS "clientes_anon_insert"      ON public.clientes;
CREATE POLICY "clientes_anon_select" ON public.clientes
  FOR SELECT TO anon
  USING (true);
CREATE POLICY "clientes_anon_insert" ON public.clientes
  FOR INSERT TO anon
  WITH CHECK (true);
