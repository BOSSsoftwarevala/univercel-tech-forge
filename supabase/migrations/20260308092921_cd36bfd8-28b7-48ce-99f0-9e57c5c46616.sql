-- Expand system event visibility for privileged control roles (master/super_admin)
DROP POLICY IF EXISTS "Boss can read system events" ON public.system_events;
CREATE POLICY "Privileged roles can read system events"
ON public.system_events
FOR SELECT
TO public
USING (
  has_role(auth.uid(), 'boss_owner'::app_role)
  OR has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'master'::app_role)
  OR has_role(auth.uid(), 'super_admin'::app_role)
);

DROP POLICY IF EXISTS "Boss can update system events" ON public.system_events;
CREATE POLICY "Privileged roles can update system events"
ON public.system_events
FOR UPDATE
TO public
USING (
  has_role(auth.uid(), 'boss_owner'::app_role)
  OR has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'master'::app_role)
  OR has_role(auth.uid(), 'super_admin'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'boss_owner'::app_role)
  OR has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'master'::app_role)
  OR has_role(auth.uid(), 'super_admin'::app_role)
);