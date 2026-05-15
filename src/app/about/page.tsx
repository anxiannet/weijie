import Image from 'next/image';
import {Code2, MessageCircle, UsersRound} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import {Card, CardContent} from '@/components/ui/card';
import {StaticPageShell} from '@/components/StaticPageShell';

export const metadata = {
  title: '关于维界',
  description: '了解维界，并通过微信 weijie-sg 提供建议、参与开发或加入新加坡留学生活动群。',
};

const contactOptions = [
  {
    title: '提供建议与意见',
    body: '如果你在租房、学校信息、美食、活动或生活指南中发现可以改进的地方，可以直接联系维界。',
    icon: MessageCircle,
  },
  {
    title: '参与产品与开发',
    body: '欢迎对内容整理、设计、前端、后端、数据结构或社区运营感兴趣的同学一起共建。',
    icon: Code2,
  },
  {
    title: '加入留学生活动群',
    body: '可以通过微信了解新加坡留学生活动、社交、周末推荐和本地生活信息。',
    icon: UsersRound,
  },
];

export default function AboutPage() {
  return (
    <StaticPageShell active="about" breadcrumb="关于维界">
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-3xl border bg-card p-6 shadow-sm md:p-10">
          <Badge className="rounded-md">关于维界</Badge>
          <h1 className="mt-5 font-headline text-4xl font-bold leading-tight text-foreground md:text-5xl">
            新加坡留学生生活平台
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
            维界诞生于留学生真实的生活需求。我们希望把租房、学校、美食、活动与本地生活信息整理成一个清晰、可信、可持续使用的平台。
          </p>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
            维界不是传统资讯号，也不是留学中介。它更像一个面向新加坡中国留学生的生活入口，帮助大家更快理解本地规则、找到可靠信息，并建立真实连接。
          </p>
        </div>

        <Card className="overflow-hidden rounded-3xl shadow-sm">
          <CardContent className="p-6">
            <div className="rounded-2xl border bg-background p-4">
              <Image
                src="/weijie-wechat-qr.jpg"
                alt="维界微信二维码"
                width={888}
                height={1134}
                className="h-auto w-full rounded-xl"
                priority
              />
            </div>
            <div className="mt-5 text-center">
              <p className="text-sm text-muted-foreground">微信号</p>
              <p className="mt-1 font-headline text-2xl font-bold text-foreground">weijie-sg</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                扫码添加微信，备注你的需求或想参与的方向。
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        {contactOptions.map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.title} className="transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
              <CardContent className="p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="mt-5 font-headline text-xl font-bold text-foreground">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.body}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </StaticPageShell>
  );
}
