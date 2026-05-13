'use server';

import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {createSupabaseServerClient} from '@/lib/supabase/server';
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

  const {data, error} = await (supabase as any)
    .from('listings')
    .insert({
      owner_id: user.id,
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
      status: 'published',
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/');
  redirect(`/listings/${data.id}`);
}

export async function toggleFavoriteAction(formData: FormData) {
  const {supabase, user} = await requireUser();
  const listingId = requireString(formData, 'listing_id');
  const isFavorited = formData.get('is_favorited') === 'true';

  if (isFavorited) {
    await (supabase as any).from('favorites').delete().match({listing_id: listingId, user_id: user.id});
  } else {
    await (supabase as any).from('favorites').insert({listing_id: listingId, user_id: user.id});
  }

  revalidatePath('/');
  revalidatePath(`/listings/${listingId}`);
}

export async function addCommentAction(formData: FormData) {
  const {supabase, user} = await requireUser();
  const listingId = requireString(formData, 'listing_id');
  const body = requireString(formData, 'body');

  const {error} = await (supabase as any).from('comments').insert({
    listing_id: listingId,
    user_id: user.id,
    body,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/listings/${listingId}`);
}
