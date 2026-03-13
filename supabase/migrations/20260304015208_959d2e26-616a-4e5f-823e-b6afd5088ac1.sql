
-- =====================================================
-- DEEP SECURITY FIX: Critical RLS Hardening (Part 3)
-- =====================================================

-- 1. developer_registrations - PII + ID docs exposed
DROP POLICY IF EXISTS "Anyone can view registrations" ON public.developer_registrations;
DROP POLICY IF EXISTS "Public can view registrations" ON public.developer_registrations;
DROP POLICY IF EXISTS "Developers can view registrations" ON public.developer_registrations;
DROP POLICY IF EXISTS "developer_registrations_select" ON public.developer_registrations;

CREATE POLICY "dev_reg_own_or_admin"
ON public.developer_registrations FOR SELECT
USING (
  auth.uid() = user_id
  OR public.has_privileged_role(auth.uid())
);

-- 2. client_projects INSERT
DROP POLICY IF EXISTS "Anyone can insert projects" ON public.client_projects;

CREATE POLICY "client_projects_insert_auth"
ON public.client_projects FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL
  AND (
    auth.uid() = assigned_to
    OR public.has_role(auth.uid(), 'client_success'::app_role)
    OR public.has_privileged_role(auth.uid())
  )
);

-- 3. ai_billing_qr_codes
DROP POLICY IF EXISTS "System can manage QR codes" ON public.ai_billing_qr_codes;
CREATE POLICY "ai_billing_qr_select" ON public.ai_billing_qr_codes FOR SELECT USING (public.has_privileged_role(auth.uid()));
CREATE POLICY "ai_billing_qr_insert" ON public.ai_billing_qr_codes FOR INSERT WITH CHECK (public.has_privileged_role(auth.uid()));

-- 4. ai_billing_statements
DROP POLICY IF EXISTS "System can manage statements" ON public.ai_billing_statements;
CREATE POLICY "ai_billing_stmt_select" ON public.ai_billing_statements FOR SELECT USING (public.has_privileged_role(auth.uid()));
CREATE POLICY "ai_billing_stmt_insert" ON public.ai_billing_statements FOR INSERT WITH CHECK (public.has_privileged_role(auth.uid()));

-- 5. ai_efficiency_scores
DROP POLICY IF EXISTS "System can manage efficiency scores" ON public.ai_efficiency_scores;
CREATE POLICY "ai_efficiency_select" ON public.ai_efficiency_scores FOR SELECT USING (public.has_privileged_role(auth.uid()));
CREATE POLICY "ai_efficiency_insert" ON public.ai_efficiency_scores FOR INSERT WITH CHECK (public.has_privileged_role(auth.uid()));

-- 6. ai_fraud_detection
DROP POLICY IF EXISTS "System can manage fraud detection" ON public.ai_fraud_detection;
CREATE POLICY "ai_fraud_select" ON public.ai_fraud_detection FOR SELECT USING (public.has_privileged_role(auth.uid()));
CREATE POLICY "ai_fraud_insert" ON public.ai_fraud_detection FOR INSERT WITH CHECK (public.has_privileged_role(auth.uid()));

-- 7. behavior_patterns
DROP POLICY IF EXISTS "System can manage behavior patterns" ON public.behavior_patterns;
CREATE POLICY "behavior_patterns_select" ON public.behavior_patterns FOR SELECT USING (public.has_privileged_role(auth.uid()));
CREATE POLICY "behavior_patterns_insert" ON public.behavior_patterns FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 8. chatbot tables
DROP POLICY IF EXISTS "Authenticated can manage agents" ON public.chatbot_agents;
DROP POLICY IF EXISTS "Authenticated can manage automation rules" ON public.chatbot_automation_rules;
DROP POLICY IF EXISTS "Authenticated can manage conversations" ON public.chatbot_conversations;
DROP POLICY IF EXISTS "Authenticated can manage knowledge base" ON public.chatbot_knowledge_base;
DROP POLICY IF EXISTS "Authenticated can manage working hours" ON public.chatbot_working_hours;

CREATE POLICY "chatbot_agents_manage" ON public.chatbot_agents FOR ALL
USING (public.has_privileged_role(auth.uid()) OR public.has_role(auth.uid(), 'support'::app_role))
WITH CHECK (public.has_privileged_role(auth.uid()) OR public.has_role(auth.uid(), 'support'::app_role));

CREATE POLICY "chatbot_rules_manage" ON public.chatbot_automation_rules FOR ALL
USING (public.has_privileged_role(auth.uid()) OR public.has_role(auth.uid(), 'support'::app_role))
WITH CHECK (public.has_privileged_role(auth.uid()) OR public.has_role(auth.uid(), 'support'::app_role));

CREATE POLICY "chatbot_conversations_manage" ON public.chatbot_conversations FOR ALL
USING (public.has_privileged_role(auth.uid()) OR public.has_role(auth.uid(), 'support'::app_role))
WITH CHECK (public.has_privileged_role(auth.uid()) OR public.has_role(auth.uid(), 'support'::app_role));

CREATE POLICY "chatbot_kb_manage" ON public.chatbot_knowledge_base FOR ALL
USING (public.has_privileged_role(auth.uid()) OR public.has_role(auth.uid(), 'support'::app_role))
WITH CHECK (public.has_privileged_role(auth.uid()) OR public.has_role(auth.uid(), 'support'::app_role));

CREATE POLICY "chatbot_hours_manage" ON public.chatbot_working_hours FOR ALL
USING (public.has_privileged_role(auth.uid()) OR public.has_role(auth.uid(), 'support'::app_role))
WITH CHECK (public.has_privileged_role(auth.uid()) OR public.has_role(auth.uid(), 'support'::app_role));

-- 9. demo_projects
DROP POLICY IF EXISTS "Authenticated users can manage demos" ON public.demo_projects;
CREATE POLICY "demo_projects_select" ON public.demo_projects FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "demo_projects_manage" ON public.demo_projects FOR ALL
USING (public.has_privileged_role(auth.uid()) OR public.has_role(auth.uid(), 'demo_manager'::app_role))
WITH CHECK (public.has_privileged_role(auth.uid()) OR public.has_role(auth.uid(), 'demo_manager'::app_role));

-- 10. box_status
DROP POLICY IF EXISTS "Authenticated users can update box status" ON public.box_status;
CREATE POLICY "box_status_manage" ON public.box_status FOR ALL
USING (public.has_privileged_role(auth.uid()))
WITH CHECK (public.has_privileged_role(auth.uid()));

-- 11. demo_requests UPDATE
DROP POLICY IF EXISTS "Authenticated users can update requests" ON public.demo_requests;
CREATE POLICY "demo_requests_update" ON public.demo_requests FOR UPDATE
USING (public.has_privileged_role(auth.uid()) OR public.has_role(auth.uid(), 'demo_manager'::app_role));

-- 12. approval_steps UPDATE
DROP POLICY IF EXISTS "Update approval steps" ON public.approval_steps;
CREATE POLICY "approval_steps_update" ON public.approval_steps FOR UPDATE
USING (public.has_privileged_role(auth.uid()) OR auth.uid() = approver_id);

-- 13. ai_jobs UPDATE
DROP POLICY IF EXISTS "Update AI jobs" ON public.ai_jobs;
CREATE POLICY "ai_jobs_update" ON public.ai_jobs FOR UPDATE
USING (public.has_privileged_role(auth.uid()));

-- 14. Fix function search_path
CREATE OR REPLACE FUNCTION public.update_platform_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
