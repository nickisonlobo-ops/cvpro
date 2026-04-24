-- Adiciona coluna de foto nos serviços
ALTER TABLE servicos ADD COLUMN IF NOT EXISTS foto_url TEXT;

-- Cria bucket público para fotos de serviços
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'servicos-fotos',
  'servicos-fotos',
  true,
  5242880, -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Autenticados podem fazer upload de fotos de servicos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'servicos-fotos');

CREATE POLICY "Fotos de servicos visiveis publicamente"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'servicos-fotos');

CREATE POLICY "Autenticados podem atualizar fotos de servicos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'servicos-fotos');

CREATE POLICY "Autenticados podem deletar fotos de servicos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'servicos-fotos');
