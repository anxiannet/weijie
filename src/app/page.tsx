import Image from 'next/image';
import Link from 'next/link';
import {
  BookOpen,
  Calendar,
  ChevronRight,
  GraduationCap,
  Heart,
  Home,
  Info,
  LogOut,
  MapPin,
  Plus,
  Search,
  SlidersHorizontal,
  Utensils,
} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {FavoriteButton} from '@/components/FavoriteButton';
import {Input} from '@/components/ui/input';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {signOutAction} from '@/app/actions';
import {LISTING_TYPE_LABELS, SCHOOL_OPTIONS} from '@/lib/marketplace';
import {createSupabaseAdminClient, createSupabaseServerClient} from '@/lib/supabase/server';
import type {Favorite, ListingWithOwner} from '@/lib/supabase/database.types';

export const dynamic = 'force-dynamic';

type HomeSearchParams = {
  q?: string;
  school?: string;
  type?: string;
  max?: string;
};

type CurrentUser = {
  id: string;
  displayName: string;
};

type FavoriteListing = Favorite & {
  listings: ListingWithOwner | null;
};

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

async function getMarketplaceData(filters: HomeSearchParams) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return {
      currentUser: null,
      listings: [] as ListingWithOwner[],
      favoriteListings: [] as ListingWithOwner[],
      configReady: false,
      schemaReady: false,
    };
  }

  const {
    data: {user},
  } = await supabase.auth.getUser();

  const readClient = createSupabaseAdminClient() || supabase;
  let currentUser: CurrentUser | null = null;

  if (user) {
    const {data: profile} = await (readClient as any)
      .from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .maybeSingle();
    const metadataName = typeof user.user_metadata?.display_name === 'string' ? user.user_metadata.display_name : '';
    const profileName = typeof profile?.display_name === 'string' ? profile.display_name : '';

    currentUser = {
      id: user.id,
      displayName: profileName || metadataName || user.email?.split('@')[0] || '维界用户',
    };
  }

  let favoriteListings: ListingWithOwner[] = [];

  if (user) {
    const {data: favoritesData, error: favoritesError} = await (readClient as any)
      .from('favorites')
      .select(
        'user_id, listing_id, created_at, listings(*, profiles!listings_owner_id_fkey(display_name, phone, avatar_url), favorites(user_id, listing_id, created_at))'
      )
      .eq('user_id', user.id)
      .order('created_at', {ascending: false});

    if (favoritesError) {
      return {
        currentUser,
        listings: [] as ListingWithOwner[],
        favoriteListings: [] as ListingWithOwner[],
        configReady: true,
        schemaReady: false,
      };
    }

    favoriteListings = ((favoritesData || []) as FavoriteListing[])
      .map((favorite) => favorite.listings)
      .filter((listing): listing is ListingWithOwner => Boolean(listing && listing.status === 'published'));
  }

  let query = readClient
    .from('listings')
    .select('*, profiles!listings_owner_id_fkey(display_name, phone, avatar_url), favorites(user_id, listing_id, created_at)')
    .eq('status', 'published')
    .order('created_at', {ascending: false})
    .limit(48);

  if (filters.q) {
    query = query.or(`title.ilike.%${filters.q}%,description.ilike.%${filters.q}%,location.ilike.%${filters.q}%`);
  }

  if (filters.school && filters.school !== 'all') {
    query = query.eq('nearest_school', filters.school);
  }

  if (filters.type && filters.type !== 'all') {
    query = query.eq('listing_type', filters.type);
  }

  const maxPrice = Number(filters.max);
  if (Number.isFinite(maxPrice) && maxPrice > 0) {
    query = query.lte('price_sgd', maxPrice);
  }

  const {data, error} = await query;
  if (error) {
    return {
      currentUser,
      listings: [] as ListingWithOwner[],
      favoriteListings,
      configReady: true,
      schemaReady: false,
    };
  }

  return {
    currentUser,
    listings: (data || []) as ListingWithOwner[],
    favoriteListings,
    configReady: true,
    schemaReady: true,
  };
}

function ListingCard({
  listing,
  currentUser,
  refreshFavoriteOnComplete = false,
}: {
  listing: ListingWithOwner;
  currentUser: CurrentUser | null;
  refreshFavoriteOnComplete?: boolean;
}) {
  const isFavorited = Boolean(listing.favorites?.some((favorite) => favorite.user_id === currentUser?.id));
  const imageUrl = listing.image_urls[0] || '/weijie-logo-wordmark.png';

  return (
    <Card className="group overflow-hidden transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
      <Link href={`/listings/${listing.id}`} className="block">
        <div className="relative aspect-[4/3] bg-muted">
          <Image src={imageUrl} alt={listing.title} fill unoptimized className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" sizes="(max-width: 768px) 100vw, 33vw" />
        </div>
      </Link>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Badge variant="secondary" className="rounded-md">{LISTING_TYPE_LABELS[listing.listing_type]}</Badge>
            <Link href={`/listings/${listing.id}`} className="mt-3 block">
              <h3 className="line-clamp-2 font-headline text-xl font-bold hover:text-primary">{listing.title}</h3>
            </Link>
          </div>
          <FavoriteButton listingId={listing.id} initialIsFavorited={isFavorited} refreshOnComplete={refreshFavoriteOnComplete} />
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
}

export default async function MarketplaceHome({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) || {};
  const filters = {
    q: getParam(params.q) || '',
    school: getParam(params.school) || 'all',
    type: getParam(params.type) || 'all',
    max: getParam(params.max) || '',
  };
  const {currentUser, listings, favoriteListings, configReady, schemaReady} = await getMarketplaceData(filters);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar variant="sidebar" className="border-r bg-sidebar">
          <SidebarHeader className="border-b p-6">
            <Link href="/" className="flex items-center gap-3">
              <span className="relative h-10 w-10 overflow-hidden rounded-lg border bg-background shadow-sm">
                <Image src="/weijie-logo-icon.png?v=202605141037" alt="维界图标" fill className="object-cover" sizes="40px" />
              </span>
              <span className="flex flex-col">
                <span className="font-headline font-bold leading-none tracking-tight text-foreground">维界</span>
                <span className="text-[10px] tracking-widest text-muted-foreground">新加坡留学生活系统</span>
              </span>
            </Link>
          </SidebarHeader>

          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider">
                主要功能
              </SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive tooltip="收藏">
                    <a href="#overview">
                      <Heart /> <span>我的收藏</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="房源">
                    <a href="#listings">
                      <Home /> <span>房源中心</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="指南">
                    <a href="/guides">
                      <BookOpen /> <span>生活指南</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="关于维界">
                    <a href="/about">
                      <Info /> <span>关于维界</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider">
                生活模块
              </SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="学校">
                    <a href="/schools">
                      <GraduationCap /> <span>院校信息</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="美食">
                    <a href="/food">
                      <Utensils /> <span>美食地图</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="活动">
                    <a href="/events">
                      <Calendar /> <span>活动中心</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t p-4 text-center">
            <p className="text-[11px] font-medium text-foreground">维界 · 新加坡留学生活系统</p>
            <p className="mt-1 text-[10px] text-muted-foreground">新加坡留学生活，一站到位。</p>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 overflow-auto">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md md:px-8">
            <div className="flex min-w-0 items-center gap-4">
              <SidebarTrigger />
              <div className="hidden h-4 w-px bg-border sm:block" />
              <div className="flex min-w-0 items-center gap-2 text-sm font-medium text-muted-foreground">
                <span className="relative h-6 w-6 shrink-0 overflow-hidden rounded-md border bg-background">
                  <Image src="/weijie-logo-icon.png?v=202605141037" alt="维界图标" fill className="object-cover" sizes="24px" />
                </span>
                <span>维界</span>
                <ChevronRight className="h-4 w-4 shrink-0" />
                <span className="truncate text-foreground">房源中心</span>
              </div>
            </div>
            <nav className="flex shrink-0 items-center gap-2">
              {currentUser ? (
                <>
                  <span className="hidden max-w-[180px] truncate text-sm font-medium text-foreground sm:inline">
                    {currentUser.displayName}
                  </span>
                  <Button asChild size="sm">
                    <Link href="/listings/new">
                      <Plus className="h-4 w-4" /> 发布
                    </Link>
                  </Button>
                  <form action={signOutAction}>
                    <Button variant="outline" size="sm" aria-label="退出">
                      <LogOut className="h-4 w-4" />
                      <span className="hidden sm:inline">退出</span>
                    </Button>
                  </form>
                </>
              ) : (
                <Button asChild size="sm">
                  <Link href="/auth">登录</Link>
                </Button>
              )}
            </nav>
          </header>

          <div className="mx-auto max-w-7xl p-4 md:p-8">
            <section id="overview" className="space-y-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="flex flex-col gap-2">
                  <Badge variant="secondary" className="w-fit rounded-md">我的收藏</Badge>
                  <h1 className="font-headline text-3xl font-bold leading-tight text-foreground md:text-4xl">收藏房源</h1>
                  <p className="max-w-2xl text-muted-foreground">先查看已经保存的房源，再继续比较新的租房选择。</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm text-muted-foreground">{currentUser ? `${favoriteListings.length} 个收藏` : '登录后显示收藏'}</p>
                  <Button asChild>
                    <Link href="/listings/new">
                      <Plus className="h-4 w-4" /> 发布房源
                    </Link>
                  </Button>
                </div>
              </div>

              {!currentUser ? (
                <div className="rounded-2xl border border-dashed bg-card p-8 text-center">
                  <Heart className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-4 font-semibold">登录后查看收藏房源</p>
                  <p className="mt-2 text-sm text-muted-foreground">收藏会同步到你的账户，方便之后继续比较。</p>
                  <Button asChild className="mt-6">
                    <Link href="/auth">登录</Link>
                  </Button>
                </div>
              ) : favoriteListings.length === 0 ? (
                <div className="rounded-2xl border border-dashed bg-card p-8 text-center">
                  <Heart className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-4 font-semibold">还没有收藏房源</p>
                  <p className="mt-2 text-sm text-muted-foreground">浏览房源时点击心形按钮，就可以把它保存到这里。</p>
                  <Button asChild variant="outline" className="mt-6">
                    <a href="#listings">
                      <Home className="h-4 w-4" /> 浏览房源
                    </a>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {favoriteListings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} currentUser={currentUser} refreshFavoriteOnComplete />
                  ))}
                </div>
              )}
            </section>

            <section id="listings" className="mt-8 space-y-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="flex flex-col gap-2">
                  <h2 className="font-headline text-3xl font-bold text-foreground">新加坡房源库</h2>
                  <p className="text-muted-foreground">真实房源、学生公寓与合租信息，快速找到适合自己的住所。</p>
                </div>
                <p className="text-sm text-muted-foreground">{listings.length} 个房源</p>
              </div>

              <form className="grid grid-cols-1 gap-3 rounded-2xl border bg-card p-4 shadow-sm md:grid-cols-[1fr_220px_180px_160px_auto]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input name="q" defaultValue={filters.q} placeholder="搜索地点、标题或描述" className="pl-9" />
                </div>
                <Select name="school" defaultValue={filters.school}>
                  <SelectTrigger>
                    <SelectValue placeholder="学校" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部学校</SelectItem>
                    {SCHOOL_OPTIONS.map((school) => (
                      <SelectItem key={school} value={school}>{school}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select name="type" defaultValue={filters.type}>
                  <SelectTrigger>
                    <SelectValue placeholder="类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部类型</SelectItem>
                    <SelectItem value="room">单间</SelectItem>
                    <SelectItem value="whole_unit">整套</SelectItem>
                    <SelectItem value="student_apartment">学生公寓</SelectItem>
                  </SelectContent>
                </Select>
                <Input name="max" defaultValue={filters.max} inputMode="numeric" placeholder="最高租金" />
                <Button>
                  <SlidersHorizontal className="h-4 w-4" /> 筛选
                </Button>
              </form>

              {(!configReady || !schemaReady) && (
                <Card className="border-amber-200 bg-amber-50 text-amber-950">
                  <CardContent className="p-6">
                    <p className="font-semibold">{configReady ? '需要初始化数据库表' : '需要连接生产数据源'}</p>
                    <p className="mt-2 text-sm leading-6">
                      {configReady
                        ? 'Supabase 环境变量已生效。请在 Supabase SQL Editor 执行 `supabase/migrations/001_marketplace.sql`，创建 listings、favorites、comments 和 profiles 表。'
                        : '请在 Vercel 配置 Supabase 环境变量，并执行 `supabase/migrations/001_marketplace.sql`。页面已按真实平台接入，不使用演示数据兜底。'}
                    </p>
                  </CardContent>
                </Card>
              )}

              {listings.length === 0 ? (
                <div className="rounded-2xl border border-dashed bg-card p-12 text-center">
                  <Home className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-4 font-semibold">暂无符合条件的房源</p>
                  <p className="mt-2 text-sm text-muted-foreground">调整筛选条件，或发布第一套真实房源。</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {listings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} currentUser={currentUser} />
                  ))}
                </div>
              )}
            </section>

            <footer className="mt-10 border-t pt-6 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">维界 · 新加坡留学生活系统</p>
            </footer>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
