-- Recreate boss policies (enum-safe)

-- ensure old broken policies are gone
 drop policy if exists "Boss can read all system_requests" on public.system_requests;
 drop policy if exists "Boss can update system_requests" on public.system_requests;

create policy "Boss can read all system_requests"
on public.system_requests
for select
using (
  public.has_role(auth.uid(), 'boss_owner'::public.app_role)
  or public.has_role(auth.uid(), 'master'::public.app_role)
  or public.has_role(auth.uid(), 'super_admin'::public.app_role)
);

create policy "Boss can update system_requests"
on public.system_requests
for update
using (
  public.has_role(auth.uid(), 'boss_owner'::public.app_role)
  or public.has_role(auth.uid(), 'master'::public.app_role)
  or public.has_role(auth.uid(), 'super_admin'::public.app_role)
)
with check (
  public.has_role(auth.uid(), 'boss_owner'::public.app_role)
  or public.has_role(auth.uid(), 'master'::public.app_role)
  or public.has_role(auth.uid(), 'super_admin'::public.app_role)
);