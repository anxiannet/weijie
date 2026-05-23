import {NextResponse} from 'next/server';
import {createSupabaseAdminClient} from '@/lib/supabase/server';
import {trackAnxianEvent} from '@/lib/anxian/analytics';
import {getAnxianTemplate} from '@/lib/anxian/templates';

function getBaseUrl(request: Request) {
  const configured = process.env.ANXIAN_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/$/, '');

  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

export async function POST(request: Request) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ok: false, error: 'stripe_not_configured'}, {status: 500});
    }

    const body = await request.json();
    const generationId = typeof body.generationId === 'string' ? body.generationId : '';
    const templateSlug = typeof body.templateSlug === 'string' ? body.templateSlug : '';
    const anonymousId = typeof body.anonymousId === 'string' ? body.anonymousId : undefined;

    const template = getAnxianTemplate(templateSlug);
    if (!template) {
      return NextResponse.json({ok: false, error: 'template_not_found'}, {status: 404});
    }

    if (!generationId) {
      return NextResponse.json({ok: false, error: 'missing_generation_id'}, {status: 400});
    }

    const supabase = createSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json({ok: false, error: 'supabase_not_configured'}, {status: 500});
    }

    const baseUrl = getBaseUrl(request);
    const successUrl = `${baseUrl}/anxian/payment/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/anxian/${templateSlug}?checkout=cancelled`;

    const params = new URLSearchParams();
    params.set('mode', 'payment');
    params.set('success_url', successUrl);
    params.set('cancel_url', cancelUrl);
    params.set('client_reference_id', generationId);
    params.set('metadata[generation_id]', generationId);
    params.set('metadata[template_slug]', templateSlug);
    params.set('metadata[anonymous_id]', anonymousId || '');
    params.set('line_items[0][quantity]', '1');
    params.set('line_items[0][price_data][currency]', 'sgd');
    params.set('line_items[0][price_data][unit_amount]', String(template.priceCents));
    params.set('line_items[0][price_data][product_data][name]', `${template.name} 高清无水印版`);
    params.set('line_items[0][price_data][product_data][description]', 'Anxian generated high-resolution image download');

    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    const stripeData = await stripeResponse.json();
    if (!stripeResponse.ok) {
      return NextResponse.json(
        {ok: false, error: stripeData?.error?.message || 'stripe_checkout_failed'},
        {status: 500}
      );
    }

    await (supabase as any).from('anx_payments').insert({
      generation_id: generationId,
      provider: 'stripe',
      provider_payment_id: stripeData.id,
      status: 'pending',
      currency: 'SGD',
      amount_cents: template.priceCents,
      metadata: {
        templateSlug,
        checkoutUrl: stripeData.url,
      },
    });

    await (supabase as any)
      .from('anx_generations')
      .update({status: 'payment_required', charged_cents: template.priceCents})
      .eq('id', generationId);

    await trackAnxianEvent({
      anonymousId,
      eventName: 'checkout_click',
      templateSlug,
      generationId,
      properties: {provider: 'stripe', sessionId: stripeData.id, priceCents: template.priceCents},
    });

    return NextResponse.json({ok: true, url: stripeData.url, sessionId: stripeData.id});
  } catch (error) {
    return NextResponse.json(
      {ok: false, error: error instanceof Error ? error.message : 'checkout_failed'},
      {status: 500}
    );
  }
}
