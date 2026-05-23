import {NextResponse} from 'next/server';
import {createSupabaseAdminClient} from '@/lib/supabase/server';
import {trackAnxianEvent} from '@/lib/anxian/analytics';

function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(image\/(png|jpeg|webp));base64,(.+)$/);
  if (!match) return null;

  return {
    mimeType: match[1],
    extension: match[2] === 'jpeg' ? 'jpg' : match[2],
    buffer: Buffer.from(match[3], 'base64'),
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const generationId = typeof body.generationId === 'string' ? body.generationId : '';
    const templateSlug = typeof body.templateSlug === 'string' ? body.templateSlug : 'unknown';
    const anonymousId = typeof body.anonymousId === 'string' ? body.anonymousId : undefined;
    const imageDataUrl = typeof body.imageDataUrl === 'string' ? body.imageDataUrl : '';

    if (!generationId || !imageDataUrl) {
      return NextResponse.json({ok: false, error: 'missing_generation_or_image'}, {status: 400});
    }

    const parsed = parseDataUrl(imageDataUrl);
    if (!parsed) {
      return NextResponse.json({ok: false, error: 'invalid_image_data_url'}, {status: 400});
    }

    const maxBytes = 6 * 1024 * 1024;
    if (parsed.buffer.byteLength > maxBytes) {
      return NextResponse.json({ok: false, error: 'image_too_large'}, {status: 413});
    }

    const supabase = createSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json({ok: false, error: 'supabase_not_configured'}, {status: 500});
    }

    const filePath = `previews/${templateSlug}/${generationId}.${parsed.extension}`;
    const {error: uploadError} = await supabase.storage
      .from('anx_outputs')
      .upload(filePath, parsed.buffer, {
        contentType: parsed.mimeType,
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json({ok: false, error: uploadError.message}, {status: 500});
    }

    const {data: publicUrlData} = supabase.storage.from('anx_outputs').getPublicUrl(filePath);
    const publicUrl = publicUrlData.publicUrl;

    await (supabase as any)
      .from('anx_generations')
      .update({
        preview_image_url: publicUrl,
        output_image_url: publicUrl,
        status: 'preview',
        watermark: true,
      })
      .eq('id', generationId);

    await trackAnxianEvent({
      anonymousId,
      eventName: 'share_click',
      templateSlug,
      generationId,
      properties: {action: 'preview_saved_to_storage'},
    });

    return NextResponse.json({ok: true, url: publicUrl});
  } catch (error) {
    return NextResponse.json(
      {ok: false, error: error instanceof Error ? error.message : 'save_preview_failed'},
      {status: 500}
    );
  }
}
