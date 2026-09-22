import { describe, expect, it } from 'vitest';
import { readPublicEnv } from '../src/lib/env';

describe('public environment contract', () => {
  it('accepts an unconfigured local environment', () => {
    expect(readPublicEnv({ VITE_APP_NAME: 'Inspector', VITE_SUPABASE_URL: '', VITE_SUPABASE_PUBLISHABLE_KEY: '' }).VITE_APP_NAME).toBe('Inspector');
  });

  it('rejects an invalid Supabase URL', () => {
    expect(() => readPublicEnv({ VITE_APP_NAME: 'Inspector', VITE_SUPABASE_URL: 'not-a-url', VITE_SUPABASE_PUBLISHABLE_KEY: 'public' })).toThrow();
  });
});
