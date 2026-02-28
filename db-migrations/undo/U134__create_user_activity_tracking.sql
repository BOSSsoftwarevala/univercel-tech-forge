-- U134__create_user_activity_tracking.sql
-- Rollback: Remove user activity tracking tables

DROP TABLE IF EXISTS public.user_activity CASCADE;
DROP TABLE IF EXISTS public.user_sessions CASCADE;
