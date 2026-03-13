-- Create central system_requests table for all frontend->boss requests
create table if not exists public.system_requests (
  id uuid primary key default gen_random_uuid(),
  action_type text not null,
  role_type text null,
  user_id uuid null,
  source text not null default 'frontend',
  payload_json jsonb not null default '{}'::jsonb,
  status text not null default 'NEW',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Helpful indexes
create index if not exists idx_system_requests_status_created_at
  on public.system_requests (status, created_at desc);
create index if not exists idx_system_requests_action_type_created_at
  on public.system_requests (action_type, created_at desc);
create index if not exists idx_system_requests_user_id_created_at
  on public.system_requests (user_id, created_at desc);

-- updated_at trigger
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql set search_path = public;

drop trigger if exists update_system_requests_updated_at on public.system_requests;
create trigger update_system_requests_updated_at
before update on public.system_requests
for each row execute function public.update_updated_at_column();

-- Enable RLS
alter table public.system_requests enable row level security;

-- Policies:
-- 1) Boss/master/super_admin can read all
create policy "Boss can read all system_requests"
on public.system_requests
for select
using (
  coalesce((auth.jwt() -> 'user_metadata' ->> 'role'), '') in ('boss_owner','boss','master','super_admin')
);

-- 2) Authenticated users can insert their own requests
create policy "Users can insert own system_requests"
on public.system_requests
for insert
with check (
  auth.uid() = user_id
);

-- 3) Allow anonymous (public) inserts ONLY when user_id is null and source='frontend'
create policy "Public can insert anonymous system_requests"
on public.system_requests
for insert
with check (
  auth.role() = 'anon'
  and user_id is null
  and source = 'frontend'
);

-- 4) Boss/master/super_admin can update status (approve/reject)
create policy "Boss can update system_requests"
on public.system_requests
for update
using (
  coalesce((auth.jwt() -> 'user_metadata' ->> 'role'), '') in ('boss_owner','boss','master','super_admin')
)
with check (
  coalesce((auth.jwt() -> 'user_metadata' ->> 'role'), '') in ('boss_owner','boss','master','super_admin')
);

-- Realtime (optional) for instant Boss updates
alter publication supabase_realtime add table public.system_requests;