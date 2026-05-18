import Link from 'next/link';
import {redirect} from 'next/navigation';
import {ArrowLeft} from 'lucide-react';
import {createPeopleRequestAction} from '@/app/actions';
import {SubmitButton} from '@/components/SubmitButton';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Textarea} from '@/components/ui/textarea';
import {PEOPLE_AREAS, PEOPLE_BUDDY_CATEGORIES} from '@/lib/people';
import {createSupabaseServerClient} from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function NewBuddyRequestPage({searchParams}: {searchParams: Promise<{error?: string}>}) {
  const {error} = await searchParams;
  const supabase = await createSupabaseServerClient();
  const {data: {user}} = supabase ? await supabase.auth.getUser() : {data: {user: null}};

  if (supabase && !user) {
    redirect('/auth?next=/people/new/buddy&message=登录后可以发布找搭子需求');
  }

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/people"><ArrowLeft className="h-4 w-4" /> 返回找人</Link>
        </Button>
        <Card>
          <CardHeader>
            <Badge className="w-fit rounded-md">找搭子</Badge>
            <CardTitle className="font-headline text-3xl">发布一次平等结伴需求</CardTitle>
          </CardHeader>
          <CardContent>
            {!supabase && <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">缺少 Supabase 环境变量。</div>}
            {error && <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}
            <form action={createPeopleRequestAction} className="space-y-8">
              <input type="hidden" name="mode" value="buddy" />
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>活动类型</Label>
                  <Select name="category" required>
                    <SelectTrigger><SelectValue placeholder="选择类型" /></SelectTrigger>
                    <SelectContent>{PEOPLE_BUDDY_CATEGORIES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>人数</Label>
                  <Input name="desired_count" inputMode="numeric" defaultValue="1" required />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>标题</Label>
                  <Input name="title" placeholder="例如：周五晚一起去 Bugis 吃火锅" required />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>描述</Label>
                  <Textarea name="description" rows={6} placeholder="说明计划、费用分摊方式、见面方式和希望同行的人。" required />
                </div>
                <div className="space-y-2">
                  <Label>区域</Label>
                  <Select name="location_area">
                    <SelectTrigger><SelectValue placeholder="选择区域" /></SelectTrigger>
                    <SelectContent>{PEOPLE_AREAS.map((area) => <SelectItem key={area} value={area}>{area}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>具体地点</Label>
                  <Input name="specific_location" placeholder="例如：Bugis Junction" />
                </div>
                <div className="space-y-2">
                  <Label>开始时间</Label>
                  <Input name="start_time" type="datetime-local" />
                </div>
                <div className="space-y-2">
                  <Label>结束时间</Label>
                  <Input name="end_time" type="datetime-local" />
                </div>
                <div className="space-y-2">
                  <Label>预算方式</Label>
                  <Select name="budget_type" defaultValue="aa">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aa">AA</SelectItem>
                      <SelectItem value="treat">我请客</SelectItem>
                      <SelectItem value="fixed">固定预算</SelectItem>
                      <SelectItem value="negotiable">可商量</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>预算金额</Label>
                  <Input name="budget_amount" inputMode="numeric" placeholder="可选，单位 SGD" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>对参与者要求</Label>
                  <Textarea name="requirements" rows={4} placeholder="例如：同校优先、女生优先、能准时到达。" />
                </div>
              </div>
              <SubmitButton idleText="发布找搭子" pendingText="发布中..." className="w-full" disabled={!supabase} />
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
