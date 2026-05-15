import {NextResponse} from 'next/server';
import {createSupabaseAdminClient, createSupabaseServerClient} from '@/lib/supabase/server';

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

  const body = await request.json().catch(() => null);
  const listingId = typeof body?.listingId === 'string' ? body.listingId.trim() : '';
  const isFavorited = body?.isFavorited === true;

  if (!listingId) {
    return NextResponse.json({error: '缺少房源 ID'}, {status: 400});
  }

  const writeClient = createSupabaseAdminClient() || supabase;

  if (isFavorited) {
    const {error} = await (writeClient as any).from('favorites').delete().match({listing_id: listingId, user_id: user.id});

    if (error) {
      return NextResponse.json({error: error.message}, {status: 500});
    }

    return NextResponse.json({isFavorited: false});
  }

  const {error} = await (writeClient as any).from('favorites').insert({listing_id: listingId, user_id: user.id});

  if (error && error.code !== '23505') {
    return NextResponse.json({error: error.message}, {status: 500});
  }

  return NextResponse.json({isFavorited: true});
}
