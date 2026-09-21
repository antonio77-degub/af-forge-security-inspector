create extension if not exists pgcrypto;

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.project_members (
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','admin','member','viewer')),
  created_at timestamptz not null default now(),
  primary key (project_id, user_id)
);

create table public.assets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  asset_type text not null check (asset_type in ('domain','url','ip','asn','certificate','mail_server','service','technology','subdomain')),
  value text not null,
  normalized_value text not null,
  is_primary boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, asset_type, normalized_value)
);

create table public.asset_relations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  source_asset_id uuid not null references public.assets(id) on delete cascade,
  target_asset_id uuid not null references public.assets(id) on delete cascade,
  relation_type text not null,
  evidence jsonb not null default '{}'::jsonb,
  first_observed_at timestamptz not null default now(),
  last_observed_at timestamptz not null default now(),
  check (source_asset_id <> target_asset_id),
  unique (project_id, source_asset_id, target_asset_id, relation_type)
);

create table public.scan_presets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.scans (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  asset_id uuid references public.assets(id) on delete set null,
  initiated_by uuid references auth.users(id) on delete set null,
  mode text not null check (mode in ('quick','deep','custom','retest','monitor')),
  status text not null check (status in ('queued','running','completed','partial','failed','cancelled')),
  requested_config jsonb not null default '{}'::jsonb,
  score numeric(5,2) check (score between 0 and 100),
  coverage numeric(5,2) check (coverage between 0 and 100),
  confidence text check (confidence in ('high','medium','low')),
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.scan_modules (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  scan_id uuid not null references public.scans(id) on delete cascade,
  module_key text not null,
  status text not null check (status in ('queued','running','pass','warning','fail','unknown','not_applicable','error','timeout')),
  score numeric(5,2) check (score between 0 and 100),
  coverage numeric(5,2) check (coverage between 0 and 100),
  error_code text,
  started_at timestamptz,
  finished_at timestamptz,
  unique (scan_id, module_key)
);

create table public.provider_runs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  scan_id uuid not null references public.scans(id) on delete cascade,
  scan_module_id uuid references public.scan_modules(id) on delete set null,
  provider_key text not null,
  status text not null check (status in ('queued','running','success','partial','error','timeout','rate_limited','skipped')),
  attempt integer not null default 1 check (attempt > 0),
  latency_ms integer check (latency_ms >= 0),
  error_code text,
  error_class text,
  response_meta jsonb not null default '{}'::jsonb,
  started_at timestamptz,
  finished_at timestamptz
);

create table public.findings (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  scan_id uuid not null references public.scans(id) on delete cascade,
  asset_id uuid references public.assets(id) on delete set null,
  module_key text not null,
  fingerprint text not null,
  status text not null check (status in ('pass','warning','fail','unknown','not_applicable')),
  severity text not null check (severity in ('critical','high','medium','low','info')),
  confidence text not null check (confidence in ('high','medium','low')),
  title_simple text not null,
  explanation_simple text not null,
  technical_title text not null,
  technical_summary text,
  provider_key text not null,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  unique (scan_id, fingerprint)
);

create table public.finding_evidence (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  finding_id uuid not null references public.findings(id) on delete cascade,
  evidence_type text not null,
  summary text,
  data jsonb not null default '{}'::jsonb,
  source_url text,
  observed_at timestamptz not null default now()
);

create table public.finding_remediations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  finding_id uuid not null references public.findings(id) on delete cascade,
  platform_key text,
  summary text not null,
  instructions jsonb not null default '[]'::jsonb,
  reference_links jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table public.scan_snapshots (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  scan_id uuid not null references public.scans(id) on delete cascade,
  asset_id uuid references public.assets(id) on delete set null,
  snapshot_kind text not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create table public.scan_changes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  from_scan_id uuid references public.scans(id) on delete set null,
  to_scan_id uuid not null references public.scans(id) on delete cascade,
  finding_id uuid references public.findings(id) on delete set null,
  change_type text not null check (change_type in ('new','fixed','regressed','unchanged','changed')),
  summary text not null,
  created_at timestamptz not null default now()
);

create table public.monitors (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  asset_id uuid not null references public.assets(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete cascade,
  monitor_type text not null check (monitor_type in ('security','uptime','certificate','dns','email','exposure','vulnerability','threat')),
  interval_minutes integer not null check (interval_minutes >= 60),
  enabled boolean not null default true,
  config jsonb not null default '{}'::jsonb,
  next_run_at timestamptz,
  last_run_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.monitor_runs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  monitor_id uuid not null references public.monitors(id) on delete cascade,
  scan_id uuid references public.scans(id) on delete set null,
  status text not null check (status in ('queued','running','completed','partial','failed','cancelled')),
  started_at timestamptz,
  finished_at timestamptz,
  error_code text,
  created_at timestamptz not null default now()
);

create table public.uptime_checks (
  id bigint generated always as identity primary key,
  project_id uuid not null references public.projects(id) on delete cascade,
  monitor_id uuid not null references public.monitors(id) on delete cascade,
  asset_id uuid not null references public.assets(id) on delete cascade,
  checked_at timestamptz not null default now(),
  available boolean not null,
  status_code integer,
  latency_ms integer check (latency_ms >= 0),
  error_code text
);

create table public.alerts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  asset_id uuid references public.assets(id) on delete set null,
  finding_id uuid references public.findings(id) on delete set null,
  monitor_id uuid references public.monitors(id) on delete set null,
  category text not null,
  severity text not null check (severity in ('critical','high','medium','low','info')),
  title text not null,
  message text not null,
  status text not null default 'open' check (status in ('open','acknowledged','resolved')),
  created_at timestamptz not null default now(),
  acknowledged_at timestamptz,
  resolved_at timestamptz
);

create table public.alert_events (
  id bigint generated always as identity primary key,
  project_id uuid not null references public.projects(id) on delete cascade,
  alert_id uuid not null references public.alerts(id) on delete cascade,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  scan_id uuid references public.scans(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  report_type text not null check (report_type in ('executive','technical','full')),
  status text not null check (status in ('queued','building','ready','failed')),
  title text not null,
  config jsonb not null default '{}'::jsonb,
  storage_path text,
  created_at timestamptz not null default now(),
  ready_at timestamptz
);

create table public.report_shares (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  report_id uuid not null references public.reports(id) on delete cascade,
  created_by uuid references auth.users(id) on delete set null,
  token_hash text not null unique,
  expires_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.status_pages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  created_by uuid references auth.users(id) on delete set null,
  name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  is_public boolean not null default false,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.status_page_components (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  status_page_id uuid not null references public.status_pages(id) on delete cascade,
  asset_id uuid references public.assets(id) on delete set null,
  label text not null,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.provider_usage (
  id bigint generated always as identity primary key,
  project_id uuid not null references public.projects(id) on delete cascade,
  scan_id uuid references public.scans(id) on delete set null,
  provider_key text not null,
  request_count integer not null default 0 check (request_count >= 0),
  billable_units numeric(16,6) not null default 0 check (billable_units >= 0),
  estimated_cost numeric(16,6) not null default 0 check (estimated_cost >= 0),
  currency text not null default 'EUR',
  recorded_at timestamptz not null default now()
);

create table public.audit_events (
  id bigint generated always as identity primary key,
  project_id uuid not null references public.projects(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger projects_set_updated_at before update on public.projects
for each row execute function public.set_updated_at();
create trigger assets_set_updated_at before update on public.assets
for each row execute function public.set_updated_at();
create trigger scan_presets_set_updated_at before update on public.scan_presets
for each row execute function public.set_updated_at();
create trigger monitors_set_updated_at before update on public.monitors
for each row execute function public.set_updated_at();
create trigger status_pages_set_updated_at before update on public.status_pages
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  insert into public.profiles (user_id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', split_part(coalesce(new.email, ''), '@', 1)))
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.handle_new_project()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  insert into public.project_members (project_id, user_id, role)
  values (new.id, new.owner_user_id, 'owner')
  on conflict (project_id, user_id) do update set role = 'owner';
  return new;
end;
$$;

create trigger on_project_created
after insert on public.projects
for each row execute function public.handle_new_project();

create or replace function public.is_project_member(target_project_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.project_members pm
    where pm.project_id = target_project_id
      and pm.user_id = auth.uid()
  );
$$;

create or replace function public.project_role(target_project_id uuid)
returns text
language sql
stable
security definer
set search_path = public, auth
as $$
  select pm.role
  from public.project_members pm
  where pm.project_id = target_project_id
    and pm.user_id = auth.uid()
  limit 1;
$$;

create or replace function public.can_write_project(target_project_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select coalesce(public.project_role(target_project_id) in ('owner','admin','member'), false);
$$;

create or replace function public.is_project_owner(target_project_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1 from public.projects p
    where p.id = target_project_id
      and p.owner_user_id = auth.uid()
  );
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.handle_new_project() from public, anon, authenticated;
revoke all on function public.is_project_member(uuid) from public, anon;
revoke all on function public.project_role(uuid) from public, anon;
revoke all on function public.can_write_project(uuid) from public, anon;
revoke all on function public.is_project_owner(uuid) from public, anon;
grant execute on function public.is_project_member(uuid) to authenticated;
grant execute on function public.project_role(uuid) to authenticated;
grant execute on function public.can_write_project(uuid) to authenticated;
grant execute on function public.is_project_owner(uuid) to authenticated;

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.assets enable row level security;
alter table public.asset_relations enable row level security;
alter table public.scan_presets enable row level security;
alter table public.scans enable row level security;
alter table public.scan_modules enable row level security;
alter table public.provider_runs enable row level security;
alter table public.findings enable row level security;
alter table public.finding_evidence enable row level security;
alter table public.finding_remediations enable row level security;
alter table public.scan_snapshots enable row level security;
alter table public.scan_changes enable row level security;
alter table public.monitors enable row level security;
alter table public.monitor_runs enable row level security;
alter table public.uptime_checks enable row level security;
alter table public.alerts enable row level security;
alter table public.alert_events enable row level security;
alter table public.reports enable row level security;
alter table public.report_shares enable row level security;
alter table public.status_pages enable row level security;
alter table public.status_page_components enable row level security;
alter table public.provider_usage enable row level security;
alter table public.audit_events enable row level security;

create policy profiles_select_self on public.profiles
for select to authenticated using (user_id = auth.uid());
create policy profiles_update_self on public.profiles
for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy projects_select_member on public.projects
for select to authenticated using (public.is_project_member(id) or owner_user_id = auth.uid());
create policy projects_insert_self on public.projects
for insert to authenticated with check (owner_user_id = auth.uid());
create policy projects_update_owner on public.projects
for update to authenticated using (owner_user_id = auth.uid()) with check (owner_user_id = auth.uid());
create policy projects_delete_owner on public.projects
for delete to authenticated using (owner_user_id = auth.uid());

create policy project_members_select_member on public.project_members
for select to authenticated using (public.is_project_member(project_id));
create policy project_members_insert_owner on public.project_members
for insert to authenticated
with check (
  public.is_project_owner(project_id)
  and (
    role <> 'owner'
    or user_id = auth.uid()
  )
);
create policy project_members_update_owner on public.project_members
for update to authenticated
using (public.is_project_owner(project_id))
with check (
  public.is_project_owner(project_id)
  and (
    role <> 'owner'
    or user_id = auth.uid()
  )
);
create policy project_members_delete_owner on public.project_members
for delete to authenticated
using (
  public.is_project_owner(project_id)
  and not (role = 'owner' and user_id = auth.uid())
);

create policy assets_select_member on public.assets
for select to authenticated using (public.is_project_member(project_id));
create policy assets_write_member on public.assets
for all to authenticated using (public.can_write_project(project_id)) with check (public.can_write_project(project_id));

create policy asset_relations_select_member on public.asset_relations
for select to authenticated using (public.is_project_member(project_id));
create policy asset_relations_write_member on public.asset_relations
for all to authenticated using (public.can_write_project(project_id)) with check (public.can_write_project(project_id));

create policy scan_presets_select_member on public.scan_presets
for select to authenticated using (public.is_project_member(project_id));
create policy scan_presets_write_member on public.scan_presets
for all to authenticated using (public.can_write_project(project_id)) with check (public.can_write_project(project_id));

create policy monitors_select_member on public.monitors
for select to authenticated using (public.is_project_member(project_id));
create policy monitors_write_member on public.monitors
for all to authenticated using (public.can_write_project(project_id)) with check (public.can_write_project(project_id));

create policy status_pages_select_member on public.status_pages
for select to authenticated using (public.is_project_member(project_id));
create policy status_pages_write_member on public.status_pages
for all to authenticated using (public.can_write_project(project_id)) with check (public.can_write_project(project_id));

create policy status_page_components_select_member on public.status_page_components
for select to authenticated using (public.is_project_member(project_id));
create policy status_page_components_write_member on public.status_page_components
for all to authenticated using (public.can_write_project(project_id)) with check (public.can_write_project(project_id));

create policy scans_select_member on public.scans
for select to authenticated using (public.is_project_member(project_id));
create policy scan_modules_select_member on public.scan_modules
for select to authenticated using (public.is_project_member(project_id));
create policy provider_runs_select_member on public.provider_runs
for select to authenticated using (public.is_project_member(project_id));
create policy findings_select_member on public.findings
for select to authenticated using (public.is_project_member(project_id));
create policy finding_evidence_select_member on public.finding_evidence
for select to authenticated using (public.is_project_member(project_id));
create policy finding_remediations_select_member on public.finding_remediations
for select to authenticated using (public.is_project_member(project_id));
create policy scan_snapshots_select_member on public.scan_snapshots
for select to authenticated using (public.is_project_member(project_id));
create policy scan_changes_select_member on public.scan_changes
for select to authenticated using (public.is_project_member(project_id));
create policy monitor_runs_select_member on public.monitor_runs
for select to authenticated using (public.is_project_member(project_id));
create policy uptime_checks_select_member on public.uptime_checks
for select to authenticated using (public.is_project_member(project_id));
create policy alerts_select_member on public.alerts
for select to authenticated using (public.is_project_member(project_id));
create policy alert_events_select_member on public.alert_events
for select to authenticated using (public.is_project_member(project_id));
create policy reports_select_member on public.reports
for select to authenticated using (public.is_project_member(project_id));
create policy report_shares_select_member on public.report_shares
for select to authenticated using (public.is_project_member(project_id));
create policy provider_usage_select_member on public.provider_usage
for select to authenticated using (public.is_project_member(project_id));
create policy audit_events_select_member on public.audit_events
for select to authenticated using (public.is_project_member(project_id));

revoke all on all tables in schema public from anon;
revoke all on all sequences in schema public from anon;

grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.projects to authenticated;
grant select, insert, update, delete on public.project_members to authenticated;
grant select, insert, update, delete on public.assets to authenticated;
grant select, insert, update, delete on public.asset_relations to authenticated;
grant select, insert, update, delete on public.scan_presets to authenticated;
grant select, insert, update, delete on public.monitors to authenticated;
grant select, insert, update, delete on public.status_pages to authenticated;
grant select, insert, update, delete on public.status_page_components to authenticated;

grant select on public.scans to authenticated;
grant select on public.scan_modules to authenticated;
grant select on public.provider_runs to authenticated;
grant select on public.findings to authenticated;
grant select on public.finding_evidence to authenticated;
grant select on public.finding_remediations to authenticated;
grant select on public.scan_snapshots to authenticated;
grant select on public.scan_changes to authenticated;
grant select on public.monitor_runs to authenticated;
grant select on public.uptime_checks to authenticated;
grant select on public.alerts to authenticated;
grant select on public.alert_events to authenticated;
grant select on public.reports to authenticated;
grant select on public.report_shares to authenticated;
grant select on public.provider_usage to authenticated;
grant select on public.audit_events to authenticated;

create index assets_project_idx on public.assets(project_id);
create index assets_normalized_idx on public.assets(normalized_value);
create index asset_relations_project_idx on public.asset_relations(project_id);
create index scans_project_created_idx on public.scans(project_id, created_at desc);
create index scans_asset_created_idx on public.scans(asset_id, created_at desc);
create index scan_modules_scan_idx on public.scan_modules(scan_id);
create index provider_runs_scan_idx on public.provider_runs(scan_id);
create index provider_runs_provider_idx on public.provider_runs(provider_key, finished_at desc);
create index findings_project_scan_idx on public.findings(project_id, scan_id);
create index findings_fingerprint_idx on public.findings(project_id, fingerprint);
create index finding_evidence_finding_idx on public.finding_evidence(finding_id);
create index scan_changes_to_scan_idx on public.scan_changes(to_scan_id);
create index monitors_due_idx on public.monitors(enabled, next_run_at);
create index monitor_runs_monitor_idx on public.monitor_runs(monitor_id, created_at desc);
create index uptime_checks_monitor_time_idx on public.uptime_checks(monitor_id, checked_at desc);
create index alerts_project_status_idx on public.alerts(project_id, status, created_at desc);
create index reports_project_created_idx on public.reports(project_id, created_at desc);
create index audit_events_project_time_idx on public.audit_events(project_id, created_at desc);
