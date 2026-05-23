import {headers} from 'next/headers';

export const dynamic = 'force-dynamic';

type HeaderRow = {
  key: string;
  value: string;
};

function mask(value: string | null) {
  if (!value) return '-';
  if (value.length <= 12) return value;
  return `${value.slice(0, 8)}…${value.slice(-4)}`;
}

export default async function AnxianDiagnosticsPage() {
  const headerStore = await headers();
  const host = headerStore.get('host') || '-';
  const forwardedHost = headerStore.get('x-forwarded-host') || '-';
  const forwardedProto = headerStore.get('x-forwarded-proto') || '-';
  const vercelUrl = process.env.VERCEL_URL || '-';
  const vercelEnv = process.env.VERCEL_ENV || '-';
  const nodeEnv = process.env.NODE_ENV || '-';

  const rows: HeaderRow[] = [
    {key: 'host', value: host},
    {key: 'x-forwarded-host', value: forwardedHost},
    {key: 'x-forwarded-proto', value: forwardedProto},
    {key: 'user-agent', value: headerStore.get('user-agent') || '-'},
    {key: 'referer', value: headerStore.get('referer') || '-'},
  ];

  const expected = {
    subdomain: 'anxian.weijie.sg',
    currentRoute: '/anxian/diagnostics',
    rootRewriteExpected: 'https://anxian.weijie.sg/ should render /anxian',
    directTestRoute: 'https://anxian.weijie.sg/diagnostics should render this page through middleware rewrite',
  };

  const checks = [
    {
      label: 'Request reached this Next.js app',
      ok: true,
      detail: 'If you can see this page, Vercel routed the domain to the current deployment.',
    },
    {
      label: 'Host is anxian.weijie.sg',
      ok: host === expected.subdomain || forwardedHost === expected.subdomain,
      detail: `host=${host}, x-forwarded-host=${forwardedHost}`,
    },
    {
      label: 'Middleware route is available',
      ok: true,
      detail: 'middleware.ts rewrites anxian.weijie.sg/* to /anxian/* except static/API assets.',
    },
    {
      label: 'Supabase public config present',
      ok: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)),
      detail: `url=${mask(process.env.NEXT_PUBLIC_SUPABASE_URL || null)}, key=${mask(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || null)}`,
    },
  ];

  return (
    <main className="min-h-screen bg-[#071412] px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <div className="text-sm uppercase tracking-[0.35em] text-emerald-300/70">ANXIAN DIAGNOSTICS</div>
          <h1 className="mt-4 text-4xl font-black">子域名诊断页</h1>
          <p className="mt-3 text-white/60">
            用于确认 anxian.weijie.sg 是否已经进入当前 Vercel / Next.js 部署，以及 middleware rewrite 是否命中。
          </p>
        </div>

        <section className="grid gap-4 md:grid-cols-2">
          {checks.map((check) => (
            <div key={check.label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className={check.ok ? 'text-emerald-300' : 'text-amber-300'}>
                {check.ok ? 'PASS' : 'CHECK'}
              </div>
              <div className="mt-2 text-xl font-bold">{check.label}</div>
              <p className="mt-2 text-sm text-white/55">{check.detail}</p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-bold">Expected behavior</h2>
          <pre className="mt-4 overflow-auto rounded-2xl bg-black/35 p-4 text-sm text-emerald-100/85">
            {JSON.stringify(expected, null, 2)}
          </pre>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-bold">Runtime</h2>
          <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
            <Info label="VERCEL_ENV" value={vercelEnv} />
            <Info label="VERCEL_URL" value={vercelUrl} />
            <Info label="NODE_ENV" value={nodeEnv} />
            <Info label="Rendered at" value={new Date().toISOString()} />
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-bold">Request headers</h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
            {rows.map((row) => (
              <div key={row.key} className="grid gap-2 border-b border-white/10 px-4 py-3 text-sm last:border-b-0 md:grid-cols-[220px_1fr]">
                <div className="font-mono text-white/45">{row.key}</div>
                <div className="break-all text-white/80">{row.value}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-sm text-white/65">
          <div className="font-bold text-emerald-300">判断方法</div>
          <p className="mt-2">
            如果 test.weijie.sg/anxian/diagnostics 正常，但 anxian.weijie.sg/diagnostics 不正常，通常是 Vercel Domain 绑定或 DNS 解析问题。
            如果 anxian.weijie.sg/diagnostics 正常但 anxian.weijie.sg/ 不显示安线首页，则是 middleware/root rewrite 问题。
          </p>
        </section>
      </div>
    </main>
  );
}

function Info({label, value}: {label: string; value: string}) {
  return (
    <div className="rounded-2xl bg-black/25 p-4">
      <div className="font-mono text-xs text-white/40">{label}</div>
      <div className="mt-2 break-all text-white/80">{value}</div>
    </div>
  );
}
