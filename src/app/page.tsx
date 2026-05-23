import {headers} from 'next/headers';
import {redirect} from 'next/navigation';
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
  Plus,
  Search,
  SlidersHorizontal,
  UserSearch,
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
import type {ListingWithOwner} from '@/lib/supabase/database.types';

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

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function normalizeHost(value: string | null) {
  return value?.split(',')[0]?.split(':')[0]?.trim().toLowerCase();
}

async function redirectAnxianHostFromRoot() {
  const headerStore = await headers();
  const host = normalizeHost(headerStore.get('host'));
  const forwardedHost = normalizeHost(headerStore.get('x-forwarded-host'));

  if (host === 'anxian.weijie.sg' || forwardedHost === 'anxian.weijie.sg') {
    redirect('/anxian');
  }
}

async function getMarketplaceData(filters: HomeSearchParams) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return {
      currentUser: null,
      listings: [] as ListingWithOwner[],
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
      configReady: true,
      schemaReady: false,
    };
  }

  return {
    currentUser,
    listings: (data || []) as ListingWithOwner[],
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
    <Card className="group relative overflow-hidden transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
      <Link href={`/listings/${listing.id}`} className="block">
        <div className="relative aspect-[4/3] bg-muted">
          <Image src={imageUrl} alt={listing.title} fill unoptimized className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" sizes="(max-width: 768px) 100vw, 33vw" />
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
        <FavoriteButton listingId={listing.id} initialIsFavorited={isFavorited} refreshOnComplete={refreshFavoriteOnComplete} />
      </div>
      <CardContent className="p-4">
        <Link href={`/listings/${listing.id}`} className="block">
          <h3 className="line-clamp-2 font-headline text-base font-semibold leading-snug hover:text-primary">{listing.title}</h3>
        </Link>
      </CardContent>
    </Card>
  );
}

export default async function MarketplaceHome({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  await redirectAnxianHostFromRoot();

  const params = (await searchParams) || {};
  const filters = {
    q: getParam(params.q) || '',
    school: getParam(params.school) || 'all',
    type: getParam(params.type) || 'all',
    max: getParam(params.max) || '',
  };
  const {currentUser, listings, configReady, schemaReady} = await getMarketplaceData(filters);

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
                  <SidebarMenuButton asChild tooltip="收藏">
                    <a href="/favorites">
                      <Heart /> <span>我的收藏</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive tooltip="房源">
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
                  <SidebarMenuButton asChild tooltip="找人">
                    <a href="/people">
                      <UserSearch /> <span>找人</span>
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
                <>
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/login">登录</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href="/signup">注册</Link>
                  </Button>
                </>
              )}
            </nav>
          </header>

          <section className="border-b bg-gradient-to-b from-primary/10 via-background to-background px-4 py-10 md:px-8 md:py-14">
            <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl space-y-4">
                <Badge variant="outline" className="rounded-full border-primary/30 bg-primary/5 text-primary">
                  新加坡留学生活系统
                </Badge>
                <div className="space-y-3">
                  <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                    找房、找人、找生活入口，在维界完成。
                  </h1>
                  <p className="text-base leading-7 text-muted-foreground md:text-lg">
                    从房源、学校、美食到活动和达人，维界把新加坡留学生活拆成清晰可搜索的系统模块。
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg">
                    <a href="#listings">
                      浏览房源 <ChevronRight className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/people">寻找达人</Link>
                  </Button>
                </div>
              </div>

              <Card className="w-full max-w-md border-primary/20 bg-card/80 shadow-sm backdrop-blur">
                <CardContent className="p-5">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-lg border bg-background p-3">
                      <p className="text-2xl font-bold text-primary">{listings.length}</p>
                      <p className="mt-1 text-xs text-muted-foreground">已发布房源</p>
                    </div>
                    <div className="rounded-lg border bg-background p-3">
                      <p className="text-2xl font-bold text-primary">4</p>
                      <p className="mt-1 text-xs text-muted-foreground">生活模块</p>
                    </div>
                    <div className="rounded-lg border bg-background p-3">
                      <p className="text-2xl font-bold text-primary">24h</p>
                      <p className="mt-1 text-xs text-muted-foreground">持续更新</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="px-4 py-8 md:px-8" id="listings">
            <div className="mx-auto max-w-6xl space-y-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="font-headline text-2xl font-bold text-foreground">房源中心</h2>
                  <p className="mt-1 text-sm text-muted-foreground">筛选预算、学校和房型，先找到最合适的生活入口。</p>
                </div>
                <form className="grid w-full gap-3 rounded-xl border bg-card p-3 shadow-sm lg:max-w-3xl lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input name="q" defaultValue={filters.q} placeholder="搜索地点、描述" className="pl-9" />
                  </div>
                  <Select name="school" defaultValue={filters.school}>
                    <SelectTrigger>
                      <SelectValue placeholder="学校" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部学校</SelectItem>
                      {SCHOOL_OPTIONS.map((school) => (
                        <SelectItem key={school.value} value={school.value}>
                          {school.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select name="type" defaultValue={filters.type}>
                    <SelectTrigger>
                      <SelectValue placeholder="房型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部房型</SelectItem>
                      {Object.entries(LISTING_TYPE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input name="max" defaultValue={filters.max} type="number" min="0" placeholder="最高预算" />
                  <Button type="submit" className="gap-2">
                    <SlidersHorizontal className="h-4 w-4" /> 筛选
                  </Button>
                </form>
              </div>

              {!configReady ? (
                <Card className="border-dashed">
                  <CardContent className="p-6 text-sm text-muted-foreground">
                    Supabase 环境变量未配置。请设置 NEXT_PUBLIC_SUPABASE_URL 与 NEXT_PUBLIC_SUPABASE_ANON_KEY。
                  </CardContent>
                </Card>
              ) : !schemaReady ? (
                <Card className="border-dashed">
                  <CardContent className="p-6 text-sm text-muted-foreground">
                    数据库表尚未初始化。请先执行 Supabase schema 初始化脚本。
                  </CardContent>
                </Card>
              ) : listings.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="p-6 text-sm text-muted-foreground">
                    暂无符合条件的房源。你可以稍后再看，或先发布第一条房源。
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {listings.map((listing) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      currentUser={currentUser}
                      refreshFavoriteOnComplete={Boolean(currentUser)}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </SidebarProvider>
  );
}
