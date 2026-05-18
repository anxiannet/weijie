import Link from 'next/link';
import {redirect} from 'next/navigation';
import {ArrowLeft} from 'lucide-react';
import {createExpertServiceAction} from '@/app/actions';
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

export default async function NewExpertServicePage({searchParams}: {searchParams: Promise<{error?: string}>}) {
  const {error} = await searchParams;
  const supabase = await createSupabaseServerClient();
  const {data: {user}} = supabase ? await supabase.auth.getUser() : {data: {user: null}};

  if (supabase && !user) {
    redirect('/auth?next=/people/services/new&message=登录后可以发布达人服务');
  }

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/people?mode=service"><ArrowLeft className="h-4 w-4" /> 返回找人</Link>
        </Button>
        <Card>
          <CardHeader>
            <Badge className="w-fit rounded-md">达人服务</Badge>
            <CardTitle className="font-headline text-3xl">发布可审核的服务信息</CardTitle>
          </CardHeader>
          <CardContent>
            {error && <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}
            <form action={createExpertServiceAction} className="space-y-8">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label>服务标题</Label>
                  <Input name="title" placeholder="例如：NUS / Clementi 租房带看与区域说明" required />
                </div>
                <div className="space-y-2">
                  <Label>服务分类</Label>
                  <Select name="category" required>
                    <SelectTrigger><SelectValue placeholder="选择服务" /></SelectTrigger>
                    <SelectContent>{PEOPLE_SERVICE_CATEGORIES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>服务区域</Label>
                  <Select name="service_area">
                    <SelectTrigger><SelectValue placeholder="选择区域" /></SelectTrigger>
                    <SelectContent>{PEOPLE_AREAS.map((area) => <SelectItem key={area} value={area}>{area}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>服务介绍</Label>
                  <Textarea name="description" rows={7} placeholder="说明服务范围、适合人群、交付方式和边界。" required />
                </div>
                <div className="space-y-2">
                  <Label>价格类型</Label>
                  <Select name="price_type" defaultValue="negotiable">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">按小时</SelectItem>
                      <SelectItem value="fixed">固定价格</SelectItem>
                      <SelectItem value="negotiable">可商量</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>价格金额</Label>
                  <Input name="price_amount" inputMode="numeric" placeholder="可选，单位 SGD" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>可服务时间</Label>
                  <Textarea name="available_times" rows={3} placeholder="每行一个时间段，例如：周末下午、工作日晚上、可商量" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>技能标签</Label>
                  <Input name="tags" placeholder="用逗号分隔，例如：中文沟通, 租房经验, 熟悉 NUS" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>证明图片链接</Label>
                  <Textarea name="proof_images" rows={3} placeholder="每行一个图片链接。后续可接入 R2 上传。" />
                </div>
              </div>
              <div className="rounded-xl border bg-muted/40 p-4 text-sm leading-6 text-muted-foreground">
                发布后默认进入 pending_review 状态，后台审核通过后才会出现在推荐达人中。
              </div>
              <SubmitButton idleText="提交审核" pendingText="提交中..." className="w-full" disabled={!supabase} />
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
