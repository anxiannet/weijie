create extension if not exists pgcrypto;

do $$ begin
  create type public.listing_status as enum ('draft', 'published', 'archived');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.listing_type as enum ('room', 'whole_unit', 'student_apartment');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 4 and 120),
  description text not null check (char_length(description) between 20 and 4000),
  location text not null,
  nearest_school text,
  mrt_station text,
  price_sgd integer not null check (price_sgd > 0),
  bedrooms integer check (bedrooms >= 0),
  bathrooms integer check (bathrooms >= 0),
  listing_type public.listing_type not null default 'room',
  available_from date,
  image_urls text[] not null default '{}',
  amenities text[] not null default '{}',
  status public.listing_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  parent_id uuid references public.comments(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 1200),
  created_at timestamptz not null default now()
);

alter table public.comments
  add column if not exists parent_id uuid references public.comments(id) on delete cascade;

create index if not exists listings_status_created_idx on public.listings(status, created_at desc);
create index if not exists listings_school_idx on public.listings(nearest_school);
create index if not exists listings_price_idx on public.listings(price_sgd);
create index if not exists comments_listing_created_idx on public.comments(listing_id, created_at desc);
create index if not exists comments_parent_created_idx on public.comments(parent_id, created_at asc);

create or replace function public.ensure_comment_parent_listing()
returns trigger
language plpgsql
as $$
begin
  if new.parent_id is null then
    return new;
  end if;

  if new.parent_id = new.id then
    raise exception 'comment cannot reply to itself';
  end if;

  if not exists (
    select 1 from public.comments parent
    where parent.id = new.parent_id
    and parent.listing_id = new.listing_id
  ) then
    raise exception 'comment parent must belong to the same listing';
  end if;

  return new;
end;
$$;

drop trigger if exists ensure_comment_parent_listing on public.comments;
create trigger ensure_comment_parent_listing
  before insert or update of parent_id, listing_id on public.comments
  for each row
  execute function public.ensure_comment_parent_listing();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.touch_listing_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists listings_touch_updated_at on public.listings;
create trigger listings_touch_updated_at
  before update on public.listings
  for each row execute function public.touch_listing_updated_at();

alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.favorites enable row level security;
alter table public.comments enable row level security;

drop policy if exists "Profiles are readable" on public.profiles;
create policy "Profiles are readable"
  on public.profiles for select
  using (true);

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Published listings are readable" on public.listings;
create policy "Published listings are readable"
  on public.listings for select
  using (status = 'published' or owner_id = auth.uid());

drop policy if exists "Users create own listings" on public.listings;
create policy "Users create own listings"
  on public.listings for insert
  with check (auth.uid() = owner_id);

drop policy if exists "Users update own listings" on public.listings;
create policy "Users update own listings"
  on public.listings for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

drop policy if exists "Users delete own listings" on public.listings;
create policy "Users delete own listings"
  on public.listings for delete
  using (auth.uid() = owner_id);

drop policy if exists "Favorites are readable by owner" on public.favorites;
create policy "Favorites are readable by owner"
  on public.favorites for select
  using (auth.uid() = user_id);

drop policy if exists "Users create own favorites" on public.favorites;
create policy "Users create own favorites"
  on public.favorites for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users delete own favorites" on public.favorites;
create policy "Users delete own favorites"
  on public.favorites for delete
  using (auth.uid() = user_id);

drop policy if exists "Comments are readable" on public.comments;
create policy "Comments are readable"
  on public.comments for select
  using (
    exists (
      select 1 from public.listings
      where listings.id = comments.listing_id
      and listings.status = 'published'
    )
  );

drop policy if exists "Users create own comments" on public.comments;
create policy "Users create own comments"
  on public.comments for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users delete own comments" on public.comments;
create policy "Users delete own comments"
  on public.comments for delete
  using (auth.uid() = user_id);
