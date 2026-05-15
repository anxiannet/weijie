import Link from 'next/link';
import {ArrowRight} from 'lucide-react';
import type {RelatedLink} from '@/lib/seo-rental-pages';

type RelatedArticlesProps = {
  links: RelatedLink[];
};

export function RelatedArticles({links}: RelatedArticlesProps) {
  return (
    <section className="rounded-3xl border bg-card p-6 shadow-sm md:p-8">
      <h2 className="font-headline text-2xl font-bold text-foreground md:text-3xl">推荐继续阅读</h2>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group rounded-2xl border bg-background p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-base font-semibold leading-7 text-foreground group-hover:text-primary">{link.title}</h3>
              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
            </div>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{link.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
