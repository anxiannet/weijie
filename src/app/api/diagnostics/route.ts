import {NextResponse} from 'next/server';
import {headers} from 'next/headers';

export const dynamic = 'force-dynamic';

const DEPLOYMENT_MARKER = 'anxian-domain-diagnostics-2026-05-24-stripe-01';

function normalizeHost(value: string | null) {
  return value?.split(',')[0]?.split(':')[0]?.trim().toLowerCase() || null;
}

function getStripeMode(secretKey?: string) {
  if (!secretKey) return null;
  if (secretKey.startsWith('sk_live_')) return 'live';
  if (secretKey.startsWith('sk_test_')) return 'test';
  return 'unknown';
}

export async function GET() {
  const headerStore = await headers();
  const host = normalizeHost(headerStore.get('host'));
  const forwardedHost = normalizeHost(headerStore.get('x-forwarded-host'));
  const proto = headerStore.get('x-forwarded-proto');
  const targetHost = 'anxian.weijie.sg';
  const matchedAnxianHost = host === targetHost || forwardedHost === targetHost;
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  return NextResponse.json(
    {
      ok: true,
      service: 'weijie/anxian diagnostics',
      deploymentMarker: DEPLOYMENT_MARKER,
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
        vercelGitCommitSha: process.env.VERCEL_GIT_COMMIT_SHA || null,
        vercelGitCommitRef: process.env.VERCEL_GIT_COMMIT_REF || null,
        nodeEnv: process.env.NODE_ENV || null,
        hasSupabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
        hasSupabaseAnonKey: Boolean(
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
        ),
        hasSupabaseServiceRole: Boolean(
          process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY
        ),
        hasStripeSecretKey: Boolean(stripeSecretKey),
        stripeMode: getStripeMode(stripeSecretKey),
        hasStripeWebhookSecret: Boolean(stripeWebhookSecret),
      },
      expected: {
        root: 'https://anxian.weijie.sg/ should render /anxian through middleware rewrite',
        rootDiagnostics: 'https://anxian.weijie.sg/diagnostics should bypass rewrite and render root diagnostics page',
        anxianDiagnostics:
          'https://anxian.weijie.sg/anxian/diagnostics should render anxian diagnostics page',
        apiDiagnostics:
          'https://anxian.weijie.sg/api/diagnostics should bypass rewrite and return this JSON',
        testDeployment:
          'https://test.weijie.sg/api/diagnostics should return the same deploymentMarker if both domains hit the same deployment',
      },
      diagnosis:
        matchedAnxianHost
          ? 'The request reached this deployment and the host matches anxian.weijie.sg. If / still fails, inspect middleware/root rendering.'
          : 'The request reached this deployment, but host did not match anxian.weijie.sg. If this was tested via another domain, that is expected.',
      renderedAt: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'X-Anxian-Diagnostics': DEPLOYMENT_MARKER,
      },
    }
  );
}
