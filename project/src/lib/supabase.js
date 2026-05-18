import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const ADMIN_EMAIL =
  (import.meta.env.VITE_ADMIN_EMAIL && String(import.meta.env.VITE_ADMIN_EMAIL).trim().toLowerCase()) ||
  'admin@fiftystore.tn';

export const ADMIN_LOCAL_PASSWORD =
  (import.meta.env.VITE_ADMIN_LOCAL_PASSWORD && String(import.meta.env.VITE_ADMIN_LOCAL_PASSWORD).trim()) ||
  'Admin@12345';

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
