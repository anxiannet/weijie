import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {createSupabaseAdminClient} from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

function money(cents: number | string | null | undefined) {
  return `$${(Number(cents || 0) / 100).toFixed(2)}`;
}

async function getStatusData() {
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return {configured: false, payments: [], generations: [], events: []};
  }

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [paymentsResult, generationsResult, eventsResult] = await Promise.all([
    (supabase as any)
      .from('anx_payments')
      .select('id,status,amount_cents,currency,provider,provider_payment_id,paid_at,created_at')
      .gte('created_at', since)
      .order('created_at', {ascending: false})
      .limit(20),
    (supabase as any)
      .from('anx_generations')
      .select('id,status,template_slug,charged_cents,preview_image_url,output_image_url,created_at')
      .gte('created_at', since)
      .order('created_at', {ascending: false})
      .limit(20),
    (supabase as any)
      .from('anx_event_logs')
      .select('id,event_name,page_path,template_slug,created_at')
      .gte('created_at', since)
      .order('created_at', {ascending: false})
      .limit(30),
  ]);

  return {
    configured: true,
    payments: paymentsResult.data || [],
    generations: generationsResult.data || [],
    events: eventsResult.data || [],
  };
}

export default async function AnxianOperationalStatusPage() {
  const data = await getStatusData();
  const payments = data.payments as any[];
  const generations = data.generations as any[];
  const events = data.events as any[];
  const paid = payments.filter((item) => item.status === 'paid');
  const pending = payments.filter((item) => item.status === 'pending');
  const revenue = paid.reduce((sum, item) => sum + Number(item.amount_cents || 0), 0);

  return (
    <main className="min-h-screen bg-[#071412] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <Badge className="bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20">
            operational status
          </Badge>
          <h1 className="mt-4 text-4xl font-black">安线运行状态</h1>
          <p className="mt-2 text-white/60">最近 24 小时的支付、生成和事件。</p>
        </div>

        {!data.configured ? (
          <Card className="border-amber-400/20 bg-amber-400/10 text-amber-100">
            <CardContent className="p-6">Supabase admin key 未配置。</CardContent>
          </Card>
        ) : null}

        <section className="grid gap-4 md:grid-cols-4">
          <Metric label="支付记录" value={String(payments.length)} />
          <Metric label="已支付" value={String(paid.length)} />
          <Metric label="待支付" value={String(pending.length)} />
          <Metric label="24h收入" value={money(revenue)} />
        </section>

        <StatusTable
          title="最近支付"
          rows={payments.map((item) => [
            item.status,
            money(item.amount_cents),
            item.provider,
            item.provider_payment_id || '-',
            item.created_at,
          ])}
          headers={['状态', '金额', '渠道', 'Session', '时间']}
        />

        <StatusTable
          title="最近生成"
          rows={generations.map((item) => [
            item.status,
            item.template_slug || '-',
            money(item.charged_cents),
            item.output_image_url ? '有文件' : '无文件',
            item.created_at,
          ])}
          headers={['状态', '模板', '收费', '输出', '时间']}
        />

        <StatusTable
          title="最近事件"
          rows={events.map((item) => [
            item.event_name,
            item.template_slug || '-',
            item.page_path || '-',
            item.created_at,
          ])}
          headers={['事件', '模板', '路径', '时间']}
        />
      </div>
    </main>
  );
}

function Metric({label, value}: {label: string; value: string}) {
  return (
    <Card className="border-white/10 bg-white/5 text-white">
      <CardContent className="p-5">
        <div className="text-sm text-white/45">{label}</div>
        <div className="mt-3 text-3xl font-black">{value}</div>
      </CardContent>
    </Card>
  );
}

function StatusTable({title, headers, rows}: {title: string; headers: string[]; rows: string[][]}) {
  return (
    <Card className="border-white/10 bg-white/5 text-white">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-white/40">
            <tr>{headers.map((header) => <th key={header} className="py-3 pr-4">{header}</th>)}</tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td className="border-t border-white/10 py-4 text-white/45" colSpan={headers.length}>暂无数据</td></tr>
            ) : rows.map((row, index) => (
              <tr key={index} className="border-t border-white/10">
                {row.map((cell, cellIndex) => <td key={cellIndex} className="py-3 pr-4 text-white/75">{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
