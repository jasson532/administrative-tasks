-- ============================================================
-- SEED DATA: Equipos, Trabajadores y Novedades de prueba
-- Ejecutar después del schema principal y la migración de dependencias
-- ============================================================

-- Primero obtenemos IDs de catálogos existentes usando variables
-- (Supabase SQL Editor soporta esto)

-- EQUIPOS (6 equipos distribuidos en las dependencias)
INSERT INTO public.adl_teams (name, dependencia_id) VALUES
  ('Transformación Digital', (SELECT id FROM public.adl_dependencias WHERE name = 'BBOG')),
  ('Canales Digitales', (SELECT id FROM public.adl_dependencias WHERE name = 'BBOG')),
  ('Core Banking', (SELECT id FROM public.adl_dependencias WHERE name = 'BAVV')),
  ('Pagos y Transferencias', (SELECT id FROM public.adl_dependencias WHERE name = 'BAVV')),
  ('Experiencia Cliente', (SELECT id FROM public.adl_dependencias WHERE name = 'BPOP')),
  ('Infraestructura Cloud', (SELECT id FROM public.adl_dependencias WHERE name = 'BOCC'))
ON CONFLICT DO NOTHING;

-- TRABAJADORES (20 personas)
INSERT INTO public.adl_workers (identification, full_name, birthday_day, birthday_month, address, role_id, city_id, arl_id, eps_id, blood_type_id, team_id) VALUES
(
  '1010234567', 'Carlos Andrés Martínez López', 15, 3, 'Cra 45 #12-30, Bogotá',
  (SELECT id FROM public.adl_roles WHERE name = 'Desarrollador Frontend'),
  (SELECT id FROM public.adl_cities WHERE name = 'Bogotá'),
  (SELECT id FROM public.adl_arls WHERE name = 'Sura'),
  (SELECT id FROM public.adl_eps WHERE name = 'Sanitas'),
  (SELECT id FROM public.adl_blood_types WHERE name = 'O+'),
  (SELECT id FROM public.adl_teams WHERE name = 'Transformación Digital')
),
(
  '1020345678', 'María Fernanda Rodríguez Gómez', 22, 7, 'Cll 100 #15-45, Bogotá',
  (SELECT id FROM public.adl_roles WHERE name = 'Desarrollador Backend'),
  (SELECT id FROM public.adl_cities WHERE name = 'Bogotá'),
  (SELECT id FROM public.adl_arls WHERE name = 'Positiva'),
  (SELECT id FROM public.adl_eps WHERE name = 'Compensar'),
  (SELECT id FROM public.adl_blood_types WHERE name = 'A+'),
  (SELECT id FROM public.adl_teams WHERE name = 'Transformación Digital')
),
(
  '1030456789', 'Juan David Pérez Hernández', 8, 11, 'Cra 7 #45-60, Medellín',
  (SELECT id FROM public.adl_roles WHERE name = 'Tech Lead'),
  (SELECT id FROM public.adl_cities WHERE name = 'Medellín'),
  (SELECT id FROM public.adl_arls WHERE name = 'Colmena'),
  (SELECT id FROM public.adl_eps WHERE name = 'Sura EPS'),
  (SELECT id FROM public.adl_blood_types WHERE name = 'B+'),
  (SELECT id FROM public.adl_teams WHERE name = 'Canales Digitales')
),
(
  '1040567890', 'Laura Valentina García Torres', 30, 1, 'Cll 50 #20-10, Cali',
  (SELECT id FROM public.adl_roles WHERE name = 'QA Engineer'),
  (SELECT id FROM public.adl_cities WHERE name = 'Cali'),
  (SELECT id FROM public.adl_arls WHERE name = 'Sura'),
  (SELECT id FROM public.adl_eps WHERE name = 'Nueva EPS'),
  (SELECT id FROM public.adl_blood_types WHERE name = 'O-'),
  (SELECT id FROM public.adl_teams WHERE name = 'Canales Digitales')
),
(
  '1050678901', 'Andrés Felipe Ramírez Castro', 5, 9, 'Cra 30 #10-55, Bogotá',
  (SELECT id FROM public.adl_roles WHERE name = 'Desarrollador Full Stack'),
  (SELECT id FROM public.adl_cities WHERE name = 'Bogotá'),
  (SELECT id FROM public.adl_arls WHERE name = 'Bolívar'),
  (SELECT id FROM public.adl_eps WHERE name = 'Famisanar'),
  (SELECT id FROM public.adl_blood_types WHERE name = 'A-'),
  (SELECT id FROM public.adl_teams WHERE name = 'Core Banking')
);

INSERT INTO public.adl_workers (identification, full_name, birthday_day, birthday_month, address, role_id, city_id, arl_id, eps_id, blood_type_id, team_id) VALUES
(
  '1060789012', 'Daniela Alejandra Moreno Díaz', 18, 5, 'Cll 72 #8-20, Barranquilla',
  (SELECT id FROM public.adl_roles WHERE name = 'Scrum Master'),
  (SELECT id FROM public.adl_cities WHERE name = 'Barranquilla'),
  (SELECT id FROM public.adl_arls WHERE name = 'Liberty'),
  (SELECT id FROM public.adl_eps WHERE name = 'Salud Total'),
  (SELECT id FROM public.adl_blood_types WHERE name = 'AB+'),
  (SELECT id FROM public.adl_teams WHERE name = 'Core Banking')
),
(
  '1070890123', 'Santiago José Herrera Vargas', 12, 12, 'Cra 15 #80-30, Bogotá',
  (SELECT id FROM public.adl_roles WHERE name = 'DevOps Engineer'),
  (SELECT id FROM public.adl_cities WHERE name = 'Bogotá'),
  (SELECT id FROM public.adl_arls WHERE name = 'Sura'),
  (SELECT id FROM public.adl_eps WHERE name = 'Compensar'),
  (SELECT id FROM public.adl_blood_types WHERE name = 'O+'),
  (SELECT id FROM public.adl_teams WHERE name = 'Infraestructura Cloud')
),
(
  '1080901234', 'Valentina Sofía Castillo Ruiz', 25, 4, 'Cll 30 #45-12, Medellín',
  (SELECT id FROM public.adl_roles WHERE name = 'Product Owner'),
  (SELECT id FROM public.adl_cities WHERE name = 'Medellín'),
  (SELECT id FROM public.adl_arls WHERE name = 'Positiva'),
  (SELECT id FROM public.adl_eps WHERE name = 'Sura EPS'),
  (SELECT id FROM public.adl_blood_types WHERE name = 'B-'),
  (SELECT id FROM public.adl_teams WHERE name = 'Pagos y Transferencias')
),
(
  '1091012345', 'Diego Alejandro Muñoz Ríos', 3, 8, 'Cra 50 #25-40, Bucaramanga',
  (SELECT id FROM public.adl_roles WHERE name = 'Arquitecto de Software'),
  (SELECT id FROM public.adl_cities WHERE name = 'Bucaramanga'),
  (SELECT id FROM public.adl_arls WHERE name = 'Colmena'),
  (SELECT id FROM public.adl_eps WHERE name = 'Coomeva'),
  (SELECT id FROM public.adl_blood_types WHERE name = 'A+'),
  (SELECT id FROM public.adl_teams WHERE name = 'Pagos y Transferencias')
),
(
  '1101123456', 'Camila Andrea Jiménez Ortiz', 20, 6, 'Cll 85 #11-55, Bogotá',
  (SELECT id FROM public.adl_roles WHERE name = 'Analista de Datos'),
  (SELECT id FROM public.adl_cities WHERE name = 'Bogotá'),
  (SELECT id FROM public.adl_arls WHERE name = 'Sura'),
  (SELECT id FROM public.adl_eps WHERE name = 'Sanitas'),
  (SELECT id FROM public.adl_blood_types WHERE name = 'O+'),
  (SELECT id FROM public.adl_teams WHERE name = 'Experiencia Cliente')
),
(
  '1112234567', 'Sebastián Camilo Torres Mendoza', 14, 2, 'Cra 68 #30-22, Bogotá',
  (SELECT id FROM public.adl_roles WHERE name = 'Desarrollador Frontend'),
  (SELECT id FROM public.adl_cities WHERE name = 'Bogotá'),
  (SELECT id FROM public.adl_arls WHERE name = 'Positiva'),
  (SELECT id FROM public.adl_eps WHERE name = 'Nueva EPS'),
  (SELECT id FROM public.adl_blood_types WHERE name = 'AB-'),
  (SELECT id FROM public.adl_teams WHERE name = 'Experiencia Cliente')
);

INSERT INTO public.adl_workers (identification, full_name, birthday_day, birthday_month, address, role_id, city_id, arl_id, eps_id, blood_type_id, team_id) VALUES
(
  '1123345678', 'Natalia Paola Restrepo Silva', 7, 10, 'Cll 10 #40-18, Cartagena',
  (SELECT id FROM public.adl_roles WHERE name = 'Desarrollador Backend'),
  (SELECT id FROM public.adl_cities WHERE name = 'Cartagena'),
  (SELECT id FROM public.adl_arls WHERE name = 'Liberty'),
  (SELECT id FROM public.adl_eps WHERE name = 'Salud Total'),
  (SELECT id FROM public.adl_blood_types WHERE name = 'B+'),
  (SELECT id FROM public.adl_teams WHERE name = 'Transformación Digital')
),
(
  '1134456789', 'Julián Esteban Ospina Cruz', 28, 11, 'Cra 25 #55-33, Medellín',
  (SELECT id FROM public.adl_roles WHERE name = 'Desarrollador Full Stack'),
  (SELECT id FROM public.adl_cities WHERE name = 'Medellín'),
  (SELECT id FROM public.adl_arls WHERE name = 'Sura'),
  (SELECT id FROM public.adl_eps WHERE name = 'Sura EPS'),
  (SELECT id FROM public.adl_blood_types WHERE name = 'O+'),
  (SELECT id FROM public.adl_teams WHERE name = 'Canales Digitales')
),
(
  '1145567890', 'Isabella María Cardona Mejía', 11, 4, 'Cll 65 #22-10, Cali',
  (SELECT id FROM public.adl_roles WHERE name = 'QA Engineer'),
  (SELECT id FROM public.adl_cities WHERE name = 'Cali'),
  (SELECT id FROM public.adl_arls WHERE name = 'Colmena'),
  (SELECT id FROM public.adl_eps WHERE name = 'Famisanar'),
  (SELECT id FROM public.adl_blood_types WHERE name = 'A+'),
  (SELECT id FROM public.adl_teams WHERE name = 'Core Banking')
),
(
  '1156678901', 'Mateo Alejandro Vargas Pinto', 16, 7, 'Cra 10 #90-25, Bogotá',
  (SELECT id FROM public.adl_roles WHERE name = 'DevOps Engineer'),
  (SELECT id FROM public.adl_cities WHERE name = 'Bogotá'),
  (SELECT id FROM public.adl_arls WHERE name = 'Bolívar'),
  (SELECT id FROM public.adl_eps WHERE name = 'Compensar'),
  (SELECT id FROM public.adl_blood_types WHERE name = 'O-'),
  (SELECT id FROM public.adl_teams WHERE name = 'Infraestructura Cloud')
),
(
  '1167789012', 'Gabriela Lucía Sánchez Mora', 23, 9, 'Cll 45 #60-15, Bogotá',
  (SELECT id FROM public.adl_roles WHERE name = 'Desarrollador Frontend'),
  (SELECT id FROM public.adl_cities WHERE name = 'Bogotá'),
  (SELECT id FROM public.adl_arls WHERE name = 'Positiva'),
  (SELECT id FROM public.adl_eps WHERE name = 'Sanitas'),
  (SELECT id FROM public.adl_blood_types WHERE name = 'A-'),
  (SELECT id FROM public.adl_teams WHERE name = 'Pagos y Transferencias')
);

INSERT INTO public.adl_workers (identification, full_name, birthday_day, birthday_month, address, role_id, city_id, arl_id, eps_id, blood_type_id, team_id) VALUES
(
  '1178890123', 'Nicolás David Aguirre León', 1, 1, 'Cra 80 #35-42, Barranquilla',
  (SELECT id FROM public.adl_roles WHERE name = 'Tech Lead'),
  (SELECT id FROM public.adl_cities WHERE name = 'Barranquilla'),
  (SELECT id FROM public.adl_arls WHERE name = 'Sura'),
  (SELECT id FROM public.adl_eps WHERE name = 'Nueva EPS'),
  (SELECT id FROM public.adl_blood_types WHERE name = 'B+'),
  (SELECT id FROM public.adl_teams WHERE name = 'Experiencia Cliente')
),
(
  '1189901234', 'Paula Andrea Gutiérrez Ramos', 9, 3, 'Cll 20 #15-60, Bogotá',
  (SELECT id FROM public.adl_roles WHERE name = 'Analista de Datos'),
  (SELECT id FROM public.adl_cities WHERE name = 'Bogotá'),
  (SELECT id FROM public.adl_arls WHERE name = 'Liberty'),
  (SELECT id FROM public.adl_eps WHERE name = 'Coomeva'),
  (SELECT id FROM public.adl_blood_types WHERE name = 'AB+'),
  (SELECT id FROM public.adl_teams WHERE name = 'Transformación Digital')
),
(
  '1191012345', 'Alejandro José Duarte Niño', 19, 6, 'Cra 55 #70-30, Bucaramanga',
  (SELECT id FROM public.adl_roles WHERE name = 'Scrum Master'),
  (SELECT id FROM public.adl_cities WHERE name = 'Bucaramanga'),
  (SELECT id FROM public.adl_arls WHERE name = 'Colmena'),
  (SELECT id FROM public.adl_eps WHERE name = 'Salud Total'),
  (SELECT id FROM public.adl_blood_types WHERE name = 'O+'),
  (SELECT id FROM public.adl_teams WHERE name = 'Pagos y Transferencias')
),
(
  '1202123456', 'Mariana Isabel Franco Arias', 26, 8, 'Cll 55 #28-15, Medellín',
  (SELECT id FROM public.adl_roles WHERE name = 'Product Owner'),
  (SELECT id FROM public.adl_cities WHERE name = 'Medellín'),
  (SELECT id FROM public.adl_arls WHERE name = 'Positiva'),
  (SELECT id FROM public.adl_eps WHERE name = 'Sura EPS'),
  (SELECT id FROM public.adl_blood_types WHERE name = 'A+'),
  (SELECT id FROM public.adl_teams WHERE name = 'Infraestructura Cloud')
),
(
  '1213234567', 'Tomás Felipe Castaño Rojas', 4, 12, 'Cra 40 #5-22, Cartagena',
  (SELECT id FROM public.adl_roles WHERE name = 'Desarrollador Backend'),
  (SELECT id FROM public.adl_cities WHERE name = 'Cartagena'),
  (SELECT id FROM public.adl_arls WHERE name = 'Sura'),
  (SELECT id FROM public.adl_eps WHERE name = 'Compensar'),
  (SELECT id FROM public.adl_blood_types WHERE name = 'O+'),
  (SELECT id FROM public.adl_teams WHERE name = 'Canales Digitales')
);

-- ============================================================
-- NOVEDADES (30 registros variados)
-- ============================================================

INSERT INTO public.adl_news (state, worker_id, news_type_id, description, time_type, start_date, end_date, hours, minutes) VALUES
(
  'active',
  (SELECT id FROM public.adl_workers WHERE identification = '1010234567'),
  (SELECT id FROM public.adl_news_types WHERE convention = 'VA'),
  'Vacaciones primer semestre 2025',
  'days', '2025-08-11', '2025-08-22', NULL, NULL
),
(
  'completed',
  (SELECT id FROM public.adl_workers WHERE identification = '1020345678'),
  (SELECT id FROM public.adl_news_types WHERE convention = 'IN'),
  'Incapacidad por gripe fuerte',
  'days', '2025-07-01', '2025-07-03', NULL, NULL
),
(
  'active',
  (SELECT id FROM public.adl_workers WHERE identification = '1030456789'),
  (SELECT id FROM public.adl_news_types WHERE convention = 'AU'),
  'Cita médica particular',
  'hours', NULL, NULL, 4, NULL
),
(
  'active',
  (SELECT id FROM public.adl_workers WHERE identification = '1040567890'),
  (SELECT id FROM public.adl_news_types WHERE convention = 'DF'),
  'Día de la familia - evento corporativo',
  'days', '2025-08-15', '2025-08-15', NULL, NULL
),
(
  'cancelled',
  (SELECT id FROM public.adl_workers WHERE identification = '1050678901'),
  (SELECT id FROM public.adl_news_types WHERE convention = 'VA'),
  'Vacaciones canceladas por proyecto urgente',
  'days', '2025-09-01', '2025-09-12', NULL, NULL
);

INSERT INTO public.adl_news (state, worker_id, news_type_id, description, time_type, start_date, end_date, hours, minutes) VALUES
(
  'active',
  (SELECT id FROM public.adl_workers WHERE identification = '1060789012'),
  (SELECT id FROM public.adl_news_types WHERE convention = 'LM'),
  'Licencia de maternidad',
  'days', '2025-07-15', '2025-10-15', NULL, NULL
),
(
  'completed',
  (SELECT id FROM public.adl_workers WHERE identification = '1070890123'),
  (SELECT id FROM public.adl_news_types WHERE convention = 'CA'),
  'Capacitación AWS Solutions Architect',
  'days', '2025-06-10', '2025-06-14', NULL, NULL
),
(
  'active',
  (SELECT id FROM public.adl_workers WHERE identification = '1080901234'),
  (SELECT id FROM public.adl_news_types WHERE convention = 'PP'),
  'Permiso para trámite notarial',
  'hours', NULL, NULL, 3, NULL
),
(
  'active',
  (SELECT id FROM public.adl_workers WHERE identification = '1091012345'),
  (SELECT id FROM public.adl_news_types WHERE convention = 'CD'),
  'Calamidad - inundación en vivienda',
  'days', '2025-08-01', '2025-08-05', NULL, NULL
),
(
  'completed',
  (SELECT id FROM public.adl_workers WHERE identification = '1101123456'),
  (SELECT id FROM public.adl_news_types WHERE convention = 'AU'),
  'Ausencia por compromiso personal',
  'minutes', NULL, NULL, NULL, 120
),
(
  'active',
  (SELECT id FROM public.adl_workers WHERE identification = '1112234567'),
  (SELECT id FROM public.adl_news_types WHERE convention = 'VA'),
  'Vacaciones segunda quincena agosto',
  'days', '2025-08-18', '2025-08-29', NULL, NULL
),
(
  'active',
  (SELECT id FROM public.adl_workers WHERE identification = '1123345678'),
  (SELECT id FROM public.adl_news_types WHERE convention = 'IN'),
  'Incapacidad post cirugía menor',
  'days', '2025-08-04', '2025-08-08', NULL, NULL
);

INSERT INTO public.adl_news (state, worker_id, news_type_id, description, time_type, start_date, end_date, hours, minutes) VALUES
(
  'completed',
  (SELECT id FROM public.adl_workers WHERE identification = '1134456789'),
  (SELECT id FROM public.adl_news_types WHERE convention = 'PP'),
  'Permiso cita odontológica',
  'hours', NULL, NULL, 2, NULL
),
(
  'active',
  (SELECT id FROM public.adl_workers WHERE identification = '1145567890'),
  (SELECT id FROM public.adl_news_types WHERE convention = 'VA'),
  'Vacaciones septiembre',
  'days', '2025-09-15', '2025-09-26', NULL, NULL
),
(
  'active',
  (SELECT id FROM public.adl_workers WHERE identification = '1156678901'),
  (SELECT id FROM public.adl_news_types WHERE convention = 'CA'),
  'Certificación Kubernetes CKA',
  'days', '2025-08-25', '2025-08-29', NULL, NULL
),
(
  'completed',
  (SELECT id FROM public.adl_workers WHERE identification = '1167789012'),
  (SELECT id FROM public.adl_news_types WHERE convention = 'AU'),
  'Ausencia por mudanza',
  'days', '2025-07-20', '2025-07-21', NULL, NULL
),
(
  'active',
  (SELECT id FROM public.adl_workers WHERE identification = '1178890123'),
  (SELECT id FROM public.adl_news_types WHERE convention = 'LP'),
  'Licencia de paternidad',
  'days', '2025-08-10', '2025-08-24', NULL, NULL
),
(
  'cancelled',
  (SELECT id FROM public.adl_workers WHERE identification = '1189901234'),
  (SELECT id FROM public.adl_news_types WHERE convention = 'CA'),
  'Capacitación cancelada por el proveedor',
  'days', '2025-09-05', '2025-09-07', NULL, NULL
),
(
  'active',
  (SELECT id FROM public.adl_workers WHERE identification = '1191012345'),
  (SELECT id FROM public.adl_news_types WHERE convention = 'DF'),
  'Día de la familia - julio',
  'days', '2025-07-25', '2025-07-25', NULL, NULL
);

INSERT INTO public.adl_news (state, worker_id, news_type_id, description, time_type, start_date, end_date, hours, minutes) VALUES
(
  'active',
  (SELECT id FROM public.adl_workers WHERE identification = '1202123456'),
  (SELECT id FROM public.adl_news_types WHERE convention = 'IN'),
  'Incapacidad por dengue',
  'days', '2025-08-06', '2025-08-12', NULL, NULL
),
(
  'completed',
  (SELECT id FROM public.adl_workers WHERE identification = '1213234567'),
  (SELECT id FROM public.adl_news_types WHERE convention = 'PP'),
  'Permiso para graduación familiar',
  'hours', NULL, NULL, 5, NULL
),
(
  'active',
  (SELECT id FROM public.adl_workers WHERE identification = '1010234567'),
  (SELECT id FROM public.adl_news_types WHERE convention = 'AU'),
  'Cita con especialista',
  'minutes', NULL, NULL, NULL, 90
),
(
  'completed',
  (SELECT id FROM public.adl_workers WHERE identification = '1030456789'),
  (SELECT id FROM public.adl_news_types WHERE convention = 'CA'),
  'Workshop de liderazgo técnico',
  'days', '2025-06-20', '2025-06-21', NULL, NULL
),
(
  'active',
  (SELECT id FROM public.adl_workers WHERE identification = '1050678901'),
  (SELECT id FROM public.adl_news_types WHERE convention = 'IN'),
  'Incapacidad esguince tobillo',
  'days', '2025-08-03', '2025-08-07', NULL, NULL
),
(
  'active',
  (SELECT id FROM public.adl_workers WHERE identification = '1070890123'),
  (SELECT id FROM public.adl_news_types WHERE convention = 'AU'),
  'Diligencia bancaria personal',
  'minutes', NULL, NULL, NULL, 45
),
(
  'completed',
  (SELECT id FROM public.adl_workers WHERE identification = '1091012345'),
  (SELECT id FROM public.adl_news_types WHERE convention = 'VA'),
  'Vacaciones junio completadas',
  'days', '2025-06-02', '2025-06-13', NULL, NULL
);

INSERT INTO public.adl_news (state, worker_id, news_type_id, description, time_type, start_date, end_date, hours, minutes) VALUES
(
  'active',
  (SELECT id FROM public.adl_workers WHERE identification = '1020345678'),
  (SELECT id FROM public.adl_news_types WHERE convention = 'PP'),
  'Permiso para cita en embajada',
  'hours', NULL, NULL, 6, NULL
),
(
  'cancelled',
  (SELECT id FROM public.adl_workers WHERE identification = '1040567890'),
  (SELECT id FROM public.adl_news_types WHERE convention = 'VA'),
  'Vacaciones reprogramadas para diciembre',
  'days', '2025-10-01', '2025-10-10', NULL, NULL
),
(
  'active',
  (SELECT id FROM public.adl_workers WHERE identification = '1080901234'),
  (SELECT id FROM public.adl_news_types WHERE convention = 'CD'),
  'Calamidad - accidente familiar',
  'days', '2025-08-07', '2025-08-09', NULL, NULL
),
(
  'completed',
  (SELECT id FROM public.adl_workers WHERE identification = '1112234567'),
  (SELECT id FROM public.adl_news_types WHERE convention = 'IN'),
  'Incapacidad por COVID',
  'days', '2025-05-12', '2025-05-19', NULL, NULL
),
(
  'active',
  (SELECT id FROM public.adl_workers WHERE identification = '1167789012'),
  (SELECT id FROM public.adl_news_types WHERE convention = 'VA'),
  'Vacaciones fin de año anticipadas',
  'days', '2025-12-15', '2025-12-26', NULL, NULL
);

-- ============================================================
-- Resumen de datos insertados:
-- 6 equipos
-- 20 trabajadores
-- 30 novedades (variedad de tipos, estados y duraciones)
-- ============================================================
