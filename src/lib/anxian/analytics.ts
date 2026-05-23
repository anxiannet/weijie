import {headers} from 'next/headers';
import {createSupabaseAdminClient} from '@/lib/supabase/server';

export type AnxianEventName =
  | 'page_view'
  | 'template_view'
  | 'upload_started'
  | 'preview_generated'
  | 'checkout_click'
  | 'payment_success'
  | 'hd_generated'
  | 'share_click';

type TrackEventInput = {
  anonymousId?: string;
  eventName: AnxianEventName;
  pagePath?: string;
  templateSlug?: string;
  generationId?: string;
  properties?: Record<string, unknown>;
};

function safeText(value: unknown, maxLength = 512) {
  if (typeof value !== 'string') return undefined;
  return value.slice(0, maxLength);
}

export async function trackAnxianEvent(input: TrackEventInput) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return {ok: false, reason: 'supabase_not_configured'};

  const headerStore = await headers();
  const referrer = safeText(headerStore.get('referer'));
  const userAgent = safeText(headerStore.get('user-agent'), 1024);
  let visitorId: string | null = null;

  if (input.anonymousId) {
    const {data: visitor} = await (supabase as any)
      .from('anx_visitors')
      .upsert(
        {
          anonymous_id: input.anonymousId,
          last_seen_at: new Date().toISOString(),
          first_referrer: referrer,
          user_agent_hash: userAgent ? String(userAgent.length) : null,
        },
        {onConflict: 'anonymous_id', ignoreDuplicates: false}
      )
      .select('id')
      .maybeSingle();

    visitorId = visitor?.id ?? null;
  }

  await (supabase as any).from('anx_event_logs').insert({
    visitor_id: visitorId,
    generation_id: input.generationId || null,
    event_name: input.eventName,
    page_path: input.pagePath || null,
    template_slug: input.templateSlug || null,
    referrer,
    properties: input.properties || {},
  });

  return {ok: true};
}

export async function createPreviewGeneration(input: {
  anonymousId?: string;
  templateSlug: string;
  inputPayload: Record<string, unknown>;
}) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return {ok: false as const, reason: 'supabase_not_configured'};

  let visitorId: string | null = null;
  if (input.anonymousId) {
    const {data: visitor} = await (supabase as any)
      .from('anx_visitors')
      .upsert(
        {
          anonymous_id: input.anonymousId,
          last_seen_at: new Date().toISOString(),
        },
        {onConflict: 'anonymous_id', ignoreDuplicates: false}
      )
      .select('id')
      .maybeSingle();
    visitorId = visitor?.id ?? null;
  }

  const {data, error} = await (supabase as any)
    .from('anx_generations')
    .insert({
      visitor_id: visitorId,
      template_slug: input.templateSlug,
      status: 'preview',
      mode: 'preview',
      input_payload: input.inputPayload,
      watermark: true,
      charged_cents: 0,
      api_cost_cents: 0,
    })
    .select('id')
    .single();

  if (error) {
    return {ok: false as const, reason: error.message};
  }

  await trackAnxianEvent({
    anonymousId: input.anonymousId,
    eventName: 'preview_generated',
    templateSlug: input.templateSlug,
    generationId: data.id,
    properties: {mode: 'preview'},
  });

  return {ok: true as const, generationId: data.id as string};
}
