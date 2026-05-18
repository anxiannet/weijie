import Link from 'next/link';
import {notFound} from 'next/navigation';
import {ArrowLeft, CalendarDays, Flag, MapPin, MessageCircle, ShieldCheck, Users} from 'lucide-react';
import {applyPeopleRequestAction, createPeopleConversationAction, reportPeopleContentAction} from '@/app/actions';
import {SubmitButton} from '@/components/SubmitButton';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Progress} from '@/components/ui/progress';
import {Textarea} from '@/components/ui/textarea';
import {PEOPLE_BUDGET_LABELS, PEOPLE_MODE_LABELS, PEOPLE_SAFETY_CATEGORIES, formatPeopleDate} from '@/lib/people';
import {createSupabaseAdminClient, createSupabaseServerClient} from '@/lib/supabase/server';
import type {PeopleMatchWithUser, PeopleRequestWithCreator, UserProfile} from '@/lib/supabase/database.types';

export const dynamic = 'force-dynamic';

async function getRequestDetail(id: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return {request: null, matches: [] as PeopleMatchWithUser[], creatorProfile: null as UserProfile | null, userId: null, configReady: false};
  }

  const {data: {user}} = await supabase.auth.getUser();
  const readClient = createSupabaseAdminClient() || supabase;
  const {data: request, error} = await (readClient as any)
    .from('people_requests')
    .select('*, profiles!people_requests_creator_id_fkey(display_name, avatar_url)')
    .eq('id', id)
    .maybeSingle();

  if (error || !request) {
    return {request: null, matches: [] as PeopleMatchWithUser[], creatorProfile: null, userId: user?.id ?? null, configReady: true};
  }

  const [{data: matches}, {data: creatorProfile}] = await Promise.all([
    (readClient as any)
      .from('matches')
      .select('*, profiles!matches_matched_user_id_fkey(display_name, avatar_url)')
      .eq('request_id', id)
      .order('match_score', {ascending: false})
      .limit(5),
    (readClient as any)
      .from('user_profiles')
      .select('*')
      .eq('user_id', request.creator_id)
      .maybeSingle(),
  ]);

  return {
    request: request as PeopleRequestWithCreator,
    matches: (matches || []) as PeopleMatchWithUser[],
    creatorProfile: creatorProfile as UserProfile | null,
    userId: user?.id ?? null,
    configReady: true,
  };
}

export default async function PeopleRequestDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{id: string}>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const {id} = await params;
  const query = searchParams ? await searchParams : {};
  const {request, matches, creatorProfile, userId, configReady} = await getRequestDetail(id);

  if (!configReady) {
    return <main className="min-h-screen bg-muted/40 p-8">缺少 Supabase 配置。</main>;
  }

  if (!request) notFound();

  const isOwner = request.creator_id === userId;
  const canApply = Boolean(userId && !isOwner && request.status === 'open');
  const budgetText = `${PEOPLE_BUDGET_LABELS[request.budget_type]}${request.budget_amount ? ` · S$${request.budget_amount}` : ''}`;

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <Button asChild variant="ghost" className="mb-4">
          <Link href={`/people?mode=${request.mode}`}><ArrowLeft className="h-4 w-4" /> 返回找人</Link>
        </Button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <section className="rounded-3xl border bg-card p-6 shadow-sm md:p-8">
              <div className="flex flex-wrap gap-2">
                <Badge className="rounded-md">{PEOPLE_MODE_LABELS[request.mode]}</Badge>
                <Badge variant="outline" className="rounded-md">{request.category}</Badge>
                <Badge variant="secondary" className="rounded-md">{request.status}</Badge>
              </div>
              <h1 className="mt-5 font-headline text-4xl font-bold leading-tight">{request.title}</h1>
              <div className="mt-5 grid grid-cols-1 gap-3 text-sm text-muted-foreground md:grid-cols-2">
                <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" /> {formatPeopleDate(request.start_time)}</span>
                <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {request.location_area || '地点待定'}{request.specific_location ? ` · ${request.specific_location}` : ''}</span>
                <span className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> 需要 {request.desired_count} 人</span>
                <span className="font-medium text-primary">{budgetText}</span>
              </div>
              <p className="mt-8 whitespace-pre-line text-base leading-8 text-muted-foreground">{request.description}</p>
              {request.requirements && (
                <div className="mt-6 rounded-2xl border bg-muted/40 p-4">
                  <p className="font-medium">参与要求</p>
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">{request.requirements}</p>
                </div>
              )}
              {PEOPLE_SAFETY_CATEGORIES.has(request.category) && (
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
                  该类目涉及线下见面或陪伴场景。建议选择公共地点，提前告知朋友行程，并优先通过站内私信沟通。
                </div>
              )}
            </section>

            <section className="mt-8">
              <h2 className="font-headline text-2xl font-bold">推荐匹配</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                {matches.map((match) => (
                  <Card key={match.id}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold">{match.profiles?.display_name || '维界用户'}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{match.status}</p>
                        </div>
                        <Badge className="rounded-md">{match.match_score} 分</Badge>
                      </div>
                      <Progress value={match.match_score} className="mt-4" />
                      {userId && (
                        <form action={createPeopleConversationAction} className="mt-4">
                          <input type="hidden" name="request_id" value={request.id} />
                          <input type="hidden" name="target_user_id" value={match.matched_user_id} />
                          <Button variant="outline" size="sm" disabled={match.matched_user_id === userId}>
                            <MessageCircle className="h-4 w-4" /> 站内联系
                          </Button>
                        </form>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {matches.length === 0 && <p className="text-sm text-muted-foreground">暂无系统推荐。可以等待更多用户或达人加入。</p>}
              </div>
            </section>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">发布者</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl bg-muted/50 p-4">
                  <p className="font-semibold">{creatorProfile?.nickname || request.profiles?.display_name || '维界用户'}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{creatorProfile?.location_area || '区域未填写'}</p>
                  {creatorProfile?.is_verified && <Badge className="mt-3 rounded-md"><ShieldCheck className="h-3 w-3" /> 已认证</Badge>}
                </div>
                {query.error && <p className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{String(query.error)}</p>}
                {query.applied && <p className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm text-primary">已提交报名/接单。</p>}
                {canApply ? (
                  <form action={applyPeopleRequestAction} className="space-y-3">
                    <input type="hidden" name="request_id" value={request.id} />
                    <Textarea name="message" placeholder="简单说明你为什么适合参与或接单。" />
                    <SubmitButton idleText={request.mode === 'buddy' ? '报名参与' : '接单'} pendingText="提交中..." className="w-full" />
                  </form>
                ) : isOwner ? (
                  <div className="rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground">
                    这是你发布的需求。可以在后台或后续个人中心中关闭它。
                  </div>
                ) : request.status !== 'open' ? (
                  <div className="rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground">
                    这条需求已关闭或过期，不能继续报名。
                  </div>
                ) : (
                  <Button asChild className="w-full">
                    <Link href={`/auth?next=/people/requests/${request.id}&message=登录后可以报名或接单`}>登录后报名/接单</Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2">
                  <Flag className="h-4 w-4 text-primary" />
                  <p className="font-semibold">举报内容</p>
                </div>
                <form action={reportPeopleContentAction} className="mt-4 space-y-3">
                  <input type="hidden" name="target_type" value="people_request" />
                  <input type="hidden" name="target_id" value={request.id} />
                  <input type="hidden" name="redirect_to" value={`/people/requests/${request.id}`} />
                  <Label htmlFor="reason">原因</Label>
                  <Input id="reason" name="reason" placeholder="例如：信息不实、诱导站外联系" required />
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
