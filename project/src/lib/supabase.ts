import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const EXPECTED_STORE_SLUG = 'fifty-store';
const DEFAULT_ADMIN_EMAIL = 'admin@fiftystore.tn';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

function resolveAdminEmail(): string {
  const configuredEmail = (import.meta.env.VITE_ADMIN_EMAIL as string | undefined)?.trim().toLowerCase();
  if (!configuredEmail || configuredEmail.includes('medismart')) {
    return DEFAULT_ADMIN_EMAIL;
  }

  return configuredEmail;
}

export const ADMIN_EMAIL = resolveAdminEmail();

export const ADMIN_LOCAL_PASSWORD =
  (import.meta.env.VITE_ADMIN_LOCAL_PASSWORD as string | undefined)?.trim() || 'Admin@12345';

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

let databaseVerificationPromise: Promise<boolean> | null = null;

export async function verifyFiftyStoreDatabase(): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;

  if (!databaseVerificationPromise) {
    databaseVerificationPromise = (async () => {
      try {
        const { data, error } = await supabase
          .from('app_settings')
          .select('value')
          .eq('key', 'store_slug')
          .maybeSingle();

        if (error) return false;
        return String(data?.value || '').trim().toLowerCase() === EXPECTED_STORE_SLUG;
      } catch {
        return false;
      }
    })();
  }

  return databaseVerificationPromise;
}
