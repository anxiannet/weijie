import Image from 'next/image';
import Link from 'next/link';
import {ExternalLink, GraduationCap} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {StaticPageShell} from '@/components/StaticPageShell';
import {SCHOOLS_MOCK} from '@/app/lib/mock-data';

export const metadata = {
  title: '院校信息',
  description: '新加坡高校、私立院校和理工学院信息。',
};

const schoolTypeLabel = {
  University: '公立大学',
  Polytechnic: '理工学院',
  Private: '私立院校',
  Arts: '艺术院校',
} as const;

export default function SchoolsPage() {
  return (
    <StaticPageShell active="schools" breadcrumb="院校信息">
      <section className="overflow-hidden rounded-3xl border bg-card shadow-sm">
        <div className="p-6 md:p-10">
          <Badge className="rounded-md">院校信息</Badge>
          <h1 className="mt-5 font-headline text-4xl font-bold leading-tight md:text-5xl">新加坡院校信息中心</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
            了解新加坡高校、课程方向、学生服务与生活体验，用结构化信息辅助选校和落地规划。
          </p>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {SCHOOLS_MOCK.map((school) => (
          <Card key={school.id} className="group overflow-hidden transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
            <Link href={`/schools/${school.id}`} className="block">
              <div className="relative aspect-[4/3] bg-muted">
                <Image src={school.imageUrl} alt={school.name} fill unoptimized className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
            </Link>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge variant="outline" className="rounded-md">{school.rank}</Badge>
                  <Link href={`/schools/${school.id}`} className="mt-3 block">
                    <h2 className="font-headline text-xl font-bold leading-tight group-hover:text-primary">{school.name}</h2>
                  </Link>
                </div>
                <GraduationCap className="mt-1 h-5 w-5 shrink-0 text-primary" />
              </div>
              <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">{school.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {school.services.slice(0, 3).map((service) => (
                  <Badge key={service} variant="secondary" className="rounded-md">{service}</Badge>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">{schoolTypeLabel[school.type]}</span>
                <Button asChild size="sm">
                  <Link href={`/schools/${school.id}`}>查看详情</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </StaticPageShell>
  );
}
