import Image from 'next/image';
import Link from 'next/link';
import {Award, CalendarDays, MapPin, Plus, Search, ShieldCheck, Users} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {StaticPageShell} from '@/components/StaticPageShell';
import {
  PEOPLE_AREAS,
  PEOPLE_BUDDY_CATEGORIES,
  PEOPLE_BUDGET_LABELS,
  PEOPLE_MODE_LABELS,
  PEOPLE_SERVICE_CATEGORIES,
  formatPeopleDate,
} from '@/lib/people';
import {createSupabaseAdminClient, createSupabaseServerClient} from '@/lib/supabase/server';
import type {ExpertService, PeopleRequestWithCreator, UserProfile} from '@/lib/supabase/database.types';

export const dynamic = 'force-dynamic';

type PeopleSearchParams = {
  mode?: string;
  category?: string;
  area?: string;
  budget?: string;
  verified?: string;
};

type ExpertServiceCard = ExpertService & {
  profiles?: {display_name: string | null; avatar_url: string | null} | null;
  userProfile?: Pick<UserProfile, 'nickname' | 'is_verified' | 'rating_avg' | 'rating_count' | 'location_area'> | null;
};

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

async function getPeopleData(filters: PeopleSearchParams) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return {requests: [] as PeopleRequestWithCreator[], services: [] as ExpertServiceCard[], configReady: false, schemaReady: false};
  }

  const readClient = createSupabaseAdminClient() || supabase;
  const mode = filters.mode === 'service' ? 'service' : 'buddy';
  let requestQuery = (readClient as any)
    .from('people_requests')
    .select('*, profiles!people_requests_creator_id_fkey(display_name, avatar_url)')
    .eq('status', 'open')
    .eq('mode', mode)
    .order('created_at', {ascending: false})
    .limit(18);

  if (filters.category && filters.category !== 'all') {
    requestQuery = requestQuery.eq('category', filters.category);
  }

  if (filters.area && filters.area !== 'all') {
    requestQuery = requestQuery.eq('location_area', filters.area);
  }

  if (filters.budget && filters.budget !== 'all') {
    requestQuery = requestQuery.eq('budget_type', filters.budget);
  }

  let serviceQuery = (readClient as any)
    .from('expert_services')
    .select('*, profiles!expert_services_provider_id_fkey(display_name, avatar_url)')
    .eq('status', 'active')
    .order('created_at', {ascending: false})
    .limit(12);

  if (filters.category && filters.category !== 'all') {
    serviceQuery = serviceQuery.eq('category', filters.category);
  }

  if (filters.area && filters.area !== 'all') {
    serviceQuery = serviceQuery.eq('service_area', filters.area);
  }

  const [{data: requests, error: requestError}, {data: services, error: serviceError}] = await Promise.all([requestQuery, serviceQuery]);

  if (requestError || serviceError) {
    return {requests: [] as PeopleRequestWithCreator[], services: [] as ExpertServiceCard[], configReady: true, schemaReady: false};
  }

  const providerIds = (services || []).map((service: ExpertServiceCard) => service.provider_id);
  const {data: userProfiles} = providerIds.length > 0
    ? await (readClient as any).from('user_profiles').select('user_id, nickname, is_verified, rating_avg, rating_count, location_area').in('user_id', providerIds)
    : {data: []};
  const profileByUser = new Map<string, Pick<UserProfile, 'nickname' | 'is_verified' | 'rating_avg' | 'rating_count' | 'location_area'>>(
    (userProfiles || []).map((profile: Pick<UserProfile, 'user_id' | 'nickname' | 'is_verified' | 'rating_avg' | 'rating_count' | 'location_area'>) => [profile.user_id, profile])
  );
  const hydratedServices = ((services || []) as ExpertServiceCard[])
    .map((service) => ({...service, userProfile: profileByUser.get(service.provider_id) || null}))
    .filter((service) => filters.verified !== 'true' || service.userProfile?.is_verified);

  return {
    requests: (requests || []) as PeopleRequestWithCreator[],
    services: hydratedServices,
    configReady: true,
    schemaReady: true,
  };
}

export default async function PeoplePage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) || {};
  const filters = {
    mode: getParam(params.mode) || 'buddy',
    category: getParam(params.category) || 'all',
    area: getParam(params.area) || 'all',
    budget: getParam(params.budget) || 'all',
    verified: getParam(params.verified) || 'false',
  };
  const mode = filters.mode === 'service' ? 'service' : 'buddy';
  const categories = mode === 'service' ? PEOPLE_SERVICE_CATEGORIES : PEOPLE_BUDDY_CATEGORIES;
  const {requests, services, configReady, schemaReady} = await getPeopleData(filters);

  return (
    <StaticPageShell active="people" breadcrumb="找人">
      <section className="rounded-3xl border bg-card p-6 shadow-sm md:p-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge className="rounded-md">找人</Badge>
            <h1 className="mt-4 font-headline text-4xl font-bold leading-tight md:text-5xl">找搭子，也找可靠达人</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
              把结伴、临时需求和本地服务放在同一个结构化入口。先站内沟通，再决定是否见面或预约。
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/people/new/buddy"><Plus className="h-4 w-4" /> 发布找搭子</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/people/new/service">发布找达人需求</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/people/services/new">成为达人</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mt-6 flex flex-wrap gap-2 border-b pb-6">
        <Button asChild variant={mode === 'buddy' ? 'default' : 'outline'}>
          <Link href="/people?mode=buddy">找搭子</Link>
        </Button>
        <Button asChild variant={mode === 'service' ? 'default' : 'outline'}>
          <Link href="/people?mode=service">找达人</Link>
        </Button>
      </div>

      <form className="mt-6 grid grid-cols-1 gap-3 rounded-2xl border bg-card p-4 shadow-sm md:grid-cols-[1fr_180px_180px_180px_160px_auto]">
        <input type="hidden" name="mode" value={mode} />
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="搜索会在后续版本接入" className="pl-9" disabled />
        </div>
        <Select name="category" defaultValue={filters.category}>
          <SelectTrigger><SelectValue placeholder="分类" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部分类</SelectItem>
            {categories.map((category) => <SelectItem key={category} value={category}>{category}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select name="area" defaultValue={filters.area}>
          <SelectTrigger><SelectValue placeholder="区域" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部区域</SelectItem>
            {PEOPLE_AREAS.map((area) => <SelectItem key={area} value={area}>{area}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select name="budget" defaultValue={filters.budget}>
          <SelectTrigger><SelectValue placeholder="预算" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部预算</SelectItem>
            <SelectItem value="aa">AA</SelectItem>
            <SelectItem value="treat">我请客</SelectItem>
            <SelectItem value="fixed">固定预算</SelectItem>
            <SelectItem value="negotiable">可商量</SelectItem>
          </SelectContent>
        </Select>
        <Select name="verified" defaultValue={filters.verified}>
          <SelectTrigger><SelectValue placeholder="认证" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="false">不限认证</SelectItem>
            <SelectItem value="true">只看认证</SelectItem>
          </SelectContent>
        </Select>
        <Button>筛选</Button>
      </form>

      {(!configReady || !schemaReady) && (
        <Card className="mt-8 border-amber-200 bg-amber-50 text-amber-950">
          <CardContent className="p-6">
            <p className="font-semibold">{configReady ? '需要初始化找人数据表' : '需要连接生产数据源'}</p>
            <p className="mt-2 text-sm leading-6">请执行 `supabase/migrations/002_people.sql` 后再使用找人模块。</p>
          </CardContent>
        </Card>
      )}

      <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <Badge variant="secondary" className="rounded-md">{PEOPLE_MODE_LABELS[mode]}</Badge>
              <h2 className="mt-3 font-headline text-3xl font-bold">最新发布</h2>
            </div>
            <p className="text-sm text-muted-foreground">{requests.length} 条需求</p>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            {requests.map((request) => (
              <Card key={request.id} className="group transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border bg-muted">
                        {request.profiles?.avatar_url ? (
                          <Image src={request.profiles.avatar_url} alt={request.profiles.display_name || '发布者'} fill unoptimized className="object-cover" sizes="40px" />
                        ) : null}
                      </span>
                      <div>
                        <Badge variant="outline" className="rounded-md">{request.category}</Badge>
                        <p className="mt-1 text-xs text-muted-foreground">{request.profiles?.display_name || '维界用户'}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="rounded-md">{PEOPLE_BUDGET_LABELS[request.budget_type]}</Badge>
                  </div>
                  <Link href={`/people/requests/${request.id}`} className="mt-4 block">
                    <h3 className="line-clamp-2 font-headline text-xl font-bold leading-tight group-hover:text-primary">{request.title}</h3>
                  </Link>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{request.description}</p>
                  <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" /> {formatPeopleDate(request.start_time)}</span>
                    <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {request.location_area || '地点待定'}</span>
                    <span className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> {request.desired_count} 人</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <aside className="space-y-5">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h2 className="font-headline text-xl font-bold">安全提醒</h2>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                夜间、陪玩、陪伴和线下见面场景建议优先选择公共地点，并通过站内私信确认细节。不要在公开描述中留下手机号或微信。
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-headline text-xl font-bold">推荐达人</h2>
                <Award className="h-5 w-5 text-primary" />
              </div>
              <div className="mt-4 space-y-4">
                {services.slice(0, 5).map((service) => (
                  <Link key={service.id} href={`/people/experts/${service.id}`} className="block rounded-2xl border p-4 transition-colors hover:border-primary/40">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-3">
                        <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border bg-muted">
                          {service.profiles?.avatar_url ? (
                            <Image src={service.profiles.avatar_url} alt={service.userProfile?.nickname || service.profiles.display_name || '达人'} fill unoptimized className="object-cover" sizes="44px" />
                          ) : null}
                        </span>
                        <div>
                          <p className="font-semibold leading-tight">{service.title}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{service.category} · {service.service_area || '区域可商量'}</p>
                        </div>
                      </div>
                      {service.userProfile?.is_verified && <Badge className="rounded-md">已认证</Badge>}
                    </div>
                    <p className="mt-2 text-sm text-primary">
                      {service.price_amount ? `S$${service.price_amount}` : '价格可商量'}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      评分 {Number(service.userProfile?.rating_avg || 0).toFixed(1)} · {service.userProfile?.rating_count || 0} 条评价
                    </p>
                  </Link>
                ))}
                {services.length === 0 && <p className="text-sm text-muted-foreground">暂无符合条件的达人服务。</p>}
              </div>
            </CardContent>
          </Card>
        </aside>
      </section>
    </StaticPageShell>
  );
}
