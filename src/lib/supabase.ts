import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';
import { isSupabaseConfigured, publicEnv } from './env';

export const supabase = isSupabaseConfigured
  ? createClient<Database>(
      publicEnv.VITE_SUPABASE_URL as string,
      publicEnv.VITE_SUPABASE_PUBLISHABLE_KEY as string,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: 'implicit',
        },
      },
    )
  : null;
