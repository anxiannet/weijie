import Image from 'next/image';
import Link from 'next/link';
import {Clock, MapPin, Star, Utensils} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {StaticPageShell} from '@/components/StaticPageShell';
import {FOOD_MOCK} from '@/app/lib/mock-data';

export const metadata = {
  title: '美食地图',
  description: '适合新加坡留学生的餐厅、食阁和平价美食测试数据。',
};

export default function FoodPage() {
  return (
    <StaticPageShell active="food" breadcrumb="美食地图">
      <section className="overflow-hidden rounded-3xl border bg-card shadow-sm">
        <div className="p-6 md:p-10">
          <Badge className="rounded-md">美食地图</Badge>
          <h1 className="mt-5 font-headline text-4xl font-bold leading-tight md:text-5xl">新加坡留学生美食地图</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
            收集适合日常聚餐、课后简餐和周末探索的餐厅与食阁，用测试数据先搭好内容结构。
          </p>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {FOOD_MOCK.map((food) => (
          <Card key={food.id} className="group overflow-hidden transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
            <Link href={`/food/${food.id}`} className="block">
              <div className="relative aspect-[4/3] bg-muted">
                <Image src={food.imageUrl} alt={food.name} fill unoptimized className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
            </Link>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Badge variant="outline" className="rounded-md">{food.category}</Badge>
                  <Link href={`/food/${food.id}`} className="mt-3 block">
                    <h2 className="font-headline text-xl font-bold leading-tight group-hover:text-primary">{food.name}</h2>
                  </Link>
                </div>
                <Utensils className="mt-1 h-5 w-5 shrink-0 text-primary" />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {food.specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary" className="rounded-md">{specialty}</Badge>
                ))}
              </div>

              <div className="mt-5 space-y-3 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" /> {food.location}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" /> {food.openingHours}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t pt-4">
                <span className="font-medium text-foreground">{food.priceRange}</span>
                <span className="flex items-center gap-1 font-semibold text-primary">
                  <Star className="h-4 w-4 fill-primary" /> {food.rating}
                </span>
              </div>
              <Button asChild size="sm" className="mt-5 w-full">
                <Link href={`/food/${food.id}`}>查看详情</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </StaticPageShell>
  );
}
