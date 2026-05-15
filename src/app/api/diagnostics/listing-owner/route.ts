import {NextResponse} from 'next/server';
import {createSupabaseAdminClient, createSupabaseServerClient} from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function maskId(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  return `${value.slice(0, 8)}...${value.slice(-6)}`;
}

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  const listingId = searchParams.get('id');

  if (!listingId) {
    return NextResponse.json({error: '缺少 id 参数'}, {status: 400});
  }

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

  const readClient = createSupabaseAdminClient() || supabase;
  const {data: listing, error} = await (readClient as any)
    .from('listings')
    .select('id, owner_id, status, title')
    .eq('id', listingId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({error: error.message}, {status: 500});
  }

  return NextResponse.json({
    listingFound: Boolean(listing),
    currentUserId: maskId(user.id),
    ownerId: maskId(listing?.owner_id),
    ownerMatchesCurrentUser: Boolean(listing && String(listing.owner_id) === String(user.id)),
    status: listing?.status ?? null,
    title: listing?.title ?? null,
    usesAdminClient: Boolean(createSupabaseAdminClient()),
  });
}
