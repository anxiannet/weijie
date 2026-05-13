import Link from 'next/link';
import {notFound} from 'next/navigation';
import {ArrowLeft, CheckCircle2} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {StaticPageShell} from '@/components/StaticPageShell';
import {SETTLE_GUIDES} from '@/lib/static-content';

export function generateStaticParams() {
  return SETTLE_GUIDES.map((guide) => ({id: guide.id}));
}

export async function generateMetadata({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  const guide = SETTLE_GUIDES.find((item) => item.id === id);
  return {
    title: guide ? guide.title : '留学指南',
    description: guide?.summary,
  };
}

export default async function GuideDetailPage({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  const guide = SETTLE_GUIDES.find((item) => item.id === id);

  if (!guide) {
    notFound();
  }

  return (
    <StaticPageShell active="guides" breadcrumb="指南详情">
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/guides">
          <ArrowLeft className="h-4 w-4" /> 返回指南
        </Link>
      </Button>

      <article className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <section className="rounded-3xl border bg-card p-6 shadow-sm md:p-10">
            <Badge className="rounded-md">{guide.category}</Badge>
            <h1 className="mt-5 font-headline text-4xl font-bold leading-tight md:text-5xl">{guide.title}</h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">{guide.summary}</p>
            <p className="mt-4 text-sm text-muted-foreground">{guide.audience} · {guide.readTime}</p>
          </section>

          {guide.sections.map((section) => (
            <Card key={section.title}>
              <CardContent className="p-6">
                <h2 className="font-headline text-2xl font-bold">{section.title}</h2>
                <p className="mt-4 leading-7 text-muted-foreground">{section.body}</p>
                <div className="mt-5 space-y-3">
                  {section.points.map((point) => (
                    <p key={point} className="flex gap-3 text-sm leading-6">
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />
                      {point}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <aside className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="font-headline text-xl font-bold">行动清单</h2>
              <div className="mt-5 space-y-3">
                {guide.checklist.map((item) => (
                  <p key={item} className="flex gap-3 text-sm">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h2 className="font-headline text-xl font-bold">常见问题</h2>
              <div className="mt-5 space-y-5">
                {guide.faqs.map((faq) => (
                  <div key={faq.question}>
                    <p className="font-medium">{faq.question}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>
      </article>
    </StaticPageShell>
  );
}
