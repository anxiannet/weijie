import {NextResponse} from 'next/server';
import {createPreviewGeneration, trackAnxianEvent} from '@/lib/anxian/analytics';
import {getAnxianTemplate} from '@/lib/anxian/templates';

function buildPreview(templateSlug: string, payload: Record<string, string>) {
  switch (templateSlug) {
    case 'wangzhe-team-poster':
      return {
        title: payload.team_name || '战队招募',
        lines: [
          payload.requirements || '有麦、能听指挥、心态好',
          payload.contact || '联系管理员报名',
        ],
      };

    case 'wechat-meme-card':
      return {
        title: payload.caption || '微信群梗图',
        lines: [payload.tone || '阴阳怪气', 'anxian.weijie.sg'],
      };

    case 'sg-room-xhs-cover':
      return {
        title: `${payload.location || '新加坡'} ${payload.price || ''}`.trim(),
        lines: [payload.room_type || '普通房', payload.contact || '联系房东'],
      };

    default:
      return {
        title: 'ANXIAN PREVIEW',
        lines: Object.values(payload).filter(Boolean).slice(0, 3),
      };
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const anonymousId = typeof body.anonymousId === 'string' ? body.anonymousId : undefined;
    const templateSlug = typeof body.templateSlug === 'string' ? body.templateSlug : '';
    const inputPayload = body.inputPayload && typeof body.inputPayload === 'object' ? body.inputPayload : {};

    const template = getAnxianTemplate(templateSlug);
    if (!template) {
      return NextResponse.json({ok: false, error: '模板不存在'}, {status: 404});
    }

    const generation = await createPreviewGeneration({
      anonymousId,
      templateSlug,
      inputPayload,
    });

    const preview = buildPreview(templateSlug, inputPayload);

    await trackAnxianEvent({
      anonymousId,
      eventName: 'template_view',
      templateSlug,
      pagePath: `/anxian/${templateSlug}`,
      generationId: generation.ok ? generation.generationId : undefined,
    });

    return NextResponse.json({
      ok: true,
      generationId: generation.ok ? generation.generationId : undefined,
      preview: {
        ...preview,
        watermark: 'anxian.weijie.sg · PREVIEW',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : '未知错误',
      },
      {status: 500}
    );
  }
}
