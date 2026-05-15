import Link from 'next/link';
import {BookOpen, CalendarDays, CheckCircle2, ChevronRight, Home, MapPinned} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import {StaticPageShell} from '@/components/StaticPageShell';
import type {RentalSeoPage, RelatedLink} from '@/lib/seo-rental-pages';
import {buildJsonLd} from '@/lib/seo-rental-pages';
import {ComparisonTable} from './ComparisonTable';
import {CTASection} from './CTASection';
import {FAQSection} from './FAQSection';
import {JsonLd} from './JsonLd';
import {RelatedArticles} from './RelatedArticles';

type SeoPageLayoutProps = {
  page: RentalSeoPage;
  relatedLinks: RelatedLink[];
};

function sectionId(index: number) {
  return `section-${index + 1}`;
}

export function SeoPageLayout({page, relatedLinks}: SeoPageLayoutProps) {
  return (
    <StaticPageShell active="guides" breadcrumb="新加坡留学生租房">
      <JsonLd data={buildJsonLd(page)} />

      <article className="space-y-8">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-foreground">首页</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/student-rental-guide-singapore" className="hover:text-foreground">新加坡留学生租房</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{page.h1}</span>
        </nav>

        <header className="overflow-hidden rounded-3xl border bg-card shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.08fr)_minmax(280px,0.92fr)]">
            <div className="p-6 md:p-10">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="rounded-md">新加坡留学生租房</Badge>
                <span className="text-sm font-medium text-muted-foreground">{page.readingTime}</span>
              </div>
              <h1 className="mt-5 font-headline text-3xl font-bold leading-tight text-foreground md:text-5xl">
                {page.h1}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">{page.subtitle}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {page.keywords.slice(0, 4).map((keyword) => (
                  <span key={keyword} className="rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
            <div
              className="flex min-h-[280px] items-end border-t bg-[linear-gradient(135deg,hsl(var(--muted)),hsl(var(--background))_45%,hsl(var(--primary)/0.16))] p-6 lg:border-l lg:border-t-0"
              role="img"
              aria-label={page.imageAlt}
            >
              <div className="w-full rounded-2xl border bg-background/80 p-5 shadow-sm backdrop-blur">
                <div className="flex items-center gap-3 text-sm font-semibold text-foreground">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MapPinned className="h-5 w-5" />
                  </span>
                  Weijie.sg 租房内容矩阵
                </div>
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  {[
                    ['区域', '通勤与生活配套'],
                    ['房型', 'HDB、Condo、普通房'],
                    ['签约', '押金、合同与检查清单'],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl border bg-card p-4">
                      <p className="text-xs font-semibold text-primary">{label}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {icon: Home, title: '先看居住条件', body: '确认房型、室友、卫生间、窗户、做饭和空调规则。'},
            {icon: CalendarDays, title: '再算长期预算', body: '把租金、水电网、交通、押金和一次性费用放在一起看。'},
            {icon: BookOpen, title: '最后核对合同', body: '签约前确认押金、维修、退租、访客和 Inventory List。'},
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-2xl border bg-card p-5 shadow-sm">
                <Icon className="h-5 w-5 text-primary" />
                <h2 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
              </div>
            );
          })}
        </section>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-8">
            <section className="rounded-3xl border bg-card p-6 shadow-sm md:p-8">
              <h2 className="font-headline text-2xl font-bold text-foreground md:text-3xl">阅读前先建立判断框架</h2>
              <div className="mt-5 space-y-4">
                {page.lead.map((paragraph) => (
                  <p key={paragraph} className="text-base leading-8 text-muted-foreground">{paragraph}</p>
                ))}
              </div>
            </section>

            {page.sections.map((section, index) => (
              <section key={section.title} id={sectionId(index)} className="scroll-mt-24 rounded-3xl border bg-card p-6 shadow-sm md:p-8">
                <h2 className="font-headline text-2xl font-bold leading-tight text-foreground md:text-3xl">{section.title}</h2>
                <p className="mt-4 text-base leading-8 text-muted-foreground">{section.intro}</p>
                {section.items && (
                  <div className="mt-6 grid grid-cols-1 gap-4">
                    {section.items.map((item) => (
                      <div key={item.title} className="rounded-2xl border bg-background p-5">
                        <h3 className="text-lg font-semibold leading-7 text-foreground">{item.title}</h3>
                        <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.body}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}

            <ComparisonTable table={page.table} />
            <FAQSection faqs={page.faqs} />
            <RelatedArticles links={relatedLinks} />
            <CTASection />
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <section className="rounded-3xl border bg-card p-6 shadow-sm">
              <h2 className="font-headline text-xl font-bold text-foreground">本文要点</h2>
              <div className="mt-5 space-y-3">
                {page.sections.slice(0, 6).map((section, index) => (
                  <a key={section.title} href={`#${sectionId(index)}`} className="flex gap-3 text-sm leading-6 text-muted-foreground hover:text-foreground">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />
                    {section.title}
                  </a>
                ))}
              </div>
            </section>
            <section className="rounded-3xl border bg-card p-6 shadow-sm">
              <h2 className="font-headline text-xl font-bold text-foreground">内部链接</h2>
              <div className="mt-5 space-y-3">
                {relatedLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="block text-sm leading-6 text-muted-foreground hover:text-primary">
                    {link.title}
                  </Link>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </article>
    </StaticPageShell>
  );
}
