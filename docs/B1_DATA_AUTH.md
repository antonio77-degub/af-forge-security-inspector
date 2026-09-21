# B1 — Data & Auth

## Goal
Establish the persistent multi-tenant data model and authentication boundary for the complete V1.

## Auth contract
- Guest: public/safe scans and developer tools through backend endpoints; guest users receive no direct database table access.
- Authenticated: saved assets, history, monitoring, alerts, reports and status pages.
- Client uses only Supabase URL + publishable key.
- Service-role/provider secrets are server-only.
- Passwordless email OTP/magic-link with PKCE is the initial sign-in method.

## Data contract
Core entities: profiles, projects, project_members, assets, asset_relations, scans, scan_modules, provider_runs, findings, finding_evidence, finding_remediations, scan_snapshots, scan_changes, monitors, monitor_runs, uptime_checks, alerts, alert_events, reports, report_shares, provider_usage and audit_events.

## Isolation
All persisted tenant data is tied to `project_id`. RLS is based on project membership. Only the project owner manages membership in B1. Public report shares are never exposed by an anonymous table policy; a backend endpoint will validate hashed share tokens later.

## Security decisions
- New user profile is provisioned by an `auth.users` trigger.
- New project automatically provisions its owner membership.
- Viewer role is read-only; member/admin/owner can write tenant data.
- `owner` membership cannot be spoofed for a non-owner user.
- `anon` receives no direct table grants.
- Guest scan persistence, if needed later, goes through server-side APIs, not browser-to-table writes.

## Current blocker
A dedicated Supabase organization/project for Security Inspector does not yet exist. The only connected organization remains `joker trader Org`; B1 migration must never be applied there.

## B1 PASS requires
1. Dedicated Supabase project created for Security Inspector.
2. Migration `20260921_b1_core_auth.sql` applied to that project only.
3. Security advisor reviewed with no unresolved RLS exposure.
4. Publishable URL/key configured in deployment environment.
5. Magic-link login works end-to-end.
6. Cross-user isolation test passes.
7. GitHub CI typecheck/test/build passes.
