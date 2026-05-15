import Image from 'next/image';
import Link from 'next/link';
import {
  BookOpen,
  Calendar,
  ChevronRight,
  GraduationCap,
  Heart,
  Home,
  LayoutDashboard,
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
import {signOutAction, toggleFavoriteAction} from '@/app/actions';
import {hasSupabaseConfig} from '@/lib/env';
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

async function getMarketplaceData(filters: HomeSearchParams) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return {currentUser: null, listings: [] as ListingWithOwner[], configReady: false, schemaReady: false};
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
                  <SidebarMenuButton asChild isActive tooltip="控制台">
                    <a href="#overview">
                      <LayoutDashboard /> <span>主控制台</span>
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
            <section id="overview" className="home-intro-section overflow-hidden rounded-3xl border bg-card shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.12fr)_minmax(320px,0.88fr)]">
                <div className="p-6 md:p-10">
                  <div className="relative h-24 w-full max-w-md md:h-28">
                    <Image
                      src="/weijie-logo-wordmark.png"
                      alt="维界标志"
                      fill
                      priority
                      className="object-contain object-left"
                      sizes="(max-width: 768px) 90vw, 420px"
                    />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <Badge className="rounded-md bg-primary text-primary-foreground">维界</Badge>
                    <span className="text-sm font-medium text-muted-foreground">新加坡留学生活，一站到位。</span>
                  </div>
                  <h1 className="mt-6 font-headline text-4xl font-bold leading-tight text-foreground md:text-5xl">
                    新加坡留学生活系统
                  </h1>
                  <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                    租房、学校、美食、活动与本地生活信息，帮助中国留学生快速适应新加坡。
                  </p>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                    维界把留学生真正需要的内容整理成清晰、可信、可持续使用的平台。从租房，到学校，再到生活与社交，帮助你更轻松地开始在新加坡的每一天。
                  </p>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Button asChild size="lg">
                      <Link href="/listings/new">
                        开始发布 <Plus className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                      <a href="#listings">
                        浏览房源 <Home className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
                <div className="border-t bg-muted/50 p-6 md:p-10 lg:border-l lg:border-t-0">
                  <p className="text-sm font-semibold uppercase tracking-wider text-primary">平台状态</p>
                  <p className="mt-4 text-lg leading-8 text-foreground">
                    维界诞生于留学生真实的生活需求。留学不只是学习，更是一种全新的生活方式。
                  </p>
                  <div className="mt-6 grid grid-cols-1 gap-4">
                    {[
                      ['房源', `${listings.length} 个已发布房源`],
                      ['认证', currentUser ? `已登录：${currentUser.displayName}` : '支持登录与注册'],
                      ['社区', '通过结构化信息与真实内容建立归属感'],
                    ].map(([title, body]) => (
                      <div key={title} className="rounded-2xl border bg-background p-5">
                        <p className="text-sm font-semibold text-foreground">{title}</p>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="home-intro-section mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-3xl border bg-card p-6 shadow-sm md:p-8">
                <Badge variant="secondary" className="rounded-md">关于维界</Badge>
                <h2 className="mt-5 font-headline text-3xl font-bold text-foreground">连接留学生活的每一步</h2>
                <p className="mt-5 text-base leading-7 text-muted-foreground">
                  维界诞生于留学生真实的生活需求。我们相信，留学不只是学习，更是一种全新的生活方式。
                </p>
                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  维界希望通过结构化的信息与真实的社区内容，让每一位来到新加坡的中国学生，都能更快找到归属感。
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  {
                    title: '租房',
                    body: '查看真实房源、学生公寓与合租信息，快速找到适合自己的住所。',
                    href: '#listings',
                    icon: Home,
                  },
                  {
                    title: '学校',
                    body: '了解新加坡高校、课程强度、生活体验与学生评价。',
                    href: '/schools',
                    icon: GraduationCap,
                  },
                  {
                    title: '美食',
                    body: '发现适合中国留学生口味的新加坡餐厅、食阁与平价美食。',
                    href: '/food',
                    icon: Utensils,
                  },
                  {
                    title: '活动',
                    body: '获取校园活动、聚会、兼职与本地社交信息。',
                    href: '/events',
                    icon: Calendar,
                  },
                ].map((module) => {
                  const Icon = module.icon;

                  return (
                    <Link key={module.title} href={module.href} className="group rounded-3xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="mt-4 font-headline text-xl font-bold text-foreground group-hover:text-primary">{module.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">{module.body}</p>
                    </Link>
                  );
                })}
              </div>
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
                  {listings.map((listing) => {
                    const isFavorited = Boolean(listing.favorites?.some((favorite) => favorite.user_id === currentUser?.id));
                    const imageUrl = listing.image_urls[0] || '/weijie-logo-wordmark.png';

                    return (
                      <Card key={listing.id} className="group overflow-hidden transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
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
                            <form action={toggleFavoriteAction}>
                              <input type="hidden" name="listing_id" value={listing.id} />
                              <input type="hidden" name="is_favorited" value={String(isFavorited)} />
                              <Button variant="outline" size="icon" aria-label={isFavorited ? '取消收藏' : '收藏房源'}>
                                <Heart className={isFavorited ? 'h-4 w-4 fill-primary text-primary' : 'h-4 w-4'} />
                              </Button>
                            </form>
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
            </section>

            <footer className="mt-10 border-t pt-6 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">维界 · 新加坡留学生活系统</p>
              <p className="mt-1">清晰、可信、本地化、结构化，面向长期使用而设计。</p>
            </footer>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
