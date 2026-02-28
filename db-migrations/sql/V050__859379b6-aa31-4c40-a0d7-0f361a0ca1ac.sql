
-- Fix the security definer view by dropping and recreating as SECURITY INVOKER
DROP VIEW IF EXISTS public.user_compliance_status;

CREATE VIEW public.user_compliance_status
WITH (security_invoker = true)
AS
SELECT 
  ur.user_id,
  ur.role,
  vr.is_activated as is_verified,
  vr.current_step as verification_step,
  vr.risk_score,
  (SELECT COUNT(*) FROM penalty_records pr WHERE pr.user_id = ur.user_id AND pr.is_active = true) as active_penalties,
  (SELECT MAX(penalty_level) FROM penalty_records pr WHERE pr.user_id = ur.user_id AND pr.is_active = true) as highest_penalty_level,
  (SELECT agreement_accepted_at FROM role_clause_agreements rca WHERE rca.user_id = ur.user_id AND rca.role = ur.role ORDER BY accepted_at DESC LIMIT 1) as last_agreement_date
FROM public.user_roles ur
LEFT JOIN public.verification_records vr ON ur.user_id = vr.user_id AND ur.role = vr.role;
