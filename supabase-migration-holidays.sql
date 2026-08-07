-- ============================================================
-- Migración: Tabla de días festivos (holidays)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.adl_holidays (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.adl_holidays ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on adl_holidays" ON public.adl_holidays FOR ALL USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_adl_holidays_date ON public.adl_holidays(date);

-- Festivos Colombia 2026
INSERT INTO public.adl_holidays (date, name) VALUES
  ('2026-01-01', 'Año Nuevo'),
  ('2026-01-12', 'Día de los Reyes Magos'),
  ('2026-03-23', 'Día de San José'),
  ('2026-04-02', 'Jueves Santo'),
  ('2026-04-03', 'Viernes Santo'),
  ('2026-05-18', 'Día de la Ascensión'),
  ('2026-06-08', 'Corpus Christi'),
  ('2026-06-15', 'Sagrado Corazón'),
  ('2026-06-29', 'San Pedro y San Pablo'),
  ('2026-07-20', 'Día de la Independencia'),
  ('2026-08-07', 'Batalla de Boyacá'),
  ('2026-08-17', 'Asunción de la Virgen'),
  ('2026-10-12', 'Día de la Raza'),
  ('2026-11-02', 'Todos los Santos'),
  ('2026-11-16', 'Independencia de Cartagena'),
  ('2026-12-08', 'Inmaculada Concepción'),
  ('2026-12-25', 'Navidad')
ON CONFLICT (date) DO NOTHING;
