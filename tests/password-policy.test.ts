import { describe, expect, it } from 'vitest';
import { MIN_PASSWORD_LENGTH, validatePassword } from '../src/features/auth/passwordPolicy';

describe('validatePassword', () => {
  it('rejects passwords shorter than the application minimum', () => {
    expect(validatePassword('1234567')).toContain(String(MIN_PASSWORD_LENGTH));
  });

  it('accepts passwords at or above the application minimum', () => {
    expect(validatePassword('12345678')).toBeNull();
    expect(validatePassword('uma-senha-bem-maior')).toBeNull();
  });
});
