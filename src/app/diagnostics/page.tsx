import Link from 'next/link';
import {headers} from 'next/headers';

export const dynamic = 'force-dynamic';

function mask(value: string | undefined) {
  if (!value) return '-';
  if (value.length <= 12) return value;
  return `${value.slice(0, 8)}…${value.slice(-4)}`;
}

export default async function RootDiagnosticsPage() {
  const headerStore = await headers();
  const host = headerStore.get('host') || '-';
  const forwardedHost = headerStore.get('x-forwarded-host') || '-';
  const proto = headerStore.get('x-forwarded-proto') || '-';

  const isAnxianHost = host === 'anxian.weijie.sg' || forwardedHost === 'anxian.weijie.sg';

  const checks = [
    {
      label: 'Domain reached current Next.js deployment',
      ok: true,
      detail: 'If this page renders, DNS and Vercel domain routing reached this app.',
    },
    {
      label: 'Host matches anxian.weijie.sg',
      ok: isAnxianHost,
      detail: `host=${host}; x-forwarded-host=${forwardedHost}`,
    },
    {
      label: 'Anxian route exists',
      ok: true,
      detail: '/anxian and /anxian/diagnostics exist in this deployment.',
    },
  ];

  return (
    <main className="min-h-screen bg-[#071412] px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <div className="text-sm uppercase tracking-[0.35em] text-emerald-300/70">ROOT DIAGNOSTICS</div>
          <h1 className="mt-4 text-4xl font-black">根级域名诊断页</h1>
          <p className="mt-3 text-white/60">
            这个页面不依赖 anxian middleware rewrite。用于确认子域名是否已经进入当前 Vercel 项目。
          </p>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          {checks.map((check) => (
            <div key={check.label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className={check.ok ? 'text-emerald-300' : 'text-amber-300'}>{check.ok ? 'PASS' : 'CHECK'}</div>
              <div className="mt-2 font-bold">{check.label}</div>
              <p className="mt-2 text-sm text-white/55">{check.detail}</p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-bold">Runtime</h2>
          <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
            <Info label="host" value={host} />
            <Info label="x-forwarded-host" value={forwardedHost} />
            <Info label="x-forwarded-proto" value={proto} />
            <Info label="VERCEL_ENV" value={process.env.VERCEL_ENV || '-'} />
            <Info label="VERCEL_URL" value={process.env.VERCEL_URL || '-'} />
            <Info label="NEXT_PUBLIC_SUPABASE_URL" value={mask(process.env.NEXT_PUBLIC_SUPABASE_URL)} />
            <Info label="Rendered at" value={new Date().toISOString()} />
          </div>
        </section>

        <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-sm text-white/65">
          <div className="font-bold text-emerald-300">判断结论</div>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>如果 anxian.weijie.sg/diagnostics 能打开：DNS/Vercel 绑定没问题，继续看 middleware。</li>
            <li>如果 anxian.weijie.sg/diagnostics 不能打开：问题在 DNS 或 Vercel Domain 绑定，不在代码。</li>
            <li>如果 /diagnostics 能打开但 / 不显示安线：首页 rewrite 需要继续修。</li>
          </ul>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link className="rounded-full bg-emerald-500 px-5 py-3 font-bold text-black" href="/anxian">
            打开 /anxian
          </Link>
          <Link className="rounded-full bg-white/10 px-5 py-3 font-bold text-white" href="/anxian/diagnostics">
            打开 /anxian/diagnostics
          </Link>
        </div>
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
