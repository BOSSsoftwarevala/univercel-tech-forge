-- U135__create_boss_panel_tables.sql
-- Rollback: Remove all Boss Panel tables

DROP TABLE IF EXISTS public.boss_audit_logs CASCADE;
DROP TABLE IF EXISTS public.boss_alerts CASCADE;
DROP TABLE IF EXISTS public.boss_reports CASCADE;
DROP TABLE IF EXISTS public.boss_user_activity CASCADE;
DROP TABLE IF EXISTS public.boss_module_status CASCADE;
DROP TABLE IF EXISTS public.boss_financial_metrics CASCADE;
DROP TABLE IF EXISTS public.boss_system_metrics CASCADE;
