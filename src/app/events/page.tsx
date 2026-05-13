import Image from 'next/image';
import Link from 'next/link';
import {CalendarDays, Clock, MapPin, Users} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {StaticPageShell} from '@/components/StaticPageShell';
import {EVENTS_MOCK} from '@/app/lib/mock-data';

export const metadata = {
  title: '活动中心',
  description: '新加坡留学生活动、看房路线、城市探索和社区交换测试数据。',
};

const dateFormatter = new Intl.DateTimeFormat('zh-SG', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'short',
});

export default function EventsPage() {
  return (
    <StaticPageShell active="events" breadcrumb="活动中心">
      <section className="overflow-hidden rounded-3xl border bg-card shadow-sm">
        <div className="p-6 md:p-10">
          <Badge className="rounded-md">活动中心</Badge>
          <h1 className="mt-5 font-headline text-4xl font-bold leading-tight md:text-5xl">新加坡留学生活动中心</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
            用测试数据展示校园活动、看房路线、城市探索与本地生活体验，后续可接入真实发布与报名流程。
          </p>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {EVENTS_MOCK.map((event) => (
          <Card key={event.id} className="group overflow-hidden transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr]">
              <Link href={`/events/${event.id}`} className="relative aspect-[4/3] bg-muted md:aspect-auto">
                <Image src={event.imageUrl} alt={event.title} fill unoptimized className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" sizes="(max-width: 768px) 100vw, 240px" />
              </Link>
              <CardContent className="p-5">
                <Badge variant="outline" className="rounded-md">{event.organizer}</Badge>
                <Link href={`/events/${event.id}`} className="mt-3 block">
                  <h2 className="font-headline text-xl font-bold leading-tight group-hover:text-primary">{event.title}</h2>
                </Link>

                <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                  <p className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-primary" /> {dateFormatter.format(new Date(event.date))}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" /> {event.time}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" /> {event.location}
                  </p>
                  <p className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" /> {event.attendees} 人关注
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {event.schedule.map((item) => (
                    <Badge key={item} variant="secondary" className="rounded-md">{item}</Badge>
                  ))}
                </div>
                <Button asChild size="sm" className="mt-5">
                  <Link href={`/events/${event.id}`}>查看详情</Link>
                </Button>
              </CardContent>
            </div>
          </Card>
        ))}
      </section>
    </StaticPageShell>
  );
}
