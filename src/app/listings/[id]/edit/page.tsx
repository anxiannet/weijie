import Link from 'next/link';
import {notFound, redirect} from 'next/navigation';
import {ArrowLeft} from 'lucide-react';
import {updateListingAction} from '@/app/actions';
import {ListingImageUpload} from '@/components/ListingImageUpload';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Textarea} from '@/components/ui/textarea';
import {AMENITY_OPTIONS, SCHOOL_OPTIONS} from '@/lib/marketplace';
import {createSupabaseAdminClient, createSupabaseServerClient} from '@/lib/supabase/server';
import type {Listing} from '@/lib/supabase/database.types';

export const dynamic = 'force-dynamic';

export default async function EditListingPage({
  params,
  searchParams,
}: {
  params: Promise<{id: string}>;
  searchParams: Promise<{error?: string}>;
}) {
  const {id} = await params;
  const {error: formError} = await searchParams;
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return (
      <main className="min-h-screen bg-muted/40 px-4 py-8">
        <div className="mx-auto max-w-4xl rounded-2xl border bg-card p-6">
          <p className="font-semibold">缺少 Supabase 配置</p>
          <p className="mt-2 text-sm text-muted-foreground">配置完成后才能修改房源信息。</p>
        </div>
      </main>
    );
  }

  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth');
  }

  const readClient = createSupabaseAdminClient() || supabase;
  const {data: listing, error} = await (readClient as any).from('listings').select('*').eq('id', id).single();

  if (error || !listing || listing.owner_id !== user.id) {
    notFound();
  }

  const currentListing = listing as Listing;
  const imageUrls = Array.isArray(currentListing.image_urls) ? currentListing.image_urls : [];
  const amenities = Array.isArray(currentListing.amenities) ? currentListing.amenities : [];

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link href={`/listings/${currentListing.id}`}><ArrowLeft className="h-4 w-4" /> 返回房源详情</Link>
        </Button>

        <Card>
          <CardHeader>
            <Badge className="w-fit rounded-md">编辑房源</Badge>
            <CardTitle className="font-headline text-3xl">更新房源信息与照片</CardTitle>
          </CardHeader>
          <CardContent>
            {formError && (
              <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm leading-6 text-destructive">
                {formError}
              </div>
            )}
            <form action={updateListingAction} className="space-y-8">
              <input type="hidden" name="listing_id" value={currentListing.id} />

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="title">标题</Label>
                  <Input id="title" name="title" defaultValue={currentListing.title} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">月租</Label>
                  <Input id="price" name="price_sgd" inputMode="numeric" defaultValue={currentListing.price_sgd} required />
                </div>
                <div className="space-y-2">
                  <Label>类型</Label>
                  <Select name="listing_type" defaultValue={currentListing.listing_type}>
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
                  <Input id="location" name="location" defaultValue={currentListing.location} required />
                </div>
                <div className="space-y-2">
                  <Label>附近学校</Label>
                  <Select name="nearest_school" defaultValue={currentListing.nearest_school ?? undefined}>
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
                  <Input id="mrt" name="mrt_station" defaultValue={currentListing.mrt_station ?? ''} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">卧室</Label>
                    <Input id="bedrooms" name="bedrooms" inputMode="numeric" defaultValue={currentListing.bedrooms ?? ''} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">卫浴</Label>
                    <Input id="bathrooms" name="bathrooms" inputMode="numeric" defaultValue={currentListing.bathrooms ?? ''} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="available-from">可入住日期</Label>
                  <Input id="available-from" name="available_from" type="date" defaultValue={currentListing.available_from ?? ''} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">房源描述</Label>
                  <Textarea id="description" name="description" rows={7} defaultValue={currentListing.description} required />
                </div>
              </div>

              <div className="space-y-3">
                <Label>设施与规则</Label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {AMENITY_OPTIONS.map((amenity) => (
                    <label key={amenity} className="flex items-center gap-2 rounded-xl border bg-background p-3 text-sm">
                      <input
                        name={`amenity:${amenity}`}
                        type="checkbox"
                        defaultChecked={amenities.includes(amenity)}
                        className="h-4 w-4 accent-primary"
                      />
                      {amenity}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>图片</Label>
                <ListingImageUpload initialImageUrls={imageUrls} />
              </div>

              <Button size="lg" className="w-full">保存修改</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
