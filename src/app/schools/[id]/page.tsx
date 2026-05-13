import Image from 'next/image';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {ArrowLeft, ExternalLink, GraduationCap} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {StaticPageShell} from '@/components/StaticPageShell';
import {SCHOOLS_MOCK} from '@/app/lib/mock-data';

const schoolTypeLabel = {
  University: '公立大学',
  Polytechnic: '理工学院',
  Private: '私立院校',
  Arts: '艺术院校',
} as const;

export function generateStaticParams() {
  return SCHOOLS_MOCK.map((school) => ({id: school.id}));
}

export async function generateMetadata({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  const school = SCHOOLS_MOCK.find((item) => item.id === id);
  return {
    title: school ? school.name : '院校信息',
    description: school?.description,
  };
}

export default async function SchoolDetailPage({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  const school = SCHOOLS_MOCK.find((item) => item.id === id);

  if (!school) {
    notFound();
  }

  return (
    <StaticPageShell active="schools" breadcrumb="院校详情">
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/schools">
          <ArrowLeft className="h-4 w-4" /> 返回院校
        </Link>
      </Button>

      <article className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <section className="overflow-hidden rounded-3xl border bg-card shadow-sm">
            <div className="relative aspect-[16/7] bg-muted">
              <Image src={school.imageUrl} alt={school.name} fill unoptimized className="object-cover" sizes="(max-width: 1024px) 100vw, 900px" />
            </div>
            <div className="p-6 md:p-10">
              <Badge className="rounded-md">{school.rank}</Badge>
              <h1 className="mt-5 font-headline text-4xl font-bold leading-tight md:text-5xl">{school.name}</h1>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">{school.description}</p>
            </div>
          </section>

          <Card>
            <CardContent className="p-6">
              <h2 className="font-headline text-2xl font-bold">课程方向</h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {school.courses.map((course) => (
                  <Badge key={course} variant="secondary" className="rounded-md">{course}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="font-headline text-xl font-bold">关键信息</h2>
              <div className="mt-5 space-y-4 text-sm">
                <div className="flex items-center justify-between border-b pb-3">
                  <span className="text-muted-foreground">类型</span>
                  <span className="font-medium">{schoolTypeLabel[school.type]}</span>
                </div>
                <div className="flex items-center justify-between border-b pb-3">
                  <span className="text-muted-foreground">排名</span>
                  <span className="font-medium">{school.rank}</span>
                </div>
                <Button asChild className="w-full">
                  <a href={school.website} target="_blank" rel="noreferrer">
                    访问官网 <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h2 className="font-headline text-xl font-bold">学生服务</h2>
              <div className="mt-5 space-y-3">
                {school.services.map((service) => (
                  <p key={service} className="flex gap-3 text-sm">
                    <GraduationCap className="h-4 w-4 shrink-0 text-primary" />
                    {service}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>
      </article>
    </StaticPageShell>
  );
}
