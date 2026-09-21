import { z } from 'zod';

const publicEnvSchema = z.object({
  VITE_APP_NAME: z.string().min(1).default('AF FORGE Security Inspector'),
  VITE_SUPABASE_URL: z.string().url().optional().or(z.literal('')),
  VITE_SUPABASE_PUBLISHABLE_KEY: z.string().min(1).optional().or(z.literal('')),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;

export function readPublicEnv(source: Record<string, unknown>): PublicEnv {
  return publicEnvSchema.parse(source);
}

export const publicEnv = readPublicEnv(import.meta.env as unknown as Record<string, unknown>);

export const isSupabaseConfigured = Boolean(
  publicEnv.VITE_SUPABASE_URL && publicEnv.VITE_SUPABASE_PUBLISHABLE_KEY,
);
