'use server';

import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {createSupabaseAdminClient, createSupabaseServerClient} from '@/lib/supabase/server';
import {AMENITY_OPTIONS, parsePositiveNumber} from '@/lib/marketplace';
import type {ListingType} from '@/lib/supabase/database.types';
import {toAuthMessage} from '@/app/auth/auth-utils';

function requireString(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`缺少字段：${key}`);
  }
  return value.trim();
}

function toActionErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return '保存失败，请检查内容后重试';
}

function isMissingCommentParentColumnError(error: unknown) {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const message = 'message' in error ? String(error.message) : '';
  const code = 'code' in error ? String(error.code) : '';

  return code === '42703' || message.includes('comments.parent_id') || message.includes('parent_id');
}

function getListingFormPayload(formData: FormData) {
  const price = parsePositiveNumber(formData.get('price_sgd'));
  const title = requireString(formData, 'title');
  const description = requireString(formData, 'description');
  const location = requireString(formData, 'location');
  const listingType = requireString(formData, 'listing_type') as ListingType;
  const imageUrls = formData
    .getAll('image_urls')
    .map((value) => String(value).trim())
    .filter(Boolean);
  const selectedAmenities = AMENITY_OPTIONS.filter((amenity) => formData.get(`amenity:${amenity}`));

  if (!price) {
    throw new Error('租金必须大于 0');
  }

  return {
    title,
    description,
    location,
    nearest_school: String(formData.get('nearest_school') || '').trim() || null,
    mrt_station: String(formData.get('mrt_station') || '').trim() || null,
    price_sgd: price,
    bedrooms: parsePositiveNumber(formData.get('bedrooms')),
    bathrooms: parsePositiveNumber(formData.get('bathrooms')),
    listing_type: listingType,
    available_from: String(formData.get('available_from') || '').trim() || null,
    image_urls: imageUrls,
    amenities: selectedAmenities,
  };
}

async function requireUser() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    throw new Error('缺少 Supabase 配置');
  }

  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth');
  }

  return {supabase, user};
}

async function ensureProfile(user: Awaited<ReturnType<typeof requireUser>>['user']) {
  const adminClient = createSupabaseAdminClient();

  if (!adminClient) {
    return;
  }

  const displayName =
    typeof user.user_metadata?.display_name === 'string' && user.user_metadata.display_name.trim()
      ? user.user_metadata.display_name.trim()
      : user.email?.split('@')[0] || '维界用户';

  await (adminClient as any)
    .from('profiles')
    .upsert({id: user.id, display_name: displayName}, {onConflict: 'id', ignoreDuplicates: true});
}

export async function signInAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    redirect('/auth?error=config');
  }

  const email = requireString(formData, 'email');
  const password = requireString(formData, 'password');
  const {error} = await supabase.auth.signInWithPassword({email, password});

  if (error) {
    redirect(`/auth?error=${encodeURIComponent(toAuthMessage(error.message))}`);
  }

  redirect('/');
}

export async function signUpAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    redirect('/auth?error=config');
  }

  const email = requireString(formData, 'email');
  const password = requireString(formData, 'password');
  const displayName = requireString(formData, 'display_name');
  const {error} = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  });

  if (error) {
    redirect(`/auth?error=${encodeURIComponent(toAuthMessage(error.message))}`);
  }

  redirect('/auth?message=请检查邮箱并完成验证');
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase?.auth.signOut();
  redirect('/');
}

export async function createListingAction(formData: FormData) {
  const {supabase, user} = await requireUser();
  const writeClient = createSupabaseAdminClient() || supabase;

  let listingId: string | null = null;
  let actionError: string | null = null;

  try {
    const payload = getListingFormPayload(formData);
    const {data, error} = await (writeClient as any)
      .from('listings')
      .insert({
        owner_id: user.id,
        ...payload,
        status: 'published',
      })
      .select('id')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    listingId = data.id;
  } catch (error) {
    actionError = toActionErrorMessage(error);
  }

  if (actionError) {
    redirect(`/listings/new?error=${encodeURIComponent(actionError)}`);
  }

  revalidatePath('/');
  redirect(`/listings/${listingId}`);
}

export async function updateListingAction(formData: FormData) {
  const {supabase, user} = await requireUser();
  const adminClient = createSupabaseAdminClient();
  const writeClient = adminClient || supabase;
  const readClient = adminClient || supabase;
  const listingId = requireString(formData, 'listing_id');
  let actionError: string | null = null;

  try {
    const payload = getListingFormPayload(formData);
    const {data: listing, error: listingError} = await (readClient as any)
      .from('listings')
      .select('id, owner_id')
      .eq('id', listingId)
      .maybeSingle();

    if (listingError) {
      throw new Error(listingError.message);
    }

    if (!listing) {
      throw new Error('没有找到这条房源');
    }

    if (String(listing.owner_id) !== String(user.id)) {
      throw new Error('只能修改自己发布的房源');
    }

    const {error} = await (writeClient as any)
      .from('listings')
      .update(payload)
      .eq('id', listingId)
      .eq('owner_id', user.id);

    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    actionError = toActionErrorMessage(error);
  }

  if (actionError) {
    redirect(`/listings/${listingId}/edit?error=${encodeURIComponent(actionError)}`);
  }

  revalidatePath('/');
  revalidatePath(`/listings/${listingId}`);
  revalidatePath(`/listings/${listingId}/edit`);
  redirect(`/listings/${listingId}`);
}

export async function toggleFavoriteAction(formData: FormData) {
  const {supabase, user} = await requireUser();
  const writeClient = createSupabaseAdminClient() || supabase;
  const listingId = requireString(formData, 'listing_id');
  const isFavorited = formData.get('is_favorited') === 'true';
  const redirectTo = String(formData.get('redirect_to') || '').trim();

  if (isFavorited) {
    const {error} = await (writeClient as any).from('favorites').delete().match({listing_id: listingId, user_id: user.id});

    if (error) {
      throw new Error(error.message);
    }
  } else {
    const {error} = await (writeClient as any).from('favorites').insert({listing_id: listingId, user_id: user.id});

    if (error && error.code !== '23505') {
      throw new Error(error.message);
    }
  }

  revalidatePath('/');
  revalidatePath('/favorites');
  revalidatePath(`/listings/${listingId}`);

  if (redirectTo) {
    redirect(redirectTo);
  }
}

export async function addCommentAction(formData: FormData) {
  const {supabase, user} = await requireUser();
  const adminClient = createSupabaseAdminClient();
  const writeClient = adminClient || supabase;
  const readClient = adminClient || supabase;
  const listingId = requireString(formData, 'listing_id');
  const body = requireString(formData, 'body');
  const parentValue = formData.get('parent_id');
  const parentCommentId = typeof parentValue === 'string' && parentValue ? parentValue : null;
  let actionError: string | null = null;
  let isRecentDuplicate = false;

  try {
    await ensureProfile(user);

    const {data: listing, error: listingError} = await (writeClient as any)
      .from('listings')
      .select('id, status')
      .eq('id', listingId)
      .maybeSingle();

    if (listingError) {
      throw new Error(listingError.message);
    }

    if (!listing || listing.status !== 'published') {
      throw new Error('这条房源暂时不能留言');
    }

    if (parentCommentId) {
      const {data: parentComment, error: parentCommentError} = await (readClient as any)
        .from('comments')
        .select('id, listing_id')
        .eq('id', parentCommentId)
        .eq('listing_id', listingId)
        .maybeSingle();

      if (parentCommentError) {
        throw new Error(parentCommentError.message);
      }

      if (!parentComment) {
        throw new Error('要回复的留言不存在');
      }
    }

    const duplicateWindowStart = new Date(Date.now() - 30_000).toISOString();
    let recentCommentQuery = (readClient as any)
      .from('comments')
      .select('id')
      .eq('listing_id', listingId)
      .eq('user_id', user.id)
      .eq('body', body)
      .gte('created_at', duplicateWindowStart);

    if (parentCommentId) {
      recentCommentQuery.eq('parent_id', parentCommentId);
    } else {
      recentCommentQuery.is('parent_id', null);
    }

    let {data: recentComment, error: recentCommentError} = await recentCommentQuery.maybeSingle();

    if (!parentCommentId && isMissingCommentParentColumnError(recentCommentError)) {
      recentCommentQuery = (readClient as any)
        .from('comments')
        .select('id')
        .eq('listing_id', listingId)
        .eq('user_id', user.id)
        .eq('body', body)
        .gte('created_at', duplicateWindowStart);

      const fallbackResult = await recentCommentQuery.maybeSingle();
      recentComment = fallbackResult.data;
      recentCommentError = fallbackResult.error;
    }

    if (recentCommentError) {
      throw new Error(recentCommentError.message);
    }

    if (recentComment) {
      isRecentDuplicate = true;
    } else {
      const commentPayload: {
        listing_id: string;
        user_id: string;
        body: string;
        parent_id?: string | null;
      } = {
        listing_id: listingId,
        user_id: user.id,
        body,
      };

      if (parentCommentId) {
        commentPayload.parent_id = parentCommentId;
      }

      let {error} = await (writeClient as any).from('comments').insert(commentPayload);

      if (!parentCommentId && isMissingCommentParentColumnError(error)) {
        const fallbackResult = await (writeClient as any).from('comments').insert({
          listing_id: listingId,
          user_id: user.id,
          body,
        });
        error = fallbackResult.error;
      }

      if (parentCommentId && isMissingCommentParentColumnError(error)) {
        throw new Error('数据库还没有执行留言回复迁移，请先在 Supabase 添加 comments.parent_id');
      }

      if (error) {
        throw new Error(error.message);
      }
    }
  } catch (error) {
    actionError = toActionErrorMessage(error);
  }

  revalidatePath(`/listings/${listingId}`);

  if (actionError) {
    redirect(`/listings/${listingId}?comment_error=${encodeURIComponent(actionError)}#comments`);
  }

  redirect(`/listings/${listingId}?comment=${isRecentDuplicate ? 'duplicate' : 'posted'}#comments`);
}
