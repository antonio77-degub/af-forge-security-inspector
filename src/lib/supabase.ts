import { createClient } from '@supabase/supabase-js';
import { isSupabaseConfigured, publicEnv } from './env';

export const supabase = isSupabaseConfigured
  ? createClient(
      publicEnv.VITE_SUPABASE_URL as string,
      publicEnv.VITE_SUPABASE_PUBLISHABLE_KEY as string,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: 'pkce',
        },
      },
    )
  : null;
