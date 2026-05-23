import {notFound} from 'next/navigation';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {getAnxianTemplate, formatSgd} from '@/lib/anxian/templates';

export default async function AnxianTemplatePage({
  params,
}: {
  params: Promise<{slug: string}>;
}) {
  const {slug} = await params;
  const template = getAnxianTemplate(slug);

  if (!template) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#071412] px-6 py-10 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="space-y-4">
            <Badge className="bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20">
              {template.category}
            </Badge>

            <div>
              <h1 className="text-5xl font-black tracking-tight">{template.name}</h1>
              <p className="mt-4 max-w-2xl text-lg text-white/65">
                {template.description}
              </p>
            </div>
          </div>

          <Card className="border-white/10 bg-white/5 text-white">
            <CardContent className="space-y-6 p-6">
              <div className="space-y-2">
                <div className="text-sm uppercase tracking-widest text-white/40">
                  上传图片
                </div>
                <div className="flex min-h-[240px] items-center justify-center rounded-3xl border border-dashed border-white/15 bg-black/20 text-center text-white/40">
                  图片上传组件（下一步接入）
                </div>
              </div>

              <div className="grid gap-4">
                {template.fields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <label className="text-sm text-white/60">{field.label}</label>

                    {field.type === 'textarea' ? (
                      <Textarea
                        placeholder={field.placeholder}
                        className="border-white/10 bg-black/20 text-white placeholder:text-white/25"
                      />
                    ) : field.type === 'select' ? (
                      <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white/40">
                        {field.options?.join(' / ')}
                      </div>
                    ) : (
                      <Input
                        placeholder={field.placeholder}
                        className="border-white/10 bg-black/20 text-white placeholder:text-white/25"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4 border-t border-white/10 pt-6">
                <Button className="bg-emerald-500 text-black hover:bg-emerald-400">
                  生成低清预览
                </Button>

                <div className="text-sm text-white/50">
                  免费预览带水印 · 高清无水印 {formatSgd(template.priceCents)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="overflow-hidden border-white/10 bg-white/5 text-white">
            <div className="aspect-[4/5] bg-[linear-gradient(135deg,#0f766e22,#000)]" />
            <CardContent className="space-y-4 p-6">
              <div>
                <div className="text-sm uppercase tracking-widest text-white/40">
                  Preview
                </div>
                <div className="mt-2 text-2xl font-bold">免费低清预览</div>
              </div>

              <div className="space-y-2 text-sm text-white/60">
                <div>· 自动添加 anxian.net 水印</div>
                <div>· 低分辨率，仅供预览</div>
                <div>· 高清版支付后生成</div>
                <div>· 后续自动统计转化与利润</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-500/20 bg-emerald-500/5 text-white">
            <CardContent className="space-y-3 p-6">
              <div className="text-sm uppercase tracking-widest text-emerald-300/70">
                商业模型
              </div>
              <div className="text-2xl font-black text-emerald-300">
                Preview → Pay → HD
              </div>
              <p className="text-sm text-white/60">
                所有免费图都带来源水印。用户确认需要高清成品后，再调用高清 API，控制成本与利润率。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
