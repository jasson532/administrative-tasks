-- ============================================================
-- Actualizar todas las novedades de 2025 a 2026
-- ============================================================

UPDATE public.adl_news
SET start_date = start_date + INTERVAL '1 year'
WHERE start_date IS NOT NULL AND EXTRACT(YEAR FROM start_date) = 2025;

UPDATE public.adl_news
SET end_date = end_date + INTERVAL '1 year'
WHERE end_date IS NOT NULL AND EXTRACT(YEAR FROM end_date) = 2025;
