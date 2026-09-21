# Architecture Baseline

## Product flow
SCAN → UNDERSTAND → FIX → RETEST → MONITOR → ALERT → REPORT

## Layers
1. Client UI
2. Server API/orchestrator
3. Provider adapters
4. Normalizer
5. Correlation engine
6. Finding/scoring/explanation engines
7. Persistence and monitoring

## Security invariants
- Provider secrets are server-only.
- User-provided targets never bypass centralized target validation.
- UNKNOWN is never coerced to FAIL.
- Third-party observations are never represented as direct confirmation.
- Every finding carries source, timestamp, confidence and evidence metadata.
- Every outbound target request will pass SSRF controls before provider execution is enabled.
