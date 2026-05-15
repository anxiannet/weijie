import {getR2Diagnostics} from '@/lib/r2-diagnostics';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function StatusBadge({ok}: {ok: boolean}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        ok ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
      }`}
    >
      {ok ? '正常' : '异常'}
    </span>
  );
}

export default function R2DiagnosticsPage() {
  const diagnostics = getR2Diagnostics();

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-4 py-8 text-[#171717] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="text-sm text-neutral-500">维界 · 发布诊断</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal">R2 配置诊断</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
            本页面只显示环境变量是否存在、长度与脱敏片段，用于判断线上运行时是否读取到 Cloudflare R2 配置。
          </p>
        </div>

        <section className="mb-5 rounded-lg border border-neutral-200 bg-white p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-medium">整体状态</h2>
              <p className="mt-1 text-sm text-neutral-500">检查时间：{diagnostics.checkedAt}</p>
            </div>
            <StatusBadge ok={diagnostics.hasR2Config && diagnostics.directProcessEnvReady} />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-md border border-neutral-200 p-3">
              <p className="text-xs text-neutral-500">hasR2Config()</p>
              <p className="mt-1 font-mono text-sm">{String(diagnostics.hasR2Config)}</p>
            </div>
            <div className="rounded-md border border-neutral-200 p-3">
              <p className="text-xs text-neutral-500">process.env 完整</p>
              <p className="mt-1 font-mono text-sm">{String(diagnostics.directProcessEnvReady)}</p>
            </div>
            <div className="rounded-md border border-neutral-200 p-3">
              <p className="text-xs text-neutral-500">VERCEL_ENV</p>
              <p className="mt-1 font-mono text-sm">{diagnostics.vercelEnv ?? 'null'}</p>
            </div>
            <div className="rounded-md border border-neutral-200 p-3">
              <p className="text-xs text-neutral-500">Runtime</p>
              <p className="mt-1 font-mono text-sm">{diagnostics.nextRuntime}</p>
            </div>
          </div>
        </section>

        {diagnostics.missingKeys.length > 0 && (
          <section className="mb-5 rounded-lg border border-red-200 bg-red-50 p-5">
            <h2 className="text-lg font-medium text-red-800">缺少变量</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {diagnostics.missingKeys.map((key) => (
                <span key={key} className="rounded-md bg-white px-2 py-1 font-mono text-xs text-red-700">
                  {key}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="mb-5 rounded-lg border border-neutral-200 bg-white p-5">
          <h2 className="text-lg font-medium">变量明细</h2>
          <div className="mt-4 overflow-hidden rounded-md border border-neutral-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 text-xs text-neutral-500">
                <tr>
                  <th className="px-3 py-2 font-medium">变量名</th>
                  <th className="px-3 py-2 font-medium">状态</th>
                  <th className="px-3 py-2 font-medium">长度</th>
                  <th className="px-3 py-2 font-medium">脱敏值</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {diagnostics.variables.map((item) => (
                  <tr key={item.key}>
                    <td className="px-3 py-3 font-mono text-xs">{item.key}</td>
                    <td className="px-3 py-3">
                      <StatusBadge ok={item.present} />
                    </td>
                    <td className="px-3 py-3 font-mono">{item.length}</td>
                    <td className="px-3 py-3 font-mono text-xs text-neutral-600">{item.masked ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-lg border border-neutral-200 bg-white p-5">
          <h2 className="text-lg font-medium">Public Base URL</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-neutral-200 p-3">
              <p className="text-xs text-neutral-500">HTTPS URL 有效</p>
              <p className="mt-1 font-mono text-sm">{String(diagnostics.publicBaseUrlStatus.isValidUrl)}</p>
            </div>
            <div className="rounded-md border border-neutral-200 p-3">
              <p className="text-xs text-neutral-500">Origin</p>
              <p className="mt-1 break-all font-mono text-sm">{diagnostics.publicBaseUrlStatus.origin ?? 'null'}</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-neutral-500">
            JSON 接口：<span className="font-mono">/api/diagnostics/r2</span>
          </p>
        </section>
      </div>
    </main>
  );
}
