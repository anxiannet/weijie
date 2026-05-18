'use server';

import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {createSupabaseAdminClient, createSupabaseServerClient} from '@/lib/supabase/server';
import {AMENITY_OPTIONS, parsePositiveNumber} from '@/lib/marketplace';
import {
  matchScore,
  parsePeopleAmount,
  toArrayFromText,
} from '@/lib/people';
import type {ExpertPriceType, ExpertServiceStatus, ListingType, PeopleBudgetType, PeopleRequestMode, PeopleRequestStatus} from '@/lib/supabase/database.types';
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

async function ensureUserProfile(user: Awaited<ReturnType<typeof requireUser>>['user']) {
  const adminClient = createSupabaseAdminClient();

  if (!adminClient) {
    return;
  }

  const nickname =
    typeof user.user_metadata?.display_name === 'string' && user.user_metadata.display_name.trim()
      ? user.user_metadata.display_name.trim()
      : user.email?.split('@')[0] || '维界用户';

  await (adminClient as any)
    .from('user_profiles')
    .upsert({user_id: user.id, nickname}, {onConflict: 'user_id', ignoreDuplicates: true});
}

function toOptionalString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function toOptionalDateTime(formData: FormData, key: string) {
  const value = toOptionalString(formData, key);
  return value ? new Date(value).toISOString() : null;
}

function getPeopleRequestPayload(formData: FormData, mode: PeopleRequestMode) {
  const desiredCount = Number(formData.get('desired_count') || 1);

  return {
    mode,
    category: requireString(formData, 'category'),
    title: requireString(formData, 'title'),
    description: requireString(formData, 'description'),
    location_area: toOptionalString(formData, 'location_area'),
    specific_location: toOptionalString(formData, 'specific_location'),
    start_time: toOptionalDateTime(formData, 'start_time'),
    end_time: toOptionalDateTime(formData, 'end_time'),
    budget_type: requireString(formData, 'budget_type') as PeopleBudgetType,
    budget_amount: parsePeopleAmount(formData.get('budget_amount')),
    desired_count: Number.isFinite(desiredCount) && desiredCount > 0 ? desiredCount : 1,
    requirements: toOptionalString(formData, 'requirements'),
  };
}

async function generateMatchesForRequest(writeClient: any, request: any) {
  const {data: services} = request.mode === 'service'
    ? await writeClient
      .from('expert_services')
      .select('*')
      .eq('status', 'active')
      .eq('category', request.category)
      .neq('provider_id', request.creator_id)
      .limit(24)
    : {data: null};

  const {data: profiles} = request.mode === 'buddy'
    ? await writeClient
      .from('user_profiles')
      .select('*')
      .neq('user_id', request.creator_id)
      .limit(24)
    : {data: null};

  const providerIds = request.mode === 'service' ? (services || []).map((service: any) => service.provider_id) : [];
  const {data: serviceProfiles} = providerIds.length > 0
    ? await writeClient.from('user_profiles').select('*').in('user_id', providerIds)
    : {data: []};
  const profileByUserId = new Map<string, any>((serviceProfiles || []).map((profile: any) => [profile.user_id, profile]));

  const candidates = request.mode === 'service'
    ? (services || []).map((service: any) => {
      const profile = profileByUserId.get(service.provider_id);
      return {
        request_id: request.id,
        matched_user_id: service.provider_id,
        match_score: matchScore({request, profile, service}),
        status: 'suggested',
      };
    })
    : (profiles || []).map((profile: any) => ({
      request_id: request.id,
      matched_user_id: profile.user_id,
      match_score: matchScore({request, profile}),
      status: 'suggested',
    }));

  const topMatches = candidates
    .sort((a: any, b: any) => b.match_score - a.match_score)
    .slice(0, 5);

  if (topMatches.length > 0) {
    await writeClient.from('matches').upsert(topMatches, {onConflict: 'request_id,matched_user_id'});
  }
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

export async function createPeopleRequestAction(formData: FormData) {
  const {supabase, user} = await requireUser();
  const writeClient = createSupabaseAdminClient() || supabase;
  const mode = requireString(formData, 'mode') as PeopleRequestMode;
  const redirectPrefix = mode === 'service' ? '/people/new/service' : '/people/new/buddy';
  let requestId: string | null = null;
  let actionError: string | null = null;

  try {
    await ensureProfile(user);
    await ensureUserProfile(user);

    const payload = getPeopleRequestPayload(formData, mode);
    const {data, error} = await (writeClient as any)
      .from('people_requests')
      .insert({
        creator_id: user.id,
        ...payload,
        status: 'open',
      })
      .select('*')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    requestId = data.id;
    await generateMatchesForRequest(writeClient as any, data);
  } catch (error) {
    actionError = toActionErrorMessage(error);
  }

  if (actionError) {
    redirect(`${redirectPrefix}?error=${encodeURIComponent(actionError)}`);
  }

  revalidatePath('/people');
  redirect(`/people/requests/${requestId}`);
}

export async function createExpertServiceAction(formData: FormData) {
  const {supabase, user} = await requireUser();
  const writeClient = createSupabaseAdminClient() || supabase;
  let serviceId: string | null = null;
  let actionError: string | null = null;

  try {
    await ensureProfile(user);
    await ensureUserProfile(user);

    const {data, error} = await (writeClient as any)
      .from('expert_services')
      .insert({
        provider_id: user.id,
        category: requireString(formData, 'category'),
        title: requireString(formData, 'title'),
        description: requireString(formData, 'description'),
        price_type: requireString(formData, 'price_type') as ExpertPriceType,
        price_amount: parsePeopleAmount(formData.get('price_amount')),
        service_area: toOptionalString(formData, 'service_area'),
        available_times: toArrayFromText(formData.get('available_times')),
        tags: toArrayFromText(formData.get('tags')),
        proof_images: toArrayFromText(formData.get('proof_images')),
        status: 'pending_review',
      })
      .select('id')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    serviceId = data.id;
  } catch (error) {
    actionError = toActionErrorMessage(error);
  }

  if (actionError) {
    redirect(`/people/services/new?error=${encodeURIComponent(actionError)}`);
  }

  revalidatePath('/people');
  redirect(`/people/experts/${serviceId}?submitted=1`);
}

export async function applyPeopleRequestAction(formData: FormData) {
  const {supabase, user} = await requireUser();
  const writeClient = createSupabaseAdminClient() || supabase;
  const requestId = requireString(formData, 'request_id');
  let actionError: string | null = null;

  try {
    await ensureProfile(user);
    await ensureUserProfile(user);

    const {data: request, error: requestError} = await (writeClient as any)
      .from('people_requests')
      .select('*')
      .eq('id', requestId)
      .maybeSingle();

    if (requestError) {
      throw new Error(requestError.message);
    }

    if (!request || request.status !== 'open') {
      throw new Error('这条需求暂时不能报名或接单');
    }

    if (request.creator_id === user.id) {
      throw new Error('不能报名自己发布的需求');
    }

    const message = toOptionalString(formData, 'message');
    const {data: profile} = await (writeClient as any).from('user_profiles').select('*').eq('user_id', user.id).maybeSingle();
    const score = matchScore({request, profile});

    const {error} = await (writeClient as any)
      .from('matches')
      .upsert({
        request_id: requestId,
        matched_user_id: user.id,
        match_score: score,
        status: 'applied',
        message,
      }, {onConflict: 'request_id,matched_user_id'});

    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    actionError = toActionErrorMessage(error);
  }

  revalidatePath(`/people/requests/${requestId}`);

  if (actionError) {
    redirect(`/people/requests/${requestId}?error=${encodeURIComponent(actionError)}`);
  }

  redirect(`/people/requests/${requestId}?applied=1`);
}

export async function createPeopleConversationAction(formData: FormData) {
  const {supabase, user} = await requireUser();
  const writeClient = createSupabaseAdminClient() || supabase;
  const requestId = requireString(formData, 'request_id');
  const targetUserId = requireString(formData, 'target_user_id');
  let actionError: string | null = null;

  try {
    if (targetUserId === user.id) {
      throw new Error('不能给自己发起私信');
    }

    const {data: request, error: requestError} = await (writeClient as any)
      .from('people_requests')
      .select('id, status')
      .eq('id', requestId)
      .maybeSingle();

    if (requestError) {
      throw new Error(requestError.message);
    }

    if (!request || request.status !== 'open') {
      throw new Error('这条需求暂时不能发起联系');
    }

    const {error} = await (writeClient as any)
      .from('conversations')
      .insert({
        request_id: requestId,
        user_a_id: user.id,
        user_b_id: targetUserId,
        status: 'open',
      });

    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    actionError = toActionErrorMessage(error);
  }

  if (actionError) {
    redirect(`/people/requests/${requestId}?error=${encodeURIComponent(actionError)}`);
  }

  redirect(`/people/requests/${requestId}?contact=1`);
}

export async function reportPeopleContentAction(formData: FormData) {
  const {supabase, user} = await requireUser();
  const writeClient = createSupabaseAdminClient() || supabase;
  const targetType = requireString(formData, 'target_type');
  const targetId = requireString(formData, 'target_id');
  const redirectTo = requireString(formData, 'redirect_to');

  await (writeClient as any).from('reports').insert({
    reporter_id: user.id,
    target_type: targetType,
    target_id: targetId,
    reason: requireString(formData, 'reason'),
    status: 'open',
  });

  redirect(`${redirectTo}?reported=1`);
}

export async function updatePeopleRequestStatusAction(formData: FormData) {
  const {supabase} = await requireUser();
  const writeClient = createSupabaseAdminClient() || supabase;
  const requestId = requireString(formData, 'request_id');
  const status = requireString(formData, 'status') as PeopleRequestStatus;

  await (writeClient as any).from('people_requests').update({status}).eq('id', requestId);
  revalidatePath('/admin/people');
  revalidatePath(`/people/requests/${requestId}`);
}

export async function deletePeopleRequestAction(formData: FormData) {
  const {supabase} = await requireUser();
  const writeClient = createSupabaseAdminClient() || supabase;
  const requestId = requireString(formData, 'request_id');

  await (writeClient as any).from('people_requests').delete().eq('id', requestId);
  revalidatePath('/admin/people');
  revalidatePath('/people');
}

export async function updateExpertServiceStatusAction(formData: FormData) {
  const {supabase} = await requireUser();
  const writeClient = createSupabaseAdminClient() || supabase;
  const serviceId = requireString(formData, 'service_id');
  const status = requireString(formData, 'status') as ExpertServiceStatus;

  await (writeClient as any).from('expert_services').update({status}).eq('id', serviceId);
  revalidatePath('/admin/people');
  revalidatePath('/people');
  revalidatePath(`/people/experts/${serviceId}`);
}
