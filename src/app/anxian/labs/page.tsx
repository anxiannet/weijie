import Link from 'next/link';
import {VIRAL_TEMPLATE_SEEDS} from '@/lib/anxian/viralTemplates';

export const dynamic = 'force-dynamic';

export default function AnxianLabsPage() {
  return (
    <main className="min-h-screen bg-[#071412] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="space-y-4">
          <div className="text-sm uppercase tracking-[0.35em] text-emerald-300/70">ANXIAN LABS</div>
          <h1 className="text-5xl font-black tracking-tight">传播模板实验室</h1>
          <p className="max-w-3xl text-lg leading-8 text-white/60">
            这里不是“AI工具大全”。
            这里专门测试：什么内容最容易被人截图、下载、发群、转发。
          </p>
        </div>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {VIRAL_TEMPLATE_SEEDS.map((template) => (
            <article
              key={template.id}
              className="group overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] transition-all hover:-translate-y-1 hover:border-emerald-400/30"
            >
              <div className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top_right,#10b98133,transparent_55%),linear-gradient(180deg,#0b1f1a,#071412)] p-6">
                <div className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
                  {template.category}
                </div>

                <h2 className="mt-5 text-3xl font-black leading-tight">{template.title}</h2>
                <div className="mt-2 text-sm text-white/55">{template.subtitle}</div>

                <div className="mt-8 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-white/75">
                  {template.defaultLines.map((line) => (
                    <div key={line} className="border-b border-white/5 py-1 last:border-b-0">
                      {line}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-5 p-6">
                <p className="text-sm leading-7 text-white/55">{template.hook}</p>

                <div className="flex flex-wrap gap-2">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/55"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <Link
                  href="/anxian"
                  className="flex items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-black transition-all hover:bg-emerald-300"
                >
                  {template.cta}
                </Link>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-[32px] border border-emerald-400/15 bg-emerald-400/[0.05] p-8">
          <div className="text-sm uppercase tracking-[0.35em] text-emerald-300/70">CURRENT STRATEGY</div>
          <div className="mt-4 text-3xl font-black">先传播，再转化。</div>
          <div className="mt-4 max-w-3xl space-y-3 text-white/65">
            <p>
              第一阶段不是做“专业设计工具”，而是做：微信群里有人会顺手保存、顺手转发的东西。
            </p>
            <p>
              当前重点观察指标：download_preview / checkout_click。
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
