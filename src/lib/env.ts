import { z } from 'zod';

const emptyToUndefined = (value: unknown) => value === '' ? undefined : value;

const publicEnvSchema = z.object({
  VITE_APP_NAME: z.preprocess(
    emptyToUndefined,
    z.string().min(1).default('AF FORGE Security Inspector'),
  ),
  VITE_SUPABASE_URL: z.preprocess(
    emptyToUndefined,
    z.string().url().optional(),
  ),
  VITE_SUPABASE_PUBLISHABLE_KEY: z.preprocess(
    emptyToUndefined,
    z.string().min(1).optional(),
  ),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;

export function readPublicEnv(source: Record<string, unknown>): PublicEnv {
  return publicEnvSchema.parse(source);
}

export const publicEnv = readPublicEnv(import.meta.env as unknown as Record<string, unknown>);

export const isSupabaseConfigured = Boolean(
  publicEnv.VITE_SUPABASE_URL && publicEnv.VITE_SUPABASE_PUBLISHABLE_KEY,
);
