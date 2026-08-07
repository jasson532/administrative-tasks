-- ============================================================
-- Migración: Crear tabla adl_dependencias y actualizar adl_teams
-- ============================================================

-- 1. Crear tabla de dependencias
CREATE TABLE IF NOT EXISTS public.adl_dependencias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Insertar datos iniciales
INSERT INTO public.adl_dependencias (name) VALUES
  ('BBOG'),
  ('BAVV'),
  ('BPOP'),
  ('BOCC')
ON CONFLICT (name) DO NOTHING;

-- 3. Agregar columna FK a adl_teams
ALTER TABLE public.adl_teams ADD COLUMN IF NOT EXISTS dependencia_id UUID REFERENCES public.adl_dependencias(id);

-- 4. Migrar datos existentes (si ya hay equipos con dependencia en texto)
UPDATE public.adl_teams t
SET dependencia_id = d.id
FROM public.adl_dependencias d
WHERE t.dependencia = d.name AND t.dependencia_id IS NULL;

-- 5. Eliminar constraint CHECK anterior y columna vieja
ALTER TABLE public.adl_teams DROP CONSTRAINT IF EXISTS adl_teams_dependencia_check;
ALTER TABLE public.adl_teams DROP COLUMN IF EXISTS dependencia;

-- 6. Hacer dependencia_id NOT NULL (después de migrar datos)
-- ALTER TABLE public.adl_teams ALTER COLUMN dependencia_id SET NOT NULL;
-- ^ Descomentar solo si ya migraste todos los datos existentes

-- 7. RLS y políticas
ALTER TABLE public.adl_dependencias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on adl_dependencias" ON public.adl_dependencias FOR ALL USING (true) WITH CHECK (true);

-- 8. Índice
CREATE INDEX IF NOT EXISTS idx_adl_teams_dependencia ON public.adl_teams(dependencia_id);
