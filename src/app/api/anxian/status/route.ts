import {NextResponse} from 'next/server';
import {createSupabaseAdminClient} from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ok: false, error: 'database_unavailable'}, {status: 500});
  }

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [paymentsResult, generationsResult, eventsResult] = await Promise.all([
    (supabase as any)
      .from('anx_payments')
      .select('id,status,amount_cents,currency,provider,paid_at,created_at')
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

  const payments = paymentsResult.data || [];
  const generations = generationsResult.data || [];
  const events = eventsResult.data || [];

  return NextResponse.json(
    {
      ok: true,
      marker: 'anxian-business-status-2026-05-24-01',
      last24h: {
        paymentCount: payments.length,
        paidCount: payments.filter((item: any) => item.status === 'paid').length,
        pendingCount: payments.filter((item: any) => item.status === 'pending').length,
        revenueCents: payments
          .filter((item: any) => item.status === 'paid')
          .reduce((sum: number, item: any) => sum + Number(item.amount_cents || 0), 0),
        generationCount: generations.length,
        eventCount: events.length,
        previewCount: events.filter((item: any) => item.event_name === 'preview_generated').length,
        checkoutClickCount: events.filter((item: any) => item.event_name === 'checkout_click').length,
        downloadCount: events.filter((item: any) => item.event_name === 'share_click').length,
      },
      recent: {
        payments,
        generations,
        events,
      },
      checkedAt: new Date().toISOString(),
    },
    {headers: {'Cache-Control': 'no-store, max-age=0'}}
  );
}
