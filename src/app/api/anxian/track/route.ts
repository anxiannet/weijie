import {NextResponse} from 'next/server';
import {trackAnxianEvent} from '@/lib/anxian/analytics';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    await trackAnxianEvent({
      anonymousId: typeof body.anonymousId === 'string' ? body.anonymousId : undefined,
      eventName: body.eventName,
      templateSlug: typeof body.templateSlug === 'string' ? body.templateSlug : undefined,
      generationId: typeof body.generationId === 'string' ? body.generationId : undefined,
      pagePath: typeof body.pagePath === 'string' ? body.pagePath : undefined,
      properties: body.properties && typeof body.properties === 'object' ? body.properties : {},
    });

    return NextResponse.json({ok: true});
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'track_failed',
      },
      {status: 500}
    );
  }
}
