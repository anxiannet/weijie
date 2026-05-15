import Link from 'next/link';
import {MessageCircle} from 'lucide-react';
import {Button} from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="rounded-3xl border bg-primary p-6 text-primary-foreground shadow-sm md:p-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-headline text-2xl font-bold md:text-3xl">正在找新加坡房间？</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-primary-foreground/85 md:text-base">
            Weijie.sg 专注新加坡留学生租房咨询、区域分析、房型推荐与生活协助。
          </p>
        </div>
        <Button asChild size="lg" variant="secondary" className="shrink-0">
          <Link href="/#listings">
            获取租房建议 <MessageCircle className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
