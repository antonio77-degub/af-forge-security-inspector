-- B1 least-privilege grants.
-- RLS decides row access; GRANT decides object/action reachability.

revoke all privileges on all tables in schema public from authenticated;

-- Self profile: user may read/update only (RLS restricts to auth.uid()).
grant select, update on table public.profiles to authenticated;

-- Client-managed project configuration.
grant select, insert, update, delete on table
  public.projects,
  public.project_members,
  public.assets,
  public.asset_relations,
  public.scan_presets,
  public.monitors,
  public.status_pages,
  public.status_page_components
to authenticated;

-- Runtime/evidence/output data is browser read-only in B1.
grant select on table
  public.scans,
  public.scan_modules,
  public.provider_runs,
  public.findings,
  public.finding_evidence,
  public.finding_remediations,
  public.scan_snapshots,
  public.scan_changes,
  public.monitor_runs,
  public.uptime_checks,
  public.alerts,
  public.alert_events,
  public.reports,
  public.report_shares,
  public.provider_usage,
  public.audit_events
to authenticated;

-- Future public objects are opt-in for browser roles.
alter default privileges for role postgres in schema public
  revoke all on tables from anon, authenticated;

alter default privileges for role postgres in schema public
  revoke all on sequences from anon, authenticated;
