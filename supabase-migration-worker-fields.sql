-- ============================================================
-- Migración: Agregar email, start_date y status a adl_workers
-- ============================================================

-- 1. Agregar columnas
ALTER TABLE public.adl_workers ADD COLUMN IF NOT EXISTS email VARCHAR(200);
ALTER TABLE public.adl_workers ADD COLUMN IF NOT EXISTS start_date DATE;
ALTER TABLE public.adl_workers ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive'));

-- 2. Crear índice para status
CREATE INDEX IF NOT EXISTS idx_adl_workers_status ON public.adl_workers(status);

-- 3. Actualizar workers existentes con data de prueba
UPDATE public.adl_workers SET email = 'carlos.martinez@adl.com.co', start_date = '2022-03-15', status = 'active' WHERE identification = '1010234567';
UPDATE public.adl_workers SET email = 'maria.rodriguez@adl.com.co', start_date = '2021-08-01', status = 'active' WHERE identification = '1020345678';
UPDATE public.adl_workers SET email = 'juan.perez@adl.com.co', start_date = '2020-01-10', status = 'active' WHERE identification = '1030456789';
UPDATE public.adl_workers SET email = 'laura.garcia@adl.com.co', start_date = '2023-02-20', status = 'active' WHERE identification = '1040567890';
UPDATE public.adl_workers SET email = 'andres.ramirez@adl.com.co', start_date = '2021-06-01', status = 'active' WHERE identification = '1050678901';
UPDATE public.adl_workers SET email = 'daniela.moreno@adl.com.co', start_date = '2022-11-15', status = 'active' WHERE identification = '1060789012';
UPDATE public.adl_workers SET email = 'santiago.herrera@adl.com.co', start_date = '2020-09-01', status = 'active' WHERE identification = '1070890123';
UPDATE public.adl_workers SET email = 'valentina.castillo@adl.com.co', start_date = '2023-04-10', status = 'active' WHERE identification = '1080901234';
UPDATE public.adl_workers SET email = 'diego.munoz@adl.com.co', start_date = '2019-07-22', status = 'active' WHERE identification = '1091012345';
UPDATE public.adl_workers SET email = 'camila.jimenez@adl.com.co', start_date = '2022-01-03', status = 'active' WHERE identification = '1101123456';
UPDATE public.adl_workers SET email = 'sebastian.torres@adl.com.co', start_date = '2023-09-15', status = 'active' WHERE identification = '1112234567';
UPDATE public.adl_workers SET email = 'natalia.restrepo@adl.com.co', start_date = '2021-03-08', status = 'inactive' WHERE identification = '1123345678';
UPDATE public.adl_workers SET email = 'julian.ospina@adl.com.co', start_date = '2022-07-20', status = 'active' WHERE identification = '1134456789';
UPDATE public.adl_workers SET email = 'isabella.cardona@adl.com.co', start_date = '2023-01-15', status = 'active' WHERE identification = '1145567890';
UPDATE public.adl_workers SET email = 'mateo.vargas@adl.com.co', start_date = '2020-05-11', status = 'active' WHERE identification = '1156678901';
UPDATE public.adl_workers SET email = 'gabriela.sanchez@adl.com.co', start_date = '2022-10-01', status = 'active' WHERE identification = '1167789012';
UPDATE public.adl_workers SET email = 'nicolas.aguirre@adl.com.co', start_date = '2019-11-18', status = 'active' WHERE identification = '1178890123';
UPDATE public.adl_workers SET email = 'paula.gutierrez@adl.com.co', start_date = '2023-06-01', status = 'inactive' WHERE identification = '1189901234';
UPDATE public.adl_workers SET email = 'alejandro.duarte@adl.com.co', start_date = '2021-12-10', status = 'active' WHERE identification = '1191012345';
UPDATE public.adl_workers SET email = 'mariana.franco@adl.com.co', start_date = '2022-04-25', status = 'active' WHERE identification = '1202123456';
UPDATE public.adl_workers SET email = 'tomas.castano@adl.com.co', start_date = '2023-08-14', status = 'active' WHERE identification = '1213234567';
UPDATE public.adl_workers SET email = 'ricardo.lozano@adl.com.co', start_date = '2024-01-08', status = 'active' WHERE identification = '2001050801';
UPDATE public.adl_workers SET email = 'ana.betancourt@adl.com.co', start_date = '2022-05-20', status = 'active' WHERE identification = '2002050802';
UPDATE public.adl_workers SET email = 'felipe.correa@adl.com.co', start_date = '2021-09-12', status = 'active' WHERE identification = '2003060801';
UPDATE public.adl_workers SET email = 'lorena.suarez@adl.com.co', start_date = '2023-03-01', status = 'active' WHERE identification = '2004080801';
UPDATE public.adl_workers SET email = 'martin.rios@adl.com.co', start_date = '2020-11-05', status = 'active' WHERE identification = '2005100801';
UPDATE public.adl_workers SET email = 'catalina.duque@adl.com.co', start_date = '2022-08-22', status = 'active' WHERE identification = '2006120801';
UPDATE public.adl_workers SET email = 'sergio.mejia@adl.com.co', start_date = '2019-04-15', status = 'active' WHERE identification = '2007130801';
UPDATE public.adl_workers SET email = 'valentina.ocampo@adl.com.co', start_date = '2024-02-01', status = 'active' WHERE identification = '2008150801';
UPDATE public.adl_workers SET email = 'andres.gomez@adl.com.co', start_date = '2021-01-20', status = 'active' WHERE identification = '2009180801';
