import {NextResponse} from 'next/server';
import {createListingImageUploadUrl} from '@/lib/r2';
import {createSupabaseServerClient} from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({error: '缺少 Supabase 配置'}, {status: 500});
  }

  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({error: '请先登录'}, {status: 401});
  }

  const body = await request.json();
  const fileName = String(body.fileName || '');
  const contentType = String(body.contentType || '');

  if (!fileName || !contentType.startsWith('image/')) {
    return NextResponse.json({error: '只支持图片上传'}, {status: 400});
  }

  const signedUpload = await createListingImageUploadUrl({
    userId: user.id,
    fileName,
    contentType,
  });

  if (!signedUpload) {
    return NextResponse.json({error: '缺少 R2 配置'}, {status: 500});
  }

  return NextResponse.json(signedUpload);
}
