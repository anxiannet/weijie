import Image from 'next/image';
import Link from 'next/link';
import {redirect} from 'next/navigation';
import {Heart, Home} from 'lucide-react';
import {FavoriteButton} from '@/components/FavoriteButton';
import {StaticPageShell} from '@/components/StaticPageShell';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {LISTING_TYPE_LABELS} from '@/lib/marketplace';
import {createSupabaseAdminClient, createSupabaseServerClient} from '@/lib/supabase/server';
import type {Favorite, ListingWithOwner} from '@/lib/supabase/database.types';

export const dynamic = 'force-dynamic';

type FavoriteListing = Favorite & {
  listings: ListingWithOwner | null;
};

async function getFavoriteListings() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return {favorites: [] as FavoriteListing[], configReady: false, schemaReady: false};
  }

  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth?next=/favorites&message=登录后可以查看收藏房源');
  }

  const readClient = createSupabaseAdminClient() || supabase;
  const {data, error} = await (readClient as any)
    .from('favorites')
    .select(
      'user_id, listing_id, created_at, listings(*, profiles!listings_owner_id_fkey(display_name, phone, avatar_url), favorites(user_id, listing_id, created_at))'
    )
    .eq('user_id', user.id)
    .order('created_at', {ascending: false});

  if (error) {
    return {favorites: [] as FavoriteListing[], configReady: true, schemaReady: false};
  }

  return {
    favorites: ((data || []) as FavoriteListing[]).filter((favorite) => favorite.listings?.status === 'published'),
    configReady: true,
    schemaReady: true,
  };
}

export default async function FavoritesPage() {
  const {favorites, configReady, schemaReady} = await getFavoriteListings();

  return (
    <StaticPageShell active="favorites" breadcrumb="我的收藏">
      <div>
        <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge variant="secondary" className="rounded-md">
              我的收藏
            </Badge>
            <h1 className="mt-4 font-headline text-4xl font-bold leading-tight text-foreground">收藏内容</h1>
          </div>
          <Button asChild>
            <Link href="/#listings">
              <Home className="h-4 w-4" /> 浏览房源
            </Link>
          </Button>
        </section>

        <div className="mt-6 flex flex-wrap gap-2 border-b pb-6">
          <Button>房源 {favorites.length}</Button>
          <Button variant="outline" disabled>美食</Button>
          <Button variant="outline" disabled>活动</Button>
        </div>

        {(!configReady || !schemaReady) && (
          <Card className="mt-8 border-amber-200 bg-amber-50 text-amber-950">
            <CardContent className="p-6">
              <p className="font-semibold">{configReady ? '需要初始化数据库表' : '需要连接生产数据源'}</p>
              <p className="mt-2 text-sm leading-6">
                请确认 Supabase 已执行 `supabase/migrations/001_marketplace.sql`，并已创建 favorites 表。
              </p>
            </CardContent>
          </Card>
        )}

        {favorites.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed bg-card p-12 text-center">
            <Heart className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-4 font-semibold">还没有收藏房源</p>
            <p className="mt-2 text-sm text-muted-foreground">浏览房源时点击心形按钮，就可以把它保存到这里。</p>
            <Button asChild className="mt-6">
              <Link href="/#listings">
                <Home className="h-4 w-4" /> 浏览房源
              </Link>
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((favorite) => {
              const listing = favorite.listings;

              if (!listing) {
                return null;
              }

              const imageUrl = listing.image_urls[0] || '/weijie-logo-wordmark.png';

              return (
                <Card key={favorite.listing_id} className="group relative overflow-hidden transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
                  <Link href={`/listings/${listing.id}`} className="block">
                    <div className="relative aspect-[4/3] bg-muted">
                      <Image
                        src={imageUrl}
                        alt={listing.title}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute left-3 right-16 top-3 flex flex-wrap gap-2">
                        <Badge variant="secondary" className="rounded-md bg-background/90 shadow-sm backdrop-blur">
                          {LISTING_TYPE_LABELS[listing.listing_type]}
                        </Badge>
                        {listing.nearest_school && (
                          <Badge variant="secondary" className="rounded-md bg-background/90 shadow-sm backdrop-blur">
                            {listing.nearest_school}
                            </Badge>
                          )}
                        </div>
                        <div className="absolute bottom-3 right-3">
                          <div className="rounded-md bg-background/90 px-3 py-1.5 text-sm font-semibold text-primary shadow-sm backdrop-blur">
                            每月 {listing.price_sgd} 新币
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="absolute right-3 top-3 z-10">
                    <FavoriteButton listingId={listing.id} initialIsFavorited refreshOnComplete />
                  </div>
                  <CardContent className="p-4">
                    <Link href={`/listings/${listing.id}`} className="block">
                      <h2 className="line-clamp-2 font-headline text-base font-semibold leading-snug hover:text-primary">{listing.title}</h2>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </StaticPageShell>
  );
}
