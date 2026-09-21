# AF FORGE Security Inspector

External security posture platform: **Scan → Understand → Fix → Retest → Monitor → Alert → Report**.

## Current phase
B1 — Data & Auth foundation.

The scanner providers are intentionally not implemented yet. B1 establishes the real repository baseline, Supabase-ready authentication, tenant isolation contract and persistent data schema.

## Local development
1. Copy `.env.example` to `.env.local`.
2. Set only public Supabase browser values when a project exists.
3. Install dependencies.
4. Run `npm run dev`.

## Quality gates
- `npm run typecheck`
- `npm test`
- `npm run build`

## Security
Never place service-role or provider credentials in `VITE_*`. Browser variables are public by design. Tenant tables use RLS; public scans do not require a user account, but saved state does.
