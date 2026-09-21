import { describe, expect, it } from 'vitest';
import { findingSchema } from '../src/contracts/finding';

describe('finding contract', () => {
  it('accepts a valid normalized finding', () => {
    const parsed = findingSchema.safeParse({
      id: 'WEB_CSP_MISSING',
      module: 'web',
      status: 'warning',
      severity: 'medium',
      confidence: 'high',
      titleSimple: 'Seu site pode melhorar uma proteção do navegador.',
      explanationSimple: 'Explicação simples.',
      technicalTitle: 'Content-Security-Policy header missing',
      checkedAt: new Date().toISOString(),
      affectedAsset: 'https://example.com',
      provider: 'internal-http',
      evidence: {},
    });
    expect(parsed.success).toBe(true);
  });
});
