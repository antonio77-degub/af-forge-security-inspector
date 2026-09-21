# B0 — Foundation

## Goal
Establish a stable, testable foundation for the complete V1 without implementing scan providers or persistence prematurely.

## Included
- React + TypeScript + Vite shell
- Primary product navigation
- Quick / Deep / Custom launcher UI
- Shared result-state vocabulary
- Zod Finding contract
- Zustand scan launcher state
- TanStack Query client
- Vercel health function
- Baseline HTTP security headers
- Environment variable policy
- CI workflow
- Responsive/reduced-motion baseline

## Explicitly not implemented in B0
- Real scans
- External providers
- Supabase schema/auth/RLS
- Vercel Workflow orchestration
- Monitoring/jobs
- Alerts
- Reports

These belong to later build blocks in the Master Contract.

## PASS gates
1. Repository exists and B0 files are committed.
2. `npm ci`, `npm run typecheck`, `npm test`, and `npm run build` pass in CI.
3. Vercel preview deploy responds successfully.
4. `/api/health` returns HTTP 200.
5. No provider/API secret exists in client code or repository.
6. Home, navigation, Quick/Deep/Custom selector and mobile layout are manually verified.

Until all six gates have evidence, B0 is NOT PASS.
