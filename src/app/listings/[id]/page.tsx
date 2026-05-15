import Image from 'next/image';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {ArrowLeft, CalendarDays, Heart, MapPin, MessageCircle, Pencil, TrainFront} from 'lucide-react';
import {addCommentAction, toggleFavoriteAction} from '@/app/actions';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Textarea} from '@/components/ui/textarea';
import {LISTING_TYPE_LABELS} from '@/lib/marketplace';
import {createSupabaseAdminClient, createSupabaseServerClient} from '@/lib/supabase/server';
import type {Comment, ListingWithOwner} from '@/lib/supabase/database.types';

export const dynamic = 'force-dynamic';

async function getListing(id: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return {listing: null, comments: [] as Comment[], userId: null, configReady: false};
  }

  const {
    data: {user},
  } = await supabase.auth.getUser();
  const readClient = createSupabaseAdminClient() || supabase;

  const {data, error} = await readClient
    .from('listings')
    .select('*, profiles!listings_owner_id_fkey(display_name, phone, avatar_url), favorites(user_id, listing_id, created_at)')
    .eq('id', id)
    .eq('status', 'published')
    .single();

  if (error || !data) {
    return {listing: null, comments: [] as Comment[], userId: user?.id ?? null, configReady: true};
  }

  const {data: comments} = await readClient
    .from('comments')
    .select('*, profiles(display_name, avatar_url)')
    .eq('listing_id', id)
    .order('created_at', {ascending: false});

  return {
    listing: data as ListingWithOwner,
    comments: (comments || []) as Comment[],
    userId: user?.id ?? null,
    configReady: true,
  };
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{id: string}>;
}) {
  const {id} = await params;
  const {listing, comments, userId, configReady} = await getListing(id);

  if (!configReady) {
    return (
      <main className="min-h-screen bg-muted/40 px-4 py-8">
        <div className="mx-auto max-w-4xl rounded-2xl border bg-card p-6">
          <p className="font-semibold">缺少 Supabase 配置</p>
          <p className="mt-2 text-sm text-muted-foreground">配置完成后才能查看真实房源详情。</p>
        </div>
      </main>
    );
  }

  if (!listing) notFound();

  const isFavorited = Boolean(listing.favorites?.some((favorite) => favorite.user_id === userId));
  const canEdit = listing.owner_id === userId;
  const images = listing.image_urls.length > 0 ? listing.image_urls : ['/weijie-logo-wordmark.png'];

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/"><ArrowLeft className="h-4 w-4" /> 返回房源市场</Link>
        </Button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <div className="-mx-4 overflow-x-auto px-4 pb-3 md:-mx-6 md:px-6">
              <div className="flex snap-x snap-mandatory gap-3">
                {images.map((image, index) => (
                  <div
                    key={image}
                    className="relative aspect-[4/3] w-[86vw] max-w-[760px] shrink-0 snap-start overflow-hidden rounded-3xl bg-muted sm:w-[72vw] lg:w-[min(760px,calc(100vw-500px))]"
                  >
                    <Image
                      src={image}
                      alt={`${listing.title} 图片 ${index + 1}`}
                      fill
                      priority={index === 0}
                      unoptimized
                      className="object-cover"
                      sizes="(max-width: 640px) 86vw, (max-width: 1024px) 72vw, 760px"
                    />
                  </div>
                ))}
              </div>
            </div>

            <section className="mt-8">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="rounded-md">{LISTING_TYPE_LABELS[listing.listing_type]}</Badge>
                {listing.nearest_school && <Badge variant="secondary" className="rounded-md">{listing.nearest_school}</Badge>}
              </div>
              <h1 className="mt-4 font-headline text-4xl font-bold leading-tight">{listing.title}</h1>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {listing.location}</span>
                {listing.mrt_station && <span className="flex items-center gap-1"><TrainFront className="h-4 w-4" /> {listing.mrt_station}</span>}
                {listing.available_from && <span className="flex items-center gap-1"><CalendarDays className="h-4 w-4" /> {listing.available_from} 可入住</span>}
              </div>
              <p className="mt-8 whitespace-pre-line text-lg leading-8 text-muted-foreground">{listing.description}</p>

              {listing.amenities.length > 0 && (
                <div className="mt-8">
                  <h2 className="font-headline text-2xl font-bold">设施与规则</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {listing.amenities.map((amenity) => (
                      <Badge key={amenity} variant="outline" className="rounded-md px-3 py-1">{amenity}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <section className="mt-10">
              <h2 className="flex items-center gap-2 font-headline text-2xl font-bold">
                <MessageCircle className="h-5 w-5" /> 留言与提问
              </h2>
              <Card className="mt-4">
                <CardContent className="p-5">
                  {userId ? (
                    <form action={addCommentAction} className="space-y-3">
                      <input type="hidden" name="listing_id" value={listing.id} />
                      <Textarea name="body" placeholder="向发布者询问看房时间、费用包含项或合同细节。" required />
                      <Button>发布留言</Button>
                    </form>
                  ) : (
                    <div className="rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground">
                      登录后可以收藏房源和发布留言。
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="mt-4 space-y-3">
                {comments.map((comment) => (
                  <Card key={comment.id}>
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium">{comment.profiles?.display_name || '维界用户'}</p>
                        <p className="text-xs text-muted-foreground">{new Date(comment.created_at).toLocaleDateString('zh-SG')}</p>
                      </div>
                      <p className="mt-3 whitespace-pre-line text-sm leading-6 text-muted-foreground">{comment.body}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-3xl text-primary">S${listing.price_sgd}<span className="text-base font-normal text-muted-foreground"> / 月</span></CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form action={toggleFavoriteAction}>
                  <input type="hidden" name="listing_id" value={listing.id} />
                  <input type="hidden" name="is_favorited" value={String(isFavorited)} />
                  <Button className="w-full" variant={isFavorited ? 'secondary' : 'default'}>
                    <Heart className={isFavorited ? 'h-4 w-4 fill-current' : 'h-4 w-4'} />
                    {isFavorited ? '已收藏' : '收藏房源'}
                  </Button>
                </form>
                <div className="rounded-xl bg-muted/50 p-4 text-sm leading-6 text-muted-foreground">
                  <p className="font-medium text-foreground">发布者</p>
                  <p className="mt-1">{listing.profiles?.display_name || '维界用户'}</p>
                  {listing.profiles?.phone && <p className="mt-1">联系方式：{listing.profiles.phone}</p>}
                </div>
                {canEdit && (
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/listings/${listing.id}/edit`}>
                      <Pencil className="h-4 w-4" />
                      编辑房源
                    </Link>
                  </Button>
                )}
                <Button asChild variant="outline" className="w-full">
                  <Link href="/listings/new">发布相似房源</Link>
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}
