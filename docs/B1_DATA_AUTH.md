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

## Canonical Supabase environment
- Project: `af-forge-security-inspector`
- Project ref: `cmzfpjwzlwgfuymndjrg`
- Region: `eu-west-3`
- This project is isolated from the Trader project and is the only Supabase target authorized for Security Inspector migrations.

## B1 validation state
- Dedicated Supabase project: PASS
- Core migration: PASS
- RLS hardening migration: PASS
- RLS performance migration: PASS
- Foreign-key indexes migration: PASS
- 25/25 public tables with RLS enabled: PASS
- Supabase Security Advisor: PASS (0 security lints)
- Generated TypeScript database types committed: PASS
- GitHub CI typecheck/test/build: PASS
- Deployment environment URL/key: PENDING
- Magic-link login end-to-end: PENDING
- Cross-user isolation E2E: PENDING

B1 overall remains IN PROGRESS until the three pending runtime/auth checks are evidenced.
