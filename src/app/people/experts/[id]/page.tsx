import Image from 'next/image';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {ArrowLeft, CalendarClock, Flag, MapPin, MessageCircle, ShieldCheck, Star} from 'lucide-react';
import {reportPeopleContentAction} from '@/app/actions';
import {SubmitButton} from '@/components/SubmitButton';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {createSupabaseAdminClient, createSupabaseServerClient} from '@/lib/supabase/server';
import type {ExpertService, Review, UserProfile} from '@/lib/supabase/database.types';

export const dynamic = 'force-dynamic';

type ExpertDetail = ExpertService & {
  profiles?: {display_name: string | null; avatar_url: string | null} | null;
};

async function getExpertDetail(id: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return {service: null, userProfile: null as UserProfile | null, services: [] as ExpertService[], reviews: [] as Review[], configReady: false};
  }

  const readClient = createSupabaseAdminClient() || supabase;
  const {data: service, error} = await (readClient as any)
    .from('expert_services')
    .select('*, profiles!expert_services_provider_id_fkey(display_name, avatar_url)')
    .eq('id', id)
    .maybeSingle();

  if (error || !service) {
    return {service: null, userProfile: null, services: [] as ExpertService[], reviews: [] as Review[], configReady: true};
  }

  const [{data: userProfile}, {data: services}, {data: reviews}] = await Promise.all([
    (readClient as any).from('user_profiles').select('*').eq('user_id', service.provider_id).maybeSingle(),
    (readClient as any).from('expert_services').select('*').eq('provider_id', service.provider_id).in('status', ['active', 'pending_review']).order('created_at', {ascending: false}),
    (readClient as any).from('reviews').select('*').eq('target_user_id', service.provider_id).order('created_at', {ascending: false}).limit(8),
  ]);

  return {
    service: service as ExpertDetail,
    userProfile: userProfile as UserProfile | null,
    services: (services || []) as ExpertService[],
    reviews: (reviews || []) as Review[],
    configReady: true,
  };
}

export default async function ExpertDetailPage({params, searchParams}: {params: Promise<{id: string}>; searchParams?: Promise<Record<string, string | string[] | undefined>>}) {
  const {id} = await params;
  const query = searchParams ? await searchParams : {};
  const {service, userProfile, services, reviews, configReady} = await getExpertDetail(id);

  if (!configReady) {
    return <main className="min-h-screen bg-muted/40 p-8">缺少 Supabase 配置。</main>;
  }

  if (!service) notFound();

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/people?mode=service"><ArrowLeft className="h-4 w-4" /> 返回找达人</Link>
        </Button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-8">
            <section className="rounded-3xl border bg-card p-6 shadow-sm md:p-8">
              <div className="flex flex-wrap gap-2">
                <Badge className="rounded-md">{service.category}</Badge>
                <Badge variant="secondary" className="rounded-md">{service.status}</Badge>
                {userProfile?.is_verified && <Badge className="rounded-md"><ShieldCheck className="h-3 w-3" /> 已认证</Badge>}
              </div>
              <div className="mt-5 flex items-center gap-4">
                <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border bg-muted">
                  {(userProfile?.avatar_url || service.profiles?.avatar_url) ? (
                    <Image src={userProfile?.avatar_url || service.profiles?.avatar_url || ''} alt={userProfile?.nickname || service.profiles?.display_name || '维界达人'} fill unoptimized className="object-cover" sizes="64px" />
                  ) : null}
                </span>
                <div>
                  <h1 className="font-headline text-4xl font-bold leading-tight">{userProfile?.nickname || service.profiles?.display_name || '维界达人'}</h1>
                  <p className="mt-2 text-lg font-medium text-primary">{service.title}</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {service.service_area || '区域可商量'}</span>
                <span className="flex items-center gap-2"><Star className="h-4 w-4 text-primary" /> {Number(userProfile?.rating_avg || 0).toFixed(1)} · {userProfile?.rating_count || 0} 条评价</span>
              </div>
              <p className="mt-8 whitespace-pre-line text-base leading-8 text-muted-foreground">{service.description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {service.tags.map((tag) => <Badge key={tag} variant="outline" className="rounded-md">{tag}</Badge>)}
              </div>
              {service.proof_images.length > 0 && (
                <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {service.proof_images.slice(0, 4).map((image, index) => (
                    <div key={image} className="relative aspect-[4/3] overflow-hidden rounded-2xl border bg-muted">
                      <Image src={image} alt={`${service.title} 相关照片 ${index + 1}`} fill unoptimized className="object-cover" sizes="(max-width: 640px) 100vw, 420px" />
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="font-headline text-2xl font-bold">服务列表</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                {services.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-5">
                      <Badge variant="outline" className="rounded-md">{item.category}</Badge>
                      <h3 className="mt-3 font-semibold">{item.title}</h3>
                      <p className="mt-2 text-sm text-primary">{item.price_amount ? `S$${item.price_amount}` : '价格可商量'}</p>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-headline text-2xl font-bold">评分评价</h2>
              <Card className="mt-4">
                <CardContent className="space-y-4 p-5">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-0 last:pb-0">
                      <p className="font-medium">{review.rating} / 5</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{review.content || '用户未填写评价内容。'}</p>
                    </div>
                  ))}
                  {reviews.length === 0 && <p className="text-sm text-muted-foreground">暂无评价。</p>}
                </CardContent>
              </Card>
            </section>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">{service.price_amount ? `S$${service.price_amount}` : '价格可商量'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl bg-muted/50 p-4 text-sm leading-6 text-muted-foreground">
                  <p className="flex items-center gap-2 font-medium text-foreground"><CalendarClock className="h-4 w-4" /> 可服务时间</p>
                  <p className="mt-2">{service.available_times.length > 0 ? service.available_times.join('、') : '可商量'}</p>
                </div>
                <Button asChild className="w-full">
                  <Link href={`/people/new/service?provider=${service.provider_id}`}>
                    <MessageCircle className="h-4 w-4" /> 发布需求联系
                  </Link>
                </Button>
                {query.submitted && <p className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm text-primary">服务已提交审核。</p>}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2">
                  <Flag className="h-4 w-4 text-primary" />
                  <p className="font-semibold">举报服务</p>
                </div>
                <form action={reportPeopleContentAction} className="mt-4 space-y-3">
                  <input type="hidden" name="target_type" value="expert_service" />
                  <input type="hidden" name="target_id" value={service.id} />
                  <input type="hidden" name="redirect_to" value={`/people/experts/${service.id}`} />
                  <Label htmlFor="reason">原因</Label>
                  <Input id="reason" name="reason" placeholder="例如：资质不实、诱导站外交易" required />
                  <SubmitButton idleText="提交举报" pendingText="提交中..." variant="outline" className="w-full" />
                </form>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}
