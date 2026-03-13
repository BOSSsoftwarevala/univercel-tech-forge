-- U133__add_audit_logging_table.sql
-- Rollback: Remove audit logging table

DROP TABLE IF EXISTS public.audit_logs CASCADE;
