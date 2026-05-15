import {NextResponse} from 'next/server';
import {uploadListingImage} from '@/lib/r2';
import {createSupabaseServerClient} from '@/lib/supabase/server';

const MAX_IMAGE_SIZE = 4 * 1024 * 1024;

export const runtime = 'nodejs';

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

  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({error: '请选择图片文件'}, {status: 400});
  }

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({error: '只支持图片上传'}, {status: 400});
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return NextResponse.json({error: '图片不能超过 4MB'}, {status: 400});
  }

  const uploadedImage = await uploadListingImage({
    userId: user.id,
    fileName: file.name,
    contentType: file.type,
    body: Buffer.from(await file.arrayBuffer()),
  });

  if (!uploadedImage) {
    return NextResponse.json({error: '缺少 R2 配置'}, {status: 500});
  }

  return NextResponse.json(uploadedImage);
}
