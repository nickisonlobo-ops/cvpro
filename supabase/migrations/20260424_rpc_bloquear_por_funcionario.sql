-- ─────────────────────────────────────────────────────────────────
-- Atualiza RPC: bloqueia horários por serviço E por profissional
--
-- Motivação: se a Ariane está agendada às 13h para qualquer serviço,
-- o horário 13h deve aparecer bloqueado para todos os serviços dela.
-- ─────────────────────────────────────────────────────────────────

DROP FUNCTION IF EXISTS public.get_horarios_ocupados_funcionario(bigint, date, bigint);
DROP FUNCTION IF EXISTS public.get_horarios_ocupados_funcionario(bigint, date, bigint, bigint);

CREATE OR REPLACE FUNCTION public.get_horarios_ocupados_funcionario(
  p_empresa_id      bigint,
  p_data            date,
  p_servico_id      bigint,
  p_funcionario_id  bigint DEFAULT NULL  -- funcionarios.id (bigint); NULL = ignora
)
RETURNS TABLE(inicio timestamptz, fim timestamptz)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    a.data_hora                                                                AS inicio,
    a.data_hora + (COALESCE(total_dur.total_min, 60) * INTERVAL '1 minute')  AS fim
  FROM agendamentos a
  -- Duração total do agendamento
  LEFT JOIN LATERAL (
    SELECT SUM(s2.duracao_min) AS total_min
    FROM agendamento_servicos agsv2
    JOIN servicos s2 ON s2.id = agsv2.servico_id
    WHERE agsv2.agendamento_id = a.id
  ) total_dur ON true
  -- Profissional: agendamentos.funcionario_id (UUID) → profiles.email → funcionarios.id
  LEFT JOIN profiles p ON p.id = a.funcionario_id
  LEFT JOIN funcionarios f ON lower(f.email) = lower(p.email)
  WHERE a.empresa_id = p_empresa_id
    AND (a.data_hora AT TIME ZONE 'America/Sao_Paulo')::date = p_data
    AND a.status NOT IN ('cancelado', 'faltou')
    AND (
      -- bloqueia se contém o mesmo serviço
      EXISTS (
        SELECT 1 FROM agendamento_servicos agsv3
        WHERE agsv3.agendamento_id = a.id
          AND agsv3.servico_id = p_servico_id
      )
      OR
      -- bloqueia se é o mesmo profissional (qualquer serviço dele)
      (p_funcionario_id IS NOT NULL AND f.id = p_funcionario_id)
    )

  UNION ALL

  -- Solicitações pendentes (tabela legada)
  SELECT
    sa.data_hora                                           AS inicio,
    sa.data_hora + (sa.duracao_min * INTERVAL '1 minute') AS fim
  FROM solicitacoes_agendamento sa
  WHERE sa.empresa_id = p_empresa_id
    AND (sa.data_hora AT TIME ZONE 'America/Sao_Paulo')::date = p_data
    AND sa.status = 'pendente'
    AND (
      p_servico_id IS NULL
      OR p_servico_id = ANY(sa.servico_ids)
    )
$$;

GRANT EXECUTE ON FUNCTION public.get_horarios_ocupados_funcionario(bigint, date, bigint, bigint) TO anon;
GRANT EXECUTE ON FUNCTION public.get_horarios_ocupados_funcionario(bigint, date, bigint, bigint) TO authenticated;
