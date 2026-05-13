import Image from 'next/image';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {ArrowLeft, CalendarDays, Clock, MapPin, Users} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {StaticPageShell} from '@/components/StaticPageShell';
import {EVENTS_MOCK} from '@/app/lib/mock-data';

const dateFormatter = new Intl.DateTimeFormat('zh-SG', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'short',
});

export function generateStaticParams() {
  return EVENTS_MOCK.map((event) => ({id: event.id}));
}

export async function generateMetadata({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  const event = EVENTS_MOCK.find((item) => item.id === id);
  return {
    title: event ? event.title : '活动详情',
    description: event ? `${event.title}：${event.location}，${event.date} ${event.time}。` : undefined,
  };
}

export default async function EventDetailPage({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  const event = EVENTS_MOCK.find((item) => item.id === id);

  if (!event) {
    notFound();
  }

  return (
    <StaticPageShell active="events" breadcrumb="活动详情">
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/events">
          <ArrowLeft className="h-4 w-4" /> 返回活动中心
        </Link>
      </Button>

      <article className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <section className="overflow-hidden rounded-3xl border bg-card shadow-sm">
            <div className="relative aspect-[16/7] bg-muted">
              <Image src={event.imageUrl} alt={event.title} fill unoptimized className="object-cover" sizes="(max-width: 1024px) 100vw, 900px" />
            </div>
            <div className="p-6 md:p-10">
              <Badge className="rounded-md">{event.organizer}</Badge>
              <h1 className="mt-5 font-headline text-4xl font-bold leading-tight md:text-5xl">{event.title}</h1>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                面向新加坡留学生的生活、社交与落地活动。当前为测试内容，可用于后续接入报名、收藏、评论和活动发布流程。
              </p>
            </div>
          </section>

          <Card>
            <CardContent className="p-6">
              <h2 className="font-headline text-2xl font-bold">活动流程</h2>
              <div className="mt-5 space-y-3">
                {event.schedule.map((item, index) => (
                  <div key={item} className="flex gap-3 rounded-2xl border bg-background p-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {index + 1}
                    </span>
                    <p className="text-sm font-medium text-foreground">{item}</p>
                  </div>
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
                <div className="flex items-center justify-between gap-4 border-b pb-3">
                  <span className="flex items-center gap-2 text-muted-foreground"><CalendarDays className="h-4 w-4" /> 日期</span>
                  <span className="text-right font-medium">{dateFormatter.format(new Date(event.date))}</span>
                </div>
                <div className="flex items-center justify-between border-b pb-3">
                  <span className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4" /> 时间</span>
                  <span className="font-medium">{event.time}</span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b pb-3">
                  <span className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /> 地点</span>
                  <span className="text-right font-medium">{event.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground"><Users className="h-4 w-4" /> 关注</span>
                  <span className="font-medium">{event.attendees} 人</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </article>
    </StaticPageShell>
  );
}
