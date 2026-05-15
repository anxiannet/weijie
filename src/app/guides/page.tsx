import Link from 'next/link';
import {ArrowRight, BookOpen, CheckCircle2, Home} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {StaticPageShell} from '@/components/StaticPageShell';
import {rentalSeoPages} from '@/lib/seo-rental-pages';
import {SETTLE_GUIDES} from '@/lib/static-content';

export const metadata = {
  title: '生活指南',
  description: '新加坡留学生租房、申请、落地和本地生活指南。',
};

const rentalGuideSlugs = [
  'student-rental-guide-singapore',
  'singapore-rental-scams-guide',
  'best-areas-for-students-singapore',
  'nus-rental-guide-singapore',
  'ntu-rental-guide-singapore',
  'smu-rental-guide-singapore',
  'singapore-rental-contract-guide',
  'singapore-agent-fee-rental-guide',
  'hdb-vs-condo-singapore',
  'common-room-vs-master-room-singapore',
  'singapore-student-living-cost-guide',
  'singapore-student-transport-guide',
] as const;

const rentalGuides = rentalGuideSlugs.map((slug) => rentalSeoPages[slug]);

export default function GuidesPage() {
  return (
    <StaticPageShell active="guides" breadcrumb="生活指南">
      <section className="overflow-hidden rounded-3xl border bg-card shadow-sm">
        <div className="p-6 md:p-10">
          <Badge className="rounded-md">生活指南</Badge>
          <h1 className="mt-5 font-headline text-4xl font-bold leading-tight md:text-5xl">新加坡生活指南</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
            从租房、申请、落地到日常生活，把分散的信息整理成可长期使用的结构化指南。
          </p>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        {SETTLE_GUIDES.map((guide) => (
          <Card key={guide.id} className="group transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge variant="outline" className="rounded-md">{guide.category}</Badge>
                  <h2 className="mt-4 font-headline text-2xl font-bold leading-tight group-hover:text-primary">{guide.title}</h2>
                </div>
                <BookOpen className="mt-1 h-5 w-5 shrink-0 text-primary" />
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">{guide.summary}</p>
              <div className="mt-5 space-y-2">
                {guide.bullets.map((bullet) => (
                  <p key={bullet} className="flex gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {bullet}
                  </p>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between gap-4">
                <span className="text-xs text-muted-foreground">{guide.readTime}</span>
                <Button asChild size="sm">
                  <Link href={`/guides/${guide.id}`}>查看详情</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mt-10 space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge variant="secondary" className="rounded-md">租房专题</Badge>
            <h2 className="mt-4 font-headline text-3xl font-bold leading-tight text-foreground">新加坡留学生租房专题</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
              按房型、区域、学校、合同、费用和交通拆分成可独立阅读的页面，适合新生和家长按问题逐篇查看。
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/student-rental-guide-singapore">
              先看总指南 <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {rentalGuides.map((guide) => (
            <Card key={guide.slug} className="group transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
              <CardContent className="flex h-full flex-col p-6">
                <div className="flex items-start justify-between gap-4">
                  <Badge variant="outline" className="rounded-md">租房</Badge>
                  <Home className="mt-1 h-5 w-5 shrink-0 text-primary" />
                </div>
                <h3 className="mt-4 font-headline text-xl font-bold leading-tight text-foreground group-hover:text-primary">
                  {guide.h1}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{guide.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {guide.keywords.slice(0, 3).map((keyword) => (
                    <span key={keyword} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                      {keyword}
                    </span>
                  ))}
                </div>
                <div className="mt-auto flex items-center justify-between gap-4 pt-6">
                  <span className="text-xs text-muted-foreground">{guide.readingTime}</span>
                  <Button asChild size="sm">
                    <Link href={`/${guide.slug}`}>查看详情</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </StaticPageShell>
  );
}
