import Link from 'next/link';
import {redirect} from 'next/navigation';
import {ArrowLeft} from 'lucide-react';
import {createListingAction} from '@/app/actions';
import {ListingImageUpload} from '@/components/ListingImageUpload';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Textarea} from '@/components/ui/textarea';
import {AMENITY_OPTIONS, SCHOOL_OPTIONS} from '@/lib/marketplace';
import {createSupabaseServerClient} from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function NewListingPage({
  searchParams,
}: {
  searchParams: Promise<{error?: string}>;
}) {
  const {error} = await searchParams;
  const supabase = await createSupabaseServerClient();
  const {
    data: {user},
  } = supabase ? await supabase.auth.getUser() : {data: {user: null}};

  if (supabase && !user) {
    redirect('/auth');
  }

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/"><ArrowLeft className="h-4 w-4" /> 返回房源市场</Link>
        </Button>

        <Card>
          <CardHeader>
            <Badge className="w-fit rounded-md">发布房源</Badge>
            <CardTitle className="font-headline text-3xl">提交真实、可联系、可审核的房源</CardTitle>
          </CardHeader>
          <CardContent>
            {!supabase && (
              <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
                缺少 Supabase 环境变量。发布功能已接入真实数据源，配置完成后即可使用。
              </div>
            )}
            {error && (
              <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm leading-6 text-destructive">
                {error}
              </div>
            )}

            <form action={createListingAction} className="space-y-8">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="title">标题</Label>
                  <Input id="title" name="title" placeholder="例如：近新加坡国立大学单间，步行到地铁" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">月租</Label>
                  <Input id="price" name="price_sgd" inputMode="numeric" placeholder="1200" required />
                </div>
                <div className="space-y-2">
                  <Label>类型</Label>
                  <Select name="listing_type" defaultValue="room">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="room">单间</SelectItem>
                      <SelectItem value="whole_unit">整套</SelectItem>
                      <SelectItem value="student_apartment">学生公寓</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">位置</Label>
                  <Input id="location" name="location" placeholder="女皇镇、金文泰、武吉知马" required />
                </div>
                <div className="space-y-2">
                  <Label>附近学校</Label>
                  <Select name="nearest_school">
                    <SelectTrigger><SelectValue placeholder="选择学校" /></SelectTrigger>
                    <SelectContent>
                      {SCHOOL_OPTIONS.map((school) => (
                        <SelectItem key={school} value={school}>{school}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mrt">附近地铁</Label>
                  <Input id="mrt" name="mrt_station" placeholder="例如：金文泰站" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">卧室</Label>
                    <Input id="bedrooms" name="bedrooms" inputMode="numeric" placeholder="1" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">卫浴</Label>
                    <Input id="bathrooms" name="bathrooms" inputMode="numeric" placeholder="1" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="available-from">可入住日期</Label>
                  <Input id="available-from" name="available_from" type="date" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">房源描述</Label>
                  <Textarea id="description" name="description" rows={7} placeholder="说明通勤、家具、费用包含项、合同要求和看房方式。" required />
                </div>
              </div>

              <div className="space-y-3">
                <Label>设施与规则</Label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {AMENITY_OPTIONS.map((amenity) => (
                    <label key={amenity} className="flex items-center gap-2 rounded-xl border bg-background p-3 text-sm">
                      <input name={`amenity:${amenity}`} type="checkbox" className="h-4 w-4 accent-primary" />
                      {amenity}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>图片</Label>
                <ListingImageUpload />
              </div>

              <Button size="lg" className="w-full" disabled={!supabase}>发布房源</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
