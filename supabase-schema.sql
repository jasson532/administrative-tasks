-- ============================================================
-- Gestión de Novedades ADL - Schema PUBLIC
-- Prefijo adl_ para identificar las tablas del proyecto
-- ============================================================

-- ============================================================
-- Tablas de catálogos (lookup tables)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.adl_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.adl_cities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(150) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.adl_arls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(150) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.adl_eps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(150) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.adl_blood_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(10) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.adl_news_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  convention VARCHAR(10) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- Tablas principales
-- ============================================================

CREATE TABLE IF NOT EXISTS public.adl_teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  dependencia VARCHAR(10) NOT NULL CHECK (dependencia IN ('BBOG', 'BAVV', 'BPOP', 'BOCC')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.adl_workers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  identification VARCHAR(20) NOT NULL UNIQUE,
  full_name VARCHAR(200) NOT NULL,
  birthday_day INTEGER NOT NULL CHECK (birthday_day BETWEEN 1 AND 31),
  birthday_month INTEGER NOT NULL CHECK (birthday_month BETWEEN 1 AND 12),
  address VARCHAR(300),
  role_id UUID NOT NULL REFERENCES public.adl_roles(id),
  city_id UUID REFERENCES public.adl_cities(id),
  arl_id UUID REFERENCES public.adl_arls(id),
  eps_id UUID REFERENCES public.adl_eps(id),
  blood_type_id UUID REFERENCES public.adl_blood_types(id),
  team_id UUID NOT NULL REFERENCES public.adl_teams(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.adl_news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  state VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (state IN ('active', 'completed', 'cancelled')),
  worker_id UUID NOT NULL REFERENCES public.adl_workers(id),
  news_type_id UUID NOT NULL REFERENCES public.adl_news_types(id),
  description TEXT,
  time_type VARCHAR(10) NOT NULL CHECK (time_type IN ('days', 'hours', 'minutes')),
  start_date DATE,
  end_date DATE,
  hours INTEGER,
  minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- Índices
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_adl_workers_team ON public.adl_workers(team_id);
CREATE INDEX IF NOT EXISTS idx_adl_workers_role ON public.adl_workers(role_id);
CREATE INDEX IF NOT EXISTS idx_adl_news_worker ON public.adl_news(worker_id);
CREATE INDEX IF NOT EXISTS idx_adl_news_type ON public.adl_news(news_type_id);
CREATE INDEX IF NOT EXISTS idx_adl_news_state ON public.adl_news(state);
CREATE INDEX IF NOT EXISTS idx_adl_news_dates ON public.adl_news(start_date, end_date);

-- ============================================================
-- Triggers para updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION public.adl_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_adl_teams_updated_at ON public.adl_teams;
CREATE TRIGGER trigger_adl_teams_updated_at
  BEFORE UPDATE ON public.adl_teams
  FOR EACH ROW EXECUTE FUNCTION public.adl_update_updated_at();

DROP TRIGGER IF EXISTS trigger_adl_workers_updated_at ON public.adl_workers;
CREATE TRIGGER trigger_adl_workers_updated_at
  BEFORE UPDATE ON public.adl_workers
  FOR EACH ROW EXECUTE FUNCTION public.adl_update_updated_at();

DROP TRIGGER IF EXISTS trigger_adl_news_updated_at ON public.adl_news;
CREATE TRIGGER trigger_adl_news_updated_at
  BEFORE UPDATE ON public.adl_news
  FOR EACH ROW EXECUTE FUNCTION public.adl_update_updated_at();

-- ============================================================
-- Datos iniciales de catálogos
-- ============================================================

INSERT INTO public.adl_blood_types (name) VALUES
  ('O+'), ('O-'), ('A+'), ('A-'), ('B+'), ('B-'), ('AB+'), ('AB-')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.adl_news_types (name, convention) VALUES
  ('Ausencia', 'AU'),
  ('Vacaciones', 'VA'),
  ('Incapacidad', 'IN'),
  ('Día de la Familia', 'DF'),
  ('Licencia de Maternidad', 'LM'),
  ('Licencia de Paternidad', 'LP'),
  ('Calamidad Doméstica', 'CD'),
  ('Permiso Personal', 'PP'),
  ('Capacitación', 'CA')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.adl_roles (name) VALUES
  ('Desarrollador Frontend'),
  ('Desarrollador Backend'),
  ('Desarrollador Full Stack'),
  ('QA Engineer'),
  ('Tech Lead'),
  ('Scrum Master'),
  ('Product Owner'),
  ('DevOps Engineer'),
  ('Arquitecto de Software'),
  ('Analista de Datos')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.adl_arls (name) VALUES
  ('Sura'),
  ('Positiva'),
  ('Colmena'),
  ('Bolívar'),
  ('Liberty')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.adl_eps (name) VALUES
  ('Sura EPS'),
  ('Sanitas'),
  ('Compensar'),
  ('Famisanar'),
  ('Nueva EPS'),
  ('Salud Total'),
  ('Coomeva')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.adl_cities (name) VALUES
  ('Bogotá'),
  ('Medellín'),
  ('Cali'),
  ('Barranquilla'),
  ('Bucaramanga'),
  ('Cartagena')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

ALTER TABLE public.adl_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adl_cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adl_arls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adl_eps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adl_blood_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adl_news_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adl_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adl_workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adl_news ENABLE ROW LEVEL SECURITY;

-- Políticas permisivas para desarrollo
CREATE POLICY "Allow all on adl_roles" ON public.adl_roles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on adl_cities" ON public.adl_cities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on adl_arls" ON public.adl_arls FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on adl_eps" ON public.adl_eps FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on adl_blood_types" ON public.adl_blood_types FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on adl_news_types" ON public.adl_news_types FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on adl_teams" ON public.adl_teams FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on adl_workers" ON public.adl_workers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on adl_news" ON public.adl_news FOR ALL USING (true) WITH CHECK (true);
