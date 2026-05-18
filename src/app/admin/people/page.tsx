import Link from 'next/link';
import {redirect} from 'next/navigation';
import {Check, Search, Trash2, X} from 'lucide-react';
import {deletePeopleRequestAction, updateExpertServiceStatusAction, updatePeopleRequestStatusAction} from '@/app/actions';
import {SubmitButton} from '@/components/SubmitButton';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {StaticPageShell} from '@/components/StaticPageShell';
import {createSupabaseAdminClient, createSupabaseServerClient} from '@/lib/supabase/server';
import type {ExpertService, PeopleRequest, Report} from '@/lib/supabase/database.types';

export const dynamic = 'force-dynamic';

async function getAdminPeopleData(q: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return {requests: [] as PeopleRequest[], services: [] as ExpertService[], reports: [] as Report[], configReady: false, schemaReady: false};
  }

  const {data: {user}} = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth?next=/admin/people&message=登录后可以进入后台管理');
  }

  const readClient = createSupabaseAdminClient() || supabase;
  let requestQuery = (readClient as any).from('people_requests').select('*').order('created_at', {ascending: false}).limit(50);
  if (q) {
    requestQuery = requestQuery.or(`title.ilike.%${q}%,description.ilike.%${q}%,category.ilike.%${q}%`);
  }

  const [requestResult, serviceResult, reportResult] = await Promise.all([
    requestQuery,
    (readClient as any).from('expert_services').select('*').order('created_at', {ascending: false}).limit(50),
    (readClient as any).from('reports').select('*').order('created_at', {ascending: false}).limit(50),
  ]);

  if (requestResult.error || serviceResult.error || reportResult.error) {
    return {requests: [], services: [], reports: [], configReady: true, schemaReady: false};
  }

  return {
    requests: (requestResult.data || []) as PeopleRequest[],
    services: (serviceResult.data || []) as ExpertService[],
    reports: (reportResult.data || []) as Report[],
    configReady: true,
    schemaReady: true,
  };
}

export default async function AdminPeoplePage({searchParams}: {searchParams?: Promise<Record<string, string | string[] | undefined>>}) {
  const params = searchParams ? await searchParams : {};
  const q = typeof params.q === 'string' ? params.q : '';
  const {requests, services, reports, configReady, schemaReady} = await getAdminPeopleData(q);

  return (
    <StaticPageShell active="people" breadcrumb="找人后台">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Badge className="rounded-md">后台管理</Badge>
          <h1 className="mt-4 font-headline text-4xl font-bold leading-tight">找人模块管理</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">用于 MVP 阶段的需求关闭、达人审核和举报查看。</p>
        </div>
        <Button asChild variant="outline"><Link href="/people">返回找人</Link></Button>
      </section>

      <form className="mt-6 grid grid-cols-1 gap-3 rounded-2xl border bg-card p-4 md:grid-cols-[1fr_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input name="q" defaultValue={q} placeholder="搜索标题、描述或分类" className="pl-9" />
        </div>
        <Button>搜索</Button>
      </form>

      {(!configReady || !schemaReady) && (
        <Card className="mt-8 border-amber-200 bg-amber-50 text-amber-950">
          <CardContent className="p-6">请先执行 `supabase/migrations/002_people.sql`。</CardContent>
        </Card>
      )}

      <section className="mt-8">
        <h2 className="font-headline text-2xl font-bold">找人需求管理</h2>
        <div className="mt-4 space-y-3">
          {requests.map((request) => (
            <Card key={request.id}>
              <CardContent className="grid grid-cols-1 gap-4 p-5 lg:grid-cols-[1fr_220px]">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="rounded-md">{request.mode}</Badge>
                    <Badge variant="secondary" className="rounded-md">{request.status}</Badge>
                    <Badge className="rounded-md">{request.category}</Badge>
                  </div>
                  <Link href={`/people/requests/${request.id}`} className="mt-3 block font-semibold hover:text-primary">{request.title}</Link>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{request.description}</p>
                </div>
                <div className="space-y-2">
                  <form action={updatePeopleRequestStatusAction} className="flex gap-2">
                    <input type="hidden" name="request_id" value={request.id} />
                    <Select name="status" defaultValue={request.status}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">open</SelectItem>
                        <SelectItem value="matched">matched</SelectItem>
                        <SelectItem value="closed">closed</SelectItem>
                        <SelectItem value="expired">expired</SelectItem>
                      </SelectContent>
                    </Select>
                    <SubmitButton idleText="更新" pendingText="..." size="sm" />
                  </form>
                  <form action={deletePeopleRequestAction}>
                    <input type="hidden" name="request_id" value={request.id} />
                    <Button variant="outline" size="sm" className="w-full"><Trash2 className="h-4 w-4" /> 删除</Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-headline text-2xl font-bold">达人服务审核</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {services.map((service) => (
            <Card key={service.id}>
              <CardContent className="p-5">
                <div className="flex flex-wrap gap-2">
                  <Badge className="rounded-md">{service.category}</Badge>
                  <Badge variant="secondary" className="rounded-md">{service.status}</Badge>
                </div>
                <Link href={`/people/experts/${service.id}`} className="mt-3 block font-semibold hover:text-primary">{service.title}</Link>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{service.description}</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <form action={updateExpertServiceStatusAction}>
                    <input type="hidden" name="service_id" value={service.id} />
                    <input type="hidden" name="status" value="active" />
                    <SubmitButton idleText="通过" pendingText="..." size="sm" className="w-full"><Check className="h-4 w-4" /></SubmitButton>
                  </form>
                  <form action={updateExpertServiceStatusAction}>
                    <input type="hidden" name="service_id" value={service.id} />
                    <input type="hidden" name="status" value="rejected" />
                    <Button variant="outline" size="sm" className="w-full"><X className="h-4 w-4" /> 拒绝</Button>
                  </form>
                  <form action={updateExpertServiceStatusAction}>
                    <input type="hidden" name="service_id" value={service.id} />
                    <input type="hidden" name="status" value="inactive" />
                    <Button variant="outline" size="sm" className="w-full">下架</Button>
                  </form>
                  <form action={updateExpertServiceStatusAction}>
                    <input type="hidden" name="service_id" value={service.id} />
                    <input type="hidden" name="status" value="pending_review" />
                    <Button variant="outline" size="sm" className="w-full">待审核</Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-headline text-2xl font-bold">举报管理</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardContent className="p-5">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="rounded-md">{report.target_type}</Badge>
                  <Badge variant="secondary" className="rounded-md">{report.status}</Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{report.reason}</p>
                <p className="mt-2 text-xs text-muted-foreground">{report.target_id}</p>
              </CardContent>
            </Card>
          ))}
          {reports.length === 0 && <p className="text-sm text-muted-foreground">暂无举报。</p>}
        </div>
      </section>
    </StaticPageShell>
  );
}
