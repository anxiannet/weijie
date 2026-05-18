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
import {PEOPLE_AREAS, PEOPLE_SERVICE_CATEGORIES} from '@/lib/people';
import {createSupabaseServerClient} from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function NewServiceRequestPage({searchParams}: {searchParams: Promise<{error?: string}>}) {
  const {error} = await searchParams;
  const supabase = await createSupabaseServerClient();
  const {data: {user}} = supabase ? await supabase.auth.getUser() : {data: {user: null}};

  if (supabase && !user) {
    redirect('/auth?next=/people/new/service&message=登录后可以发布找达人需求');
  }

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/people?mode=service"><ArrowLeft className="h-4 w-4" /> 返回找人</Link>
        </Button>
        <Card>
          <CardHeader>
            <Badge className="w-fit rounded-md">找达人</Badge>
            <CardTitle className="font-headline text-3xl">发布一次服务需求</CardTitle>
          </CardHeader>
          <CardContent>
            {error && <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}
            <form action={createPeopleRequestAction} className="space-y-8">
              <input type="hidden" name="mode" value="service" />
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>服务类型</Label>
                  <Select name="category" required>
                    <SelectTrigger><SelectValue placeholder="选择服务" /></SelectTrigger>
                    <SelectContent>{PEOPLE_SERVICE_CATEGORIES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>预算方式</Label>
                  <Select name="budget_type" defaultValue="negotiable">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">固定预算</SelectItem>
                      <SelectItem value="negotiable">可商量</SelectItem>
                      <SelectItem value="aa">AA</SelectItem>
                      <SelectItem value="treat">我请客</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>标题</Label>
                  <Input name="title" placeholder="例如：周末需要 NUS 附近租房带看" required />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>需求描述</Label>
                  <Textarea name="description" rows={6} placeholder="说明你需要的服务、期望完成方式和注意事项。" required />
                </div>
                <div className="space-y-2">
                  <Label>地点</Label>
                  <Select name="location_area">
                    <SelectTrigger><SelectValue placeholder="选择区域" /></SelectTrigger>
                    <SelectContent>{PEOPLE_AREAS.map((area) => <SelectItem key={area} value={area}>{area}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>具体地点</Label>
                  <Input name="specific_location" placeholder="例如：Kent Ridge MRT" />
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
                  <Label>预算金额</Label>
                  <Input name="budget_amount" inputMode="numeric" placeholder="可选，单位 SGD" />
                </div>
                <div className="space-y-2">
                  <Label>需要人数</Label>
                  <Input name="desired_count" inputMode="numeric" defaultValue="1" required />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>语言 / 性别 / 经验要求</Label>
                  <Textarea name="requirements" rows={4} placeholder="例如：中文沟通、有租房经验、女生优先。" />
                </div>
              </div>
              <SubmitButton idleText="发布找达人需求" pendingText="发布中..." className="w-full" disabled={!supabase} />
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
