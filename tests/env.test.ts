import { describe, expect, it } from 'vitest';
import { readPublicEnv } from '../src/lib/env';

describe('public environment contract', () => {
  it('accepts an unconfigured local environment and defaults the app name', () => {
    const env = readPublicEnv({
      VITE_APP_NAME: '',
      VITE_SUPABASE_URL: '',
      VITE_SUPABASE_PUBLISHABLE_KEY: '',
    });

    expect(env.VITE_APP_NAME).toBe('AF FORGE Security Inspector');
    expect(env.VITE_SUPABASE_URL).toBeUndefined();
    expect(env.VITE_SUPABASE_PUBLISHABLE_KEY).toBeUndefined();
  });

  it('rejects an invalid Supabase URL', () => {
    expect(() => readPublicEnv({
      VITE_APP_NAME: 'Inspector',
      VITE_SUPABASE_URL: 'not-a-url',
      VITE_SUPABASE_PUBLISHABLE_KEY: 'public',
    })).toThrow();
  });
});
