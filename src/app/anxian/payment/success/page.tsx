import Link from 'next/link';
import {CheckCircle2, Download, Home} from 'lucide-react';
import {createSupabaseAdminClient} from '@/lib/supabase/server';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';

export const dynamic = 'force-dynamic';

type StripeSession = {
  id: string;
  payment_status?: string;
  amount_total?: number;
  currency?: string;
  client_reference_id?: string;
  metadata?: {
    generation_id?: string;
    template_slug?: string;
    anonymous_id?: string;
  };
};

async function fetchStripeSession(sessionId: string) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return {ok: false as const, error: 'stripe_not_configured'};

  const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
    headers: {
      Authorization: `Bearer ${secretKey}`,
    },
    cache: 'no-store',
  });

  const data = (await response.json()) as StripeSession & {error?: {message?: string}};
  if (!response.ok) {
    return {ok: false as const, error: data.error?.message || 'stripe_session_fetch_failed'};
  }

  return {ok: true as const, session: data};
}

async function markPaid(session: StripeSession) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return null;

  const generationId = session.metadata?.generation_id || session.client_reference_id;
  if (!generationId || session.payment_status !== 'paid') return null;

  await (supabase as any)
    .from('anx_payments')
    .update({
      status: 'paid',
      paid_at: new Date().toISOString(),
      amount_cents: session.amount_total || 0,
      currency: (session.currency || 'sgd').toUpperCase(),
    })
    .eq('provider', 'stripe')
    .eq('provider_payment_id', session.id);

  await (supabase as any)
    .from('anx_generations')
    .update({
      status: 'paid',
      charged_cents: session.amount_total || 0,
      watermark: false,
    })
    .eq('id', generationId);

  const {data: generation} = await (supabase as any)
    .from('anx_generations')
    .select('id, output_image_url, preview_image_url, template_slug')
    .eq('id', generationId)
    .maybeSingle();

  return generation as {id: string; output_image_url?: string | null; preview_image_url?: string | null; template_slug?: string | null} | null;
}

export default async function AnxianPaymentSuccessPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) || {};
  const sessionIdValue = params.session_id;
  const sessionId = Array.isArray(sessionIdValue) ? sessionIdValue[0] : sessionIdValue;

  if (!sessionId) {
    return <PaymentShell title="缺少支付会话" message="没有找到 Stripe session_id。" />;
  }

  const sessionResult = await fetchStripeSession(sessionId);
  if (!sessionResult.ok) {
    return <PaymentShell title="支付确认失败" message={sessionResult.error} />;
  }

  const generation = await markPaid(sessionResult.session);
  const imageUrl = generation?.output_image_url || generation?.preview_image_url || null;

  return (
    <main className="min-h-screen bg-[#071412] px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl space-y-8">
        <Card className="border-emerald-400/20 bg-emerald-400/[0.06] text-white">
          <CardContent className="space-y-6 p-8 text-center">
            <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-300" />
            <div>
              <h1 className="text-4xl font-black">支付已确认</h1>
              <p className="mt-3 text-white/60">高清版本已解锁。当前版本先提供生成图下载，后续会升级为真正高清无水印渲染。</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              {imageUrl ? (
                <Button asChild className="bg-emerald-400 text-black hover:bg-emerald-300">
                  <a href={imageUrl} download target="_blank" rel="noreferrer">
                    <Download className="h-4 w-4" /> 下载图片
                  </a>
                </Button>
              ) : null}
              <Button asChild variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                <Link href="/anxian">
                  <Home className="h-4 w-4" /> 返回安线
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-sm text-white/45">
          session_id: {sessionId}
        </div>
      </div>
    </main>
  );
}

function PaymentShell({title, message}: {title: string; message: string}) {
  return (
    <main className="min-h-screen bg-[#071412] px-6 py-10 text-white">
      <div className="mx-auto max-w-2xl rounded-3xl border border-amber-400/20 bg-amber-400/10 p-8">
        <h1 className="text-3xl font-black text-amber-200">{title}</h1>
        <p className="mt-4 text-amber-100/75">{message}</p>
        <Button asChild className="mt-6 bg-amber-300 text-black hover:bg-amber-200">
          <Link href="/anxian">返回安线</Link>
        </Button>
      </div>
    </main>
  );
}
