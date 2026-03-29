create table if not exists public.full_auto_runs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  status text not null default 'scanning',
  project_scope text not null default 'global',
  environment text not null default 'production',
  issues jsonb not null default '[]'::jsonb,
  fixes jsonb not null default '[]'::jsonb,
  tests jsonb not null default '[]'::jsonb,
  verification jsonb not null default '[]'::jsonb,
  summary jsonb not null default '{}'::jsonb,
  learning jsonb not null default '{}'::jsonb,
  deployment jsonb not null default '{}'::jsonb,
  approval_id uuid references public.approvals(id) on delete set null,
  approved_at timestamptz,
  rejected_at timestamptz,
  deployed_at timestamptz,
  boss_notes text,
  last_error text
);

create index if not exists idx_full_auto_runs_status on public.full_auto_runs(status);
create index if not exists idx_full_auto_runs_created_at on public.full_auto_runs(created_at desc);
create index if not exists idx_full_auto_runs_approval_id on public.full_auto_runs(approval_id);

create or replace function public.update_full_auto_runs_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_full_auto_runs_updated_at on public.full_auto_runs;

create trigger trg_full_auto_runs_updated_at
before update on public.full_auto_runs
for each row
execute function public.update_full_auto_runs_updated_at();