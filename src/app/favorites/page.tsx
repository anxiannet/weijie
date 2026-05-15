import Image from 'next/image';
import Link from 'next/link';
import {redirect} from 'next/navigation';
import {ArrowLeft, Heart, Home, MapPin} from 'lucide-react';
import {FavoriteButton} from '@/components/FavoriteButton';
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
    redirect('/auth?message=登录后可以查看收藏房源');
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
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/#listings">
            <ArrowLeft className="h-4 w-4" /> 返回房源中心
          </Link>
        </Button>

        <section className="flex flex-col gap-4 border-b pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge variant="secondary" className="rounded-md">
              收藏
            </Badge>
            <h1 className="mt-4 font-headline text-4xl font-bold leading-tight text-foreground">我的收藏房源</h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              保存正在比较的房源，方便之后继续查看位置、租金和发布者信息。
            </p>
          </div>
          <p className="text-sm text-muted-foreground">{favorites.length} 个收藏</p>
        </section>

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
                <Card key={favorite.listing_id} className="group overflow-hidden transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
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
                    </div>
                  </Link>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Badge variant="secondary" className="rounded-md">
                          {LISTING_TYPE_LABELS[listing.listing_type]}
                        </Badge>
                        <Link href={`/listings/${listing.id}`} className="mt-3 block">
                          <h2 className="line-clamp-2 font-headline text-xl font-bold hover:text-primary">{listing.title}</h2>
                        </Link>
                      </div>
                      <FavoriteButton listingId={listing.id} initialIsFavorited refreshOnComplete />
                    </div>
                    <p className="mt-3 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" /> {listing.location}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <p className="font-headline text-2xl font-bold text-primary">S${listing.price_sgd}</p>
                      <p className="text-sm text-muted-foreground">每月</p>
                    </div>
                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-muted-foreground">{listing.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
