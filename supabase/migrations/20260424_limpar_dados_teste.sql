-- ─────────────────────────────────────────────────────────────────
-- DIAGNÓSTICO: Ver o que está bloqueando os horários hoje
-- Execute primeiro para ver o que existe
-- ─────────────────────────────────────────────────────────────────

-- 1. Agendamentos ativos hoje
SELECT id, data_hora, status,
       (data_hora AT TIME ZONE 'America/Sao_Paulo')::time AS hora_sp
FROM public.agendamentos
WHERE (data_hora AT TIME ZONE 'America/Sao_Paulo')::date = CURRENT_DATE
  AND status NOT IN ('cancelado', 'faltou')
ORDER BY data_hora;

-- 2. Solicitações pendentes hoje (tabela antiga — costuma ter registros esquecidos)
SELECT id, data_hora, status, duracao_min,
       (data_hora AT TIME ZONE 'America/Sao_Paulo')::time AS hora_sp
FROM public.solicitacoes_agendamento
WHERE (data_hora AT TIME ZONE 'America/Sao_Paulo')::date = CURRENT_DATE
  AND status = 'pendente'
ORDER BY data_hora;

-- ─────────────────────────────────────────────────────────────────
-- LIMPEZA: Cancela TODOS os agendamentos de hoje (dados de teste)
-- Descomente as linhas abaixo após confirmar o que apareceu acima
-- ─────────────────────────────────────────────────────────────────

-- UPDATE public.agendamentos
-- SET status = 'cancelado'
-- WHERE (data_hora AT TIME ZONE 'America/Sao_Paulo')::date = CURRENT_DATE;

-- UPDATE public.solicitacoes_agendamento
-- SET status = 'cancelado'
-- WHERE (data_hora AT TIME ZONE 'America/Sao_Paulo')::date = CURRENT_DATE
--   AND status = 'pendente';
