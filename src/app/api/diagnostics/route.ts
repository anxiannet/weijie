import {NextResponse} from 'next/server';
import {headers} from 'next/headers';

export const dynamic = 'force-dynamic';

function normalizeHost(value: string | null) {
  return value?.split(',')[0]?.split(':')[0]?.trim().toLowerCase() || null;
}

export async function GET() {
  const headerStore = await headers();
  const host = normalizeHost(headerStore.get('host'));
  const forwardedHost = normalizeHost(headerStore.get('x-forwarded-host'));
  const proto = headerStore.get('x-forwarded-proto');
  const targetHost = 'anxian.weijie.sg';
  const matchedAnxianHost = host === targetHost || forwardedHost === targetHost;

  return NextResponse.json({
    ok: true,
    service: 'weijie/anxian diagnostics',
    reachedCurrentNextApp: true,
    matchedAnxianHost,
    request: {
      host,
      forwardedHost,
      proto,
      userAgent: headerStore.get('user-agent'),
    },
    env: {
      vercelEnv: process.env.VERCEL_ENV || null,
      vercelUrl: process.env.VERCEL_URL || null,
      nodeEnv: process.env.NODE_ENV || null,
      hasSupabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      hasSupabaseAnonKey: Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
      ),
      hasSupabaseServiceRole: Boolean(
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY
      ),
    },
    expected: {
      root: 'https://anxian.weijie.sg/ should render /anxian through middleware rewrite',
      rootDiagnostics: 'https://anxian.weijie.sg/diagnostics should bypass rewrite and render root diagnostics page',
      anxianDiagnostics:
        'https://anxian.weijie.sg/anxian/diagnostics should render anxian diagnostics page',
      apiDiagnostics:
        'https://anxian.weijie.sg/api/diagnostics should bypass rewrite and return this JSON',
    },
    diagnosis:
      matchedAnxianHost
        ? 'The request reached this deployment and the host matches anxian.weijie.sg. If / still fails, inspect middleware/root rendering.'
        : 'The request reached this deployment, but host did not match anxian.weijie.sg. If this was tested via another domain, that is expected.',
    renderedAt: new Date().toISOString(),
  });
}
