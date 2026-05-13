import Image from 'next/image';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {ArrowLeft, Clock, MapPin, Star, Utensils} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {StaticPageShell} from '@/components/StaticPageShell';
import {FOOD_MOCK} from '@/app/lib/mock-data';

export function generateStaticParams() {
  return FOOD_MOCK.map((food) => ({id: food.id}));
}

export async function generateMetadata({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  const food = FOOD_MOCK.find((item) => item.id === id);
  return {
    title: food ? food.name : '美食详情',
    description: food ? `${food.name}：${food.category}，位于${food.location}。` : undefined,
  };
}

export default async function FoodDetailPage({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  const food = FOOD_MOCK.find((item) => item.id === id);

  if (!food) {
    notFound();
  }

  return (
    <StaticPageShell active="food" breadcrumb="美食详情">
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/food">
          <ArrowLeft className="h-4 w-4" /> 返回美食地图
        </Link>
      </Button>

      <article className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <section className="overflow-hidden rounded-3xl border bg-card shadow-sm">
            <div className="relative aspect-[16/7] bg-muted">
              <Image src={food.imageUrl} alt={food.name} fill unoptimized className="object-cover" sizes="(max-width: 1024px) 100vw, 900px" />
            </div>
            <div className="p-6 md:p-10">
              <Badge className="rounded-md">{food.category}</Badge>
              <h1 className="mt-5 font-headline text-4xl font-bold leading-tight md:text-5xl">{food.name}</h1>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                适合留学生日常聚餐、课后简餐或周末探索。当前为测试内容，可用于后续补充菜单、用户评价和收藏功能。
              </p>
            </div>
          </section>

          <Card>
            <CardContent className="p-6">
              <h2 className="font-headline text-2xl font-bold">推荐菜品</h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {food.specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary" className="rounded-md">{specialty}</Badge>
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
                  <span className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /> 位置</span>
                  <span className="font-medium">{food.location}</span>
                </div>
                <div className="flex items-center justify-between border-b pb-3">
                  <span className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4" /> 营业时间</span>
                  <span className="font-medium">{food.openingHours}</span>
                </div>
                <div className="flex items-center justify-between border-b pb-3">
                  <span className="flex items-center gap-2 text-muted-foreground"><Utensils className="h-4 w-4" /> 人均</span>
                  <span className="font-medium">{food.priceRange}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground"><Star className="h-4 w-4" /> 评分</span>
                  <span className="font-medium">{food.rating}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </article>
    </StaticPageShell>
  );
}
