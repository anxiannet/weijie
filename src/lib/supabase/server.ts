import {cookies} from 'next/headers';
import {createServerClient} from '@supabase/ssr';
import {createClient} from '@supabase/supabase-js';
import {appEnv} from '@/lib/env';
import type {Database} from './database.types';

export async function createSupabaseServerClient() {
  if (!appEnv.supabaseUrl || !appEnv.supabaseAnonKey) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(
    appEnv.supabaseUrl,
    appEnv.supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({name, value, options}) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );
}

export function createSupabaseAdminClient() {
  if (!appEnv.supabaseUrl || !appEnv.supabaseServiceRoleKey) {
    return null;
  }

  return createClient<Database>(appEnv.supabaseUrl, appEnv.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
