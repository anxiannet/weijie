import {BarChart3, CircleDollarSign, MousePointerClick, Sparkles, Users} from 'lucide-react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {createSupabaseAdminClient} from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

type FunnelRow = {
  metric_date: string;
  pageviews: number;
  visitors: number;
  template_views: number;
  previews: number;
  checkout_clicks: number;
};

type TemplatePerfRow = {
  template_slug: string;
  template_views: number;
  previews: number;
  checkout_clicks: number;
  unique_visitors: number;
};

type ProfitRow = {
  metric_date: string;
  paid_orders: number;
  revenue_cents: number;
  api_cost_cents: number;
  gross_profit_cents: number;
};

type RecentEvent = {
  id: number;
  event_name: string;
  page_path: string | null;
  template_slug: string | null;
  created_at: string;
};

function money(cents: number | string | null | undefined) {
  const value = Number(cents || 0);
  return `$${(value / 100).toFixed(2)}`;
}

function percent(part: number, total: number) {
  if (!total) return '0.0%';
  return `${((part / total) * 100).toFixed(1)}%`;
}

async function getDashboardData() {
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return {
      configured: false,
      funnel: [] as FunnelRow[],
      templates: [] as TemplatePerfRow[],
      profit: [] as ProfitRow[],
      recentEvents: [] as RecentEvent[],
    };
  }

  const [funnelResult, templateResult, profitResult, recentEventsResult] = await Promise.all([
    (supabase as any).from('anx_v_funnel_7d').select('*').limit(7),
    (supabase as any).from('anx_v_template_performance_30d').select('*').limit(20),
    (supabase as any).from('anx_v_profit_30d').select('*').limit(30),
    (supabase as any)
      .from('anx_event_logs')
      .select('id,event_name,page_path,template_slug,created_at')
      .order('created_at', {ascending: false})
      .limit(30),
  ]);

  return {
    configured: true,
    funnel: (funnelResult.data || []) as FunnelRow[],
    templates: (templateResult.data || []) as TemplatePerfRow[],
    profit: (profitResult.data || []) as ProfitRow[],
    recentEvents: (recentEventsResult.data || []) as RecentEvent[],
  };
}

export default async function AnxianAdminPage() {
  const data = await getDashboardData();

  const totals = data.funnel.reduce(
    (acc, row) => ({
      pageviews: acc.pageviews + Number(row.pageviews || 0),
      visitors: acc.visitors + Number(row.visitors || 0),
      templateViews: acc.templateViews + Number(row.template_views || 0),
      previews: acc.previews + Number(row.previews || 0),
      checkoutClicks: acc.checkoutClicks + Number(row.checkout_clicks || 0),
    }),
    {pageviews: 0, visitors: 0, templateViews: 0, previews: 0, checkoutClicks: 0}
  );

  const profitTotals = data.profit.reduce(
    (acc, row) => ({
      paidOrders: acc.paidOrders + Number(row.paid_orders || 0),
      revenueCents: acc.revenueCents + Number(row.revenue_cents || 0),
      apiCostCents: acc.apiCostCents + Number(row.api_cost_cents || 0),
      grossProfitCents: acc.grossProfitCents + Number(row.gross_profit_cents || 0),
    }),
    {paidOrders: 0, revenueCents: 0, apiCostCents: 0, grossProfitCents: 0}
  );

  return (
    <main className="min-h-screen bg-[#071412] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Badge className="bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20">
              anxian analytics
            </Badge>
            <h1 className="mt-4 text-4xl font-black tracking-tight">安线数据看板</h1>
            <p className="mt-2 text-white/60">
              判断项目方向只看数据：访问、预览、支付点击、收入、API成本、毛利润。
            </p>
          </div>
          <div className="text-sm text-white/40">/anxian/admin</div>
        </div>

        {!data.configured ? (
          <Card className="border-amber-400/20 bg-amber-400/10 text-amber-100">
            <CardContent className="p-6">Supabase admin key 未配置，无法读取后台数据。</CardContent>
          </Card>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <MetricCard icon={Users} label="7日访客" value={String(totals.visitors)} />
          <MetricCard icon={BarChart3} label="7日PV" value={String(totals.pageviews)} />
          <MetricCard icon={Sparkles} label="预览生成" value={String(totals.previews)} />
          <MetricCard icon={MousePointerClick} label="支付点击" value={String(totals.checkoutClicks)} />
          <MetricCard icon={CircleDollarSign} label="30日毛利" value={money(profitTotals.grossProfitCents)} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <Card className="border-white/10 bg-white/5 text-white">
            <CardHeader>
              <CardTitle>7日漏斗</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="text-white/40">
                  <tr>
                    <th className="py-3">日期</th>
                    <th>访客</th>
                    <th>PV</th>
                    <th>模板访问</th>
                    <th>预览</th>
                    <th>支付点击</th>
                    <th>预览率</th>
                    <th>支付点击率</th>
                  </tr>
                </thead>
                <tbody>
                  {data.funnel.map((row) => (
                    <tr key={row.metric_date} className="border-t border-white/10">
                      <td className="py-3 text-white/70">{row.metric_date}</td>
                      <td>{row.visitors}</td>
                      <td>{row.pageviews}</td>
                      <td>{row.template_views}</td>
                      <td>{row.previews}</td>
                      <td>{row.checkout_clicks}</td>
                      <td className="text-emerald-300">{percent(row.previews, row.template_views)}</td>
                      <td className="text-emerald-300">{percent(row.checkout_clicks, row.previews)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 text-white">
            <CardHeader>
              <CardTitle>30日利润</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-black/25 p-4">
                  <div className="text-white/40">订单</div>
                  <div className="mt-2 text-2xl font-bold">{profitTotals.paidOrders}</div>
                </div>
                <div className="rounded-2xl bg-black/25 p-4">
                  <div className="text-white/40">收入</div>
                  <div className="mt-2 text-2xl font-bold">{money(profitTotals.revenueCents)}</div>
                </div>
                <div className="rounded-2xl bg-black/25 p-4">
                  <div className="text-white/40">API成本</div>
                  <div className="mt-2 text-2xl font-bold">{money(profitTotals.apiCostCents)}</div>
                </div>
                <div className="rounded-2xl bg-black/25 p-4">
                  <div className="text-white/40">毛利</div>
                  <div className="mt-2 text-2xl font-bold text-emerald-300">
                    {money(profitTotals.grossProfitCents)}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-white/60">
                红线：API成本 / 收入 必须低于 20%。超过即降级模型、涨价或砍模板。
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>模板表现 30日</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-white/40">
                <tr>
                  <th className="py-3">模板</th>
                  <th>独立访客</th>
                  <th>模板访问</th>
                  <th>预览</th>
                  <th>支付点击</th>
                  <th>预览率</th>
                  <th>支付点击率</th>
                </tr>
              </thead>
              <tbody>
                {data.templates.map((row) => (
                  <tr key={row.template_slug} className="border-t border-white/10">
                    <td className="py-3 text-white/80">{row.template_slug}</td>
                    <td>{row.unique_visitors}</td>
                    <td>{row.template_views}</td>
                    <td>{row.previews}</td>
                    <td>{row.checkout_clicks}</td>
                    <td className="text-emerald-300">{percent(row.previews, row.template_views)}</td>
                    <td className="text-emerald-300">{percent(row.checkout_clicks, row.previews)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>最近事件</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.recentEvents.map((event) => (
              <div
                key={event.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-black/25 px-4 py-3 text-sm"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="bg-white/10 text-white/70 hover:bg-white/10">
                    {event.event_name}
                  </Badge>
                  <span className="text-white/70">{event.template_slug || event.page_path || '-'}</span>
                </div>
                <span className="text-white/35">{new Date(event.created_at).toLocaleString('zh-SG')}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: string;
}) {
  return (
    <Card className="border-white/10 bg-white/5 text-white">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="text-sm text-white/45">{label}</div>
          <Icon className="h-5 w-5 text-emerald-300" />
        </div>
        <div className="mt-4 text-3xl font-black">{value}</div>
      </CardContent>
    </Card>
  );
}
