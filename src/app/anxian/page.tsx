import Link from 'next/link';
import {ImageIcon, MessageSquareText, Swords} from 'lucide-react';
import {ANXIAN_TEMPLATES, formatSgd} from '@/lib/anxian/templates';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';

const categoryIcons = {
  game: Swords,
  meme: MessageSquareText,
  rental: ImageIcon,
  social: MessageSquareText,
  utility: ImageIcon,
};

export default function AnxianHomePage() {
  return (
    <main className="min-h-screen bg-[#071412] text-white">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top,#0f766e33,transparent_50%)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-20 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-6">
            <Badge className="bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20">
              anxian.weijie.sg
            </Badge>
            <div className="space-y-4">
              <h1 className="text-5xl font-black tracking-tight lg:text-7xl">
                中文社交图片生成器
              </h1>
              <p className="max-w-2xl text-lg text-white/70 lg:text-xl">
                上传图片，30秒生成可直接发微信群、小红书、战队群的成品图。先做预览，再决定是否付费生成高清版。
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-white/50">
              <span>低清预览</span>
              <span>·</span>
              <span>高清付费</span>
              <span>·</span>
              <span>模板化生成</span>
              <span>·</span>
              <span>自动统计利润与转化</span>
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-500/20 bg-black/30 p-6 backdrop-blur">
            <div className="space-y-3 text-sm text-white/70">
              <div className="flex items-center justify-between gap-8">
                <span>目标</span>
                <span className="font-semibold text-white">高频可传播内容</span>
              </div>
              <div className="flex items-center justify-between gap-8">
                <span>模式</span>
                <span className="font-semibold text-white">Preview → Pay → HD</span>
              </div>
              <div className="flex items-center justify-between gap-8">
                <span>核心监控</span>
                <span className="font-semibold text-white">利润率 / 转化率</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">当前模板</h2>
            <p className="mt-2 text-white/60">
              不做通用 AI，不开放 Prompt，只做中文互联网真实传播场景。
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {ANXIAN_TEMPLATES.map((template) => {
            const Icon = categoryIcons[template.category];

            return (
              <Card
                key={template.slug}
                className="border-white/10 bg-white/5 text-white transition hover:border-emerald-500/30 hover:bg-white/[0.07]"
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-300">
                      <Icon className="h-6 w-6" />
                    </div>
                    <Badge variant="secondary" className="bg-white/10 text-white/70">
                      {template.category}
                    </Badge>
                  </div>

                  <div>
                    <CardTitle className="text-2xl">{template.name}</CardTitle>
                    <CardDescription className="mt-2 text-white/60">
                      {template.description}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-5">
                  <div className="flex flex-wrap gap-2">
                    {template.examples.map((example) => (
                      <Badge
                        key={example}
                        className="bg-white/10 text-white/70 hover:bg-white/10"
                      >
                        {example}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-white/40">高清生成</div>
                      <div className="text-xl font-bold text-emerald-300">
                        {formatSgd(template.priceCents)}
                      </div>
                    </div>

                    <Button asChild className="bg-emerald-500 text-black hover:bg-emerald-400">
                      <Link href={`/anxian/${template.slug}`}>开始生成</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </main>
  );
}
