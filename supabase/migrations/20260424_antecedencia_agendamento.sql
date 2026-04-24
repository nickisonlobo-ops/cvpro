-- Adiciona configuração de antecedência mínima para agendamentos online
ALTER TABLE empresa_personalizacao
  ADD COLUMN IF NOT EXISTS antecedencia_min integer NOT NULL DEFAULT 60;
