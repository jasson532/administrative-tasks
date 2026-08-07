-- ============================================================
-- SEED: Trabajadores con cumpleaños cercanos a hoy (5 Agosto 2025)
-- Hoy: 5 Ago | Esta semana: 6-12 Ago | Próxima semana: 13-19 Ago
-- ============================================================

-- Cumpleaños HOY (5 de agosto)
INSERT INTO public.adl_workers (identification, full_name, birthday_day, birthday_month, address, role_id, city_id, arl_id, eps_id, blood_type_id, team_id) VALUES
(
  '2001050801', 'Ricardo Esteban Lozano Vélez', 5, 8, 'Cra 12 #45-30, Bogotá',
  (SELECT id FROM public.adl_roles WHERE name = 'Desarrollador Frontend'),
  (SELECT id FROM public.adl_cities WHERE name = 'Bogotá'),
  (SELECT id FROM public.adl_arls WHERE name = 'Sura'),
  (SELECT id FROM public.adl_eps WHERE name = 'Sanitas'),
  (SELECT id FROM public.adl_blood_types WHERE name = 'O+'),
  (SELECT id FROM public.adl_teams WHERE name = 'Transformación Digital')
),
(
  '2002050802', 'Ana Lucía Betancourt Parra', 5, 8, 'Cll 90 #20-15, Medellín',
  (SELECT id FROM public.adl_roles WHERE name = 'QA Engineer'),
  (SELECT id FROM public.adl_cities WHERE name = 'Medellín'),
  (SELECT id FROM public.adl_arls WHERE name = 'Positiva'),
  (SELECT id FROM public.adl_eps WHERE name = 'Sura EPS'),
  (SELECT id FROM public.adl_blood_types WHERE name = 'A+'),
  (SELECT id FROM public.adl_teams WHERE name = 'Canales Digitales')
);

-- Cumpleaños ESTA SEMANA (6-12 agosto)
INSERT INTO public.adl_workers (identification, full_name, birthday_day, birthday_month, address, role_id, city_id, arl_id, eps_id, blood_type_id, team_id) VALUES
(
  '2003060801', 'Felipe Andrés Correa Montoya', 6, 8, 'Cra 30 #60-10, Cali',
  (SELECT id FROM public.adl_roles WHERE name = 'Desarrollador Backend'),
  (SELECT id FROM public.adl_cities WHERE name = 'Cali'),
  (SELECT id FROM public.adl_arls WHERE name = 'Colmena'),
  (SELECT id FROM public.adl_eps WHERE name = 'Compensar'),
  (SELECT id FROM public.adl_blood_types WHERE name = 'B+'),
  (SELECT id FROM public.adl_teams WHERE name = 'Core Banking')
),
(
  '2004080801', 'Lorena Patricia Suárez Gil', 8, 8, 'Cll 50 #15-22, Bogotá',
  (SELECT id FROM public.adl_roles WHERE name = 'Scrum Master'),
  (SELECT id FROM public.adl_cities WHERE name = 'Bogotá'),
  (SELECT id FROM public.adl_arls WHERE name = 'Sura'),
  (SELECT id FROM public.adl_eps WHERE name = 'Nueva EPS'),
  (SELECT id FROM public.adl_blood_types WHERE name = 'O-'),
  (SELECT id FROM public.adl_teams WHERE name = 'Experiencia Cliente')
),
(
  '2005100801', 'Martín Camilo Ríos Acosta', 10, 8, 'Cra 22 #33-44, Barranquilla',
  (SELECT id FROM public.adl_roles WHERE name = 'DevOps Engineer'),
  (SELECT id FROM public.adl_cities WHERE name = 'Barranquilla'),
  (SELECT id FROM public.adl_arls WHERE name = 'Liberty'),
  (SELECT id FROM public.adl_eps WHERE name = 'Salud Total'),
  (SELECT id FROM public.adl_blood_types WHERE name = 'AB+'),
  (SELECT id FROM public.adl_teams WHERE name = 'Infraestructura Cloud')
),
(
  '2006120801', 'Catalina María Duque Arango', 12, 8, 'Cll 70 #8-55, Medellín',
  (SELECT id FROM public.adl_roles WHERE name = 'Product Owner'),
  (SELECT id FROM public.adl_cities WHERE name = 'Medellín'),
  (SELECT id FROM public.adl_arls WHERE name = 'Positiva'),
  (SELECT id FROM public.adl_eps WHERE name = 'Sura EPS'),
  (SELECT id FROM public.adl_blood_types WHERE name = 'A-'),
  (SELECT id FROM public.adl_teams WHERE name = 'Pagos y Transferencias')
);

-- Cumpleaños PRÓXIMA SEMANA (13-19 agosto)
INSERT INTO public.adl_workers (identification, full_name, birthday_day, birthday_month, address, role_id, city_id, arl_id, eps_id, blood_type_id, team_id) VALUES
(
  '2007130801', 'Sergio Daniel Mejía Zapata', 13, 8, 'Cra 45 #90-12, Bucaramanga',
  (SELECT id FROM public.adl_roles WHERE name = 'Arquitecto de Software'),
  (SELECT id FROM public.adl_cities WHERE name = 'Bucaramanga'),
  (SELECT id FROM public.adl_arls WHERE name = 'Bolívar'),
  (SELECT id FROM public.adl_eps WHERE name = 'Famisanar'),
  (SELECT id FROM public.adl_blood_types WHERE name = 'O+'),
  (SELECT id FROM public.adl_teams WHERE name = 'Transformación Digital')
),
(
  '2008150801', 'Valentina Andrea Ocampo Luna', 15, 8, 'Cll 25 #50-30, Bogotá',
  (SELECT id FROM public.adl_roles WHERE name = 'Analista de Datos'),
  (SELECT id FROM public.adl_cities WHERE name = 'Bogotá'),
  (SELECT id FROM public.adl_arls WHERE name = 'Sura'),
  (SELECT id FROM public.adl_eps WHERE name = 'Compensar'),
  (SELECT id FROM public.adl_blood_types WHERE name = 'B-'),
  (SELECT id FROM public.adl_teams WHERE name = 'Canales Digitales')
),
(
  '2009180801', 'Andrés Mauricio Gómez Rojas', 18, 8, 'Cra 60 #12-40, Cartagena',
  (SELECT id FROM public.adl_roles WHERE name = 'Tech Lead'),
  (SELECT id FROM public.adl_cities WHERE name = 'Cartagena'),
  (SELECT id FROM public.adl_arls WHERE name = 'Colmena'),
  (SELECT id FROM public.adl_eps WHERE name = 'Coomeva'),
  (SELECT id FROM public.adl_blood_types WHERE name = 'A+'),
  (SELECT id FROM public.adl_teams WHERE name = 'Core Banking')
);

-- ============================================================
-- Resumen:
-- 2 personas cumplen HOY (5 agosto)
-- 4 personas cumplen ESTA SEMANA (6, 8, 10, 12 agosto)
-- 3 personas cumplen PRÓXIMA SEMANA (13, 15, 18 agosto)
-- ============================================================
