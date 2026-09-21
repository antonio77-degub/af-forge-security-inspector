create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create or replace function private.is_project_member(target_project_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, auth, private
as $$
  select exists (
    select 1
    from public.project_members pm
    where pm.project_id = target_project_id
      and pm.user_id = auth.uid()
  );
$$;

create or replace function private.project_role(target_project_id uuid)
returns text
language sql
stable
security definer
set search_path = public, auth, private
as $$
  select pm.role
  from public.project_members pm
  where pm.project_id = target_project_id
    and pm.user_id = auth.uid()
  limit 1;
$$;

create or replace function private.can_write_project(target_project_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, auth, private
as $$
  select coalesce(private.project_role(target_project_id) in ('owner','admin','member'), false);
$$;

create or replace function private.is_project_owner(target_project_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, auth, private
as $$
  select exists (
    select 1
    from public.projects p
    where p.id = target_project_id
      and p.owner_user_id = auth.uid()
  );
$$;

revoke all on function private.is_project_member(uuid) from public, anon;
revoke all on function private.project_role(uuid) from public, anon;
revoke all on function private.can_write_project(uuid) from public, anon;
revoke all on function private.is_project_owner(uuid) from public, anon;
grant execute on function private.is_project_member(uuid) to authenticated;
grant execute on function private.project_role(uuid) to authenticated;
grant execute on function private.can_write_project(uuid) to authenticated;
grant execute on function private.is_project_owner(uuid) to authenticated;

alter policy projects_select_member on public.projects
using (private.is_project_member(id) or owner_user_id = auth.uid());

alter policy project_members_select_member on public.project_members
using (private.is_project_member(project_id));
alter policy project_members_insert_owner on public.project_members
with check (
  private.is_project_owner(project_id)
  and (role <> 'owner' or user_id = auth.uid())
);
alter policy project_members_update_owner on public.project_members
using (private.is_project_owner(project_id))
with check (
  private.is_project_owner(project_id)
  and (role <> 'owner' or user_id = auth.uid())
);
alter policy project_members_delete_owner on public.project_members
using (
  private.is_project_owner(project_id)
  and not (role = 'owner' and user_id = auth.uid())
);

alter policy assets_select_member on public.assets
using (private.is_project_member(project_id));
alter policy assets_write_member on public.assets
using (private.can_write_project(project_id))
with check (private.can_write_project(project_id));

alter policy asset_relations_select_member on public.asset_relations
using (private.is_project_member(project_id));
alter policy asset_relations_write_member on public.asset_relations
using (private.can_write_project(project_id))
with check (private.can_write_project(project_id));

alter policy scan_presets_select_member on public.scan_presets
using (private.is_project_member(project_id));
alter policy scan_presets_write_member on public.scan_presets
using (private.can_write_project(project_id))
with check (private.can_write_project(project_id));

alter policy monitors_select_member on public.monitors
using (private.is_project_member(project_id));
alter policy monitors_write_member on public.monitors
using (private.can_write_project(project_id))
with check (private.can_write_project(project_id));

alter policy status_pages_select_member on public.status_pages
using (private.is_project_member(project_id));
alter policy status_pages_write_member on public.status_pages
using (private.can_write_project(project_id))
with check (private.can_write_project(project_id));

alter policy status_page_components_select_member on public.status_page_components
using (private.is_project_member(project_id));
alter policy status_page_components_write_member on public.status_page_components
using (private.can_write_project(project_id))
with check (private.can_write_project(project_id));

alter policy scans_select_member on public.scans
using (private.is_project_member(project_id));
alter policy scan_modules_select_member on public.scan_modules
using (private.is_project_member(project_id));
alter policy provider_runs_select_member on public.provider_runs
using (private.is_project_member(project_id));
alter policy findings_select_member on public.findings
using (private.is_project_member(project_id));
alter policy finding_evidence_select_member on public.finding_evidence
using (private.is_project_member(project_id));
alter policy finding_remediations_select_member on public.finding_remediations
using (private.is_project_member(project_id));
alter policy scan_snapshots_select_member on public.scan_snapshots
using (private.is_project_member(project_id));
alter policy scan_changes_select_member on public.scan_changes
using (private.is_project_member(project_id));
alter policy monitor_runs_select_member on public.monitor_runs
using (private.is_project_member(project_id));
alter policy uptime_checks_select_member on public.uptime_checks
using (private.is_project_member(project_id));
alter policy alerts_select_member on public.alerts
using (private.is_project_member(project_id));
alter policy alert_events_select_member on public.alert_events
using (private.is_project_member(project_id));
alter policy reports_select_member on public.reports
using (private.is_project_member(project_id));
alter policy report_shares_select_member on public.report_shares
using (private.is_project_member(project_id));
alter policy provider_usage_select_member on public.provider_usage
using (private.is_project_member(project_id));
alter policy audit_events_select_member on public.audit_events
using (private.is_project_member(project_id));

drop function public.can_write_project(uuid);
drop function public.project_role(uuid);
drop function public.is_project_owner(uuid);
drop function public.is_project_member(uuid);
