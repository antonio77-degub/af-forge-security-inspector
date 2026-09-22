import { describe, expect, it } from 'vitest';
import { safeNextPath } from '../src/features/auth/safeNextPath';

describe('safeNextPath', () => {
  it('keeps valid local application paths', () => {
    expect(safeNextPath('/assets')).toBe('/assets');
    expect(safeNextPath('/history?tab=recent')).toBe('/history?tab=recent');
  });

  it('falls back to root for missing or external destinations', () => {
    expect(safeNextPath(null)).toBe('/');
    expect(safeNextPath('https://evil.example')).toBe('/');
    expect(safeNextPath('//evil.example')).toBe('/');
  });

  it('rejects backslash-based ambiguous destinations', () => {
    expect(safeNextPath('/\\evil.example')).toBe('/');
  });
});
