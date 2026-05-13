export const appEnv = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY,
  r2AccountId: process.env.CLOUDFLARE_R2_ACCOUNT_ID,
  r2AccessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
  r2SecretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  r2Bucket: process.env.CLOUDFLARE_R2_BUCKET,
  r2PublicBaseUrl: process.env.CLOUDFLARE_R2_PUBLIC_BASE_URL,
};

export function hasSupabaseConfig() {
  return Boolean(appEnv.supabaseUrl && appEnv.supabaseAnonKey);
}

export function hasR2Config() {
  return Boolean(
    appEnv.r2AccountId &&
      appEnv.r2AccessKeyId &&
      appEnv.r2SecretAccessKey &&
      appEnv.r2Bucket &&
      appEnv.r2PublicBaseUrl
  );
}
