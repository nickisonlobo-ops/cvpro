-- Permite leitura pública (anon) de funcionários
-- Necessário para a página de agendamento online exibir o nome do profissional
DROP POLICY IF EXISTS "funcionarios_public_read" ON public.funcionarios;
CREATE POLICY "funcionarios_public_read" ON public.funcionarios
  FOR SELECT TO anon
  USING (true);
