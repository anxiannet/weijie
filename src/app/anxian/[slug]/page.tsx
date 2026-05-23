import {notFound} from 'next/navigation';
import {Badge} from '@/components/ui/badge';
import {Card, CardContent} from '@/components/ui/card';
import {AnxianGenerator} from '@/components/anxian/AnxianGenerator';
import {AnxianPageTracker} from '@/components/anxian/AnxianPageTracker';
import {getAnxianTemplate} from '@/lib/anxian/templates';

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
      <AnxianPageTracker
        pagePath={`/anxian/${slug}`}
        templateSlug={slug}
        properties={{category: template.category}}
      />

      <div className="mx-auto max-w-7xl space-y-8">
        <div className="space-y-4">
          <Badge className="bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20">
            {template.category}
          </Badge>

          <div>
            <h1 className="text-5xl font-black tracking-tight">{template.name}</h1>
            <p className="mt-4 max-w-3xl text-lg text-white/65">
              {template.description}
            </p>
          </div>
        </div>

        <AnxianGenerator template={template} />

        <Card className="border-white/10 bg-white/5 text-white">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6 text-sm text-white/55">
            <div>
              当前阶段：先验证模板传播与付费转化，再决定是否接入高清生成 API。
            </div>
            <div className="text-emerald-300">Analytics Enabled</div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
