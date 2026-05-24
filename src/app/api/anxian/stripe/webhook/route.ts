import {NextResponse} from 'next/server';
import crypto from 'crypto';
import {createSupabaseAdminClient} from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

type StripeEvent = {
  id: string;
  type: string;
  data?: {
    object?: {
      id?: string;
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
  };
};

function verifyStripeSignature(payload: string, signature: string, secret: string) {
  const elements = signature.split(',');
  const timestamp = elements.find((item) => item.startsWith('t='))?.replace('t=', '');
  const v1 = elements.find((item) => item.startsWith('v1='))?.replace('v1=', '');

  if (!timestamp || !v1) return false;

  const signedPayload = `${timestamp}.${payload}`;

  const expected = crypto
    .createHmac('sha256', secret)
    .update(signedPayload, 'utf8')
    .digest('hex');

  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(v1));
  } catch {
    return false;
  }
}

async function markPaymentPaid(session: NonNullable<StripeEvent['data']>['object']) {
  if (!session?.id) return;

  const supabase = createSupabaseAdminClient();
  if (!supabase) return;

  const generationId = session.metadata?.generation_id || session.client_reference_id;

  await (supabase as any)
    .from('anx_payments')
    .update({
      status: 'paid',
      paid_at: new Date().toISOString(),
      amount_cents: session.amount_total || 0,
      currency: (session.currency || 'sgd').toUpperCase(),
      metadata: {
        stripePaymentStatus: session.payment_status,
        confirmedByWebhook: true,
      },
    })
    .eq('provider', 'stripe')
    .eq('provider_payment_id', session.id);

  if (generationId) {
    await (supabase as any)
      .from('anx_generations')
      .update({
        status: 'paid',
        charged_cents: session.amount_total || 0,
        watermark: false,
      })
      .eq('id', generationId);
  }
}

export async function POST(request: Request) {
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json({ok: false, error: 'missing_webhook_secret'}, {status: 500});
    }

    const signature = request.headers.get('stripe-signature');
    if (!signature) {
      return NextResponse.json({ok: false, error: 'missing_signature'}, {status: 400});
    }

    const rawBody = await request.text();

    const valid = verifyStripeSignature(rawBody, signature, webhookSecret);
    if (!valid) {
      return NextResponse.json({ok: false, error: 'invalid_signature'}, {status: 400});
    }

    const event = JSON.parse(rawBody) as StripeEvent;

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data?.object;
        if (session?.payment_status === 'paid') {
          await markPaymentPaid(session);
        }
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ok: true, received: true, type: event.type});
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'webhook_failed',
      },
      {status: 500}
    );
  }
}
